<script setup lang="ts">
import { computed } from 'vue';
import { PlayIcon, PauseIcon, BackwardIcon, ForwardIcon } from '@heroicons/vue/24/solid';
import { useAudioPlayer } from '@renderer/utils/useAudioPlayer';
import Button from '@renderer/components/base/Button/Button.vue';

const audioPlayer = useAudioPlayer();

const playPauseButtonIcon = computed(() => {
  if (audioPlayer.isPlaying.value) {
    return PauseIcon;
  } else {
    return PlayIcon;
  }
});

const onClickPlayPauseButton = async () => {
  await audioPlayer.togglePlay();
};
</script>

<template>
  <div class="player-controls">
    <Button :icon="BackwardIcon" text />
    <Button :icon="playPauseButtonIcon" size="lg" @click="onClickPlayPauseButton" />
    <Button :icon="ForwardIcon" text />
  </div>
</template>

<style lang="scss" scoped>
.player-controls {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  justify-content: center;
}
</style>
