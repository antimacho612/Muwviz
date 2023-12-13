<script setup lang="ts">
import { computed } from 'vue';
import { useAudioPlayer } from '@mainWindow/composables/useAudioPlayer';
import { formatDiskAndTrackNo, formatTime } from '@renderer/commonUtils';
import { Song } from '@shared/types';

import EllipsisIcon from '@renderer/assets/icons/ellipsis.svg?component';
import Button from '@renderer/commonComponents/Button/Button.vue';
import BarsAnimation from '@mainWindow/components/BarsAnimation/BarsAnimation.vue';

interface Props {
  song: Song;
  selected?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  selected: false,
});

type Emits = {
  clickRow: [e: MouseEvent];
  doubleClickRow: [e: MouseEvent];
  contextmenu: [e: MouseEvent];
  clickEllipsisButton: [e: MouseEvent];
};
const emits = defineEmits<Emits>();

const { playerState, currentSong } = useAudioPlayer();
const current = computed(() => props.song.id === currentSong.value?.id);
</script>

<template>
  <div
    v-ripple
    class="artist-album-song"
    :class="{ current, selected }"
    @click="emits('clickRow', $event)"
    @dblclick="emits('doubleClickRow', $event)"
    @contextmenu="emits('contextmenu', $event)"
  >
    <div class="disk-and-track-no" style="width: 2.5rem">
      {{ formatDiskAndTrackNo(song.diskNo, song.trackNo) }}
    </div>

    <div class="title-area">
      <div class="title">{{ song.title }}</div>
      <BarsAnimation
        v-if="current"
        :pause="playerState !== 'Playing'"
        width="1rem"
        height="1.25rem"
        color="var(--primary-color)"
        class="playing-animation"
      />
    </div>

    <div class="duration">{{ formatTime(song.duration) }}</div>

    <Button
      :icon="EllipsisIcon"
      size="xs"
      text
      @click.stop="emits('clickEllipsisButton', $event)"
      @pointerdown.stop
      @dblclick.stop
    />
  </div>
</template>

<style lang="scss" scoped>
.artist-album-song {
  width: 100%;
  padding: 0 0.5rem;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  column-gap: 0.5rem;
  border: 1px solid transparent;
  border-radius: $borderRadiusMd;
  transition: box-shadow $transitionDuration;
  cursor: default;

  &:hover {
    box-shadow: $innerShadow;
  }

  &.selected {
    border: 1px solid var(--primary-color);
  }
}

.artist-album-song.current {
  .disk-and-track-no,
  .title,
  .duration {
    color: var(--primary-color);
  }
}

.disk-and-track-no {
  flex: 0 0 auto;
}

.title-area {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .title {
    flex: 1 1 auto;
    @include singleLineClamp;
  }

  .playing-animation {
    flex: 0 0 auto;
    margin-left: 0.5rem;
  }
}

.duration {
  flex: 0 0 auto;
}
</style>
