// Daily Fees Collection Chart
function drawDailyFeesChart() {
  const chartElement = document.getElementById('dailyFeesChart');
  if (!chartElement) {
    console.warn('dailyFeesChart element not found');
    return;
  }

  // Generate daily fees data for current month (February 2026)
  const dailyFeesData = [
    ['Day', 'Fees ($)']
  ];

  // Generate wave-like fee data for 28 days of February - more pronounced waves
  const waveFees = [
    45, 52, 58, 67, 71, 68, 59, 48, 42, 38, 
    35, 42, 56, 68, 78, 82, 85, 91, 87, 78,
    69, 58, 44, 35, 29, 35, 44, 51
  ];

  for (let day = 1; day <= 28; day++) {
    dailyFeesData.push([`Feb ${day}`, waveFees[day - 1]]);
  }

  const data = google.visualization.arrayToDataTable(dailyFeesData);

  const options = {
    title: '',
    curveType: 'function',
    height: 300,
    backgroundColor: 'transparent',
    hAxis: {
      title: '',
      titleTextStyle: {
        color: '#64748b',
        fontSize: 12
      },
      textStyle: {
        color: '#64748b',
        fontSize: 11,
        bold: false
      },
      gridlines: {
        color: '#f8fafc',
        count: 8
      },
      baselineColor: '#e2e8f0',
      textPosition: 'out'
    },
    vAxis: {
      title: '',
      titleTextStyle: {
        color: '#64748b',
        fontSize: 12
      },
      textStyle: {
        color: '#64748b',
        fontSize: 11,
        bold: false
      },
      gridlines: {
        color: '#f8fafc',
        count: 6
      },
      baselineColor: '#e2e8f0',
      minValue: 20,
      maxValue: 100,
      format: '$#'
    },
    legend: { position: 'none' },
    chartArea: {
      left: 50,
      top: 30,
      width: '88%',
      height: '70%'
    },
    colors: ['#6366f1'],
    lineWidth: 4,
    pointSize: 0,
    pointShape: 'circle',
    areaOpacity: 0.25,
    tooltip: {
      textStyle: {
        color: '#1e293b',
        fontSize: 13,
        bold: false
      },
      showColorCode: false,
      trigger: 'both'
    },
    series: {
      0: {
        areaOpacity: 0.25,
        color: '#6366f1',
        pointsVisible: false
      }
    },
    focusTarget: 'category',
    crosshair: {
      trigger: 'both',
      orientation: 'vertical',
      color: '#cbd5e1',
      opacity: 0.8
    }
  };

  const chart = new google.visualization.AreaChart(chartElement);
  chart.draw(data, options);
}

// Initialize chart when Google Charts is loaded
if (typeof google !== 'undefined' && google.charts) {
  google.charts.setOnLoadCallback(drawDailyFeesChart);
}

// Redraw on window resize
window.addEventListener('resize', () => {
  if (typeof google !== 'undefined' && google.visualization) {
    drawDailyFeesChart();
  }
});