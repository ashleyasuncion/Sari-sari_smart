/* ============================================
   SARI-SARI SMART - Three Moment Redesign
   ============================================ */

;(function() {
  'use strict';

  // ============================================
  // PAGE DETECTION
  // ============================================
  var pageName = (function() {
    var path = window.location.pathname.split('/').pop().toLowerCase();
    if (path === '' || path === 'index.html') return 'index';
    return path.replace('.html', '');
  })();

  // ============================================
  // STATE
  // ============================================
  var state = {
    settings: {
      language: 'fil',
      textSize: 'standard',
      storeName: 'Aking Tindahan',
      ownerName: 'May-ari',
      hasCompletedSetup: false,
      launchCount: 0,
      lowStockThreshold: 5
    },
    products: [],
    sales: [],
    debts: [],
    history: [],
    dayOpen: false,
    dayDate: '',          // date this business day started (YYYY-MM-DD)
    dayArchived: false,   // whether day's sales data has been archived to history
    todayExpenses: 0,
    todayEarnings: 0,
    selectedProduct: null,
    paymentDebtId: null,
    editProductId: null
  };

  // ============================================
  // DOM REFS
  // ============================================
  var dom = {};

  function cacheDom() {
    var ids = [
      'headerGreeting', 'appContent',
      'morningGreeting', 'morningSubtitle',
      'morningStockTitle', 'morningStockDesc',
      'morningDebtTitle', 'morningDebtDesc',
      'morningYesterdayTitle', 'morningYesterdayDesc', 'morningYesterdayCard',
      'btnStartDay', 'btnCloseDay', 'btnCompleteDay',
      'dayDate', 'dayEarnings', 'dayItemsSold', 'dayUtang',
      'dayTransactionList', 'daySummary',
      'closingExpenses', 'closingActualSales', 'closingRecordedSales', 'closingSalesDiff', 'closingTotalToday',
      'closingSoldItems', 'closingLowStock', 'closingDebts',
      'closingWeeklySales', 'closingTopSeller',
      'summaryOverlay', 'summaryText', 'summaryDetails',
      'navMorning', 'navSale', 'navClose',
      'saleSheetOverlay', 'saleSheet',
      'saleProductName', 'saleQty', 'saleCustomer', 'saleTotalAmount',
      'saleStockHint', 'btnSaveSale',
      'productSuggestions', 'customerSuggestions',
      'paymentSheetOverlay', 'paymentSheet',
      'paymentCustomerName', 'paymentCustomerBalance',
      'paymentAmount', 'paymentRemaining',
      'manageInventoryList', 'manageDebtsList',
      'manageTotalDebt', 'manageStockSearch',
      'addProductTitle',
      'productName', 'productQty', 'productCost', 'productPrice', 'productMarkup',
      'productMarkupHint', 'editProductId',
      'headerTutorialBtn', 'tutorialOverlay', 'tutorialBackdrop', 'tutorialHighlight',
      'tutorialBox', 'tutorialText', 'tutorialCurrent', 'tutorialTotal',
      'tutorialSkip', 'tutorialNext', 'markupSuggestion', 'markupHint', 'markupSuggestedPrice',
      'newDebtCustomer', 'newDebtAmount',
      'settingsLanguage', 'settingsStoreName', 'settingsOwnerName',
      'setupOverlay', 'setupStoreName', 'setupOwnerName', 'setupLanguage',
      'toastContainer'
    ];
    ids.forEach(function(id) {
      dom[id] = document.getElementById(id);
    });
  }

  // ============================================
  // LOCALIZATION
  // ============================================
  var strings = {
    en: {
      greeting: 'Good day!',
      morningGreeting: 'Good morning!',
      morningSubtitle: 'Is your store ready for today?',
      stockOk: 'All stock is good',
      stockOkDesc: 'No items running low',
      stockWarn: '{n} item(s) need attention',
      stockWarnDesc: 'Items running low or out of stock',
      debtTotal: 'Debt: {amount}',
      debtTotalDesc: '{n} customer(s)',
      yesterday: 'Yesterday: {amount}',
      yesterdayDesc: "Yesterday's sales",
      startDay: 'Start the Day',
      closeDay: 'Close Store \ud83c\udf19',
      dayModeLabel: 'Today',
      payTitle: 'Pay',
      earnings: 'Earnings',
      itemsSold: 'Sold',
      utangToday: 'Debt Today',
      noTransactions: 'No transactions yet.',
      closingExpenses: 'Cost of Goods',
      closingActualSales: 'Actual Sales Today',
      closingProfitLabel: 'Profit',
      noSales: 'No sales recorded today.',
      closingRecordedSales: 'Recorded Sales Today',
      closingSalesDiff: 'Sales Difference',
      allStockOk: 'All stock is good.',
      noDebts: 'No outstanding debts.',
      dayCompleteSub: 'Rest well, {name}. See you tomorrow!',
      mayBumili: 'May Bumili',
      productLabel: 'What did they buy?',
      productPlaceholder: 'Search product...',
      qtyLabel: 'How many?',
      customerLabel: 'Who? (if credit)',
      customerPlaceholder: 'Customer name (optional)',
      totalLabel: 'Total:',
      cancel: 'Cancel',
      save: 'Save',
      stockHint: 'Available: {qty}',
      noStock: 'Out of stock',
      payLabel: 'How much to pay?',
      payPreview: 'Remaining after payment:',
      payBtn: 'Paid',
      payBalance: 'Balance: {amount}',
      addStock: 'Add Stock',
      searchProduct: 'Search product...',
      totalDebtLabel: 'Total Debt',
      payBtnLabel: 'Pay',
      settingsLanguage: 'Language',
      settingsStore: 'Store Name',
      settingsOwner: 'Owner Name',
      resetData: 'Reset Data',
      exportData: 'Export Data',
      setupBtn: "Let's start!",
      productName: 'Product Name',
      productQty: 'Quantity',
      productCost: 'Cost Price',
      productPrice: 'Selling Price',
      productMarkup: 'Markup (%)',
      markupHint: 'At {pct}% markup, sell at {price}',
      newDebtCustomer: 'Customer Name',
      newDebtAmount: 'Debt Amount',
      saved: 'Saved!',
      saleSaved: 'Sale recorded!',
      debtSaved: 'Debt recorded!',
      paymentSaved: 'Payment recorded!',
      productSaved: 'Product saved!',
      dataReset: 'Data has been reset.',
      noProducts: 'No products yet.',
      noDebtItems: 'No debts yet.',
      confirmReset: 'Reset all data? This cannot be undone.',
      dayAlreadyOpen: 'Day is already open!',
      dayNotOpen: 'Day not started yet!',
      profitLabel: 'Profit',
      // Tutorial
      next: 'Next',
      skip: 'Skip',
      suggestedPrice: 'Suggested',
      textSize: 'Text Size',
      standard: 'Standard',
      large: 'Large',
      extraLarge: 'Extra Large',
      // Main Tutorial (multi-page walkthrough)
      mainTutorial1: 'Welcome to Sari-Sari Smart! This quick tour will guide you through your store\'s daily routine — from morning check to closing.',
      mainTutorial2: 'The Stock card shows items running low or out of stock. Tap Stock in the nav to view and manage your inventory.',
      mainTutorial3: 'The Debt card shows how much customers owe you. Tap Debts to view and track payments.',
      mainTutorial4: 'When ready, tap "Start the Day" to open your store for business and start recording sales.',
      mainTutorial5: 'Welcome to Day Mode! This is where you record sales as they happen throughout the day.',
      mainTutorial6: 'The Today summary shows your earnings, items sold, and utang transactions at a glance.',
      mainTutorial7: 'Tap the Sell button to open the sale sheet. Select a product, enter quantity, and save the sale.',
      mainTutorial8: 'At the end of the day, the Closing screen shows a full summary of today\'s performance.',
      mainTutorial9: 'Enter the actual cash you counted. Profit is calculated from each item selling margin.',
      mainTutorial10: 'Tap "Day Complete" when you\'re ready to finalize. Your daily summary will be saved to history.',
      mainTutorial11: 'The Inventory page lets you search, add, and manage all your stock items in one place.',
      mainTutorial12: 'Tap "Add Stock" to add new products or restock existing items with cost and selling price.',
      mainTutorial13: 'The Debts page tracks all customer debts. The total outstanding amount is shown at the top.',
      mainTutorial14: 'Visit Settings anytime to change language, text size, store name, or owner name.',
      // Morning Tutorial
      morningTutorial1: 'This is the Morning Check — your daily overview before opening the store.',
      morningTutorial2: 'Check which items are running low or out of stock so you can restock today.',
      morningTutorial3: 'Review outstanding customer debts to see who still needs to pay.',
      morningTutorial4: 'Yesterday\'s earnings summary helps you track daily performance.',
      morningTutorial5: 'Tap "Start the Day" when you\'re ready to open your store and start selling!',
      // Day Tutorial
      dayTutorial1: 'This is Day Mode — record sales as they happen throughout your business day.',
      dayTutorial2: 'Your cash earnings update in real-time as you record sales.',
      dayTutorial3: 'Track how many items you\'ve sold today with the sold counter.',
      dayTutorial4: 'Utang (credit) sales are tracked separately so you know what\'s still owed.',
      dayTutorial5: 'All today\'s transactions appear here with time, product, and amount details.',
      dayTutorial6: 'When your store day is done, tap "Close Store" to view the closing summary.',
      // Closing Tutorial
      closingTutorial1: 'This is the Closing screen — finalize your day with a complete summary.',
      closingTutorial2: 'Enter the actual cash you counted at the end of the day (actual sales).',
      closingTutorial3: 'Enter the actual total sales counted at the end of the day (actual sales).',
      closingTutorial4: 'Your profit is calculated from each item - selling price minus cost price.',
      closingTutorial5: 'All items sold today are listed here with quantities and amounts.',
      closingTutorial6: 'Items running low are shown here so you know what to restock tomorrow.',
      closingTutorial7: 'Outstanding debts are listed here — follow up with customers who still owe.',
      closingTutorial8: 'Tap "Day Complete" to finalize. Your daily data will be saved to history.',
      // Inventory Tutorial
      inventoryTutorial1: 'This is the Inventory page — manage all your stock items in one place.',
      inventoryTutorial2: 'Use the search bar to quickly find any product by name.',
      inventoryTutorial3: 'Tap "Add Stock" to add new products or restock existing ones.',
      inventoryTutorial4: 'All your inventory is listed with stock quantity, profit margin, and sell buttons.',
      inventoryTutorial5: 'Each item shows stock level and color-coded status. Tap the edit button to modify.',
      // Debts Tutorial
      debtsTutorial1: 'This is the Debts page — track all customer debts and record payments.',
      debtsTutorial2: 'The total outstanding debt across all customers is shown here.',
      debtsTutorial3: 'Tap the settings icon to customize your app experience.',
      debtsTutorial4: 'Customer debts are listed with name, last activity, and balance.',
      debtsTutorial5: 'Tap "Pay" on any customer to record a payment and reduce their balance.',
      // Settings Tutorial
      settingTutorial1: 'This is the Settings page — customize your app experience.',
      settingTutorial2: 'Choose between English and Filipino for the app language.',
      settingTutorial3: 'Adjust text size to Standard, Large, or Extra Large for better readability.',
      settingTutorial4: 'Enter your store name to personalize your app header.',
      settingTutorial5: 'Enter your owner name for a personalized greeting each day.',
      // Add Product Tutorial
      addProductTutorial1: 'This page lets you add a new product to your inventory.',
      addProductTutorial2: 'Enter the item name, quantity, cost price, and selling price.',
      addProductTutorial3: 'Set the markup percentage. The markup helper automatically suggests the right selling price.',
      addProductTutorial4: 'Enter the selling price or accept the suggested price from the markup helper.',
      addProductTutorial5: 'Tap "Save" to add the product to your inventory. You can edit it later from the Stock page.',
      // Tutorial Labels
      tutMain: 'Main Tutorial',
      tutMorning: 'Morning Check Tutorial',
      tutDay: 'Day Mode Tutorial',
      tutClosing: 'Closing Tutorial',
      tutInventory: 'Stock Tutorial',
      tutDebts: 'Debts Tutorial',
      tutSetting: 'Settings Tutorial',
      tutAddProduct: 'Add Product Tutorial',
      tutSelector: 'Select a tutorial...',
      tutLaunch: 'Launch',
      tutSection: 'Tutorials',
      // Nav
      navMorning: 'Morning',
      navSale: 'Sell',
      navClose: 'Close',
      // Day mode
      dayEarningsLabel: 'Recorded Sales Today',
      dayItemsSoldLabel: 'Sold',
      dayUtangLabel: 'Debt Today',
      dayTransactionsLabel: "Today's Transactions",
      // Closing
      closingTitle: 'Close Store \ud83c\udf19',
      closingSubtitle: 'Finish this day',
      closingSectionSales: 'Sales',
      closingSectionSold: 'Sold Items',
      closingSectionLowStock: 'Low Stock',
      closingSectionDebts: 'Unpaid Debts',
      closingSectionWeekly: 'This Week',
      closingWeeklyLabel: 'Total Sales',
      closingTopSellerLabel: 'Best Seller',
      completeDayBtn: 'Day Complete \u2713',
      backToDayBtn: 'Back to Day',
      dayCompleteTitle: 'Day Complete!',
      prepareTomorrow: 'Prepare for Tomorrow',
      // Sale sheet
      saleSheetTitle: 'Someone Bought',
      saleQtyLabel: 'How many?',
      saleCustomerLabel: 'Who? (if credit)',
      saleTotalLabel: 'Total:',
      // Settings
      settingsTitle: 'Settings',
      dataMgmt: 'Data Management',
      resetDataBtn: 'Reset Data',
      exportDataBtn: 'Export Data',
      // Stock
      stockTitle: 'Stock',
      searchPlaceholder: 'Search product...',
      addStockBtn: 'Add Stock',
      // Restock
      tutRestock: 'Restock Day Tutorial',
      restockTutorial1: 'This is the Restock Day page - a guided 2-step workflow to update inventory.',
      restockTutorial2: 'Step 1: Check your shelves. Update the actual count for each product.',
      restockTutorial3: 'Enter the real count you see on your shelf next to what the app thinks.',
      restockTutorial4: 'Green check = count matches. Red = unrecorded sales were found.',
      restockTutorial5: 'After checking, tap Continue to Purchases to record what you bought.',
      restockTutorial6: 'Step 2: Search for a product, enter cost per unit and quantity, tap Add Item.',
      restockTutorial7: 'Review your purchases. Total cost is shown at the bottom.',
      restockTutorial8: 'Tap Done to save. Your inventory is updated. Find the reminder on Morning page.',
      // Debts
      debtsTitle: 'Debts',
      debtsTotalLabel: 'Total Debt',
      newDebtBtn: 'New Debt',
      stocksLink: 'Stock',
      debtsLink: 'Debts',
      // Add product
      addProductTitle: 'Add Stock',
      editProductTitle: 'Edit Stock',
      productNameLabel: 'Product Name',
      productQtyLabel: 'Quantity',
      costLabel: 'Cost Price (\u20b1)',
      priceLabel: 'Selling Price (\u20b1)',
      markupLabel: 'Markup (%)',
      saveBtn: 'Save'
    },
    fil: {
      greeting: 'Magandang araw!',
      morningGreeting: 'Magandang umaga!',
      morningSubtitle: 'Handa na ba ang tindahan ngayong araw?',
      stockOk: 'Lahat ng stock okay',
      stockOkDesc: 'Walang item na kulang',
      stockWarn: '{n} item(s) ang kailangan ng pansin',
      stockWarnDesc: 'Mga item na nauubos na o wala na',
      debtTotal: 'Utang: {amount}',
      debtTotalDesc: '{n} kostumer(s)',
      yesterday: 'Kahapon: {amount}',
      yesterdayDesc: 'Benta kahapon',
      startDay: 'Simulan ang Araw',
      closeDay: 'Isara ang Tindahan \ud83c\udf19',
      dayModeLabel: 'Araw na ito',
      payTitle: 'Magbayad',
      earnings: 'Kita',
      itemsSold: 'Naibenta',
      utangToday: 'Utang Ngayon',
      noTransactions: 'Wala pang transaksyon.',
      closingExpenses: 'Gastos sa Paninda',
      closingRecordedSales: 'Naitalang Benta Ngayon',
      closingActualSales: 'Aktwal na Benta Ngayon',
      closingSalesDiff: 'Pagkakaiba sa Benta',
      closingProfitLabel: 'Kita',
      noSales: 'Walang naitalang benta.',
      allStockOk: 'Lahat ng stock ay okay.',
      noDebts: 'Walang utang na natitira.',
      dayCompleteSub: 'Magpahinga na, {name}. Bukas ulit!',
      mayBumili: 'May Bumili',
      productLabel: 'Ano ang binili?',
      productPlaceholder: 'Maghanap ng produkto...',
      qtyLabel: 'Ilan?',
      customerLabel: 'Sino? (kung utang)',
      customerPlaceholder: 'Pangalan ng kostumer (opsyonal)',
      totalLabel: 'Total:',
      cancel: 'Kanselahin',
      save: 'I-save',
      stockHint: 'Available: {qty}',
      noStock: 'Walang stock',
      payLabel: 'Magkano ang ibabayad?',
      payPreview: 'Matitira pagkatapos:',
      payBtn: 'Bayad Na',
      payBalance: 'Balanse: {amount}',
      addStock: 'Magdagdag ng Stock',
      searchProduct: 'Maghanap ng produkto...',
      totalDebtLabel: 'Kabuuang Utang',
      payBtnLabel: 'Bayad',
      settingsLanguage: 'Wika',
      settingsStore: 'Pangalan ng Tindahan',
      settingsOwner: 'Pangalan ng May-ari',
      resetData: 'I-reset ang Data',
      exportData: 'I-export ang Data',
      setupBtn: 'Magsimula na!',
      productName: 'Pangalan ng Produkto',
      productQty: 'Dami',
      productCost: 'Presyo ng Stock',
      productPrice: 'Presyo ng Benta',
      productMarkup: 'Markup (%)',
      markupHint: 'Sa {pct}% markup, ibenta sa {price}',
      newDebtCustomer: 'Pangalan ng Kostumer',
      newDebtAmount: 'Halaga ng Utang',
      saved: 'Na-save!',
      saleSaved: 'Naitala ang benta!',
      debtSaved: 'Naitala ang utang!',
      paymentSaved: 'Naitala ang bayad!',
      productSaved: 'Na-save ang produkto!',
      dataReset: 'Na-reset ang data.',
      noProducts: 'Wala pang produkto.',
      noDebtItems: 'Wala pang utang.',
      confirmReset: 'I-reset ang lahat ng data? Hindi ito maaaring i-undo.',
      dayAlreadyOpen: 'Bukas na ang araw!',
      dayNotOpen: 'Hindi pa bukas ang araw!',
      profitLabel: 'Kita',
      // Tutorial
      next: 'Susunod',
      skip: 'Laktawan',
      suggestedPrice: 'Mungkahi',
      textSize: 'Laki ng Teksto',
      standard: 'Karaniwan',
      large: 'Malaki',
      extraLarge: 'Pinakamalaki',
      // Main Tutorial (multi-page walkthrough)
      mainTutorial1: 'Maligayang pagdating sa Sari-Sari Smart! Ang tour na ito ay gagabay sa iyo sa pang-araw-araw na gawain ng iyong tindahan.',
      mainTutorial2: 'Ang Stock card ay nagpapakita ng mga item na nauubos o wala na. I-tap ang Stock sa nav para tingnan ang iyong inventory.',
      mainTutorial3: 'Ang Debt card ay nagpapakita ng utang ng mga kostumer. I-tap ang Debts para makita at subaybayan ang mga bayad.',
      mainTutorial4: 'Kapag handa na, i-tap ang "Simulan ang Araw" para buksan ang tindahan at magsimulang magtala ng benta.',
      mainTutorial5: 'Maligayang pagdating sa Day Mode! Dito mo itinatala ang mga benta habang nangyayari ang mga ito.',
      mainTutorial6: 'Ang Today summary ay nagpapakita ng iyong kita, naibenta, at utang sa isang sulyap.',
      mainTutorial7: 'I-tap ang Sell button para buksan ang sale sheet. Pumili ng produkto, ilagay ang dami, at i-save ang benta.',
      mainTutorial8: 'Sa pagtatapos ng araw, ang Closing screen ay nagpapakita ng buong summary ng performance ngayong araw.',
      mainTutorial9: 'Ilagay ang aktwal na pera. Awtomatikong kukuwentahin ang kita mula sa bawat item.',
      mainTutorial10: 'I-tap ang "Tapos Na ang Araw" para tapusin. Ang iyong daily summary ay mase-save sa history.',
      mainTutorial11: 'Ang Inventory page ay nagbibigay-daan sa iyo na maghanap, magdagdag, at mamahala ng stock.',
      mainTutorial12: 'I-tap ang "Magdagdag ng Stock" para magdagdag ng bagong produkto o mag-restock.',
      mainTutorial13: 'Ang Debts page ay sumusubaybay sa lahat ng utang ng kostumer. Ang kabuuang halaga ay nasa itaas.',
      mainTutorial14: 'Pumunta sa Settings anumang oras para baguhin ang wika, laki ng teksto, o pangalan ng tindahan.',
      // Morning Tutorial
      morningTutorial1: 'Ito ang Morning Check — ang iyong pang-araw-araw na pagsusuri bago buksan ang tindahan.',
      morningTutorial2: 'Tingnan kung aling mga item ang nauubos o wala na para mag-restock ngayong araw.',
      morningTutorial3: 'Suriin ang mga natitirang utang ng kostumer upang makita kung sino ang may puwedeng magbayad.',
      morningTutorial4: 'Ang summary ng kita kahapon ay tumutulong sa iyo na subaybayan ang performance.',
      morningTutorial5: 'I-tap ang "Simulan ang Araw" kapag handa ka nang buksan ang tindahan at magsimula!',
      // Day Tutorial
      dayTutorial1: 'Ito ang Day Mode — itala ang mga benta habang nangyayari ang mga ito sa buong araw.',
      dayTutorial2: 'Ang iyong cash earnings ay nag-a-update sa real-time habang nagtatala ka ng benta.',
      dayTutorial3: 'Subaybayan kung ilang items ang naibenta ngayong araw gamit ang sold counter.',
      dayTutorial4: 'Ang utang (credit) sales ay hiwalay na sinusubaybayan para malaman mo kung ano ang hindi pa bayad.',
      dayTutorial5: 'Lahat ng transaksyon ngayong araw ay lilitaw dito kasama ang oras, produkto, at halaga.',
      dayTutorial6: 'Kapag tapos na ang araw ng tindahan, i-tap ang "Isara ang Tindahan" para makita ang closing summary.',
      // Closing Tutorial
      closingTutorial1: 'Ito ang Closing screen — tapusin ang iyong araw na may kumpletong summary.',
      closingTutorial2: 'Ilagay ang aktwal na perang nabilang mo sa pagtatapos ng araw (aktwal na benta).',
      closingTutorial3: 'Ilagay ang aktwal na kabuuang benta na nabilang mo sa pagtatapos ng araw.',
      closingTutorial4: 'Ang kita ay kinakwenta mula sa bawat item - presyo ng benta minus presyo ng stock.',
      closingTutorial5: 'Lahat ng items na naibenta ngayong araw ay nakalista dito kasama ang dami at halaga.',
      closingTutorial6: 'Ang mga item na nauubos ay ipinapakita dito para malaman mo ang kailangan i-restock bukas.',
      closingTutorial7: 'Ang mga natitirang utang ay nakalista dito — kausapin ang mga kostumer na may utang pa.',
      closingTutorial8: 'I-tap ang "Tapos Na ang Araw" para tapusin. Ang iyong daily data ay mase-save sa history.',
      // Inventory Tutorial
      inventoryTutorial1: 'Ito ang Inventory page — pamahalaan ang lahat ng iyong stock item sa isang lugar.',
      inventoryTutorial2: 'Gamitin ang search bar para mabilis na makahanap ng produkto sa pangalan.',
      inventoryTutorial3: 'I-tap ang "Magdagdag ng Stock" para magdagdag ng bagong produkto o mag-restock.',
      inventoryTutorial4: 'Ang lahat ng iyong inventory ay nakalista na may stock quantity at profit margin.',
      inventoryTutorial5: 'Ang bawat item ay nagpapakita ng stock level at color-coded status. I-tap ang edit button para baguhin.',
      // Debts Tutorial
      debtsTutorial1: 'Ito ang Debts page — subaybayan ang lahat ng utang ng kostumer at magtala ng bayad.',
      debtsTutorial2: 'Ang kabuuang natitirang utang ng lahat ng kostumer ay ipinapakita dito.',
      debtsTutorial3: 'I-tap ang settings icon para i-customize ang iyong app experience.',
      debtsTutorial4: 'Ang mga utang ng kostumer ay nakalista na may pangalan, huling aktibidad, at balanse.',
      debtsTutorial5: 'I-tap ang "Bayad" sa sinumang kostumer para magtala ng bayad at bawasan ang kanilang balanse.',
      // Settings Tutorial
      settingTutorial1: 'Ito ang Settings page — i-customize ang iyong app experience.',
      settingTutorial2: 'Pumili sa pagitan ng English at Filipino para sa wika ng app.',
      settingTutorial3: 'Ayusin ang laki ng teksto sa Standard, Large, o Extra Large para sa mas magandang readability.',
      settingTutorial4: 'Ilagay ang pangalan ng iyong tindahan para i-personalize ang app header.',
      settingTutorial5: 'Ilagay ang pangalan ng may-ari para sa personalized na pagbati araw-araw.',
      // Add Product Tutorial
      addProductTutorial1: 'Ang page na ito ay para magdagdag ng bagong produkto sa iyong inventory.',
      addProductTutorial2: 'Ilagay ang pangalan ng item, dami, presyo ng stock, at presyo ng benta.',
      addProductTutorial3: 'Itakda ang markup percentage. Ang markup helper ay awtomatikong nagmumungkahi ng tamang selling price.',
      addProductTutorial4: 'Ilagay ang presyo ng benta o tanggapin ang mungkahi mula sa markup helper.',
      addProductTutorial5: 'I-tap "Save" para idagdag ang produkto sa iyong inventory. Maaari mo itong i-edit mamaya mula sa Stock page.',
      // Tutorial Labels
      tutMain: 'Main na Tutorial',
      tutMorning: 'Morning Check na Tutorial',
      tutDay: 'Day Mode na Tutorial',
      tutClosing: 'Closing na Tutorial',
      tutInventory: 'Stock na Tutorial',
      tutDebts: 'Debts na Tutorial',
      tutSetting: 'Settings na Tutorial',
      tutAddProduct: 'Add Product na Tutorial',
      tutSelector: 'Pumili ng tutorial...',
      tutLaunch: 'Simulan',
      tutSection: 'Mga Tutorial',
      // Nav
      navMorning: 'Umaga',
      navSale: 'Benta',
      navClose: 'Isara',
      // Day mode
      dayEarningsLabel: 'Naitalang Benta Ngayon',
      dayItemsSoldLabel: 'Naibenta',
      dayUtangLabel: 'Utang Ngayon',
      dayTransactionsLabel: 'Mga Transaksyon Ngayon',
      // Closing
      closingTitle: 'Isara ang Tindahan \ud83c\udf19',
      closingSubtitle: 'Tapusin na ang araw na ito',
      closingSectionSales: 'Benta',
      closingSectionSold: 'Mga Nabenta',
      closingSectionLowStock: 'Mga Kulang sa Stock',
      closingSectionDebts: 'Utang Hindi Pa Bayad',
      closingSectionWeekly: 'Ngayong Linggo',
      closingWeeklyLabel: 'Kabuuang benta',
      closingTopSellerLabel: 'Pinakamabenta',
      completeDayBtn: 'Tapos Na ang Araw \u2713',
      backToDayBtn: 'Bumalik sa Araw',
      dayCompleteTitle: 'Tapos Na ang Araw!',
      prepareTomorrow: 'Maghanda para Bukas',
      // Sale sheet
      saleSheetTitle: 'May Bumili',
      saleQtyLabel: 'Ilan?',
      saleCustomerLabel: 'Sino? (kung utang)',
      saleTotalLabel: 'Total:',
      // Settings
      settingsTitle: 'Settings',
      dataMgmt: 'Data Management',
      resetDataBtn: 'I-reset ang Data',
      exportDataBtn: 'I-export ang Data',
      // Stock
      stockTitle: 'Stock',
      searchPlaceholder: 'Maghanap ng produkto...',
      addStockBtn: 'Magdagdag ng Stock',
      // Debts
      debtsTitle: 'Utang',
      debtsTotalLabel: 'Kabuuang Utang',
      newDebtBtn: 'Bagong Utang',
      stocksLink: 'Stock',
      debtsLink: 'Utang',
      // Add product
      addProductTitle: 'Magdagdag ng Stock',
      editProductTitle: 'Edit Stock',
      productNameLabel: 'Pangalan ng Produkto',
      productQtyLabel: 'Dami',
      costLabel: 'Presyo ng Stock (\u20b1)',
      priceLabel: 'Presyo ng Benta (\u20b1)',
      markupLabel: 'Markup (%)',
      saveBtn: 'I-save'
    }
  };

  function t(key, replacements) {
    var lang = state.settings.language || 'fil';
    var str = (strings[lang] && strings[lang][key]) || (strings.en && strings.en[key]) || key;
    if (replacements) {
      for (var k in replacements) {
        if (replacements.hasOwnProperty(k)) {
          str = str.replace('{' + k + '}', replacements[k]);
        }
      }
    }
    return str;
  }

  // ============================================
  // UTILITY
  // ============================================
  function genId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  function formatDate(d) {
    if (!d) d = new Date();
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  function formatCurrency(amount) {
    return '\u20b1' + Number(amount || 0).toFixed(2);
  }

  function getStockStatus(product) {
    if (!product || product.quantity <= 0) return 'out';
    if (product.quantity <= (state.settings.lowStockThreshold || 5)) return 'low';
    return 'plenty';
  }

  function getTodaySales() {
    return state.sales.filter(function(s) {
      return s.date === todayStr();
    });
  }

  function getTodayEarnings() {
    return getTodaySales().reduce(function(sum, s) {
      return sum + (s.customerName ? 0 : s.amount);
    }, 0);
  }

  function getTodayItemsSold() {
    return getTodaySales().reduce(function(sum, s) {
      return sum + (s.quantity || 1);
    }, 0);
  }

  function getTodayUtang() {
    return getTodaySales().filter(function(s) {
      return s.customerName;
    }).reduce(function(sum, s) {
      return sum + s.amount;
    }, 0);
  }

  function getLowStockItems() {
    return state.products.filter(function(p) {
      return getStockStatus(p) === 'low' || getStockStatus(p) === 'out';
    });
  }

  function getTotalDebt() {
    return state.debts.reduce(function(sum, d) {
      return sum + (d.remainingBalance || 0);
    }, 0);
  }

  function getYesterdayEarnings() {
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var yStr = yesterday.getFullYear() + '-' +
      String(yesterday.getMonth() + 1).padStart(2, '0') + '-' +
      String(yesterday.getDate()).padStart(2, '0');
    var entry = state.history.find(function(h) { return h.date === yStr; });
    return entry ? entry.earnings : null;
  }

  function getTodayProfit() {
    return getTodaySales().reduce(function(sum, s) {
      return sum + (s.profit || 0);
    }, 0);
  }

  function getDaysSinceLastRestock() {
    try {
      var d = localStorage.getItem('sss_v3_lastRestockDate');
      if (!d) return -1;
      var then = new Date(JSON.parse(d));
      var now = new Date();
      var diff = Math.floor((now - then) / (1000 * 60 * 60 * 24));
      return diff;
    } catch(e) { return -1; }
  }

  function calcMarkupSuggestion(cost, markup) {
    if (!cost || cost <= 0) return null;
    markup = markup || 20;
    return cost * (1 + markup / 100);
  }

  function getWeeklySales() {
    var total = 0;
    var productCounts = {};
    var oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    var cutoff = oneWeekAgo.toISOString().substring(0, 10);
    state.sales.forEach(function(s) {
      if (s.date >= cutoff) {
        total += s.amount;
        var name = s.productName || 'Unknown';
        productCounts[name] = (productCounts[name] || 0) + (s.quantity || 1);
      }
    });
    var topSeller = '';
    var topCount = 0;
    for (var name in productCounts) {
      if (productCounts[name] > topCount) {
        topCount = productCounts[name];
        topSeller = name;
      }
    }
    return { total: total, topSeller: topSeller };
  }

  // ============================================
  // LOCALIZATION - Apply translations to all data-i18n elements
  // ============================================
  function applyTranslations() {
    // Translate elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = t(key);
      }
    });
    // Translate elements with data-i18n-placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (key) {
        el.placeholder = t(key);
      }
    });
    // Also update dynamically rendered text
    updateHeader();
  }

  // ============================================
  // TEXT SIZE
  // ============================================
  function applyTextSize() {
    var app = document.getElementById('app');
    if (!app) return;
    app.classList.remove('text-size-large', 'text-size-extra-large');
    if (state.settings.textSize === 'large') app.classList.add('text-size-large');
    else if (state.settings.textSize === 'extra-large') app.classList.add('text-size-extra-large');

    // Update text size buttons in settings if present
    document.querySelectorAll('.text-size-btn').forEach(function(btn) {
      btn.classList.toggle('active', btn.getAttribute('data-size') === state.settings.textSize);
    });
  }

  function setTextSize(size) {
    state.settings.textSize = size;
    saveState();
    applyTextSize();
    showToast(t('saved'));
  }

  // ============================================
  // TUTORIAL SYSTEM
  // ============================================
  var tutorials = {
    main: {
      label: 'tutMain',
      steps: [
        { textKey: 'mainTutorial1', highlight: null, page: 'morning' },
        { textKey: 'mainTutorial2', highlight: '#morningStockTitle', page: 'morning' },
        { textKey: 'mainTutorial3', highlight: '#morningDebtTitle', page: 'morning' },
        { textKey: 'mainTutorial4', highlight: '#btnStartDay', page: 'morning' },
        { textKey: 'mainTutorial5', highlight: null, page: 'day' },
        { textKey: 'mainTutorial6', highlight: '#daySummary', page: 'day' },
        { textKey: 'mainTutorial7', highlight: '#navSale', page: 'day' },
        { textKey: 'mainTutorial8', highlight: null, page: 'closing' },
        { textKey: 'mainTutorial9', highlight: '#closingActualSales', page: 'closing' },
        { textKey: 'mainTutorial10', highlight: '#btnCompleteDay', page: 'closing' },
        { textKey: 'mainTutorial11', highlight: '#manageStockSearch', page: 'inventory' },
        { textKey: 'mainTutorial12', highlight: 'a[href="add_product.html"].btn-primary', page: 'inventory' },
        { textKey: 'mainTutorial13', highlight: '#manageTotalDebt', page: 'debts' },
        { textKey: 'mainTutorial14', highlight: '#settingsLanguage', page: 'setting' }
      ]
    },
    morning: {
      label: 'tutMorning',
      page: 'morning',
      steps: [
        { textKey: 'morningTutorial1', highlight: null },
        { textKey: 'morningTutorial2', highlight: '#morningStockTitle' },
        { textKey: 'morningTutorial3', highlight: '#morningDebtTitle' },
        { textKey: 'morningTutorial4', highlight: '#morningYesterdayTitle' },
        { textKey: 'morningTutorial5', highlight: '#btnStartDay' }
      ]
    },
    day: {
      label: 'tutDay',
      page: 'day',
      steps: [
        { textKey: 'dayTutorial1', highlight: null },
        { textKey: 'dayTutorial2', highlight: '#dayEarnings' },
        { textKey: 'dayTutorial3', highlight: '#dayItemsSold' },
        { textKey: 'dayTutorial4', highlight: '#dayUtang' },
        { textKey: 'dayTutorial5', highlight: '#dayTransactionList' },
        { textKey: 'dayTutorial6', highlight: '#btnCloseDay' }
      ]
    },
    closing: {
      label: 'tutClosing',
      page: 'closing',
      steps: [
        { textKey: 'closingTutorial1', highlight: null },
        { textKey: 'closingTutorial2', highlight: '#closingActualSales' },
        { textKey: 'closingTutorial3', highlight: '#closingActualSales' },
        { textKey: 'closingTutorial4', highlight: '#closingTotalToday' },
        { textKey: 'closingTutorial5', highlight: '#closingSoldItems' },
        { textKey: 'closingTutorial6', highlight: '#closingLowStock' },
        { textKey: 'closingTutorial7', highlight: '#closingDebts' },
        { textKey: 'closingTutorial8', highlight: '#btnCompleteDay' }
      ]
    },
    inventory: {
      label: 'tutInventory',
      page: 'inventory',
      steps: [
        { textKey: 'inventoryTutorial1', highlight: null },
        { textKey: 'inventoryTutorial2', highlight: '#manageStockSearch' },
        { textKey: 'inventoryTutorial3', highlight: 'a[href="add_product.html"].btn-primary' },
        { textKey: 'inventoryTutorial4', highlight: '#manageInventoryList' },
        { textKey: 'inventoryTutorial5', highlight: '.inv-manage-item:first-child' }
      ]
    },
    debts: {
      label: 'tutDebts',
      page: 'debts',
      steps: [
        { textKey: 'debtsTutorial1', highlight: null },
        { textKey: 'debtsTutorial2', highlight: '#manageTotalDebt' },
        { textKey: 'debtsTutorial3', highlight: 'a[href="setting.html"]' },
        { textKey: 'debtsTutorial4', highlight: '#manageDebtsList' },
        { textKey: 'debtsTutorial5', highlight: '.debt-manage-item:first-child .debt-manage-pay-btn' }
      ]
    },
    setting: {
      label: 'tutSetting',
      page: 'setting',
      steps: [
        { textKey: 'settingTutorial1', highlight: null },
        { textKey: 'settingTutorial2', highlight: '#settingsLanguage' },
        { textKey: 'settingTutorial3', highlight: '.text-size-options' },
        { textKey: 'settingTutorial4', highlight: '#settingsStoreName' },
        { textKey: 'settingTutorial5', highlight: '#settingsOwnerName' }
      ]
    },
    add_product: {
      label: 'tutAddProduct',
      page: 'add_product',
      steps: [
        { textKey: 'addProductTutorial1', highlight: null },
        { textKey: 'addProductTutorial2', highlight: '#productName' },
        { textKey: 'addProductTutorial3', highlight: '#productCost' },
        { textKey: 'addProductTutorial4', highlight: '#productPrice' },
        { textKey: 'addProductTutorial5', highlight: '.btn-primary.btn-full' }
      ]
    },
    restock: {
      label: 'tutRestock',
      page: 'restock',
      steps: [
        { textKey: 'restockTutorial1', highlight: null },
        { textKey: 'restockTutorial2', highlight: '#restockStep1' },
        { textKey: 'restockTutorial3', highlight: '#restockSearch' },
        { textKey: 'restockTutorial4', highlight: '#restockProductList' },
        { textKey: 'restockTutorial5', highlight: '#restockContinueBtn' },
        { textKey: 'restockTutorial6', highlight: '#restockPurchaseProduct' },
        { textKey: 'restockTutorial7', highlight: '#restockPurchaseList' },
        { textKey: 'restockTutorial8', highlight: '#restockDoneBtn' }
      ]
    }
  };

  var _tutorialState = { active: false, id: null, step: 0, isReplay: false };
  var _tutorialRAF = null;

  // ─── Tutorial State Persistence ───
  function saveTutorialState(tutorialId, step, isReplay) {
    try {
      localStorage.setItem('sss_v3_tutorial', JSON.stringify({
        id: tutorialId || 'main', step: step, isReplay: isReplay
      }));
    } catch(e) {}
  }

  function loadTutorialState() {
    try {
      var data = localStorage.getItem('sss_v3_tutorial');
      return data ? JSON.parse(data) : null;
    } catch(e) { return null; }
  }

  function clearTutorialState() {
    try { localStorage.removeItem('sss_v3_tutorial'); } catch(e) {}
  }

  // ─── Highlight Tracking ───
  function stopHighlightTracking() {
    if (_tutorialRAF) {
      cancelAnimationFrame(_tutorialRAF);
      _tutorialRAF = null;
    }
  }

  function startHighlightTracking() {
    stopHighlightTracking();

    function track() {
      if (!dom.tutorialOverlay || !dom.tutorialOverlay.classList.contains('active')) {
        stopHighlightTracking();
        return;
      }
      if (!dom.tutorialHighlight || dom.tutorialHighlight.style.display === 'none') {
        _tutorialRAF = requestAnimationFrame(track);
        return;
      }

      var tutorialId = _tutorialState.id || 'main';
      var steps = (tutorials[tutorialId] && tutorials[tutorialId].steps) || [];
      var step = steps[_tutorialState.step];
      if (!step || !step.highlight) {
        _tutorialRAF = requestAnimationFrame(track);
        return;
      }

      var target = document.querySelector(step.highlight);
      if (target) {
        var rect = target.getBoundingClientRect();
        dom.tutorialHighlight.style.left = (rect.left - 4) + 'px';
        dom.tutorialHighlight.style.top = (rect.top - 4) + 'px';
        dom.tutorialHighlight.style.width = (rect.width + 8) + 'px';
        dom.tutorialHighlight.style.height = (rect.height + 8) + 'px';
      }

      _tutorialRAF = requestAnimationFrame(track);
    }

    _tutorialRAF = requestAnimationFrame(track);
  }

  // ─── Tutorial Box Alignment ───
  function getTutorialBoxAlignment(highlightSelector) {
    if (!highlightSelector) return 'center';
    var target = document.querySelector(highlightSelector);
    if (!target) return 'center';
    var rect = target.getBoundingClientRect();
    var viewportH = window.innerHeight;
    var targetCenter = rect.top + rect.height / 2;
    if (targetCenter < viewportH * 0.4) return 'flex-end';
    return 'flex-start';
  }

  // ─── Start Tutorial ───
  function startTutorial(tutorialId, isReplay) {
    if (!dom.tutorialOverlay) return;
    if (!tutorials[tutorialId]) return;
    _tutorialState.active = true;
    _tutorialState.id = tutorialId;
    _tutorialState.isReplay = isReplay || false;
    _tutorialState.step = 0;

    clearTutorialState();
    dom.tutorialOverlay.style.display = 'flex';
    dom.tutorialOverlay.classList.add('active');
    if (dom.tutorialSkip) dom.tutorialSkip.style.display = isReplay ? 'block' : 'none';

    renderTutorialStep();
  }

  // ─── Resume Tutorial (after page navigation) ───
  function resumeTutorial(savedState) {
    if (!dom.tutorialOverlay || !savedState) return false;
    _tutorialState.active = true;
    _tutorialState.id = savedState.id || 'main';
    _tutorialState.isReplay = savedState.isReplay || false;
    _tutorialState.step = savedState.step || 0;

    dom.tutorialOverlay.style.display = 'flex';
    dom.tutorialOverlay.classList.add('active');
    if (dom.tutorialSkip) dom.tutorialSkip.style.display = _tutorialState.isReplay ? 'block' : 'none';

    renderTutorialStep();
    return true;
  }

  // ─── Render Tutorial Step ───
  function renderTutorialStep() {
    if (!dom.tutorialOverlay) return;
    var tutorialId = _tutorialState.id || 'main';
    var steps = (tutorials[tutorialId] && tutorials[tutorialId].steps) || [];
    var stepIndex = _tutorialState.step || 0;
    var step = steps[stepIndex];
    if (!step) { endTutorial(); return; }

    if (dom.tutorialText) dom.tutorialText.textContent = t(step.textKey);
    if (dom.tutorialCurrent) dom.tutorialCurrent.textContent = stepIndex + 1;
    if (dom.tutorialTotal) dom.tutorialTotal.textContent = steps.length;

    if (dom.tutorialHighlight) {
      if (step.highlight) {
        var target = document.querySelector(step.highlight);
        if (target) {
          // Scroll the content so the highlighted element is visible
          var scrollContainer = document.getElementById('appContent');
          if (scrollContainer) {
            var containerRect = scrollContainer.getBoundingClientRect();
            var targetRect = target.getBoundingClientRect();
            var buffer = 60; // leave room for the tutorial box
            if (targetRect.bottom > containerRect.bottom - buffer) {
              scrollContainer.scrollTop += targetRect.bottom - containerRect.bottom + buffer;
            } else if (targetRect.top < containerRect.top + 30) {
              scrollContainer.scrollTop -= containerRect.top - targetRect.top + 30;
            }
          }
          var rect = target.getBoundingClientRect();
          dom.tutorialHighlight.style.position = 'fixed';
          dom.tutorialHighlight.style.zIndex = '151';
          dom.tutorialHighlight.style.display = 'block';
          dom.tutorialHighlight.style.left = (rect.left - 4) + 'px';
          dom.tutorialHighlight.style.top = (rect.top - 4) + 'px';
          dom.tutorialHighlight.style.width = (rect.width + 8) + 'px';
          dom.tutorialHighlight.style.height = (rect.height + 8) + 'px';
          startHighlightTracking();
        } else {
          dom.tutorialHighlight.style.display = 'none';
          stopHighlightTracking();
        }
      } else {
        dom.tutorialHighlight.style.display = 'none';
        stopHighlightTracking();
      }
    }

    if (dom.tutorialBox) {
      dom.tutorialBox.style.alignSelf = getTutorialBoxAlignment(step.highlight);
    }
  }

  // ─── Advance / Next Step ───
  function advanceTutorial() {
    if (!dom.tutorialOverlay) return;
    var tutorialId = _tutorialState.id || 'main';
    var steps = (tutorials[tutorialId] && tutorials[tutorialId].steps) || [];
    var nextStep = (_tutorialState.step || 0) + 1;
    if (nextStep >= steps.length) {
      endTutorial();
      return;
    }
    var nextStepData = steps[nextStep];
    var currentPage = pageName;

    if (nextStepData.page && nextStepData.page !== currentPage) {
      saveTutorialState(tutorialId, nextStep, _tutorialState.isReplay);
      window.location.href = nextStepData.page + '.html?tutorial=true';
    } else {
      _tutorialState.step = nextStep;
      renderTutorialStep();
    }
  }

  // ─── End Tutorial ───
  function endTutorial() {
    stopHighlightTracking();
    if (!dom.tutorialOverlay) return;
    _tutorialState.active = false;
    dom.tutorialOverlay.style.display = 'none';
    dom.tutorialOverlay.classList.remove('active');
    if (dom.tutorialHighlight) dom.tutorialHighlight.style.display = 'none';
    clearTutorialState();
    // Tutorial auto-starts on every launch (see init morning handler)
    _tutorialState.id = null;
    _tutorialState.step = 0;
  }

  // ─── Launch Tutorial from Selector ───
  function launchTutorial() {
    var select = document.getElementById('tutorialSelector');
    if (!select) return;
    var tutorialId = select.value;
    if (!tutorialId) {
      return;
    }
    var tutorial = tutorials[tutorialId];
    if (!tutorial) return;
    var firstStep = tutorial.steps[0];
    var targetPage = firstStep && firstStep.page ? firstStep.page : (tutorial.page || 'morning');
    saveTutorialState(tutorialId, 0, true);
    window.location.href = targetPage + '.html?tutorial=true';
  }

  // ─── Check Tutorial Resume (call on page init) ───
  function checkTutorialResume() {
    var params = new URLSearchParams(window.location.search);
    if (params.get('tutorial') === 'true') {
      var saved = loadTutorialState();
      if (saved && saved.id) {
        var tutorial = tutorials[saved.id];
        if (tutorial) {
          var stepData = tutorial.steps[saved.step || 0];
          if (stepData && stepData.page && stepData.page !== pageName) {
            window.location.href = stepData.page + '.html?tutorial=true';
            return true;
          }
          return resumeTutorial(saved);
        }
      }
    }
    return false;
  }

  // ============================================
  // SAMPLE DATA
  // ============================================
  function getSampleProducts() {
    return [
      { id: 'p1', name: 'Bigas 1kg', costPrice: 45, sellingPrice: 55, quantity: 20 },
      { id: 'p2', name: 'Mantika', costPrice: 22, sellingPrice: 30, quantity: 3 },
      { id: 'p3', name: 'Asin', costPrice: 10, sellingPrice: 15, quantity: 0 },
      { id: 'p4', name: 'Canned Tuna', costPrice: 18, sellingPrice: 25, quantity: 30 },
      { id: 'p5', name: 'Instant Noodles', costPrice: 10, sellingPrice: 15, quantity: 8 },
      { id: 'p6', name: 'Kape 3in1', costPrice: 5, sellingPrice: 8, quantity: 50 },
      { id: 'p7', name: 'Asukal 1kg', costPrice: 50, sellingPrice: 65, quantity: 10 },
      { id: 'p8', name: 'Gatas Powder', costPrice: 28, sellingPrice: 38, quantity: 6 },
      { id: 'p9', name: 'Sardinas', costPrice: 15, sellingPrice: 22, quantity: 25 },
      { id: 'p10', name: 'Shampoo Sachet', costPrice: 3, sellingPrice: 5, quantity: 100 },
      { id: 'p11', name: 'Sabon', costPrice: 10, sellingPrice: 16, quantity: 2 },
      { id: 'p12', name: 'Toyo', costPrice: 12, sellingPrice: 18, quantity: 15 }
    ];
  }

  // ============================================
  // PERSISTENCE
  // ============================================
  function saveState() {
    try {
      localStorage.setItem('sss_v3_settings', JSON.stringify(state.settings));
      localStorage.setItem('sss_v3_products', JSON.stringify(state.products));
      localStorage.setItem('sss_v3_sales', JSON.stringify(state.sales));
      localStorage.setItem('sss_v3_debts', JSON.stringify(state.debts));
      localStorage.setItem('sss_v3_history', JSON.stringify(state.history));
      localStorage.setItem('sss_v3_dayOpen', JSON.stringify(state.dayOpen));
      localStorage.setItem('sss_v3_dayDate', JSON.stringify(state.dayDate));
      localStorage.setItem('sss_v3_dayArchived', JSON.stringify(state.dayArchived));
      localStorage.setItem('sss_v3_todayExpenses', JSON.stringify(state.todayExpenses));
      localStorage.setItem('sss_v3_todayEarnings', JSON.stringify(state.todayEarnings));
    } catch(e) { /* ignore */ }
  }

  function loadState() {
    try {
      var s;
      s = localStorage.getItem('sss_v3_settings');
      if (s) state.settings = JSON.parse(s);
      s = localStorage.getItem('sss_v3_products');
      if (s) state.products = JSON.parse(s);
      s = localStorage.getItem('sss_v3_sales');
      if (s) state.sales = JSON.parse(s);
      s = localStorage.getItem('sss_v3_debts');
      if (s) state.debts = JSON.parse(s);
      s = localStorage.getItem('sss_v3_history');
      if (s) state.history = JSON.parse(s);
      s = localStorage.getItem('sss_v3_dayOpen');
      if (s !== null) state.dayOpen = JSON.parse(s);
      s = localStorage.getItem('sss_v3_dayDate');
      if (s !== null) state.dayDate = JSON.parse(s);
      s = localStorage.getItem('sss_v3_dayArchived');
      if (s !== null) state.dayArchived = JSON.parse(s);
      s = localStorage.getItem('sss_v3_todayExpenses');
      if (s !== null) state.todayExpenses = JSON.parse(s);
      s = localStorage.getItem('sss_v3_todayEarnings');
      if (s !== null) state.todayEarnings = JSON.parse(s);
    } catch(e) { /* use defaults */ }

    if (!state.products || state.products.length === 0) {
      state.products = getSampleProducts();
    }
  }

  // ============================================
  // TOAST
  // ============================================
  function showToast(message, type) {
    if (!dom.toastContainer) return;
    type = type || 'success';
    var toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.textContent = message;
    dom.toastContainer.appendChild(toast);
    setTimeout(function() {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 2500);
  }

  // ============================================
  // SETUP
  // ============================================
  function completeSetup() {
    var name = dom.setupStoreName ? dom.setupStoreName.value.trim() : '';
    var owner = dom.setupOwnerName ? dom.setupOwnerName.value.trim() : '';
    var lang = dom.setupLanguage ? dom.setupLanguage.value : 'fil';
    if (!name) name = 'Aking Tindahan';
    if (!owner) owner = 'May-ari';
    state.settings.storeName = name;
    state.settings.ownerName = owner;
    state.settings.language = lang;
    state.settings.hasCompletedSetup = true;
    saveState();
    if (dom.setupOverlay) dom.setupOverlay.classList.remove('open');
    updateHeader();
    showToast(t('saved'));
    // Redirect to morning page
    window.location.href = 'morning.html';
  }

  // ============================================
  // HEADER
  // ============================================
  function updateHeader() {
    if (dom.headerGreeting) {
      var name = state.settings.ownerName || '';
      dom.headerGreeting.textContent = t('greeting') + ' ' + name + ' \ud83d\udc4b';
    }
  }

  // ============================================
  // MORNING CHECK
  // ============================================
  function renderMorningCheck() {
    if (!dom.morningGreeting) return;
    var name = state.settings.ownerName || '';
    dom.morningGreeting.textContent = t('morningGreeting') + ', ' + name + ' \ud83d\udc4b';
    if (dom.morningSubtitle) dom.morningSubtitle.textContent = t('morningSubtitle');

    var lowItems = getLowStockItems();
    if (lowItems.length > 0) {
      var warnHtml = lowItems.map(function(p) {
        var status = getStockStatus(p);
        var icon = status === 'out' ? '\ud83d\udd34' : '\u26a0\ufe0f';
        var label = status === 'out' ? t('noStock') : p.quantity + ' left';
        return icon + ' ' + p.name + ' \u2014 ' + label;
      }).join('<br>');
      if (dom.morningStockTitle) dom.morningStockTitle.textContent = '\u26a0\ufe0f ' + t('stockWarn', { n: lowItems.length });
      if (dom.morningStockDesc) dom.morningStockDesc.innerHTML = warnHtml;
    } else {
      if (dom.morningStockTitle) dom.morningStockTitle.textContent = '\u2705 ' + t('stockOk');
      if (dom.morningStockDesc) dom.morningStockDesc.textContent = t('stockOkDesc');
    }

    var totalDebt = getTotalDebt();
    var debtCount = state.debts.filter(function(d) { return d.remainingBalance > 0; }).length;
    if (dom.morningDebtTitle) dom.morningDebtTitle.textContent = '\ud83d\udcb0 ' + t('debtTotal', { amount: formatCurrency(totalDebt) });
    if (dom.morningDebtDesc) dom.morningDebtDesc.textContent = t('debtTotalDesc', { n: debtCount });

    var yEarnings = getYesterdayEarnings();
    if (yEarnings !== null && dom.morningYesterdayCard) {
      dom.morningYesterdayCard.style.display = '';
      if (dom.morningYesterdayTitle) dom.morningYesterdayTitle.textContent = t('yesterday', { amount: formatCurrency(yEarnings) });
      if (dom.morningYesterdayDesc) dom.morningYesterdayDesc.textContent = t('yesterdayDesc');
    } else if (dom.morningYesterdayCard) {
      dom.morningYesterdayCard.style.display = 'none';
    }

    // Determine which button to show based on state
    if (state.dayOpen) {
      // Day is currently open → show Close Store
      if (dom.btnStartDay) {
        dom.btnStartDay.innerHTML = '<span>' + t('closeDay') + ' \ud83c\udf19</span>';
        dom.btnStartDay.onclick = showClosingScreen;
      }
    } else if (!state.dayOpen && state.dayDate === todayStr() && !state.dayArchived) {
      // Day was closed today but not archived AND has sales → show Edit Closing
      if (dom.btnStartDay) {
        dom.btnStartDay.innerHTML = '<span>\uD83D\uDCDD Edit Today\'s Closing</span>';
        dom.btnStartDay.onclick = reopenClosing;
      }
    } else {
      // Default: Start the Day
      if (dom.btnStartDay) {
        dom.btnStartDay.innerHTML = '<span>' + t('startDay') + '</span>';
        dom.btnStartDay.onclick = startDay;
      }
    }
    // Restock reminder
    var restockCard = document.getElementById('morningRestockCard');
    if (restockCard) {
      var days = getDaysSinceLastRestock();
      if (days < 0 || days === 0 || days === 1) {
        restockCard.style.display = 'none';
      } else {
        restockCard.style.display = '';
        var restockTitle = document.getElementById('morningRestockTitle');
        var restockDesc = document.getElementById('morningRestockDesc');
        if (restockTitle) restockTitle.textContent = '🚚 Restock Reminder';
        if (restockDesc) restockDesc.textContent = days + ' day(s) since restock. Tap to check inventory!';
      }
    }
    updateHeader();
  }

  // ============================================
  // START DAY
  // ============================================
  function startDay() {
    if (state.dayOpen) {
      showToast(t('dayAlreadyOpen'));
      return;
    }
    // If starting a day on a different date than the last business day, archive old sales
    if (state.dayDate && state.dayDate !== todayStr()) {
      archiveDaySales();
    }
    state.dayDate = todayStr();
    state.dayArchived = false;
    state.dayOpen = true;
    state.todayExpenses = 0;
    state.todayEarnings = 0;
    saveState();
    window.location.href = 'day.html';
  }

  function showMorningCheck() {
    window.location.href = 'morning.html';
  }

  // ============================================
  // DAY MODE
  // ============================================
  function renderDayMode() {
    if (!dom.dayDate) return;
    dom.dayDate.textContent = formatDate(new Date());

    var earnings = getTodayEarnings() + state.todayEarnings;
    var items = getTodayItemsSold();
    var utang = getTodayUtang();

    if (dom.dayEarnings) dom.dayEarnings.textContent = formatCurrency(earnings);
    if (dom.dayItemsSold) dom.dayItemsSold.textContent = items;
    if (dom.dayUtang) dom.dayUtang.textContent = formatCurrency(utang);

    if (dom.dayTransactionList) {
      var todaySales = getTodaySales();
      if (todaySales.length === 0) {
        dom.dayTransactionList.innerHTML = '<div class="empty-state">' + t('noTransactions') + '</div>';
      } else {
        dom.dayTransactionList.innerHTML = todaySales.slice().reverse().map(function(s) {
          var isDebt = !!s.customerName;
          var timeAgo = '';
          if (s.createdAt) {
            var mins = Math.floor((Date.now() - new Date(s.createdAt).getTime()) / 60000);
            if (mins < 1) timeAgo = 'ngayon lang';
            else if (mins < 60) timeAgo = mins + 'm';
            else timeAgo = Math.floor(mins / 60) + 'h';
          }
          return '<div class="transaction-item">' +
            '<div class="transaction-icon ' + (isDebt ? 'debt' : 'sale') + '">' +
              '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                (isDebt
                  ? '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/>'
                  : '<polyline points="20 6 9 17 4 12"/>') +
              '</svg>' +
            '</div>' +
            '<div class="transaction-info">' +
              '<div class="transaction-name">' + (s.productName || 'Unknown') + '</div>' +
              '<div class="transaction-meta">' + timeAgo +
                (isDebt ? ' <span class="transaction-customer">' + s.customerName + '</span>' : '') +
              '</div>' +
            '</div>' +
            '<div class="transaction-amount' + (isDebt ? ' debt-amount' : '') + '">' +
              formatCurrency(s.amount) +
            '</div>' +
          '</div>';
        }).join('');
      }
    }
  }

  // ============================================
  // TOGGLE DAY TRANSACTIONS
  // ============================================
  function toggleDayTransactions() {
    var el = document.getElementById('dayTransactions');
    if (el) el.classList.toggle('collapsed');
  }

  // ============================================
  // SALE SHEET
  // ============================================
  function openSaleSheet() {
    if (!state.dayOpen) {
      showToast(t('dayNotOpen'));
      return;
    }
    closePaymentSheet();
    state.selectedProduct = null;
    if (dom.saleProductName) dom.saleProductName.value = '';
    if (dom.saleQty) dom.saleQty.value = '1';
    if (dom.saleCustomer) dom.saleCustomer.value = '';
    if (dom.saleTotalAmount) dom.saleTotalAmount.textContent = '\u20b10.00';
    if (dom.saleStockHint) dom.saleStockHint.textContent = '';
    if (dom.productSuggestions) dom.productSuggestions.classList.remove('open');
    if (dom.customerSuggestions) dom.customerSuggestions.classList.remove('open');
    if (dom.saleSheetOverlay) dom.saleSheetOverlay.classList.add('open');
    // Disable qty-selector until a product is selected
    var qtySelector = document.querySelector('.qty-selector');
    if (qtySelector) qtySelector.classList.add('disabled');
  }

  function closeSaleSheet() {
    if (dom.saleSheetOverlay) dom.saleSheetOverlay.classList.remove('open');
  }

  function onProductSearch() {
    if (!dom.saleProductName || !dom.productSuggestions) return;
    var query = dom.saleProductName.value.toLowerCase().trim();
    if (!query) {
      dom.productSuggestions.classList.remove('open');
      return;
    }
    var matches = state.products.filter(function(p) {
      return p.name.toLowerCase().includes(query);
    }).slice(0, 6);

    if (matches.length === 0) {
      dom.productSuggestions.classList.remove('open');
      return;
    }

    dom.productSuggestions.innerHTML = matches.map(function(p) {
      var status = getStockStatus(p);
      return '<div class="product-suggestion-item" onclick="window.selectProduct(\'' + p.id + '\')">' +
        '<div>' +
          '<div class="product-suggestion-name">' + p.name + '</div>' +
          '<div class="product-suggestion-stock">' + (status === 'out' ? t('noStock') : p.quantity + ' left') + '</div>' +
        '</div>' +
        '<div class="product-suggestion-price">' + formatCurrency(p.sellingPrice) + '</div>' +
      '</div>';
    }).join('');
    dom.productSuggestions.classList.add('open');
  }

  function selectProduct(id) {
    var product = state.products.find(function(p) { return p.id === id; });
    if (!product) return;
    state.selectedProduct = product;
    if (dom.saleProductName) dom.saleProductName.value = product.name;
    if (dom.productSuggestions) dom.productSuggestions.classList.remove('open');
    // Enable qty-selector now that a product is selected
    var qtySelector = document.querySelector('.qty-selector');
    if (qtySelector) qtySelector.classList.remove('disabled');
    updateSaleTotal();
  }

  function adjustQty(delta) {
    if (!state.selectedProduct) return;
    if (!dom.saleQty) return;
    var qty = parseInt(dom.saleQty.value) || 1;
    qty = Math.max(1, qty + delta);
    dom.saleQty.value = qty;
    updateSaleTotal();
  }

  function updateSaleTotal() {
    var product = state.selectedProduct;
    var qty = parseInt(dom.saleQty ? dom.saleQty.value : 1) || 1;
    if (product) {
      var total = product.sellingPrice * qty;
      if (dom.saleTotalAmount) dom.saleTotalAmount.textContent = formatCurrency(total);
      if (dom.saleStockHint) {
        if (product.quantity <= 0) {
          dom.saleStockHint.textContent = '\ud83d\udd34 ' + t('noStock');
        } else if (qty > product.quantity) {
          dom.saleStockHint.textContent = '\u26a0\ufe0f ' + t('stockHint', { qty: product.quantity }) + ' \u2014 ' + t('noStock');
        } else {
          dom.saleStockHint.textContent = '\u2705 ' + t('stockHint', { qty: product.quantity });
        }
      }
    } else {
      if (dom.saleTotalAmount) dom.saleTotalAmount.textContent = '\u20b10.00';
      if (dom.saleStockHint) dom.saleStockHint.textContent = '';
    }
  }

  function onCustomerSearch() {
    if (!dom.saleCustomer || !dom.customerSuggestions) return;
    var query = dom.saleCustomer.value.toLowerCase().trim();
    if (!query) {
      dom.customerSuggestions.classList.remove('open');
      return;
    }
    var names = {};
    state.debts.forEach(function(d) { names[d.customerName] = true; });
    state.sales.forEach(function(s) { if (s.customerName) names[s.customerName] = true; });
    var matches = Object.keys(names).filter(function(n) {
      return n.toLowerCase().includes(query);
    }).slice(0, 5);

    if (matches.length === 0) {
      dom.customerSuggestions.classList.remove('open');
      return;
    }

    dom.customerSuggestions.innerHTML = matches.map(function(name) {
      return '<div class="customer-suggestion-item" onclick="window.selectCustomer(\'' + name.replace(/'/g, "\\'") + '\')">' + name + '</div>';
    }).join('');
    dom.customerSuggestions.classList.add('open');
  }

  function selectCustomer(name) {
    if (dom.saleCustomer) dom.saleCustomer.value = name;
    if (dom.customerSuggestions) dom.customerSuggestions.classList.remove('open');
  }

  function saveSale() {
    var product = state.selectedProduct;
    if (!product) {
      showToast('Mangyaring pumili ng produkto.', 'error');
      return;
    }
    var qty = parseInt(dom.saleQty ? dom.saleQty.value : 1) || 1;
    if (qty <= 0) {
      showToast('Ilagay ang tamang dami.', 'error');
      return;
    }
    if (qty > product.quantity) {
      showToast('Only ' + product.quantity + ' available', 'error');
      return;
    }

    var customer = dom.saleCustomer ? dom.saleCustomer.value.trim() : '';
    var amount = product.sellingPrice * qty;

    var sale = {
      id: genId(),
      date: todayStr(),
      createdAt: new Date().toISOString(),
      productName: product.name,
      productId: product.id,
      quantity: qty,
      amount: amount,
      costPrice: product.costPrice || 0,
      profit: (product.sellingPrice - (product.costPrice || 0)) * qty,
      customerName: customer || null
    };

    state.sales.push(sale);
    product.quantity -= qty;

    if (customer) {
      var existingDebt = state.debts.find(function(d) {
        return d.customerName.toLowerCase() === customer.toLowerCase() && d.remainingBalance > 0;
      });
      if (existingDebt) {
        existingDebt.amount += amount;
        existingDebt.remainingBalance += amount;
        existingDebt.updatedAt = new Date().toISOString();
        if (!existingDebt.transactions) existingDebt.transactions = [];
        existingDebt.transactions.push({
          id: genId(), date: new Date().toISOString(), type: 'debt',
          description: product.name, amount: amount
        });
      } else {
        state.debts.push({
          id: genId(), customerName: customer, amount: amount,
          remainingBalance: amount, createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          transactions: [{
            id: genId(), date: new Date().toISOString(), type: 'debt',
            description: product.name, amount: amount
          }]
        });
      }
    }

    saveState();
    renderDayMode();
    renderMorningCheck();
    showToast(t('saleSaved'));

    // Stay open for next sale — reset the form
    state.selectedProduct = null;
    if (dom.saleProductName) dom.saleProductName.value = '';
    if (dom.saleQty) dom.saleQty.value = '1';
    if (dom.saleCustomer) dom.saleCustomer.value = '';
    if (dom.saleTotalAmount) dom.saleTotalAmount.textContent = '\u20b10.00';
    if (dom.saleStockHint) dom.saleStockHint.textContent = '';
    if (dom.productSuggestions) dom.productSuggestions.classList.remove('open');
    if (dom.customerSuggestions) dom.customerSuggestions.classList.remove('open');
    // Re-disable the qty-selector until a new product is selected
    var qtySelector = document.querySelector('.qty-selector');
    if (qtySelector) qtySelector.classList.add('disabled');
  }

  // ============================================
  // CLOSING SCREEN
  // ============================================
  function showClosingScreen() {
    if (!state.dayOpen) {
      showToast(t('dayNotOpen'));
      return;
    }
    // Redirect to closing page
    window.location.href = 'closing.html';
  }

  function renderClosingScreen() {
    // Detect edit mode from URL param
    var isEdit = window.location.search.indexOf('edit=true') >= 0;

    var todaySales = getTodaySales();
    if (dom.closingSoldItems) {
      if (todaySales.length === 0) {
        dom.closingSoldItems.innerHTML = '<div class="empty-state" style="padding:12px 0;">' + t('noSales') + '</div>';
      } else {
        dom.closingSoldItems.innerHTML = todaySales.map(function(s) {
          return '<div class="closing-item">' +
            '<span class="closing-item-name">' + s.productName + ' \u00d7 ' + s.quantity + '</span>' +
            '<span class="closing-item-value success">' + formatCurrency(s.amount) + '</span>' +
          '</div>';
        }).join('');
      }
    }

    var lowItems = getLowStockItems();
    if (dom.closingLowStock) {
      if (lowItems.length === 0) {
        dom.closingLowStock.innerHTML = '<div class="empty-state" style="padding:12px 0;">' + t('allStockOk') + '</div>';
      } else {
        dom.closingLowStock.innerHTML = lowItems.map(function(p) {
          var status = getStockStatus(p);
          var cls = status === 'out' ? 'danger' : 'warning';
          return '<div class="closing-item">' +
            '<span class="closing-item-name">' + p.name + '</span>' +
            '<span class="closing-item-value ' + cls + '">' +
              (status === 'out' ? t('noStock') : p.quantity + ' left') +
            '</span>' +
          '</div>';
        }).join('');
      }
    }

    var activeDebts = state.debts.filter(function(d) { return d.remainingBalance > 0; });
    if (dom.closingDebts) {
      if (activeDebts.length === 0) {
        dom.closingDebts.innerHTML = '<div class="empty-state" style="padding:12px 0;">' + t('noDebts') + '</div>';
      } else {
        dom.closingDebts.innerHTML = activeDebts.map(function(d) {
          return '<div class="closing-item">' +
            '<span class="closing-item-name">' + d.customerName + '</span>' +
            '<span class="closing-item-value danger">' + formatCurrency(d.remainingBalance) + '</span>' +
          '</div>';
        }).join('');
      }
    }

    var weekly = getWeeklySales();
    if (dom.closingWeeklySales) dom.closingWeeklySales.textContent = formatCurrency(weekly.total);
    if (dom.closingTopSeller) dom.closingTopSeller.textContent = weekly.topSeller || '\u2014';

    if (dom.closingActualSales) dom.closingActualSales.value = state.todayEarnings || '';
    updateClosingTotal();

    // In edit mode, change the complete button text
    if (isEdit && dom.btnCompleteDay) {
      dom.btnCompleteDay.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><span>\u270F\uFE0F Update Closing</span>';
    }
  }

  function updateClosingTotal() {
    if (!dom.closingActualSales || !dom.closingRecordedSales || !dom.closingSalesDiff || !dom.closingTotalToday) return;
    var recordedSales = getTodayEarnings() + (state.todayEarnings || 0);
    var actualSales = parseFloat(dom.closingActualSales.value) || 0;
    var diff = actualSales - recordedSales;
    var profit = getTodayProfit();
    dom.closingRecordedSales.textContent = formatCurrency(recordedSales);
    dom.closingSalesDiff.textContent = (diff >= 0 ? '+' : '') + formatCurrency(diff);
    dom.closingSalesDiff.style.color = diff === 0 ? 'var(--text-muted)' : (diff > 0 ? 'var(--primary)' : 'var(--danger)');
    dom.closingTotalToday.textContent = formatCurrency(profit);
    var restockInfo = document.getElementById('closingRestockText');
    if (restockInfo) {
      var days = getDaysSinceLastRestock();
      if (days < 0) restockInfo.textContent = 'Last restock: none yet';
      else if (days === 0) restockInfo.textContent = 'Restocked today!';
      else restockInfo.textContent = 'Last restock: ' + days + ' day(s) ago';
    }
  }

  function backToDay() {
    window.location.href = 'day.html';
  }

  // ============================================
  // COMPLETE DAY
  // ============================================
  function completeDay() {
    if (!state.dayOpen) return;

    var recordedSales = getTodayEarnings();
    var actualSales = parseFloat(dom.closingActualSales ? dom.closingActualSales.value : 0) || 0;
    state.todayExpenses = 0;
    state.todayEarnings = actualSales;

    var totalItemsSold = getTodayItemsSold();
    var totalUtang = getTodayUtang();
    var diff = actualSales - recordedSales;
    var profit = getTodayProfit();

    // Update or create today's history entry (overwrite if exists)
    var todayHistoryIndex = -1;
    for (var i = 0; i < state.history.length; i++) {
      if (state.history[i].date === todayStr()) {
        todayHistoryIndex = i;
        break;
      }
    }
    var historyEntry = {
      date: todayStr(),
      earnings: actualSales,
      recordedSales: recordedSales,
      actualSales: actualSales,
      salesDiff: diff,
      expenses: 0,
      profit: profit,
      itemsSold: totalItemsSold,
      utangTotal: totalUtang,
      salesCount: getTodaySales().length
    };
    if (todayHistoryIndex >= 0) {
      state.history[todayHistoryIndex] = historyEntry;
    } else {
      state.history.push(historyEntry);
    }

    state.dayOpen = false;
    state.dayArchived = false; // keep data available for editing
    saveState();

    if (dom.summaryOverlay) dom.summaryOverlay.classList.add('open');
    var name = state.settings.ownerName || '';
    if (dom.summaryText) dom.summaryText.textContent = t('dayCompleteSub', { name: name });

    if (dom.summaryDetails) {
      dom.summaryDetails.innerHTML =
        '<div class="summary-detail-row"><span>' + t('closingRecordedSales') + '</span><span>' + formatCurrency(recordedSales) + '</span></div>' +
        '<div class="summary-detail-row"><span>' + t('closingActualSales') + '</span><span>' + formatCurrency(actualSales) + '</span></div>' +
        (diff !== 0 ? '<div class="summary-detail-row"><span>' + t('closingSalesDiff') + '</span><span style="color:' + (diff > 0 ? 'var(--primary)' : 'var(--danger)') + ';">' + (diff > 0 ? '+' : '') + formatCurrency(diff) + '</span></div>' : '') +
        '<div class="summary-detail-row" style="border-top:1px solid var(--border);padding-top:8px;font-weight:700;"><span>' + t('profitLabel') + '</span><span style="color:var(--primary);">' + formatCurrency(profit) + '</span></div>' +
        '<div class="summary-detail-row"><span>Items Sold</span><span>' + totalItemsSold + '</span></div>' +
        (totalUtang > 0 ? '<div class="summary-detail-row"><span>Unpaid Debt</span><span style="color:var(--danger);">' + formatCurrency(totalUtang) + '</span></div>' : '');
    }
  }

  function closeDayAndShowMorning() {
    if (dom.summaryOverlay) dom.summaryOverlay.classList.remove('open');
    state.dayOpen = false;
    // Keep todayExpenses/todayEarnings intact so user can re-open and edit
    saveState();
    window.location.href = 'morning.html';
  }

  // ─── Re-open Closing for Editing ───
  function reopenClosing() {
    // Restore the day state from history so closing inputs are pre-filled
    var todayEntry = null;
    for (var i = 0; i < state.history.length; i++) {
      if (state.history[i].date === todayStr()) {
        todayEntry = state.history[i];
        break;
      }
    }
    if (todayEntry) {
      state.todayExpenses = todayEntry.expenses || 0;
      state.todayEarnings = todayEntry.actualSales || 0;
    }
    state.dayDate = todayStr();
    state.dayOpen = true;
    state.dayArchived = false;
    saveState();
    window.location.href = 'closing.html?edit=true';
  }

  // ─── Archive Day Sales ───
  function archiveDaySales() {
    if (!state.dayDate) return;
    // Attach today's sales data to the history entry for that date
    var salesForDate = state.sales.filter(function(s) { return s.date === state.dayDate; });
    if (salesForDate.length > 0) {
      var found = false;
      for (var i = 0; i < state.history.length; i++) {
        if (state.history[i].date === state.dayDate) {
          state.history[i].archivedSales = JSON.parse(JSON.stringify(salesForDate));
          found = true;
          break;
        }
      }
      if (!found) {
        state.history.push({
          date: state.dayDate,
          archivedSales: JSON.parse(JSON.stringify(salesForDate)),
          earnings: 0,
          recordedSales: 0,
          actualSales: 0,
          salesDiff: 0,
          expenses: 0,
          profit: 0,
          itemsSold: 0,
          utangTotal: 0,
          salesCount: salesForDate.length
        });
      }
    }
    // Remove those sales from the active array
    state.sales = state.sales.filter(function(s) { return s.date !== state.dayDate; });
    state.dayArchived = true;
    saveState();
  }

  // ============================================
  // MANAGE STORE
  // ============================================
  // (toggleManageStore and switchManageTab removed — now using separate pages)

  function renderManageInventory() {
    if (!dom.manageInventoryList) return;
    var query = dom.manageStockSearch ? dom.manageStockSearch.value.toLowerCase() : '';
    var products = state.products;
    if (query) {
      products = products.filter(function(p) { return p.name.toLowerCase().includes(query); });
    }
    products = products.slice().sort(function(a, b) { return a.name.localeCompare(b.name); });

    if (products.length === 0) {
      dom.manageInventoryList.innerHTML = '<div class="empty-state">' + t('noProducts') + '</div>';
      return;
    }

    dom.manageInventoryList.innerHTML = products.map(function(p) {
      var status = getStockStatus(p);
      var icon = status === 'plenty' ? '\u2705' : (status === 'low' ? '\u26a0\ufe0f' : '\ud83d\udd34');
      var margin = p.costPrice > 0 ? Math.round(((p.sellingPrice - p.costPrice) / p.costPrice) * 100) : 0;
      return '<div class="inv-manage-item">' +
        '<div class="inv-manage-icon ' + status + '">' + icon + '</div>' +
        '<div class="inv-manage-info">' +
          '<div class="inv-manage-name">' + p.name + '</div>' +
          '<div class="inv-manage-detail">Stock: ' + p.quantity + ' | +' + margin + '% | ' + formatCurrency(p.sellingPrice) + '</div>' +
        '</div>' +
        '<div class="inv-manage-actions">' +
          '<button class="inv-manage-btn sell" onclick="window.quickSell(\'' + p.id + '\')">Sell</button>' +
          '<button class="inv-manage-btn" onclick="window.editProduct(\'' + p.id + '\')">\u270f\ufe0f</button>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function quickSell(id) {
    var product = state.products.find(function(p) { return p.id === id; });
    if (!product) return;
    state.selectedProduct = product;
    openSaleSheet();
    if (dom.saleProductName) dom.saleProductName.value = product.name;
    updateSaleTotal();
  }

  function editProduct(id) {
    var product = state.products.find(function(p) { return p.id === id; });
    if (!product) return;
    state.editProductId = id;
    // Save the edit ID to localStorage so add_product.html can load it
    try { localStorage.setItem('sss_v3_editProductId', id); } catch(e) {}
    // Navigate to add_product.html for editing
    window.location.href = 'add_product.html';
  }

  function openAddProduct() {
    state.editProductId = null;
    if (dom.addProductTitle) dom.addProductTitle.textContent = t('addStock');
    if (dom.productName) dom.productName.value = '';
    if (dom.productQty) dom.productQty.value = '10';
    if (dom.productCost) dom.productCost.value = '';
    if (dom.productPrice) dom.productPrice.value = '';
    if (dom.productMarkup) dom.productMarkup.value = '20';
    if (dom.productMarkupHint) dom.productMarkupHint.textContent = '';
    updateMarkupHint();
    // (overlay replaced by separate add_product.html page)
  }

  function closeAddProduct() {
    state.editProductId = null;
  }

  function updateMarkupHint() {
    if (!dom.productCost || !dom.productMarkup || !dom.productMarkupHint) return;
    var cost = parseFloat(dom.productCost.value) || 0;
    var markup = parseInt(dom.productMarkup.value) || 0;
    var suggested = calcMarkupSuggestion(cost, markup);
    if (suggested) {
      dom.productMarkupHint.textContent = t('markupHint', { pct: markup, price: formatCurrency(suggested) });
      if (dom.productPrice && !dom.productPrice.value) {
        dom.productPrice.value = suggested.toFixed(2);
      }
      // Show/hide the markup helper block
      if (dom.markupSuggestion && cost > 0 && markup > 0) {
        dom.markupSuggestion.style.display = 'block';
        if (dom.markupHint) dom.markupHint.textContent = t('markupHint', { pct: markup, price: '' }).replace(' {price}', '').replace('{price}', '').replace('  ', ' ').trim();
        if (dom.markupSuggestedPrice) dom.markupSuggestedPrice.textContent = formatCurrency(suggested);
      } else if (dom.markupSuggestion) {
        dom.markupSuggestion.style.display = 'none';
      }
    } else {
      dom.productMarkupHint.textContent = '';
      if (dom.markupSuggestion) dom.markupSuggestion.style.display = 'none';
    }
  }

  function saveProduct() {
    var name = dom.productName ? dom.productName.value.trim() : '';
    var qty = parseInt(dom.productQty ? dom.productQty.value : 0) || 0;
    var cost = parseFloat(dom.productCost ? dom.productCost.value : 0) || 0;
    var price = parseFloat(dom.productPrice ? dom.productPrice.value : 0) || 0;

    if (!name) { showToast('Ilagay ang pangalan ng produkto.', 'error'); return; }
    if (qty <= 0) { showToast('Ilagay ang tamang dami.', 'error'); return; }
    if (cost <= 0 || price <= 0) { showToast('Ilagay ang tamang presyo.', 'error'); return; }

    if (state.editProductId) {
      var product = state.products.find(function(p) { return p.id === state.editProductId; });
      if (product) { product.name = name; product.quantity = qty; product.costPrice = cost; product.sellingPrice = price; }
    } else {
      state.products.push({ id: genId(), name: name, quantity: qty, costPrice: cost, sellingPrice: price });
    }

    saveState();
    try { localStorage.removeItem('sss_v3_editProductId'); } catch(e) {}
    showToast(t('productSaved'));
    // Redirect back to inventory
    window.location.href = 'inventory.html';
  }

  // ============================================
  // MANAGE DEBTS
  // ============================================
  function renderManageDebts() {
    if (!dom.manageDebtsList) return;
    var total = getTotalDebt();
    if (dom.manageTotalDebt) dom.manageTotalDebt.textContent = formatCurrency(total);

    var activeDebts = state.debts.filter(function(d) { return d.remainingBalance > 0; });
    if (activeDebts.length === 0) {
      dom.manageDebtsList.innerHTML = '<div class="empty-state">' + t('noDebtItems') + '</div>';
      return;
    }

    dom.manageDebtsList.innerHTML = activeDebts.map(function(d) {
      var lastActivity = '';
      if (d.updatedAt) {
        var d2 = new Date(d.updatedAt);
        lastActivity = d2.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
      return '<div class="debt-manage-item">' +
        '<div class="debt-manage-info">' +
          '<div class="debt-manage-name">' + d.customerName + '</div>' +
          '<div class="debt-manage-meta">' + (lastActivity ? 'Last: ' + lastActivity : '') + '</div>' +
        '</div>' +
        '<div class="debt-manage-amount">' + formatCurrency(d.remainingBalance) + '</div>' +
        '<button class="debt-manage-pay-btn" onclick="window.openPaymentSheet(\'' + d.id + '\')">' + t('payBtnLabel') + '</button>' +
      '</div>';
    }).join('');
  }

  // ============================================
  // PAYMENT SHEET
  // ============================================
  function openPaymentSheet(debtId) {
    var debt = state.debts.find(function(d) { return d.id === debtId; });
    if (!debt) return;
    state.paymentDebtId = debtId;
    closeSaleSheet();
    if (dom.paymentCustomerName) dom.paymentCustomerName.textContent = debt.customerName;
    if (dom.paymentCustomerBalance) dom.paymentCustomerBalance.textContent = t('payBalance', { amount: formatCurrency(debt.remainingBalance) });
    if (dom.paymentAmount) dom.paymentAmount.value = '';
    if (dom.paymentRemaining) dom.paymentRemaining.textContent = formatCurrency(debt.remainingBalance);
    if (dom.paymentSheetOverlay) dom.paymentSheetOverlay.classList.add('open');
  }

  function closePaymentSheet() {
    if (dom.paymentSheetOverlay) dom.paymentSheetOverlay.classList.remove('open');
    state.paymentDebtId = null;
  }

  function updatePaymentPreview() {
    var debt = state.debts.find(function(d) { return d.id === state.paymentDebtId; });
    if (!debt || !dom.paymentAmount || !dom.paymentRemaining) return;
    var amount = parseFloat(dom.paymentAmount.value) || 0;
    var remaining = Math.max(0, debt.remainingBalance - amount);
    dom.paymentRemaining.textContent = formatCurrency(remaining);
  }

  function savePayment() {
    var debt = state.debts.find(function(d) { return d.id === state.paymentDebtId; });
    if (!debt) return;
    var amount = parseFloat(dom.paymentAmount ? dom.paymentAmount.value : 0) || 0;
    if (amount <= 0) { showToast('Ilagay ang tamang halaga.', 'error'); return; }
    if (amount > debt.remainingBalance) { showToast('Ang halaga ay lumampas sa natitirang balanse.', 'error'); return; }

    if (!debt.transactions) debt.transactions = [];
    debt.transactions.push({ id: genId(), date: new Date().toISOString(), type: 'payment', amount: amount });
    debt.remainingBalance -= amount;
    debt.updatedAt = new Date().toISOString();

    saveState();
    closePaymentSheet();
    renderManageDebts();
    renderMorningCheck();
    showToast(t('paymentSaved'));
  }

  // ============================================
  // NEW DEBT
  // ============================================
  function openNewDebt() {
    if (dom.newDebtCustomer) dom.newDebtCustomer.value = '';
    if (dom.newDebtAmount) dom.newDebtAmount.value = '';
    // (overlay replaced by separate new_debt.html page)
  }

  function closeNewDebt() {
  }

  function saveNewDebt() {
    var customer = dom.newDebtCustomer ? dom.newDebtCustomer.value.trim() : '';
    var amount = parseFloat(dom.newDebtAmount ? dom.newDebtAmount.value : 0) || 0;

    if (!customer) { showToast('Ilagay ang pangalan ng kostumer.', 'error'); return; }
    if (amount <= 0) { showToast('Ilagay ang tamang halaga.', 'error'); return; }

    var existingDebt = state.debts.find(function(d) {
      return d.customerName.toLowerCase() === customer.toLowerCase() && d.remainingBalance > 0;
    });
    if (existingDebt) {
      existingDebt.amount += amount;
      existingDebt.remainingBalance += amount;
      existingDebt.updatedAt = new Date().toISOString();
      if (!existingDebt.transactions) existingDebt.transactions = [];
      existingDebt.transactions.push({ id: genId(), date: new Date().toISOString(), type: 'debt', description: 'Manual', amount: amount });
    } else {
      state.debts.push({
        id: genId(), customerName: customer, amount: amount, remainingBalance: amount,
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        transactions: [{ id: genId(), date: new Date().toISOString(), type: 'debt', description: 'Manual', amount: amount }]
      });
    }

    saveState();
    closeNewDebt();
    showToast(t('debtSaved'));
    // Redirect back to debts page
    window.location.href = 'debts.html';
  }

  // ============================================
  // SETTINGS
  // ============================================
  function saveSettings() {
    if (dom.settingsLanguage) state.settings.language = dom.settingsLanguage.value;
    if (dom.settingsStoreName) state.settings.storeName = dom.settingsStoreName.value.trim() || state.settings.storeName;
    if (dom.settingsOwnerName) state.settings.ownerName = dom.settingsOwnerName.value.trim() || state.settings.ownerName;
    saveState();
    // Apply translations to all data-i18n elements on this page
    applyTranslations();
    applyTextSize();
    renderMorningCheck();
    showToast(t('saved'));
  }

  // ============================================
  // DATA MANAGEMENT
  // ============================================
  function resetData() {
    if (!confirm(t('confirmReset'))) return;
    state.products = getSampleProducts();
    state.sales = [];
    state.debts = [];
    state.history = [];
    state.dayOpen = false;
    state.todayExpenses = 0;
    state.todayEarnings = 0;
    state.settings.launchCount = 0;
    saveState();
    renderMorningCheck();
    renderManageInventory();
    renderManageDebts();
    showToast(t('dataReset'));
  }

  function exportData() {
    var exportObj = {
      settings: state.settings, products: state.products,
      sales: state.sales, debts: state.debts, history: state.history,
      exportedAt: new Date().toISOString()
    };
    var dataStr = JSON.stringify(exportObj, null, 2);
    var blob = new Blob([dataStr], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'sari-sari-smart-data-' + todayStr() + '.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported!');
  }

  // ============================================
  // DEVELOPER PANEL (Shift+N)
  // ============================================
  function buildDevPanel() {
    var panel = document.createElement('div');
    panel.className = 'dev-panel-overlay';
    panel.id = 'devPanelOverlay';
    panel.innerHTML =
      '<div class="dev-panel">' +
        '<div class="dev-panel-header">' +
          '<h2 style="font-size:18px;font-weight:700;color:#e2e8f0;">Developer Panel</h2>' +
          '<button class="dev-panel-close" onclick="toggleDevPanel()">\u2715</button>' +
        '</div>' +
        '<div class="dev-panel-content">' +
          '<div class="dev-panel-section">' +
            '<div class="dev-panel-section-title">Sales &amp; Data</div>' +
            '<button class="dev-panel-btn" onclick="handleDevAction(\'resetTodaySales\')">Reset Today\'s Sales</button>' +
            '<button class="dev-panel-btn" onclick="handleDevAction(\'generateTestSale\')">Generate Test Sale Entry</button>' +
            '<button class="dev-panel-btn" onclick="handleDevAction(\'addSampleDebts\')">Add Sample Debts</button>' +
          '</div>' +
          '<div class="dev-panel-section">' +
            '<div class="dev-panel-section">' +
            '<div class="dev-panel-section-title">Restock</div>' +
            '<button class="dev-panel-btn" onclick="handleDevAction(\'clearRestockData\')">Clear Restock Data</button>' +
            '<button class="dev-panel-btn" onclick="handleDevAction(\'setRestockDate\')">Set Restock Date to Today</button>' +
            '<button class="dev-panel-btn" onclick="handleDevAction(\'viewRestockLog\')">View Restock Log</button>' +
          '</div>' +
          '<div class="dev-panel-section">' +
            '<div class="dev-panel-section-title">Inventory</div>' +
            '<button class="dev-panel-btn" onclick="handleDevAction(\'clearInventory\')">Clear All Inventory</button>' +
            '<button class="dev-panel-btn" onclick="handleDevAction(\'seedProducts\')">Seed Sample Products</button>' +
            '<button class="dev-panel-btn" onclick="handleDevAction(\'bulkAddItems\')">Bulk Add Items</button>' +
          '</div>' +
          '<div class="dev-panel-section">' +
            '<div class="dev-panel-section-title">Advanced</div>' +
            '<button class="dev-panel-btn" onclick="handleDevAction(\'viewRawState\')">View Raw State (JSON)</button>' +
            '<button class="dev-panel-btn" onclick="handleDevAction(\'exportData\')">Export All Data</button>' +
            '<button class="dev-panel-btn" onclick="handleDevAction(\'importData\')">Import Data</button>' +
            '<button class="dev-panel-btn dev-panel-btn-danger" onclick="handleDevAction(\'resetAll\')">Reset All Application Data</button>' +
          '</div>' +
          '<div class="dev-panel-section">' +
            '<div class="dev-panel-section-title">Clear Specific Data</div>' +
            '<div id="devPanelCheckboxes">' +
              '<label class="dev-panel-checkbox"><input type="checkbox" id="devChkProducts"> Products</label>' +
              '<label class="dev-panel-checkbox"><input type="checkbox" id="devChkSales"> Sales</label>' +
              '<label class="dev-panel-checkbox"><input type="checkbox" id="devChkDebts"> Debts</label>' +
              '<label class="dev-panel-checkbox"><input type="checkbox" id="devChkHistory"> History</label>' +
              '<label class="dev-panel-checkbox"><input type="checkbox" id="devChkSettings"> Settings</label>' +
            '</div>' +
            '<button class="dev-panel-btn dev-panel-btn-danger" onclick="handleDevAction(\'clearSelected\')">Clear Selected Datasets</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(panel);
  }

  function toggleDevPanel() {
    var panel = document.getElementById('devPanelOverlay');
    if (!panel) { buildDevPanel(); panel = document.getElementById('devPanelOverlay'); }
    panel.classList.toggle('open');
  }

  function handleDevAction(action) {
    switch(action) {
      case 'resetTodaySales':
        state.sales = state.sales.filter(function(s) { return s.date !== todayStr(); });
        saveState(); showToast('Today\'s sales reset.');
        break;
      case 'generateTestSale':
        if (state.products.length === 0) { showToast('No products to test with.', 'error'); return; }
        var p = state.products[Math.floor(Math.random() * state.products.length)];
        var qty = Math.floor(Math.random() * 3) + 1;
        var amount = p.sellingPrice * qty;
        state.sales.push({
          id: genId(), date: todayStr(), createdAt: new Date().toISOString(),
          productName: p.name, productId: p.id, quantity: qty, amount: amount,
          costPrice: p.costPrice || 0,
          profit: (p.sellingPrice - (p.costPrice || 0)) * qty,
          customerName: null
        });
        saveState(); showToast('Test sale: ' + p.name + ' x' + qty + ' = ' + formatCurrency(amount));
        break;
      case 'addSampleDebts':
        var names = ['Maria Santos', 'Juan Dela Cruz', 'Pedro Reyes', 'Ana Gonzales', 'Jose Rizal', 'Elena Bautista', 'Carlos Medina'];
        names.forEach(function(n) {
          var amt = Math.round((Math.random() * 200 + 50) * 100) / 100;
          state.debts.push({
            id: genId(), customerName: n, amount: amt, remainingBalance: amt,
            createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
            transactions: [{ id: genId(), date: new Date().toISOString(), type: 'debt', description: 'Sample debt', amount: amt }]
          });
        });
        saveState(); showToast('7 sample debts added.');
        break;
      case 'clearInventory':
        state.products = [];
        saveState(); showToast('Inventory cleared.');
        break;
      case 'seedProducts':
        state.products = getSampleProducts();
        saveState(); showToast('Sample products loaded.');
        break;
      case 'bulkAddItems':
        var count = prompt('How many items to add? (1-50)', '10');
        count = parseInt(count) || 10;
        if (count < 1) count = 1; if (count > 50) count = 50;
        for (var i = 0; i < count; i++) {
          var cost = Math.round((Math.random() * 90 + 5) * 100) / 100;
          var markup = 1 + (Math.random() * 0.5 + 0.1);
          state.products.push({
            id: genId(), name: 'Test Item ' + (state.products.length + 1),
            quantity: Math.floor(Math.random() * 50) + 1,
            costPrice: cost, sellingPrice: Math.round(cost * markup * 100) / 100
          });
        }
        saveState(); showToast(count + ' items added.');
        break;
      case 'viewRawState':
        var summary = 'Products: ' + state.products.length + '\nSales: ' + state.sales.length + '\nDebts: ' + state.debts.length + '\nHistory: ' + state.history.length + '\nDay Open: ' + state.dayOpen + '\n\nFirst 3 products:\n';
        state.products.slice(0, 3).forEach(function(p) { summary += '- ' + p.name + ' (' + p.quantity + ' @ ' + formatCurrency(p.sellingPrice) + ')\n'; });
        alert(summary);
        break;
      case 'exportData':
        exportData();
        break;
      case 'importData':
        (function() {
          var input = document.createElement('input');
          input.type = 'file'; input.accept = '.json';
          input.onchange = function(e) {
            var reader = new FileReader();
            reader.onload = function(ev) {
              try {
                var data = JSON.parse(ev.target.result);
                if (data.products) state.products = data.products;
                if (data.sales) state.sales = data.sales;
                if (data.debts) state.debts = data.debts;
                if (data.history) state.history = data.history;
                if (data.settings) state.settings = data.settings;
                if (data.dayOpen !== undefined) state.dayOpen = data.dayOpen;
                saveState(); showToast('Data imported successfully!');
              } catch(err) { showToast('Invalid JSON file.', 'error'); }
            };
            reader.readAsText(input.files[0]);
          };
          input.click();
        })();
        break;
      case 'resetAll':
        if (!confirm('Reset ALL application data? This cannot be undone.')) return;
        state.products = getSampleProducts();
        state.sales = []; state.debts = []; state.history = [];
        state.dayOpen = false; state.todayExpenses = 0; state.todayEarnings = 0;
        state.settings.hasCompletedSetup = false;
        state.settings.launchCount = 0;
        saveState();
        window.location.href = 'index.html';
        return;
      case 'clearSelected':
        (function() {
          var msg = [];
          if (document.getElementById('devChkProducts') && document.getElementById('devChkProducts').checked) { state.products = getSampleProducts(); msg.push('Products'); }
          if (document.getElementById('devChkSales') && document.getElementById('devChkSales').checked) { state.sales = []; msg.push('Sales'); }
          if (document.getElementById('devChkDebts') && document.getElementById('devChkDebts').checked) { state.debts = []; msg.push('Debts'); }
          if (document.getElementById('devChkHistory') && document.getElementById('devChkHistory').checked) { state.history = []; msg.push('History'); }
          if (document.getElementById('devChkSettings') && document.getElementById('devChkSettings').checked) { state.settings = { language: 'fil', storeName: 'Aking Tindahan', ownerName: 'May-ari', hasCompletedSetup: true, lowStockThreshold: 5 }; msg.push('Settings'); }
          if (msg.length > 0) { saveState(); showToast('Cleared: ' + msg.join(', ')); }
          else { showToast('No datasets selected.', 'error'); }
        })();
        break;
    }
    // Refresh UI
    renderMorningCheck();
    renderManageInventory();
    renderManageDebts();
  }

  // ============================================
  // EVENT WIRING
  // ============================================
  function setupEvents() {
    if (dom.closingActualSales) dom.closingActualSales.addEventListener('input', updateClosingTotal);
    if (dom.productCost) dom.productCost.addEventListener('input', updateMarkupHint);
    if (dom.productMarkup) dom.productMarkup.addEventListener('input', updateMarkupHint);
    if (dom.productPrice) dom.productPrice.addEventListener('input', updateMarkupHint);

    document.addEventListener('keydown', function(e) {
      // Shift+N: toggle developer panel
      if (e.key === 'N' && e.shiftKey && !e.repeat) {
        e.preventDefault();
        toggleDevPanel();
        return;
      }
      if (e.key === 'Escape') {
        // Close dev panel first if open
        var devPanel = document.getElementById('devPanelOverlay');
        if (devPanel && devPanel.classList.contains('open')) { toggleDevPanel(); return; }
        if (dom.saleSheetOverlay && dom.saleSheetOverlay.classList.contains('open')) closeSaleSheet();
        if (dom.paymentSheetOverlay && dom.paymentSheetOverlay.classList.contains('open')) closePaymentSheet();
      }
    });

    if (dom.saleSheetOverlay) {
      dom.saleSheetOverlay.addEventListener('click', function(e) {
        if (e.target === dom.saleSheetOverlay) closeSaleSheet();
      });
    }
    if (dom.paymentSheetOverlay) {
      dom.paymentSheetOverlay.addEventListener('click', function(e) {
        if (e.target === dom.paymentSheetOverlay) closePaymentSheet();
      });
    }
  }

  // ============================================
  // INIT
  // ============================================
  function init() {
    cacheDom();
    loadState();

    // Handle each page type
    if (pageName === 'index') {
      // Landing page: Setup overlay only (first-time setup)
      if (!state.settings.hasCompletedSetup && dom.setupOverlay) {
        dom.setupOverlay.classList.add('open');
      } else {
        // Already set up, redirect to morning
        window.location.href = 'morning.html';
        return;
      }
    }
    // Check for tutorial resume (multi-page tutorial navigation)
    if (checkTutorialResume()) {
      // Tutorial resume handled, no further page init needed
    } else if (pageName === 'morning') {
      // Morning check page
      applyTranslations();
      renderMorningCheck();
      // Auto-start main tutorial for new users (only if not resuming)
      state.settings.launchCount = (state.settings.launchCount || 0) + 1;
      saveState();
      if (dom.tutorialOverlay) {
        var isFirstLaunch = state.settings.launchCount === 1;
        setTimeout(function() {
          startTutorial('main', !isFirstLaunch);
        }, 500);
      }
    } else if (pageName === 'day') {
      // Day mode page
      if (!state.dayOpen) {
        showToast(t('dayNotOpen'));
        setTimeout(function() { window.location.href = 'morning.html'; }, 1500);
        return;
      }
      applyTranslations();
      renderDayMode();
    } else if (pageName === 'closing') {
      // Evening closing page
      if (!state.dayOpen) {
        window.location.href = 'morning.html';
        return;
      }
      applyTranslations();
      renderClosingScreen();
    } else if (pageName === 'inventory') {
      // Inventory management page
      applyTranslations();
      renderManageInventory();
    } else if (pageName === 'debts') {
      // Debts management page
      applyTranslations();
      renderManageDebts();
    } else if (pageName === 'setting') {
      // Settings page
      applyTranslations();
      if (dom.settingsLanguage) dom.settingsLanguage.value = state.settings.language || 'fil';
      if (dom.settingsStoreName) dom.settingsStoreName.value = state.settings.storeName || '';
      if (dom.settingsOwnerName) dom.settingsOwnerName.value = state.settings.ownerName || '';
    } else if (pageName === 'add_product') {
      // Add / Edit product page
      applyTranslations();
      var editId = null;
      try { editId = localStorage.getItem('sss_v3_editProductId'); } catch(e) {}
      // Set default markup
      if (dom.productMarkup && !dom.productMarkup.value) dom.productMarkup.value = '20';
      if (editId) {
        state.editProductId = editId;
        var product = state.products.find(function(p) { return p.id === editId; });
        if (product) {
          if (dom.addProductTitle) dom.addProductTitle.textContent = 'Edit Stock';
          if (dom.productName) dom.productName.value = product.name;
          if (dom.productQty) dom.productQty.value = product.quantity;
          if (dom.productCost) dom.productCost.value = product.costPrice;
          if (dom.productPrice) dom.productPrice.value = product.sellingPrice;
        }
      }
    }

    // Apply text size on every page
    applyTextSize();

    setupEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ============================================
  // WINDOW EXPORTS
  // ============================================
  window.toggleDayTransactions = toggleDayTransactions;
  window.launchTutorial = launchTutorial;
  window.completeSetup = completeSetup;
  window.showMorningCheck = showMorningCheck;
  window.startDay = startDay;
  window.showClosingScreen = showClosingScreen;
  window.renderClosingScreen = renderClosingScreen;
  window.backToDay = backToDay;
  window.completeDay = completeDay;
  window.closeDayAndShowMorning = closeDayAndShowMorning;
  window.openSaleSheet = openSaleSheet;
  window.closeSaleSheet = closeSaleSheet;
  window.onProductSearch = onProductSearch;
  window.selectProduct = selectProduct;
  window.adjustQty = adjustQty;
  window.onCustomerSearch = onCustomerSearch;
  window.selectCustomer = selectCustomer;
  window.saveSale = saveSale;
  window.openPaymentSheet = openPaymentSheet;
  window.closePaymentSheet = closePaymentSheet;
  window.updatePaymentPreview = updatePaymentPreview;
  window.savePayment = savePayment;
  window.renderManageInventory = renderManageInventory;
  window.quickSell = quickSell;
  window.editProduct = editProduct;
  window.openAddProduct = openAddProduct;
  window.closeAddProduct = closeAddProduct;
  window.updateMarkupHint = updateMarkupHint;
  window.saveProduct = saveProduct;
  window.toggleDevPanel = toggleDevPanel;
  window.handleDevAction = handleDevAction;
  window.openNewDebt = openNewDebt;
  window.closeNewDebt = closeNewDebt;
  window.saveNewDebt = saveNewDebt;
  window.saveSettings = saveSettings;
  window.resetData = resetData;
  window.exportData = exportData;
  window.applyTextSize = applyTextSize;
  window.setTextSize = setTextSize;
  window.startTutorial = startTutorial;
  window.advanceTutorial = advanceTutorial;
  window.endTutorial = endTutorial;
  window.reopenClosing = reopenClosing;
  window.archiveDaySales = archiveDaySales;

})();
