import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

// อ้างอิง: docs/07-chapter-7-architecture-technology.md (Vue 3 + Vite + TypeScript)
export default defineConfig({
  plugins: [vue()],
  // base แบบ relative — dist ถูกเก็บในโฟลเดอร์ย่อยของฮับ (BIIIGBEE-EDU-GAME/monster-speller/)
  // ดังนั้น asset path ต้องเป็น relative ถึงจะโหลดได้ไม่ว่าโฮสต์ที่ path ไหน
  base: './',
  server: {
    port: 5173,
    strictPort: true,
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
  test: {
    include: ['tests/unit/**/*.spec.ts'],
  },
});
