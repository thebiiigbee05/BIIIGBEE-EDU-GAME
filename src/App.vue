<script setup lang="ts">
import { useGameStore } from './stores/game';
import HubScreen from './screens/HubScreen.vue';
import GameScreen from './screens/GameScreen.vue';

const game = useGameStore();
</script>

<template>
  <main class="app">
    <HubScreen v-if="game.status === 'hub'" />
    <GameScreen v-else />
  </main>
</template>
