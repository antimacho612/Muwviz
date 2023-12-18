<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  modelValue?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  selectAllOnFocus?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  size: 'md',
  selectAllOnFocus: false,
});

type Emits = {
  focus: [e: FocusEvent];
  'update:modelValue': [value: string];
};
const emits = defineEmits<Emits>();

const inputEl = ref<HTMLInputElement>();

const onInput = () => {
  if (!inputEl.value) return;
  emits('update:modelValue', inputEl.value.value);
};

const onFocus = () => {
  if (inputEl.value && props.selectAllOnFocus) {
    inputEl.value.select();
  }
};
</script>

<template>
  <input
    ref="inputEl"
    class="c-input-text"
    spellcheck="false"
    :class="{
      'c-input-text-xs': size === 'xs',
      'c-input-text-sm': size === 'sm',
      'c-input-text-lg': size === 'lg',
    }"
    :value="modelValue"
    @input="onInput"
    @focus="onFocus"
  />
</template>

<style lang="scss" scoped>
.c-input-text {
  font-size: 1rem;
  line-height: normal;
  color: var(--primary-text-color);
  background: var(--background-color);
  padding: 0.5rem 0.75rem;
  height: 3rem;
  border-radius: $borderRadiusFull;
  appearance: none;
  box-shadow: $innerShadow;
  border: 1px solid transparent;

  transition:
    color $transitionDuration,
    border-color $transitionDuration;

  &:enabled:hover {
    border: 1px solid var(--primary-color);
  }

  &:enabled:active {
    border: 1px solid var(--primary-color);
  }

  &:focus {
    @include focusedInput;
  }

  &.c-input-text-xs {
    height: 2rem;
    padding: 0.25rem 0.75rem;
  }

  &.c-input-text-sm {
    height: 2.5rem;
  }

  &.c-input-text-lg {
    height: 3.5rem;
  }
}
</style>
