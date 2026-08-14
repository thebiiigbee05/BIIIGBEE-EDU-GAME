# 🎮 BIIIGBEE EDU GAME

**ฮับ (Hub) สำหรับ deploy เกมการศึกษา — ผู้เล่นเข้ามาเล่นได้ทันที**

## 🌐 เล่นเกมได้ที่

| เกม | URL (GitHub Pages) | ซอร์สโค้ด |
|---|---|---|
| **กองกำลังพิทักษ์ตัวสะกด (Monster Speller)** | `./monster-speller/` | [thebiiigbee05/monster-speller](https://github.com/thebiiigbee05/monster-speller) |

> หน้าแรกของฮับ (`index.html`) เป็นรายการการ์ดเกม — คลิกเพื่อเข้าเล่น

## 📁 โครงสร้าง repo นี้ (deployment only)

```
BIIIGBEE-EDU-GAME/
├── index.html          ← หน้า Hub (รายการเกม)
├── monster-speller/    ← เกมที่ build แล้ว (dist) — ผู้เล่นเล่นที่นี่
└── README.md
```

**repo นี้เก็บเฉพาะผล build (dist) ของแต่ละเกม — ซอร์สโค้ดอยู่ใน repo แยกของแต่ละเกม**

## ➕ วิธีเพิ่มเกมใหม่

1. ใน repo ซอร์สของเกม: build แล้วคัดลอกผลลัพธ์มาโฟลเดอร์ใหม่ เช่น `my-game/`
2. เพิ่มการ์ดลิงก์ `./my-game/` ใน `index.html` (เลียนแบบการ์ด Monster Speller)
3. Commit + push → Pages อัปเดตอัตโนมัติ

> ⚠️ เกมควร build ด้วย **base แบบ relative (`./`)** เพื่อให้ asset โหลดได้ในโฟลเดอร์ย่อย
> (Vite: `base: './'` — ดูใน repo ซอร์ส)

## 🚀 เปิดใช้งาน GitHub Pages (ครั้งแรกครั้งเดียว)

1. ไปที่ **Settings → Pages** ของ repo นี้
2. **Build and deployment → Source:** เลือก **"Deploy from a branch"**
3. **Branch:** `main` · **Folder:** `/ (root)** → Save

เว็บจะอัปเดตอัตโนมัติทุกครั้งที่ push ขึ้น `main`

## 📚 เอกสารโครงการ

เอกสารโครงการ (12 บท, สารบัญ, บรรณานุกรม), บอร์ด Kanban, สเปกการ์ด AR
และธนาคารคำศัพท์ — อยู่ใน [repo ซอร์สของ Monster Speller](https://github.com/thebiiigbee05/monster-speller)
