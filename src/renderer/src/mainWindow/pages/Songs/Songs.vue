<script setup lang="ts">
import { useAudioPlayer } from '@mainWindow/composables/useAudioPlayer';
import { useEntitiesStore } from '@mainWindow/stores/entities';
import { useSongsSort } from '@mainWindow/composables/useSort';
import { useSongsQuickSearch } from '@mainWindow/composables/useQuickSearch';

import PageHeader from '@mainWindow/components/PageHeader/PageHeader.vue';
import SortWidget from '@mainWindow/components/SortWidget/SortWidget.vue';
import QuickSearchWidget from '@mainWindow/components/QuickSearchWidget/QuickSearchWidget.vue';
import SongList from '@mainWindow/components/SongList/SongList.vue';

const { setQueue } = useAudioPlayer();
const { songList } = useEntitiesStore();

const { sortKey, order, sortedSongs } = useSongsSort(songList);
const { searchText, filteredSongs } = useSongsQuickSearch(sortedSongs);

const playSong = async (songId: string) => {
  const songIds = sortedSongs.value.map((song) => song.id);
  const theSongIndex = songIds.indexOf(songId);
  await setQueue(songIds, { firstSongIndex: theSongIndex });
};
const onClickArtwork = async (songId: string) => await playSong(songId);
const onDoubleClickRow = async (songId: string) => await playSong(songId);
</script>

<template>
  <div class="songs-page">
    <PageHeader>
      <template #title>すべての曲 ({{ songList.length }})</template>
      <template #actions></template>
    </PageHeader>

    <div class="widgets">
      <SortWidget
        v-model:sort-by="sortKey"
        v-model:order="order"
        :items="[
          { key: 'Artist', title: 'アーティスト' },
          { key: 'Album', title: 'アルバム' },
          { key: 'Title', title: 'タイトル' },
          { key: 'PlayCount', title: '再生回数' },
        ]"
      />
      <QuickSearchWidget v-model="searchText" />
    </div>

    <SongList
      :songs="filteredSongs"
      @click-artwork="onClickArtwork"
      @double-click-row="onDoubleClickRow"
    />
  </div>
</template>

<style lang="scss" scoped>
.songs-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.widgets {
  margin: 0 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
