<script setup lang="ts">
import { useAudioPlayer } from '@mainWindow/composables/useAudioPlayer';
import { formatTime } from '@renderer/commonUtils';

import Waveform from './Waveform.vue';

const { currentTime, duration } = useAudioPlayer();
</script>

<template>
  <div class="timeline">
    <span class="timeline-current-time">{{ formatTime(currentTime) }}</span>
    <Waveform class="timeline-waveform" />
    <span class="timeline-duration">{{ formatTime(duration) }}</span>
  </div>
</template>

<style lang="scss" scoped>
.timeline {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
}

.timeline-waveform {
  flex: 1 1 auto;
}

.timeline-current-time,
.timeline-duration {
  flex: 0 0 auto;
  font-size: map-get($fontSizes, sm);
  color: var(--primary-text-color);
}
</style>
