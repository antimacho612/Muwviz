<script setup lang="ts">
import { provide, ref } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useWindowStore } from '@mainWindow/stores/window';
import { openSettingsModalKey, openLibraryEditModalKey } from '@mainWindow/injectionKeys';

import LeftSidePane from './LeftSidePane/LeftSidePane.vue';
import CenterPane from './CenterPane/CenterPane.vue';
import RightSidePane from './RightSidePane/RightSidePane.vue';
import ControlsPane from './ControlsPane/ControlsPane.vue';
import SettingsModal from './SettingsModal/SettingsModal.vue';
import LibraryEditModal from './LibraryEditModal/LibraryEditModal.vue';

const windowStore = useWindowStore();
const { isLeftSidePaneCollapsed, isRightSidePaneCollapsed } = storeToRefs(windowStore);

onBeforeRouteUpdate((_to, _from, next) => {
  windowStore.expandLeftSidePane();
  next();
});

const isSettingModalOpen = ref(false);
provide(openSettingsModalKey, () => (isSettingModalOpen.value = true));

const isLibraryEditModalOpen = ref(false);
provide(openLibraryEditModalKey, () => (isLibraryEditModalOpen.value = true));
</script>

<template>
  <div class="layout">
    <div class="layout-left" :inert="isSettingModalOpen || isLibraryEditModalOpen">
      <LeftSidePane v-model:is-collapsed="isLeftSidePaneCollapsed" />
    </div>

    <div class="layout-center" :inert="isSettingModalOpen || isLibraryEditModalOpen">
      <CenterPane />
    </div>

    <div class="layout-right" :inert="isSettingModalOpen || isLibraryEditModalOpen">
      <RightSidePane v-model:is-collapsed="isRightSidePaneCollapsed" />
    </div>

    <div class="layout-bottom" :inert="isSettingModalOpen || isLibraryEditModalOpen">
      <ControlsPane />
    </div>

    <div :inert="isLibraryEditModalOpen">
      <SettingsModal v-model:is-open="isSettingModalOpen" />
    </div>

    <LibraryEditModal v-model:is-open="isLibraryEditModalOpen" />
  </div>
</template>

<style lang="scss" scoped>
.layout {
  position: relative;
  display: grid;
  grid-template:
    'left   center right ' 1fr
    'bottom bottom bottom' #{$bottomPaneHeight}
    / auto 1fr auto;
  height: 100%;
  max-height: 100%;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.layout-left {
  grid-area: left;
  width: $leftSidePaneWidth;
  position: relative;
  height: calc(100vh - $titleBarHeight - $bottomPaneHeight);
  padding: $paneGap;
  z-index: 1;
}

.layout-center {
  grid-area: center;
  position: relative;
  padding: $paneGap 0;
  overflow: hidden;
}

.layout-bottom {
  grid-area: bottom;
  position: relative;
  padding: 0 $paneGap $paneGap;
  z-index: 2;
}

.layout-right {
  grid-area: right;
  position: relative;
  padding: $paneGap;
  overflow: hidden;
}
</style>
