const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs/promises');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { validateProperty, validateInquiry, generateSlug } = require('./models/schema');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'shri_manibhadra_jwt_secret_2026';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// Helper functions
async function readJSON(filePath) {
  try {
    const data = await fs.readFile(path.join(__dirname, filePath), 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

async function writeJSON(filePath, data) {
  const fullPath = path.join(__dirname, filePath);
  const tmpPath = `${fullPath}.tmp`;
  await fs.writeFile(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
  await fs.rename(tmpPath, fullPath);
}

function generateId(prefix) {
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${prefix}-ujj-${randomStr}`;
}

// Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });
    req.user = user;
    next();
  });
}

function requireAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required.' });
  }
}

// Routes

// 3. AUTH ROUTES
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await readJSON('data/users.json') || [];
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
    
    const { passwordHash, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const users = await readJSON('data/users.json') || [];
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    
    const { passwordHash, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 4. PROPERTIES ROUTES
app.get('/api/properties', async (req, res) => {
  try {
    let properties = await readJSON('data/properties.json') || [];
    
    const { category, type, locality, status = 'active', featured, search } = req.query;
    
    if (status !== 'all') {
      properties = properties.filter(p => p.status === status);
    }
    
    if (category) properties = properties.filter(p => p.category === category);
    if (type) properties = properties.filter(p => p.type === type);
    if (locality) properties = properties.filter(p => p.locality === locality);
    if (featured === 'true') properties = properties.filter(p => p.isFeatured === true || p.featured === true);
    
    if (search) {
      const s = search.toLowerCase();
      properties = properties.filter(p => 
        (p.title && p.title.toLowerCase().includes(s)) ||
        (p.description && p.description.toLowerCase().includes(s)) ||
        (p.locality && p.locality.toLowerCase().includes(s))
      );
    }
    
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/properties/:id', async (req, res) => {
  try {
    const properties = await readJSON('data/properties.json') || [];
    const propertyIndex = properties.findIndex(p => p.id === req.params.id);
    
    if (propertyIndex === -1) {
      return res.status(404).json({ error: 'Property not found.' });
    }
    
    // Asynchronously update view count
    properties[propertyIndex].views = (properties[propertyIndex].views || 0) + 1;
    writeJSON('data/properties.json', properties).catch(console.error);

    res.json(properties[propertyIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/properties', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const validation = validateProperty(req.body);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.errors });
    }

    const properties = await readJSON('data/properties.json') || [];
    
    const newProperty = {
      id: generateId('prop'),
      slug: generateSlug(req.body.title),
      ...req.body,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    properties.push(newProperty);
    await writeJSON('data/properties.json', properties);
    
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/properties/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const properties = await readJSON('data/properties.json') || [];
    const propertyIndex = properties.findIndex(p => p.id === req.params.id);
    
    if (propertyIndex === -1) {
      return res.status(404).json({ error: 'Property not found.' });
    }
    
    const updatedProperty = {
      ...properties[propertyIndex],
      ...req.body,
      id: properties[propertyIndex].id, // don't allow changing ID
      slug: req.body.title ? generateSlug(req.body.title) : properties[propertyIndex].slug,
      updatedAt: new Date().toISOString()
    };
    
    properties[propertyIndex] = updatedProperty;
    await writeJSON('data/properties.json', properties);
    
    res.json(updatedProperty);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/properties/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    let properties = await readJSON('data/properties.json') || [];
    const initialLength = properties.length;
    properties = properties.filter(p => p.id !== req.params.id);
    
    if (properties.length === initialLength) {
      return res.status(404).json({ error: 'Property not found.' });
    }
    
    await writeJSON('data/properties.json', properties);
    res.json({ message: 'Property deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 5. INQUIRIES ROUTES
app.post('/api/inquiries', async (req, res) => {
  try {
    const validation = validateInquiry(req.body);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.errors });
    }

    const inquiries = await readJSON('data/inquiries.json') || [];
    const newInquiry = {
      id: generateId('inq'),
      ...req.body,
      status: 'new',
      timestamp: new Date().toISOString()
    };
    
    inquiries.push(newInquiry);
    await writeJSON('data/inquiries.json', inquiries);
    
    // Increment totalInquiries in analytics
    const analytics = await readJSON('data/analytics.json') || { totalViews: 0, dailyViews: {}, categoryViews: {}, totalInquiries: 0 };
    analytics.totalInquiries = (analytics.totalInquiries || 0) + 1;
    await writeJSON('data/analytics.json', analytics);
    
    res.status(201).json(newInquiry);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/inquiries', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const inquiries = await readJSON('data/inquiries.json') || [];
    inquiries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.patch('/api/inquiries/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });
    
    const inquiries = await readJSON('data/inquiries.json') || [];
    const inquiryIndex = inquiries.findIndex(i => i.id === req.params.id);
    
    if (inquiryIndex === -1) return res.status(404).json({ error: 'Inquiry not found' });
    
    inquiries[inquiryIndex].status = status;
    await writeJSON('data/inquiries.json', inquiries);
    
    res.json(inquiries[inquiryIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 6. ANALYTICS ROUTES
app.get('/api/analytics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const properties = await readJSON('data/properties.json') || [];
    const inquiries = await readJSON('data/inquiries.json') || [];
    const analytics = await readJSON('data/analytics.json') || { totalViews: 0, totalInquiries: 0, dailyViews: {}, categoryViews: {} };
    
    const totalProperties = properties.length;
    const activeProperties = properties.filter(p => p.status === 'active').length;
    const totalInquiries = analytics.totalInquiries || inquiries.length;
    const totalViews = analytics.totalViews || 0;
    const conversionRate = totalViews > 0 ? ((totalInquiries / totalViews) * 100).toFixed(2) : 0;
    
    inquiries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const recentInquiries = inquiries.slice(0, 5);
    
    res.json({
      totalProperties,
      activeProperties,
      totalInquiries,
      totalViews,
      conversionRate,
      dailyViews: analytics.dailyViews || {},
      categoryViews: analytics.categoryViews || {},
      recentInquiries
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/analytics/track-view', async (req, res) => {
  try {
    const { category } = req.body;
    const analytics = await readJSON('data/analytics.json') || { totalViews: 0, totalInquiries: 0, dailyViews: {}, categoryViews: {} };
    
    analytics.totalViews = (analytics.totalViews || 0) + 1;
    
    const today = new Date().toISOString().split('T')[0];
    if (!analytics.dailyViews) analytics.dailyViews = {};
    analytics.dailyViews[today] = (analytics.dailyViews[today] || 0) + 1;
    
    if (category) {
      if (!analytics.categoryViews) analytics.categoryViews = {};
      analytics.categoryViews[category] = (analytics.categoryViews[category] || 0) + 1;
    }
    
    await writeJSON('data/analytics.json', analytics);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 7. FALLBACK ROUTES
app.get('/properties', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'properties.html'));
});

app.get('/services', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'services.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
