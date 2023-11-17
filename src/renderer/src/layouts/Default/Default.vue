<script setup lang="ts">
import { provide, ref } from 'vue';

import LeftSidePane from './LeftSidePane/LeftSidePane.vue';
import CenterPane from './CenterPane/CenterPane.vue';
import RightSidePane from './RightSidePane/RightSidePane.vue';
import ControlsPane from './ControlsPane/ControlsPane.vue';
import SettingsModal from './SettingsModal/SettingsModal.vue';
import { openSettingsModalKey } from '@renderer/utils/injectionKeys';

const isSettingModalOpen = ref(false);
provide(openSettingsModalKey, () => (isSettingModalOpen.value = true));
</script>

<template>
  <div class="layout">
    <div class="layout-left" :inert="isSettingModalOpen">
      <LeftSidePane />
    </div>

    <div class="layout-center" :inert="isSettingModalOpen">
      <CenterPane />
    </div>

    <div class="layout-right" :inert="isSettingModalOpen">
      <RightSidePane />
    </div>

    <div class="layout-bottom" :inert="isSettingModalOpen">
      <ControlsPane />
    </div>

    <SettingsModal v-model:is-open="isSettingModalOpen" />
  </div>
</template>

<style lang="scss" scoped>
.layout {
  position: relative;
  display: grid;
  grid-template:
    'left   center right ' 1fr
    'bottom bottom bottom' $bottomHeight
    / #{$sidebarCollapsedWidth + 1rem} 1fr 360px;
  height: 100%;
  max-height: 100%;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.layout-left {
  grid-area: left;
  position: relative;
  height: calc(100vh - $titleBarHeight - $bottomHeight);
  padding: 0.5rem;
  z-index: 1;
}

.layout-center {
  grid-area: center;
  position: relative;
  padding: 0.5rem;
  overflow: hidden;
}

.layout-bottom {
  grid-area: bottom;
  position: relative;
  padding: 0 0.5rem 0.5rem;
  z-index: 2;
}

.layout-right {
  grid-area: right;
  position: relative;
  padding: 0.5rem;
  overflow: hidden;
}
</style>
