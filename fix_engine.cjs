const fs = require('fs');
let code = fs.readFileSync('src/engine.ts', 'utf8');

// Insert event listeners
code = code.replace(/    window\.addEventListener\('keydown', this\.handleKeyDown\);/, "    window.addEventListener('keydown', this.handleKeyDown);\n    this.canvas.addEventListener('pointerdown', this.handlePointerDown);");
code = code.replace(/    window\.removeEventListener\('keydown', this\.handleKeyDown\);/, "    window.removeEventListener('keydown', this.handleKeyDown);\n    this.canvas.removeEventListener('pointerdown', this.handlePointerDown);");

// Insert handlePointerDown function
const pointerDownLogic = `
  handlePointerDown = (e: PointerEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const vw = this.canvas.width;
    const vh = this.canvas.height;
    
    const scaleX = vw / MAP_WIDTH;
    const scaleY = vh / MAP_HEIGHT;
    const scale = Math.max(scaleX, scaleY);
    const scaledVw = vw / scale;
    const scaledVh = vh / scale;
    
    let cx = this.player.x - scaledVw / 2;
    let cy = this.player.y - scaledVh / 2;
    
    if (MAP_WIDTH <= scaledVw) {
      cx = (MAP_WIDTH - scaledVw) / 2;
    } else {
      cx = Math.max(0, Math.min(MAP_WIDTH - scaledVw, cx));
    }
    
    if (MAP_HEIGHT <= scaledVh) {
      cy = (MAP_HEIGHT - scaledVh) / 2;
    } else {
      cy = Math.max(0, Math.min(MAP_HEIGHT - scaledVh, cy));
    }
    
    const worldX = (clickX / scale) + cx;
    const worldY = (clickY / scale) + cy;
    
    const dist = Math.hypot(worldX - 1320, worldY - 647);
    if (dist <= 60) {
      if (this.onOpenBookList) this.onOpenBookList();
    }
  };

  handleKeyDown = (e: KeyboardEvent) => {`;

code = code.replace(/  handleKeyDown = \(e: KeyboardEvent\) => \{/, pointerDownLogic);

fs.writeFileSync('src/engine.ts', code);
