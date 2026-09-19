/**
 * Shri Manibhadra Real Estate Brokers - Backend Schemas & Validators
 */

// Helper to format Indian Currency (INR)
function formatIndianCurrency(num) {
  if (!num || isNaN(num)) return '₹0';
  if (num >= 10000000) {
    const cr = (num / 10000000).toFixed(2);
    return `₹${cr.endsWith('.00') ? cr.slice(0, -3) : cr} Cr`;
  }
  if (num >= 100000) {
    const lk = (num / 100000).toFixed(2);
    return `₹${lk.endsWith('.00') ? lk.slice(0, -3) : lk} L`;
  }
  return `₹${Number(num).toLocaleString('en-IN')}`;
}

// Helper to format price per sq.ft
function calculatePricePerSqft(price, areaSqft) {
  if (!price || !areaSqft || areaSqft <= 0) return null;
  const rate = Math.round(price / areaSqft);
  return `₹${rate.toLocaleString('en-IN')}/sq.ft`;
}

// Generate unique slug from title
function generateSlug(title) {
  return (title || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Validates a Property payload
 * @param {Object} data 
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateProperty(data) {
  const errors = [];

  if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 5) {
    errors.push('Title is required and must be at least 5 characters');
  }

  const validCategories = ['residential', 'commercial', 'plots', 'luxury'];
  if (!data.category || !validCategories.includes(data.category)) {
    errors.push(`Category must be one of: ${validCategories.join(', ')}`);
  }

  const validTypes = ['Flat', 'Villa', 'Duplex', 'Shop', 'Office', 'Showroom', 'Plot', 'Land', 'Farmhouse'];
  if (!data.type || !validTypes.includes(data.type)) {
    errors.push(`Type must be one of: ${validTypes.join(', ')}`);
  }

  const price = Number(data.price);
  if (isNaN(price) || price <= 0) {
    errors.push('Price must be a positive number');
  }

  const areaSqft = Number(data.areaSqft);
  if (isNaN(areaSqft) || areaSqft <= 0) {
    errors.push('Area in sq.ft must be a positive number');
  }

  if (!data.locality || typeof data.locality !== 'string' || data.locality.trim().length < 2) {
    errors.push('Locality is required (e.g., Nanakheda, Freeganj)');
  }

  if (!data.coordinates || typeof data.coordinates !== 'object') {
    errors.push('Coordinates object with lat and lng is required');
  } else {
    const lat = Number(data.coordinates.lat);
    const lng = Number(data.coordinates.lng);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.push('Valid latitude between -90 and 90 is required');
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      errors.push('Valid longitude between -180 and 180 is required');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates an Inquiry / Lead payload
 * @param {Object} data 
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateInquiry(data) {
  const errors = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters');
  }

  if (!data.phone || typeof data.phone !== 'string' || data.phone.trim().replace(/\D/g, '').length < 10) {
    errors.push('A valid 10-digit phone number is required');
  }

  const validSources = ['whatsapp_click', 'web_form', 'call_click'];
  if (data.source && !validSources.includes(data.source)) {
    errors.push(`Source must be one of: ${validSources.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = {
  formatIndianCurrency,
  calculatePricePerSqft,
  generateSlug,
  validateProperty,
  validateInquiry
};
