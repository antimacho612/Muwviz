<script setup lang="ts">
import { ref } from 'vue';
import { useEntitiesStore } from '@renderer/stores/entities';
import { useSongsSort } from '@renderer/utils/useSort';
import { useQuickSongsSearch } from '@renderer/utils/useQuickSearch';

import AlbumItem from './AlbumItem.vue';
import SortWidget from '@renderer/components/SortWidget/SortWidget.vue';
import QuickSearchWidget from '@renderer/components/QuickSearchWidget/QuickSearchWidget.vue';
import Artwork from '@renderer/components/Artwork/Artwork.vue';

const props = defineProps<{ albumId: string }>();

const { getAlbumById, getAlbumSongs } = useEntitiesStore();
const album = getAlbumById(props.albumId);
const albumSongs = getAlbumSongs(props.albumId);

const { sortKey, order, sortedSongs } = useSongsSort(albumSongs);
const { searchText, searchedSongs } = useQuickSongsSearch(sortedSongs);
</script>

<template>
  <div class="album-page">
    <div class="header">
      <Artwork :src="album.artworkPath" class="artwork" />
      <div class="header-main">
        <div class="title">{{ album.name }}</div>
        <div class="artists">
          <span v-for="artist in album.artists" :key="artist.id">
            {{ artist.name }}
          </span>
        </div>
      </div>
    </div>
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
    <div class="album-songs">
      <RecycleScroller
        ref="scroller"
        class="album-songs-scroller"
        :items="searchedSongs"
        :item-size="40"
        key-field="id"
        direction="vertical"
      >
        <template #default="{ item }">
          <AlbumItem :song="item" />
        </template>
      </RecycleScroller>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.album-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.header {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  height: 15%;
  padding: 0.5rem;
  overflow: hidden;
}

.artwork {
  flex: 0 0 auto;
  margin-right: 1rem;

  :deep(.artwork-img) {
    width: auto;
  }
}

.header-main {
  overflow: hidden;

  .title {
    font-size: map-get($fontSizes, xl);
    @include singleLineClamp;
  }
}

.artists {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.widgets {
  margin: 0 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.album-songs {
  height: 82%;
  width: 100%;
  overflow: hidden;
}

.album-songs-scroller {
  height: 100%;
  width: 100%;
  padding: 0 0.5rem;
}
</style>
