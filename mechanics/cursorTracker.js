// mechanics/cursorTracker.js - Cursor tracking, physics, & collision detection

class CursorTracker {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    // Virtual Cursor Position
    this.x = 0;
    this.y = 0;

    // Hardware Mouse Target Position
    this.targetX = 0;
    this.targetY = 0;

    // Physics (Velocity & Friction)
    this.vx = 0;
    this.vy = 0;

    // Upgradable / Debuffable Physics Modifiers
    this.speed = 0.15;      // How fast cursor catches up to target
    this.friction = 0.82;   // Lower = more slide ("sticky"), Higher = less slide

    this.isTracking = false;
    this.animFrameId = null;

    this.initCanvas();
    this.bindEvents();
  }

  initCanvas() {
    if (!this.canvas) return;
    // Set canvas dimensions to match display container
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;

    // Center cursor on canvas init
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height / 2;
    this.targetX = this.x;
    this.targetY = this.y;
  }

  bindEvents() {
    if (!this.canvas) return;

    // Track mouse position over the game area
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.targetX = e.clientX - rect.left;
      this.targetY = e.clientY - rect.top;
    });

    // HAZARD CONDITION 1: Mouse leaves the central game arena
    this.canvas.addEventListener('mouseleave', () => {
      if (this.isTracking) {
        triggerGameOver("Cursor left the play area!");
      }
    });

    // HAZARD CONDITION 2: Player switches browser tab or loses window focus
    window.addEventListener('blur', () => {
      if (this.isTracking && currentGameState === GameState.GAMEPLAY) {
        triggerGameOver("Window focus lost / Tab switched!");
      }
    });
  }

  startTracking() {
    this.isTracking = true;
    this.resizeCanvas();
    this.loop();
  }

  stopTracking() {
    this.isTracking = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
  }

  // Physics Loop
  updatePhysics() {
    // Calculate distance to actual mouse target
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;

    // Apply acceleration towards target
    this.vx += dx * this.speed;
    this.vy += dy * this.speed;

    // Apply friction (creates sliding / sticky feel)
    this.vx *= this.friction;
    this.vy *= this.friction;

    // Update virtual cursor position
    this.x += this.vx;
    this.y += this.vy;

    // HAZARD CHECK: Virtual cursor hits canvas boundary due to sliding momentum
    if (
      this.x <= 0 || 
      this.x >= this.canvas.width || 
      this.y <= 0 || 
      this.y >= this.canvas.height
    ) {
      triggerGameOver("Cursor momentum slid out of bounds!");
    }
  }

  // Draw Custom Virtual Cursor
  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Render Virtual Player Cursor (Crosshair/Dot placeholder)
    this.ctx.fillStyle = '#ff3333';
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
    this.ctx.fill();

    // Inner White Core
    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    this.ctx.fill();
  }

  loop() {
    if (!this.isTracking) return;

    this.updatePhysics();
    this.render();

    this.animFrameId = requestAnimationFrame(() => this.loop());
  }
}

// Global instance
window.cursorTracker = new CursorTracker();
