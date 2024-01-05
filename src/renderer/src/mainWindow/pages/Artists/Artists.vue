<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useArtistsHistoryState } from '@renderer/mainWindow/composables/useHistoryState';
import { useAudioPlayer } from '@mainWindow/composables/useAudioPlayer';
import { useEntitiesStore } from '@mainWindow/stores/entities';
import { useArtistsSort } from '@mainWindow/composables/useSort';
import { useArtistsQuickSearch } from '@mainWindow/composables/useQuickSearch';
import { useContextMenu } from '@mainWindow/composables/useContextMenu';
import { Artist } from '@shared/types';

import UserGroupIcon from '@renderer/assets/icons/user-group.svg?component';
import PageHeader from '@mainWindow/components/PageHeader/PageHeader.vue';
import SortWidget from '@mainWindow/components/SortWidget/SortWidget.vue';
import QuickSearchInput from '@mainWindow/components/QuickSearchInput/QuickSearchInput.vue';
import RecycleGridScroller from '@mainWindow/components/RecycleGridScroller/RecycleGridScroller.vue';
import ArtistGridItem from './ArtistGridItem.vue';

const { backupData } = useArtistsHistoryState();

const { artistList } = storeToRefs(useEntitiesStore());
const { sortedArtists, sortKey, order } = useArtistsSort(
  artistList,
  backupData.value.sortKey,
  backupData.value.order
);
const { searchText, filteredArtists } = useArtistsQuickSearch(
  sortedArtists,
  backupData.value.searchText
);

const scroller = ref();
onMounted(() => {
  if (!scroller.value || !backupData.value.scrollTo) return;
  if (backupData.value.scrollTo > filteredArtists.value.length - 1) return;
  nextTick(() => scroller.value.scrollToItem(backupData.value.scrollTo));
});

const artistContextMenu = useContextMenu('Artist');
const showContextMenu = (e: MouseEvent, artist: Artist) => artistContextMenu.show(e, { artist });

const router = useRouter();
const onClickItem = (index: number, artistId: string) => {
  backupData.value = {
    searchText: searchText.value,
    sortKey: sortKey.value,
    order: order.value,
    scrollTo: index,
  };
  router.push(`artists/${artistId}?back=true`);
};

const { setQueue } = useAudioPlayer();
const { getArtistSongs } = useEntitiesStore();
const playArtistSongs = async (artistId: string, shuffle: boolean) => {
  const artistSongs = getArtistSongs(artistId);
  const songIds = artistSongs.map((song) => song.id);
  await setQueue(songIds, { shuffle });
};
</script>

<template>
  <div class="artist-list-page">
    <PageHeader>
      <template #title>
        <div class="flex align-items-center column-gap-2">
          <UserGroupIcon style="height: 1.75rem; width: 1.75rem" />
          アーティスト ({{ artistList.length.toLocaleString() }})
        </div>
      </template>
    </PageHeader>

    <div class="widgets">
      <SortWidget
        v-model:sort-by="sortKey"
        v-model:order="order"
        :items="[
          { key: 'Name', label: '名前' },
          { key: 'SongCount', label: '曲数' },
        ]"
      />
      <QuickSearchInput v-model="searchText" />
    </div>

    <RecycleGridScroller
      ref="scroller"
      scroller-height="calc(100% - 6rem)"
      :items="filteredArtists"
      key-field="id"
      :item-height="192"
      :base-item-width="176"
    >
      <template #default="{ index, item }">
        <ArtistGridItem
          :artist="item"
          @click-item="onClickItem(index, item.id)"
          @click-play-button="playArtistSongs(item.id, false)"
          @click-shuffle-play-button="playArtistSongs(item.id, true)"
          @contextmenu="showContextMenu($event, item)"
        />
      </template>
    </RecycleGridScroller>
  </div>
</template>

<style scoped>
.artist-list-page {
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
