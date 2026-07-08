import sys
with open('app.js', 'rb') as f:
    content = f.read()

# Step 1: Add launchCount to state.settings
old1 = b'hasCompletedTutorial: false,\r\n      lowStockThreshold: 5'
new1 = b'hasCompletedTutorial: false,\r\n      launchCount: 0,\r\n      lowStockThreshold: 5'
if old1 in content:
    content = content.replace(old1, new1)
    sys.stdout.write('Step1 OK\n')
else:
    sys.stdout.write('Step1 FAIL\n')

# Step 2: Update init morning page
idx = content.find(b"hasCompletedTutorial && dom.tutorialOverlay")
if idx >= 0:
    start = content.rfind(b'\n', 0, idx) + 1
    end = content.find(b'}', idx)
    end = content.find(b'\n', end) + 1
    new2 = b'      state.settings.launchCount = (state.settings.launchCount || 0) + 1;\r\n      saveState();\r\n      if (dom.tutorialOverlay) {\r\n        var isFirstLaunch = state.settings.launchCount === 1;\r\n        setTimeout(function() {\r\n          startTutorial(\x27main\x27, !isFirstLaunch);\r\n        }, 500);\r\n      }\r\n'
    content = content[:start] + new2 + content[end:]
    sys.stdout.write('Step2 OK\n')
else:
    sys.stdout.write('Step2 FAIL\n')

# Step 3: Update endTutorial()
idx = content.find(b'hasCompletedTutorial = true')
if idx >= 0:
    start = content.rfind(b'\n', 0, idx) + 1
    end = content.find(b'}', idx)
    end = content.find(b'\n', end) + 1
    new3 = b'    // Tutorial auto-starts on every launch (see init morning handler)\r\n'
    content = content[:start] + new3 + content[end:]
    sys.stdout.write('Step3 OK\n')
else:
    sys.stdout.write('Step3 FAIL\n')

# Step 4: Update resetData()
old4 = b'state.todayEarnings = 0;\r\n    saveState();\r\n    renderMorningCheck();\r\n    renderManageInventory();\r\n    renderManageDebts();\r\n    showToast(t(\x27dataReset\x27));'
new4 = b'state.todayEarnings = 0;\r\n    state.settings.launchCount = 0;\r\n    saveState();\r\n    renderMorningCheck();\r\n    renderManageInventory();\r\n    renderManageDebts();\r\n    showToast(t(\x27dataReset\x27));'
if old4 in content:
    content = content.replace(old4, new4)
    sys.stdout.write('Step4 OK\n')
else:
    sys.stdout.write('Step4 FAIL\n')

# Step 5: Update dev panel resetAll
old5 = b'state.settings.hasCompletedSetup = false;\r\n        saveState();'
new5 = b'state.settings.hasCompletedSetup = false;\r\n        state.settings.launchCount = 0;\r\n        saveState();'
if old5 in content:
    content = content.replace(old5, new5)
    sys.stdout.write('Step5 OK\n')
else:
    sys.stdout.write('Step5 FAIL\n')

with open('app.js', 'wb') as f:
    f.write(content)
sys.stdout.write('DONE\n')
