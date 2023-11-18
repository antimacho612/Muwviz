<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useAudioPlayer } from '@renderer/utils/useAudioPlayer';
import { useEntitiesStore } from '@renderer/stores/entities';
import { Order, Song, SongsSortKey } from '@shared/types';
import { sortArrayOfObjects } from '@shared/utils';

import PageHeader from '@renderer/components/PageHeader/PageHeader.vue';
import SortWidget from '@renderer/components/SortWidget/SortWidget.vue';
import QuickSearchWidget from '@renderer/components/QuickSearchWidget/QuickSearchWidget.vue';
import SongList from '@renderer/components/SongList/SongList.vue';

const { setQueue } = useAudioPlayer();
const { songList } = useEntitiesStore();

const searchText = ref('');
const sortKey = ref<SongsSortKey>('Artist');
const order = ref<Order>('ASC');
const sortedSongs = ref<Song[]>([...songList]);

const filteredSongs = computed(() => {
  // フィルタリング
  if (searchText.value !== '') {
    const searchString = searchText.value.toLocaleLowerCase();
    return sortedSongs.value.filter(
      (song) =>
        song.title.toLocaleLowerCase().includes(searchString) ||
        song.album.toLocaleLowerCase().includes(searchString) ||
        song.artist.toLocaleLowerCase().includes(searchString)
    );
  } else {
    return sortedSongs.value;
  }
});

watch([sortKey, order], () => {
  // ソート
  if (sortKey.value === 'Artist' && order.value === 'ASC') {
    sortedSongs.value = [...songList];
  } else {
    sortedSongs.value = sortArrayOfObjects(
      [...songList],
      [
        {
          key: 'title',
          order: 'DESC',
        },
      ]
    );
  }
});

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
  margin: 0 0 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
