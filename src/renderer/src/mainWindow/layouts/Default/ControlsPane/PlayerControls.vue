<script setup lang="ts">
import { computed } from 'vue';
import { useAudioPlayer } from '@renderer/mainWindow/composables/useAudioPlayer';

import { PlayIcon, PauseIcon, BackwardIcon, ForwardIcon } from '@heroicons/vue/24/solid';
import Button from '@renderer/commonComponents/Button/Button.vue';

const { isPlaying, previousSong, togglePlay, nextSong } = useAudioPlayer();

const playPauseButtonIcon = computed(() => (isPlaying.value ? PauseIcon : PlayIcon));
</script>

<template>
  <div class="player-controls">
    <Button :icon="BackwardIcon" text @click="previousSong" />
    <Button :icon="playPauseButtonIcon" size="lg" @click="togglePlay()" />
    <Button :icon="ForwardIcon" text @click="nextSong" />
  </div>
</template>

<style scoped>
.player-controls {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  justify-content: center;
}
</style>
