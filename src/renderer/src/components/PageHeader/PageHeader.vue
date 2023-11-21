<script setup lang="ts">
import { inject } from 'vue';
import { expandSidebarKey } from '@renderer/utils/injectionKeys';

import { XMarkIcon } from '@heroicons/vue/24/solid';
import Button from '@renderer/components/base/Button/Button.vue';

const expandSidebar = inject(expandSidebarKey);
</script>

<template>
  <div class="page-header">
    <h2 v-if="$slots.title" class="title">
      <slot name="title"></slot>
    </h2>
    <div class="trailing">
      <slot></slot>
    </div>
    <Button size="sm" :icon="XMarkIcon" text class="close-button" @click="expandSidebar?.()" />
  </div>
</template>

<style lang="scss">
.page-header {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .title {
    font-weight: bold;
  }

  .trailing {
    flex-grow: 1;
  }

  .close-button {
    flex: 0 0 auto;
  }
}
</style>
