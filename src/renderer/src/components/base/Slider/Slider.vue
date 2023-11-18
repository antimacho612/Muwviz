<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';

interface Props {
  modelValue?: number;
  disabled?: boolean;
  barWidth?: number;
  min?: number;
  max?: number;
  vertical?: boolean;
  showTooltip?: boolean;
  format?: (value: number) => string;
  lazy?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  disabled: false,
  barWidth: 1,
  min: 0,
  max: 100,
  vertical: false,
  showTooltip: true,
  format: (value: number) => value.toString(),
  lazy: true,
});

const emits = defineEmits<{
  'update:modelValue': [value: number];
}>();

const sliderElement = ref<HTMLDivElement>();
const dotElement = ref<HTMLSpanElement>();
const dragging = ref<boolean>(false);
const current = ref<number>(props.modelValue);

const modelValue = computed({
  get: () => {
    return dragging.value ? current.value : props.modelValue;
  },
  set: (value: number) => {
    emits('update:modelValue', value);
  },
});

const getBarRect = () => {
  if (!sliderElement.value) {
    throw new Error();
  }

  const { left, top } = sliderElement.value.getBoundingClientRect();
  const doc = document.documentElement;
  const windowScrollLeft = (window.scrollX || doc.scrollLeft) - (doc.clientLeft || 0);
  const windowScrollTop = (window.scrollY || doc.scrollTop) - (doc.clientTop || 0);

  return {
    x: left + windowScrollLeft,
    y: top + windowScrollTop,
    width: sliderElement.value.offsetWidth,
    height: sliderElement.value.offsetHeight,
  };
};

const updateCurrentValue = (newValue: number, emit = true) => {
  current.value = Math.min(Math.max(newValue, props.min), props.max);
  if (emit) {
    modelValue.value = current.value;
  }
};

const getSliderValue = (event: MouseEvent): number => {
  const { pageX, pageY } = event;
  const { x, y, width, height } = getBarRect();

  const handleValue = props.vertical
    ? ((y + height - pageY) * 100) / height
    : ((pageX - x) * 100) / width;

  return Math.floor((props.max - props.min) * (handleValue / 100) + props.min);
};

let dragListener: ((e: MouseEvent) => void) | null;
let dragEndListener: ((e: MouseEvent) => void) | null;

const bindDragListeners = () => {
  if (!dragListener) {
    dragListener = onMouseMove.bind(this);
    if (dragListener) window.addEventListener('mousemove', dragListener);
  }

  if (!dragEndListener) {
    dragEndListener = onMouseUp.bind(this);
    if (dragEndListener) window.addEventListener('mouseup', dragEndListener);
  }
};

const unbindDragListeners = () => {
  if (dragListener !== null) {
    window.removeEventListener('mousemove', dragListener);
    dragListener = null;
  }

  if (dragEndListener !== null) {
    window.removeEventListener('mouseup', dragEndListener);
    dragEndListener = null;
  }
};

const onMouseDown = (event: MouseEvent) => {
  if (props.disabled) {
    return;
  }

  dragging.value = true;

  const isDotClicked = event.target === dotElement.value;
  if (isDotClicked) {
    dotElement.value?.focus();
  } else {
    dotElement.value?.blur();
    const sliderValue = getSliderValue(event);
    updateCurrentValue(sliderValue, !props.lazy);
  }

  bindDragListeners();

  event.preventDefault();
};

const onMouseMove = (event: MouseEvent) => {
  if (dragging.value) {
    const sliderValue = getSliderValue(event);
    updateCurrentValue(sliderValue, !props.lazy);
    event.preventDefault();
  }
};

const onMouseUp = () => {
  if (dragging.value) {
    dragging.value = false;

    if (props.lazy) {
      modelValue.value = current.value;
    }
  }
};

const incrementCurrentValue = (num = 1) => {
  const newValue = current.value + num;
  updateCurrentValue(newValue);
};

const decrementCurrentValue = (num = 1) => {
  const newValue = current.value - num;
  updateCurrentValue(newValue);
};

const onKeyDown = (event: KeyboardEvent) => {
  switch (event.code) {
    case 'ArrowUp':
    case 'ArrowRight':
      incrementCurrentValue();
      event.preventDefault();
      break;
    case 'ArrowDown':
    case 'ArrowLeft':
      decrementCurrentValue();
      event.preventDefault();
      break;
    case 'PageUp':
      incrementCurrentValue(10);
      event.preventDefault();
      break;
    case 'PageDown':
      decrementCurrentValue(10);
      event.preventDefault();
      break;
    case 'End':
      updateCurrentValue(props.max);
      event.preventDefault();
      break;
    case 'Home':
      updateCurrentValue(props.min);
      event.preventDefault();
      break;
    default:
      break;
  }
};

const percentPosition = computed(() => {
  if (modelValue.value < props.min) {
    return 0;
  } else if (modelValue.value > props.max) {
    return 100;
  } else {
    return ((modelValue.value - props.min) / (props.max - props.min)) * 100;
  }
});

const fillStyle = computed(() => {
  if (props.vertical) {
    return { height: `${percentPosition.value}%` };
  } else {
    return { width: `${percentPosition.value}%` };
  }
});

const dotStyle = computed(() => {
  if (props.vertical) {
    return { bottom: `${percentPosition.value}%` };
  } else {
    return { left: `${percentPosition.value}%` };
  }
});

const tooltipStyle = computed(() => {
  if (props.vertical) {
    return { bottom: `${percentPosition.value}%` };
  } else {
    return { left: `${percentPosition.value}%` };
  }
});

const tooltipText = computed(() => props.format(modelValue.value));

onBeforeUnmount(() => {
  unbindDragListeners();
});
</script>

<template>
  <div
    ref="sliderElement"
    class="c-slider"
    :class="{
      'c-slider-horizontal': !vertical,
      'c-slider-vertical': vertical,
      'c-disabled': disabled,
      dragging: dragging,
    }"
    @mousedown="onMouseDown"
  >
    <span class="c-slider-fill" :style="fillStyle"></span>
    <span
      ref="dotElement"
      class="c-slider-dot"
      :style="dotStyle"
      :tabindex="!disabled ? 0 : undefined"
      @keydown="onKeyDown"
    ></span>
    <span v-if="showTooltip" class="c-slider-tooltip" :style="tooltipStyle">
      {{ tooltipText }}
    </span>
  </div>
</template>

<style scoped>
.c-slider {
  --bar-width: v-bind(props.barWidth);
}
</style>

<style lang="scss">
.c-slider {
  --bar-width: 1;

  position: relative;
  border-radius: $borderRadiusFull;
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: $innerShadow;
  cursor: pointer;
  user-select: none;

  &.c-slider-horizontal {
    width: 100%;
  }

  &.c-slider-vertical {
    height: 100%;
  }
}

.c-slider-fill {
  position: absolute;
  display: block;
  border-radius: $borderRadiusFull;
}

.c-slider-dot {
  position: absolute;
  width: calc(1rem * var(--bar-width) * 1.5);
  height: calc(1rem * var(--bar-width) * 1.5);
  border-radius: $borderRadiusFull;
  background: #fff;
  box-shadow: 2.5px 2.5px 5px var(--shadow-color--dark);
  z-index: 20;

  &::after {
    content: '';
    position: absolute;
    width: calc(1rem * var(--bar-width) * 1.5 * 0.4);
    height: calc(1rem * var(--bar-width) * 1.5 * 0.4);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: $borderRadiusFull;
    background: var(--primary-color);
  }

  &:focus {
    @include focused;
  }
}

.c-slider-tooltip {
  position: absolute;
  padding: 0.4rem 0.6rem;
  font-size: map-get($fontSizes, sm);
  line-height: 1;
  color: var(--primary-text-color);
  border-radius: $borderRadiusMd;
  background: var(--background-color);
  box-shadow: $shadowHover;
  cursor: default;
  opacity: 0;
  transition: opacity $transitionDuration ease-in-out;
  z-index: 30;
}

.c-slider-dot:hover ~ .c-slider-tooltip,
.c-slider-dot:focus ~ .c-slider-tooltip,
.c-slider.dragging .c-slider-tooltip {
  opacity: 1;
}

.c-slider.c-slider-horizontal {
  height: calc(1rem * var(--bar-width));

  .c-slider-fill {
    top: 0;
    left: 0;
    height: 100%;
    background: linear-gradient(to right, var(--primary-color), var(--primary-color--lighter));
  }

  .c-slider-dot {
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .c-slider-tooltip {
    top: 0;
    transform: translate(-50%, -130%);
  }
}

.c-slider.c-slider-vertical {
  width: calc(1rem * var(--bar-width));

  .c-slider-fill {
    bottom: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(to top, var(--primary-color), var(--primary-color--lighter));
  }

  .c-slider-dot {
    left: 50%;
    transform: translate(-50%, 50%);
  }

  .c-slider-tooltip {
    left: 0;
    transform: translate(-80%, -50%);
  }
}

.c-slider.c-disabled {
  .c-slider-fill {
    background: var(--disabled-text-color);
  }

  .c-slider-dot {
    pointer-events: all;

    &:active {
      pointer-events: none;
    }

    &::after {
      background: var(--disabled-bg-color);
    }
  }

  .c-slider-tooltip {
    color: var(--disabled-text-color);
  }
}
</style>
