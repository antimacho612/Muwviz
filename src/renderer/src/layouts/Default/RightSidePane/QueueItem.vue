<script setup lang="ts">
import { computed } from 'vue';
import { Song } from '@shared/types';
import { useAudioPlayer } from '@renderer/utils/useAudioPlayer';

import { TrashIcon } from '@heroicons/vue/24/outline';
import Button from '@renderer/components/base/Button/Button.vue';
import BarsAnimation from '@renderer/components/BarsAnimation/BarsAnimation.vue';
import { toHyphenIfEmpty } from '@renderer/utils/utils';

interface Props {
  queueId: string;
  index?: number;
  song?: Song;
}

const props = defineProps<Props>();

const emits = defineEmits<{
  doubleClickRow: [e: MouseEvent];
  clickDeleteButton: [e: MouseEvent];
  contextmenu: [e: MouseEvent];
}>();

const { isPlaying, currentSongIndex } = useAudioPlayer();
const current = computed(() => props.index === currentSongIndex.value);

const onDoubleClickRow = (e: MouseEvent) => emits('doubleClickRow', e);
const onClickDeleteButton = (e: MouseEvent) => emits('clickDeleteButton', e);
const contextMenu = (e: MouseEvent) => emits('contextmenu', e);
</script>

<template>
  <div
    class="queue-item"
    :class="{ current }"
    @dblclick="onDoubleClickRow"
    @contextmenu="contextMenu"
  >
    <div class="index">{{ index === undefined ? '-' : index + 1 }}</div>
    <div class="song-info">
      <span class="title">{{ song?.title }}</span>
      <span class="artist-and-album">
        {{ toHyphenIfEmpty(song?.artist) }}／{{ toHyphenIfEmpty(song?.album) }}
      </span>
    </div>
    <BarsAnimation
      v-if="current"
      :pause="!isPlaying"
      width="1rem"
      height="1.25rem"
      color="var(--primary-light-color)"
      class="playing-animation"
    />
    <Button
      v-else
      :icon="TrashIcon"
      size="xs"
      text
      class="delele-button"
      @click.stop="onClickDeleteButton"
      @dblclick.stop
    />
  </div>
</template>

<style lang="scss" scoped>
.queue-item {
  width: 100%;
  height: 2.5rem;
  padding: 0.25rem 0.25rem;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  column-gap: 0.25rem;

  border: 1px solid transparent;
  border-radius: $borderRadiusMd;
  cursor: default;

  font-size: map-get($fontSizes, sm);
  line-height: 1.2;

  &.current {
    box-shadow: $innerShadow;

    .index,
    .title {
      color: var(--primary-color);
    }

    .artist-and-album {
      color: var(--primary-light-color);
    }
  }
}
.hover .queue-item {
  box-shadow: $innerShadow;
}

.index {
  position: relative;
  flex-shrink: 0;
  width: 1.25rem;
  text-align: center;
  color: var(--secondary-text-color);
  font-size: map-get($fontSizes, xs);
  font-weight: 500;
}

.song-info {
  flex: auto 1;
  display: flex;
  flex-direction: column;
  justify-content: center;

  white-space: nowrap;
  overflow: hidden;
}

.title {
  text-overflow: ellipsis;
  overflow: hidden;
}

.artist-and-album {
  color: var(--secondary-text-color);
  font-size: map-get($fontSizes, xs);
  text-overflow: ellipsis;
  overflow: hidden;
}

.playing-animation {
  flex: 0 0 auto;
  margin-right: 0.5rem;
}

.delele-button {
  --ripple-color: rgba(255, 0, 0, 0.3);
  background: var(--background-color) !important;
  position: absolute;
  top: 50%;
  right: 0.25rem;
  transform: translateY(-50%);
  visibility: hidden;
  opacity: 0;

  &:hover {
    color: red !important;
  }

  &:active {
    box-shadow: none !important;
  }
}

.hover {
  .delele-button {
    visibility: visible;
    opacity: 1;
  }
}
</style>
