<script setup lang="ts">
interface Props {
  modelValue?: string | boolean | number | object;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

withDefaults(defineProps<Props>(), {
  size: 'md',
});

const emits = defineEmits<{
  'update:modelValue': [modelValue: string | boolean | number | object];
}>();
</script>

<template>
  <select
    class="c-select"
    :class="{
      'c-select-xs': size === 'xs',
      'c-select-sm': size === 'sm',
      'c-select-lg': size === 'lg',
    }"
    @change="emits('update:modelValue', ($event.target as HTMLSelectElement).value)"
  >
    <slot></slot>
  </select>
</template>

<style lang="scss" scoped>
.c-select {
  font-size: 1rem;
  line-height: normal;
  color: var(--primary-text-color);
  background: var(--background-color);
  padding: 0.5rem 0.75rem;
  height: 3rem;
  border-radius: $borderRadiusFull;
  box-shadow: $innerShadow;
  border: 1px solid transparent;
  cursor: pointer;
  user-select: none;

  transition:
    color $transitionDuration,
    background-color $transitionDuration,
    border-color $transitionDuration,
    box-shadow $transitionDuration;

  &:enabled:hover {
    border: 1px solid var(--primary-color);
  }

  &:enabled:active {
    border: 1px solid var(--primary-color);
  }

  &:focus {
    @include focusedInput;
  }

  &.c-select-xs {
    padding: 0.25rem 0.75rem;
    height: 2rem;
  }

  &.c-select-sm {
    height: 2.5rem;
  }

  &.c-select-lg {
    height: 3.5rem;
  }
}
</style>