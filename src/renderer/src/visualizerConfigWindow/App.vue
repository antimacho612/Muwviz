<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useWindowStore } from '@visualizerConfigWindow/stores/window';
import { useAppearance } from '@renderer/commonComposables/useAppearance';

import Titlebar from '@renderer/commonComponents/Titlebar/Titlebar.vue';
import { useIpcEventHandler } from '@renderer/mainWindow/composables/useIpcEventHandler';
import VisualizerConfig from '@visualizerConfigWindow/components/VisualizerConfig.vue';

const { isWindowMaximized, fontFamily, theme, primaryColor } = storeToRefs(useWindowStore());

useAppearance(fontFamily, theme, primaryColor);

const onClickMinimizeButton = async () => await window.electronAPI.invoke.minimizeWindow(false);
const onClickMaximizeButton = async () => await window.electronAPI.invoke.maximizeWindow(false);
const onClickCloseButton = async () => await window.electronAPI.invoke.closeWindow(false);

useIpcEventHandler();
</script>

<template>
  <Titlebar
    :is-window-maximized="isWindowMaximized"
    @click-minimize-button="onClickMinimizeButton"
    @click-maximize-button="onClickMaximizeButton"
    @click-close-button="onClickCloseButton"
  ></Titlebar>
  <div class="layout">
    <VisualizerConfig></VisualizerConfig>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  position: relative;
  height: 100%;
  width: 100%;
  padding: 0.5rem;
  overflow: hidden;
}
</style>
