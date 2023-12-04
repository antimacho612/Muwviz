<script setup lang="ts">
import { ref } from 'vue';

import TabMenu from '@mainWindow/components/TabMenu/TabMenu.vue';
import InfoTab from './InfoTab.vue';
import QueueTab from './QueueTab.vue';
import LyricsTab from './LyricsTab.vue';

const activeMenuIndex = ref(0);
const TABS = [
  {
    title: 'Info',
    component: InfoTab,
  },
  {
    title: 'Queue',
    component: QueueTab,
  },
  {
    title: 'Lyrics',
    component: LyricsTab,
  },
] as const;
</script>

<template>
  <div class="right-side-pane">
    <TabMenu
      v-model:active-menu-index="activeMenuIndex"
      :tabs="TABS.map((tab) => ({ title: tab.title }))"
      direction="horizontal"
      tab-button-class="right-side-tab-menu-button"
    >
    </TabMenu>

    <div class="tab-panel">
      <Transition mode="out-in" enter-active-class="fadeIn" leave-active-class="fadeOut">
        <KeepAlive>
          <component :is="TABS[activeMenuIndex].component" />
        </KeepAlive>
      </Transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.right-side-pane {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  height: 100%;
  padding: 1rem 0.5rem;
  border-radius: $borderRadiusXl;
  background: var(--background-color);
  box-shadow: $shadow;
  overflow: hidden;
}

:deep(.right-side-tab-menu-button) {
  justify-content: center;
}

.tab-panel {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.fadeIn {
  @include animation($name: fadeIn);
}

.fadeOut {
  @include animation($name: fadeOut);
}
</style>
