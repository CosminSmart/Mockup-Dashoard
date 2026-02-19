// Sidebar role switcher functionality

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
        { name: 'Users', page: 'users', icon: '👥' },
        { name: 'Accounts', page: 'accounts', icon: '💳' },
        { name: 'Finance', page: 'finance', icon: '💰' },
        { name: 'Marketplace', page: 'marketplace', icon: '🛍️' },
        { name: 'Settings', page: 'settings', icon: '⚙️' }
        
    ],
    employee: [
        { name: 'Dashboard', page: 'dashboard', icon: '📊' },
        { name: 'Accounts', page: 'accounts', icon: '💳' },
        { name: 'Finance', page: 'finance', icon: '💰' },
        { name: 'Marketplace', page: 'marketplace', icon: '🛍️' },
        { name: 'Transactions', page: 'transactions', icon: '💰' },
        { name: 'Settings', page: 'settings', icon: '⚙️' }
    ],
    client: [
        { name: 'Dashboard', page: 'dashboard', icon: '📊' },
        { name: 'Marketplace', page: 'marketplace', icon: '🛍️' },
        { name: 'Transactions', page: 'transactions', icon: '💰' },
        { name: 'Teams', page: 'users', icon: '👥' },
        { name: 'Finance', page: 'finance', icon: '💰' },
        { name: 'Settings', page: 'settings', icon: '⚙️' }
    ]
};

// Wallet data (hardcoded demo)
const walletData = {
    mainWallet: 2450.00,
    platforms: [
        { name: 'Facebook', balance: 1250.00, color: '#1877f2', icon: '📘' },
        { name: 'Google', balance: 890.50, color: '#4285f4', icon: '🔍' },
        { name: 'TikTok', balance: 650.00, color: '#000000', icon: '🎵' },
        { name: 'Instagram', balance: 420.75, color: '#e4405f', icon: '📷' }
    ]
};

// Generate sidebar HTML
function generateSidebar() {
    const currentRole = getCurrentRole();
    const currentPage = getCurrentPage();
    const navItems = navigationItems[currentRole] || navigationItems.client;

    const sidebarHTML = `
        <div class="sidebar-header">
            <h2>${currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} Panel</h2>
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
                        <div class="wallet-widget-amount">$${walletData.mainWallet.toFixed(2)}</div>
                    </div>
                </div>

                <!-- Hover Modal -->
                <div class="wallet-modal">
                    <div class="wallet-modal-header">
                        <span>💰 Wallet Overview</span>
                    </div>
                    <div class="wallet-modal-main">
                        <div class="wallet-modal-label">Main Wallet</div>
                        <div class="wallet-modal-amount">$${walletData.mainWallet.toFixed(2)}</div>
                    </div>
                    <div class="wallet-modal-divider"></div>
                    <div class="wallet-modal-platforms">
                        ${walletData.platforms.map(platform => `
                            <div class="wallet-modal-platform">
                                <div class="wallet-modal-platform-info">
                                    <span class="wallet-modal-platform-icon">${platform.icon}</span>
                                    <span class="wallet-modal-platform-name">${platform.name}</span>
                                </div>
                                <div class="wallet-modal-platform-balance">$${platform.balance.toFixed(2)}</div>
                            </div>
                        `).join('')}
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
    }
});
