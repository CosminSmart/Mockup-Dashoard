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
        { name: 'Marketplace', page: 'marketplace', icon: '🛍️' }
    ],
    employee: [
        { name: 'Dashboard', page: 'dashboard', icon: '📊' },
        { name: 'Tasks', page: 'tasks', icon: '✓' },
        { name: 'Schedule', page: 'schedule', icon: '📅' },
        { name: 'Timesheet', page: 'timesheet', icon: '⏰' },
        { name: 'Marketplace', page: 'marketplace', icon: '🛍️' }
    ],
    client: [
        { name: 'Dashboard', page: 'dashboard', icon: '📊' },
        { name: 'Marketplace', page: 'marketplace', icon: '🛍️' },
        { name: 'Transactions', page: 'transactions', icon: '💰' },
        { name: 'Orders', page: 'orders', icon: '📦' },
        { name: 'Profile', page: 'profile', icon: '👤' }
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
