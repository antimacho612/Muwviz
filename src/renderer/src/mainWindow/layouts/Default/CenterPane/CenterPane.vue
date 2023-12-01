<script setup lang="ts">
import { inject } from 'vue';
import { openSettingsModalKey } from '@renderer/mainWindow/injectionKeys';

import { Cog6ToothIcon, WrenchIcon } from '@heroicons/vue/24/solid';
import Visualizer from './Visualizer.vue';
import Button from '@renderer/commonComponents/Button/Button.vue';

const openSettingsModal = inject(openSettingsModalKey);

const onClickOpenConfigWindowButton = () => {
  // TODO: default window size
  window.electronAPI.invoke.openVisualizerConfigWindow();
};
</script>

<template>
  <div class="center-pane">
    <div class="head">
      <Button text :icon="Cog6ToothIcon" title="設定" @click="openSettingsModal?.()" />
    </div>
    <div class="visualizer-container">
      <Visualizer />
      <button
        type="button"
        class="open-config-window-button"
        @click="onClickOpenConfigWindowButton"
      >
        <WrenchIcon style="width: 1.5rem; height: 1.5rem" />
      </button>
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

.open-config-window-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.5rem;
  margin: 0;
  background: transparent;
  color: var(--secondary-text-color);
  border: none;
  cursor: pointer;
  opacity: 0;
  visibility: hidden;
  transition:
    color $transitionDuration,
    opacity $transitionDuration;

  &:hover {
    color: var(--primary-text-color);
  }
}

.visualizer-container:hover > .open-config-window-button {
  visibility: visible;
  opacity: 1;
}
</style>
