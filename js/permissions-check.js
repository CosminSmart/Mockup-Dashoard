// Permissions checking system for employee role

// Get current employee ID from localStorage
function getCurrentEmployeeId() {
  return localStorage.getItem('currentEmployeeId');
}

// Get permissions for current employee
function getEmployeePermissions() {
  const employeeId = getCurrentEmployeeId();
  if (!employeeId) return null;
  
  const allPermissions = JSON.parse(localStorage.getItem('employeePermissions') || '{}');
  return allPermissions[employeeId] || null;
}

// Check if employee has access to a module
function hasModuleAccess(moduleKey) {
  const permissions = getEmployeePermissions();
  if (!permissions) return false; // If no permissions set, deny all
  
  const modulePerms = permissions[moduleKey];
  if (!modulePerms) return false;
  
  return modulePerms.enabled === true;
}

// Check if employee has access to a specific action in a subsection
function hasActionAccess(moduleKey, subsectionKey, action) {
  const permissions = getEmployeePermissions();
  if (!permissions) return false; // If no permissions set, deny all
  
  const modulePerms = permissions[moduleKey];
  if (!modulePerms || !modulePerms.enabled) return false;
  
  const subsectionPerms = modulePerms.subsections?.[subsectionKey];
  if (!subsectionPerms) return false;
  
  return subsectionPerms.actions?.includes(action) || false;
}

// Check if employee passes filter restrictions
function passesFilterRestrictions(moduleKey, subsectionKey, data) {
  const permissions = getEmployeePermissions();
  if (!permissions) return false; // If no permissions set, deny all
  
  const modulePerms = permissions[moduleKey];
  if (!modulePerms || !modulePerms.enabled) return false;
  
  const subsectionPerms = modulePerms.subsections?.[subsectionKey];
  if (!subsectionPerms) return false;
  
  const filters = subsectionPerms.filters || {};
  
  // Check each filter
  for (const [filterKey, filterValues] of Object.entries(filters)) {
    if (!filterValues || filterValues.length === 0) continue;
    
    // If data has this filter key, check if value is allowed
    if (data[filterKey] !== undefined) {
      if (Array.isArray(filterValues)) {
        if (!filterValues.includes(data[filterKey])) {
          return false;
        }
      } else {
        if (data[filterKey] !== filterValues) {
          return false;
        }
      }
    }
  }
  
  return true;
}

// Get accessible modules for sidebar
function getAccessibleModules() {
  const permissions = getEmployeePermissions();
  if (!permissions) {
    // Return empty array if no permissions set
    return [];
  }
  
  const accessible = [];
  for (const [moduleKey, modulePerms] of Object.entries(permissions)) {
    if (modulePerms.enabled) {
      accessible.push(moduleKey);
    }
  }
  
  return accessible;
}

// Module key mapping (sidebar page to module key)
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

// Check if current page is accessible
function isCurrentPageAccessible() {
  const currentRole = getCurrentRole();
  if (currentRole !== 'employee') return true;
  
  const currentPage = getCurrentPage();
  const moduleKey = PAGE_TO_MODULE_MAP[currentPage];
  
  if (!moduleKey) return true; // Unknown page, allow access
  
  return hasModuleAccess(moduleKey);
}

// Redirect to accessible page if current page is not accessible
function checkPageAccess() {
  const currentRole = getCurrentRole();
  if (currentRole !== 'employee') return;
  
  // Don't redirect, just let them see empty sidebar if no access
  // The sidebar will be filtered by permissions automatically
}

// Initialize permissions check on page load
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    const currentRole = getCurrentRole();
    if (currentRole === 'employee') {
      checkPageAccess();
    }
  });
}
