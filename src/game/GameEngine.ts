import { Monster, WalkerMonster, RunnerMonster, TankMonster } from './Monster';
import { SpriteRenderer } from './SpriteRenderer';
import { pickWord } from '../data/wordBank';
import {
  BASE_X,
  BULLET_SPEED,
  CANVAS_H,
  CANVAS_W,
  HIT_RADIUS,
  MATRA_COLORS,
  MONSTER_H,
  MONSTER_W,
  SHIP,
  STD_FINAL,
} from './constants';
import type { Matra, WordEntry } from '../data/types';

interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  matra: Matra;
  hit: boolean;
}

export interface EngineEvents {
  onCorrect(points: number, combo: number): void;
  onWrong(): void;
  onHint(text: string): void;
  onEscape(): void;
}

/**
 * ระบบเกมหลักบน Canvas (docs/04-chapter-4-game-design.md ข้อ 4.5 Core Loop)
 * - มอนสเตอร์เดินจากขวา → ซ้าย ถือบัตรคำ
 * - ผู้เล่นคลิกยิงกระสุนมาตรา → ถูก = ระเบิด/เป็นมิตร + คะแนน, ผิด = ชะงัก + คำใบ้
 */
export class GameEngine {
  readonly width = CANVAS_W;
  readonly height = CANVAS_H;
  monsters: Monster[] = [];
  bullets: Bullet[] = [];

  private ctx: CanvasRenderingContext2D;
  private events: EngineEvents;
  private sprite: SpriteRenderer | null = null;

  private raf = 0;
  private last = 0;
  private running = false;
  private elapsed = 0;
  private spawnTimer = 1;
  private combo = 0;
  private selectedMatra: Matra = 'กก';
  private speedMultiplier = 1;
  private gentleMode = false;
  private pointer = { x: SHIP.x, y: SHIP.y - 120 };

  private readonly stars = Array.from({ length: 60 }, () => ({
    x: Math.random() * CANVAS_W,
    y: Math.random() * CANVAS_H * 0.75,
    r: Math.random() * 1.5 + 0.5,
    tw: Math.random() * Math.PI * 2,
  }));

  constructor(canvas: HTMLCanvasElement, events: EngineEvents) {
    canvas.width = this.width;
    canvas.height = this.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('ไม่สามารถสร้าง 2D context ได้');
    this.ctx = ctx;
    this.events = events;
  }

  async start(): Promise<void> {
    if (!this.sprite) {
      this.sprite = await SpriteRenderer.load();
    }
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.loop);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  setBullet(matra: Matra): void {
    this.selectedMatra = matra;
  }

  /** ความเร็วโดยรวมของมอนสเตอร์ (settings.speed — docs/06-chapter-6 ข้อ 6.3) */
  setSpeedMultiplier(mult: number): void {
    this.speedMultiplier = mult;
  }

  /** โหมดผ่อนปรน: ผิดทันทีให้คำใบ้เต็ม (docs/04-chapter-4-game-design.md ข้อ 4.7) */
  setGentleMode(on: boolean): void {
    this.gentleMode = on;
  }

  /** คลิก/แตะบน canvas — ยิงไปยังจุดนั้น */
  handlePointer(clientX: number, clientY: number): void {
    const rect = this.canvasRect();
    if (!rect) return;
    const x = (clientX - rect.left) * (this.width / rect.width);
    const y = (clientY - rect.top) * (this.height / rect.height);
    this.pointer = { x, y };
    this.fire();
  }

  /** ยิงไปยังตำแหน่ง pointer ล่าสุด (ใช้กับปุ่ม Space) */
  fireDefault(): void {
    this.fire();
  }

  /** สำหรับเทส E2E — สร้างมอนสเตอร์ที่ตำแหน่งกำหนด (ล้างของเดิมให้เทส deterministic) */
  debugSpawn(word: WordEntry, x = 700, y = 260): void {
    this.monsters = [];
    this.bullets = [];
    this.monsters.push(new WalkerMonster(word, x, y));
  }

  private canvasRect(): DOMRect | null {
    const canvas = this.ctx.canvas;
    return canvas.getBoundingClientRect();
  }

  private loop = (t: number): void => {
    if (!this.running) return;
    const dt = Math.min((t - this.last) / 1000, 0.05);
    this.last = t;
    this.update(dt);
    this.render();
    this.raf = requestAnimationFrame(this.loop);
  };

  private update(dt: number): void {
    this.elapsed += dt;

    // คลื่นมอนสเตอร์ — ถี่ขึ้นตามเวลา (docs/04-chapter-4-game-design.md ข้อ 4.9)
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0 && this.monsters.length < 5) {
      this.spawnMonster();
      this.spawnTimer = Math.max(0.9, 2.5 - this.elapsed * 0.01);
    }

    // อัปเดตมอนสเตอร์ — state machine อยู่ใน Monster.update เอง (locality)
    // เหลือแค่เช็ค "เดินถึงฐาน" ซึ่งต้องรู้จักฉาก (GameEngine เป็นเจ้าของ)
    for (const m of this.monsters) {
      m.update(dt, this.speedMultiplier);
      if (m.state === 'walking' && m.x < BASE_X) {
        m.state = 'escaped';
        this.events.onEscape();
      }
    }
    this.monsters = this.monsters.filter((m) => m.state !== 'escaped');

    // กระสุน
    for (const b of this.bullets) {
      b.x += b.vx * dt;
      b.y += b.vy * dt;
    }

    // ชน
    for (const b of this.bullets) {
      const target = this.monsters.find(
        (m) =>
          (m.state === 'walking' || m.state === 'stunned') &&
          Math.hypot(b.x - m.x, b.y - m.y) < HIT_RADIUS,
      );
      if (target) {
        b.hit = true;
        const res = target.hit(b.matra);
        if (res.correct) {
          this.combo += 1;
          this.events.onCorrect(target.points, this.combo);
        } else {
          this.combo = 0;
          this.events.onWrong();
          this.events.onHint(this.hintText(target));
        }
        break;
      }
    }

    this.bullets = this.bullets.filter(
      (b) => !b.hit && b.x > -20 && b.x < this.width + 20 && b.y > -20 && b.y < this.height + 20,
    );
  }

  private spawnMonster(): void {
    const exclude = new Set(this.monsters.map((m) => m.word.word));
    const word = pickWord(exclude);
    const roll = Math.random();
    const ctor = roll < 0.5 ? WalkerMonster : roll < 0.8 ? RunnerMonster : TankMonster;
    const x = this.width + 40;
    const y = 120 + Math.random() * 240;
    this.monsters.push(new ctor(word, x, y));
  }

  private hintText(m: Monster): string {
    if (this.gentleMode && m.hintLevel >= 1) {
      return `เฉลย: มาตรา ${m.word.matra} (ตัวสะกด "${m.word.finalConsonant}")`;
    }
    if (m.hintLevel >= 3) {
      return `เฉลย: มาตรา ${m.word.matra} (ตัวสะกด "${m.word.finalConsonant}")`;
    }
    if (m.word.matra === 'กา') {
      return 'คำนี้ไม่มีตัวสะกด (มาตรา กา)';
    }
    const std = STD_FINAL[m.word.matra];
    if (m.hintLevel >= 2 && !m.word.regular) {
      return `ตัวสะกด "${m.word.finalConsonant}" ออกเสียงเหมือน ${std} → มาตรา ${m.word.matra}`;
    }
    return `คำนี้ออกเสียงเหมือน ${std} สะกด`;
  }

  private fire(): void {
    const dx = this.pointer.x - SHIP.x;
    const dy = this.pointer.y - SHIP.y;
    const len = Math.hypot(dx, dy) || 1;
    this.bullets.push({
      x: SHIP.x,
      y: SHIP.y,
      vx: (dx / len) * BULLET_SPEED,
      vy: (dy / len) * BULLET_SPEED,
      matra: this.selectedMatra,
      hit: false,
    });
  }

  // ---------------------------------------------------------------- render

  private render(): void {
    const ctx = this.ctx;
    const t = this.elapsed;

    // พื้นหลัง
    const bg = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    bg.addColorStop(0, '#0b0f2a');
    bg.addColorStop(1, '#1a1140');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // ดาว
    for (const s of this.stars) {
      const a = 0.4 + 0.6 * Math.abs(Math.sin(t * 1.5 + s.tw));
      ctx.globalAlpha = a;
      ctx.fillStyle = '#e6e9ff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // พื้น
    ctx.fillStyle = '#0d1230';
    ctx.fillRect(0, CANVAS_H - 44, CANVAS_W, 44);
    ctx.fillStyle = 'rgba(0,229,255,0.35)';
    ctx.fillRect(0, CANVAS_H - 44, CANVAS_W, 2);

    // กระสุน
    for (const b of this.bullets) {
      ctx.fillStyle = MATRA_COLORS[b.matra];
      ctx.shadowColor = MATRA_COLORS[b.matra];
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(b.x, b.y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // มอนสเตอร์ + บัตรคำ
    for (const m of this.monsters) {
      this.sprite?.draw(ctx, m, m.x - MONSTER_W / 2, m.y - MONSTER_H / 2, MONSTER_W, MONSTER_H);
      this.drawWordCard(m);
    }

    // ยานผู้เล่น
    this.drawShip();
  }

  private drawShip(): void {
    const ctx = this.ctx;
    const { x, y } = SHIP;
    ctx.save();
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 14;
    ctx.fillStyle = '#00e5ff';
    ctx.beginPath();
    ctx.moveTo(x, y - 26);
    ctx.lineTo(x + 22, y + 18);
    ctx.lineTo(x + 8, y + 14);
    ctx.lineTo(x, y + 24);
    ctx.lineTo(x - 8, y + 14);
    ctx.lineTo(x - 22, y + 18);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#ff2e97';
    ctx.beginPath();
    ctx.moveTo(x, y - 10);
    ctx.lineTo(x + 6, y + 2);
    ctx.lineTo(x - 6, y + 2);
    ctx.closePath();
    ctx.fill();
  }

  private drawWordCard(m: Monster): void {
    const ctx = this.ctx;
    const w = 116;
    const h = 34;
    const x = m.x - w / 2;
    const y = m.y - MONSTER_H / 2 - h - 8;

    // ตัวการันต์: ทำให้ตัวสะกดกะพริบ (docs/04-chapter-4-game-design.md ข้อ 4.5)
    const blink = Math.floor(this.elapsed * 3) % 2 === 0;

    ctx.fillStyle = 'rgba(20,26,61,0.95)';
    ctx.strokeStyle = MATRA_COLORS[m.word.matra];
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px "Sarabun", "Leelawadee UI", Tahoma, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (m.word.matra === 'กา') {
      ctx.fillText(m.word.word, m.x, y + h / 2 + 1);
    } else {
      // แสดงคำโดยตัวสะกดเป็น "?" กะพริบ — ผู้เล่นต้องเดา/นึกมาตรา
      const stem = m.word.word.slice(0, -1);
      const display = blink ? `${stem}?` : m.word.word;
      ctx.fillText(display, m.x, y + h / 2 + 1);
      if (blink) {
        ctx.fillStyle = '#ffd700';
        ctx.fillText(m.word.word.slice(-1), m.x + 30, y + h / 2 + 1);
      }
    }
  }
}
