<script setup lang="ts">
import { computed, ref } from 'vue';
import deepEqual from 'fast-deep-equal';

interface Props {
  modelValue?: boolean | number | string | object;
  trueValue?: boolean | number | string | object;
  falseValue?: boolean | number | string | object;
  size?: 'sm' | 'md';
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  trueValue: true,
  falseValue: false,
  size: 'md',
});

type Emits = {
  'update:modelValue': [modelValue: unknown];
  click: [e: MouseEvent];
  change: [e: MouseEvent];
  input: [modelValue: unknown];
  focus: [e: FocusEvent];
  blur: [e: FocusEvent];
};
const emits = defineEmits<Emits>();

const inputEl = ref<HTMLInputElement>();
const checked = computed(() => deepEqual(props.modelValue, props.trueValue));
const focused = ref(false);

const onClick = (e: MouseEvent) => {
  const value = checked.value ? props.falseValue : props.trueValue;

  emits('click', e);
  emits('update:modelValue', value);
  emits('change', e);
  emits('input', value);

  inputEl.value?.focus();
};

const onFocus = (e: FocusEvent) => {
  focused.value = true;
  emits('focus', e);
};

const onBlur = (e: FocusEvent) => {
  focused.value = false;
  emits('blur', e);
};
</script>

<template>
  <div
    class="c-toggle-button"
    :class="{
      'c-toggle-button-sm': size === 'sm',
      'c-toggle-button-checked': checked,
      'c-toggle-button-focused': focused,
    }"
    @click="onClick"
  >
    <input
      ref="inputEl"
      type="checkbox"
      :checked="checked"
      class="c-toggle-button-input"
      @focus="onFocus"
      @blur="onBlur"
    />
    <div class="c-toggle-button-switch"></div>
  </div>
</template>

<style lang="scss">
.c-toggle-button {
  position: relative;
  width: 4rem;
  height: 2rem;
  border-radius: $borderRadiusFull;
  display: inline-block;
}

.c-toggle-button-input {
  position: absolute;
  transform: scale(0);
}

.c-toggle-button-switch {
  position: relative;
  height: 100%;
  width: 100%;
  background: var(--background-color);
  border: 1px solid inherit;
  border-radius: $borderRadiusFull;
  box-shadow: $shadow;
  cursor: pointer;
  transition: background $transitionDuration;

  &::before {
    content: '';
    position: absolute;
    left: 0.3rem;
    @include positionCenterY;
    width: 1.4rem;
    height: 1.4rem;

    background: var(--toggle-button-dot-color--off);
    border-radius: $borderRadiusFull;
    transition:
      left $transitionDuration,
      background $transitionDuration;
  }
}

.c-toggle-button.c-toggle-button-checked {
  .c-toggle-button-switch {
    background: linear-gradient(330deg, var(--primary-color) 40%, var(--primary-color--lightest));

    &::before {
      left: 2.15rem;
      background: var(--toggle-button-dot-color--on);
    }
  }
}

.c-toggle-button.c-toggle-button-focused {
  .c-toggle-button-switch {
    @include focused;
  }
}

.c-toggle-button.c-toggle-button-sm {
  width: 3.75rem;
  height: 1.75rem;

  .c-toggle-button-switch::before {
    width: 1.25rem;
    height: 1.25rem;
  }
}
</style>
