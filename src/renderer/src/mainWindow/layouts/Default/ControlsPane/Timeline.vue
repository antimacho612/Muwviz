<script setup lang="ts">
import { computed } from 'vue';
import { useAudioPlayer } from '@mainWindow/composables/useAudioPlayer';
import { formatTime } from '@renderer/commonUtils';

import Slider from '@renderer/commonComponents/Slider/Slider.vue';

const { currentTime, duration, playerState, setCurrentTime } = useAudioPlayer();

const currentTimeRef = computed({
  get: () => currentTime.value,
  set: (value: number) => {
    setCurrentTime(value);
  },
});
</script>

<template>
  <div class="timeline">
    <span class="timeline-current-time">{{ formatTime(currentTime) }}</span>
    <Slider
      v-model="currentTimeRef"
      :bar-width="0.75"
      :max="duration"
      :format="formatTime"
      :disabled="playerState === 'UnReady' || playerState === 'Loading'"
      class="timeline-slider"
    />
    <span class="timeline-duration">{{ formatTime(duration) }}</span>
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
