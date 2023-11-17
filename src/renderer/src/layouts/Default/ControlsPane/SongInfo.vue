<script setup lang="ts">
import { useAudioPlayer } from '@renderer/utils/useAudioPlayer';
import { toHyphenIfEmpty } from '@renderer/utils/utils';

import Artwork from '@renderer/components/Artwork/Artwork.vue';

const { currentSong } = useAudioPlayer();
</script>

<template>
  <div class="song-info">
    <Artwork :src="currentSong?.filePath" width="48px" height="48px" />
    <div class="info">
      <div class="title">{{ toHyphenIfEmpty(currentSong?.title) }}</div>
      <div class="artist-and-album">
        <a class="artist">{{ toHyphenIfEmpty(currentSong?.artist) }}</a>
        <span>／</span>
        <a class="album">{{ toHyphenIfEmpty(currentSong?.album) }}</a>
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

.artwork {
  flex: 0 0 3.5rem;
  width: 3rem;
  height: 3rem;
  border-radius: $borderRadiusSm;
}

.info {
  flex: auto 1;
  display: flex;
  line-height: 1.2;
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

.artist {
  flex: 0 1 auto;
  @include singleLineClamp;
}

.album {
  flex: 0 1 auto;
  @include singleLineClamp;
}
</style>
