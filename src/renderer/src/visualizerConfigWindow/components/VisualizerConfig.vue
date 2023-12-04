<script setup lang="ts">
import { inject, ref } from 'vue';
import { sendMessageToMainWindowKey } from '../injectionKeys';
import { useVisualizerConfigStore } from '../stores/visualizerConfig';
import {
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
import { KeyValue } from '@shared/types';

import ConfigGroup from './ConfigGroup.vue';
import ConfigRow from './ConfigRow.vue';
import ConfigItem from './ConfigItem.vue';
import Select from '@renderer/commonComponents/Select/Select.vue';
import Slider from '@renderer/commonComponents/Slider/Slider.vue';
import InputNumber from '@renderer/commonComponents/InputNumber/InputNumber.vue';
import Switch from '@renderer/commonComponents/Switch/Switch.vue';
import Radio from '@renderer/commonComponents/Radio/Radio.vue';

const { visualizerConfig } = useVisualizerConfigStore();

const config = ref(visualizerConfig[0]);
const sendMessageToMainWindow = inject(sendMessageToMainWindowKey);
const onChangeValue = async (keyValue: KeyValue<VisualizerConfig>) => {
  await window.electronAPI.invoke.updateVisualizerConfig(0, { [keyValue.key]: keyValue.value });

  sendMessageToMainWindow &&
    sendMessageToMainWindow({
      channel: 'changeVisualizerConfig',
      payload: { index: 0, ...keyValue },
    });
};

const fixedBarSpace = ref(config.value.barSpace >= 1);
const onChangeFixedBarSwitch = () => {
  config.value.barSpace = fixedBarSpace.value ? 1 : 0.1;
  onChangeValue({ key: 'barSpace', value: config.value.barSpace });
};
</script>

<template>
  <div class="visualizer-configs">
    <ConfigGroup title="Core">
      <ConfigRow>
        <ConfigItem item-name="Mode">
          <Select
            v-model="config.mode"
            size="sm"
            :options="
              Array.from(VISUALIZATION_MODE_MAP).map(([value, label]) => ({ label, value }))
            "
            @update:model-value="onChangeValue({ key: 'mode', value: config.mode })"
          >
          </Select>
        </ConfigItem>
      </ConfigRow>

      <div class="config-row column-gap-4">
        <ConfigItem item-name="FFT Size" class="w-7rem">
          <Select
            v-model="config.fftSize"
            size="sm"
            :options="FFT_SIZES.map((fftSize) => ({ label: fftSize.toString(), value: fftSize }))"
            class="text-right"
            @update:model-value="onChangeValue({ key: 'fftSize', value: config.fftSize })"
          >
          </Select>
        </ConfigItem>
        <ConfigItem item-name="FFT Size Smoothing Time Constant" style="width: 18rem">
          <div class="flex align-items-center" style="height: 2.5rem">
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

      <ConfigRow>
        <ConfigItem item-name="Min Frequency" class="w-7rem">
          <Select
            v-model="config.minFreq"
            size="sm"
            :options="
              MIN_FREQUENCIES.map((minFreq) => ({
                label: `${minFreq} Hz`,
                value: minFreq,
              }))
            "
            class="text-right"
            @update:model-value="onChangeValue({ key: 'minFreq', value: config.minFreq })"
          >
          </Select>
        </ConfigItem>
        <ConfigItem item-name="Max Frequency" class="w-7rem">
          <Select
            v-model="config.maxFreq"
            size="sm"
            :options="
              MAX_FREQUENCIES.map((maxFreq) => ({
                label: `${maxFreq / 1000}k Hz`,
                value: maxFreq,
              }))
            "
            class="text-right"
            @update:model-value="onChangeValue({ key: 'maxFreq', value: config.maxFreq })"
          >
          </Select>
        </ConfigItem>
        <ConfigItem item-name="Frequency Scale">
          <div class="frequency-scales-radio-group">
            <Radio
              v-for="freqScale in FREQUENCY_SCALES"
              :key="freqScale"
              v-model="config.frequencyScale"
              name="frequency-scales"
              size="sm"
              :value="freqScale"
              :label="freqScale"
              class="frequency-scales-radio"
              @change="onChangeValue({ key: 'frequencyScale', value: config.frequencyScale })"
            />
          </div>
        </ConfigItem>
      </ConfigRow>

      <ConfigRow>
        <ConfigItem item-name="Weighting Filter">
          <div class="flex flex-wrap column-gap-4 row-gap-2">
            <Radio
              v-for="[weightingFilter, label] of WEIGHTING_FILTER_MAP"
              :key="weightingFilter"
              v-model="config.weightingFilter"
              name="weighting-filter"
              size="sm"
              :value="weightingFilter"
              :label="label"
              @change="onChangeValue({ key: 'weightingFilter', value: config.weightingFilter })"
            />
          </div>
        </ConfigItem>
      </ConfigRow>
      <div class="config-row w-full">
        <ConfigItem item-name="Min Decibels" class="flex-grow-1" style="max-width: 18rem">
          <div class="flex align-items-center" style="height: 1.75rem">
            <Slider
              v-model="config.minDecibels"
              :min="-120"
              :max="-60"
              :step="5"
              :bar-width="0.75"
              @update:model-value="onChangeValue({ key: 'minDecibels', value: config.minDecibels })"
            />
          </div>
        </ConfigItem>
        <ConfigItem item-name="Max Decibels" class="flex-grow-1" style="max-width: 18rem">
          <div class="flex align-items-center" style="height: 1.75rem">
            <Slider
              v-model="config.maxDecibels"
              :min="-40"
              :max="0"
              :step="5"
              :bar-width="0.75"
              @update:model-value="onChangeValue({ key: 'maxDecibels', value: config.maxDecibels })"
            />
          </div>
        </ConfigItem>
      </div>

      <ConfigRow>
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
          <div class="flex align-items-center" style="height: 1.75rem">
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
      </ConfigRow>
    </ConfigGroup>

    <ConfigGroup title="Appearance">
      <ConfigRow>
        <ConfigItem item-name="Channel Layout" class="row-gap-2">
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
      </ConfigRow>

      <div v-if="config.channelLayout !== 'single'" class="config-row">
        <ConfigItem item-name="Mirror">
          <div class="flex flex-wrap column-gap-4 row-gap-2">
            <Radio
              v-for="[mirror, label] of MIRROR_MAP"
              :key="mirror"
              v-model="config.mirror"
              name="mirror"
              size="sm"
              :value="mirror"
              :label="label"
              @change="onChangeValue({ key: 'mirror', value: config.mirror })"
            />
          </div>
        </ConfigItem>
      </div>

      <ConfigRow>
        <ConfigItem item-name="Color Mode">
          <div class="flex flex-wrap column-gap-4 row-gap-2">
            <Radio
              v-for="[colorMode, label] of COLOR_MODE_MAP"
              :key="colorMode"
              v-model="config.colorMode"
              name="color-mode"
              size="sm"
              :value="colorMode"
              :label="label"
              @change="onChangeValue({ key: 'colorMode', value: config.colorMode })"
            />
          </div>
        </ConfigItem>
      </ConfigRow>

      <ConfigRow>
        <ConfigItem item-name="Gradient (Channel 1)" style="min-width: 10rem">
          <Select
            v-model="config.gradientLeft"
            size="sm"
            :options="Array.from(BUILT_IN_GRADIENT_MAP).map(([value, label]) => ({ label, value }))"
            @update:model-value="onChangeValue({ key: 'gradientLeft', value: config.gradientLeft })"
          >
          </Select>
        </ConfigItem>
        <ConfigItem
          v-if="config.channelLayout !== 'single'"
          item-name="Gradient (Channel 2)"
          style="min-width: 10rem"
        >
          <Select
            v-model="config.gradientRight"
            size="sm"
            :options="Array.from(BUILT_IN_GRADIENT_MAP).map(([value, label]) => ({ label, value }))"
            @update:model-value="
              onChangeValue({ key: 'gradientRight', value: config.gradientRight })
            "
          >
          </Select>
        </ConfigItem>
        <ConfigItem v-if="config.channelLayout !== 'single'" item-name="Split Gradient">
          <div class="flex align-items-center" style="height: 2.5rem">
            <Switch
              v-model="config.splitGradient"
              size="sm"
              @change="onChangeValue({ key: 'splitGradient', value: config.splitGradient })"
            />
          </div>
        </ConfigItem>
      </ConfigRow>

      <ConfigRow>
        <ConfigItem item-name="Radial">
          <Switch
            v-model="config.radial"
            size="sm"
            @change="onChangeValue({ key: 'radial', value: config.radial })"
          />
        </ConfigItem>
        <ConfigItem
          v-if="config.radial"
          item-name="Spin Speed"
          class="flex-grow-1"
          style="max-width: 18rem"
        >
          <div class="flex align-items-center" style="height: 1.75rem">
            <Slider
              v-model="config.spinSpeed"
              :min="-20"
              :max="20"
              :bar-width="0.75"
              @update:model-value="onChangeValue({ key: 'spinSpeed', value: config.spinSpeed })"
            />
          </div>
        </ConfigItem>
      </ConfigRow>

      <ConfigRow>
        <ConfigItem item-name="Alpha Bars" style="min-width: 5rem">
          <Switch
            v-model="config.alphaBars"
            size="sm"
            @change="onChangeValue({ key: 'alphaBars', value: config.alphaBars })"
          />
        </ConfigItem>
        <ConfigItem item-name="Ansi Bands" style="min-width: 5rem">
          <Switch
            v-model="config.ansiBands"
            size="sm"
            @change="onChangeValue({ key: 'ansiBands', value: config.ansiBands })"
          />
        </ConfigItem>
        <ConfigItem item-name="LED Bars" style="min-width: 5rem">
          <Switch
            v-model="config.ledBars"
            size="sm"
            @change="onChangeValue({ key: 'ledBars', value: config.ledBars })"
          />
        </ConfigItem>
        <ConfigItem item-name="True LED" style="min-width: 5rem">
          <Switch
            v-model="config.trueLeds"
            size="sm"
            @change="onChangeValue({ key: 'trueLeds', value: config.trueLeds })"
          />
        </ConfigItem>
        <ConfigItem item-name="Round Bars" style="min-width: 5rem">
          <Switch
            v-model="config.roundBars"
            size="sm"
            @change="onChangeValue({ key: 'roundBars', value: config.roundBars })"
          />
        </ConfigItem>
        <ConfigItem item-name="Lumi Bars" style="min-width: 5rem">
          <Switch
            v-model="config.lumiBars"
            size="sm"
            @change="onChangeValue({ key: 'lumiBars', value: config.lumiBars })"
          />
        </ConfigItem>
        <ConfigItem item-name="Outline Bars" style="min-width: 5rem">
          <Switch
            v-model="config.outlineBars"
            size="sm"
            @change="onChangeValue({ key: 'outlineBars', value: config.outlineBars })"
          />
        </ConfigItem>
      </ConfigRow>

      <ConfigRow>
        <ConfigItem item-name="Fixed Bar Space">
          <div class="flex align-items-center" style="height: 2.5rem">
            <Switch v-model="fixedBarSpace" size="sm" @change="onChangeFixedBarSwitch" />
          </div>
        </ConfigItem>

        <ConfigItem item-name="Bar Space" class="flex-grow-1" style="max-width: 18rem">
          <div v-if="fixedBarSpace">
            <InputNumber
              v-model="config.barSpace"
              size="sm"
              :min="1"
              select-all-on-focus
              class="text-right"
              style="max-width: 8rem"
              @update:model-value="onChangeValue({ key: 'barSpace', value: config.barSpace })"
            />
            px
          </div>
          <div v-else class="flex align-items-center" style="height: 2.5rem">
            <Slider
              v-model="config.barSpace"
              :min="0"
              :max="0.95"
              :step="0.05"
              :format="(val) => `${Number.parseFloat((val * 100).toFixed(10))}%`"
              :bar-width="0.75"
              @update:model-value="onChangeValue({ key: 'barSpace', value: config.barSpace })"
            />
          </div>
        </ConfigItem>
      </ConfigRow>

      <ConfigRow>
        <!-- // TODO:  (mode 10 only) -->
        <ConfigItem item-name="Line Width" class="flex-grow-1" style="max-width: 18rem">
          <div class="flex align-items-center" style="height: 1.75rem">
            <Slider
              v-model="config.lineWidth"
              :min="0"
              :max="5"
              :step="0.1"
              :bar-width="0.75"
              :format="(val) => `${val}px`"
              @update:model-value="onChangeValue({ key: 'lineWidth', value: config.lineWidth })"
            />
          </div>
        </ConfigItem>
        <ConfigItem item-name="Fill Alpha" class="flex-grow-1" style="max-width: 18rem">
          <div class="flex align-items-center" style="height: 1.75rem">
            <Slider
              v-model="config.fillAlpha"
              :min="0"
              :max="1"
              :step="0.01"
              :bar-width="0.75"
              :format="(val) => `${Number.parseFloat((val * 100).toFixed(10))}%`"
              @update:model-value="onChangeValue({ key: 'fillAlpha', value: config.fillAlpha })"
            />
          </div>
        </ConfigItem>
      </ConfigRow>

      <ConfigRow>
        <ConfigItem item-name="Reflex Ratio" class="flex-grow-1" style="max-width: 18rem">
          <div class="flex align-items-center" style="height: 1.75rem">
            <Slider
              v-model="config.reflexRatio"
              :min="0"
              :max="0.7"
              :step="0.01"
              :bar-width="0.75"
              @update:model-value="onChangeValue({ key: 'reflexRatio', value: config.reflexRatio })"
            />
          </div>
        </ConfigItem>
        <ConfigItem v-if="config.reflexRatio > 0" item-name="Relex Fit">
          <Switch
            v-model="config.reflexFit"
            size="sm"
            @change="onChangeValue({ key: 'reflexFit', value: config.reflexFit })"
          />
        </ConfigItem>
      </ConfigRow>

      <div v-if="config.reflexRatio > 0" class="config-row">
        <ConfigItem item-name="Reflex Alpha" class="flex-grow-1" style="max-width: 18rem">
          <div class="flex align-items-center" style="height: 1.75rem">
            <Slider
              v-model="config.reflexAlpha"
              :min="0"
              :max="1"
              :step="0.05"
              :bar-width="0.75"
              @update:model-value="onChangeValue({ key: 'reflexAlpha', value: config.reflexAlpha })"
            />
          </div>
        </ConfigItem>
        <ConfigItem item-name="Reflex Bright" class="flex-grow-1" style="max-width: 18rem">
          <div class="flex align-items-center" style="height: 1.75rem">
            <Slider
              v-model="config.reflexBright"
              :min="0"
              :max="2.5"
              :step="0.1"
              :bar-width="0.75"
              @update:model-value="
                onChangeValue({ key: 'reflexBright', value: config.reflexBright })
              "
            />
          </div>
        </ConfigItem>
      </div>

      <ConfigRow>
        <ConfigItem item-name="Show Peaks">
          <Switch
            v-model="config.showPeaks"
            size="sm"
            @change="onChangeValue({ key: 'showPeaks', value: config.showPeaks })"
          />
        </ConfigItem>

        <ConfigItem v-if="config.showPeaks" item-name="Show Peak Line">
          <Switch
            v-model="config.peakLine"
            size="sm"
            @change="onChangeValue({ key: 'peakLine', value: config.peakLine })"
          />
        </ConfigItem>
      </ConfigRow>

      <ConfigRow>
        <ConfigItem item-name="Scale X Label">
          <div class="flex flex-wrap column-gap-4 row-gap-2">
            <Radio
              v-for="scaleXLabel in SCALE_X_LABELS"
              :key="scaleXLabel"
              v-model="config.scaleXLabel"
              name="scale-x-label"
              size="sm"
              :value="scaleXLabel"
              :label="scaleXLabel"
              @change="onChangeValue({ key: 'scaleXLabel', value: config.scaleXLabel })"
            />
          </div>
        </ConfigItem>
      </ConfigRow>

      <ConfigRow>
        <ConfigItem item-name="Show Scale Y Label">
          <Switch
            v-model="config.showScaleY"
            size="sm"
            @change="onChangeValue({ key: 'showScaleY', value: config.showScaleY })"
          />
        </ConfigItem>
      </ConfigRow>
    </ConfigGroup>
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
