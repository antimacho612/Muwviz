<script setup lang="ts">
import { ref } from 'vue';
import {
  VisualizerConfig,
  VISUALIZATION_MODE_MAP,
  CHANNEL_LAYOUT_MAP,
  FFT_SIZES,
  MIN_FREQUENCIES,
  MAX_FREQUENCIES,
  FREQUENCY_SCALES,
  WEIGHTING_FILTER_MAP,
  COLOR_MODE_MAP,
  BUILT_IN_GRADIENT_MAP,
  MIRROR_MAP,
  SCALE_X_LABELS,
} from '@shared/visualizerTypes';

import Select from '@renderer/commonComponents/Select/Select.vue';
import Slider from '@renderer/commonComponents/Slider/Slider.vue';
import InputNumber from '@renderer/commonComponents/InputNumber/InputNumber.vue';
import Switch from '@renderer/commonComponents/Switch/Switch.vue';
import Radio from '@renderer/commonComponents/Radio/Radio.vue';

const config = ref<VisualizerConfig>({
  mode: 0,
  channelLayout: 'single',
  fftSize: 512,
  smoothing: 0,
  minFreq: 10,
  maxFreq: 8000,
  frequencyScale: 'bark',
  weightingFilter: '',
  minDecibels: 0,
  maxDecibels: 0,
  linearAmplitude: false,
  linearBoost: 0,
  colorMode: 'gradient',
  gradientLeft: '',
  gradientRight: '',
  splitGradient: false,
  fixedBarSpace: false,
  barSpace: 0,
  alphaBars: false,
  ansiBands: false,
  ledBars: false,
  trueLeds: false,
  roundBars: false,
  lumiBars: false,
  outlineBars: false,
  lineWidth: 0,
  fillAlpha: 0,
  radial: false,
  spinSpeed: 0,
  reflexRatio: 0,
  reflexAlpha: 0,
  reflexBright: 0,
  reflexFit: false,
  mirror: 0,
  scaleXLabel: 'None',
  showScaleY: false,
  showPeaks: false,
  showPeakLine: false,
});
</script>

<template>
  <div class="visualizer-configs">
    Settings

    <div>
      <div>
        Mode
        <Select size="sm">
          <option v-for="[mode, label] of VISUALIZATION_MODE_MAP" :key="mode" :value="mode">
            {{ label }}
          </option>
        </Select>
      </div>

      <div>
        Channel Layout
        <Radio
          v-for="[channelLayout, label] of CHANNEL_LAYOUT_MAP"
          :key="channelLayout"
          v-model="config.channelLayout"
          name="channel-layout"
          :label="label"
          :value="channelLayout"
        />
      </div>

      <div>
        FFT Size
        <Select size="sm">
          <option v-for="fftSize in FFT_SIZES" :key="fftSize" :value="fftSize">
            {{ fftSize }}
          </option>
        </Select>
        Smoothing Time Constant
        <Slider v-model="config.smoothing" :min="0" :max="1" :step="0.1" />
      </div>

      <div>
        Min Frequency
        <Select size="sm">
          <option v-for="minFreq in MIN_FREQUENCIES" :key="minFreq" :value="minFreq">
            {{ minFreq }} Hz
          </option>
        </Select>
        Max Frequency
        <Select size="sm">
          <option v-for="maxFreq in MAX_FREQUENCIES" :key="maxFreq" :value="maxFreq">
            {{ maxFreq / 1000 }}k Hz
          </option>
        </Select>
        Frequency Scale
        <Radio
          v-for="freqScale in FREQUENCY_SCALES"
          :key="freqScale"
          v-model="config.frequencyScale"
          name="frequency-scales"
          :value="freqScale"
          :label="freqScale"
        />
      </div>

      <div>
        Weighting Filter
        <Radio
          v-for="[weightingFilter, label] of WEIGHTING_FILTER_MAP"
          :key="weightingFilter"
          v-model="config.weightingFilter"
          name="weighting-filter"
          :value="weightingFilter"
          :label="label"
        />
        Min Decibels
        <Slider v-model="config.minDecibels" :min="-120" :max="-60" :step="5" />
        Max Decibels
        <Slider v-model="config.maxDecibels" :min="-40" :max="0" :step="5" />
      </div>
    </div>

    <div>
      Linear Amplitude
      <Switch v-model="config.linearAmplitude" />
      Linear Boost
      <Slider
        v-if="config.linearAmplitude"
        v-model="config.linearBoost"
        :min="1"
        :max="4"
        :step="0.1"
      />
    </div>

    <div>
      Color Mode
      <Radio
        v-for="[colorMode, label] of COLOR_MODE_MAP"
        :key="colorMode"
        v-model="config.colorMode"
        name="color-mode"
        :value="colorMode"
        :label="label"
      />

      Gradient (Channel 1)
      <Select size="sm">
        <option
          v-for="[buildInGradient, label] of BUILT_IN_GRADIENT_MAP"
          :key="buildInGradient"
          :value="buildInGradient"
        >
          {{ label }}
        </option>
      </Select>
      Gradient (Channel 2)
      <Select size="sm">
        <option
          v-for="[buildInGradient, label] of BUILT_IN_GRADIENT_MAP"
          :key="buildInGradient"
          :value="buildInGradient"
        >
          {{ label }}
        </option>
      </Select>
      Split Gradient
      <Switch v-model="config.splitGradient" />
    </div>

    <div>
      Alpha Bars
      <Switch v-model="config.alphaBars" />
      Ansi Bands
      <Switch v-model="config.ansiBands" />
      LED Bars
      <Switch v-model="config.ledBars" />
      True LED
      <Switch v-model="config.trueLeds" />
      Round Bars
      <Switch v-model="config.roundBars" />
      Lumi Bars
      <Switch v-model="config.lumiBars" />
      Outline Bars
      <Switch v-model="config.outlineBars" />
    </div>

    <div>
      Bar Space(modes 1-8 only)
      <div>
        <InputNumber
          v-model="config.barSpace"
          size="sm"
          :min="1"
          select-all-on-focus
          class="text-right"
        />
        px
      </div>
    </div>

    <div>
      Line Width (mode 10 only)
      <Slider
        v-model="config.lineWidth"
        :min="0"
        :max="50"
        :format="(val) => (val / 10).toFixed(1)"
      />
      Fill Alpha
      <Slider
        v-model="config.fillAlpha"
        :min="0"
        :max="10"
        :format="(val) => (val / 10).toFixed(1)"
      />
    </div>

    <div>
      Radial
      <Switch v-model="config.radial" />
      Spin Speed
      <Slider v-if="config.radial" v-model="config.spinSpeed" :min="-20" :max="20" />
    </div>

    <div>
      Reflex Ratio
      <Slider
        v-model="config.reflexRatio"
        :min="0"
        :max="70"
        :format="(val) => (val / 10).toFixed(1)"
      />
      Reflex Alpha
      <Slider v-model="config.reflexAlpha" :min="0" :max="1" :step="0.5" />
      Reflex Bright
      <Slider v-model="config.reflexBright" :min="0" :max="2.5" :step="0.1" />
      Relex Fit
      <Switch v-model="config.reflexFit" />
      Mirror
      <Radio
        v-for="[mirror, label] of MIRROR_MAP"
        :key="mirror"
        v-model="config.mirror"
        name="mirror"
        :value="mirror"
        :label="label"
      />
    </div>
  </div>

  <div>
    Scale X Label
    <Radio
      v-for="scaleXLabel in SCALE_X_LABELS"
      :key="scaleXLabel"
      v-model="config.scaleXLabel"
      name="scale-x-label"
      :value="scaleXLabel"
      :label="scaleXLabel"
    />

    Show Scale Y Label
    <Switch v-model="config.showScaleY" />
  </div>
</template>

<style lang="scss" scoped>
.visualizer-configs {
  width: 100%;
}
</style>
