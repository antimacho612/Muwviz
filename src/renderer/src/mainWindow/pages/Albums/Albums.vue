<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useAudioPlayer } from '@mainWindow/composables/useAudioPlayer';
import { useEntitiesStore } from '@mainWindow/stores/entities';
import { useAlbumsSort } from '@renderer/mainWindow/composables/useSort';
import { useAlbumsQuickSearch } from '@renderer/mainWindow/composables/useQuickSearch';

import PageHeader from '@mainWindow/components/PageHeader/PageHeader.vue';
import SortWidget from '@renderer/mainWindow/components/SortWidget/SortWidget.vue';
import QuickSearchWidget from '@renderer/mainWindow/components/QuickSearchWidget/QuickSearchWidget.vue';
import RecycleGridScroller from '@mainWindow/components/RecycleGridScroller/RecycleGridScroller.vue';
import AlbumGridItem from './AlbumGridItem.vue';

const { albumList } = storeToRefs(useEntitiesStore());
const { sortedAlbums, sortKey, order } = useAlbumsSort(albumList);
const { searchText, filteredAlbums } = useAlbumsQuickSearch(sortedAlbums);

const showContextMenu = (_e: MouseEvent, _albumId: string) => {
  // TODO: 未実装（コンテキストメニュー表示）
};

const router = useRouter();
const onClickItem = (albumId: string) => router.push(`albums/${albumId}`);

const { setQueue } = useAudioPlayer();
const { getAlbumSongs } = useEntitiesStore();
const onClickPlayButton = async (albumId: string) => {
  const albumSongs = getAlbumSongs(albumId);
  const songIds = albumSongs.map((song) => song.id);
  await setQueue(songIds);
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
      <QuickSearchWidget v-model="searchText" />
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
          @click-play-button="onClickPlayButton(item.id)"
          @contextmenu="showContextMenu($event, item.id)"
        />
      </template>
    </RecycleGridScroller>
  </div>
</template>

<style lang="scss" scoped>
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
