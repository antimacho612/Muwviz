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
      'c-btn-xs': size === 'xs',
      'c-btn-sm': size === 'sm',
      'c-btn-lg': size === 'lg',
      'c-btn-text': text,
      'c-btn-icon-only': isIconOnly,
    }"
    :disabled="disabled"
  >
    <slot>
      <Component :is="icon" v-if="icon" class="c-btn-icon" />
      <span class="c-btn-label">{{ label || '&nbsp;' }}</span>
    </slot>
  </button>
</template>

<style lang="scss">
.c-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  line-height: 1;
  font-weight: 500;
  text-align: center;
  height: 3rem;
  border-radius: $borderRadiusFull;
  outline: none;
  cursor: pointer;
  user-select: none;
  text-decoration: none;

  color: var(--secondary-text-color);
  background: var(--background-color);
  box-shadow: $shadow;
  border: none;
  transition:
    color $transitionDuration,
    background-color $transitionDuration,
    border-color $transitionDuration,
    box-shadow $transitionDuration;

  &:disabled {
    color: var(--disabled-text-color);
    background: var(--disabled-bg-color);
    box-shadow: none;
    cursor: default;
  }

  &:enabled:hover {
    color: var(--primary-color);
    box-shadow: $shadowHover;
  }

  &:enabled:active {
    color: var(--primary-color);
    box-shadow: $innerShadow;
  }

  &:focus-visible {
    @include focused();
  }

  .c-btn-label {
    flex: 1 1 auto;
  }

  .c-btn-icon {
    flex: 1 0 auto;
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.5rem;
  }

  &.c-btn-xs {
    height: 2rem;

    .c-btn-icon {
      width: 1rem;
      height: 1rem;
    }
  }

  &.c-btn-sm {
    height: 2.5rem;

    .c-btn-icon {
      width: 1.25rem;
      height: 1.25rem;
    }
  }

  &.c-btn-lg {
    height: 3.5rem;

    .c-btn-icon {
      width: 1.75rem;
      height: 1.75rem;
    }
  }

  &.c-btn-icon-only {
    min-width: 3rem;
    padding: 0;

    .c-btn-icon {
      margin: 0;
    }

    &.c-btn-xs {
      min-width: 2rem;
    }

    &.c-btn-sm {
      min-width: 2.5rem;
    }

    &.c-btn-lg {
      min-width: 3.5rem;
    }

    .c-btn-label {
      visibility: hidden;
      width: 0;
      flex: 0 0 auto;
    }
  }

  &.c-btn-text {
    background: transparent;
    border: none;
    box-shadow: none;

    &:enabled:hover {
      color: var(--primary-color);
      background: rgba(var(--primary-color-rgb), 0.05);
      border: none;
      box-shadow: none;
    }

    &:enabled:active {
      box-shadow: $innerShadow;
    }
  }
}
</style>
