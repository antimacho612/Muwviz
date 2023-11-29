<script setup lang="ts">
import { computed, ref } from 'vue';

import { XMarkIcon } from '@heroicons/vue/24/outline';
import {
  Cog6ToothIcon,
  SparklesIcon,
  BuildingLibraryIcon,
  ChevronRightIcon,
  ComputerDesktopIcon,
} from '@heroicons/vue/24/solid';

import Modal from '@renderer/components/base/Modal/Modal.vue';
import TabMenu from '@renderer/components/TabMenu/TabMenu.vue';
import Button from '@renderer/components/base/Button/Button.vue';
import LibraryTab from './LibraryTab.vue';
import AppearanceTab from './AppearanceTab.vue';
import SystemTab from './SystemTab.vue';

const props = defineProps<{ isOpen: boolean }>();
const emits = defineEmits<{ 'update:isOpen': [value: boolean] }>();

const opened = computed({
  get: () => props.isOpen,
  set: (value: boolean) => emits('update:isOpen', value),
});

const TABS = [
  {
    title: 'Library',
    icon: BuildingLibraryIcon,
    component: LibraryTab,
  },
  {
    title: 'Appearance',
    icon: SparklesIcon,
    component: AppearanceTab,
  },
  {
    title: 'System',
    icon: ComputerDesktopIcon,
    component: SystemTab,
  },
] as const;
const activeMenuIndex = ref(0);

const close = () => emits('update:isOpen', false);
</script>

<template>
  <Modal
    v-model:is-open="opened"
    :close-on-click-outside="false"
    :close-on-press-esc="false"
    :z-index="1500"
  >
    <div class="settings-modal">
      <div class="content-grid">
        <div class="header">
          <div class="title" style="">
            <Cog6ToothIcon style="width: 1.75rem; height: 1.75rem" />
            <h3>設定</h3>
          </div>
          <Button :icon="XMarkIcon" text @click="close"></Button>
        </div>

        <TabMenu
          v-model:active-menu-index="activeMenuIndex"
          :tabs="TABS.map((tab) => ({ title: tab.title, icon: tab.icon }))"
          direction="vertical"
          size="lg"
          tab-button-class="settings-tab-menu-button"
          class="settings-tab-menu"
        >
          <template #active-menu-color>
            <ChevronRightIcon class="active-menu-color-icon" />
          </template>
        </TabMenu>

        <div class="tab-panel-container">
          <Transition
            mode="out-in"
            enter-active-class="tab-panel-fade-in"
            leave-active-class="tab-panel-fade-out"
          >
            <KeepAlive>
              <component :is="TABS[activeMenuIndex].component"></component>
            </KeepAlive>
          </Transition>
        </div>
      </div>
    </div>
  </Modal>
</template>

<style lang="scss" scoped>
.settings-modal {
  position: absolute;
  @include positionCenterXY;
  width: 90%;
  max-width: 75rem;
  height: 90%;
  background: var(--background-color);
  border-radius: $borderRadiusLg;
  box-shadow:
    0px 9px 46px 8px rgba(0, 0, 0, 0.12),
    0px 24px 38px 3px rgba(0, 0, 0, 0.14),
    0px 11px 15px rgba(0, 0, 0, 0.2);
}

.content-grid {
  display: grid;
  grid:
    'header  header' 4rem
    'tabMenu tabPanel' 1fr
    / 15rem 1fr;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.header {
  grid-area: header;
  padding: 0.5rem 1rem;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;

  .title {
    display: flex;
    align-items: center;
    column-gap: 0.5rem;

    h3 {
      font-size: map-get($map: $fontSizes, $key: 2xl);
    }
  }
}

.settings-tab-menu {
  grid-area: tabMenu;

  :deep(.settings-tab-menu-button) {
    padding-left: 0.75rem;
    font-size: map-get($map: $fontSizes, $key: lg);
  }

  .active-menu-color-icon {
    position: absolute;
    @include positionCenterY;
    right: 0.5rem;
    height: 1.25rem;
    width: 1.25rem;
    color: var(--primary-color);
    transition: color var(--transition-duration);
  }
}

.tab-panel-container {
  grid-area: tabPanel;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  overflow: hidden;
}

.tab-panel-fade-in {
  @include animation($name: fadeIn);
}

.tab-panel-fade-out {
  @include animation($name: fadeOut);
}
</style>
