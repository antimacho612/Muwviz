<script setup lang="ts">
import { ref } from 'vue';

import ChevronLeftIcon from '@renderer/assets/icons/chevron-left.svg?component';
import ChevronRightIcon from '@renderer/assets/icons/chevron-right.svg?component';
import Button from '@renderer/commonComponents/Button/Button.vue';
import TabMenu from '@renderer/commonComponents/TabMenu/TabMenu.vue';
import InfoTab from './InfoTab.vue';
import QueueTab from './QueueTab.vue';
import LyricsTab from './LyricsTab.vue';

defineProps<{ isCollapsed: boolean }>();
const emits = defineEmits<{ 'update:isCollapsed': [value: boolean] }>();

const activeMenuIndex = ref(0);
const TABS = [
  { title: '楽曲情報', component: InfoTab },
  { title: 'キュー', component: QueueTab },
  { title: '歌詞', component: LyricsTab },
] as const;
</script>

<template>
  <div class="right-side-pane" :class="{ 'is-collapsed': isCollapsed }">
    <template v-if="isCollapsed">
      <Button
        size="sm"
        text
        :icon="ChevronLeftIcon"
        class="h-full"
        @click="emits('update:isCollapsed', false)"
      />
    </template>

    <template v-else>
      <div>
        <Button
          size="sm"
          text
          :icon="ChevronRightIcon"
          @click="emits('update:isCollapsed', true)"
        />
      </div>
      <TabMenu
        v-model:active-menu-index="activeMenuIndex"
        :tabs="TABS.map((tab) => ({ title: tab.title }))"
        direction="horizontal"
        tab-button-class="right-side-tab-menu-button"
      />

      <div class="tab-panel">
        <Transition mode="out-in" enter-active-class="fade-in" leave-active-class="fade-out">
          <KeepAlive>
            <component :is="TABS[activeMenuIndex].component" />
          </KeepAlive>
        </Transition>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.right-side-pane {
  display: flex;
  flex-direction: column;
  width: $rightSidePaneWidth;
  height: 100%;
  padding: 0.5rem;
  border-radius: $borderRadiusXl;
  background: var(--background-color);
  box-shadow: $shadow;
  overflow: hidden;

  &.is-collapsed {
    padding: 0;
    width: $rightSidePaneCollapsedWidth;
  }
}

:deep(.right-side-tab-menu-button) {
  justify-content: center;
}

.tab-panel {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.fade-in {
  @include animation($name: fadeIn);
}

.fade-out {
  @include animation($name: fadeOut);
}
</style>
