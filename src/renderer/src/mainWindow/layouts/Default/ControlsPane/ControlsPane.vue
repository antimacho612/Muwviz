<script setup lang="ts">
import { computed } from 'vue';
import { useAudioPlayer } from '@renderer/mainWindow/composables/useAudioPlayer';

import { PlayIcon, PauseIcon, BackwardIcon, ForwardIcon } from '@heroicons/vue/24/solid';
import { IconRepeatOff, IconRepeat, IconRepeatOnce, IconArrowsShuffle } from '@tabler/icons-vue';
import Button from '@renderer/commonComponents/Button/Button.vue';
import Timeline from './Timeline.vue';
import SongInfo from './SongInfo.vue';
import VolumeControl from './VolumeControl.vue';

const {
  isPlaying,
  repeat,
  isShuffleOn,
  previousSong,
  togglePlay,
  nextSong,
  setRepeat,
  toggleShuffle,
} = useAudioPlayer();
const playPauseButtonAttrs = computed(() => ({
  icon: isPlaying.value ? PauseIcon : PlayIcon,
  title: isPlaying.value ? '一時停止' : '再生',
}));

const toggleRepeatButtonAttrs = computed(() => ({
  icon:
    repeat.value === 'OFF' ? IconRepeatOff : repeat.value === 'ALL' ? IconRepeat : IconRepeatOnce,
  title:
    repeat.value === 'OFF'
      ? 'キューのループON'
      : repeat.value === 'ALL'
      ? '1曲ループON'
      : 'ループOFF',
}));

const toggleShuffleButtonTitle = isShuffleOn.value ? 'シャッフルOFF' : 'シャッフルON';
</script>

<template>
  <div class="controls-pane">
    <div class="timeline-container">
      <Timeline />
    </div>
    <div class="controls-pane-bottom">
      <div class="bottom-left">
        <SongInfo />
      </div>
      <div class="bottom-center">
        <div class="flex align-items-center column-gap-5">
          <Button text :icon="BackwardIcon" @click="previousSong" />
          <Button
            size="lg"
            :icon="playPauseButtonAttrs.icon"
            :title="playPauseButtonAttrs.title"
            @click="togglePlay()"
          />
          <Button :icon="ForwardIcon" text @click="nextSong" />
        </div>
        <div class="flex align-items-center column-gap-2">
          <Button
            text
            :icon="toggleRepeatButtonAttrs.icon"
            :title="toggleRepeatButtonAttrs.title"
            :class="{ 'repeat-on': repeat !== 'OFF' }"
            @click="setRepeat(repeat === 'OFF' ? 'ALL' : repeat === 'ALL' ? 'ONCE' : 'OFF')"
          />
          <Button
            text
            :icon="IconArrowsShuffle"
            :title="toggleShuffleButtonTitle"
            :class="{ 'shuffle-on': isShuffleOn }"
            @click="toggleShuffle"
          ></Button>
        </div>
      </div>
      <div class="bottom-right">
        <VolumeControl class="flex-grow-1 ml-auto" style="max-width: 12.5rem" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.controls-pane {
  height: 100%;
  padding: 0.75rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: $borderRadiusXl;
  box-shadow: $shadow;
}

.controls-pane-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bottom-left,
.bottom-center,
.bottom-right {
  flex: 0 1 calc(100% / 3);
}

.bottom-left {
  overflow: hidden;
}

.bottom-center {
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 1.5rem;
}

.repeat-on,
.repeat-on:hover,
.shuffle-on,
.shuffle-on:hover {
  color: var(--primary-color) !important;
  box-shadow: $innerShadow !important;
}

.bottom-right {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
