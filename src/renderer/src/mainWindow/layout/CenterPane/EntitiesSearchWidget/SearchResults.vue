<script setup lang="ts">
import { Album, Artist, Song } from '@shared/types';

import SongListRow from './SongListRow.vue';
import AlbumListRow from './AlbumListRow.vue';
import ArtistListRow from './ArtistListRow.vue';

interface Props {
  isShow: boolean;
  songs: Song[];
  albums: Album[];
  artists: Artist[];
}
defineProps<Props>();

type Emits = {
  doubleClickSongRow: [songId: string];
  clickArtistLink: [artistId: string];
  clickAlbumLink: [albumId: string];
  clickAlbumPlayButton: [albumId: string];
  clickArtistPlayButton: [artistId: string];
};
const emits = defineEmits<Emits>();
</script>

<template>
  <Transition>
    <div v-if="isShow" class="search-results">
      <div class="songs">
        <div class="section-header">
          <h3>Songs ({{ songs.length }})</h3>
        </div>
        <div class="scroller-wrapper">
          <RecycleScroller
            :items="songs"
            :item-size="33"
            key-field="id"
            direction="vertical"
            class="scroller"
          >
            <template #default="{ item }">
              <SongListRow
                :song="item"
                @double-click-row="emits('doubleClickSongRow', item.id)"
                @click-artist-link="emits('clickArtistLink', item.artistId)"
                @click-album-link="emits('clickAlbumLink', item.albumId)"
              />
            </template>
          </RecycleScroller>
        </div>
      </div>

      <div class="albums">
        <div class="section-header">
          <h3>Albums ({{ albums.length }})</h3>
        </div>
        <div class="scroller-wrapper">
          <RecycleScroller
            :items="albums"
            :item-size="56"
            key-field="id"
            direction="vertical"
            class="scroller"
          >
            <template #default="{ item }">
              <AlbumListRow
                :album="item"
                @click-row="emits('clickAlbumLink', item.id)"
                @click-artwork="emits('clickAlbumPlayButton', item.id)"
              />
            </template>
          </RecycleScroller>
        </div>
      </div>

      <div class="artists">
        <div class="section-header">
          <h3>Artists ({{ artists.length }})</h3>
        </div>
        <div class="scroller-wrapper">
          <RecycleScroller
            :items="artists"
            :item-size="56"
            key-field="id"
            direction="vertical"
            class="scroller"
          >
            <template #default="{ item }">
              <ArtistListRow
                :artist="item"
                @click-row="emits('clickArtistLink', item.id)"
                @click-artist-image="emits('clickArtistPlayButton', item.id)"
              />
            </template>
          </RecycleScroller>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.search-results {
  position: fixed;
  top: $titleBarHeight + $centerPaneHeaderHeight + 0.5rem;
  left: $leftSidePaneWidth + 0.5rem;
  width: 50%;
  height: 60%;
  min-height: 20rem;
  padding: 1rem;
  display: grid;
  grid-template:
    'songs songs' 1fr
    'albums artists' 1fr
    / 1.5fr 1fr;
  gap: 1rem;
  background: var(--background-color);
  border-radius: $borderRadiusLg;
  box-shadow: $shadow;
  z-index: 600;
}

.songs {
  grid-area: songs;
  overflow: hidden;
}

.albums {
  grid-area: albums;
  overflow: hidden;
}

.artists {
  grid-area: artists;
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  height: 2rem;
  padding-bottom: 0.25rem;
  gap: 1rem;

  &::after {
    content: '';
    flex-grow: 1;
    height: 2px;
    background: var(--divider-color);
  }
}

.scroller-wrapper {
  width: 100%;
  height: calc(100% - 2rem);
  overflow: hidden;
}

.scroller {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
