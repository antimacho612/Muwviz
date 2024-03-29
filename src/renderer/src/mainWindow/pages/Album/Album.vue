<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useAudioPlayer } from '@mainWindow/composables/useAudioPlayer';
import { useEntitiesStore } from '@mainWindow/stores/entities';
import { useSongsSort } from '@mainWindow/composables/useSort';
import { useSongsQuickSearch } from '@mainWindow/composables/useQuickSearch';
import { useMultiSelectableSongList } from '@mainWindow/composables/useMultiSelectableSongList';
import { useContextMenu } from '@mainWindow/composables/useContextMenu';
import { formatAlbumTitle } from '@renderer/commonUtils';
import { Song } from '@shared/types';

import PlayIcon from '@renderer/assets/icons/play.svg?component';
import ShuffleIcon from '@renderer/assets/icons/shuffle.svg?component';
import EllipsisIcon from '@renderer/assets/icons/ellipsis.svg?component';
import PageHeader from '@mainWindow/components/PageHeader/PageHeader.vue';
import BackButton from '@mainWindow/components/BackButton/BackButton.vue';
import AlbumSong from './AlbumSong.vue';
import SortWidget from '@mainWindow/components/SortWidget/SortWidget.vue';
import QuickSearchInput from '@mainWindow/components/QuickSearchInput/QuickSearchInput.vue';
import Artwork from '@mainWindow/components/Artwork/Artwork.vue';
import Button from '@renderer/commonComponents/Button/Button.vue';

const props = defineProps<{ albumId: string }>();

const { albumsMap, songList } = storeToRefs(useEntitiesStore());
const album = computed(() => albumsMap.value.get(props.albumId));
const albumSongs = computed(() => songList.value.filter((song) => song.albumId === props.albumId));

const { sortKey, order, sortedSongs } = useSongsSort(albumSongs);
const { searchText, filteredSongs } = useSongsQuickSearch(sortedSongs);
const { selectedSongs, getOrderedSelectedSongIds, clearSelection, onClickItem } =
  useMultiSelectableSongList(filteredSongs);

const { setQueue } = useAudioPlayer();
const onDoubleClickRow = async (songId: string) => {
  const songIds = filteredSongs.value.map((song) => song.id);
  const theSongIndex = songIds.indexOf(songId);
  await setQueue(songIds, { firstSongIndex: theSongIndex });
};

const playAlbumSongs = async (shuffle: boolean) => {
  const songIds = filteredSongs.value.map((song) => song.id);
  await setQueue(songIds, { shuffle });
};
const albumContextMenu = useContextMenu('Album');
const onClickEllipsisButton = (e: MouseEvent) => album.value && albumContextMenu.show(e, { album: album.value });

const songContextMenu = useContextMenu('Song');
const songsContextMenu = useContextMenu('Songs');
const showContextMenu = (e: MouseEvent, song: Song) => {
  if (selectedSongs.value.size > 1) {
    songsContextMenu.show(e, { selectedSongs: getOrderedSelectedSongIds() });
  } else {
    songContextMenu.show(e, { song });
  }
};
</script>

<template>
  <div class="album-page">
    <PageHeader>
      <BackButton :to="$route.query.back ? 'Back' : '/albums'" />
    </PageHeader>

    <div class="header">
      <Artwork :src="album?.artworkPath" width="6.5rem" class="artwork" />

      <div class="header-main">
        <div class="title">{{ formatAlbumTitle(album?.title) }}</div>
        <div class="bottom">
          <div class="artists">
            <template v-if="album?.title">
              <span v-for="artist in album?.artists" :key="artist.id">
                {{ artist.name }}
              </span>
            </template>
          </div>
          <div class="actions">
            <Button
              size="sm"
              :icon="PlayIcon"
              :title="`【${formatAlbumTitle(album?.title)}】を再生`"
              @click="playAlbumSongs(false)"
            />
            <Button
              size="sm"
              :icon="ShuffleIcon"
              :title="`【${formatAlbumTitle(album?.title)}】をシャッフル再生`"
              @click="playAlbumSongs(true)"
            />
            <Button size="sm" :icon="EllipsisIcon" @click="onClickEllipsisButton" />
          </div>
        </div>
      </div>
    </div>

    <div class="widgets">
      <SortWidget
        v-model:sort-by="sortKey"
        v-model:order="order"
        :items="[
          { key: 'Title', label: 'タイトル' },
          { key: 'Artist', label: 'アーティスト' },
          { key: 'TrackNo', label: 'ディスク-トラックNo' },
        ]"
      />
      <QuickSearchInput v-model="searchText" />
    </div>

    <div class="album-songs">
      <RecycleScroller
        v-click-outside="clearSelection"
        :items="filteredSongs"
        :item-size="41"
        key-field="id"
        direction="vertical"
        class="album-songs-scroller"
      >
        <template #default="{ item, index }">
          <AlbumSong
            :song="item"
            :selected="selectedSongs.has(index)"
            @click-row="onClickItem($event, index, item.id)"
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
  height: 7.5rem;
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
    font-weight: bold;
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
      display: flex;
      align-items: center;
      column-gap: 1rem;
    }
  }
}

.widgets {
  height: 3rem;
  padding: 0 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.album-songs {
  height: calc(100% - 13.5rem);
  width: 100%;
  overflow: hidden;
}

.album-songs-scroller {
  height: 100%;
  width: 100%;
  padding: 0 0.5rem;
}
</style>
