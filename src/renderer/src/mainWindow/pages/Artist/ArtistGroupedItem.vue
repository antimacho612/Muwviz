<script setup lang="ts">
import { computed } from 'vue';
import { GroupedItem } from './grouping';
import { formatAlbumTitle } from '@renderer/commonUtils';

import Artwork from '@mainWindow/components/Artwork/Artwork.vue';
import ArtistAlbumSong from './ArtistAlbumSong.vue';

interface Props {
  groupedItem: GroupedItem;
  selectedSongs: Set<string>;
}
const props = defineProps<Props>();

type Emits = {
  clickPlay: [e: MouseEvent];
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
      class="album-artwork"
      show-play-icon
      @click="emits('clickPlay', $event)"
    />

    <div class="album-name">
      <RouterLink :to="`/albums/${groupedItem.albumId}`">
        {{ formatAlbumTitle(groupedItem.album) }}
      </RouterLink>
    </div>

    <div class="album-songs" style="grid-area: songs; row-gap: 1px" @click.stop>
      <ArtistAlbumSong
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

<style lang="scss" scoped>
.grouped-songs {
  display: grid;
  padding: 0.5rem;
  grid-template:
    'artwork albumName songs' 100%
    / 4rem 13rem 1fr;
  gap: 0.5rem;
}

.album-artwork {
  grid-area: artwork;
}

.album-name {
  grid-area: albumName;
  @include singleLineClamp;
}

.album-songs {
  display: flex;
  flex-direction: column;
}
</style>
