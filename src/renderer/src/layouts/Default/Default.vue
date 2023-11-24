<script setup lang="ts">
import { provide, ref } from 'vue';

import LeftSidePane from './LeftSidePane/LeftSidePane.vue';
import CenterPane from './CenterPane/CenterPane.vue';
import RightSidePane from './RightSidePane/RightSidePane.vue';
import ControlsPane from './ControlsPane/ControlsPane.vue';
import SettingsModal from './SettingsModal/SettingsModal.vue';
import LibraryEditModal from './LibraryEditModal/LibraryEditModal.vue';
import { openSettingsModalKey, openLibraryEditModalKey } from '@renderer/utils/injectionKeys';

const isSettingModalOpen = ref(false);
provide(openSettingsModalKey, () => (isSettingModalOpen.value = true));

const isLibraryEditModalOpen = ref(false);
provide(openLibraryEditModalKey, () => (isLibraryEditModalOpen.value = true));
</script>

<template>
  <div class="layout">
    <div class="layout-left" :inert="isSettingModalOpen || isLibraryEditModalOpen">
      <LeftSidePane />
    </div>

    <div class="layout-center" :inert="isSettingModalOpen || isLibraryEditModalOpen">
      <CenterPane />
    </div>

    <div class="layout-right" :inert="isSettingModalOpen || isLibraryEditModalOpen">
      <RightSidePane />
    </div>

    <div class="layout-bottom" :inert="isSettingModalOpen || isLibraryEditModalOpen">
      <ControlsPane />
    </div>

    <div :inert="isLibraryEditModalOpen">
      <SettingsModal v-model:is-open="isSettingModalOpen"></SettingsModal>
    </div>
    <LibraryEditModal v-model:is-open="isLibraryEditModalOpen"></LibraryEditModal>
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
