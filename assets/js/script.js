// ===== GLOBAL VARIABLES =====
let currentUser = null;
let cart = [];
let bookings = [];

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadUserData();
});

// ===== INITIALIZATION =====
function initializeApp() {
    console.log('ApexStay Hotel Management System initialized');
    
    // Initialize animations
    initAnimations();
    
    // Initialize date pickers
    initDatePickers();
    
    // Initialize image lazy loading
    initLazyLoading();
    
    // Check authentication status
    checkAuthStatus();
}

// ===== EVENT LISTENERS SETUP =====
function setupEventListeners() {
    // Navigation
    setupNavigation();
    
    // Forms
    setupFormHandlers();
    
    // Room functionality
    setupRoomFeatures();
    
    // Gallery functionality
    setupGallery();
    
    // Restaurant functionality
    setupRestaurant();
    
    // Booking functionality
    setupBookingSystem();
}

// ===== NAVIGATION =====
function setupNavigation() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Toggle body scroll
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        });
    }
    
    // Close mobile menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // Dropdown functionality
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', function() {
            this.classList.add('active');
        });
        
        dropdown.addEventListener('mouseleave', function() {
            this.classList.remove('active');
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== ANIMATIONS =====
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.room-card, .feature, .gallery-item, .menu-item');
    animatedElements.forEach(el => observer.observe(el));
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(44, 62, 80, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'linear-gradient(135deg, var(--primary-color), var(--dark-color))';
            navbar.style.backdropFilter = 'blur(0px)';
        }
    });
}

// ===== FORM HANDLING =====
function setupFormHandlers() {
    // Contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Booking forms
    const bookingForms = document.querySelectorAll('.booking-form, .dining-form, .reservation-form');
    bookingForms.forEach(form => {
        form.addEventListener('submit', handleBookingSubmit);
    });
    
    // Login/Register forms
    setupAuthForms();
}

function handleContactSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Simulate form submission
    showNotification('Thank you for your message! We will get back to you soon.', 'success');
    e.target.reset();
    
    // Log contact for demo
    console.log('Contact form submitted:', data);
}

function handleBookingSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Validate dates
    if (data.checkin && data.checkout) {
        const checkin = new Date(data.checkin);
        const checkout = new Date(data.checkout);
        
        if (checkout <= checkin) {
            showNotification('Check-out date must be after check-in date', 'error');
            return;
        }
    }
    
    // Simulate booking process
    const bookingId = generateBookingId();
    bookings.push({
        id: bookingId,
        ...data,
        timestamp: new Date().toISOString(),
        status: 'confirmed'
    });
    
    showNotification(`Booking confirmed! Your reservation ID is: ${bookingId}`, 'success');
    e.target.reset();
    
    // Update local storage
    saveUserData();
    
    console.log('Booking submitted:', data);
}

// ===== ROOM FUNCTIONALITY =====
function setupRoomFeatures() {
    // Room type switching
    const roomButtons = document.querySelectorAll('.room-type-btn');
    const roomDetails = document.querySelectorAll('.room-details');
    
    if (roomButtons.length > 0) {
        roomButtons.forEach(button => {
            button.addEventListener('click', function() {
                const roomType = this.getAttribute('data-room-type');
                
                // Update active button
                roomButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Show corresponding room details
                roomDetails.forEach(detail => {
                    detail.classList.remove('active');
                    if (detail.id === `${roomType}-details`) {
                        detail.classList.add('active');
                    }
                });
                
                // Update booking form room type
                const roomTypeSelect = document.getElementById('room-type');
                if (roomTypeSelect) {
                    roomTypeSelect.value = roomType;
                    updatePriceSummary();
                }
            });
        });
    }
    
    // Room image gallery
    const thumbnails = document.querySelectorAll('.room-thumbnails img');
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            const mainSrc = this.getAttribute('data-main-src');
            const roomDetails = this.closest('.room-details');
            const mainImg = roomDetails.querySelector('.main-room-image img');
            mainImg.src = mainSrc;
            mainImg.alt = this.alt;
        });
    });
    
    // Price calculation
    setupPriceCalculator();
}

function setupPriceCalculator() {
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    const roomTypeSelect = document.getElementById('room-type');
    const roomQuantity = document.getElementById('room-quantity');
    
    if (checkinInput && checkoutInput && roomTypeSelect) {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        checkinInput.min = today;
        
        // Update checkout min date when checkin changes
        checkinInput.addEventListener('change', function() {
            checkoutInput.min = this.value;
            updatePriceSummary();
        });
        
        checkoutInput.addEventListener('change', updatePriceSummary);
        roomTypeSelect.addEventListener('change', updatePriceSummary);
        if (roomQuantity) roomQuantity.addEventListener('change', updatePriceSummary);
        
        // Initialize price summary
        updatePriceSummary();
    }
}

function updatePriceSummary() {
    const roomTypeSelect = document.getElementById('room-type');
    const roomQuantity = document.getElementById('room-quantity');
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    
    if (!roomTypeSelect || !checkinInput || !checkoutInput) return;
    
    const roomType = roomTypeSelect.value;
    const quantity = parseInt(roomQuantity?.value) || 1;
    const checkin = new Date(checkinInput.value);
    const checkout = new Date(checkoutInput.value);
    
    let roomRate = 0;
    switch(roomType) {
        case 'normal': roomRate = 99; break;
        case 'deluxe': roomRate = 149; break;
        case 'luxury': roomRate = 299; break;
        default: roomRate = 0;
    }
    
    let nights = 0;
    if (checkin && checkout && checkout > checkin) {
        nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
    }
    
    const subtotal = roomRate * nights * quantity;
    const taxes = subtotal * 0.12; // 12% tax
    const total = subtotal + taxes;
    
    // Update display
    const roomRateEl = document.getElementById('room-rate');
    const nightsCountEl = document.getElementById('nights-count');
    const taxesAmountEl = document.getElementById('taxes-amount');
    const totalAmountEl = document.getElementById('total-amount');
    
    if (roomRateEl) roomRateEl.textContent = `$${roomRate * quantity}`;
    if (nightsCountEl) nightsCountEl.textContent = nights;
    if (taxesAmountEl) taxesAmountEl.textContent = `$${taxes.toFixed(2)}`;
    if (totalAmountEl) totalAmountEl.textContent = `$${total.toFixed(2)}`;
}

// ===== GALLERY FUNCTIONALITY =====
function setupGallery() {
    // Gallery filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter items
                galleryItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.opacity = '10';
                        item.style.transform = 'scale(10.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    // Lightbox functionality
    setupLightbox();
}

function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const closeLightbox = document.getElementById('close-lightbox');
    const prevButton = document.getElementById('prev-image');
    const nextButton = document.getElementById('next-image');
    
    if (!lightbox) return;
    
    let currentImageIndex = 0;
    const galleryImages = Array.from(document.querySelectorAll('.gallery-item'));
    
    // Open lightbox
    document.querySelectorAll('.view-image-btn').forEach((button, index) => {
        button.addEventListener('click', function() {
            const galleryItem = this.closest('.gallery-item');
            const image = galleryItem.querySelector('img');
            const title = galleryItem.querySelector('h3').textContent;
            const description = galleryItem.querySelector('p').textContent;
            
            currentImageIndex = galleryImages.indexOf(galleryItem);
            
            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt;
            lightboxTitle.textContent = title;
            lightboxDescription.textContent = description;
            
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close lightbox
    closeLightbox.addEventListener('click', function() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Navigate lightbox
    function showImage(index) {
        if (index < 0) index = galleryImages.length - 1;
        if (index >= galleryImages.length) index = 0;
        
        currentImageIndex = index;
        const galleryItem = galleryImages[index];
        const image = galleryItem.querySelector('img');
        const title = galleryItem.querySelector('h3').textContent;
        const description = galleryItem.querySelector('p').textContent;
        
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
        lightboxTitle.textContent = title;
        lightboxDescription.textContent = description;
    }
    
    prevButton.addEventListener('click', function() {
        showImage(currentImageIndex - 1);
    });
    
    nextButton.addEventListener('click', function() {
        showImage(currentImageIndex + 1);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        } else if (e.key === 'ArrowLeft') {
            showImage(currentImageIndex - 1);
        } else if (e.key === 'ArrowRight') {
            showImage(currentImageIndex + 1);
        }
    });
    
    // Close lightbox when clicking outside image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// ===== RESTAURANT FUNCTIONALITY =====
function setupRestaurant() {
    // Service selection
    const serviceButtons = document.querySelectorAll('.service-btn');
    const orderForms = document.querySelectorAll('.order-form');
    
    if (serviceButtons.length > 0) {
        serviceButtons.forEach(button => {
            button.addEventListener('click', function() {
                const service = this.getAttribute('data-service');
                
                // Update active button
                serviceButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Show corresponding form
                orderForms.forEach(form => {
                    form.classList.remove('active');
                    if (form.id === `${service}-form`) {
                        form.classList.add('active');
                    }
                });
            });
        });
    }
    
    // Menu category tabs
    const categoryTabs = document.querySelectorAll('.category-tab');
    const menuCategories = document.querySelectorAll('.menu-category');
    
    if (categoryTabs.length > 0) {
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                
                // Update active tab
                categoryTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Show corresponding menu
                menuCategories.forEach(menu => {
                    menu.classList.remove('active');
                    if (menu.id === `${category}-menu`) {
                        menu.classList.add('active');
                    }
                });
            });
        });
    }
    
    // Shopping cart functionality
    setupShoppingCart();
}

function setupShoppingCart() {
    let cart = [];
    const orderItems = document.getElementById('order-items');
    const orderTotal = document.getElementById('order-total');
    
    if (!orderItems) return;
    
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const item = this.getAttribute('data-item');
            const price = parseFloat(this.getAttribute('data-price'));
            
            // Add to cart
            cart.push({ item, price });
            updateOrderSummary();
            
            // Visual feedback
            const originalText = this.textContent;
            this.textContent = 'Added!';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
            }, 1500);
        });
    });
    
    function updateOrderSummary() {
        if (cart.length === 0) {
            orderItems.innerHTML = '<p class="empty-order">No items added yet</p>';
            if (orderTotal) orderTotal.textContent = '0';
            return;
        }
    
        let itemsHTML = '';
        let total = 0;
        
        cart.forEach((cartItem, index) => {
            total += cartItem.price;
            itemsHTML += `
                <div class="order-item">
                    <span>${cartItem.item}</span>
                    <span>$${cartItem.price}</span>
                    <button class="remove-item" data-index="${index}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        });
    
        orderItems.innerHTML = itemsHTML;
        if (orderTotal) orderTotal.textContent = total.toFixed(2);
    
        // Add remove functionality
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                updateOrderSummary();
            });
        });
    }
    
    // Form submissions
    const diningForm = document.querySelector('.dining-form');
    const reservationForm = document.querySelector('.reservation-form');
    
    if (diningForm) {
        diningForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (cart.length === 0) {
                showNotification('Please add items to your order first.', 'error');
                return;
            }
            showNotification('Thank you! Your room service order has been placed.', 'success');
            this.reset();
            cart = [];
            updateOrderSummary();
        });
    }
    
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Table reservation confirmed! We look forward to serving you.', 'success');
            this.reset();
        });
    }
}

// ===== AUTHENTICATION SYSTEM =====
function setupAuthForms() {
    // Form switching
    const switchToRegister = document.querySelector('.switch-to-register');
    const switchToLogin = document.querySelector('.switch-to-login');
    const loginForm = document.querySelector('.login-form');
    const registerForm = document.querySelector('.register-form');
    
    if (switchToRegister && switchToLogin) {
        switchToRegister.addEventListener('click', function(e) {
            e.preventDefault();
            if (loginForm) loginForm.classList.remove('active');
            if (registerForm) registerForm.classList.add('active');
        });
        
        switchToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            if (registerForm) registerForm.classList.remove('active');
            if (loginForm) loginForm.classList.add('active');
        });
    }
    
    // Form submissions
    const loginFormContent = document.querySelector('.login-form-content');
    const registerFormContent = document.querySelector('.register-form-content');
    
    if (loginFormContent) {
        loginFormContent.addEventListener('submit', handleLogin);
    }
    
    if (registerFormContent) {
        registerFormContent.addEventListener('submit', handleRegister);
    }
    
    // Social login buttons
    document.querySelectorAll('.social-btn').forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.classList.contains('google-btn') ? 'Google' : 'Facebook';
            showNotification(`${platform} authentication would be implemented here.`, 'info');
        });
    });
}

function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Simple validation
    if (!data.email || !data.password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Simulate login process
    currentUser = {
        email: data.email,
        name: data.email.split('@')[0],
        loginTime: new Date().toISOString()
    };
    
    saveUserData();
    showNotification('Login successful! Welcome back to ApexStay.', 'success');
    
    // Redirect after delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Validation
    if (data.password !== data['confirm-password']) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (!data.terms) {
        showNotification('Please accept the terms and conditions', 'error');
        return;
    }
    
    // Simulate registration
    currentUser = {
        email: data.email,
        name: `${data['first-name']} ${data['last-name']}`,
        phone: data.phone,
        registerTime: new Date().toISOString()
    };
    
    saveUserData();
    showNotification('Account created successfully! Welcome to ApexStay.', 'success');
    
    // Redirect after delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

function checkAuthStatus() {
    const userData = localStorage.getItem('apexstay_user');
    if (userData) {
        currentUser = JSON.parse(userData);
        updateUIForLoggedInUser();
    }
}

function updateUIForLoggedInUser() {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn && currentUser) {
        loginBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
        loginBtn.href = '#';
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showUserMenu();
        });
    }
}

function showUserMenu() {
    // Implement user dropdown menu
    showNotification(`Welcome back, ${currentUser.name}!`, 'info');
}

function logout() {
    currentUser = null;
    localStorage.removeItem('apexstay_user');
    showNotification('You have been logged out', 'info');
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

// ===== BOOKING SYSTEM =====
function setupBookingSystem() {
    // Initialize date pickers
    const reservationDate = document.getElementById('reservation-date');
    if (reservationDate) {
        const today = new Date().toISOString().split('T')[0];
        reservationDate.min = today;
    }
}

function generateBookingId() {
    return 'APX' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 3).toUpperCase();
}

// ===== UTILITY FUNCTIONS =====
function initDatePickers() {
    // Set minimum dates for all date inputs
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    dateInputs.forEach(input => {
        input.min = today;
    });
}

function initLazyLoading() {
    // Simple lazy loading implementation
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationColor(type) {
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    return colors[type] || colors.info;
}

function saveUserData() {
    const userData = {
        currentUser,
        cart,
        bookings,
        lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('apexstay_data', JSON.stringify(userData));
}

function loadUserData() {
    const savedData = localStorage.getItem('apexstay_data');
    if (savedData) {
        const data = JSON.parse(savedData);
        currentUser = data.currentUser || null;
        cart = data.cart || [];
        bookings = data.bookings || [];
    }
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    showNotification('An unexpected error occurred. Please refresh the page.', 'error');
});

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce function for resize events
function debounce(func, wait) {
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

// Optimized resize handler
window.addEventListener('resize', debounce(function() {
    // Handle responsive behavior
    console.log('Window resized - optimizing layout');
}, 250));

// ===== EXPORT FOR MODULAR USE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        setupEventListeners,
        showNotification,
        generateBookingId
    };
}
// ===== POOL AND GYM FUNCTIONALITY FOR HOMEPAGE =====

function initializeHomepageFeatures() {
    console.log('Initializing homepage features...');
    setupPoolTemperature();
    setupFeatureInteractions();
    setupScrollAnimations();
}

// Pool temperature simulation
function setupPoolTemperature() {
    const tempElement = document.getElementById('pool-temp');
    if (!tempElement) return;

    // Initial temperature
    let currentTemp = 28;
    
    // Update temperature every 30 seconds (for demo purposes)
    setInterval(() => {
        // Simulate small temperature fluctuations
        const change = (Math.random() - 0.5) * 2; // -1 to +1
        currentTemp = Math.max(26, Math.min(30, currentTemp + change));
        
        // Add animation class
        tempElement.classList.add('temp-updating');
        
        // Update display
        setTimeout(() => {
            tempElement.textContent = `${currentTemp.toFixed(1)}°C`;
            tempElement.classList.remove('temp-updating');
        }, 250);
    }, 30000);
}

// Interactive features
function setupFeatureInteractions() {
    // Pool feature hover effects
    const poolFeatures = document.querySelectorAll('.pool-feature');
    poolFeatures.forEach(feature => {
        feature.addEventListener('click', function() {
            const featureName = this.querySelector('span').textContent;
            showFeatureInfo(featureName, 'pool');
        });
    });

    // Gym feature hover effects
    const gymFeatures = document.querySelectorAll('.gym-feature');
    gymFeatures.forEach(feature => {
        feature.addEventListener('click', function() {
            const featureName = this.querySelector('span').textContent;
            showFeatureInfo(featureName, 'gym');
        });
    });

    // Status item interactions
    const statusItems = document.querySelectorAll('.status-item');
    statusItems.forEach(item => {
        item.addEventListener('click', function() {
            const label = this.querySelector('.status-label').textContent;
            const value = this.querySelector('.status-value').textContent;
            showNotification(`${label}: ${value}`, 'info');
        });
    });
}

// Show feature information
function showFeatureInfo(featureName, type) {
    const featureInfo = {
        'pool': {
            'Infinity Design': 'Stunning infinity edge with panoramic city skyline views',
            'Temperature Controlled': 'Perfectly maintained water temperature year-round',
            'Swim-up Bar': 'Enjoy refreshing drinks without leaving the pool',
            'Sunset Views': 'Breathtaking sunset views from the pool area'
        },
        'gym': {
            'Strength Training': 'Complete range of free weights and strength machines',
            'Cardio Zone': 'Latest treadmills, ellipticals, and cycling equipment',
            'Group Classes': 'Yoga, Pilates, spinning, and functional training classes',
            'Personal Training': 'Certified trainers for personalized workout plans'
        }
    };

    const info = featureInfo[type]?.[featureName];
    if (info) {
        showNotification(`<strong>${featureName}</strong><br>${info}`, 'info', 5000);
    }
}

// Scroll animations for sections
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe pool and gym sections
    const sections = document.querySelectorAll('.pool-preview, .gym-preview');
    sections.forEach(section => observer.observe(section));
}

// Enhanced notification system for features
function showNotification(message, type = 'info', duration = 3000) {
    // Remove existing feature notifications
    const existingNotifications = document.querySelectorAll('.feature-notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `feature-notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-message">${message}</div>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 350px;
        border-left: 4px solid ${getNotificationBorderColor(type)};
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, duration);
}

function getNotificationColor(type) {
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    return colors[type] || colors.info;
}

function getNotificationBorderColor(type) {
    const colors = {
        success: '#219653',
        error: '#c0392b',
        warning: '#d35400',
        info: '#2980b9'
    };
    return colors[type] || colors.info;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeHomepageFeatures();
    
    // Add custom styles for notifications
    const style = document.createElement('style');
    style.textContent = `
        .feature-notification .notification-content {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
        }
        
        .feature-notification .notification-message {
            flex: 1;
            line-height: 1.5;
        }
        
        .feature-notification .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0;
            width: 25px;
            height: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color 0.3s ease;
        }
        
        .feature-notification .notification-close:hover {
            background: rgba(255,255,255,0.2);
        }
        
        @media (max-width: 768px) {
            .feature-notification {
                right: 10px !important;
                left: 10px !important;
                max-width: none !important;
            }
        }
    `;
    document.head.appendChild(style);
});