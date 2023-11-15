<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  isOpen?: boolean;
  zIndex?: number;
}

withDefaults(defineProps<Props>(), {
  isOpen: false,
  zIndex: 1050,
});
const emits = defineEmits<{ 'update:isOpen': [value: boolean] }>();

const wapperEl = ref<HTMLElement>();

const onOpened = () => {
  wapperEl.value?.focus();
};

const close = () => {
  emits('update:isOpen', false);
};
</script>

<template>
  <Transition enter-active-class="fadeIn" leave-active-class="fadeOut">
    <div v-show="isOpen" class="c-modal-backdrop" :style="{ zIndex: zIndex }"></div>
  </Transition>
  <Transition
    enter-active-class="c-modal-fadeInDown"
    leave-active-class="c-modal-fadeOutUp"
    @after-enter="onOpened"
  >
    <div
      v-show="isOpen"
      ref="wapperEl"
      class="c-modal-wrapper"
      :style="{ zIndex: zIndex + 1 }"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
      @click.self="close"
      @keydown.esc.stop="close"
    >
      <slot></slot>
    </div>
  </Transition>
</template>

<style lang="scss">
.c-modal-backdrop {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
}

.c-modal-wrapper {
  position: absolute;
  inset: 0;
  overflow-x: hidden;
  overflow-y: auto;
  outline: 0;
}

.c-modal-fadeIn {
  @include animation($name: fadeIn);
}

.c-modal-fadeOut {
  @include animation($name: fadeOut, $delay: 0.1s);
}

.c-modal-fadeInDown {
  @include animation($name: fadeInDown, $delay: 0.1s, $fillMode: both);
}

.c-modal-fadeOutUp {
  @include animation($name: fadeOutUp);
}
</style>
