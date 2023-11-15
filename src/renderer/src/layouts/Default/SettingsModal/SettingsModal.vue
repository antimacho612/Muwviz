<script setup lang="ts">
import { computed, ref } from 'vue';

import { XMarkIcon } from '@heroicons/vue/24/outline';
import { Cog6ToothIcon } from '@heroicons/vue/24/solid';

import Modal from '@renderer/components/base/Modal/Modal.vue';
import Button from '@renderer/components/base/Button/Button.vue';
import LibraryTab from './LibraryTab.vue';
import ThemeTab from './ThemeTab.vue';

const props = defineProps<{ isOpen: boolean }>();
const emits = defineEmits<{ 'update:isOpen': [value: boolean] }>();

const opened = computed({
  get: () => props.isOpen,
  set: (value: boolean) => emits('update:isOpen', value),
});

const TABS = [
  {
    title: 'Library',
    component: LibraryTab,
  },
  {
    title: 'Theme',
    component: ThemeTab,
  },
] as const;
const activeMenuIndex = ref(0);

const close = () => {
  emits('update:isOpen', false);
};
</script>

<template>
  <Modal v-model:is-open="opened">
    <div class="modal-content">
      <div class="content-grid">
        <div class="header">
          <h3 class="title">
            <Cog6ToothIcon style="width: 1.75rem; height: 1.75rem; color: inherit" />
            設定
          </h3>
          <Button class="modal-close-button" :icon="XMarkIcon" text @click="close" />
        </div>
        <div class="tab-menu">
          <button
            v-for="(tab, i) in TABS"
            :key="tab.title"
            type="button"
            class="tab-button"
            :class="{ active: i === activeMenuIndex }"
          >
            {{ tab.title }}
          </button>
          <div class="active-menu-color"></div>
        </div>
        <div class="tab-panel">
          <Transition mode="out-in" enter-active-class="fadeIn" leave-active-class="fadeOut">
            <KeepAlive>
              <component :is="TABS[activeMenuIndex].component" />
            </KeepAlive>
          </Transition>
        </div>
      </div>
    </div>
  </Modal>
</template>

<style lang="scss" scoped>
.modal-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 75rem;
  height: 90%;

  background-color: var(--background-color);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  border-radius: $borderRadiusLg;
  cursor: default;
}

.content-grid {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: grid;
  grid:
    'header  header' 4rem
    'tabMenu tabPanel' 1fr
    / 10rem 1fr;
}

.header {
  grid-area: header;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  overflow: hidden;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: map-get($fontSizes, 2xl);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.tab-menu {
  grid-area: tabMenu;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  height: 100%;
}

.tab-button {
  height: 2rem;
  width: 100%;
  font-size: map-get($fontSizes, lg);
  font-weight: 500;
  color: var(--secondary-text-color);
  background: var(--background-color);
  border: none;
  cursor: pointer;

  &.active {
    color: var(--primary-color);
  }

  &:hover {
    color: var(--primary-color);
  }
}

.active-menu-color {
  position: absolute;
  height: 2rem;
  width: 4.5rem;
  left: 0;
  border-radius: $borderRadiusSm;
  box-shadow: $innerShadow;
  transition: transform $transitionDuration cubic-bezier(0.66, -0.3, 0.33, 1.4);
  pointer-events: none;
}

.tab-panel {
  grid-area: tabPanel;
}

.fadeIn {
  @include animation($name: fadeIn);
}

.fadeOut {
  @include animation($name: fadeOut);
}
</style>
