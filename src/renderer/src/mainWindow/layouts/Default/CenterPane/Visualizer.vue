<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useVisualizer } from '@mainWindow/core/visualizer';
import { useWindowStore } from '@mainWindow/stores/window';
import { useAudioPlayer } from '@renderer/mainWindow/composables/useAudioPlayer';

const { audio } = useAudioPlayer();
const { visualizers } = useWindowStore();
const containerEl = ref<HTMLDivElement>();

onMounted(() => {
  if (!containerEl.value) return;
  if (visualizers.has(0)) {
    const visualizer = visualizers.get(0);
    if (visualizer && !visualizer.isDestroyed()) return;
  }
  visualizers.set(0, useVisualizer(containerEl.value, audio));
});

onBeforeUnmount(() => {
  visualizers.forEach((visualizer) => visualizer.destroy());
});
</script>

<template>
  <div ref="containerEl" class="visualizer"></div>
</template>

<style lang="scss" scoped>
.visualizer {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  overflow: hidden;
  border-radius: $borderRadiusLg;
}
</style>
