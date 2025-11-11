// ===== ADMIN PANEL JAVASCRIPT =====

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminPanel();
    setupEventListeners();
    initializeCharts();
    setupFormValidations();
    setupTabs();
    setupFileUploads();
});

// ===== INITIALIZATION FUNCTIONS =====

function initializeAdminPanel() {
    console.log('Apex Stay Admin Panel Initialized');
    
    // Set current year in footer if exists
    const yearElement = document.querySelector('.current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Check for unsaved changes
    window.addEventListener('beforeunload', function(e) {
        if (hasUnsavedChanges()) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
    
    // Initialize tooltips
    initializeTooltips();
}

function setupEventListeners() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Notification bell
    const notificationBell = document.querySelector('.notification');
    if (notificationBell) {
        notificationBell.addEventListener('click', function() {
            showNotifications();
        });
    }
    
    // Search functionality
    const searchInputs = document.querySelectorAll('.search-box input');
    searchInputs.forEach(input => {
        input.addEventListener('input', debounce(function(e) {
            performSearch(e.target.value);
        }, 300));
    });
    
    // Table row actions
    setupTableActions();
    
    // Status filter changes
    const statusFilters = document.querySelectorAll('.filter-select');
    statusFilters.forEach(filter => {
        filter.addEventListener('change', function() {
            filterTableData(this.value);
        });
    });
    
    // Pagination
    setupPagination();
}

// ===== CHART FUNCTIONS =====

function initializeCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        const revenueChart = new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Revenue',
                    data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
                    borderColor: '#1e40af',
                    backgroundColor: 'rgba(30, 64, 175, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `Revenue: $${context.parsed.y.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Booking Chart
    const bookingCtx = document.getElementById('bookingChart');
    if (bookingCtx) {
        const bookingChart = new Chart(bookingCtx, {
            type: 'bar',
            data: {
                labels: ['Standard', 'Deluxe', 'Executive', 'Suite'],
                datasets: [{
                    label: 'Bookings',
                    data: [45, 60, 35, 20],
                    backgroundColor: [
                        'rgba(30, 64, 175, 0.8)',
                        'rgba(212, 175, 55, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)'
                    ],
                    borderColor: [
                        '#1e40af',
                        '#d4af37',
                        '#10b981',
                        '#f59e0b'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Room Distribution Chart
    const roomCtx = document.getElementById('roomChart');
    if (roomCtx) {
        const roomChart = new Chart(roomCtx, {
            type: 'doughnut',
            data: {
                labels: ['Available', 'Occupied', 'Maintenance', 'Reserved'],
                datasets: [{
                    data: [32, 10, 3, 5],
                    backgroundColor: [
                        '#10b981',
                        '#ef4444',
                        '#f59e0b',
                        '#3b82f6'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                cutout: '70%'
            }
        });
    }
}

// ===== FORM HANDLING =====

function setupFormValidations() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                submitForm(this);
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    });
    
    // Password strength indicator
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.id.includes('password') && !this.id.includes('confirm')) {
                updatePasswordStrength(this.value);
            }
        });
    });
    
    // Confirm password validation
    const confirmPasswordInputs = document.querySelectorAll('input[id*="confirmPassword"]');
    confirmPasswordInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validatePasswordMatch(this);
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Special validations
    const emailFields = form.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
        if (field.value && !isValidEmail(field.value)) {
            showFieldError(field, 'Please enter a valid email address');
            isValid = false;
        }
    });
    
    const phoneFields = form.querySelectorAll('input[type="tel"]');
    phoneFields.forEach(field => {
        if (field.value && !isValidPhone(field.value)) {
            showFieldError(field, 'Please enter a valid phone number');
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    if (field.type === 'tel' && value && !isValidPhone(value)) {
        showFieldError(field, 'Please enter a valid phone number');
        return false;
    }
    
    if (field.type === 'number' && field.hasAttribute('min')) {
        const min = parseFloat(field.getAttribute('min'));
        if (value && parseFloat(value) < min) {
            showFieldError(field, `Value must be at least ${min}`);
            return false;
        }
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ef4444;
        font-size: 0.75rem;
        margin-top: 0.25rem;
    `;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function validatePasswordMatch(confirmField) {
    const passwordField = document.getElementById(confirmField.id.replace('confirm', '').replace('Confirm', ''));
    
    if (passwordField && confirmField.value !== passwordField.value) {
        showFieldError(confirmField, 'Passwords do not match');
        return false;
    }
    
    clearFieldError(confirmField);
    return true;
}

function updatePasswordStrength(password) {
    const strengthBar = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    
    if (!strengthBar || !strengthText) return;
    
    let strength = 0;
    let width = 0;
    let text = 'Very Weak';
    let color = '#ef4444';
    
    // Length check
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    
    // Complexity checks
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    // Calculate width and text
    switch (strength) {
        case 0:
        case 1:
            width = 20;
            text = 'Very Weak';
            color = '#ef4444';
            break;
        case 2:
            width = 40;
            text = 'Weak';
            color = '#f59e0b';
            break;
        case 3:
            width = 60;
            text = 'Fair';
            color = '#f59e0b';
            break;
        case 4:
            width = 80;
            text = 'Good';
            color = '#10b981';
            break;
        case 5:
        case 6:
            width = 100;
            text = 'Strong';
            color = '#10b981';
            break;
    }
    
    strengthBar.style.width = width + '%';
    strengthBar.style.backgroundColor = color;
    strengthText.textContent = text;
    strengthText.style.color = color;
}

// ===== TABLE FUNCTIONS =====

function setupTableActions() {
    // View buttons
    const viewButtons = document.querySelectorAll('.btn-icon.view');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            viewItem(row);
        });
    });
    
    // Edit buttons
    const editButtons = document.querySelectorAll('.btn-icon.edit');
    editButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            editItem(row);
        });
    });
    
    // Delete buttons
    const deleteButtons = document.querySelectorAll('.btn-icon.delete');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            deleteItem(row);
        });
    });
}

function viewItem(row) {
    const itemId = row.cells[0].textContent;
    showModal('View Item', `Viewing details for: ${itemId}`);
}

function editItem(row) {
    const itemId = row.cells[0].textContent;
    showModal('Edit Item', `Editing: ${itemId}`);
}

function deleteItem(row) {
    const itemId = row.cells[0].textContent;
    const itemName = row.cells[1].querySelector('.user-info span').textContent;
    
    showConfirmationModal(
        'Confirm Delete',
        `Are you sure you want to delete "${itemName}" (${itemId})? This action cannot be undone.`,
        function() {
            // Simulate delete action
            row.style.opacity = '0.5';
            row.style.backgroundColor = '#fef2f2';
            
            setTimeout(() => {
                row.remove();
                showToast('Item deleted successfully', 'success');
                updateTableInfo();
            }, 500);
        }
    );
}

function filterTableData(filterValue) {
    const table = document.querySelector('.data-table');
    if (!table) return;
    
    const rows = table.querySelectorAll('tbody tr');
    let visibleCount = 0;
    
    rows.forEach(row => {
        let showRow = true;
        
        if (filterValue && filterValue !== 'All') {
            const statusCell = row.querySelector('.status');
            if (statusCell) {
                const status = statusCell.textContent.toLowerCase();
                const filter = filterValue.toLowerCase();
                showRow = status.includes(filter);
            }
        }
        
        row.style.display = showRow ? '' : 'none';
        if (showRow) visibleCount++;
    });
    
    updateTableInfo(visibleCount);
}

function performSearch(query) {
    const table = document.querySelector('.data-table');
    if (!table) return;
    
    const rows = table.querySelectorAll('tbody tr');
    let visibleCount = 0;
    
    rows.forEach(row => {
        const rowText = row.textContent.toLowerCase();
        const showRow = rowText.includes(query.toLowerCase());
        
        row.style.display = showRow ? '' : 'none';
        if (showRow) visibleCount++;
        
        // Highlight matching text
        if (showRow && query) {
            highlightText(row, query);
        } else {
            removeHighlights(row);
        }
    });
    
    updateTableInfo(visibleCount);
}

function highlightText(element, query) {
    removeHighlights(element);
    
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    let node;
    while (node = walker.nextNode()) {
        const text = node.textContent;
        const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
        const newText = text.replace(regex, '<mark class="search-highlight">$1</mark>');
        
        if (newText !== text) {
            const span = document.createElement('span');
            span.innerHTML = newText;
            node.parentNode.replaceChild(span, node);
        }
    }
}

function removeHighlights(element) {
    const highlights = element.querySelectorAll('.search-highlight');
    highlights.forEach(highlight => {
        const parent = highlight.parentNode;
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        parent.normalize();
    });
}

function setupPagination() {
    const pageButtons = document.querySelectorAll('.page-btn');
    
    pageButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.classList.contains('active')) return;
            
            // Remove active class from all buttons
            pageButtons.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Simulate page change
            const pageNum = this.textContent;
            if (!isNaN(pageNum)) {
                loadPage(parseInt(pageNum));
            }
        });
    });
}

function loadPage(pageNumber) {
    // Simulate loading data for the page
    showToast(`Loading page ${pageNumber}...`, 'info');
    
    // In a real application, you would fetch data for the page
    setTimeout(() => {
        updateTableInfo();
    }, 500);
}

function updateTableInfo(visibleCount = null) {
    const tableInfo = document.querySelector('.table-info');
    if (!tableInfo) return;
    
    const table = document.querySelector('.data-table');
    const totalRows = table ? table.querySelectorAll('tbody tr').length : 0;
    const displayedCount = visibleCount !== null ? visibleCount : totalRows;
    
    tableInfo.textContent = `Showing 1-${displayedCount} of ${totalRows} items`;
}

// ===== TAB SYSTEM =====

function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to current button and content
            this.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
}

// ===== FILE UPLOAD =====

function setupFileUploads() {
    const fileInputs = document.querySelectorAll('.file-upload input[type="file"]');
    
    fileInputs.forEach(input => {
        const fileNameSpan = input.parentNode.querySelector('.file-name');
        
        input.addEventListener('change', function() {
            if (this.files.length > 0) {
                if (this.multiple) {
                    fileNameSpan.textContent = `${this.files.length} files selected`;
                } else {
                    fileNameSpan.textContent = this.files[0].name;
                }
                
                // Validate file type and size
                validateFiles(this.files, this);
            } else {
                fileNameSpan.textContent = 'No file chosen';
            }
        });
    });
}

function validateFiles(files, input) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    
    for (let file of files) {
        if (file.size > maxSize) {
            showToast('File size must be less than 5MB', 'error');
            input.value = '';
            input.parentNode.querySelector('.file-name').textContent = 'No file chosen';
            return;
        }
        
        if (!allowedTypes.includes(file.type)) {
            showToast('Only JPG, PNG, and GIF files are allowed', 'error');
            input.value = '';
            input.parentNode.querySelector('.file-name').textContent = 'No file chosen';
            return;
        }
    }
}

// ===== MODAL SYSTEM =====

function showModal(title, content) {
    // Remove existing modal
    const existingModal = document.getElementById('admin-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = 'admin-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div class="modal-content" style="
            background: white;
            padding: 2rem;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        ">
            <div class="modal-header" style="
                display: flex;
                justify-content: between;
                align-items: center;
                margin-bottom: 1rem;
            ">
                <h3 style="margin: 0; color: #1e293b;">${title}</h3>
                <button class="modal-close" style="
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #64748b;
                ">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal on X click
    modal.querySelector('.modal-close').addEventListener('click', function() {
        modal.remove();
    });
    
    // Close modal on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function showConfirmationModal(title, message, confirmCallback) {
    const modal = document.createElement('div');
    modal.id = 'confirmation-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div class="modal-content" style="
            background: white;
            padding: 2rem;
            border-radius: 12px;
            max-width: 400px;
            width: 90%;
            text-align: center;
        ">
            <h3 style="margin: 0 0 1rem 0; color: #1e293b;">${title}</h3>
            <p style="margin: 0 0 2rem 0; color: #64748b;">${message}</p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button class="btn btn-secondary" id="confirm-cancel">Cancel</button>
                <button class="btn btn-primary" id="confirm-ok" style="background: #ef4444;">Delete</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('#confirm-ok').addEventListener('click', function() {
        confirmCallback();
        modal.remove();
    });
    
    modal.querySelector('#confirm-cancel').addEventListener('click', function() {
        modal.remove();
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// ===== NOTIFICATION SYSTEM =====

function showNotifications() {
    // Simulate fetching notifications
    const notifications = [
        { id: 1, message: 'New booking received', type: 'info', time: '2 min ago' },
        { id: 2, message: 'Room 201 check-out reminder', type: 'warning', time: '1 hour ago' },
        { id: 3, message: 'Staff shift change notification', type: 'info', time: '3 hours ago' }
    ];
    
    showModal('Notifications', `
        <div class="notifications-list">
            ${notifications.map(notif => `
                <div class="notification-item" style="
                    padding: 1rem;
                    border-bottom: 1px solid #e2e8f0;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                ">
                    <div class="notification-icon" style="
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        background: ${notif.type === 'warning' ? '#f59e0b' : '#3b82f6'};
                    "></div>
                    <div style="flex: 1;">
                        <p style="margin: 0; color: #1e293b;">${notif.message}</p>
                        <small style="color: #64748b;">${notif.time}</small>
                    </div>
                </div>
            `).join('')}
        </div>
    `);
}

function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10001;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 5000);
    
    // Click to dismiss
    toast.addEventListener('click', function() {
        this.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (this.parentNode) {
                this.remove();
            }
        }, 300);
    });
}

// ===== UTILITY FUNCTIONS =====

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

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hasUnsavedChanges() {
    const forms = document.querySelectorAll('form');
    for (let form of forms) {
        if (form.classList.contains('dirty')) {
            return true;
        }
    }
    return false;
}

function initializeTooltips() {
    const elementsWithTitle = document.querySelectorAll('[title]');
    elementsWithTitle.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = this.getAttribute('title');
    tooltip.style.cssText = `
        position: absolute;
        background: #1e293b;
        color: white;
        padding: 0.5rem 0.75rem;
        border-radius: 6px;
        font-size: 0.75rem;
        z-index: 1000;
        white-space: nowrap;
        pointer-events: none;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = this.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
    
    this._tooltip = tooltip;
}

function hideTooltip() {
    if (this._tooltip) {
        this._tooltip.remove();
        this._tooltip = null;
    }
}

// ===== FORM SUBMISSION SIMULATION =====

function submitForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        showToast('Form submitted successfully!', 'success');
        
        // Reset form
        form.reset();
        form.classList.remove('dirty');
        
        // Reset file names
        const fileNames = form.querySelectorAll('.file-name');
        fileNames.forEach(span => {
            span.textContent = 'No file chosen';
        });
        
    }, 2000);
}

// ===== EXPORT FUNCTIONS (for global access if needed) =====

window.AdminPanel = {
    showToast,
    showModal,
    showConfirmationModal,
    validateForm,
    filterTableData,
    performSearch
};

// Add CSS for search highlights
const style = document.createElement('style');
style.textContent = `
    .search-highlight {
        background-color: #fef3c7;
        padding: 0.1rem 0.2rem;
        border-radius: 0.25rem;
    }
    
    .field-error {
        color: #ef4444;
        font-size: 0.75rem;
        margin-top: 0.25rem;
    }
    
    input.error, select.error, textarea.error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    
    .mobile-menu-btn {
        display: none;
    }
    
    @media (max-width: 768px) {
        .mobile-menu-btn {
            display: block;
            position: fixed;
            top: 1rem;
            left: 1rem;
            z-index: 1001;
            background: #1e40af;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 0.5rem;
            cursor: pointer;
        }
    }
`;
document.head.appendChild(style);