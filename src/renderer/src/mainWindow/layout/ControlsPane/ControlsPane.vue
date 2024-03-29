<script setup lang="ts">
import { computed } from 'vue';
import { useAudioPlayer } from '@mainWindow/composables/useAudioPlayer';

import PauseIcon from '@renderer/assets/icons/pause.svg?component';
import BackwardIcon from '@renderer/assets/icons/backward.svg?component';
import ForwardIcon from '@renderer/assets/icons/forward.svg?component';
import PlayIcon from '@renderer/assets/icons/play.svg?component';
import RepeatIcon from '@renderer/assets/icons/repeat.svg?component';
import RepeatOffIcon from '@renderer/assets/icons/repeat-off.svg?component';
import RepeatOnceIcon from '@renderer/assets/icons/repeat-once.svg?component';
import Button from '@renderer/commonComponents/Button/Button.vue';
import LoadingAnimation from '@mainWindow/components/LoadingAnimation/LoadingAnimation.vue';
import Timeline from './Timeline.vue';
import SongInfo from './SongInfo.vue';
import VolumeControl from './VolumeControl.vue';

const { playerState, repeat, previousSong, togglePlay, nextSong, toggleRepeat } = useAudioPlayer();

const playerDisabled = computed(() => playerState.value === 'UnReady' || playerState.value === 'Loading');

const playPauseButtonAttrs = computed(() => ({
  title: playerState.value === 'Playing' ? '一時停止' : '再生',
  disabled: playerDisabled.value,
}));

const toggleRepeatButtonAttrs = computed(() => ({
  icon: repeat.value === 'Off' ? RepeatOffIcon : repeat.value === 'All' ? RepeatIcon : RepeatOnceIcon,
  title: repeat.value === 'Off' ? 'キューのループON' : repeat.value === 'All' ? '1曲ループON' : 'ループOFF',
}));

const onClickPrevButton = async () => await previousSong();
const onClickPlayPauseButton = async () => await togglePlay();
const onClickNextButton = async () => await nextSong(playerState.value === 'Playing');
const onClickRepeatButton = () => toggleRepeat();
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
          <Button text :icon="BackwardIcon" :disabled="playerDisabled" @click="onClickPrevButton" />
          <Button
            size="lg"
            :title="playPauseButtonAttrs.title"
            :disabled="playPauseButtonAttrs.disabled"
            @click="onClickPlayPauseButton"
          >
            <PauseIcon v-if="playerState === 'Playing'" style="height: 2rem" />
            <LoadingAnimation v-else-if="playerState === 'Loading'" size="2rem" color="var(--disabled-text-color)" />
            <PlayIcon v-else style="height: 2rem" />
          </Button>
          <Button :icon="ForwardIcon" text :disabled="playerDisabled" @click="onClickNextButton" />
        </div>
        <div class="flex align-items-center column-gap-2">
          <Button
            text
            :icon="toggleRepeatButtonAttrs.icon"
            :title="toggleRepeatButtonAttrs.title"
            :class="{ 'repeat-on': repeat !== 'Off' }"
            @click="onClickRepeatButton"
          />
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
.repeat-on:hover {
  color: var(--primary-color) !important;
  box-shadow: $innerShadow !important;
}

.bottom-right {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
