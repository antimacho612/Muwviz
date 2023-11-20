<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGridScroller } from '@renderer/utils/useGridScroller';
import { useDebounceFn } from '@vueuse/core';
import { useEntitiesStore } from '@renderer/stores/entities';

import AlbumListItem from './AlbumListItem.vue';

const { albumList } = useEntitiesStore();

const [BASE_ITEM_WIDTH, ITEM_HEIGHT] = [176, 216];
const SCROLLER_WRAPPER_PADDING = 40; // paddingX(32) + scrollbar(8);
const scrollerWrapperEl = ref<HTMLDivElement>();
const { itemWidth, itemsPerRow, resizeScroller } = useGridScroller(
  scrollerWrapperEl,
  SCROLLER_WRAPPER_PADDING,
  BASE_ITEM_WIDTH
);
const onResizeScroller = useDebounceFn(resizeScroller, 300);

const router = useRouter();
const onClickItem = (albumId: string) => router.push(`albums/${albumId}`);
</script>

<template>
  <div class="album-list">
    <div ref="scrollerWrapperEl" class="scroller-wrapper">
      <RecycleScroller
        class="albums-scroller"
        :items="albumList"
        :item-size="ITEM_HEIGHT"
        :item-secondary-size="itemWidth"
        :grid-items="itemsPerRow"
        :buffer="100"
        key-field="id"
        direction="vertical"
        @resize="onResizeScroller"
      >
        <template #default="{ item }">
          <AlbumListItem :album="item" @click-item="onClickItem(item.id)" />
        </template>
      </RecycleScroller>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.album-list {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.scroller-wrapper {
  height: calc(100% - 96px);
  overflow: hidden;
}

.albums-scroller {
  width: 100%;
  height: 100%;
  padding: 0 1rem;
}
</style>
