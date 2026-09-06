const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldNext = `  const nextDialogue = () => {
    if (!activeDialogue || !engineRef.current) return;

    if (dialogueIdx + 1 < activeDialogue.length) {
      setDialogueIdx(dialogueIdx + 1);
    } else {
      // Close Dialogue
      setActiveDialogue(null);
      setCurrentEventId(null);
      setDialogueIdx(0);
      
      if (engineRef.current.phase === 'dialogue') {
        engineRef.current.isPaused = false;
        engineRef.current.phase = 'explore';
      }
    }
  };`;

const newNext = `  const nextDialogue = () => {
    setActiveDialogue(prevDialogue => {
      if (!prevDialogue || !engineRef.current) return prevDialogue;
      
      setDialogueIdx(prevIdx => {
        if (prevIdx + 1 < prevDialogue.length) {
          return prevIdx + 1;
        } else {
          // Close Dialogue
          setTimeout(() => {
            setActiveDialogue(null);
            setCurrentEventId(null);
            setDialogueIdx(0);
            if (engineRef.current && engineRef.current.phase === 'dialogue') {
              engineRef.current.isPaused = false;
              engineRef.current.phase = 'explore';
            }
          }, 0);
          return prevIdx;
        }
      });
      return prevDialogue;
    });
  };`;

code = code.replace(oldNext, newNext);
fs.writeFileSync('src/App.tsx', code);
