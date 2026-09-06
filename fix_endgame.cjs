const fs = require('fs');

// 1. App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(/      \{\/\* Game Over \/ Victory \/ To Be Continued Overlays \*\/\}[\s\S]*?      \)\}\n/, "");
fs.writeFileSync('src/App.tsx', appCode);

// 2. i18n.ts
let i18nCode = fs.readFileSync('src/i18n.ts', 'utf8');
i18nCode = i18nCode.replace(/  endGame: \{[\s\S]*?  \};\n/, "");
i18nCode = i18nCode.replace(/    endGame: \{[\s\S]*?    \},\n/g, "");
fs.writeFileSync('src/i18n.ts', i18nCode);

// 3. types.ts
let typesCode = fs.readFileSync('src/types.ts', 'utf8');
typesCode = typesCode.replace(/export type Phase = 'explore' \| 'dialogue' \| 'combat' \| 'gameover' \| 'victory' \| 'tobecontinued';/, "export type Phase = 'explore' | 'dialogue';");
fs.writeFileSync('src/types.ts', typesCode);

// 4. engine.ts
let engineCode = fs.readFileSync('src/engine.ts', 'utf8');
engineCode = engineCode.replace(/  onEndGame: \(type: 'victory' \| 'defeat' \| 'tobecontinued'\) => void;\n/, "");
engineCode = engineCode.replace(/    onEndGame: \(type: 'victory' \| 'defeat' \| 'tobecontinued'\) => void,\n/, "");
engineCode = engineCode.replace(/    this\.onEndGame = onEndGame;\n/, "");
engineCode = engineCode.replace(/if \(this\.phase === 'gameover' \|\| this\.phase === 'victory' \|\| this\.phase === 'tobecontinued'\) return;\n/, "");
fs.writeFileSync('src/engine.ts', engineCode);

