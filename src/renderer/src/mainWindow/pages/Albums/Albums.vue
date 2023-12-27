<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useAudioPlayer } from '@mainWindow/composables/useAudioPlayer';
import { useEntitiesStore } from '@mainWindow/stores/entities';
import { useAlbumsSort } from '@mainWindow/composables/useSort';
import { useAlbumsQuickSearch } from '@mainWindow/composables/useQuickSearch';
import { useContextMenu } from '@mainWindow/composables/useContextMenu';
import { Album } from '@shared/types';

import PageHeader from '@mainWindow/components/PageHeader/PageHeader.vue';
import SortWidget from '@mainWindow/components/SortWidget/SortWidget.vue';
import QuickSearchInput from '@mainWindow/components/QuickSearchInput/QuickSearchInput.vue';
import RecycleGridScroller from '@mainWindow/components/RecycleGridScroller/RecycleGridScroller.vue';
import AlbumGridItem from './AlbumGridItem.vue';

const { albumList } = storeToRefs(useEntitiesStore());
const { sortedAlbums, sortKey, order } = useAlbumsSort(albumList);
const { searchText, filteredAlbums } = useAlbumsQuickSearch(sortedAlbums);

const albumContextMenu = useContextMenu('Album');
const showContextMenu = (e: MouseEvent, album: Album) => albumContextMenu.show(e, { album });

const router = useRouter();
const onClickItem = (albumId: string) => router.push(`albums/${albumId}`);

const { setQueue } = useAudioPlayer();
const { getAlbumSongs } = useEntitiesStore();
const playAlbumSongs = async (albumId: string, shuffle: boolean) => {
  const albumSongs = getAlbumSongs(albumId);
  const songIds = albumSongs.map((song) => song.id);
  await setQueue(songIds, { shuffle });
};
</script>

<template>
  <div class="albums-page">
    <PageHeader>
      <template #title>アルバム ({{ albumList.length }})</template>
      <template #default></template>
    </PageHeader>

    <div class="widgets">
      <SortWidget
        v-model:sort-by="sortKey"
        v-model:order="order"
        :items="[
          { key: 'Name', label: 'タイトル' },
          { key: 'SongCount', label: '曲数' },
        ]"
      />
      <QuickSearchInput v-model="searchText" />
    </div>

    <RecycleGridScroller
      scroller-height="calc(100% - 6rem)"
      :items="filteredAlbums"
      key-field="id"
      :item-height="208"
      :base-item-width="176"
    >
      <template #default="{ item }">
        <AlbumGridItem
          :album="item"
          @click-item="onClickItem(item.id)"
          @click-play-button="playAlbumSongs(item.id, false)"
          @click-shuffle-play-button="playAlbumSongs(item.id, true)"
          @contextmenu="showContextMenu($event, item)"
        />
      </template>
    </RecycleGridScroller>
  </div>
</template>

<style scoped>
.albums-page {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.widgets {
  height: 3rem;
  padding: 0 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
