<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useAudioPlayer } from '@mainWindow/composables/useAudioPlayer';
import { useEntitiesStore } from '@mainWindow/stores/entities';
import { groupSongs } from './grouping';
import { useSongsSort } from '@mainWindow/composables/useSort';
import { useSongsQuickSearch } from '@mainWindow/composables/useQuickSearch';
import { useMultiSelectableSongList } from '@mainWindow/composables/useMultiSelectableSongList';
import { formatArtistName } from '@renderer/commonUtils';
import { Song } from '@shared/types';

import PageHeader from '@mainWindow/components/PageHeader/PageHeader.vue';
import BackButton from '@mainWindow/components/BackButton/BackButton.vue';
import ArtistImage from '@mainWindow/components/ArtistImage/ArtistImage.vue';
import SortWidget from '@mainWindow/components/SortWidget/SortWidget.vue';
import QuickSearchWidget from '@mainWindow/components/QuickSearchWidget/QuickSearchWidget.vue';
import ArtistGroupedItem from './ArtistGroupedItem.vue';

const props = defineProps<{ artistId: string }>();

const { artistsMap, songList } = storeToRefs(useEntitiesStore());

const artist = computed(() => artistsMap.value.get(props.artistId));
const artistSongs = computed(() =>
  songList.value.filter((song) => song.artistId === props.artistId)
);

// ソート、クイックサーチ
const { sortKey, order, sortedSongs } = useSongsSort(artistSongs, {
  sortKey: 'Album',
  order: 'Asc',
});
const { searchText, filteredSongs } = useSongsQuickSearch(sortedSongs);

// 楽曲グルーピング
const songGroups = computed(() => groupSongs(filteredSongs.value));

// マルチセレクト
const { selectedSongs, clearSelection, onClickItem } = useMultiSelectableSongList(filteredSongs);

// イベント
const { setQueue } = useAudioPlayer();
const onClickPlay = async (songs: Song[]) => {
  const songIds = songs.map((song) => song.id);
  await setQueue(songIds);
};

const onDoubleClickSongRow = async (songs: Song[], index: number) => {
  const songIds = songs.map((song) => song.id);
  await setQueue(songIds, { firstSongIndex: index });
};
</script>

<template>
  <div class="artist-page">
    <PageHeader>
      <BackButton to="/artists" />
    </PageHeader>

    <div class="artist-header">
      <ArtistImage class="w-3rem h-3rem" style="padding: 0.375rem" />
      <span class="text-2xl font-bold">{{ formatArtistName(artist?.name) }}</span>
    </div>

    <div class="widgets">
      <SortWidget
        v-model:sort-by="sortKey"
        v-model:order="order"
        :items="[
          { key: 'Album', label: 'アルバム' },
          { key: 'Title', label: 'タイトル' },
        ]"
      />
      <QuickSearchWidget v-model="searchText" />
    </div>

    <DynamicScroller
      v-click-outside="clearSelection"
      :items="songGroups"
      :min-item-size="54"
      style="height: calc(100% - 10rem)"
    >
      <template #default="{ item, active }">
        <DynamicScrollerItem :item="item" :active="active" :size-dependencies="[item.songs]">
          <ArtistGroupedItem
            :grouped-item="item"
            :selected-songs="selectedSongs"
            @click-play="onClickPlay(item.songs)"
            @click-song-row="
              (e: MouseEvent, index: number, songId: string) =>
                onClickItem(e, item.baseIndex + index, songId)
            "
            @double-click-song-row="
              async (_e, index, _songId) => await onDoubleClickSongRow(item.songs, index)
            "
            @click-outside-of-list="clearSelection"
          />
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<style lang="scss" scoped>
.artist-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.artist-header {
  height: 4rem;
  padding-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.widgets {
  height: 3rem;
  padding: 0 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
