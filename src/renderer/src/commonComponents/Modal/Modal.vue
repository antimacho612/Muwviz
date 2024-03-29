<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  isOpen?: boolean;
  closeOnClickOutside?: boolean;
  closeOnPressEsc?: boolean;
  zIndex?: number;
}
withDefaults(defineProps<Props>(), {
  isOpen: false,
  closeOnClickOutside: true,
  closeOnPressEsc: true,
  zIndex: 1050,
});

const emits = defineEmits<{ 'update:isOpen': [value: boolean] }>();

const wrapperEl = ref<HTMLElement>();
const onOpened = () => wrapperEl.value?.focus();
</script>

<template>
  <Transition enter-active-class="c-modal-fade-in" leave-active-class="c-modal-fade-out">
    <div v-show="isOpen" class="c-modal-backdrop" :style="{ zIndex: zIndex }"></div>
  </Transition>
  <Transition
    enter-active-class="c-modal-fade-in-down"
    leave-active-class="c-modal-fade-out-up"
    @after-enter="onOpened"
  >
    <div
      v-show="isOpen"
      ref="wrapperEl"
      class="c-modal-wrapper"
      :style="{ zIndex: zIndex + 1 }"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
      @click.self="closeOnClickOutside && emits('update:isOpen', false)"
      @keydown.esc.stop="closeOnPressEsc && emits('update:isOpen', false)"
    >
      <slot></slot>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
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
  outline: none;
}

.c-modal-fade-in {
  @include animation($name: fadeIn);
}

.c-modal-fade-out {
  @include animation($name: fadeOut, $delay: 0.1s);
}

.c-modal-fade-in-down {
  @include animation($name: fadeInDown, $delay: 0.1s, $fillMode: both);
}

.c-modal-fade-out-up {
  @include animation($name: fadeOutUp);
}
</style>
