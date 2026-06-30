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
      home: 'Home', stocks: 'Stocks', sales: 'Sales', utang: 'Debt', help: 'Help',
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
      insightLoss: '⚠ Your expenses exceed your earnings. You are operating at a loss. Consider raising prices or finding cheaper suppliers to protect your business.',
      insightLowMargin: '📊 Your profit margin is very thin. You are covering costs but leaving little room. Try increasing your selling prices or reducing expenses for a healthier margin.',
      insightHealthy: '✅ Healthy profit margin! Your sales are performing well. Keep up the great work, and consider setting aside your profit for future growth.',
      insightGreat: '🌟 Excellent sales performance! You have a strong profit margin today. Save a portion for reinvestment and celebrate your success!',
      profitMargin: 'Profit Margin',
      utangSalesToday: 'Utang Sales Today',
      pendingProfit: 'Pending Profit',
      cashProfit: 'Cash Profit',
      saveSales: 'Save Today\'s Sales',
      todayRecorded: 'Today\'s sales recorded!',
      todayAlreadyRecorded: 'Today\'s sales are already recorded',
      criticalStockAlert: 'Critical Stock Alert',
      criticalAlertDesc: 'These items need immediate attention',
      addSpecificSale: 'Add a Specific Sale',
      specificSaleDesc: 'For notable items (e.g. large utang purchase)',
      itemDesc: 'Product Name',
      saleAmount: 'Total Amount',
    // Time labels
    justNow: 'just now',
    minAgo: '{n}m',
    hourAgo: '{n}h',
    saleLabel: 'Sale',
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
      customerDebt: 'Customer Debt',
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
      // Daily Sold Items
      dailySoldItems: 'Today\'s Sold Items',
      noSoldToday: 'No items sold today. Add a specific sale above to track sold items.',
      qtyLabel: 'Qty',
      sellPriceLabel: 'Sell Price',
      profitPerItem: 'Profit/item',
      eachLabel: 'each',
      totalProfitLabel: 'Total Profit',
      totalItemsSold: 'Total Items Sold',
      revenueFromSold: 'Revenue from Sold Items',
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
      recordingSaleContent: 'Go to Sales and tap "Record Today\'s Sales". Enter your stock expenses (Gastos sa Paninda) and today\'s cash earnings (Kinikita Ngayon). The app automatically shows gross profit, net profit, revolving fund, and utang breakdown. Use "Add a Specific Sale" for notable items or credit sales - entering a customer name creates a debt record. Today\'s Sold Items and Recent Transactions are in collapsible sections below.',
      addingProducts: 'Adding Products',
      addingProductsContent: 'Go to Stocks and tap "Add Stock". Fill in the item name, quantity, cost per unit, and selling price. You can set a markup percentage to auto-calculate the selling price. Each stock card shows the profit margin. Tap any item to view details, deduct stock, update status, or edit. Low stock items appear in "Running Low" with quick restock buttons.',
      trackingDebts: 'Tracking Debts',
      trackingDebtsContent: 'When completing a specific sale on the New Sale page, entering a customer name automatically records it as both a sale and a debt. You can also manually add debts from Utang screen. Tap a customer to view their full ledger showing debt events and payments. Tap "Record Payment" to log payments with notes.',
      viewingReports: 'Viewing Reports',
      viewingReportsContent: 'Your daily summary is shown on the Home screen with 4 cards: Today\'s Cash Earnings (credit excluded), Stock Alert, Outstanding Debts, and End-of-Day Closing. The End-of-Day screen has a full closing routine with revenue, profit, expenses, credit sales, cash profit, and a checklist. Use Reports for daily, weekly, or monthly trends.',
      endOfDayClosing: 'End-of-Day Closing',
      endOfDayClosingContent: 'Go to End-of-Day from the Home screen to finalize your daily operations. Review the summary showing revenue, expenses, profit, and utang breakdown. Use the checklist to confirm cash counting, stock checks, and payment recordings. Tap "Complete Day" to save and close.',
      usingReports: 'Using Reports',
      usingReportsContent: 'Open Reports from the Help menu to view your store\'s sales performance. Toggle between Daily, Weekly, and Monthly views. Review total sales, profit, recent transactions, best-selling products, and low-stock items to make informed business decisions.',
      appSettings: 'App Settings',
      appSettingsContent: 'Customize your app from the Settings page. Change the language between English and Filipino, adjust text size for readability, set your store and owner name, and configure the low-stock alert threshold.',
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
      dataExportPlaceholder: 'Export will be available in the full app version.',
      dataImportPlaceholder: 'Import will be available in the full app version.',
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
      tutorial1: 'Welcome to Sari-Sari Smart! This quick tour will show you how to manage your store every day - from recording sales and tracking inventory to managing customer utang and running end-of-day reports.',
      tutorial2: 'This is the Sales screen. Tap "Record Today\'s Sales" to enter your stock expenses (gastos) and earnings (kita) for the day. The app automatically calculates your profit, revolving fund, and shows today\'s sold items. Use "Add a Specific Sale" for notable items or credit/utang sales.',
      tutorial3: 'The Stocks page shows all your inventory items with color-coded status: green = plenty, orange = getting low, red = out of stock. Each card shows the profit margin. Use the search bar to find items and check the "Running Low" section for items that need restocking.',
      tutorial4: 'Tap any item to view its details, see cost price, selling price, and profit margin. Deduct stock when something sells, update the status, or tap "Edit" to modify the item. Tap "Add Stock" to add new items to your inventory.',
      tutorial5: 'The Utang page tracks customer debts with the total outstanding balance at the top. Tap a customer card to view their full debt history - including individual debt events and payments - and record new payments. Debts can also be created automatically when you add a customer name to a specific sale.',
      tutorial6: 'The Home screen gives you a complete snapshot of your store: today\'s cash earnings (credit sales excluded), stock alerts, outstanding debts, and the End-of-Day closing routine. Business tips help you make smarter decisions based on your store\'s current activity.',
      tutorial7: 'From the Help screen you can replay any tutorial or read the detailed "How to Use" guide with step-by-step instructions for sales, products, debts, reports, and end-of-day closing.',
      tutorial8: 'You\'re all set! Start using Sari-Sari Smart to manage your store, track inventory, record sales, monitor customer utang, and run end-of-day reports. Good luck sa iyong tindahan!',
      tutorial9: 'Need more detailed guidance? You can access step-by-step tutorials for each page from the Help section — just go to Help and pick the tutorial you want. Or look for the (?) Help button at the top of any page — tap it to launch a page-specific tutorial whenever you need extra guidance!',
      // EOD Tutorial
      eodTutorial1: 'This is the End-of-Day Closing page where you finalize your daily store operations.',
      eodTutorial2: 'The summary shows today\'s total revenue, expenses, gross profit, and net profit at a glance.',
      eodTutorial3: 'The Utang Breakdown section shows sales made on credit, pending profit from credit sales, and your actual cash profit for the day.',
      eodTutorial4: 'Use the checklist to confirm you\'ve counted your cash, checked your stock, and recorded any customer payments.',
      eodTutorial5: 'Tap the checklist items to mark them as complete. The system tracks your progress.',
      eodTutorial6: 'When you\'re ready, tap "Complete Day" to finalize. This saves your end-of-day data and prepares for the next day.',
      // Reports Tutorial
      reportTutorial1: 'The Reports page shows your store\'s sales performance over time.',
      reportTutorial2: 'Use the toggle buttons to switch between Daily, Weekly, and Monthly views.',
      reportTutorial3: 'The summary cards show total sales and profit for the selected period.',
      reportTutorial4: 'Recent transactions appear here with details on each sale. Scroll to see more.',
      reportTutorial5: 'The Best-Selling Products section shows your top-performing items.',
      reportTutorial6: 'Low-stock items are listed here so you know what needs restocking.',
      // Settings Tutorial
      settingsTutorial1: 'The Settings page lets you customize your app experience.',
      settingsTutorial2: 'Choose between English and Filipino for the app language.',
      settingsTutorial3: 'Adjust the text size to Standard, Large, or Extra Large for better readability.',
      settingsTutorial4: 'Enter your store name and owner name for a personalized experience.',
      settingsTutorial5: 'Set the stock alert threshold — the minimum quantity before an item is marked as "Running Low".',
      // Add Product Tutorial
      addProductTutorial1: 'This page lets you add a new product or restock an existing one.',
      addProductTutorial2: 'Enter the item name — suggestions will appear if the product already exists in your inventory.',
      addProductTutorial3: 'Set the cost per unit, markup percentage, and selling price. The markup helper automatically suggests the right selling price.',
      addProductTutorial4: 'Enter the quantity being added. This will be added to your existing stock.',
      addProductTutorial5: 'Tap "Save" to add the product to your inventory. You can edit it later from the Stocks page.',
      // New Sale Tutorial
      newSaleTutorial1: 'This page lets you record a specific sale for notable items or credit/utang transactions.',
      newSaleTutorial2: 'Enter the item or product name and the quantity sold.',
      newSaleTutorial3: 'The total amount is calculated automatically based on the product\'s selling price.',
      newSaleTutorial4: 'If the customer is buying on credit (utang), enter their name here. This will automatically create a debt record.',
      newSaleTutorial5: 'Tap "Save Sale" to record the transaction. If a customer name was entered, it will also appear in the Utang page.',
      // New Debt Tutorial
      newDebtTutorial1: 'This page lets you manually record a new debt for a customer.',
      newDebtTutorial2: 'Enter the customer\'s name. If they\'re a new customer, they\'ll be added automatically.',
      newDebtTutorial3: 'Enter the debt amount. This will be added to the customer\'s existing balance.',
      newDebtTutorial4: 'Tap "Save Debt" to record it. You can view all debts on the Utang page.',
      // Help Tutorial
      helpTutorial1: 'This is the Help page — your guide to using Sari-Sari Smart effectively.',
      helpTutorial2: 'The Tutorial Selector lets you choose from different tutorials. Select a tutorial from the dropdown and tap "Launch" to start a guided tour of any page.',
      helpTutorial3: 'The "How to Use" button opens a detailed guide with step-by-step instructions for recording sales, adding stock, tracking debts, viewing reports, and customizing settings.',
      helpTutorial4: 'The Contact section shows how to reach support for questions or feedback about the app.',
      helpTutorial5: 'The About section tells you about the app version and its purpose.',
      helpTutorial6: 'You can also access page-specific tutorials from any page by tapping the (?) Help button in the top-right corner of the header.',
      // Tutorial Labels
      tutMain: 'Main Tutorial',
      tutHome: 'Home Tutorial',
      tutStock: 'Stock Tutorial',
      tutSales: 'Sales Tutorial',
      tutDebt: 'Debt Tutorial',
    tutEOD: 'End of Day Tutorial',
    tutReport: 'Reports Tutorial',
    tutSettings: 'Settings Tutorial',
    tutAddProduct: 'Add Product Tutorial',
    tutNewSale: 'New Sale Tutorial',
    tutNewDebt: 'New Debt Tutorial',
    tutHelp: 'Help Tutorial',
      tutLaunch: 'Launch',
      tutSelector: 'Select a tutorial...',
      tutSelectToast: 'Please select a tutorial from the dropdown before launching.',
      // Home Tutorial
      homeTutorial1: 'This is your Home dashboard — your store\'s command center. Get a complete snapshot of your business at a glance.',
      homeTutorial2: 'Today\'s Earnings shows your total cash sales and profit (credit/utang sales excluded). Tap it to go to the Sales page.',
      homeTutorial3: 'Stock Alert tells you how many items are running low. Tap it to go to the Stocks page.',
      homeTutorial4: 'Outstanding Debts shows the total amount customers owe you. Tap it to go to the Utang page.',
      homeTutorial5: 'End-of-Day Closing helps you complete your daily store routine: count cash, check stock, record customer payments, and finalize the day\'s summary with revenue, profit, expenses, and cash profit breakdown.',
      homeTutorial6: 'This is the End-of-Day Closing page where you finalize your daily store operations. Complete three steps: count your cash drawer, check your stock levels, and record any customer payments received today.',
      homeTutorial7: 'Step 1: Enter how much cash is in your drawer right now. This helps you verify that your actual cash-on-hand matches what the system recorded from today\'s sales.',
      homeTutorial8: 'Step 2: Check your stock levels. Review items in inventory to identify any items running low that need restocking before the next business day.',
      homeTutorial9: 'Step 3: Record any customer payments received today. This ensures your debt records stay accurate and up-to-date for each customer.',
      homeTutorial10: 'When all steps are complete, tap "Complete Closing" to finalize your day. This saves your end-of-day summary and prepares your store for tomorrow.',
      // Stock Tutorial
      stockTutorial1: 'This is the Stocks page where you manage all your inventory items.',
      stockTutorial2: 'Use the Search bar to quickly find any item by typing its name.',
      stockTutorial3: 'Tap "Add Stock" to add new products or restock existing ones. Fill in the name, quantity, cost per unit, and selling price. You can set a markup percentage to auto-calculate the selling price.',
      stockTutorial4: 'Items running low appear in the "Running Low" section at the top, showing remaining quantity and a quick "Add Stock" button.',
      stockTutorial5: 'All your inventory is listed below with color-coded borders: green = plenty, orange = getting low, red = out of stock.',
      stockTutorial6: 'Each item card shows the name, status indicator, quantity on hand, profit margin percentage, and a "Sold" button to quickly deduct stock when you make a sale.',
      stockTutorial7: 'Tap any item card to open its dedicated Product page showing cost price, selling price, profit margin, and stock status. This is where you manage individual item details.',
      stockTutorial8: 'On the Product page, you can deduct stock when items are sold, update the stock status (Plenty, Getting Low, or Out of Stock), or tap "Edit" to modify item details. Stock updates are reflected immediately.',
      stockTutorial9: 'The Add Stock page lets you add new products or restock existing ones. Enter the item name, quantity, cost per unit, and selling price. The markup helper suggests the right selling price automatically.',
      stockTutorial10: 'Fill in all the fields and tap "Save" to add the product to inventory. The markup percentage helps you maintain consistent pricing across similar products.',
      // Sales Tutorial
      salesTutorial1: 'This is the Sales page where you record your daily store earnings and track specific sales transactions.',
      salesTutorial2: 'Enter your Gastos sa Paninda — how much you spent buying stock today from the palengke or supplier.',
      salesTutorial3: 'Enter your Kinikita Ngayon — the total cash you received from sales today.',
      salesTutorial4: 'As you fill in the amounts, the app automatically calculates your Gross Profit, Estimated Net Profit, and Revolving Fund. The Utang Breakdown section also shows pending profit from credit sales.',
      salesTutorial5: 'Tap "Save Today\'s Sales" to record your daily entry. You can only record once per day, but you can edit the entry anytime before closing the day.',
      salesTutorial6: 'Once recorded, your daily summary stays visible showing gross profit, net profit, revolving fund, and utang breakdown. Below, you will find today\'s sold items and recent transactions in collapsible sections.',
      salesTutorial7: 'Use "Add a Specific Sale" for notable items like large purchases or sales made on utang (credit). Enter a customer name to automatically record it as both a sale and a debt.',
      salesTutorial8: 'Recent specific sales appear in the "Recent Transactions" collapsible section, showing the item name, amount, customer tag (if on utang), and time. The "Today\'s Sold Items" section groups items with quantities and profit totals.',
      salesTutorial9: 'The New Sale page lets you record a specific item sale. Start typing a product name — the app suggests matching items from your inventory for quick selection.',
      salesTutorial10: 'Enter the quantity sold — the total is calculated automatically. If the sale is on credit (utang), enter a customer name to create a debt record. Tap "Save Sale" to finish.',
      // Debt Tutorial
      debtTutorial1: 'This is the Utang page where you track all customer debts.',
      debtTutorial2: 'The Total Outstanding card shows the total amount all customers owe you. It updates automatically as payments are recorded.',
      debtTutorial3: 'Tap "New Debt" to manually add a new debt entry for a customer who borrowed on credit.',
      debtTutorial4: 'Customer debts are listed here. Each card shows the customer name, last activity date, and current balance.',
      debtTutorial5: 'Tap any customer card to view their full debt history - a complete ledger showing individual debt transactions and payments with dates and running balance.',
      debtTutorial6: 'Tap "Record Payment" to log a payment. Enter the amount and an optional note to keep track of partial payments.',
      debtTutorial7: 'The New Debt page lets you manually record a debt. Enter the customer name — new customers are added automatically. Then enter the debt amount to add to their balance.',
      debtTutorial8: 'The Customer Debt page shows a customer\'s full ledger — individual debt entries, payments made, and their current balance. Each transaction shows the date and amount clearly.',
      debtTutorial9: 'The Record Payment page lets you log a payment from a customer. Enter the payment amount and an optional note (e.g. "Partial payment" or "Fully settled").',
      debtTutorial10: 'The remaining balance preview updates as you type the payment amount. Tap "Save Payment" to record it — the customer\'s balance updates automatically.',
    },
    fil: {
      // Nav
      home: 'Home', stocks: 'Stocks', sales: 'Benta', utang: 'Debt', help: 'Tulong',
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
      insightLoss: '⚠ Ang iyong gastos ay mas mataas kaysa sa iyong kita. Ikaw ay nalulugi. Subukan mong taasan ang presyo o humanap ng mas murang supplier upang maprotektahan ang iyong negosyo.',
      insightLowMargin: '📊 Napaka-liit ng iyong tubo. Sapat lang ang iyong kita para masakop ang gastos. Subukan mong taasan ang presyo ng benta o bawasan ang gastos para sa mas malaking tubo.',
      insightHealthy: '✅ Maganda ang iyong tubo! Mahusay ang takbo ng iyong benta. Ipagpatuloy ito, at magtabi ng bahagi ng iyong kita para sa paglago ng negosyo.',
      insightGreat: '🌟 Napakahusay na benta! Malaki ang iyong tubo ngayong araw. Mag-ipon para sa reinvestment at ipagdiwang ang iyong tagumpay!',
      profitMargin: 'Profit Margin',
      utangSalesToday: 'Utang Ngayong Araw',
      pendingProfit: 'Kita na Nakautang',
      cashProfit: 'Cash na Kita',
      saveSales: 'I-save ang Benta Ngayon',
      todayRecorded: 'Naitala na ang benta ngayong araw!',
      todayAlreadyRecorded: 'Ang benta ngayong araw ay naitala na',
      criticalStockAlert: 'Critical Stock Alert',
      criticalAlertDesc: 'Ang mga item na ito ay nangangailangan ng agarang pansin',
      addSpecificSale: 'Magdagdag ng Specific na Benta',
      specificSaleDesc: 'Para sa mga notable na item (hal. malaking utang)',
      itemDesc: 'Pangalan ng Produkto',
      saleAmount: 'Kabuuang Halaga',
    // Time labels
    justNow: 'ngayon lang',
    minAgo: '{n}m ang nakaraan',
    hourAgo: '{n}h ang nakaraan',
    saleLabel: 'Benta',
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
      customerDebt: 'Utang ng Kostumer',
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
      // Daily Sold Items
      dailySoldItems: 'Mga Item na Naibenta Ngayon',
      noSoldToday: 'Walang naibentang item ngayon. Magdagdag ng specific sale sa itaas para masubaybayan ang mga naibenta.',
      qtyLabel: 'Dami',
      sellPriceLabel: 'Presyo',
      profitPerItem: 'Kita bawat isa',
      eachLabel: 'bawat',
      totalProfitLabel: 'Kabuuang Kita',
      totalItemsSold: 'Kabuuang Naibenta',
      revenueFromSold: 'Kita mula sa mga Naibenta',
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
      dataExportPlaceholder: 'Ang Export ay magagamit sa buong bersyon ng app.',
      dataImportPlaceholder: 'Ang Import ay magagamit sa buong bersyon ng app.',
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
      tutorial1: 'Maligayang pagdating sa Sari-Sari Smart! Ang maikling tour na ito ay magtuturo sa iyo kung paano pamahalaan ang iyong tindahan araw-araw.',
      tutorial2: 'Ito ang Sales screen. I-tap ang "Record Today\'s Sales" para ilagay ang iyong gastos sa paninda (stock expenses) at kita (earnings) para sa araw na ito. Awtomatikong kukuwentahin ng app ang iyong profit at revolving fund.',
      tutorial3: 'Ang Stocks page ay nagpapakita ng lahat ng iyong inventory item na may color-coded status: green = marami pa, orange = medyo kulang, red = wala na. Gamitin ang search bar para maghanap ng item at tingnan ang "Kulang Na" section para sa mga item na kailangan nang i-restock.',
      tutorial4: 'I-tap ang kahit anong item para tingnan ang detalye nito, bawasan ang stock kapag may naibenta, o tingnan ang halaga at presyo nito. I-tap ang "Add Stock" para magdagdag ng bagong item sa iyong inventory.',
      tutorial5: 'Ang Utang page ay sumusubaybay sa mga utang ng kostumer - makikita ang kabuuang balanse sa itaas. I-tap ang card ng isang kostumer para makita ang kumpletong kasaysayan ng utang, kabilang ang bawat transaksyon at bayad. Ang utang ay awtomatikong nalilikha kapag naglagay ka ng pangalan ng kostumer sa isang specific sale. I-tap ang "New Debt" para sa manu-manong utang.',
      tutorial6: 'Ang Home screen ay nagbibigay sa iyo ng kumpletong snapshot ng iyong tindahan: kita ngayon (cash lang), stock alert, natitirang utang, at End-of-Day closing routine. Ang mga business tips ay makakatulong sa iyong gumawa ng mas matalinong desisyon.',
      tutorial7: 'Mula sa Help screen, maaari mong i-replay ang tutorial na ito, basahin ang detalyadong "How to Use" guide na may sunod-sunod na tagubilin para sa benta, produkto, utang, at reports, o makipag-ugnayan sa support.',
      tutorial8: 'Handa ka na! Simulan ang paggamit ng Sari-Sari Smart para pamahalaan ang iyong tindahan, subaybayan ang inventory, itala ang benta, at bantayan ang utang ng kostumer. Good luck sa iyong tindahan!',
      tutorial9: 'Kailangan mo ng mas detalyadong gabay? Maaari kang pumunta sa Help section para sa step-by-step na tutorial ng bawat page — pumunta lang sa Help at piliin ang tutorial na gusto mo. O hanapin ang (?) Help button sa itaas ng kahit anong page — i-tap ito para simulan ang tutorial para sa page na iyon!',
      // EOD Tutorial
      eodTutorial1: 'Ito ang End-of-Day Closing page kung saan mo tatapusin ang iyong pang-araw-araw na operasyon sa tindahan.',
      eodTutorial2: 'Ang summary ay nagpapakita ng kabuuang revenue, expenses, gross profit, at net profit para sa araw na ito.',
      eodTutorial3: 'Ang Utang Breakdown section ay nagpapakita ng mga credit sales, pending profit, at ang iyong aktwal na cash profit.',
      eodTutorial4: 'Gamitin ang checklist para kumpirmahin na binilang mo ang iyong pera, sinuri ang stock, at nagtala ng mga bayad ng kostumer.',
      eodTutorial5: 'I-tap ang checklist items para markahan silang kumpleto. Sinusubaybayan ng system ang iyong progreso.',
      eodTutorial6: 'I-tap ang "Complete Day" para tapusin. Ine-save nito ang iyong end-of-day data para sa susunod na araw.',
      // Reports Tutorial
      reportTutorial1: 'Ang Reports page ay nagpapakita ng performance ng iyong tindahan sa paglipas ng panahon.',
      reportTutorial2: 'Gamitin ang toggle buttons para lumipat sa Daily, Weekly, o Monthly views.',
      reportTutorial3: 'Ang summary cards ay nagpapakita ng total sales at profit para sa napiling panahon.',
      reportTutorial4: 'Ang mga recent transactions ay lumalabas dito na may detalye ng bawat benta.',
      reportTutorial5: 'Ang Best-Selling Products section ay nagpapakita ng iyong mga top-performing items.',
      reportTutorial6: 'Ang low-stock items ay nakalista dito para malaman mo kung ano ang kailangan i-restock.',
      // Settings Tutorial
      settingsTutorial1: 'Ang Settings page ay nagbibigay-daan sa iyo na i-customize ang iyong app experience.',
      settingsTutorial2: 'Pumili sa pagitan ng English at Filipino para sa app language.',
      settingsTutorial3: 'Ayusin ang text size sa Standard, Large, o Extra Large para sa mas magandang readability.',
      settingsTutorial4: 'Ilagay ang pangalan ng iyong tindahan at may-ari para sa personalized na experience.',
      settingsTutorial5: 'Itakda ang stock alert threshold — ang minimum na quantity bago ang isang item ay ma-markahan bilang "Kulang Na".',
      // Add Product Tutorial
      addProductTutorial1: 'Ang page na ito ay para magdagdag ng bagong produkto o mag-restock ng existing.',
      addProductTutorial2: 'Ilagay ang pangalan ng item — may lalabas na suggestions kung ang produkto ay nasa inventory na.',
      addProductTutorial3: 'Itakda ang cost per unit, markup percentage, at selling price. Ang markup helper ay awtomatikong nagmumungkahi ng tamang selling price.',
      addProductTutorial4: 'Ilagay ang quantity na idadagdag. Ito ay idadagdag sa iyong existing stock.',
      addProductTutorial5: 'I-tap "Save" para idagdag ang produkto sa iyong inventory. Maaari mo itong i-edit mamaya mula sa Stocks page.',
      // New Sale Tutorial
      newSaleTutorial1: 'Ang page na ito ay para magtala ng specific sale para sa mga notable items o credit/utang transactions.',
      newSaleTutorial2: 'Ilagay ang pangalan ng item at ang quantity na naibenta.',
      newSaleTutorial3: 'Ang total amount ay awtomatikong kinakwenta batay sa selling price ng produkto.',
      newSaleTutorial4: 'Kung ang kostumer ay bumibili on credit (utang), ilagay ang kanilang pangalan dito. Awtomatikong lilikha ito ng debt record.',
      newSaleTutorial5: 'I-tap "Save Sale" para itala ang transaction. Kung may customer name, lalabas din ito sa Utang page.',
      // New Debt Tutorial
      newDebtTutorial1: 'Ang page na ito ay para manu-manong magtala ng bagong utang para sa isang kostumer.',
      newDebtTutorial2: 'Ilagay ang pangalan ng kostumer. Kung sila ay bagong kostumer, awtomatiko silang idadagdag.',
      newDebtTutorial3: 'Ilagay ang halaga ng utang. Ito ay idadagdag sa existing balance ng kostumer.',
      newDebtTutorial4: 'I-tap "Save Debt" para itala ito. Maaari mong tingnan ang lahat ng utang sa Utang page.',
      // Help Tutorial
      helpTutorial1: 'Ito ang Help page — ang iyong gabay sa paggamit ng Sari-Sari Smart nang epektibo.',
      helpTutorial2: 'Ang Tutorial Selector ay nagbibigay-daan sa iyo na pumili ng iba\'t ibang tutorial. Pumili ng tutorial mula sa dropdown at i-tap ang "Launch" para magsimula ng guided tour.',
      helpTutorial3: 'Ang "How to Use" button ay nagbubukas ng detalyadong gabay na may step-by-step na tagubilin para sa pag-record ng benta, pagdagdag ng stock, pagsubaybay ng utang, at iba pa.',
      helpTutorial4: 'Ang Contact section ay nagpapakita kung paano makipag-ugnayan sa support para sa mga tanong o feedback.',
      helpTutorial5: 'Ang About section ay nagsasabi tungkol sa bersyon ng app at layunin nito.',
      helpTutorial6: 'Maaari ka ring mag-access ng page-specific tutorial mula sa kahit anong page sa pamamagitan ng pag-tap sa (?) Help button sa kanang bahagi ng header.',
      // Tutorial Labels
      tutMain: 'Main na Tutorial',
      tutHome: 'Home na Tutorial',
      tutStock: 'Stock na Tutorial',
      tutSales: 'Sales na Tutorial',
      tutDebt: 'Debt na Tutorial',
    tutEOD: 'End of Day na Tutorial',
    tutReport: 'Reports na Tutorial',
    tutSettings: 'Settings na Tutorial',
    tutAddProduct: 'Add Product na Tutorial',
    tutNewSale: 'New Sale na Tutorial',
    tutNewDebt: 'New Debt na Tutorial',
    tutHelp: 'Help na Tutorial',
      tutLaunch: 'Simulan',
      tutSelector: 'Pumili ng tutorial...',
      tutSelectToast: 'Mangyaring pumili ng tutorial mula sa dropdown bago ilunsad.',
      // Home Tutorial
      homeTutorial1: 'Ito ang iyong Home dashboard — ang command center ng iyong tindahan. Makita ang kumpletong snapshot ng iyong negosyo.',
      homeTutorial2: 'Ang Kita Ngayon ay nagpapakita ng iyong kabuuang benta at kita. I-tap ito para pumunta sa Sales page.',
      homeTutorial3: 'Ang Stock Alert ay nagsasabi kung ilang item ang nauubos na. I-tap ito para pumunta sa Stocks page.',
      homeTutorial4: 'Ang Outstanding Debts ay nagpapakita ng kabuuang halaga ng utang ng mga kostumer. I-tap ito para pumunta sa Utang page.',
      homeTutorial5: 'Ang End-of-Day Closing ay tumutulong sa iyong kumpletuhin ang araw-araw na routine: bilangin ang cash, suriin ang stock, at itala ang mga bayad.',
      homeTutorial6: 'Ito ang End-of-Day Closing page kung saan mo tatapusin ang iyong araw-araw na operasyon. Kumpletuhin ang tatlong hakbang: bilangin ang cash sa drawer, suriin ang stock, at itala ang mga bayad ng kostumer ngayong araw.',
      homeTutorial7: 'Hakbang 1: Ilagay ang halaga ng cash sa iyong drawer ngayon. Makakatulong ito upang matiyak na ang iyong aktwal na cash ay tugma sa naitala ng system.',
      homeTutorial8: 'Hakbang 2: Suriin ang iyong stock levels. Tingnan ang inventory para sa mga item na nauubos na at kailangang i-restock bago ang susunod na araw.',
      homeTutorial9: 'Hakbang 3: Itala ang mga bayad ng kostumer na natanggap ngayong araw. Tinitiyak nito na ang iyong debt records ay mananatiling tama at napapanahon.',
      homeTutorial10: 'Kapag kumpleto na ang lahat ng hakbang, i-tap ang "Complete Closing" para tapusin ang araw. Ine-save nito ang iyong end-of-day summary at inihahanda ang tindahan para sa bukas.',
      // Stock Tutorial
      stockTutorial1: 'Ito ang Stocks page kung saan mo pinamamahalaan ang lahat ng iyong inventory item.',
      stockTutorial2: 'Gamitin ang Search bar para mabilis na makahanap ng item sa pamamagitan ng pag-type ng pangalan nito.',
      stockTutorial3: 'I-tap ang "Add Stock" para magdagdag ng bagong produkto o mag-restock ng existing item na may detalye tulad ng pangalan, dami, halaga, at presyo.',
      stockTutorial4: 'Ang mga item na nauubos ay lilitaw sa "Kulang Na" section sa itaas, na may natitirang dami at mabilis na "Add Stock" button.',
      stockTutorial5: 'Ang lahat ng iyong inventory ay nakalista sa ibaba na may color-coded na border: green = marami pa, orange = medyo kulang, red = wala na.',
      stockTutorial6: 'Ang bawat item card ay nagpapakita ng pangalan, status indicator, dami, at "Sold" button para mabilis na bawasan ang stock.',
      stockTutorial7: 'I-tap ang kahit anong item card para buksan ang Product page nito. Makikita mo ang halaga, presyo ng benta, profit margin, at stock status. Dito mo pinamamahalaan ang detalye ng bawat item.',
      stockTutorial8: 'Sa Product page, maaari mong bawasan ang stock kapag may naibenta, i-update ang stock status (Marami Pa, Medyo Kulang, Wala Na), o i-tap ang "Edit" para baguhin ang item details.',
      stockTutorial9: 'Ang Add Stock page ay kung saan mo pinupunan ang pangalan ng produkto, dami, halaga, at presyo ng benta. Ang markup helper ay awtomatikong nagbibigay ng tamang selling price.',
      stockTutorial10: 'Punan ang lahat ng field at i-tap ang "Save" para idagdag ang produkto sa inventory. Ang markup percentage ay tumutulong sa iyo na mapanatili ang consistent na pricing.',
      // Sales Tutorial
      salesTutorial1: 'Ito ang Sales page kung saan mo itinatala ang iyong araw-araw na kita.',
      salesTutorial2: 'Ilagay ang iyong Gastos sa Paninda — magkano ang ginastos mo sa pagbili ng stock ngayon mula sa palengke o supplier.',
      salesTutorial3: 'Ilagay ang iyong Kinikita Ngayon — ang kabuuang cash na natanggap mo mula sa benta ngayong araw.',
      salesTutorial4: 'Habang pinupunan mo ang mga halaga, awtomatikong kukuwentahin ng app ang iyong Gross Profit, Estimated Net Profit, at Revolving Fund.',
      salesTutorial5: 'I-tap ang "Save Today\'s Sales" para itala ang iyong araw-araw na entry. Minsan ka lang makapag-record bawat araw.',
      salesTutorial6: 'Kapag naitala na, mananatiling visible ang iyong daily summary na nagpapakita ng gross profit, net profit, at revolving fund.',
      salesTutorial7: 'Gamitin ang "Add a Specific Sale" para sa mga notable na item tulad ng malaking benta o mga sale na ginawa sa utang.',
      salesTutorial8: 'Lilitaw dito ang mga kamakailang specific sale na may pangalan ng produkto, halaga, at kostumer kung naitala sa utang.',
      salesTutorial9: 'Ang New Sale page ay para magtala ng specific item sale. Simulan ang pag-type ng pangalan ng produkto — ang app ay magmumungkahi ng mga item mula sa iyong inventory.',
      salesTutorial10: 'Ilagay ang quantity na naibenta — awtomatikong kakalkulahin ang total. Kung ang benta ay on credit (utang), ilagay ang pangalan ng customer para awtomatikong lumikha ng debt record. I-tap ang "Save Sale" para matapos.',
      // Debt Tutorial
      debtTutorial1: 'Ito ang Utang page kung saan mo sinusubaybayan ang lahat ng utang ng kostumer.',
      debtTutorial2: 'Ang Total Outstanding card ay nagpapakita ng kabuuang halaga ng utang ng lahat ng kostumer. Awtomatiko itong nag-a-update habang nagtatala ng bayad.',
      debtTutorial3: 'I-tap ang "New Debt" para magdagdag ng bagong utang para sa isang kostumer na umutang sa iyo.',
      debtTutorial4: 'Nakalista dito ang mga utang ng kostumer. Ang bawat card ay nagpapakita ng pangalan, huling aktibidad, at kasalukuyang balanse.',
      debtTutorial5: 'I-tap ang kahit anong customer card para makita ang buong kasaysayan ng utang na may petsa at halaga, kasama ang kasalukuyang balanse.',
      debtTutorial6: 'I-tap ang "Record Payment" para magtala ng bayad. Ilagay ang halaga at isang opsyonal na tala para sa bahagyang bayad.',
      debtTutorial7: 'Ang New Debt page ay para manu-manong magtala ng utang. Ilagay ang pangalan ng customer — awtomatikong idadagdag ang bagong customer. Pagkatapos ilagay ang halaga ng utang.',
      debtTutorial8: 'Ang Customer Debt page ay nagpapakita ng buong ledger ng isang customer — mga utang, bayad, at kasalukuyang balance. Ang bawat transaksyon ay may petsa at halaga.',
      debtTutorial9: 'Ang Record Payment page ay nagbibigay-daan sa iyo na magtala ng bayad mula sa isang customer. Ilagay ang halaga at isang opsyonal na tala (hal. "Partial na bayad").',
      debtTutorial10: 'Ang preview ng natitirang balance ay nag-a-update habang nagta-type ka ng halaga. I-tap ang "Save Payment" para itala — awtomatikong mag-a-update ang balance ng customer.',
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

    // Daily Sales page
    dom.dailyStockExpenses = $('dailyStockExpenses');
    dom.dailyEarnings = $('dailyEarnings');
    dom.dailyResults = $('dailyResults');
    dom.dailyGrossProfit = $('dailyGrossProfit');
    dom.dailyNetProfit = $('dailyNetProfit');
    dom.dailyRevolvingFund = $('dailyRevolvingFund');
    dom.dailyInsight = $('dailyInsight');
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
    dom.specificQty = $('specificQty');
    dom.specificAmountDisplay = $('specificAmountDisplay');
    dom.productSuggestion = $('productSuggestion');

    // Stocks page
    dom.kulangNaSection = $('kulangNaSection');
    dom.kulangNaList = $('kulangNaList');
    dom.allStocksList = $('allStocksList');
    dom.stockSearch = $('stockSearch');
    dom.btnAddStock = $('btnAddStock');
    dom.allItemsLabel = $('allItemsLabel');

    // Stock detail / deduct (product page)
    dom.stockDetailQty = $('stockDetailQty');
    dom.stockDetailCost = $('stockDetailCost');
    dom.stockDetailPrice = $('stockDetailPrice');
    dom.stockDetailMargin = $('stockDetailMargin');
    dom.stockDeductQty = $('stockDeductQty');
    dom.btnConfirmDeduct = $('btnConfirmDeduct');

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
        dom.helpContact = $('helpContact');
    dom.helpAbout = $('helpAbout');
        
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

    // Tutorial selector (Help page)
    dom.tutorialSelector = $('tutorialSelector');
    dom.tutorialLaunchBtn = $('tutorialLaunchBtn');

    // Page header tutorial buttons
    dom.headerTutorialBtn = $('headerTutorialBtn');

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
    try {
      const lang = currentLang || 'en';
      if (strings && strings[lang] && strings[lang][key] !== undefined) return strings[lang][key];
      if (strings && strings['en'] && strings['en'][key] !== undefined) return strings['en'][key];
      return key || '';
    } catch(e) {
      console.warn('[Sari-Sari Smart] t() error for:', key, e);
      return typeof key === 'string' ? key : '';
    }
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
        home: t('home'), eod: t('eodTitle'), endofday: t('eodTitle'),
        debts: t('utang'), new_debt: t('newDebtManual'),
        customer_debt: t('customerDebt'), payment: t('recordPayment'),
        reports: t('reports'), help: t('help'), help_how_to_use: t('howToUse'), setting: t('settings'),
        product: 'Product'
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


    } catch(e) {
      state.products = getSampleProducts();
      state.customers = getSampleCustomers();
    }
  }

  // ============================================
  // EOD PROGRESS (persist across page navigations)
  // ============================================
  function saveEodProgress() {
    var today = todayStr();
    var progress = {
      step1Done: dom.eodStep1Done.style.display === 'flex' || dom.eodStep1Done.style.display === 'block',
      step2Done: dom.eodStep2Done.style.display === 'flex' || dom.eodStep2Done.style.display === 'block',
      step3Done: dom.eodStep3Done.style.display === 'flex' || dom.eodStep3Done.style.display === 'block',
      step1Value: dom.eodStep1Input ? dom.eodStep1Input.value : '',
      summaryVisible: dom.eodSummaryOverlay.style.display === 'block'
    };
    try {
      localStorage.setItem('sss_eodProgress_' + today, JSON.stringify(progress));
    } catch(e) { /* ignore */ }
  }

  function loadEodProgress() {
    var today = todayStr();
    try {
      var saved = localStorage.getItem('sss_eodProgress_' + today);
      if (!saved) return null;
      return JSON.parse(saved);
    } catch(e) {
      return null;
    }
  }

  function clearEodProgress() {
    var today = todayStr();
    try {
      localStorage.removeItem('sss_eodProgress_' + today);
    } catch(e) { /* ignore */ }
  }

  // ============================================
  // UTILITY
  // ============================================
  function getProfitMargin(costPrice, sellingPrice) {
    if (!costPrice || costPrice <= 0 || !sellingPrice || sellingPrice <= 0) return null;
    return ((sellingPrice - costPrice) / costPrice) * 100;
  }

  function formatPercent(value) {
    if (value === null || value === undefined) return '--';
    var sign = value >= 0 ? '+' : '';
    return sign + Math.round(value) + '%';
  }

  function getStockStatus(product) {
    if (!product) return 'plenty';
    if (product.quantity <= 0) return 'out';
    var threshold = product.lowStockThreshold || 5;
    if (product.quantity <= threshold) return 'low';
    return 'plenty';
  }

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
    // Dynamically create confirm modal if not present in page HTML
    if (!dom.confirmOverlay) {
      var modal = document.createElement('div');
      modal.className = 'overlay';
      modal.id = 'confirmOverlay';
      modal.innerHTML = [
        '<div class="overlay-content overlay-xs">',
          '<div class="confirm-icon" id="confirmIcon">',
            '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
          '</div>',
          '<h3 class="confirm-title" id="confirmTitle">Are you sure?</h3>',
          '<p class="confirm-message" id="confirmMessage">This action cannot be undone.</p>',
          '<div class="confirm-actions">',
            '<button class="btn btn-secondary" id="confirmNo" data-i18n="cancel">Cancel</button>',
            '<button class="btn btn-primary" id="confirmYes" data-i18n="confirm">Confirm</button>',
          '</div>',
        '</div>'
      ].join('\n');
      modal.dataset.dynamicCreated = 'true';
      document.body.appendChild(modal);
      dom.confirmOverlay = document.getElementById('confirmOverlay');
      dom.confirmIcon = document.getElementById('confirmIcon');
      dom.confirmTitle = document.getElementById('confirmTitle');
      dom.confirmMessage = document.getElementById('confirmMessage');
      dom.confirmYes = document.getElementById('confirmYes');
      dom.confirmNo = document.getElementById('confirmNo');
      // Wire up buttons
      if (dom.confirmNo) dom.confirmNo.addEventListener('click', closeConfirm);
      if (dom.confirmYes) {
        dom.confirmYes.addEventListener('click', function() {
          if (confirmCallback) {
            confirmCallback();
            closeConfirm();
          }
        });
      }
    }
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
      '<a class="home-card" href="' + (endOfDayDone ? '#' : 'endofday.html') + '" id="homeEndOfDay" style="' + (endOfDayDone ? 'opacity:0.6;pointer-events:none;' : '') + '">' +
        '<div class="home-card-icon blue">' +
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
        '</div>' +
        '<div class="home-card-info">' +
          '<div class="home-card-label" data-i18n="endOfDay">' + t('endOfDay') + '</div>' +
          '<div class="home-card-sub">' + (endOfDayDone ? '✓ ' + t('eodDone') : t('endOfDayDesc')) + '</div>' +
        '</div>' +
      '</a>' +
      // Business Tip
      '<div class="home-tip-card">' +
        '<div class="home-tip-icon">💡</div>' +
        '<div class="home-tip-label" data-i18n="businessTip">' + t('businessTip') + '</div>' +
        '<div class="home-tip-text">' + getBusinessTip() + '</div>' +
      '</div>';
  }

  function getBusinessTip() {
    const today = todayStr();
    const todayEntry = state.dailyEntries.find(function(e) { return e.date === today; });
    const totalDebt = state.debts.reduce(function(sum, d) { return sum + d.remainingBalance; }, 0);
    const outOfStock = state.products.filter(function(p) { return getStockStatus(p) === 'out' || p.quantity <= 0; });
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
    var trulyLowOnly = lowItems.filter(function(p) { return getStockStatus(p) !== 'out' && p.quantity > 0; });
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

    // Priority 6: Sales performance insights (after stock/debt checks)
    if (salesRecorded) {
      var insight = getSalesInsight(todayEntry.stockExpenses, todayEntry.earnings, todayEntry.grossProfit);
      if (insight && insight.type === 'loss') {
        return '⚠ ' + t('insightLoss');
      }
    }

    // Calculate recent sales trend (last 7 days)
    var recentEntries = state.dailyEntries.filter(function(e) {
      return e.date !== today && e.date >= daysAgo(today, 7);
    });
    var recentAvgEarnings = recentEntries.length > 0
      ? recentEntries.reduce(function(sum, e) { return sum + e.earnings; }, 0) / recentEntries.length
      : 0;

    if (salesRecorded && recentEntries.length >= 2) {
      var margin = todayEntry.earnings > 0 ? (todayEntry.grossProfit / todayEntry.earnings) * 100 : 0;
      if (todayEntry.earnings > recentAvgEarnings * 1.2) {
        return '📈 Your sales today (' + formatCurrency(todayEntry.earnings) + ') are ' + Math.round((todayEntry.earnings / recentAvgEarnings - 1) * 100) + '% higher than your recent average! Keep up the momentum!';
      } else if (todayEntry.earnings < recentAvgEarnings * 0.8) {
        return '📉 Your sales today are lower than your recent average. Don\'t worry — every day is different. Check stock levels and try promoting your best-sellers tomorrow.';
      } else if (margin >= 30) {
        return '✅ Strong profit margin of ' + Math.round(margin) + '%! You are pricing your items well. Consider expanding your product range with this healthy margin.';
      }
    }

    if (salesRecorded && recentEntries.length === 0) {
      var margin = todayEntry.earnings > 0 ? (todayEntry.grossProfit / todayEntry.earnings) * 100 : 0;
      if (margin >= 30) {
        return '✅ Strong profit margin of ' + Math.round(margin) + '% on your first recorded day! Great start — keep tracking your sales daily to spot trends.';
      } else if (margin >= 15) {
        return '📊 Your profit margin is ' + Math.round(margin) + '%. To grow your business, try bundling related items or offering small discounts for bulk purchases.';
      } else if (margin > 0 && margin < 15) {
        return '📊 Your profit margin is ' + Math.round(margin) + '%. Consider reviewing your supplier prices or adjusting your selling prices to increase profitability.';
      }
    }

    // Priority 7: Check pending profit from today's utang sales (after trend/performance tips)
    if (salesRecorded) {
      var pendingProfit = getTodayPendingProfit();
      if (pendingProfit > 0 && todayEntry) {
        var pctOfProfit = todayEntry.netProfit > 0 ? Math.round((pendingProfit / todayEntry.netProfit) * 100) : 0;
        if (pctOfProfit >= 50) {
          return '📌 ' + formatCurrency(pendingProfit) + ' of your profit is tied up in utang. Consider following up with debtors to improve cash flow.';
        } else if (pctOfProfit >= 20) {
          return '📌 ' + formatCurrency(pendingProfit) + ' of today\'s profit is still in utang. Collect payments to unlock your cash.';
        }
      }
    }

    // Priority 8: General positive feedback — all caught up
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
    return state.products.filter(function(p) {
      var status = getStockStatus(p);
      return status === 'low' || status === 'out';
    });
  }

  function getTodaySpecificSalesTotal() {
    const today = todayStr();
    // Sum only cash sales (no customer = cash payment). Credit sales don't count as earnings.
    return state.specificSales
      .filter(function(s) { return isSameDay(s.createdAt || s.date, today) && !s.customerName; })
      .reduce(function(sum, s) { return sum + s.amount; }, 0);
  }

  function getTodayUtangSales() {
    const today = todayStr();
    return state.specificSales.filter(function(s) {
      return s.customerName && isSameDay(s.createdAt || s.date, today);
    });
  }

  function getTodayUtangTotal() {
    return getTodayUtangSales().reduce(function(sum, s) { return sum + s.amount; }, 0);
  }

  function getTodayPendingProfit() {
    return getTodayUtangSales().reduce(function(sum, s) { return sum + (s.profit || 0); }, 0);
  }

  function getTodayCashProfit(netProfit, pendingProfit) {
    return Math.max(0, netProfit - pendingProfit);
  }

  function updateUtangBreakdown(netProfit) {
    var breakdown = document.getElementById('dailyUtangBreakdown');
    if (!breakdown) return;
    var utangTotal = getTodayUtangTotal();
    var pendingProfit = getTodayPendingProfit();
    var cashProfit = getTodayCashProfit(netProfit, pendingProfit);
    var utangEl = document.getElementById('dailyUtangTotal');
    var pendingEl = document.getElementById('dailyPendingProfit');
    var cashEl = document.getElementById('dailyCashProfit');
    if (utangTotal > 0) {
      breakdown.style.display = '';
      if (utangEl) utangEl.textContent = formatCurrency(utangTotal);
      if (pendingEl) pendingEl.textContent = formatCurrency(pendingProfit);
      if (cashEl) cashEl.textContent = formatCurrency(cashProfit);
    } else {
      breakdown.style.display = 'none';
    }
  }

  function getSalesInsight(expenses, earnings, grossProfit) {
    if (earnings <= 0 && expenses <= 0) return null;
    if (earnings <= 0) return { type: 'loss', key: 'insightLoss' };
    var margin = earnings > 0 ? (grossProfit / earnings) * 100 : 0;
    if (grossProfit <= 0 || earnings <= expenses) return { type: 'loss', key: 'insightLoss' };
    if (margin < 15) return { type: 'info', key: 'insightLowMargin' };
    if (margin < 30) return { type: 'success', key: 'insightHealthy' };
    return { type: 'success', key: 'insightGreat' };
  }

  function renderSalesInsight(expenses, earnings, grossProfit) {
    if (!dom.dailyInsight) return;
    var insight = getSalesInsight(expenses, earnings, grossProfit);
    if (insight) {
      dom.dailyInsight.textContent = t(insight.key);
      dom.dailyInsight.className = 'daily-insight daily-insight--' + insight.type;
      dom.dailyInsight.style.display = 'block';
    } else {
      dom.dailyInsight.style.display = 'none';
    }
  }

  function updateProfitMarginDisplay(grossProfit, earnings) {
    if (!dom.dailyResults) return;
    // Update or create profit margin row
    var marginRow = document.getElementById('dailyProfitMarginRow');
    var margin = earnings > 0 ? (grossProfit / earnings) * 100 : 0;
    var marginText = earnings > 0 ? formatPercent(margin) : '--';
    if (marginRow) {
      marginRow.querySelector('.value').textContent = marginText;
    }
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
      renderSalesInsight(todayEntry.stockExpenses, todayEntry.earnings, todayEntry.grossProfit);
      updateProfitMarginDisplay(todayEntry.grossProfit, todayEntry.earnings);
      updateUtangBreakdown(todayEntry.netProfit);
    } else {
      dom.dailyAlreadyRecorded.style.display = 'none';
      dom.dailyForm.style.display = 'block';
      dom.dailyResults.style.display = 'none';
      if (dom.dailyInsight) dom.dailyInsight.style.display = 'none';

      // Reset inputs
      if (dom.dailyStockExpenses) dom.dailyStockExpenses.value = '';
      if (dom.dailyEarnings) dom.dailyEarnings.value = '';
    }

    renderSpecificSalesList();
    renderDailySoldItems();
  }

  function renderSpecificSalesList() {
    if (!dom.specificSalesList) return;
    if (!dom.specificSalesList.classList.contains('collapsible')) dom.specificSalesList.classList.add('collapsible');
    const today = todayStr();
    const todaySpecific = state.specificSales.filter(s => isSameDay(s.createdAt || s.date, today));

    var header = '<div class="collapsible-header" onclick="this.parentNode.classList.toggle(\'collapsed\')">' +
      '<span class=\"collapsible-title\">' + t('recentTransactions') + ' (' + todaySpecific.length + ')</span>' +
      '</div>' +
      '<div class="collapsible-body">';
    var footer = '</div>';

    if (todaySpecific.length === 0) {
      dom.specificSalesList.innerHTML = header + '<div class="empty-state" style="padding:16px 0;">' + t('noTransactions') + '</div>' + footer;
    } else {
      dom.specificSalesList.innerHTML = header + todaySpecific.map(function(s) {
        var ago = '';
        if (s.createdAt) {
          var mins = Math.floor((Date.now() - new Date(s.createdAt).getTime()) / 60000);
          if (mins < 1) ago = t('justNow');
          else if (mins < 60) ago = t('minAgo').replace('{n}', mins);
          else ago = t('hourAgo').replace('{n}', Math.floor(mins / 60));
        }
        return '<div class="sale-history-card">' +
          '<div class="sale-history-icon">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
          '</div>' +
          '<div class="sale-history-info">' +
            '<div class="sale-history-name">' + (s.description || t('saleLabel')) + '</div>' +
            '<div class="sale-history-meta">' +
              (s.customerName ? '<span class="sale-history-customer">' + s.customerName + '</span>' : '') +
              '<span class="sale-history-time">' + ago + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="sale-history-amount-block">' +
            '<span class="sale-history-amount">' + formatCurrency(s.amount) + '</span>' +
          '</div>' +
        '</div>';
      }).join('') + footer;
    }
  }

  function renderDailySoldItems() {
    var section = document.getElementById('dailySoldItemsSection');
    var list = document.getElementById('dailySoldItemsList');
    var summary = document.getElementById('dailySoldItemsSummary');
    if (!section || !list) return;

    var today = todayStr();
    var todaySales = state.specificSales.filter(function(s) {
      return isSameDay(s.createdAt || s.date, today);
    });

    // Wrap in collapsible container
    var header = '<div class="collapsible-header" onclick="this.parentNode.classList.toggle(\'collapsed\')">' +
      '<span class="collapsible-title">' + t('dailySoldItems') + ' (' + todaySales.length + ')</span>' +
      '</div>' +
      '<div class="collapsible-body">';
    var footer = '</div>';

    section.style.display = 'block';
    section.classList.add('collapsible');

    if (todaySales.length === 0) {
      section.innerHTML = header +
        '<div style="padding:16px 0;">' + t('noSoldToday') + '</div>' + footer;
      return;
    }

    // Group sales by product name
    var grouped = {};
    todaySales.forEach(function(s) {
      if (!grouped[s.description]) {
        grouped[s.description] = { name: s.description, totalQty: 0, totalAmount: 0, totalProfit: 0, costPrice: s.costPrice || 0 };
      }
      grouped[s.description].totalQty += s.quantity || 1;
      grouped[s.description].totalAmount += s.amount || 0;
      grouped[s.description].totalProfit += s.profit || 0;
    });

    var products = Object.keys(grouped).map(function(k) { return grouped[k]; });
    products.sort(function(a, b) { return a.name.toLowerCase().localeCompare(b.name.toLowerCase()); });

    var totalQty = 0;
    var totalRevenue = 0;
    var totalProfitAll = 0;

    var itemsHtml = '<div class="daily-sold-list">' + products.map(function(p) {
      var sellPricePerUnit = p.totalQty > 0 ? p.totalAmount / p.totalQty : 0;
      var profitPerUnit = p.totalQty > 0 ? p.totalProfit / p.totalQty : 0;
      totalQty += p.totalQty;
      totalRevenue += p.totalAmount;
      totalProfitAll += p.totalProfit;

      return '<div class="daily-sold-item">' +
        '<div class="daily-sold-icon">' +
          '<span class="daily-sold-qty">' + p.totalQty + '</span>' +
        '</div>' +
        '<div class="daily-sold-info">' +
          '<div class="daily-sold-name">' + p.name + '</div>' +
          '<div class="daily-sold-meta">' +
            formatCurrency(sellPricePerUnit) + ' ' + t('eachLabel') +
            ' \u2022 ' + t('profitPerItem') + ' ' + formatCurrency(profitPerUnit) +
          '</div>' +
        '</div>' +
        '<div class="daily-sold-profit-block">' +
          '<span class="daily-sold-profit-label">' + t('totalProfitLabel') + '</span>' +
          '<span class="daily-sold-profit-value">' + formatCurrency(p.totalProfit) + '</span>' +
        '</div>' +
      '</div>';
    }).join('') + '</div>';

    var summaryHtml = summary.style.display = 'flex' ? '' : '';
    summaryHtml = '<div class="daily-sold-items-summary">' +
      '<div class="daily-sold-summary-row">' +
        '<span class="label">' + t('totalItemsSold') + '</span>' +
        '<span class="value">' + totalQty + '</span>' +
      '</div>' +
      '<div class="daily-sold-summary-row">' +
        '<span class="label">' + t('revenueFromSold') + '</span>' +
        '<span class="value">' + formatCurrency(totalRevenue) + '</span>' +
      '</div>' +
      '<div class="daily-sold-summary-row profit-row">' +
        '<span class="label">' + t('totalProfitLabel') + '</span>' +
        '<span class="value">' + formatCurrency(totalProfitAll) + '</span>' +
      '</div>' +
      '</div>';

    section.innerHTML = header + itemsHtml + summaryHtml + footer;
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
    renderSalesInsight(entry.stockExpenses, entry.earnings, entry.grossProfit);
    updateProfitMarginDisplay(entry.grossProfit, entry.earnings);
    updateUtangBreakdown(entry.netProfit);
  }

  function saveSpecificSale() {
    var name = dom.specificItemDesc ? dom.specificItemDesc.value.trim() : '';
    var qty = parseInt(dom.specificQty ? dom.specificQty.value : 0) || 0;
    var customer = dom.specificCustomer ? dom.specificCustomer.value.trim() : '';
    var product = getMatchedProduct(name);

    if (!name) {
      showToast('Please enter a product name.', 'error');
      return;
    }

    if (!product) {
      showToast('Product not found in inventory. Add it in Stocks first.', 'error');
      return;
    }

    if (qty <= 0) {
      showToast('Please enter a valid quantity.', 'error');
      return;
    }

    if (qty > product.quantity) {
      showToast('Not enough stock. Only ' + product.quantity + ' available.', 'error');
      return;
    }

    var amount = product.sellingPrice * qty;

    var sale = {
      id: generateId(),
      date: todayStr(),
      createdAt: new Date().toISOString(),
      description: name,
      amount: amount,
      quantity: qty,
      costPrice: product.costPrice || 0,
      profit: (product.sellingPrice - (product.costPrice || 0)) * qty,
      customerName: customer || null
    };

    state.specificSales.push(sale);

    // Deduct from inventory (status is auto-computed from quantity)
    product.quantity -= qty;

    // If customer, also record as debt
    if (customer) {
      var cust = state.customers.find(function(c) { return c.name.toLowerCase() === customer.toLowerCase(); });
      if (!cust) {
        cust = { id: generateId(), name: customer };
        state.customers.push(cust);
      }
      if (state.usedCustomerNames.indexOf(customer) === -1) state.usedCustomerNames.push(customer);

      var debt = state.debts.find(function(d) {
        return d.customerName.toLowerCase() === customer.toLowerCase() && d.remainingBalance > 0;
      });
      var txn = { id: generateId(), date: new Date().toISOString(), type: 'debt', description: sale.description, amount: amount };
      if (debt) {
        debt.amount += amount;
        debt.remainingBalance += amount;
        debt.updatedAt = new Date().toISOString();
        if (!debt.transactions) debt.transactions = [];
        debt.transactions.push(txn);
      } else {
        state.debts.push({
          id: generateId(), customerId: cust.id, customerName: cust.name,
          amount: amount, remainingBalance: amount,
          createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
          payments: [], transactions: [txn]
        });
      }
    }

    saveState();
    showToast(t('specificSaleSaved'));

    // Reset form
    dom.specificItemDesc.value = '';
    if (dom.specificQty) dom.specificQty.value = '1';
    if (dom.specificCustomer) dom.specificCustomer.value = '';
    updateSpecificSaleTotal();

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

    // Sort all items alphabetically by name
    products = products.slice().sort(function(a, b) {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });

    // Render "Kulang Na" section — pass query so it filters low items too
    var hasMatchingLowItems = renderKulangNaSection(query);
    renderCriticalStockBanner();

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
      const status = getStockStatus(p);
      const statusClass = status === 'plenty' ? 'plenty' : (status === 'low' ? 'low' : 'out');
      const iconPath = status === 'plenty'
        ? '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>'
        : '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>';

      const statusLabels = {
        plenty: '<span class="dot green"></span><span class="label-green">' + t('maramiPa') + '</span>',
        low: '<span class="dot orange"></span><span class="label-orange">' + t('medyoKulang') + '</span>',
        out: '<span class="dot red"></span><span class="label-red">' + t('walaNa') + '</span>'
      };

      var margin = getProfitMargin(p.costPrice, p.sellingPrice);
      var marginHtml = margin !== null ? '<div class="stock-card-margin">' + t('profitMargin') + ': ' + formatPercent(margin) + '</div>' : '';
      return '<div class="stock-card status-' + statusClass + '" data-pid="' + p.id + '">' +
        '<div class="stock-card-icon ' + statusClass + '">' +
          '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + iconPath + '</svg>' +
        '</div>' +
        '<div class="stock-card-info">' +
          '<div class="stock-card-name">' + p.name + '</div>' +
          '<div class="stock-card-status">' + statusLabels[status] + '</div>' +
          '<div class="stock-card-qty">' + p.quantity + ' ' + (p.unit || 'pcs') + '</div>' +
          marginHtml +
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

    // Sort low items: severity first (out > low), then alphabetically within same severity
    lowItems = lowItems.slice().sort(function(a, b) {
      var statusA = getStockStatus(a);
      var statusB = getStockStatus(b);
      // 'out' (most critical) comes before 'low'
      if (statusA === 'out' && statusB !== 'out') return -1;
      if (statusA !== 'out' && statusB === 'out') return 1;
      // Same severity — sort alphabetically
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });

    dom.kulangNaSection.style.display = 'block';
    dom.kulangNaList.innerHTML = lowItems.map(function(p) {
      const status = getStockStatus(p);
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
    window.location.href = 'product.html?id=' + productId;
  }

  function closeStockDetail() {
    // Overlay removed - replaced by dedicated product page
  }

  function openDeductStock(productId) {
    window.location.href = 'product.html?id=' + productId;
  }

  function confirmDeductStock() {
    const pid = document.getElementById('productIdHolder') ? document.getElementById('productIdHolder').value : null;
    if (!pid) return;

    const qty = parseInt(dom.stockDeductQty ? dom.stockDeductQty.value : 0) || 0;
    const product = state.products.find(p => p.id === pid);
    if (!product || qty <= 0 || qty > product.quantity) {
      showToast('Please enter a valid quantity.', 'error');
      return;
    }

    product.quantity -= qty;
    // Status is now auto-computed from quantity via getStockStatus()

    saveState();
    if (pageName === 'product') {
      showToast(t('stockDeducted'));
      initProductPage();
    } else {
      closeStockDetail();
      showToast(t('stockDeducted'));
      renderStocksList();
    }
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
      // Also update the profit margin preview
      updateAddProductProfitMargin(cost, suggested);
    } else {
      dom.markupSuggestion.style.display = 'none';
    }
    // Also update on sell price change (via input)
  }

  function updateAddProductProfitMargin(cost, sellPrice) {
    var marginEl = document.getElementById('addProductMargin');
    var profitPesoEl = document.getElementById('addProductProfit');
    if (!marginEl && !profitPesoEl) {
      // Create the profit margin display if it doesn't exist
      var markupHelper = document.getElementById('markupSuggestion');
      if (!markupHelper) return;
      var info = document.createElement('div');
      info.id = 'addProductMarginInfo';
      info.style.cssText = 'margin-top:8px;padding-top:8px;border-top:1px solid #bbf7d0;font-size:12px;';
      info.innerHTML = '<div>Profit: <strong id="addProductProfit">₱0.00</strong> &middot; Margin: <strong id="addProductMargin">--</strong></div>';
      markupHelper.appendChild(info);
    }
    var profit = sellPrice - cost;
    var pEl = document.getElementById('addProductProfit');
    var mEl = document.getElementById('addProductMargin');
    if (pEl) pEl.textContent = formatCurrency(Math.max(0, profit));
    if (mEl && cost > 0) {
      var margin = getProfitMargin(cost, sellPrice);
      mEl.textContent = margin !== null ? formatPercent(margin) : '--';
    }
  }

  // ============================================
  // END-OF-DAY CLOSING
  // ============================================


  function completeEodStep1() {
    dom.eodStep1Done.style.display = 'flex';
    saveEodProgress();
  }

  function completeEodStep2() {
    const lowCount = getLowStockItems().length;
    dom.eodStep2Done.style.display = 'flex';
    dom.eodStep2Done.querySelector('.eod-step-done-text').textContent =
      t('eodStep2Done').replace('{count}', lowCount);
    saveEodProgress();
  }

  function completeEodStep3() {
    const todayPayments = state.debts.reduce((count, d) => {
      return count + ((d.payments || []).filter(p => isSameDay(p.date, todayStr())).length);
    }, 0);
    dom.eodStep3Done.style.display = 'flex';
    dom.eodStep3Done.querySelector('.eod-step-done-text').textContent =
      t('eodStep3Done').replace('{count}', todayPayments);
    saveEodProgress();
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
    clearEodProgress();
    // After completing EOD, redirect back to home
    if (pageName === 'eod' || pageName === 'endofday') {
      setTimeout(function() {
        window.location.href = 'home.html';
      }, 2000);
    }
  }

  // ============================================
  // CRITICAL STOCK BANNER
  // ============================================
  function renderCriticalStockBanner() {
    var banner = document.getElementById('criticalStockBanner');
    if (!banner) return;
    var criticalItems = state.products.filter(function(p) {
      return p.quantity <= 0 || getStockStatus(p) === 'out';
    });
    if (criticalItems.length === 0) {
      banner.style.display = 'none';
      return;
    }
    banner.style.display = 'block';
    var list = document.getElementById('criticalStockList');
    if (!list) return;
    list.innerHTML = criticalItems.map(function(p) {
      return '<a class="critical-stock-item" href="add_product.html?restock=' + p.id + '">' +
        '<span class="critical-stock-name">' + p.name + '</span>' +
        '<span class="critical-stock-qty">' + t('stockLabel') + ' ' + p.quantity + '</span>' +
        '<span class="critical-stock-restock">' + t('addStock') + ' →</span>' +
      '</a>';
    }).join('');
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
          if (cid) window.location.href = 'customer_debt.html?id=' + cid;
        }
      });
      dom.debtsList._listenerAttached = true;
    }
  }

  function openCustomerDebt(customerId) {
    window.location.href = 'customer_debt.html?id=' + customerId;
  }

  function openRecordPayment(customerId) {
    window.location.href = 'payment.html?id=' + customerId;
  }

  // ============================================
  // CUSTOMER DEBT PAGE
  // ============================================
  function initCustomerDebtPage() {
    checkTutorialResume();
    var params = new URLSearchParams(window.location.search);
    var cid = params.get('id');
    if (!cid) {
      if (params.get('tutorial') === 'true') return;
      window.location.href = 'debts.html';
      return;
    }
    var holder = document.getElementById('customerDebtIdHolder');
    if (holder) holder.value = cid;

    var customer = state.customers.find(function(c) { return c.id === cid; });
    var debt = state.debts.find(function(d) { return d.customerId === cid; });

    if (!customer) {
      var balEl = document.querySelector('.debt-detail-balance');
      if (balEl) balEl.innerHTML = '<div class="empty-state">Customer not found.</div>';
      return;
    }

    // Update page title
    var titleEl = document.getElementById('headerTitle');
    if (titleEl) titleEl.textContent = customer.name;

    // Update balance
    var balanceEl = document.getElementById('customerDebtBalance');
    if (balanceEl && debt) {
      balanceEl.textContent = formatCurrency(debt.remainingBalance);
    } else if (balanceEl) {
      balanceEl.textContent = formatCurrency(0);
    }

    // Wire Record Payment button
    var payBtn = document.getElementById('btnRecordPayment');
    if (payBtn) {
      payBtn.href = 'payment.html?id=' + cid;
    }

    // Render debt history
    var historyEl = document.getElementById('customerDebtHistory');
    if (!historyEl) return;

    if (!debt) {
      historyEl.innerHTML = '<div class="empty-state">' + t('noData') + '</div>';
      return;
    }

    var history = [];
    (debt.transactions || []).forEach(function(t) {
      history.push({ date: t.date, desc: t.type === 'debt' ? (t.description || 'Debt added') : t.description, amount: t.amount, type: 'debit' });
    });
    if (!debt.transactions || debt.transactions.length === 0) {
      history.push({ date: debt.createdAt, desc: 'Initial debt', amount: debt.amount, type: 'debit' });
    }
    (debt.payments || []).forEach(function(p) {
      history.push({ date: p.date, desc: t('payment') + (p.note ? ': ' + p.note : ''), amount: p.amount, type: 'credit' });
    });
    history.sort(function(a, b) { return new Date(b.date) - new Date(a.date); });

    if (history.length === 0) {
      historyEl.innerHTML = '<div class="empty-state">' + t('noData') + '</div>';
    } else {
      historyEl.innerHTML = history.map(function(h) {
        return '<div class="debt-history-item">' +
          '<div><div style="font-weight:500;">' + h.desc + '</div><div class="debt-history-desc">' + formatDate(h.date) + '</div></div>' +
          '<div class="debt-history-amount ' + (h.type === 'credit' ? 'negative' : 'positive') + '">' +
          (h.type === 'credit' ? '- ' : '+ ') + formatCurrency(h.amount) + '</div></div>';
      }).join('');
    }
  }

  // ============================================
  // PAYMENT PAGE
  // ============================================
  function initPaymentPage() {
    checkTutorialResume();
    var params = new URLSearchParams(window.location.search);
    var cid = params.get('id');
    if (!cid) {
      if (params.get('tutorial') === 'true') return;
      window.location.href = 'debts.html';
      return;
    }

    var holder = document.getElementById('paymentCustomerIdHolder');
    if (holder) holder.value = cid;

    var debt = state.debts.find(function(d) { return d.customerId === cid; });

    if (!debt) {
      showToast('Customer has no debt record.');
      window.location.href = 'debts.html';
      return;
    }

    // Set customer name
    var nameEl = document.getElementById('paymentCustomerName');
    if (nameEl) nameEl.textContent = debt.customerName;

    // Set remaining preview
    var previewEl = document.getElementById('paymentRemainingPreview');
    if (previewEl) previewEl.textContent = formatCurrency(debt.remainingBalance);

    // Update back button href
    var backBtn = document.getElementById('btnPaymentBack');
    if (backBtn) backBtn.href = 'customer_debt.html?id=' + cid;

    // Wire amount input to update preview
    var amountInput = document.getElementById('paymentAmount');
    if (amountInput && previewEl) {
      amountInput.addEventListener('input', function() {
        var val = parseFloat(this.value) || 0;
        var remaining = Math.max(0, (debt.remainingBalance || 0) - val);
        previewEl.textContent = formatCurrency(remaining);
      });
    }

    // Wire save button
    var saveBtn = document.getElementById('btnSavePayment');
    if (saveBtn) {
      saveBtn.addEventListener('click', function() {
        var amt = parseFloat(document.getElementById('paymentAmount') ? document.getElementById('paymentAmount').value : 0) || 0;
        var note = document.getElementById('paymentNote') ? document.getElementById('paymentNote').value.trim() : '';

        if (amt <= 0) {
          showToast('Please enter a valid payment amount.', 'error');
          return;
        }

        if (amt > (debt.remainingBalance || 0)) {
          showToast('Payment exceeds remaining balance.', 'error');
          return;
        }

        // Record payment
        var payment = {
          id: generateId(),
          date: new Date().toISOString(),
          amount: amt,
          note: note
        };
        if (!debt.payments) debt.payments = [];
        debt.payments.push(payment);
        debt.remainingBalance = Math.max(0, (debt.remainingBalance || 0) - amt);
        debt.updatedAt = new Date().toISOString();

        // Add transaction record
        if (!debt.transactions) debt.transactions = [];
        debt.transactions.push({
          id: generateId(),
          date: new Date().toISOString(),
          type: 'payment',
          description: t('payment') + (note ? ': ' + note : ''),
          amount: amt
        });

        saveState();
        showToast(t('paymentSaved'));

        // Navigate back to customer debt page
        window.location.href = 'customer_debt.html?id=' + cid;
      });
    }
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

    // Home tutorial button
    if (dom.headerTutorialBtn) {
      dom.headerTutorialBtn.addEventListener('click', function() {
        startTutorial('home', true);
      });
    }
  }

  // --- END-OF-DAY (Dedicated page) ---
  function initEndOfDayPage() {
    checkTutorialResume();
    var saved = loadEodProgress();
    if (saved) {
      if (saved.step1Done) {
        var el1 = document.getElementById('eodStep1Done');
        if (el1) { el1.style.display = 'flex'; }
      }
      if (saved.step2Done) {
        var el2 = document.getElementById('eodStep2Done');
        if (el2) { el2.style.display = 'flex'; }
      }
      if (saved.step3Done) {
        var el3 = document.getElementById('eodStep3Done');
        if (el3) { el3.style.display = 'flex'; }
      }
      if (saved.step1Value !== undefined && saved.step1Value !== '') {
        var input1 = document.getElementById('eodStep1Input');
        if (input1) { input1.value = saved.step1Value; }
      }
      if (saved.summaryVisible) {
        var summary = document.getElementById('eodSummaryOverlay');
        if (summary) { summary.style.display = 'block'; }
      }
    }
    // Wire up the finish button to redirect after completion
    var finishBtn = document.getElementById('finishEndOfDayBtn');
    if (finishBtn) {
      finishBtn.addEventListener('click', function() {
        window.finishEndOfDay && window.finishEndOfDay();
      });
    }

    // Save EOD progress before leaving the page (preserves input even if Done not tapped)
    window.addEventListener('beforeunload', function() {
      saveEodProgress();
    });
  }

  function enterEodContext() {
    // Hide bottom navigation
    var nav = document.getElementById('bottomNav');
    if (nav) nav.style.display = 'none';

    // Move back button to the LEFT of the header (matching other page patterns)
    var header = document.querySelector('.app-header');
    if (header) {
      var backBtn = document.createElement('a');
      backBtn.className = 'header-btn';
      backBtn.href = 'endofday.html';
      backBtn.setAttribute('aria-label', 'Back');
      backBtn.style.textDecoration = 'none';
      backBtn.style.color = 'white';
      backBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>';

      // Remove header-actions (settings/tutorial buttons)
      var headerActions = header.querySelector('.header-actions');
      if (headerActions) headerActions.remove();

      // Insert back button as the FIRST child (left side)
      var title = header.querySelector('.header-title');
      if (title) {
        header.insertBefore(backBtn, title);
        // Add empty spacer on the right to match add_product.html/setting.html pattern
        var spacer = document.createElement('span');
        spacer.style.width = '36px';
        header.appendChild(spacer);
      } else {
        header.insertBefore(backBtn, header.firstChild);
      }
    }
  }

  // --- SALES (Daily Cash Summary) ---
  function initDailySalesPage() {
    renderDailySalesForm();
    renderSpecificSalesList();
    renderDailySoldItems();

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
            renderSalesInsight(expenses, earnings, gross);
            updateProfitMarginDisplay(gross, earnings);
            var netProfitInput = Math.max(0, gross * (1 - markupPct / 100));
            updateUtangBreakdown(netProfitInput);
          } else if (expenses > 0) {
            // Only expenses entered, no earnings yet
            dom.dailyResults.style.display = 'block';
            dom.dailyGrossProfit.textContent = '₱0.00';
            dom.dailyNetProfit.textContent = '₱0.00';
            dom.dailyRevolvingFund.textContent = '₱0.00';
            renderSalesInsight(expenses, 0, 0);
            updateProfitMarginDisplay(0, 0);
            updateUtangBreakdown(0);
          } else {
            dom.dailyResults.style.display = 'none';
            if (dom.dailyInsight) dom.dailyInsight.style.display = 'none';
            var breakdown = document.getElementById('dailyUtangBreakdown');
            if (breakdown) breakdown.style.display = 'none';
          }
        });
      });
    }

    // Check for tutorial resume (multi-tutorial)
    checkTutorialResume();

    // Sales tutorial button
    if (dom.headerTutorialBtn) {
      dom.headerTutorialBtn.addEventListener('click', function() {
        startTutorial('sales', true);
      });
    }
  }

  // --- NEW SALE (Add Specific Sale) ---
  function getMatchedProduct(name) {
    if (!name) return null;
    var lower = name.toLowerCase();
    // Try exact match first
    var exact = state.products.find(function(p) {
      return p.name.toLowerCase() === lower;
    });
    if (exact) return exact;
    // Fall back to partial/contains match
    return state.products.find(function(p) {
      return p.name.toLowerCase().indexOf(lower) !== -1 || lower.indexOf(p.name.toLowerCase()) !== -1;
    }) || null;
  }

  function updateSpecificSaleTotal() {
    if (!dom.specificItemDesc || !dom.specificQty || !dom.specificAmountDisplay) return;
    var name = dom.specificItemDesc.value.trim();
    var product = getMatchedProduct(name);
    var qty = parseInt(dom.specificQty.value) || 0;

    // Update total amount display
    if (product && product.sellingPrice > 0 && qty > 0) {
      var total = product.sellingPrice * qty;
      dom.specificAmountDisplay.textContent = formatCurrency(total);
    } else if (product && product.sellingPrice > 0) {
      dom.specificAmountDisplay.textContent = formatCurrency(product.sellingPrice);
    } else {
      dom.specificAmountDisplay.textContent = '₱0.00';
    }

    // Show inline product suggestion
    showProductSuggestion(name, product);
  }

  function showProductSuggestion(typedName, matchedProduct) {
    if (!dom.productSuggestion) return;

    // No text typed — hide suggestion
    if (!typedName) {
      dom.productSuggestion.style.display = 'none';
      return;
    }

    // Check if the typed name exactly matches a product name
    var exactMatch = matchedProduct && matchedProduct.name.toLowerCase() === typedName.toLowerCase();

    if (matchedProduct && !exactMatch) {
      // Partial match — show "Did you mean: [Product]?" as a clickable suggestion
      dom.productSuggestion.style.display = 'block';
      dom.productSuggestion.className = 'product-suggestion';
      dom.productSuggestion.innerHTML = 'Did you mean: <strong>' + matchedProduct.name + '</strong>?';
      dom.productSuggestion.dataset.productId = matchedProduct.id;
    } else if (matchedProduct && exactMatch) {
      // Exact match — product is confirmed, show brief confirmation and hide suggestion
      dom.productSuggestion.style.display = 'none';
    } else {
      // No match found — show "not found" message
      dom.productSuggestion.style.display = 'block';
      dom.productSuggestion.className = 'product-suggestion product-suggestion--not-found';
      dom.productSuggestion.innerHTML = 'Product not found in inventory';
      dom.productSuggestion.dataset.productId = '';
    }
  }

  function onSuggestionClick(productId) {
    if (!productId) return;
    var product = state.products.find(function(p) { return p.id === productId; });
    if (!product) return;
    // Fill the input with the matched product name
    if (dom.specificItemDesc) {
      dom.specificItemDesc.value = product.name;
    }
    // Recalculate total and hide suggestion
    updateSpecificSaleTotal();
    if (dom.productSuggestion) {
      dom.productSuggestion.style.display = 'none';
    }
    // Focus back on quantity for quick editing
    if (dom.specificQty) {
      dom.specificQty.focus();
      dom.specificQty.select();
    }
  }

  function initSpecificSalePage() {
    checkTutorialResume();
    updateSpecificSaleTotal();

    if (dom.specificItemDesc) {
      dom.specificItemDesc.addEventListener('input', updateSpecificSaleTotal);
    }
    if (dom.specificQty) {
      dom.specificQty.addEventListener('input', updateSpecificSaleTotal);
    }
    if (dom.btnSaveSpecific) {
      dom.btnSaveSpecific.addEventListener('click', saveSpecificSale);
    }
    if (dom.btnBackSales) {
      dom.btnBackSales.addEventListener('click', function() { window.location.href = 'sales.html'; });
    }

    // Click handler for product suggestion
    if (dom.productSuggestion) {
      dom.productSuggestion.addEventListener('click', function() {
        onSuggestionClick(this.dataset.productId);
      });
    }
  }

  // --- INVENTORY (Stocks) ---
  function initStocksPage() {
    var params = new URLSearchParams(window.location.search);
    if (params.get('from') === 'eod') {
      enterEodContext();
    }
    renderStocksList();

    if (dom.stockSearch) {
      dom.stockSearch.addEventListener('input', function() { renderStocksList(); });
    }

    if (dom.btnAddStock) {
      dom.btnAddStock.addEventListener('click', () => window.location.href = 'add_product.html');
    }

    // Stock detail overlay

    // Status chips are now display-only; computed from quantity
    // Removed manual status setting via chip clicks
    if (dom.btnConfirmDeduct) {
      dom.btnConfirmDeduct.addEventListener('click', confirmDeductStock);
    }



    checkTutorialResume();

    // Stock tutorial button
    if (dom.headerTutorialBtn) {
      dom.headerTutorialBtn.addEventListener('click', function() {
        startTutorial('stock', true);
      });
    }
  }

  // --- ADD PRODUCT (Add Stock) ---
  function initAddStockPage() {
    checkTutorialResume();
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
    if (dom.stockSellPrice) {
      dom.stockSellPrice.addEventListener('input', function() {
        var cost = parseFloat(dom.stockCostPrice ? dom.stockCostPrice.value : 0) || 0;
        var sell = parseFloat(this.value) || 0;
        if (cost > 0 && sell > 0) {
          updateAddProductProfitMargin(cost, sell);
          // Also show markup hint
          var markup = ((sell - cost) / cost) * 100;
          if (dom.markupHint) dom.markupHint.textContent = t('markupHint').replace('{percent}', Math.round(markup));
          if (dom.markupSuggestion) dom.markupSuggestion.style.display = 'block';
          if (dom.markupSuggestedPrice) dom.markupSuggestedPrice.textContent = formatCurrency(sell);
        }
      });
    }

    // Restock quantity handling
    if (restockId && dom.stockQty) {
      dom.stockQty.placeholder = '0';
    }
  }

  // --- DEBTS / UTANG ---
  function initDebtsPage() {
    var params = new URLSearchParams(window.location.search);
    if (params.get('from') === 'eod') {
      enterEodContext();
    }
    updateDebtSummary();
    renderDebtsList();
    checkTutorialResume();

    // Debt tutorial button
    if (dom.headerTutorialBtn) {
      dom.headerTutorialBtn.addEventListener('click', function() {
        startTutorial('debt', true);
      });
    }

    if (dom.btnNewDebt) {
      dom.btnNewDebt.addEventListener('click', () => window.location.href = 'new_debt.html');
    }

    // Overlay event listeners removed - using dedicated pages instead
    // Customer cards now navigate to customer_debt.html?id=X
    // Record Payment is handled in payment.html page


  }

  // --- NEW DEBT ---
  function initNewDebtPage() {
    checkTutorialResume();
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
        var txn = { id: generateId(), date: new Date().toISOString(), type: 'debt', description: 'Manual debt entry', amount: amount };
        if (debt) {
          debt.amount += amount;
          debt.remainingBalance += amount;
          debt.updatedAt = new Date().toISOString();
          if (!debt.transactions) debt.transactions = [];
          debt.transactions.push(txn);
        }
        else { state.debts.push({ id: generateId(), customerId: customer.id, customerName: customer.name, amount, remainingBalance: amount, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), payments: [], transactions: [txn] }); }

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
    if (dom.headerTutorialBtn) {
      dom.headerTutorialBtn.addEventListener("click", function() {
        startTutorial("help", true);
      });
    }

    // Tutorial dropdown selector
    if (dom.tutorialSelector) {
      // Populate selector with available tutorials
      var html = '<option value="">' + t('tutSelector') + '</option>';
      var keys = ['main', 'home', 'stock', 'sales', 'debt'];
      keys.forEach(function(key) {
        var tut = tutorials[key];
        if (tut) {
          html += '<option value="' + key + '">' + t(tut.label) + '</option>';
        }
      });
      dom.tutorialSelector.innerHTML = html;
    }

    if (dom.tutorialLaunchBtn) {
      dom.tutorialLaunchBtn.addEventListener('click', function() {
        var selectedId = dom.tutorialSelector ? dom.tutorialSelector.value : '';
        if (!selectedId) {
          showToast(t('tutSelectToast'), 'info');
          return;
        }
        if (selectedId === 'main') {
          saveTutorialState('main', 0, true);
          window.location.href = 'sales.html?tutorial=true';
        } else {
          var tutorial = tutorials[selectedId];
          if (tutorial && tutorial.page) {
            saveTutorialState(selectedId, 0, true);
            window.location.href = tutorial.page + '.html?tutorial=true';
          }
        }
      });
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
    checkTutorialResume();
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
        showToast(t('dataExportPlaceholder'), 'info');
      });
    }

    if (dom.btnImportData) {
      dom.btnImportData.addEventListener('click', function() {
        showToast(t('dataImportPlaceholder'), 'info');
      });
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
  function saveTutorialState(tutorialId, step, isReplay) {
    try { localStorage.setItem('sss_tutorial', JSON.stringify({ id: tutorialId || 'main', step: step, isReplay: isReplay })); } catch(e) {}
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
  var _tutorialRAF = null;

  const tutorials = {
    main: {
      label: 'tutMain',
      steps: [
        { textKey: 'tutorial1', highlight: null, page: 'sales' },
        { textKey: 'tutorial2', highlight: '#btnSaveDailySales', page: 'sales' },
        { textKey: 'tutorial3', highlight: '#btnAddStock', page: 'inventory' },
        { textKey: 'tutorial4', highlight: null, page: 'inventory' },
        { textKey: 'tutorial5', highlight: '#btnNewDebt', page: 'debts' },
        { textKey: 'tutorial6', highlight: null, page: 'home' },
        { textKey: 'tutorial7', highlight: null, page: 'help' },
        { textKey: 'tutorial8', highlight: null, page: 'help' },
        { textKey: 'tutorial9', highlight: '#headerTutorialBtn', page: 'home' }
      ]
    },
    home: {
      label: 'tutHome',
      page: 'home',
      steps: [
        { textKey: 'homeTutorial1', highlight: null },
        { textKey: 'homeTutorial2', highlight: '.home-card:nth-child(1)' },
        { textKey: 'homeTutorial3', highlight: '.home-card:nth-child(2)' },
        { textKey: 'homeTutorial4', highlight: '.home-card:nth-child(3)' },
        { textKey: 'homeTutorial5', highlight: '#homeEndOfDay' },
        { textKey: 'homeTutorial6', page: 'endofday' },
        { textKey: 'homeTutorial7', highlight: '.eod-step:first-child', page: 'endofday' },
        { textKey: 'homeTutorial8', highlight: '.eod-step:nth-child(2)', page: 'endofday' },
        { textKey: 'homeTutorial9', highlight: '.eod-step:nth-child(3)', page: 'endofday' },
        { textKey: 'homeTutorial10', highlight: '#finishEndOfDayBtn', page: 'endofday' }
      ]
    },
    stock: {
      label: 'tutStock',
      page: 'inventory',
      steps: [
        { textKey: 'stockTutorial1', highlight: null },
        { textKey: 'stockTutorial2', highlight: '#stockSearch' },
        { textKey: 'stockTutorial3', highlight: '#btnAddStock' },
        { textKey: 'stockTutorial4', highlight: '#kulangNaList' },
        { textKey: 'stockTutorial5', highlight: '#allStocksList' },
        { textKey: 'stockTutorial6', highlight: '.stock-card:first-child' },
        { textKey: 'stockTutorial7', page: 'product' },
        { textKey: 'stockTutorial8', highlight: '#stockDetailQty', page: 'product' },
        { textKey: 'stockTutorial9', page: 'add_product' },
        { textKey: 'stockTutorial10', highlight: '#btnSaveStock', page: 'add_product' }
      ]
    },
    sales: {
      label: 'tutSales',
      page: 'sales',
      steps: [
        { textKey: 'salesTutorial1', highlight: null },
        { textKey: 'salesTutorial2', highlight: '#dailyStockExpenses' },
        { textKey: 'salesTutorial3', highlight: '#dailyEarnings' },
        { textKey: 'salesTutorial4', highlight: '#dailyResults' },
        { textKey: 'salesTutorial5', highlight: '#btnSaveDailySales' },
        { textKey: 'salesTutorial6', highlight: '#dailyAlreadyRecorded' },
        { textKey: 'salesTutorial7', highlight: 'a[href="new_sale.html"]' },
        { textKey: 'salesTutorial8', highlight: '#specificSalesList' },
        { textKey: 'salesTutorial9', page: 'new_sale' },
        { textKey: 'salesTutorial10', highlight: '#specificItemDesc', page: 'new_sale' }
      ]
    },
    debt: {
      label: 'tutDebt',
      page: 'debts',
      steps: [
        { textKey: 'debtTutorial1', highlight: null },
        { textKey: 'debtTutorial2', highlight: '.debt-summary-card' },
        { textKey: 'debtTutorial3', highlight: '#btnNewDebt' },
        { textKey: 'debtTutorial4', highlight: '#debtsList' },
        { textKey: 'debtTutorial5', highlight: null },
        { textKey: 'debtTutorial6', highlight: '#btnRecordPayment' },
        { textKey: 'debtTutorial7', highlight: '#newDebtCustomerName', page: 'new_debt' },
        { textKey: 'debtTutorial8', page: 'customer_debt' },
        { textKey: 'debtTutorial9', highlight: '#paymentAmount', page: 'payment' },
        { textKey: 'debtTutorial10', highlight: '#btnSavePayment', page: 'payment' }
      ]
    },
    help: {
      label: 'tutHelp',
      page: 'help',
      steps: [
        { textKey: 'helpTutorial1', highlight: null },
        { textKey: 'helpTutorial2', highlight: '#tutorialSelector' },
        { textKey: 'helpTutorial3', highlight: '#helpHowToUse' },
        { textKey: 'helpTutorial4', highlight: '#helpContact' },
        { textKey: 'helpTutorial5', highlight: '#helpAbout' },
        { textKey: 'helpTutorial6', highlight: '#headerTutorialBtn' }
      ]
    },
    eod: {
      label: 'tutEOD',
      page: 'endofday',
      steps: [
        { textKey: 'eodTutorial1', highlight: null },
        { textKey: 'eodTutorial2', highlight: '#eodSummarySection' },
        { textKey: 'eodTutorial3', highlight: '#eodUtangBreakdown' },
        { textKey: 'eodTutorial4', highlight: '#eodChecklist' },
        { textKey: 'eodTutorial5', highlight: null },
        { textKey: 'eodTutorial6', highlight: '#btnCompleteDay' }
      ]
    },
    report: {
      label: 'tutReport',
      page: 'home',
      steps: [
        { textKey: 'reportTutorial1', highlight: null },
        { textKey: 'reportTutorial2', highlight: '#periodToggles' },
        { textKey: 'reportTutorial3', highlight: '#reportSummary' },
        { textKey: 'reportTutorial4', highlight: '#reportTransactionsList' },
        { textKey: 'reportTutorial5', highlight: '#bestSellersList' },
        { textKey: 'reportTutorial6', highlight: '#lowStockList' }
      ]
    },
    settings: {
      label: 'tutSettings',
      page: 'setting',
      steps: [
        { textKey: 'settingsTutorial1', highlight: null },
        { textKey: 'settingsTutorial2', highlight: '#settingsLanguage' },
        { textKey: 'settingsTutorial3', highlight: null },
        { textKey: 'settingsTutorial4', highlight: '#settingsStoreName' },
        { textKey: 'settingsTutorial5', highlight: '#settingsLowStockThreshold' }
      ]
    },
    addproduct: {
      label: 'tutAddProduct',
      page: 'add_product',
      steps: [
        { textKey: 'addProductTutorial1', highlight: null },
        { textKey: 'addProductTutorial2', highlight: '#stockItemName' },
        { textKey: 'addProductTutorial3', highlight: '#stockCostPrice' },
        { textKey: 'addProductTutorial4', highlight: '#stockQty' },
        { textKey: 'addProductTutorial5', highlight: '#btnSaveStock' }
      ]
    },
    newsale: {
      label: 'tutNewSale',
      page: 'new_sale',
      steps: [
        { textKey: 'newSaleTutorial1', highlight: null },
        { textKey: 'newSaleTutorial2', highlight: '#specificItemDesc' },
        { textKey: 'newSaleTutorial3', highlight: '#specificAmountDisplay' },
        { textKey: 'newSaleTutorial4', highlight: '#specificCustomer' },
        { textKey: 'newSaleTutorial5', highlight: '#btnSaveSpecific' }
      ]
    },
    newdebt: {
      label: 'tutNewDebt',
      page: 'new_debt',
      steps: [
        { textKey: 'newDebtTutorial1', highlight: null },
        { textKey: 'newDebtTutorial2', highlight: '#newDebtCustomerName' },
        { textKey: 'newDebtTutorial3', highlight: '#newDebtAmount' },
        { textKey: 'newDebtTutorial4', highlight: '#btnSaveDebt' }
      ]
    }
  };

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

      var tutorialId = state._tutorialId || "main";
      var steps = (tutorials[tutorialId] && tutorials[tutorialId].steps) || [];
      var step = steps[state._tutorialStep];
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

  function startTutorial(tutorialId, isReplay) {
    if (!dom.tutorialOverlay) return;
    if (!tutorials[tutorialId]) return;
    state._tutorialActive = true;
    state._tutorialId = tutorialId;
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
    state._tutorialId = savedState.id || "main";
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
    var tutorialId = state._tutorialId || "main";
    var steps = (tutorials[tutorialId] && tutorials[tutorialId].steps) || [];
    var stepIndex = state._tutorialStep || 0;
    var step = steps[stepIndex];
    if (!step) { endTutorial(); return; }

    if (dom.tutorialText) dom.tutorialText.textContent = t(step.textKey);
    if (dom.tutorialCurrent) dom.tutorialCurrent.textContent = stepIndex + 1;
    if (dom.tutorialTotal) dom.tutorialTotal.textContent = steps.length;

    if (dom.tutorialHighlight) {
      if (step.highlight) {
        var target = document.querySelector(step.highlight);
        if (target) {
          var rect = target.getBoundingClientRect();
          dom.tutorialHighlight.style.position = 'fixed';
          dom.tutorialHighlight.style.zIndex = '151';
          dom.tutorialHighlight.style.display = 'block';
          dom.tutorialHighlight.style.left = (rect.left - 4) + 'px';
          dom.tutorialHighlight.style.top = (rect.top - 4) + 'px';
          dom.tutorialHighlight.style.width = (rect.width + 8) + 'px';
          dom.tutorialHighlight.style.height = (rect.height + 8) + 'px';
          // Start continuous tracking so highlight follows the target on any layout change
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

  function advanceTutorial() {
    if (!dom.tutorialOverlay) return;
    var tutorialId = state._tutorialId || "main";
    var steps = (tutorials[tutorialId] && tutorials[tutorialId].steps) || [];
    var nextStep = (state._tutorialStep || 0) + 1;
    if (nextStep >= steps.length) {
      endTutorial();
      return;
    }
    var nextStepData = steps[nextStep];
    var currentPage = pageName;

    if (nextStepData.page && nextStepData.page !== currentPage) {
      saveTutorialState(tutorialId, nextStep, state._tutorialReplay);
      window.location.href = nextStepData.page + '.html?tutorial=true';
    } else {
      state._tutorialStep = nextStep;
      renderTutorialStep();
    }
  }

  function endTutorial() {
    stopHighlightTracking();
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
      // Has saved state with tutorial ID (multi-tutorial format)
      if (saved && saved.id) {
        var tutorial = tutorials[saved.id];
        if (tutorial) {
          if (saved.id === 'main') {
            // Main tutorial - check if current step page matches
            var stepData = tutorial.steps[saved.step || 0];
            if (stepData && stepData.page && stepData.page !== pageName) {
              window.location.href = stepData.page + '.html?tutorial=true';
              return true;
            }
            return resumeTutorial(saved);
          } else {
            // Single-page tutorial - check if the current step's page matches first
            var stepData = tutorial.steps[saved.step || 0];
            if (stepData && stepData.page && stepData.page !== pageName) {
              window.location.href = stepData.page + '.html?tutorial=true';
              return true;
            }
            // Only fall back to tutorial-level page when the step has no page property
            // (step-level page is authoritative - don't redirect away from a subpage)
            if ((!stepData || !stepData.page) && tutorial.page && tutorial.page !== pageName) {
              window.location.href = tutorial.page + '.html?tutorial=true';
              return true;
            }
            return resumeTutorial(saved);
          }
        }
      } else if (saved && saved.step !== undefined) {
        // Legacy format (no tutorial ID) - redirect to start of main tutorial
        window.location.href = 'sales.html?tutorial=true';
        return true;
      }
      // No saved state - start main tutorial from sales page
      if (pageName === 'sales') {
        startTutorial('main', false);
      } else {
        window.location.href = 'sales.html?tutorial=true';
      }
      return true;
    }
    return false;
  }

  // ============================================
  // MAIN INIT
  // ============================================
  function init() {
    // Startup diagnostics
    try {
      console.log('[Sari-Sari Smart] Initializing... page=' + pageName + ' v=' + (state.settings ? 'ok' : 'no-state'));
      // Validate critical DOM references
      if (typeof cacheDom !== 'function') console.warn('[Sari-Sari Smart] cacheDom not available');
      if (typeof loadState !== 'function') console.warn('[Sari-Sari Smart] loadState not available');
    } catch(e) {
      console.error('[Sari-Sari Smart] Diagnostics error:', e);
    }
    try {
      cacheDom();
    } catch(e) {
      console.error('[Sari-Sari Smart] cacheDom failed:', e);
    }
    try {
      loadState();
    } catch(e) {
      console.error('[Sari-Sari Smart] loadState failed, using defaults:', e);
      // Provide fallback state
      if (typeof state === 'undefined' || !state) {
        window.state = { settings: { language: 'en', textSize: 'standard' }, products: [], specificSales: [], debts: [], customers: [], endOfDayData: {} };
      }
    }
    try {
      applyLanguage();
    } catch(e) {
      console.error('[Sari-Sari Smart] applyLanguage failed:', e);
    }
    try {
      applyTextSize();
    } catch(e) {
      console.error('[Sari-Sari Smart] applyTextSize failed:', e);
    }

    // Set active nav based on page mapping
    const pageToNav = {
      'home': 'home',
      'new_sale': 'sales',
      'eod': 'home',
    'endofday': 'home',
      'new_debt': 'debts',
      'customer_debt': 'debts',
      'payment': 'customer_debt',
      'add_product': 'inventory',
      'product': 'inventory'
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
        if (confirmCallback) {
          confirmCallback();
          closeConfirm();
        }
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
        if (dom.devPanel && dom.devPanel.classList.contains('open')) toggleDevPanel();
        else if (dom.confirmOverlay && dom.confirmOverlay.classList.contains('open')) closeConfirm();
        else if (dom.tutorialOverlay && dom.tutorialOverlay.classList.contains('active')) endTutorial();
      }
      // Shift+N: Developer Panel
      if (e.key === 'N' && e.shiftKey && !e.repeat) {
        e.preventDefault();
        toggleDevPanel();
      }
    });

    setPageTitle();
    // Run page-specific init
    try {
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
        case 'endofday':
        case 'eod': initEndOfDayPage(); break;
        case 'product': initProductPage(); break;
        case 'customer_debt': initCustomerDebtPage(); break;
        case 'payment': initPaymentPage(); break;
        default: initHomePage(); break;
      }
    } catch (e) {
      console.error('[Sari-Sari Smart] Page init error (' + pageName + '):', e);
      try { initHomePage(); } catch(e2) { console.error('[Sari-Sari Smart] Fallback init failed:', e2); }
    }

    refreshAll();
  }

  // Expose EOD functions to window for inline onclick handlers
  window.completeEodStep1 = function() {
    const input = document.getElementById('eodStep1Input');
    const rawValue = input ? input.value.trim() : '';
    if (rawValue === '') {
      showToast('Please enter the cash amount or type 0 before continuing.', 'error');
      return;
    }
    const cash = parseFloat(rawValue) || 0;
    const el = document.getElementById('eodStep1Done');
    if (el) {
      el.style.display = 'flex';
      el.querySelector('.eod-step-done-text').textContent = 'Cash: ' + formatCurrency(cash);
    }
    saveEodProgress();
  };
  window.completeEodStep2 = function() {
    const el = document.getElementById('eodStep2Done');
    if (el) {
      el.style.display = 'flex';
      const lowCount = getLowStockItems().length;
      el.querySelector('.eod-step-done-text').textContent = t('eodStep2Done').replace('{count}', lowCount);
    }
    saveEodProgress();
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
    saveEodProgress();
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

  // ============================================
  // DEVELOPER PANEL (Shift+N)
  // ============================================
  function buildDevPanel() {
    if (dom.devPanel) return;
    var el = document.createElement('div');
    el.id = 'sssDevPanel';
    el.className = 'dev-panel-overlay';
    el.innerHTML = [
      '<div class="dev-panel">',
        '<div class="dev-panel-header">',
          '<span class="dev-panel-title">\uD83D\uDD27 Developer Panel</span>',
          '<button class="dev-panel-close" id="devPanelClose">&times;</button>',
        '</div>',
        '<div class="dev-panel-body">',
          '<div class="dev-panel-section">',
            '<div class="dev-panel-section-title">Sales \u0026 Data</div>',
            '<button class="dev-panel-btn" data-action="reset-today-sales">Reset Today\u2019s Sales</button>',
            '<button class="dev-panel-btn" data-action="generate-test-sale">Generate Test Sale Entry</button>',
            '<button class="dev-panel-btn" data-action="generate-test-debts">Add Sample Debts</button>',
          '</div>',
          '<div class="dev-panel-section">',
            '<div class="dev-panel-section-title">Inventory</div>',
            '<button class="dev-panel-btn" data-action="clear-inventory">Clear All Inventory</button>',
            '<button class="dev-panel-btn" data-action="seed-sample-data">Seed Sample Products</button>',
            '<button class="dev-panel-btn" data-action="bulk-add-items">Bulk Add Items</button>',
          '</div>',
          '<div class="dev-panel-section">',
            '<div class="dev-panel-section-title">Advanced</div>',
            '<button class="dev-panel-btn" data-action="view-raw-state">View Raw State (JSON)</button>',
            '<button class="dev-panel-btn" data-action="export-data">Export All Data</button>',
            '<button class="dev-panel-btn" data-action="import-data">Import Data</button>',
            '<button class="dev-panel-btn dev-panel-btn--danger" data-action="reset-all">Reset All Application Data</button>',
          '</div>',
          '<div class="dev-panel-section">',
            '<div class="dev-panel-section-title">Clear Specific Data</div>',
            '<label class="dev-panel-checkbox"><input type="checkbox" data-clear="products" checked> Products</label>',
            '<label class="dev-panel-checkbox"><input type="checkbox" data-clear="dailyEntries" checked> Daily Entries</label>',
            '<label class="dev-panel-checkbox"><input type="checkbox" data-clear="specificSales" checked> Specific Sales</label>',
            '<label class="dev-panel-checkbox"><input type="checkbox" data-clear="debts" checked> Debts</label>',
            '<label class="dev-panel-checkbox"><input type="checkbox" data-clear="customers" checked> Customers</label>',
            '<label class="dev-panel-checkbox"><input type="checkbox" data-clear="endOfDayData" checked> End-of-Day Data</label>',
            '<label class="dev-panel-checkbox"><input type="checkbox" data-clear="settings"> Settings (reset to defaults)</label>',
            '<button class="dev-panel-btn dev-panel-btn--danger" data-action="clear-selected">Clear Selected Datasets</button>',
          '</div>',
        '</div>',
      '</div>'
    ].join('\n');
    document.body.appendChild(el);
    dom.devPanel = el;
    document.getElementById('devPanelClose').addEventListener('click', toggleDevPanel);
    dom.devPanel.addEventListener('click', function(e) { if (e.target === this) toggleDevPanel(); });
    dom.devPanel.querySelectorAll('[data-action]').forEach(function(btn) {
      btn.addEventListener('click', function() { handleDevAction(this.dataset.action); });
    });
  }

  function toggleDevPanel() {
    if (!dom.devPanel) buildDevPanel();
    dom.devPanel.classList.toggle('open');
  }

  function handleDevAction(action) {
    switch (action) {
      case 'reset-today-sales': resetTodaySales(); break;
      case 'generate-test-sale': generateTestSale(); break;
      case 'generate-test-debts': generateTestDebts(); break;
      case 'clear-inventory': clearAllInventory(); break;
      case 'seed-sample-data': seedSampleData(); break;
      case 'bulk-add-items': bulkAddItems(); break;
      case 'view-raw-state': viewRawState(); break;
      case 'export-data': exportAllData(); break;
      case 'import-data': showImportDialog(); break;
      case 'reset-all': resetAllData(); break;
      case 'clear-selected': clearSelectedData(); break;
    }
  }

  function resetTodaySales() {
    var today = todayStr();
    var idx = state.dailyEntries.findIndex(function(e) { return e.date === today; });
    if (idx !== -1) state.dailyEntries.splice(idx, 1);
    state.specificSales = state.specificSales.filter(function(s) { return !isSameDay(s.createdAt || s.date, today); });
    delete state.endOfDayData[today];
    saveState();
    showToast('Today\u2019s sales data has been reset.', 'info');
    refreshAll(); toggleDevPanel();
  }

  function generateTestSale() {
    var today = todayStr();
    if (state.dailyEntries.find(function(e) { return e.date === today; })) {
      showToast('Today already has a recorded sale. Reset it first.', 'error'); return;
    }
    var expenses = Math.floor(Math.random() * 500) + 100;
    var earnings = expenses + Math.floor(Math.random() * 800) + 50;
    var gross = earnings - expenses;
    var mp = state.settings.defaultMarkup || 10;
    state.dailyEntries.push({
      date: today, stockExpenses: expenses, earnings: earnings,
      grossProfit: Math.max(0, gross), netProfit: Math.max(0, gross * (1 - mp / 100)),
      revolvingFund: Math.max(0, earnings - (earnings * (mp / 100))),
      markupPercentage: mp, createdAt: new Date().toISOString()
    });
    saveState();
    showToast('Test sale entry created: ' + formatCurrency(earnings) + ' earnings.', 'success');
    refreshAll(); toggleDevPanel();
  }

  function generateTestDebts() {
    var names = ['Ana', 'Pedro', 'Liza', 'Ramon', 'Nena', 'Mario', 'Linda'];
    var count = 0;
    names.forEach(function(name) {
      if (state.debts.find(function(d) { return d.customerName === name && d.remainingBalance > 0; })) return;
      var customer = state.customers.find(function(c) { return c.name === name; });
      if (!customer) { customer = { id: generateId(), name: name }; state.customers.push(customer); }
      if (state.usedCustomerNames.indexOf(name) === -1) state.usedCustomerNames.push(name);
      state.debts.push({
        id: generateId(), customerId: customer.id, customerName: name,
        amount: (Math.floor(Math.random() * 15) + 3) * 10,
        remainingBalance: (Math.floor(Math.random() * 15) + 3) * 10,
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), payments: []
      });
      count++;
    });
    saveState();
    showToast('Added ' + count + ' sample debt entries.', 'success');
    refreshAll(); toggleDevPanel();
  }

  function clearAllInventory() {
    state.products = []; state.stockStatuses = {}; saveState();
    showToast('Inventory cleared.', 'info'); refreshAll(); toggleDevPanel();
  }

  function seedSampleData() {
    showConfirm('Seed Sample Data?', 'This will replace your inventory with sample products.', function() {
      state.products = getSampleProducts(); state.stockStatuses = {}; saveState();
      showToast('Sample products loaded (' + state.products.length + ' items).', 'success');
      refreshAll(); toggleDevPanel();
    }, 'warning');
  }

  function bulkAddItems() {
    var count = parseInt(prompt('How many sample items to add?', '5')) || 0;
    if (count <= 0 || count > 50) { showToast('Enter a number between 1 and 50.', 'error'); return; }
    var names = ['Sardines', 'Coffee', 'Milk', 'Soap', 'Shampoo', 'Candy', 'Biscuit', 'Juice', 'Ice Cream', 'Chips'];
    for (var i = 0; i < count; i++) {
      var baseName = names[i % names.length];
      var suffix = i >= names.length ? ' ' + (Math.floor(i / names.length) + 1) : '';
      state.products.push({
        id: generateId(), name: baseName + suffix,
        costPrice: Math.floor(Math.random() * 30) + 5,
        sellingPrice: Math.floor(Math.random() * 45) + 10,
        quantity: Math.floor(Math.random() * 30) + 1, unit: 'piece', lowStockThreshold: 5
      });
    }
    saveState();
    showToast('Added ' + count + ' items to inventory.', 'success');
    refreshAll(); toggleDevPanel();
  }

  function viewRawState() {
    var data = {
      settings: state.settings, products: state.products.length,
      dailyEntries: state.dailyEntries.length, specificSales: state.specificSales.length,
      debts: state.debts.length, customers: state.customers.length,
      eodDays: Object.keys(state.endOfDayData).length
    };
    alert('RAW STATE\n' + JSON.stringify(data, null, 2));
    toggleDevPanel();
  }

  function exportAllData() {
    var data = {
      exportedAt: new Date().toISOString(), app: 'Sari-Sari Smart', version: '2.7',
      settings: state.settings, products: state.products,
      dailyEntries: state.dailyEntries, specificSales: state.specificSales,
      debts: state.debts, customers: state.customers, endOfDayData: state.endOfDayData
    };
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = 'sari-sari-smart-backup-' + todayStr() + '.json';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Data exported!', 'success');
    toggleDevPanel();
  }

  function showImportDialog() {
    var input = document.createElement('input');
    input.type = 'file'; input.accept = '.json';
    input.addEventListener('change', function(e) {
      var file = e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function(ev) {
        try { importData(JSON.parse(ev.target.result)); }
        catch(err) { showToast('Invalid JSON file.', 'error'); }
      };
      reader.readAsText(file);
    });
    input.click();
  }

  function importData(data) {
    if (!data || !data.settings) { showToast('Invalid backup file format.', 'error'); return; }
    showConfirm('Import Data?', 'This will replace all current data.', function() {
      if (data.settings) state.settings = data.settings;
      if (data.products) state.products = data.products;
      if (data.dailyEntries) state.dailyEntries = data.dailyEntries;
      if (data.specificSales) state.specificSales = data.specificSales;
      if (data.debts) state.debts = data.debts;
      if (data.customers) state.customers = data.customers;
      if (data.endOfDayData) state.endOfDayData = data.endOfDayData;
      saveState(); applyLanguage(); applyTextSize();
      showToast('Data imported!', 'success');
      refreshAll(); toggleDevPanel();
    }, 'warning');
  }

  function resetAllData() {
    showConfirm('Reset All Data?', 'This will permanently delete all data and reload with sample data.', function() {
      try {
        localStorage.removeItem('sss_settings'); localStorage.removeItem('sss_products');
        localStorage.removeItem('sss_sales'); localStorage.removeItem('sss_customers');
        localStorage.removeItem('sss_debts'); localStorage.removeItem('sss_usedNames');
        localStorage.removeItem('sss_stockStatuses'); localStorage.removeItem('sss_dailyEntries');
        localStorage.removeItem('sss_specificSales'); localStorage.removeItem('sss_eodData');
      } catch(e) {}
      window.location.href = 'index.html';
    }, 'warning');
  }

  function clearSelectedData() {
    if (!dom.devPanel) return;
    var checkboxes = dom.devPanel.querySelectorAll('[data-clear]:checked');
    if (checkboxes.length === 0) { showToast('Select at least one dataset.', 'error'); return; }
    var labels = [];
    checkboxes.forEach(function(cb) { labels.push(cb.parentNode.textContent.trim()); });
    showConfirm('Clear Selected Data?', 'This will clear: ' + labels.join(', '), function() {
      checkboxes.forEach(function(cb) {
        switch (cb.dataset.clear) {
          case 'products': state.products = []; state.stockStatuses = {}; break;
          case 'dailyEntries': state.dailyEntries = []; break;
          case 'specificSales': state.specificSales = []; break;
          case 'debts': state.debts = []; break;
          case 'customers': state.customers = []; state.usedCustomerNames = []; break;
          case 'endOfDayData': state.endOfDayData = {}; break;
          case 'settings': state.settings = { language: 'en', textSize: 'standard', storeName: 'My Store', ownerName: 'Owner', hasCompletedTutorial: false, defaultMarkup: 20 }; break;
        }
      });
      saveState(); showToast('Selected data cleared.', 'info');
      refreshAll(); applyLanguage(); applyTextSize(); toggleDevPanel();
    }, 'warning');
  }

  // Start with error isolation
  function safeInit() {
    try {
      init();
    } catch(e) {
      console.error('[Sari-Sari Smart] Fatal init error:', e);
      // Attempt minimal recovery - show basic UI
      try {
        if (typeof cacheDom === 'function') cacheDom();
        if (typeof applyLanguage === 'function') applyLanguage();
        if (typeof initHomePage === 'function') initHomePage();
      } catch(e2) {
        console.error('[Sari-Sari Smart] Recovery failed:', e2);
        document.body.innerHTML = '<div style="padding:20px;text-align:center;font-family:sans-serif;">' +
          '<h2>Something went wrong</h2>' +
          '<p style="color:#666;">Please try refreshing the page.</p>' +
          '<p style="font-size:12px;color:#999;">Error: ' + (e.message || 'Unknown') + '</p>' +
          '</div>';
      }
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', safeInit);
  } else {
    safeInit();
  }


  function initProductPage() {
    checkTutorialResume();
    if (pageName !== 'product') return;
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (!productId) return;

    const product = state.products.find(p => p.id === productId);
    if (!product) {
      document.getElementById('appContent').innerHTML = '<div class="empty-state">Product not found.</div>';
      return;
    }

    // Set product ID in hidden input
    const holder = document.getElementById('productIdHolder');
    if (holder) holder.value = productId;

    // Update header title
    const headerTitle = document.getElementById('headerTitle');
    if (headerTitle) headerTitle.textContent = product.name;

    // Update detail fields
    const qtyEl = document.getElementById('stockDetailQty');
    const costEl = document.getElementById('stockDetailCost');
    const priceEl = document.getElementById('stockDetailPrice');
    const marginEl = document.getElementById('stockDetailMargin');
    const deductQtyEl = document.getElementById('stockDeductQty');

    if (qtyEl) qtyEl.textContent = product.quantity + ' ' + (product.unit || 'pcs');
    if (costEl) costEl.textContent = formatCurrency(product.costPrice || 0);
    if (priceEl) priceEl.textContent = formatCurrency(product.sellingPrice || 0);
    if (marginEl) {
      var margin = getProfitMargin(product.costPrice, product.sellingPrice);
      marginEl.textContent = margin !== null ? formatPercent(margin) : '--';
    }
    if (deductQtyEl) deductQtyEl.value = 1;

    // Update edit/restock links
    const editLink = document.getElementById('stockDetailEditLink');
    const restockLink = document.getElementById('stockDetailRestockLink');
    if (editLink) editLink.href = 'add_product.html?edit=' + productId;
    if (restockLink) restockLink.href = 'add_product.html?restock=' + productId;

    // Highlight current status chip
    const currentStatus = getStockStatus(product);
    const statusChips = document.querySelectorAll('.status-chip');
    statusChips.forEach(function(chip) {
      chip.classList.toggle('active', chip.dataset.status === currentStatus);
    });

    // Wire up status chips (only once to avoid duplicate listeners)
    if (!window._productStatusListenersAttached) {
      window._productStatusListenersAttached = true;
      statusChips.forEach(function(chip) {
        chip.addEventListener('click', function() {
          const status = this.dataset.status;
          const p = state.products.find(pp => pp.id === productId);
          if (!p) return;
          // Set quantity to simulate status
          if (status === 'plenty') {
            p.quantity = Math.max(p.quantity, 10);
          } else if (status === 'low') {
            p.quantity = Math.min(p.quantity, 5);
            if (p.quantity <= 0) p.quantity = 1;
          } else if (status === 'out') {
            p.quantity = 0;
          }
          saveState();
          initProductPage();
          showToast(t('stockDeducted'));
        });
      });
    }

    // Show out of stock banner if needed
    const banner = document.getElementById('productOutOfStockBanner');
    if (banner) {
      banner.style.display = getStockStatus(product) === 'out' ? 'block' : 'none';
    }
  }

})();
