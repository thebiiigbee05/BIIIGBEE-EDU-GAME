<script setup lang="ts">
import { ref } from 'vue';
import { useGameStore } from '../stores/game';
import SettingsModal from '../components/SettingsModal.vue';
import HallOfFameModal from '../components/HallOfFameModal.vue';

const game = useGameStore();
const showSettings = ref(false);
const showHof = ref(false);
</script>

<template>
  <section data-testid="hub-screen" class="hub">
    <h1 class="title">MONSTER SPELLER</h1>
    <p class="subtitle">👾 กองกำลังพิทักษ์ตัวสะกด — ยิงกระสุนมาตราตัวสะกด เปลี่ยนมอนสเตอร์ให้เป็นมิตร</p>

    <div class="menu">
      <button data-testid="start-button" class="btn btn-primary" @click="game.startRound()">
        🚀 เริ่มเกม
      </button>
      <button data-testid="settings-button" class="btn" @click="showSettings = true">⚙️ ตั้งค่า</button>
      <button data-testid="hall-of-fame-button" class="btn" @click="showHof = true">🏆 หอเกียรติยศ</button>
    </div>

    <SettingsModal v-if="showSettings" @close="showSettings = false" />
    <HallOfFameModal v-if="showHof" @close="showHof = false" />
  </section>
</template>
