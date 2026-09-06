const fs = require('fs');
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(/        handleTriggerDialogue,\n        \(type\) => setUiState\(prev => \(\{ \.\.\.prev, phase: type \}\)\),\n        language,/, "        handleTriggerDialogue,\n        language,");
fs.writeFileSync('src/App.tsx', appCode);
