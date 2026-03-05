// CORRECT PAYMENT LOGIC
// Example: Account created 20.02, Initial: $100/45 days, Recurring: $60/30 days, Billing day: 01

function calculateSimulationPayments(startDate, endDate, billingDay, initialAmount, initialInterval, recAmount, recInterval, platformName) {
  simulationState.paymentHistory = [];
  
  // Helper functions
  const daysBetween = (date1, date2) => Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
  
  const creationDate = new Date(startDate);
  
  // 1️⃣ Calculate when initial interval ends
  const initialEndDate = addDays(creationDate, initialInterval);
  
  // 2️⃣ Find first billing date (first occurrence of billingDay after creation)
  let firstBillingDate = new Date(creationDate.getFullYear(), creationDate.getMonth(), billingDay);
  if (firstBillingDate <= creationDate) {
    firstBillingDate = new Date(creationDate.getFullYear(), creationDate.getMonth() + 1, billingDay);
  }
  
  // 3️⃣ Calculate prorata for first billing
  const billingMonthEnd = new Date(firstBillingDate.getFullYear(), firstBillingDate.getMonth() + 1, 0);
  
  let prorataDays = 0;
  let prorataAmount = 0;
  
  // If initial interval ends before the end of billing month, we need prorata
  if (initialEndDate < billingMonthEnd) {
    prorataDays = daysBetween(initialEndDate, billingMonthEnd);
    const dailyRate = recAmount / recInterval;
    prorataAmount = prorataDays * dailyRate;
  }
  
  const firstInvoiceAmount = initialAmount + prorataAmount;
  
  // 4️⃣ Add first invoice
  simulationState.paymentHistory.push({
    date: new Date(firstBillingDate),
    platform: platformName,
    billingDay: billingDay,
    recAmount: recAmount,
    recInterval: recInterval,
    paymentType: 'first',
    initialAmount: initialAmount,
    initialInterval: initialInterval,
    initialEndDate: new Date(initialEndDate),
    prorataAmount: prorataAmount,
    prorataDays: prorataDays,
    actualAmount: firstInvoiceAmount,
    totalAmount: firstInvoiceAmount,
    daysCovered: initialInterval + prorataDays,
    explanation: `Initial: $${initialAmount} + Prorata: $${prorataAmount.toFixed(2)}`
  });
  
  // 5️⃣ Calculate subsequent recurring payments
  let currentBillingDate = new Date(firstBillingDate);
  currentBillingDate.setMonth(currentBillingDate.getMonth() + 1);
  
  while (currentBillingDate <= endDate) {
    const currentMonthStart = new Date(currentBillingDate.getFullYear(), currentBillingDate.getMonth(), 1);
    const currentMonthEnd = new Date(currentBillingDate.getFullYear(), currentBillingDate.getMonth() + 1, 0);
    const daysInMonth = currentMonthEnd.getDate();
    
    let amount = 0;
    let daysCovered = 0;
    let paymentType = 'recurring';
    let explanation = '';
    
    // Check if this month is partially covered by initial interval
    if (initialEndDate >= currentMonthStart && initialEndDate < currentMonthEnd) {
      // Part of this month is covered by initial interval
      // We only charge for days after initialEndDate
      const uncoveredDays = daysBetween(initialEndDate, currentMonthEnd);
      daysCovered = uncoveredDays;
      const dailyRate = recAmount / recInterval;
      amount = uncoveredDays * dailyRate;
      paymentType = 'prorata';
      explanation = `Prorata: days ${initialEndDate.getDate() + 1}-${currentMonthEnd.getDate()} (${uncoveredDays} days)`;
    } else if (initialEndDate >= currentMonthEnd) {
      // This entire month is covered by initial interval - skip
      currentBillingDate.setMonth(currentBillingDate.getMonth() + 1);
      continue;
    } else {
      // Normal recurring payment (proportional to days in month)
      daysCovered = daysInMonth;
      amount = recAmount * (daysInMonth / recInterval);
      paymentType = 'recurring';
      explanation = `Recurring: ${daysInMonth} days`;
    }
    
    simulationState.paymentHistory.push({
      date: new Date(currentBillingDate),
      platform: platformName,
      billingDay: billingDay,
      recAmount: recAmount,
      recInterval: recInterval,
      paymentType: paymentType,
      actualAmount: amount,
      totalAmount: amount,
      daysCovered: daysCovered,
      explanation: explanation
    });
    
    // Move to next billing date
    currentBillingDate.setMonth(currentBillingDate.getMonth() + 1);
  }
}


// Simple payment details display
function showPaymentDetailsSimple(paymentData) {
  const payment = typeof paymentData === 'string' ? JSON.parse(paymentData) : paymentData;

  // Convert date strings back to Date objects if needed
  if (typeof payment.date === 'string') {
    payment.date = new Date(payment.date);
  }
  if (payment.initialEndDate && typeof payment.initialEndDate === 'string') {
    payment.initialEndDate = new Date(payment.initialEndDate);
  }

  let html = `
    <div style="background: white; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
        <div>
          <div style="font-size: 20px; font-weight: 600; color: #334155; margin-bottom: 8px;">
            ${payment.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <div style="display: inline-block; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); color: #3b82f6; padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; border: 1px solid #bfdbfe;">
            ${payment.paymentType === 'first' ? 'FIRST PAYMENT' : payment.paymentType === 'prorata' ? 'PRORATA' : 'RECURRING'}
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 36px; font-weight: 700; color: #3b82f6;">
            ${payment.totalAmount.toFixed(2)}
          </div>
        </div>
      </div>

      <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 10px; padding: 20px; font-size: 14px; line-height: 1.8; border: 1px solid #e2e8f0;">
        ${payment.paymentType === 'first' ? `
          <div style="margin-bottom: 12px;"><strong style="color: #334155;">First Payment Breakdown</strong></div>
          <div style="padding-left: 16px; border-left: 3px solid #3b82f6;">
            • Initial amount: <strong>${payment.initialAmount.toFixed(2)}</strong><br>
            • Initial interval: <strong>${payment.initialInterval} days</strong><br>
            ${payment.initialEndDate ? `• Coverage ends: <strong>${payment.initialEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong><br>` : ''}
            ${payment.prorataDays > 0 ? `
            <br>
            • Prorata days: <strong>${payment.prorataDays} days</strong><br>
            • Prorata amount: <strong>${payment.prorataAmount.toFixed(2)}</strong><br>
            ` : '<br>• No prorata needed (initial interval covers entire month)<br>'}
            <br>
            • <strong>Total: ${payment.totalAmount.toFixed(2)}</strong>
          </div>
        ` : `
          <div style="margin-bottom: 12px;"><strong style="color: #334155;">${payment.paymentType === 'prorata' ? 'Prorata Payment' : 'Recurring Payment'}</strong></div>
          <div style="padding-left: 16px; border-left: 3px solid #3b82f6;">
            ${payment.explanation ? `• ${payment.explanation}<br>` : ''}
            • Days covered: <strong>${payment.daysCovered} days</strong><br>
            • Daily rate: <strong>${(payment.recAmount / payment.recInterval).toFixed(2)}</strong><br>
            <br>
            • <strong>Total: ${payment.totalAmount.toFixed(2)}</strong>
          </div>
        `}
      </div>
    </div>
  `;

  document.getElementById('simulationPaymentDetails').innerHTML = html;
}

