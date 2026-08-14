#!/usr/bin/env node
/**
 * สร้าง Sprite sheet มอนสเตอร์ (pixel-art) — docs/06-chapter-6-ui-ux-graphics.md ข้อ 6.6
 *
 * เอาต์พุต:
 *   public/assets/sprites/monsters-sheet.png   (384×256 — 4 แถว × 6 คอลัมน์, เซลล์ 64×64)
 *   public/assets/sprites/monsters-sheet.json  (manifest: ตำแหน่งเฟรม สำหรับ Canvas)
 *
 * เฟรมต่อมอนสเตอร์ (เรียงตามคอลัมน์): เดิน-1, เดิน-2, ระเบิด-1, ระเบิด-2, ระเบิด-3, เป็นมิตร
 * วาดที่กริด 16×16 แล้ว scale ×4 (nearest-neighbor) → 64×64
 *
 * วิธีรัน: node scripts/generate-sprites.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const GRID = 16;      // กริดต้นฉบับ
const SCALE = 4;      // 16 → 64 px
const CELL = GRID * SCALE;
const COLS = 6;       // 6 เฟรม
const ROWS = 4;       // 4 มอนสเตอร์
const FRAMES = ['walk1', 'walk2', 'explode1', 'explode2', 'explode3', 'friendly'];

// สี (RGBA)
const COLORS = {
  '.': [0, 0, 0, 0],            // โปร่งใส
  '#': [11, 15, 42, 255],       // ตัวมอนสเตอร์ (มืด)
  'W': [255, 255, 255, 255],    // ตา / ฟัน
  'X': [255, 255, 255, 255],    // รอยระเบิด
  'Y': [255, 215, 0, 255],      // ประกาย/หัวใจ (#FFD700)
};

const MONSTERS = [
  { id: 'walker', color: [57, 255, 20],    name: 'Walker (แม่กก)' },   // เขียว
  { id: 'runner', color: [255, 46, 151],   name: 'Runner (แม่กด)' },   // ชมพู
  { id: 'tank',   color: [168, 85, 247],   name: 'Tank (แม่กบ)' },     // ม่วง
  { id: 'boss',   color: [255, 59, 59],    name: 'Boss (แม่กน)' },     // แดง
];

// ---------- pixel-art (16×16, แถวละไม่เกิน 16 ตัวอักษร — เติม '.' อัตโนมัติ) ----------

const WALKER_WALK1 = [
  '.......OO.......',
  '.......OO.......',
  '......OOOO......',
  '.....OOOOOO.....',
  '....OOOOOOOO....',
  '...OO######OO...',
  '..OOWWWWWWWWOO..',
  '..OOWWWWWWWWOO..',
  '...OO######OO...',
  '...OO######OO...',
  '....OOOOOOOO....',
  '....OOOOOOOO....',
  '....OOOOOOOO....',
  '...OO......OO...',
  '..OO........OO..',
  '..O..........O..',
];
const WALKER_WALK2 = [
  ...WALKER_WALK1.slice(0, 13),
  '.....OO..OO.....',
  '.....OOOOOO.....',
  '......OOOO......',
];

const RUNNER_WALK1 = [
  '......OOOO......',
  '.....OOOOOO.....',
  '.....OOOOOO.....',
  '....OOOOOOOO....',
  '...O######OO....',
  '..OOWWWWWWWWOO..',
  '.OOWWWWWWWWWWOO.',
  '..OOWWWWWWWWOO..',
  '...OO######OO...',
  '....O######O....',
  '....OOOOOOOO....',
  '....OOOOOOOO....',
  '...OOO....OOO...',
  '..OOO......OOO..',
  '..OO........OO..',
  '.OO..........OO.',
];
const RUNNER_WALK2 = [
  ...RUNNER_WALK1.slice(0, 12),
  '....OOOOOOOO....',
  '.....OOOOOO.....',
  '......OOOO......',
  '.......OO.......',
];

const TANK_WALK1 = [
  '....OOOOOOOO....',
  '...OOOOOOOOOO...',
  '..OOOOOOOOOOOO..',
  '.OO##########OO.',
  '.OO#OOOOOOOO#OO.',
  '.OO##########OO.',
  '..OOWW###WWOO...',
  '..OO######OO....',
  '...O######O.....',
  '....OOOOOOOO....',
  '....OOOOOOOO....',
  '....OOOOOOOO....',
  '...OOO..OOO.....',
  '..OOOO..OOOO....',
  '.OOO......OOO...',
  'OOO........OOO..',
];
const TANK_WALK2 = [
  ...TANK_WALK1.slice(0, 12),
  '....OOOOOOOO....',
  '.....OOOOOO.....',
  '......OOOO......',
  '......OOOO......',
];

const BOSS_WALK1 = [
  '..O..O..O..O....',
  '.OOOOOOOOOOOOOO.',
  '.OOO########OOO.',
  '.OO##########OO.',
  '..OO########OO..',
  '..OOWWWWWWWWOO..',
  '.OOWWWWWWWWWWOO.',
  '..OOWWWWWWWWOO..',
  '..OO######OO....',
  '..OO#OOOO#OO....',
  '..OO######OO....',
  '...OOOOOOOO.....',
  '....OOOOOOOO....',
  '...OOO..OOO.....',
  '..OOO....OOO....',
  '..OO......OO....',
];
const BOSS_WALK2 = [
  ...BOSS_WALK1.slice(0, 12),
  '....OOOOOOOO....',
  '.....OOOOOO.....',
  '......OOOO......',
  '......OOOO......',
];

// ตำแหน่งรอยระเบิด (แถว, คอลัมน์) และจุดประกายรอบตัว
const CRACKS = [
  [5, 6], [8, 9], [6, 11], [10, 5],
];
const SPARKS = [
  [1, 1], [1, 14], [7, 0], [8, 0], [7, 15], [8, 15],
  [14, 2], [14, 13], [2, 7], [2, 8], [13, 5], [13, 10],
];

// ---------- ตัวช่วย ----------

const norm = (grid) => grid.map((row) => row.padEnd(GRID, '.'));

function setCell(grid, r, c, ch) {
  if (r >= 0 && r < GRID && c >= 0 && c < GRID) {
    const row = grid[r].split('');
    row[c] = ch;
    grid[r] = row.join('');
  }
}

/** เฟรมระเบิด: ระดับ 1–3 (3 = ระเบิดเต็มจอ) */
function explodeFrame(base, level) {
  const g = norm(base).map((r) => r.split(''));
  const cells = g.map((row) => row.join(''));

  // รอยแตก: เปิดทีละอันตามระดับ
  for (let i = 0; i < level; i++) setCell(cells, CRACKS[i][0], CRACKS[i][1], 'X');

  // ประกายรอบตัว: ระดับ 1→4 จุด, 2→8, 3→12
  const sparkCount = level * 4;
  for (let i = 0; i < sparkCount; i++) setCell(cells, SPARKS[i][0], SPARKS[i][1], 'Y');

  // ระดับ 3: แฟลชขาวทั้งตัว
  if (level === 3) {
    for (let r = 0; r < GRID; r++) {
      for (let c = 0; c < GRID; c++) {
        const ch = cells[r][c];
        if (ch === '#') cells[r] = cells[r].slice(0, c) + 'X' + cells[r].slice(c + 1);
        else if (ch === 'O') cells[r] = cells[r].slice(0, c) + 'Y' + cells[r].slice(c + 1);
      }
    }
  }
  return cells;
}

/** เฟรมเป็นมิตร: ยิ้ม + ประกาย */
function friendlyFrame(base) {
  const cells = norm(base).map((r) => r.split('')).map((r) => r.join(''));
  // ยิ้มกว้าง (แถวที่ 9)
  for (let c = 5; c <= 10; c++) setCell(cells, 9, c, 'W');
  // ประกายรอบตัว
  setCell(cells, 2, 2, 'Y');
  setCell(cells, 2, 13, 'Y');
  setCell(cells, 13, 3, 'Y');
  setCell(cells, 13, 12, 'Y');
  return cells;
}

// ---------- สร้าง sheet ----------

const outDir = path.resolve('public/assets/sprites');
fs.mkdirSync(outDir, { recursive: true });

const png = new PNG({ width: CELL * COLS, height: CELL * ROWS });
const manifest = {
  sheet: '/assets/sprites/monsters-sheet.png',
  cell: CELL,
  grid: GRID,
  frames: {},
};

MONSTERS.forEach((monster, mi) => {
  const walk1 = norm(monster.id === 'walker' ? WALKER_WALK1 : monster.id === 'runner' ? RUNNER_WALK1 : monster.id === 'tank' ? TANK_WALK1 : BOSS_WALK1);
  const walk2 = norm(monster.id === 'walker' ? WALKER_WALK2 : monster.id === 'runner' ? RUNNER_WALK2 : monster.id === 'tank' ? TANK_WALK2 : BOSS_WALK2);
  const frames = [
    walk1,
    walk2,
    explodeFrame(walk1, 1),
    explodeFrame(walk1, 2),
    explodeFrame(walk1, 3),
    friendlyFrame(walk2),
  ];

  const palette = { ...COLORS, 'O': monster.color };

  frames.forEach((grid, fi) => {
    for (let gy = 0; gy < GRID; gy++) {
      for (let gx = 0; gx < GRID; gx++) {
        const [r, g, b, a] = palette[grid[gy][gx]] ?? [0, 0, 0, 0];
        for (let sy = 0; sy < SCALE; sy++) {
          for (let sx = 0; sx < SCALE; sx++) {
            const x = (fi * CELL) + (gx * SCALE) + sx;
            const y = (mi * CELL) + (gy * SCALE) + sy;
            const idx = (y * png.width + x) << 2;
            png.data[idx] = r;
            png.data[idx + 1] = g;
            png.data[idx + 2] = b;
            png.data[idx + 3] = a;
          }
        }
      }
    }
  });

  manifest.frames[monster.id] = {
    name: monster.name,
    row: mi,
    frames: Object.fromEntries(FRAMES.map((name, fi) => [
      name,
      { x: fi * CELL, y: mi * CELL, w: CELL, h: CELL },
    ])),
  };
  console.log(`  ${monster.id.padEnd(7)} (${monster.name}) → 6 เฟรม @แถว ${mi}`);
});

const sheetPath = path.join(outDir, 'monsters-sheet.png');
fs.writeFileSync(sheetPath, PNG.sync.write(png));
fs.writeFileSync(path.join(outDir, 'monsters-sheet.json'), JSON.stringify(manifest, null, 2));

// ตรวจสอบ: อ่านกลับมาเพื่อยืนยัน
const check = PNG.sync.read(fs.readFileSync(sheetPath));
console.log(`\nสร้างเสร็จ: ${sheetPath} (${check.width}×${check.height})`);
console.log(`manifest: ${path.join(outDir, 'monsters-sheet.json')}`);
