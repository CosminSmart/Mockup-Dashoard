// ===== Client Details Page JavaScript =====

const backBtn = document.getElementById("backBtn");
backBtn.addEventListener("click", () => window.location.href = "clients.html");

// ===== TAB SWITCHING =====
document.querySelectorAll('.um-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const targetTab = tab.dataset.tab;
    
    // Update tab buttons
    document.querySelectorAll('.um-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.um-tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`tab-${targetTab}`).classList.add('active');
  });
});

function qs(name){
  const url = new URL(window.location.href);
  return url.searchParams.get(name) || "";
}

const id = qs("id");

const CURRENT_USER_ROLE = "admin";
const IS_ADMIN = CURRENT_USER_ROLE === "admin";

const els = {
  avatar: document.getElementById("avatar"),
  idText: document.getElementById("idText"),
  nameText: document.getElementById("nameText"),
  companyText: document.getElementById("companyText"),
  statusText: document.getElementById("statusText"),

  telegramText: document.getElementById("telegramText"),
  emailText: document.getElementById("emailText"),
  phoneText: document.getElementById("phoneText"),
  countryText: document.getElementById("countryText"),
  createdText: document.getElementById("createdText"),

  viewBlock: document.getElementById("viewBlock"),
  editBlock: document.getElementById("editBlock"),

  editBtn: document.getElementById("editBtn"),
  saveBtn: document.getElementById("saveBtn"),
  cancelBtn: document.getElementById("cancelBtn"),

  nameInput: document.getElementById("nameInput"),
  companyInput: document.getElementById("companyInput"),
  telegramInput: document.getElementById("telegramInput"),
  emailInput: document.getElementById("emailInput"),
  phoneInput: document.getElementById("phoneInput"),
  countryInput: document.getElementById("countryInput"),
  statusInput: document.getElementById("statusInput"),

  ercFeeText: document.getElementById("ercFeeText"),
  trcFeeText: document.getElementById("trcFeeText"),
  ercFeeInput: document.getElementById("ercFeeInput"),
  trcFeeInput: document.getElementById("trcFeeInput"),
  netView: document.getElementById("netView"),
  netEdit: document.getElementById("netEdit"),
  netEditBtn: document.getElementById("netEditBtn"),
  netSaveBtn: document.getElementById("netSaveBtn"),
  netCancelBtn: document.getElementById("netCancelBtn"),

  feeBody: document.getElementById("feeBody"),
  feeEditBtn: document.getElementById("feeEditBtn"),
  feeSaveBtn: document.getElementById("feeSaveBtn"),
  feeCancelBtn: document.getElementById("feeCancelBtn"),

  thresholdsBody: document.getElementById("thresholdsBody"),
  thresholdEditBtn: document.getElementById("thresholdEditBtn"),
  thresholdSaveBtn: document.getElementById("thresholdSaveBtn"),
  thresholdCancelBtn: document.getElementById("thresholdCancelBtn"),

  // billing addresses
  billingAddressesList: document.getElementById("billingAddressesList"),
  addAddressBtn: document.getElementById("addAddressBtn"),

  notFound: document.getElementById("notFound")
};

// ===== Utility Functions =====
function initials(name){
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "CL";
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}

function badge(status){
  const s = (status || "").toLowerCase();
  let statusClass = "status-inactive";
  
  if (s === "active") statusClass = "status-active";
  else if (s === "pending") statusClass = "status-pending";
  else if (s === "inactive") statusClass = "status-inactive";
  else if (s === "maintenance") statusClass = "status-maintenance";
  
  return `<span class="um-profile__status ${statusClass}">${status || "—"}</span>`;
}

function applyStatusClass(element, status) {
  // Remove all status classes
  element.classList.remove('status-active', 'status-pending', 'status-inactive', 'status-maintenance');
  
  // Add appropriate status class
  const s = (status || "").toLowerCase();
  if (s === "active") element.classList.add('status-active');
  else if (s === "pending") element.classList.add('status-pending');
  else if (s === "inactive") element.classList.add('status-inactive');
  else if (s === "maintenance") element.classList.add('status-maintenance');
  else element.classList.add('status-inactive');
}

function asPercent(v){
  if (v === null || v === undefined || v === "") return "—";
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return n + "%";
}

function moneyOrPercent(v){
  if (v === null || v === undefined || v === "") return "—";
  const s = String(v).trim();
  if (!s) return "—";
  if (/%|\$|€|£/.test(s)) return s;
  const n = Number(s);
  if (!Number.isNaN(n)) return n + "%";
  return s;
}

function parseMoneyOrNumber(s){
  const raw = String(s ?? "").trim();
  if (!raw) return { value:null, prefix:"", suffix:"" };

  const m1 = raw.match(/^([$€£])\s*([\d.,]+)$/);
  const m2 = raw.match(/^([\d.,]+)\s*([$€£])$/);
  const m3 = raw.match(/^([\d.,]+)$/);

  const toNum = (x) => {
    const n = Number(String(x).replace(/,/g,""));
    return Number.isNaN(n) ? null : n;
  };

  if (m1) return { value: toNum(m1[2]), prefix: m1[1], suffix:"" };
  if (m2) return { value: toNum(m2[1]), prefix:"", suffix: m2[2] };
  if (m3) return { value: toNum(m3[1]), prefix:"", suffix:"" };

  return { value:null, prefix:"", suffix:"" };
}

function parsePercentValue(s){
  const raw = String(s ?? "").trim();
  if (!raw) return null;
  const n = Number(raw.replace("%","").trim());
  return Number.isNaN(n) ? null : n;
}

function formatMoney(prefix, value, suffix){
  const n = Number(value);
  if (Number.isNaN(n)) return (prefix || "") + value + (suffix || "");
  const out = Number.isInteger(n) ? String(n) : String(+n.toFixed(2));
  return (prefix || "") + out + (suffix || "");
}

function clamp0(n){ return Math.max(0, n); }

function applyDiscountToValue(originalStr, discountValue, discountMode){
  const s = String(originalStr ?? "").trim();
  const disc = Number(discountValue);
  if (Number.isNaN(disc) || disc < 0) return s;

  const pct = parsePercentValue(s);
  if (pct !== null){
    let out;
    if (discountMode === "%"){
      out = clamp0(pct * (1 - disc/100));
    } else {
      out = clamp0(pct - disc);
    }
    const outStr = Number.isInteger(out) ? String(out) : String(+out.toFixed(2));
    return outStr + "%";
  }

  const parsed = parseMoneyOrNumber(s);
  if (parsed.value !== null){
    let out;
    if (discountMode === "%"){
      out = clamp0(parsed.value * (1 - disc/100));
    } else {
      out = clamp0(parsed.value - disc);
    }
    return formatMoney(parsed.prefix, out, parsed.suffix);
  }

  return s;
}

function escapeHtml(s){
  return String(s ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

// ===== State Variables =====
let client = null;
let snapshot = null;
let netSnap = null;
let feeSnap = null;
let thresholdSnap = null;
let feeEditing = false;
let thresholdEditing = false;
let openDiscount = { rowIdx: null, col: null };

// ===== Data Functions =====
function loadClient(){
  if (!id) return null;
  const raw = localStorage.getItem("client:" + id);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function ensureDefaults(){
  if (client.ercFee === undefined || client.ercFee === null || client.ercFee === "") client.ercFee = 5;
  if (client.trcFee === undefined || client.trcFee === null || client.trcFee === "") client.trcFee = 3;

  if (!client.notificationThresholds || typeof client.notificationThresholds !== 'object'){
    client.notificationThresholds = {
      facebook: 1000,
      google: 1000,
      tiktok: 1000,
      instagram: 1000
    };
  }

  // Billing addresses defaults (mockup data)
  if (!Array.isArray(client.billingAddresses) || client.billingAddresses.length === 0){
    client.billingAddresses = [
      {
        id: 1,
        label: "Primary Office",
        companyName: "Tech Solutions SRL",
        taxId: "RO12345678",
        address: "Strada Victoriei 123",
        city: "București",
        country: "Romania",
        postalCode: "010101",
        currency: "RON",
        iban: "RO49AAAA1B31007593840000",
        isDefault: true
      },
      {
        id: 2,
        label: "Secondary Office",
        companyName: "Tech Solutions SRL",
        taxId: "RO12345678",
        address: "Bulevardul Unirii 45",
        city: "Cluj-Napoca",
        country: "Romania",
        postalCode: "400000",
        currency: "EUR",
        iban: "RO49AAAA1B31007593840001",
        isDefault: false
      }
    ];
  }

  if (!Array.isArray(client.feeTable) || client.feeTable.length === 0){
    client.feeTable = [
      { type: "Google Ads",   setup: "$250", initInterval: 21, initAmount: "$30", recInterval: 30, recAmount: "$50", fee: "5%", generalBalance: false, paymentDay: 1 },
      { type: "Facebook Ads", setup: "$250", initInterval: 21, initAmount: "$30", recInterval: 30, recAmount: "$50", fee: "6%", generalBalance: false, paymentDay: 1 },
      { type: "TikTok Ads",   setup: "$250", initInterval: 21, initAmount: "$30", recInterval: 30, recAmount: "$50", fee: "3%", generalBalance: false, paymentDay: 1 },
    ];
  }

  client.feeTable.forEach(r => {
    if (r.initInterval === undefined) r.initInterval = 21;
    if (r.initAmount === undefined) r.initAmount = "$30";
    if (r.recInterval === undefined) r.recInterval = 30;
    if (r.recAmount === undefined) r.recAmount = "$50";
    if (r.generalBalance === undefined) r.generalBalance = false;
    if (r.paymentDay === undefined) r.paymentDay = 1;
  });
}

function persist(){
  localStorage.setItem("client:" + client.id, JSON.stringify(client));
}

function getEmployeesDb(){
  return [
    { id:"E-2002-01", clientId:"C-2002", firstName:"Victor", lastName:"Ivanov", created:"2026-01-21" },
    { id:"E-2002-02", clientId:"C-2002", firstName:"Elena",  lastName:"Popescu", created:"2026-01-22" },
    { id:"E-2002-03", clientId:"C-2002", firstName:"Andrei", lastName:"Marin", created:"2026-01-25" },
    { id:"E-2002-04", clientId:"C-2002", firstName:"Julia",  lastName:"Stone", created:"2026-02-01" },
    { id:"E-2002-05", clientId:"C-2002", firstName:"Daniel", lastName:"Cooper", created:"2026-02-02" },
    { id:"E-2001-01", clientId:"C-2001", firstName:"Maria", lastName:"Lopez", created:"2026-01-13" },
    { id:"E-2001-02", clientId:"C-2001", firstName:"Nate",  lastName:"Wilson", created:"2026-01-15" },
    { id:"E-2001-03", clientId:"C-2001", firstName:"Iris",  lastName:"Chang", created:"2026-01-18" },
  ];
}

// ===== Render Functions =====
function renderProfile(){
  els.idText.textContent = "#" + (client.id || "—");
  els.nameText.textContent = client.name || "—";
  els.companyText.textContent = client.company || "—";
  els.statusText.textContent = client.status || "—";
  applyStatusClass(els.statusText, client.status);
  els.avatar.textContent = initials(client.name);

  els.telegramText.textContent = client.telegram || "—";
  els.emailText.textContent = client.email || "—";
  els.phoneText.textContent = client.phone || "—";
}

function renderBillingAddresses(){
  if (!client.billingAddresses || client.billingAddresses.length === 0) {
    els.billingAddressesList.innerHTML = '<p class="um-muted" style="padding:12px;">No billing addresses found.</p>';
    return;
  }

  els.billingAddressesList.innerHTML = client.billingAddresses.map(addr => `
    <div class="billing-address-card">
      <div class="billing-address-header">
        <div class="billing-address-title">
          📍 ${escapeHtml(addr.label)}
          ${addr.isDefault ? '<span class="um-badge um-badge--green" style="font-size:10px;">Default</span>' : ''}
        </div>
        <div class="billing-address-actions">
          <button class="um-btn um-btn--ghost" style="padding:4px 8px; font-size:12px;">Edit</button>
          ${!addr.isDefault ? '<button class="um-btn um-btn--ghost" style="padding:4px 8px; font-size:12px;">Delete</button>' : ''}
        </div>
      </div>
      <div class="billing-address-body">
        <div class="billing-address-field">
          <div class="billing-address-label">Company</div>
          <div class="billing-address-value">${escapeHtml(addr.companyName)}</div>
        </div>
        <div class="billing-address-field">
          <div class="billing-address-label">Tax ID / VAT</div>
          <div class="billing-address-value">${escapeHtml(addr.taxId)}</div>
        </div>
        <div class="billing-address-field">
          <div class="billing-address-label">Address</div>
          <div class="billing-address-value">${escapeHtml(addr.address)}</div>
        </div>
        <div class="billing-address-field">
          <div class="billing-address-label">City</div>
          <div class="billing-address-value">${escapeHtml(addr.city)}</div>
        </div>
        <div class="billing-address-field">
          <div class="billing-address-label">Country</div>
          <div class="billing-address-value">${escapeHtml(addr.country)}</div>
        </div>
        <div class="billing-address-field">
          <div class="billing-address-label">Postal Code</div>
          <div class="billing-address-value">${escapeHtml(addr.postalCode)}</div>
        </div>
        <div class="billing-address-field">
          <div class="billing-address-label">💰 Currency</div>
          <div class="billing-address-value"><strong>${escapeHtml(addr.currency)}</strong></div>
        </div>
        <div class="billing-address-field">
          <div class="billing-address-label">🏦 IBAN</div>
          <div class="billing-address-value" style="font-family: monospace; font-size: 12px;">${escapeHtml(addr.iban)}</div>
        </div>
      </div>
    </div>
  `).join('');
}

function renderEmployees(){
  const body2 = document.getElementById("employeesBody2");
  const count2 = document.getElementById("employeesCount2");
  const hint2 = document.getElementById("employeesHint2");

  if (!client){
    if (body2) body2.innerHTML = "";
    if (count2) count2.textContent = "0";
    if (hint2) hint2.textContent = "—";
    return;
  }

  const all = getEmployeesDb();
  const list = all
    .filter(e => String(e.clientId) === String(client.id))
    .sort((a,b) => new Date(b.created).getTime() - new Date(a.created).getTime());

  if (count2) count2.textContent = String(list.length);

  const htmlContent = list.length ? list.map(emp => {
    const fullName = `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || "—";
    const created = emp.created || "—";
    return `
      <tr>
        <td>${escapeHtml(fullName)}</td>
        <td>${escapeHtml(created)}</td>
      </tr>
    `;
  }).join("") : `<tr><td colspan="2" class="um-muted">No employees found for this client.</td></tr>`;

  const hintText = list.length ? `Showing ${list.length} employees for ${client.id}.` : "This section lists employees linked to the selected client.";

  if (body2) body2.innerHTML = htmlContent;
  if (hint2) hint2.textContent = hintText;
}

function renderNetworkFees(){
  els.ercFeeText.textContent = asPercent(client.ercFee);
  els.trcFeeText.textContent = asPercent(client.trcFee);
}

function buildDiscountCellView(valueStr, idx, col){
  const safeVal = valueStr || "—";
  const label = col === "setup" ? safeVal : moneyOrPercent(safeVal);

  return `
    <div class="um-cell-actions">
      <span class="${safeVal === "—" ? "um-muted" : ""}">${label}</span>
      <button class="um-btn um-btn--ghost" type="button" data-discount-open data-idx="${idx}" data-col="${col}">
        Apply discount
      </button>
    </div>
  `;
}

function buildDiscountInlineEditor(idx, col){
  return `
    <div class="um-discount-wrap">
      <div class="um-discount-inline">
        <input class="um-input um-discount-input" data-discount-value inputmode="decimal" placeholder="0" />
        <select class="um-select um-discount-select" data-discount-mode>
          <option value="%" selected>%</option>
          <option value="$">$</option>
        </select>
      </div>
      <button class="um-btn um-btn--ghost" type="button" data-discount-cancel>Cancel</button>
    </div>
  `;
}

function renderFeeTable(){
  els.feeBody.innerHTML = "";

  client.feeTable.forEach((row, idx) => {
    const tr = document.createElement("tr");

    const tdType       = document.createElement("td");
    const tdSetup      = document.createElement("td");
    const tdInitInt    = document.createElement("td");
    const tdInitAmt    = document.createElement("td");
    const tdRecInt     = document.createElement("td");
    const tdRecAmt     = document.createElement("td");
    const tdFee        = document.createElement("td");
    const tdPaymentDay = document.createElement("td");
    const tdGB         = document.createElement("td");

    // Add SVG icons for platform types
    const platformIcons = {
      'Facebook': `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1877f2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>`,
      'Google': `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>`,
      'TikTok': `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#000000">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
      </svg>`,
      'Instagram': `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="url(#instagram-gradient-fee)">
        <defs>
          <linearGradient id="instagram-gradient-fee" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#f09433;stop-opacity:1" />
            <stop offset="25%" style="stop-color:#e6683c;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#dc2743;stop-opacity:1" />
            <stop offset="75%" style="stop-color:#cc2366;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#bc1888;stop-opacity:1" />
          </linearGradient>
        </defs>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>`
    };

    const platformType = row.type || "—";
    const platformIcon = platformIcons[platformType];
    
    if (platformIcon && platformType !== "—") {
      tdType.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
          ${platformIcon}
          <span style="font-weight: 500;">${platformType}</span>
        </div>
      `;
    } else {
      tdType.textContent = platformType;
    }

    if (feeEditing){
      tdSetup.innerHTML = `
        <input class="um-input um-inline-input" data-setup-input data-idx="${idx}"
          value="${String(row.setup ?? "").replace(/"/g, "&quot;")}" />
      `;
      tdInitInt.innerHTML = `<input class="um-input um-inline-input" data-init-int data-idx="${idx}" value="${String(row.initInterval ?? "")}">`;
      tdInitAmt.innerHTML = `<input class="um-input um-inline-input" data-init-amt data-idx="${idx}" value="${String(row.initAmount ?? "").replace(/"/g,"&quot;")}">`;
      tdRecInt.innerHTML  = `<input class="um-input um-inline-input" data-rec-int data-idx="${idx}" value="${String(row.recInterval ?? "")}">`;
      tdRecAmt.innerHTML  = `<input class="um-input um-inline-input" data-rec-amt data-idx="${idx}" value="${String(row.recAmount ?? "").replace(/"/g,"&quot;")}">`;
      tdFee.innerHTML = `
        <input class="um-input um-inline-input" data-fee-input data-idx="${idx}"
          value="${String(row.fee ?? "").replace(/"/g, "&quot;")}" />
      `;
      tdPaymentDay.innerHTML = `
        <input class="um-input um-inline-input" data-payment-day data-idx="${idx}" 
          type="number" min="1" max="31" value="${String(row.paymentDay ?? 1)}" 
          style="max-width:70px;" />
      `;
      tdGB.innerHTML = `
        <label class="um-switch" style="justify-content:center;">
          <input type="checkbox" data-gb-toggle data-idx="${idx}" ${row.generalBalance ? 'checked' : ''} />
          <span class="um-switch__track" aria-hidden="true">
            <span class="um-switch__knob"></span>
          </span>
        </label>
      `;
    } else {
      tdSetup.innerHTML =
        (openDiscount.rowIdx === idx && openDiscount.col === "setup")
          ? buildDiscountInlineEditor(idx, "setup")
          : buildDiscountCellView(row.setup, idx, "setup");

      tdInitInt.textContent = row.initInterval ?? "—";
      tdInitAmt.innerHTML   = `<strong>${row.initAmount ?? "—"}</strong>`;
      tdRecInt.textContent  = row.recInterval ?? "—";
      tdRecAmt.innerHTML    = `<strong>${row.recAmount ?? "—"}</strong>`;

      tdFee.innerHTML =
        (openDiscount.rowIdx === idx && openDiscount.col === "fee")
          ? buildDiscountInlineEditor(idx, "fee")
          : buildDiscountCellView(row.fee, idx, "fee");

      tdPaymentDay.innerHTML = `<strong>Day ${row.paymentDay ?? 1}</strong>`;
      tdGB.innerHTML = `<span class="um-badge ${row.generalBalance ? 'um-badge--green' : 'um-badge--gray'}">${row.generalBalance ? 'Enabled' : 'Disabled'}</span>`;
    }

    tr.appendChild(tdType);
    tr.appendChild(tdSetup);
    tr.appendChild(tdInitInt);
    tr.appendChild(tdInitAmt);
    tr.appendChild(tdRecInt);
    tr.appendChild(tdRecAmt);
    tr.appendChild(tdFee);
    tr.appendChild(tdPaymentDay);
    tr.appendChild(tdGB);

    els.feeBody.appendChild(tr);
  });

  if (!feeEditing && openDiscount.rowIdx !== null){
    const input = els.feeBody.querySelector("[data-discount-value]");
    if (input) input.focus();
  }
}

function renderThresholds(){
  els.thresholdsBody.innerHTML = "";

  const platforms = [
    { 
      key: 'facebook', 
      name: 'Facebook',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1877f2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>`
    },
    { 
      key: 'google', 
      name: 'Google',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>`
    },
    { 
      key: 'tiktok', 
      name: 'TikTok',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#000000">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
      </svg>`
    },
    { 
      key: 'instagram', 
      name: 'Instagram',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="url(#instagram-gradient)">
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
      </svg>`
    }
  ];

  platforms.forEach(platform => {
    const tr = document.createElement("tr");
    const tdPlatform = document.createElement("td");
    const tdAmount = document.createElement("td");
    tdAmount.style.textAlign = "right";

    const currentValue = client.notificationThresholds[platform.key] || 0;

    tdPlatform.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        ${platform.svg}
        <span style="font-weight: 500;">${platform.name}</span>
      </div>
    `;

    if (thresholdEditing){
      tdAmount.innerHTML = `
        <input class="um-input um-inline-input" 
          data-threshold-input 
          data-platform="${platform.key}" 
          value="${currentValue}" 
          type="number" 
          min="0" 
          step="100"
          style="text-align:right; max-width:150px; margin-left:auto;" />
      `;
    } else {
      tdAmount.innerHTML = `<strong>${Number(currentValue).toLocaleString()}</strong>`;
    }

    tr.appendChild(tdPlatform);
    tr.appendChild(tdAmount);
    els.thresholdsBody.appendChild(tr);
  });
}

function renderAll(){
  if (!client){
    els.notFound.hidden = false;
    els.editBtn.disabled = true;
    els.netEditBtn.disabled = true;
    els.feeEditBtn.disabled = true;
    els.thresholdEditBtn.disabled = true;
    return;
  }

  renderProfile();
  renderBillingAddresses();
  renderEmployees();
  renderNetworkFees();
  renderFeeTable();
  renderThresholds();
}

// ===== Profile Edit Functions =====
function enterEdit(){
  snapshot = JSON.parse(JSON.stringify(client));

  els.nameInput.value = client.name || "";
  els.companyInput.value = client.company || "";
  els.telegramInput.value = client.telegram || "";
  els.emailInput.value = client.email || "";
  els.phoneInput.value = client.phone || "";
  els.countryInput.value = client.country || "";
  els.statusInput.value = client.status || "Pending";

  els.viewBlock.hidden = true;
  els.editBlock.hidden = false;

  els.editBtn.hidden = true;
  els.saveBtn.hidden = false;
  els.cancelBtn.hidden = false;
}

function exitEdit(restore){
  if (restore && snapshot) client = snapshot;

  els.viewBlock.hidden = false;
  els.editBlock.hidden = true;

  els.editBtn.hidden = false;
  els.saveBtn.hidden = true;
  els.cancelBtn.hidden = true;

  renderAll();
}

function saveProfile(){
  client.name = els.nameInput.value.trim();
  client.company = els.companyInput.value.trim();
  client.telegram = els.telegramInput.value.trim();
  client.email = els.emailInput.value.trim();
  client.phone = els.phoneInput.value.trim();
  client.status = els.statusInput.value;

  if (client.email) {
    localStorage.setItem('clientStatus_' + client.email, client.status);
  }

  persist();
  exitEdit(false);
}

// ===== Network Fees Edit Functions =====
function enterNetEdit(){
  netSnap = JSON.parse(JSON.stringify(client));

  const erc = parsePercentValue(client.ercFee) ?? Number(client.ercFee);
  const trc = parsePercentValue(client.trcFee) ?? Number(client.trcFee);

  els.ercFeeInput.value = (erc !== null && !Number.isNaN(erc)) ? String(erc) : String(client.ercFee ?? "");
  els.trcFeeInput.value = (trc !== null && !Number.isNaN(trc)) ? String(trc) : String(client.trcFee ?? "");

  els.netView.hidden = false;
  els.netEdit.hidden = false;

  els.netEditBtn.hidden = true;
  els.netSaveBtn.hidden = false;
  els.netCancelBtn.hidden = false;
}

function exitNetEdit(restore){
  if (restore && netSnap) client = netSnap;

  els.netView.hidden = false;
  els.netEdit.hidden = true;

  els.netEditBtn.hidden = false;
  els.netSaveBtn.hidden = true;
  els.netCancelBtn.hidden = true;

  renderNetworkFees();
}

function saveNetFees(){
  const ercVal = els.ercFeeInput.value.trim();
  const trcVal = els.trcFeeInput.value.trim();

  const ercN = Number(ercVal);
  const trcN = Number(trcVal);

  client.ercFee = Number.isNaN(ercN) ? ercVal : ercN;
  client.trcFee = Number.isNaN(trcN) ? trcVal : trcN;

  persist();
  exitNetEdit(false);
}

// ===== Fee Table Edit Functions =====
function enterFeeEdit(){
  feeSnap = JSON.parse(JSON.stringify(client));
  feeEditing = true;

  openDiscount = { rowIdx: null, col: null };

  els.feeEditBtn.hidden = true;
  els.feeSaveBtn.hidden = false;
  els.feeCancelBtn.hidden = false;

  renderFeeTable();
}

function exitFeeEdit(restore){
  if (restore && feeSnap) client = feeSnap;

  feeEditing = false;

  els.feeEditBtn.hidden = false;
  els.feeSaveBtn.hidden = true;
  els.feeCancelBtn.hidden = true;

  renderFeeTable();
}

function saveFeeTable(){
  document.querySelectorAll("[data-setup-input]").forEach(inp => {
    const idx = Number(inp.dataset.idx);
    if (client.feeTable[idx]) client.feeTable[idx].setup = inp.value.trim();
  });

  document.querySelectorAll("[data-init-int]").forEach(inp => {
    const idx = Number(inp.dataset.idx);
    if (client.feeTable[idx]) client.feeTable[idx].initInterval = inp.value.trim();
  });

  document.querySelectorAll("[data-init-amt]").forEach(inp => {
    const idx = Number(inp.dataset.idx);
    if (client.feeTable[idx]) client.feeTable[idx].initAmount = inp.value.trim();
  });

  document.querySelectorAll("[data-rec-int]").forEach(inp => {
    const idx = Number(inp.dataset.idx);
    if (client.feeTable[idx]) client.feeTable[idx].recInterval = inp.value.trim();
  });

  document.querySelectorAll("[data-rec-amt]").forEach(inp => {
    const idx = Number(inp.dataset.idx);
    if (client.feeTable[idx]) client.feeTable[idx].recAmount = inp.value.trim();
  });

  document.querySelectorAll("[data-fee-input]").forEach(inp => {
    const idx = Number(inp.dataset.idx);
    if (client.feeTable[idx]) client.feeTable[idx].fee = inp.value.trim();
  });

  document.querySelectorAll("[data-payment-day]").forEach(inp => {
    const idx = Number(inp.dataset.idx);
    const day = Number(inp.value);
    if (client.feeTable[idx]) {
      client.feeTable[idx].paymentDay = (day >= 1 && day <= 31) ? day : 1;
    }
  });

  document.querySelectorAll("[data-gb-toggle]").forEach(inp => {
    const idx = Number(inp.dataset.idx);
    if (client.feeTable[idx]) client.feeTable[idx].generalBalance = inp.checked;
  });

  persist();
  exitFeeEdit(false);
}

// ===== Discount Functions =====
function openDiscountEditor(idx, col){
  openDiscount = { rowIdx: idx, col };
  renderFeeTable();
}

function closeDiscountEditor(){
  openDiscount = { rowIdx: null, col: null };
  renderFeeTable();
}

function applyDiscountFromInline(idx, col, discValue, discMode){
  const row = client.feeTable[idx];
  if (!row) return;

  if (col === "setup"){
    row.setup = applyDiscountToValue(row.setup, discValue, discMode);
  } else {
    row.fee = applyDiscountToValue(row.fee, discValue, discMode);
  }

  persist();
  closeDiscountEditor();
}

// ===== Threshold Edit Functions =====
function enterThresholdEdit(){
  thresholdSnap = JSON.parse(JSON.stringify(client));
  thresholdEditing = true;

  els.thresholdEditBtn.hidden = true;
  els.thresholdSaveBtn.hidden = false;
  els.thresholdCancelBtn.hidden = false;

  renderThresholds();
}

function exitThresholdEdit(restore){
  if (restore && thresholdSnap) client = thresholdSnap;

  thresholdEditing = false;

  els.thresholdEditBtn.hidden = false;
  els.thresholdSaveBtn.hidden = true;
  els.thresholdCancelBtn.hidden = true;

  renderThresholds();
}

function saveThresholds(){
  document.querySelectorAll("[data-threshold-input]").forEach(inp => {
    const platform = inp.dataset.platform;
    const value = Number(inp.value) || 0;
    if (client.notificationThresholds) {
      client.notificationThresholds[platform] = value;
    }
  });

  persist();
  exitThresholdEdit(false);
}

// ===== Event Listeners =====
els.feeBody.addEventListener("click", (e) => {
  const openBtn = e.target.closest("[data-discount-open]");
  if (openBtn){
    const idx = Number(openBtn.dataset.idx);
    const col = openBtn.dataset.col;
    if (!Number.isNaN(idx) && (col === "setup" || col === "fee")){
      openDiscountEditor(idx, col);
    }
    return;
  }

  const cancelBtn = e.target.closest("[data-discount-cancel]");
  if (cancelBtn){
    closeDiscountEditor();
    return;
  }
});

els.feeBody.addEventListener("keydown", (e) => {
  const input = e.target.closest("[data-discount-value]");
  if (!input) return;

  if (e.key === "Escape"){
    e.preventDefault();
    closeDiscountEditor();
    return;
  }

  if (e.key === "Enter"){
    e.preventDefault();

    const wrap = input.closest(".um-discount-wrap");
    const modeEl = wrap?.querySelector("[data-discount-mode]");
    const discMode = modeEl?.value || "%";
    const discValue = input.value.trim();

    if (openDiscount.rowIdx !== null && openDiscount.col){
      applyDiscountFromInline(openDiscount.rowIdx, openDiscount.col, discValue, discMode);
    }
  }
});

// ===== Initialize =====
client = loadClient();
if (client){
  ensureDefaults();
  persist();
}
renderAll();

// Profile events
els.editBtn.addEventListener("click", enterEdit);
els.cancelBtn.addEventListener("click", () => exitEdit(true));
els.saveBtn.addEventListener("click", saveProfile);

// Network fees events
els.netEditBtn.addEventListener("click", enterNetEdit);
els.netCancelBtn.addEventListener("click", () => exitNetEdit(true));
els.netSaveBtn.addEventListener("click", saveNetFees);

// Fee table events
els.feeEditBtn.addEventListener("click", enterFeeEdit);
els.feeCancelBtn.addEventListener("click", () => exitFeeEdit(true));
els.feeSaveBtn.addEventListener("click", saveFeeTable);

// Notification thresholds events
els.thresholdEditBtn.addEventListener("click", enterThresholdEdit);
els.thresholdCancelBtn.addEventListener("click", () => exitThresholdEdit(true));
els.thresholdSaveBtn.addEventListener("click", saveThresholds);
