<script setup lang="ts">
import { ref } from 'vue';

import { ChevronUpIcon } from '@heroicons/vue/24/outline';
import Button from '@renderer/commonComponents/Button/Button.vue';

interface Props {
  title: string;
}

defineProps<Props>();

const isCollapsed = ref(false);
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
      ></Button>
    </div>

    <div class="config-content">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
}

.title {
  font-weight: bold;
  font-size: map-get($map: $fontSizes, $key: xl);
}

.divider {
  flex: 1 1 auto;
  height: 2px;
  background: var(--divider-color);
}

.toggle-button :deep(.c-btn-icon) {
  transition: transform $transitionDuration ease-in-out;
}

.config-group.is-collapsed .toggle-button :deep(.c-btn-icon) {
  transform: rotate(-180deg);
}
</style>
