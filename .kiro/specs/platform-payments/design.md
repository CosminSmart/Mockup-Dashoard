# Design Document: Platform Payments

## Overview

The Platform Payments feature is a standalone HTML page that provides an intuitive visual interface for managing financial operations across advertising platforms. It follows the existing admin panel architecture using vanilla JavaScript, HTML, and CSS with glass morphism styling. The design emphasizes visual clarity, simplified workflows, and real-time balance updates.

The page integrates with the existing finance system's data structures and localStorage-based state management, ensuring consistency with the current admin/finance.html implementation while providing a more focused, platform-centric view.

## Architecture

### High-Level Structure

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │         platform-payments.html                     │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  State Management (localStorage)            │  │  │
│  │  │  - Client filter                            │  │  │
│  │  │  - Platform filter                          │  │  │
│  │  │  - Transaction ledger                       │  │  │
│  │  │  - Balance calculations                     │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  UI Components                              │  │  │
│  │  │  - Filter bar                               │  │  │
│  │  │  - Main Wallet card                         │  │  │
│  │  │  - Platform cards grid                      │  │  │
│  │  │  - Transfer modal                           │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  Business Logic                             │  │  │
│  │  │  - Balance calculations                     │  │  │
│  │  │  - Transfer validation                      │  │  │
│  │  │  - Transaction recording                    │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Page Load**: Read state from localStorage, render initial UI
2. **Filter Change**: Update state, recalculate balances, re-render affected components
3. **Transfer Initiation**: Open modal, validate inputs, show preview
4. **Transfer Confirmation**: Update ledger, recalculate balances, save state, close modal, show success message
5. **Balance Display**: Aggregate transactions from ledger, apply filters, display results

### Technology Stack

- **HTML5**: Semantic markup, accessibility attributes
- **CSS3**: Glass morphism styling, CSS variables, responsive grid
- **Vanilla JavaScript**: ES6+ features, no frameworks
- **localStorage**: Client-side state persistence
- **Existing CSS**: Reuse layout.css, dashboard.css patterns

## Components and Interfaces

### 1. State Management Module

**Purpose**: Centralized state management using localStorage

**Data Structure**:
```javascript
{
  platformPaymentsState: {
    version: 1,
    selectedClient: "__all__" | clientId,
    selectedPlatform: "__all__" | "facebook" | "google" | "microsoft" | "tiktok" | "snapchat",
    ledger: [
      {
        id: string,
        timestamp: ISO8601,
        type: "fund_vault" | "route_funds",
        clientId: string,
        platform: string,
        from: "main_wallet" | "platform_vault" | "individual_balance" | "general_balance",
        to: "platform_vault" | "individual_balance" | "general_balance" | "main_wallet",
        amount: number,
        fee: number,
        note: string
      }
    ],
    generalBalanceEnabled: {
      [clientId]: {
        [platform]: boolean
      }
    }
  }
}
```

**Functions**:
- `loadState()`: Read from localStorage, return parsed state or default
- `saveState(state)`: Serialize and write to localStorage
- `addTransaction(transaction)`: Add to ledger, save state
- `getFilteredTransactions(clientId, platform)`: Return filtered transaction list
- `isGeneralBalanceEnabled(clientId, platform)`: Check if general balance is active

### 2. Balance Calculator Module

**Purpose**: Calculate current balances from transaction ledger

**Functions**:
- `calculateMainWallet(clientId)`: Sum all transactions affecting main wallet
- `calculatePlatformVault(clientId, platform)`: Sum vault transactions for platform
- `calculateIndividualBalance(clientId, platform)`: Sum individual balance transactions
- `calculateGeneralBalance(clientId, platform)`: Sum general balance transactions
- `calculateDeposited(clientId, platform)`: Sum all deposits to platform
- `calculateSpend(clientId, platform)`: Sum all spending from platform

**Algorithm**:
```
For each transaction in filtered ledger:
  If transaction.to == target:
    balance += transaction.amount
  If transaction.from == target:
    balance -= transaction.amount
  If transaction has fee and affects target:
    balance -= transaction.fee
Return balance
```

### 3. Filter Bar Component

**Purpose**: Client and platform selection controls

**HTML Structure**:
```html
<div class="global-filters glass">
  <div class="filter-row">
    <div class="form-group">
      <label>Client</label>
      <select id="clientFilter">
        <option value="__all__">All Clients</option>
        <!-- Dynamic client options -->
      </select>
    </div>
    <div class="form-group">
      <label>Platform</label>
      <select id="platformFilter">
        <option value="__all__">All Platforms</option>
        <option value="facebook">Facebook</option>
        <option value="google">Google</option>
        <option value="microsoft">Microsoft</option>
        <option value="tiktok">TikTok</option>
        <option value="snapchat">Snapchat</option>
      </select>
    </div>
    <button class="btn gray" onclick="clearFilters()">Clear</button>
  </div>
  <div class="mini-hint" id="filterHint"></div>
</div>
```

**Behavior**:
- On change: Update state, trigger balance recalculation, re-render cards
- Clear button: Reset to "__all__", refresh display
- Hint text: Show current filter selection in readable format

### 4. Main Wallet Card Component

**Purpose**: Display global balance prominently

**HTML Structure**:
```html
<div class="stat-box main-wallet-card">
  <h4>MAIN WALLET</h4>
  <div class="stat-value" id="mainWalletAmount">$0.00</div>
  <div class="stat-description">
    <span id="mainWalletHint">All clients</span>
  </div>
</div>
```

**Behavior**:
- Display: Format currency, update on filter change
- Hint: Show "All clients" or specific client name

### 5. Platform Card Component

**Purpose**: Display platform-specific financial metrics

**HTML Structure**:
```html
<div class="platform-card glass">
  <div class="platform-header">
    <div class="platform-icon">[Icon]</div>
    <h3 class="platform-name">Facebook</h3>
  </div>
  
  <div class="platform-metrics">
    <div class="metric-row">
      <span class="metric-label">Deposited</span>
      <span class="metric-value">$5,000.00</span>
    </div>
    <div class="metric-row">
      <span class="metric-label">Spend</span>
      <span class="metric-value">$3,200.00</span>
    </div>
    <div class="metric-row highlight">
      <span class="metric-label">Vault</span>
      <span class="metric-value">$1,800.00</span>
    </div>
    <div class="metric-row">
      <span class="metric-label">Individual</span>
      <span class="metric-value">$1,200.00</span>
    </div>
    <div class="metric-row general-balance-row">
      <span class="metric-label">
        General
        <span class="status-indicator" data-enabled="true"></span>
      </span>
      <span class="metric-value">$600.00</span>
    </div>
  </div>
  
  <div class="platform-actions">
    <button class="btn primary" onclick="openTransferModal('facebook', 'fund_vault')">
      Fund Vault
    </button>
    <button class="btn secondary" onclick="openTransferModal('facebook', 'route_funds')">
      Route Funds
    </button>
  </div>
</div>
```

**Styling**:
- General balance disabled: Gray out row, show disabled indicator
- General balance enabled: Normal styling, show green indicator
- Responsive: Stack on mobile, grid on desktop

**Behavior**:
- Calculate and display all metrics from ledger
- Update in real-time when transactions occur
- Show/hide based on platform filter

### 6. Transfer Modal Component

**Purpose**: Handle fund vault and route funds operations

**HTML Structure**:
```html
<div class="modal-simple" id="transferModal">
  <div class="modal-simple-content">
    <div class="modal-header">
      <h2 id="modalTitle">Transfer Funds</h2>
      <button class="btn ghost" onclick="closeTransferModal()">×</button>
    </div>
    
    <div class="modal-body">
      <!-- Mode selector for route funds -->
      <div id="routeModeSelector" style="display:none;">
        <div class="segmented">
          <button class="seg-btn active" data-mode="vault_to_individual">
            Vault → Individual
          </button>
          <button class="seg-btn" data-mode="vault_to_general">
            Vault → General
          </button>
          <button class="seg-btn" data-mode="individual_to_vault">
            Individual → Vault
          </button>
          <button class="seg-btn" data-mode="general_to_vault">
            General → Vault
          </button>
        </div>
      </div>
      
      <!-- Transfer form -->
      <div class="form-group">
        <label>From</label>
        <input type="text" id="transferFrom" readonly>
        <div class="mini-hint" id="fromBalanceHint"></div>
      </div>
      
      <div class="form-group">
        <label>To</label>
        <input type="text" id="transferTo" readonly>
        <div class="mini-hint" id="toBalanceHint"></div>
      </div>
      
      <div class="form-group">
        <label>Amount (USD)</label>
        <input type="number" id="transferAmount" min="0" step="0.01" 
               placeholder="Enter amount" oninput="validateTransfer()">
        <div class="error-message" id="amountError"></div>
      </div>
      
      <div class="form-group">
        <label>Fee (USD) - Optional</label>
        <input type="number" id="transferFee" min="0" step="0.01" 
               placeholder="0.00" oninput="validateTransfer()">
      </div>
      
      <div class="form-group">
        <label>Note - Optional</label>
        <input type="text" id="transferNote" placeholder="Add a note">
      </div>
      
      <!-- Preview -->
      <div class="transfer-preview soft">
        <div class="preview-row">
          <span>Transfer</span>
          <span id="previewAmount">$0.00</span>
        </div>
        <div class="preview-row" id="previewFeeRow" style="display:none;">
          <span>Fee</span>
          <span id="previewFee">$0.00</span>
        </div>
        <div class="preview-row total">
          <span>Total</span>
          <span id="previewTotal">$0.00</span>
        </div>
      </div>
    </div>
    
    <div class="modal-footer">
      <button class="btn success" id="confirmTransferBtn" 
              onclick="confirmTransfer()" disabled>
        Confirm Transfer
      </button>
      <button class="btn gray" onclick="closeTransferModal()">
        Cancel
      </button>
    </div>
  </div>
</div>
```

**Behavior**:
- Fund Vault mode: Main Wallet → Platform Vault, no route selector
- Route Funds mode: Show route selector, update from/to based on selection
- Validation: Check sufficient balance, enable/disable confirm button
- Preview: Update in real-time as user types
- Confirmation: Add transaction to ledger, update balances, close modal

### 7. Validation Module

**Purpose**: Validate transfer operations before execution

**Functions**:
- `validateAmount(amount, sourceBalance)`: Check positive, sufficient funds
- `validateGeneralBalanceTransfer(clientId, platform, direction)`: Check if general balance is enabled
- `validateTransferInputs(transferData)`: Comprehensive validation
- `getValidationErrors(transferData)`: Return array of error messages

**Validation Rules**:
1. Amount must be positive
2. Amount must not exceed source balance
3. Fee must be non-negative
4. Cannot transfer to disabled general balance
5. Cannot transfer from empty balance

### 8. Transaction Recorder Module

**Purpose**: Record and persist financial transactions

**Functions**:
- `createTransaction(type, clientId, platform, from, to, amount, fee, note)`: Create transaction object
- `recordTransaction(transaction)`: Add to ledger, save state
- `generateTransactionId()`: Create unique ID
- `getTransactionTimestamp()`: Get ISO8601 timestamp

**Transaction Format**:
```javascript
{
  id: "tx_" + timestamp + "_" + random,
  timestamp: "2024-02-19T10:30:00.000Z",
  type: "fund_vault" | "route_funds",
  clientId: "100",
  platform: "facebook",
  from: "main_wallet",
  to: "platform_vault",
  amount: 1000.00,
  fee: 5.00,
  note: "Monthly funding"
}
```

## Data Models

### State Model

```typescript
interface PlatformPaymentsState {
  version: number;
  selectedClient: string;
  selectedPlatform: string;
  ledger: Transaction[];
  generalBalanceEnabled: Record<string, Record<string, boolean>>;
}
```

### Transaction Model

```typescript
interface Transaction {
  id: string;
  timestamp: string; // ISO8601
  type: "fund_vault" | "route_funds";
  clientId: string;
  platform: string;
  from: "main_wallet" | "platform_vault" | "individual_balance" | "general_balance";
  to: "platform_vault" | "individual_balance" | "general_balance" | "main_wallet";
  amount: number;
  fee: number;
  note: string;
}
```

### Balance Snapshot Model

```typescript
interface BalanceSnapshot {
  mainWallet: number;
  platforms: Record<string, PlatformBalance>;
}

interface PlatformBalance {
  deposited: number;
  spend: number;
  vault: number;
  individual: number;
  general: number;
  generalEnabled: boolean;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I identified the following redundancies:

**Redundancy Analysis:**
- Properties 2.2, 2.3, 3.1, 5.1, 5.2, 5.3 all test balance calculations with different filters. These can be consolidated into a single comprehensive property about balance calculation correctness.
- Properties 8.2, 8.4, 8.5 all test validation of sufficient balance for different sources. These can be combined into one property about balance validation.
- Properties 9.1, 9.2, 9.3 test different validation rules. These can be combined into a comprehensive validation property.
- Properties 13.1, 13.2, 13.3, 13.4, 13.5 all test currency formatting. These can be combined into one property about currency formatting consistency.
- Properties 4.2, 4.3, 6.1, 6.2, 6.3 test general balance status display. These can be combined into one property about general balance status rendering.
- Properties 1.2, 1.3, 3.3, 12.3 all test filtering behavior. These can be combined into one comprehensive filtering property.

**Retained Properties:**
After consolidation, the following unique properties provide comprehensive validation coverage:

### Core Properties

**Property 1: Balance Conservation (Invariant)**
*For any* sequence of valid transfers, the sum of all balances (Main Wallet + all Platform Vaults + all Individual Balances + all General Balances) should remain constant, accounting for fees collected.
**Validates: Requirements 7.4, 7.5, 8.6**

**Property 2: Balance Calculation Correctness**
*For any* client and platform filter combination, the displayed balance should equal the sum of all transactions affecting that balance in the filtered ledger.
**Validates: Requirements 2.2, 2.3, 3.1, 5.1, 5.2, 5.3**

**Property 3: Filter Application Consistency**
*For any* filter selection (client or platform), all displayed data should contain only records matching the filter criteria.
**Validates: Requirements 1.2, 1.3, 3.3, 12.3**

**Property 4: Filter State Persistence (Round Trip)**
*For any* filter configuration, setting filters then reloading the page should restore the same filter state.
**Validates: Requirements 1.5**

**Property 5: Clear Filters Restoration (Round Trip)**
*For any* filter state, applying filters then clearing them should restore the original "all clients, all platforms" view.
**Validates: Requirements 1.4**

**Property 6: Transfer Validation Completeness**
*For any* transfer attempt, if the amount is negative, exceeds source balance, or targets a disabled general balance, the system should reject the transfer and display an error.
**Validates: Requirements 7.2, 8.2, 8.3, 8.4, 8.5, 9.1, 9.2, 9.3**

**Property 7: Transaction Record Completeness**
*For any* completed transfer, the created transaction record should contain all required fields: id, timestamp, type, clientId, platform, from, to, amount, fee, and note.
**Validates: Requirements 12.1**

**Property 8: Transaction ID Uniqueness**
*For any* set of transactions in the ledger, no two transactions should have the same ID.
**Validates: Requirements 12.4**

**Property 9: Currency Formatting Consistency**
*For any* numeric amount, the formatted currency string should have a dollar sign prefix, exactly two decimal places, comma thousand separators, and minus sign prefix for negatives.
**Validates: Requirements 2.4, 13.1, 13.2, 13.3, 13.4, 13.5**

**Property 10: Platform Card Content Completeness**
*For any* platform, the rendered card should contain all required metrics: deposited, spend, vault, individual, and general balance.
**Validates: Requirements 4.1**

**Property 11: General Balance Status Rendering**
*For any* client-platform combination, if general balance is disabled, the card should display a disabled indicator; if enabled, it should display the balance value.
**Validates: Requirements 4.2, 4.3, 6.1, 6.2, 6.3**

**Property 12: General Balance Enable/Disable**
*For any* client-platform combination, enabling general balance should update the state and allow transfers to general balance; disabling should prevent such transfers.
**Validates: Requirements 6.4**

**Property 13: Balance Update on Transfer**
*For any* valid transfer, both the source and destination balances should be updated by the transfer amount (source decreased, destination increased).
**Validates: Requirements 5.5, 6.5, 7.4**

**Property 14: Fee Deduction Correctness**
*For any* transfer with a fee, the fee amount should be deducted from the source balance in addition to the transfer amount.
**Validates: Requirements 7.5**

**Property 15: Transaction Note Persistence (Round Trip)**
*For any* transfer with a note, retrieving the transaction from the ledger should return the same note text.
**Validates: Requirements 7.6**

**Property 16: Transfer Preview Accuracy**
*For any* transfer form inputs, the preview should display the correct amount, fee (if present), and total (amount + fee).
**Validates: Requirements 10.1**

**Property 17: Validation Button State**
*For any* transfer form state, the confirm button should be enabled if and only if all validation rules pass.
**Validates: Requirements 9.4, 9.5**

**Property 18: Error Message Specificity**
*For any* validation failure, the error message should include the specific reason (insufficient balance should show current and required amounts).
**Validates: Requirements 14.2**

**Property 19: Error Field Highlighting**
*For any* validation error, the system should highlight the specific input field that caused the error.
**Validates: Requirements 14.3**

**Property 20: Contextual Help Updates**
*For any* change in transfer mode or platform selection, the help text should update to reflect the current context.
**Validates: Requirements 16.5**

**Property 21: Responsive Functionality Preservation**
*For any* screen size, all transfer operations and balance calculations should function identically.
**Validates: Requirements 11.4**

**Property 22: Transaction History Retrieval**
*For any* ledger state, retrieving all transactions should return every transaction that was recorded.
**Validates: Requirements 12.2**



## Error Handling

### Error Categories

1. **Validation Errors**: User input that violates business rules
   - Negative amounts
   - Insufficient balance
   - Disabled general balance transfers
   - Missing required fields

2. **State Errors**: Invalid state transitions
   - Attempting to transfer from empty balance
   - Concurrent modification conflicts

3. **Storage Errors**: localStorage failures
   - Quota exceeded
   - localStorage disabled
   - Corrupted state data

### Error Handling Strategy

**Validation Errors**:
- Display inline error messages next to affected fields
- Disable submit button until errors are resolved
- Provide specific, actionable error messages
- Highlight error fields with red border

**State Errors**:
- Prevent invalid operations through UI state management
- Disable buttons for unavailable operations
- Show tooltips explaining why operations are disabled

**Storage Errors**:
- Catch localStorage exceptions
- Display user-friendly error message
- Provide fallback to in-memory state
- Log errors to console for debugging

### Error Message Examples

```javascript
const errorMessages = {
  negativeAmount: "Amount must be positive",
  insufficientBalance: "Insufficient balance. Available: $X.XX, Required: $Y.YY",
  disabledGeneralBalance: "General Balance is not enabled for this client and platform",
  invalidPlatform: "Please select a valid platform",
  storageQuotaExceeded: "Unable to save data. Please clear browser storage.",
  corruptedState: "Data corruption detected. Resetting to default state."
};
```

### Error Recovery

1. **Validation Errors**: User corrects input, validation re-runs automatically
2. **State Errors**: Refresh page to reload clean state
3. **Storage Errors**: Offer "Reset to Default" button to clear corrupted data

## Testing Strategy

### Dual Testing Approach

The testing strategy combines unit tests for specific scenarios and property-based tests for comprehensive coverage:

**Unit Tests**: Focus on specific examples, edge cases, and integration points
- Test specific transfer scenarios (e.g., $1000 from Main to Facebook Vault)
- Test edge cases (e.g., zero balance, maximum amount)
- Test error conditions (e.g., negative input, disabled general balance)
- Test UI interactions (e.g., button clicks, form submissions)

**Property-Based Tests**: Verify universal properties across all inputs
- Generate random transactions and verify balance conservation
- Generate random filter combinations and verify filtering correctness
- Generate random amounts and verify currency formatting
- Run minimum 100 iterations per property test

### Property Test Configuration

Each property test should:
- Run at least 100 iterations with randomized inputs
- Reference the design document property number
- Use tag format: **Feature: platform-payments, Property {number}: {property_text}**
- Test one property per test function

### Test Coverage Areas

**Balance Calculations** (Properties 1, 2, 13, 14):
- Unit tests: Specific transaction sequences with known outcomes
- Property tests: Random transaction sequences, verify conservation and correctness

**Filtering** (Properties 3, 4, 5):
- Unit tests: Specific filter combinations
- Property tests: Random filter selections, verify consistency

**Validation** (Properties 6, 17, 18, 19):
- Unit tests: Specific invalid inputs
- Property tests: Random invalid inputs, verify rejection

**Transaction Management** (Properties 7, 8, 15, 22):
- Unit tests: Create specific transactions, verify storage
- Property tests: Random transactions, verify completeness and uniqueness

**Currency Formatting** (Property 9):
- Unit tests: Specific amounts (e.g., 1000, 1000.5, -500)
- Property tests: Random amounts, verify format consistency

**UI Rendering** (Properties 10, 11, 20):
- Unit tests: Specific states, verify DOM structure
- Property tests: Random states, verify content presence

**State Persistence** (Property 4):
- Unit tests: Set specific filters, reload, verify
- Property tests: Random filter combinations, verify persistence

### Testing Tools

**Recommended Libraries**:
- **fast-check**: Property-based testing for JavaScript
- **Jest** or **Vitest**: Unit testing framework
- **Testing Library**: DOM testing utilities

**Example Property Test**:
```javascript
// Feature: platform-payments, Property 1: Balance Conservation
test('balance conservation across transfers', () => {
  fc.assert(
    fc.property(
      fc.array(fc.record({
        amount: fc.float({ min: 0, max: 10000 }),
        fee: fc.float({ min: 0, max: 100 }),
        from: fc.constantFrom('main_wallet', 'platform_vault', 'individual_balance'),
        to: fc.constantFrom('platform_vault', 'individual_balance', 'general_balance')
      })),
      (transactions) => {
        const initialTotal = calculateTotalBalance();
        transactions.forEach(tx => executeTransfer(tx));
        const finalTotal = calculateTotalBalance();
        return Math.abs(finalTotal - initialTotal) < 0.01; // Account for floating point
      }
    ),
    { numRuns: 100 }
  );
});
```

### Integration Testing

**Browser Testing**:
- Test in Chrome, Firefox, Safari, Edge
- Test on desktop, tablet, and mobile viewports
- Test with localStorage enabled and disabled

**Accessibility Testing**:
- Keyboard navigation through all forms
- Screen reader compatibility
- Color contrast validation
- Focus management

### Manual Testing Checklist

- [ ] Load page with empty state
- [ ] Load page with existing transactions
- [ ] Filter by each client
- [ ] Filter by each platform
- [ ] Clear filters
- [ ] Perform Fund Vault transfer
- [ ] Perform each Route Funds transfer type
- [ ] Add transfer with fee
- [ ] Add transfer with note
- [ ] Attempt invalid transfers (negative, insufficient balance)
- [ ] Verify balance updates after transfers
- [ ] Reload page and verify state persistence
- [ ] Test on mobile device
- [ ] Test with screen reader

## Implementation Notes

### File Structure

```
admin/
  platform-payments.html    # Main page file
css/
  layout.css               # Existing layout (reused)
  dashboard.css            # Existing dashboard styles (reused)
  sidebar.css              # Existing sidebar styles (reused)
js/
  sidebar.js               # Existing sidebar logic (reused)
```

### localStorage Key

Use key: `platform_payments_state_v1` to avoid conflicts with existing finance page

### CSS Variables Reuse

Leverage existing CSS variables from admin/finance.html:
- `--bg0`, `--bg1`: Background colors
- `--text`, `--muted`: Text colors
- `--line`, `--line2`: Border colors
- `--glass`, `--glass2`: Glass morphism backgrounds
- `--shadow`, `--shadow2`: Shadow effects
- `--r-xl`, `--r-lg`, `--r-md`: Border radius values
- `--good`, `--warn`, `--bad`, `--info`: Status colors

### Platform Icons

Use simple text-based icons or emoji for platforms:
- Facebook: 📘 or "FB"
- Google: 🔍 or "G"
- Microsoft: 🪟 or "MS"
- TikTok: 🎵 or "TT"
- Snapchat: 👻 or "SC"

### Responsive Breakpoints

```css
/* Desktop: 4 columns */
@media (min-width: 1200px) {
  .platform-cards { grid-template-columns: repeat(4, 1fr); }
}

/* Tablet: 2 columns */
@media (min-width: 768px) and (max-width: 1199px) {
  .platform-cards { grid-template-columns: repeat(2, 1fr); }
}

/* Mobile: 1 column */
@media (max-width: 767px) {
  .platform-cards { grid-template-columns: 1fr; }
}
```

### Performance Considerations

1. **Debounce filter changes**: Wait 300ms after user stops typing before recalculating
2. **Memoize balance calculations**: Cache results for current filter state
3. **Lazy render platform cards**: Only render visible cards in viewport
4. **Batch DOM updates**: Use DocumentFragment for multiple card updates

### Accessibility Requirements

- All interactive elements must be keyboard accessible
- Form inputs must have associated labels
- Error messages must be announced to screen readers
- Focus must be managed when opening/closing modals
- Color must not be the only indicator of state (use icons/text)

### Browser Compatibility

- Target: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Use standard JavaScript (no experimental features)
- Provide fallbacks for CSS features (grid → flexbox)
- Test localStorage availability before use

## Future Enhancements

### Phase 2 Features (Not in Current Scope)

1. **Bulk Transfers**: Transfer to multiple platforms at once
2. **Scheduled Transfers**: Set up recurring transfers
3. **Transfer History Export**: Download CSV/Excel of transactions
4. **Budget Alerts**: Notify when balances fall below thresholds
5. **Multi-Currency Support**: Handle currencies beyond USD
6. **Transfer Approval Workflow**: Require approval for large transfers
7. **Audit Log**: Detailed log of all user actions
8. **Real-time Sync**: Sync state across multiple browser tabs
9. **Undo/Redo**: Revert recent transfers
10. **Transfer Templates**: Save common transfer configurations

### Technical Debt Considerations

- Consider migrating to a state management library (e.g., Zustand) if complexity grows
- Consider adding TypeScript for type safety
- Consider adding a build step for CSS preprocessing
- Consider adding automated visual regression testing
