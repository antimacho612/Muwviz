<script setup lang="ts">
import { computed } from 'vue';
import { formatAlbumTitle } from '@renderer/commonUtils';
import { Album } from '@shared/types';

import RecycleScrollerItem from '@mainWindow/components/RecycleScrollerItem/RecycleScrollerItem.vue';
import Artwork from '@mainWindow/components/Artwork/Artwork.vue';

const props = defineProps<{ album: Album }>();

type Emits = {
  clickRow: [e: MouseEvent];
  clickArtwork: [e: MouseEvent];
};
const emits = defineEmits<Emits>();

const artistName = computed(() => {
  if (!props.album.artists) return '不明なアーティスト';
  if (props.album.artists.length === 1) return props.album.artists[0].name || '不明なアーティスト';
  return (props.album.artists[0].name || '不明なアーティスト') + ' 他';
});

const title = computed(() => formatAlbumTitle(props.album.title));
</script>

<template>
  <RecycleScrollerItem height="3.5rem" class="album-list-item" @click="emits('clickRow', $event)">
    <Artwork
      :src="album.artworkPath"
      width="44px"
      height="44px"
      show-play-icon
      class="artwork"
      @click.stop="emits('clickArtwork', $event)"
      @pointerdown.stop
    />
    <div class="title" :title="title">{{ title }}</div>
    <div class="artist">{{ artistName }}</div>
    <div class="song-count">{{ album.songCount }}</div>
  </RecycleScrollerItem>
</template>

<style lang="scss" scoped>
.album-list-item {
  cursor: pointer;
}

.artwork {
  flex-shrink: 0;
}

.title {
  flex-grow: 1;
  font-size: map-get($fontSizes, md);
  @include singleLineClamp;
}

.artist {
  font-size: map-get($fontSizes, sm);
  color: var(--secondary-text-color);
  @include singleLineClamp;
}

.song-count {
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  text-align: center;
  line-height: 1.5rem;
  font-size: map-get($fontSizes, xs);
  color: #fff;
  background: rgba(var(--primary-color-rgb), 0.6);
  border-radius: $borderRadiusFull;
}
</style>
