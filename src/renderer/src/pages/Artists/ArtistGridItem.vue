<script setup lang="ts">
import { Artist } from '@shared/types';

import { PlayIcon } from '@heroicons/vue/24/solid';
import RecycleGridScrollerItem from '@renderer/components/RecycleGridScroller/RecycleGridScrollerItem.vue';
import ArtistImage from '@renderer/components/ArtistImage/ArtistImage.vue';

defineProps<{ artist: Artist }>();
const emits = defineEmits<{
  clickItem: [e: MouseEvent];
  clickPlayButton: [e: MouseEvent];
  contextmenu: [e: MouseEvent];
}>();
</script>

<template>
  <RecycleGridScrollerItem
    class="artist-grid-item"
    @click="emits('clickItem', $event)"
    @contextmenu="emits('contextmenu', $event)"
  >
    <ArtistImage class=".artist-image" />

    <div class="name" :title="artist.name">{{ artist.name }}</div>
    <div class="song-count">{{ artist.songCount }}</div>
    <div
      v-ripple
      class="play-button"
      @click.stop="emits('clickPlayButton', $event)"
      @pointerdown.stop
    >
      <PlayIcon class="icon-play"></PlayIcon>
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

.play-button {
  position: absolute;
  top: 6rem;
  right: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: rgba(var(--primary-color-rgb), 0.4);
  border-radius: $borderRadiusFull;
  z-index: 3;

  visibility: hidden;
  opacity: 0;
  transition:
    background-color $transitionDuration,
    opacity $transitionDuration;

  &:hover {
    background: rgba(var(--primary-color-rgb), 1);
  }

  .icon-play {
    width: 1.5rem;
    height: 1.5rem;
    color: #fff;
  }
}

.vue-recycle-scroller__item-view.hover .play-button {
  visibility: visible;
  opacity: 1;
}
</style>
