<script setup lang="ts">
import { GroupedItem } from './groupedItem';

import Artwork from '@renderer/components/Artwork/Artwork.vue';
import ArtistSong from './ArtistSong.vue';

defineProps<{ groupedItem: GroupedItem }>();
</script>

<template>
  <div class="grouped-songs">
    <Artwork
      :src="groupedItem.artworkPath"
      height="4rem"
      width="4rem"
      class="artwork"
      show-play-icon
    />
    <div class="album">
      <RouterLink :to="`/albums/${groupedItem.albumId}`">
        {{ groupedItem.album }}
      </RouterLink>
    </div>
    <div class="songs">
      <ArtistSong
        v-for="song in groupedItem.songs"
        :key="song.id"
        :song="song"
        @click-row="() => {}"
        @double-click-row="() => {}"
        @click-ellipsis-button="() => {}"
        @contextmenu="() => {}"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.grouped-songs {
  display: grid;
  padding: 0.5rem;
  grid-template:
    'artwork album songs' 100%
    / 4rem 13rem 1fr;
  gap: 0.5rem;
}

.artwork {
  grid-area: artwork;
}

.album {
  grid-area: album;
  @include singleLineClamp;
}

.songs {
  grid-area: songs;
  display: flex;
  flex-direction: column;
  row-gap: 1px;
}
</style>
