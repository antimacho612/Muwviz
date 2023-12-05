<script setup lang="ts">
import { inject } from 'vue';
import { openSettingsModalKey } from '@renderer/mainWindow/injectionKeys';

import { Cog6ToothIcon } from '@heroicons/vue/24/solid';
import Visualizers from './Visualizers.vue';
import Button from '@renderer/commonComponents/Button/Button.vue';

const openSettingsModal = inject(openSettingsModalKey);
</script>

<template>
  <div class="center-pane">
    <div class="head">
      <Button text :icon="Cog6ToothIcon" title="設定" @click="openSettingsModal?.()" />
    </div>
    <div class="main">
      <Visualizers />
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

.main {
  width: 100%;
  height: calc(100% - 3.5rem);
  border-radius: $borderRadiusLg;
}
</style>
