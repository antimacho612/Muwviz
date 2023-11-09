<script setup lang="ts">
interface Props {
  modelValue?: string;
  size?: 'sm' | 'md' | 'lg';
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
    :class="{ 'c-inputtext-sm': props.size === 'sm', 'c-inputtext-lg': props.size === 'lg' }"
    :value="props.modelValue"
    @input="onInput"
    @focus="onFocus"
  />
</template>

<style lang="scss" scoped>
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
    border: 1px solid var(--primary-color);
    @include focused();
  }

  &.c-inputtext-xs {
    height: 2rem;
  }

  &.c-inputtext-sm {
    height: 2.5rem;
  }

  &.c-inputtext-lg {
    height: 3.5rem;
  }
}
</style>
