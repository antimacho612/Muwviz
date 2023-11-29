<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import AudioMotionAnalyzer from 'audiomotion-analyzer';
import { useAudioPlayer } from '@renderer/utils/useAudioPlayer';

let audioMotionAnalyzer: AudioMotionAnalyzer;

const visualizerElement = ref<HTMLDivElement>();
const audioPlayer = useAudioPlayer();

onMounted(() => {
  if (visualizerElement.value) {
    audioMotionAnalyzer = new AudioMotionAnalyzer(visualizerElement.value, {
      source: audioPlayer.audio,
      overlay: true,
      bgAlpha: 0,
      showBgColor: false,
    });
  }
});

onBeforeUnmount(() => {
  audioMotionAnalyzer.destroy();
});
</script>

<template>
  <div ref="visualizerElement" class="visualizer"></div>
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
