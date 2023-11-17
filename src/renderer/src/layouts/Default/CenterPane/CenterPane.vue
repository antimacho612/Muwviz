<script setup lang="ts">
import { inject } from 'vue';
import { openSettingsModalKey } from '@renderer/utils/injectionKeys';

import { Cog6ToothIcon } from '@heroicons/vue/24/solid';
import Visualizer from './Visualizer.vue';
import Button from '@renderer/components/base/Button/Button.vue';

const openSettingsModal = inject(openSettingsModalKey);
</script>

<template>
  <div class="center-pane">
    <div class="head">
      HEAD
      <Button text :icon="Cog6ToothIcon" title="設定" @click="openSettingsModal?.()" />
    </div>
    <div class="visualizer-container">
      <Visualizer />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.center-pane {
  height: 100%;
  max-height: 100%;
  overflow: hidden;
}

.head {
  height: 3.5rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.visualizer-container {
  position: relative;
  width: 100%;
  height: calc(100% - 3.5rem);
  border-radius: $borderRadiusLg;
}
</style>
