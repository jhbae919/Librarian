const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Ensure other tabs are disabled during 'book' phase
const tabsTarget = `onClick={() => setBookListTab('`;
const tabsReplacement = `onClick={() => { if (tutorialPhase === 'book') return; setBookListTab('`;
code = code.replace(new RegExp(tabsTarget, 'g'), tabsReplacement);

// 2. Ensure only the first book can be clicked during 'book' phase
const bookMapTarget = `onClick={() => { setSelectedBook(book); if (tutorialPhase === 'book' && idx === 0) setTutorialPhase('read'); }}`;
const bookMapReplacement = `onClick={() => { 
                    if (tutorialPhase === 'book' && idx !== 0) return;
                    setSelectedBook(book); 
                    if (tutorialPhase === 'book' && idx === 0) setTutorialPhase('read'); 
                  }}`;
code = code.replace(bookMapTarget, bookMapReplacement);

// 3. Ensure 'Close' button is disabled during 'book' phase
const closeBookListTarget = `onClick={() => setIsBookListOpen(false)}`;
const closeBookListReplacement = `onClick={() => { if (tutorialPhase === 'book') return; setIsBookListOpen(false); }}`;
code = code.replace(closeBookListTarget, closeBookListReplacement);

// 4. Ensure 'Close' button is disabled during 'read' phase (book info modal)
const closeBookInfoTarget = `onClick={() => { setSelectedBook(null); if (tutorialPhase === 'read') setTutorialPhase('book'); }}`;
const closeBookInfoReplacement = `onClick={() => { if (tutorialPhase === 'read') return; setSelectedBook(null); }}`;
code = code.replace(closeBookInfoTarget, closeBookInfoReplacement);

// 5. Ensure 'No' button is disabled during 'read' phase (start reading modal)
const noButtonTarget = `onClick={() => { setBookToStart(null); /* stay in read phase, they just went back one step */ }}`;
const noButtonReplacement = `onClick={() => { if (tutorialPhase === 'read') return; setBookToStart(null); }}`;
code = code.replace(noButtonTarget, noButtonReplacement);

// 6. Ensure 'Stats' and 'Inventory' and 'Next Day' buttons are disabled during ANY tutorial phase
const statsButtonTarget = `onClick={() => setIsStatusOpen(true)}`;
const statsButtonReplacement = `onClick={() => { if (tutorialPhase !== 'none') return; setIsStatusOpen(true); }}`;
code = code.replace(statsButtonTarget, statsButtonReplacement);

const nextDayButtonTarget = `onClick={handleNextDay}`;
const nextDayButtonReplacement = `onClick={(e) => { if (tutorialPhase !== 'none') { e.preventDefault(); return; } handleNextDay(); }}`;
code = code.replace(nextDayButtonTarget, nextDayButtonReplacement);


fs.writeFileSync('src/App.tsx', code);
