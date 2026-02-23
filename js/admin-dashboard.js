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

// Load Google Charts
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawCharts);

function drawCharts() {
  drawFeeChart();
  drawAccountsChart();
}

function drawFeeChart() {
  // Prepare data for Google Charts
  const chartData = [['Task', 'Hours per Day']];
  feeBreakdown.forEach(fee => {
    chartData.push([fee.type, fee.amount]);
  });

  const data = google.visualization.arrayToDataTable(chartData);

  const options = {
    title: 'Fee Breakdown',
    pieHole: 0.4, // Creates a Donut Chart. Does not do anything when is3D is enabled
    is3D: true, // Enables 3D view
    pieStartAngle: 100, // Rotates the chart
    sliceVisibilityThreshold: 0.02, // Hides slices smaller than 2%
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

  const chart = new google.visualization.PieChart(document.getElementById('feeChart'));
  chart.draw(data, options);
}

function drawAccountsChart() {
  const accountsData = [
    ['Status', 'Count'],
    ['Assigned', 170],
    ['Available', 80]
  ];

  const data = google.visualization.arrayToDataTable(accountsData);

  const options = {
    title: '',
    pieHole: 0.5,
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
    chartArea: { width: '100%', height: '75%' },
  };

  const chart = new google.visualization.PieChart(document.getElementById('accountsChart'));
  chart.draw(data, options);
}

window.addEventListener('resize', () => {
  if (typeof google !== 'undefined' && google.visualization) {
    drawFeeChart();
    drawAccountsChart();
  }
});

// Initialize on load
window.addEventListener('load', () => {
  renderKPIs();
});
