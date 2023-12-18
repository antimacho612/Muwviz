<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import WaveformData from 'waveform-data';
import * as d3 from 'd3';
import { useElementBounding } from '@vueuse/core';
import { useAudioPlayer } from '@mainWindow/composables/useAudioPlayer';
import { formatTime } from '@renderer/commonUtils';
import { Song } from '@shared/types';

const { currentTime, duration, playerState, currentSong, setCurrentTime } = useAudioPlayer();

const disabled = computed(() => playerState.value === 'UnReady' || playerState.value === 'Loading');

const offset = computed(() =>
  duration.value !== 0 ? (currentTime.value / duration.value) * 100 : 0
);

const defaultPath = 'M 2 2 A 1 1 0 0 1 2 -2 L 1022 -2 A 1 1 0 0 1 1022 2 L 2 2';
const drawDefaultPath = () => {
  d3.select('#waveform-path').attr('d', defaultPath);
};

let audioContext: AudioContext;
const createWaveformData = async (song: Song) => {
  if (!audioContext) audioContext = new AudioContext();

  const response = await fetch(`media://${song.filePath}`);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  let data: DataView | undefined;
  WaveformData.createFromAudio(
    {
      audio_context: audioContext,
      audio_buffer: audioBuffer,
      split_channels: false,
      disable_worker: true,
    },
    (error, waveformData) => {
      if (error) {
        console.error(error);
        return;
      }

      const channel = waveformData.channel(0);
      const headerSize = 4;
      const totalSize = headerSize + waveformData.length * 2;
      const buffer = new ArrayBuffer(totalSize);
      data = new DataView(buffer);

      // Length
      data.setInt32(0, waveformData.length, true);

      // Sample min/max values
      let offset = headerSize;
      channel.min_array().forEach((minValue) => data && data.setInt8(offset++, minValue));
      channel.max_array().forEach((maxValue) => data && data.setInt8(offset++, maxValue));
    }
  );

  return data;
};

const drawWaveformPath = async (waveformData: DataView) => {
  try {
    const length = waveformData.getUint32(0, true);
    const minValues = Array<number>();
    const maxValues = Array<number>();

    for (let i = 0; i < length; i++) {
      minValues.push(waveformData.getInt8(4 + i));
      maxValues.push(waveformData.getInt8(4 + length + i));
    }

    const x = d3.scaleLinear();
    const y = d3.scaleLinear();

    x.domain([0, length]).rangeRound([0, 1024]);
    y.domain([d3.min(minValues), d3.max(maxValues)]).rangeRound([12, -12]);
    const area = d3
      .area()
      .x((_, i) => x(i))
      .y0((_, i) => y(minValues[i]))
      .y1((d) => y(d));

    d3.select('#waveform-path').datum(maxValues).attr('d', area);
  } catch (e) {
    console.error(e);
    drawDefaultPath();
  }
};

const drawPath = async () => {
  drawDefaultPath();

  if (!currentSong.value) return;

  let waveformData: DataView | undefined;
  try {
    waveformData = await window.electron.invoke.getWaveformData(currentSong.value.id);
  } catch (e) {
    waveformData = await createWaveformData(currentSong.value);
    if (waveformData) {
      try {
        window.electron.invoke.saveWaveformData(currentSong.value.id, waveformData);
      } catch (e) {
        console.error('Failed to save waveform data', e);
      }
    }
  }

  if (waveformData) drawWaveformPath(waveformData);
};

onMounted(async () => await drawPath());
watch(currentSong, async () => await drawPath());

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
  <div
    ref="waveformEl"
    class="waveform"
    :class="{ disabled }"
    @mousemove="onMouseMove"
    @click="onClick"
  >
    <div class="tooltip" :style="{ left: `${tooltipLeft}px` }" @mousemove.stop>
      {{ tooltipText }}
    </div>
    <svg id="waveform-svg" viewBox="0 0 1024 24" preserveAspectRatio="none" class="w-full h-full">
      <defs>
        <linearGradient id="waveform-gradient">
          <stop :offset="`${offset}%`" stop-color="var(--primary-color--lighter)" />
          <stop :offset="`${offset}%`" stop-color="var(--disabled-bg-color)" />
        </linearGradient>
      </defs>
      <path
        id="waveform-path"
        :d="defaultPath"
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
