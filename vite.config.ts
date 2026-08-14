import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

// อ้างอิง: docs/07-chapter-7-architecture-technology.md (Vue 3 + Vite + TypeScript)
export default defineConfig({
  plugins: [vue()],
  // base สำหรับ GitHub Pages (repo: thebiiigbee05/BIIIGBEE-EDU-GAME)
  // ถ้าเปลี่ยนชื่อ repo หรือใช้ custom domain ต้องแก้ตรงนี้
  base: '/BIIIGBEE-EDU-GAME/',
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
