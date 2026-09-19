/* map.js - Home Page Map Engine */

document.addEventListener('DOMContentLoaded', () => {
    initHomeMap();
});

async function initHomeMap() {
    const mapContainer = document.getElementById('properties-map');
    if (!mapContainer || typeof L === 'undefined') return;

    // Initialize Map
    const map = L.map('properties-map').setView([23.1765, 75.7885], 13);
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    }).addTo(map);

    let allProperties = [];
    const markersByCategory = {
        all: [],
        residential: [],
        commercial: [],
        plots: [],
        luxury: []
    };
    
    let currentLayerGroup = L.layerGroup().addTo(map);

    try {
        const response = await fetch('/api/properties');
        allProperties = await response.json();
        
        allProperties.forEach(property => {
            if (property.location && property.location.coordinates && property.location.coordinates.length === 2) {
                const lat = property.location.coordinates[1];
                const lng = property.location.coordinates[0];
                
                // Map properties to our filter categories
                let category = 'all';
                const type = (property.type || '').toLowerCase();
                
                if (['apartment', 'house', 'villa', 'builder_floor'].includes(type)) {
                    category = 'residential';
                } else if (['shop', 'office', 'commercial_land'].includes(type)) {
                    category = 'commercial';
                } else if (['plot', 'agricultural_land'].includes(type)) {
                    category = 'plots';
                }
                
                if (property.price > 10000000) { // > 1Cr is luxury
                    category = 'luxury';
                }

                // Create custom icon
                const customIcon = L.divIcon({
                    className: 'custom-property-pin',
                    html: `
                        <div class="pin-body">
                            <svg width="36" height="45" viewBox="0 0 36 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 0C8.05887 0 0 8.05887 0 18C0 31.5 18 45 18 45C18 45 36 31.5 36 18C36 8.05887 27.9411 0 18 0Z" fill="#C9A24B" stroke="#0B192C" stroke-width="2"/>
                                <circle cx="18" cy="18" r="8" fill="#0B192C"/>
                            </svg>
                        </div>
                        <div class="pin-pulse"></div>
                    `,
                    iconSize: [36, 45],
                    iconAnchor: [18, 44],
                    popupAnchor: [0, -46]
                });

                // Create Popup content
                const priceStr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(property.price);
                const imagePath = property.images && property.images.length > 0 ? property.images[0] : '/img/placeholder.jpg';
                const locality = property.locality || property.location.address || 'Ujjain';
                
                let specs = `${type}`;
                if (property.bedrooms > 0) specs = `${property.bedrooms} BHK ${type}`;
                if (property.area > 0) specs += ` | ${property.area} sq.ft`;
                
                const whatsappText = encodeURIComponent(`Hi, I'm interested in ${property.title} in ${locality}. Can you share more details?`);
                const whatsappLink = `https://wa.me/919876543210?text=${whatsappText}`;

                const popupHtml = `
                    <div class="map-popup-card">
                        <img src="${imagePath}" alt="${property.title}">
                        <div class="map-popup-content">
                            <span style="font-size:11px; color:#8A8170;">${locality}</span>
                            <h4>${property.title}</h4>
                            <span style="font-size:12px; color:#8A8170; display:block; margin-bottom:8px;">${specs}</span>
                            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #eee; padding-top:8px;">
                                <span style="color:#C9A24B; font-weight:bold;">${priceStr}</span>
                                <a href="${whatsappLink}" target="_blank" style="background:#25D366; color:white; padding:4px 8px; border-radius:4px; font-size:12px; font-weight:bold;">Enquire</a>
                            </div>
                        </div>
                    </div>
                `;

                const marker = L.marker([lat, lng], { icon: customIcon }).bindPopup(popupHtml);
                
                markersByCategory['all'].push(marker);
                if (category !== 'all') {
                    markersByCategory[category].push(marker);
                }
            }
        });

        // Initial render
        renderMarkers('all');

        // Setup Filters
        const filters = document.querySelectorAll('.map-filter-pill');
        filters.forEach(filter => {
            filter.addEventListener('click', (e) => {
                filters.forEach(f => f.classList.remove('active'));
                e.target.classList.add('active');
                const category = e.target.getAttribute('data-filter') || 'all';
                renderMarkers(category);
            });
        });

    } catch (error) {
        console.error("Error loading map properties:", error);
    }

    function renderMarkers(category) {
        currentLayerGroup.clearLayers();
        const markers = markersByCategory[category] || [];
        
        if (markers.length === 0) return;

        markers.forEach(marker => {
            currentLayerGroup.addLayer(marker);
        });

        // Auto fit bounds
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
    }
}
