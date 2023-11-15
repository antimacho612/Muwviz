<script setup lang="ts">
import { computed } from 'vue';
import { PlayIcon, PauseIcon, BackwardIcon, ForwardIcon } from '@heroicons/vue/24/solid';
import { useAudioPlayer } from '@renderer/utils/useAudioPlayer';
import Button from '@renderer/components/base/Button/Button.vue';

const { isPlaying, previousSong, togglePlay, nextSong } = useAudioPlayer();

const playPauseButtonIcon = computed(() => {
  if (isPlaying.value) {
    return PauseIcon;
  } else {
    return PlayIcon;
  }
});

const onClickPlayPauseButton = async () => {
  await togglePlay();
};
</script>

<template>
  <div class="player-controls">
    <Button :icon="BackwardIcon" text @click="previousSong" />
    <Button :icon="playPauseButtonIcon" size="lg" @click="onClickPlayPauseButton" />
    <Button :icon="ForwardIcon" text @click="nextSong" />
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
