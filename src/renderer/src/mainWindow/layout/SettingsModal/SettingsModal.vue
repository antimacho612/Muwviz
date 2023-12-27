<script setup lang="ts">
import { computed, ref } from 'vue';

import CloseIcon from '@renderer/assets/icons/close.svg?component';
import SettingsIcon from '@renderer/assets/icons/settings.svg?component';
import LibraryIcon from '@renderer/assets/icons/library.svg?component';
import SparklesIcon from '@renderer/assets/icons/sparkles.svg?component';
import KeyboardIcon from '@renderer/assets/icons/keyboard.svg?component';
import SystemIcon from '@renderer/assets/icons/system.svg?component';
import InformationIcon from '@renderer/assets/icons/information.svg?component';
import ChevronRightIcon from '@renderer/assets/icons/chevron-right.svg?component';
import TabMenu from '@renderer/commonComponents/TabMenu/TabMenu.vue';
import Modal from '@renderer/commonComponents/Modal/Modal.vue';
import Button from '@renderer/commonComponents/Button/Button.vue';
import LibraryTab from './LibraryTab.vue';
import AppearanceTab from './AppearanceTab.vue';
import SystemTab from './SystemTab.vue';
import HotKeyTab from './HotKeyTab.vue';
import AboutTab from './AboutTab.vue';

const props = defineProps<{ isOpen: boolean }>();
const emits = defineEmits<{ 'update:isOpen': [value: boolean] }>();

const opened = computed({
  get: () => props.isOpen,
  set: (value: boolean) => emits('update:isOpen', value),
});

const activeMenuIndex = ref(0);
const TABS = [
  {
    title: 'Library',
    icon: LibraryIcon,
    component: LibraryTab,
  },
  {
    title: 'Appearance',
    icon: SparklesIcon,
    component: AppearanceTab,
  },
  {
    title: 'System',
    icon: SystemIcon,
    component: SystemTab,
  },
  {
    title: 'Hot Key',
    icon: KeyboardIcon,
    component: HotKeyTab,
  },
  {
    title: 'About',
    icon: InformationIcon,
    component: AboutTab,
  },
] as const;
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
            <SettingsIcon style="width: 1.75rem; height: 1.75rem" />
            <h3>設定</h3>
          </div>
          <Button :icon="CloseIcon" text @click="emits('update:isOpen', false)"></Button>
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
    transition: color $transitionDuration;
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
