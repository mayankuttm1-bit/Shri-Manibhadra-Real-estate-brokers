/* app.js - Home Page Script */

document.addEventListener('DOMContentLoaded', () => {
    initContactBar();
    initMobileMenu();
    initHeaderScroll();
    initHeroTabs();
    initSmoothScroll();
    initAnimaster();
    
    // Fetch and render featured properties
    fetchFeaturedProperties();
    
    // Init EMI Calculator if elements exist
    if (document.getElementById('loanAmount')) {
        initEMICalculator();
    }
    
    // Init Contact Form
    initContactForm();

    // Init FAQ Accordion
    initFAQ();
});

// CONTACT BAR
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

// MOBILE MENU
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const drawer = document.querySelector('.mobile-drawer');
    const closeBtn = document.querySelector('.drawer-close');
    const navLinks = document.querySelectorAll('.drawer-nav a');
    
    if (!menuBtn || !drawer) return;
    
    menuBtn.addEventListener('click', () => {
        drawer.classList.add('open');
    });
    
    const closeMenu = () => {
        drawer.classList.remove('open');
    };
    
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

// HEADER SCROLL
function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// HERO TABS & SEARCH / SELL FORMS
function initHeroTabs() {
    const tabBuy = document.getElementById('hero-tab-buy');
    const tabSell = document.getElementById('hero-tab-sell');
    const buyPanel = document.getElementById('hero-buy-panel');
    const sellPanel = document.getElementById('hero-sell-panel');
    
    if (!tabBuy || !tabSell || !buyPanel || !sellPanel) return;
    
    // Switch to Buy Tab
    function switchToBuy() {
        tabBuy.className = 'py-4 border-b-4 transition-all duration-200 bg-navy text-white border-brass font-bold text-sm';
        tabSell.className = 'py-4 border-b-4 transition-all duration-200 bg-brass text-navy hover:bg-brass-dark border-transparent font-bold text-sm';
        tabBuy.style.backgroundColor = '#0B192C';
        tabBuy.style.color = '#ffffff';
        tabSell.style.backgroundColor = '#C9A24B';
        tabSell.style.color = '#0B192C';
        buyPanel.classList.remove('hidden');
        sellPanel.classList.add('hidden');
    }
    
    // Switch to Sell Tab
    function switchToSell() {
        tabSell.className = 'py-4 border-b-4 transition-all duration-200 bg-brass text-navy font-bold text-sm border-navy shadow-inner';
        tabBuy.className = 'py-4 border-b-4 transition-all duration-200 bg-navy text-white font-bold text-sm border-transparent opacity-90 hover:opacity-100';
        tabBuy.style.backgroundColor = '#0B192C';
        tabBuy.style.color = '#ffffff';
        tabSell.style.backgroundColor = '#C9A24B';
        tabSell.style.color = '#0B192C';
        sellPanel.classList.remove('hidden');
        buyPanel.classList.add('hidden');
    }

    // Expose for external calls
    window.switchToSellTab = switchToSell;
    window.switchToBuyTab = switchToBuy;
    
    tabBuy.addEventListener('click', (e) => {
        e.preventDefault();
        switchToBuy();
    });
    
    tabSell.addEventListener('click', (e) => {
        e.preventDefault();
        switchToSell();
    });

    // Sub Tabs (ALL, BUY, RENT / LEASE)
    const subTabs = document.querySelectorAll('.sub-tab-btn');
    let selectedDeal = 'ALL';
    subTabs.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            subTabs.forEach(b => {
                b.className = 'sub-tab-btn text-taupe hover:text-navy font-medium text-xs uppercase tracking-wider pb-1';
            });
            btn.className = 'sub-tab-btn text-navy font-bold text-xs uppercase tracking-wider border-b-2 border-navy pb-1';
            selectedDeal = btn.getAttribute('data-deal') || 'ALL';
        });
    });

    // Search Form Submit
    const searchForm = document.getElementById('hero-search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const type = document.getElementById('hero-search-type')?.value || '';
            const location = document.getElementById('hero-search-location')?.value || '';
            const params = new URLSearchParams();
            if (type) params.set('type', type);
            if (location.trim()) params.set('q', location.trim());
            if (selectedDeal && selectedDeal !== 'ALL') params.set('deal', selectedDeal);
            window.location.href = `properties.html${params.toString() ? '?' + params.toString() : ''}`;
        });
    }

    // Sell Form Submit
    const sellForm = document.getElementById('hero-sell-form');
    const sellSuccessBox = document.getElementById('sell-success-box');
    const sellResetBtn = document.getElementById('sell-reset-btn');

    if (sellForm && sellSuccessBox) {
        sellForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const type = document.getElementById('sell-type')?.value || '';
            const price = document.getElementById('sell-price')?.value || '';
            const locality = document.getElementById('sell-locality')?.value || '';
            const phone = document.getElementById('sell-phone')?.value || '';

            const submitBtn = document.getElementById('sell-submit-btn');
            const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
            if (submitBtn) {
                submitBtn.innerHTML = 'Submitting...';
                submitBtn.disabled = true;
            }

            try {
                const response = await fetch('/api/inquiries', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: `Property Seller (${locality})`,
                        phone: phone,
                        service: `Sell Property - ${type}`,
                        message: `Owner wants to sell ${type} in ${locality}. Expected Price: ${price}`,
                        source: 'hero_sell_form'
                    })
                });

                if (response.ok) {
                    sellForm.classList.add('hidden');
                    sellSuccessBox.classList.remove('hidden');
                    
                    // Update WhatsApp link in success box with details
                    const waLink = document.getElementById('sell-success-wa');
                    if (waLink) {
                        const msg = encodeURIComponent(`Hi Shri Manibhadra Brokers, I submitted my property for sale: ${type} at ${locality}, Expected: ${price}. My contact: ${phone}. Please connect with me.`);
                        waLink.href = `https://wa.me/919876543210?text=${msg}`;
                    }
                } else {
                    throw new Error('Submission failed');
                }
            } catch (err) {
                console.error(err);
                // On static hosting like GitHub Pages, still show success and open WhatsApp
                sellForm.classList.add('hidden');
                sellSuccessBox.classList.remove('hidden');
                const waLink = document.getElementById('sell-success-wa');
                if (waLink) {
                    const msg = encodeURIComponent(`Hi Shri Manibhadra Brokers, I submitted my property for sale: ${type} at ${locality}, Expected: ${price}. My contact: ${phone}. Please connect with me.`);
                    waLink.href = `https://wa.me/919876543210?text=${msg}`;
                }
            } finally {
                if (submitBtn) {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }
            }
        });

        if (sellResetBtn) {
            sellResetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                sellForm.reset();
                sellSuccessBox.classList.add('hidden');
                sellForm.classList.remove('hidden');
            });
        }
    }
}

// FETCH FEATURED PROPERTIES
async function fetchFeaturedProperties() {
    const grid = document.getElementById('featured-grid');
    if (!grid) return;
    
    try {
        let response;
        try {
            response = await fetch('/api/properties?featured=true');
            if (!response.ok) throw new Error('API not available');
        } catch (e) {
            response = await fetch('data/properties.json');
        }
        const properties = await response.json();
        
        if (properties && properties.length > 0) {
            grid.innerHTML = properties.slice(0, 6).map(prop => createPropertyCard(prop)).join('');
        } else {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: var(--trs-taupe);">No featured properties available at the moment.</p>';
        }
    } catch (error) {
        console.error('Error fetching properties:', error);
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: var(--trs-taupe);">Unable to load properties.</p>';
    }
}

// PROPERTY CARD RENDERER
function createPropertyCard(property) {
    const priceStr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(property.price);
    
    let specs = '';
    if (property.bedrooms > 0) {
        specs += `<span><i data-lucide="bed-double" style="width:14px;height:14px"></i> ${property.bedrooms} BHK</span>`;
    }
    if (property.area > 0) {
        specs += `<span><i data-lucide="maximize" style="width:14px;height:14px"></i> ${property.area} sq.ft</span>`;
    }
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

// ANIMASTER (SCROLL ANIMATIONS & COUNTERS)
function initAnimaster() {
    // Reveal elements on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // If it's a counter, animate it
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    
    document.querySelectorAll('.animate-on-scroll, .stat-number').forEach(el => {
        observer.observe(el);
    });
    
    // Initialize Lucide icons if loaded
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target') || '0', 10);
    if (!target) return;
    
    let suffix = element.innerHTML.replace(/[0-9]/g, '');
    let current = 0;
    const duration = 2000;
    const increment = target / (duration / 16); // ~60fps
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.innerHTML = Math.ceil(current) + suffix;
            requestAnimationFrame(updateCounter);
        } else {
            element.innerHTML = target + suffix;
        }
    };
    
    updateCounter();
}

// EMI CALCULATOR
function initEMICalculator() {
    const amountInput = document.getElementById('loanAmount');
    const rateInput = document.getElementById('interestRate');
    const tenureInput = document.getElementById('loanTenure');
    
    const amountVal = document.getElementById('amountVal');
    const rateVal = document.getElementById('rateVal');
    const tenureVal = document.getElementById('tenureVal');
    
    const emiResult = document.getElementById('emiResult');
    const totalInterestEl = document.getElementById('totalInterest');
    const totalAmountEl = document.getElementById('totalAmount');
    
    const donutChart = document.getElementById('emiDonutChart');
    
    function calculateEMI() {
        const p = parseFloat(amountInput.value);
        const annualRate = parseFloat(rateInput.value);
        const years = parseFloat(tenureInput.value);
        
        // Update labels
        amountVal.innerText = formatMoney(p);
        rateVal.innerText = annualRate + '%';
        tenureVal.innerText = years + ' Yrs';
        
        const r = annualRate / 12 / 100;
        const n = years * 12;
        
        let emi = 0;
        let totalPayment = 0;
        let totalInterest = 0;
        
        if (r > 0) {
            emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            totalPayment = emi * n;
            totalInterest = totalPayment - p;
        } else {
            emi = p / n;
            totalPayment = p;
        }
        
        emiResult.innerText = formatMoney(Math.round(emi));
        totalInterestEl.innerText = formatMoney(Math.round(totalInterest));
        totalAmountEl.innerText = formatMoney(Math.round(totalPayment));
        
        updateChart(p, totalInterest, totalPayment);
    }
    
    function formatMoney(amount) {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
    }
    
    function updateChart(principal, interest, total) {
        if (!donutChart) return;
        
        const principalPct = (principal / total) * 100;
        const interestPct = (interest / total) * 100;
        
        // SVG Donut implementation
        const dashArray = `${principalPct} ${interestPct}`;
        donutChart.innerHTML = `
            <svg width="100%" height="100%" viewBox="0 0 42 42" class="donut">
                <circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#fff"></circle>
                <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#C9A24B" stroke-width="6"></circle>
                <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#0B192C" stroke-width="6" stroke-dasharray="${principalPct} ${interestPct}" stroke-dashoffset="25"></circle>
            </svg>
        `;
    }
    
    amountInput.addEventListener('input', calculateEMI);
    rateInput.addEventListener('input', calculateEMI);
    tenureInput.addEventListener('input', calculateEMI);
    
    calculateEMI(); // Initial calc
}

// CONTACT FORM
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Basic validation
        if (!data.name || data.name.trim() === '') {
            showToast('Please enter your name', 'error');
            return;
        }
        if (!data.phone || data.phone.length < 10) {
            showToast('Please enter a valid phone number', 'error');
            return;
        }
        
        data.source = 'web_form';
        
        try {
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Sending...';
            btn.disabled = true;
            
            const response = await fetch('/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                showToast('Thank you! We will contact you soon.', 'success');
                form.reset();
            } else {
                throw new Error('Server returned error');
            }
        } catch (error) {
            console.error(error);
            showToast('Error sending message. Please try WhatsApp.', 'error');
        } finally {
            const btn = form.querySelector('button[type="submit"]');
            btn.innerHTML = 'Send Message';
            btn.disabled = false;
        }
    });
}

// SMOOTH SCROLL
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// TOAST NOTIFICATION
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
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// FAQ ACCORDION
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-accordion-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question-btn');
        const panel = item.querySelector('.faq-answer-panel');
        const chevron = item.querySelector('.faq-chevron');
        if (!btn || !panel) return;

        btn.addEventListener('click', () => {
            const isOpen = btn.getAttribute('aria-expanded') === 'true';

            // Close other items for accordion behavior
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherBtn = otherItem.querySelector('.faq-question-btn');
                    const otherPanel = otherItem.querySelector('.faq-answer-panel');
                    const otherChevron = otherItem.querySelector('.faq-chevron');
                    if (otherBtn && otherPanel) {
                        otherBtn.setAttribute('aria-expanded', 'false');
                        otherPanel.style.maxHeight = null;
                        if (otherChevron) otherChevron.classList.remove('rotate-180', 'text-brass');
                    }
                }
            });

            if (isOpen) {
                btn.setAttribute('aria-expanded', 'false');
                panel.style.maxHeight = null;
                if (chevron) chevron.classList.remove('rotate-180', 'text-brass');
            } else {
                btn.setAttribute('aria-expanded', 'true');
                panel.style.maxHeight = panel.scrollHeight + 'px';
                if (chevron) chevron.classList.add('rotate-180', 'text-brass');
            }
        });
    });
}
