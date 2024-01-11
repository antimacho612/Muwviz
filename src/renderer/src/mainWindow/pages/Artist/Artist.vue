<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useAudioPlayer } from '@mainWindow/composables/useAudioPlayer';
import { useEntitiesStore } from '@mainWindow/stores/entities';
import { groupSongs } from './grouping';
import { useSongsSort } from '@mainWindow/composables/useSort';
import { useSongsQuickSearch } from '@mainWindow/composables/useQuickSearch';
import { useMultiSelectableSongList } from '@mainWindow/composables/useMultiSelectableSongList';
import { useContextMenu } from '@mainWindow/composables/useContextMenu';
import { formatArtistName } from '@renderer/commonUtils';
import { Song } from '@shared/types';

import Button from '@renderer/commonComponents/Button/Button.vue';
import PlayIcon from '@renderer/assets/icons/play.svg?component';
import ShuffleIcon from '@renderer/assets/icons/shuffle.svg?component';
import EllipsisIcon from '@renderer/assets/icons/ellipsis.svg?component';
import PageHeader from '@mainWindow/components/PageHeader/PageHeader.vue';
import BackButton from '@mainWindow/components/BackButton/BackButton.vue';
import ArtistImage from '@mainWindow/components/ArtistImage/ArtistImage.vue';
import SortWidget from '@mainWindow/components/SortWidget/SortWidget.vue';
import QuickSearchInput from '@mainWindow/components/QuickSearchInput/QuickSearchInput.vue';
import ArtistGroupedItem from './ArtistGroupedItem.vue';

const props = defineProps<{ artistId: string }>();

const { artistsMap, songList } = storeToRefs(useEntitiesStore());

const artist = computed(() => artistsMap.value.get(props.artistId));
const artistSongs = computed(() =>
  songList.value.filter((song) => song.artistId === props.artistId)
);

const { sortKey, order, sortedSongs } = useSongsSort(artistSongs, {
  sortKey: 'Album',
  order: 'Asc',
});
const { searchText, filteredSongs } = useSongsQuickSearch(sortedSongs);
const songGroups = computed(() => groupSongs(filteredSongs.value));
const { selectedSongs, clearSelection, onClickItem, getOrderedSelectedSongIds } =
  useMultiSelectableSongList(filteredSongs);

const { setQueue } = useAudioPlayer();
const onClickPlay = async (songs: Song[]) => {
  const songIds = songs.map((song) => song.id);
  await setQueue(songIds);
};
const onDoubleClickSongRow = async (songs: Song[], index: number) => {
  const songIds = songs.map((song) => song.id);
  await setQueue(songIds, { firstSongIndex: index });
};

const playArtistSongs = async (shuffle: boolean) => {
  const songIds = artistSongs.value.map((song) => song.id);
  await setQueue(songIds, { shuffle });
};

const artistContextMenu = useContextMenu('Artist');
const onClickEllipsisButton = (e: MouseEvent) =>
  artist.value && artistContextMenu.show(e, { artist: artist.value });

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
  <div class="artist-page">
    <PageHeader>
      <BackButton :to="$route.query.back ? 'Back' : '/artists'" />
    </PageHeader>

    <div class="artist-header">
      <ArtistImage class="image" />

      <span class="name">{{ formatArtistName(artist?.name) }}</span>

      <div class="actions">
        <Button
          size="sm"
          :icon="PlayIcon"
          :title="`『${formatArtistName(artist?.name)}』の楽曲を再生`"
          @click="playArtistSongs(false)"
        />
        <Button
          size="sm"
          :icon="ShuffleIcon"
          :title="`『${formatArtistName(artist?.name)}』の楽曲をシャッフル再生`"
          @click="playArtistSongs(true)"
        />
        <Button size="sm" :icon="EllipsisIcon" @click="onClickEllipsisButton" />
      </div>
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
      <QuickSearchInput v-model="searchText" />
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
            @click-song-row="(e, index, song) => onClickItem(e, item.baseIndex + index, song.id)"
            @double-click-song-row="(_, index) => onDoubleClickSongRow(item.songs, index)"
            @click-outside-of-list="clearSelection"
            @click-ellipsis-button="(e, _, song) => showContextMenu(e, song)"
            @contextmenu="(e, _, song) => showContextMenu(e, song)"
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

  .image {
    flex-shrink: 0;
    width: 3rem;
    height: 3rem;
    padding: 0.375rem;
  }

  .name {
    flex-grow: 1;
    font-size: map-get($fontSizes, 2xl);
    font-weight: bold;
    @include singleLineClamp;
  }

  .actions {
    flex-shrink: 0;
    align-self: flex-end;
    padding-right: 0.75rem;
    display: flex;
    align-items: center;
    column-gap: 1rem;
  }
}

.widgets {
  height: 3rem;
  padding: 0 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
