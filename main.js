document.addEventListener("DOMContentLoaded", function() {
    // Function to show notifications
    function showNotification(message, type) {
        const notificationContainer = document.getElementById("notification-container");
        if (!notificationContainer) {
            console.warn("Notification container not found!");
            return;
        }

        const notification = document.createElement("div");
        notification.className = `notification ${type}`;
        notification.textContent = message;

        notificationContainer.appendChild(notification);

        // Auto-hide after 3 seconds
        setTimeout(() => {
            notification.classList.add("hide");
            notification.addEventListener("transitionend", () => {
                notification.remove();
            });
        }, 3000);
    }

    // User credentials and roles
    const users = {
        'aymanjassoum': {
            password: 'jkl452691',
            role: 'admin',
            email: 'admin@example.com'
        }
    };

    // Device database (in real app, this would be in backend)
    let devices = [];
    let currentUser = null;
    let html5QrCode = null;
    let darkMode = false;
    let socialLinks = {
        facebook: '#',
        twitter: '#',
        instagram: '#',
        whatsapp: '#'
    };
    
    // Financial system data
    let transactions = [];
    let cashBox = { balance: 0, currency: 'USD' };
    let customerAccounts = {};
    
    // Products data for shopping section
    let products = [
        {
            id: 1,
            name: 'iPhone 14 Pro',
            price: 1200,
            currency: 'USD',
            category: 'iPhone',
            condition: 'جديد',
            image: 'https://via.placeholder.com/300x200?text=iPhone+14+Pro',
            specs: 'شاشة 6.1 بوصة، كاميرا 48 ميجابكسل، 128GB',
            stock: 5,
            rating: 4.8,
            discount: 0
        },
        {
            id: 2,
            name: 'Samsung Galaxy S23',
            price: 900,
            currency: 'USD',
            category: 'Samsung',
            condition: 'جديد',
            image: 'https://via.placeholder.com/300x200?text=Galaxy+S23',
            specs: 'شاشة 6.1 بوصة، كاميرا 50 ميجابكسل، 256GB',
            stock: 3,
            rating: 4.6,
            discount: 10
        },
        {
            id: 3,
            name: 'Xiaomi 13 Pro',
            price: 700,
            currency: 'USD',
            category: 'Xiaomi',
            condition: 'مستعمل',
            image: 'https://via.placeholder.com/300x200?text=Xiaomi+13+Pro',
            specs: 'شاشة 6.73 بوصة، كاميرا 50 ميجابكسل، 256GB',
            stock: 2,
            rating: 4.4,
            discount: 15
        }
    ];
    
    // Shopping cart
    let cart = [];
    
    // News data
    let news = [
        {
            id: 1,
            title: 'عرض خاص على تبديل الشاشات',
            content: 'خصم 20% على جميع خدمات تبديل الشاشات لفترة محدودة',
            image: 'https://via.placeholder.com/400x200?text=عرض+الشاشات',
            date: new Date().toLocaleDateString('ar-EG'),
            author: 'مركز أيمن'
        }
    ];
    
    // Apps data
    let apps = {
        security: [
            {
                id: 1,
                name: 'Antivirus Mobile',
                description: 'حماية شاملة للهاتف من الفيروسات',
                category: 'security',
                downloadUrl: '#',
                rating: 4.5
            }
        ],
        tools: [
            {
                id: 2,
                name: 'Phone Cleaner',
                description: 'تنظيف وتسريع الهاتف',
                category: 'tools',
                downloadUrl: '#',
                rating: 4.2
            }
        ],
        entertainment: [
            {
                id: 3,
                name: 'Mobile Games',
                description: 'مجموعة ألعاب ممتعة',
                category: 'entertainment',
                downloadUrl: '#',
                rating: 4.7
            }
        ]
    };

    // Financial Summary function
    function updateFinancialSummary() {
        const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const netProfit = totalIncome - totalExpenses;
        
        const financialSummaryElement = document.getElementById('financial-summary');
        if (financialSummaryElement) {
            financialSummaryElement.innerHTML = `
                <div class="financial-card">
                    <h4>إجمالي الإيرادات</h4>
                    <p class="amount income">${totalIncome.toFixed(2)} $</p>
                </div>
                <div class="financial-card">
                    <h4>إجمالي المصروفات</h4>
                    <p class="amount expense">${totalExpenses.toFixed(2)} $</p>
                </div>
                <div class="financial-card">
                    <h4>صافي الربح</h4>
                    <p class="amount ${netProfit >= 0 ? 'profit' : 'loss'}">${netProfit.toFixed(2)} $</p>
                </div>
            `;
        }
    }

    // Products table function
    function updateProductsTable() {
        const productsTableBody = document.querySelector('#products-management-table tbody');
        if (!productsTableBody) return;
        
        productsTableBody.innerHTML = '';
        
        products.forEach(product => {
            const row = productsTableBody.insertRow();
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.price} ${getCurrencySymbol(product.currency)}</td>
                <td>${product.category}</td>
                <td>${product.condition}</td>
                <td>${product.stock}</td>
                <td>${product.rating}</td>
                <td>
                    <button onclick="editProduct(${product.id})" class="edit-btn">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteProduct(${product.id})" class="delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
        });
    }

    // Load data from localStorage on page load
    loadDataFromStorage();

    // Function to save data to localStorage
    function saveDataToStorage() {
        try {
            localStorage.setItem('mobileRepairDevices', JSON.stringify(devices));
            localStorage.setItem('mobileRepairUsers', JSON.stringify(users));
            localStorage.setItem('mobileRepairTransactions', JSON.stringify(transactions));
            localStorage.setItem('mobileRepairCashBox', JSON.stringify(cashBox));
            localStorage.setItem('mobileRepairCustomerAccounts', JSON.stringify(customerAccounts));
            localStorage.setItem('mobileRepairProducts', JSON.stringify(products));
            localStorage.setItem('mobileRepairNews', JSON.stringify(news));
            localStorage.setItem('mobileRepairApps', JSON.stringify(apps));
            localStorage.setItem('mobileRepairCart', JSON.stringify(cart));
            localStorage.setItem("mobileRepairDarkMode", JSON.stringify(darkMode));
            localStorage.setItem("mobileRepairSocialLinks", JSON.stringify(socialLinks));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    // Function to load data from localStorage
    function loadDataFromStorage() {
        try {
            const savedDevices = localStorage.getItem('mobileRepairDevices');
            const savedUsers = localStorage.getItem('mobileRepairUsers');
            const savedTransactions = localStorage.getItem('mobileRepairTransactions');
            const savedCashBox = localStorage.getItem('mobileRepairCashBox');
            const savedCustomerAccounts = localStorage.getItem('mobileRepairCustomerAccounts');
            const savedProducts = localStorage.getItem('mobileRepairProducts');
            const savedNews = localStorage.getItem('mobileRepairNews');
            const savedApps = localStorage.getItem('mobileRepairApps');
            const savedCart = localStorage.getItem('mobileRepairCart');
            if (savedDevices) devices = JSON.parse(savedDevices);
            if (savedUsers) Object.assign(users, JSON.parse(savedUsers));
            if (savedTransactions) transactions = JSON.parse(savedTransactions);
            if (savedCashBox) cashBox = JSON.parse(savedCashBox);
            if (savedCustomerAccounts) customerAccounts = JSON.parse(savedCustomerAccounts);
            if (savedProducts) products = JSON.parse(savedProducts);
            if (savedNews) news = JSON.parse(savedNews);
            if (savedApps) apps = JSON.parse(savedApps);
            if (savedCart) cart = JSON.parse(savedCart);
            if (savedDarkMode) {
                darkMode = JSON.parse(savedDarkMode);
                if (darkMode) {
                    document.body.classList.add("dark-mode");
                }
            }
            if (savedSocialLinks) {
                socialLinks = JSON.parse(savedSocialLinks);
                // Update input fields in settings
                const facebookInput = document.getElementById("facebook-link");
                const twitterInput = document.getElementById("twitter-link");
                const instagramInput = document.getElementById("instagram-link");
                const whatsappInput = document.getElementById("whatsapp-link");
                
                if (facebookInput) facebookInput.value = socialLinks.facebook;
                if (twitterInput) twitterInput.value = socialLinks.twitter;
                if (instagramInput) instagramInput.value = socialLinks.instagram;
                if (whatsappInput) whatsappInput.value = socialLinks.whatsapp;
                
                // Update footer social links
                updateFooterSocialLinks();
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
    }

    // Dark mode toggle
    function toggleDarkMode() {
        darkMode = !darkMode;
        document.body.classList.toggle('dark-mode', darkMode);
        saveDataToStorage();
        showNotification(darkMode ? 'تم تفعيل الوضع الليلي' : 'تم إلغاء الوضع الليلي', 'success');
    }

    // Add dark mode toggle button to header
    const darkModeBtn = document.querySelector('.dark-mode-btn');
    if (darkModeBtn) {
        darkModeBtn.onclick = toggleDarkMode;
    }

    // Function to update date and time
    function updateDateTime() {
        const now = new Date();

        // Current Time
        const currentTimeElement = document.getElementById("current-time");
        if (currentTimeElement) {
            const timeOptions = { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true };
            currentTimeElement.textContent = now.toLocaleTimeString("ar-EG", timeOptions);
        }

        // Gregorian Date
        const gregorianDateElement = document.getElementById("gregorian-date");
        if (gregorianDateElement) {
            const gregorianOptions = { year: "numeric", month: "long", day: "numeric" };
            gregorianDateElement.textContent = now.toLocaleDateString("ar-EG", gregorianOptions);
        }

        // Hijri Date
        const hijriDateElement = document.getElementById("hijri-date");
        if (hijriDateElement) {
            try {
                const hijriDate = new Intl.DateTimeFormat("ar-SA-islamic", { day: "numeric", month: "long", year: "numeric" }).format(now);
                hijriDateElement.textContent = hijriDate;
            } catch (e) {
                hijriDateElement.textContent = "التاريخ الهجري (غير متوفر)";
            }
        }

        // Current Clock
        const currentClockElement = document.getElementById("current-clock");
        if (currentClockElement) {
            const clockOptions = { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false };
            currentClockElement.textContent = now.toLocaleTimeString("ar-EG", clockOptions);
        }
    }

    // Update date and time every second
    setInterval(updateDateTime, 1000);
    updateDateTime();

    // Generate unique device code (2 letters + 4 digits)
    function generateDeviceCode() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let code;
        do {
            const randomLetters = letters.charAt(Math.floor(Math.random() * letters.length)) +
                                  letters.charAt(Math.floor(Math.random() * letters.length));
            const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();
            code = randomLetters + randomDigits;
        } while (devices.some(device => device.code === code));
        return code;
    }

    // Generate QR Code using QRCode.js library
    function generateQRCode(text, canvasId) {
        const canvas = document.getElementById(canvasId);
        if (canvas && typeof QRCode !== 'undefined') {
            // Clear previous content
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            QRCode.toCanvas(canvas, text, {
                width: 150,
                height: 150,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            }, function (error) {
                if (error) {
                    console.error('QR Code generation error:', error);
                    // Fallback: create simple text placeholder
                    createQRCodeFallback(canvas, text);
                }
            });
        } else if (!canvas) {
            console.warn(`Canvas element with ID ${canvasId} not found for QR code generation.`);
        } else if (typeof QRCode === 'undefined') {
            console.error('QRCode.js library is not loaded.');
            // Create fallback if canvas exists
            if (canvas) {
                createQRCodeFallback(canvas, text);
            }
        }
    }

    // Fallback QR code creation
    function createQRCodeFallback(canvas, text) {
        const ctx = canvas.getContext('2d');
        canvas.width = 150;
        canvas.height = 150;
        
        // Create a simple pattern as fallback
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, 150, 150);
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('QR CODE', 75, 60);
        ctx.fillText(text, 75, 80);
        
        // Create a simple pattern
        ctx.fillStyle = '#000';
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                if ((i + j) % 2 === 0) {
                    ctx.fillRect(i * 10, j * 10, 5, 5);
                }
            }
        }
    }

    // Show loading animation
    function showLoading(element) {
        if (element) {
            element.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> جاري التحميل...</div>';
        }
    }

    // Hide loading animation
    function hideLoading(element, originalContent) {
        if (element) {
            element.innerHTML = originalContent;
        }
    }

    // Check user permissions
    function hasPermission(action) {
        if (!currentUser) return false;
        
        const permissions = {
            'admin': ['view', 'add', 'edit', 'delete', 'manage_users', 'manage_content', 'view_financial'],
            'employee': ['view', 'add', 'edit'],
            'editor': ['view', 'manage_content']
        };
        
        return permissions[currentUser.role]?.includes(action) || false;
    }

    // Login Modal functionality
    const loginBtn = document.querySelector('.login-btn');
    const loginModal = document.getElementById('login-modal');
    const closeModal = document.querySelector('.close');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const adminPanel = document.getElementById('admin-panel');

    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            if (currentUser) {
                // Logout
                currentUser = null;
                if (adminPanel) adminPanel.style.display = 'none';
                loginBtn.textContent = 'تسجيل الدخول';
                showNotification('تم تسجيل الخروج بنجاح', 'success');
                hideFileUploadSections();
                updateUIBasedOnPermissions();
                hideAllMainTabsContent(); // Hide all content when logged out
                // Show default tab (Status Check)
                document.querySelector('.main-tabs .tab-icon-btn[data-tab="status-check"]').click();
            } else {
                // Show login modal
                if (loginModal) loginModal.style.display = 'block';
            }
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', function() {
            if (loginModal) loginModal.style.display = 'none';
            if (loginError) loginError.style.display = 'none';
        });
    }

    window.addEventListener('click', function(event) {
        if (event.target === loginModal) {
            if (loginModal) loginModal.style.display = 'none';
            if (loginError) loginError.style.display = 'none';
        }
    });

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            
            const username = usernameInput ? usernameInput.value : '';
            const password = passwordInput ? passwordInput.value : '';

            if (users[username] && users[username].password === password) {
                currentUser = {
                    username: username,
                    role: users[username].role,
                    email: users[username].email
                };
                
                if (loginModal) loginModal.style.display = 'none';
                if (adminPanel) adminPanel.style.display = 'block';
                if (loginBtn) loginBtn.textContent = 'تسجيل الخروج';
                if (loginError) loginError.style.display = 'none';
                
                loginForm.reset();
                showNotification(`مرحباً ${username}! تم تسجيل الدخول بنجاح`, 'success');
                updateFinancialSummary();
                updateDashboardStats();
                showFileUploadSections();
                updateUIBasedOnPermissions();
                // Automatically show admin panel tab after login
                const adminPanelTabBtn = document.querySelector('.main-tabs .tab-icon-btn[data-tab="admin-panel"]');
                if (adminPanelTabBtn) adminPanelTabBtn.click();
            } else {
                if (loginError) {
                    loginError.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة';
                    loginError.style.display = 'block';
                }
            }
        });
    }

    // Update UI based on user permissions
    function updateUIBasedOnPermissions() {
        const adminTabs = document.querySelectorAll('.admin-tabs .tab-btn');
        adminTabs.forEach(tab => {
            const tabName = tab.getAttribute('data-tab');
            let shouldShow = true;
            
            if (!currentUser) {
                shouldShow = false;
            } else if (currentUser.role === 'employee') {
                shouldShow = ['device-intake', 'customers', 'status-check'].includes(tabName);
            } else if (currentUser.role === 'editor') {
                shouldShow = ['content', 'news', 'apps'].includes(tabName);
            }
            
            tab.style.display = shouldShow ? 'flex' : 'none';
        });

        // Hide admin panel main tab if no permission
        const adminPanelMainTab = document.querySelector('.main-tabs .tab-icon-btn[data-tab="admin-panel"]');
        if (adminPanelMainTab) {
            if (currentUser) {
                adminPanelMainTab.style.display = 'flex';
            } else {
                adminPanelMainTab.style.display = 'none';
            }
        }
    }

    // Show/Hide file upload sections based on login status
    function showFileUploadSections() {
        if (hasPermission('manage_content')) {
            const appsUpload = document.getElementById('apps-upload-section');
            const newsUpload = document.getElementById('news-upload-section');
            if (appsUpload) appsUpload.style.display = 'block';
            if (newsUpload) newsUpload.style.display = 'block';
        }
    }

    function hideFileUploadSections() {
        const appsUpload = document.getElementById('apps-upload-section');
        const newsUpload = document.getElementById('news-upload-section');
        if (appsUpload) appsUpload.style.display = 'none';
        if (newsUpload) newsUpload.style.display = 'none';
    }

    // Main Navigation Tabs functionality (Icons)
    const mainTabBtns = document.querySelectorAll('.main-tabs .tab-icon-btn');
    const mainTabContents = document.querySelectorAll('main .tab-content');

    function hideAllMainTabsContent() {
        mainTabContents.forEach(c => c.classList.remove('active'));
        mainTabBtns.forEach(b => b.classList.remove('active'));
    }

    mainTabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            hideAllMainTabsContent();
            
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            // Specific initializations for each tab
            if (targetTab === 'admin-panel') {
                // Default to dashboard or first available admin tab
                const firstAdminTab = document.querySelector('.admin-tabs .tab-btn:not([style*="display: none"]):not([style*="display:none"])');
                if (firstAdminTab) {
                    firstAdminTab.click();
                } else {
                    // If no admin tabs are visible, hide admin panel content
                    if (adminPanel) adminPanel.classList.remove('active');
                }
            } else if (targetTab === 'apps') {
                updateAppsDisplay();
            } else if (targetTab === 'shop') {
                updateProductsDisplay();
            } else if (targetTab === 'news') {
                updateNewsDisplay();
            }
            // For 'status-check', 'services', 'about' no specific action needed, content is static
        });
    });

    // Admin Panel Tab functionality with single tab mode
    const adminTabBtns = document.querySelectorAll('.admin-tabs .tab-btn');
    const adminTabContents = document.querySelectorAll('.admin-tab-content');

    adminTabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all admin tabs and contents
            adminTabBtns.forEach(b => b.classList.remove('active'));
            adminTabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked admin tab and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            // Enable single tab mode for admin panel
            if (adminPanel) adminPanel.classList.add('single-tab-mode');
            
            // Load specific admin tab content
            if (targetTab === 'dashboard') {
                updateDashboardStats();
            } else if (targetTab === 'customers') {
                updateCustomersTable();
            } else if (targetTab === 'financial') {
                updateFinancialSummary();
                updateGeneralLedger();
                updateCashBox();
            } else if (targetTab === 'shop-management') {
                updateProductsTable();
            }
            // For 'content', 'settings', 'users' no specific action needed, content is static
        });
    });

    // Dashboard statistics
    function updateDashboardStats() {
        const totalDevices = devices.length;
        const completedDevices = devices.filter(d => d.status === 'completed' || d.status === 'delivered').length;
        const totalRevenue = devices.reduce((sum, device) => sum + device.totalAmount, 0);
        const pendingDevices = devices.filter(d => d.status === 'received' || d.status === 'in_progress' || d.status === 'waiting_parts').length;
        const deliveryRate = totalDevices > 0 ? ((completedDevices / totalDevices) * 100).toFixed(1) : 0;
        
        // Update dashboard if it exists
        const dashboardStats = document.getElementById('dashboard-stats');
        if (dashboardStats) {
            dashboardStats.innerHTML = `
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-mobile-alt"></i></div>
                    <div class="stat-content">
                        <h4>إجمالي الأجهزة</h4>
                        <p class="stat-number">${totalDevices}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-dollar-sign"></i></div>
                    <div class="stat-content">
                        <h4>إجمالي الإيرادات</h4>
                        <p class="stat-number">${totalRevenue.toFixed(2)} $</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-clock"></i></div>
                    <div class="stat-content">
                        <h4>الأجهزة المعلقة</h4>
                        <p class="stat-number">${pendingDevices}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-chart-line"></i></div>
                    <div class="stat-content">
                        <h4>معدل التسليم</h4>
                        <p class="stat-number">${deliveryRate}%</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-newspaper"></i></div>
                    <div class="stat-content">
                        <h4>عدد الأخبار</h4>
                        <p class="stat-number">${news.length}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-shopping-cart"></i></div>
                    <div class="stat-content">
                        <h4>المنتجات المتاحة</h4>
                        <p class="stat-number">${products.filter(p => p.stock > 0).length}</p>
                    </div>
                </div>
            `;
        }
    }

    // Device status search functionality with live search
    const deviceCodeInput = document.getElementById('device-code-input');
    const searchByCodeBtn = document.getElementById('search-by-code-btn');
    const deviceStatusDetails = document.getElementById('device-status-details');

    // Live search functionality
    if (deviceCodeInput) {
        deviceCodeInput.addEventListener('input', function() {
            const code = this.value.trim();
            if (code.length >= 2) {
                const matchingDevices = devices.filter(d => 
                    d.code.includes(code) || 
                    d.customerName.toLowerCase().includes(code.toLowerCase())
                );
                
                if (matchingDevices.length > 0) {
                    showSearchSuggestions(matchingDevices);
                } else {
                    hideSearchSuggestions();
                }
            } else {
                hideSearchSuggestions();
            }
        });
    }

    function showSearchSuggestions(devices) {
        let suggestionsDiv = document.getElementById('search-suggestions');
        if (!suggestionsDiv) {
            suggestionsDiv = document.createElement('div');
            suggestionsDiv.id = 'search-suggestions';
            suggestionsDiv.className = 'search-suggestions';
            if (deviceCodeInput) deviceCodeInput.parentNode.appendChild(suggestionsDiv);
        }
        
        suggestionsDiv.innerHTML = devices.map(device => `
            <div class="suggestion-item" onclick="selectDevice('${device.code}')">
                <strong>${device.code}</strong> - ${device.customerName} (${device.deviceType})
            </div>
        `).join('');
        suggestionsDiv.style.display = 'block';
    }

    function hideSearchSuggestions() {
        const suggestionsDiv = document.getElementById('search-suggestions');
        if (suggestionsDiv) {
            suggestionsDiv.style.display = 'none';
        }
    }

    window.selectDevice = function(code) {
        if (deviceCodeInput) deviceCodeInput.value = code;
        hideSearchSuggestions();
        searchDevice(code);
    };

    function searchDevice(code) {
        if (deviceStatusDetails) {
            showLoading(deviceStatusDetails);
            deviceStatusDetails.style.display = 'block';
        }
        
        setTimeout(() => {
            const device = devices.find(d => d.code === code);
            
            if (deviceStatusDetails) {
                if (device) {
                    deviceStatusDetails.innerHTML = `
                        <div class="device-status-card">
                            <h3>تفاصيل حالة الجهاز</h3>
                            <div class="status-grid">
                                <div class="status-item">
                                    <strong>كود الجهاز:</strong> ${device.code}
                                </div>
                                <div class="status-item">
                                    <strong>اسم الزبون:</strong> ${device.customerName}
                                </div>
                                <div class="status-item">
                                    <strong>نوع الجهاز:</strong> ${device.deviceType}
                                </div>
                                <div class="status-item">
                                    <strong>العطل:</strong> ${device.issue}
                                </div>
                                <div class="status-item">
                                    <strong>المبلغ الإجمالي:</strong> ${device.totalAmount} ${getCurrencySymbol(device.currency)}
                                </div>
                                <div class="status-item">
                                    <strong>المبلغ المدفوع:</strong> ${device.paidAmount} ${getCurrencySymbol(device.currency)}
                                </div>
                                <div class="status-item">
                                    <strong>المبلغ المتبقي:</strong> ${device.remainingAmount} ${getCurrencySymbol(device.currency)}
                                </div>
                                <div class="status-item">
                                    <strong>تاريخ الاستلام:</strong> ${device.receiveDate}
                                </div>
                                <div class="status-item">
                                    <strong>الحالة:</strong> <span class="status-badge ${device.status}">${getStatusText(device.status)}</span>
                                </div>
                                ${device.repairDetails ? `<div class="status-item"><strong>تفاصيل الإصلاح:</strong> ${device.repairDetails}</div>` : ''}
                                ${device.notes ? `<div class="status-item"><strong>ملاحظات:</strong> ${device.notes}</div>` : ''}
                                ${device.rating ? `<div class="status-item"><strong>تقييم الزبون:</strong> ${'⭐'.repeat(device.rating)}</div>` : ''}
                            </div>
                            ${!device.rating && (device.status === 'completed' || device.status === 'delivered') ? `
                                <div class="rating-section">
                                    <h4>قيّم خدمتنا:</h4>
                                    <div class="rating-stars">
                                        ${[1,2,3,4,5].map(star => `
                                            <span class="star" onclick="rateDevice('${device.code}', ${star})">⭐</span>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    `;
                } else {
                    deviceStatusDetails.innerHTML = `
                        <div class="error-message">
                            لم يتم العثور على جهاز بهذا الكود. تأكد من صحة الكود المدخل.
                        </div>
                    `;
                }
            }
        }, 1000);
    }

    // Rate device function
    window.rateDevice = function(deviceCode, rating) {
        const device = devices.find(d => d.code === deviceCode);
        if (device) {
            device.rating = rating;
            saveDataToStorage();
            showNotification('شكراً لتقييمك!', 'success');
            searchDevice(deviceCode); // Refresh the display
        }
    };

    if (searchByCodeBtn) {
        searchByCodeBtn.addEventListener('click', function() {
            const deviceCode = deviceCodeInput ? deviceCodeInput.value.trim() : '';
            if (deviceCode) {
                searchDevice(deviceCode);
            } else {
                showNotification('الرجاء إدخال كود الجهاز', 'error');
            }
        });
    }

    // QR Code Scanner functionality
    const qrScanBtn = document.getElementById('qr-scan-btn');
    const qrReader = document.getElementById('qr-reader');
    const stopScanBtn = document.getElementById('stop-scan-btn');

    if (qrScanBtn) {
        qrScanBtn.addEventListener('click', function() {
            startQRScanner();
        });
    }

    if (stopScanBtn) {
        stopScanBtn.addEventListener('click', function() {
            stopQRScanner();
        });
    }

    function startQRScanner() {
        if (typeof Html5Qrcode === 'undefined') {
            showNotification('مكتبة Html5Qrcode غير محملة.', 'error');
            console.error('Html5Qrcode library is not loaded.');
            return;
        }
        html5QrCode = new Html5Qrcode("qr-reader");
        if (qrReader) qrReader.style.display = 'block';
        if (qrScanBtn) qrScanBtn.style.display = 'none';
        if (stopScanBtn) stopScanBtn.style.display = 'block';

        html5QrCode.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: { width: 250, height: 250 }
            },
            (decodedText, decodedResult) => {
                searchDevice(decodedText);
                stopQRScanner();
                showNotification('تم فحص QR Code بنجاح', 'success');
            },
            (errorMessage) => {
                // Handle scan error
            }
        ).catch(err => {
            console.error('Error starting QR scanner:', err);
            showNotification('خطأ في تشغيل ماسح QR Code', 'error');
            stopQRScanner();
        });
    }

    function stopQRScanner() {
        if (html5QrCode) {
            html5QrCode.stop().then(() => {
                if (qrReader) qrReader.style.display = 'none';
                if (qrScanBtn) qrScanBtn.style.display = 'block';
                if (stopScanBtn) stopScanBtn.style.display = 'none';
            }).catch(err => {
                console.error('Error stopping QR scanner:', err);
            });
        }
    }

    // Device form submission with logical linking
    const deviceForm = document.getElementById('device-form');
    const totalAmountInput = document.getElementById('total-amount');
    const paidAmountInput = document.getElementById('paid-amount');
    const remainingAmountInput = document.getElementById('remaining-amount');

    // Calculate remaining amount automatically
    function calculateRemainingAmount() {
        const total = parseFloat(totalAmountInput ? totalAmountInput.value : 0) || 0;
        const paid = parseFloat(paidAmountInput ? paidAmountInput.value : 0) || 0;
        const remaining = total - paid;
        if (remainingAmountInput) remainingAmountInput.value = remaining.toFixed(2);
    }

    if (totalAmountInput && paidAmountInput) {
        totalAmountInput.addEventListener('input', calculateRemainingAmount);
        paidAmountInput.addEventListener('input', calculateRemainingAmount);
    }

    if (deviceForm) {
        deviceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!currentUser) {
                showNotification('يجب تسجيل الدخول أولاً', 'error');
                return;
            }
            
            if (!hasPermission('add')) {
                showNotification('ليس لديك صلاحية لإضافة أجهزة', 'error');
                return;
            }
            
            const deviceCode = generateDeviceCode();
            const customerNameInput = document.getElementById('customer-name');
            const deviceTypeInput = document.getElementById('device-type');
            const issueInput = document.getElementById('device-issue');
            const currencyInput = document.getElementById('currency');

            const customerName = customerNameInput ? customerNameInput.value : '';
            const deviceType = deviceTypeInput ? deviceTypeInput.value : '';
            const issue = issueInput ? issueInput.value : '';
            const currency = currencyInput ? currencyInput.value : '';
            const totalAmount = parseFloat(totalAmountInput ? totalAmountInput.value : 0);
            const paidAmount = parseFloat(paidAmountInput ? paidAmountInput.value : 0);
            const remainingAmount = totalAmount - paidAmount;
            
            const newDevice = {
                code: deviceCode,
                customerName: customerName,
                deviceType: deviceType,
                issue: issue,
                currency: currency,
                totalAmount: totalAmount,
                paidAmount: paidAmount,
                remainingAmount: remainingAmount,
                receiveDate: new Date().toLocaleDateString('ar-EG'),
                status: 'received',
                repairDetails: '',
                notes: '',
                addedBy: currentUser.username,
                rating: null
            };
            
            devices.push(newDevice);
            
            // Add financial transaction
            if (paidAmount > 0) {
                addTransaction({
                    type: 'income',
                    amount: paidAmount,
                    currency: currency,
                    description: `دفعة من ${customerName} - جهاز ${deviceCode}`,
                    deviceCode: deviceCode,
                    customerName: customerName,
                    date: new Date().toISOString()
                });
            }
            
            // Update customer account
            updateCustomerAccount(customerName, deviceCode, totalAmount, paidAmount, currency);
            
            updateCustomersTable();
            updateFinancialSummary();
            updateCashBox();
            updateDashboardStats();
            saveDataToStorage();
            
            // Show receipt
            showReceipt(newDevice);
            
            showNotification(`تم إضافة الجهاز بنجاح. كود الجهاز: ${deviceCode}`, 'success');
            deviceForm.reset();
        });
    }

    // Financial System Functions
    function addTransaction(transaction) {
        transaction.id = Date.now().toString();
        transactions.push(transaction);
        
        // Update cash box
        if (transaction.type === 'income') {
            cashBox.balance += transaction.amount;
        } else if (transaction.type === 'expense') {
            cashBox.balance -= transaction.amount;
        }
        
        updateGeneralLedger();
        saveDataToStorage();
    }

    window.deleteTransaction = function(transactionId) {
        console.log("Attempting to delete transaction with ID:", transactionId);
        if (!confirm("هل أنت متأكد من حذف هذه المعاملة؟")) {
            return;
        }

        const transactionIndex = transactions.findIndex(t => t.id === transactionId);
        if (transactionIndex > -1) {
            const transaction = transactions[transactionIndex];
            
            // Revert cash box balance
            if (transaction.type === 'income') {
                cashBox.balance -= transaction.amount;
            } else if (transaction.type === 'expense') {
                cashBox.balance += transaction.amount;
            }

            // If transaction is related to a device, update device and customer account
            if (transaction.deviceCode) {
                const device = devices.find(d => d.code === transaction.deviceCode);
                if (device) {
                    if (transaction.type === 'income') {
                        device.paidAmount -= transaction.amount;
                        device.remainingAmount += transaction.amount;
                    } else if (transaction.type === 'expense' && transaction.description.includes('استرداد مبلغ')) {
                        // This is a refund, so we need to revert the original payment effect
                        device.paidAmount += transaction.amount;
                        device.remainingAmount -= transaction.amount;
                    }
                    // Update customer account if linked
                    if (customerAccounts[device.customerName]) {
                        customerAccounts[device.customerName].totalPaid -= transaction.amount;
                        // Recalculate totalDebt for accuracy if needed, or adjust based on transaction type
                        // For simplicity, we'll just adjust totalPaid for now.
                    }
                }
            }

            transactions.splice(transactionIndex, 1);
            saveDataToStorage();
            updateGeneralLedger();
            updateFinancialSummary();
            updateCashBox();
            updateCustomersTable(); // Refresh customers table to reflect changes
            showNotification('تم حذف المعاملة بنجاح', 'success');
        }
    };

    function updateCustomerAccount(customerName, deviceCode, totalAmount, paidAmount, currency) {
        if (!customerAccounts[customerName]) {
            customerAccounts[customerName] = {
                name: customerName,
                devices: [],
                totalDebt: 0,
                totalPaid: 0,
                currency: currency
            };
        }
        
        customerAccounts[customerName].devices.push({
            code: deviceCode,
            totalAmount: totalAmount,
            paidAmount: paidAmount,
            remainingAmount: totalAmount - paidAmount,
            date: new Date().toLocaleDateString('ar-EG')
        });
        
        customerAccounts[customerName].totalDebt += totalAmount;
        customerAccounts[customerName].totalPaid += paidAmount;
        saveDataToStorage();
    }

    function updateGeneralLedger() {
        const ledgerTable = document.getElementById('general-ledger-table');
        if (ledgerTable) {
            const tbody = ledgerTable.querySelector('tbody');
            if (!tbody) return;
            tbody.innerHTML = '';
            
            transactions.forEach(transaction => {
                const row = tbody.insertRow();
                row.innerHTML = `
                    <td>${new Date(transaction.date).toLocaleDateString('ar-EG')}</td>
                    <td>${transaction.description}</td>
                    <td>${transaction.type === 'income' ? transaction.amount.toFixed(2) : ''}</td>
                    <td>${transaction.type === 'expense' ? transaction.amount.toFixed(2) : ''}</td>
                    <td>${getCurrencySymbol(transaction.currency)}</td>
                    <td>${transaction.customerName || '-'}</td>
                    <td>${transaction.deviceCode || '-'}</td>
                    <td>
                        <button onclick="deleteTransaction('${transaction.id}')" class="delete-btn">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
            });
        }
    }

    function updateCashBox() {
        const cashBoxBalance = document.getElementById('cash-box-balance');
        if (cashBoxBalance) {
            cashBoxBalance.textContent = `${cashBox.balance.toFixed(2)} ${getCurrencySymbol(cashBox.currency)}`;
        }
    }

    // PDF Generation using jsPDF
    window.generatePDF = function(device) {
        // This would require jsPDF library
        // For now, we'll create a printable version
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                <head>
                    <title>إيصال PDF - ${device.code}</title>
                    <style>
                        body { font-family: Arial, sans-serif; direction: rtl; text-align: right; }
                        .receipt { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ccc; }
                        .header { text-align: center; margin-bottom: 20px; }
                        .info { margin: 10px 0; }
                        .qr-code { text-align: center; margin: 20px 0; }
                    </style>
                </head>
                <body>
                    <div class="receipt">
                        <div class="header">
                            <h2>مركز أيمن لصيانة الموبايل</h2>
                            <h3>إيصال استلام جهاز</h3>
                        </div>
                        <div class="info">
                            <p><strong>كود الجهاز:</strong> ${device.code}</p>
                            <p><strong>اسم الزبون:</strong> ${device.customerName}</p>
                            <p><strong>نوع الجهاز:</strong> ${device.deviceType}</p>
                            <p><strong>العطل:</strong> ${device.issue}</p>
                            <p><strong>المبلغ الإجمالي:</strong> ${device.totalAmount} ${getCurrencySymbol(device.currency)}</p>
                            <p><strong>المبلغ المدفوع:</strong> ${device.paidAmount} ${getCurrencySymbol(device.currency)}</p>
                            <p><strong>المبلغ المتبقي:</strong> ${device.remainingAmount} ${getCurrencySymbol(device.currency)}</p>
                            <p><strong>تاريخ الاستلام:</strong> ${device.receiveDate}</p>
                        </div>
                        <div class="qr-code">
                            <p>QR Code: ${device.code}</p>
                        </div>
                    </div>
                </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    }

    // Show receipt with QR Code
    function showReceipt(device) {
        const receiptDiv = document.getElementById('device-receipt');
        if (receiptDiv) {
            receiptDiv.innerHTML = `
                <div class="receipt-content">
                    <h3>إيصال استلام جهاز</h3>
                    <div class="receipt-info">
                        <p><strong>كود الجهاز:</strong> ${device.code}</p>
                        <p><strong>اسم الزبون:</strong> ${device.customerName}</p>
                        <p><strong>نوع الجهاز:</strong> ${device.deviceType}</p>
                        <p><strong>العطل:</strong> ${device.issue}</p>
                        <p><strong>المبلغ الإجمالي:</strong> ${device.totalAmount} ${getCurrencySymbol(device.currency)}</p>
                        <p><strong>المبلغ المدفوع:</strong> ${device.paidAmount} ${getCurrencySymbol(device.currency)}</p>
                        <p><strong>المبلغ المتبقي:</strong> ${device.remainingAmount} ${getCurrencySymbol(device.currency)}</p>
                        <p><strong>تاريخ الاستلام:</strong> ${device.receiveDate}</p>
                    </div>
                    <div class="qr-code-container">
                        <canvas id="qr-code-${device.code}" class="qr-code-canvas"></canvas>
                        <p>QR Code للجهاز</p>
                    </div>
                    <div class="receipt-actions">
                        <button onclick="printReceipt('${device.code}')">
                            <i class="fas fa-print"></i> طباعة الإيصال
                        </button>
                        <button onclick="generatePDF(${JSON.stringify(device).replace(/"/g, '&quot;')})">
                            <i class="fas fa-file-pdf"></i> تصدير PDF
                        </button>
                    </div>
                </div>
            `;
            receiptDiv.style.display = 'block';
            
            // Generate QR Code
            setTimeout(() => {
                generateQRCode(device.code, `qr-code-${device.code}`);
            }, 100);
        }
    }

    // Update customers table with new columns and filtering
    function updateCustomersTable() {
        const tbody = document.querySelector('#customers-table tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        // Add filter controls if they don't exist
        addTableFilters();
        
        let filteredDevices = devices;
        
        // Apply filters
        const statusFilter = document.getElementById('status-filter');
        const dateFilter = document.getElementById('date-filter');
        
        if (statusFilter && statusFilter.value) {
            filteredDevices = filteredDevices.filter(d => d.status === statusFilter.value);
        }
        
        if (dateFilter && dateFilter.value) {
            const filterDate = new Date(dateFilter.value).toLocaleDateString('ar-EG');
            filteredDevices = filteredDevices.filter(d => d.receiveDate === filterDate);
        }
        
        filteredDevices.forEach(device => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${device.code}</td>
                <td>${device.customerName}</td>
                <td>${device.deviceType}</td>
                <td>${device.issue}</td>
                <td>
                    <select onchange="updateDeviceStatus('${device.code}', this.value)" ${!hasPermission('edit') ? 'disabled' : ''}>
                        <option value="received" ${device.status === 'received' ? 'selected' : ''}>تم الاستلام</option>
                        <option value="in_progress" ${device.status === 'in_progress' ? 'selected' : ''}>قيد الإصلاح</option>
                        <option value="waiting_parts" ${device.status === 'waiting_parts' ? 'selected' : ''}>في انتظار قطع الغيار</option>
                        <option value="completed" ${device.status === 'completed' ? 'selected' : ''}>تم الإصلاح</option>
                        <option value="delivered" ${device.status === 'delivered' ? 'selected' : ''}>تم التسليم</option>
                    </select>
                </td>
                <td>${device.receiveDate}</td>
                <td>
                    <input type="text" value="${device.repairDetails || ''}" 
                           onchange="updateDeviceField('${device.code}', 'repairDetails', this.value)"
                           placeholder="تفاصيل الإصلاح" ${!hasPermission('edit') ? 'readonly' : ''}>
                </td>
                <td>
                    <input type="text" value="${device.notes || ''}" 
                           onchange="updateDeviceField('${device.code}', 'notes', this.value)"
                           placeholder="ملاحظات" ${!hasPermission('edit') ? 'readonly' : ''}>
                </td>
                <td>${device.totalAmount} ${getCurrencySymbol(device.currency)}</td>
                <td>${device.paidAmount} ${getCurrencySymbol(device.currency)}</td>
                <td>${device.remainingAmount} ${getCurrencySymbol(device.currency)}</td>
                <td class="actions-column">
                    <div class="action-buttons">
                        ${hasPermission('edit') ? `
                            <button class="edit-btn" onclick="editDevice('${device.code}')" title="تعديل">
                                <i class="fas fa-edit"></i>
                            </button>
                        ` : ''}
                        ${hasPermission('delete') ? `
                            <button class="delete-btn" onclick="deleteDevice('${device.code}')" title="حذف">
                                <i class="fas fa-trash"></i>
                            </button>
                        ` : ''}
                        <button class="payment-btn" onclick="receivePayment('${device.code}')" title="إضافة دفعة">
                            <i class="fas fa-money-bill"></i>
                        </button>
                        <button class="receipt-btn" onclick="showReceiptModal('${device.code}')" title="طباعة إيصال">
                            <i class="fas fa-print"></i>
                        </button>
                    </div>
                    ${device.rating ? `<div class="rating-display">${'⭐'.repeat(device.rating)}</div>` : ''}
                </td>
            `;
        });
    }

    function addTableFilters() {
        const tableContainer = document.querySelector('#customers .table-container');
        if (!tableContainer || document.getElementById('table-filters')) return;
        
        const filtersDiv = document.createElement('div');
        filtersDiv.id = 'table-filters';
        filtersDiv.className = 'table-filters';
        filtersDiv.innerHTML = `
            <div class="filter-group">
                <label>فلترة بالحالة:</label>
                <select id="status-filter" onchange="updateCustomersTable()">
                    <option value="">جميع الحالات</option>
                    <option value="received">تم الاستلام</option>
                    <option value="in_progress">قيد الإصلاح</option>
                    <option value="waiting_parts">في انتظار قطع الغيار</option>
                    <option value="completed">تم الإصلاح</option>
                    <option value="delivered">تم التسليم</option>
                </select>
            </div>
            <div class="filter-group">
                <label>فلترة بالتاريخ:</label>
                <input type="date" id="date-filter" onchange="updateCustomersTable()">
            </div>
            <div class="filter-group">
                <button onclick="clearFilters()" class="clear-filters-btn">
                    <i class="fas fa-times"></i> مسح الفلاتر
                </button>
            </div>
        `;
        
        tableContainer.insertBefore(filtersDiv, tableContainer.firstChild);
    }

    window.clearFilters = function() {
        const statusFilter = document.getElementById('status-filter');
        const dateFilter = document.getElementById('date-filter');
        if (statusFilter) statusFilter.value = '';
        if (dateFilter) dateFilter.value = '';
        updateCustomersTable();
    };

    // Update device status function
    window.updateDeviceStatus = function(deviceCode, newStatus) {
        const device = devices.find(d => d.code === deviceCode);
        if (device) {
            device.status = newStatus;
            saveDataToStorage();
            showNotification(`تم تحديث حالة الجهاز ${deviceCode} إلى ${getStatusText(newStatus)}`, 'success');
            updateCustomersTable();
            updateDashboardStats();
        }
    };

    // Update device field function
    window.updateDeviceField = function(deviceCode, field, value) {
        const device = devices.find(d => d.code === deviceCode);
        if (device) {
            device[field] = value;
            saveDataToStorage();
            showNotification(`تم تحديث ${field === 'repairDetails' ? 'تفاصيل الإصلاح' : 'الملاحظات'} للجهاز ${deviceCode}`, 'success');
        }
    };

    // Edit device function
    window.editDevice = function(deviceCode) {
        const device = devices.find(d => d.code === deviceCode);
        if (!device) {
            showNotification('لم يتم العثور على الجهاز', 'error');
            return;
        }

        // Fill edit form with device data
        document.getElementById('edit-device-code').value = device.code;
        document.getElementById('edit-customer-name').value = device.customerName;
        document.getElementById('edit-device-type').value = device.deviceType;
        document.getElementById('edit-device-issue').value = device.issue;
        document.getElementById('edit-total-amount').value = device.totalAmount;
        document.getElementById('edit-paid-amount').value = device.paidAmount;
        document.getElementById('edit-remaining-amount').value = device.remainingAmount;
        document.getElementById('edit-currency').value = device.currency;
        document.getElementById('edit-status').value = device.status;
        document.getElementById('edit-repair-details').value = device.repairDetails || '';
        document.getElementById('edit-notes').value = device.notes || '';

        // Show edit modal
        document.getElementById('edit-device-modal').style.display = 'block';
    };

    // Delete device function
    window.deleteDevice = function(deviceCode) {
        if (!confirm(`هل أنت متأكد من حذف الجهاز ${deviceCode}؟ هذا الإجراء لا يمكن التراجع عنه.`)) {
            return;
        }

        const deviceIndex = devices.findIndex(d => d.code === deviceCode);
        if (deviceIndex > -1) {
            const device = devices[deviceIndex];
            
            // Add transaction for refund if needed
            if (device.paidAmount > 0) {
                addTransaction({
                    type: 'expense',
                    amount: device.paidAmount,
                    currency: device.currency,
                    description: `استرداد مبلغ للزبون ${device.customerName} - حذف جهاز ${deviceCode}`,
                    deviceCode: deviceCode,
                    customerName: device.customerName,
                    date: new Date().toISOString()
                });
            }

            devices.splice(deviceIndex, 1);
            saveDataToStorage();
            updateCustomersTable();
            updateFinancialSummary();
            updateDashboardStats();
            showNotification(`تم حذف الجهاز ${deviceCode} بنجاح`, 'success');
        }
    };

    // Receive payment function
    window.receivePayment = function(deviceCode) {
        const device = devices.find(d => d.code === deviceCode);
        if (!device) {
            showNotification('لم يتم العثور على الجهاز', 'error');
            return;
        }

        if (device.remainingAmount <= 0) {
            showNotification('لا يوجد مبلغ متبقي لهذا الجهاز', 'error');
            return;
        }

        // Fill payment form
        document.getElementById('payment-device-code').value = device.code;
        document.getElementById('payment-device-info').textContent = `${device.customerName} - ${device.deviceType}`;
        document.getElementById('payment-remaining-info').textContent = `${device.remainingAmount} ${getCurrencySymbol(device.currency)}`;
        document.getElementById('payment-amount').value = '';
        document.getElementById('payment-amount').max = device.remainingAmount;

        // Show payment modal
        document.getElementById('receive-payment-modal').style.display = 'block';
    };

    // Show receipt modal function
    window.showReceiptModal = function(deviceCode) {
        const device = devices.find(d => d.code === deviceCode);
        if (!device) {
            showNotification('لم يتم العثور على الجهاز', 'error');
            return;
        }

        // Create receipt modal
        const modal = document.createElement('div');
        modal.className = 'modal receipt-modal';
        modal.id = 'receipt-modal';
        modal.innerHTML = `
            <div class="modal-content large-modal">
                <span class="close" onclick="closeReceiptModal()">&times;</span>
                <h2>إيصال استلام الهاتف</h2>
                <div class="receipt-preview" id="receipt-preview">
                    <div class="print-container">
                        <!-- Customer Copy -->
                        <div class="receipt-copy customer-copy">
                            <div class="receipt-header">
                                <img src="logo.png" alt="شعار المركز" class="receipt-logo">
                                <h3>مركز أيمن لصيانة الموبايل</h3>
                                <h4>إيصال الزبون</h4>
                            </div>
                            <div class="receipt-info">
                                <p><strong>كود الجهاز:</strong> ${device.code}</p>
                                <p><strong>اسم الزبون:</strong> ${device.customerName}</p>
                                <p><strong>نوع الجهاز:</strong> ${device.deviceType}</p>
                                <p><strong>العطل:</strong> ${device.issue}</p>
                                <p><strong>المبلغ الإجمالي:</strong> ${device.totalAmount} ${getCurrencySymbol(device.currency)}</p>
                                <p><strong>المبلغ المدفوع:</strong> ${device.paidAmount} ${getCurrencySymbol(device.currency)}</p>
                                <p><strong>المبلغ المتبقي:</strong> ${device.remainingAmount} ${getCurrencySymbol(device.currency)}</p>
                                <p><strong>تاريخ الاستلام:</strong> ${device.receiveDate}</p>
                            </div>
                            <div class="qr-code-section">
                                <canvas id="customer-qr-${device.code}" class="qr-code-canvas"></canvas>
                                <p>QR Code: ${device.code}</p>
                            </div>
                        </div>
                        
                        <div class="cut-line horizontal"></div>

                        <!-- Archive Copy -->
                        <div class="receipt-copy archive-copy">
                            <div class="receipt-header">
                                <img src="logo.png" alt="شعار المركز" class="receipt-logo">
                                <h3>مركز أيمن لصيانة الموبايل</h3>
                                <h4>إيصال الأرشيف</h4>
                            </div>
                            <div class="receipt-info">
                                <p><strong>كود الجهاز:</strong> ${device.code}</p>
                                <p><strong>اسم الزبون:</strong> ${device.customerName}</p>
                                <p><strong>نوع الجهاز:</strong> ${device.deviceType}</p>
                                <p><strong>العطل:</strong> ${device.issue}</p>
                                <p><strong>المبلغ الإجمالي:</strong> ${device.totalAmount} ${getCurrencySymbol(device.currency)}</p>
                                <p><strong>المبلغ المدفوع:</strong> ${device.paidAmount} ${getCurrencySymbol(device.currency)}</p>
                                <p><strong>المبلغ المتبقي:</strong> ${device.remainingAmount} ${getCurrencySymbol(device.currency)}</p>
                                <p><strong>تاريخ الاستلام:</strong> ${device.receiveDate}</p>
                            </div>
                            <div class="qr-code-section">
                                <canvas id="archive-qr-${device.code}" class="qr-code-canvas"></canvas>
                                <p>QR Code: ${device.code}</p>
                            </div>
                        </div>
                        
                        <div class="cut-line horizontal"></div>

                        <!-- Device Label Copy -->
                        <div class="receipt-copy label-copy">
                            <div class="receipt-header">
                                <h3>لصاقة الجهاز</h3>
                            </div>
                            <div class="label-info">
                                <p><strong>كود:</strong> ${device.code}</p>
                                <p><strong>الزبون:</strong> ${device.customerName}</p>
                                <p><strong>النوع:</strong> ${device.deviceType}</p>
                                <p><strong>العطل:</strong> ${device.issue}</p>
                                <p><strong>التاريخ:</strong> ${device.receiveDate}</p>
                            </div>
                            <div class="qr-code-section">
                                <canvas id="label-qr-${device.code}" class="qr-code-canvas"></canvas>
                                <p>QR: ${device.code}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="receipt-actions">
                    <button onclick="printReceiptModal('${device.code}')" class="print-btn">
                        <i class="fas fa-print"></i> طباعة الإيصال
                    </button>
                    <button onclick="downloadReceiptPDF('${device.code}')" class="pdf-btn">
                        <i class="fas fa-file-pdf"></i> تحميل PDF
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'block';
        
        // Generate QR codes for all copies
        setTimeout(() => {
            generateQRCode(device.code, `customer-qr-${device.code}`);
            generateQRCode(device.code, `archive-qr-${device.code}`);
            generateQRCode(device.code, `label-qr-${device.code}`);
        }, 100);
    };

    // Shopping section functions
    function updateProductsDisplay() {
        const productsGrid = document.getElementById('products-grid');
        if (!productsGrid) return;
        
        // Add shopping filters
        addShoppingFilters();
        
        let filteredProducts = products;
        
        // Apply filters
        const categoryFilter = document.getElementById('category-filter');
        const priceSort = document.getElementById('price-sort');
        const conditionFilter = document.getElementById('condition-filter');
        
        if (categoryFilter && categoryFilter.value) {
            filteredProducts = filteredProducts.filter(p => p.category === categoryFilter.value);
        }
        
        if (conditionFilter && conditionFilter.value) {
            filteredProducts = filteredProducts.filter(p => p.condition === conditionFilter.value);
        }
        
        if (priceSort && priceSort.value) {
            filteredProducts.sort((a, b) => {
                return priceSort.value === 'asc' ? a.price - b.price : b.price - a.price;
            });
        }
        
        productsGrid.innerHTML = filteredProducts.map(product => `
            <div class="product-card ${product.discount > 0 ? 'discounted' : ''}">
                ${product.discount > 0 ? `<div class="discount-badge">${product.discount}% خصم</div>` : ''}
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    ${product.stock <= 2 ? '<div class="low-stock">كمية محدودة</div>' : ''}
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-specs">${product.specs}</p>
                    <div class="product-rating">
                        ${'⭐'.repeat(Math.floor(product.rating))} (${product.rating})
                    </div>
                    <div class="product-price">
                        ${product.discount > 0 ? `
                            <span class="original-price">${product.price} ${getCurrencySymbol(product.currency)}</span>
                            <span class="discounted-price">${(product.price * (1 - product.discount / 100)).toFixed(2)} ${getCurrencySymbol(product.currency)}</span>
                        ` : `
                            <span class="price">${product.price} ${getCurrencySymbol(product.currency)}</span>
                        `}
                    </div>
                    <div class="product-condition">${product.condition}</div>
                    <div class="product-stock">متوفر: ${product.stock} قطعة</div>
                    <div class="product-actions">
                        <button onclick="addToCart(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
                            <i class="fas fa-cart-plus"></i> إضافة للسلة
                        </button>
                        <button onclick="showProductDetails(${product.id})">
                            <i class="fas fa-info-circle"></i> تفاصيل
                        </button>
                        <button onclick="inquireProduct(${product.id})">
                            <i class="fas fa-question-circle"></i> استفسر
                        </button>
                        <button onclick="compareProduct(${product.id})">
                            <i class="fas fa-balance-scale"></i> مقارنة
                        </button>
                    </div>
                </div>
                <div class="product-qr">
                    <canvas id="product-qr-${product.id}" width="50" height="50"></canvas>
                </div>
            </div>
        `).join('');
        
        // Generate QR codes for products
        filteredProducts.forEach(product => {
            setTimeout(() => {
                generateQRCode(`product-${product.id}`, `product-qr-${product.id}`);
            }, 100);
        });
        
        updateCartDisplay();
    }

    function addShoppingFilters() {
        const shopSection = document.getElementById('shop');
        if (!shopSection || document.getElementById('shopping-filters')) return;
        
        const filtersDiv = document.createElement('div');
        filtersDiv.id = 'shopping-filters';
        filtersDiv.className = 'shopping-filters';
        filtersDiv.innerHTML = `
            <div class="filter-row">
                <div class="filter-group">
                    <label>الفئة:</label>
                    <select id="category-filter" onchange="updateProductsDisplay()">
                        <option value="">جميع الفئات</option>
                        <option value="iPhone">آيفون</option>
                        <option value="Samsung">سامسونغ</option>
                        <option value="Xiaomi">شاومي</option>
                        <option value="Huawei">هواوي</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label>ترتيب السعر:</label>
                    <select id="price-sort" onchange="updateProductsDisplay()">
                        <option value="">بدون ترتيب</option>
                        <option value="asc">من الأقل للأعلى</option>
                        <option value="desc">من الأعلى للأقل</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label>الحالة:</label>
                    <select id="condition-filter" onchange="updateProductsDisplay()">
                        <option value="">جميع الحالات</option>
                        <option value="جديد">جديد</option>
                        <option value="مستعمل">مستعمل</option>
                        <option value="مجدد">مجدد</option>
                    </select>
                </div>
                <div class="filter-group">
                    <button onclick="showCart()" class="cart-btn">
                        <i class="fas fa-shopping-cart"></i> السلة (<span id="cart-count">0</span>)
                    </button>
                </div>
            </div>
        `;
        
        const productsGrid = document.getElementById('products-grid');
        if (productsGrid) shopSection.insertBefore(filtersDiv, productsGrid);
    }

    // Shopping cart functions
    window.addToCart = function(productId) {
        const product = products.find(p => p.id === productId);
        if (product && product.stock > 0) {
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            product.stock -= 1;
            updateCartDisplay();
            saveDataToStorage();
            showNotification(`تم إضافة ${product.name} للسلة`, 'success');
        }
    };

    window.showProductDetails = function(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content large-modal">
                    <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                    <h2>${product.name}</h2>
                    <div class="product-details">
                        <img src="${product.image}" alt="${product.name}" style="max-width: 300px;">
                        <div class="details-info">
                            <p><strong>السعر:</strong> ${product.price} ${getCurrencySymbol(product.currency)}</p>
                            <p><strong>الحالة:</strong> ${product.condition}</p>
                            <p><strong>المواصفات:</strong> ${product.specs}</p>
                            <p><strong>التقييم:</strong> ${'⭐'.repeat(Math.floor(product.rating))} (${product.rating})</p>
                            <p><strong>المتوفر:</strong> ${product.stock} قطعة</p>
                            ${product.discount > 0 ? `<p><strong>الخصم:</strong> ${product.discount}%</p>` : ''}
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            modal.style.display = 'block';
        }
    };

    window.inquireProduct = function(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                    <h2>استفسار عن ${product.name}</h2>
                    <form onsubmit="submitInquiry(event, ${productId})">
                        <input type="text" placeholder="الاسم" required>
                        <input type="tel" placeholder="رقم التواصل" required>
                        <textarea placeholder="ملاحظات أو استفسارات" required></textarea>
                        <button type="submit">إرسال الاستفسار</button>
                    </form>
                </div>
            `;
            document.body.appendChild(modal);
            modal.style.display = 'block';
        }
    };

    window.submitInquiry = function(event, productId) {
        event.preventDefault();
        const product = products.find(p => p.id === productId);
        if (product) showNotification(`تم إرسال استفسارك عن ${product.name}. سنتواصل معك قريباً`, 'success');
        const modalElement = event.target.closest('.modal');
        if (modalElement) modalElement.remove();
    };

    function updateCartDisplay() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        }
    }

    window.showCart = function() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content large-modal">
                <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <h2>سلة التسوق</h2>
                <div class="cart-items">
                    ${cart.length === 0 ? '<p>السلة فارغة</p>' : cart.map(item => `
                        <div class="cart-item">
                            <img src="${item.image}" alt="${item.name}" style="width: 80px;">
                            <div class="item-info">
                                <h4>${item.name}</h4>
                                <p>السعر: ${item.price} ${getCurrencySymbol(item.currency)}</p>
                                <p>الكمية: ${item.quantity}</p>
                            </div>
                            <button onclick="removeFromCart(${item.id})">حذف</button>
                        </div>
                    `).join('')}
                </div>
                ${cart.length > 0 ? `
                    <div class="cart-total">
                        <h3>الإجمالي: ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)} $</h3>
                        <button onclick="submitCartInquiry()">إرسال طلب</button>
                    </div>
                ` : ''}
            </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = 'block';
    };

    window.removeFromCart = function(productId) {
        const itemIndex = cart.findIndex(item => item.id === productId);
        if (itemIndex > -1) {
            const product = products.find(p => p.id === productId);
            if (product) product.stock += cart[itemIndex].quantity;
            cart.splice(itemIndex, 1);
            updateCartDisplay();
            saveDataToStorage();
            showNotification('تم حذف المنتج من السلة', 'success');
        }
    };

    window.submitCartInquiry = function() {
        if (cart.length > 0) {
            showNotification('تم إرسال طلبك. سنتواصل معك قريباً', 'success');
            cart = [];
            updateCartDisplay();
            saveDataToStorage();
        }
    };

    // News section functions
    function updateNewsDisplay() {
        const newsFeed = document.getElementById('news-feed');
        if (!newsFeed) return;
        
        newsFeed.innerHTML = news.map(article => `
            <article class="news-article">
                <div class="news-image">
                    <img src="${article.image}" alt="${article.title}" loading="lazy">
                </div>
                <div class="news-content">
                    <h3>${article.title}</h3>
                    <p class="news-meta">
                        <span class="news-date">${article.date}</span>
                        <span class="news-author">بواسطة: ${article.author}</span>
                    </p>
                    <p class="news-excerpt">${article.content}</p>
                    <button onclick="readFullNews(${article.id})">اقرأ المزيد</button>
                </div>
            </article>
        `).join('');
    }

    window.readFullNews = function(newsId) {
        const article = news.find(n => n.id === newsId);
        if (article) {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content large-modal">
                    <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                    <h2>${article.title}</h2>
                    <img src="${article.image}" alt="${article.title}" style="max-width: 100%; margin: 20px 0;">
                    <p class="news-meta">${article.date} - ${article.author}</p>
                    <div class="news-full-content">
                        ${article.content}
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            modal.style.display = 'block';
        }
    };

    // Apps section functions
    function updateAppsDisplay() {
        const appsGrid = document.getElementById('apps-grid');
        if (!appsGrid) return;
        
        const categoryTabs = document.querySelectorAll('.category-tab');
        let activeCategory = 'security';
        
        categoryTabs.forEach(tab => {
            if (tab.classList.contains('active')) {
                activeCategory = tab.getAttribute('data-category');
            }
        });
        
        const categoryApps = apps[activeCategory] || [];
        
        appsGrid.innerHTML = categoryApps.map(app => `
            <div class="app-card">
                <div class="app-icon">
                    <i class="fas fa-mobile-alt"></i>
                </div>
                <div class="app-info">
                    <h4>${app.name}</h4>
                    <p>${app.description}</p>
                    <div class="app-rating">
                        ${'⭐'.repeat(Math.floor(app.rating))} (${app.rating})
                    </div>
                    <div class="app-actions">
                        <a href="${app.downloadUrl}" class="download-btn">
                            <i class="fas fa-download"></i> تحميل
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Category tabs functionality
    const categoryTabs = document.querySelectorAll('.category-tab');
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            updateAppsDisplay();
        });
    });

    // File upload functionality
    const appUploadForm = document.getElementById('app-upload-form');
    if (appUploadForm) {
        appUploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!hasPermission('manage_content')) {
                showNotification('ليس لديك صلاحية لرفع التطبيقات', 'error');
                return;
            }
            
            const formData = new FormData(this);
            const appName = formData.get('name') || (this.querySelector('input[type="text"]') ? this.querySelector('input[type="text"]').value : '');
            const category = formData.get('category') || (this.querySelector('select') ? this.querySelector('select').value : '');
            const description = formData.get('description') || (this.querySelector('textarea') ? this.querySelector('textarea').value : '');
            
            const newApp = {
                id: Date.now(),
                name: appName,
                description: description,
                category: category,
                downloadUrl: '#',
                rating: 4.0
            };
            
            if (!apps[category]) apps[category] = [];
            apps[category].push(newApp);
            
            saveDataToStorage();
            updateAppsDisplay();
            showNotification('تم رفع التطبيق بنجاح', 'success');
            this.reset();
        });
    }

    const newsUploadForm = document.getElementById('news-upload-form');
    if (newsUploadForm) {
        newsUploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!hasPermission('manage_content')) {
                showNotification('ليس لديك صلاحية لإضافة الأخبار', 'error');
                return;
            }
            
            const title = this.querySelector('input[type="text"]') ? this.querySelector('input[type="text"]').value : '';
            const content = this.querySelector('textarea') ? this.querySelector('textarea').value : '';
            
            const newNews = {
                id: Date.now(),
                title: title,
                content: content,
                image: 'https://via.placeholder.com/400x200?text=' + encodeURIComponent(title),
                date: new Date().toLocaleDateString('ar-EG'),
                author: currentUser ? currentUser.username : 'Unknown'
            };
            
            news.unshift(newNews);
            saveDataToStorage();
            updateNewsDisplay();
            updateDashboardStats();
            showNotification(`تم نشر الخبر: ${title}`, 'success');
            this.reset();
        });
    }

    // Ticker form submission
    const tickerForm = document.getElementById('ticker-form');
    if (tickerForm) {
        tickerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!hasPermission('manage_content')) {
                showNotification('ليس لديك صلاحية لإدارة المحتوى', 'error');
                return;
            }
            
            const newTextElement = document.getElementById('ticker-input');
            const tickerTextElement = document.getElementById('ticker-text');
            if (newTextElement && tickerTextElement) {
                tickerTextElement.textContent = newTextElement.value;
            }
            
            showNotification('تم تحديث الشريط المتحرك', 'success');
            this.reset();
        });
    }

    // Settings form submission
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!currentUser || currentUser.role !== 'admin') {
                showNotification('ليس لديك صلاحية لتعديل الإعدادات', 'error');
                return;
            }
            
            showNotification("تم حفظ الإعدادات بنجاح", "success");

            // Save social links
            const facebookInput = document.getElementById("facebook-link");
            const twitterInput = document.getElementById("twitter-link");
            const instagramInput = document.getElementById("instagram-link");
            const whatsappInput = document.getElementById("whatsapp-link");
            
            if (facebookInput) socialLinks.facebook = facebookInput.value;
            if (twitterInput) socialLinks.twitter = twitterInput.value;
            if (instagramInput) socialLinks.instagram = instagramInput.value;
            if (whatsappInput) socialLinks.whatsapp = whatsappInput.value;
            
            saveDataToStorage();
            updateFooterSocialLinks();
        });
    }

    // Edit device form submission
    const editDeviceForm = document.getElementById('edit-device-form');
    if (editDeviceForm) {
        editDeviceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const deviceCode = document.getElementById('edit-device-code').value;
            const device = devices.find(d => d.code === deviceCode);
            
            if (!device) {
                showNotification('لم يتم العثور على الجهاز', 'error');
                return;
            }

            // Update device data
            device.customerName = document.getElementById('edit-customer-name').value;
            device.deviceType = document.getElementById('edit-device-type').value;
            device.issue = document.getElementById('edit-device-issue').value;
            device.totalAmount = parseFloat(document.getElementById('edit-total-amount').value);
            device.paidAmount = parseFloat(document.getElementById('edit-paid-amount').value);
            device.remainingAmount = device.totalAmount - device.paidAmount;
            device.currency = document.getElementById('edit-currency').value;
            device.status = document.getElementById('edit-status').value;
            device.repairDetails = document.getElementById('edit-repair-details').value;
            device.notes = document.getElementById('edit-notes').value;

            saveDataToStorage();
            updateCustomersTable();
            updateFinancialSummary();
            updateDashboardStats();
            
            document.getElementById('edit-device-modal').style.display = 'none';
            showNotification(`تم تحديث بيانات الجهاز ${deviceCode} بنجاح`, 'success');
        });
    }

    // Receive payment form submission
    const receivePaymentForm = document.getElementById('receive-payment-form');
    if (receivePaymentForm) {
        receivePaymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const deviceCode = document.getElementById('payment-device-code').value;
            const paymentAmount = parseFloat(document.getElementById('payment-amount').value);
            const paymentMethod = document.getElementById('payment-method').value;
            
            const device = devices.find(d => d.code === deviceCode);
            if (!device) {
                showNotification('لم يتم العثور على الجهاز', 'error');
                return;
            }

            if (paymentAmount <= 0 || paymentAmount > device.remainingAmount) {
                showNotification('مبلغ الدفعة غير صحيح', 'error');
                return;
            }

            // Update device payment
            device.paidAmount += paymentAmount;
            device.remainingAmount = device.totalAmount - device.paidAmount;

            // Add financial transaction
            addTransaction({
                type: 'income',
                amount: paymentAmount,
                currency: device.currency,
                description: `دفعة من ${device.customerName} - جهاز ${deviceCode} (${paymentMethod})`,
                deviceCode: deviceCode,
                customerName: device.customerName,
                date: new Date().toISOString()
            });

            saveDataToStorage();
            updateCustomersTable();
            updateFinancialSummary();
            updateCashBox();
            updateDashboardStats();
            
            document.getElementById('receive-payment-modal').style.display = 'none';
            showNotification(`تم تسجيل دفعة بمبلغ ${paymentAmount} ${getCurrencySymbol(device.currency)} للجهاز ${deviceCode}`, 'success');
        });
    }

    // Calculate remaining amount in edit form
    const editTotalAmount = document.getElementById('edit-total-amount');
    const editPaidAmount = document.getElementById('edit-paid-amount');
    const editRemainingAmount = document.getElementById('edit-remaining-amount');

    function calculateEditRemainingAmount() {
        if (editTotalAmount && editPaidAmount && editRemainingAmount) {
            const total = parseFloat(editTotalAmount.value) || 0;
            const paid = parseFloat(editPaidAmount.value) || 0;
            const remaining = total - paid;
            editRemainingAmount.value = remaining.toFixed(2);
        }
    }

    if (editTotalAmount && editPaidAmount) {
        editTotalAmount.addEventListener('input', calculateEditRemainingAmount);
        editPaidAmount.addEventListener('input', calculateEditRemainingAmount);
    }

    // Print receipt function with 3 copies
    window.printReceipt = function(deviceCode) {
        const device = devices.find(d => d.code === deviceCode);
        if (device) {
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(`
                    <html>
                    <head>
                        <title>إيصال استلام جهاز - ${device.code}</title>
                        <style>
                            body { font-family: Arial, sans-serif; direction: rtl; text-align: right; margin: 0; padding: 0; }
                            @page { size: 4in 6in; margin: 0; }
                            .print-container { width: 4in; height: 6in; display: flex; flex-direction: column; justify-content: space-around; align-items: center; padding: 0.1in; }
                            .receipt-copy { width: 3.8in; height: 1.8in; border: 1px dashed #ccc; padding: 0.1in; margin-bottom: 0.1in; position: relative; overflow: hidden; }
                            .receipt-copy:last-child { margin-bottom: 0; }
                            .receipt-copy h4 { text-align: center; margin-top: 0; margin-bottom: 5px; font-size: 0.9em; }
                            .receipt-copy p { margin: 2px 0; font-size: 0.7em; line-height: 1.2; }
                            .receipt-copy .qr-placeholder { text-align: center; font-size: 0.6em; margin-top: 5px; }
                            .cut-line { position: absolute; background-color: black; }
                            .cut-line.horizontal { left: 0; right: 0; height: 1px; }
                            .cut-line.h1 { top: 1.9in; }
                            .cut-line.h2 { top: 3.8in; }
                            .label-copy { width: 3.8in; height: 1.8in; border: 1px dashed #ccc; padding: 0.1in; margin-bottom: 0.1in; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: center; align-items: center; }
                            .label-copy h4 { font-size: 1.2em; margin-bottom: 5px; }
                            .label-copy p { font-size: 0.9em; margin: 2px 0; }
                        </style>
                    </head>
                    <body>
                        <div class="print-container">
                            <!-- Customer Copy -->
                            <div class="receipt-copy customer-copy">
                                <h4>مركز أيمن لصيانة الموبايل - إيصال الزبون</h4>
                                <p><strong>كود الجهاز:</strong> ${device.code}</p>
                                <p><strong>اسم الزبون:</strong> ${device.customerName}</p>
                                <p><strong>نوع الجهاز:</strong> ${device.deviceType}</p>
                                <p><strong>العطل:</strong> ${device.issue}</p>
                                <p><strong>المبلغ الإجمالي:</strong> ${device.totalAmount} ${getCurrencySymbol(device.currency)}</p>
                                <p><strong>المبلغ المدفوع:</strong> ${device.paidAmount} ${getCurrencySymbol(device.currency)}</p>
                                <p><strong>المبلغ المتبقي:</strong> ${device.remainingAmount} ${getCurrencySymbol(device.currency)}</p>
                                <p><strong>تاريخ الاستلام:</strong> ${device.receiveDate}</p>
                                <div class="qr-placeholder">QR: ${device.code}</div>
                            </div>
                            <div class="cut-line horizontal h1"></div>

                            <!-- Archive Copy -->
                            <div class="receipt-copy archive-copy">
                                <h4>مركز أيمن لصيانة الموبايل - إيصال الأرشيف</h4>
                                <p><strong>كود الجهاز:</strong> ${device.code}</p>
                                <p><strong>اسم الزبون:</strong> ${device.customerName}</p>
                                <p><strong>نوع الجهاز:</strong> ${device.deviceType}</p>
                                <p><strong>العطل:</strong> ${device.issue}</p>
                                <p><strong>المبلغ الإجمالي:</strong> ${device.totalAmount} ${getCurrencySymbol(device.currency)}</p>
                                <p><strong>المبلغ المدفوع:</strong> ${device.paidAmount} ${getCurrencySymbol(device.currency)}</p>
                                <p><strong>المبلغ المتبقي:</strong> ${device.remainingAmount} ${getCurrencySymbol(device.currency)}</p>
                                <p><strong>تاريخ الاستلام:</strong> ${device.receiveDate}</p>
                                <div class="qr-placeholder">QR: ${device.code}</div>
                            </div>
                            <div class="cut-line horizontal h2"></div>

                            <!-- Device Label Copy -->
                            <div class="receipt-copy label-copy">
                                <h4>لصاقة الجهاز</h4>
                                <p><strong>كود:</strong> ${device.code}</p>
                                <p><strong>الزبون:</strong> ${device.customerName}</p>
                                <p><strong>النوع:</strong> ${device.deviceType}</p>
                                <p><strong>العطل:</strong> ${device.issue}</p>
                                <div class="qr-placeholder">QR: ${device.code}</div>
                            </div>
                        </div>
                    </body>
                    </html>
                `);
                printWindow.document.close();
                printWindow.print();
            }
        }
    };

    // Helper function to get currency symbol
    function getCurrencySymbol(currencyCode) {
        switch (currencyCode) {
            case 'USD': return '$';
            case 'SYP': return 'ل.س';
            case 'TRY': return '₺';
            default: return currencyCode;
        }
    }

    // Helper function to get status text
    function getStatusText(status) {
        switch (status) {
            case 'received': return 'تم الاستلام';
            case 'in_progress': return 'قيد الإصلاح';
            case 'waiting_parts': return 'في انتظار قطع الغيار';
            case 'completed': return 'تم الإصلاح';
            case 'delivered': return 'تم التسليم';
            default: return status;
        }
    }

    // Function to update footer social links
    function updateFooterSocialLinks() {
        const facebookLink = document.querySelector('footer .social-links a[href*="facebook"]');
        const twitterLink = document.querySelector('footer .social-links a[href*="twitter"]');
        const instagramLink = document.querySelector('footer .social-links a[href*="instagram"]');
        const whatsappLink = document.querySelector('footer .social-links a[href*="whatsapp"]');
        
        if (facebookLink) facebookLink.href = socialLinks.facebook;
        if (twitterLink) twitterLink.href = socialLinks.twitter;
        if (instagramLink) instagramLink.href = socialLinks.instagram;
        if (whatsappLink) whatsappLink.href = socialLinks.whatsapp;
    }

    // Initializations on page load
    updateCustomersTable();
    updateFinancialSummary();
    updateCashBox();
    updateGeneralLedger();
    updateDashboardStats();
    updateUIBasedOnPermissions();

    // Set default tab to Status Check
    const defaultTabBtn = document.querySelector('.main-tabs .tab-icon-btn[data-tab="status-check"]');
    if (defaultTabBtn) {
        defaultTabBtn.click();
    }

    // Smart Assistant Logic
document.addEventListener("DOMContentLoaded", function() {
    const phoneBrandSelect = document.getElementById("phone-brand");
    const phoneModelSelect = document.getElementById("phone-model");
    const deviceIssueAssistantSelect = document.getElementById("device-issue-assistant");
    const getSuggestionsBtn = document.getElementById("get-suggestions-btn");
    const suggestionsResults = document.getElementById("suggestions-results");
    const solutionsResults = document.getElementById("solutions-results");
    const schematicsResults = document.getElementById("schematics-results");

    const phoneModels = {
        "iPhone": ["iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15 Plus", "iPhone 15", "iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14 Plus", "iPhone 14", "iPhone 13 Pro Max", "iPhone 13 Pro", "iPhone 13 mini", "iPhone 13", "iPhone 12 Pro Max", "iPhone 12 Pro", "iPhone 12 mini", "iPhone 12", "iPhone SE (3rd generation)", "iPhone 11 Pro Max", "iPhone 11 Pro", "iPhone 11", "iPhone XS Max", "iPhone XS", "iPhone XR", "iPhone X", "iPhone 8 Plus", "iPhone 8", "iPhone 7 Plus", "iPhone 7", "iPhone 6S Plus", "iPhone 6S", "iPhone SE (1st generation)"],
        "Samsung": ["Galaxy S24 Ultra", "Galaxy S24+", "Galaxy S24", "Galaxy S23 Ultra", "Galaxy S23+", "Galaxy S23", "Galaxy Z Fold5", "Galaxy Z Flip5", "Galaxy A55", "Galaxy A35", "Galaxy A15", "Galaxy M55", "Galaxy M35", "Galaxy M15"],
        "Huawei": ["P60 Pro", "Mate 50 Pro", "P50 Pro", "P50 Pocket", "Nova 11 Pro", "Nova 11", "Nova 10 Pro", "Nova 10"],
        "Xiaomi": ["Xiaomi 14 Ultra", "Xiaomi 14", "Xiaomi 13 Ultra", "Xiaomi 13 Pro", "Xiaomi 13", "Redmi Note 13 Pro+", "Redmi Note 13 Pro", "Redmi Note 13", "POCO X6 Pro", "POCO X6"],
        "Oppo": ["Find X7 Ultra", "Find X7", "Reno11 Pro", "Reno11", "A79", "A59"],
        "Vivo": ["X100 Pro", "X100", "V30 Pro", "V30", "Y200e", "Y100"],
        "OnePlus": ["OnePlus 12", "OnePlus 12R", "OnePlus Open", "OnePlus 11", "OnePlus Nord 3", "OnePlus Nord CE 3"],
        "Other": ["موديل آخر"]
    };

    phoneBrandSelect.addEventListener("change", function() {
        const selectedBrand = phoneBrandSelect.value;
        phoneModelSelect.innerHTML = ">اختر موديل الهاتف</option>"; // Clear previous models
        if (selectedBrand && phoneModels[selectedBrand]) {
            phoneModels[selectedBrand].forEach(model => {
                const option = document.createElement("option");
                option.value = model;
                option.textContent = model;
                phoneModelSelect.appendChild(option);
            });
        }
    });

    getSuggestionsBtn.addEventListener("click", function() {
        const brand = phoneBrandSelect.value;
        const model = phoneModelSelect.value;
        const issue = deviceIssueAssistantSelect.value;

        if (!brand || !model || !issue) {
            showNotification("الرجاء اختيار ماركة الهاتف، الموديل، والعطل.", "error");
            return;
        }

        // For now, we'll use dummy data. In a real application, this would fetch from a database.
        suggestionsResults.innerHTML = `<h4>اقتراحات:</h4><p>لا توجد اقتراحات محددة لـ <strong>${brand} ${model}</strong> مع عطل <strong>${issue}</strong> في قاعدة البيانات الحالية.</p>`;
        solutionsResults.innerHTML = `<h4>حلول مقترحة:</h4><p>لا توجد حلول محددة لـ <strong>${brand} ${model}</strong> مع عطل <strong>${issue}</strong> في قاعدة البيانات الحالية.</p>`;
        schematicsResults.innerHTML = `<h4>مخططات:</h4><p>لا توجد مخططات متوفرة لـ <strong>${brand} ${model}</strong> مع عطل <strong>${issue}</strong> في قاعدة البيانات الحالية.</p>`;

        // Example of how you might add specific suggestions (this would be much more complex in reality)
        if (brand === "iPhone" && issue === "شاشة مكسورة") {
            suggestionsResults.innerHTML = `<h4>اقتراحات:</h4><p>1. تحقق من سلامة كابل الشاشة. 2. جرب شاشة بديلة.</p>`;
            solutionsResults.innerHTML = `<h4>حلول مقترحة:</h4><p>استبدال الشاشة بالكامل.</p>`;
            schematicsResults.innerHTML = `<h4>مخططات:</h4><p>ابحث عن مخططات iPhone ${model} للشاشة.</p>`;
        }

        showNotification("تم البحث عن اقتراحات.", "success");
    });
});





    const assistantKnowledgeBase = {
        "iPhone": {
            "شاشة مكسورة": {
                "suggestions": [
                    "تحقق من سلامة كابل الشاشة وتوصيلاته.",
                    "جرب شاشة بديلة للتأكد من أن المشكلة ليست في اللوحة الأم."
                ],
                "solutions": [
                    "استبدال الشاشة بالكامل."
                ],
                "schematics": [
                    "/home/ubuntu/upload/search_images/EZeBmuRX1bf9.png",
                    "/home/ubuntu/upload/search_images/v1DxnlM9lQDn.jpg"
                ]
            },
            "بطارية تالفة": {
                "suggestions": [
                    "تحقق من صحة البطارية من خلال إعدادات الجهاز.",
                    "جرب شاحن أصلي وكابل آخر."
                ],
                "solutions": [
                    "استبدال البطارية."
                ],
                "schematics": []
            }
        },
        "Samsung": {
            "مشكلة في الشحن": {
                "suggestions": [
                    "نظف منفذ الشحن من الغبار والأوساخ.",
                    "جرب شاحن وكابل آخرين."
                ],
                "solutions": [
                    "استبدال منفذ الشحن."
                ],
                "schematics": []
            }
        }
    };

    getSuggestionsBtn.addEventListener("click", function() {
        const brand = phoneBrandSelect.value;
        const model = phoneModelSelect.value;
        const issue = deviceIssueAssistantSelect.value;

        if (!brand || !model || !issue) {
            showNotification("الرجاء اختيار ماركة الهاتف، الموديل، والعطل.", "error");
            return;
        }

        let suggestions = "لا توجد اقتراحات محددة.";
        let solutions = "لا توجد حلول محددة.";
        let schematics = "لا توجد مخططات متوفرة.";

        if (assistantKnowledgeBase[brand] && assistantKnowledgeBase[brand][issue]) {
            const data = assistantKnowledgeBase[brand][issue];
            if (data.suggestions.length > 0) {
                suggestions = data.suggestions.map((s, i) => `${i + 1}. ${s}`).join("<br>");
            }
            if (data.solutions.length > 0) {
                solutions = data.solutions.map((s, i) => `${i + 1}. ${s}`).join("<br>");
            }
            if (data.schematics.length > 0) {
                schematics = data.schematics.map(s => `<img src="${s}" alt="مخطط" style="max-width: 100%; height: auto;">`).join("<br>");
            }
        }

        suggestionsResults.innerHTML = `<h4>اقتراحات:</h4><p>${suggestions}</p>`;
        solutionsResults.innerHTML = `<h4>حلول مقترحة:</h4><p>${solutions}</p>`;
        schematicsResults.innerHTML = `<h4>مخططات:</h4><p>${schematics}</p>`;

        showNotification("تم البحث عن اقتراحات.", "success");
    });
    console.log('Enhanced Mobile Repair Center System loaded with all features.');
});





    // Print receipt modal function
    window.printReceiptModal = function(deviceCode) {
        const printWindow = window.open('', '_blank');
        const receiptContent = document.getElementById('receipt-preview').innerHTML;
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>إيصال استلام الهاتف - ${deviceCode}</title>
                <style>
                    @page {
                        size: 4in 6in;
                        margin: 0.2in;
                    }
                    body {
                        font-family: 'Cairo', Arial, sans-serif;
                        direction: rtl;
                        margin: 0;
                        padding: 0;
                        font-size: 12px;
                    }
                    .print-container {
                        width: 100%;
                    }
                    .receipt-copy {
                        page-break-after: always;
                        padding: 10px;
                        border: 1px solid #ddd;
                        margin-bottom: 10px;
                    }
                    .receipt-copy:last-child {
                        page-break-after: avoid;
                    }
                    .receipt-header {
                        text-align: center;
                        margin-bottom: 15px;
                        border-bottom: 2px solid #333;
                        padding-bottom: 10px;
                    }
                    .receipt-logo {
                        width: 40px;
                        height: 40px;
                        margin-bottom: 5px;
                    }
                    .receipt-header h3 {
                        margin: 5px 0;
                        font-size: 14px;
                        color: #333;
                    }
                    .receipt-header h4 {
                        margin: 5px 0;
                        font-size: 12px;
                        color: #666;
                        background-color: #f0f0f0;
                        padding: 3px;
                        border-radius: 3px;
                    }
                    .receipt-info p, .label-info p {
                        margin: 8px 0;
                        font-size: 11px;
                        line-height: 1.4;
                    }
                    .qr-code-section {
                        text-align: center;
                        margin-top: 15px;
                        border-top: 1px solid #ddd;
                        padding-top: 10px;
                    }
                    .qr-code-canvas {
                        width: 60px;
                        height: 60px;
                        margin: 5px auto;
                        display: block;
                    }
                    .cut-line {
                        border-top: 2px dashed #999;
                        margin: 15px 0;
                        position: relative;
                    }
                    .cut-line::before {
                        content: "✂️ قص هنا";
                        position: absolute;
                        top: -10px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: white;
                        padding: 0 10px;
                        font-size: 10px;
                        color: #666;
                    }
                    .label-copy {
                        background-color: #f9f9f9;
                    }
                    .label-copy .receipt-header h3 {
                        font-size: 12px;
                        background-color: #333;
                        color: white;
                        padding: 5px;
                        border-radius: 3px;
                    }
                    .label-info p {
                        font-size: 10px;
                        margin: 5px 0;
                    }
                    @media print {
                        .cut-line::before {
                            display: none;
                        }
                    }
                </style>
            </head>
            <body>
                ${receiptContent}
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    // Download receipt as PDF function
    window.downloadReceiptPDF = function(deviceCode) {
        const device = devices.find(d => d.code === deviceCode);
        if (!device) {
            showNotification('لم يتم العثور على الجهاز', 'error');
            return;
        }

        // Create a temporary div for PDF generation
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = document.getElementById('receipt-preview').innerHTML;
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.width = '4in';
        tempDiv.style.fontFamily = 'Arial, sans-serif';
        tempDiv.style.fontSize = '12px';
        tempDiv.style.direction = 'rtl';
        
        document.body.appendChild(tempDiv);
        
        // Use html2canvas and jsPDF to generate PDF
        if (typeof html2canvas !== 'undefined' && typeof jsPDF !== 'undefined') {
            html2canvas(tempDiv, {
                scale: 2,
                useCORS: true,
                allowTaint: true
            }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'in', [4, 6]);
                pdf.addImage(imgData, 'PNG', 0, 0, 4, 6);
                pdf.save(`receipt-${deviceCode}.pdf`);
                
                document.body.removeChild(tempDiv);
                showNotification('تم تحميل الإيصال بصيغة PDF بنجاح', 'success');
            }).catch(error => {
                console.error('Error generating PDF:', error);
                document.body.removeChild(tempDiv);
                showNotification('حدث خطأ في تحميل الإيصال', 'error');
            });
        } else {
            // Fallback: open print dialog
            printReceiptModal(deviceCode);
            document.body.removeChild(tempDiv);
        }
    };

    // Generate QR Code function
    function generateQRCode(text, canvasId) {
        const canvas = document.getElementById(canvasId);
        if (canvas && typeof QRCode !== 'undefined') {
            // Clear previous content
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            QRCode.toCanvas(canvas, text, {
                width: 150,
                height: 150,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            }, function (error) {
                if (error) {
                    console.error('QR Code generation error:', error);
                    // Fallback: create simple text placeholder
                    createQRCodeFallback(canvas, text);
                }
            });
        } else if (!canvas) {
            console.warn(`Canvas element with ID ${canvasId} not found for QR code generation.`);
        } else if (typeof QRCode === 'undefined') {
            console.error('QRCode.js library is not loaded.');
            // Create fallback if canvas exists
            if (canvas) {
                createQRCodeFallback(canvas, text);
            }
        }
    }


    // Delivery service functionality
    let deliveryRequests = JSON.parse(localStorage.getItem('deliveryRequests')) || [];

    // Handle delivery request form submission
    const deliveryRequestForm = document.getElementById('delivery-request-form');
    if (deliveryRequestForm) {
        deliveryRequestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const deliveryRequest = {
                id: 'DEL' + Date.now(),
                customerName: document.getElementById('delivery-customer-name').value,
                phone: document.getElementById('delivery-phone').value,
                deviceName: document.getElementById('delivery-device-name').value,
                issue: document.getElementById('delivery-issue').value,
                address: document.getElementById('delivery-address').value,
                location: document.getElementById('delivery-location').value,
                preferredTime: document.getElementById('delivery-preferred-time').value,
                notes: document.getElementById('delivery-notes').value,
                status: 'pending',
                requestDate: new Date().toLocaleString('ar-EG'),
                timestamp: Date.now()
            };
            
            deliveryRequests.push(deliveryRequest);
            localStorage.setItem('deliveryRequests', JSON.stringify(deliveryRequests));
            
            showNotification('تم إرسال طلب التوصيل بنجاح! سيتم التواصل معك قريباً', 'success');
            deliveryRequestForm.reset();
            document.getElementById('delivery-location').value = '';
            
            // Update admin panel if visible
            updateDeliveryRequestsList();
            
            // Show notification badge for admin
            updateDeliveryNotificationBadge();
        });
    }

    // Get current location
    const getLocationBtn = document.getElementById('get-location-btn');
    if (getLocationBtn) {
        getLocationBtn.addEventListener('click', function() {
            if (navigator.geolocation) {
                getLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحديد...';
                getLocationBtn.disabled = true;
                
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        document.getElementById('delivery-location').value = `${lat}, ${lng}`;
                        
                        getLocationBtn.innerHTML = '<i class="fas fa-check"></i> تم التحديد';
                        getLocationBtn.disabled = false;
                        
                        setTimeout(() => {
                            getLocationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> تحديد الموقع';
                        }, 2000);
                    },
                    function(error) {
                        showNotification('لا يمكن الحصول على الموقع الحالي', 'error');
                        getLocationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> تحديد الموقع';
                        getLocationBtn.disabled = false;
                    }
                );
            } else {
                showNotification('المتصفح لا يدعم خدمة تحديد الموقع', 'error');
            }
        });
    }

    // Update delivery requests list for admin
    function updateDeliveryRequestsList() {
        const requestsList = document.getElementById('delivery-requests-list');
        if (!requestsList) return;
        
        requestsList.innerHTML = '';
        
        if (deliveryRequests.length === 0) {
            requestsList.innerHTML = '<p class="no-requests">لا توجد طلبات توصيل حالياً</p>';
            return;
        }
        
        deliveryRequests.sort((a, b) => b.timestamp - a.timestamp).forEach(request => {
            const requestCard = document.createElement('div');
            requestCard.className = `delivery-request-card ${request.status}`;
            requestCard.innerHTML = `
                <div class="request-header">
                    <h4>${request.customerName}</h4>
                    <span class="request-status ${request.status}">${getDeliveryStatusText(request.status)}</span>
                </div>
                <div class="request-details">
                    <p><strong>الهاتف:</strong> ${request.phone}</p>
                    <p><strong>الجهاز:</strong> ${request.deviceName}</p>
                    <p><strong>العطل:</strong> ${request.issue}</p>
                    <p><strong>العنوان:</strong> ${request.address}</p>
                    ${request.preferredTime ? `<p><strong>الوقت المفضل:</strong> ${getPreferredTimeText(request.preferredTime)}</p>` : ''}
                    ${request.notes ? `<p><strong>ملاحظات:</strong> ${request.notes}</p>` : ''}
                    ${request.location ? `<p><strong>الموقع:</strong> <a href="https://maps.google.com/?q=${request.location}" target="_blank">عرض على الخريطة</a></p>` : ''}
                    <p><strong>تاريخ الطلب:</strong> ${request.requestDate}</p>
                </div>
                <div class="request-actions">
                    ${request.status === 'pending' ? `
                        <button onclick="updateDeliveryRequestStatus('${request.id}', 'accepted')" class="accept-btn">
                            <i class="fas fa-check"></i> قبول الطلب
                        </button>
                        <button onclick="updateDeliveryRequestStatus('${request.id}', 'rejected')" class="reject-btn">
                            <i class="fas fa-times"></i> رفض الطلب
                        </button>
                    ` : ''}
                    ${request.status === 'accepted' ? `
                        <button onclick="updateDeliveryRequestStatus('${request.id}', 'picked_up')" class="pickup-btn">
                            <i class="fas fa-truck"></i> تم الاستلام
                        </button>
                    ` : ''}
                    ${request.status === 'picked_up' ? `
                        <button onclick="updateDeliveryRequestStatus('${request.id}', 'completed')" class="complete-btn">
                            <i class="fas fa-check-circle"></i> تم التسليم
                        </button>
                    ` : ''}
                    <button onclick="deleteDeliveryRequest('${request.id}')" class="delete-btn">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </div>
            `;
            requestsList.appendChild(requestCard);
        });
    }

    // Update delivery request status
    window.updateDeliveryRequestStatus = function(requestId, newStatus) {
        const request = deliveryRequests.find(r => r.id === requestId);
        if (!request) return;
        
        request.status = newStatus;
        request.lastUpdated = new Date().toLocaleString('ar-EG');
        
        localStorage.setItem('deliveryRequests', JSON.stringify(deliveryRequests));
        updateDeliveryRequestsList();
        updateDeliveryNotificationBadge();
        
        const statusText = getDeliveryStatusText(newStatus);
        showNotification(`تم تحديث حالة طلب التوصيل إلى: ${statusText}`, 'success');
    };

    // Delete delivery request
    window.deleteDeliveryRequest = function(requestId) {
        if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
        
        const index = deliveryRequests.findIndex(r => r.id === requestId);
        if (index > -1) {
            deliveryRequests.splice(index, 1);
            localStorage.setItem('deliveryRequests', JSON.stringify(deliveryRequests));
            updateDeliveryRequestsList();
            updateDeliveryNotificationBadge();
            showNotification('تم حذف طلب التوصيل', 'success');
        }
    };

    // Get delivery status text
    function getDeliveryStatusText(status) {
        const statusTexts = {
            'pending': 'في انتظار الموافقة',
            'accepted': 'تم قبول الطلب',
            'rejected': 'تم رفض الطلب',
            'picked_up': 'تم استلام الجهاز',
            'completed': 'تم التسليم'
        };
        return statusTexts[status] || status;
    }

    // Get preferred time text
    function getPreferredTimeText(time) {
        const timeTexts = {
            'morning': 'صباحاً (9:00 - 12:00)',
            'afternoon': 'بعد الظهر (12:00 - 17:00)',
            'evening': 'مساءً (17:00 - 20:00)'
        };
        return timeTexts[time] || time;
    }

    // Update delivery notification badge
    function updateDeliveryNotificationBadge() {
        const pendingRequests = deliveryRequests.filter(r => r.status === 'pending').length;
        
        // Add notification badge to delivery tab if there are pending requests
        const deliveryTab = document.querySelector('[data-tab="delivery"]');
        if (deliveryTab) {
            let badge = deliveryTab.querySelector('.notification-badge');
            if (pendingRequests > 0) {
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'notification-badge';
                    deliveryTab.appendChild(badge);
                }
                badge.textContent = pendingRequests;
                badge.style.display = 'block';
            } else if (badge) {
                badge.style.display = 'none';
            }
        }
    }

    // Show delivery admin panel for logged in users
    function toggleDeliveryAdminPanel() {
        const adminPanel = document.getElementById('delivery-admin-panel');
        if (adminPanel && currentUser && (currentUser.role === 'admin' || currentUser.role === 'employee')) {
            adminPanel.style.display = 'block';
            updateDeliveryRequestsList();
        }
    }

    // Initialize delivery functionality
    function initializeDeliveryService() {
        updateDeliveryNotificationBadge();
        toggleDeliveryAdminPanel();
    }

    // Call initialization when page loads
    initializeDeliveryService();


    // Close receipt modal function
    window.closeReceiptModal = function() {
        const modal = document.getElementById('receipt-modal');
        if (modal) {
            modal.remove();
        }
    };

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const receiptModal = document.getElementById('receipt-modal');
        if (receiptModal && event.target === receiptModal) {
            closeReceiptModal();
        }
    });


    // General modal close functionality
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Close all modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    // Close modals with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal[style*="display: block"], .modal[style*="display:block"]');
            openModals.forEach(modal => {
                modal.style.display = 'none';
            });
            
            // Also close receipt modal if it exists
            const receiptModal = document.getElementById('receipt-modal');
            if (receiptModal) {
                receiptModal.remove();
            }
        }
    });

    // Add close functionality to all existing close buttons
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('close') || event.target.closest('.close')) {
            const modal = event.target.closest('.modal');
            if (modal) {
                if (modal.id === 'receipt-modal') {
                    modal.remove();
                } else {
                    modal.style.display = 'none';
                }
            }
        }
    });

