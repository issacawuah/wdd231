// Main JavaScript - ES Module
import { foodTrucksData, storage, STORAGE_KEYS } from './data.js';
import { 
    generateStars, 
    ModalManager, 
    showNotification, 
    debounce, 
    formatPhoneNumber,
    validateEmail,
    getUserPreferences,
    saveUserPreferences,
    getFavorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    saveSearchHistory,
    getSearchHistory,
    clearSearchHistory,
    setupLazyLoading,
    smoothScrollTo
} from './utils.js';

// Global variables
let foodTrucks = [];
let filteredTrucks = [];
let displayedTrucks = 6;
let currentView = 'grid';
let modalManager;

// DOM Elements
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const searchInput = document.getElementById('searchInput');
const cuisineFilter = document.getElementById('cuisineFilter');
const locationFilter = document.getElementById('locationFilter');
const ratingFilter = document.getElementById('ratingFilter');
const trucksContainer = document.getElementById('trucksContainer');
const truckCount = document.getElementById('truckCount');
const filterStatus = document.getElementById('filterStatus');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const contactForm = document.getElementById('contactForm');
const viewBtns = document.querySelectorAll('.view-btn');
const faqItems = document.querySelectorAll('.faq-item');

// Initialize the application
async function init() {
    try {
        // Initialize modal manager
        modalManager = new ModalManager();
        
        // Fetch data (simulating API call)
        await fetchFoodTrucksData();
        
        // Setup page-specific functionality
        setupPageSpecificFunctionality();
        
        // Setup global event listeners
        setupGlobalEventListeners();
        
        // Setup lazy loading
        setupLazyLoading();
        
        // Load user preferences
        loadUserPreferences();
        
        console.log('Sunyani Food Truck Directory initialized successfully!');
        
    } catch (error) {
        console.error('Error initializing application:', error);
        showNotification('Failed to load application data. Please refresh the page.', 'error');
    }
}

// Fetch food trucks data (simulating API call with try-catch)
async function fetchFoodTrucksData() {
    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // In a real application, this would be:
        // const response = await fetch('https://api.example.com/food-trucks');
        // if (!response.ok) throw new Error('Failed to fetch data');
        // foodTrucks = await response.json();
        
        // For now, use local data
        foodTrucks = [...foodTrucksData];
        filteredTrucks = [...foodTrucks];
        
        // Update truck count if on directory page
        if (truckCount) {
            updateTruckCount();
        }
        
        showNotification('Food truck data loaded successfully!', 'success', 3000);
        
    } catch (error) {
        console.error('Error fetching food trucks data:', error);
        showNotification('Failed to load food truck data. Using cached data.', 'warning');
        
        // Fallback to cached data
        foodTrucks = [...foodTrucksData];
        filteredTrucks = [...foodTrucks];
    }
}

// Setup page-specific functionality
function setupPageSpecificFunctionality() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch (currentPage) {
        case 'index.html':
            setupHomePage();
            break;
        case 'directory.html':
            setupDirectoryPage();
            break;
        case 'about.html':
            setupAboutPage();
            break;
        case 'contact.html':
            setupContactPage();
            break;
        case 'form-action.html':
            setupFormActionPage();
            break;
        case 'attributions.html':
            setupAttributionsPage();
            break;
    }
}

// Setup home page functionality
function setupHomePage() {
    // Add click handlers to featured truck cards
    const featuredTruckCards = document.querySelectorAll('.truck-card');
    featuredTruckCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.truck-btn')) {
                const truckId = card.querySelector('.truck-btn')?.href?.split('id=')[1];
                if (truckId) {
                    showTruckDetailsModal(truckId);
                }
            }
        });
    });
    
    // Setup search functionality
    const heroSearch = document.querySelector('.hero-search .search-input');
    if (heroSearch) {
        heroSearch.addEventListener('input', debounce((e) => {
            const searchTerm = e.target.value.toLowerCase();
            if (searchTerm.length >= 2) {
                saveSearchHistory(searchTerm);
            }
        }, 300));
    }
}

// Setup directory page functionality
function setupDirectoryPage() {
    if (!trucksContainer) return;
    
    // Initialize directory
    renderTrucks();
    updateTruckCount();
    setupDirectoryEventListeners();
    
    // Load saved view mode
    const savedViewMode = storage.get(STORAGE_KEYS.VIEW_MODE) || 'grid';
    setViewMode(savedViewMode);
}

// Setup about page functionality
function setupAboutPage() {
    // Add animation to team members
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach((member, index) => {
        member.style.animationDelay = `${index * 0.2}s`;
        member.classList.add('animate-in');
    });
}

// Setup contact page functionality
function setupContactPage() {
    if (!contactForm) return;
    
    // Setup FAQ accordion
    setupFAQAccordion();
    
    // Setup contact form
    setupContactForm();
}

// Setup form action page
function setupFormActionPage() {
    // This will be implemented when we create the form action page
}

// Setup attributions page
function setupAttributionsPage() {
    // This will be implemented when we create the attributions page
}

// Setup global event listeners
function setupGlobalEventListeners() {
    // Navigation toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                smoothScrollTo(target, 80);
            }
        });
    });
}

// Setup directory page event listeners
function setupDirectoryEventListeners() {
    if (!searchInput || !trucksContainer) return;
    
    // Search functionality with debouncing
    searchInput.addEventListener('input', debounce(filterTrucks, 300));
    
    // Filter functionality
    if (cuisineFilter) cuisineFilter.addEventListener('change', filterTrucks);
    if (locationFilter) locationFilter.addEventListener('change', filterTrucks);
    if (ratingFilter) ratingFilter.addEventListener('change', filterTrucks);
    
    // Load more functionality
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMore);
    }

    // View toggle
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const viewMode = btn.dataset.view;
            setViewMode(viewMode);
        });
    });
}

// Filter trucks using array methods
function filterTrucks() {
    const searchTerm = searchInput.value.toLowerCase();
    const cuisine = cuisineFilter?.value || '';
    const location = locationFilter?.value || '';
    const rating = parseFloat(ratingFilter?.value) || 0;

    // Use array filter method
    filteredTrucks = foodTrucks.filter(truck => {
        const matchesSearch = truck.name.toLowerCase().includes(searchTerm) ||
                            truck.cuisine.toLowerCase().includes(searchTerm) ||
                            truck.specialty.toLowerCase().includes(searchTerm) ||
                            truck.description.toLowerCase().includes(searchTerm);
        const matchesCuisine = !cuisine || truck.cuisine.toLowerCase().includes(cuisine);
        const matchesLocation = !location || truck.location.toLowerCase().includes(location);
        const matchesRating = truck.rating >= rating;

        return matchesSearch && matchesCuisine && matchesLocation && matchesRating;
    });

    displayedTrucks = 6;
    renderTrucks();
    updateTruckCount();
    updateFilterStatus();
    
    // Save search term to history
    if (searchTerm) {
        saveSearchHistory(searchTerm);
    }
}

// Render trucks using template literals
function renderTrucks() {
    if (!trucksContainer) return;
    
    const trucksToShow = filteredTrucks.slice(0, displayedTrucks);
    
    // Use array map method
    const truckCardsHTML = trucksToShow.map(truck => createTruckCard(truck)).join('');
    
    trucksContainer.innerHTML = truckCardsHTML;
    
    // Add event listeners to new cards
    addTruckCardEventListeners();
    
    // Update load more button
    if (loadMoreBtn) {
        loadMoreBtn.style.display = displayedTrucks >= filteredTrucks.length ? 'none' : 'block';
    }
}

// Create truck card using template literals
function createTruckCard(truck) {
    const stars = generateStars(truck.rating);
    const isFav = isFavorite(truck.id);
    
    return `
        <div class="truck-card ${currentView === 'list' ? 'truck-card-list' : ''}" data-truck-id="${truck.id}">
            <div class="truck-image">
                <img src="${truck.image}" alt="${truck.name}" loading="lazy">
                <div class="truck-badge">${truck.badge}</div>
                <button class="favorite-btn ${isFav ? 'favorited' : ''}" aria-label="${isFav ? 'Remove from favorites' : 'Add to favorites'}">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="truck-content">
                <h3>${truck.name}</h3>
                <p class="truck-cuisine">${truck.cuisine} • ${truck.specialty}</p>
                <div class="truck-rating">
                    ${stars}
                    <span>${truck.rating} (${truck.reviews} reviews)</span>
                </div>
                <div class="truck-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${truck.location}</span>
                </div>
                <div class="truck-details">
                    <p><strong>Hours:</strong> ${truck.hours}</p>
                    <p><strong>Price:</strong> ${truck.price}</p>
                </div>
                <div class="truck-actions">
                    <button class="truck-btn view-details-btn" data-truck-id="${truck.id}">View Details</button>
                    <button class="truck-btn contact-btn" data-truck-id="${truck.id}">Contact</button>
                </div>
            </div>
        </div>
    `;
}

// Add event listeners to truck cards
function addTruckCardEventListeners() {
    const truckCards = document.querySelectorAll('.truck-card');
    
    truckCards.forEach(card => {
        const truckId = card.dataset.truckId;
        
        // Favorite button
        const favoriteBtn = card.querySelector('.favorite-btn');
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite(truckId, favoriteBtn);
            });
        }
        
        // View details button
        const viewDetailsBtn = card.querySelector('.view-details-btn');
        if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showTruckDetailsModal(truckId);
            });
        }
        
        // Contact button
        const contactBtn = card.querySelector('.contact-btn');
        if (contactBtn) {
            contactBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showContactModal(truckId);
            });
        }
    });
}

// Toggle favorite status
function toggleFavorite(truckId, button) {
    const isFav = isFavorite(truckId);
    
    if (isFav) {
        removeFromFavorites(truckId);
        button.classList.remove('favorited');
        button.setAttribute('aria-label', 'Add to favorites');
        showNotification('Removed from favorites', 'info', 2000);
    } else {
        addToFavorites(truckId);
        button.classList.add('favorited');
        button.setAttribute('aria-label', 'Remove from favorites');
        showNotification('Added to favorites', 'success', 2000);
    }
}

// Show truck details modal
function showTruckDetailsModal(truckId) {
    const truck = foodTrucks.find(t => t.id === truckId);
    if (!truck) return;
    
    const content = `
        <div class="truck-details-modal">
            <div class="truck-details-header">
                <img src="${truck.image}" alt="${truck.name}" class="truck-detail-image">
                <div class="truck-detail-info">
                    <h3>${truck.name}</h3>
                    <p class="truck-cuisine">${truck.cuisine} • ${truck.specialty}</p>
                    <div class="truck-rating">
                        ${generateStars(truck.rating)}
                        <span>${truck.rating} (${truck.reviews} reviews)</span>
                    </div>
                </div>
            </div>
            <div class="truck-details-body">
                <p><strong>Description:</strong> ${truck.description}</p>
                <p><strong>Location:</strong> ${truck.location}</p>
                <p><strong>Hours:</strong> ${truck.hours}</p>
                <p><strong>Price Range:</strong> ${truck.price}</p>
                <p><strong>Phone:</strong> <a href="tel:${truck.phone}">${formatPhoneNumber(truck.phone)}</a></p>
                <p><strong>Email:</strong> <a href="mailto:${truck.email}">${truck.email}</a></p>
                
                <div class="menu-section">
                    <h4>Popular Menu Items:</h4>
                    <ul>
                        ${truck.menu.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    const modal = modalManager.createModal(
        'truck-details-modal',
        truck.name,
        content,
        [
            { text: 'Contact Truck', action: 'contact', class: 'btn-primary' },
            { text: 'Close', action: 'close', class: 'btn-secondary' }
        ]
    );
    
    modal.addEventListener('modalAction', (e) => {
        if (e.detail.action === 'contact') {
            modalManager.hide(modal);
            showContactModal(truckId);
        }
    });
    
    modalManager.show(modal);
}

// Show contact modal
function showContactModal(truckId) {
    const truck = foodTrucks.find(t => t.id === truckId);
    if (!truck) return;
    
    const content = `
        <div class="contact-truck-modal">
            <h4>Contact ${truck.name}</h4>
            <div class="contact-info">
                <p><i class="fas fa-phone"></i> <a href="tel:${truck.phone}">${formatPhoneNumber(truck.phone)}</a></p>
                <p><i class="fas fa-envelope"></i> <a href="mailto:${truck.email}">${truck.email}</a></p>
                <p><i class="fas fa-map-marker-alt"></i> ${truck.location}</p>
                <p><i class="fas fa-clock"></i> ${truck.hours}</p>
            </div>
            <div class="contact-form">
                <h5>Send a Message</h5>
                <form id="truckContactForm">
                    <div class="form-group">
                        <label for="contactName">Your Name *</label>
                        <input type="text" id="contactName" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="contactEmail">Your Email *</label>
                        <input type="email" id="contactEmail" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="contactMessage">Message *</label>
                        <textarea id="contactMessage" name="message" rows="4" required placeholder="Your message to ${truck.name}..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Send Message</button>
                </form>
            </div>
        </div>
    `;
    
    const modal = modalManager.createModal(
        'contact-truck-modal',
        `Contact ${truck.name}`,
        content,
        [
            { text: 'Close', action: 'close', class: 'btn-secondary' }
        ]
    );
    
    // Handle form submission
    modal.addEventListener('DOMContentLoaded', () => {
        const form = modal.querySelector('#truckContactForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                handleTruckContactForm(form, truck);
            });
        }
    });
    
    modalManager.show(modal);
}

// Handle truck contact form
function handleTruckContactForm(form, truck) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (!data.name || !data.email || !data.message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    if (!validateEmail(data.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Simulate form submission
    showNotification(`Message sent to ${truck.name}! They will get back to you soon.`, 'success');
    form.reset();
}

// Update truck count
function updateTruckCount() {
    if (!truckCount) return;
    
    const count = Math.min(displayedTrucks, filteredTrucks.length);
    const total = filteredTrucks.length;
    truckCount.textContent = `Showing ${count} of ${total} food trucks`;
}

// Update filter status
function updateFilterStatus() {
    if (!filterStatus) return;
    
    const activeFilters = [];
    if (searchInput?.value) activeFilters.push(`Search: "${searchInput.value}"`);
    if (cuisineFilter?.value) activeFilters.push(`Cuisine: ${cuisineFilter.value}`);
    if (locationFilter?.value) activeFilters.push(`Location: ${locationFilter.value}`);
    if (ratingFilter?.value) activeFilters.push(`Rating: ${ratingFilter.value}+`);

    if (activeFilters.length > 0) {
        filterStatus.textContent = `Filters: ${activeFilters.join(', ')}`;
    } else {
        filterStatus.textContent = '';
    }
}

// Load more trucks
function loadMore() {
    displayedTrucks += 6;
    renderTrucks();
    updateTruckCount();
}

// Set view mode
function setViewMode(mode) {
    currentView = mode;
    
    // Update button states
    viewBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === mode);
    });
    
    // Update container class
    if (trucksContainer) {
        trucksContainer.className = `trucks-container ${mode}-view`;
    }
    
    // Save preference
    storage.set(STORAGE_KEYS.VIEW_MODE, mode);
    
    // Re-render trucks
    renderTrucks();
}

// Setup FAQ accordion
function setupFAQAccordion() {
    if (!faqItems.length) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-question i');
        
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherAnswer = otherItem.querySelector('.faq-answer');
                const otherIcon = otherItem.querySelector('.faq-question i');
                if (otherAnswer) otherAnswer.style.maxHeight = '0px';
                if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
            });
            
            // Toggle current item
            if (!isOpen) {
                item.classList.add('active');
                if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
                if (icon) icon.style.transform = 'rotate(180deg)';
            }
        });
    });
}

// Setup contact form
function setupContactForm() {
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!data.name || !data.email || !data.subject || !data.message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        if (!validateEmail(data.email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Save form data to localStorage
        localStorage.setItem('contactFormData', JSON.stringify(data));
        
        // Simulate form submission
        showNotification('Thank you! Your message has been sent successfully.', 'success');
        this.reset();
        
        // Redirect to form action page
        setTimeout(() => {
            window.location.href = 'form-action.html';
        }, 2000);
    });
}

// Load user preferences
function loadUserPreferences() {
    const preferences = getUserPreferences();
    
    // Apply theme if different from default
    if (preferences.theme !== 'light') {
        document.body.classList.add(`theme-${preferences.theme}`);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 