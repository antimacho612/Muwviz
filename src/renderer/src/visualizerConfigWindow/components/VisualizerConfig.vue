<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { openPresetModalKey, sendMessageToMainWindowKey } from '../injectionKeys';
import { useVisualizersConfigStore } from '../stores/visualizersConfig';
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
  ScaleXLabel,
} from '@shared/visualizerTypes';
import { KeyValue } from '@shared/types';

import ConfigGroup from './ConfigGroup.vue';
import ConfigRow from './ConfigRow.vue';
import ConfigItem from './ConfigItem.vue';
import Button from '@renderer/commonComponents/Button/Button.vue';
import Select from '@renderer/commonComponents/Select/Select.vue';
import Slider from '@renderer/commonComponents/Slider/Slider.vue';
import InputNumber from '@renderer/commonComponents/InputNumber/InputNumber.vue';
import Switch from '@renderer/commonComponents/Switch/Switch.vue';
import Radio from '@renderer/commonComponents/Radio/Radio.vue';
import ColorPicker from '@renderer/commonComponents/ColorPicker/ColorPicker.vue';

const props = defineProps<{ currentVisualizerIndex: number }>();
const currentIndex = computed(() => props.currentVisualizerIndex);

const openPresetModal = inject(openPresetModalKey);
const onClickOpenPresetMenu = () => openPresetModal?.();

const { configs } = useVisualizersConfigStore();
const currentVisualizerConfig = computed(() => configs[currentIndex.value]);

const sendMessageToMainWindow = inject(sendMessageToMainWindowKey);

const onChangeValue = async (keyValue: KeyValue<VisualizerConfig>) => {
  await window.electron.invoke.updateVisualizerConfig(currentIndex.value, {
    [keyValue.key]: keyValue.value,
  });

  if (!sendMessageToMainWindow) return;

  if (keyValue.key === 'isOn') {
    sendMessageToMainWindow({
      channel: 'changeVisualizerState',
      payload: { index: currentIndex.value, isOn: keyValue.value },
    });
  } else if (keyValue.key === 'backgroundColor') {
    sendMessageToMainWindow({
      channel: 'changeVisualizerBackgroundColor',
      payload: { index: currentIndex.value, color: keyValue.value },
    });
  } else {
    sendMessageToMainWindow({
      channel: 'changeVisualizerOption',
      payload: { index: currentIndex.value, ...keyValue },
    });
  }
};

const fixedBarSpace = ref(currentVisualizerConfig.value.barSpace >= 1);
const onChangeFixedBarSwitch = async () => {
  currentVisualizerConfig.value.barSpace = fixedBarSpace.value ? 1 : 0.1;
  await onChangeValue({ key: 'barSpace', value: currentVisualizerConfig.value.barSpace });
};

const scaleXLabel = ref<ScaleXLabel>(
  currentVisualizerConfig.value.showScaleX
    ? currentVisualizerConfig.value.noteLabels
      ? 'Musical Notes'
      : 'Frequencies'
    : 'None'
);
const onChangeScaleXLabel = async () => {
  await onChangeValue({ key: 'showScaleX', value: scaleXLabel.value !== 'None' });
  await onChangeValue({ key: 'noteLabels', value: scaleXLabel.value === 'Musical Notes' });
};
</script>

<template>
  <div class="visualizer-configs">
    <ConfigGroup title="Core">
      <ConfigRow>
        <ConfigItem item-name="Off / On" class="w-4rem">
          <Switch
            v-model="currentVisualizerConfig.isOn"
            size="sm"
            @change="
              onChangeValue({
                key: 'isOn',
                value: currentVisualizerConfig.isOn,
              })
            "
          />
        </ConfigItem>
        <Button size="xs" class="mt-auto px-3" @click="onClickOpenPresetMenu">
          <span class="text-sm">プリセットメニュー...</span>
        </Button>
      </ConfigRow>

      <ConfigRow>
        <ConfigItem item-name="Mode">
          <Select
            v-model="currentVisualizerConfig.mode"
            size="sm"
            :options="Array.from(VISUALIZATION_MODE_MAP).map(([value, label]) => ({ label, value }))"
            @update:model-value="onChangeValue({ key: 'mode', value: currentVisualizerConfig.mode })"
          >
          </Select>
        </ConfigItem>
      </ConfigRow>

      <ConfigRow>
        <ConfigItem item-name="FFT Size" class="w-7rem">
          <Select
            v-model="currentVisualizerConfig.fftSize"
            size="sm"
            :options="FFT_SIZES.map((fftSize) => ({ label: fftSize.toString(), value: fftSize }))"
            class="text-right"
            @update:model-value="onChangeValue({ key: 'fftSize', value: currentVisualizerConfig.fftSize })"
          >
          </Select>
        </ConfigItem>
        <ConfigItem item-name="FFT Size Smoothing Time Constant" style="width: 18rem">
          <div class="flex align-items-center" style="height: 2.5rem">
            <Slider
              v-model="currentVisualizerConfig.smoothing"
              :min="0"
              :max="0.95"
              :step="0.05"
              :bar-width="0.75"
              @update:model-value="onChangeValue({ key: 'smoothing', value: currentVisualizerConfig.smoothing })"
            />
          </div>
        </ConfigItem>
      </ConfigRow>

      <ConfigRow>
        <ConfigItem item-name="Min Frequency" class="w-7rem">
          <Select
            v-model="currentVisualizerConfig.minFreq"
            size="sm"
            :options="
              MIN_FREQUENCIES.map((minFreq) => ({
                label: `${minFreq} Hz`,
                value: minFreq,
              }))
            "
            class="text-right"
            @update:model-value="onChangeValue({ key: 'minFreq', value: currentVisualizerConfig.minFreq })"
          >
          </Select>
        </ConfigItem>
        <ConfigItem item-name="Max Frequency" class="w-7rem">
          <Select
            v-model="currentVisualizerConfig.maxFreq"
            size="sm"
            :options="
              MAX_FREQUENCIES.map((maxFreq) => ({
                label: `${maxFreq / 1000}k Hz`,
                value: maxFreq,
              }))
            "
            class="text-right"
            @update:model-value="onChangeValue({ key: 'maxFreq', value: currentVisualizerConfig.maxFreq })"
          >
          </Select>
        </ConfigItem>
        <ConfigItem item-name="Frequency Scale">
          <div class="frequency-scale-radio-group">
            <Radio
              v-for="freqScale in FREQUENCY_SCALES"
              :key="freqScale"
              v-model="currentVisualizerConfig.frequencyScale"
              name="frequency-scales"
              size="sm"
              :value="freqScale"
              :label="freqScale"
              class="frequency-scale-radio"
              @change="
                onChangeValue({
                  key: 'frequencyScale',
                  value: currentVisualizerConfig.frequencyScale,
                })
              "
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
              v-model="currentVisualizerConfig.weightingFilter"
              name="weighting-filter"
              size="sm"
              :value="weightingFilter"
              :label="label"
              style="min-width: 3rem"
              @change="
                onChangeValue({
                  key: 'weightingFilter',
                  value: currentVisualizerConfig.weightingFilter,
                })
              "
            />
          </div>
        </ConfigItem>
      </ConfigRow>

      <ConfigRow>
        <ConfigItem item-name="Min Decibels" class="flex-grow-1" style="max-width: 18rem">
          <div class="flex align-items-center" style="height: 1.75rem">
            <Slider
              v-model="currentVisualizerConfig.minDecibels"
              :min="-120"
              :max="-60"
              :step="5"
              :bar-width="0.75"
              @update:model-value="onChangeValue({ key: 'minDecibels', value: currentVisualizerConfig.minDecibels })"
            />
          </div>
        </ConfigItem>
        <ConfigItem item-name="Max Decibels" class="flex-grow-1" style="max-width: 18rem">
          <div class="flex align-items-center" style="height: 1.75rem">
            <Slider
              v-model="currentVisualizerConfig.maxDecibels"
              :min="-40"
              :max="0"
              :step="5"
              :bar-width="0.75"
              @update:model-value="onChangeValue({ key: 'maxDecibels', value: currentVisualizerConfig.maxDecibels })"
            />
          </div>
        </ConfigItem>
      </ConfigRow>

      <ConfigRow>
        <ConfigItem item-name="Linear Amplitude">
          <Switch
            v-model="currentVisualizerConfig.linearAmplitude"
            size="sm"
            @change="
              onChangeValue({
                key: 'linearAmplitude',
                value: currentVisualizerConfig.linearAmplitude,
              })
            "
          />
        </ConfigItem>
        <ConfigItem
          v-if="currentVisualizerConfig.linearAmplitude"
          item-name="Linear Boost"
          style="flex-grow: 1; max-width: 18rem"
        >
          <div class="flex align-items-center" style="height: 1.75rem">
            <Slider
              v-model="currentVisualizerConfig.linearBoost"
              :min="1"
              :max="4"
              :step="0.1"
              :bar-width="0.75"
              @update:model-value="onChangeValue({ key: 'linearBoost', value: currentVisualizerConfig.linearBoost })"
            />
          </div>
        </ConfigItem>
      </ConfigRow>
    </ConfigGroup>

    <ConfigGroup title="Appearance">
      <ConfigRow>
        <ConfigItem item-name="背景色">
          <div class="flex align-items-center column-gap-2">
            <ColorPicker
              v-model="currentVisualizerConfig.backgroundColor"
              size="sm"
              class="background-color-picker"
              @update:model-value="
                onChangeValue({
                  key: 'backgroundColor',
                  value: currentVisualizerConfig.backgroundColor,
                })
              "
            />
            {{ currentVisualizerConfig.backgroundColor }}
          </div>
        </ConfigItem>
      </ConfigRow>

      <ConfigRow>
        <ConfigItem item-name="Channel Layout" class="row-gap-2">
          <div class="flex flex-wrap column-gap-4 row-gap-2">
            <Radio
              v-for="[channelLayout, label] of CHANNEL_LAYOUT_MAP"
              :key="channelLayout"
              v-model="currentVisualizerConfig.channelLayout"
              name="channel-layout"
              size="sm"
              :label="label"
              :value="channelLayout"
              class="channel-layout-radio"
              @change="
                onChangeValue({
                  key: 'channelLayout',
                  value: currentVisualizerConfig.channelLayout,
                })
              "
            />
          </div>
        </ConfigItem>
      </ConfigRow>

      <ConfigRow v-if="currentVisualizerConfig.channelLayout !== 'single'">
        <ConfigItem item-name="Mirror">
          <div class="flex flex-wrap column-gap-4 row-gap-2">
            <Radio
              v-for="[mirror, label] of MIRROR_MAP"
              :key="mirror"
              v-model="currentVisualizerConfig.mirror"
              name="mirror"
              size="sm"
              :value="mirror"
              :label="label"
              @change="onChangeValue({ key: 'mirror', value: currentVisualizerConfig.mirror })"
            />
          </div>
        </ConfigItem>
      </ConfigRow>

      <ConfigRow>
        <ConfigItem item-name="Color Mode">
          <div class="flex flex-wrap column-gap-4 row-gap-2">
            <Radio
              v-for="[colorMode, label] of COLOR_MODE_MAP"
              :key="colorMode"
              v-model="currentVisualizerConfig.colorMode"
              name="color-mode"
              size="sm"
              :value="colorMode"
              :label="label"
              @change="onChangeValue({ key: 'colorMode', value: currentVisualizerConfig.colorMode })"
            />
          </div>
        </ConfigItem>
      </ConfigRow>

      <ConfigRow>
        <ConfigItem item-name="Gradient (Channel 1)" style="min-width: 10rem">
          <Select
            v-model="currentVisualizerConfig.gradientLeft"
            size="sm"
            :options="Array.from(BUILT_IN_GRADIENT_MAP).map(([value, label]) => ({ label, value }))"
            @update:model-value="onChangeValue({ key: 'gradientLeft', value: currentVisualizerConfig.gradientLeft })"
          >
          </Select>
        </ConfigItem>
        <ConfigItem
          v-if="currentVisualizerConfig.channelLayout !== 'single'"
          item-name="Gradient (Channel 2)"
          style="min-width: 10rem"
        >
          <Select
            v-model="currentVisualizerConfig.gradientRight"
            size="sm"
            :options="Array.from(BUILT_IN_GRADIENT_MAP).map(([value, label]) => ({ label, value }))"
            @update:model-value="onChangeValue({ key: 'gradientRight', value: currentVisualizerConfig.gradientRight })"
          >
          </Select>
        </ConfigItem>
        <ConfigItem v-if="currentVisualizerConfig.channelLayout !== 'single'" item-name="Split Gradient">
          <div class="flex align-items-center" style="height: 2.5rem">
            <Switch
              v-model="currentVisualizerConfig.splitGradient"
              size="sm"
              @change="
                onChangeValue({
                  key: 'splitGradient',
                  value: currentVisualizerConfig.splitGradient,
                })
              "
            />
          </div>
        </ConfigItem>
      </ConfigRow>

      <ConfigRow>
        <ConfigItem item-name="Radial">
          <Switch
            v-model="currentVisualizerConfig.radial"
            size="sm"
            @change="onChangeValue({ key: 'radial', value: currentVisualizerConfig.radial })"
          />
        </ConfigItem>
        <ConfigItem
          v-if="currentVisualizerConfig.radial"
          item-name="Spin Speed"
          class="flex-grow-1"
          style="max-width: 18rem"
        >
          <div class="flex align-items-center" style="height: 1.75rem">
            <Slider
              v-model="currentVisualizerConfig.spinSpeed"
              :min="-20"
              :max="20"
              :bar-width="0.75"
              @update:model-value="onChangeValue({ key: 'spinSpeed', value: currentVisualizerConfig.spinSpeed })"
            />
          </div>
        </ConfigItem>
      </ConfigRow>

      <ConfigRow>
        <ConfigItem item-name="Alpha Bars" style="min-width: 5rem">
          <Switch
            v-model="currentVisualizerConfig.alphaBars"
            size="sm"
            @change="onChangeValue({ key: 'alphaBars', value: currentVisualizerConfig.alphaBars })"
          />
        </ConfigItem>
        <ConfigItem item-name="Ansi Bands" style="min-width: 5rem">
          <Switch
            v-model="currentVisualizerConfig.ansiBands"
            size="sm"
            @change="onChangeValue({ key: 'ansiBands', value: currentVisualizerConfig.ansiBands })"
          />
        </ConfigItem>
        <ConfigItem item-name="LED Bars" style="min-width: 5rem">
          <Switch
            v-model="currentVisualizerConfig.ledBars"
            size="sm"
            @change="onChangeValue({ key: 'ledBars', value: currentVisualizerConfig.ledBars })"
          />
        </ConfigItem>
        <ConfigItem item-name="True LED" style="min-width: 5rem">
          <Switch
            v-model="currentVisualizerConfig.trueLeds"
            size="sm"
            @change="onChangeValue({ key: 'trueLeds', value: currentVisualizerConfig.trueLeds })"
          />
        </ConfigItem>
        <ConfigItem item-name="Round Bars" style="min-width: 5rem">
          <Switch
            v-model="currentVisualizerConfig.roundBars"
            size="sm"
            @change="onChangeValue({ key: 'roundBars', value: currentVisualizerConfig.roundBars })"
          />
        </ConfigItem>
        <ConfigItem item-name="Lumi Bars" style="min-width: 5rem">
          <Switch
            v-model="currentVisualizerConfig.lumiBars"
            size="sm"
            @change="onChangeValue({ key: 'lumiBars', value: currentVisualizerConfig.lumiBars })"
          />
        </ConfigItem>
        <ConfigItem item-name="Outline Bars" style="min-width: 5rem">
          <Switch
            v-model="currentVisualizerConfig.outlineBars"
            size="sm"
            @change="onChangeValue({ key: 'outlineBars', value: currentVisualizerConfig.outlineBars })"
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
              v-model="currentVisualizerConfig.barSpace"
              size="sm"
              :min="1"
              select-all-on-focus
              class="text-right"
              style="max-width: 8rem"
              @update:model-value="onChangeValue({ key: 'barSpace', value: currentVisualizerConfig.barSpace })"
            />
            px
          </div>
          <div v-else class="flex align-items-center" style="height: 2.5rem">
            <Slider
              v-model="currentVisualizerConfig.barSpace"
              :min="0"
              :max="0.95"
              :step="0.05"
              :format="(val) => `${Number.parseFloat((val * 100).toFixed(10))}%`"
              :bar-width="0.75"
              @update:model-value="onChangeValue({ key: 'barSpace', value: currentVisualizerConfig.barSpace })"
            />
          </div>
        </ConfigItem>
      </ConfigRow>

      <ConfigRow>
        <ConfigItem
          v-if="currentVisualizerConfig.mode === 10"
          item-name="Line Width"
          class="flex-grow-1"
          style="max-width: 18rem"
        >
          <div class="flex align-items-center" style="height: 1.75rem">
            <Slider
              v-model="currentVisualizerConfig.lineWidth"
              :min="0"
              :max="5"
              :step="0.1"
              :bar-width="0.75"
              :format="(val) => `${val}px`"
              @update:model-value="onChangeValue({ key: 'lineWidth', value: currentVisualizerConfig.lineWidth })"
            />
          </div>
        </ConfigItem>
        <ConfigItem item-name="Fill Alpha" class="flex-grow-1" style="max-width: 18rem">
          <div class="flex align-items-center" style="height: 1.75rem">
            <Slider
              v-model="currentVisualizerConfig.fillAlpha"
              :min="0"
              :max="1"
              :step="0.01"
              :bar-width="0.75"
              :format="(val) => `${Number.parseFloat((val * 100).toFixed(10))}%`"
              @update:model-value="onChangeValue({ key: 'fillAlpha', value: currentVisualizerConfig.fillAlpha })"
            />
          </div>
        </ConfigItem>
      </ConfigRow>

      <ConfigRow>
        <ConfigItem item-name="Reflex Ratio" class="flex-grow-1" style="max-width: 18rem">
          <div class="flex align-items-center" style="height: 1.75rem">
            <Slider
              v-model="currentVisualizerConfig.reflexRatio"
              :min="0"
              :max="0.7"
              :step="0.01"
              :bar-width="0.75"
              @update:model-value="onChangeValue({ key: 'reflexRatio', value: currentVisualizerConfig.reflexRatio })"
            />
          </div>
        </ConfigItem>
        <ConfigItem v-if="currentVisualizerConfig.reflexRatio > 0" item-name="Relex Fit">
          <Switch
            v-model="currentVisualizerConfig.reflexFit"
            size="sm"
            @change="onChangeValue({ key: 'reflexFit', value: currentVisualizerConfig.reflexFit })"
          />
        </ConfigItem>
      </ConfigRow>

      <ConfigRow v-if="currentVisualizerConfig.reflexRatio > 0">
        <ConfigItem item-name="Reflex Alpha" class="flex-grow-1" style="max-width: 18rem">
          <div class="flex align-items-center" style="height: 1.75rem">
            <Slider
              v-model="currentVisualizerConfig.reflexAlpha"
              :min="0"
              :max="1"
              :step="0.05"
              :bar-width="0.75"
              @update:model-value="onChangeValue({ key: 'reflexAlpha', value: currentVisualizerConfig.reflexAlpha })"
            />
          </div>
        </ConfigItem>
        <ConfigItem item-name="Reflex Bright" class="flex-grow-1" style="max-width: 18rem">
          <div class="flex align-items-center" style="height: 1.75rem">
            <Slider
              v-model="currentVisualizerConfig.reflexBright"
              :min="0"
              :max="2.5"
              :step="0.1"
              :bar-width="0.75"
              @update:model-value="onChangeValue({ key: 'reflexBright', value: currentVisualizerConfig.reflexBright })"
            />
          </div>
        </ConfigItem>
      </ConfigRow>

      <ConfigRow>
        <ConfigItem item-name="Show Peaks">
          <Switch
            v-model="currentVisualizerConfig.showPeaks"
            size="sm"
            @change="onChangeValue({ key: 'showPeaks', value: currentVisualizerConfig.showPeaks })"
          />
        </ConfigItem>

        <ConfigItem v-if="currentVisualizerConfig.showPeaks" item-name="Show Peak Line">
          <Switch
            v-model="currentVisualizerConfig.peakLine"
            size="sm"
            @change="onChangeValue({ key: 'peakLine', value: currentVisualizerConfig.peakLine })"
          />
        </ConfigItem>
      </ConfigRow>

      <ConfigRow>
        <ConfigItem item-name="Scale X Label">
          <div class="flex flex-wrap column-gap-4 row-gap-2">
            <Radio
              v-for="xLabel in SCALE_X_LABELS"
              :key="xLabel"
              v-model="scaleXLabel"
              name="scale-x-label"
              size="sm"
              :value="xLabel"
              :label="xLabel"
              class="scale-x-label-radio"
              :class="{ none: xLabel === 'None' }"
              @change="onChangeScaleXLabel"
            />
          </div>
        </ConfigItem>
      </ConfigRow>

      <ConfigRow>
        <ConfigItem item-name="Show Scale Y Label">
          <Switch
            v-model="currentVisualizerConfig.showScaleY"
            size="sm"
            @change="onChangeValue({ key: 'showScaleY', value: currentVisualizerConfig.showScaleY })"
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
  padding-bottom: 0.75rem;
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;
  overflow-x: hidden;
  overflow-y: scroll;
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

.frequency-scale-radio-group {
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

.frequency-scale-radio {
  flex-basis: 40%;
  @media (min-width: 400px) {
    flex-basis: auto;
    min-width: 4rem;
  }
}

.scale-x-label-radio.none {
  flex-basis: 45%;
  @media (min-width: 480px) {
    flex-basis: auto;
  }
}
</style>
