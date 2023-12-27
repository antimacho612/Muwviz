<script setup lang="ts">
import { computed } from 'vue';
import { GroupedItem } from './grouping';
import { formatAlbumTitle } from '@renderer/commonUtils';
import { Song } from '@shared/types';

import Artwork from '@mainWindow/components/Artwork/Artwork.vue';
import ArtistAlbumSong from './ArtistAlbumSong.vue';

interface Props {
  groupedItem: GroupedItem;
  selectedSongs: Map<number, string>;
}
const props = defineProps<Props>();

type Emits = {
  clickPlay: [e: MouseEvent];
  clickSongRow: [e: MouseEvent, index: number, song: Song];
  doubleClickSongRow: [e: MouseEvent, index: number, song: Song];
  clickEllipsisButton: [e: MouseEvent, index: number, song: Song];
  contextmenu: [e: MouseEvent, index: number, song: Song];
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
        :selected="computedSelectedSongs.has(groupedItem.baseIndex + index)"
        @click-row="emits('clickSongRow', $event, index, song)"
        @double-click-row="emits('doubleClickSongRow', $event, index, song)"
        @click-ellipsis-button="emits('clickEllipsisButton', $event, index, song)"
        @contextmenu="emits('contextmenu', $event, index, song)"
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
