# 📋 เทมเพลตบอร์ด Kanban — MONSTER SPELLER (กองกำลังพิทักษ์ตัวสะกด)

> **ไฟล์:** `kanban/monster-speller-kanban.csv` (สำหรับนำเข้า GitHub Projects) · **อ้างอิง:** บทที่ 8 (User Stories/แผน) + บทที่ 9 (Agile Kanban) ของเอกสารโครงการ
> **คอลัมน์:** 📥 Backlog · 🟡 Ready · 🟠 In Progress · 🔵 Review · 🟣 QA/Test · ✅ Done

---

## 1) โครงสร้างบอร์ดและ WIP Limits (กฎจากบทที่ 9.3)

```
┌────────────┬──────────┬──────────────┬───────────┬────────────┬────────────┐
│ 📥 Backlog │ 🟡 Ready │ 🟠 In Progress│ 🔵 Review │ 🟣 QA/Test │ ✅ Done   │
│            │          │              │           │            │            │
│ WIP: ∞     │ WIP: 5   │ WIP: 3       │ WIP: 3    │ WIP: 2     │ WIP: ∞     │
└────────────┴──────────┴──────────────┴───────────┴────────────┴────────────┘
```

**กฎ WIP (บทที่ 9.3):** ทีม 5–7 คน → In Progress ≤ 3 · Review ≤ 3 · QA ≤ 2 — ทำการ์ดให้เสร็จก่อนเริ่มการ์ดใหม่;
การ์ดติดขัด ตั้งธง 🚩 และแก้ภายใน 24 ชม. ผ่าน Daily Standup

## 2) สถานะการ์ด ณ ปัจจุบัน (19 การ์ด)

### 📥 Backlog (11)
- **Epic:** Tech Spike — Canvas 60fps + AR.js ทำงานร่วมกันได้ *(Sprint 0)*
- **Epic:** Vertical Slice — เล่นด่าน 1 ครบวงจร *(Sprint 1)*
- US-04 ระบบคำใบ้เมื่อยิงผิด *(Sprint 2)* · US-09 Save/Load *(Sprint 2)* · US-12 คำใบ้เป็นข้อความ *(Sprint 2)*
- US-05 ชิ้นส่วนอัปเกรดยาน *(Sprint 4)* · US-06 Modal Settings *(Sprint 5)* · US-07 Modal Hall of Fame *(Sprint 5)* · US-08 โหมด AR *(Sprint 5)* · US-11 ความเร็วเกม *(Sprint 5)* · US-10 Dashboard ครู *(Sprint 6)* · Epic Pilot+อบรมครู *(Sprint 7)*

### 🟡 Ready (2)
- US-02 เลือกกระสุนมาตรา 1–8 (Keyboard)
- US-03 แสดงบัตรคำบนมอนสเตอร์ (ตัวสะกดกะพริบ)

### 🟠 In Progress (1)
- US-01 ยิงมอนสเตอร์ด้วยเมาส์ (เล็ง+คลิก)

### 🔵 Review (1)
- ธนาคารคำ ด่าน 1–2 (แม่กก/กด ตรงมาตรา) + ตรวจ IOC

### 🟣 QA/Test (0)
- *(ว่าง — เมื่อ US ใดถึง QA จะย้ายมาที่นี่)*

### ✅ Done (0)
- *(ว่าง — เริ่ม Sprint 1 แล้วค่อย ๆ ย้ายมาที่นี่)*

## 3) รายละเอียดการ์ดทั้งหมด

| ID | การ์ด | ประเภท | Sprint | Priority | สถานะ |
|---|---|---|---|---|---|
| Epic | Tech Spike — Canvas 60fps + AR.js | Epic | 0 | Must | Backlog |
| Epic | Vertical Slice — เล่นด่าน 1 ครบวงจร | Epic | 1 | Must | Backlog |
| US-01 | ยิงมอนสเตอร์ด้วยเมาส์ (เล็ง+คลิก) | โค้ด | 1 | Must | In Progress |
| US-02 | เลือกกระสุนมาตรา 1–8 (Keyboard) | โค้ด | 1 | Must | Ready |
| US-03 | แสดงบัตรคำบนมอนสเตอร์ (ตัวสะกดกะพริบ) | โค้ด | 1 | Must | Ready |
| — | Sprite sheet มอนสเตอร์ Walker (เดิน/ระเบิด/มิตร) | ดีไซน์ | 1 | Must | Backlog |
| — | ธนาคารคำ ด่าน 1–2 + ตรวจ IOC | เนื้อหา | 1 | Must | Review |
| — | เทมเพลตการ์ด AR มอนสเตอร์ (พิมพ์) | ดีไซน์ | 1 | Should | Backlog |
| — | Unit test ระบบตรวจมาตรา (ถูก/ผิด) | ทดสอบ | 1 | Must | Backlog |
| US-04 | ระบบคำใบ้เมื่อยิงผิด (ชะงัก + คำใบ้แดง) | โค้ด | 2 | Must | Backlog |
| US-09 | Save/Load ความคืบหน้า | โค้ด | 2 | Must | Backlog |
| US-12 | คำใบ้/เฉลยเป็นข้อความเมื่อปิดเสียง | โค้ด | 2 | Must | Backlog |
| US-05 | สะสมชิ้นส่วนอัปเกรดยาน (Hangar) | โค้ด | 4 | Should | Backlog |
| US-06 | Modal Settings (เสียง/ความเร็ว/โหมดผ่อนปรน) | โค้ด | 5 | Must | Backlog |
| US-07 | Modal Hall of Fame 10 อันดับ | โค้ด | 5 | Should | Backlog |
| US-08 | โหมด AR สแกนการ์ดมอนสเตอร์บนโต๊ะ | โค้ด | 5 | Should | Backlog |
| US-11 | ตัวเลือกความเร็วเกม (ช้า/ปกติ/เร็ว) | โค้ด | 5 | Should | Backlog |
| US-10 | Dashboard ครู (Misconception Map) | โค้ด | 6 | Should | Backlog |
| Epic | Pilot + อบรมครู + คู่มือ | Epic | 7 | Must | Backlog |

> *DoD (Definition of Done) ทุกการ์ด — ดูบทที่ 8.3 · Acceptance Criteria ตัวอย่าง — ดูบทที่ 8.4*

---

## 4) วิธีนำเข้า GitHub Projects (Import CSV)

### ขั้นตอน
1. **สร้างบอร์ด** — GitHub → Repo → **Projects** → **New project** → เลือก **Board** layout (หรือ Table แล้วสลับเป็น Board ได้)
2. **สร้างคอลัมน์ (Status field)** — ตั้งค่า **Status** (single select) ให้มีตัวเลือกตรงกับไฟล์ CSV:
   `Backlog` · `Ready` · `In Progress` · `Review` · `QA` · `Done`
3. **สร้างฟิลด์เสริม (ไม่บังคับ)** — **Sprint** (Iteration/Text), **Priority** (single select: Must/Should/Could), **Labels**
4. **นำเข้า** — ที่ Projects → ปุ่ม **⋯ (เมนู)** → **Import items** → เลือกไฟล์ `kanban/monster-speller-kanban.csv`
5. **แมปคอลัมน์** — ระบบจะให้จับคู่หัวข้อ CSV กับฟิลด์ของบอร์ด: `Title` → Title, `Status` → Status, `Sprint` → Sprint, `Priority` → Priority, `Labels` → Labels (สร้าง Labels ใน repo ก่อนถ้าต้องการ: โค้ด/ดีไซน์/เนื้อหา/ทดสอบ/Epic)
6. **ตั้ง WIP Limits** — GitHub Projects ไม่บังคับ WIP ในตัว → ใช้ **Automation rules** (เช่น ย้ายเป็น In Progress อัตโนมัติเมื่อเปิด issue) หรือติดตั้งแอปเสริม (Zenhub/Linear) เพื่อแจ้งเตือนเมื่อเกิน WIP

### ทางเลือก: GitHub Issues + Projects (Classic)
- สร้าง Issue จากการ์ด (หรือใช้ **import issues** ผ่าน GitHub CLI/API) แล้วจัดคอลัมน์บน Project board — ตัว CSV นี้แปลงได้ง่ายโดยใช้คอลัมน์ Title/Description เป็นเนื้อหา Issue

> 📖 รายละเอียดกฎบอร์ด/การ์ด/เมตริกเพิ่มเติม: `docs/09-chapter-9-agile-kanban.md` · แผน Sprint: `docs/08-chapter-8-software-development-plan.md`
