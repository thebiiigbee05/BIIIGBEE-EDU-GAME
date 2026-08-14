# 📁 markers/ — มาร์กเกอร์ AR (PNG)

โฟลเดอร์นี้เก็บไฟล์มาร์กเกอร์ AR.js ที่ `printable-card-sheet.html` อ้างอิง:

```
markers/
├── marker-0.png … marker-7.png   ← วาง PNG มาร์กเกอร์จริงที่นี่ (ตั้งชื่อตามนี้เท่านั้น)
└── README.md
```

## วิธีสร้าง (เลือก 1 วิธี)

### A. สคริปต์ OpenCV (แนะนำ)
```bash
pip install opencv-python-headless
python ../generate-markers.py     # รันจากโฟลเดอร์ design/ar-cards/
```
สร้าง `marker-0.png … marker-7.png` (ArUco original — ตรงกับ AR.js barcode 6×6)

### B. AR.js Marker Generator (ออนไลน์)
1. เปิด https://jeromeetienne.github.io/AR.js/three.js/examples/marker-training/examples/generator.html
2. เลือก **Barcode marker** → **6x6** → ใส่ ID (0–7) → Generate → ดาวน์โหลด PNG
3. ตั้งชื่อไฟล์เป็น `marker-{id}.png` วางในโฟลเดอร์นี้

## ข้อกำหนด
- PNG ขาวดำ 100% (พื้นขาว, มาร์กเกอร์ดำ) — ห้ามปรับสี/เพิ่มพื้นหลัง
- ความละเอียด ≥ 400×400 px
- อย่าเปลี่ยนชื่อไฟล์ (HTML อ้างอิงชื่อตายตัว)

## การตรวจสอบ
- เปิด `printable-card-sheet.html` → ต้องเห็นมาร์กเกอร์จริงครบ 8 ใบ
- สแกนทดสอบตามเช็กลิสต์ QA (ar-cards-spec.md ข้อ 8) — ระยะ 20–80 ซม., แสง 300+ lux
