// admin.js
document.addEventListener('DOMContentLoaded', () => {
    // Globals
    let propertiesData = [];
    let mapInstance = null;
    let markerInstance = null;
    let currentViewsChart = null;
    let currentCategoryChart = null;

    // UI Elements
    const views = document.querySelectorAll('.view-section');
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const logoutBtn = document.getElementById('logout-btn');
    const overlay = document.getElementById('loading-overlay');
    const toastEl = document.getElementById('toast');
    
    // Modal Elements
    const modal = document.getElementById('property-modal');
    const btnAddProperty = document.getElementById('btn-add-property');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnCancelModal = document.getElementById('btn-cancel-modal');
    const propertyForm = document.getElementById('property-form');

    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            const targetId = item.getAttribute('data-target');
            views.forEach(view => view.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
            
            // Reload data based on view
            if (targetId === 'view-dashboard') fetchDashboardData();
            if (targetId === 'view-properties') fetchProperties();
            if (targetId === 'view-inquiries') fetchInquiries();
        });
    });

    logoutBtn.addEventListener('click', Auth.handleLogout);

    // Initial Load
    fetchDashboardData();

    // --- UTILITIES ---
    function showLoading() { overlay.classList.add('active'); }
    function hideLoading() { overlay.classList.remove('active'); }
    
    function showToast(message, type = 'success') {
        toastEl.textContent = message;
        toastEl.className = `toast show ${type}`;
        setTimeout(() => toastEl.classList.remove('show'), 3000);
    }

    function formatDate(isoString) {
        return new Date(isoString).toLocaleDateString('en-IN', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute:'2-digit'
        });
    }

    function getBadgeClass(status) {
        return `badge badge-${status}`;
    }

    // --- DASHBOARD ---
    async function fetchDashboardData() {
        showLoading();
        try {
            const res = await Auth.authFetch('/api/analytics');
            if (res.ok) {
                const data = await res.json();
                renderMetricCards(data.metrics);
                renderViewsChart(data.charts.dailyViews);
                renderCategoryChart(data.charts.categoryViews);
                renderRecentInquiries(data.recentInquiries);
            }
        } catch (err) {
            console.error(err);
            showToast('Failed to load dashboard data', 'error');
        } finally {
            hideLoading();
        }
    }

    function renderMetricCards(metrics) {
        document.getElementById('kpi-properties').textContent = metrics.activeProperties || 0;
        document.getElementById('kpi-inquiries').textContent = metrics.totalInquiries || 0;
        document.getElementById('kpi-views').textContent = metrics.totalViews || 0;
        document.getElementById('kpi-conversion').textContent = metrics.conversionRate ? `${metrics.conversionRate}%` : '0%';
    }

    function renderViewsChart(dailyViews) {
        const ctx = document.getElementById('viewsChart').getContext('2d');
        if (currentViewsChart) currentViewsChart.destroy();
        
        currentViewsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dailyViews.map(d => d.date),
                datasets: [{
                    label: 'Views',
                    data: dailyViews.map(d => d.views),
                    borderColor: '#0B192C',
                    backgroundColor: 'rgba(201, 162, 75, 0.2)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    function renderCategoryChart(categoryViews) {
        const ctx = document.getElementById('categoryChart').getContext('2d');
        if (currentCategoryChart) currentCategoryChart.destroy();
        
        currentCategoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categoryViews.map(d => d.category),
                datasets: [{
                    data: categoryViews.map(d => d.views),
                    backgroundColor: ['#0B192C', '#C9A24B', '#10B981', '#3B82F6']
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    function renderRecentInquiries(inquiries) {
        const tbody = document.querySelector('#recent-inquiries-table tbody');
        tbody.innerHTML = '';
        inquiries.forEach(inq => {
            const tr = document.createElement('tr');
            const waLink = generateWhatsAppLink(inq.phone, inq.propertyTitle);
            tr.innerHTML = `
                <td>${inq.name}</td>
                <td>${inq.phone}</td>
                <td>${inq.propertyTitle || 'General'}</td>
                <td>${formatDate(inq.createdAt)}</td>
                <td><span class="${getBadgeClass(inq.status)}">${inq.status}</span></td>
                <td>
                    <a href="${waLink}" target="_blank" class="btn btn-sm btn-outline">
                        <i data-lucide="message-circle" class="text-success"></i> Reply
                    </a>
                </td>
            `;
            tbody.appendChild(tr);
        });
        lucide.createIcons();
    }

    // --- PROPERTIES CRUD ---
    async function fetchProperties() {
        showLoading();
        try {
            const res = await Auth.authFetch('/api/properties'); // Should return all for admin
            if (res.ok) {
                propertiesData = await res.json();
                filterAndRenderProperties();
            }
        } catch (err) {
            showToast('Failed to fetch properties', 'error');
        } finally {
            hideLoading();
        }
    }

    function filterAndRenderProperties() {
        const search = document.getElementById('prop-search').value.toLowerCase();
        const cat = document.getElementById('prop-category-filter').value;
        const stat = document.getElementById('prop-status-filter').value;

        const filtered = propertiesData.filter(p => {
            const matchSearch = p.title.toLowerCase().includes(search) || p.locality.toLowerCase().includes(search);
            const matchCat = cat ? p.category === cat : true;
            const matchStat = stat ? p.status === stat : true;
            return matchSearch && matchCat && matchStat;
        });
        renderPropertiesTable(filtered);
    }

    document.getElementById('prop-search').addEventListener('input', filterAndRenderProperties);
    document.getElementById('prop-category-filter').addEventListener('change', filterAndRenderProperties);
    document.getElementById('prop-status-filter').addEventListener('change', filterAndRenderProperties);

    function renderPropertiesTable(props) {
        const tbody = document.querySelector('#properties-table tbody');
        tbody.innerHTML = '';
        props.forEach(p => {
            const tr = document.createElement('tr');
            const imgUrl = p.images && p.images.length > 0 ? p.images[0] : 'https://via.placeholder.com/60x40';
            tr.innerHTML = `
                <td><img src="${imgUrl}" class="prop-thumbnail" alt="thumbnail"></td>
                <td><strong>${p.title}</strong></td>
                <td><span class="badge" style="background:#e5e7eb">${p.category}</span></td>
                <td>₹${p.price.toLocaleString('en-IN')}</td>
                <td>${p.locality}</td>
                <td><span class="${getBadgeClass(p.status)}">${p.status}</span></td>
                <td>${p.views || 0}</td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-outline edit-btn" data-id="${p._id}"><i data-lucide="edit"></i></button>
                    <button class="btn btn-sm btn-outline text-danger delete-btn" data-id="${p._id}"><i data-lucide="trash-2"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        tbody.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const prop = propertiesData.find(x => x._id === btn.getAttribute('data-id'));
                if(prop) openPropertyModal(prop);
            });
        });
        
        tbody.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => handlePropertyDelete(btn.getAttribute('data-id')));
        });
        
        lucide.createIcons();
    }

    // Modal Logic
    btnAddProperty.addEventListener('click', () => openPropertyModal());
    btnCloseModal.addEventListener('click', () => modal.classList.remove('active'));
    btnCancelModal.addEventListener('click', () => modal.classList.remove('active'));

    function openPropertyModal(prop = null) {
        document.getElementById('modal-title').textContent = prop ? 'Edit Property' : 'Add New Property';
        propertyForm.reset();
        
        if (prop) {
            document.getElementById('prop-id').value = prop._id;
            document.getElementById('prop-title').value = prop.title;
            document.getElementById('prop-category').value = prop.category;
            document.getElementById('prop-type').value = prop.type;
            document.getElementById('prop-price').value = prop.price;
            document.getElementById('prop-area').value = prop.area;
            document.getElementById('prop-beds').value = prop.bedrooms || 0;
            document.getElementById('prop-baths').value = prop.bathrooms || 0;
            document.getElementById('prop-locality').value = prop.locality;
            document.getElementById('prop-address').value = prop.location.address;
            document.getElementById('prop-lat').value = prop.location.coordinates[1];
            document.getElementById('prop-lng').value = prop.location.coordinates[0];
            document.getElementById('prop-images').value = prop.images ? prop.images.join(', ') : '';
            document.getElementById('prop-desc').value = prop.description;
            document.getElementById('prop-amenities').value = prop.amenities ? prop.amenities.join(', ') : '';
            document.getElementById('prop-status').value = prop.status;
            document.getElementById('prop-featured').checked = prop.isFeatured || false;
        } else {
            document.getElementById('prop-id').value = '';
            // Default Ujjain coordinates
            document.getElementById('prop-lat').value = 23.1793;
            document.getElementById('prop-lng').value = 75.7849;
        }

        modal.classList.add('active');
        initCoordPickerMap();
    }

    function initCoordPickerMap() {
        if (!mapInstance) {
            mapInstance = L.map('coord-picker-map').setView([23.1793, 75.7849], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(mapInstance);
            
            markerInstance = L.marker([23.1793, 75.7849], {draggable: true}).addTo(mapInstance);
            
            markerInstance.on('dragend', function(e) {
                const pos = markerInstance.getLatLng();
                document.getElementById('prop-lat').value = pos.lat.toFixed(6);
                document.getElementById('prop-lng').value = pos.lng.toFixed(6);
            });
            
            mapInstance.on('click', function(e) {
                markerInstance.setLatLng(e.latlng);
                document.getElementById('prop-lat').value = e.latlng.lat.toFixed(6);
                document.getElementById('prop-lng').value = e.latlng.lng.toFixed(6);
            });
        }
        
        // Timeout to fix leaflet sizing issue in modal
        setTimeout(() => {
            mapInstance.invalidateSize();
            const lat = parseFloat(document.getElementById('prop-lat').value);
            const lng = parseFloat(document.getElementById('prop-lng').value);
            if(lat && lng) {
                const latlng = new L.LatLng(lat, lng);
                markerInstance.setLatLng(latlng);
                mapInstance.setView(latlng, 15);
            }
        }, 300);
    }

    propertyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        showLoading();
        
        const id = document.getElementById('prop-id').value;
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/properties/${id}` : '/api/properties';
        
        const payload = {
            title: document.getElementById('prop-title').value,
            description: document.getElementById('prop-desc').value,
            price: Number(document.getElementById('prop-price').value),
            area: Number(document.getElementById('prop-area').value),
            category: document.getElementById('prop-category').value,
            type: document.getElementById('prop-type').value,
            status: document.getElementById('prop-status').value,
            locality: document.getElementById('prop-locality').value,
            bedrooms: Number(document.getElementById('prop-beds').value),
            bathrooms: Number(document.getElementById('prop-baths').value),
            isFeatured: document.getElementById('prop-featured').checked,
            location: {
                address: document.getElementById('prop-address').value,
                coordinates: [
                    parseFloat(document.getElementById('prop-lng').value),
                    parseFloat(document.getElementById('prop-lat').value)
                ]
            },
            images: document.getElementById('prop-images').value.split(',').map(s => s.trim()).filter(s => s),
            amenities: document.getElementById('prop-amenities').value.split(',').map(s => s.trim()).filter(s => s)
        };

        try {
            const res = await Auth.authFetch(url, {
                method,
                body: JSON.stringify(payload)
            });
            
            if (res.ok) {
                showToast(`Property ${id ? 'updated' : 'added'} successfully`);
                modal.classList.remove('active');
                fetchProperties();
            } else {
                const err = await res.json();
                showToast(err.message || 'Error saving property', 'error');
            }
        } catch (error) {
            showToast('Server error', 'error');
        } finally {
            hideLoading();
        }
    });

    async function handlePropertyDelete(id) {
        if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) return;
        
        showLoading();
        try {
            const res = await Auth.authFetch(`/api/properties/${id}`, { method: 'DELETE' });
            if (res.ok) {
                showToast('Property deleted');
                fetchProperties();
            } else {
                showToast('Error deleting property', 'error');
            }
        } catch (error) {
            showToast('Server error', 'error');
        } finally {
            hideLoading();
        }
    }

    // --- INQUIRIES ---
    async function fetchInquiries() {
        showLoading();
        try {
            const res = await Auth.authFetch('/api/inquiries');
            if (res.ok) {
                const data = await res.json();
                renderInquiriesTable(data);
                updateInquiriesStats(data);
            }
        } catch (err) {
            showToast('Failed to fetch inquiries', 'error');
        } finally {
            hideLoading();
        }
    }

    function updateInquiriesStats(inquiries) {
        const stats = { new: 0, contacted: 0, followup: 0, closed: 0 };
        inquiries.forEach(i => { if(stats[i.status] !== undefined) stats[i.status]++; });
        
        document.getElementById('stat-new').textContent = stats.new;
        document.getElementById('stat-contacted').textContent = stats.contacted;
        document.getElementById('stat-followup').textContent = stats.followup;
        document.getElementById('stat-closed').textContent = stats.closed;
    }

    function renderInquiriesTable(inquiries) {
        const tbody = document.querySelector('#all-inquiries-table tbody');
        tbody.innerHTML = '';
        inquiries.forEach(inq => {
            const tr = document.createElement('tr');
            const waLink = generateWhatsAppLink(inq.phone, inq.propertyTitle);
            
            const statuses = ['new', 'contacted', 'followup', 'closed'];
            const selectHtml = `
                <select class="status-select" data-id="${inq._id}">
                    ${statuses.map(s => `<option value="${s}" ${inq.status === s ? 'selected' : ''}>${s.charAt(0).toUpperCase() + s.slice(1)}</option>`).join('')}
                </select>
            `;
            
            tr.innerHTML = `
                <td><strong>${inq.name}</strong></td>
                <td>
                    <div>${inq.phone}</div>
                    <small class="text-taupe">${inq.email || ''}</small>
                </td>
                <td>${inq.propertyTitle ? `<a href="/property.html?id=${inq.propertyId}" target="_blank">${inq.propertyTitle}</a>` : 'General Inquiry'}</td>
                <td title="${inq.message}">${inq.message.length > 30 ? inq.message.substring(0, 30) + '...' : inq.message}</td>
                <td><span class="badge ${inq.source === 'whatsapp' ? 'badge-whatsapp' : 'badge-website'}">${inq.source}</span></td>
                <td>${formatDate(inq.createdAt)}</td>
                <td>${selectHtml}</td>
                <td class="action-buttons">
                    <a href="${waLink}" target="_blank" class="btn btn-sm btn-outline" title="WhatsApp Reply">
                        <i data-lucide="message-circle" style="color:#25D366"></i>
                    </a>
                    <a href="tel:${inq.phone}" class="btn btn-sm btn-outline" title="Call">
                        <i data-lucide="phone"></i>
                    </a>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        tbody.querySelectorAll('.status-select').forEach(select => {
            select.addEventListener('change', (e) => handleStatusChange(e.target.dataset.id, e.target.value));
        });
        
        lucide.createIcons();
    }

    async function handleStatusChange(id, newStatus) {
        try {
            const res = await Auth.authFetch(`/api/inquiries/${id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                showToast('Status updated');
                fetchInquiries(); // Refresh stats and table
            } else {
                showToast('Failed to update status', 'error');
            }
        } catch (err) {
            showToast('Server error', 'error');
        }
    }

    function generateWhatsAppLink(phone, propertyTitle) {
        let cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone; // Assume India if 10 digits
        
        let text = `Hello, I'm reaching out from Shri Manibhadra Real Estate regarding your inquiry`;
        if (propertyTitle) text += ` for "${propertyTitle}"`;
        text += `. How can we help you today?`;
        
        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    }
});
