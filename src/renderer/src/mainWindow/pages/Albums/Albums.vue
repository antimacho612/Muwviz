<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useAlbumsHistoryState } from '@renderer/mainWindow/composables/useHistoryState';
import { useAudioPlayer } from '@mainWindow/composables/useAudioPlayer';
import { useEntitiesStore } from '@mainWindow/stores/entities';
import { useAlbumsSort } from '@mainWindow/composables/useSort';
import { useAlbumsQuickSearch } from '@mainWindow/composables/useQuickSearch';
import { useContextMenu } from '@mainWindow/composables/useContextMenu';
import { Album } from '@shared/types';

import AlbumIcon from '@renderer/assets/icons/album.svg?component';
import PageHeader from '@mainWindow/components/PageHeader/PageHeader.vue';
import SortWidget from '@mainWindow/components/SortWidget/SortWidget.vue';
import QuickSearchInput from '@mainWindow/components/QuickSearchInput/QuickSearchInput.vue';
import RecycleGridScroller from '@mainWindow/components/RecycleGridScroller/RecycleGridScroller.vue';
import AlbumGridItem from './AlbumGridItem.vue';

const { backupData } = useAlbumsHistoryState();

const { albumList } = storeToRefs(useEntitiesStore());
const { sortedAlbums, sortKey, order } = useAlbumsSort(
  albumList,
  backupData.value.sortKey,
  backupData.value.order
);
const { searchText, filteredAlbums } = useAlbumsQuickSearch(
  sortedAlbums,
  backupData.value.searchText
);

const scroller = ref();
onMounted(() => {
  if (!scroller.value || !backupData.value.scrollTo) return;
  if (backupData.value.scrollTo > filteredAlbums.value.length - 1) return;
  nextTick(() => scroller.value.scrollToItem(backupData.value.scrollTo));
});

const albumContextMenu = useContextMenu('Album');
const showContextMenu = (e: MouseEvent, album: Album) => albumContextMenu.show(e, { album });

const router = useRouter();
const onClickItem = (index: number, albumId: string) => {
  backupData.value = {
    searchText: searchText.value,
    sortKey: sortKey.value,
    order: order.value,
    scrollTo: index,
  };
  router.push(`albums/${albumId}?back=true`);
};

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
      <template #title>
        <div class="flex align-items-center column-gap-2">
          <AlbumIcon style="height: 1.75rem; width: 1.75rem" />
          アルバム ({{ albumList.length.toLocaleString() }})
        </div>
      </template>
    </PageHeader>

    <div class="widgets">
      <SortWidget
        v-model:sort-by="sortKey"
        v-model:order="order"
        :items="[
          { key: 'Title', label: 'タイトル' },
          { key: 'SongCount', label: '曲数' },
        ]"
      />
      <QuickSearchInput v-model="searchText" />
    </div>

    <RecycleGridScroller
      ref="scroller"
      scroller-height="calc(100% - 6rem)"
      :items="filteredAlbums"
      key-field="id"
      :item-height="208"
      :base-item-width="176"
    >
      <template #default="{ item, index }">
        <AlbumGridItem
          :album="item"
          @click-item="onClickItem(index, item.id)"
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
