<script setup lang="ts">
import { GroupedItem } from './grouping';

import Artwork from '@renderer/components/Artwork/Artwork.vue';
import ArtistSong from './ArtistSong.vue';
import { computed } from 'vue';

interface Props {
  groupedItem: GroupedItem;
  selectedSongs: Set<string>;
}
const props = defineProps<Props>();

type Emits = {
  clickSongRow: [index: number, songId: string];
  doubleClickSongRow: [index: number, songId: string];
  contextmenu: [e: MouseEvent, index: number, songId: string];
  clickOutsideOfList: [e: MouseEvent];
};
const emits = defineEmits<Emits>();

const computedSelectedSongs = computed(() => props.selectedSongs);
</script>

<template>
  <div class="grouped-songs" @click="emits('clickOutsideOfList', $event)">
    <Artwork
      :src="groupedItem.artworkPath"
      height="4rem"
      width="4rem"
      style="grid-area: artwork"
      show-play-icon
    />
    <div class="single-line-clamp" style="grid-area: album">
      <RouterLink :to="`/albums/${groupedItem.albumId}`">
        {{ groupedItem.album }}
      </RouterLink>
    </div>
    <div class="flex flex-column" style="grid-area: songs; row-gap: 1px" @click.stop>
      <ArtistSong
        v-for="(song, index) in groupedItem.songs"
        :key="song.id"
        :song="song"
        :selected="computedSelectedSongs.has(song.id)"
        @click-row="emits('clickSongRow', index, song.id)"
        @double-click-row="emits('doubleClickSongRow', index, song.id)"
        @click-ellipsis-button="emits('contextmenu', $event, index, song.id)"
        @contextmenu="emits('contextmenu', $event, index, song.id)"
      />
    </div>
  </div>
</template>

<style scoped>
.grouped-songs {
  display: grid;
  padding: 0.5rem;
  grid-template:
    'artwork album songs' 100%
    / 4rem 13rem 1fr;
  gap: 0.5rem;
}
</style>
