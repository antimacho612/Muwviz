<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { watchDebounced } from '@vueuse/core';
import { useAudioPlayer } from '@mainWindow/composables/useAudioPlayer';
import { useEntitiesStore } from '@mainWindow/stores/entities';
import { Album, Artist, Song } from '@shared/types';

import QuickSearchInput from '@mainWindow/components/QuickSearchInput/QuickSearchInput.vue';
import SearchResults from './SearchResults.vue';

const { searchSongsByTitle, searchAlbumsByTitle, searchArtistsByName, getAlbumSongs, getArtistSongs } =
  useEntitiesStore();

const isResultsShow = ref(false);

const searchQuery = ref('');
const searchedSongs = ref<Song[]>([]);
const searchedAlbums = ref<Album[]>([]);
const searchedArtists = ref<Artist[]>([]);

const searchEntities = () => {
  if (searchQuery.value) {
    searchedSongs.value = searchSongsByTitle(searchQuery.value);
    searchedAlbums.value = searchAlbumsByTitle(searchQuery.value);
    searchedArtists.value = searchArtistsByName(searchQuery.value);

    isResultsShow.value = true;
  } else {
    searchedSongs.value = [];
    searchedAlbums.value = [];
    searchedArtists.value = [];

    isResultsShow.value = false;
  }
};
watchDebounced(searchQuery, searchEntities, { debounce: 1000, maxWait: 2000 });

const onClickOutside = () => {
  isResultsShow.value = false;
};
const onFocusSearchInput = () => {
  if (searchQuery.value) isResultsShow.value = true;
};

const { setQueue } = useAudioPlayer();
const onDoubleClickSongRow = async (songId: string) => {
  const songIds = searchedSongs.value.map((song) => song.id);
  const theSongIndex = songIds.indexOf(songId);
  await setQueue(songIds, { firstSongIndex: theSongIndex });
};
const onClickAlbumPlayButton = async (albumId: string) => {
  const albumSongs = getAlbumSongs(albumId);
  const songIds = albumSongs.map((song) => song.id);
  await setQueue(songIds);
};
const onClickArtistPlayButton = async (artistId: string) => {
  const artistSongs = getArtistSongs(artistId);
  const songIds = artistSongs.map((song) => song.id);
  await setQueue(songIds);
};

const router = useRouter();
const onClickAlbumLink = (albumId: string) => {
  isResultsShow.value = false;
  router.push(`/albums/${albumId}`);
};
const onClickArtistLink = (artistId: string) => {
  isResultsShow.value = false;
  router.push(`/artists/${artistId}`);
};
</script>

<template>
  <div v-click-outside="onClickOutside">
    <QuickSearchInput
      v-model="searchQuery"
      size="sm"
      class="entities-search-input"
      :class="{ focused: isResultsShow }"
      @focus="onFocusSearchInput"
    />
    <SearchResults
      :is-show="isResultsShow"
      :songs="searchedSongs"
      :albums="searchedAlbums"
      :artists="searchedArtists"
      @double-click-song-row="onDoubleClickSongRow"
      @click-album-link="onClickAlbumLink"
      @click-album-play-button="onClickAlbumPlayButton"
      @click-artist-link="onClickArtistLink"
      @click-artist-play-button="onClickArtistPlayButton"
    />
  </div>
</template>

<style lang="scss" scoped>
.entities-search-input {
  width: 25rem;

  &.focused :deep(.c-input-text) {
    @include focusedInput;
  }
}
</style>
