<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useWindowStore } from '@visualizerConfigWindow/stores/window';
import { useAppearance } from '@renderer/commonComposables/useAppearance';
import { useIpcEventHandler } from '@renderer/mainWindow/composables/useIpcEventHandler';

import Titlebar from '@renderer/commonComponents/Titlebar/Titlebar.vue';
import VisualizerConfig from '@visualizerConfigWindow/components/VisualizerConfig.vue';

const { fontFamily, theme, primaryColor } = storeToRefs(useWindowStore());

useAppearance(fontFamily, theme, primaryColor);

const onClickMinimizeButton = async () => await window.electronAPI.invoke.minimizeWindow(false);
const onClickCloseButton = async () => await window.electronAPI.invoke.closeWindow(false);

useIpcEventHandler();
</script>

<template>
  <Titlebar
    :show-title="false"
    :show-maximize-button="false"
    @click-minimize-button="onClickMinimizeButton"
    @click-close-button="onClickCloseButton"
  ></Titlebar>
  <div class="layout">
    <VisualizerConfig></VisualizerConfig>
  </div>
</template>

<style scoped>
.layout {
  position: relative;
  height: 100%;
  width: 100%;
  padding: 0.5rem;
  overflow: hidden;
}
</style>
