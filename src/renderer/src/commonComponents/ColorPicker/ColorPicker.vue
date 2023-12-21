<script setup lang="ts">
import { computed, ref } from 'vue';

interface Props {
  modelValue: string;
  size?: 'sm' | 'md';
}
const props = withDefaults(defineProps<Props>(), { size: 'md' });

type Emits = {
  'update:modelValue': [value: string];
  click: [e: MouseEvent];
  focus: [e: FocusEvent];
  blur: [e: FocusEvent];
};
const emits = defineEmits<Emits>();

const inputEl = ref<HTMLInputElement>();
const onClick = (e: MouseEvent) => {
  inputEl.value?.click();
  emits('click', e);
};

const focused = ref(false);
const onFocus = (e: FocusEvent) => {
  focused.value = true;
  emits('focus', e);
};
const onBlur = (e: FocusEvent) => {
  focused.value = false;
  emits('blur', e);
};

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emits('update:modelValue', value),
});
</script>

<template>
  <div
    class="c-color-picker"
    :class="{
      'c-color-picker-sm': size === 'sm',
      'c-color-picker-focused': focused,
    }"
    @click="onClick"
  >
    <span class="c-color-picker-swatch" />
    <input
      ref="inputEl"
      v-model="inputValue"
      type="color"
      class="c-color-picker-hidden-input"
      @focus="onFocus"
      @blur="onBlur"
    />
  </div>
</template>

<style lang="scss" scoped>
.c-color-picker {
  position: relative;
  display: inline-flex;
  align-items: center;
  border-radius: 50%;
  user-select: none;
  cursor: pointer;

  --size: 2.5rem;

  &.c-color-picker-sm {
    --size: 2rem;
  }

  &.c-color-picker-focused {
    @include focused;
  }
}

.c-color-picker-swatch {
  width: var(--size);
  height: var(--size);
  background: v-bind(inputValue);
  border-radius: 50%;
  border: 5px solid var(--color-swatch-wrapper-color);
  transition: background-color $transitionDuration;
}

.c-color-picker.c-color-picker-sm {
  .c-color-picker-swatch {
    width: 2rem;
    height: 2rem;
  }
}

.c-color-picker-hidden-input {
  margin: 0;
  padding: 0;
  width: 0;
  height: 0;
  border: none;
  transform: scale(0);
}
</style>
