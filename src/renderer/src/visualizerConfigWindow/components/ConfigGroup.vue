<script setup lang="ts">
import { ref } from 'vue';

import { ChevronUpIcon } from '@heroicons/vue/24/outline';
import Button from '@renderer/commonComponents/Button/Button.vue';

defineProps<{ title: string }>();

const contentEl = ref<HTMLDivElement>();
const isCollapsed = ref(false);

const setHeightToContentDiv = (height?: '0' | 'scrollHeight') => {
  if (!contentEl.value) return;
  if (height === '0') contentEl.value.style.height = height;
  else if (height === 'scrollHeight')
    contentEl.value.style.height = `${contentEl.value?.scrollHeight}px`;
  else contentEl.value.style.height = '';
};
</script>

<template>
  <div class="config-group" :class="{ 'is-collapsed': isCollapsed }">
    <div class="header">
      <span class="title">{{ title }}</span>
      <span class="divider"></span>
      <Button
        size="xs"
        text
        :icon="ChevronUpIcon"
        class="toggle-button"
        @click="isCollapsed = !isCollapsed"
      />
    </div>

    <Transition
      enter-active-class="fade-in"
      leave-active-class="fade-out"
      @before-enter="setHeightToContentDiv('0')"
      @enter="setHeightToContentDiv('scrollHeight')"
      @after-enter="setHeightToContentDiv()"
      @before-leave="setHeightToContentDiv('scrollHeight')"
      @leave="setHeightToContentDiv('0')"
    >
      <div v-show="!isCollapsed" ref="contentEl" class="config-content">
        <slot></slot>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.config-group {
  width: 100%;
  padding: 0 0.5rem;
}

.header {
  position: sticky;
  top: 0;
  left: 0;
  background: var(--background-color);
  padding: 0.5rem 0;
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
  z-index: 51;
}

.title {
  font-weight: bold;
  font-size: map-get($map: $fontSizes, $key: lg);
}

.divider {
  flex: 1 1 auto;
  height: 2px;
  background: var(--divider-color);
}

.toggle-button :deep(.c-btn-icon) {
  transition: transform $transitionDuration ease-in-out;
}

.config-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  row-gap: 1rem;
  padding: 0 1rem;
  transition: all $transitionDuration;
}

.config-group.is-collapsed {
  .toggle-button :deep(.c-btn-icon) {
    transform: rotate(180deg);
  }

  .config-content {
    overflow: hidden;
  }
}

.fade-in {
  @include animation($name: fadeIn);
}

.fade-out {
  @include animation($name: fadeOut);
}
</style>
