<script setup lang="ts">
import { ref } from 'vue';
import { useAudioPlayer } from '@renderer/utils/useAudioPlayer';
import { useEntitiesStore } from '@renderer/stores/entities';
import { useResizeObserver } from '@vueuse/core';
import { useSongsSort } from '@renderer/utils/useSort';
import { useSongsQuickSearch } from '@renderer/utils/useQuickSearch';
import { useMultiSelectableSongList } from '@renderer/utils/useMultiSelectableSongList';
import { useContextMenu } from '@renderer/utils/useContextMenu';
import { Song } from '@shared/types';

import PageHeader from '@renderer/components/PageHeader/PageHeader.vue';
import BackButton from '@renderer/components/BackButton/BackButton.vue';
import { PlayIcon } from '@heroicons/vue/24/solid';
import AlbumSong from './AlbumSong.vue';
import SortWidget from '@renderer/components/SortWidget/SortWidget.vue';
import QuickSearchWidget from '@renderer/components/QuickSearchWidget/QuickSearchWidget.vue';
import Artwork from '@renderer/components/Artwork/Artwork.vue';
import Button from '@renderer/components/base/Button/Button.vue';

const props = defineProps<{ albumId: string }>();

const { getAlbumById, getAlbumSongs } = useEntitiesStore();
const album = getAlbumById(props.albumId);
const albumSongs = getAlbumSongs(props.albumId);

const { sortKey, order, sortedSongs } = useSongsSort(albumSongs);
const { searchText, filteredSongs } = useSongsQuickSearch(sortedSongs);

const { selectedSongs, clearSelection, onSelectItem } = useMultiSelectableSongList(filteredSongs);

const { setQueue } = useAudioPlayer();
const onDoubleClickRow = async (songId: string) => {
  const songIds = sortedSongs.value.map((song) => song.id);
  const theSongIndex = songIds.indexOf(songId);
  await setQueue(songIds, { firstSongIndex: theSongIndex });
};

const songContextMenu = useContextMenu('SONG');
const songsContextMenu = useContextMenu('SONGS');
const showContextMenu = (e: MouseEvent, song: Song) => {
  if (selectedSongs.value.size > 1) {
    songsContextMenu.show(e, { selectedSongs: selectedSongs.value });
  } else {
    songContextMenu.show(e, { song });
  }
};

const headerEl = ref<HTMLDivElement>();
const artworkWidth = ref('100%');
useResizeObserver(headerEl, (entries) => {
  const entry = entries[0];
  const { height } = entry.contentRect;
  artworkWidth.value = `${height}px`;
});
</script>

<template>
  <div class="album-page">
    <PageHeader>
      <BackButton to="/albums" />
    </PageHeader>

    <div ref="headerEl" class="header">
      <Artwork :src="album?.artworkPath" :width="artworkWidth" class="artwork" />

      <div class="header-main">
        <div class="title">{{ album?.name }}</div>
        <div class="bottom">
          <div class="artists">
            <span v-for="artist in album?.artists" :key="artist.id">
              {{ artist.name }}
            </span>
          </div>
          <div class="actions">
            <Button size="xs">
              <span>Play</span>
              <PlayIcon style="height: 1.25rem; width: 1.25rem; margin-left: 0.5rem" />
            </Button>
          </div>
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
        v-click-outside="clearSelection"
        class="album-songs-scroller"
        :items="filteredSongs"
        :item-size="41"
        key-field="id"
        direction="vertical"
      >
        <template #default="{ item, index }">
          <AlbumSong
            :song="item"
            :selected="selectedSongs.has(item.id)"
            @click-row="onSelectItem(index, item.id)"
            @double-click-row="onDoubleClickRow(item.id)"
            @contextmenu="showContextMenu($event, item)"
            @click-ellipsis-button="showContextMenu($event, item)"
          />
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
  min-height: 6.5rem;
  padding: 0.5rem;
  overflow: hidden;
}

.artwork {
  flex: 0 0 auto;
  margin-right: 1rem;
}

.header-main {
  flex-grow: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .title {
    font-size: map-get($fontSizes, xl);
    @include singleLineClamp;
  }

  .bottom {
    flex-grow: 1;
    display: flex;
    align-items: start;
    justify-content: space-between;

    .artists {
      flex-grow: 1;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .actions {
      flex-shrink: 0;
      align-self: flex-end;
      padding-bottom: 0.75rem;
      padding-right: 0.75rem;
    }
  }
}

.widgets {
  margin: 0 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.album-songs {
  height: 85%;
  width: 100%;
  overflow: hidden;
}

.album-songs-scroller {
  height: 100%;
  width: 100%;
  padding: 0 0.5rem;
}
</style>
