
        // Current client ID
        const CURRENT_CLIENT_ID = 'client_001';

        // Mock data storage with packages
        let packages = [];

        // Initialize packages on load
        window.addEventListener('DOMContentLoaded', function() {
            loadPackages();
            updateMyRequestsCount();
            
            // Refresh packages every 10 seconds to see admin updates
            setInterval(loadPackages, 10000);
            
            // Refresh requests count every 5 seconds
            setInterval(updateMyRequestsCount, 5000);
        });

        function loadPackages() {
            // Load packages from localStorage (set by admin)
            const storedPackages = localStorage.getItem('marketplacePackages');
            if (storedPackages) {
                packages = JSON.parse(storedPackages);
            }
            
            renderAllPackages();
        }

        function renderAllPackages() {
            const grid = document.getElementById('packagesGrid');
            grid.innerHTML = '';
            packages.forEach(pkg => addPackageToGrid(pkg));
        }

        function canSeeDiscount(pkg) {
            // Check if client can see the discount
            if (!pkg.discountType || !pkg.discountValue || pkg.discountValue <= 0) {
                return false;
            }
            
            // If discount is for all clients
            if (!pkg.discountTarget || pkg.discountTarget === 'all') {
                return true;
            }
            
            // If discount is for specific clients
            if (pkg.discountTarget === 'specific' && pkg.specificClients) {
                const clientIds = pkg.specificClients.split(',').map(id => id.trim());
                return clientIds.includes(CURRENT_CLIENT_ID);
            }
            
            return false;
        }

        function calculateDiscountedPrice(price, discountType, discountValue) {
            if (!discountValue || discountValue <= 0) return null;
            
            if (discountType === 'percentage') {
                return price - (price * discountValue / 100);
            } else {
                return price - discountValue;
            }
        }

        function addPackageToGrid(pkg) {
            const grid = document.getElementById('packagesGrid');
            const card = document.createElement('div');
            card.className = 'package-card';
            if (pkg.stockStatus === 'out-of-stock') {
                card.classList.add('out-of-stock');
            }
            card.dataset.id = pkg.id;
            
            let statusBadge = '';
            let statusText = '';
            
            if (pkg.stockStatus === 'out-of-stock') {
                statusBadge = 'out-of-stock';
                statusText = 'â—‹ Out of Stock';
            } else if (pkg.stockStatus === 'high-demand') {
                statusBadge = 'high-demand';
                statusText = 'âš¡ High Demand';
            } else {
                statusBadge = 'in-stock';
                statusText = 'â— In Stock';
            }

            // Calculate discounted price if discount exists AND client can see it
            let priceHTML = '';
            if (canSeeDiscount(pkg)) {
                const discountedPrice = calculateDiscountedPrice(parseFloat(pkg.price), pkg.discountType, parseFloat(pkg.discountValue));
                const discountLabel = pkg.discountType === 'percentage' ? `${pkg.discountValue}%` : `$${pkg.discountValue}`;
                priceHTML = `
                    <div class="package-price">
                        <span class="price-original">from $${pkg.price}</span>
                        <span class="price-discounted">$${discountedPrice.toFixed(2)}</span>
                        <span class="discount-badge">-${discountLabel}</span>
                    </div>
                `;
            } else {
                priceHTML = `<div class="package-price">from $${pkg.price}</div>`;
            }
            
            card.innerHTML = `
                <span class="status-badge ${statusBadge}">${statusText}</span>
                <div class="package-icon">${pkg.icon}</div>
                <div class="package-title">${pkg.name}</div>
                <div class="package-subtitle">${pkg.subtitle}</div>
                ${pkg.dailyLimit ? `<div class="package-details"><strong>Daily Limit:</strong> ${pkg.dailyLimit}</div>` : ''}
                ${pkg.status ? `<div class="package-details"><strong>Status:</strong> ${pkg.status}</div>` : ''}
                ${pkg.region ? `<div class="package-details"><strong>Region:</strong> ${pkg.region}</div>` : ''}
                ${pkg.access ? `<div class="package-details"><strong>Access:</strong> ${pkg.access}</div>` : ''}
                ${pkg.type2 ? `<div class="package-details"><strong>Type:</strong> ${pkg.type2}</div>` : ''}
                ${priceHTML}
                <div class="package-actions">
                    <button class="btn btn-small btn-view" onclick="viewPackage(${pkg.id})">View Details</button>
                    <button class="btn btn-small btn-request" onclick="requestPackage(${pkg.id})">Request Offer</button>
                </div>
            `;
            
            grid.appendChild(card);
        }

        function viewPackage(id) {
            const pkg = packages.find(p => p.id === id);
            if (!pkg) return;

            document.getElementById('sidePanelTitle').textContent = 'Package Details';
            
            let priceHTML = `<div class="price">from $${pkg.price}</div>`;
            if (canSeeDiscount(pkg)) {
                const discountedPrice = calculateDiscountedPrice(parseFloat(pkg.price), pkg.discountType, parseFloat(pkg.discountValue));
                const discountLabel = pkg.discountType === 'percentage' ? `${pkg.discountValue}%` : `$${pkg.discountValue}`;
                priceHTML = `
                    <div class="price" style="display: flex; align-items: center; gap: 8px; justify-content: center;">
                        <span style="text-decoration: line-through; opacity: 0.6; font-size: 24px;">from $${pkg.price}</span>
                        <span style="color: #e74c3c; font-size: 32px;">$${discountedPrice.toFixed(2)}</span>
                        <span style="background: #e74c3c; padding: 4px 8px; border-radius: 4px; font-size: 12px;">-${discountLabel}</span>
                    </div>
                `;
            }
            
            const content = `
                <div class="package-preview">
                    <div class="icon">${pkg.icon}</div>
                    <div class="name">${pkg.name}</div>
                    <div class="subtitle">${pkg.subtitle}</div>
                    ${priceHTML}
                </div>

                <div class="detail-section">
                    <h3>General Information</h3>
                    <div class="detail-card">
                        <div class="detail-row">
                            <span class="detail-label">Package Type</span>
                            <span class="detail-value">${pkg.type || '-'}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Region</span>
                            <span class="detail-value">${pkg.region || '-'}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Availability</span>
                            <span class="detail-value">
                                ${pkg.stockStatus === 'in-stock' ? '<span class="badge success">In Stock</span>' : ''}
                                ${pkg.stockStatus === 'high-demand' ? '<span class="badge warning">High Demand</span>' : ''}
                                ${pkg.stockStatus === 'out-of-stock' ? '<span class="badge" style="background: #e8e8e8; color: #666;">Out of Stock</span>' : ''}
                            </span>
                        </div>
                    </div>
                </div>

                ${pkg.status || pkg.access ? `
                <div class="detail-section">
                    <h3>Features</h3>
                    <div class="detail-card">
                        ${pkg.status ? `
                        <div class="detail-row">
                            <span class="detail-label">Verification Status</span>
                            <span class="detail-value"><span class="badge success">${pkg.status}</span></span>
                        </div>
                        ` : ''}
                        ${pkg.access ? `
                        <div class="detail-row">
                            <span class="detail-label">Access Level</span>
                            <span class="detail-value">${pkg.access}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
                ` : ''}

                ${pkg.dailyLimit || pkg.adAccounts || pkg.spendLimit ? `
                <div class="detail-section">
                    <h3>Limits & Accounts</h3>
                    <div class="detail-card">
                        ${pkg.dailyLimit ? `
                        <div class="detail-row">
                            <span class="detail-label">Daily Limit</span>
                            <span class="detail-value">${pkg.dailyLimit}</span>
                        </div>
                        ` : ''}
                        ${pkg.adAccounts ? `
                        <div class="detail-row">
                            <span class="detail-label">Ad Accounts</span>
                            <span class="detail-value">${pkg.adAccounts}</span>
                        </div>
                        ` : ''}
                        ${pkg.spendLimit ? `
                        <div class="detail-row">
                            <span class="detail-label">Spend Limit</span>
                            <span class="detail-value">${pkg.spendLimit}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
                ` : ''}

                <button class="btn-submit-request" onclick="requestPackage(${pkg.id})">
                    ðŸ’¬ Request Custom Offer for This Package
                </button>
            `;

            document.getElementById('sidePanelContent').innerHTML = content;
            openSidePanel();
        }

        function requestPackage(id) {
            const pkg = packages.find(p => p.id === id);
            if (!pkg) return;

            document.getElementById('sidePanelTitle').textContent = 'Request Custom Offer';
            
            const content = `
                <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="font-size: 16px; color: #2c3e50; margin-bottom: 8px;">Package: ${pkg.name}</h3>
                    <p style="font-size: 14px; color: #7f8c8d; margin: 0;">Standard Price: $${pkg.price}</p>
                </div>

                <div class="request-form">
                    <h3>ðŸ“ Describe Your Request</h3>
                    <div class="form-group">
                        <label for="requestMessage">What would you like to request?</label>
                        <textarea id="requestMessage" placeholder="Example: I'm interested in bulk purchase of 10+ accounts. Can you offer a discount? Or: I need custom spending limits for this package..."></textarea>
                    </div>
                    <button class="btn-submit-request" onclick="submitRequest(${pkg.id})">
                        ðŸ“¤ Send Request to Admin
                    </button>
                </div>
            `;

            document.getElementById('sidePanelContent').innerHTML = content;
            openSidePanel();
        }

        function openRequestOfferPanel() {
            document.getElementById('sidePanelTitle').textContent = 'Request Custom Offer';
            
            const content = `
                <div class="request-form">
                    <h3>ðŸ“ General Request</h3>
                    <p style="color: #7f8c8d; font-size: 14px; margin-bottom: 16px;">
                        Describe what you're looking for and our team will get back to you with a custom offer.
                    </p>
                    <div class="form-group">
                        <label for="generalRequestMessage">Your Request</label>
                        <textarea id="generalRequestMessage" placeholder="Example: I need a custom package for TikTok Ads with higher spending limits. Can we discuss pricing? Or: Looking for bulk purchase of Facebook BM accounts..."></textarea>
                    </div>
                    <button class="btn-submit-request" onclick="submitGeneralRequest()">
                        ðŸ“¤ Send Request to Admin
                    </button>
                </div>
            `;

            document.getElementById('sidePanelContent').innerHTML = content;
            openSidePanel();
        }

        function submitRequest(packageId) {
            const message = document.getElementById('requestMessage').value.trim();
            
            if (!message) {
                alert('Please describe your request');
                return;
            }

            const pkg = packages.find(p => p.id === packageId);
            
            // Create request object
            const request = {
                id: Date.now(),
                userId: 'client_001',
                name: 'John Client',
                initials: 'JC',
                company: 'Tech Corp',
                email: 'john.client@techcorp.com',
                phone: '+1 (555) 123-4567',
                message: `Package: ${pkg.name} ($${pkg.price})\n\n${message}`,
                timeAgo: 'just now',
                timestamp: new Date().toISOString()
            };
            
            // Get existing requests
            const requests = JSON.parse(localStorage.getItem('marketplaceClientRequests') || '[]');
            requests.push(request);
            localStorage.setItem('marketplaceClientRequests', JSON.stringify(requests));
            
            // Show success message
            document.getElementById('successMessage').classList.add('show');
            closeSidePanel();
            
            setTimeout(() => {
                document.getElementById('successMessage').classList.remove('show');
            }, 5000);
        }

        function submitGeneralRequest() {
            const message = document.getElementById('generalRequestMessage').value.trim();
            
            if (!message) {
                alert('Please describe your request');
                return;
            }
            
            // Create request object
            const request = {
                id: Date.now(),
                userId: 'client_001',
                name: 'John Client',
                initials: 'JC',
                company: 'Tech Corp',
                email: 'john.client@techcorp.com',
                phone: '+1 (555) 123-4567',
                message: message,
                timeAgo: 'just now',
                timestamp: new Date().toISOString()
            };
            
            // Get existing requests
            const requests = JSON.parse(localStorage.getItem('marketplaceClientRequests') || '[]');
            requests.push(request);
            localStorage.setItem('marketplaceClientRequests', JSON.stringify(requests));
            
            // Show success message
            document.getElementById('successMessage').classList.add('show');
            closeSidePanel();
            
            setTimeout(() => {
                document.getElementById('successMessage').classList.remove('show');
            }, 5000);
        }

        function openSidePanel() {
            document.getElementById('sidePanel').classList.add('open');
            document.getElementById('sidePanelOverlay').classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function closeSidePanel() {
            document.getElementById('sidePanel').classList.remove('open');
            document.getElementById('sidePanelOverlay').classList.remove('open');
            document.body.style.overflow = 'auto';
        }

        function updateMyRequestsCount() {
            const requests = JSON.parse(localStorage.getItem('marketplaceClientRequests') || '[]');
            const myRequests = requests.filter(r => r.userId === CURRENT_CLIENT_ID);
            document.getElementById('myRequestsCount').textContent = myRequests.length;
        }

        function openMyRequestsPanel() {
            document.getElementById('sidePanelTitle').textContent = 'My Requests';
            
            const requests = JSON.parse(localStorage.getItem('marketplaceClientRequests') || '[]');
            const myRequests = requests.filter(r => r.userId === CURRENT_CLIENT_ID);
            
            let content = '';
            
            if (myRequests.length === 0) {
                content = `
                    <div class="empty-requests">
                        <div class="empty-requests-icon">ðŸ“‹</div>
                        <p>You haven't sent any requests yet</p>
                    </div>
                `;
            } else {
                content = '<div class="my-requests-list">';
                
                myRequests.forEach(request => {
                    const date = new Date(request.timestamp);
                    const formattedDate = date.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                    
                    content += `
                        <div class="my-request-item">
                            <div class="my-request-header">
                                <div>
                                    <div class="my-request-title">Request #${request.id}</div>
                                    <div class="my-request-time">${formattedDate}</div>
                                </div>
                            </div>
                            <div class="my-request-message">${request.message}</div>
                        </div>
                    `;
                });
                
                content += '</div>';
            }

            document.getElementById('sidePanelContent').innerHTML = content;
            openSidePanel();
        }
    
