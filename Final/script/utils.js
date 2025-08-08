// Utility Functions - ES Module
import { storage, STORAGE_KEYS } from './data.js';

// Generate star rating HTML
export function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Modal Dialog Management
export class ModalManager {
    constructor() {
        this.activeModal = null;
        this.init();
    }

    init() {
        // Create modal container if it doesn't exist
        if (!document.getElementById('modal-container')) {
            const modalContainer = document.createElement('div');
            modalContainer.id = 'modal-container';
            modalContainer.className = 'modal-container';
            document.body.appendChild(modalContainer);
        }

        // Add modal styles
        this.addModalStyles();
    }

    createModal(id, title, content, buttons = []) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = id;
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', `${id}-title`);
        modal.setAttribute('aria-modal', 'true');

        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="${id}-title">${title}</h2>
                    <button class="modal-close" aria-label="Close modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                ${buttons.length > 0 ? `
                    <div class="modal-footer">
                        ${buttons.map(btn => `
                            <button class="btn ${btn.class || 'btn-secondary'}" data-action="${btn.action}">
                                ${btn.text}
                            </button>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        return modal;
    }

    show(modal) {
        const container = document.getElementById('modal-container');
        container.appendChild(modal);
        
        // Focus management
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        // Trap focus within modal
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
            if (e.key === 'Escape') {
                this.hide(modal);
            }
        });

        // Close button functionality
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide(modal));
        }

        // Overlay click to close
        const overlay = modal.querySelector('.modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.hide(modal));
        }

        // Button actions
        const actionButtons = modal.querySelectorAll('[data-action]');
        actionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                if (action === 'close') {
                    this.hide(modal);
                }
                // Dispatch custom event for other actions
                modal.dispatchEvent(new CustomEvent('modalAction', {
                    detail: { action, button: e.target }
                }));
            });
        });

        // Show modal with animation
        requestAnimationFrame(() => {
            modal.classList.add('show');
            firstFocusable?.focus();
        });

        this.activeModal = modal;
        return modal;
    }

    hide(modal) {
        if (!modal) return;
        
        modal.classList.remove('show');
        modal.addEventListener('transitionend', () => {
            modal.remove();
            this.activeModal = null;
        }, { once: true });
    }

    addModalStyles() {
        const styles = `
            .modal-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: none;
            }
            
            .modal-container .modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s ease, visibility 0.3s ease;
            }
            
            .modal.show {
                opacity: 1;
                visibility: visible;
            }
            
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                cursor: pointer;
            }
            
            .modal-content {
                background: white;
                border-radius: 8px;
                max-width: 90%;
                max-height: 90%;
                overflow-y: auto;
                position: relative;
                z-index: 1;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }
            
            .modal.show .modal-content {
                transform: scale(1);
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #eee;
            }
            
            .modal-header h2 {
                margin: 0;
                font-size: 1.5rem;
                color: #333;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #666;
                padding: 5px;
                border-radius: 4px;
                transition: background-color 0.2s ease;
            }
            
            .modal-close:hover {
                background-color: #f0f0f0;
            }
            
            .modal-body {
                padding: 20px;
            }
            
            .modal-footer {
                padding: 20px;
                border-top: 1px solid #eee;
                display: flex;
                gap: 10px;
                justify-content: flex-end;
            }
            
            .btn {
                padding: 10px 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 1rem;
                transition: background-color 0.2s ease;
            }
            
            .btn-primary {
                background-color: #FF6B35;
                color: white;
            }
            
            .btn-primary:hover {
                background-color: #E55A2B;
            }
            
            .btn-secondary {
                background-color: #6c757d;
                color: white;
            }
            
            .btn-secondary:hover {
                background-color: #5a6268;
            }
            
            @media (max-width: 768px) {
                .modal-content {
                    max-width: 95%;
                    margin: 20px;
                }
                
                .modal-header,
                .modal-body,
                .modal-footer {
                    padding: 15px;
                }
            }
        `;

        if (!document.getElementById('modal-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'modal-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
    }
}

// Notification System
export function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    
    const iconMap = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };

    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${iconMap[type] || 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" aria-label="Close notification">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after duration
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, duration);
    
    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    });
}

// Debounce function for search
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Format phone number
export function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phone;
}

// Validate email
export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Get user preferences from localStorage
export function getUserPreferences() {
    return storage.get(STORAGE_KEYS.USER_PREFERENCES) || {
        theme: 'light',
        language: 'en',
        notifications: true
    };
}

// Save user preferences to localStorage
export function saveUserPreferences(preferences) {
    return storage.set(STORAGE_KEYS.USER_PREFERENCES, preferences);
}

// Get favorites from localStorage
export function getFavorites() {
    return storage.get(STORAGE_KEYS.FAVORITES) || [];
}

// Add to favorites
export function addToFavorites(truckId) {
    const favorites = getFavorites();
    if (!favorites.includes(truckId)) {
        favorites.push(truckId);
        storage.set(STORAGE_KEYS.FAVORITES, favorites);
        return true;
    }
    return false;
}

// Remove from favorites
export function removeFromFavorites(truckId) {
    const favorites = getFavorites();
    const index = favorites.indexOf(truckId);
    if (index > -1) {
        favorites.splice(index, 1);
        storage.set(STORAGE_KEYS.FAVORITES, favorites);
        return true;
    }
    return false;
}

// Check if truck is in favorites
export function isFavorite(truckId) {
    const favorites = getFavorites();
    return favorites.includes(truckId);
}

// Save search history
export function saveSearchHistory(searchTerm) {
    if (!searchTerm.trim()) return;
    
    const history = storage.get(STORAGE_KEYS.SEARCH_HISTORY) || [];
    const newHistory = [searchTerm, ...history.filter(term => term !== searchTerm)].slice(0, 10);
    storage.set(STORAGE_KEYS.SEARCH_HISTORY, newHistory);
}

// Get search history
export function getSearchHistory() {
    return storage.get(STORAGE_KEYS.SEARCH_HISTORY) || [];
}

// Clear search history
export function clearSearchHistory() {
    storage.remove(STORAGE_KEYS.SEARCH_HISTORY);
}

// Lazy loading for images
export function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Smooth scrolling
export function smoothScrollTo(element, offset = 0) {
    const targetPosition = element.offsetTop - offset;
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// Format currency
export function formatCurrency(amount, currency = 'GHS') {
    return new Intl.NumberFormat('en-GH', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

// Format date
export function formatDate(date) {
    return new Intl.DateTimeFormat('en-GH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
} 