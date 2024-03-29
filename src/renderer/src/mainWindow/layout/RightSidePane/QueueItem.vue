<script setup lang="ts">
import { computed } from 'vue';
import { useAudioPlayer } from '@mainWindow/composables/useAudioPlayer';
import { formatAlbumTitle, formatArtistName } from '@renderer/commonUtils';
import { Song } from '@shared/types';

import DeleteIcon from '@renderer/assets/icons/delete-outlined.svg?component';
import Button from '@renderer/commonComponents/Button/Button.vue';
import BarsAnimation from '@mainWindow/components/BarsAnimation/BarsAnimation.vue';

interface Props {
  index?: number;
  queueId: string;
  song?: Song;
}
const props = defineProps<Props>();

type Emits = {
  doubleClickRow: [e: MouseEvent];
  clickDeleteButton: [e: MouseEvent];
  contextmenu: [e: MouseEvent];
};
const emits = defineEmits<Emits>();

const { playerState, currentSongIndex } = useAudioPlayer();
const current = computed(() => props.index === currentSongIndex.value);
</script>

<template>
  <div
    v-ripple
    class="queue-item"
    :class="{ current }"
    @dblclick="emits('doubleClickRow', $event)"
    @contextmenu="emits('contextmenu', $event)"
  >
    <div class="index">{{ index !== undefined ? index + 1 : '-' }}</div>
    <div class="song-info">
      <span class="title">{{ song?.title }}</span>
      <span class="artist-and-album"> {{ formatArtistName(song?.artist) }}／{{ formatAlbumTitle(song?.album) }} </span>
    </div>
    <BarsAnimation
      v-if="current"
      :pause="playerState !== 'Playing'"
      width="1rem"
      height="1.25rem"
      color="var(--primary-color)"
      class="playing-animation"
    />
    <Button
      v-else
      :icon="DeleteIcon"
      size="xs"
      text
      class="delete-button"
      @click.stop="emits('clickDeleteButton', $event)"
      @pointerdown.stop
      @dblclick.stop
    />
  </div>
</template>

<style lang="scss" scoped>
.queue-item {
  width: 100%;
  height: 2.75rem;
  padding: 0 0.25rem;
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
      color: var(--primary-color--lighter);
    }
  }
}
.vue-recycle-scroller__item-view.hover .queue-item {
  box-shadow: $innerShadow;
}

.index {
  position: relative;
  flex-shrink: 0;
  width: 1.5rem;
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
  @include singleLineClamp;
}

.artist-and-album {
  color: var(--secondary-text-color);
  font-size: map-get($fontSizes, xs);
  @include singleLineClamp;
}

.playing-animation {
  flex: 0 0 auto;
  margin-right: 0.5rem;
}

.delete-button {
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
  .delete-button {
    visibility: visible;
    opacity: 1;
  }
}
</style>
