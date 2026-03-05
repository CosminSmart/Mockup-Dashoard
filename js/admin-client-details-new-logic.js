// Updated showPaymentDetails for new billing logic
function showPaymentDetailsNew(payment, showHistory = false) {
  let statusBadge = '';
  let statusColor = '#10b981';
  
  if (payment.paymentType === 'first') {
    statusBadge = '<span style="background: #10b981; color: white; padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 600;">FIRST PAYMENT</span>';
  } else if (payment.paymentType === 'recurring') {
    statusBadge = '<span style="background: #667eea; color: white; padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 600;">RECURRING</span>';
    statusColor = '#667eea';
  }
  
  // Get payment history
  const history = simulationState.paymentHistory.filter(p => p.date <= payment.date);
  
  let html = `
    <div class="simulation-payment-card" style="background: white; border: 2px solid ${statusColor}; border-radius: 12px; padding: 24px; margin-bottom: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
        <div>
          <div style="font-size: 18px; font-weight: 700; color: #1f2937; margin-bottom: 8px;">
            ${payment.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          ${statusBadge}
        </div>
        <div style="text-align: right;">
          <div style="font-size: 32px; font-weight: 800; color: ${statusColor};">
            $${payment.totalAmount.toFixed(2)}
          </div>
          <div style="font-size: 12px; color: #6b7280;">Total Amount</div>
        </div>
      </div>
      
      <div style="background: #f9fafb; border-radius: 8px; padding: 16px; font-size: 13px; color: #374151; line-height: 1.8;">
        <div style="font-weight: 700; color: #667eea; margin-bottom: 12px; font-size: 14px;">📊 Calculation Logic</div>
        ${payment.paymentType === 'first' ? `
          <div style="margin-bottom: 8px;"><strong>🎉 First Payment</strong></div>
          <div style="padding-left: 16px; border-left: 3px solid #10b981;">
            • Initial amount: $${payment.initialAmount ? payment.initialAmount.toFixed(2) : '0.00'}<br>
            ${payment.prorataDays > 0 ? `
            • Prorata: ${payment.prorataDays} days = $${payment.prorataAmount.toFixed(2)}<br>
            ` : ''}
            • <strong>Total: $${payment.totalAmount.toFixed(2)}</strong>
          </div>
        ` : `
          <div style="margin-bottom: 8px;"><strong>🔄 Recurring Payment</strong></div>
          <div style="padding-left: 16px; border-left: 3px solid #667eea;">
            • Days: ${payment.daysCovered}<br>
            • <strong>Amount: $${payment.totalAmount.toFixed(2)}</strong>
          </div>
        `}
      </div>
    </div>
  `;
  
  document.getElementById('simulationPaymentDetails').innerHTML = html;
}
