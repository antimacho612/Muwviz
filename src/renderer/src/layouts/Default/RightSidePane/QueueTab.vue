<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useAudioPlayer } from '@renderer/utils/useAudioPlayer';
import { useEntitiesStore } from '@renderer/stores/entities';

import QueueItem from './QueueItem.vue';

const { songQueue, currentSongIndex } = useAudioPlayer();
const { songs } = useEntitiesStore();

const scroller = ref();

const listItems = computed(() =>
  songQueue.value.map((songId) => songs.find((song) => song.id === songId))
);

const scrollToCurrentSong = () => {
  if (scroller.value && songQueue.value.length > 0) {
    const scrollTo = currentSongIndex.value === -1 ? 0 : currentSongIndex.value;
    scroller.value.scrollToItem(scrollTo);
  }
};
watch(currentSongIndex, scrollToCurrentSong);

const onClickDeleteButton = (index: number) => {
  // TODO: キューから指定した曲を削除
  alert(`削除します, index: ${index}`);
};
</script>

<template>
  <div class="queue-tab">
    <template v-if="!songQueue.length">キューが空です👀</template>
    <template v-else>
      <div class="queue-list">
        <RecycleScroller
          ref="scroller"
          class="queue-scroller"
          :items="listItems"
          :item-size="40"
          key-field="id"
          direction="vertical"
          @visible="scrollToCurrentSong"
        >
          <template #default="{ item, index }">
            <QueueItem
              :index="index"
              :song="item"
              @click-delete-button="onClickDeleteButton(index)"
            />
          </template>
        </RecycleScroller>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.queue-tab {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  overflow: hidden;
}

.queue-list {
  height: 100%;
  width: 100%;
  overflow-y: auto;
}

.queue-scroller {
  width: 100%;
  height: 100%;
  padding-right: 0.5rem;
}
</style>
