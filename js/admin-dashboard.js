// Admin Dashboard JavaScript
const LS_KEY = "admin_finance_demo_v7";

const feeBreakdown = [
  { type: "Topup Fees", amount: 90.00 },
  { type: "Transfer Fees", amount: 35.00 }
];

function money(n){
  return Number(n || 0).toLocaleString(undefined, { style:"currency", currency:"USD" });
}

function loadFinanceData(){
  const raw = localStorage.getItem(LS_KEY);
  if(!raw) return null;
  try{ return JSON.parse(raw); }catch(e){ return null; }
}

function calculateKPIs(){
  const data = loadFinanceData();
  if(!data || !data.ledger) return { mainWallet: 2450, topups: 4500, spend: 3211.25, fees: 125 };

  let mainWallet = 0, topups = 0, spend = 0, fees = 0;

  data.ledger.forEach(tx => {
    const amt = Number(tx.amount || 0);
    if(tx.type === "topup") topups += amt;
    if(tx.to === "mainWallet") mainWallet += amt;
    if(tx.from === "mainWallet") mainWallet -= amt;
    if(tx.type === "transfer" && tx.from === "mainWallet") spend += amt;
    if(tx.type === "fee" || tx.category?.includes("fee")) fees += amt;
  });

  return { mainWallet, topups, spend, fees };
}

function renderKPIs(){
  const kpis = calculateKPIs();
  document.getElementById("kpiMainWallet").textContent = money(kpis.mainWallet);
  document.getElementById("kpiTopups").textContent = money(kpis.topups);
  document.getElementById("kpiSpend").textContent = money(kpis.spend);
  document.getElementById("kpiFees").textContent = money(kpis.fees);
}

function drawFeeChart() {
  const chartElement = document.getElementById('feeChart');
  if (!chartElement) {
    console.warn('feeChart element not found');
    return;
  }

  // Prepare data for Google Charts
  const chartData = [['Task', 'Hours per Day']];
  feeBreakdown.forEach(fee => {
    chartData.push([fee.type, fee.amount]);
  });

  const data = google.visualization.arrayToDataTable(chartData);

  const options = {
    title: 'Fee Breakdown',
    pieHole: 0.4,
    is3D: true,
    pieStartAngle: 100,
    sliceVisibilityThreshold: 0.02,
    legend: {
      position: 'bottom',
      alignment: 'center',
      textStyle: {
        color: '#233238',
        fontSize: 14,
      },
    },
    colors: ['#8AD1C2', '#9F8AD1', '#D18A99', '#BCD18A', '#D1C28A'],
  };

  const chart = new google.visualization.PieChart(chartElement);
  chart.draw(data, options);
}

function drawAccountsChart() {
  const chartElement = document.getElementById('accountsChart');
  if (!chartElement) {
    console.warn('accountsChart element not found');
    return;
  }

  const accountsData = [
    ['Status', 'Count'],
    ['Assigned', 170],
    ['Available', 80]
  ];

  const data = google.visualization.arrayToDataTable(accountsData);

  const options = {
    title: '',
    pieHole: 0.5,
    height: 250,
    legend: {
      position: 'bottom',
      alignment: 'center',
      textStyle: {
        color: '#0f172a',
        fontSize: 13,
      },
    },
    colors: ['#10b981', '#94a3b8'],
    pieSliceText: 'value',
    tooltip: { 
      text: 'both',
      showColorCode: true 
    },
    chartArea: { width: '90%', height: '70%' },
  };

  const chart = new google.visualization.PieChart(chartElement);
  chart.draw(data, options);
}

function drawWeeklyTopupsChart() {
  const chartElement = document.getElementById('weeklyTopupsChart');
  if (!chartElement) {
    console.warn('weeklyTopupsChart element not found');
    return;
  }

  // Weekly topups data
  const topupsData = [
    ['Status', 'Count'],
    ['Approved', 12],
    ['Pending', 8], 
    ['Declined', 3]
  ];

  const data = google.visualization.arrayToDataTable(topupsData);

  const options = {
    title: '',
    pieHole: 0.4,
    height: 300,
    legend: {
      position: 'bottom',
      alignment: 'center',
      textStyle: {
        color: '#0f172a',
        fontSize: 13,
      },
    },
    colors: ['#10b981', '#f59e0b', '#ef4444'], // Verde, Galben, Roșu
    pieSliceText: 'percentage',
    tooltip: { 
      text: 'both',
      showColorCode: true 
    },
    chartArea: { width: '90%', height: '70%' },
    backgroundColor: 'transparent',
    pieSliceTextStyle: {
      color: 'white',
      fontSize: 14,
      bold: true
    }
  };

  const chart = new google.visualization.PieChart(chartElement);
  chart.draw(data, options);
}

function drawPlatformProfitChart() {
  const chartElement = document.getElementById('platformProfitChart');
  if (!chartElement) {
    console.warn('platformProfitChart element not found');
    return;
  }

  // Platform data with icons and gradients
  const platformData = [
    {
      name: 'Facebook',
      profit: 24.5,
      icon: '../assets/icons/facebook.svg',
      gradient: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'
    },
    {
      name: 'Google',
      profit: 22.8,
      icon: '../assets/icons/google.svg',
      gradient: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)'
    },
    {
      name: 'Taboola',
      profit: 20.1,
      icon: '../assets/icons/taboola.svg',
      gradient: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)'
    },
    {
      name: 'Outbrain',
      profit: 18.7,
      icon: '../assets/icons/outbrain.svg',
      gradient: 'linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%)'
    },
    {
      name: 'Microsoft',
      profit: 17.3,
      icon: '../assets/icons/microsoft.svg',
      gradient: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)'
    },
    {
      name: 'TikTok',
      profit: 15.9,
      icon: '../assets/icons/tiktok.svg',
      gradient: 'linear-gradient(135deg, #f1f8e9 0%, #dcedc8 100%)'
    }
  ];

  // Create custom HTML chart
  chartElement.innerHTML = `
    <style>
      .platform-row {
        display: flex;
        align-items: center;
        gap: 12px;
        position: relative;
      }
      
      .platform-icon-container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 40px;
        height: 40px;
        position: relative;
        cursor: pointer;
      }
      
      .platform-tooltip {
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 6px 10px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition: all 0.2s ease;
        z-index: 1000;
        margin-bottom: 8px;
      }
      
      .platform-tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 4px solid transparent;
        border-top-color: rgba(0, 0, 0, 0.9);
      }
      
      .platform-icon-container:hover .platform-tooltip {
        opacity: 1;
        visibility: visible;
      }
      
      .platform-icon-container:hover img {
        transform: scale(1.1);
      }
      
      .platform-icon-container img {
        transition: transform 0.2s ease;
      }
    </style>
    
    <div style="padding: 20px;">
      <div style="display: flex; flex-direction: column; gap: 16px;">
        ${platformData.map(platform => `
          <div class="platform-row">
            <div class="platform-icon-container">
              <img src="${platform.icon}" width="${['Microsoft', 'Outbrain'].includes(platform.name) ? '48' : ['Taboola'].includes(platform.name) ? '36' : '28'}" height="${['Microsoft', 'Outbrain'].includes(platform.name) ? '48' : ['Taboola'].includes(platform.name) ? '36' : '28'}" alt="${platform.name}" style="flex-shrink: 0;" onerror="this.style.display='none'">
              <div class="platform-tooltip">${platform.name} - ${platform.profit}%</div>
            </div>
            <div style="flex: 1; display: flex; align-items: center; gap: 12px;">
              <div style="flex: 1; height: 24px; background: #f1f5f9; border-radius: 12px; overflow: hidden; position: relative;">
                <div style="
                  height: 100%; 
                  width: ${(platform.profit / 25) * 100}%; 
                  background: ${platform.gradient}; 
                  border-radius: 12px;
                  transition: all 0.3s ease;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                "></div>
              </div>
              <span style="font-size: 14px; font-weight: 700; color: #0f172a; min-width: 50px; text-align: right;">
                ${platform.profit}%
              </span>
            </div>
          </div>
        `).join('')}
      </div>
      
      <!-- Legend -->
      <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
        <div style="display: flex; justify-content: center; align-items: center; gap: 8px; font-size: 12px; color: #64748b;">
          <span>Profit Margin Range:</span>
          <div style="display: flex; align-items: center; gap: 4px;">
            <div style="width: 12px; height: 12px; background: linear-gradient(90deg, #f1f5f9 0%, #10b981 100%); border-radius: 2px;"></div>
            <span>0% - 25%</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function drawCharts() {
  try {
    drawFeeChart();
  } catch(e) {
    console.error('Error drawing fee chart:', e);
  }
  
  try {
    drawAccountsChart();
  } catch(e) {
    console.error('Error drawing accounts chart:', e);
  }

  try {
    drawWeeklyTopupsChart();
  } catch(e) {
    console.error('Error drawing weekly topups chart:', e);
  }

  try {
    drawPlatformProfitChart();
  } catch(e) {
    console.error('Error drawing platform profit chart:', e);
  }
}

// Load Google Charts
if (typeof google !== 'undefined') {
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawCharts);
} else {
  console.error('Google Charts library not loaded');
}

window.addEventListener('resize', () => {
  if (typeof google !== 'undefined' && google.visualization) {
    drawCharts();
  }
});

// Initialize on load
window.addEventListener('load', () => {
  renderKPIs();
});