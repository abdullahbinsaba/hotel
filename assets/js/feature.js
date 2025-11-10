// ===== POOL SPECIFIC FUNCTIONALITY =====
function initializePoolPage() {
    console.log('Pool page initialized');
    setupPoolBooking();
    setupPoolGallery();
    setupPoolFeatures();
}

function setupPoolBooking() {
    const poolBookingForm = document.querySelector('.pool-booking-form');
    if (poolBookingForm) {
        poolBookingForm.addEventListener('submit', handlePoolBooking);
    }

    // Set minimum date for pool booking
    const poolDateInput = document.getElementById('pool-date');
    if (poolDateInput) {
        const today = new Date().toISOString().split('T')[0];
        poolDateInput.min = today;
    }
}

function handlePoolBooking(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Validate pool booking
    if (!data['pool-date'] || !data['pool-time'] || !data['pool-guests']) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Simulate pool booking
    const bookingId = generatePoolBookingId();
    const bookingData = {
        id: bookingId,
        type: 'pool',
        date: data['pool-date'],
        time: data['pool-time'],
        guests: data['pool-guests'],
        timestamp: new Date().toISOString(),
        status: 'confirmed'
    };

    bookings.push(bookingData);
    saveUserData();
    
    showNotification(`Pool session booked successfully! Booking ID: ${bookingId}`, 'success');
    e.target.reset();
    
    console.log('Pool booking submitted:', bookingData);
}

function generatePoolBookingId() {
    return 'POOL' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 3).toUpperCase();
}

function setupPoolGallery() {
    // Pool-specific gallery initialization
    const poolGalleryItems = document.querySelectorAll('.pool-gallery .gallery-item');
    if (poolGalleryItems.length > 0) {
        console.log('Pool gallery initialized with', poolGalleryItems.length, 'items');
    }
}

function setupPoolFeatures() {
    // Pool features interactive elements
    const featureCards = document.querySelectorAll('.pool-features .feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Scroll to section function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Initialize pool page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePoolPage();
});
// ===== PARK SPECIFIC FUNCTIONALITY =====
function initializeParkPage() {
    console.log('Park page initialized');
    setupParkActivities();
    setupParkGallery();
    setupParkFeatures();
    setupParkRules();
}

function setupParkActivities() {
    const activityCards = document.querySelectorAll('.activity-card');
    activityCards.forEach(card => {
        card.addEventListener('click', function() {
            const activityName = this.querySelector('h3').textContent;
            const activityTime = this.querySelector('.activity-time').textContent;
            
            showNotification(`Activity: ${activityName} at ${activityTime}`, 'info');
        });
    });
}

function setupParkGallery() {
    // Park-specific gallery initialization
    const parkGalleryItems = document.querySelectorAll('.park-gallery .gallery-item');
    if (parkGalleryItems.length > 0) {
        console.log('Park gallery initialized with', parkGalleryItems.length, 'items');
    }
}

function setupParkFeatures() {
    // Park features interactive elements
    const featureItems = document.querySelectorAll('.park-features .feature-item');
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.feature-icon');
            icon.style.transform = 'scale(1.1)';
            icon.style.transition = 'transform 0.3s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.feature-icon');
            icon.style.transform = 'scale(1)';
        });
    });
}

function setupParkRules() {
    // Park rules interactive display
    const ruleItems = document.querySelectorAll('.park-rules .rule-item');
    ruleItems.forEach(item => {
        item.addEventListener('click', function() {
            const ruleTitle = this.querySelector('h4').textContent;
            const ruleDescription = this.querySelector('p').textContent;
            
            // Show detailed rule information
            showNotification(`${ruleTitle}: ${ruleDescription}`, 'info');
        });
    });
}

// Weather simulation for park
function simulateParkWeather() {
    const weatherConditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'];
    const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    
    const weatherElement = document.createElement('div');
    weatherElement.className = 'weather-info';
    weatherElement.innerHTML = `
        <div class="weather-content">
            <i class="fas fa-sun"></i>
            <span>Current Park Weather: ${randomWeather}</span>
        </div>
    `;
    
    weatherElement.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: rgba(52, 152, 219, 0.9);
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        z-index: 9999;
        font-size: 14px;
    `;
    
    document.body.appendChild(weatherElement);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (weatherElement.parentNode) {
            weatherElement.remove();
        }
    }, 5000);
}

// Initialize park page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeParkPage();
    // Simulate weather after a delay
    setTimeout(simulateParkWeather, 2000);
});
// ===== KARTING SPECIFIC FUNCTIONALITY =====
function initializeKartingPage() {
    console.log('Karting page initialized');
    setupKartingBooking();
    setupKartingGallery();
    setupKartingSafety();
    setupKartingPackages();
}

function setupKartingBooking() {
    const bookingCards = document.querySelectorAll('.booking-card .btn');
    bookingCards.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.booking-card');
            const packageName = card.querySelector('h3').textContent;
            const packagePrice = card.querySelector('.price').textContent;
            
            handleKartingPackageBooking(packageName, packagePrice);
        });
    });
}

function handleKartingPackageBooking(packageName, packagePrice) {
    // Simulate karting package booking
    const bookingId = generateKartingBookingId();
    const bookingData = {
        id: bookingId,
        type: 'karting',
        package: packageName,
        price: packagePrice,
        timestamp: new Date().toISOString(),
        status: 'confirmed'
    };

    bookings.push(bookingData);
    saveUserData();
    
    showNotification(`Karting package booked! ${packageName} for ${packagePrice}. Booking ID: ${bookingId}`, 'success');
    
    console.log('Karting booking submitted:', bookingData);
}

function generateKartingBookingId() {
    return 'KART' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 3).toUpperCase();
}

function setupKartingGallery() {
    // Karting-specific gallery initialization
    const kartingGalleryItems = document.querySelectorAll('.karting-gallery .gallery-item');
    if (kartingGalleryItems.length > 0) {
        console.log('Karting gallery initialized with', kartingGalleryItems.length, 'items');
    }
}

function setupKartingSafety() {
    // Karting safety rules interactive display
    const ruleItems = document.querySelectorAll('.karting-rules .rule-item');
    ruleItems.forEach(item => {
        item.addEventListener('click', function() {
            const ruleTitle = this.querySelector('h4').textContent;
            const ruleDescription = this.querySelector('p').textContent;
            
            // Show safety rule in a more prominent way
            const safetyModal = document.createElement('div');
            safetyModal.className = 'safety-modal';
            safetyModal.innerHTML = `
                <div class="safety-content">
                    <h3>Safety Rule: ${ruleTitle}</h3>
                    <p>${ruleDescription}</p>
                    <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">Understood</button>
                </div>
            `;
            
            safetyModal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            `;
            
            safetyModal.querySelector('.safety-content').style.cssText = `
                background: white;
                padding: 2rem;
                border-radius: 10px;
                max-width: 400px;
                text-align: center;
            `;
            
            document.body.appendChild(safetyModal);
        });
    });
}

function setupKartingPackages() {
    // Add hover effects to package cards
    const packageCards = document.querySelectorAll('.booking-card');
    packageCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('featured')) {
                this.style.transform = 'translateY(-10px)';
                this.style.boxShadow = '0 15px 30px rgba(0,0,0,0.2)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('featured')) {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
            }
        });
    });
}

// Lap time simulator
function simulateLapTime() {
    const lapTime = (Math.random() * 10 + 40).toFixed(2); // Random time between 40-50 seconds
    showNotification(`Fastest lap on track: ${lapTime} seconds! Can you beat it?`, 'info');
}

// Initialize karting page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeKartingPage();
    // Simulate lap time after a delay
    setTimeout(simulateLapTime, 3000);
});