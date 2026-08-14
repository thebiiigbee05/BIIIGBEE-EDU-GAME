#!/usr/bin/env python3
"""
สร้างมาร์กเกอร์ AR.js Barcode (ArUco original) 8 แบบ สำหรับการ์ด Monster Speller
- เอาต์พุต: markers/marker-0.png … marker-7.png (400×400 px)
- AR.js barcode 6x6 ใช้ dictionary เดียวกับ ArUco "original" ของ OpenCV
  (ตรวจยืนยันด้วยการสแกนจริงตามเช็กลิสต์ QA ใน ar-cards-spec.md ข้อ 8)

การติดตั้ง (ครั้งเดียว):
    pip install opencv-python-headless

การใช้งาน:
    python generate-markers.py
"""
import os

import cv2

OUT_DIR = "markers"
MARKER_PX = 400          # 400px → พิมพ์ 80 มม. ≈ 127 dpi
IDS = range(8)           # ID 0–7 ตามตารางแมปใน ar-cards-spec.md

DICT = cv2.aruco.getPredefinedDictionary(cv2.aruco.DICT_ARUCO_ORIGINAL)


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    for marker_id in IDS:
        img = cv2.aruco.generateImageMarker(DICT, marker_id, MARKER_PX)
        path = os.path.join(OUT_DIR, f"marker-{marker_id}.png")
        cv2.imwrite(path, img)
        print(f"สร้าง {path}")
    print("เสร็จสิ้น — เปิด printable-card-sheet.html เพื่อดูการ์ดพร้อมมาร์กเกอร์จริง")


if __name__ == "__main__":
    main()
