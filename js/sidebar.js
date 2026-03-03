// Sidebar role switcher functionality

// Check client status on page load (for clients only)
function checkClientStatus() {
    const currentRole = getCurrentRole();
    if (currentRole === 'client') {
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
            const clientStatus = localStorage.getItem('clientStatus_' + userEmail);
            if (clientStatus === 'Maintenance') {
                window.location.href = '../maintenance.html';
            } else if (clientStatus === 'Inactive') {
                alert('❌ Your account has been deactivated. Please contact support.');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userEmail');
                window.location.href = '../login.html';
            }
        }
    }
}

// Run status check on page load
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', checkClientStatus);
}

// Get current role from URL or localStorage
function getCurrentRole() {
    const path = window.location.pathname;
    if (path.includes('/admin/')) return 'admin';
    if (path.includes('/employee/')) return 'employee';
    if (path.includes('/client/')) return 'client';
    return localStorage.getItem('userRole') || 'client';
}

// Get current page name
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().replace('.html', '');
    return page || 'dashboard';
}

// Role-specific navigation items
const navigationItems = {
    admin: [
        { name: 'Dashboard', page: 'dashboard', icon: '📊' },
        { name: 'Users', page: 'clients', icon: '👥' },
        { name: 'Permissions', page: 'permissions', icon: '🔐' },
        { name: 'Accounts', page: 'accounts', icon: '💳' },
        { name: 'Finance', page: 'topups', icon: '💰' },
        { name: 'Marketplace', page: 'marketplace', icon: '🛍️' },
        { name: 'Platform Payments', page: 'platform-payments', icon: '💳' },
        { name: 'Settings', page: 'settings', icon: '⚙️' }
        
    ],
    employee: [
        { name: 'Dashboard', page: 'dashboard', icon: '📊' },
        { name: 'Users', page: 'clients', icon: '👥' },
        { name: 'Accounts', page: 'accounts', icon: '💳' },
        { name: 'Finance', page: 'topups', icon: '💰' },
        { name: 'Marketplace', page: 'marketplace', icon: '🛍️' },
        { name: 'Platform Payments', page: 'platform-payments', icon: '💳' }
    ],
    client: [
        { name: 'Dashboard', page: 'dashboard', icon: '📊' },
        { name: 'Accounts', page: 'accounts', icon: '💳' },
        { name: 'Marketplace', page: 'marketplace', icon: '🛍️' },
        { name: 'Transactions', page: 'transactions', icon: '💰' },
        { name: 'Teams', page: 'users', icon: '👥' },
        { name: 'Finance', page: 'topups', icon: '💰' },
        { name: 'Platform Payments', page: 'platform-payments', icon: '💳' },
        { name: 'Settings', page: 'settings', icon: '⚙️' }
    ]
};

// Wallet data (hardcoded demo)
const walletData = {
    mainWallet: 2450.00,
    platforms: [
        { 
            name: 'Facebook', 
            balance: 1250.00, 
            color: '#1877f2', 
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1877f2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>`, 
            iconPath: '../assets/icons/facebook.svg' 
        },
        { 
            name: 'Google', 
            balance: 890.50, 
            color: '#4285f4', 
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>`, 
            iconPath: '../assets/icons/google.svg' 
        },
        { 
            name: 'TikTok', 
            balance: 650.00, 
            color: '#000000', 
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#000000">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>`, 
            iconPath: '../assets/icons/tiktok.svg' 
        },
        { 
            name: 'Instagram', 
            balance: 420.75, 
            color: '#e4405f', 
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#e4405f">
                <defs>
                    <linearGradient id="instagram-gradient-sidebar" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:#f09433;stop-opacity:1" />
                        <stop offset="25%" style="stop-color:#e6683c;stop-opacity:1" />
                        <stop offset="50%" style="stop-color:#dc2743;stop-opacity:1" />
                        <stop offset="75%" style="stop-color:#cc2366;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#bc1888;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>`, 
            iconPath: '../assets/icons/instagram.svg' 
        }
    ]
};

// Notifications data (hardcoded demo)
const notificationsData = [
    {
        id: 1,
        title: 'New client pending approval',
        content: 'Client "Digital Marketing Pro SRL" (ID: 103) has registered and is waiting for account approval.',
        time: '14:32 23 Feb 2026',
        read: false,
        link: 'clients.html'
    },
    {
        id: 2,
        title: 'New top-up request from client',
        content: 'Client "Alex M." (ID: 100) created a new top-up request TU-120450 for 2,500.00 EUR via Wire transfer.',
        time: '13:15 23 Feb 2026',
        read: false,
        link: 'topups.html'
    },
    {
        id: 3,
        title: 'Client low balance alert',
        content: 'Client "Dana P." (ID: 101) main wallet balance is 45.00 USD, below their threshold of 100.00 USD.',
        time: '11:20 23 Feb 2026',
        read: false,
        link: 'clients.html'
    },
    {
        id: 4,
        title: 'New marketplace request',
        content: 'Client "Mihai R." (ID: 102) submitted a marketplace request for Facebook account setup.',
        time: '09:45 23 Feb 2026',
        read: false,
        link: 'marketplace.html'
    },
    {
        id: 5,
        title: 'Monthly income report ready',
        content: 'Monthly income report for February 2026 is now available. Total revenue: 15,420.00 USD.',
        time: '08:00 23 Feb 2026',
        read: true,
        link: 'income.html'
    }
];

// Get unread notifications count
function getUnreadNotificationsCount() {
    return notificationsData.filter(n => !n.read).length;
}

// Generate sidebar HTML
function generateSidebar() {
    const currentRole = getCurrentRole();
    const currentPage = getCurrentPage();
    let navItems = navigationItems[currentRole] || navigationItems.client;
    
    // Filter navigation items for employee based on permissions
    if (currentRole === 'employee' && typeof getAccessibleModules === 'function') {
        const accessibleModules = getAccessibleModules();
        const PAGE_TO_MODULE_MAP = {
            'dashboard': 'dashboard',
            'clients': 'users',
            'users': 'users',
            'accounts': 'accounts',
            'topups': 'finance',
            'income': 'finance',
            'transactions': 'finance',
            'internal-transactions': 'finance',
            'marketplace': 'marketplace',
            'platform-payments': 'platform-payments'
        };
        
        navItems = navItems.filter(item => {
            const moduleKey = PAGE_TO_MODULE_MAP[item.page];
            return moduleKey && accessibleModules.includes(moduleKey);
        });
    }

    const sidebarHTML = `
        <div class="sidebar-header">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                <h2 style="margin: 0;">${currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} Panel</h2>
                ${currentRole === 'admin' ? `
                    <button class="notification-btn-sidebar" id="notificationBtnSidebar" onclick="openNotifications()">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                        <span class="notification-badge-sidebar">${getUnreadNotificationsCount()}</span>
                    </button>
                ` : ''}
            </div>
            <div class="role-switcher">
                <label class="role-switcher-label">Switch Role</label>
                <select class="role-select" id="roleSwitcher" onchange="switchRole(this.value)">
                    <option value="admin" ${currentRole === 'admin' ? 'selected' : ''}>👨‍💼 Admin</option>
                    <option value="employee" ${currentRole === 'employee' ? 'selected' : ''}>👥 Employee</option>
                    <option value="client" ${currentRole === 'client' ? 'selected' : ''}>💼 Client</option>
                </select>
            </div>

            <!-- Wallet Widget -->
            <div class="wallet-widget">
                <div class="wallet-widget-content">
                    <div class="wallet-widget-icon">💰</div>
                    <div class="wallet-widget-info">
                        <div class="wallet-widget-label">Main Wallet</div>
                        <div class="wallet-widget-amount">${walletData.mainWallet.toFixed(2)}</div>
                    </div>
                </div>

                <!-- Hover Modal -->
                <div class="wallet-modal">
                    <!-- Toggle Button -->
                    <div style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
                        <button onclick="toggleWalletView()" style="background: rgba(255,255,255,0.1); border: none; color: rgba(255,255,255,0.8); padding: 6px 12px; border-radius: 6px; font-size: 11px; cursor: pointer; transition: all 0.2s; font-weight: 600;" onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">
                            <span id="walletViewToggleText">Switch to List</span>
                        </button>
                    </div>
                    
                    <!-- Icon Carousel View -->
                    <div id="walletCarouselView" style="display: block;">
                        <div id="walletIconCarousel" style="position: relative; width: 100%; height: 300px; display: flex; align-items: center; justify-content: center;">
                            ${(() => {
                                const allCards = [
                                    { name: 'Main Wallet', balance: walletData.mainWallet, color: '#667eea', icon: '💰', iconPath: '../assets/icons/wallet.svg', type: 'main' },
                                    ...walletData.platforms.map(p => ({ ...p, type: 'platform' }))
                                ];
                                const totalCards = allCards.length;
                                const centerIndex = Math.floor(totalCards / 2);
                                
                                return allCards.map((card, index) => {
                                    const position = index - centerIndex;
                                    const offset = position * 50;
                                    const scale = 1 - (Math.abs(position) * 0.15);
                                    const opacity = 1 - (Math.abs(position) * 0.3);
                                    const blur = Math.abs(position) * 0.8;
                                    const zIndex = totalCards - Math.abs(position);
                                    
                                    return `
                                        <div class="wallet-icon-item" data-index="${index}" data-original-index="${index}" style="
                                            position: absolute;
                                            width: 100%;
                                            height: 50px;
                                            transform: translateY(${offset}px) scale(${scale});
                                            transform-origin: center center;
                                            transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                                            cursor: pointer;
                                            z-index: ${zIndex};
                                            top: 50%;
                                            margin-top: -25px;
                                            opacity: ${opacity};
                                            filter: blur(${blur}px);
                                            display: flex;
                                            align-items: center;
                                            gap: 12px;
                                            padding: 0 12px;
                                        " onclick="bringWalletItemToCenter(${index})">
                                            <div style="width: 40px; height: 40px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
                                                <img src="${card.iconPath}" alt="${card.name}" style="width: 40px; height: 40px; object-fit: contain; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.15));" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                                                <div style="display: none; font-size: 32px; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.15));">${card.icon}</div>
                                            </div>
                                            <div style="display: flex; flex-direction: column; gap: 1px; flex: 1;">
                                                <div style="font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 0.3px;">${card.name}</div>
                                                <div style="font-size: 18px; font-weight: 900; color: white; letter-spacing: -0.5px;">$${card.balance.toFixed(2)}</div>
                                            </div>
                                        </div>
                                    `;
                                }).join('');
                            })()}
                        </div>
                    </div>
                    
                    <!-- List View -->
                    <div id="walletListView" style="display: none;">
                        <div class="wallet-modal-main">
                            <div class="wallet-modal-label">Main Wallet</div>
                            <div class="wallet-modal-amount">${walletData.mainWallet.toFixed(2)}</div>
                        </div>
                        <div class="wallet-modal-divider"></div>
                        <div class="wallet-modal-platforms">
                            ${walletData.platforms.map(platform => `
                                <div class="wallet-modal-platform">
                                    <div class="wallet-modal-platform-info">
                                        <span class="wallet-modal-platform-icon">${platform.icon}</span>
                                        <span class="wallet-modal-platform-name">${platform.name}</span>
                                    </div>
                                    <div class="wallet-modal-platform-balance">${platform.balance.toFixed(2)}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <nav>
            ${navItems.map(item => `
                <a href="${item.page}.html" class="${currentPage === item.page ? 'active' : ''}">
                    <i>${item.icon}</i>
                    <span>${item.name}</span>
                </a>
            `).join('')}
        </nav>
    `;

    return sidebarHTML;
}

// Switch role function
function switchRole(newRole) {
    // If switching away from employee, clear the selected employee
    if (getCurrentRole() === 'employee' && newRole !== 'employee') {
        localStorage.removeItem('currentEmployeeId');
        localStorage.removeItem('currentEmployeeName');
    }
    
    // If switching to employee, clear any previous selection to force new selection
    if (newRole === 'employee') {
        localStorage.removeItem('currentEmployeeId');
        localStorage.removeItem('currentEmployeeName');
    }
    
    // Store the new role
    localStorage.setItem('userRole', newRole);
    
    // Get current page
    const currentPage = getCurrentPage();
    
    // Check if the page exists in the new role
    const newRolePages = navigationItems[newRole].map(item => item.page);
    const targetPage = newRolePages.includes(currentPage) ? currentPage : 'dashboard';
    
    // Redirect to the new role's page
    window.location.href = `../${newRole}/${targetPage}.html`;
}

// Initialize sidebar on page load
document.addEventListener('DOMContentLoaded', function() {
    const sidebarElement = document.querySelector('.sidebar');
    if (sidebarElement) {
        sidebarElement.innerHTML = generateSidebar();
        
        // Position wallet modal dynamically and add hover handlers
        const walletWidget = document.querySelector('.wallet-widget');
        const walletModal = document.querySelector('.wallet-modal');
        
        if (walletWidget && walletModal) {
            let hideTimer = null;
            
            // Position modal
            walletWidget.addEventListener('mouseenter', function() {
                const rect = walletWidget.getBoundingClientRect();
                walletModal.style.top = rect.top + 'px';
                
                // Show modal
                clearTimeout(hideTimer);
                walletModal.classList.add('show');
            });
            
            walletWidget.addEventListener('mouseleave', function() {
                // Delay hiding
                hideTimer = setTimeout(() => {
                    walletModal.classList.remove('show');
                }, 300);
            });
            
            walletModal.addEventListener('mouseenter', function() {
                // Keep modal open
                clearTimeout(hideTimer);
                walletModal.classList.add('show');
            });
            
            walletModal.addEventListener('mouseleave', function() {
                // Hide modal
                hideTimer = setTimeout(() => {
                    walletModal.classList.remove('show');
                }, 300);
            });
        }
        
        // Add scroll functionality to wallet icon carousel
        const carousel = document.getElementById('walletIconCarousel');
        if (carousel) {
            let isScrolling = false;
            carousel.addEventListener('wheel', (e) => {
                if (isScrolling) return;
                
                e.preventDefault();
                e.stopPropagation();
                isScrolling = true;
                
                if (e.deltaY > 0) {
                    rotateWalletItemsDown();
                } else {
                    rotateWalletItemsUp();
                }
                
                setTimeout(() => {
                    isScrolling = false;
                }, 600);
            }, { passive: false });
        }
    }
});

// Rotate wallet items down
function rotateWalletItemsDown() {
    const items = Array.from(document.querySelectorAll('.wallet-icon-item'));
    const totalItems = items.length;
    const centerIndex = Math.floor(totalItems / 2);
    
    items.forEach((item) => {
        let currentIndex = parseInt(item.dataset.index);
        let newIndex = (currentIndex + 1) % totalItems;
        
        const position = newIndex - centerIndex;
        const offset = position * 50;
        const scale = 1 - (Math.abs(position) * 0.15);
        const opacity = 1 - (Math.abs(position) * 0.3);
        const blur = Math.abs(position) * 0.8;
        const zIndex = totalItems - Math.abs(position);
        
        item.style.transform = `translateY(${offset}px) scale(${scale})`;
        item.style.zIndex = zIndex;
        item.style.opacity = opacity;
        item.style.filter = `blur(${blur}px)`;
        item.dataset.index = newIndex;
    });
}

// Rotate wallet items up
function rotateWalletItemsUp() {
    const items = Array.from(document.querySelectorAll('.wallet-icon-item'));
    const totalItems = items.length;
    const centerIndex = Math.floor(totalItems / 2);
    
    items.forEach((item) => {
        let currentIndex = parseInt(item.dataset.index);
        let newIndex = (currentIndex - 1 + totalItems) % totalItems;
        
        const position = newIndex - centerIndex;
        const offset = position * 50;
        const scale = 1 - (Math.abs(position) * 0.15);
        const opacity = 1 - (Math.abs(position) * 0.3);
        const blur = Math.abs(position) * 0.8;
        const zIndex = totalItems - Math.abs(position);
        
        item.style.transform = `translateY(${offset}px) scale(${scale})`;
        item.style.zIndex = zIndex;
        item.style.opacity = opacity;
        item.style.filter = `blur(${blur}px)`;
        item.dataset.index = newIndex;
    });
}

// Bring wallet item to center
function bringWalletItemToCenter(originalIndex) {
    const items = Array.from(document.querySelectorAll('.wallet-icon-item'));
    const totalItems = items.length;
    const centerIndex = Math.floor(totalItems / 2);
    
    const clickedItem = items.find(item => parseInt(item.dataset.originalIndex) === originalIndex);
    if (!clickedItem) return;
    
    const currentIndex = parseInt(clickedItem.dataset.index);
    const currentPosition = currentIndex - centerIndex;
    
    const rotations = Math.abs(currentPosition);
    const direction = currentPosition > 0 ? 'up' : 'down';
    
    for (let i = 0; i < rotations; i++) {
        setTimeout(() => {
            if (direction === 'up') {
                rotateWalletItemsUp();
            } else {
                rotateWalletItemsDown();
            }
        }, i * 150);
    }
}

// Toggle between carousel and list view
let walletViewMode = 'carousel'; // 'carousel' or 'list'
function toggleWalletView() {
    const carouselView = document.getElementById('walletCarouselView');
    const listView = document.getElementById('walletListView');
    const toggleText = document.getElementById('walletViewToggleText');
    
    if (walletViewMode === 'carousel') {
        carouselView.style.display = 'none';
        listView.style.display = 'block';
        toggleText.textContent = 'Switch to Carousel';
        walletViewMode = 'list';
    } else {
        carouselView.style.display = 'block';
        listView.style.display = 'none';
        toggleText.textContent = 'Switch to List';
        walletViewMode = 'carousel';
    }
}

// Create wallet cards modal
function createWalletCardsModal() {
    const allCards = [
        { name: 'Main Wallet', balance: walletData.mainWallet, color: '#667eea', icon: '💰', iconPath: '../assets/icons/wallet.svg', type: 'main' },
        ...walletData.platforms.map(p => ({ ...p, type: 'platform' }))
    ];
    
    const totalCards = allCards.length;
    const centerIndex = Math.floor(totalCards / 2);
    
    const modalHTML = `
        <div id="walletCardsModal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 99999; overflow: hidden; backdrop-filter: blur(4px);" onmouseenter="clearTimeout(window.walletModalCloseTimer)" onmouseleave="scheduleCloseWalletCardsModal()">
            <button onclick="closeWalletCardsModal()" style="position: fixed; top: 20px; right: 20px; background: rgba(0,0,0,0.1); border: none; color: #333; width: 40px; height: 40px; border-radius: 50%; font-size: 24px; cursor: pointer; z-index: 100000; backdrop-filter: blur(10px); transition: all 0.2s;" onmouseover="this.style.background='rgba(0,0,0,0.2)'" onmouseout="this.style.background='rgba(0,0,0,0.1)'">×</button>
            
            <div id="cardStackContainer" style="height: 100vh; display: flex; align-items: center; justify-content: center; perspective: 1000px;">
                <div id="cardStack" style="position: relative; width: 400px; height: 500px;">
                    ${allCards.map((card, index) => {
                        const position = index - centerIndex;
                        const offset = position * 100;
                        const scale = 1 - (Math.abs(position) * 0.12);
                        const opacity = 1 - (Math.abs(position) * 0.25);
                        const blur = Math.abs(position) * 0.8;
                        const zIndex = totalCards - Math.abs(position);
                        
                        return `
                            <div class="stack-card" data-index="${index}" data-original-index="${index}" style="
                                position: absolute;
                                width: 400px;
                                height: 80px;
                                transform: translateY(${offset}px) scale(${scale});
                                transform-origin: center center;
                                transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                                cursor: pointer;
                                z-index: ${zIndex};
                                top: 50%;
                                left: 50%;
                                margin-left: -200px;
                                margin-top: -40px;
                                opacity: ${opacity};
                                filter: blur(${blur}px);
                                display: flex;
                                align-items: center;
                                gap: 24px;
                            " onclick="bringCardToCenter(${index})">
                                <!-- Icon -->
                                <div style="width: 80px; height: 80px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
                                    <img src="${card.iconPath}" alt="${card.name}" style="width: 80px; height: 80px; object-fit: contain; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.15));" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                                    <div style="display: none; font-size: 64px; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.15));">${card.icon}</div>
                                </div>
                                
                                <!-- Balance -->
                                <div style="display: flex; flex-direction: column; gap: 4px;">
                                    <div style="font-size: 14px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">${card.name}</div>
                                    <div style="font-size: 32px; font-weight: 900; color: #1f2937; letter-spacing: -1px;">$${card.balance.toFixed(2)}</div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add wheel event listener for scroll
    setTimeout(() => {
        const container = document.getElementById('cardStackContainer');
        if (container) {
            let isScrolling = false;
            container.addEventListener('wheel', (e) => {
                if (isScrolling) return;
                
                e.preventDefault();
                isScrolling = true;
                
                if (e.deltaY > 0) {
                    // Scroll down - move cards up
                    rotateCardsDown();
                } else {
                    // Scroll up - move cards down
                    rotateCardsUp();
                }
                
                setTimeout(() => {
                    isScrolling = false;
                }, 600);
            }, { passive: false });
        }
    }, 100);
}

// Rotate cards down (scroll down)
function rotateCardsDown() {
    const cards = Array.from(document.querySelectorAll('.stack-card'));
    const totalCards = cards.length;
    const centerIndex = Math.floor(totalCards / 2);
    
    cards.forEach((card) => {
        let currentIndex = parseInt(card.dataset.index);
        let newIndex = (currentIndex + 1) % totalCards;
        
        const position = newIndex - centerIndex;
        const offset = position * 100;
        const scale = 1 - (Math.abs(position) * 0.12);
        const opacity = 1 - (Math.abs(position) * 0.25);
        const blur = Math.abs(position) * 0.8;
        const zIndex = totalCards - Math.abs(position);
        
        card.style.transform = `translateY(${offset}px) scale(${scale})`;
        card.style.zIndex = zIndex;
        card.style.opacity = opacity;
        card.style.filter = `blur(${blur}px)`;
        card.dataset.index = newIndex;
    });
}

// Rotate cards up (scroll up)
function rotateCardsUp() {
    const cards = Array.from(document.querySelectorAll('.stack-card'));
    const totalCards = cards.length;
    const centerIndex = Math.floor(totalCards / 2);
    
    cards.forEach((card) => {
        let currentIndex = parseInt(card.dataset.index);
        let newIndex = (currentIndex - 1 + totalCards) % totalCards;
        
        const position = newIndex - centerIndex;
        const offset = position * 100;
        const scale = 1 - (Math.abs(position) * 0.12);
        const opacity = 1 - (Math.abs(position) * 0.25);
        const blur = Math.abs(position) * 0.8;
        const zIndex = totalCards - Math.abs(position);
        
        card.style.transform = `translateY(${offset}px) scale(${scale})`;
        card.style.zIndex = zIndex;
        card.style.opacity = opacity;
        card.style.filter = `blur(${blur}px)`;
        card.dataset.index = newIndex;
    });
}

// Bring card to center
function bringCardToCenter(originalIndex) {
    const cards = Array.from(document.querySelectorAll('.stack-card'));
    const totalCards = cards.length;
    const centerIndex = Math.floor(totalCards / 2);
    
    // Find the card with the clicked original index
    const clickedCard = cards.find(card => parseInt(card.dataset.originalIndex) === originalIndex);
    if (!clickedCard) return;
    
    const currentIndex = parseInt(clickedCard.dataset.index);
    const currentPosition = currentIndex - centerIndex;
    
    // Calculate how many rotations needed
    const rotations = Math.abs(currentPosition);
    const direction = currentPosition > 0 ? 'up' : 'down';
    
    // Rotate that many times
    for (let i = 0; i < rotations; i++) {
        setTimeout(() => {
            if (direction === 'up') {
                rotateCardsUp();
            } else {
                rotateCardsDown();
            }
        }, i * 150);
    }
}

// Open wallet cards modal
function openWalletCardsModal() {
    clearTimeout(window.walletModalCloseTimer);
    const modal = document.getElementById('walletCardsModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Schedule close wallet cards modal
let walletModalCloseTimer;
function scheduleCloseWalletCardsModal() {
    walletModalCloseTimer = setTimeout(() => {
        closeWalletCardsModal();
    }, 300);
}

// Close wallet cards modal
function closeWalletCardsModal() {
    const modal = document.getElementById('walletCardsModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Notifications functions
function openNotifications(){
    let drawer = document.getElementById('notificationsDrawer');
    if (!drawer) {
        createNotificationsDrawer();
        drawer = document.getElementById('notificationsDrawer');
    }
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeNotifications(){
    const drawer = document.getElementById('notificationsDrawer');
    if (drawer) {
        drawer.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function createNotificationsDrawer() {
    const drawerHTML = `
        <div class="notifications-drawer" id="notificationsDrawer">
            <div class="notifications-overlay" onclick="closeNotifications()"></div>
            
            <div class="notifications-panel">
                <div class="notifications-header">
                    <h2>Notifications</h2>
                    <button class="notifications-close" onclick="closeNotifications()">×</button>
                </div>
                
                <div class="notifications-body">
                    ${notificationsData.map(notif => `
                        <div class="notification-item ${notif.read ? 'read' : ''}" data-notification-id="${notif.id}">
                            <div class="notification-dot"></div>
                            <div class="notification-title">
                                <span>${notif.title}</span>
                                <span class="notification-time">${notif.time}</span>
                            </div>
                            <div class="notification-content">
                                ${notif.content}
                            </div>
                            <div class="notification-actions">
                                ${!notif.read ? `<button class="notification-action-btn mark-read" onclick="event.stopPropagation(); markNotificationAsRead(${notif.id})">Mark as Read</button>` : ''}
                                <button class="notification-action-btn go-to" onclick="event.stopPropagation(); window.location.href='${notif.link}'">Go to</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', drawerHTML);
}

// Mark notification as read
function markNotificationAsRead(notifId) {
    const notif = notificationsData.find(n => n.id === notifId);
    if (notif) {
        notif.read = true;
        
        // Update UI
        const notifElement = document.querySelector(`[data-notification-id="${notifId}"]`);
        if (notifElement) {
            notifElement.classList.add('read');
            const markReadBtn = notifElement.querySelector('.mark-read');
            if (markReadBtn) {
                markReadBtn.remove();
            }
        }
        
        // Update badge count
        const badge = document.querySelector('.notification-badge-sidebar');
        if (badge) {
            badge.textContent = getUnreadNotificationsCount();
        }
    }
}
