/* Node smoke test for the v2.63 multi-item checkout (no DOM/browser needed).
   Stubs just enough DOM to load app.js, then drives addToCart / completeSale
   and asserts the resulting persisted state (sales rows, transactionId, debt,
   stock) by reading the localStorage keys saveState() writes to. */

const fs = require('fs');
const vm = require('vm');

// ── minimal element stub ──────────────────────────────────────────────
function makeEl(id) {
  const el = {
    id,
    value: '',
    _textContent: '',
    innerHTML: '',
    style: { display: '' },
    dataset: {},
    classList: {
      _set: new Set(),
      add: function (c) { this._set.add(c); },
      remove: function (c) { this._set.delete(c); },
      contains: function (c) { return this._set.has(c); },
      toggle: function (c, force) {
        const on = force === undefined ? !this._set.has(c) : !!force;
        on ? this._set.add(c) : this._set.delete(c);
        return on;
      }
    },
    addEventListener: function () {},
    setAttribute: function () {},
    getAttribute: function () { return null; },
    appendChild: function () {},
    removeChild: function () {},
    querySelector: function () { return null; },
    querySelectorAll: function () { return []; }
  };
  // Real DOM coerces textContent to a string; keep the stub faithful.
  Object.defineProperty(el, 'textContent', {
    get: function () { return el._textContent; },
    set: function (v) { el._textContent = String(v); }
  });
  return el;
}

const IDS = [
  'dayDate', 'dayEarnings', 'dayItemsSold', 'dayUtang', 'dayTransactionList',
  'dayTransactions', 'saleSheetOverlay', 'saleSheet',
  'saleProductName', 'saleQty', 'saleCustomer', 'saleTotalAmount',
  'saleStockHint',
  'productSuggestions', 'customerSuggestions',
  'btnAddToCart', 'saleCartSection', 'saleCartList', 'saleCartEmpty', 'saleCartCount',
  'salePayCash', 'salePayCredit', 'saleCustomerWrap', 'btnCompleteSale',
  'saleCreditWarn', 'saleAllowAnyway', 'newDebtCreditWarn', 'newDebtAllowAnyway',
  'cddCreditLimit', 'setupOverlay', 'setupStoreName', 'setupOwnerName', 'setupLanguage',
  'toastContainer', 'morningOverdueCard', 'morningOverdueTitle', 'morningOverdueDesc',
  'morningOverdueReviewBtn', 'morningRestockCard', 'morningRestockTitle',
  'morningRestockDesc', 'overdueReviewList', 'overdueReviewTotal', 'overdueReviewOverlay',
  'app', 'appContent', 'closingRestockText', 'paidDebtsContainer', 'paidDebtsCount',
  'paidDebtsList', 'tutorialSelector', 'headerTutorialBtn', 'tutorialOverlay',
  'tutorialBackdrop', 'tutorialHighlight', 'tutorialBox', 'tutorialText',
  'tutorialCurrent', 'tutorialTotal', 'tutorialSkip', 'tutorialPrev', 'tutorialNext',
  'markupSuggestion', 'markupHint', 'markupSuggestedPrice', 'newDebtCustomer',
  'newDebtAmount', 'newDebtSuggestions', 'pdProductTitle', 'pdContainer', 'pdDeductQty',
  'cddBalanceCard', 'cddRecordPaymentBtn', 'cddLedger', 'debtorDetailName',
  'rpAmountField', 'rpRemainingPreview', 'rpNoteField', 'rpPayBtn', 'rpCustomerCard',
  'reportPeriodToggle', 'reportSummaryCards', 'reportBestSellers', 'reportRecentTx',
  'reportLowStock', 'helpTutSelector', 'helpHowTo', 'helpContact', 'helpAbout',
  'howToList', 'settingsLanguage', 'settingsStoreName', 'settingsOwnerName',
  'settingsDefaultMarkup', 'settingsLowStockThreshold', 'settingsDefaultCreditLimit',
  'addProductTitle', 'productName', 'productQty', 'productCost', 'productPrice',
  'productMarkup', 'productLowStock', 'productMarkupHint', 'editProductId',
  'productCategory', 'productBrand', 'productUnit', 'productPackageSize',
  'productBrandList', 'productPackageSizeList', 'inventoryCatFilters',
  'closingActualSales', 'devPanelOverlay',
  'newDebtCreditWarn', 'newDebtAllowAnyway'
];

const elements = {};
IDS.forEach(id => { elements[id] = makeEl(id); });

const storage = {};
const session = {};
const listeners = {};

const fakeWindow = {
  location: { pathname: '/checkout.html', search: '', replace: function () {}, href: '' },
  localStorage: {
    getItem: k => (k in storage ? storage[k] : null),
    setItem: (k, v) => { storage[k] = String(v); },
    removeItem: k => { delete storage[k]; }
  },
  sessionStorage: {
    getItem: k => (k in session ? session[k] : null),
    setItem: (k, v) => { session[k] = String(v); },
    removeItem: k => { delete session[k]; }
  },
  addEventListener: (ev, fn) => { listeners[ev] = fn; },
  confirm: () => true,
  alert: () => {},
  Blob: function () {},
  URL: { createObjectURL: () => '', revokeObjectURL: () => {} },
  navigator: { userAgent: 'node-test' }
};

const fakeDocument = {
  readyState: 'complete',
  getElementById: id => elements[id] || null,
  querySelector: sel => {
    if (sel === '.qty-selector') return makeEl('qty-selector-probe');
    return null;
  },
  querySelectorAll: () => [],
  addEventListener: (ev, fn) => { listeners['doc_' + ev] = fn; },
  createElement: () => makeEl('created'),
  body: makeEl('body')
};

fakeWindow.document = fakeDocument;
const sandbox = {
  window: fakeWindow,
  document: fakeDocument,
  localStorage: fakeWindow.localStorage,
  sessionStorage: fakeWindow.sessionStorage,
  console,
  confirm: fakeWindow.confirm,
  alert: fakeWindow.alert,
  Blob: fakeWindow.Blob,
  URL: fakeWindow.URL,
  URLSearchParams,
  navigator: fakeWindow.navigator,
  setTimeout,
  clearTimeout,
  Date,
  Math,
  JSON,
  parseInt,
  parseFloat,
  isNaN,
  String,
  Number,
  Object,
  Array,
  Promise
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

const src = fs.readFileSync('app.js', 'utf8');
vm.runInContext(src, sandbox, { filename: 'app.js' });

const W = sandbox.window;
let pass = 0, fail = 0;
function assert(cond, msg) {
  if (cond) { pass++; console.log('  ✓ ' + msg); }
  else { fail++; console.log('  ✗ FAIL: ' + msg); }
}

function getState() {
  return {
    products: JSON.parse(storage['sss_v3_products'] || '[]'),
    sales: JSON.parse(storage['sss_v3_sales'] || '[]'),
    debts: JSON.parse(storage['sss_v3_debts'] || '[]')
  };
}

// ── seed products + open the day ──────────────────────────────────────
W.handleDevAction('seedProducts');
W.handleDevAction('toggleDayOpen'); // flips dayOpen to true

console.log('\n— STEP 0: seeded state —');
let st = getState();
assert(st.products.length >= 2, 'seedProducts populated inventory (' + st.products.length + ' products)');
// pick two products with stock
const prod1 = st.products.find(p => p.quantity > 0);
const prod2 = st.products.find(p => p.quantity > 0 && p.id !== prod1.id);
assert(!!prod1 && !!prod2, 'two in-stock products available for the cart');

console.log('\n— STEP 1: fresh checkout page, add products to cart —');
W.resetSaleForm();
assert(elements['saleCartCount'].textContent === '0', 'checkout page starts with an empty cart');

W.selectProduct(prod1.id);
elements['saleQty'].value = '2';
W.onQtyChange();
W.addToCart();
assert(elements['saleCartCount'].textContent === '1', 'cart count = 1 after first add');

// add the same product again → merges (2+1 = 3)
W.selectProduct(prod1.id);
elements['saleQty'].value = '1';
W.onQtyChange();
W.addToCart();
assert(elements['saleCartCount'].textContent === '1', 'cart still 1 line (merged, not duplicated)');

// second product
W.selectProduct(prod2.id);
elements['saleQty'].value = '3';
W.onQtyChange();
W.addToCart();
assert(elements['saleCartCount'].textContent === '2', 'cart count = 2 after second product');

const expectedTotal = prod1.sellingPrice * 3 + prod2.sellingPrice * 3;
const shownTotal = parseFloat((elements['saleTotalAmount'].textContent || '').replace('₱', '').replace(/,/g, ''));
assert(Math.abs(shownTotal - expectedTotal) < 0.01, 'cart total shows ₱' + expectedTotal.toFixed(2) + ' (got ₱' + shownTotal.toFixed(2) + ')');

console.log('\n— STEP 2: adjust qty + remove —');
W.cartAdjustQty(0, 1); // line 0 qty 3 → 4 (clamped to stock)
W.cartRemoveLine(1);   // remove product 2
assert(elements['saleCartCount'].textContent === '1', 'remove drops count to 1');
W.cartAdjustQty(0, 1); // bump line 0 back up
W.selectProduct(prod2.id);
elements['saleQty'].value = '2';
W.onQtyChange();
W.addToCart();
assert(elements['saleCartCount'].textContent === '2', 're-added second product');

console.log('\n— STEP 3: complete as CASH transaction —');
const salesBefore = getState().sales.length;
W.completeSale();
assert(W.location.href === '', 'complete stays on checkout page (no redirect after completing)');
st = getState();
const newSales = st.sales.slice(salesBefore);
assert(newSales.length === 2, '2 sale rows created for 2 cart lines (got ' + newSales.length + ')');
assert(newSales.every(s => s.transactionId), 'every sale row has a transactionId');
assert(newSales[0].transactionId === newSales[1].transactionId, 'both rows share the same transactionId');
assert(newSales.every(s => s.paymentMethod === 'cash'), 'paymentMethod = cash on all rows');
assert(newSales.every(s => s.customerName === null), 'cash sale has no customer');
// cart ends at prod1 ×5 (2 + 1 merged + 1 + 1 adjustments) and prod2 ×2
const p1After = st.products.find(p => p.id === prod1.id);
assert(p1After.quantity === prod1.quantity - 5, 'stock deducted by cart qty 5 (' + prod1.quantity + ' → ' + p1After.quantity + ')');
const p2After = st.products.find(p => p.id === prod2.id);
assert(p2After.quantity === prod2.quantity - 2, 'stock deducted for second line (' + prod2.quantity + ' → ' + p2After.quantity + ')');
assert(elements['saleCartCount'].textContent === '0', 'cart cleared after complete');

console.log('\n— STEP 4: multi-item CREDIT transaction —');
W.resetSaleForm();
W.selectProduct(prod1.id); elements['saleQty'].value = '2'; W.onQtyChange(); W.addToCart();
W.selectProduct(prod2.id); elements['saleQty'].value = '1'; W.onQtyChange(); W.addToCart();
W.setSalePayment('credit');
assert(elements['saleCustomerWrap'].style.display === 'block', 'customer field shown for credit');
elements['saleCustomer'].value = 'Maria';
const salesBefore2 = getState().sales.length;
const debtsBefore2 = getState().debts.length;
W.completeSale();
st = getState();
const newSales2 = st.sales.slice(salesBefore2);
assert(newSales2.length === 2, '2 sale rows for 2-item credit cart');
assert(newSales2.every(s => s.transactionId === newSales2[0].transactionId), 'credit rows share one transactionId');
assert(newSales2.every(s => s.paymentMethod === 'credit'), 'paymentMethod = credit on all rows');
assert(newSales2.every(s => s.customerName === 'Maria'), 'customer Maria on all rows');
const creditTotal = prod1.sellingPrice * 2 + prod2.sellingPrice * 1;
const newDebt = st.debts.find(d => d.customerName === 'Maria');
assert(!!newDebt, 'debt created for Maria');
assert(newDebt && Math.abs(newDebt.remainingBalance - creditTotal) < 0.01, 'debt balance = ₱' + creditTotal.toFixed(2) + ' (got ₱' + (newDebt && newDebt.remainingBalance) + ')');
assert(newDebt && newDebt.transactions && newDebt.transactions.length === 2, 'debt ledger has 2 per-line entries');

console.log('\n— STEP 5: credit limit gate —');
// Push Maria to the limit via the app's own new-debt flow (default limit 500)
elements['newDebtCustomer'].value = 'Maria';
elements['newDebtAmount'].value = '500';
W.saveNewDebt(true); // force — bypasses the same gate under test
st = getState();
const m = st.debts.find(d => d.customerName === 'Maria');
assert(m && m.remainingBalance >= 500, 'Maria pushed to the credit limit (' + (m && m.remainingBalance) + ')');

W.resetSaleForm();
W.selectProduct(prod1.id); elements['saleQty'].value = '1'; W.onQtyChange(); W.addToCart();
W.setSalePayment('credit');
elements['saleCustomer'].value = 'Maria';
const salesBefore3 = getState().sales.length;
W.completeSale();
assert(getState().sales.length === salesBefore3, 'credit blocked at limit (no sale recorded)');
assert(elements['saleAllowAnyway'].style.display === 'block', 'allow-anyway button shown');
W.completeSale(true);
assert(getState().sales.length === salesBefore3 + 1, 'allow-anyway completes the sale');

console.log('\n— STEP 6: discard confirm on back —');
W.resetSaleForm();
W.selectProduct(prod1.id); elements['saleQty'].value = '1'; W.onQtyChange(); W.addToCart();
sandbox.confirm = () => false;
W.closeSaleSheet();
assert(W.location.href === '', 'back cancelled (stays on checkout)');
sandbox.confirm = () => true;
W.closeSaleSheet();
assert(W.location.href === 'day.html', 'back confirmed (navigates to day.html)');

console.log('\n========================================');
console.log('PASS: ' + pass + '  FAIL: ' + fail);
process.exit(fail > 0 ? 1 : 0);
