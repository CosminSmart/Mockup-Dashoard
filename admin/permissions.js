// Application structure with modules, subsections, and available filters
const APP_STRUCTURE = {
  dashboard: {
    name: "Dashboard",
    icon: "📊",
    subsections: {
      overview: {
        name: "Overview",
        filters: []
      }
    }
  },
  users: {
    name: "Users",
    icon: "👥",
    subsections: {
      "client-list": {
        name: "Client List",
        filters: ["client_id", "status"]
      },
      "platform-fees": {
        name: "Platforms & Fees",
        filters: []
      },
      "client-notif": {
        name: "Client Notifications",
        filters: ["client_id", "notif_type"]
      }
    }
  },
  finance: {
    name: "Finance",
    icon: "💰",
    subsections: {
      topups: {
        name: "Top-ups",
        filters: ["client_id", "status"]
      },
      income: {
        name: "Income",
        filters: ["year", "platform", "client_id"]
      },
      "internal-transactions": {
        name: "Internal Transactions",
        filters: ["category"]
      },
      transactions: {
        name: "Transactions",
        filters: ["status", "platform"]
      }
    }
  },
  accounts: {
    name: "Accounts",
    icon: "💳",
    subsections: {
      management: {
        name: "Account Management",
        filters: ["platform", "account_name", "status"]
      }
    }
  },
  marketplace: {
    name: "Marketplace",
    icon: "🛍️",
    subsections: {
      overview: {
        name: "Marketplace Overview",
        filters: []
      }
    }
  },
  "platform-payments": {
    name: "Platform Payments",
    icon: "💳",
    subsections: {
      overview: {
        name: "Platform Payments Overview",
        filters: []
      }
    }
  }
};

// Filter options (mock data - in production, fetch from API)
const FILTER_OPTIONS = {
  client_id: [
    { value: "U-1001", label: "Sarah Mitchell (TechVision Corp)" },
    { value: "U-1002", label: "Michael Chen (BrightLabs)" },
    { value: "U-1003", label: "Emily Rodriguez (NorthPeak)" },
    { value: "U-1004", label: "Alex Martinez (Digital Pro)" },
    { value: "U-1005", label: "Dana Popescu (Marketing Plus)" }
  ],
  client_name: [
    { value: "sarah_mitchell", label: "Sarah Mitchell" },
    { value: "michael_chen", label: "Michael Chen" },
    { value: "emily_rodriguez", label: "Emily Rodriguez" },
    { value: "alex_martinez", label: "Alex Martinez" },
    { value: "dana_popescu", label: "Dana Popescu" }
  ],
  platform: [
    { value: "facebook", label: "Facebook" },
    { value: "google", label: "Google" },
    { value: "tiktok", label: "TikTok" },
    { value: "instagram", label: "Instagram" }
  ],
  status: [
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
    { value: "inactive", label: "Inactive" }
  ],
  notif_type: [
    { value: "info", label: "Info" },
    { value: "warning", label: "Warning" },
    { value: "alert", label: "Alert" },
    { value: "news", label: "News" }
  ],
  year: [
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
    { value: "2026", label: "2026" }
  ],
  category: [
    { value: "deposit", label: "Deposit" },
    { value: "withdrawal", label: "Withdrawal" },
    { value: "transfer", label: "Transfer" },
    { value: "fee", label: "Fee" },
    { value: "refund", label: "Refund" }
  ],
  country: [
    { value: "Romania", label: "Romania" },
    { value: "Bulgaria", label: "Bulgaria" },
    { value: "Hungary", label: "Hungary" }
  ],
  type: [
    { value: "deposit", label: "Deposit" },
    { value: "withdrawal", label: "Withdrawal" },
    { value: "transfer", label: "Transfer" }
  ],
  account_name: [
    { value: "acc1", label: "Facebook Ad Account 1" },
    { value: "acc2", label: "Google Ads Account 1" },
    { value: "acc3", label: "TikTok Business Account" },
    { value: "acc4", label: "Instagram Business" }
  ],
  account_type: [
    { value: "individual", label: "Individual" },
    { value: "general", label: "General" },
    { value: "vault", label: "Vault" }
  ],
  billing: [
    { value: "cc", label: "Credit Card" },
    { value: "cl", label: "Credit Line" }
  ],
  role: [
    { value: "manager", label: "Manager" },
    { value: "operator", label: "Operator" },
    { value: "viewer", label: "Viewer" }
  ]
};

// Mock employees data
const employees = [
  { id: "U-1001", name: "Sarah Mitchell", email: "sarah.mitchell@techvision.com" },
  { id: "U-1002", name: "Michael Chen", email: "michael.chen@brightlabs.io" },
  { id: "U-1003", name: "Emily Rodriguez", email: "emily@northpeak.co" }
];

// Permissions storage (in production, this would be in database)
let employeePermissions = {};

let selectedEmployeeId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadEmployees();
  loadPermissionsFromStorage();
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-dropdown')) {
      closeAllDropdowns();
    }
  });
});

function loadEmployees() {
  const container = document.getElementById('employeeList');
  container.innerHTML = '';
  
  employees.forEach(emp => {
    const item = document.createElement('div');
    item.className = 'dropdown-item';
    item.onclick = () => selectEmployee(emp.id, emp.name);
    
    item.innerHTML = `
      <div style="flex: 1;">
        <div style="font-weight: 700; font-size: 13px; color: var(--text);">${emp.name}</div>
        <div style="font-size: 11px; color: var(--muted); margin-top: 2px;">${emp.email}</div>
      </div>
    `;
    
    container.appendChild(item);
  });
}

function toggleEmployeeDropdown() {
  const dropdown = document.getElementById('employeeDropdown');
  const trigger = document.getElementById('employeeDropdownTrigger');
  
  dropdown.classList.toggle('show');
  trigger.classList.toggle('active');
  
  if (dropdown.classList.contains('show')) {
    document.getElementById('employeeSearch').focus();
  }
}

function closeAllDropdowns() {
  document.querySelectorAll('.dropdown-menu').forEach(menu => {
    menu.classList.remove('show');
  });
  document.querySelectorAll('.dropdown-trigger').forEach(trigger => {
    trigger.classList.remove('active');
  });
}

function filterEmployees() {
  const search = document.getElementById('employeeSearch').value.toLowerCase();
  const items = document.querySelectorAll('#employeeList .dropdown-item');
  
  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(search) ? 'flex' : 'none';
  });
}

function selectEmployee(employeeId, employeeName) {
  selectedEmployeeId = employeeId;
  
  // Update trigger text
  document.querySelector('#employeeDropdownTrigger .dropdown-trigger-text').textContent = employeeName;
  
  // Update selected state
  document.querySelectorAll('#employeeList .dropdown-item').forEach(item => {
    item.classList.remove('selected');
  });
  event.target.closest('.dropdown-item').classList.add('selected');
  
  // Close dropdown
  closeAllDropdowns();
  
  renderPermissionsPanel(employeeId);
}

function renderPermissionsPanel(employeeId) {
  const employee = employees.find(e => e.id === employeeId);
  const permissions = employeePermissions[employeeId] || {};
  
  const container = document.getElementById('permissionsContent');
  container.innerHTML = '<div id="modulesContainer"></div>';
  
  const modulesContainer = document.getElementById('modulesContainer');
  
  Object.keys(APP_STRUCTURE).forEach(moduleKey => {
    const module = APP_STRUCTURE[moduleKey];
    const modulePerms = permissions[moduleKey] || {};
    const subsectionCount = Object.keys(module.subsections).length;
    
    const moduleDiv = document.createElement('div');
    moduleDiv.className = 'module-card';
    moduleDiv.innerHTML = `
      <div class="module-header">
        <div class="module-title">
          <span class="module-icon">${module.icon}</span>
          ${module.name}
          <span class="module-badge">${subsectionCount}</span>
        </div>
        <div class="toggle-wrapper">
          <span class="toggle-label">${modulePerms.enabled ? 'Enabled' : 'Disabled'}</span>
          <div class="toggle-switch ${modulePerms.enabled ? 'active' : ''}" onclick="toggleModule('${moduleKey}')"></div>
        </div>
      </div>
      <div id="subsections-${moduleKey}" style="display: ${modulePerms.enabled ? 'block' : 'none'};">
        ${renderSubsections(moduleKey, module.subsections, modulePerms.subsections || {})}
      </div>
    `;
    
    modulesContainer.appendChild(moduleDiv);
  });
}

function renderSubsections(moduleKey, subsections, subsectionPerms) {
  let html = '';
  
  Object.keys(subsections).forEach(subKey => {
    const subsection = subsections[subKey];
    const subPerms = subsectionPerms[subKey] || { actions: [], filters: {} };
    const hasFilters = subsection.filters.length > 0;
    
    html += `
      <div class="subsection-item">
        <div class="subsection-name">${subsection.name}</div>
        
        <div class="actions-row">
          <label class="action-item">
            <input type="checkbox" 
                   data-module="${moduleKey}" 
                   data-subsection="${subKey}" 
                   data-action="view"
                   ${subPerms.actions.includes('view') ? 'checked' : ''}
                   onchange="updateAction(this)">
            <span>View</span>
          </label>
          <label class="action-item">
            <input type="checkbox" 
                   data-module="${moduleKey}" 
                   data-subsection="${subKey}" 
                   data-action="edit"
                   ${subPerms.actions.includes('edit') ? 'checked' : ''}
                   onchange="updateAction(this)">
            <span>Edit</span>
          </label>
          <label class="action-item">
            <input type="checkbox" 
                   data-module="${moduleKey}" 
                   data-subsection="${subKey}" 
                   data-action="delete"
                   ${subPerms.actions.includes('delete') ? 'checked' : ''}
                   onchange="updateAction(this)">
            <span>Delete</span>
          </label>
        </div>
        
        ${hasFilters ? `
          <div class="filters-section">
            <div class="filters-header" onclick="toggleFilters('${moduleKey}-${subKey}')">
              <span class="filters-title">Filters (${subsection.filters.length})</span>
              <span class="filters-arrow" id="arrow-${moduleKey}-${subKey}">▼</span>
            </div>
            <div class="filters-content" id="filters-${moduleKey}-${subKey}">
              ${renderFilters(moduleKey, subKey, subsection.filters, subPerms.filters)}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  });
  
  return html;
}

function renderFilters(moduleKey, subKey, filters, filterValues) {
  let html = '';
  
  filters.forEach(filterKey => {
    const options = FILTER_OPTIONS[filterKey] || [];
    const selectedValues = filterValues[filterKey] || [];
    const dropdownId = `${moduleKey}-${subKey}-${filterKey}`;
    
    // Get selected labels for display
    let displayText = 'Select...';
    if (selectedValues.length > 0) {
      if (selectedValues.length === 1) {
        const option = options.find(opt => opt.value === selectedValues[0]);
        displayText = option ? option.label : selectedValues[0];
      } else {
        displayText = `${selectedValues.length} selected`;
      }
    }
    
    html += `
      <div class="filter-group">
        <label class="filter-label">${filterKey.replace('_', ' ')}</label>
        <div class="custom-dropdown">
          <div class="dropdown-trigger" onclick="toggleFilterDropdown('${dropdownId}')">
            <span class="dropdown-trigger-text">${displayText}</span>
            <span class="dropdown-trigger-arrow">▼</span>
          </div>
          <div class="dropdown-menu" id="dropdown-${dropdownId}">
            <div class="dropdown-search">
              <input type="text" placeholder="Search..." oninput="filterDropdownItems('${dropdownId}')">
            </div>
            <div id="items-${dropdownId}">
              ${options.map(opt => `
                <div class="dropdown-item ${selectedValues.includes(opt.value) ? 'selected' : ''}" 
                     onclick="toggleFilterOption('${moduleKey}', '${subKey}', '${filterKey}', '${opt.value}', '${dropdownId}')">
                  <div class="dropdown-item-checkbox"></div>
                  <span>${opt.label}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  });
  
  // Special filters for amount and date
  if (filters.includes('amount')) {
    html += `
      <div class="filter-group">
        <label class="filter-label">Max Amount</label>
        <input type="number" 
               style="width: 100%; padding: 8px 12px; border: 1px solid var(--border); border-radius: 6px; font-size: 13px; font-weight: 600;"
               placeholder="e.g. 10000"
               data-module="${moduleKey}" 
               data-subsection="${subKey}" 
               data-filter="amount_max"
               value="${filterValues.amount_max || ''}"
               onchange="updateFilter(this)">
      </div>
    `;
  }
  
  if (filters.includes('date')) {
    const dateRangeValue = filterValues.date_range || '';
    const dateOptions = [
      { value: '', label: 'All Time' },
      { value: 'last_30_days', label: 'Last 30 Days' },
      { value: 'last_quarter', label: 'Last Quarter' },
      { value: 'current_year', label: 'Current Year' }
    ];
    const selectedDateOption = dateOptions.find(opt => opt.value === dateRangeValue) || dateOptions[0];
    const dateDropdownId = `${moduleKey}-${subKey}-date_range`;
    
    html += `
      <div class="filter-group">
        <label class="filter-label">Date Range</label>
        <div class="custom-dropdown">
          <div class="dropdown-trigger" onclick="toggleFilterDropdown('${dateDropdownId}')">
            <span class="dropdown-trigger-text">${selectedDateOption.label}</span>
            <span class="dropdown-trigger-arrow">▼</span>
          </div>
          <div class="dropdown-menu" id="dropdown-${dateDropdownId}">
            <div id="items-${dateDropdownId}">
              ${dateOptions.map(opt => `
                <div class="dropdown-item ${dateRangeValue === opt.value ? 'selected' : ''}" 
                     onclick="selectDateRange('${moduleKey}', '${subKey}', '${opt.value}', '${opt.label}', '${dateDropdownId}')">
                  <span>${opt.label}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  return html;
}

// Toggle filter dropdown
function toggleFilterDropdown(dropdownId) {
  event.stopPropagation();
  const dropdown = document.getElementById(`dropdown-${dropdownId}`);
  const trigger = event.currentTarget;
  
  // Close other dropdowns
  document.querySelectorAll('.dropdown-menu').forEach(menu => {
    if (menu.id !== `dropdown-${dropdownId}`) {
      menu.classList.remove('show');
    }
  });
  document.querySelectorAll('.dropdown-trigger').forEach(t => {
    if (t !== trigger) {
      t.classList.remove('active');
    }
  });
  
  dropdown.classList.toggle('show');
  trigger.classList.toggle('active');
}

// Filter dropdown items
function filterDropdownItems(dropdownId) {
  const search = event.target.value.toLowerCase();
  const items = document.querySelectorAll(`#items-${dropdownId} .dropdown-item`);
  
  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(search) ? 'flex' : 'none';
  });
}

// Toggle filter option (for multi-select)
function toggleFilterOption(moduleKey, subKey, filterKey, value, dropdownId) {
  event.stopPropagation();
  
  if (!selectedEmployeeId) return;
  
  if (!employeePermissions[selectedEmployeeId]) {
    employeePermissions[selectedEmployeeId] = {};
  }
  if (!employeePermissions[selectedEmployeeId][moduleKey]) {
    employeePermissions[selectedEmployeeId][moduleKey] = { enabled: true, subsections: {} };
  }
  if (!employeePermissions[selectedEmployeeId][moduleKey].subsections[subKey]) {
    employeePermissions[selectedEmployeeId][moduleKey].subsections[subKey] = { actions: [], filters: {} };
  }
  
  const filters = employeePermissions[selectedEmployeeId][moduleKey].subsections[subKey].filters;
  
  if (!filters[filterKey]) {
    filters[filterKey] = [];
  }
  
  const index = filters[filterKey].indexOf(value);
  if (index > -1) {
    filters[filterKey].splice(index, 1);
  } else {
    filters[filterKey].push(value);
  }
  
  // Update UI
  const item = event.currentTarget;
  item.classList.toggle('selected');
  
  // Update trigger text
  const trigger = document.querySelector(`#dropdown-${dropdownId}`).previousElementSibling;
  const selectedCount = filters[filterKey].length;
  const triggerText = trigger.querySelector('.dropdown-trigger-text');
  
  if (selectedCount === 0) {
    triggerText.textContent = 'Select...';
  } else if (selectedCount === 1) {
    const options = FILTER_OPTIONS[filterKey] || [];
    const option = options.find(opt => opt.value === filters[filterKey][0]);
    triggerText.textContent = option ? option.label : filters[filterKey][0];
  } else {
    triggerText.textContent = `${selectedCount} selected`;
  }
}

// Select date range (single select)
function selectDateRange(moduleKey, subKey, value, label, dropdownId) {
  event.stopPropagation();
  
  if (!selectedEmployeeId) return;
  
  if (!employeePermissions[selectedEmployeeId]) {
    employeePermissions[selectedEmployeeId] = {};
  }
  if (!employeePermissions[selectedEmployeeId][moduleKey]) {
    employeePermissions[selectedEmployeeId][moduleKey] = { enabled: true, subsections: {} };
  }
  if (!employeePermissions[selectedEmployeeId][moduleKey].subsections[subKey]) {
    employeePermissions[selectedEmployeeId][moduleKey].subsections[subKey] = { actions: [], filters: {} };
  }
  
  const filters = employeePermissions[selectedEmployeeId][moduleKey].subsections[subKey].filters;
  filters.date_range = value;
  
  // Update UI
  document.querySelectorAll(`#items-${dropdownId} .dropdown-item`).forEach(item => {
    item.classList.remove('selected');
  });
  event.currentTarget.classList.add('selected');
  
  // Update trigger text
  const trigger = document.querySelector(`#dropdown-${dropdownId}`).previousElementSibling;
  trigger.querySelector('.dropdown-trigger-text').textContent = label;
  
  // Close dropdown
  closeAllDropdowns();
}

function toggleFilters(id) {
  const content = document.getElementById(`filters-${id}`);
  const arrow = document.getElementById(`arrow-${id}`);
  
  if (content.classList.contains('open')) {
    content.classList.remove('open');
    arrow.classList.remove('open');
  } else {
    content.classList.add('open');
    arrow.classList.add('open');
  }
}

function toggleModule(moduleKey) {
  if (!selectedEmployeeId) return;
  
  if (!employeePermissions[selectedEmployeeId]) {
    employeePermissions[selectedEmployeeId] = {};
  }
  
  if (!employeePermissions[selectedEmployeeId][moduleKey]) {
    employeePermissions[selectedEmployeeId][moduleKey] = { enabled: false, subsections: {} };
  }
  
  const isEnabled = employeePermissions[selectedEmployeeId][moduleKey].enabled;
  employeePermissions[selectedEmployeeId][moduleKey].enabled = !isEnabled;
  
  // Update UI - find the toggle switch that was clicked
  const toggles = document.querySelectorAll('.toggle-switch');
  toggles.forEach(toggle => {
    if (toggle.onclick && toggle.onclick.toString().includes(moduleKey)) {
      toggle.classList.toggle('active');
      
      // Update label
      const label = toggle.previousElementSibling;
      if (label) {
        label.textContent = !isEnabled ? 'Enabled' : 'Disabled';
      }
    }
  });
  
  const subsectionsDiv = document.getElementById(`subsections-${moduleKey}`);
  if (subsectionsDiv) {
    subsectionsDiv.style.display = !isEnabled ? 'block' : 'none';
  }
}

function updateAction(checkbox) {
  if (!selectedEmployeeId) return;
  
  const module = checkbox.dataset.module;
  const subsection = checkbox.dataset.subsection;
  const action = checkbox.dataset.action;
  
  if (!employeePermissions[selectedEmployeeId]) {
    employeePermissions[selectedEmployeeId] = {};
  }
  if (!employeePermissions[selectedEmployeeId][module]) {
    employeePermissions[selectedEmployeeId][module] = { enabled: true, subsections: {} };
  }
  if (!employeePermissions[selectedEmployeeId][module].subsections[subsection]) {
    employeePermissions[selectedEmployeeId][module].subsections[subsection] = { actions: [], filters: {} };
  }
  
  const actions = employeePermissions[selectedEmployeeId][module].subsections[subsection].actions;
  
  if (checkbox.checked) {
    if (!actions.includes(action)) {
      actions.push(action);
    }
  } else {
    const index = actions.indexOf(action);
    if (index > -1) {
      actions.splice(index, 1);
    }
  }
}

function updateFilter(element) {
  if (!selectedEmployeeId) return;
  
  const module = element.dataset.module;
  const subsection = element.dataset.subsection;
  const filter = element.dataset.filter;
  
  if (!employeePermissions[selectedEmployeeId]) {
    employeePermissions[selectedEmployeeId] = {};
  }
  if (!employeePermissions[selectedEmployeeId][module]) {
    employeePermissions[selectedEmployeeId][module] = { enabled: true, subsections: {} };
  }
  if (!employeePermissions[selectedEmployeeId][module].subsections[subsection]) {
    employeePermissions[selectedEmployeeId][module].subsections[subsection] = { actions: [], filters: {} };
  }
  
  const filters = employeePermissions[selectedEmployeeId][module].subsections[subsection].filters;
  filters[filter] = element.value;
}

document.getElementById('savePermissionsBtn').onclick = () => {
  savePermissions();
};

function savePermissions() {
  // Save to localStorage (in production, send to API)
  localStorage.setItem('employeePermissions', JSON.stringify(employeePermissions));
  
  alert('✅ Permissions saved successfully!');
  console.log('Saved permissions:', employeePermissions);
}

function loadPermissionsFromStorage() {
  const stored = localStorage.getItem('employeePermissions');
  if (stored) {
    employeePermissions = JSON.parse(stored);
  }
}
