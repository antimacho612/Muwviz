<script setup lang="ts">
import { computed } from 'vue';
import { useContextMenu } from '@renderer/utils/useContextMenu';
import { useMultiSelectableSongList } from '@renderer/utils/useMultiSelectableSongList';
import { Song } from '@shared/types';

import SongListItem from './SongListItem.vue';

const props = defineProps<{ songs: Song[] }>();
const emits = defineEmits<{
  clickArtwork: [songId: string];
  doubleClickRow: [songId: string];
}>();

const songList = computed(() => props.songs);
const { selectedSongs, clearSelection, onSelectItem } = useMultiSelectableSongList(songList);

const songContextMenu = useContextMenu('SONG');
const songsContextMenu = useContextMenu('SONGS');
const showContextMenu = (e: MouseEvent, song: Song) => {
  if (selectedSongs.value.size > 1) {
    songsContextMenu.show(e, { selectedSongs: selectedSongs.value });
  } else {
    songContextMenu.show(e, { song });
  }
};
</script>

<template>
  <div class="song-list">
    <RecycleScroller
      v-click-outside="clearSelection"
      class="songs-scroller"
      :items="songs"
      :item-size="57"
      key-field="id"
      direction="vertical"
    >
      <template #default="{ item, index }">
        <SongListItem
          :index="index"
          :song="item"
          :selected="selectedSongs.has(item.id)"
          @click-row="onSelectItem(index, item.id)"
          @click-artwork="emits('clickArtwork', item.id)"
          @double-click-row="emits('doubleClickRow', item.id)"
          @click-ellipsis-button="showContextMenu($event, item)"
          @contextmenu="showContextMenu($event, item)"
        />
      </template>
    </RecycleScroller>
  </div>
</template>

<style lang="scss" scoped>
.song-list {
  height: calc(100% - 48px - 48px);
  overflow: hidden;
}

.songs-scroller {
  width: 100%;
  height: 100%;
  padding: 0 0.5rem;
}
</style>
