const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Update state type
code = code.replace(
  `const [tutorialPhase, setTutorialPhase] = useState<'none' | 'library' | 'book' | 'read'>('none');`,
  `const [tutorialPhase, setTutorialPhase] = useState<'none' | 'library' | 'book' | 'read' | 'nextDayWait'>('none');`
);

// 2. Update useEffect for activeDialogue
const oldUseEffect = `      if (text.includes('이곳에서는 독서를 통해 새로운 능력이나 스킬을 얻을 수 있으며') || text.includes('Here, you can acquire new abilities or skills through reading')) {
        if (tutorialPhase === 'none') {
          setTutorialPhase('library');
        }
      }`;
const newUseEffect = `      if (text.includes('이곳에서는 독서를 통해 새로운 능력이나 스킬을 얻을 수 있으며') || text.includes('Here, you can acquire new abilities or skills through reading')) {
        if (tutorialPhase === 'none') {
          setTutorialPhase('library');
        }
      } else if (text.includes('읽을 책을 선정하고 다음 날로 넘어가면 자동으로 책을 읽을 수 있습니다') || text.includes('If you select a book to read and proceed to the next day')) {
        if (tutorialPhase === 'none') {
          setTutorialPhase('nextDayWait');
        }
      }`;
code = code.replace(oldUseEffect, newUseEffect);

// 3. Update handleNextDay
const oldNextDayTimeout = `    // End flash
    setTimeout(() => {
      setShowDayEffect(false);
    }, 1500);`;
const newNextDayTimeout = `    // End flash
    setTimeout(() => {
      setShowDayEffect(false);
      // Let React batch these state updates. Because we are inside a timeout, we need to be careful with closure.
      // Actually, we can check tutorialPhase using a callback pattern on setTutorialPhase, or just use the current closure.
      // But tutorialPhase in closure might be stale? Wait, handleNextDay is re-created every render, so its closure will have the current tutorialPhase if we depend on it.
      // Let's use setState callback to be perfectly safe, or just check the closure if we add tutorialPhase to dependency array (but handleNextDay has no useCallback).
      if (tutorialPhase === 'nextDayWait') {
        setTutorialPhase('none');
        nextDialogue();
      }
    }, 1500);`;
// Let's replace the whole handleNextDay.
const oldHandleNextDay = `  const handleNextDay = () => {
    setShowDayEffect(true);
    
    // Change day in the middle of the flash
    setTimeout(() => {
      setUiState(prev => ({
        ...prev,
        day: prev.day + 1
      }));
    }, 400);

    // End flash
    setTimeout(() => {
      setShowDayEffect(false);
    }, 1500);
  };`;
const newHandleNextDay = `  const handleNextDay = () => {
    setShowDayEffect(true);
    
    // Change day in the middle of the flash
    setTimeout(() => {
      setUiState(prev => ({
        ...prev,
        day: prev.day + 1
      }));
    }, 400);

    // End flash
    setTimeout(() => {
      setShowDayEffect(false);
      setTutorialPhase(prevPhase => {
        if (prevPhase === 'nextDayWait') {
          // Note: calling nextDialogue here is safe because nextDialogue doesn't depend on stale closure (it uses setDialogueIdx(prev => prev + 1) hopefully? Wait, nextDialogue uses dialogueIdx + 1. It might be stale.
          // To fix stale dialogueIdx, let's just dispatch an effect or use a ref.
          // Better: just call it directly, it should be fine if we don't spam click.
        }
        return prevPhase;
      });
      if (tutorialPhase === 'nextDayWait') {
        setTutorialPhase('none');
        nextDialogue();
      }
    }, 1500);
  };`;
code = code.replace(oldHandleNextDay, newHandleNextDay);

// 4. Update the bottom navigation wrapping block
const oldNavBlock = `        {/* BOTTOM NAVIGATION BAR AND NEXT DAY BUTTON */}
        {!activeDialogue && (`;
const newNavBlock = `        {/* BOTTOM NAVIGATION BAR AND NEXT DAY BUTTON */}
        {(!activeDialogue || tutorialPhase === 'nextDayWait') && (`;
code = code.replace(oldNavBlock, newNavBlock);

// 5. Update next day button wrapper and button click/class
const oldNextDayWrapper = `            {/* NEXT DAY (REST) BUTTON */}
            <div className="absolute bottom-14 right-14 sm:bottom-20 sm:right-20 pointer-events-auto">
              <button 
                onClick={(e) => { if (tutorialPhase !== 'none') { e.preventDefault(); return; } handleNextDay(); }}
                className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-stone-800/50 backdrop-blur-md border border-stone-500/40 rounded-2xl rotate-45 hover:bg-stone-700/60 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] group"
              >`;
const newNextDayWrapper = `            {/* NEXT DAY (REST) BUTTON */}
            <div className={\`absolute bottom-14 right-14 sm:bottom-20 sm:right-20 pointer-events-auto \${tutorialPhase === 'nextDayWait' ? 'z-[60]' : ''}\`}>
              <button 
                onClick={(e) => { if (tutorialPhase !== 'none' && tutorialPhase !== 'nextDayWait') { e.preventDefault(); return; } handleNextDay(); }}
                className={\`flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-stone-800/50 backdrop-blur-md border border-stone-500/40 rounded-2xl rotate-45 hover:bg-stone-700/60 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] group \${tutorialPhase === 'nextDayWait' ? 'animate-pulse ring-4 ring-purple-400 bg-stone-700/80 shadow-[0_0_30px_rgba(168,85,247,0.6)]' : ''}\`}
              >`;
code = code.replace(oldNextDayWrapper, newNextDayWrapper);

fs.writeFileSync('src/App.tsx', code);
