import { Phase, UIState, Language } from './types';
import { MAP_WIDTH, MAP_HEIGHT, TILE_SIZE } from './data';

export class GameEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  onSyncUI: (state: UIState) => void;
  onTriggerDialogue: (id: string) => void;

  phase: Phase = 'explore';
  day: number = 1;
  language: Language = 'ko';

  player = {
    x: 30 * TILE_SIZE, // Starts in the open grand rotunda aisle
    y: 25.5 * TILE_SIZE,
    radius: 10,
    facing: 'down',
    color: '#3b82f6',
    cooldown: 0,
    skills: [] as string[],
    stats: {
      hp: 100,
      maxHp: 100,
      str: 10,
      mag: 10,
      agi: 160
    }
  };

  particles: any[] = [];
  ambientDust: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];

  lastTime: number = 0;
  isPaused: boolean = false;
  currentZoneId: string = 'rotunda';
  zoneBannerTimer: number = 3.0; // Show zone banner on spawn


  resizeObserver: ResizeObserver | null = null;
  bgImage: HTMLImageElement | null = null;
  bgLoaded: boolean = false;

  public onOpenBookList?: () => void;
  public highlightBookButton: boolean = false;

  constructor(
    canvas: HTMLCanvasElement,
    onSyncUI: (state: UIState) => void,
    onTriggerDialogue: (id: string) => void,
    language: Language = 'ko',
    onOpenBookList?: () => void
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.onSyncUI = onSyncUI;
    this.onTriggerDialogue = onTriggerDialogue;
    this.language = language;
    this.onOpenBookList = onOpenBookList;

    this.bgImage = new Image();
    this.bgImage.src = '/도서관배경.png';
    this.bgImage.onload = () => {
      this.bgLoaded = true;
    };

    // Seed Ambient Floating Golden Dust Motes
    for (let i = 0; i < 80; i++) {
      this.ambientDust.push({
        x: Math.random() * MAP_WIDTH,
        y: Math.random() * MAP_HEIGHT,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 6 - 4,
        size: 1.5 + Math.random() * 2.5,
        alpha: 0.2 + Math.random() * 0.6
      });
    }

    this.init();
  }

  init = () => {
    this.handleResize();
    this.bindEvents();
    this.syncUI();
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop);
  };

  handleResize = () => {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const width = Math.max(320, Math.floor(rect.width || window.innerWidth));
    const height = Math.max(240, Math.floor(rect.height || window.innerHeight));

    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
  };

  bindEvents = () => {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('keydown', this.handleKeyDown);
    this.canvas.addEventListener('pointerdown', this.handlePointerDown);
    window.addEventListener('keyup', this.handleKeyUp);

    if (this.canvas && typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.handleResize();
      });
      this.resizeObserver.observe(this.canvas);
    }

  };

  destroy = () => {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('keydown', this.handleKeyDown);
    this.canvas.removeEventListener('pointerdown', this.handlePointerDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  };


  keys = { up: false, down: false, left: false, right: false };


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

  handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') this.keys.up = true;
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') this.keys.down = true;
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.keys.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = true;

    if (e.key === ' ' || e.key === 'z' || e.key === 'Z') {
      // interact logic (removed previous object iteration, so we can just open book list maybe?)
      const targetX = this.player.x + (this.player.facing === 'left' ? -30 : this.player.facing === 'right' ? 30 : 0);
      const targetY = this.player.y + (this.player.facing === 'up' ? -30 : this.player.facing === 'down' ? 30 : 0);
      
      if (targetX >= 1266 && targetX <= 1366 && targetY >= 601 && targetY <= 691) {
        if (this.onOpenBookList) this.onOpenBookList();
      }
    }
  };

  handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') this.keys.up = false;
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') this.keys.down = false;
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.keys.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = false;
  };

  spawnParticles = (x: number, y: number, color: string) => {
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 120,
        vy: (Math.random() - 0.5) * 120 - 20,
        life: 1.0,
        maxLife: 1.0,
        color
      });
    }
  };

  setLanguage = (lang: Language) => {
    this.language = lang;
  };

  syncUI = () => {
    this.onSyncUI({
      phase: this.phase,
      stats: { ...this.player.stats },
      day: this.day,
    });
  };

  checkCollision = (x: number, y: number, r: number) => {
    if (x - r < 32 || x + r > MAP_WIDTH - 32 || y - r < 48 || y + r > MAP_HEIGHT - 32) return true;
    return false;
  };

  // --- GAME LOOP ---
  loop = (timestamp: number) => {
    const dt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    if (!this.isPaused) {
      this.update(Math.min(dt, 0.1));
    }
    this.draw();

    requestAnimationFrame(this.loop);
  };

  update = (dt: number) => {
    

    // Player Movement
    let dx = 0;
    let dy = 0;
    if (this.keys.up) dy = -1;
    if (this.keys.down) dy = 1;
    if (this.keys.left) dx = -1;
    if (this.keys.right) dx = 1;

    if (dx !== 0 || dy !== 0) {
      if (Math.abs(dx) > Math.abs(dy)) {
        this.player.facing = dx > 0 ? 'right' : 'left';
      } else {
        this.player.facing = dy > 0 ? 'down' : 'up';
      }
      
      // Normalize
      const dist = Math.sqrt(dx * dx + dy * dy);
      dx /= dist;
      dy /= dist;

      const speed = Math.max(160, this.player.stats.agi);
      const nx = this.player.x + dx * speed * dt;
      const ny = this.player.y + dy * speed * dt;

      if (!this.checkCollision(nx, this.player.y, this.player.radius)) {
        this.player.x = nx;
      }
      if (!this.checkCollision(this.player.x, ny, this.player.radius)) {
        this.player.y = ny;
      }
    } else {
    }


    // Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.life -= dt;
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      if (pt.life <= 0) this.particles.splice(i, 1);
    }

    // Ambient Dust Drift
    for (const dust of this.ambientDust) {
      dust.x += dust.vx * dt;
      dust.y += dust.vy * dt;
      if (dust.x < 0) dust.x = MAP_WIDTH;
      if (dust.x > MAP_WIDTH) dust.x = 0;
      if (dust.y < 0) dust.y = MAP_HEIGHT;
      if (dust.y > MAP_HEIGHT) dust.y = 0;
    }
  };

  // --- RENDERING PIPELINE ---
  draw = () => {
    const ctx = this.ctx;
    const canvas = this.canvas;
    const time = performance.now() / 1000;

    // Ensure correct resolution matching client display
    if (canvas.clientWidth > 0 && canvas.clientHeight > 0) {
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }
    }

    const vw = canvas.width;
    const vh = canvas.height;

    // Calculate scale to fit the entire map into the viewport
    const scale = Math.min(vw / MAP_WIDTH, vh / MAP_HEIGHT);
    const scaledVw = vw / scale;
    const scaledVh = vh / scale;

    ctx.fillStyle = '#060a12';
    ctx.fillRect(0, 0, vw, vh);

    // Camera Centering on Player with smooth bounded viewport
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

    ctx.save();
    
    // Apply zoom scale so it fits exactly
    ctx.scale(scale, scale);
    ctx.translate(-cx, -cy);

    // ==========================================
    // 1. FLOOR & ARCHITECTURAL TILES RENDERING
    // ==========================================
    if (this.bgLoaded && this.bgImage) {
      ctx.drawImage(this.bgImage, 0, 0, MAP_WIDTH, MAP_HEIGHT);
    }

    // ==========================================
    // 3. PARTICLES & FLOATING GOLDEN DUST
    // ==========================================
    ctx.save();
    for (const pt of this.particles) {
      ctx.fillStyle = pt.color;
      ctx.globalAlpha = pt.life / pt.maxLife;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // Ambient floating magical library dust
    for (let i = 0; i < this.ambientDust.length; i++) {
      const dust = this.ambientDust[i];
      // Assign magical colors based on index: Gold, Blue, Purple, Emerald
      const colorSet = [
        'rgba(251, 191, 36, ', // Gold
        'rgba(56, 189, 248, ', // Sky Blue
        'rgba(168, 85, 247, ', // Purple
        'rgba(52, 211, 153, '  // Emerald
      ];
      const baseColor = colorSet[i % colorSet.length];
      
      ctx.save();
      // Glowing aura
      ctx.shadowBlur = 10 + Math.sin(time * 3 + i) * 5;
      ctx.shadowColor = baseColor.replace(', ', ', 1)').replace('rgba', 'rgb');
      ctx.fillStyle = baseColor + dust.alpha + ')';
      ctx.beginPath();
      ctx.arc(dust.x, dust.y, dust.size * (1 + Math.sin(time * 2 + i) * 0.3), 0, Math.PI * 2);
      ctx.fill();
      
      // Occasional starburst effect for some particles
      if (i % 7 === 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, ' + (dust.alpha * 0.8) + ')';
        ctx.beginPath();
        const r = dust.size * 2;
        ctx.moveTo(dust.x, dust.y - r);
        ctx.lineTo(dust.x + r * 0.2, dust.y - r * 0.2);
        ctx.lineTo(dust.x + r, dust.y);
        ctx.lineTo(dust.x + r * 0.2, dust.y + r * 0.2);
        ctx.lineTo(dust.x, dust.y + r);
        ctx.lineTo(dust.x - r * 0.2, dust.y + r * 0.2);
        ctx.lineTo(dust.x - r, dust.y);
        ctx.lineTo(dust.x - r * 0.2, dust.y - r * 0.2);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }
    ctx.restore();

    // ==========================================
    // 4. VOLUMETRIC GODRAYS (STAINED GLASS SUNSHAFTS)
    // ==========================================
    ctx.save();
    ctx.fillStyle = 'rgba(254, 240, 138, 0.05)';
    for (let i = 0; i < 4; i++) {
      const rayX = (i * 900 + 400 + Math.sin(time * 0.5 + i) * 50);
      ctx.beginPath();
      ctx.moveTo(rayX, 0);
      ctx.lineTo(rayX + 260, 0);
      ctx.lineTo(rayX + 100, MAP_HEIGHT);
      ctx.lineTo(rayX - 160, MAP_HEIGHT);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // ==========================================
    // MAGICAL BOOK BUTTON INDICATOR
    // ==========================================
    ctx.save();
    const bounce = Math.sin(time * 4) * 3;
    ctx.translate(1320, 647 + bounce);
    
    
    // Glowing aura
    if (this.highlightBookButton) {
      ctx.beginPath();
      ctx.arc(0, 0, 40 + Math.sin(time * 10) * 10, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(251, 191, 36, 0.4)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.9)';
      ctx.lineWidth = 4;
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, 30 + Math.sin(time * 8) * 5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(251, 191, 36, 0.2)';
      ctx.fill();
    }


    // Indicator Box
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-45, 35, 90, 26, 8);
    ctx.fill();
    ctx.stroke();

    // Text
    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('📖 도서 목록', 0, 53);
    ctx.restore();

    ctx.restore(); // Restore camera translation
  };
}
