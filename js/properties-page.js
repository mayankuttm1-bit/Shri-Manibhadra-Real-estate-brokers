/* properties-page.js - Properties List Page */

let allProperties = [];
let mapInstance = null;
let currentLayerGroup = null;
let markers = [];

document.addEventListener('DOMContentLoaded', () => {
    initContactBar();
    initMobileMenu();
    initHeaderScroll();
    initSmoothScroll();
    
    // Lucide icons
    if (typeof lucide !== 'undefined') lucide.createIcons();

    fetchProperties();
    initFilters();
});

// Reuse same functions as app.js for UI
function initContactBar() {
    const contactBar = document.querySelector('.contact-bar');
    const closeBtn = document.querySelector('.contact-bar .close-btn');
    if (!contactBar) return;
    if (sessionStorage.getItem('trs-contact-bar-closed')) {
        contactBar.classList.add('hidden');
        document.body.classList.remove('contact-bar-visible');
    } else {
        document.body.classList.add('contact-bar-visible');
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            contactBar.classList.add('hidden');
            document.body.classList.remove('contact-bar-visible');
            sessionStorage.setItem('trs-contact-bar-closed', 'true');
        });
    }
}

function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const drawer = document.querySelector('.mobile-drawer');
    const closeBtn = document.querySelector('.drawer-close');
    const navLinks = document.querySelectorAll('.drawer-nav a');
    if (!menuBtn || !drawer) return;
    const closeMenu = () => drawer.classList.remove('open');
    menuBtn.addEventListener('click', () => drawer.classList.add('open'));
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    navLinks.forEach(link => link.addEventListener('click', closeMenu));
}

function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function showToast(message, type = 'success') {
    let toast = document.getElementById('trs-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'trs-toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.className = `toast show ${type}`;
    toast.textContent = message;
    setTimeout(() => toast.classList.remove('show'), 4000);
}

// PROPERTY LOGIC
async function fetchProperties() {
    try {
        let res;
        try {
            res = await fetch('/api/properties');
            if (!res.ok) throw new Error('API not available');
        } catch (e) {
            res = await fetch('data/properties.json');
        }
        allProperties = await res.json();
        renderProperties(allProperties);
        initMap(allProperties);
    } catch (err) {
        console.error(err);
        document.getElementById('properties-list').innerHTML = '<p>Error loading properties.</p>';
    }
}

function renderProperties(properties) {
    const list = document.getElementById('properties-list');
    const countEl = document.getElementById('properties-count');
    
    if (countEl) {
        countEl.textContent = `Showing ${properties.length} properties`;
    }
    
    if (!list) return;

    if (properties.length === 0) {
        list.innerHTML = '<p class="col-span-full text-center py-12 text-taupe">No properties found matching your criteria.</p>';
        return;
    }

    list.innerHTML = properties.map(p => createPropertyCard(p)).join('');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function createPropertyCard(property) {
    const priceStr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(property.price);
    let specs = '';
    if (property.bedrooms > 0) specs += `<span><i data-lucide="bed-double" style="width:14px;height:14px"></i> ${property.bedrooms} BHK</span>`;
    if (property.area > 0) specs += `<span><i data-lucide="maximize" style="width:14px;height:14px"></i> ${property.area} sq.ft</span>`;
    specs += `<span>${property.type.charAt(0).toUpperCase() + property.type.slice(1)}</span>`;
    
    const rate = property.area > 0 ? `₹${Math.round(property.price / property.area).toLocaleString('en-IN')}/sq.ft` : '';
    const imagePath = property.images && property.images.length > 0 ? property.images[0] : '/img/placeholder.jpg';
    const locality = property.locality || property.location?.address || 'Ujjain';
    const whatsappText = encodeURIComponent(`Hi, I'm interested in ${property.title} in ${locality}. Can you share more details?`);
    const whatsappLink = `https://wa.me/919876543210?text=${whatsappText}`;
    
    const badges = [];
    if (property.status === 'available') badges.push('<span class="property-badge badge-sale">For Sale</span>');
    if (property.isFeatured) badges.push('<span class="property-badge badge-featured">Featured</span>');

    return `
        <div class="property-card">
            <a href="#" class="property-card-image">
                ${badges.join('')}
                <img src="${imagePath}" alt="${property.title}" loading="lazy">
            </a>
            <div class="property-card-body">
                <div class="property-locality">
                    <i data-lucide="map-pin" style="width:12px;height:12px"></i> ${locality}
                </div>
                <a href="#" class="property-title">${property.title}</a>
                <div class="property-specs">${specs}</div>
                <div class="property-footer">
                    <div>
                        <div class="property-price">${priceStr}</div>
                        ${rate ? `<span class="property-sqft-rate">${rate}</span>` : ''}
                    </div>
                    <a href="${whatsappLink}" target="_blank" class="whatsapp-enquire-btn">
                        <i data-lucide="message-circle" style="width:14px;height:14px"></i> Enquire
                    </a>
                </div>
            </div>
        </div>
    `;
}

// FILTERS
function initFilters() {
    const searchInput = document.getElementById('search-input') || document.getElementById('searchKeyword');
    const categorySelect = document.getElementById('category-filter') || document.getElementById('filterCategory');
    const typeSelect = document.getElementById('type-filter') || document.getElementById('filterType');
    const budgetSelect = document.getElementById('budget-filter') || document.getElementById('filterBudget');
    const sortSelect = document.getElementById('sort-filter') || document.getElementById('sortProperties');
    const clearBtn = document.getElementById('clearFilters');

    const applyFilters = () => {
        let filtered = [...allProperties];
        
        // Keyword
        if (searchInput && searchInput.value) {
            const kw = searchInput.value.toLowerCase().trim();
            filtered = filtered.filter(p => 
                (p.title && p.title.toLowerCase().includes(kw)) || 
                (p.locality && p.locality.toLowerCase().includes(kw)) ||
                (p.location && p.location.address && p.location.address.toLowerCase().includes(kw)) ||
                (p.description && p.description.toLowerCase().includes(kw)) ||
                (p.type && p.type.toLowerCase().includes(kw))
            );
        }
        
        // Category / Status
        if (categorySelect && categorySelect.value) {
            const cat = categorySelect.value.toLowerCase();
            filtered = filtered.filter(p => {
                if (cat === 'residential') return ['flat', 'apartment', 'villa', 'duplex', 'house'].includes(p.type.toLowerCase());
                if (cat === 'commercial') return ['shop', 'office', 'commercial', 'showroom', 'warehouse'].includes(p.type.toLowerCase());
                if (cat === 'plots') return ['plot', 'land', 'agricultural'].includes(p.type.toLowerCase());
                if (cat === 'luxury') return p.price >= 10000000 || p.isFeatured;
                return true;
            });
        }

        // Type
        if (typeSelect && typeSelect.value) {
            const type = typeSelect.value.toLowerCase();
            filtered = filtered.filter(p => p.type.toLowerCase().includes(type) || type.includes(p.type.toLowerCase()));
        }

        // Budget
        if (budgetSelect && budgetSelect.value) {
            const [min, max] = budgetSelect.value.split('-').map(Number);
            filtered = filtered.filter(p => {
                if (max) return p.price >= min && p.price <= max;
                return p.price >= min;
            });
        }

        // Sort
        if (sortSelect && sortSelect.value) {
            switch(sortSelect.value) {
                case 'price-asc': filtered.sort((a,b) => a.price - b.price); break;
                case 'price-desc': filtered.sort((a,b) => b.price - a.price); break;
                case 'newest':
                case 'date-desc': 
                    filtered.sort((a,b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)); 
                    break;
                case 'popular':
                    filtered.sort((a,b) => (b.views || 0) - (a.views || 0));
                    break;
            }
        }

        renderProperties(filtered);
        updateMapMarkers(filtered);
    };

    const clearFilters = () => {
        if (searchInput) searchInput.value = '';
        if (categorySelect) categorySelect.value = '';
        if (typeSelect) typeSelect.value = '';
        if (budgetSelect) budgetSelect.value = '';
        if (sortSelect) sortSelect.value = 'newest';
        applyFilters();
    };

    // Expose globally for inline onclick handlers in HTML
    window.applyFilters = applyFilters;
    window.clearFilters = clearFilters;

    [searchInput, categorySelect, typeSelect, budgetSelect, sortSelect].forEach(el => {
        if (el) el.addEventListener('change', applyFilters);
    });
    if (searchInput) searchInput.addEventListener('keyup', applyFilters);

    if (clearBtn) {
        clearBtn.addEventListener('click', clearFilters);
    }

    // Parse URL params on page load
    const urlParams = new URLSearchParams(window.location.search);
    let hasUrlFilters = false;
    if (urlParams.has('q') && searchInput) {
        searchInput.value = urlParams.get('q');
        hasUrlFilters = true;
    }
    if (urlParams.has('type') && typeSelect) {
        typeSelect.value = urlParams.get('type');
        hasUrlFilters = true;
    }
    if (urlParams.has('category') && categorySelect) {
        categorySelect.value = urlParams.get('category');
        hasUrlFilters = true;
    }

    if (hasUrlFilters) {
        // Run filter after properties are loaded
        setTimeout(applyFilters, 300);
    }
}

// MAP
function initMap(properties) {
    const mapEl = document.getElementById('properties-page-map');
    if (!mapEl || typeof L === 'undefined') return;

    mapInstance = L.map('properties-page-map').setView([23.1765, 75.7885], 13);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    }).addTo(mapInstance);

    currentLayerGroup = L.layerGroup().addTo(mapInstance);
    updateMapMarkers(properties);
}

function updateMapMarkers(properties) {
    if (!mapInstance || !currentLayerGroup) return;
    
    currentLayerGroup.clearLayers();
    markers = [];

    properties.forEach(property => {
        if (property.location && property.location.coordinates && property.location.coordinates.length === 2) {
            const lat = property.location.coordinates[1];
            const lng = property.location.coordinates[0];

            const customIcon = L.divIcon({
                className: 'custom-property-pin',
                html: `
                    <div class="pin-body">
                        <svg width="36" height="45" viewBox="0 0 36 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 0C8.05887 0 0 8.05887 0 18C0 31.5 18 45 18 45C18 45 36 31.5 36 18C36 8.05887 27.9411 0 18 0Z" fill="#C9A24B" stroke="#0B192C" stroke-width="2"/>
                            <circle cx="18" cy="18" r="8" fill="#0B192C"/>
                        </svg>
                    </div>
                `,
                iconSize: [36, 45],
                iconAnchor: [18, 44],
                popupAnchor: [0, -46]
            });

            const priceStr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(property.price);
            const imagePath = property.images && property.images.length > 0 ? property.images[0] : '/img/placeholder.jpg';
            const popupHtml = `
                <div class="map-popup-card">
                    <img src="${imagePath}" alt="${property.title}">
                    <div class="map-popup-content">
                        <h4>${property.title}</h4>
                        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #eee; padding-top:8px;">
                            <span style="color:#C9A24B; font-weight:bold;">${priceStr}</span>
                        </div>
                    </div>
                </div>
            `;

            const marker = L.marker([lat, lng], { icon: customIcon }).bindPopup(popupHtml);
            currentLayerGroup.addLayer(marker);
            markers.push(marker);
        }
    });

    if (markers.length > 0) {
        const group = new L.featureGroup(markers);
        mapInstance.fitBounds(group.getBounds().pad(0.1));
    }
}
