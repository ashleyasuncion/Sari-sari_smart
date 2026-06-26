/* ============================================
   SARI-SARI SMART v2 - Application Logic
   Refactored based on interview findings
   Pillars: Stock Tracker | Daily Cash Summary | Utang Notebook
   ============================================ */

;(function() {
  'use strict';

  // ============================================
  // PAGE DETECTION
  // ============================================
  const pageName = (function() {
    const path = window.location.pathname.split('/').pop().toLowerCase();
    if (path === '' || path === 'index.html') return 'index';
    return path.replace('.html', '');
  })();

  // ============================================
  // STRINGS / LOCALIZATION
  // ============================================
  const strings = {
    en: {
      // Nav
      home: 'Home', stocks: 'Stocks', sales: 'Sales', utang: 'Utang', help: 'Help',
      settings: 'Settings',
      // Home
      homeGreeting: 'Kamusta ang Tindahan Ngayon?',
      homeSubtitle: 'How is your store today?',
      todayEarnings: "Today's Earnings",
      stockAlert: 'Stock Alert',
      itemsLow: 'items running low',
      utangNgayon: 'Outstanding Debts',
      totalOwed: 'Total owed to you',
      businessTip: 'Business Tip',
      endOfDay: 'End-of-Day Closing',
      endOfDayDesc: 'Close your store for the day',
      // Daily Sales
      recordSales: 'Record Today\'s Sales',
      stockExpenses: 'Gastos sa Paninda',
      stockExpensesHint: 'How much did you spend on stock today?',
      todayEarningsInput: 'Kinikita Ngayon',
      todayEarningsHint: 'How much cash did you receive today?',
      grossProfit: 'Gross Profit',
      netProfit: 'Estimated Net Profit',
      revolvingFund: 'Revolving Fund',
      saveSales: 'Save Today\'s Sales',
      todayRecorded: 'Today\'s sales recorded!',
      todayAlreadyRecorded: 'Today\'s sales are already recorded',
      addSpecificSale: 'Add a Specific Sale',
      specificSaleDesc: 'For notable items (e.g. large utang purchase)',
      itemDesc: 'Item Description',
      saleAmount: 'Amount (₱)',
      customerOptional: 'Customer (optional)',
      saveSpecificSale: 'Save Sale',
      specificSaleSaved: 'Sale saved.',
      // Stocks
      addStock: 'Add Stock',
      kulangNa: 'Running Low',
      kulangNaDesc: 'Items you need to restock',
      allItems: 'All Items',
      maramiPa: 'Plenty',
      medyoKulang: 'Getting Low',
      walaNa: 'Out of Stock',
      updateStatus: 'Update Status',
      deductStock: 'Sold',
      deductQty: 'Quantity sold',
      stockDeducted: 'Stock updated.',
      stockAdded: 'Stock added.',
      searchProducts: 'Search items...',
      edit: 'Edit',
      restock: 'Restock',
      lowStock: 'Low Stock',
      stockLabel: 'Stock:',
      noStockItems: 'No stock items yet. Add your first item!',
      noLowStock: 'No items running low.',
      // Add Stock
      addStockTitle: 'Add Stock',
      itemName: 'Item Name',
      quantity: 'Quantity',
      costPerUnit: 'Cost per Unit (₱)',
      sellPrice: 'Selling Price (₱)',
      markupPercent: 'Markup (%)',
      markupHint: 'At {percent}% markup, sell this at',
      suggestedPrice: 'Suggested',
      // End of Day
      eodTitle: 'End-of-Day Closing',
      eodStep1: 'Cash in drawer',
      eodStep1Hint: 'How much cash do you have right now?',
      eodStep2: 'Stock check',
      eodStep2Hint: 'Quick visual check of your items',
      eodStep3: 'Debt payments',
      eodStep3Hint: 'Did anyone pay their utang today?',
      eodDone: 'Done!',
      eodComplete: 'Day Complete!',
      eodSummary: 'Today: Earned {earnings}. Profit: {profit}. Low stock: {lowCount} items. Outstanding debts: {debts}.',
      eodStep2Done: 'Checked {count} items',
      eodStep3Done: 'Recorded {count} payment(s)',
      // Debts / Utang (keep original keys for compatibility)
      newDebt: 'New Debt',
      newDebtManual: 'New Debt',
      totalOutstanding: 'Total Outstanding',
      customerDebts: 'Customer Debts',
      noDebts: 'No debts recorded yet.',
      recordPayment: 'Record Payment',
      paymentAmount: 'Payment Amount (₱)',
      note: 'Note (optional)',
      paymentNotePlaceholder: 'e.g. Partial payment',
      savePayment: 'Save Payment',
      remainingAfterPayment: 'Remaining after payment:',
      currentBalance: 'Current Balance',
      debtHistory: 'Debt History',
      fullySettled: 'Fully settled ✓',
      customer: 'Customer',
      lastActivity: 'Last activity:',
      debtAmount: 'Debt Amount (₱)',
      enterCustomerNameDebt: 'Enter customer name',
      saveDebt: 'Save Debt',
      payment: 'Payment',
      manualDebtSaved: 'Debt recorded.',
      paymentSaved: 'Payment recorded.',
      // Reports (embedded in home)
      noTransactions: 'No transactions yet.',
      noData: 'No data available.',
      noLowStock: 'No low-stock items.',
      recentTransactions: 'Recent Transactions',
      bestSelling: 'Best-Selling Products',
      lowStockItems: 'Low-Stock Items',
      totalSales: 'Total Sales',
      profit: 'Profit',
      day: 'Day', week: 'Week', month: 'Month',
      // Help
      replayTutorial: 'Replay Tutorial',
      howToUse: 'How to Use',
      contactInfo: 'Contact / Info',
      aboutApp: 'About App',
      recordingSale: 'Recording a Sale',
      recordingSaleContent: 'Go to Sales and tap "Record Today\'s Sales". Enter your stock expenses and today\'s earnings. The app will automatically show your profit and revolving fund.',
      addingProducts: 'Adding Products',
      addingProductsContent: 'Go to Stocks and tap "Add Stock". Fill in the item name, quantity, cost, and selling price. You can also set a markup percentage to auto-calculate the selling price.',
      trackingDebts: 'Tracking Debts',
      trackingDebtsContent: 'When completing a sale with Debt payment, the debt is recorded automatically. You can also manually add debts from the Utang screen. Tap "Record Payment" on a customer\'s card to log payments.',
      viewingReports: 'Viewing Reports',
      viewingReportsContent: 'Your daily summary is shown on the Home screen. You can see your earnings, stock alerts, outstanding debts, and business tips all in one place.',
      // Settings
      textSize: 'Text Size',
      standard: 'Standard', large: 'Large', extraLarge: 'Extra Large',
      storeInformation: 'Store Information',
      storeName: 'Store Name', ownerName: 'Owner Name', language: 'Language',
      dataManagement: 'Data Management',
      exportData: 'Export Data',
      importData: 'Import Data',
      resetData: 'Reset Sample Data',
      saveSettings: 'Save Settings',
      welcome: 'Welcome to Sari-Sari Smart!',
      setupPrompt: 'Let\'s get started. Tell us about your store.',
      getStarted: 'Get Started',
      storeNamePlaceholder: 'e.g. Maria\'s Store',
      ownerNamePlaceholder: 'e.g. Maria Santos',
      splashSubtitle: 'Your simple store helper',
      aboutContent: 'Sari-Sari Smart v2.0 - A daily business companion for sari-sari store owners.',
      contactContent: 'For questions or feedback: support@sarisarismart.com',
      settingsSaved: 'Settings saved.',
      dataReset: 'Sample data has been reset.',
      dataExported: 'Data exported to console.',
      confirmReset: 'Reset all sample data? This cannot be undone.',
      areYouSure: 'Are you sure?',
      confirm: 'Confirm', cancel: 'Cancel',
      next: 'Next', skip: 'Skip',
      completeSale: 'Complete Sale',
      paymentMode: 'Payment Mode',
      cash: 'Cash', debt: 'Utang',
      amountPaid: 'Amount Paid',
      customerName: 'Customer Name',
      enterCustomerName: 'Enter customer name',
      change: 'Change',
      total: 'Total',
      noProducts: 'No stock items yet.',
      noStock: 'Out of Stock',
      peso: '₱',
      saleSaved: 'Sale recorded.',
      productSaved: 'Item saved.',
      all: 'All',
      backToSales: 'Back to Sales',
      tutorial1: 'Welcome to Sari-Sari Smart! This quick tour will show you around.',
      tutorial2: 'This is the Sales screen. Tap "Record Today\'s Sales" and enter your stock expenses and earnings for the day.',
      tutorial3: 'The Stocks page shows all your items with color-coded status: green = plenty, orange = getting low, red = out of stock.',
      tutorial4: 'Tap any item to update its status or deduct stock when something sells.',
      tutorial5: 'The Utang page tracks customer debts. Tap "New Debt" to add a manual entry, or tap a customer to record payments.',
      tutorial6: 'The Home screen gives you a snapshot of your store: today\'s earnings, stock alerts, debts, and business tips.',
      tutorial7: 'From the Help screen you can replay this tutorial, read the guide, or contact support.',
      tutorial8: 'You\'re all set! Start using Sari-Sari Smart to manage your store.',
    },
    fil: {
      // Nav
      home: 'Home', stocks: 'Stocks', sales: 'Benta', utang: 'Utang', help: 'Tulong',
      settings: 'Settings',
      // Home
      homeGreeting: 'Kamusta ang Tindahan Ngayon?',
      homeSubtitle: 'Kumusta ang iyong tindahan ngayong araw?',
      todayEarnings: 'Kita Ngayon',
      stockAlert: 'Stock Alert',
      itemsLow: 'mga item na kaunti na',
      utangNgayon: 'Utang Ngayon',
      totalOwed: 'Kabuuang utang sa iyo',
      businessTip: 'Tips sa Negosyo',
      endOfDay: 'Pagsasara ng Araw',
      endOfDayDesc: 'Isara ang iyong tindahan para sa araw na ito',
      // Daily Sales
      recordSales: 'I-record ang Benta Ngayon',
      stockExpenses: 'Gastos sa Paninda',
      stockExpensesHint: 'Magkano ang ginastos mo sa paninda ngayon?',
      todayEarningsInput: 'Kinikita Ngayon',
      todayEarningsHint: 'Magkano ang cash na natanggap mo ngayon?',
      grossProfit: 'Gross Profit',
      netProfit: 'Tinantyang Net Profit',
      revolvingFund: 'Pambili ng Paninda',
      saveSales: 'I-save ang Benta Ngayon',
      todayRecorded: 'Naitala na ang benta ngayong araw!',
      todayAlreadyRecorded: 'Ang benta ngayong araw ay naitala na',
      addSpecificSale: 'Magdagdag ng Specific na Benta',
      specificSaleDesc: 'Para sa mga notable na item (hal. malaking utang)',
      itemDesc: 'Paglalarawan ng Item',
      saleAmount: 'Halaga (₱)',
      customerOptional: 'Kostumer (opsyonal)',
      saveSpecificSale: 'I-save ang Benta',
      specificSaleSaved: 'Na-save ang benta.',
      // Stocks
      addStock: 'Magdagdag ng Stock',
      kulangNa: 'Kulang Na',
      kulangNaDesc: 'Mga item na kailangan mong i-restock',
      allItems: 'Lahat ng Item',
      maramiPa: 'Marami Pa',
      medyoKulang: 'Medyo Kulang',
      walaNa: 'Wala Na',
      updateStatus: 'Update Status',
      deductStock: 'Nabenta',
      deductQty: 'Dami ng nabenta',
      stockDeducted: 'Na-update ang stock.',
      stockAdded: 'Naidagdag ang stock.',
      searchProducts: 'Maghanap ng item...',
      edit: 'Baguhin',
      restock: 'Mag-restock',
      lowStock: 'Kaunti ang Stock',
      stockLabel: 'Stock:',
      noStockItems: 'Wala pang stock item. Idagdag ang iyong unang item!',
      noLowStock: 'Walang item na kulang.',
      // Add Stock
      addStockTitle: 'Magdagdag ng Stock',
      itemName: 'Pangalan ng Item',
      quantity: 'Dami',
      costPerUnit: 'Presyo ng Stock bawat Piraso (₱)',
      sellPrice: 'Presyo ng Benta (₱)',
      markupPercent: 'Markup (%)',
      markupHint: 'Sa {percent}% markup, ibenta ito sa',
      suggestedPrice: 'Mungkahi',
      // End of Day
      eodTitle: 'Pagsasara ng Araw',
      eodStep1: 'Cash sa drawer',
      eodStep1Hint: 'Magkano ang cash mo ngayon?',
      eodStep2: 'Stock check',
      eodStep2Hint: 'Mabilis na tingin sa iyong mga item',
      eodStep3: 'Utang payments',
      eodStep3Hint: 'May nagbayad ba ng utang ngayon?',
      eodDone: 'Tapos!',
      eodComplete: 'Tapos na ang Araw!',
      eodSummary: 'Ngayon: Kumita ng {earnings}. Profit: {profit}. Kulang na stock: {lowCount} items. Utang: {debts}.',
      eodStep2Done: 'Nasuri ang {count} items',
      eodStep3Done: 'Naitala ang {count} bayad',
      // Debts / Utang
      newDebt: 'Bagong Utang',
      newDebtManual: 'Bagong Utang',
      totalOutstanding: 'Kabuuang Utang',
      customerDebts: 'Utang ng mga Kostumer',
      noDebts: 'Wala pang naitalang utang.',
      recordPayment: 'Magtala ng Bayad',
      paymentAmount: 'Halaga ng Bayad (₱)',
      note: 'Tandaan (opsyonal)',
      paymentNotePlaceholder: 'Hal. Partial na bayad',
      savePayment: 'I-save ang Bayad',
      remainingAfterPayment: 'Matitira pagkatapos ng bayad:',
      currentBalance: 'Kasalukuyang Balanse',
      debtHistory: 'Kasaysayan ng Utang',
      fullySettled: 'Bayad na lahat ✓',
      customer: 'Kostumer',
      lastActivity: 'Huling aktibidad:',
      debtAmount: 'Halaga ng Utang (₱)',
      enterCustomerNameDebt: 'Ilagay ang pangalan ng kostumer',
      saveDebt: 'I-save ang Utang',
      payment: 'Bayad',
      manualDebtSaved: 'Naitala ang utang.',
      paymentSaved: 'Naitala ang bayad.',
      // Reports
      noTransactions: 'Wala pang transaksyon.',
      noData: 'Walang datos.',
      noLowStock: 'Walang kaunting stock.',
      recentTransactions: 'Mga Kamakailang Transaksyon',
      bestSelling: 'Mga Pinakamabenta',
      lowStockItems: 'Mga Kaunti na ang Stock',
      totalSales: 'Kabuuang Benta',
      profit: 'Kita',
      day: 'Araw', week: 'Linggo', month: 'Buwan',
      // Help
      replayTutorial: 'Balik-aral sa Tutorial',
      howToUse: 'Paano Gamitin',
      contactInfo: 'Contact / Impormasyon',
      aboutApp: 'Tungkol sa App',
      recordingSale: 'Pag-record ng Benta',
      recordingSaleContent: 'Pumunta sa Benta at i-tap ang "I-record ang Benta Ngayon". Ilagay ang gastos sa paninda at ang kinita ngayong araw. Awtomatikong magpapakita ng kita at pambili ng paninda.',
      addingProducts: 'Pagdagdag ng Stock',
      addingProductsContent: 'Pumunta sa Stocks at i-tap ang "Magdagdag ng Stock". Punan ang pangalan, dami, presyo ng stock, at presyo ng benta. Maaari ka ring mag-set ng markup percentage.',
      trackingDebts: 'Pagsubaybay ng Utang',
      trackingDebtsContent: 'Kapag nagbenta gamit ang Utang, awtomatikong naitala ang utang. Maaari ka ring magdagdag ng utang mula sa Utang screen. I-tap ang "Magtala ng Bayad" para mag-log ng mga payment.',
      viewingReports: 'Pagtingin ng Ulat',
      viewingReportsContent: 'Ang iyong daily summary ay makikita sa Home screen. Kita, stock alert, utang, at tips sa negosyo — lahat sa isang lugar.',
      // Settings
      textSize: 'Laki ng Teksto',
      standard: 'Karaniwan', large: 'Malaki', extraLarge: 'Pinakamalaki',
      storeInformation: 'Impormasyon ng Tindahan',
      storeName: 'Pangalan ng Tindahan', ownerName: 'Pangalan ng May-ari', language: 'Wika',
      dataManagement: 'Pamamahala ng Datos',
      exportData: 'I-export ang Datos',
      importData: 'I-import ang Datos',
      resetData: 'I-reset ang Sample Datos',
      saveSettings: 'I-save ang Settings',
      welcome: 'Maligayang pagdating sa Sari-Sari Smart!',
      setupPrompt: 'Magsimula tayo. Sabihin sa amin ang tungkol sa iyong tindahan.',
      getStarted: 'Magsimula',
      storeNamePlaceholder: 'Hal. Tindahan ni Maria',
      ownerNamePlaceholder: 'Hal. Maria Santos',
      splashSubtitle: 'Ang iyong simpleng katulong sa tindahan',
      aboutContent: 'Sari-Sari Smart v2.0 - Isang araw-araw na kasama sa negosyo para sa mga may-ari ng sari-sari store.',
      contactContent: 'Para sa mga tanong o feedback: support@sarisarismart.com',
      settingsSaved: 'Na-save ang settings.',
      dataReset: 'Na-reset ang sample datos.',
      dataExported: 'Na-export ang datos sa console.',
      confirmReset: 'I-reset ang lahat ng sample datos? Hindi ito maaaring i-undo.',
      areYouSure: 'Sigurado ka ba?',
      confirm: 'Kumpirmahin', cancel: 'Kanselahin',
      next: 'Susunod', skip: 'Laktawan',
      completeSale: 'Tapos na Benta',
      paymentMode: 'Paraan ng Pagbabayad',
      cash: 'Perahin', debt: 'Utang',
      amountPaid: 'Halagang Binayad',
      customerName: 'Pangalan ng Kostumer',
      enterCustomerName: 'Ilagay ang pangalan ng kostumer',
      change: 'Sukli',
      total: 'Kabuuan',
      noProducts: 'Wala pang stock item.',
      noStock: 'Walang Stock',
      peso: '₱',
      saleSaved: 'Naitala ang benta.',
      productSaved: 'Na-save ang item.',
      all: 'Lahat',
      backToSales: 'Bumalik sa Benta',
      tutorial1: 'Maligayang pagdating sa Sari-Sari Smart! Ang maikling tour na ito ay magpapakita sa iyo.',
      tutorial2: 'Ito ang Sales screen. I-tap ang "Record Today\'s Sales" at ilagay ang iyong gastos sa paninda at kita para sa araw na ito.',
      tutorial3: 'Ang Stocks page ay nagpapakita ng lahat ng iyong item na may color-coded status: green = marami pa, orange = medyo kulang, red = wala na.',
      tutorial4: 'I-tap ang kahit anong item para i-update ang status nito o bawasan ang stock kapag may naibenta.',
      tutorial5: 'Ang Utang page ay sumusubaybay sa mga utang ng kostumer. I-tap ang "New Debt" para magdagdag ng manu-manong entry, o i-tap ang isang kostumer para magtala ng bayad.',
      tutorial6: 'Ang Home screen ay nagbibigay sa iyo ng snapshot ng iyong tindahan: kita ngayon, stock alert, utang, at tips sa negosyo.',
      tutorial7: 'Mula sa Help screen, maaari mong i-replay ang tutorial na ito, basahin ang gabay, o makipag-ugnayan sa support.',
      tutorial8: 'Handa ka na! Simulan ang paggamit ng Sari-Sari Smart para pamahalaan ang iyong tindahan.',
    }
  };

  // ============================================
  // STATE
  // ============================================
  const state = {
    settings: {
      language: 'en',
      textSize: 'standard',
      storeName: 'My Store',
      ownerName: 'Owner',
      hasCompletedTutorial: false,
      defaultMarkup: 20
    },
    products: [],        // Stock items: { id, name, quantity, costPrice, sellingPrice, unit }
    stockStatuses: {},   // { productId: 'plenty'|'low'|'out' }
    dailyEntries: [],    // { date, stockExpenses, earnings, grossProfit, netProfit, revolvingFund }
    specificSales: [],   // { id, date, description, amount, customerName }
    sales: [],           // Legacy - keep for backward compat
    customers: [],
    debts: [],
    usedCustomerNames: [],
    endOfDayData: {},    // { date: { cashDone, stockDone, debtDone, completed } }
    // Transient state
    saleCart: [],
    salePaymentMode: 'cash',
    editProductId: null,
    restockProductId: null,
    viewingCustomerId: null,
    paymentCustomerId: null,
    selectedPeriod: 'day',
    inventoryFilter: 'all'
  };

  // ============================================
  // DOM REFS
  // ============================================
  const $ = id => document.getElementById(id);
  const dom = {};

  function cacheDom() {
    dom.headerTitle = $('headerTitle');
    dom.settingsBtn = $('settingsBtn');
    dom.bottomNav = $('bottomNav');
    dom.toastContainer = $('toastContainer');
    dom.app = $('app');

    // Confirm modal
    dom.confirmOverlay = $('confirmOverlay');
    dom.confirmIcon = $('confirmIcon');
    dom.confirmTitle = $('confirmTitle');
    dom.confirmMessage = $('confirmMessage');
    dom.confirmYes = $('confirmYes');
    dom.confirmNo = $('confirmNo');

    // Splash / Setup (index)
    dom.splashScreen = $('splashScreen');
    dom.setupOverlay = $('setupOverlay');
    dom.setupStoreName = $('setupStoreName');
    dom.setupOwnerName = $('setupOwnerName');
    dom.setupLanguage = $('setupLanguage');
    dom.btnSetupDone = $('btnSetupDone');

    // Home page
    dom.homeGreeting = $('homeGreeting');
    dom.homeGrid = $('homeGrid');
    dom.eodOverlay = $('eodOverlay');

    // Daily Sales page
    dom.dailyStockExpenses = $('dailyStockExpenses');
    dom.dailyEarnings = $('dailyEarnings');
    dom.dailyResults = $('dailyResults');
    dom.dailyGrossProfit = $('dailyGrossProfit');
    dom.dailyNetProfit = $('dailyNetProfit');
    dom.dailyRevolvingFund = $('dailyRevolvingFund');
    dom.btnSaveDailySales = $('btnSaveDailySales');
    dom.dailyAlreadyRecorded = $('dailyAlreadyRecorded');
    dom.dailyForm = $('dailyForm');
    dom.specificSalesList = $('specificSalesList');

    // Specific sale page (new_sale.html repurposed)
    dom.specificItemDesc = $('specificItemDesc');
    dom.specificAmount = $('specificAmount');
    dom.specificCustomer = $('specificCustomer');
    dom.btnSaveSpecific = $('btnSaveSpecific');
    dom.btnBackSales = $('btnBackSales');

    // Stocks page
    dom.kulangNaSection = $('kulangNaSection');
    dom.kulangNaList = $('kulangNaList');
    dom.allStocksList = $('allStocksList');
    dom.stockSearch = $('stockSearch');
    dom.btnAddStock = $('btnAddStock');
    dom.allItemsLabel = $('allItemsLabel');

    // Stock detail / deduct overlay
    dom.stockDetailOverlay = $('stockDetailOverlay');
    dom.stockDetailName = $('stockDetailName');
    dom.stockDetailQty = $('stockDetailQty');
    dom.stockDetailCost = $('stockDetailCost');
    dom.stockDetailPrice = $('stockDetailPrice');
    dom.stockDeductQty = $('stockDeductQty');
    dom.btnConfirmDeduct = $('btnConfirmDeduct');
    dom.btnStockDetailBack = $('btnStockDetailBack');
    dom.btnUpdateStockStatus = $('btnUpdateStockStatus');
    dom.stockStatusCurrent = $('stockStatusCurrent');

    // Add Stock page
    dom.stockItemName = $('stockItemName');
    dom.stockQty = $('stockQty');
    dom.stockCostPrice = $('stockCostPrice');
    dom.stockSellPrice = $('stockSellPrice');
    dom.stockMarkup = $('stockMarkup');
    dom.markupSuggestion = $('markupSuggestion');
    dom.markupSuggestedPrice = $('markupSuggestedPrice');
    dom.btnSaveStock = $('btnSaveStock');
    dom.btnCancelStock = $('btnCancelStock');
    dom.stockPageTitle = $('stockPageTitle');
    dom.editStockIdHidden = $('editStockIdHidden');

    // Debts/Utang page
    dom.totalDebtAmount = $('totalDebtAmount');
    dom.btnNewDebt = $('btnNewDebt');
    dom.debtsList = $('debtsList');
    dom.customerDebtName = $('customerDebtName');
    dom.customerDebtBalance = $('customerDebtBalance');
    dom.customerDebtHistory = $('customerDebtHistory');
    dom.btnRecordPayment = $('btnRecordPayment');
    dom.customerDebtOverlay = $('customerDebtOverlay');
    dom.btnCustomerDebtBack = $('btnCustomerDebtBack');
    dom.paymentOverlay = $('paymentOverlay');
    dom.paymentCustomerName = $('paymentCustomerName');
    dom.paymentAmount = $('paymentAmount');
    dom.paymentNote = $('paymentNote');
    dom.paymentRemainingPreview = $('paymentRemainingPreview');
    dom.btnSavePayment = $('btnSavePayment');
    dom.btnPaymentBack = $('btnPaymentBack');

    // New Debt page
    dom.btnSaveDebt = $('btnSaveDebt');
    dom.btnNewDebtCancel = $('btnNewDebtCancel');

    // Help page
    dom.helpReplayTutorial = $('helpReplayTutorial');
    dom.helpHowToUse = $('helpHowToUse');
    dom.helpContact = $('helpContact');
    dom.helpAbout = $('helpAbout');
    dom.howToUseOverlay = $('howToUseOverlay');
    dom.btnHowToUseBack = $('btnHowToUseBack');

    // Settings page
    dom.btnSettingsBack = $('btnSettingsBack');
    dom.settingsLanguage = $('settingsLanguage');
    dom.settingsStoreName = $('settingsStoreName');
    dom.settingsOwnerName = $('settingsOwnerName');
    dom.btnSaveSettings = $('btnSaveSettings');
    dom.btnExportData = $('btnExportData');
    dom.btnImportData = $('btnImportData');
    dom.btnResetData = $('btnResetData');

    // Tutorial overlay
    dom.tutorialOverlay = $('tutorialOverlay');
    dom.tutorialBackdrop = $('tutorialBackdrop');
    dom.tutorialHighlight = $('tutorialHighlight');
    dom.tutorialBox = $('tutorialBox');
    dom.tutorialText = $('tutorialText');
    dom.tutorialCurrent = $('tutorialCurrent');
    dom.tutorialTotal = $('tutorialTotal');
    dom.tutorialSkip = $('tutorialSkip');
    dom.tutorialNext = $('tutorialNext');

    // Reports (embedded in home)
    dom.reportTotalSales = $('reportTotalSales');
    dom.reportProfit = $('reportProfit');
    dom.reportTransactionsList = $('reportTransactionsList');
    dom.bestSellersList = $('bestSellersList');
    dom.lowStockList = $('lowStockList');
    dom.periodToggles = $('periodToggles');
    dom.reportSection = $('reportSection');

    // End of day
    dom.eodStep1Input = $('eodStep1Input');
    dom.eodStep1Done = $('eodStep1Done');
    dom.eodStep2Done = $('eodStep2Done');
    dom.eodStep3Done = $('eodStep3Done');
    dom.eodSummaryOverlay = $('eodSummaryOverlay');
    dom.eodSummaryText = $('eodSummaryText');
    dom.eodCloseBtn = $('eodCloseBtn');

    // Nav items
    dom.navItems = document.querySelectorAll('.nav-item');
  }

  // ============================================
  // LOCALIZATION
  // ============================================
  let currentLang = 'en';

  function t(key) {
    const lang = currentLang;
    if (strings[lang] && strings[lang][key] !== undefined) return strings[lang][key];
    if (strings['en'] && strings['en'][key] !== undefined) return strings['en'][key];
    return key;
  }

  function applyLanguage() {
    currentLang = state.settings.language;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      el.placeholder = t(key);
    });
    document.querySelectorAll('[data-i18n-label]').forEach(el => {
      const key = el.dataset.i18nLabel;
      el.setAttribute('aria-label', t(key));
    });
    setPageTitle();
    refreshAll();
  }

  function setPageTitle() {
    if (dom.headerTitle) {
      const titles = {
        index: 'Sari-Sari Smart', sales: t('sales'), new_sale: t('addSpecificSale'),
        inventory: t('stocks'), add_product: t('addStockTitle'),
        home: t('home'),
        debts: t('utang'), new_debt: t('newDebtManual'),
        reports: t('reports'), help: t('help'), setting: t('settings'),
        eod: t('eodTitle')
      };
      dom.headerTitle.textContent = titles[pageName] || 'Sari-Sari Smart';
    }
  }

  // ============================================
  // TEXT SIZE
  // ============================================
  function applyTextSize() {
    if (!dom.app) return;
    dom.app.classList.remove('text-size-large', 'text-size-extra-large');
    if (state.settings.textSize === 'large') dom.app.classList.add('text-size-large');
    else if (state.settings.textSize === 'extra-large') dom.app.classList.add('text-size-extra-large');
  }

  // ============================================
  // SAMPLE DATA
  // ============================================
  function getSampleProducts() {
    return [
      { id: 'p1', name: 'Canned Tuna', costPrice: 18, sellingPrice: 25, quantity: 30, unit: 'can' },
      { id: 'p2', name: 'Instant Noodles', costPrice: 10, sellingPrice: 15, quantity: 8, unit: 'pack' },
      { id: 'p3', name: 'Rice 1kg', costPrice: 45, sellingPrice: 55, quantity: 20, unit: 'kg' },
      { id: 'p4', name: 'Cooking Oil', costPrice: 22, sellingPrice: 30, quantity: 12, unit: 'bottle' },
      { id: 'p5', name: 'Coffee 3in1', costPrice: 5, sellingPrice: 8, quantity: 3, unit: 'sachet' },
      { id: 'p6', name: 'Milk Powder', costPrice: 28, sellingPrice: 38, quantity: 8, unit: 'pack' },
      { id: 'p7', name: 'Bread Loaf', costPrice: 35, sellingPrice: 45, quantity: 3, unit: 'piece' },
      { id: 'p8', name: 'Sardines', costPrice: 15, sellingPrice: 22, quantity: 25, unit: 'can' },
      { id: 'p9', name: 'Shampoo Sachet', costPrice: 3, sellingPrice: 5, quantity: 50, unit: 'sachet' },
      { id: 'p10', name: 'Soap Bar', costPrice: 10, sellingPrice: 16, quantity: 1, unit: 'piece' }
    ];
  }

  function getSampleCustomers() {
    return [
      { id: 'c1', name: 'Aling Rosa' },
      { id: 'c2', name: 'Mang Jose' },
      { id: 'c3', name: 'Teresa' }
    ];
  }

  // ============================================
  // PERSISTENCE
  // ============================================
  function saveState() {
    try {
      localStorage.setItem('sss_settings', JSON.stringify(state.settings));
      localStorage.setItem('sss_products', JSON.stringify(state.products));
      localStorage.setItem('sss_sales', JSON.stringify(state.sales));
      localStorage.setItem('sss_customers', JSON.stringify(state.customers));
      localStorage.setItem('sss_debts', JSON.stringify(state.debts));
      localStorage.setItem('sss_usedNames', JSON.stringify(state.usedCustomerNames));
      localStorage.setItem('sss_stockStatuses', JSON.stringify(state.stockStatuses));
      localStorage.setItem('sss_dailyEntries', JSON.stringify(state.dailyEntries));
      localStorage.setItem('sss_specificSales', JSON.stringify(state.specificSales));
      localStorage.setItem('sss_eodData', JSON.stringify(state.endOfDayData));
    } catch(e) { /* ignore */ }
  }

  function loadState() {
    try {
      const settings = localStorage.getItem('sss_settings');
      const products = localStorage.getItem('sss_products');
      const sales = localStorage.getItem('sss_sales');
      const customers = localStorage.getItem('sss_customers');
      const debts = localStorage.getItem('sss_debts');
      const usedNames = localStorage.getItem('sss_usedNames');
      const stockStatuses = localStorage.getItem('sss_stockStatuses');
      const dailyEntries = localStorage.getItem('sss_dailyEntries');
      const specificSales = localStorage.getItem('sss_specificSales');
      const eodData = localStorage.getItem('sss_eodData');

      if (settings) state.settings = JSON.parse(settings);
      if (products) state.products = JSON.parse(products);
      if (sales) state.sales = JSON.parse(sales);
      if (customers) state.customers = JSON.parse(customers);
      if (debts) state.debts = JSON.parse(debts);
      if (usedNames) state.usedCustomerNames = JSON.parse(usedNames);
      if (stockStatuses) state.stockStatuses = JSON.parse(stockStatuses);
      if (dailyEntries) state.dailyEntries = JSON.parse(dailyEntries);
      if (specificSales) state.specificSales = JSON.parse(specificSales);
      if (eodData) state.endOfDayData = JSON.parse(eodData);

      if (state.products.length === 0) state.products = getSampleProducts();
      if (state.customers.length === 0) state.customers = getSampleCustomers();

      // Initialize stock statuses for products that don't have one
      state.products.forEach(p => {
        if (!state.stockStatuses[p.id]) {
          state.stockStatuses[p.id] = p.quantity > 10 ? 'plenty' : (p.quantity > 0 ? 'low' : 'out');
        }
      });
    } catch(e) {
      state.products = getSampleProducts();
      state.customers = getSampleCustomers();
    }
  }

  // ============================================
  // UTILITY
  // ============================================
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function formatTime(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  function formatCurrency(amount) {
    return '₱' + Number(amount).toFixed(2);
  }

  function todayStr() {
    const d = new Date();
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  function isSameDay(d1, d2) {
    return d1.substring(0, 10) === d2.substring(0, 10);
  }

  function daysAgo(dateStr, days) {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().substring(0, 10);
  }

  function isInPeriod(dateStr, period) {
    const saleDate = dateStr.substring(0, 10);
    const today = todayStr();
    if (period === 'day') return saleDate === today;
    if (period === 'week') return saleDate >= daysAgo(today, 7);
    if (period === 'month') return saleDate >= daysAgo(today, 30);
    return true;
  }

  // ============================================
  // TOAST
  // ============================================
  function showToast(message, type) {
    if (!dom.toastContainer) return;
    type = type || 'success';
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.textContent = message;
    dom.toastContainer.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3000);
  }

  // ============================================
  // CONFIRMATION MODAL
  // ============================================
  let confirmCallback = null;

  function showConfirm(title, message, callback, iconType) {
    if (!dom.confirmOverlay) return;
    dom.confirmTitle.textContent = title || t('areYouSure');
    dom.confirmMessage.textContent = message || '';
    const icon = dom.confirmIcon ? dom.confirmIcon.querySelector('svg') : null;
    if (icon) {
      if (iconType === 'warning') {
        icon.innerHTML = '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>';
        icon.setAttribute('stroke', '#f59e0b');
      } else {
        icon.innerHTML = '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>';
        icon.setAttribute('stroke', '#f59e0b');
      }
    }
    confirmCallback = callback;
    dom.confirmOverlay.classList.add('open');
  }

  function closeConfirm() {
    if (!dom.confirmOverlay) return;
    dom.confirmOverlay.classList.remove('open');
    if (dom.confirmMessage) dom.confirmMessage.style.textAlign = '';
    confirmCallback = null;
  }

  // ============================================
  // REFRESH ALL PAGES
  // ============================================
  function refreshAll() {
    renderHomeDashboard();
    renderStocksList();
    renderDailySalesForm();
    renderDebtsList();
    updateDebtSummary();
    renderReports();
  }

  // ============================================
  // HOME DASHBOARD
  // ============================================
  function renderHomeDashboard() {
    if (!dom.homeGrid) return;

    const today = todayStr();
    const todayEntry = state.dailyEntries.find(e => e.date === today);
    const todaySpecificTotal = getTodaySpecificSalesTotal();
    const todaySales = todayEntry ? todayEntry.earnings : todaySpecificTotal;
    const todayProfit = todayEntry ? todayEntry.netProfit : 0;
    const totalDebt = state.debts.reduce((sum, d) => sum + d.remainingBalance, 0);
    const lowItems = getLowStockItems();
    const endOfDayDone = state.endOfDayData[today] && state.endOfDayData[today].completed;

    dom.homeGrid.innerHTML =
      // Card 1: Today's Earnings
      '<a class="home-card" href="sales.html">' +
        '<div class="home-card-icon green">' +
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' +
        '</div>' +
        '<div class="home-card-info">' +
          '<div class="home-card-label" data-i18n="todayEarnings">' + t('todayEarnings') + '</div>' +
          '<div class="home-card-value green-text">' + formatCurrency(todaySales) + '</div>' +
          '<div class="home-card-sub">' + t('profit') + ': ' + formatCurrency(todayProfit) + '</div>' +
        '</div>' +
      '</a>' +
      // Card 2: Stock Alert
      '<a class="home-card" href="inventory.html">' +
        '<div class="home-card-icon ' + (lowItems.length > 0 ? 'red' : 'green') + '">' +
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/></svg>' +
        '</div>' +
        '<div class="home-card-info">' +
          '<div class="home-card-label" data-i18n="stockAlert">' + t('stockAlert') + '</div>' +
          '<div class="home-card-value ' + (lowItems.length > 0 ? 'red-text' : 'green-text') + '">' + lowItems.length + '</div>' +
          '<div class="home-card-sub">' + t('itemsLow') + '</div>' +
        '</div>' +
      '</a>' +
      // Card 3: Outstanding Debts
      '<a class="home-card" href="debts.html">' +
        '<div class="home-card-icon yellow">' +
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/><path d="M16 12h.01"/><path d="M8 12h.01"/></svg>' +
        '</div>' +
        '<div class="home-card-info">' +
          '<div class="home-card-label" data-i18n="utangNgayon">' + t('utangNgayon') + '</div>' +
          '<div class="home-card-value' + (totalDebt > 0 ? ' red-text' : ' green-text') + '">' + formatCurrency(totalDebt) + '</div>' +
          '<div class="home-card-sub">' + t('totalOwed') + '</div>' +
        '</div>' +
      '</a>' +
      // End of Day button
      '<div class="home-card" id="homeEndOfDay" style="' + (endOfDayDone ? 'opacity:0.6;' : '') + '">' +
        '<div class="home-card-icon blue">' +
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
        '</div>' +
        '<div class="home-card-info">' +
          '<div class="home-card-label" data-i18n="endOfDay">' + t('endOfDay') + '</div>' +
          '<div class="home-card-sub">' + (endOfDayDone ? '✓ ' + t('eodDone') : t('endOfDayDesc')) + '</div>' +
        '</div>' +
      '</div>' +
      // Business Tip
      '<div class="home-tip-card">' +
        '<div class="home-tip-icon">💡</div>' +
        '<div class="home-tip-label" data-i18n="businessTip">' + t('businessTip') + '</div>' +
        '<div class="home-tip-text">' + getBusinessTip() + '</div>' +
      '</div>';

    // Bind end-of-day click
    const eodCard = document.getElementById('homeEndOfDay');
    if (eodCard && !endOfDayDone) {
      eodCard.addEventListener('click', startEndOfDayClose);
    }
  }

  function getBusinessTip() {
    const today = todayStr();
    const todayEntry = state.dailyEntries.find(function(e) { return e.date === today; });
    const totalDebt = state.debts.reduce(function(sum, d) { return sum + d.remainingBalance; }, 0);
    const outOfStock = state.products.filter(function(p) { return state.stockStatuses[p.id] === 'out' || p.quantity <= 0; });
    const lowItems = getLowStockItems();
    const anyLowStock = lowItems.length > 0;
    const anyOutOfStock = outOfStock.length > 0;
    const debtCustomerCount = state.debts.filter(function(d) { return d.remainingBalance > 0; }).length;
    const salesRecorded = todayEntry !== undefined;
    const eodDone = state.endOfDayData[today] && state.endOfDayData[today].completed;
    // Priority 1: Out of stock items — most urgent
    if (anyOutOfStock) {
      var item = outOfStock[0];
      var moreItems = outOfStock.length > 1 ? ' (and ' + (outOfStock.length - 1) + ' more)' : '';
      return '⚠ ' + item.name + ' is out of stock' + moreItems + '. Add it to your shopping list — customers will ask for it!';
    }

    // Priority 2: Low stock items (excludes out-of-stock, which is handled above)
    var trulyLowOnly = lowItems.filter(function(p) { return state.stockStatuses[p.id] !== 'out' && p.quantity > 0; });
    if (trulyLowOnly.length > 0) {
      var lowItem = trulyLowOnly[0];
      var moreLow = trulyLowOnly.length > 1 ? ' (' + (trulyLowOnly.length - 1) + ' more items low)' : '';
      return '⚠ ' + lowItem.name + ' is running low! Only ' + lowItem.quantity + ' left' + moreLow + '. Restock today to avoid running out.';
    }

    // Priority 3: Sales not recorded yet
    if (!salesRecorded) {
      return '📝 Don\'t forget to record today\'s sales! Tap Sales and enter your gastos and kita for the day.';
    }

    // Priority 4: Outstanding debts
    if (totalDebt > 0) {
      var debtSummary = debtCustomerCount === 1 ? '1 customer' : debtCustomerCount + ' customers';
      return '💰 You have ' + formatCurrency(totalDebt) + ' in outstanding utang from ' + debtSummary + '. Tap Utang to check who needs to pay.';
    }

    // Priority 5: Sales recorded but EOD not done
    if (salesRecorded && !eodDone) {
      return '🏁 Sales are recorded! Complete your day with the End-of-Day closing routine to see your full summary.';
    }

    // Priority 6: General positive feedback — all caught up
    if (salesRecorded && eodDone && !anyLowStock && totalDebt === 0) {
      return '📈 Everything is up to date! You\'ve recorded sales, checked stock, and closed the day. Great work!';
    }

    // Fallback: rotating tips based on day
    var fallbackTips = [
      '💡 Check your best-selling items to know what to stock more of.',
      '💡 Sachet items sell fast! Make sure you have enough stock.',
      '💡 Cold drinks sell more on hot days — stock up when the weather is warm.',
      '💡 Save your revolving fund first before spending your profit.',
      '💡 If someone always buys on credit, suggest a weekly payment schedule.',
      '💡 Rice and cooking oil are essentials — always keep them in stock.'
    ];
    var dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    return fallbackTips[dayOfYear % fallbackTips.length];
  }

  function getLowStockItems() {
    return state.products.filter(p => {
      const status = state.stockStatuses[p.id];
      return status === 'low' || status === 'out' || p.quantity <= (p.lowStockThreshold || 5);
    });
  }

  function getTodaySpecificSalesTotal() {
    const today = todayStr();
    return state.specificSales
      .filter(s => isSameDay(s.createdAt || s.date, today))
      .reduce(function(sum, s) { return sum + s.amount; }, 0);
  }

  // ============================================
  // DAILY SALES
  // ============================================
  function renderDailySalesForm() {
    if (!dom.dailyForm) return;

    const today = todayStr();
    const todayEntry = state.dailyEntries.find(e => e.date === today);

    if (todayEntry) {
      // Already recorded
      dom.dailyAlreadyRecorded.style.display = 'block';
      dom.dailyForm.style.display = 'none';
      dom.dailyResults.style.display = 'block';

      dom.dailyGrossProfit.textContent = formatCurrency(todayEntry.grossProfit);
      dom.dailyNetProfit.textContent = formatCurrency(todayEntry.netProfit);
      dom.dailyRevolvingFund.textContent = formatCurrency(todayEntry.revolvingFund);
    } else {
      dom.dailyAlreadyRecorded.style.display = 'none';
      dom.dailyForm.style.display = 'block';
      dom.dailyResults.style.display = 'none';

      // Reset inputs
      if (dom.dailyStockExpenses) dom.dailyStockExpenses.value = '';
      if (dom.dailyEarnings) dom.dailyEarnings.value = '';
    }

    renderSpecificSalesList();
  }

  function renderSpecificSalesList() {
    if (!dom.specificSalesList) return;
    const today = todayStr();
    const todaySpecific = state.specificSales.filter(s => isSameDay(s.createdAt || s.date, today));

    if (todaySpecific.length === 0) {
      dom.specificSalesList.innerHTML = '<div class="empty-state" style="padding:16px 0;">' + t('noTransactions') + '</div>';
    } else {
      dom.specificSalesList.innerHTML = todaySpecific.map(s =>
        '<div class="sale-history-card"><div class="product-card-info"><div class="product-card-name">' +
        s.description + '</div><div class="product-card-details">' +
        formatCurrency(s.amount) + (s.customerName ? ' · ' + s.customerName : '') +
        '</div></div></div>'
      ).join('');
    }
  }

  function recordDailySales() {
    const stockExpenses = parseFloat(dom.dailyStockExpenses ? dom.dailyStockExpenses.value : 0) || 0;
    const earnings = parseFloat(dom.dailyEarnings ? dom.dailyEarnings.value : 0) || 0;

    if (earnings <= 0) {
      showToast('Please enter your earnings for today.', 'error');
      return;
    }

    const grossProfit = earnings - stockExpenses;
    const markupPct = state.settings.defaultMarkup || 10;
    const netProfit = grossProfit * (1 - markupPct / 100);
    const revolvingFund = earnings - (earnings * (markupPct / 100));

    const entry = {
      date: todayStr(),
      stockExpenses: stockExpenses,
      earnings: earnings,
      grossProfit: Math.max(0, grossProfit),
      netProfit: Math.max(0, netProfit),
      revolvingFund: Math.max(0, revolvingFund),
      markupPercentage: markupPct,
      createdAt: new Date().toISOString()
    };

    state.dailyEntries.push(entry);
    saveState();
    showToast(t('todayRecorded'));
    renderDailySalesForm();

    // Show results
    dom.dailyResults.style.display = 'block';
    dom.dailyGrossProfit.textContent = formatCurrency(entry.grossProfit);
    dom.dailyNetProfit.textContent = formatCurrency(entry.netProfit);
    dom.dailyRevolvingFund.textContent = formatCurrency(entry.revolvingFund);
  }

  function saveSpecificSale() {
    const desc = dom.specificItemDesc ? dom.specificItemDesc.value.trim() : '';
    const amount = parseFloat(dom.specificAmount ? dom.specificAmount.value : 0) || 0;
    const customer = dom.specificCustomer ? dom.specificCustomer.value.trim() : '';

    if (!desc || amount <= 0) {
      showToast('Please enter description and amount.', 'error');
      return;
    }

    const sale = {
      id: generateId(),
      date: todayStr(),
      createdAt: new Date().toISOString(),
      description: desc,
      amount: amount,
      customerName: customer || null
    };

    state.specificSales.push(sale);

    // Deduct from inventory if description matches a product name
    const matchedProduct = state.products.find(function(p) {
      return p.name.toLowerCase() === desc.toLowerCase();
    });
    if (matchedProduct && matchedProduct.sellingPrice > 0) {
      var qtySold = Math.round(amount / matchedProduct.sellingPrice);
      if (qtySold > 0 && qtySold <= matchedProduct.quantity) {
        matchedProduct.quantity -= qtySold;
        if (matchedProduct.quantity <= 0) {
          state.stockStatuses[matchedProduct.id] = 'out';
        } else if (matchedProduct.quantity <= (matchedProduct.lowStockThreshold || 5)) {
          state.stockStatuses[matchedProduct.id] = 'low';
        }
      }
    }

    // If customer, also record as debt
    if (customer) {
      let cust = state.customers.find(c => c.name.toLowerCase() === customer.toLowerCase());
      if (!cust) {
        cust = { id: generateId(), name: customer };
        state.customers.push(cust);
      }
      if (!state.usedCustomerNames.includes(customer)) state.usedCustomerNames.push(customer);

      let debt = state.debts.find(d => d.customerName.toLowerCase() === customer.toLowerCase() && d.remainingBalance > 0);
      if (debt) {
        debt.amount += amount;
        debt.remainingBalance += amount;
        debt.updatedAt = new Date().toISOString();
      } else {
        state.debts.push({
          id: generateId(), customerId: cust.id, customerName: cust.name,
          amount: amount, remainingBalance: amount,
          createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), payments: []
        });
      }
    }

    saveState();
    showToast(t('specificSaleSaved'));
    dom.specificItemDesc.value = '';
    dom.specificAmount.value = '';
    if (dom.specificCustomer) dom.specificCustomer.value = '';
    renderSpecificSalesList();
    renderDebtsList();
    updateDebtSummary();
    renderHomeDashboard();
    renderDailySalesForm();
  }

  // ============================================
  // STOCKS
  // ============================================
  function renderStocksList() {
    if (!dom.allStocksList) return;
    var query = dom.stockSearch ? dom.stockSearch.value.toLowerCase() : '';

    var products = state.products;
    if (query) products = products.filter(function(p) { return p.name.toLowerCase().includes(query); });

    // Render "Kulang Na" section — pass query so it filters low items too
    var hasMatchingLowItems = renderKulangNaSection(query);

    // If searching and low-stock items match the query, hide "All Items" to avoid duplicates
    if (query && hasMatchingLowItems) {
      if (dom.allItemsLabel) dom.allItemsLabel.style.display = 'none';
      if (dom.allStocksList) dom.allStocksList.style.display = 'none';
    } else {
      if (dom.allItemsLabel) dom.allItemsLabel.style.display = '';
      if (dom.allStocksList) dom.allStocksList.style.display = '';
    }

    if (products.length === 0 && !hasMatchingLowItems) {
      dom.allStocksList.innerHTML = '<div class="empty-state">' + t('noStockItems') + '</div>';
      return;
    }

    dom.allStocksList.innerHTML = products.map(p => {
      const status = state.stockStatuses[p.id] || 'plenty';
      const statusClass = status === 'plenty' ? 'plenty' : (status === 'low' ? 'low' : 'out');
      const iconPath = status === 'plenty'
        ? '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>'
        : '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>';

      const statusLabels = {
        plenty: '<span class="dot green"></span><span class="label-green">' + t('maramiPa') + '</span>',
        low: '<span class="dot orange"></span><span class="label-orange">' + t('medyoKulang') + '</span>',
        out: '<span class="dot red"></span><span class="label-red">' + t('walaNa') + '</span>'
      };

      return '<div class="stock-card status-' + statusClass + '" data-pid="' + p.id + '">' +
        '<div class="stock-card-icon ' + statusClass + '">' +
          '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + iconPath + '</svg>' +
        '</div>' +
        '<div class="stock-card-info">' +
          '<div class="stock-card-name">' + p.name + '</div>' +
          '<div class="stock-card-status">' + statusLabels[status] + '</div>' +
          '<div class="stock-card-qty">' + p.quantity + ' ' + (p.unit || 'pcs') + '</div>' +
        '</div>' +
        '<button class="stock-card-action" data-action="deduct" data-pid="' + p.id + '">' + t('deductStock') + '</button>' +
      '</div>';
    }).join('');

    // Bind deduct buttons
    dom.allStocksList.querySelectorAll('[data-action="deduct"]').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const pid = this.dataset.pid;
        openDeductStock(pid);
      });
    });

    // Bind card clicks for status update
    dom.allStocksList.querySelectorAll('.stock-card').forEach(card => {
      card.addEventListener('click', function() {
        const pid = this.dataset.pid;
        if (pid) openStockStatusUpdate(pid);
      });
    });
  }

  function renderKulangNaSection(query) {
    if (!dom.kulangNaList) return false;
    var lowItems = getLowStockItems();

    // If searching, filter low items to only those matching the query
    if (query) {
      lowItems = lowItems.filter(function(p) {
        return p.name.toLowerCase().includes(query);
      });
    }

    if (lowItems.length === 0) {
      dom.kulangNaSection.style.display = 'none';
      return false;
    }

    dom.kulangNaSection.style.display = 'block';
    dom.kulangNaList.innerHTML = lowItems.map(function(p) {
      const status = state.stockStatuses[p.id] || 'low';
      return '<div class="stock-card status-' + (status === 'out' ? 'out' : 'low') + '" data-pid="' + p.id + '">' +
        '<div class="stock-card-icon ' + (status === 'out' ? 'out' : 'low') + '">⚠</div>' +
        '<div class="stock-card-info">' +
          '<div class="stock-card-name">' + p.name + '</div>' +
          '<div class="stock-card-qty">' + p.quantity + ' ' + (p.unit || 'pcs') + ' remaining</div>' +
        '</div>' +
        '<button class="stock-card-action" data-action="restock-quick" data-pid="' + p.id + '">' + t('addStock') + '</button>' +
      '</div>';
    }).join('');

    dom.kulangNaList.querySelectorAll('[data-action="restock-quick"]').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        window.location.href = 'add_product.html?restock=' + this.dataset.pid;
      });
    });

    dom.kulangNaList.querySelectorAll('.stock-card').forEach(card => {
      card.addEventListener('click', function() {
        const pid = this.dataset.pid;
        if (pid) openStockStatusUpdate(pid);
      });
    });
  }

  function openStockStatusUpdate(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    if (dom.stockDetailOverlay) {
      dom.stockDetailOverlay.dataset.productId = productId;
      dom.stockDetailName.textContent = product.name;
      dom.stockDetailQty.textContent = product.quantity + ' ' + (product.unit || 'pcs');
      dom.stockDetailCost.textContent = formatCurrency(product.costPrice || 0);
      dom.stockDetailPrice.textContent = formatCurrency(product.sellingPrice || 0);

      // Update edit link with product ID
      const editLink = document.getElementById('stockDetailEditLink');
      if (editLink) editLink.href = 'add_product.html?edit=' + productId;

      // Highlight current status chip
      const currentStatus = state.stockStatuses[productId] || 'plenty';
      const statusChips = document.querySelectorAll('.status-chip');
      statusChips.forEach(function(chip) {
        chip.classList.toggle('active', chip.dataset.status === currentStatus);
      });

      dom.stockDetailOverlay.classList.add('open');
    }
  }

  function closeStockDetail() {
    if (dom.stockDetailOverlay) dom.stockDetailOverlay.classList.remove('open');
  }

  function setStockStatus(productId, status) {
    state.stockStatuses[productId] = status;
    saveState();
    renderStocksList();

    // Update chips highlight
    var statusChips = document.querySelectorAll('.status-chip');
    statusChips.forEach(function(chip) {
      chip.classList.toggle('active', chip.dataset.status === status);
    });
  }

  function openDeductStock(productId) {
    if (dom.stockDetailOverlay) {
      dom.stockDetailOverlay.dataset.productId = productId;
      const product = state.products.find(p => p.id === productId);
      if (product) {
        dom.stockDetailName.textContent = product.name;
        dom.stockDetailQty.textContent = product.quantity + ' ' + (product.unit || 'pcs');
        dom.stockDetailCost.textContent = formatCurrency(product.costPrice || 0);
        dom.stockDetailPrice.textContent = formatCurrency(product.sellingPrice || 0);
        dom.stockDeductQty.value = 1;

        // Update edit link with product ID
        const editLink = document.getElementById('stockDetailEditLink');
        if (editLink) editLink.href = 'add_product.html?edit=' + productId;

        // Highlight current status chip
        const currentStatus = state.stockStatuses[productId] || 'plenty';
        const statusChips = document.querySelectorAll('.status-chip');
        statusChips.forEach(function(chip) {
          chip.classList.toggle('active', chip.dataset.status === currentStatus);
        });

        dom.stockDetailOverlay.classList.add('open');
      }
    }
  }

  function confirmDeductStock() {
    const pid = dom.stockDetailOverlay ? dom.stockDetailOverlay.dataset.productId : null;
    if (!pid) return;

    const qty = parseInt(dom.stockDeductQty ? dom.stockDeductQty.value : 0) || 0;
    const product = state.products.find(p => p.id === pid);
    if (!product || qty <= 0 || qty > product.quantity) {
      showToast('Please enter a valid quantity.', 'error');
      return;
    }

    product.quantity -= qty;

    // Auto-update stock status
    if (product.quantity <= 0) {
      state.stockStatuses[pid] = 'out';
    } else if (product.quantity <= (product.lowStockThreshold || 5)) {
      state.stockStatuses[pid] = 'low';
    }

    saveState();
    closeStockDetail();
    showToast(t('stockDeducted'));
    renderStocksList();
  }

  function saveStockFromPage() {
    const editId = dom.editStockIdHidden ? dom.editStockIdHidden.value : '';
    const name = dom.stockItemName ? dom.stockItemName.value.trim() : '';
    const qty = parseInt(dom.stockQty ? dom.stockQty.value : 0) || 0;
    const costPrice = parseFloat(dom.stockCostPrice ? dom.stockCostPrice.value : 0) || 0;
    const sellingPrice = parseFloat(dom.stockSellPrice ? dom.stockSellPrice.value : 0) || 0;
    const unit = 'piece'; // default

    if (!name) { showToast('Please enter an item name.', 'error'); return; }
    if (sellingPrice <= 0) { showToast('Please enter a selling price.', 'error'); return; }

    if (editId) {
      const product = state.products.find(p => p.id === editId);
      if (product) {
        product.name = name;
        if (qty > 0) product.quantity += qty;
        product.costPrice = costPrice;
        product.sellingPrice = sellingPrice;
        product.lowStockThreshold = product.lowStockThreshold || 5;
      }
    } else {
      state.products.push({
        id: generateId(), name, costPrice, sellingPrice,
        quantity: qty, unit: 'piece', lowStockThreshold: 5
      });
    }

    saveState();
    showToast(t('stockAdded'));
    window.location.href = 'inventory.html';
  }

  function updateMarkupPreview() {
    if (!dom.stockCostPrice || !dom.stockMarkup || !dom.markupSuggestion) return;
    const cost = parseFloat(dom.stockCostPrice.value) || 0;
    const markup = parseFloat(dom.stockMarkup.value) || 0;
    if (cost > 0 && markup > 0) {
      const suggested = cost * (1 + markup / 100);
      dom.markupSuggestion.style.display = 'block';
      dom.markupSuggestedPrice.textContent = formatCurrency(suggested);
    } else {
      dom.markupSuggestion.style.display = 'none';
    }
  }

  // ============================================
  // END-OF-DAY CLOSING
  // ============================================
  function startEndOfDayClose() {
    if (!dom.eodOverlay) return;
    dom.eodStep1Input.value = '';
    dom.eodStep1Done.style.display = 'none';
    dom.eodStep2Done.style.display = 'none';
    dom.eodStep3Done.style.display = 'none';
    dom.eodSummaryOverlay.style.display = 'none';
    dom.eodOverlay.classList.add('open');
  }

  function completeEodStep1() {
    dom.eodStep1Done.style.display = 'flex';
  }

  function completeEodStep2() {
    const lowCount = getLowStockItems().length;
    dom.eodStep2Done.style.display = 'flex';
    dom.eodStep2Done.querySelector('.eod-step-done-text').textContent =
      t('eodStep2Done').replace('{count}', lowCount);
  }

  function completeEodStep3() {
    const todayPayments = state.debts.reduce((count, d) => {
      return count + ((d.payments || []).filter(p => isSameDay(p.date, todayStr())).length);
    }, 0);
    dom.eodStep3Done.style.display = 'flex';
    dom.eodStep3Done.querySelector('.eod-step-done-text').textContent =
      t('eodStep3Done').replace('{count}', todayPayments);
  }

  function finishEndOfDay() {
    const today = todayStr();
    state.endOfDayData[today] = {
      cashDone: true,
      stockDone: true,
      debtDone: true,
      completed: true,
      completedAt: new Date().toISOString()
    };

    const todayEntry = state.dailyEntries.find(e => e.date === today);
    const todaySpecificTotal = getTodaySpecificSalesTotal();
    const earnings = todayEntry ? todayEntry.earnings : todaySpecificTotal;
    const profit = todayEntry ? todayEntry.netProfit : 0;
    const lowCount = getLowStockItems().length;
    const totalDebt = state.debts.reduce((sum, d) => sum + d.remainingBalance, 0);

    const summary = t('eodSummary')
      .replace('{earnings}', formatCurrency(earnings))
      .replace('{profit}', formatCurrency(profit))
      .replace('{lowCount}', lowCount)
      .replace('{debts}', formatCurrency(totalDebt));

    dom.eodSummaryText.textContent = summary;
    dom.eodSummaryOverlay.style.display = 'block';

    saveState();
  }

  // ============================================
  // DEBTS / UTANG RENDER
  // ============================================
  function updateDebtSummary() {
    if (!dom.totalDebtAmount) return;
    const total = state.debts.reduce((sum, d) => sum + d.remainingBalance, 0);
    dom.totalDebtAmount.textContent = formatCurrency(total);
  }

  function renderDebtsList() {
    if (!dom.debtsList) return;
    if (state.debts.length === 0) {
      dom.debtsList.innerHTML = '<div class="empty-state">' + t('noDebts') + '</div>';
      return;
    }

    const sorted = [...state.debts].sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));

    dom.debtsList.innerHTML = sorted.map(d => {
      const isSettled = d.remainingBalance <= 0;
      return '<div class="debt-card" data-cid="' + d.customerId + '" style="' +
        (isSettled ? 'opacity:0.6;' : 'cursor:pointer;') + '">' +
        '<div class="product-card-info">' +
        '<div class="product-card-name">' + d.customerName +
        (isSettled ? ' <span style="color:#16a34a;font-size:12px;font-weight:500;">✓ ' + t('fullySettled') + '</span>' : '') +
        '</div>' +
        '<div class="product-card-details">' +
        '<span class="debt-card-date">' + t('lastActivity') + ' ' + formatDate(d.updatedAt || d.createdAt) + '</span>' +
        '</div>' +
        '</div>' +
        '<div style="text-align:right;">' +
        '<div class="debt-card-balance">' + formatCurrency(d.remainingBalance) + '</div>' +
        (!isSettled ? '<button class="btn-card" data-action="pay" data-cid="' + d.customerId + '">' + t('recordPayment') + '</button>' : '') +
        '</div>' +
        '</div>';
    }).join('');

    // Event delegation
    dom.debtsList._listenerAttached = dom.debtsList._listenerAttached || false;
    if (!dom.debtsList._listenerAttached) {
      dom.debtsList.addEventListener('click', function(e) {
        const card = e.target.closest('.debt-card');
        const payBtn = e.target.closest('[data-action="pay"]');
        if (payBtn) {
          e.stopPropagation();
          openRecordPayment(payBtn.dataset.cid);
          return;
        }
        if (card) {
          const cid = card.dataset.cid;
          if (cid) openCustomerDebt(cid);
        }
      });
      dom.debtsList._listenerAttached = true;
    }
  }

  function openCustomerDebt(customerId) {
    const customer = state.customers.find(c => c.id === customerId);
    const debt = state.debts.find(d => d.customerId === customerId);
    if (!customer || !debt || !dom.customerDebtOverlay) return;

    dom.customerDebtOverlay.dataset.customerId = customerId;
    dom.customerDebtName.textContent = customer.name;
    dom.customerDebtBalance.textContent = formatCurrency(debt.remainingBalance);

    const history = [];
    history.push({ date: debt.createdAt, desc: 'Initial debt', amount: debt.amount, type: 'debit' });
    (debt.payments || []).forEach(p => {
      history.push({ date: p.date, desc: t('payment') + (p.note ? ': ' + p.note : ''), amount: p.amount, type: 'credit' });
    });
    history.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (history.length === 0) {
      dom.customerDebtHistory.innerHTML = '<div class="empty-state">' + t('noData') + '</div>';
    } else {
      dom.customerDebtHistory.innerHTML = history.map(h => {
        return '<div class="debt-history-item">' +
          '<div><div style="font-weight:500;">' + h.desc + '</div><div class="debt-history-desc">' + formatDate(h.date) + '</div></div>' +
          '<div class="debt-history-amount ' + (h.type === 'credit' ? 'negative' : 'positive') + '">' +
          (h.type === 'credit' ? '- ' : '+ ') + formatCurrency(h.amount) + '</div></div>';
      }).join('');
    }

    dom.customerDebtOverlay.classList.add('open');
  }

  function openRecordPayment(customerId) {
    const debt = state.debts.find(d => d.customerId === customerId);
    if (!debt || !dom.paymentOverlay) return;
    dom.paymentOverlay.dataset.customerId = customerId;
    dom.paymentCustomerName.textContent = debt.customerName;
    dom.paymentAmount.value = '';
    dom.paymentNote.value = '';
    dom.paymentRemainingPreview.textContent = formatCurrency(debt.remainingBalance);
    dom.paymentOverlay.classList.add('open');
  }

  // ============================================
  // REPORTS (embedded in home)
  // ============================================
  function renderReports() {
    if (!dom.reportTotalSales) return;
    const period = state.selectedPeriod || 'day';
    const periodSales = state.sales.filter(s => isInPeriod(s.createdAt, period));
    const totalSales = periodSales.reduce((sum, s) => sum + s.total, 0);
    let totalCost = 0;
    periodSales.forEach(sale => {
      sale.items && sale.items.forEach(item => {
        const product = state.products.find(p => p.id === item.productId);
        if (product) totalCost += (product.costPrice || 0) * item.quantity;
      });
    });
    const profit = totalSales - totalCost;

    dom.reportTotalSales.textContent = formatCurrency(totalSales);
    dom.reportProfit.textContent = formatCurrency(profit);

    const recent = [...periodSales].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);
    if (recent.length === 0) {
      dom.reportTransactionsList.innerHTML = '<div class="empty-state">' + t('noTransactions') + '</div>';
    } else {
      dom.reportTransactionsList.innerHTML = recent.map(s => {
        const name = s.customerName || t('cash');
        return '<div class="sale-history-card"><div class="product-card-info"><div class="product-card-name">' +
          formatCurrency(s.total) + '</div><div class="product-card-details">' + formatDate(s.createdAt) + ' &middot; ' + name +
          '</div></div></div>';
      }).join('');
    }

    const productSales = {};
    periodSales.forEach(s => s.items && s.items.forEach(item => { productSales[item.name] = (productSales[item.name] || 0) + item.quantity; }));
    const sorted = Object.entries(productSales).sort((a, b) => b[1] - a[1]).slice(0, 5);
    if (sorted.length === 0) {
      dom.bestSellersList.innerHTML = '<div class="empty-state">' + t('noData') + '</div>';
    } else {
      dom.bestSellersList.innerHTML = sorted.map(([name, qty]) =>
        '<div class="product-card"><div class="product-card-info"><div class="product-card-name">' + name +
        '</div><div class="product-card-details">' + qty + ' sold</div></div></div>'
      ).join('');
    }

    const lowStockItems = getLowStockItems();
    if (lowStockItems.length === 0) {
      dom.lowStockList.innerHTML = '<div class="empty-state">' + t('noLowStock') + '</div>';
    } else {
      dom.lowStockList.innerHTML = lowStockItems.map(p =>
        '<div class="product-card"><div class="product-card-info"><div class="product-card-name">' + p.name +
        '<span class="low-stock-badge">⚠ ' + t('lowStock') + '</span></div><div class="product-card-details">' +
        t('stockLabel') + ' ' + p.quantity + ' ' + (p.unit || 'pcs') + '</div></div></div>'
      ).join('');
    }
  }

  // ============================================
  // PAGE-SPECIFIC INIT FUNCTIONS
  // ============================================

  // --- INDEX (Splash + Setup only) ---
  function initIndexPage() {
    setTimeout(function() {
      if (dom.splashScreen) {
        dom.splashScreen.classList.add('hidden');
        setTimeout(function() {
          if (dom.splashScreen) dom.splashScreen.style.display = 'none';
          if (!state.settings.hasCompletedTutorial && dom.setupOverlay) {
            dom.setupOverlay.classList.add('open');
          } else {
            // Tutorial already completed — go straight to home
            window.location.href = 'home.html';
          }
        }, 500);
      }
    }, 1500);

    if (dom.btnSetupDone) {
      dom.btnSetupDone.addEventListener('click', function() {
        state.settings.storeName = (dom.setupStoreName ? dom.setupStoreName.value.trim() : '') || 'My Store';
        state.settings.ownerName = (dom.setupOwnerName ? dom.setupOwnerName.value.trim() : '') || 'Owner';
        state.settings.language = dom.setupLanguage ? dom.setupLanguage.value : 'en';
        saveState();
        if (dom.setupOverlay) dom.setupOverlay.classList.remove('open');
        window.location.href = 'sales.html?tutorial=true';
      });
    }
  }

  // --- HOME (Dashboard) ---
  function initHomePage() {
    renderHomeDashboard();
    checkTutorialResume();
  }

  // --- SALES (Daily Cash Summary) ---
  function initDailySalesPage() {
    renderDailySalesForm();
    renderSpecificSalesList();

    if (dom.btnSaveDailySales) {
      dom.btnSaveDailySales.addEventListener('click', recordDailySales);
    }

    if (dom.dailyStockExpenses || dom.dailyEarnings) {
      const inputs = [dom.dailyStockExpenses, dom.dailyEarnings].filter(Boolean);
      inputs.forEach(input => {
        input.addEventListener('input', function() {
          const expenses = parseFloat(dom.dailyStockExpenses ? dom.dailyStockExpenses.value : 0) || 0;
          const earnings = parseFloat(dom.dailyEarnings ? dom.dailyEarnings.value : 0) || 0;
          if (earnings > 0) {
            dom.dailyResults.style.display = 'block';
            const gross = Math.max(0, earnings - expenses);
            const markupPct = state.settings.defaultMarkup || 10;
            dom.dailyGrossProfit.textContent = formatCurrency(gross);
            dom.dailyNetProfit.textContent = formatCurrency(Math.max(0, gross * (1 - markupPct / 100)));
            dom.dailyRevolvingFund.textContent = formatCurrency(Math.max(0, earnings - (earnings * (markupPct / 100))));
          } else {
            dom.dailyResults.style.display = 'none';
          }
        });
      });
    }

    // Check for tutorial resume
    const params = new URLSearchParams(window.location.search);
    if (params.get('tutorial') === 'true') {
      startTutorial(false);
    }
  }

  // --- NEW SALE (Add Specific Sale) ---
  function initSpecificSalePage() {
    if (dom.btnSaveSpecific) {
      dom.btnSaveSpecific.addEventListener('click', saveSpecificSale);
    }
    if (dom.btnBackSales) {
      dom.btnBackSales.addEventListener('click', () => window.location.href = 'sales.html');
    }
  }

  // --- INVENTORY (Stocks) ---
  function initStocksPage() {
    renderStocksList();

    if (dom.stockSearch) {
      dom.stockSearch.addEventListener('input', function() { renderStocksList(); });
    }

    if (dom.btnAddStock) {
      dom.btnAddStock.addEventListener('click', () => window.location.href = 'add_product.html');
    }

    // Stock detail overlay
    if (dom.btnStockDetailBack) {
      dom.btnStockDetailBack.addEventListener('click', closeStockDetail);
    }
    // Status chip click handler (event delegation)
    var statusOptions = document.getElementById('stockStatusOptions');
    if (statusOptions) {
      statusOptions.addEventListener('click', function(e) {
        var chip = e.target.closest('.status-chip');
        if (!chip) return;
        var pid = dom.stockDetailOverlay ? dom.stockDetailOverlay.dataset.productId : null;
        if (pid) {
          setStockStatus(pid, chip.dataset.status);
        }
      });
    }
    if (dom.btnConfirmDeduct) {
      dom.btnConfirmDeduct.addEventListener('click', confirmDeductStock);
    }

    // Close overlay on outside click
    if (dom.stockDetailOverlay) {
      dom.stockDetailOverlay.addEventListener('click', function(e) {
        if (e.target === this || e.target.classList.contains('overlay-scroll')) {
          closeStockDetail();
        }
      });
    }

    checkTutorialResume();
  }

  // --- ADD PRODUCT (Add Stock) ---
  function initAddStockPage() {
    const params = new URLSearchParams(window.location.search);
    const editId = params.get('edit');
    const restockId = params.get('restock');

    if (editId) {
      const product = state.products.find(p => p.id === editId);
      if (product) {
        if (dom.stockPageTitle) dom.stockPageTitle.textContent = t('edit') + ' - ' + product.name;
        if (dom.stockItemName) dom.stockItemName.value = product.name;
        if (dom.stockCostPrice) dom.stockCostPrice.value = product.costPrice || '';
        if (dom.stockSellPrice) dom.stockSellPrice.value = product.sellingPrice || '';
        if (dom.stockQty) dom.stockQty.value = product.quantity;
        if (dom.editStockIdHidden) dom.editStockIdHidden.value = editId;
      }
    }

    if (restockId) {
      const product = state.products.find(p => p.id === restockId);
      if (product) {
        if (dom.stockPageTitle) dom.stockPageTitle.textContent = t('restock') + ' - ' + product.name;
        if (dom.stockItemName) { dom.stockItemName.value = product.name; dom.stockItemName.readOnly = true; }
        if (dom.editStockIdHidden) dom.editStockIdHidden.value = restockId;
        // Pre-fill cost and selling price from existing product
        if (dom.stockCostPrice) dom.stockCostPrice.value = product.costPrice || '';
        if (dom.stockSellPrice) dom.stockSellPrice.value = product.sellingPrice || '';
        if (dom.stockMarkup) {
          // Calculate markup from existing cost and selling price
          var cost = product.costPrice || 0;
          var price = product.sellingPrice || 0;
          if (cost > 0) {
            var markup = Math.round(((price - cost) / cost) * 100);
            dom.stockMarkup.value = markup > 0 ? markup : (state.settings.defaultMarkup || 20);
          }
        }
        updateMarkupPreview();
      }
    }

    if (dom.btnSaveStock) {
      dom.btnSaveStock.addEventListener('click', saveStockFromPage);
    }
    if (dom.btnCancelStock) {
      dom.btnCancelStock.addEventListener('click', () => window.location.href = 'inventory.html');
    }

    // Markup calculator
    if (dom.stockCostPrice && dom.stockMarkup) {
      dom.stockCostPrice.addEventListener('input', updateMarkupPreview);
      dom.stockMarkup.addEventListener('input', updateMarkupPreview);
      dom.stockMarkup.value = state.settings.defaultMarkup || 20;
    }

    // Restock quantity handling
    if (restockId && dom.stockQty) {
      dom.stockQty.placeholder = '0';
    }
  }

  // --- DEBTS / UTANG ---
  function initDebtsPage() {
    updateDebtSummary();
    renderDebtsList();
    checkTutorialResume();

    if (dom.btnNewDebt) {
      dom.btnNewDebt.addEventListener('click', () => window.location.href = 'new_debt.html');
    }

    if (dom.btnCustomerDebtBack) {
      dom.btnCustomerDebtBack.addEventListener('click', () => {
        if (dom.customerDebtOverlay) dom.customerDebtOverlay.classList.remove('open');
      });
    }
    if (dom.btnRecordPayment) {
      dom.btnRecordPayment.addEventListener('click', function() {
        if (dom.customerDebtOverlay && dom.customerDebtOverlay.dataset.customerId) {
          openRecordPayment(dom.customerDebtOverlay.dataset.customerId);
        }
      });
    }
    if (dom.btnPaymentBack) {
      dom.btnPaymentBack.addEventListener('click', () => {
        if (dom.paymentOverlay) dom.paymentOverlay.classList.remove('open');
      });
    }
    if (dom.btnSavePayment) {
      dom.btnSavePayment.addEventListener('click', function() {
        const cid = dom.paymentOverlay ? dom.paymentOverlay.dataset.customerId : null;
        const debt = cid ? state.debts.find(d => d.customerId === cid) : null;
        if (debt) {
          const amount = parseFloat(dom.paymentAmount ? dom.paymentAmount.value : 0) || 0;
          const note = dom.paymentNote ? dom.paymentNote.value.trim() : '';
          if (amount <= 0) { showToast('Please enter a valid payment amount.', 'error'); return; }
          if (amount > debt.remainingBalance) { showToast('Payment exceeds remaining balance.', 'error'); return; }
          debt.remainingBalance -= amount;
          debt.updatedAt = new Date().toISOString();
          debt.payments = debt.payments || [];
          debt.payments.push({ id: generateId(), amount, note, date: new Date().toISOString() });
          saveState();
          if (dom.paymentOverlay) dom.paymentOverlay.classList.remove('open');
          if (dom.customerDebtOverlay) dom.customerDebtOverlay.classList.remove('open');
          showToast(t('paymentSaved'));
          updateDebtSummary();
          renderDebtsList();
        }
      });
    }

    if (dom.paymentAmount) {
      dom.paymentAmount.addEventListener('input', function() {
        const amount = parseFloat(this.value) || 0;
        const cid = dom.paymentOverlay ? dom.paymentOverlay.dataset.customerId : null;
        const debt = cid ? state.debts.find(d => d.customerId === cid) : null;
        if (debt && dom.paymentRemainingPreview) {
          dom.paymentRemainingPreview.textContent = formatCurrency(Math.max(0, debt.remainingBalance - amount));
        }
      });
    }
  }

  // --- NEW DEBT ---
  function initNewDebtPage() {
    if (dom.btnSaveDebt) {
      dom.btnSaveDebt.addEventListener('click', function() {
        const nameInput = document.getElementById('newDebtCustomerName');
        const amountInput = document.getElementById('newDebtAmount');
        const name = nameInput ? nameInput.value.trim() : '';
        const amount = parseFloat(amountInput ? amountInput.value : 0) || 0;

        if (!name) { showToast('Please enter customer name.', 'error'); return; }
        if (amount <= 0) { showToast('Please enter valid amount.', 'error'); return; }

        let customer = state.customers.find(c => c.name.toLowerCase() === name.toLowerCase());
        if (!customer) { customer = { id: generateId(), name }; state.customers.push(customer); }
        if (!state.usedCustomerNames.includes(name)) state.usedCustomerNames.push(name);

        let debt = state.debts.find(d => d.customerName.toLowerCase() === name.toLowerCase() && d.remainingBalance > 0);
        if (debt) { debt.amount += amount; debt.remainingBalance += amount; debt.updatedAt = new Date().toISOString(); }
        else { state.debts.push({ id: generateId(), customerId: customer.id, customerName: customer.name, amount, remainingBalance: amount, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), payments: [] }); }

        saveState();
        showToast(t('manualDebtSaved'));
        window.location.href = 'debts.html';
      });
    }
    if (dom.btnNewDebtCancel) {
      dom.btnNewDebtCancel.addEventListener('click', () => window.location.href = 'debts.html');
    }
  }

  // --- REPORTS (embedded in home) ---
  function initReportsPage() {
    state.selectedPeriod = 'day';
    renderReports();

    if (dom.periodToggles) {
      dom.periodToggles.querySelectorAll('.period-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          dom.periodToggles.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
          this.classList.add('active');
          state.selectedPeriod = this.dataset.period;
          renderReports();
        });
      });
    }
  }

  // --- HELP ---
  function initHelpPage() {
    checkTutorialResume();
    if (dom.helpReplayTutorial) {
      dom.helpReplayTutorial.addEventListener('click', () => window.location.href = 'sales.html?tutorial=true');
    }
    if (dom.helpHowToUse) {
      dom.helpHowToUse.addEventListener('click', () => { if (dom.howToUseOverlay) dom.howToUseOverlay.classList.add('open'); });
    }
    if (dom.btnHowToUseBack) {
      dom.btnHowToUseBack.addEventListener('click', () => { if (dom.howToUseOverlay) dom.howToUseOverlay.classList.remove('open'); });
    }
    if (dom.helpContact) {
      dom.helpContact.addEventListener('click', () => showToast(t('contactContent')));
    }
    if (dom.helpAbout) {
      dom.helpAbout.addEventListener('click', () => showToast(t('aboutContent')));
    }
  }

  // --- SETTING ---
  function initSettingPage() {
    if (dom.btnSettingsBack) {
      const params = new URLSearchParams(window.location.search);
      const fromPage = params.get('from');
      dom.btnSettingsBack.href = (fromPage && fromPage !== 'setting') ? fromPage + '.html' : 'index.html';
    }

    if (dom.settingsLanguage) dom.settingsLanguage.value = state.settings.language;
    if (dom.settingsStoreName) dom.settingsStoreName.value = state.settings.storeName || '';
    if (dom.settingsOwnerName) dom.settingsOwnerName.value = state.settings.ownerName || '';

    document.querySelectorAll('.text-size-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.size === state.settings.textSize);
      btn.addEventListener('click', function() {
        document.querySelectorAll('.text-size-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
      });
    });

    if (dom.btnSaveSettings) {
      dom.btnSaveSettings.addEventListener('click', function() {
        state.settings.language = dom.settingsLanguage ? dom.settingsLanguage.value : 'en';
        state.settings.textSize = document.querySelector('.text-size-btn.active')?.dataset.size || 'standard';
        state.settings.storeName = (dom.settingsStoreName ? dom.settingsStoreName.value.trim() : '') || 'My Store';
        state.settings.ownerName = (dom.settingsOwnerName ? dom.settingsOwnerName.value.trim() : '') || 'Owner';
        applyLanguage();
        applyTextSize();
        saveState();
        showToast(t('settingsSaved'));
      });
    }

    if (dom.btnExportData) {
      dom.btnExportData.addEventListener('click', function() {
        console.log('Sari-Sari Smart Data Export:', {
          settings: state.settings, products: state.products,
          sales: state.sales, customers: state.customers,
          debts: state.debts, dailyEntries: state.dailyEntries,
          stockStatuses: state.stockStatuses
        });
        showToast(t('dataExported'));
      });
    }

    if (dom.btnImportData) {
      dom.btnImportData.addEventListener('click', () => showToast('Import feature coming soon.', 'error'));
    }

    if (dom.btnResetData) {
      dom.btnResetData.addEventListener('click', function() {
        showConfirm(t('confirmReset'), t('confirmReset'), function() {
          state.products = getSampleProducts();
          state.sales = [];
          state.debts = [];
          state.customers = getSampleCustomers();
          state.usedCustomerNames = [];
          state.dailyEntries = [];
          state.specificSales = [];
          state.stockStatuses = {};
          state.endOfDayData = {};
          state.settings.hasCompletedTutorial = false;
          saveState();
          closeConfirm();
          showToast(t('dataReset'));
        }, 'warning');
      });
    }
  }

  // ============================================
  // TUTORIAL STATE PERSISTENCE
  // ============================================
  function saveTutorialState(step, isReplay) {
    try { localStorage.setItem('sss_tutorial', JSON.stringify({ step: step, isReplay: isReplay })); } catch(e) {}
  }

  function loadTutorialState() {
    try { var data = localStorage.getItem('sss_tutorial'); return data ? JSON.parse(data) : null; } catch(e) { return null; }
  }

  function clearTutorialState() {
    try { localStorage.removeItem('sss_tutorial'); } catch(e) {}
  }

  // ============================================
  // TUTORIAL
  // ============================================
  const tutorialSteps = [
    { textKey: 'tutorial1', highlight: null, page: 'sales', align: 'auto' },
    { textKey: 'tutorial2', highlight: '#btnSaveDailySales', page: 'sales', align: 'auto' },
    { textKey: 'tutorial3', highlight: '#btnAddStock', page: 'inventory', align: 'auto' },
    { textKey: 'tutorial4', highlight: null, page: 'inventory', align: 'auto' },
    { textKey: 'tutorial5', highlight: '#btnNewDebt', page: 'debts', align: 'auto' },
    { textKey: 'tutorial6', highlight: null, page: 'home', align: 'auto' },
    { textKey: 'tutorial7', highlight: null, page: 'help', align: 'auto' },
    { textKey: 'tutorial8', highlight: null, page: 'help', align: 'auto' }
  ];

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

  function startTutorial(isReplay) {
    if (!dom.tutorialOverlay) return;
    state._tutorialActive = true;
    state._tutorialReplay = isReplay || false;
    state._tutorialStep = 0;

    clearTutorialState();
    dom.tutorialOverlay.style.display = 'flex';
    dom.tutorialOverlay.classList.add('active');
    if (dom.tutorialSkip) dom.tutorialSkip.style.display = isReplay ? 'block' : 'none';

    renderTutorialStep();
  }

  function resumeTutorial(savedState) {
    if (!dom.tutorialOverlay || !savedState) return false;
    state._tutorialActive = true;
    state._tutorialReplay = savedState.isReplay || false;
    state._tutorialStep = savedState.step || 0;

    dom.tutorialOverlay.style.display = 'flex';
    dom.tutorialOverlay.classList.add('active');
    if (dom.tutorialSkip) dom.tutorialSkip.style.display = state._tutorialReplay ? 'block' : 'none';

    renderTutorialStep();
    return true;
  }

  function renderTutorialStep() {
    if (!dom.tutorialOverlay) return;
    var stepIndex = state._tutorialStep || 0;
    var step = tutorialSteps[stepIndex];
    if (!step) { endTutorial(); return; }

    if (dom.tutorialText) dom.tutorialText.textContent = t(step.textKey);
    if (dom.tutorialCurrent) dom.tutorialCurrent.textContent = stepIndex + 1;
    if (dom.tutorialTotal) dom.tutorialTotal.textContent = tutorialSteps.length;

    if (dom.tutorialHighlight) {
      if (step.highlight) {
        var target = document.querySelector(step.highlight);
        if (target) {
          var rect = target.getBoundingClientRect();
          var overlayRect = dom.tutorialOverlay.getBoundingClientRect();
          dom.tutorialHighlight.style.display = 'block';
          dom.tutorialHighlight.style.left = (rect.left - overlayRect.left - 4) + 'px';
          dom.tutorialHighlight.style.top = (rect.top - overlayRect.top - 4) + 'px';
          dom.tutorialHighlight.style.width = (rect.width + 8) + 'px';
          dom.tutorialHighlight.style.height = (rect.height + 8) + 'px';
        } else dom.tutorialHighlight.style.display = 'none';
      } else dom.tutorialHighlight.style.display = 'none';
    }

    if (dom.tutorialBox) {
      dom.tutorialBox.style.alignSelf = getTutorialBoxAlignment(step.highlight);
    }
  }

  function advanceTutorial() {
    if (!dom.tutorialOverlay) return;
    var nextStep = (state._tutorialStep || 0) + 1;
    if (nextStep >= tutorialSteps.length) {
      endTutorial();
      return;
    }
    var nextStepData = tutorialSteps[nextStep];
    var currentPage = pageName;

    if (nextStepData.page && nextStepData.page !== currentPage) {
      saveTutorialState(nextStep, state._tutorialReplay);
      window.location.href = nextStepData.page + '.html?tutorial=true';
    } else {
      state._tutorialStep = nextStep;
      renderTutorialStep();
    }
  }

  function endTutorial() {
    if (!dom.tutorialOverlay) return;
    state._tutorialActive = false;
    dom.tutorialOverlay.style.display = 'none';
    dom.tutorialOverlay.classList.remove('active');
    clearTutorialState();
    if (!state._tutorialReplay) {
      state.settings.hasCompletedTutorial = true;
      saveState();
    }
  }

  function checkTutorialResume() {
    var params = new URLSearchParams(window.location.search);
    if (params.get('tutorial') === 'true') {
      var saved = loadTutorialState();
      if (saved && saved.step !== undefined) {
        var stepData = tutorialSteps[saved.step];
        if (stepData && stepData.page === pageName) {
          resumeTutorial(saved);
          return true;
        }
      }
      if (dom.tutorialOverlay) {
        if (pageName === 'sales') {
          startTutorial(false);
        } else {
          window.location.href = 'sales.html?tutorial=true';
        }
        return true;
      }
    }
    return false;
  }

  // ============================================
  // MAIN INIT
  // ============================================
  function init() {
    cacheDom();
    loadState();
    applyLanguage();
    applyTextSize();

    // Set active nav based on page mapping
    const pageToNav = {
      'home': 'home',
      'new_sale': 'sales',
      'new_debt': 'debts',
      'add_product': 'inventory'
    };
    if (dom.navItems) {
      dom.navItems.forEach(item => {
        const navPage = item.dataset.page;
        const activePage = pageToNav[pageName] || pageName;
        item.classList.toggle('active', navPage === activePage);
      });
    }

    // Determine referring page
    const referrerPage = pageToNav[pageName] || pageName;

    // Settings button
    if (dom.settingsBtn) {
      dom.settingsBtn.setAttribute('href', pageName === 'setting' ? 'home.html' : 'setting.html?from=' + referrerPage);
      dom.settingsBtn.addEventListener('click', function(e) {
        if (this.tagName === 'A') return;
        window.location.href = this.getAttribute('href') || 'setting.html';
      });
    }

    // Make settings button a link
    if (dom.settingsBtn && dom.settingsBtn.tagName !== 'A') {
      const link = document.createElement('a');
      link.href = pageName === 'setting' ? 'home.html' : 'setting.html?from=' + referrerPage;
      link.className = dom.settingsBtn.className;
      link.id = dom.settingsBtn.id;
      link.setAttribute('aria-label', dom.settingsBtn.getAttribute('aria-label') || 'Settings');
      link.innerHTML = dom.settingsBtn.innerHTML;
      dom.settingsBtn.parentNode.replaceChild(link, dom.settingsBtn);
      dom.settingsBtn = link;
    }

    // Bind confirm modal events
    if (dom.confirmNo) dom.confirmNo.addEventListener('click', closeConfirm);
    if (dom.confirmYes) {
      dom.confirmYes.addEventListener('click', function() {
        if (confirmCallback) confirmCallback();
      });
    }

    // Tutorial events
    if (dom.tutorialSkip) dom.tutorialSkip.addEventListener('click', endTutorial);
    if (dom.tutorialNext) {
      dom.tutorialNext.addEventListener('click', advanceTutorial);
    }

    // Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        if (dom.confirmOverlay && dom.confirmOverlay.classList.contains('open')) closeConfirm();
        else if (dom.tutorialOverlay && dom.tutorialOverlay.classList.contains('active')) endTutorial();
      }
    });

    // Run page-specific init
    switch (pageName) {
      case 'index': initIndexPage(); break;
      case 'home': initHomePage(); break;
      case 'sales': initDailySalesPage(); break;
      case 'new_sale': initSpecificSalePage(); break;
      case 'inventory': initStocksPage(); break;
      case 'add_product': initAddStockPage(); break;
      case 'debts': initDebtsPage(); break;
      case 'new_debt': initNewDebtPage(); break;
      case 'reports': initReportsPage(); break;
      case 'help': initHelpPage(); break;
      case 'setting': initSettingPage(); break;
      default: initHomePage(); break;
    }

    setPageTitle();
    refreshAll();
  }

  // Expose EOD functions to window for inline onclick handlers
  window.completeEodStep1 = function() {
    const cash = parseFloat(document.getElementById('eodStep1Input') ? document.getElementById('eodStep1Input').value : 0) || 0;
    const el = document.getElementById('eodStep1Done');
    if (el) {
      el.style.display = 'flex';
      if (cash > 0) {
        el.querySelector('.eod-step-done-text').textContent = 'Cash: ' + formatCurrency(cash);
      }
    }
  };
  window.completeEodStep2 = function() {
    const el = document.getElementById('eodStep2Done');
    if (el) {
      el.style.display = 'flex';
      const lowCount = getLowStockItems().length;
      el.querySelector('.eod-step-done-text').textContent = t('eodStep2Done').replace('{count}', lowCount);
    }
  };
  window.completeEodStep3 = function() {
    const el = document.getElementById('eodStep3Done');
    if (el) {
      el.style.display = 'flex';
      const todayPayments = state.debts.reduce(function(count, d) {
        return count + ((d.payments || []).filter(function(p) { return isSameDay(p.date, todayStr()); }).length);
      }, 0);
      el.querySelector('.eod-step-done-text').textContent = t('eodStep3Done').replace('{count}', todayPayments);
    }
  };
  window.finishEndOfDay = function() {
    const today = todayStr();
    state.endOfDayData[today] = {
      cashDone: true, stockDone: true, debtDone: true,
      completed: true, completedAt: new Date().toISOString()
    };
    const todayEntry = state.dailyEntries.find(function(e) { return e.date === today; });
    var todaySpecificTotal = getTodaySpecificSalesTotal();
    const earnings = todayEntry ? todayEntry.earnings : todaySpecificTotal;
    const profit = todayEntry ? todayEntry.netProfit : 0;
    const lowCount = getLowStockItems().length;
    const totalDebt = state.debts.reduce(function(sum, d) { return sum + d.remainingBalance; }, 0);
    const summary = t('eodSummary')
      .replace('{earnings}', formatCurrency(earnings))
      .replace('{profit}', formatCurrency(profit))
      .replace('{lowCount}', lowCount)
      .replace('{debts}', formatCurrency(totalDebt));
    var summaryEl = document.getElementById('eodSummaryText');
    if (summaryEl) summaryEl.textContent = summary;
    var summaryOverlay = document.getElementById('eodSummaryOverlay');
    if (summaryOverlay) summaryOverlay.style.display = 'block';
    saveState();
  };

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
