<script setup lang="ts">
import { ref } from 'vue';
import { useEventListener } from '@vueuse/core';
import { useContextMenu } from '@renderer/utils/useContextMenu';
import { Song } from '@shared/types';

import SongListItem from './SongListItem.vue';

const props = defineProps<{ songs: Song[] }>();
const emits = defineEmits<{
  clickArtwork: [songId: string];
  doubleClickRow: [songId: string];
}>();

const selectedSongs = ref(new Set<string>());

const selectAll = () => {
  selectedSongs.value = new Set(props.songs.map((song) => song.id));
};
const clearSelection = () => selectedSongs.value.clear();

let keyPressed: 'Shift' | 'Control' | undefined;
let currentIndex = 0;

const onClickRow = (index: number, id: string) => {
  if (keyPressed === 'Control') {
    if (selectedSongs.value.has(id)) {
      selectedSongs.value.delete(id);
    } else {
      selectedSongs.value.add(id);
    }
    currentIndex = index;
  } else if (keyPressed === 'Shift') {
    if (selectedSongs.value.size === 0) {
      selectedSongs.value.add(id);
    } else {
      const from = Math.min(currentIndex, index);
      const to = Math.max(currentIndex, index);
      selectedSongs.value = new Set(props.songs.slice(from, to + 1).map((song) => song.id));
    }
  } else {
    selectedSongs.value = new Set([id]);
    currentIndex = index;
  }
};

const onKeyDown = (e: KeyboardEvent) => {
  if ((e.target as HTMLElement)?.tagName?.toLocaleLowerCase() === 'input') {
    clearSelection();
    return;
  }

  if (e.shiftKey || e.ctrlKey) {
    keyPressed = e.key as 'Shift' | 'Control';
  }

  if (e.ctrlKey && e.key === 'a') {
    selectAll();
  }
};

const onKeyUp = (e: KeyboardEvent) => {
  if (
    (e.key === 'Shift' && keyPressed === 'Shift') ||
    (e.key === 'Control' && keyPressed === 'Control')
  ) {
    keyPressed = undefined;
  }
};

useEventListener(document, 'keydown', onKeyDown);
useEventListener(document, 'keyup', onKeyUp);

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
      :item-size="48"
      key-field="id"
      direction="vertical"
    >
      <template #default="{ item, index }">
        <SongListItem
          :index="index"
          :song="item"
          :selected="selectedSongs.has(item.id)"
          @click-row="onClickRow(index, item.id)"
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
  height: calc(100% - 48px - 56px);
  overflow: hidden;
}

.songs-scroller {
  width: 100%;
  height: 100%;
  padding: 0 0.5rem;
}
</style>
