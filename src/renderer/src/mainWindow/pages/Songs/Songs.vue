<script setup lang="ts">
import { useAudioPlayer } from '@mainWindow/composables/useAudioPlayer';
import { useEntitiesStore } from '@mainWindow/stores/entities';
import { useSongsSort } from '@mainWindow/composables/useSort';
import { useSongsQuickSearch } from '@mainWindow/composables/useQuickSearch';
import { useMultiSelectableSongList } from '@mainWindow/composables/useMultiSelectableSongList';
import { useContextMenu } from '@mainWindow/composables/useContextMenu';
import { Song } from '@shared/types';

import PageHeader from '@mainWindow/components/PageHeader/PageHeader.vue';
import SortWidget from '@mainWindow/components/SortWidget/SortWidget.vue';
import QuickSearchWidget from '@mainWindow/components/QuickSearchWidget/QuickSearchWidget.vue';
import SongListItem from './SongListItem.vue';

const { setQueue } = useAudioPlayer();
const { songList } = useEntitiesStore();

const { sortedSongs, sortKey, order } = useSongsSort(songList);
const { searchText, filteredSongs } = useSongsQuickSearch(sortedSongs);
const { selectedSongs, clearSelection, onSelectItem } = useMultiSelectableSongList(filteredSongs);

// Context Menu
const songContextMenu = useContextMenu('SONG');
const songsContextMenu = useContextMenu('SONGS');
const showContextMenu = (e: MouseEvent, song: Song) => {
  if (selectedSongs.value.size > 1) {
    songsContextMenu.show(e, { selectedSongs: selectedSongs.value });
  } else {
    songContextMenu.show(e, { song });
  }
};

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
          { key: 'Artist', label: 'アーティスト' },
          { key: 'Album', label: 'アルバム' },
          { key: 'Title', label: 'タイトル' },
        ]"
      />
      <QuickSearchWidget v-model="searchText" />
    </div>

    <div class="song-list">
      <RecycleScroller
        v-click-outside="clearSelection"
        class="songs-scroller"
        :items="filteredSongs"
        :item-size="57"
        key-field="id"
        direction="vertical"
      >
        <template #default="{ item, index }">
          <SongListItem
            :index="index"
            :song="item"
            :selected="selectedSongs.has(item.id)"
            @click-row="onSelectItem(index, item.id)"
            @click-artwork="onClickArtwork(item.id)"
            @double-click-row="onDoubleClickRow(item.id)"
            @click-ellipsis-button="showContextMenu($event, item)"
            @contextmenu="showContextMenu($event, item)"
          />
        </template>
      </RecycleScroller>
    </div>
  </div>
</template>

<style scoped>
.songs-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.widgets {
  height: 3rem;
  padding: 0 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.song-list {
  height: calc(100% - 6rem);
  overflow: hidden;
}

.songs-scroller {
  width: 100%;
  height: 100%;
  padding: 0 0.5rem;
}
</style>
