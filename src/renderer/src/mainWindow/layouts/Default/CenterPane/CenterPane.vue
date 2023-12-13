<script setup lang="ts">
import { inject } from 'vue';
import { openSettingsModalKey } from '@renderer/mainWindow/injectionKeys';

import SettingsIcon from '@renderer/assets/icons/settings.svg?component';
import Visualizers from './Visualizers.vue';
import Button from '@renderer/commonComponents/Button/Button.vue';

const openSettingsModal = inject(openSettingsModalKey);
</script>

<template>
  <div class="center-pane">
    <div class="head">
      <Button text :icon="SettingsIcon" title="設定" @click="openSettingsModal?.()" />
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
