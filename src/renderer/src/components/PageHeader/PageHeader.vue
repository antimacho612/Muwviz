<script setup lang="ts">
import { inject } from 'vue';
import { expandSidebarKey } from '@renderer/utils/injectionKeys';

import { XMarkIcon } from '@heroicons/vue/24/solid';
import Button from '@renderer/components/base/Button/Button.vue';

const expandSidebar = inject(expandSidebarKey);
const onClickCloseButton = () => expandSidebar?.();
</script>

<template>
  <div class="page-header">
    <h2 class="header-title">
      <slot name="title"></slot>
    </h2>
    <div class="header-actions">
      <slot name="actions"></slot>
    </div>
    <Button size="sm" :icon="XMarkIcon" text @click="onClickCloseButton" />
  </div>
</template>

<style lang="scss">
.page-header {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .header-title {
    font-weight: bold;
  }

  .header-actions {
    flex-grow: 1;
  }
}
</style>
