<script setup lang="ts">
import { computed, ref } from 'vue';
import { useElementBounding } from '@vueuse/core';
import { useAudioPlayer } from '@mainWindow/composables/useAudioPlayer';
import { useWaveform } from '@mainWindow/composables/useWaveform';
import { formatTime } from '@renderer/commonUtils';

const { currentTime, duration, playerState, setCurrentTime } = useAudioPlayer();

const disabled = computed(() => playerState.value === 'UnReady' || playerState.value === 'Loading');

const gradientOffset = computed(() => (duration.value !== 0 ? (currentTime.value / duration.value) * 100 : 0));

useWaveform('#waveform-path');

const waveformEl = ref<HTMLDivElement>();
const { x, width } = useElementBounding(waveformEl, { windowScroll: false });

const getPointedTime = (e: MouseEvent) => {
  const handleValue = ((e.pageX - Math.floor(x.value)) * 100) / width.value;
  const pointedTime = duration.value * (handleValue / 100) + 0;
  return Math.floor(pointedTime);
};

const tooltipLeft = ref(0);
const tooltipText = ref('--:--');
const onMouseMove = (e: MouseEvent) => {
  if (disabled.value) return;

  tooltipLeft.value = e.offsetX;
  tooltipText.value = formatTime(getPointedTime(e));
};

const onClick = (e: MouseEvent) => {
  if (disabled.value) return;

  const time = getPointedTime(e);
  setCurrentTime(time);
};
</script>

<template>
  <div ref="waveformEl" class="waveform" :class="{ disabled }" @mousemove="onMouseMove" @click="onClick">
    <div class="tooltip" :style="{ left: `${tooltipLeft}px` }" @mousemove.stop>
      {{ tooltipText }}
    </div>
    <svg id="waveform-svg" viewBox="0 0 1024 24" preserveAspectRatio="none" class="w-full h-full">
      <defs>
        <linearGradient id="waveform-gradient">
          <stop :offset="`${gradientOffset}%`" stop-color="var(--primary-color--lighter)" />
          <stop :offset="`${gradientOffset}%`" stop-color="var(--disabled-bg-color)" />
        </linearGradient>
      </defs>
      <path
        id="waveform-path"
        d="M 2 2 A 1 1 0 0 1 2 -2 L 1022 -2 A 1 1 0 0 1 1022 2 L 2 2"
        transform="translate(0, 12)"
        fill="url(#waveform-gradient)"
        stroke="url(#waveform-gradient)"
      ></path>
    </svg>
  </div>
</template>

<style lang="scss" scoped>
.waveform {
  position: relative;
  width: 100%;
  height: 1.75rem;
}

.tooltip {
  position: absolute;
  top: -1.5rem;
  padding: 0.4rem 0.6rem;
  font-size: map-get($fontSizes, sm);
  line-height: 1;
  color: var(--primary-text-color);
  border-radius: $borderRadiusMd;
  background: var(--background-color);
  box-shadow: $shadowHover;
  cursor: default;
  opacity: 0;
  transition: opacity $transitionDuration ease-in-out;
  z-index: 30;
}

.waveform:not(.disabled):hover .tooltip {
  opacity: 1;
}
</style>
