// Data filtering based on employee permissions

// Filter data array based on permissions
function filterDataByPermissions(moduleKey, subsectionKey, dataArray) {
  const currentRole = getCurrentRole();
  if (currentRole !== 'employee') {
    return dataArray; // No filtering for admin/client
  }
  
  if (typeof getEmployeePermissions !== 'function') {
    return []; // No permissions function available
  }
  
  const permissions = getEmployeePermissions();
  if (!permissions) {
    return []; // No permissions set
  }
  
  const modulePerms = permissions[moduleKey];
  if (!modulePerms || !modulePerms.enabled) {
    return []; // Module not enabled
  }
  
  const subsectionPerms = modulePerms.subsections?.[subsectionKey];
  if (!subsectionPerms) {
    return []; // Subsection not configured
  }
  
  const filters = subsectionPerms.filters || {};
  
  // If no filters set, return all data
  if (Object.keys(filters).length === 0) {
    return dataArray;
  }
  
  // Filter data based on permissions
  return dataArray.filter(item => {
    for (const [filterKey, filterValues] of Object.entries(filters)) {
      if (!filterValues || (Array.isArray(filterValues) && filterValues.length === 0)) {
        continue; // Skip empty filters
      }
      
      // Map filter keys to data properties
      const dataKey = mapFilterKeyToDataProperty(filterKey);
      const itemValue = item[dataKey];
      
      if (itemValue === undefined) {
        continue; // Property doesn't exist in data
      }
      
      // Check if value matches filter
      if (Array.isArray(filterValues)) {
        if (!filterValues.includes(itemValue)) {
          return false; // Value not in allowed list
        }
      } else {
        if (itemValue !== filterValues) {
          return false; // Value doesn't match
        }
      }
    }
    
    return true; // Passed all filters
  });
}

// Map filter keys to actual data property names
function mapFilterKeyToDataProperty(filterKey) {
  const mapping = {
    'client_id': 'clientId',
    'client_name': 'clientName',
    'platform': 'platform',
    'status': 'status',
    'account_name': 'accountName',
    'account_type': 'accountType',
    'billing': 'billing',
    'notif_type': 'type',
    'year': 'year',
    'category': 'category',
    'type': 'type'
  };
  
  return mapping[filterKey] || filterKey;
}

// Check if employee has specific action permission
function hasPermissionForAction(moduleKey, subsectionKey, action) {
  const currentRole = getCurrentRole();
  if (currentRole !== 'employee') {
    return true; // Admin/client have all permissions
  }
  
  if (typeof hasActionAccess !== 'function') {
    return false;
  }
  
  return hasActionAccess(moduleKey, subsectionKey, action);
}

// Hide/show action buttons based on permissions
function applyActionPermissions(moduleKey, subsectionKey) {
  const currentRole = getCurrentRole();
  if (currentRole !== 'employee') {
    return; // No restrictions for admin/client
  }
  
  const canView = hasPermissionForAction(moduleKey, subsectionKey, 'view');
  const canEdit = hasPermissionForAction(moduleKey, subsectionKey, 'edit');
  const canDelete = hasPermissionForAction(moduleKey, subsectionKey, 'delete');
  
  // Hide edit buttons if no edit permission
  if (!canEdit) {
    document.querySelectorAll('[data-edit], .edit-btn, .btn-edit').forEach(btn => {
      btn.style.display = 'none';
    });
  }
  
  // Hide delete buttons if no delete permission
  if (!canDelete) {
    document.querySelectorAll('[data-delete], .delete-btn, .btn-delete').forEach(btn => {
      btn.style.display = 'none';
    });
  }
  
  // If no view permission, show access denied message
  if (!canView) {
    const main = document.querySelector('.main');
    if (main) {
      main.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 400px; text-align: center;">
          <div style="font-size: 64px; margin-bottom: 20px; opacity: 0.3;">🔒</div>
          <h2 style="font-size: 24px; font-weight: 900; color: #0f172a; margin-bottom: 8px;">Access Denied</h2>
          <p style="font-size: 14px; color: #64748b;">You don't have permission to view this content.</p>
        </div>
      `;
    }
  }
}

// Get current employee name for display
function getCurrentEmployeeName() {
  return localStorage.getItem('currentEmployeeName') || 'Employee';
}

// Update header to show current employee
function updateEmployeeHeader() {
  const currentRole = getCurrentRole();
  if (currentRole === 'employee') {
    const employeeName = getCurrentEmployeeName();
    const userInfo = document.querySelector('.user-info span');
    if (userInfo) {
      userInfo.textContent = employeeName;
    }
    
    const userAvatar = document.querySelector('.user-avatar');
    if (userAvatar) {
      const initials = employeeName.split(' ').map(n => n[0]).join('');
      userAvatar.textContent = initials;
    }
  }
}

// Initialize on page load
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    updateEmployeeHeader();
  });
}
