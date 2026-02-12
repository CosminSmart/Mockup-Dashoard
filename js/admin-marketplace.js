
        // Mock data storage with initial packages
        let packages = [
            {
                id: 1,
                type: 'profile',
                name: 'Personal Profile (Verified)',
                icon: '👤',
                subtitle: 'Meta • WORLDWIDE',
                price: '10',
                region: 'Worldwide',
                status: 'Verified',
                access: 'Full Access',
                dailyLimit: '',
                adAccounts: '',
                spendLimit: '',
                type2: '',
                stockStatus: 'in-stock',
                description: ''
            },
            {
                id: 2,
                type: 'facebook',
                name: 'Facebook Account + BM',
                icon: '∞',
                subtitle: '3 Ad Acc • $250 Limit',
                price: '120',
                region: 'Worldwide',
                status: 'Verified',
                access: '',
                dailyLimit: '$250',
                adAccounts: '3 Ad Acc',
                spendLimit: '',
                type2: '',
                stockStatus: 'in-stock',
                description: ''
            },
            {
                id: 3,
                type: 'tiktok',
                name: 'Premium TikTok Ads',
                icon: '🎵',
                subtitle: 'No Spending Limits',
                price: '250',
                region: 'Worldwide',
                status: '',
                access: '',
                dailyLimit: '',
                adAccounts: '',
                spendLimit: 'None (Unlimited)',
                type2: 'Agency',
                stockStatus: 'in-stock',
                description: ''
            },
            {
                id: 4,
                type: 'google',
                name: 'Google Agency',
                icon: 'G',
                subtitle: 'Premium Tier',
                price: '300',
                region: 'Worldwide',
                status: '',
                access: '',
                dailyLimit: '',
                adAccounts: '',
                spendLimit: '',
                type2: 'Agency',
                stockStatus: 'in-stock',
                description: ''
            },
            {
                id: 5,
                type: 'google',
                name: 'Google Farmed',
                icon: 'G',
                subtitle: 'High Trust Score',
                price: '450',
                region: 'Worldwide',
                status: '',
                access: '',
                dailyLimit: '',
                adAccounts: '',
                spendLimit: '',
                type2: 'Farmed',
                stockStatus: 'out-of-stock',
                description: ''
            },
            {
                id: 6,
                type: 'google',
                name: 'Google BOV',
                icon: 'G',
                subtitle: 'Business Verified',
                price: '380',
                region: 'Worldwide',
                status: 'Verified',
                access: '',
                dailyLimit: '',
                adAccounts: '',
                spendLimit: '',
                type2: 'Business',
                stockStatus: 'in-stock',
                description: ''
            },
            {
                id: 7,
                type: 'taboola',
                name: 'Taboola Farmed WV',
                icon: '📢',
                subtitle: 'Any GEO • TAG №218',
                price: '500',
                region: 'Worldwide',
                status: '',
                access: '',
                dailyLimit: '',
                adAccounts: '',
                spendLimit: '',
                type2: 'Farmed',
                stockStatus: 'high-demand',
                description: ''
            }
        ];

        let editingPackageId = null;
        let viewingPackageId = null;
        let isEditMode = false;

        // Client requests storage
        let clientRequests = [];

        // Check for requests from localStorage
        function loadRequests() {
            const storedClient = localStorage.getItem('marketplaceClientRequests');
            
            if (storedClient) {
                clientRequests = JSON.parse(storedClient);
            }
            
            renderRequests();
            updateRequestsBadges();
        }

        function saveRequests() {
            localStorage.setItem('marketplaceClientRequests', JSON.stringify(clientRequests));
        }

        function updateRequestsBadges() {
            const totalRequests = clientRequests.length;
            document.getElementById('totalRequestsBadge').textContent = totalRequests;
            
            // Hide badge if no requests
            if (totalRequests === 0) {
                document.getElementById('totalRequestsBadge').style.display = 'none';
            } else {
                document.getElementById('totalRequestsBadge').style.display = 'flex';
            }
        }

        function renderRequests() {
            renderClientRequests();
        }

        function renderClientRequests() {
            const container = document.getElementById('clientRequestsList');
            
            if (clientRequests.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">💼</div>
                        <p>No client requests or offers</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = clientRequests.map(request => `
                <div class="request-item">
                    <div class="request-header">
                        <div class="request-user">
                            <div class="request-avatar" style="background: #9b59b6;">${request.initials}</div>
                            <div class="request-user-info">
                                <h4>${request.name}</h4>
                                <p>${request.company || 'Client'} ${request.email ? '• ' + request.email : ''}</p>
                            </div>
                        </div>
                        <span class="request-time">${request.timeAgo}</span>
                    </div>
                    <div class="request-message">
                        ${request.message}
                    </div>
                    <div class="request-actions">
                        <button class="btn-approve" onclick="contactClient('${request.email || ''}', '${request.phone || ''}')">
                            📧 Contact Client
                        </button>
                        <button class="btn-deny" onclick="dismissClientRequest(${request.id})">
                            ✕ Dismiss
                        </button>
                    </div>
                </div>
            `).join('');
        }

        function dismissClientRequest(id) {
            const request = clientRequests.find(r => r.id === id);
            if (!request) return;

            if (confirm(`Dismiss request from ${request.name}?`)) {
                clientRequests = clientRequests.filter(r => r.id !== id);
                saveRequests();
                renderRequests();
                updateRequestsBadges();
            }
        }

        function contactClient(email, phone) {
            // Show contact options
            let contactOptions = [];
            
            if (email) {
                contactOptions.push(`📧 Email: ${email}`);
            }
            if (phone) {
                contactOptions.push(`📞 Phone: ${phone}`);
            }
            
            if (contactOptions.length === 0) {
                alert('No contact information available for this client.');
                return;
            }
            
            const message = `Contact Information:\n\n${contactOptions.join('\n')}\n\nWould you like to open your email client?`;
            
            if (email && confirm(message)) {
                // Open email client
                window.location.href = `mailto:${email}?subject=Regarding Your Marketplace Request`;
            } else {
                alert(contactOptions.join('\n'));
            }
        }

        function openRequestsPanel() {
            document.getElementById('requestsPanel').classList.add('open');
            document.getElementById('sidePanelOverlay').classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function closeRequestsPanel() {
            document.getElementById('requestsPanel').classList.remove('open');
            document.getElementById('sidePanelOverlay').classList.remove('open');
            document.body.style.overflow = 'auto';
        }

        // Initialize packages on load
        window.addEventListener('DOMContentLoaded', function() {
            // Load packages from localStorage if available
            const storedPackages = localStorage.getItem('marketplacePackages');
            if (storedPackages) {
                packages = JSON.parse(storedPackages);
            }
            
            // Always save current packages to localStorage (for initial load or updates)
            localStorage.setItem('marketplacePackages', JSON.stringify(packages));
            
            renderAllPackages();
            loadRequests();
            
            // Check for new requests every 5 seconds
            setInterval(loadRequests, 5000);
        });

        function renderAllPackages() {
            const grid = document.getElementById('packagesGrid');
            grid.innerHTML = '';
            packages.forEach(pkg => addPackageToGrid(pkg));
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
            card.onclick = () => viewPackage(pkg.id);
            
            let statusBadge = '';
            let statusText = '';
            
            if (pkg.stockStatus === 'out-of-stock') {
                statusBadge = 'out-of-stock';
                statusText = '○ Out of Stock';
            } else if (pkg.stockStatus === 'high-demand') {
                statusBadge = 'high-demand';
                statusText = '⚡ High Demand';
            } else {
                statusBadge = 'in-stock';
                statusText = '● In Stock';
            }

            // Calculate discounted price if discount exists
            let priceHTML = '';
            if (pkg.discountType && pkg.discountValue > 0) {
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
                    <button class="btn btn-small btn-edit" onclick="event.stopPropagation(); editPackageInPanel(${pkg.id})">Edit</button>
                    <button class="btn btn-small btn-delete" onclick="event.stopPropagation(); deletePackage(${pkg.id})">Delete</button>
                </div>
            `;
            
            grid.appendChild(card);
        }

        function deletePackage(id) {
            const pkg = packages.find(p => p.id === id);
            if (!pkg) return;

            if (confirm(`Are you sure you want to delete "${pkg.name}"?`)) {
                packages = packages.filter(p => p.id !== id);
                renderAllPackages();
                closeSidePanel();
                alert('✅ Package deleted successfully!');
            }
        }

        function openAddPackagePanel() {
            viewingPackageId = null;
            isEditMode = true;

            document.getElementById('sidePanelTitle').textContent = 'Add New Package';
            
            const content = generatePackageForm(null);
            document.getElementById('sidePanelContent').innerHTML = content;
            
            setupDiscountToggle('add');
            
            document.getElementById('sidePanelActions').innerHTML = `
                <button class="btn btn-edit" onclick="saveNewPackage()">💾 Add Package</button>
                <button class="btn" style="background: #666; color: white;" onclick="closeSidePanel()">✕ Cancel</button>
            `;

            openSidePanel();
        }

        function viewPackage(id) {
            const pkg = packages.find(p => p.id === id);
            if (!pkg) return;

            viewingPackageId = id;
            isEditMode = false;

            document.getElementById('sidePanelTitle').textContent = 'Package Details';
            
            let priceHTML = `<div class="price">from $${pkg.price}</div>`;
            if (pkg.discountType && pkg.discountValue > 0) {
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
                            <span class="detail-label">Status</span>
                            <span class="detail-value">
                                ${pkg.stockStatus === 'in-stock' ? '<span class="badge success">In Stock</span>' : ''}
                                ${pkg.stockStatus === 'high-demand' ? '<span class="badge warning">High Demand</span>' : ''}
                                ${pkg.stockStatus === 'out-of-stock' ? '<span class="badge" style="background: #e8e8e8; color: #666;">Out of Stock</span>' : ''}
                            </span>
                        </div>
                    </div>
                </div>

                ${pkg.discountType && pkg.discountValue > 0 ? `
                <div class="detail-section">
                    <h3>Discount Information</h3>
                    <div class="detail-card">
                        <div class="detail-row">
                            <span class="detail-label">Discount Type</span>
                            <span class="detail-value">${pkg.discountType === 'percentage' ? 'Percentage' : 'Fixed Amount'}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Discount Value</span>
                            <span class="detail-value"><span class="badge warning">${pkg.discountType === 'percentage' ? pkg.discountValue + '%' : '$' + pkg.discountValue}</span></span>
                        </div>
                    </div>
                </div>
                ` : ''}

                ${pkg.status || pkg.access ? `
                <div class="detail-section">
                    <h3>Verification & Access</h3>
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

                ${pkg.type2 ? `
                <div class="detail-section">
                    <h3>Account Type</h3>
                    <div class="detail-card">
                        <div class="detail-row">
                            <span class="detail-label">Category</span>
                            <span class="detail-value"><span class="badge info">${pkg.type2}</span></span>
                        </div>
                    </div>
                </div>
                ` : ''}

                ${pkg.description ? `
                <div class="detail-section">
                    <h3>Description</h3>
                    <div class="detail-card">
                        <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">${pkg.description}</p>
                    </div>
                </div>
                ` : ''}
            `;

            document.getElementById('sidePanelContent').innerHTML = content;
            
            document.getElementById('sidePanelActions').innerHTML = `
                <button class="btn btn-edit" onclick="editPackageInPanel(${id})">✏️ Edit</button>
                <button class="btn btn-delete" onclick="deletePackage(${id})">🗑️ Delete</button>
            `;

            openSidePanel();
        }

        function editPackageInPanel(id) {
            const pkg = packages.find(p => p.id === id);
            if (!pkg) return;

            viewingPackageId = id;
            isEditMode = true;

            document.getElementById('sidePanelTitle').textContent = 'Edit Package';
            
            const content = generatePackageForm(pkg);
            document.getElementById('sidePanelContent').innerHTML = content;
            
            setupDiscountToggle('edit', pkg);
            
            document.getElementById('sidePanelActions').innerHTML = `
                <button class="btn btn-edit" onclick="savePackageFromPanel(${id})">💾 Save Changes</button>
                <button class="btn" style="background: #666; color: white;" onclick="viewPackage(${id})">✕ Cancel</button>
            `;

            openSidePanel();
        }

        function generatePackageForm(pkg) {
            const isEdit = pkg !== null;
            const prefix = isEdit ? 'edit' : 'add';
            
            return `
                <div class="form-grid">
                    <div class="form-group">
                        <label for="${prefix}_packageType">Package Type *</label>
                        <select id="${prefix}_packageType" required>
                            <option value="">Select type</option>
                            <option value="profile" ${pkg?.type === 'profile' ? 'selected' : ''}>Personal Profile</option>
                            <option value="facebook" ${pkg?.type === 'facebook' ? 'selected' : ''}>Facebook Account + BM</option>
                            <option value="tiktok" ${pkg?.type === 'tiktok' ? 'selected' : ''}>TikTok Ads</option>
                            <option value="google" ${pkg?.type === 'google' ? 'selected' : ''}>Google Agency</option>
                            <option value="taboola" ${pkg?.type === 'taboola' ? 'selected' : ''}>Taboola</option>
                            <option value="snapchat" ${pkg?.type === 'snapchat' ? 'selected' : ''}>Snapchat</option>
                            <option value="other" ${pkg?.type === 'other' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="${prefix}_packageName">Package Name *</label>
                        <input type="text" id="${prefix}_packageName" value="${pkg?.name || ''}" placeholder="e.g. Premium TikTok Ads" required>
                    </div>

                    <div class="form-group">
                        <label for="${prefix}_packageIcon">Icon (emoji or text)</label>
                        <input type="text" id="${prefix}_packageIcon" value="${pkg?.icon || ''}" placeholder="🎯" maxlength="2">
                    </div>

                    <div class="form-group">
                        <label for="${prefix}_packageSubtitle">Subtitle</label>
                        <input type="text" id="${prefix}_packageSubtitle" value="${pkg?.subtitle || ''}" placeholder="e.g. No Spending Limits">
                    </div>

                    <div class="form-group">
                        <label for="${prefix}_packagePrice">Price (USD) *</label>
                        <input type="number" id="${prefix}_packagePrice" value="${pkg?.price || ''}" placeholder="250" min="0" step="0.01" required>
                    </div>

                    <div class="form-group">
                        <label for="${prefix}_packageRegion">Region *</label>
                        <select id="${prefix}_packageRegion" required>
                            <option value="Worldwide" ${pkg?.region === 'Worldwide' ? 'selected' : ''}>Worldwide</option>
                            <option value="Europe" ${pkg?.region === 'Europe' ? 'selected' : ''}>Europe</option>
                            <option value="USA" ${pkg?.region === 'USA' ? 'selected' : ''}>USA</option>
                            <option value="Asia" ${pkg?.region === 'Asia' ? 'selected' : ''}>Asia</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="${prefix}_packageStatus">BM/Verification Status</label>
                        <select id="${prefix}_packageStatus">
                            <option value="" ${!pkg?.status ? 'selected' : ''}>N/A</option>
                            <option value="Verified" ${pkg?.status === 'Verified' ? 'selected' : ''}>Verified</option>
                            <option value="Pending" ${pkg?.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="${prefix}_packageAccess">Access Level</label>
                        <input type="text" id="${prefix}_packageAccess" value="${pkg?.access || ''}" placeholder="e.g. Full Access, Premium Tier">
                    </div>

                    <div class="form-group">
                        <label for="${prefix}_dailyLimit">Daily Limit</label>
                        <input type="text" id="${prefix}_dailyLimit" value="${pkg?.dailyLimit || ''}" placeholder="e.g. $250, High / No Limit">
                    </div>

                    <div class="form-group">
                        <label for="${prefix}_adAccounts">Ad Accounts</label>
                        <input type="text" id="${prefix}_adAccounts" value="${pkg?.adAccounts || ''}" placeholder="e.g. 3 Ad Acc, 5 Ad Acc">
                    </div>

                    <div class="form-group">
                        <label for="${prefix}_spendLimit">Spend Limit</label>
                        <input type="text" id="${prefix}_spendLimit" value="${pkg?.spendLimit || ''}" placeholder="e.g. None (Unlimited)">
                    </div>

                    <div class="form-group">
                        <label for="${prefix}_packageType2">Type (Agency/Business)</label>
                        <input type="text" id="${prefix}_packageType2" value="${pkg?.type2 || ''}" placeholder="e.g. Agency, Business">
                    </div>

                    <div class="form-group">
                        <label for="${prefix}_stockStatus">Stock Status *</label>
                        <select id="${prefix}_stockStatus" required>
                            <option value="in-stock" ${pkg?.stockStatus === 'in-stock' ? 'selected' : ''}>In Stock</option>
                            <option value="high-demand" ${pkg?.stockStatus === 'high-demand' ? 'selected' : ''}>High Demand</option>
                            <option value="out-of-stock" ${pkg?.stockStatus === 'out-of-stock' ? 'selected' : ''}>Out of Stock</option>
                        </select>
                    </div>
                </div>

                <div class="discount-section">
                    <h4>💰 Add Discount (Optional)</h4>
                    <div class="discount-type-selector">
                        <label>
                            <input type="radio" name="${prefix}_discountType" value="percentage" ${pkg?.discountType === 'percentage' ? 'checked' : ''}>
                            Percentage (%)
                        </label>
                        <label>
                            <input type="radio" name="${prefix}_discountType" value="fixed" ${pkg?.discountType === 'fixed' ? 'checked' : ''}>
                            Fixed Amount ($)
                        </label>
                    </div>
                    <div class="discount-inputs">
                        <div class="form-group">
                            <label for="${prefix}_discountValue">Discount Value</label>
                            <input type="number" id="${prefix}_discountValue" value="${pkg?.discountValue || ''}" placeholder="0" min="0" step="0.01">
                        </div>
                        <button type="button" class="btn-clear-discount" onclick="clearDiscount('${prefix}')">Clear Discount</button>
                    </div>
                    
                    <div class="form-group" style="margin-top: 16px;">
                        <label for="${prefix}_discountTarget">Apply Discount To:</label>
                        <select id="${prefix}_discountTarget">
                            <option value="all" ${pkg?.discountTarget === 'all' || !pkg?.discountTarget ? 'selected' : ''}>All Clients</option>
                            <option value="specific" ${pkg?.discountTarget === 'specific' ? 'selected' : ''}>Specific Clients</option>
                        </select>
                    </div>
                    
                    <div class="form-group" id="${prefix}_specificClientsGroup" style="display: ${pkg?.discountTarget === 'specific' ? 'block' : 'none'};">
                        <label for="${prefix}_specificClients">Client IDs (comma separated)</label>
                        <input type="text" id="${prefix}_specificClients" value="${pkg?.specificClients || ''}" placeholder="e.g. client_001, client_002">
                        <small style="color: #666; font-size: 12px; display: block; margin-top: 4px;">
                            Enter client IDs separated by commas. Only these clients will see the discount.
                        </small>
                    </div>
                </div>

                <div class="form-group">
                    <label for="${prefix}_packageDescription">Additional Description</label>
                    <textarea id="${prefix}_packageDescription" placeholder="Additional details about the package...">${pkg?.description || ''}</textarea>
                </div>
            `;
        }

        function setupDiscountToggle(prefix, pkg = null) {
            // Setup event listeners for discount target
            const targetSelect = document.getElementById(`${prefix}_discountTarget`);
            const specificGroup = document.getElementById(`${prefix}_specificClientsGroup`);
            
            if (targetSelect && specificGroup) {
                targetSelect.addEventListener('change', function() {
                    if (this.value === 'specific') {
                        specificGroup.style.display = 'block';
                    } else {
                        specificGroup.style.display = 'none';
                    }
                });
            }
        }

        function clearDiscount(prefix) {
            document.getElementById(`${prefix}_discountValue`).value = '';
            const radios = document.querySelectorAll(`input[name="${prefix}_discountType"]`);
            radios.forEach(radio => radio.checked = false);
        }

        function saveNewPackage() {
            const packageData = {
                id: Date.now(),
                type: document.getElementById('add_packageType').value,
                name: document.getElementById('add_packageName').value,
                icon: document.getElementById('add_packageIcon').value || '📦',
                subtitle: document.getElementById('add_packageSubtitle').value,
                price: document.getElementById('add_packagePrice').value,
                region: document.getElementById('add_packageRegion').value,
                status: document.getElementById('add_packageStatus').value,
                access: document.getElementById('add_packageAccess').value,
                dailyLimit: document.getElementById('add_dailyLimit').value,
                adAccounts: document.getElementById('add_adAccounts').value,
                spendLimit: document.getElementById('add_spendLimit').value,
                type2: document.getElementById('add_packageType2').value,
                stockStatus: document.getElementById('add_stockStatus').value,
                discountType: document.querySelector('input[name="add_discountType"]:checked')?.value || null,
                discountValue: document.getElementById('add_discountValue').value || 0,
                discountTarget: document.getElementById('add_discountTarget').value,
                specificClients: document.getElementById('add_specificClients').value,
                description: document.getElementById('add_packageDescription').value
            };

            packages.push(packageData);
            
            // Save to localStorage so clients can see it
            localStorage.setItem('marketplacePackages', JSON.stringify(packages));
            
            renderAllPackages();
            closeSidePanel();
            alert('✅ Package added successfully!');
        }

        function savePackageFromPanel(id) {
            const packageData = {
                id: id,
                type: document.getElementById('edit_packageType').value,
                name: document.getElementById('edit_packageName').value,
                icon: document.getElementById('edit_packageIcon').value || '📦',
                subtitle: document.getElementById('edit_packageSubtitle').value,
                price: document.getElementById('edit_packagePrice').value,
                region: document.getElementById('edit_packageRegion').value,
                status: document.getElementById('edit_packageStatus').value,
                access: document.getElementById('edit_packageAccess').value,
                dailyLimit: document.getElementById('edit_dailyLimit').value,
                adAccounts: document.getElementById('edit_adAccounts').value,
                spendLimit: document.getElementById('edit_spendLimit').value,
                type2: document.getElementById('edit_packageType2').value,
                stockStatus: document.getElementById('edit_stockStatus').value,
                discountType: document.querySelector('input[name="edit_discountType"]:checked')?.value || null,
                discountValue: document.getElementById('edit_discountValue').value || 0,
                discountTarget: document.getElementById('edit_discountTarget').value,
                specificClients: document.getElementById('edit_specificClients').value,
                description: document.getElementById('edit_packageDescription').value
            };

            const index = packages.findIndex(p => p.id === id);
            if (index !== -1) {
                packages[index] = packageData;
            }

            // Save to localStorage so clients can see it
            localStorage.setItem('marketplacePackages', JSON.stringify(packages));

            renderAllPackages();
            viewPackage(id);
            alert('✅ Package updated successfully!');
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
            viewingPackageId = null;
            isEditMode = false;
        }
    
