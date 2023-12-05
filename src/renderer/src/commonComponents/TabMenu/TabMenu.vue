<script setup lang="ts">
import type { Component } from 'vue';
import { computed } from 'vue';

interface Props {
  activeMenuIndex: number;
  tabs: { title: string; icon?: Component }[];
  direction: 'horizontal' | 'vertical';
  size?: 'md' | 'lg';
  tabButtonClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  activeMenuIndex: 0,
  size: 'md',
});

const emits = defineEmits<{ 'update:activeMenuIndex': [activeMenuIndex: number] }>();

const activeIndex = computed({
  get: () => props.activeMenuIndex,
  set: (value) => emits('update:activeMenuIndex', value),
});

const distance = computed(() => {
  if (props.direction === 'vertical') {
    return props.size === 'lg' ? 3 : 2.5;
  } else {
    return 100 / props.tabs.length;
  }
});

const buttonWidth = computed(() =>
  props.direction === 'vertical' ? '100%' : `${distance.value}%`
);
const buttonHeight = computed(() => (props.size === 'lg' ? '2.5rem' : '2rem'));
const activeColorWidth = computed(
  () =>
    props.direction === 'vertical'
      ? 'calc(100% - 1rem)' // 1rem = paddingX
      : `calc((100% - ${1 + 0.5 * (props.tabs.length - 1)}rem) / ${props.tabs.length})` // 1 = paddingX, .5 = column-gap
);
const activeColorTranslation = computed(() =>
  props.direction === 'vertical'
    ? `translateY(${activeIndex.value * distance.value}rem)`
    : `translateX(calc(${100 * activeIndex.value}% + ${activeIndex.value * 0.5}rem))`
);
</script>

<template>
  <div
    class="c-tab-menu"
    :style="{
      flexDirection: direction === 'horizontal' ? 'row' : 'column',
      alignItems: direction === 'horizontal' ? 'center' : undefined,
    }"
  >
    <button
      v-for="(tab, i) in tabs"
      :key="tab.title"
      v-ripple
      type="button"
      class="c-tab-menu-button"
      :class="[{ active: i === activeIndex }, tabButtonClass]"
      :style="{ width: buttonWidth, height: buttonHeight }"
      @click="activeIndex = i"
    >
      <component :is="tab.icon" v-if="tab.icon" style="width: 1.25rem; height: 1.25rem"></component>
      <span>{{ tab.title }}</span>
    </button>

    <div
      class="active-menu-color"
      :style="{ height: buttonHeight, width: activeColorWidth, transform: activeColorTranslation }"
    >
      <slot name="active-menu-color"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.c-tab-menu {
  padding: 0.5rem;
  position: relative;
  display: flex;
  gap: 0.5rem;
}

.c-tab-menu-button {
  display: flex;
  align-items: center;
  column-gap: 0.5rem;

  font-weight: bold;
  background: var(--background-color);
  color: var(--secondary-text-color);
  border: none;
  border-radius: $borderRadiusSm;
  cursor: pointer;

  &.active {
    color: var(--primary-color);
  }

  &:hover {
    color: var(--primary-color);
  }

  &:focus-visible {
    @include focused();
  }
}

.active-menu-color {
  top: 0.5rem;
  left: 0.5rem;
}
</style>
