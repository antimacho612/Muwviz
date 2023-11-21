<script setup lang="ts">
import { computed } from 'vue';
import { useEntitiesStore } from '@renderer/stores/entities';
import { useSongsSort } from '@renderer/utils/useSort';
import { useSongsQuickSearch } from '@renderer/utils/useQuickSearch';
import { GroupedItem } from './groupedItem';

import PageHeader from '@renderer/components/PageHeader/PageHeader.vue';
import SortWidget from '@renderer/components/SortWidget/SortWidget.vue';
import QuickSearchWidget from '@renderer/components/QuickSearchWidget/QuickSearchWidget.vue';
import ArtistGroupedItem from './ArtistGroupedItem.vue';

const props = defineProps<{ artistId: string }>();

const { getArtistById, getArtistSongs } = useEntitiesStore();
const artist = getArtistById(props.artistId);
const artistSongs = getArtistSongs(props.artistId);

const { sortKey, order, sortedSongs } = useSongsSort(artistSongs);
const { searchText, filteredSongs } = useSongsQuickSearch(sortedSongs);

const songGroups = computed(() => {
  let currentKey: string;
  return filteredSongs.value.reduce<GroupedItem[]>((array, song) => {
    if (currentKey !== song.albumId) {
      currentKey = song.albumId;

      array.push({
        id: crypto.randomUUID(),
        album: song.album,
        albumId: song.albumId,
        artworkPath: song.artworkPath,
        songs: [song],
      });
    } else {
      const lastItem = array[array.length - 1];
      lastItem.artworkPath ??= song.artworkPath;
      lastItem.songs.push(song);
    }

    return array;
  }, []);
});
</script>

<template>
  <div class="artist-page">
    <PageHeader>
      アーティスト一覧へ
      <span>{{ artist?.name }}</span>
    </PageHeader>

    <div class="widgets">
      <SortWidget
        v-model:sort-by="sortKey"
        v-model:order="order"
        :items="[
          { key: 'Title', title: 'タイトル' },
          { key: 'PlayCount', title: '再生回数' },
        ]"
      />
      <QuickSearchWidget v-model="searchText" />
    </div>

    <DynamicScroller :items="songGroups" :min-item-size="54" class="scroller">
      <template #default="{ item, active }">
        <DynamicScrollerItem :item="item" :active="active" :size-dependences="[item.songs]">
          <ArtistGroupedItem :grouped-item="item" />
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

.widgets {
  margin: 0 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.scroller {
  height: calc(100% - 96px);
}
</style>
../Artists/groupedItem
