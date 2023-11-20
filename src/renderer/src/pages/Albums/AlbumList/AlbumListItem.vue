<script setup lang="ts">
import { computed } from 'vue';
import { Album } from '@shared/types';

import { PlayIcon } from '@heroicons/vue/24/solid';
import Artwork from '@renderer/components/Artwork/Artwork.vue';

const props = defineProps<{ album: Album }>();

const artistName = computed(() => {
  if (!props.album.artists) return '-';
  if (props.album.artists.length === 1) return props.album.artists[0].name;
  return props.album.artists[0].name + ' 他';
});

const emits = defineEmits<{
  clickItem: [e: MouseEvent];
  clickPlayButton: [e: MouseEvent];
}>();
const onClickItem = (e: MouseEvent) => emits('clickItem', e);
const onClickPlayButton = (e: MouseEvent) => emits('clickPlayButton', e);
</script>

<template>
  <div class="album-list-item-container">
    <div v-ripple class="albumn-list-item" @click="onClickItem">
      <Artwork
        :src="album.artworkPath"
        width="128px"
        height="128px"
        :show-play-icon="false"
        class="artwork"
      />
      <div>
        <div class="name" :title="album.name">{{ album.name }}</div>
        <div class="artist">{{ artistName }}</div>
      </div>
      <div class="song-count">{{ album.songCount }}</div>
      <div v-ripple class="play-button" @click.stop="onClickPlayButton" @pointerdown.stop>
        <PlayIcon class="icon-play"></PlayIcon>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.album-list-item-container {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  overflow: hidden;
}

.albumn-list-item {
  position: relative;
  height: 100%;
  width: 10rem;
  padding: 0.5rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: $borderRadiusLg;
  cursor: pointer;
  transition: box-shadow $transitionDuration;
}

.vue-recycle-scroller__item-view.hover .albumn-list-item {
  box-shadow: $innerShadow;
}

.artwork {
  z-index: 1;
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
  width: 2.25rem;
  height: 2.25rem;
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
    width: 1.75rem;
    height: 1.75rem;
    color: #fff;
  }
}

.vue-recycle-scroller__item-view.hover .play-button {
  visibility: visible;
  opacity: 1;
}

.name {
  font-size: map-get($fontSizes, md);
  @include singleLineClamp;
}

.artist {
  font-size: map-get($fontSizes, sm);
  color: var(--secondary-text-color);
  @include singleLineClamp;
}
</style>
