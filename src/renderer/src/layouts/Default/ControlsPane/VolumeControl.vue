<script setup lang="ts">
import { computed } from 'vue';
import { useAudioPlayer } from '@renderer/utils/useAudioPlayer';

import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/vue/24/solid';
import Slider from '@renderer/components/base/Slider/Slider.vue';
import Button from '@renderer/components/base/Button/Button.vue';

const audioPlayer = useAudioPlayer();

const volume = computed({
  get: () => (audioPlayer.isMuted.value ? 0 : audioPlayer.volume.value),
  set: (value: number) => {
    audioPlayer.setVolume(value);
  },
});
const buttonIcon = computed(() => (audioPlayer.isMuted.value ? SpeakerXMarkIcon : SpeakerWaveIcon));
</script>

<template>
  <div class="volume-control">
    <Button
      :icon="buttonIcon"
      size="sm"
      text
      :title="audioPlayer.isMuted ? 'ミュート解除(m)' : 'ミュート(m)'"
      @click="audioPlayer.toggleMute"
    />
    <Slider v-model="volume" :bar-width="0.5" :min="0" :max="100" :lazy="false" />
  </div>
</template>

<style lang="scss">
.volume-control {
  max-width: 12.5rem;
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
