<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Song } from '@shared/types';

const props = defineProps<{ song?: Song; isOpen?: boolean }>();
const emits = defineEmits<{ 'update:isOpen': [value: boolean] }>();

const modelValue = computed({
  get: () => props.isOpen,
  set: (value: boolean) => emits('update:isOpen', value),
});
</script>

<template>
  <Transition
    enter-active-class="animate__animated animate__fadeIn"
    leave-active-class="animate__animated animate__fadeOut"
  >
    <div v-show="isOpen" class="backdrop"></div>
  </Transition>
  <Transition>
    <div
      v-show="isOpen"
      class="wrapper"
      tabindex="-1"
      role="dialog"
      aria-label="song-detail"
      aria-modal="true"
      aria-describedby="song-detail-modal-content"
      aria-labelledby="song-detail-modal-title"
    ></div>
  </Transition>
</template>

<style lang="scss" scoped>
.backdrop {
  position: absolute;
  inset: 0;
  z-index: 1050;
  background-color: rgba(0, 0, 0, 0.4);
}

.wrapper {
  position: absolute;
  inset: 0;
  overflow-x: hidden;
  overflow-y: auto;
  outline: 0;
}
</style>
