// Platform SVG Icons
const platformIcons = {
  facebook: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1877f2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>`,
  google: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>`,
  tiktok: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000000">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>`,
  instagram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="url(#instagram-gradient)">
    <defs>
      <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#f09433;stop-opacity:1" />
        <stop offset="25%" style="stop-color:#e6683c;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#dc2743;stop-opacity:1" />
        <stop offset="75%" style="stop-color:#cc2366;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#bc1888;stop-opacity:1" />
      </linearGradient>
    </defs>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>`,
  microsoft: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path fill="#f25022" d="M0 0h11.377v11.372H0z"/>
    <path fill="#00a4ef" d="M12.623 0H24v11.372H12.623z"/>
    <path fill="#7fba00" d="M0 12.623h11.377V24H0z"/>
    <path fill="#ffb900" d="M12.623 12.623H24V24H12.623z"/>
  </svg>`
};

// Calendar Data - Recurring payments mockup
const recurringPayments = {
  '2026-02-05': [
    { platform: 'facebook', client: 'TechVision Inc.', account: 'FB-ACC-001', type: 'Setup Fee', amount: '$50' },
    { platform: 'google', client: 'BrightLabs Co.', account: 'G-ADS-042', type: 'Recurring Fee', amount: '$30' }
  ],
  '2026-02-10': [
    { platform: 'tiktok', client: 'NorthPeak Digital', account: 'TT-PRO-018', type: 'Setup Fee', amount: '$50' }
  ],
  '2026-02-15': [
    { platform: 'facebook', client: 'Quantum Media', account: 'FB-BM-205', type: 'Recurring Fee', amount: '$50' },
    { platform: 'instagram', client: 'Stellar Brands', account: 'IG-BUS-091', type: 'Setup Fee', amount: '$40' }
  ],
  '2026-02-20': [
    { platform: 'google', client: 'Apex Marketing', account: 'G-ADS-128', type: 'Recurring Fee', amount: '$30' }
  ],
  '2026-02-25': [
    { platform: 'facebook', client: 'Fusion Ads', account: 'FB-ACC-312', type: 'Setup Fee', amount: '$50' },
    { platform: 'tiktok', client: 'Velocity Group', account: 'TT-ADS-055', type: 'Recurring Fee', amount: '$50' },
    { platform: 'google', client: 'Zenith Corp', account: 'G-MCC-201', type: 'Setup Fee', amount: '$30' }
  ],
  '2026-02-28': [
    { platform: 'instagram', client: 'Horizon Media', account: 'IG-PRO-144', type: 'Recurring Fee', amount: '$40' }
  ],
  '2026-03-05': [
    { platform: 'facebook', client: 'TechVision Inc.', account: 'FB-ACC-001', type: 'Recurring Fee', amount: '$50' },
    { platform: 'google', client: 'BrightLabs Co.', account: 'G-ADS-042', type: 'Recurring Fee', amount: '$30' }
  ],
  '2026-03-10': [
    { platform: 'tiktok', client: 'NorthPeak Digital', account: 'TT-PRO-018', type: 'Recurring Fee', amount: '$50' }
  ],
  '2026-03-15': [
    { platform: 'facebook', client: 'Quantum Media', account: 'FB-BM-205', type: 'Recurring Fee', amount: '$50' }
  ],
  '2026-03-20': [
    { platform: 'microsoft', client: 'Summit Solutions', account: 'MS-ADS-077', type: 'Setup Fee', amount: '$45' }
  ]
};

let currentMiniMonth = new Date();
let currentCalendarMonth = new Date();

function changeMiniMonth(delta) {
  currentMiniMonth.setMonth(currentMiniMonth.getMonth() + delta);
  renderMiniCalendar();
}

function renderMiniCalendar() {
  const container = document.getElementById('miniCalendar');
  const monthTitle = document.getElementById('miniMonthYear');
  
  if (!container || !monthTitle) return;
  
  const year = currentMiniMonth.getFullYear();
  const month = currentMiniMonth.getMonth();
  
  monthTitle.textContent = currentMiniMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  let html = '';
  
  // Day headers
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  dayNames.forEach(day => {
    html += `<div class="calendar-day-header">${day}</div>`;
  });

  // Empty cells before first day
  for (let i = 0; i < startingDayOfWeek; i++) {
    html += `<div class="calendar-day empty"></div>`;
  }

  const today = new Date();
  // Days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const payments = recurringPayments[dateStr] || [];
    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    
    const totalAmount = payments.reduce((sum, p) => {
      const amount = parseFloat(p.amount.replace('$', ''));
      return sum + amount;
    }, 0);

    html += `
      <div class="calendar-day ${isToday ? 'today' : ''} ${payments.length > 0 ? 'has-payments' : ''}" ${payments.length > 0 ? `data-date="${dateStr}" onclick="showPaymentDetails('${dateStr}')" style="cursor: pointer;"` : ''}>
        <div class="calendar-day-number">${day}</div>
        ${payments.length > 0 ? `
          <div class="calendar-day-content">
            ${payments.slice(0, 2).map(p => `
              <div class="calendar-payment-item-simple">
                <div class="calendar-payment-account-simple">${p.account}</div>
                <div class="calendar-payment-amount-simple">${p.amount}</div>
              </div>
            `).join('')}
            ${payments.length > 2 ? `<div class="calendar-more-payments">+${payments.length - 2} more</div>` : ''}
          </div>
        ` : ''}
      </div>
    `;
  }

  container.innerHTML = html;
}

function renderFullCalendar() {
  const container = document.getElementById('fullCalendar');
  const monthYearTitle = document.getElementById('currentMonthYear');
  
  if (!container || !monthYearTitle) return;
  
  const year = currentCalendarMonth.getFullYear();
  const month = currentCalendarMonth.getMonth();
  
  monthYearTitle.textContent = 
    currentCalendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  let html = '';
  
  // Day headers
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  dayNames.forEach(day => {
    html += `<div class="calendar-day-header">${day}</div>`;
  });

  // Empty cells before first day
  for (let i = 0; i < startingDayOfWeek; i++) {
    html += `<div class="calendar-day empty"></div>`;
  }

  // Days of month
  const today = new Date();
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const payments = recurringPayments[dateStr] || [];
    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    
    const totalAmount = payments.reduce((sum, p) => {
      const amount = parseFloat(p.amount.replace('$', ''));
      return sum + amount;
    }, 0);

    html += `
      <div class="calendar-day ${isToday ? 'today' : ''} ${payments.length > 0 ? 'has-payments' : ''}">
        <div class="calendar-day-number">${day}</div>
        ${payments.length > 0 ? `
          <div class="calendar-day-content">
            ${payments.map(p => `
              <div class="calendar-payment-item">
                <span class="calendar-payment-platform">${platformIcons[p.platform]}</span>
                <div class="calendar-payment-details">
                  <div class="calendar-payment-client">${p.client}</div>
                  <div class="calendar-payment-account">${p.account}</div>
                </div>
                <div class="calendar-payment-amount">${p.amount}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  container.innerHTML = html;
  container.className = 'modern-calendar';
}

function showPaymentDetails(dateStr) {
  const payments = recurringPayments[dateStr] || [];
  if (payments.length === 0) return;

  const date = new Date(dateStr);
  const formattedDate = date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const totalAmount = payments.reduce((sum, p) => {
    const amount = parseFloat(p.amount.replace('$', ''));
    return sum + amount;
  }, 0);

  let popup = document.getElementById('paymentDetailsPopup');
  if (!popup) {
    createPaymentPopup();
    popup = document.getElementById('paymentDetailsPopup');
  }

  const popupDate = document.getElementById('popupDate');
  const popupBody = document.getElementById('popupPaymentsList');
  const popupTotal = document.getElementById('popupTotalAmount');

  popupDate.textContent = formattedDate;
  popupTotal.textContent = `$${totalAmount.toFixed(2)}`;

  popupBody.innerHTML = payments.map(p => `
    <div class="payment-item">
      <div class="payment-item-header">
        <div class="payment-platform-icon">${platformIcons[p.platform]}</div>
        <div class="payment-client-name">${p.client}</div>
      </div>
      <div class="payment-item-details">
        <span class="payment-account">${p.account}</span>
        <span class="payment-type">${p.type}</span>
        <span class="payment-amount">${p.amount}</span>
      </div>
    </div>
  `).join('');

  popup.classList.add('active');
}

function closePaymentDetails() {
  const popup = document.getElementById('paymentDetailsPopup');
  if (popup) {
    popup.classList.remove('active');
  }
}

function createPaymentPopup() {
  if (document.getElementById('paymentDetailsPopup')) return;
  
  const popup = document.createElement('div');
  popup.id = 'paymentDetailsPopup';
  popup.className = 'payment-details-popup';
  popup.onclick = function(e) { if(e.target === this) closePaymentDetails(); };
  
  popup.innerHTML = `
    <div class="payment-details-content">
      <div class="payment-details-header">
        <h3 id="popupDate">Payment Details</h3>
        <button class="payment-details-close" onclick="closePaymentDetails()">&times;</button>
      </div>
      <div class="payment-details-body" id="popupPaymentsList"></div>
      <div class="payment-details-footer">
        <span class="payment-total-label">Total Amount:</span>
        <span class="payment-total-amount" id="popupTotalAmount">$0.00</span>
      </div>
    </div>
  `;
  
  document.body.appendChild(popup);
}

function openFullCalendar() {
  const modal = document.getElementById('calendarModal');
  if (modal) {
    modal.classList.add('active');
    renderFullCalendar();
  }
}

function closeFullCalendar() {
  const modal = document.getElementById('calendarModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function changeMonth(delta) {
  currentCalendarMonth.setMonth(currentCalendarMonth.getMonth() + delta);
  renderFullCalendar();
}

// Initialize calendar when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    renderMiniCalendar();
    
    // Close modal on outside click
    const modal = document.getElementById('calendarModal');
    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          closeFullCalendar();
        }
      });
    }
  });
} else {
  renderMiniCalendar();
  
  // Close modal on outside click
  const modal = document.getElementById('calendarModal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeFullCalendar();
      }
    });
  }
}
