<script setup lang="ts">
import { useWindowStore } from '@mainWindow/stores/window';

import CloseIcon from '@renderer/assets/icons/close.svg?component';
import Button from '@renderer/commonComponents/Button/Button.vue';

const { collapseLeftSidePane } = useWindowStore();
</script>

<template>
  <div class="h-3rem pb-2 flex align-items-center justify-content-between column-gap-4">
    <h2 v-if="$slots.title" class="font-bold">
      <slot name="title"></slot>
    </h2>

    <div class="flex-grow-1">
      <slot></slot>
    </div>

    <Button
      size="sm"
      :icon="CloseIcon"
      text
      class="flex-grow-0 flex-shrink-0"
      @click="collapseLeftSidePane"
    />
  </div>
</template>
