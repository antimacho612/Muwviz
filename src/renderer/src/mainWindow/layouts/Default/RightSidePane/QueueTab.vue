<script setup lang="ts">
import { ref } from 'vue';
import { useAudioPlayer } from '@renderer/mainWindow/composables/useAudioPlayer';
import { useEntitiesStore } from '@renderer/mainWindow/stores/entities';

import QueueItem from './QueueItem.vue';

const { queueItems, currentSongIndex, playSongInQueue, removeSongsFromQueue } = useAudioPlayer();
const { songsMap } = useEntitiesStore();

const scroller = ref();
const scrollToCurrentSong = () => {
  if (scroller.value && queueItems.value.length > 0) {
    const scrollTo = currentSongIndex.value === -1 ? 0 : currentSongIndex.value;
    scroller.value.scrollToItem(scrollTo);
  }
};

const onClickDeleteButton = (queueId: string) => removeSongsFromQueue(queueId);
const onDoubleClickRow = async (queueId: string) => await playSongInQueue(queueId);
const showContextMenu = (_: MouseEvent) => {
  // TODO: コンテキストメニュー表示
  alert('show context menu');
};
</script>

<template>
  <div class="queue-tab">
    <template v-if="!queueItems.length">キューが空です👀</template>
    <template v-else>
      <div class="queue-list">
        <RecycleScroller
          ref="scroller"
          class="queue-scroller"
          :items="queueItems"
          :item-size="44"
          key-field="queueId"
          direction="vertical"
          @visible="scrollToCurrentSong"
        >
          <template #default="{ item, index }">
            <QueueItem
              :index="index"
              :queue-id="item.queueId"
              :song="songsMap.get(item.songId)"
              @click-delete-button="onClickDeleteButton(item.queueId)"
              @double-click-row="onDoubleClickRow(item.queueId)"
              @contextmenu="showContextMenu"
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
