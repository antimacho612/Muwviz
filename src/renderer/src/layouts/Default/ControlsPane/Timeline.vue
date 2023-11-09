<script setup lang="ts">
import { computed } from 'vue';
import Slider from '@renderer/components/base/Slider/Slider.vue';
import { useAudioPlayer } from '@renderer/utils/useAudioPlayer';
import { formatTime } from '@renderer/utils/utils';

const audioPlayer = useAudioPlayer();

const currentTime = computed({
  get: () => audioPlayer.currentTime.value,
  set: (value: number) => {
    audioPlayer.setCurrentTime(value);
  },
});
</script>

<template>
  <div class="timeline">
    <span class="timeline-current-time">{{ formatTime(currentTime) }}</span>
    <Slider
      v-model="currentTime"
      :bar-width="0.75"
      :max="audioPlayer.duration.value"
      :format="formatTime"
      class="timeline-slider"
    />
    <span class="timeline-duration">{{ formatTime(audioPlayer.duration.value) }}</span>
  </div>
</template>

<style lang="scss" scoped>
.timeline {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
}

.timeline-slider {
  flex: 1 1 auto;
}

.timeline-current-time,
.timeline-duration {
  flex: 0 0 auto;
  font-size: map-get($fontSizes, sm);
  color: var(--primary-text-color);
}
</style>
