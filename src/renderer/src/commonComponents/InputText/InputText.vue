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

const inputEl = ref<HTMLInputElement>();

const emits = defineEmits<{
  focus: [e: FocusEvent];
  'update:modelValue': [value: string];
}>();

const onInput = () => {
  if (!inputEl.value) return;
  emits('update:modelValue', inputEl.value.value);

  if (inputEl.value.value !== props.modelValue) {
    inputEl.value.value = props.modelValue;
  }
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
    class="c-inputtext"
    spellcheck="false"
    :class="{
      'c-inputtext-xs': size === 'xs',
      'c-inputtext-sm': size === 'sm',
      'c-inputtext-lg': size === 'lg',
    }"
    :value="modelValue"
    @input="onInput"
    @focus="onFocus"
  />
</template>

<style lang="scss">
.c-inputtext {
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

  &.c-inputtext-xs {
    height: 2rem;
    padding: 0.25rem 0.75rem;
  }

  &.c-inputtext-sm {
    height: 2.5rem;
  }

  &.c-inputtext-lg {
    height: 3.5rem;
  }
}
</style>
