<script setup lang="ts">
import { computed } from 'vue';
import { useAudioPlayer } from '@renderer/utils/useAudioPlayer';
import { Song } from '@shared/types';

import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid';
import Button from '@renderer/components/base/Button/Button.vue';
import BarsAnimation from '@renderer/components/BarsAnimation/BarsAnimation.vue';
import { formatDiskAndTrackNo, formatTime } from '@renderer/utils/utils';

interface Props {
  song: Song;
  selected?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
});

const emits = defineEmits<{
  clickRow: [e: MouseEvent];
  doubleClickRow: [e: MouseEvent];
  contextmenu: [e: MouseEvent];
  clickEllipsisButton: [e: MouseEvent];
}>();

const { isPlaying, currentSong } = useAudioPlayer();
const current = computed(() => props.song.id === currentSong.value?.id);
</script>

<template>
  <div
    v-ripple
    class="artist-song"
    :class="{ current, selected }"
    @click="emits('clickRow', $event)"
    @dblclick="emits('doubleClickRow', $event)"
    @contextmenu="emits('contextmenu', $event)"
  >
    <div class="disk-and-track-no">{{ formatDiskAndTrackNo(song.diskNo, song.trackNo) }}</div>
    <div class="title-area">
      <div class="title">{{ song.title }}</div>
      <BarsAnimation
        v-if="current"
        :pause="!isPlaying"
        width="1rem"
        height="1.25rem"
        color="var(--primary-color)"
        class="playing-animation"
      />
    </div>
    <div class="duration">{{ formatTime(song.duration) }}</div>
    <Button
      :icon="EllipsisVerticalIcon"
      size="xs"
      text
      @click.stop="emits('clickEllipsisButton', $event)"
      @pointerdown.stop
      @dblclick.stop
    />
  </div>
</template>

<style lang="scss" scoped>
.artist-song {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  column-gap: 0.5rem;
  padding: 0 0.5rem;
  font-size: map-get($fontSizes, md);
  cursor: default;

  border: 1px solid transparent;
  border-radius: $borderRadiusMd;
  transition: box-shadow $transitionDuration;

  &:hover {
    box-shadow: $innerShadow;
  }

  &.selected {
    border: 1px solid var(--primary-color);
  }
}

.artist-song.current {
  .disk-and-track-no,
  .title,
  .duration {
    color: var(--primary-color);
  }
}

.disk-and-track-no {
  flex: 0 0 auto;
  width: 2.5rem;
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
