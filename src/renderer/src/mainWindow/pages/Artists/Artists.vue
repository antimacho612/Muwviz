<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAudioPlayer } from '@mainWindow/composables/useAudioPlayer';
import { useEntitiesStore } from '@mainWindow/stores/entities';
import { useArtistsSort } from '@renderer/mainWindow/composables/useSort';
import { useArtistsQuickSearch } from '@renderer/mainWindow/composables/useQuickSearch';

import PageHeader from '@mainWindow/components/PageHeader/PageHeader.vue';
import SortWidget from '@renderer/mainWindow/components/SortWidget/SortWidget.vue';
import QuickSearchWidget from '@renderer/mainWindow/components/QuickSearchWidget/QuickSearchWidget.vue';
import RecycleGridScroller from '@mainWindow/components/RecycleGridScroller/RecycleGridScroller.vue';
import ArtistGridItem from './ArtistGridItem.vue';
import { storeToRefs } from 'pinia';

const { artistList } = storeToRefs(useEntitiesStore());
const { sortedArtists, sortKey, order } = useArtistsSort(artistList);
const { searchText, filteredArtists } = useArtistsQuickSearch(sortedArtists);

const router = useRouter();
const onClickItem = (artistId: string) => router.push(`artists/${artistId}`);

const { setQueue } = useAudioPlayer();
const { getArtistSongs } = useEntitiesStore();
const onClickPlayButton = async (artistId: string) => {
  const albumSongs = getArtistSongs(artistId);
  const songIds = albumSongs.map((song) => song.id);
  await setQueue(songIds);
};

const showContextMenu = (_e: MouseEvent, _artistId: string) => {
  // TODO: 未実装（コンテキストメニュー表示）
};
</script>

<template>
  <div class="artist-list-page">
    <PageHeader>
      <template #title>アーティスト ({{ artistList.length }})</template>
      <template #actions></template>
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
      <QuickSearchWidget v-model="searchText" />
    </div>

    <RecycleGridScroller
      scroller-height="calc(100% - 6rem)"
      :items="filteredArtists"
      key-field="id"
      :item-height="192"
      :base-item-width="176"
    >
      <template #default="{ item }">
        <ArtistGridItem
          :artist="item"
          @click-item="onClickItem(item.id)"
          @click-play-button="onClickPlayButton(item.id)"
          @contextmenu="showContextMenu($event, item.id)"
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
