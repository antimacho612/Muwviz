<script setup lang="ts">
import { formatArtistName } from '@renderer/commonUtils';
import { Artist } from '@shared/types';

import RecycleScrollerItem from '@mainWindow/components/RecycleScrollerItem/RecycleScrollerItem.vue';
import ArtistImage from '@mainWindow/components/ArtistImage/ArtistImage.vue';

defineProps<{ artist: Artist }>();

type Emits = {
  clickRow: [e: MouseEvent];
  clickArtistImage: [e: MouseEvent];
};
const emits = defineEmits<Emits>();
</script>

<template>
  <RecycleScrollerItem height="3.5rem" class="artist-list-item" @click="emits('clickRow', $event)">
    <ArtistImage
      show-play-icon
      class="artist-image"
      @click.stop="emits('clickArtistImage', $event)"
      @pointerdown.stop
    />
    <div class="name">{{ formatArtistName(artist.name) }}</div>
    <div class="song-count">{{ artist.songCount }}</div>
  </RecycleScrollerItem>
</template>

<style lang="scss" scoped>
.artist-list-item {
  cursor: pointer;
}

.artist-image {
  flex-shrink: 0;
  width: 2.75rem;
  height: 2.75rem;
}

.name {
  flex-grow: 1;
  font-size: map-get($fontSizes, md);
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
