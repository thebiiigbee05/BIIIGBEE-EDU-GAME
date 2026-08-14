#!/usr/bin/env node
/**
 * สร้าง design/sprites-preview.html แบบ self-contained (ฝัง PNG เป็น data URI)
 * จากเทมเพลต design/sprites-preview.template.html + public/assets/sprites/monsters-sheet.png
 *
 * วิธีรัน: node scripts/build-preview.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const templatePath = path.resolve('design/sprites-preview.template.html');
const pngPath = path.resolve('public/assets/sprites/monsters-sheet.png');
const outPath = path.resolve('design/sprites-preview.html');

const template = fs.readFileSync(templatePath, 'utf8');
const b64 = fs.readFileSync(pngPath).toString('base64');
const dataUri = `data:image/png;base64,${b64}`;

if (!template.includes('__SHEET_B64__')) {
  throw new Error('เทมเพลตไม่พบ placeholder __SHEET_B64__');
}
const html = template.replace('__SHEET_B64__', dataUri);
fs.writeFileSync(outPath, html);
console.log(`สร้าง ${outPath} (${(html.length / 1024).toFixed(1)} KB)`);
