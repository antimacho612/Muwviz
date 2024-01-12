<script setup lang="ts">
import { provide, ref } from 'vue';
import { openPresetModalKey } from './injectionKeys';
import { storeToRefs } from 'pinia';
import { useWindowStore } from '@visualizerConfigWindow/stores/window';
import { useAppearance } from '@renderer/commonComposables/useAppearance';
import { useIpcEventHandler } from '@visualizerConfigWindow/composables/useIpcEventHandler';

import TabMenu from '@renderer/commonComponents/TabMenu/TabMenu.vue';
import Titlebar from '@renderer/commonComponents/Titlebar/Titlebar.vue';
import VisualizerConfig from '@visualizerConfigWindow/components/VisualizerConfig.vue';
import PresetModal from '@visualizerConfigWindow/components/PresetModal.vue';

const { isAlwaysOnTop, currentVisualizerIndex, fontFamily, theme, primaryColor } = storeToRefs(useWindowStore());

useAppearance(fontFamily, theme, primaryColor);

const onClickMinimizeButton = async () => await window.electron.invoke.minimizeWindow(false);
const onClickCloseButton = async () => await window.electron.invoke.closeWindow(false);
const onClickPinButton = async () => {
  await window.electron.invoke.setWindowAlwaysOnTop(false, !isAlwaysOnTop.value);
  isAlwaysOnTop.value = !isAlwaysOnTop.value;
};

useIpcEventHandler();

const isPresetModalOpen = ref(false);
provide(openPresetModalKey, () => (isPresetModalOpen.value = true));
</script>

<template>
  <Titlebar
    :show-title="false"
    :show-maximize-button="false"
    show-pin-button
    :pinned="isAlwaysOnTop"
    @click-minimize-button="onClickMinimizeButton"
    @click-close-button="onClickCloseButton"
    @click-pin-button="onClickPinButton"
  />
  <div class="main">
    <h2 class="text-lg ml-1">ビジュアライザー</h2>
    <div :inert="isPresetModalOpen">
      <TabMenu
        v-model:active-menu-index="currentVisualizerIndex"
        :tabs="[{ title: 'No.1 (左)' }, { title: 'No.2 (右上)' }, { title: 'No.3 (右下)' }]"
        direction="horizontal"
        tab-button-class="tab-menu-button"
      />
    </div>
    <div :inert="isPresetModalOpen" class="tab-panel">
      <VisualizerConfig :current-visualizer-index="currentVisualizerIndex" />
    </div>

    <PresetModal v-model:is-open="isPresetModalOpen" />
  </div>
</template>

<style lang="scss" scoped>
.main {
  position: relative;
  height: 100%;
  width: 100%;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

:deep(.tab-menu-button) {
  font-size: map-get($map: $fontSizes, $key: sm);
  @media (min-width: 400px) {
    font-size: map-get($map: $fontSizes, $key: md);
  }
  font-size: map-get($map: $fontSizes, $key: sm);
  justify-content: center;
}

.tab-panel {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
