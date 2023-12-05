<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useDebounceFn } from '@vueuse/core';

interface Props {
  scrollerHeight: string;
  items: unknown[];
  keyField: string;
  itemHeight: number;
  baseItemWidth: number;
}
const props = defineProps<Props>();

const scrollerWrapperEl = ref<HTMLDivElement>();
const itemWidth = ref(props.baseItemWidth);
const itemsPerRow = ref(1);
const SCROLLER_WRAPPER_PADDING = 40; // paddingX(32) + scrollbar(8);

const resizeScroller = () => {
  if (scrollerWrapperEl.value) {
    const scrollerWidth = scrollerWrapperEl.value.clientWidth - SCROLLER_WRAPPER_PADDING;
    itemsPerRow.value = Math.floor(scrollerWidth / props.baseItemWidth);
    itemWidth.value = scrollerWidth / itemsPerRow.value;
  } else {
    itemsPerRow.value = 1;
    itemWidth.value = props.baseItemWidth;
  }
};

onMounted(() => resizeScroller());
const onResizeScroller = useDebounceFn(resizeScroller, 300);
</script>

<template>
  <div ref="scrollerWrapperEl" class="scroller-wrapper">
    <RecycleScroller
      class="grid-scroller"
      :items="items"
      :key-field="keyField"
      :item-size="itemHeight"
      :item-secondary-size="itemWidth"
      :grid-items="itemsPerRow"
      :buffer="100"
      direction="vertical"
      @resize="onResizeScroller"
    >
      <template #default="{ item, index }">
        <div class="grid-item-container">
          <slot :item="item" :index="index"></slot>
        </div>
      </template>
    </RecycleScroller>
  </div>
</template>

<style scoped>
.scroller-wrapper {
  height: v-bind(scrollerHeight);
  width: 100%;
  overflow: hidden;
}

.grid-scroller {
  width: 100%;
  height: 100%;
  padding: 0 1rem;
}

.grid-item-container {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  overflow: hidden;
}
</style>
