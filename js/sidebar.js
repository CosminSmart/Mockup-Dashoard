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
        { name: 'Facebook', balance: 1250.00, color: '#1877f2', icon: '📘', iconPath: '../assets/icons/facebook.svg' },
        { name: 'Google', balance: 890.50, color: '#4285f4', icon: '🔍', iconPath: '../assets/icons/google.svg' },
        { name: 'TikTok', balance: 650.00, color: '#000000', icon: '🎵', iconPath: '../assets/icons/tiktok.svg' },
        { name: 'Instagram', balance: 420.75, color: '#e4405f', icon: '📷', iconPath: '../assets/icons/instagram.svg' }
    ]
};

// Generate sidebar HTML
function generateSidebar() {
    const currentRole = getCurrentRole();
    const currentPage = getCurrentPage();
    const navItems = navigationItems[currentRole] || navigationItems.client;
    
    // Calculate total and percentages for donut chart
    const total = walletData.mainWallet + walletData.platforms.reduce((sum, p) => sum + p.balance, 0);
    const circumference = 2 * Math.PI * 40; // radius = 40
    
    // Calculate segments
    const mainWalletPercent = (walletData.mainWallet / total) * circumference;
    let offset = 0;
    
    const platformSegments = walletData.platforms.map(platform => {
        const percent = (platform.balance / total) * circumference;
        const segment = {
            ...platform,
            dasharray: `${percent} ${circumference}`,
            dashoffset: -offset
        };
        offset += percent;
        return segment;
    });

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
            <div class="wallet-widget" onclick="openWalletCardsModal()">
                <div class="wallet-widget-content">
                    <div class="wallet-widget-icon">💰</div>
                    <div class="wallet-widget-info">
                        <div class="wallet-widget-label">Main Wallet</div>
                        <div class="wallet-widget-amount">${walletData.mainWallet.toFixed(2)}</div>
                    </div>
                </div>

                <!-- Hover Modal -->
                <div class="wallet-modal">
                    <div class="wallet-modal-header">
                        <span>💰 Wallet Overview</span>
                    </div>
                    
                    <!-- Donut Chart -->
                    <div class="wallet-chart-container">
                        <svg class="wallet-donut-chart" viewBox="0 0 100 100">
                            <circle class="wallet-donut-hole" cx="50" cy="50" r="30" fill="#2a2a2a"></circle>
                            <circle class="wallet-donut-ring" cx="50" cy="50" r="40" fill="transparent" stroke="#667eea" stroke-width="20" stroke-dasharray="${mainWalletPercent} ${circumference}" stroke-dashoffset="0" transform="rotate(-90 50 50)"></circle>
                            ${platformSegments.map(segment => `
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="${segment.color}" stroke-width="20" stroke-dasharray="${segment.dasharray}" stroke-dashoffset="${segment.dashoffset}" transform="rotate(-90 50 50)"></circle>
                            `).join('')}
                        </svg>
                        <div class="wallet-chart-center">
                            <div class="wallet-chart-total">${total.toFixed(0)}</div>
                            <div class="wallet-chart-label">Total</div>
                        </div>
                    </div>
                    
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
        
        // Position wallet modal dynamically
        const walletWidget = document.querySelector('.wallet-widget');
        const walletModal = document.querySelector('.wallet-modal');
        
        if (walletWidget && walletModal) {
            walletWidget.addEventListener('mouseenter', function() {
                const rect = walletWidget.getBoundingClientRect();
                walletModal.style.top = rect.top + 'px';
            });
        }
    }
    
    // Create wallet cards modal
    createWalletCardsModal();
});

// Create wallet cards modal
function createWalletCardsModal() {
    const allCards = [
        { name: 'Main Wallet', balance: walletData.mainWallet, color: '#667eea', icon: '💰', iconPath: '../assets/icons/wallet.svg', type: 'main' },
        ...walletData.platforms.map(p => ({ ...p, type: 'platform' }))
    ];
    
    const totalCards = allCards.length;
    const centerIndex = Math.floor(totalCards / 2);
    
    const modalHTML = `
        <div id="walletCardsModal" style="display: none; position: fixed; inset: 0; background: #f5f5f5; z-index: 99999; overflow: hidden;">
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
    const modal = document.getElementById('walletCardsModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Close wallet cards modal
function closeWalletCardsModal() {
    const modal = document.getElementById('walletCardsModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}
