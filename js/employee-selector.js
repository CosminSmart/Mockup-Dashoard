// Employee profile selector

// Show employee selector modal
function showEmployeeSelector() {
  const modal = document.getElementById('employeeSelectorModal');
  if (modal) {
    modal.style.display = 'flex';
    loadEmployeeProfiles();
  }
}

// Hide employee selector modal
function hideEmployeeSelector() {
  const modal = document.getElementById('employeeSelectorModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Load employee profiles from permissions
function loadEmployeeProfiles() {
  const employees = [
    { id: "U-1001", name: "Sarah Mitchell", email: "sarah.mitchell@techvision.com" },
    { id: "U-1002", name: "Michael Chen", email: "michael.chen@brightlabs.io" },
    { id: "U-1003", name: "Emily Rodriguez", email: "emily@northpeak.co" }
  ];
  
  const container = document.getElementById('employeeProfilesList');
  if (!container) return;
  
  container.innerHTML = '';
  
  employees.forEach(emp => {
    const item = document.createElement('div');
    item.className = 'employee-profile-item';
    item.onclick = () => selectEmployeeProfile(emp.id, emp.name);
    
    item.innerHTML = `
      <div class="employee-profile-avatar">${emp.name.split(' ').map(n => n[0]).join('')}</div>
      <div class="employee-profile-info">
        <div class="employee-profile-name">${emp.name}</div>
        <div class="employee-profile-email">${emp.email}</div>
      </div>
      <div class="employee-profile-arrow">→</div>
    `;
    
    container.appendChild(item);
  });
}

// Select employee profile
function selectEmployeeProfile(employeeId, employeeName) {
  localStorage.setItem('currentEmployeeId', employeeId);
  localStorage.setItem('currentEmployeeName', employeeName);
  hideEmployeeSelector();
  
  // Reload page to apply permissions
  window.location.reload();
}

// Check if employee needs to select profile
function checkEmployeeProfile() {
  const currentRole = getCurrentRole();
  if (currentRole === 'employee') {
    const currentEmployeeId = localStorage.getItem('currentEmployeeId');
    if (!currentEmployeeId) {
      // Show modal immediately
      setTimeout(() => {
        showEmployeeSelector();
      }, 100);
    }
  }
}

// Initialize on page load
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    checkEmployeeProfile();
  });
}
