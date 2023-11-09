<script setup lang="ts">
import type { Component } from 'vue';
import { computed, useAttrs, useSlots } from 'vue';

const attrs = useAttrs();
const slots = useSlots();

interface Props {
  label?: string;
  icon?: Component;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  text?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  rounded: false,
  text: false,
});

const disabled = computed(() => !!attrs.disabled || attrs.disabled === '');
const isIconOnly = computed(() => props.icon && !props.label && !slots.default);
</script>

<template>
  <button
    v-ripple
    type="button"
    class="c-btn"
    :class="{
      'c-disalbed': disabled,
      'c-btn-xs': props.size === 'xs',
      'c-btn-sm': props.size === 'sm',
      'c-btn-lg': props.size === 'lg',
      'c-btn-text': props.text,
      'c-btn-icon-only': isIconOnly,
    }"
    :disabled="disabled"
  >
    <slot>
      <Component :is="props.icon" v-if="props.icon" class="c-btn-icon" />
      <span class="c-btn-label">{{ props.label || '&nbsp;' }}</span>
    </slot>
  </button>
</template>
