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
      'headerGreeting', 'headerPageTitle', 'appContent',
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
      'tutorialSkip', 'tutorialPrev', 'tutorialNext', 'markupSuggestion', 'markupHint', 'markupSuggestedPrice',
      'newDebtCustomer', 'newDebtAmount', 'newDebtSuggestions',
      'pdProductTitle', 'pdContainer', 'pdDeductQty',
      'cddBalanceCard', 'cddRecordPaymentBtn', 'cddLedger', 'debtorDetailName',
      'rpAmountField', 'rpRemainingPreview', 'rpNoteField', 'rpPayBtn', 'rpCustomerCard',
      'reportPeriodToggle', 'reportSummaryCards', 'reportBestSellers', 'reportRecentTx', 'reportLowStock',
      'helpTutSelector', 'helpHowTo', 'helpContact', 'helpAbout', 'howToList', 'tutorialSelector',
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
      greetingMorning: 'Good morning!',
      greetingAfternoon: 'Good afternoon!',
      greetingEvening: 'Good evening!',
      pageMorning: 'Morning',
      pageDay: 'Day',
      pageClosing: 'Close',
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
      overdueTitle: 'The store wasn\'t closed',
      overdueDesc: 'Opened {date} · Open for {n} days',
      overdueCloseStart: 'Close Old Day & Start Today',
      overdueReview: 'Review Last Day\'s Sales',
      overdueReviewTitle: 'Last Day\'s Sales',
      overdueReviewEmpty: 'No sales recorded that day.',
      overdueReviewTotal: 'Total',
      overdueArchivedToast: 'Previous day\'s sales saved safely. New day started!',
      overdueRedirect: 'Please close the previous day on the Morning page.',
      overdueDevConfirm: 'A developer date override is active. This archives the previous day\'s sales into real history — permanent if the tab is closed before clearing the override. Continue?',
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
    close: 'Close',
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
      setupTitle: 'Welcome to Sari-Sari Smart!',
      setupSubtitle: "Let's get started. Tell us about your store.",
      setupStorePlaceholder: "e.g. Maria's Store",
      setupOwnerPlaceholder: 'e.g. Maria Santos',
      productName: 'Product Name',
      productQty: 'Quantity',
      productCost: 'Cost Price',
      productPrice: 'Selling Price',
      productMarkup: 'Markup (%)',
      markupHint: 'At {pct}% markup, sell at {price}',
      newDebtCustomer: 'Customer Name',
      newDebtAmount: 'Debt Amount',
      newDebtTitle: 'New Debt',
      saveDebt: 'Save Debt',
      enterCustomerNameDebt: 'Enter customer name',
      saved: 'Saved!',
      saleSaved: 'Sale recorded!',
      debtSaved: 'Debt recorded!',
      paymentSaved: 'Payment recorded!',
      currentBalance: 'Current Balance',
      recordPayment: 'Record Payment',
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
      prev: 'Previous',
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
      // New Debt tutorial
      tutNewDebt: 'New Debt Tutorial',
      newDebtTutorial1: 'This page lets you manually record a new debt for a customer.',
      newDebtTutorial2: 'Enter the customer\'s name. If they\'re a new customer, they\'ll be added automatically.',
      newDebtTutorial3: 'Enter the debt amount. This will be added to the customer\'s existing balance.',
      newDebtTutorial4: 'Tap "Save Debt" to record it. You can view all debts on the Debts page.',
      // v3.0 parity pages (Product Detail / Debtor Detail / Record Payment / Reports / Help)
      tutProductDetail: 'Product Detail Tutorial',
      tutDebtorDetail: 'Customer Debt Detail Tutorial',
      tutRecordPayment: 'Record Payment Tutorial',
      tutReport: 'Reports Tutorial',
      tutHelp: 'Help Tutorial',
      productDetailTutorial1: 'This page shows everything about a product: name, unit, stock quantity, cost price, selling price, and profit margin.',
      productDetailTutorial2: 'A color-coded alert appears when stock is running low or out of stock.',
      productDetailTutorial3: 'Deduct sold or damaged stock, restock, or edit the product details from this page.',
      productDetailTutorial4: 'Use Delete to permanently remove the product — with a confirmation first.',
      customerDebtDetailTutorial1: 'This page shows a customer\'s utang: current balance, total debt, and total collected.',
      customerDebtDetailTutorial2: 'The ledger below lists every debt addition and payment with its date and running balance.',
      customerDebtDetailTutorial3: 'Green rows are debt added to the customer; orange rows are payments received.',
      customerDebtDetailTutorial4: 'Tap Record Payment to accept a payment against this debt.',
      customerDebtDetailTutorial5: 'When the balance reaches zero, the debt is marked fully settled.',
      recordPaymentTutorial1: 'Enter how much the customer is paying against their current balance.',
      recordPaymentTutorial2: 'The remaining balance preview updates instantly as you type.',
      recordPaymentTutorial3: 'Add an optional note, like "paid in cash" or "partial payment".',
      recordPaymentTutorial4: 'Tap Pay to save the payment. The balance and history update automatically.',
      reportTutorial1: 'The Reports page shows your store\'s sales performance over time.',
      reportTutorial2: 'Use the toggle buttons to switch between Daily, Weekly, and Monthly views.',
      reportTutorial3: 'The summary cards show total sales and profit for the selected period.',
      reportTutorial4: 'Recent transactions appear here with details on each sale. Scroll to see more.',
      reportTutorial5: 'The Best-Selling Products section shows your top-performing items.',
      reportTutorial6: 'Low-stock items are listed here so you know what needs restocking.',
      helpTutorial1: 'This is the Help page — your guide to using Sari-Sari Smart effectively.',
      helpTutorial2: 'The Tutorial Selector lets you choose from different tutorials. Select a tutorial from the dropdown and tap "Launch" to start a guided tour of any page.',
      helpTutorial3: 'The "How to Use" button opens a detailed guide with step-by-step instructions for recording sales, adding stock, tracking debts, viewing reports, and customizing settings.',
      helpTutorial4: 'The Contact section shows how to reach support for questions or feedback about the app.',
      helpTutorial5: 'The About section tells you about the app version and its purpose.',
      helpTutorial6: 'You can also access page-specific tutorials from any page by tapping the (?) Help button in the top-right corner of the header.',
      pdTitle: 'Product Detail',
      criticalStockAlert: '⚠️ Critical Stock Alert',
      criticalAlertDesc: 'This item is out of stock. Restock soon.',
      stockLabel: 'Stock',
      sellPrice: 'Selling Price',
      profitMargin: 'Profit Margin',
      deductStock: 'Deduct Stock',
      deductBtn: 'Deduct',
      restockBtn: 'Restock',
      editBtn: 'Edit',
      deleteBtn: 'Delete',
      confirmDeleteProduct: 'Delete this product from your inventory?',
      productNotFound: 'Product not found',
      fullySettled: '✅ Fully Settled',
      lastActivity: 'Last activity:',
      debtHistory: 'Debt History',
      descHeader: 'Description',
      amountHeader: 'Amount',
      balanceHeader: 'Balance',
      initialDebt: 'Initial',
      totalCollected: 'Total Collected',
      customerNotFound: 'Customer not found',
      paymentAmount: 'Payment Amount',
      paymentExceeds: 'Amount exceeds the balance',
      enterAmount: 'Enter a valid amount.',
      note: 'Note',
      paymentNotePlaceholder: 'e.g. paid in cash',
      savePayment: 'Save Payment',
      reportsTitle: 'Reports',
      periodDay: 'Day',
      periodWeek: 'Week',
      periodMonth: 'Month',
      totalSales: 'Total Sales',
      reportsProfit: 'Profit',
      bestSelling: 'Best-Selling Products',
      recentTransactions: 'Recent Transactions',
      lowStockItems: 'Low Stock Items',
      noData: 'No data yet',
      helpTitle: 'Help',
      replayTutorial: 'Replay Tutorial',
      howToUse: 'How to Use',
      contactInfo: 'Contact',
      aboutApp: 'About App',
      contactText: 'For questions or feedback, email support@sarisarismart.com',
      aboutText: 'Sari-Sari Smart v3.0 — a store management app for sari-sari store owners.',
      howToSales: 'Record your daily cash sales and specific item sales on the Sales page.',
      howToStock: 'Add products, restock, and track inventory levels on the Stocks page.',
      howToDebts: 'Track customer debts and record payments on the Debts page.',
      howToReports: 'View your store\'s performance on the Reports page.',
      howToSettings: 'Customize language, text size, store and owner name in Settings.',
      moreSection: 'More',
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
      greetingMorning: 'Magandang umaga!',
      greetingAfternoon: 'Magandang hapon!',
      greetingEvening: 'Magandang gabi!',
      pageMorning: 'Umaga',
      pageDay: 'Araw',
      pageClosing: 'Isara',
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
      overdueTitle: 'Hindi pa isinara ang tindahan',
      overdueDesc: 'Binuksan noong {date} · Bukas na sa loob ng {n} na araw',
      overdueCloseStart: 'Isara ang dating araw at simulan ang bago',
      overdueReview: 'Tingnan ang Benta ng Nakaraang Araw',
      overdueReviewTitle: 'Benta ng Nakaraang Araw',
      overdueReviewEmpty: 'Walang naitalang benta sa araw na iyon.',
      overdueReviewTotal: 'Kabuuan',
      overdueArchivedToast: 'Na-save nang ligtas ang benta ng nakaraang araw. Nagsimula na ang bagong araw!',
      overdueRedirect: 'Pakiusap, isara muna ang nakaraang araw sa pahina ng Umaga.',
      overdueDevConfirm: 'Aktibo ang developer date override. Aarkibuhin nito ang benta ng nakaraang araw sa totoong history — permanente ito kung isasara ang tab bago i-clear ang override. Magpatuloy?',
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
    close: 'Isara',
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
      setupTitle: 'Maligayang pagdating sa Sari-Sari Smart!',
      setupSubtitle: 'Magsimula tayo. Sabihin sa amin ang tungkol sa iyong tindahan.',
      setupStorePlaceholder: 'Hal. Tindahan ni Maria',
      setupOwnerPlaceholder: 'Hal. Maria Santos',
      productName: 'Pangalan ng Produkto',
      productQty: 'Dami',
      productCost: 'Presyo ng Stock',
      productPrice: 'Presyo ng Benta',
      productMarkup: 'Markup (%)',
      markupHint: 'Sa {pct}% markup, ibenta sa {price}',
      newDebtCustomer: 'Pangalan ng Kostumer',
      newDebtAmount: 'Halaga ng Utang',
      newDebtTitle: 'Bagong Utang',
      saveDebt: 'I-save ang Utang',
      enterCustomerNameDebt: 'Ilagay ang pangalan ng kostumer',
      saved: 'Na-save!',
      saleSaved: 'Naitala ang benta!',
      debtSaved: 'Naitala ang utang!',
      paymentSaved: 'Naitala ang bayad!',
      currentBalance: 'Kasalukuyang Balanse',
      recordPayment: 'Magtala ng Bayad',
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
      prev: 'Nakaraan',
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
      // New Debt tutorial
      tutNewDebt: 'New Debt na Tutorial',
      newDebtTutorial1: 'Ang page na ito ay para manu-manong magtala ng bagong utang para sa isang kostumer.',
      newDebtTutorial2: 'Ilagay ang pangalan ng kostumer. Kung sila ay bagong kostumer, awtomatiko silang idadagdag.',
      newDebtTutorial3: 'Ilagay ang halaga ng utang. Ito ay idadagdag sa existing balance ng kostumer.',
      newDebtTutorial4: 'I-tap ang "Save Debt" para itala ito. Maaari mong tingnan ang lahat ng utang sa Debts page.',
      // v3.0 parity pages (Product Detail / Debtor Detail / Record Payment / Reports / Help)
      tutProductDetail: 'Product Detail na Tutorial',
      tutDebtorDetail: 'Customer Debt Detail na Tutorial',
      tutRecordPayment: 'Record Payment na Tutorial',
      tutReport: 'Reports na Tutorial',
      tutHelp: 'Help na Tutorial',
      productDetailTutorial1: 'Ang page na ito ay nagpapakita ng lahat tungkol sa produkto: pangalan, unit, stock quantity, presyo ng stock, presyo ng benta, at profit margin.',
      productDetailTutorial2: 'May color-coded na alert kapag mababa na o ubos na ang stock.',
      productDetailTutorial3: 'Ibawas ang nabentang stock, mag-restock, o i-edit ang detalye ng produkto dito.',
      productDetailTutorial4: 'Gamitin ang Delete para permanenteng alisin ang produkto — may kumpirmasyon muna.',
      customerDebtDetailTutorial1: 'Ang page na ito ay nagpapakita ng utang ng customer: current balance, kabuuang utang, at kabuuang nakolekta.',
      customerDebtDetailTutorial2: 'Ang ledger sa ibaba ay nagpapakita ng bawat idinagdag na utang at bayad kasama ang petsa at running balance.',
      customerDebtDetailTutorial3: 'Ang berdeng row ay dagdag na utang; ang orange na row ay mga bayad na natanggap.',
      customerDebtDetailTutorial4: 'I-tap ang Record Payment para tumanggap ng bayad sa utang na ito.',
      customerDebtDetailTutorial5: 'Kapag zero na ang balance, mamarkahan ang utang bilang fully settled.',
      recordPaymentTutorial1: 'Ilagay kung magkano ang ibabayad ng customer sa kanyang current balance.',
      recordPaymentTutorial2: 'Agad na nag-a-update ang preview ng natitirang balance habang nagta-type ka.',
      recordPaymentTutorial3: 'Magdagdag ng opsyonal na note, tulad ng "cash na binayad" o "partial payment".',
      recordPaymentTutorial4: 'I-tap ang Pay para i-save ang bayad. Awtomatikong mag-a-update ang balance at history.',
      reportTutorial1: 'Ang Reports page ay nagpapakita ng performance ng iyong tindahan sa paglipas ng panahon.',
      reportTutorial2: 'Gamitin ang toggle buttons para lumipat sa Daily, Weekly, o Monthly views.',
      reportTutorial3: 'Ang summary cards ay nagpapakita ng total sales at profit para sa napiling panahon.',
      reportTutorial4: 'Ang mga recent transactions ay lumalabas dito na may detalye ng bawat benta.',
      reportTutorial5: 'Ang Best-Selling Products section ay nagpapakita ng iyong mga top-performing items.',
      reportTutorial6: 'Ang low-stock items ay nakalista dito para malaman mo kung ano ang kailangan i-restock.',
      helpTutorial1: 'Ito ang Help page — ang iyong gabay sa paggamit ng Sari-Sari Smart nang epektibo.',
      helpTutorial2: 'Ang Tutorial Selector ay nagbibigay-daan sa iyo na pumili ng iba\'t ibang tutorial. Pumili ng tutorial mula sa dropdown at i-tap ang "Launch" para magsimula ng guided tour.',
      helpTutorial3: 'Ang "How to Use" button ay nagbubukas ng detalyadong gabay na may step-by-step na tagubilin para sa pag-record ng benta, pagdagdag ng stock, pagsubaybay ng utang, at iba pa.',
      helpTutorial4: 'Ang Contact section ay nagpapakita kung paano makipag-ugnayan sa support para sa mga tanong o feedback.',
      helpTutorial5: 'Ang About section ay nagsasabi tungkol sa bersyon ng app at layunin nito.',
      helpTutorial6: 'Maaari ka ring mag-access ng page-specific tutorial mula sa kahit anong page sa pamamagitan ng pag-tap sa (?) Help button sa kanang bahagi ng header.',
      pdTitle: 'Detalye ng Produkto',
      criticalStockAlert: '⚠️ Kritikal na Stock Alert',
      criticalAlertDesc: 'Wala nang stock ang item na ito. Mag-restock agad.',
      stockLabel: 'Stock',
      sellPrice: 'Presyo ng Benta',
      profitMargin: 'Profit Margin',
      deductStock: 'Ibawas ang Stock',
      deductBtn: 'Ibawas',
      restockBtn: 'Mag-restock',
      editBtn: 'I-edit',
      deleteBtn: 'Tanggalin',
      confirmDeleteProduct: 'Tanggalin ang produktong ito sa iyong inventory?',
      productNotFound: 'Hindi nakita ang produkto',
      fullySettled: '✅ Bayad na Lahat',
      lastActivity: 'Huling aktibidad:',
      debtHistory: 'Kasaysayan ng Utang',
      descHeader: 'Paglalarawan',
      amountHeader: 'Halaga',
      balanceHeader: 'Balanse',
      initialDebt: 'Unang Utang',
      totalCollected: 'Kabuuang Nakolekta',
      customerNotFound: 'Hindi nakita ang kostumer',
      paymentAmount: 'Halaga ng Bayad',
      paymentExceeds: 'Lumampas ang halaga sa balanse',
      enterAmount: 'Ilagay ang tamang halaga.',
      note: 'Tala',
      paymentNotePlaceholder: 'hal. cash na binayad',
      savePayment: 'I-save ang Bayad',
      reportsTitle: 'Ulat',
      periodDay: 'Araw',
      periodWeek: 'Linggo',
      periodMonth: 'Buwan',
      totalSales: 'Kabuuang Benta',
      reportsProfit: 'Kita',
      bestSelling: 'Mga Paboritong Produkto',
      recentTransactions: 'Mga Kamakailang Transaksyon',
      lowStockItems: 'Mga Item na Kulang na',
      noData: 'Wala pang data',
      helpTitle: 'Tulong',
      replayTutorial: 'Balik-aral sa Tutorial',
      howToUse: 'Paano Gamitin',
      contactInfo: 'Makipag-ugnayan',
      aboutApp: 'Tungkol sa App',
      contactText: 'Para sa mga tanong o feedback, mag-email sa support@sarisarismart.com',
      aboutText: 'Sari-Sari Smart v3.0 — isang store management app para sa mga may-ari ng sari-sari store.',
      howToSales: 'Itala ang iyong araw-araw na cash sales at specific item sales sa Sales page.',
      howToStock: 'Magdagdag ng produkto, mag-restock, at subaybayan ang inventory sa Stocks page.',
      howToDebts: 'Subaybayan ang mga utang ng kostumer at magtala ng bayad sa Debts page.',
      howToReports: 'Tingnan ang performance ng iyong tindahan sa Reports page.',
      howToSettings: 'I-customize ang wika, laki ng text, pangalan ng tindahan at may-ari sa Settings.',
      moreSection: 'Higit Pa',
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

  // Dev-only temporary date override (YYYY-MM-DD). Stored in sessionStorage so
  // it survives page-to-page navigation within the tab but is cleared when the
  // tab closes — it is NEVER written to localStorage/state and never alters
  // real data permanently. Set via Developer Panel (Shift+N) → Day State.
  var devDateOverride = null;
  var devStateSnapshot = null; // pre-override business-day snapshot (restored on clear)
  // Dev-only temporary HOUR override (0-23) for testing the time-based greeting.
  // Same contract as devDateOverride: sessionStorage only, cleared on tab close,
  // never written to state/localStorage. Set via Developer Panel (Shift+N).
  var devTimeOverride = null;

  function todayStr() {
    if (devDateOverride) return devDateOverride; // dev override wins (temporary)
    var d = new Date();
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  // ─── Dev Override Snapshot (restores business state when override is cleared) ───
  // Captures the exact business-day state BEFORE a temporary date override is
  // applied, so clearing the override restores the previous open day, its sales,
  // and closing inputs — nothing is lost. Stored in sessionStorage so it survives
  // page navigation (web reloads) but never persists beyond the tab session.
  function captureDevSnapshot() {
    devStateSnapshot = {
      dayOpen: state.dayOpen,
      dayDate: state.dayDate,
      dayArchived: state.dayArchived,
      todayExpenses: state.todayExpenses,
      todayEarnings: state.todayEarnings,
      sales: JSON.parse(JSON.stringify(state.sales)),
      history: JSON.parse(JSON.stringify(state.history))
    };
    try { sessionStorage.setItem('sss_v3_devSnapshot', JSON.stringify(devStateSnapshot)); } catch(e) {}
  }

  function restoreDevSnapshot() {
    if (!devStateSnapshot) return;
    var snap = devStateSnapshot;
    // Restore the EXACT pre-test business state: replace the active sales list
    // with the snapshot's copy so any sales recorded during the test (dated to
    // the override date) are purged — no test data leaks into real records.
    state.sales = JSON.parse(JSON.stringify(snap.sales || []));
    state.dayOpen = snap.dayOpen;
    state.dayDate = snap.dayDate;
    state.dayArchived = snap.dayArchived;
    state.todayExpenses = snap.todayExpenses;
    state.todayEarnings = snap.todayEarnings;
    // Restore the exact pre-test history too, so any history entries created
    // during the test (EOD/archive writes dated to the override date) are also
    // purged. Newer snapshots carry the history list; older ones (pre-v2.34)
    // fall back to removing just the archive-only sales copy for the snap day.
    if (snap.history) {
      state.history = JSON.parse(JSON.stringify(snap.history));
    } else if (snap.dayOpen && snap.dayDate) {
      state.history.forEach(function(h) {
        if (h.date === snap.dayDate && h.archivedSales) delete h.archivedSales;
      });
    }
    devStateSnapshot = null;
    try { sessionStorage.removeItem('sss_v3_devSnapshot'); } catch(e) {}
    saveState();
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

  // ─── Overdue store detection (left open across business days) ───
  // True when the store is open but the business day it started on (dayDate)
  // is strictly BEFORE today. Uses `<` (not `!==`) so a device clock moved
  // backward never archives a "future" day.
  function isStaleOpenDay() {
    return state.dayOpen && state.dayDate && state.dayDate < todayStr();
  }

  // Whole calendar days the current open day has been open (0 = opened today).
  function getDaysOpen() {
    if (!state.dayDate) return 0;
    try {
      var then = new Date(state.dayDate + 'T00:00:00');
      var now = devDateOverride ? new Date(devDateOverride + 'T00:00:00') : new Date();
      var days = Math.floor((now - then) / (1000 * 60 * 60 * 24));
      return isNaN(days) ? 0 : Math.max(0, days);
    } catch(e) { return 0; }
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
    },
    new_debt: {
      label: 'tutNewDebt',
      page: 'new_debt',
      steps: [
        { textKey: 'newDebtTutorial1', highlight: null },
        { textKey: 'newDebtTutorial2', highlight: '#newDebtCustomer' },
        { textKey: 'newDebtTutorial3', highlight: '#newDebtAmount' },
        { textKey: 'newDebtTutorial4', highlight: '.btn-primary.btn-full' }
      ]
    },
    product_detail: {
      label: 'tutProductDetail',
      page: 'product_detail',
      steps: [
        { textKey: 'productDetailTutorial1', highlight: null },
        { textKey: 'productDetailTutorial2', highlight: '#pdStockAlert' },
        { textKey: 'productDetailTutorial3', highlight: '#pdActions' },
        { textKey: 'productDetailTutorial4', highlight: '#pdDeleteBtn' }
      ]
    },
    debtor_detail: {
      label: 'tutDebtorDetail',
      page: 'debtor_detail',
      steps: [
        { textKey: 'customerDebtDetailTutorial1', highlight: null },
        { textKey: 'customerDebtDetailTutorial2', highlight: '#cddBalanceCard' },
        { textKey: 'customerDebtDetailTutorial3', highlight: '#cddLedger' },
        { textKey: 'customerDebtDetailTutorial4', highlight: '#cddRecordPaymentBtn' },
        { textKey: 'customerDebtDetailTutorial5', highlight: null }
      ]
    },
    record_payment: {
      label: 'tutRecordPayment',
      page: 'record_payment',
      steps: [
        { textKey: 'recordPaymentTutorial1', highlight: '#rpAmountField' },
        { textKey: 'recordPaymentTutorial2', highlight: '#rpRemainingPreview' },
        { textKey: 'recordPaymentTutorial3', highlight: '#rpNoteField' },
        { textKey: 'recordPaymentTutorial4', highlight: '#rpPayBtn' }
      ]
    },
    report: {
      label: 'tutReport',
      page: 'reports',
      steps: [
        { textKey: 'reportTutorial1', highlight: null },
        { textKey: 'reportTutorial2', highlight: '#reportPeriodToggle' },
        { textKey: 'reportTutorial3', highlight: '#reportSummaryCards' },
        { textKey: 'reportTutorial4', highlight: '#reportRecentTx' },
        { textKey: 'reportTutorial5', highlight: '#reportBestSellers' },
        { textKey: 'reportTutorial6', highlight: '#reportLowStock' }
      ]
    },
    help: {
      label: 'tutHelp',
      page: 'help',
      steps: [
        { textKey: 'helpTutorial1', highlight: null },
        { textKey: 'helpTutorial2', highlight: '#helpTutSelector' },
        { textKey: 'helpTutorial3', highlight: '#helpHowTo' },
        { textKey: 'helpTutorial4', highlight: '#helpContact' },
        { textKey: 'helpTutorial5', highlight: '#helpAbout' },
        { textKey: 'helpTutorial6', highlight: null }
      ]
    }
  };

  var _tutorialState = { active: false, id: null, step: 0, isReplay: false };
  var _tutorialRAF = null;

  // ─── Markup auto-population flags ───
  var _userEditedPrice = false;
  var _suppressPriceListener = false;

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
    // Previous button is hidden on the first step (mobile parity)
    if (dom.tutorialPrev) dom.tutorialPrev.style.display = stepIndex > 0 ? 'block' : 'none';

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
      // After the MAIN tutorial completes, return to the Morning page (where
      // the tutorial began) instead of leaving the user on Settings.
      if (tutorialId === 'main' && pageName !== 'morning') {
        window.location.href = 'morning.html';
      }
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

  // ─── Previous Step ───
  function previousTutorial() {
    if (!dom.tutorialOverlay) return;
    var tutorialId = _tutorialState.id || 'main';
    var steps = (tutorials[tutorialId] && tutorials[tutorialId].steps) || [];
    var prevStep = (_tutorialState.step || 0) - 1;
    if (prevStep < 0) return;
    var prevStepData = steps[prevStep];
    var currentPage = pageName;

    // Mirror of advanceTutorial: if the previous step is on a different page,
    // save state and navigate there; otherwise just render the previous step.
    if (prevStepData.page && prevStepData.page !== currentPage) {
      saveTutorialState(tutorialId, prevStep, _tutorialState.isReplay);
      window.location.href = prevStepData.page + '.html?tutorial=true';
    } else {
      _tutorialState.step = prevStep;
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

    // ── Legacy debt migration: ensure createdAt, updatedAt, transactions ──
    if (state.debts) {
      state.debts.forEach(function(d) {
        if (!d.createdAt) d.createdAt = new Date().toISOString();
        if (!d.updatedAt) d.updatedAt = d.createdAt;
        if (!d.transactions) {
          d.transactions = [{
            id: genId(),
            date: d.createdAt,
            type: 'debt',
            description: 'Initial',
            amount: d.amount
          }];
        }
      });
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
  // v2.37 (morning page only): time-of-day greeting helper
  function greetingForTime() {
    // Dev time override (0-23) shadows the real clock so the time-based
    // greeting can be tested at any hour (Developer Panel → Day State)
    var h = (devTimeOverride !== null) ? devTimeOverride : new Date().getHours();
    if (h < 12) return 'greetingMorning';
    if (h < 18) return 'greetingAfternoon';
    return 'greetingEvening';
  }

  function updateHeader() {
    // Pages with a header page title (Morning/Day, v2.37): render the title
    // from the element's own data-i18n key; other pages keep the greeting
    if (dom.headerPageTitle) {
      var titleKey = dom.headerPageTitle.getAttribute('data-i18n') || 'pageMorning';
      dom.headerPageTitle.textContent = t(titleKey);
      return;
    }
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
    dom.morningGreeting.textContent = t(greetingForTime()) + ', ' + name + ' \ud83d\udc4b';
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

    // ── Overdue store banner (store left open across business days) ──
    var staleOpen = isStaleOpenDay();
    var overdueCard = document.getElementById('morningOverdueCard');
    if (overdueCard) {
      if (staleOpen) {
        overdueCard.style.display = '';
        var ovTitle = document.getElementById('morningOverdueTitle');
        var ovDesc = document.getElementById('morningOverdueDesc');
        var ovBtn = document.getElementById('morningOverdueReviewBtn');
        if (ovTitle) ovTitle.textContent = '\u26a0\ufe0f ' + t('overdueTitle');
        if (ovDesc) ovDesc.textContent = t('overdueDesc', {
          date: formatDate(new Date(state.dayDate + 'T00:00:00')),
          n: getDaysOpen()
        });
        if (ovBtn) ovBtn.textContent = t('overdueReview');
      } else {
        overdueCard.style.display = 'none';
      }
    }

    // Determine which button to show based on state
    if (staleOpen) {
      // Previous day was never closed → offer to close it and start today
      if (dom.btnStartDay) {
        dom.btnStartDay.innerHTML = '<span>' + t('overdueCloseStart') + '</span>';
        dom.btnStartDay.onclick = closeStaleDayAndStartToday;
      }
    } else if (state.dayOpen) {
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
    // If starting a day on an earlier date than the last business day, archive old sales.
    // Uses `<` (not `!==`) so a device clock moved backward never archives a "future" day.
    if (state.dayDate && state.dayDate < todayStr()) {
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
  // OVERDUE STORE (left open across business days)
  // ============================================
  function closeStaleDayAndStartToday() {
    if (!isStaleOpenDay()) return;
    // Dev-override safety: with an override active, this archives the previous
    // day's sales into REAL persisted history. Warn that closing the tab before
    // clearing the override makes the change permanent (no snapshot to restore).
    if (devDateOverride && !confirm(t('overdueDevConfirm'))) return;
    // Save the previous day's sales to history (nothing is lost)
    archiveDaySales();
    // Open a fresh day for today
    state.dayDate = todayStr();
    state.dayArchived = false;
    state.dayOpen = true;
    state.todayExpenses = 0;
    state.todayEarnings = 0;
    saveState();
    showToast(t('overdueArchivedToast'));
    // Small delay so the confirmation toast is visible before navigating
    setTimeout(function() { window.location.href = 'day.html'; }, 900);
  }

  // Show the previous (stale) day's sales so the owner can see what was recorded
  function openOverdueReview() {
    if (!state.dayDate) return;
    var staleDate = state.dayDate;
    var staleSales = state.sales.filter(function(s) { return s.date === staleDate; });
    // If the stale day was already archived (e.g. dev-panel Start New Day),
    // fall back to the archived sales copy kept in history.
    if (staleSales.length === 0 && state.history) {
      var h = state.history.find(function(x) { return x.date === staleDate; });
      if (h && h.archivedSales) staleSales = h.archivedSales;
    }
    var listEl = document.getElementById('overdueReviewList');
    var totalEl = document.getElementById('overdueReviewTotal');
    if (listEl) {
      if (staleSales.length === 0) {
        listEl.innerHTML = '<div class="empty-state" style="padding:12px 0;">' + t('overdueReviewEmpty') + '</div>';
      } else {
        listEl.innerHTML = staleSales.map(function(s) {
          return '<div class="closing-item">' +
            '<span class="closing-item-name">' + s.productName + ' \u00d7 ' + (s.quantity || 1) + '</span>' +
            '<span class="closing-item-value success">' + formatCurrency(s.amount) + '</span>' +
          '</div>';
        }).join('');
      }
    }
    var total = staleSales.reduce(function(sum, s) { return sum + (s.amount || 0); }, 0);
    if (totalEl) totalEl.textContent = t('overdueReviewTotal') + ': ' + formatCurrency(total);
    var ov = document.getElementById('overdueReviewOverlay');
    if (ov) ov.classList.add('open');
  }

  function closeOverdueReview() {
    var ov = document.getElementById('overdueReviewOverlay');
    if (ov) ov.classList.remove('open');
  }

  // ============================================
  // DAY MODE
  // ============================================
  function renderDayMode() {
    if (!dom.dayDate) return;
    // Show the simulated date when a dev date override is active
    dom.dayDate.textContent = formatDate(devDateOverride ? new Date(devDateOverride + 'T00:00:00') : new Date());

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
    // Clamp to available stock so the + button can't exceed inventory (Issue 3 fix)
    qty = Math.min(qty, state.selectedProduct.quantity);
    dom.saleQty.value = qty;
    updateSaleTotal();
  }

  function onQtyChange() {
    if (!state.selectedProduct || !dom.saleQty) return;
    var qty = parseInt(dom.saleQty.value) || 1;
    // Clamp to valid range: 1 to available stock
    qty = Math.max(1, Math.min(qty, state.selectedProduct.quantity));
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

    // Build debt balance lookup map
    var debtBalances = {};
    state.debts.forEach(function(d) {
      if (d.remainingBalance > 0) {
        debtBalances[d.customerName] = (debtBalances[d.customerName] || 0) + d.remainingBalance;
      }
    });

    dom.customerSuggestions.innerHTML = matches.map(function(name) {
      var balance = debtBalances[name] || 0;
      var balanceHtml = balance > 0
        ? '<span class="customer-suggestion-balance">' + t('debtTotal', { amount: formatCurrency(balance) }) + '</span>'
        : '<span class="customer-suggestion-balance settled">\u2714\uFE0F ' + t('payBalance', { amount: formatCurrency(0) }) + '</span>';
      return '<div class="customer-suggestion-item" onclick="window.selectCustomer(\'' + name.replace(/'/g, "\\'") + '\')">' +
        '<span class="customer-suggestion-name">' + name + '</span>' +
        balanceHtml +
        '</div>';
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
    if (!state.dayOpen || isStaleOpenDay()) {
      showToast(state.dayOpen ? t('overdueRedirect') : t('dayNotOpen'));
      return;
    }
    // Redirect to closing page
    window.location.href = 'closing.html';
  }

  /** Navigate to day mode — guards against accessing day without starting the day */
  function navigateToDayMode() {
    if (!state.dayOpen || isStaleOpenDay()) {
      showToast(state.dayOpen ? t('overdueRedirect') : t('dayNotOpen'));
      return;
    }
    window.location.href = 'day.html';
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
      return '<div class="inv-manage-item" onclick="location.href=\'product_detail.html?id=' + p.id + '\'" style="cursor:pointer;">' +
        '<div class="inv-manage-icon ' + status + '">' + icon + '</div>' +
        '<div class="inv-manage-info">' +
          '<div class="inv-manage-name">' + p.name + '</div>' +
          '<div class="inv-manage-detail">Stock: ' + p.quantity + ' | +' + margin + '% | ' + formatCurrency(p.sellingPrice) + '</div>' +
        '</div>' +
        '<div class="inv-manage-actions">' +
          '<button class="inv-manage-btn" onclick="window.editProduct(\'' + p.id + '\')">\u270f\ufe0f</button>' +
        '</div>' +
      '</div>';
    }).join('');
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
      if (dom.productPrice && !_userEditedPrice) {
        _suppressPriceListener = true;
        dom.productPrice.value = suggested.toFixed(2);
        _suppressPriceListener = false;
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
  // ─── Date formatting helper ───
  function formatDateSafe(isoString) {
    if (!isoString) return '';
    try {
      var d = new Date(isoString);
      if (isNaN(d.getTime())) return '';
      var now = new Date();
      var diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));
      if (diff === 0) return 'Today';
      if (diff === 1) return 'Yesterday';
      // Use the locale for month/day
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch(e) { return ''; }
  }

  function renderManageDebts() {
    if (!dom.manageDebtsList) return;
    var total = getTotalDebt();
    if (dom.manageTotalDebt) dom.manageTotalDebt.textContent = formatCurrency(total);

    var activeDebts = state.debts.filter(function(d) { return d.remainingBalance > 0; });
    var paidDebts = state.debts.filter(function(d) { return d.remainingBalance <= 0; });

    // ── Active debts ──
    if (activeDebts.length === 0) {
      dom.manageDebtsList.innerHTML = '<div class="empty-state">\u2705 ' + t('noDebtItems') + '</div>';
    } else {
      dom.manageDebtsList.innerHTML = activeDebts.map(function(d) {
        var activityLabel = '';
        if (d.updatedAt) {
          var formatted = formatDateSafe(d.updatedAt);
          if (formatted) activityLabel = 'Last: ' + formatted;
        }
        return '<div class="debt-manage-item" onclick="location.href=\'debtor_detail.html?id=' + d.id + '\'" style="cursor:pointer;">' +
          '<div class="debt-manage-info">' +
            '<div class="debt-manage-name">' + d.customerName + '</div>' +
            '<div class="debt-manage-meta">' + activityLabel + '</div>' +
          '</div>' +
          '<div class="debt-manage-amount">' + formatCurrency(d.remainingBalance) + '</div>' +
          '<button class="debt-manage-pay-btn" onclick="event.stopPropagation(); location.href=\'record_payment.html?id=' + d.id + '\'">' + t('payBtnLabel') + '</button>' +
        '</div>';
      }).join('');
    }

    // ── Paid debts collapsible ──
    var paidContainer = document.getElementById('paidDebtsContainer');
    if (!paidContainer) return;
    if (paidDebts.length === 0) {
      paidContainer.style.display = 'none';
      return;
    }
    paidContainer.style.display = 'block';
    var paidCountEl = document.getElementById('paidDebtsCount');
    if (paidCountEl) paidCountEl.textContent = paidDebts.length;

    var paidList = document.getElementById('paidDebtsList');
    if (!paidList) return;
    paidList.innerHTML = paidDebts.map(function(d) {
      var settledDate = '';
      // Find the payment that settled it (the one that brought balance to 0)
      if (d.transactions && d.transactions.length > 0) {
        var payments = d.transactions.filter(function(t) { return t.type === 'payment'; });
        if (payments.length > 0) {
          settledDate = formatDateSafe(payments[payments.length - 1].date);
        }
      }
      return '<div class="debt-manage-item paid-item">' +
        '<div class="debt-manage-info">' +
          '<div class="debt-manage-name">' + d.customerName + '</div>' +
          '<div class="debt-manage-meta">\u2714\uFE0F Fully settled' +
            (settledDate ? ' \u2022 ' + settledDate : '') +
          '</div>' +
        '</div>' +
        '<div class="debt-manage-amount" style="color:var(--primary);font-size:var(--text-sm);">' +
          'Was ' + formatCurrency(d.amount) +
        '</div>' +
      '</div>';
    }).join('');
  }

  // ============================================
  // PAYMENT SHEET
  // ============================================
  // ============================================
  // DEBT DETAIL OVERLAY
  // ============================================
  function openDebtDetail(debtId) {
    var overlay = document.getElementById('debtDetailOverlay');
    if (!overlay) return;
    overlay.style.display = 'flex';
    overlay.classList.add('open');
    renderDebtDetail(debtId);
  }

  function closeDebtDetail() {
    var overlay = document.getElementById('debtDetailOverlay');
    if (!overlay) return;
    overlay.style.display = 'none';
    overlay.classList.remove('open');
  }

  function renderDebtDetail(debtId) {
    var debt = state.debts.find(function(d) { return d.id === debtId; });
    if (!debt) return;

    // Ensure legacy migration for this debt
    if (!debt.createdAt) debt.createdAt = new Date().toISOString();
    if (!debt.updatedAt) debt.updatedAt = debt.createdAt;
    if (!debt.transactions) {
      debt.transactions = [{
        id: genId(),
        date: debt.createdAt,
        type: 'debt',
        description: 'Initial',
        amount: debt.amount
      }];
    }

    // ── Customer name ──
    var nameEl = document.getElementById('debtDetailName');
    if (nameEl) nameEl.textContent = debt.customerName;

    // ── Balance card ──
    var balanceEl = document.getElementById('debtDetailBalance');
    if (balanceEl) {
      balanceEl.textContent = formatCurrency(debt.remainingBalance);
      balanceEl.className = 'debt-detail-balance';
      if (debt.remainingBalance <= 0) balanceEl.classList.add('settled');
      else balanceEl.classList.add('outstanding');
    }

    var settledBadge = document.getElementById('debtDetailSettledBadge');
    if (settledBadge) {
      settledBadge.style.display = debt.remainingBalance <= 0 ? 'block' : 'none';
    }

    var createdLabel = document.getElementById('debtDetailCreated');
    if (createdLabel) {
      var createdDate = formatDateSafe(debt.createdAt);
      createdLabel.textContent = createdDate ? 'Created: ' + createdDate : '';
    }

    // ── Record Payment button ──
    var payBtn = document.getElementById('debtDetailPayBtn');
    if (payBtn) {
      payBtn.style.display = debt.remainingBalance > 0 ? 'flex' : 'none';
      payBtn.setAttribute('data-debt-id', debt.id);
    }

    // ── Revenue conversion: total collected ──
    var totalEl = document.getElementById('debtDetailTotal');
    if (totalEl) totalEl.textContent = formatCurrency(debt.amount);

    var collectedEl = document.getElementById('debtDetailCollected');
    if (collectedEl) {
      var collected = debt.amount - debt.remainingBalance;
      collectedEl.textContent = formatCurrency(collected);
    }

    // ── Transaction history — chronological with running balance ──
    var historyList = document.getElementById('debtDetailHistory');
    if (!historyList) return;

    // Collect all transactions and sort by date
    var allEntries = [];
    if (debt.transactions && debt.transactions.length > 0) {
      allEntries = debt.transactions.slice().sort(function(a, b) {
        return new Date(a.date) - new Date(b.date);
      });
    } else {
      // Fallback: create initial debt entry
      allEntries.push({ id: genId(), date: debt.createdAt, type: 'debt', description: 'Initial', amount: debt.amount });
    }

    // Compute running balance
    var runningBalance = 0;
    var html = '';
    allEntries.forEach(function(entry) {
      if (entry.type === 'debt') {
        runningBalance += entry.amount;
      } else if (entry.type === 'payment') {
        runningBalance -= entry.amount;
      }

      var entryDate = formatDateSafe(entry.date);
      var icon = entry.type === 'debt' ? '\ud83d\udfe2' : '\ud83d\udfe0';
      var typeLabel = entry.type === 'debt' ? 'Added' : 'Payment';
      var desc = entry.description || (entry.type === 'payment' ? 'Payment received' : 'Debt recorded');

      html += '<div class="debt-history-row">' +
        '<div class="debt-history-icon">' + icon + '</div>' +
        '<div class="debt-history-info">' +
          '<div class="debt-history-desc">' + desc + '</div>' +
          '<div class="debt-history-date">' + entryDate + ' \u2022 ' + typeLabel + '</div>' +
        '</div>' +
        '<div class="debt-history-amount ' + (entry.type === 'debt' ? 'added' : 'paid') + '">' +
          (entry.type === 'debt' ? '+' : '-') + formatCurrency(entry.amount) +
        '</div>' +
        '<div class="debt-history-running">' + formatCurrency(runningBalance) + '</div>' +
      '</div>';
    });

    historyList.innerHTML = html;
  }

  // ============================================
  // PAID DEBTS COLLAPSIBLE
  // ============================================
  function togglePaidDebts() {
    var section = document.getElementById('paidDebtsSection');
    if (section) section.classList.toggle('collapsed');
  }

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
    closeDebtDetail();
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
    if (dom.newDebtSuggestions) dom.newDebtSuggestions.classList.remove('open');
    // (overlay replaced by separate new_debt.html page)
  }

  function onNewDebtCustomerSearch() {
    if (!dom.newDebtCustomer || !dom.newDebtSuggestions) return;
    var query = dom.newDebtCustomer.value.toLowerCase().trim();
    if (!query) {
      dom.newDebtSuggestions.classList.remove('open');
      return;
    }
    var names = {};
    state.debts.forEach(function(d) { names[d.customerName] = true; });
    state.sales.forEach(function(s) { if (s.customerName) names[s.customerName] = true; });
    var matches = Object.keys(names).filter(function(n) {
      return n.toLowerCase().includes(query);
    }).slice(0, 5);

    if (matches.length === 0) {
      dom.newDebtSuggestions.classList.remove('open');
      return;
    }

    // Build debt balance lookup map
    var debtBalances = {};
    state.debts.forEach(function(d) {
      if (d.remainingBalance > 0) {
        debtBalances[d.customerName] = (debtBalances[d.customerName] || 0) + d.remainingBalance;
      }
    });

    dom.newDebtSuggestions.innerHTML = matches.map(function(name) {
      var balance = debtBalances[name] || 0;
      var balanceHtml = balance > 0
        ? '<span class="customer-suggestion-balance">' + t('debtTotal', { amount: formatCurrency(balance) }) + '</span>'
        : '<span class="customer-suggestion-balance settled">\u2714\uFE0F ' + t('payBalance', { amount: formatCurrency(0) }) + '</span>';
      return '<div class="customer-suggestion-item" onclick="window.selectNewDebtCustomer(\'' + name.replace(/'/g, "\\'") + '\')">' +
        '<span class="customer-suggestion-name">' + name + '</span>' +
        balanceHtml +
        '</div>';
    }).join('');
    dom.newDebtSuggestions.classList.add('open');
  }

  function selectNewDebtCustomer(name) {
    if (dom.newDebtCustomer) dom.newDebtCustomer.value = name;
    if (dom.newDebtSuggestions) dom.newDebtSuggestions.classList.remove('open');
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

    // Also record a specific sale so Debt Today on the Day page picks it up
    state.sales.unshift({
      id: genId(),
      date: todayStr(),
      productName: 'Manual debt: ' + customer,
      amount: amount,
      quantity: 1,
      customerName: customer,
      profit: 0
    });

    saveState();
    closeNewDebt();
    showToast(t('debtSaved'));
    // Redirect back to debts page. replace() so Back after saving skips the
    // just-exited form instead of revisiting it (v2.51 history unification).
    window.location.replace('debts.html');
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
            '<button class="dev-panel-btn" onclick="handleDevAction(\'exportCsv\')">Export All Data (CSV)</button>' +
          '</div>' +
          '<div class="dev-panel-section">' +
            '<div class="dev-panel-section-title">Restock</div>' +
            '<button class="dev-panel-btn" onclick="handleDevAction(\'clearRestockData\')">Clear Restock Data</button>' +
            '<button class="dev-panel-btn" onclick="handleDevAction(\'setRestockDate\')">Set Restock Date to Today</button>' +
            '<button class="dev-panel-btn" onclick="handleDevAction(\'viewRestockLog\')">View Restock Log</button>' +
          '</div>' +
          '<div class="dev-panel-section">' +
            '<div class="dev-panel-section-title">Day State</div>' +
            '<button class="dev-panel-btn" onclick="handleDevAction(\'toggleDayOpen\')">Toggle Day Open/Close</button>' +
            '<button class="dev-panel-btn" onclick="handleDevAction(\'startNewDay\')">Start New Day (Archive + Open)</button>' +
            '<button class="dev-panel-btn" onclick="handleDevAction(\'archiveDaySales\')">Archive Today\'s Sales</button>' +
            '<button class="dev-panel-btn" onclick="handleDevAction(\'setDateOverride\')">Set Date Override (temp)</button>' +
            '<button class="dev-panel-btn" onclick="handleDevAction(\'clearDateOverride\')">Clear Date Override</button>' +
            '<button class="dev-panel-btn" onclick="handleDevAction(\'setTimeOverride\')">Set Time Override (temp)</button>' +
            '<button class="dev-panel-btn" onclick="handleDevAction(\'clearTimeOverride\')">Clear Time Override</button>' +
            '<button class="dev-panel-btn" onclick="handleDevAction(\'resetTutorial\')">Reset Tutorial State</button>' +
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
        devDateOverride = null; // factory reset also clears the temporary dev override
        devTimeOverride = null; // ...and the temporary dev time override
        devStateSnapshot = null;
        try { sessionStorage.removeItem('sss_v3_devDateOverride'); } catch(e) {}
        try { sessionStorage.removeItem('sss_v3_devSnapshot'); } catch(e) {}
        try { sessionStorage.removeItem('sss_v3_devTimeOverride'); } catch(e) {}
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
      case 'exportCsv':
        (function() {
          var csv = 'Sari-Sari Smart - Data Export\n';
          csv += 'Exported: ' + new Date().toISOString() + '\n\n';
          csv += '=== PRODUCTS ===\n';
          csv += 'Name,Quantity,Cost,Sell Price,Profit Margin\n';
          state.products.forEach(function(p) {
            var margin = p.costPrice > 0 ? ((p.sellingPrice - p.costPrice) / p.costPrice * 100).toFixed(1) + '%' : 'N/A';
            csv += p.name + ',' + p.quantity + ',' + p.costPrice + ',' + p.sellingPrice + ',' + margin + '\n';
          });
          csv += '\n=== TODAY\'S SALES ===\n';
          csv += 'Product,Quantity,Amount,Profit,Customer\n';
          getTodaySales().forEach(function(s) {
            csv += (s.productName || 'Unknown') + ',' + (s.quantity || 1) + ',' + s.amount + ',' + (s.profit || 0) + ',' + (s.customerName || 'Cash') + '\n';
          });
          csv += '\n=== DEBTS ===\n';
          csv += 'Customer,Amount,Remaining\n';
          state.debts.filter(function(d) { return d.remainingBalance > 0; }).forEach(function(d) {
            csv += d.customerName + ',' + d.amount + ',' + d.remainingBalance + '\n';
          });
          var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          var link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'sari-sari-smart-data.csv';
          link.click();
          showToast('CSV exported!');
        })();
        break;
      case 'toggleDayOpen':
        state.dayOpen = !state.dayOpen;
        saveState();
        showToast('Day ' + (state.dayOpen ? 'opened' : 'closed') + ' manually.');
        toggleDevPanel();
        if (pageName === 'morning') renderMorningCheck();
        break;
      case 'startNewDay':
        // Always archive current day's sales before creating fresh day
        archiveDaySales();
        // Initialize a fresh pre-opening day for today
        state.dayDate = todayStr();
        state.dayArchived = true;   // sales were archived, so "Edit Closing" condition won't match
        state.dayOpen = false;
        state.todayExpenses = 0;
        state.todayEarnings = 0;
        saveState();
        showToast('New day started! Tap "Start the Day" to open store.');
        toggleDevPanel();
        if (pageName === 'morning') renderMorningCheck();
        break;
      case 'archiveDaySales':
        archiveDaySales();
        saveState();
        showToast('Sales archived.');
        break;
      case 'setDateOverride':
        var ov = prompt('Enter override date (YYYY-MM-DD), or blank to clear:', devDateOverride || '');
        if (ov === null) break;
        ov = (ov || '').trim();
        if (ov && (!/^\d{4}-\d{2}-\d{2}$/.test(ov) || isNaN(new Date(ov + 'T00:00:00').getTime()))) {
          showToast('Invalid date. Use a real YYYY-MM-DD date.', 'error');
          return;
        }
        if (ov && !devStateSnapshot) captureDevSnapshot(); // snapshot pre-test business state
        devDateOverride = ov || null;
        try {
          if (devDateOverride) sessionStorage.setItem('sss_v3_devDateOverride', devDateOverride);
          else sessionStorage.removeItem('sss_v3_devDateOverride');
        } catch(e) {}
        if (!devDateOverride) restoreDevSnapshot(); // blank input = clear → restore state
        showToast(devDateOverride ? 'Dev date override set to ' + devDateOverride + ' (temporary, clears on tab close).' : 'Dev date override cleared. Business state restored.');
        toggleDevPanel();
        if (pageName === 'morning') renderMorningCheck();
        break;
      case 'clearDateOverride':
        devDateOverride = null;
        try { sessionStorage.removeItem('sss_v3_devDateOverride'); } catch(e) {}
        restoreDevSnapshot(); // restore the exact pre-test business state
        showToast('Dev date override cleared. Business state restored.');
        toggleDevPanel();
        if (pageName === 'morning') renderMorningCheck();
        break;
      case 'setTimeOverride':
        var tOv = prompt('Enter override hour (0-23), or blank to clear:', devTimeOverride !== null ? String(devTimeOverride) : '');
        if (tOv === null) break;
        tOv = (tOv || '').trim();
        if (tOv) {
          var hour = parseInt(tOv, 10);
          if (isNaN(hour) || hour < 0 || hour > 23) {
            showToast('Invalid hour. Use 0-23.', 'error');
            return;
          }
          devTimeOverride = hour;
          try { sessionStorage.setItem('sss_v3_devTimeOverride', String(hour)); } catch(e) {}
          showToast('Dev time override set to ' + hour + ':00 (temporary, clears on tab close).');
        } else {
          devTimeOverride = null;
          try { sessionStorage.removeItem('sss_v3_devTimeOverride'); } catch(e) {}
          showToast('Dev time override cleared. Real clock restored.');
        }
        toggleDevPanel();
        if (pageName === 'morning') renderMorningCheck();
        break;
      case 'clearTimeOverride':
        devTimeOverride = null;
        try { sessionStorage.removeItem('sss_v3_devTimeOverride'); } catch(e) {}
        showToast('Dev time override cleared. Real clock restored.');
        toggleDevPanel();
        if (pageName === 'morning') renderMorningCheck();
        break;
      case 'resetTutorial':
        state.settings.launchCount = 0;
        state.settings.hasCompletedSetup = true;
        try { sessionStorage.removeItem('sss_v3_tutorialShown'); } catch(e) {}
        saveState();
        showToast('Tutorial state reset. Will show on next launch.');
        break;
      case 'clearRestockData':
        localStorage.removeItem('sss_v3_lastRestockDate');
        state.restockLog = [];
        saveState();
        showToast('Restock data cleared.');
        break;
      case 'setRestockDate':
        localStorage.setItem('sss_v3_lastRestockDate', todayStr());
        showToast('Restock date set to today.');
        break;
      case 'viewRestockLog':
        var lastDate = localStorage.getItem('sss_v3_lastRestockDate');
        var logCount = (state.restockLog && state.restockLog.length) || 0;
        if (lastDate) {
          showToast('Last restock: ' + lastDate + ' | Log entries: ' + logCount);
        } else {
          showToast('No restock data recorded.');
        }
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
  function setupLanguageChanged() {
    // Setup overlay: switch language instantly (web parity with mobile).
    if (dom.setupLanguage) state.settings.language = dom.setupLanguage.value;
    applyTranslations();
  }

  function setupEvents() {
    if (dom.setupLanguage) {
      dom.setupLanguage.addEventListener('change', setupLanguageChanged);
    }
    if (dom.closingActualSales) dom.closingActualSales.addEventListener('input', updateClosingTotal);
    if (dom.productCost) dom.productCost.addEventListener('input', updateMarkupHint);
    if (dom.productMarkup) dom.productMarkup.addEventListener('input', updateMarkupHint);
    if (dom.productPrice) {
      dom.productPrice.addEventListener('input', function() {
        if (_suppressPriceListener) return;
        _userEditedPrice = true;
      });
      dom.productPrice.addEventListener('input', updateMarkupHint);
    }

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
  // ============================================
  // HISTORY-AWARE BACK NAVIGATION
  // ============================================
  /**
   * Navigate back using the browser's native history stack.
   * Only uses history.back() if the user came from within the app
   * (same origin), falling back to morning.html for direct bookmarks.
   */
  function historyBack() {
    var referrer = document.referrer || '';
    // Same-origin referrer covers the normal http-served flow. When the
    // referrer is empty (file:// / fresh-tab opens), history.length > 1 means
    // in-app history still exists, so pop it. We deliberately do NOT pop on a
    // non-empty external referrer even if history.length > 1 — that would
    // navigate OUT of the app (v2.23 guard preserved). Falls back to
    // morning.html only when there is genuinely nowhere to go back to.
    if (referrer.indexOf(window.location.origin) === 0 ||
        (!referrer && window.history.length > 1)) {
      window.history.back();
    } else {
      window.location.href = 'morning.html';
    }
  }

  // ============================================
  // PRODUCT DETAIL PAGE (product_detail.html)
  // ============================================
  function renderProductDetail() {
    var container = document.getElementById('pdContainer');
    if (!container) return;
    var params = new URLSearchParams(window.location.search);
    var id = params.get('id');
    var product = state.products.find(function(p) { return p.id === id; });
    if (!product) {
      container.innerHTML = '<div class="empty-state">' + t('productNotFound') + '</div>';
      return;
    }
    var titleEl = document.getElementById('pdProductTitle');
    if (titleEl) titleEl.textContent = product.name;

    var status = getStockStatus(product);
    var statusColor = status === 'plenty' ? '#16a34a' : (status === 'low' ? '#d97706' : '#dc2626');
    var statusBg = status === 'plenty' ? '#f0fdf4' : (status === 'low' ? '#fffbeb' : '#fef2f2');
    var margin = product.costPrice > 0 ? Math.round(((product.sellingPrice - product.costPrice) / product.costPrice) * 100) : 0;

    var alertHtml = '';
    if (status === 'out') {
      alertHtml = '<div id="pdStockAlert" style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:14px;margin-bottom:16px;">' +
        '<div style="font-weight:700;color:#b91c1c;">' + t('criticalStockAlert') + '</div>' +
        '<div style="font-size:var(--text-sm);color:#dc2626;">' + t('criticalAlertDesc') + '</div></div>';
    }

    container.innerHTML =
      alertHtml +
      '<div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-bottom:16px;">' +
        '<div style="display:flex;align-items:center;gap:14px;">' +
          '<div style="width:56px;height:56px;border-radius:10px;background:' + statusBg + ';display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;color:' + statusColor + ';">' + product.quantity + '</div>' +
          '<div><div style="font-size:var(--text-sm);color:#94a3b8;">' + t('stockLabel') + '</div>' +
          '<div style="font-weight:700;color:#1e293b;">' + product.name + '</div></div>' +
        '</div>' +
        '<div style="display:flex;justify-content:space-between;margin-top:14px;padding-top:12px;border-top:1px solid #f1f5f9;">' +
          '<div style="text-align:center;flex:1;"><div style="font-size:var(--text-sm);color:#94a3b8;">' + t('costPrice') + '</div><div style="font-weight:700;">' + formatCurrency(product.costPrice) + '</div></div>' +
          '<div style="text-align:center;flex:1;"><div style="font-size:var(--text-sm);color:#94a3b8;">' + t('sellPrice') + '</div><div style="font-weight:700;color:#16a34a;">' + formatCurrency(product.sellingPrice) + '</div></div>' +
          '<div style="text-align:center;flex:1;"><div style="font-size:var(--text-sm);color:#94a3b8;">' + t('profitMargin') + '</div><div style="font-weight:700;color:' + (margin >= 15 ? '#16a34a' : (margin > 0 ? '#d97706' : '#94a3b8')) + ';">' + (margin > 0 ? '+' + margin + '%' : '--') + '</div></div>' +
        '</div>' +
      '</div>' +
      '<div id="pdActions" style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-bottom:16px;">' +
        '<div style="font-weight:700;color:#1e293b;margin-bottom:10px;">' + t('deductStock') + '</div>' +
        '<div style="display:flex;gap:8px;">' +
          '<input type="number" id="pdDeductQty" class="form-input" placeholder="1" min="1" style="flex:1;">' +
          '<button class="btn btn-primary" onclick="deductWebStock(\'' + product.id + '\')">' + t('deductBtn') + '</button>' +
        '</div>' +
        '<div style="display:flex;gap:8px;margin-top:12px;">' +
          '<a href="restock.html" class="btn btn-outline" style="flex:1;text-decoration:none;">' + t('restockBtn') + '</a>' +
          '<button class="btn btn-outline" style="flex:1;" onclick="window.editProduct(\'' + product.id + '\')">' + t('editBtn') + '</button>' +
        '</div>' +
      '</div>' +
      '<button id="pdDeleteBtn" class="btn btn-secondary btn-full" style="border:1px solid #fca5a5;color:#dc2626;" onclick="deleteWebProduct(\'' + product.id + '\')">🗑️ ' + t('deleteBtn') + '</button>';
  }

  function deductWebStock(id) {
    var product = state.products.find(function(p) { return p.id === id; });
    if (!product) return;
    var qty = parseInt(document.getElementById('pdDeductQty') ? document.getElementById('pdDeductQty').value : '1') || 1;
    if (qty <= 0 || qty > product.quantity) { showToast(t('enterAmount'), 'error'); return; }
    product.quantity -= qty;
    saveState();
    renderProductDetail();
    showToast(t('saved'));
  }

  function deleteWebProduct(id) {
    var product = state.products.find(function(p) { return p.id === id; });
    if (!product) return;
    if (!confirm(t('confirmDeleteProduct'))) return;
    state.products = state.products.filter(function(p) { return p.id !== id; });
    saveState();
    window.location.href = 'inventory.html';
  }

  // ============================================
  // DEBTOR DETAIL PAGE (debtor_detail.html)
  // ============================================
  function renderDebtorDetail() {
    var params = new URLSearchParams(window.location.search);
    var id = params.get('id');
    var debt = state.debts.find(function(d) { return d.id === id; });
    var nameEl = document.getElementById('debtorDetailName');
    var balanceCard = document.getElementById('cddBalanceCard');
    var payBtnEl = document.getElementById('cddRecordPaymentBtn');
    var ledgerEl = document.getElementById('cddLedger');
    if (!debt) {
      if (nameEl) nameEl.textContent = t('customerNotFound');
      if (balanceCard) balanceCard.innerHTML = '<div class="empty-state">' + t('customerNotFound') + '</div>';
      if (payBtnEl) payBtnEl.innerHTML = '';
      if (ledgerEl) ledgerEl.innerHTML = '';
      return;
    }
    if (nameEl) nameEl.textContent = debt.customerName;

    if (!debt.transactions) {
      debt.transactions = [{ id: genId(), date: debt.createdAt || new Date().toISOString(), type: 'debt', description: 'Initial', amount: debt.amount }];
    }

    var settled = debt.remainingBalance <= 0;
    var collected = (debt.amount || 0) - debt.remainingBalance;

    balanceCard.innerHTML =
      '<div style="background:' + (settled ? '#f0fdf4' : '#fffbeb') + ';border-radius:12px;padding:24px;text-align:center;">' +
        '<div style="font-size:var(--text-sm);color:' + (settled ? '#16a34a' : '#b45309') + ';">' + t('currentBalance') + '</div>' +
        '<div style="font-size:34px;font-weight:700;color:' + (settled ? '#16a34a' : '#d97706') + ';">' + formatCurrency(debt.remainingBalance) + '</div>' +
        (settled
          ? '<div style="font-size:var(--text-sm);color:#16a34a;margin-top:4px;">' + t('fullySettled') + '</div>'
          : '<div style="font-size:var(--text-sm);color:#64748b;margin-top:4px;">' + t('lastActivity') + ' ' + formatDateSafe(debt.updatedAt) + '</div>') +
      '</div>';

    payBtnEl.innerHTML =
      '<button class="btn btn-primary btn-large" style="width:100%;" onclick="location.href=\'record_payment.html?id=' + debt.id + '\'">' + t('recordPayment') + '</button>';

    var rows = [];
    var running = 0;
    (debt.transactions || []).forEach(function(tx) {
      if (tx.type === 'payment') {
        running -= tx.amount;
        rows.push({ date: tx.date, desc: tx.description || t('note'), amount: tx.amount, running: running, isPos: false });
      } else {
        running += tx.amount;
        rows.push({ date: tx.date, desc: tx.description || t('initialDebt'), amount: tx.amount, running: running, isPos: true });
      }
    });
    rows.sort(function(a, b) { return new Date(a.date) - new Date(b.date); });
    var html = rows.map(function(r) {
      return '<div class="debt-history-row" style="display:flex;align-items:center;gap:8px;padding:8px 0;">' +
        '<span style="color:' + (r.isPos ? '#16a34a' : '#f97316') + ';font-size:16px;">' + (r.isPos ? '＋' : '－') + '</span>' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-size:var(--text-sm);font-weight:600;color:#1e293b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + r.desc + '</div>' +
          '<div style="font-size:12px;color:#94a3b8;">' + formatDateSafe(r.date) + '</div>' +
        '</div>' +
        '<div style="text-align:right;width:70px;"><div style="font-size:var(--text-sm);color:' + (r.isPos ? '#16a34a' : '#f97316') + ';">' + (r.isPos ? '+' : '-') + formatCurrency(r.amount) + '</div></div>' +
        '<div style="text-align:right;width:80px;font-weight:600;font-size:var(--text-sm);color:#1e293b;">' + formatCurrency(r.running) + '</div>' +
      '</div>';
    }).join('');

    ledgerEl.innerHTML =
      '<div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:16px;">' +
        '<div style="font-weight:700;color:#1e293b;margin-bottom:12px;">' + t('debtHistory') + '</div>' +
        '<div style="display:flex;gap:8px;font-size:12px;color:#94a3b8;font-weight:600;padding-bottom:8px;border-bottom:1px solid #f1f5f9;">' +
          '<div style="width:24px;"></div><div style="flex:1;">' + t('descHeader') + '</div>' +
          '<div style="text-align:right;width:70px;">' + t('amountHeader') + '</div>' +
          '<div style="text-align:right;width:80px;">' + t('balanceHeader') + '</div>' +
        '</div>' +
        (html || '<div class="empty-state">' + t('noData') + '</div>') +
        '<div style="display:flex;justify-content:space-between;margin-top:12px;padding-top:12px;border-top:1px solid #f1f5f9;">' +
          '<div><div style="font-size:12px;color:#94a3b8;">' + t('debtsTotalLabel') + '</div><div style="font-weight:700;">' + formatCurrency(debt.amount) + '</div></div>' +
          '<div style="text-align:right;"><div style="font-size:12px;color:#94a3b8;">' + t('totalCollected') + '</div><div style="font-weight:700;color:#16a34a;">' + formatCurrency(collected) + '</div></div>' +
        '</div>' +
      '</div>';
  }

  // ============================================
  // RECORD PAYMENT PAGE (record_payment.html)
  // ============================================
  function renderRecordPayment() {
    var params = new URLSearchParams(window.location.search);
    var id = params.get('id');
    var debt = state.debts.find(function(d) { return d.id === id; });
    // (Back arrow is now a historyBack() button — v2.51: uniform history
    // navigation across all pages. Coming from debtor_detail pops back to it;
    // coming from the debts list pops back to debts.)
    var card = document.getElementById('rpCustomerCard');
    if (!card) return;
    if (!debt) {
      card.innerHTML = '<div class="empty-state">' + t('customerNotFound') + '</div>';
      return;
    }
    card.innerHTML =
      '<div style="background:#fffbeb;border-radius:12px;padding:16px;display:flex;align-items:center;gap:12px;">' +
        '<div style="width:48px;height:48px;border-radius:8px;background:#fef3c7;display:flex;align-items:center;justify-content:center;font-size:20px;">👤</div>' +
        '<div><div style="font-weight:700;color:#1e293b;">' + debt.customerName + '</div>' +
        '<div style="font-size:var(--text-sm);color:#b45309;">' + t('currentBalance') + ': ' + formatCurrency(debt.remainingBalance) + '</div></div>' +
      '</div>';
    updatePaymentPreview();
  }

  function updatePaymentPreview() {
    var preview = document.getElementById('rpRemainingPreview');
    if (!preview) return;
    var params = new URLSearchParams(window.location.search);
    var id = params.get('id');
    var debt = state.debts.find(function(d) { return d.id === id; });
    var amount = parseFloat(document.getElementById('rpAmountField') ? document.getElementById('rpAmountField').value : 0) || 0;
    var remaining = debt ? (debt.remainingBalance - amount) : 0;
    var over = debt ? amount > debt.remainingBalance : false;
    if (amount <= 0 || !debt) { preview.innerHTML = ''; return; }
    preview.innerHTML =
      '<div style="background:' + (over ? '#fef2f2' : '#f0fdf4') + ';border-radius:12px;padding:16px;text-align:center;">' +
        '<div style="font-size:var(--text-sm);color:' + (over ? '#dc2626' : '#15803d') + ';">' + t('payPreview') + '</div>' +
        '<div style="font-size:30px;font-weight:700;color:' + (over ? '#dc2626' : (remaining <= 0 ? '#16a34a' : '#d97706')) + ';">' + formatCurrency(Math.max(remaining, 0)) + '</div>' +
        (remaining <= 0 && !over ? '<div style="font-size:var(--text-sm);color:#16a34a;">' + t('fullySettled') + '</div>' : '') +
        (over ? '<div style="font-size:var(--text-sm);color:#dc2626;">' + t('paymentExceeds') + '</div>' : '') +
      '</div>';
  }

  function saveRecordPayment() {
    var params = new URLSearchParams(window.location.search);
    var id = params.get('id');
    var debt = state.debts.find(function(d) { return d.id === id; });
    if (!debt) return;
    var amount = parseFloat(document.getElementById('rpAmountField') ? document.getElementById('rpAmountField').value : 0) || 0;
    var note = document.getElementById('rpNoteField') ? document.getElementById('rpNoteField').value.trim() : '';
    if (amount <= 0) { showToast(t('enterAmount'), 'error'); return; }
    if (amount > debt.remainingBalance) { showToast(t('paymentExceeds'), 'error'); return; }
    if (!debt.transactions) debt.transactions = [];
    debt.transactions.push({ id: genId(), date: new Date().toISOString(), type: 'payment', description: note || null, amount: amount });
    debt.remainingBalance -= amount;
    debt.updatedAt = new Date().toISOString();
    saveState();
    showToast(t('paymentSaved'));
    // replace() so Back after paying skips the just-exited payment form
    // (v2.51 history unification; matches mobile popBackStack semantics).
    window.location.replace('debtor_detail.html?id=' + debt.id);
  }

  // ============================================
  // REPORTS PAGE (reports.html)
  // ============================================
  var _reportPeriod = 'day';

  function reportCard(title, bodyHtml) {
    return '<div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:16px;">' +
      '<div style="font-weight:700;color:#1e293b;margin-bottom:8px;">' + title + '</div>' + bodyHtml + '</div>';
  }

  function renderReports() {
    var toggle = document.getElementById('reportPeriodToggle');
    var summary = document.getElementById('reportSummaryCards');
    var best = document.getElementById('reportBestSellers');
    var recent = document.getElementById('reportRecentTx');
    var low = document.getElementById('reportLowStock');
    if (!toggle || !summary) return;

    var sales = state.sales || [];
    var now = new Date();
    var weekAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
    var monthAgo = now.getTime() - 30 * 24 * 60 * 60 * 1000;
    var filtered = sales.filter(function(s) {
      var d = new Date(s.date + 'T00:00:00');
      var ts = d.getTime();
      if (_reportPeriod === 'week') return ts >= weekAgo;
      if (_reportPeriod === 'month') return ts >= monthAgo;
      return s.date === todayStr();
    });
    var totalSales = filtered.reduce(function(sum, s) { return sum + (s.amount || 0); }, 0);
    var totalProfit = filtered.reduce(function(sum, s) { return sum + (s.profit || 0); }, 0);

    toggle.innerHTML = ['day', 'week', 'month'].map(function(p) {
      var label = p === 'day' ? t('periodDay') : (p === 'week' ? t('periodWeek') : t('periodMonth'));
      var sel = _reportPeriod === p;
      return '<button class="btn btn-sm ' + (sel ? 'btn-primary' : 'btn-secondary') + '" style="flex:1;margin-right:6px;" onclick="setReportPeriod(\'' + p + '\')">' + label + '</button>';
    }).join('');

    summary.innerHTML =
      '<div style="display:flex;gap:8px;">' +
        '<div style="flex:1;background:#f0fdf4;border-radius:12px;padding:16px;text-align:center;"><div style="font-size:var(--text-sm);color:#64748b;">' + t('totalSales') + '</div><div style="font-weight:700;color:#16a34a;">' + formatCurrency(totalSales) + '</div></div>' +
        '<div style="flex:1;background:#eff6ff;border-radius:12px;padding:16px;text-align:center;"><div style="font-size:var(--text-sm);color:#64748b;">' + t('reportsProfit') + '</div><div style="font-weight:700;color:#2563eb;">' + formatCurrency(totalProfit) + '</div></div>' +
      '</div>';

    var counts = {};
    filtered.forEach(function(s) { counts[s.productName] = (counts[s.productName] || 0) + (s.quantity || 1); });
    var sorted = Object.keys(counts).map(function(n) { return { name: n, qty: counts[n] }; }).sort(function(a, b) { return b.qty - a.qty; }).slice(0, 5);
    best.innerHTML = reportCard(t('bestSelling'), sorted.length === 0
      ? '<div style="color:#94a3b8;font-size:var(--text-sm);padding:8px 0;">' + t('noData') + '</div>'
      : sorted.map(function(ps, i) {
          return '<div style="display:flex;justify-content:space-between;padding:6px 0;"><div><span style="font-weight:700;color:#b45309;">#' + (i + 1) + '</span> ' + ps.name + '</div><div style="font-weight:600;color:#16a34a;">x' + ps.qty + '</div></div>';
        }).join(''));

    var recentSales = filtered.slice().sort(function(a, b) { return new Date(b.createdAt) - new Date(a.createdAt); }).slice(0, 15);
    recent.innerHTML = reportCard(t('recentTransactions'), recentSales.length === 0
      ? '<div style="color:#94a3b8;font-size:var(--text-sm);padding:8px 0;">' + t('noTransactions') + '</div>'
      : recentSales.map(function(s) {
          return '<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #f1f5f9;">' +
            '<div><div style="font-size:var(--text-sm);color:#1e293b;">' + s.productName + (s.customerName ? ' <span style="color:#16a34a;">(' + s.customerName + ')</span>' : '') + '</div>' +
            '<div style="font-size:12px;color:#94a3b8;">' + formatDateSafe(s.createdAt) + '</div></div>' +
            '<div style="font-weight:600;font-size:var(--text-sm);">' + formatCurrency(s.amount) + '</div></div>';
        }).join(''));

    var lowItems = state.products.filter(function(p) { return getStockStatus(p) !== 'plenty'; });
    low.innerHTML = reportCard(t('lowStockItems'), lowItems.length === 0
      ? '<div style="color:#94a3b8;font-size:var(--text-sm);padding:8px 0;">' + t('noData') + '</div>'
      : lowItems.map(function(p) {
          var st = getStockStatus(p);
          return '<div style="display:flex;justify-content:space-between;padding:6px 0;"><span>' + p.name + '</span><span style="color:' + (st === 'out' ? '#dc2626' : '#d97706') + ';font-weight:600;">' + p.quantity + ' left</span></div>';
        }).join(''));
  }

  function setReportPeriod(p) { _reportPeriod = p; renderReports(); }

  // ============================================
  // HELP PAGE (help.html)
  // ============================================
  function renderHelp() {
    var list = document.getElementById('howToList');
    if (!list) return;
    var items = [
      { icon: '💰', text: t('howToSales') },
      { icon: '📦', text: t('howToStock') },
      { icon: '📒', text: t('howToDebts') },
      { icon: '📊', text: t('howToReports') },
      { icon: '⚙️', text: t('howToSettings') }
    ];
    list.innerHTML = items.map(function(it) {
      return '<div style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid #f1f5f9;">' +
        '<span style="font-size:18px;">' + it.icon + '</span>' +
        '<div style="font-size:var(--text-sm);color:#334155;">' + it.text + '</div></div>';
    }).join('');
  }

  function init() {
    cacheDom();
    loadState();

    // Restore temporary dev date override from sessionStorage (never persisted)
    try { devDateOverride = sessionStorage.getItem('sss_v3_devDateOverride') || null; } catch(e) {}
    // Restore temporary dev time override from sessionStorage (never persisted)
    try {
      var tRaw = sessionStorage.getItem('sss_v3_devTimeOverride');
      if (tRaw !== null && tRaw !== '') devTimeOverride = parseInt(tRaw, 10);
      if (devTimeOverride !== null && (isNaN(devTimeOverride) || devTimeOverride < 0 || devTimeOverride > 23)) devTimeOverride = null;
    } catch(e) {}
    // Restore the pre-override business-day snapshot so clearing later can undo the test
    try {
      var snapRaw = sessionStorage.getItem('sss_v3_devSnapshot');
      if (snapRaw) devStateSnapshot = JSON.parse(snapRaw);
    } catch(e) {}

    // Handle each page type
    if (pageName === 'index') {
      // Landing page: Setup overlay only (first-time setup)
      if (!state.settings.hasCompletedSetup && dom.setupOverlay) {
        dom.setupOverlay.classList.add('open');
        // Render the overlay in the persisted language immediately (web parity
        // with mobile — the setup screen localizes on load and on change).
        if (dom.setupLanguage) dom.setupLanguage.value = state.settings.language || 'fil';
        applyTranslations();
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
      // ── Overdue store detection ──
      // If the store was left open from a previous calendar day (dayOpen &&
      // dayDate < today), do NOT silently archive and close. renderMorningCheck()
      // surfaces an overdue banner (opened date + days open) and offers
      // "Close Old Day & Start Today" or "Review Last Day's Sales" so the owner
      // decides. Uses `<` so a device clock moved backward never archives a
      // "future" day. NOTE: morning.html is the app entry point; other pages
      // are guarded by dayOpen checks, so this single detection point covers
      // normal flows.
      applyTranslations();
      renderMorningCheck();
      // Auto-start main tutorial on fresh app launch (cleared on tab close)
      var _tutorialShown = false;
      try { _tutorialShown = sessionStorage.getItem('sss_v3_tutorialShown') === '1'; } catch(e) {}
      if (!_tutorialShown) {
        state.settings.launchCount = (state.settings.launchCount || 0) + 1;
        saveState();
        if (dom.tutorialOverlay) {
          var isFirstLaunch = state.settings.launchCount === 1;
          setTimeout(function() {
            startTutorial('main', !isFirstLaunch);
          }, 500);
        }
        try { sessionStorage.setItem('sss_v3_tutorialShown', '1'); } catch(e) {}
      }
    } else if (pageName === 'day') {
      // Day mode page
      // If the store is closed, or the open day belongs to a previous business
      // day (stale), route to Morning — where the overdue banner lives.
      if (!state.dayOpen || isStaleOpenDay()) {
        showToast(state.dayOpen ? t('overdueRedirect') : t('dayNotOpen'));
        setTimeout(function() { window.location.href = 'morning.html'; }, 1500);
        return;
      }
      applyTranslations();
      renderDayMode();
    } else if (pageName === 'closing') {
      // Evening closing page
      // If the store is closed, or the open day belongs to a previous business
      // day (stale), route to Morning — where the overdue banner lives.
      if (!state.dayOpen || isStaleOpenDay()) {
        showToast(state.dayOpen ? t('overdueRedirect') : t('dayNotOpen'));
        setTimeout(function() { window.location.href = 'morning.html'; }, 1500);
        return;
      }
      applyTranslations();
      renderClosingScreen();
    } else if (pageName === 'inventory') {
      // Inventory management page
      // Clear any stale edit ID from a previous session (e.g. an edit left
      // unfinished) so the "Add Stock" button always opens a blank form
      // instead of silently entering edit mode for an old product.
      try { localStorage.removeItem('sss_v3_editProductId'); } catch(e) {}
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
        var product = state.products.find(function(p) { return p.id === editId; });
        if (product) {
          state.editProductId = editId;
          if (dom.addProductTitle) dom.addProductTitle.textContent = 'Edit Stock';
          if (dom.productName) dom.productName.value = product.name;
          if (dom.productQty) dom.productQty.value = product.quantity;
          if (dom.productCost) dom.productCost.value = product.costPrice;
          if (dom.productPrice) dom.productPrice.value = product.sellingPrice;
        } else {
          // Stale edit ID (product no longer exists) — treat as a fresh add
          try { localStorage.removeItem('sss_v3_editProductId'); } catch(e) {}
        }
      }
      // Leaving this page without saving (back button, nav) must clear any
      // pending edit ID so the next "Add Stock" opens a blank form instead
      // of re-entering edit mode for the abandoned product.
      window.addEventListener('pagehide', function() {
        try { localStorage.removeItem('sss_v3_editProductId'); } catch(e) {}
      });
    } else if (pageName === 'new_debt') {
      // New Debt page
      applyTranslations();
    } else if (pageName === 'product_detail') {
      // Product Detail page
      applyTranslations();
      renderProductDetail();
    } else if (pageName === 'debtor_detail') {
      // Debtor Detail page
      applyTranslations();
      renderDebtorDetail();
    } else if (pageName === 'record_payment') {
      // Record Payment page
      applyTranslations();
      renderRecordPayment();
    } else if (pageName === 'reports') {
      // Reports page
      applyTranslations();
      renderReports();
    } else if (pageName === 'help') {
      // Help page
      applyTranslations();
      renderHelp();
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
  window.renderProductDetail = renderProductDetail;
  window.deductWebStock = deductWebStock;
  window.deleteWebProduct = deleteWebProduct;
  window.renderDebtorDetail = renderDebtorDetail;
  window.renderRecordPayment = renderRecordPayment;
  window.updatePaymentPreview = updatePaymentPreview;
  window.saveRecordPayment = saveRecordPayment;
  window.renderReports = renderReports;
  window.setReportPeriod = setReportPeriod;
  window.renderHelp = renderHelp;
  window.completeSetup = completeSetup;
  window.showMorningCheck = showMorningCheck;
  window.startDay = startDay;
  window.showClosingScreen = showClosingScreen;
  window.renderClosingScreen = renderClosingScreen;
  window.navigateToDayMode = navigateToDayMode;
  window.backToDay = backToDay;
  window.completeDay = completeDay;
  window.closeDayAndShowMorning = closeDayAndShowMorning;
  window.openSaleSheet = openSaleSheet;
  window.closeSaleSheet = closeSaleSheet;
  window.onProductSearch = onProductSearch;
  window.selectProduct = selectProduct;
  window.adjustQty = adjustQty;
  window.onQtyChange = onQtyChange;
  window.onCustomerSearch = onCustomerSearch;
  window.selectCustomer = selectCustomer;
  window.onNewDebtCustomerSearch = onNewDebtCustomerSearch;
  window.selectNewDebtCustomer = selectNewDebtCustomer;
  window.saveSale = saveSale;
  window.openDebtDetail = openDebtDetail;
  window.closeDebtDetail = closeDebtDetail;
  window.togglePaidDebts = togglePaidDebts;
  window.openPaymentSheet = openPaymentSheet;
  window.closePaymentSheet = closePaymentSheet;
  window.updatePaymentPreview = updatePaymentPreview;
  window.savePayment = savePayment;
  window.renderManageInventory = renderManageInventory;
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
  window.previousTutorial = previousTutorial;
  window.endTutorial = endTutorial;
  window.reopenClosing = reopenClosing;
  window.archiveDaySales = archiveDaySales;
  window.closeStaleDayAndStartToday = closeStaleDayAndStartToday;
  window.openOverdueReview = openOverdueReview;
  window.closeOverdueReview = closeOverdueReview;
  window.historyBack = historyBack;

})();
