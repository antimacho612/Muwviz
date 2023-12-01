<script setup lang="ts">
import { inject, ref } from 'vue';
import { sendMessageToMainWindowKey } from '../injectionKeys';
import { KeyValue } from '@shared/types';
import {
  getDefaultConfig,
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
  VisualizerConfig,
} from '@shared/visualizerTypes';

import ConfigGroup from './ConfigGroup.vue';
import ConfigItem from './ConfigItem.vue';
import Select from '@renderer/commonComponents/Select/Select.vue';
import Slider from '@renderer/commonComponents/Slider/Slider.vue';
import InputNumber from '@renderer/commonComponents/InputNumber/InputNumber.vue';
import Switch from '@renderer/commonComponents/Switch/Switch.vue';
import Radio from '@renderer/commonComponents/Radio/Radio.vue';

const config = ref(getDefaultConfig());

const sendMessageToMainWindow = inject(sendMessageToMainWindowKey);

const onChangeValue = (keyValuePair: KeyValue<VisualizerConfig>) =>
  sendMessageToMainWindow &&
  sendMessageToMainWindow({
    channel: 'changeVisualizerConfig',
    payload: { index: 0, ...keyValuePair },
  });
</script>

<template>
  <div class="visualizer-configs">
    <ConfigGroup title="Core">
      <div class="config-row">
        <ConfigItem item-name="Mode">
          <Select
            v-model="config.mode"
            size="sm"
            @change="onChangeValue({ key: 'mode', value: config.mode })"
          >
            <option
              v-for="[mode, label] of VISUALIZATION_MODE_MAP"
              :key="mode"
              :value="mode"
              :selected="mode === config.mode"
            >
              {{ label }}
            </option>
          </Select>
        </ConfigItem>
      </div>

      <div class="config-row">
        <ConfigItem item-name="Channel Layout" class="w-full row-gap-2">
          <div class="flex flex-wrap column-gap-4 row-gap-2">
            <Radio
              v-for="[channelLayout, label] of CHANNEL_LAYOUT_MAP"
              :key="channelLayout"
              v-model="config.channelLayout"
              name="channel-layout"
              size="sm"
              :label="label"
              :value="channelLayout"
              class="channel-layout-radio"
              @change="onChangeValue({ key: 'channelLayout', value: config.channelLayout })"
            />
          </div>
        </ConfigItem>
      </div>

      <div class="config-row column-gap-4">
        <ConfigItem item-name="FFT Size" class="w-7rem">
          <Select
            v-model="config.fftSize"
            size="sm"
            class="text-right"
            @change="onChangeValue({ key: 'fftSize', value: config.fftSize })"
          >
            <option
              v-for="fftSize in FFT_SIZES"
              :key="fftSize"
              :value="fftSize"
              :selected="fftSize === config.fftSize"
            >
              {{ fftSize }}
            </option>
          </Select>
        </ConfigItem>
        <ConfigItem item-name="FFT Size Smoothing Time Constant" style="width: 18rem">
          <div style="height: 2.5rem; display: flex; align-items: center">
            <Slider
              v-model="config.smoothing"
              :min="0"
              :max="0.95"
              :step="0.05"
              :bar-width="0.75"
              @update:model-value="onChangeValue({ key: 'smoothing', value: config.smoothing })"
            />
          </div>
        </ConfigItem>
      </div>

      <div class="config-row">
        <ConfigItem item-name="Min Frequency" class="w-7rem">
          <Select
            v-model="config.minFreq"
            size="sm"
            class="text-right"
            @change="onChangeValue({ key: 'minFreq', value: config.minFreq })"
          >
            <option
              v-for="minFreq in MIN_FREQUENCIES"
              :key="minFreq"
              :value="minFreq"
              :selected="minFreq === config.minFreq"
            >
              {{ minFreq }} Hz
            </option>
          </Select>
        </ConfigItem>
        <ConfigItem item-name="Max Frequency" class="w-7rem">
          <Select
            v-model="config.maxFreq"
            size="sm"
            class="text-right"
            @change="onChangeValue({ key: 'maxFreq', value: config.maxFreq })"
          >
            <option
              v-for="maxFreq in MAX_FREQUENCIES"
              :key="maxFreq"
              :value="maxFreq"
              :selected="maxFreq === config.maxFreq"
            >
              {{ maxFreq / 1000 }}k Hz
            </option>
          </Select>
        </ConfigItem>
        <ConfigItem item-name="Frequency Scale">
          <div class="frequency-scales-radio-group">
            <Radio
              v-for="freqScale in FREQUENCY_SCALES"
              :key="freqScale"
              v-model="config.frequencyScale"
              name="frequency-scales"
              :value="freqScale"
              :label="freqScale"
              class="frequency-scales-radio"
              @change="onChangeValue({ key: 'frequencyScale', value: config.frequencyScale })"
            />
          </div>
        </ConfigItem>
      </div>

      <div class="config-row">
        <ConfigItem item-name="Weighting Filter">
          <div class="flex flex-wrap column-gap-4 row-gap-2">
            <Radio
              v-for="[weightingFilter, label] of WEIGHTING_FILTER_MAP"
              :key="weightingFilter"
              v-model="config.weightingFilter"
              name="weighting-filter"
              :value="weightingFilter"
              :label="label"
              @change="onChangeValue({ key: 'weightingFilter', value: config.weightingFilter })"
            />
          </div>
        </ConfigItem>
      </div>
      <div class="config-row w-full">
        <ConfigItem item-name="Min Decibels" style="width: calc(50% - 0.5rem); max-width: 18rem">
          <Slider
            v-model="config.minDecibels"
            :min="-120"
            :max="-60"
            :step="5"
            :bar-width="0.75"
            @update:model-value="onChangeValue({ key: 'minDecibels', value: config.minDecibels })"
          />
        </ConfigItem>
        <ConfigItem item-name="Max Decibels" style="width: calc(50% - 0.5rem); max-width: 18rem">
          <Slider
            v-model="config.maxDecibels"
            :min="-40"
            :max="0"
            :step="5"
            :bar-width="0.75"
            @update:model-value="onChangeValue({ key: 'maxDecibels', value: config.maxDecibels })"
          />
        </ConfigItem>
      </div>

      <div class="config-row">
        <ConfigItem item-name="Linear Amplitude">
          <Switch
            v-model="config.linearAmplitude"
            size="sm"
            @change="onChangeValue({ key: 'linearAmplitude', value: config.linearAmplitude })"
          />
        </ConfigItem>
        <ConfigItem
          v-if="config.linearAmplitude"
          item-name="Linear Boost"
          style="flex-grow: 1; max-width: 18rem"
        >
          <div style="height: 1.75rem; display: flex; align-items: center">
            <Slider
              v-model="config.linearBoost"
              :min="1"
              :max="4"
              :step="0.1"
              :bar-width="0.75"
              @update:model-value="onChangeValue({ key: 'linearBoost', value: config.linearBoost })"
            />
          </div>
        </ConfigItem>
      </div>
    </ConfigGroup>

    <ConfigGroup title="Appearance">
      <div class="config-row"></div>
    </ConfigGroup>

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
  </div>
</template>

<style lang="scss" scoped>
.visualizer-configs {
  position: relative;
  width: 100%;
  height: 100%;
  padding-bottom: 0.5rem;
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;
  overflow-x: hidden;
  overflow-y: auto;
}

.config-row {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.channel-layout-radio {
  flex-basis: 100%;
  @media (min-width: 480px) {
    flex-basis: 40%;
  }
  @media (min-width: 700px) {
    flex-basis: auto;
    min-width: 6rem;
  }
}

.frequency-scales-radio-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 1rem;
  row-gap: 0.5rem;
  min-height: 2.5rem;
  @media (min-width: 400px) {
    flex-wrap: nowrap;
  }
}

.frequency-scales-radio {
  flex-basis: 40%;
  @media (min-width: 400px) {
    flex-basis: auto;
    min-width: 4rem;
  }
}
</style>
