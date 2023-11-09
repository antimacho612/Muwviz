<script setup lang="ts">
import { getContextMenu } from '@renderer/utils/contextMenu';
import { formatTime } from '@renderer/utils/utils';
import { Song } from '@shared/types';

import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid';
import Button from '@renderer/components/base/Button/Button.vue';
import Artwork from './Artwork.vue';
import PlayingAnimation from './PlayingAnimation.vue';

interface Props {
  song: Song;
  selected?: boolean;
  nowPlaying?: boolean;
}

withDefaults(defineProps<Props>(), {
  selected: false,
  nowPlaying: false,
});

const emits = defineEmits<{
  rowClick: [e: MouseEvent];
  rowDoubleClick: [e: MouseEvent];
  clickArtwork: [e: MouseEvent];
}>();

const onRowClick = (e: MouseEvent) => emits('rowClick', e);
const onRowDoubleClick = (e: MouseEvent) => emits('rowDoubleClick', e);
const onArtworkClick = (e: MouseEvent) => emits('clickArtwork', e);

const showContextMenu = (e: MouseEvent) => {
  e.preventDefault();
  getContextMenu(e, 'SONG');
};
</script>

<template>
  <div
    class="list-item"
    :class="{ selected: selected }"
    @click="onRowClick"
    @dblclick="onRowDoubleClick"
    @contextmenu="showContextMenu"
  >
    <Artwork
      :src="song.artworkPath"
      width="40px"
      height="40px"
      class="img-area"
      @click="onArtworkClick"
    />
    <div class="main-area">
      <div class="title-and-artist">
        <span class="title">{{ song.title }}</span>
        <span class="artist">{{ song.artist || '-' }}</span>
      </div>

      <PlayingAnimation
        v-if="nowPlaying"
        width="1rem"
        height="1rem"
        color="var(--primary-light-color)"
        class="playing-animation"
      />
    </div>
    <div class="trailing-area">
      <span class="album">{{ song.album || '-' }}</span>
      <span>{{ formatTime(song.duration) }}</span>
    </div>
    <div style="grid-area: menu">
      <Button :icon="EllipsisVerticalIcon" size="sm" text @click.stop="showContextMenu"></Button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.list-item {
  width: 100%;
  height: 3rem;
  padding: 0.25rem 1rem;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  column-gap: 0.5rem;

  border: 1px solid transparent;
  border-radius: $borderRadiusMd;
  cursor: default;

  &.selected {
    box-shadow: $innerShadow;
    border: 1px solid var(--primary-lightest-color);
  }

  &:hover {
    box-shadow: $innerShadow;
  }
}

.img-area {
  flex: 0 0 auto;
  width: auto;
}

.main-area {
  flex: 1 1 auto;
  width: 40%;
  height: 100%;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
}

.playing-animation {
  flex: 0 0 auto;
  margin-left: 0.5rem;
}

.title-and-artist {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 90%;
  line-height: 1;
  overflow: hidden;

  .title {
    font-size: 1rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .artist {
    font-size: 0.875rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}

.trailing-area {
  flex: 0 0 auto;
  width: 30%;
  display: flex;
  column-gap: 0.5rem;
  justify-content: space-between;

  .album {
    font-size: 1rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
