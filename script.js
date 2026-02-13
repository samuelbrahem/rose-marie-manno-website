/* ========================================
   ROSE MARIE MANNO — Modern Realtor Website
   JavaScript — 2025 Design
   ======================================== */

(function () {
    'use strict';

    // ===== THEME TOGGLE (Dark / Light) =====
    const themeToggle = document.getElementById('themeToggle');
    const root = document.documentElement;

    function setTheme(theme) {
        root.setAttribute('data-theme', theme);
        localStorage.setItem('rm-theme', theme);
        if (themeToggle) {
            themeToggle.innerHTML = theme === 'dark'
                ? '<i class="fas fa-sun"></i>'
                : '<i class="fas fa-moon"></i>';
        }
    }

    // Initialize theme
    const savedTheme = localStorage.getItem('rm-theme') || 'light';
    setTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = root.getAttribute('data-theme') || 'light';
            setTheme(current === 'dark' ? 'light' : 'dark');
        });
    }

    // ===== NAVIGATION =====
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    // Scroll — glass nav
    window.addEventListener('scroll', () => {
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);

        // Back to top
        const btt = document.getElementById('backToTop');
        if (btt) btt.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    // Mobile toggle
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // ===== BACK TO TOP =====
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== FOOTER YEAR =====
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ===== SCROLL REVEAL ANIMATIONS =====
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // ===== CONTACT FORM =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const firstName = contactForm.querySelector('#firstName')?.value || 'there';
            contactForm.innerHTML = `
                <div class="form-success">
                    <div class="check-icon"><i class="fas fa-check"></i></div>
                    <h3>Message Sent</h3>
                    <p>Thank you, ${firstName}! Rose Marie will be in touch within 24 hours.</p>
                </div>
            `;
        });
    }

    // ===== FAQ ACCORDION =====
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isOpen = item.classList.contains('open');

            // Close all
            document.querySelectorAll('.faq-item').forEach(fi => fi.classList.remove('open'));

            // Toggle current
            if (!isOpen) item.classList.add('open');
        });
    });

    // ===== PROPERTY SEARCH =====
    const searchForm = document.getElementById('propertySearchForm');
    const searchLocation = document.getElementById('searchLocation');
    const locationSuggestions = document.getElementById('locationSuggestions');
    const searchLoading = document.getElementById('searchLoading');
    const searchResultsBar = document.getElementById('searchResultsBar');
    const resultsGrid = document.getElementById('resultsGrid');
    const noResults = document.getElementById('noResults');
    const resultCount = document.getElementById('resultCount');
    const sortResults = document.getElementById('sortResults');

    // Location suggestions data
    const locations = [
        { name: 'White Rock, BC', type: 'city' },
        { name: 'South Surrey, BC', type: 'neighbourhood' },
        { name: 'Surrey, BC', type: 'city' },
        { name: 'Langley, BC', type: 'city' },
        { name: 'Port Coquitlam, BC', type: 'city' },
        { name: 'Coquitlam, BC', type: 'city' },
        { name: 'Vancouver, BC', type: 'city' },
        { name: 'Burnaby, BC', type: 'city' },
        { name: 'Richmond, BC', type: 'city' },
        { name: 'New Westminster, BC', type: 'city' },
        { name: 'North Vancouver, BC', type: 'city' },
        { name: 'West Vancouver, BC', type: 'city' },
        { name: 'Delta, BC', type: 'city' },
        { name: 'Abbotsford, BC', type: 'city' },
        { name: 'Maple Ridge, BC', type: 'city' },
        { name: 'Willoughby Heights, Langley', type: 'neighbourhood' },
        { name: 'Guildford, Surrey', type: 'neighbourhood' },
        { name: 'Pacific Douglas, Surrey', type: 'neighbourhood' },
        { name: 'Cloverdale, Surrey', type: 'neighbourhood' },
        { name: 'Morgan Creek, Surrey', type: 'neighbourhood' },
        { name: 'Grandview Heights, Surrey', type: 'neighbourhood' },
        { name: 'Fleetwood, Surrey', type: 'neighbourhood' },
        { name: 'Ocean Park, Surrey', type: 'neighbourhood' },
        { name: 'Crescent Beach, Surrey', type: 'neighbourhood' },
        { name: 'Fort Langley, BC', type: 'neighbourhood' },
        { name: 'Walnut Grove, Langley', type: 'neighbourhood' },
        { name: 'Burke Mountain, Coquitlam', type: 'neighbourhood' },
    ];

    if (searchLocation && locationSuggestions) {
        searchLocation.addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase().trim();
            if (val.length < 2) {
                locationSuggestions.classList.remove('active');
                return;
            }
            const matches = locations.filter(l => l.name.toLowerCase().includes(val)).slice(0, 6);
            if (matches.length) {
                locationSuggestions.innerHTML = matches.map(l =>
                    `<div class="location-suggestion" data-name="${l.name}"><i class="fas fa-${l.type === 'city' ? 'city' : 'map-pin'}"></i>${l.name}</div>`
                ).join('');
                locationSuggestions.classList.add('active');
                locationSuggestions.querySelectorAll('.location-suggestion').forEach(el => {
                    el.addEventListener('click', () => {
                        searchLocation.value = el.dataset.name;
                        locationSuggestions.classList.remove('active');
                    });
                });
            } else {
                locationSuggestions.classList.remove('active');
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-input-wrapper')) {
                locationSuggestions.classList.remove('active');
            }
        });
    }

    // Search tabs
    document.querySelectorAll('.search-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // Sample listings generator
    function generateListings() {
        const listings = [];
        const neighborhoods = {
            'White Rock': ['West Beach', 'East Beach', 'Town Centre', 'Hillside'],
            'South Surrey': ['Ocean Park', 'Crescent Beach', 'Morgan Creek', 'Grandview Heights', 'Sunnyside Park'],
            'Surrey': ['Guildford', 'Fleetwood', 'Cloverdale', 'Newton', 'Whalley', 'Pacific Douglas', 'Sullivan Station'],
            'Langley': ['Willoughby Heights', 'Walnut Grove', 'Brookswood', 'Murrayville', 'Fort Langley'],
            'Port Coquitlam': ['Citadel Heights', 'Lincoln Park', 'Mary Hill', 'Birchland Manor'],
            'Coquitlam': ['Burke Mountain', 'Westwood Plateau', 'Maillardville', 'Eagle Ridge'],
            'Vancouver': ['Kitsilano', 'Mount Pleasant', 'Yaletown', 'Coal Harbour', 'Kerrisdale'],
            'Burnaby': ['Metrotown', 'Brentwood', 'Edmonds', 'Highgate'],
            'Richmond': ['Steveston', 'Brighouse', 'Ironwood'],
            'Delta': ['Tsawwassen', 'Ladner', 'North Delta'],
        };

        const streets = [
            '152nd St', '160th St', 'King George Blvd', 'Marine Dr', '56th Ave',
            '176th St', '200th St', 'Fraser Hwy', '64th Ave', '16th Ave',
            'Johnston Rd', 'Oxford St', 'Foster Ave', 'Russell Ave', 'Prospect Ave',
            '208th St', '196th St', 'Walnut Grove Dr', '88th Ave', 'Coast Meridian Rd'
        ];

        const types = ['house', 'townhouse', 'condo', 'duplex'];
        const typeNames = { house: 'House', townhouse: 'Townhouse', condo: 'Condo', duplex: 'Duplex' };
        const images = [
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&q=80',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&q=80',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=500&q=80',
            'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=500&q=80',
            'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=500&q=80',
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&q=80',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&q=80',
            'https://images.unsplash.com/photo-1600573472591-ee6981cf81f0?w=500&q=80',
        ];

        Object.entries(neighborhoods).forEach(([city, hoods]) => {
            hoods.forEach(hood => {
                const count = 2 + Math.floor(Math.random() * 4);
                for (let i = 0; i < count; i++) {
                    const type = types[Math.floor(Math.random() * types.length)];
                    let price, beds, baths, sqft;

                    if (type === 'house') {
                        price = 900000 + Math.floor(Math.random() * 2000000);
                        beds = 3 + Math.floor(Math.random() * 4);
                        baths = 2 + Math.floor(Math.random() * 3);
                        sqft = 1800 + Math.floor(Math.random() * 2500);
                    } else if (type === 'townhouse') {
                        price = 500000 + Math.floor(Math.random() * 700000);
                        beds = 2 + Math.floor(Math.random() * 3);
                        baths = 2 + Math.floor(Math.random() * 2);
                        sqft = 1000 + Math.floor(Math.random() * 1000);
                    } else if (type === 'condo') {
                        price = 350000 + Math.floor(Math.random() * 550000);
                        beds = 1 + Math.floor(Math.random() * 3);
                        baths = 1 + Math.floor(Math.random() * 2);
                        sqft = 500 + Math.floor(Math.random() * 800);
                    } else {
                        price = 700000 + Math.floor(Math.random() * 900000);
                        beds = 3 + Math.floor(Math.random() * 3);
                        baths = 2 + Math.floor(Math.random() * 2);
                        sqft = 1400 + Math.floor(Math.random() * 1200);
                    }

                    if (['Vancouver', 'West Vancouver', 'North Vancouver'].includes(city)) price = Math.round(price * 1.4);
                    if (city === 'White Rock') price = Math.round(price * 1.15);

                    listings.push({
                        address: `${100 + Math.floor(Math.random() * 19900)} ${streets[Math.floor(Math.random() * streets.length)]}`,
                        city,
                        hood,
                        location: `${hood}, ${city}`,
                        price: Math.round(price / 1000) * 1000,
                        type,
                        typeName: typeNames[type],
                        beds, baths, sqft,
                        days: Math.floor(Math.random() * 45),
                        image: images[Math.floor(Math.random() * images.length)],
                        forRent: Math.random() > 0.85,
                        rent: type === 'condo' ? 1800 + Math.floor(Math.random() * 1400) : 2400 + Math.floor(Math.random() * 2000),
                    });
                }
            });
        });
        return listings;
    }

    let sampleListings = null;

    function getListings() {
        if (!sampleListings) sampleListings = generateListings();
        return sampleListings;
    }

    // Search
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            runSearch();
        });
    }

    if (sortResults) {
        sortResults.addEventListener('change', runSearch);
    }

    function runSearch() {
        if (!resultsGrid) return;

        const location = (searchLocation?.value || '').toLowerCase().trim();
        const type = document.getElementById('searchType')?.value || '';
        const minPrice = parseInt(document.getElementById('searchMinPrice')?.value) || 0;
        const maxPrice = parseInt(document.getElementById('searchMaxPrice')?.value) || Infinity;
        const beds = parseInt(document.getElementById('searchBeds')?.value) || 0;
        const baths = parseInt(document.getElementById('searchBaths')?.value) || 0;
        const activeTab = document.querySelector('.search-tab.active')?.dataset?.tab || 'buy';
        const sort = sortResults?.value || 'price-asc';

        // Show loading
        show(searchLoading);
        hide(searchResultsBar);
        hide(noResults);
        resultsGrid.innerHTML = '';

        setTimeout(() => {
            let results = getListings().filter(l => {
                if (activeTab === 'rent' && !l.forRent) return false;
                if (activeTab === 'buy' && l.forRent) return false;

                if (location) {
                    const match = l.city.toLowerCase().includes(location)
                        || l.hood.toLowerCase().includes(location)
                        || l.location.toLowerCase().includes(location)
                        || l.address.toLowerCase().includes(location);
                    if (!match) return false;
                }

                if (type && l.type !== type) return false;

                const price = activeTab === 'rent' ? l.rent : l.price;
                if (price < minPrice || price > maxPrice) return false;
                if (l.beds < beds || l.baths < baths) return false;

                return true;
            });

            // Sort
            results.sort((a, b) => {
                const pa = activeTab === 'rent' ? a.rent : a.price;
                const pb = activeTab === 'rent' ? b.rent : b.price;
                switch (sort) {
                    case 'price-desc': return pb - pa;
                    case 'date': return a.days - b.days;
                    case 'sqft': return b.sqft - a.sqft;
                    default: return pa - pb;
                }
            });

            results = results.slice(0, 24);

            hide(searchLoading);

            if (results.length === 0) {
                show(noResults);
                hide(searchResultsBar);
            } else {
                hide(noResults);
                show(searchResultsBar);
                if (resultCount) resultCount.textContent = `${results.length} properties found`;

                resultsGrid.innerHTML = results.map(l => {
                    const price = activeTab === 'rent'
                        ? `$${l.rent.toLocaleString()}/mo`
                        : `$${l.price.toLocaleString()}`;

                    return `
                        <div class="listing-card" onclick="window.open('https://www.realtor.ca/map#view=list&Sort=6-D&GeoName=${encodeURIComponent(l.city)}%2C%20BC&PropertyTypeGroupID=1','_blank')">
                            <div class="listing-img" style="background-image:url('${l.image}')">
                                <span class="listing-badge">${l.typeName}</span>
                                <span class="listing-price-overlay">${price}</span>
                            </div>
                            <div class="listing-body">
                                <div class="listing-address">${l.address}</div>
                                <div class="listing-location"><i class="fas fa-map-marker-alt" style="color:var(--accent);margin-right:4px;font-size:0.7rem;"></i>${l.location}</div>
                                <div class="listing-meta">
                                    <span><i class="fas fa-bed"></i> ${l.beds} Beds</span>
                                    <span><i class="fas fa-bath"></i> ${l.baths} Baths</span>
                                    <span><i class="fas fa-ruler-combined"></i> ${l.sqft.toLocaleString()} sqft</span>
                                </div>
                            </div>
                        </div>`;
                }).join('');
            }

            document.getElementById('searchResults')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 900);
    }

    function show(el) { if (el) el.classList.remove('hidden'); }
    function hide(el) { if (el) el.classList.add('hidden'); }

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const href = a.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

})();
