<script setup lang="ts">
import { computed } from 'vue';
import { formatArtistName } from '@renderer/commonUtils';
import { Artist } from '@shared/types';

import PlayIcon from '@renderer/assets/icons/play.svg?component';
import ShuffleIcon from '@renderer/assets/icons/shuffle.svg?component';
import RecycleGridScrollerItem from '@mainWindow/components/RecycleGridScroller/RecycleGridScrollerItem.vue';
import ArtistImage from '@mainWindow/components/ArtistImage/ArtistImage.vue';

const props = defineProps<{ artist: Artist }>();

type Emits = {
  clickItem: [e: MouseEvent];
  clickPlayButton: [e: MouseEvent];
  clickShufflePlayButton: [e: MouseEvent];
  contextmenu: [e: MouseEvent];
};
const emits = defineEmits<Emits>();

const formattedArtistName = computed(() => formatArtistName(props.artist.name));
</script>

<template>
  <RecycleGridScrollerItem
    class="artist-grid-item"
    @click="emits('clickItem', $event)"
    @contextmenu="emits('contextmenu', $event)"
  >
    <ArtistImage class="artist-image" />

    <div class="name" :title="formattedArtistName">{{ formattedArtistName }}</div>

    <div class="song-count">{{ artist.songCount }}</div>

    <div v-ripple class="icon-button play-button" @click.stop="emits('clickPlayButton', $event)" @pointerdown.stop>
      <PlayIcon class="play-icon" />
    </div>

    <div
      v-ripple
      class="icon-button shuffle-play-button"
      @click.stop="emits('clickShufflePlayButton', $event)"
      @pointerdown.stop
    >
      <ShuffleIcon class="play-icon" />
    </div>
  </RecycleGridScrollerItem>
</template>

<style lang="scss" scoped>
.artist-grid-item {
  width: 10rem;
  padding: 0.5rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.artist-image {
  width: 8rem;
  height: 8rem;
  padding: 0.5rem;
}

.name {
  font-size: map-get($fontSizes, md);
  @include singleLineClamp;
}

.song-count {
  position: absolute;
  top: 0.75rem;
  left: 1.25rem;
  width: 1.5rem;
  height: 1.5rem;
  text-align: center;
  line-height: 1.5rem;
  font-size: map-get($fontSizes, xs);
  color: #fff;
  background: rgba(var(--primary-color-rgb), 0.6);
  border-radius: $borderRadiusFull;
  z-index: 2;
}

.icon-button {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: rgba(var(--primary-color-rgb), 0.4);
  border-radius: $borderRadiusFull;

  visibility: hidden;
  opacity: 0;
  transition:
    background-color $transitionDuration,
    opacity $transitionDuration;

  &:hover {
    background: rgba(var(--primary-color-rgb), 1);
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: #fff;
  }
}

.play-button {
  top: 6rem;
  right: 3.75rem;
  z-index: 3;
}

.shuffle-play-button {
  top: 6rem;
  right: 1.25rem;
  z-index: 4;
}

.vue-recycle-scroller__item-view.hover .icon-button {
  visibility: visible;
  opacity: 1;
}
</style>
