<script setup lang="ts">
import { useAudioPlayer } from '@mainWindow/composables/useAudioPlayer';
import { formatAlbumTitle, formatArtistName, toHyphenIfEmpty } from '@renderer/commonUtils';

import Artwork from '@mainWindow/components/Artwork/Artwork.vue';

const { currentSong } = useAudioPlayer();
</script>

<template>
  <div class="song-info">
    <Artwork :src="currentSong?.artworkPath" width="56px" height="56px" class="flex-shrink-0" />
    <div class="info">
      <div class="title">{{ toHyphenIfEmpty(currentSong?.title) }}</div>
      <div class="artist-and-album">
        <div class="artist">
          <RouterLink v-if="currentSong" :to="`/artists/${currentSong.artistId}`">
            {{ formatArtistName(currentSong.artist) }}
          </RouterLink>
          <span v-else>-</span>
        </div>
        ／
        <div class="album">
          <RouterLink v-if="currentSong" :to="`/albums/${currentSong.albumId}`">
            {{ formatAlbumTitle(currentSong.album) }}
          </RouterLink>
          <span v-else>-</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.song-info {
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
  gap: 0.5rem;
}

.info {
  flex: auto 1;
  display: flex;
  line-height: 1.3;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  white-space: nowrap;
}

.title {
  margin-bottom: 0.5rem;
  font-size: map-get($fontSizes, xl);
  color: var(--primary-text-color);
  @include singleLineClamp;
}

.artist-and-album {
  display: flex;
  flex-wrap: nowrap;
  justify-content: start;
  font-size: map-get($fontSizes, sm);
  color: var(--secondary-text-color);
}

.artist,
.album {
  flex: 0 1 auto;
  @include singleLineClamp;
}
</style>
