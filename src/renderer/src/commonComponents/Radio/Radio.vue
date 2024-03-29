<script setup lang="ts">
import { computed, ref } from 'vue';
import deepEqual from 'fast-deep-equal';

interface Props {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  label?: string;
  value?: string | number | object;
  modelValue?: string | number | object;
  disabled?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  disabled: false,
});

type Emits = {
  'update:modelValue': [modelValue?: string | number | object];
  click: [e: MouseEvent];
  change: [e: Event];
  focus: [e: FocusEvent];
  blur: [e: FocusEvent];
};
const emits = defineEmits<Emits>();

const inputEl = ref<HTMLInputElement>();

const onClick = (e: MouseEvent) => {
  if (!props.disabled) {
    emits('click', e);
    emits('update:modelValue', props.value);
    inputEl.value?.focus();

    if (!checked.value) {
      emits('change', e);
    }
  }
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

const checked = computed(() => props.modelValue != null && deepEqual(props.modelValue, props.value));
</script>

<template>
  <div
    class="c-radio"
    :class="{
      'c-radio-xs': size === 'xs',
      'c-radio-sm': size === 'sm',
      'c-radio-lg': size === 'lg',
      'c-radio-checked': checked,
      'c-radio-focused': focused,
      'c-radio-disabled': disabled,
    }"
    @click="onClick"
  >
    <div class="c-radio-check"></div>
    <label class="c-radio-label">
      <input
        ref="inputEl"
        type="radio"
        :name="name"
        :value="value"
        :checked="checked"
        :disabled="disabled"
        class="c-radio-hidden-input"
        @focus="onFocus"
        @blur="onBlur"
      />
      {{ label }}
    </label>
  </div>
</template>

<style lang="scss" scoped>
.c-radio {
  position: relative;
  display: inline-flex;
  align-items: center;
  user-select: none;
  cursor: pointer;
}

.c-radio-label {
  flex-grow: 1;
  font-size: 1rem;
  margin-left: 0.5rem;
  color: var(--secondary-text-color);
  display: inline-flex;
  align-items: center;
  cursor: inherit;
  transition: color $transitionDuration;
}

.c-radio-hidden-input {
  margin: 0;
  width: 0;
  height: 0;
  transform: scale(0);
}

.c-radio-check {
  position: relative;
  width: 2rem;
  height: 2rem;
  background: var(--background-color);
  border: none;
  border-radius: $borderRadiusFull;
  box-shadow: $shadow;
  transition: box-shadow $transitionDuration;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 45%;
    height: 45%;
    background: var(--radio-check-dot-color);
    border-radius: $borderRadiusFull;
    transition: background-color $transitionDuration;
  }
}

.c-radio.c-radio-xs .c-radio-check {
  width: 1.55rem;
  height: 1.5rem;
}

.c-radio.c-radio-sm .c-radio-check {
  width: 1.75rem;
  height: 1.75rem;
}

.c-radio.c-radio-lg .c-radio-check {
  width: 2.25rem;
  height: 2.25rem;
}

.c-radio:not(.c-radio-disabled):hover {
  .c-radio-label {
    color: var(--primary-color);
  }

  .c-radio-check::after {
    background: var(--primary-color);
  }
}

.c-radio.c-radio-checked {
  .c-radio-label {
    color: var(--primary-color);
  }

  .c-radio-check {
    box-shadow: $innerShadow;
    &::after {
      background: var(--primary-color);
    }
  }
}

.c-radio.c-radio-focused {
  .c-radio-check {
    @include focused;
  }
}
.c-radio.c-radio-disabled {
  cursor: not-allowed;

  .c-radio-label {
    color: var(--disabled-text-color);
  }
  .c-radio-check::after {
    background: var(--disabled-text-color);
  }

  &.c-radio-checked {
    .c-radio-label {
      color: var(--primary-color--lightest);
    }

    .c-radio-check::after {
      background: var(--primary-color--lightest);
    }
  }
}
</style>
