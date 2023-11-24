<script setup lang="ts">
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

const emits = defineEmits<{
  focus: [e: FocusEvent];
  'update:modelValue': [value: string];
}>();

const onInput = (e: Event) => {
  emits('update:modelValue', (e.target as HTMLInputElement)?.value);
};

const onFocus = (e: FocusEvent) => {
  if (props.selectAllOnFocus) {
    (e.target as HTMLInputElement)?.select();
  }
};
</script>

<template>
  <input
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
