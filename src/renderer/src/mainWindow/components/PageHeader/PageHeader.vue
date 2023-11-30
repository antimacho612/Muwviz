<script setup lang="ts">
import { useWindowStore } from '@mainWindow/stores/window';

import { XMarkIcon } from '@heroicons/vue/24/solid';
import Button from '@renderer/commonComponents/Button/Button.vue';

const { collapseLeftSidePane } = useWindowStore();
</script>

<template>
  <div
    class="flex align-items-centere justify-content-between"
    style="height: 2.5rem; margin-bottom: 0.5rem"
  >
    <h2 v-if="$slots.title" class="font-bold">
      <slot name="title"></slot>
    </h2>
    <div class="flex-grow-1">
      <slot></slot>
    </div>
    <Button
      size="sm"
      :icon="XMarkIcon"
      text
      class="flex-grow-0 flex-shrink-0"
      @click="collapseLeftSidePane"
    />
  </div>
</template>
@renderer/mainWindow/stores/window
