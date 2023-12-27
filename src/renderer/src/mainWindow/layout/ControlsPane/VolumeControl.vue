<script setup lang="ts">
import { computed } from 'vue';
import { useAudioPlayer } from '@mainWindow/composables/useAudioPlayer';

import VolumeIcon from '@renderer/assets/icons/volume.svg?component';
import VolumeMuteIcon from '@renderer/assets/icons/volume-mute.svg?component';
import Slider from '@renderer/commonComponents/Slider/Slider.vue';
import Button from '@renderer/commonComponents/Button/Button.vue';

const { isMuted, volume, setVolume, toggleMute } = useAudioPlayer();

const volumeRef = computed({
  get: () => (isMuted.value ? 0 : volume.value),
  set: (value: number) => setVolume(value),
});
</script>

<template>
  <div class="volume-control">
    <Button
      :icon="isMuted ? VolumeMuteIcon : VolumeIcon"
      size="sm"
      text
      :title="isMuted ? 'ミュート解除(m)' : 'ミュート(m)'"
      @click="toggleMute"
    />
    <Slider v-model="volumeRef" :bar-width="0.5" :min="0" :max="100" :lazy="false" />
  </div>
</template>

<style scoped>
.volume-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
