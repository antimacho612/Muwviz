<script setup lang="ts">
import { computed, inject, ref } from 'vue';
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
  ScaleXLabel,
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

interface Props {
  currentVisualizerIndex: number;
}

const props = defineProps<Props>();
const currentIndex = computed(() => props.currentVisualizerIndex);

const { visualizerConfig } = useVisualizerConfigStore();
const currentVisualizerOptions = computed(() => visualizerConfig[currentIndex.value]);

const sendMessageToMainWindow = inject(sendMessageToMainWindowKey);

const onChangeValue = async (keyValue: KeyValue<VisualizerConfig>) => {
  await window.electronAPI.invoke.updateVisualizerConfig(currentIndex.value, {
    [keyValue.key]: keyValue.value,
  });

  if (sendMessageToMainWindow) {
    sendMessageToMainWindow({
      channel: 'changeVisualizerConfig',
      payload: { index: currentIndex.value, ...keyValue },
    });
  }
};

const fixedBarSpace = ref(currentVisualizerOptions.value.barSpace >= 1);
const onChangeFixedBarSwitch = async () => {
  currentVisualizerOptions.value.barSpace = fixedBarSpace.value ? 1 : 0.1;
  await onChangeValue({ key: 'barSpace', value: currentVisualizerOptions.value.barSpace });
};

const scaleXLabel = ref<ScaleXLabel>(
  currentVisualizerOptions.value.showScaleX
    ? currentVisualizerOptions.value.noteLabels
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
        <ConfigItem item-name="Mode">
          <Select
            v-model="currentVisualizerOptions.mode"
            size="sm"
            :options="
              Array.from(VISUALIZATION_MODE_MAP).map(([value, label]) => ({ label, value }))
            "
            @update:model-value="
              onChangeValue({ key: 'mode', value: currentVisualizerOptions.mode })
            "
          >
          </Select>
        </ConfigItem>
      </ConfigRow>

      <div class="config-row column-gap-4">
        <ConfigItem item-name="FFT Size" class="w-7rem">
          <Select
            v-model="currentVisualizerOptions.fftSize"
            size="sm"
            :options="FFT_SIZES.map((fftSize) => ({ label: fftSize.toString(), value: fftSize }))"
            class="text-right"
            @update:model-value="
              onChangeValue({ key: 'fftSize', value: currentVisualizerOptions.fftSize })
            "
          >
          </Select>
        </ConfigItem>
        <ConfigItem item-name="FFT Size Smoothing Time Constant" style="width: 18rem">
          <div class="flex align-items-center" style="height: 2.5rem">
            <Slider
              v-model="currentVisualizerOptions.smoothing"
              :min="0"
              :max="0.95"
              :step="0.05"
              :bar-width="0.75"
              @update:model-value="
                onChangeValue({ key: 'smoothing', value: currentVisualizerOptions.smoothing })
              "
            />
          </div>
        </ConfigItem>
      </div>

      <ConfigRow>
        <ConfigItem item-name="Min Frequency" class="w-7rem">
          <Select
            v-model="currentVisualizerOptions.minFreq"
            size="sm"
            :options="
              MIN_FREQUENCIES.map((minFreq) => ({
                label: `${minFreq} Hz`,
                value: minFreq,
              }))
            "
            class="text-right"
            @update:model-value="
              onChangeValue({ key: 'minFreq', value: currentVisualizerOptions.minFreq })
            "
          >
          </Select>
        </ConfigItem>
        <ConfigItem item-name="Max Frequency" class="w-7rem">
          <Select
            v-model="currentVisualizerOptions.maxFreq"
            size="sm"
            :options="
              MAX_FREQUENCIES.map((maxFreq) => ({
                label: `${maxFreq / 1000}k Hz`,
                value: maxFreq,
              }))
            "
            class="text-right"
            @update:model-value="
              onChangeValue({ key: 'maxFreq', value: currentVisualizerOptions.maxFreq })
            "
          >
          </Select>
        </ConfigItem>
        <ConfigItem item-name="Frequency Scale">
          <div class="frequency-scale-radio-group">
            <Radio
              v-for="freqScale in FREQUENCY_SCALES"
              :key="freqScale"
              v-model="currentVisualizerOptions.frequencyScale"
              name="frequency-scales"
              size="sm"
              :value="freqScale"
              :label="freqScale"
              class="frequency-scale-radio"
              @change="
                onChangeValue({
                  key: 'frequencyScale',
                  value: currentVisualizerOptions.frequencyScale,
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
              v-model="currentVisualizerOptions.weightingFilter"
              name="weighting-filter"
              size="sm"
              :value="weightingFilter"
              :label="label"
              style="min-width: 3rem"
              @change="
                onChangeValue({
                  key: 'weightingFilter',
                  value: currentVisualizerOptions.weightingFilter,
                })
              "
            />
          </div>
        </ConfigItem>
      </ConfigRow>
      <div class="config-row w-full">
        <ConfigItem item-name="Min Decibels" class="flex-grow-1" style="max-width: 18rem">
          <div class="flex align-items-center" style="height: 1.75rem">
            <Slider
              v-model="currentVisualizerOptions.minDecibels"
              :min="-120"
              :max="-60"
              :step="5"
              :bar-width="0.75"
              @update:model-value="
                onChangeValue({ key: 'minDecibels', value: currentVisualizerOptions.minDecibels })
              "
            />
          </div>
        </ConfigItem>
        <ConfigItem item-name="Max Decibels" class="flex-grow-1" style="max-width: 18rem">
          <div class="flex align-items-center" style="height: 1.75rem">
            <Slider
              v-model="currentVisualizerOptions.maxDecibels"
              :min="-40"
              :max="0"
              :step="5"
              :bar-width="0.75"
              @update:model-value="
                onChangeValue({ key: 'maxDecibels', value: currentVisualizerOptions.maxDecibels })
              "
            />
          </div>
        </ConfigItem>
      </div>

      <ConfigRow>
        <ConfigItem item-name="Linear Amplitude">
          <Switch
            v-model="currentVisualizerOptions.linearAmplitude"
            size="sm"
            @change="
              onChangeValue({
                key: 'linearAmplitude',
                value: currentVisualizerOptions.linearAmplitude,
              })
            "
          />
        </ConfigItem>
        <ConfigItem
          v-if="currentVisualizerOptions.linearAmplitude"
          item-name="Linear Boost"
          style="flex-grow: 1; max-width: 18rem"
        >
          <div class="flex align-items-center" style="height: 1.75rem">
            <Slider
              v-model="currentVisualizerOptions.linearBoost"
              :min="1"
              :max="4"
              :step="0.1"
              :bar-width="0.75"
              @update:model-value="
                onChangeValue({ key: 'linearBoost', value: currentVisualizerOptions.linearBoost })
              "
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
              v-model="currentVisualizerOptions.channelLayout"
              name="channel-layout"
              size="sm"
              :label="label"
              :value="channelLayout"
              class="channel-layout-radio"
              @change="
                onChangeValue({
                  key: 'channelLayout',
                  value: currentVisualizerOptions.channelLayout,
                })
              "
            />
          </div>
        </ConfigItem>
      </ConfigRow>

      <div v-if="currentVisualizerOptions.channelLayout !== 'single'" class="config-row">
        <ConfigItem item-name="Mirror">
          <div class="flex flex-wrap column-gap-4 row-gap-2">
            <Radio
              v-for="[mirror, label] of MIRROR_MAP"
              :key="mirror"
              v-model="currentVisualizerOptions.mirror"
              name="mirror"
              size="sm"
              :value="mirror"
              :label="label"
              @change="onChangeValue({ key: 'mirror', value: currentVisualizerOptions.mirror })"
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
              v-model="currentVisualizerOptions.colorMode"
              name="color-mode"
              size="sm"
              :value="colorMode"
              :label="label"
              @change="
                onChangeValue({ key: 'colorMode', value: currentVisualizerOptions.colorMode })
              "
            />
          </div>
        </ConfigItem>
      </ConfigRow>

      <ConfigRow>
        <ConfigItem item-name="Gradient (Channel 1)" style="min-width: 10rem">
          <Select
            v-model="currentVisualizerOptions.gradientLeft"
            size="sm"
            :options="Array.from(BUILT_IN_GRADIENT_MAP).map(([value, label]) => ({ label, value }))"
            @update:model-value="
              onChangeValue({ key: 'gradientLeft', value: currentVisualizerOptions.gradientLeft })
            "
          >
          </Select>
        </ConfigItem>
        <ConfigItem
          v-if="currentVisualizerOptions.channelLayout !== 'single'"
          item-name="Gradient (Channel 2)"
          style="min-width: 10rem"
        >
          <Select
            v-model="currentVisualizerOptions.gradientRight"
            size="sm"
            :options="Array.from(BUILT_IN_GRADIENT_MAP).map(([value, label]) => ({ label, value }))"
            @update:model-value="
              onChangeValue({ key: 'gradientRight', value: currentVisualizerOptions.gradientRight })
            "
          >
          </Select>
        </ConfigItem>
        <ConfigItem
          v-if="currentVisualizerOptions.channelLayout !== 'single'"
          item-name="Split Gradient"
        >
          <div class="flex align-items-center" style="height: 2.5rem">
            <Switch
              v-model="currentVisualizerOptions.splitGradient"
              size="sm"
              @change="
                onChangeValue({
                  key: 'splitGradient',
                  value: currentVisualizerOptions.splitGradient,
                })
              "
            />
          </div>
        </ConfigItem>
      </ConfigRow>

      <ConfigRow>
        <ConfigItem item-name="Radial">
          <Switch
            v-model="currentVisualizerOptions.radial"
            size="sm"
            @change="onChangeValue({ key: 'radial', value: currentVisualizerOptions.radial })"
          />
        </ConfigItem>
        <ConfigItem
          v-if="currentVisualizerOptions.radial"
          item-name="Spin Speed"
          class="flex-grow-1"
          style="max-width: 18rem"
        >
          <div class="flex align-items-center" style="height: 1.75rem">
            <Slider
              v-model="currentVisualizerOptions.spinSpeed"
              :min="-20"
              :max="20"
              :bar-width="0.75"
              @update:model-value="
                onChangeValue({ key: 'spinSpeed', value: currentVisualizerOptions.spinSpeed })
              "
            />
          </div>
        </ConfigItem>
      </ConfigRow>

      <ConfigRow>
        <ConfigItem item-name="Alpha Bars" style="min-width: 5rem">
          <Switch
            v-model="currentVisualizerOptions.alphaBars"
            size="sm"
            @change="onChangeValue({ key: 'alphaBars', value: currentVisualizerOptions.alphaBars })"
          />
        </ConfigItem>
        <ConfigItem item-name="Ansi Bands" style="min-width: 5rem">
          <Switch
            v-model="currentVisualizerOptions.ansiBands"
            size="sm"
            @change="onChangeValue({ key: 'ansiBands', value: currentVisualizerOptions.ansiBands })"
          />
        </ConfigItem>
        <ConfigItem item-name="LED Bars" style="min-width: 5rem">
          <Switch
            v-model="currentVisualizerOptions.ledBars"
            size="sm"
            @change="onChangeValue({ key: 'ledBars', value: currentVisualizerOptions.ledBars })"
          />
        </ConfigItem>
        <ConfigItem item-name="True LED" style="min-width: 5rem">
          <Switch
            v-model="currentVisualizerOptions.trueLeds"
            size="sm"
            @change="onChangeValue({ key: 'trueLeds', value: currentVisualizerOptions.trueLeds })"
          />
        </ConfigItem>
        <ConfigItem item-name="Round Bars" style="min-width: 5rem">
          <Switch
            v-model="currentVisualizerOptions.roundBars"
            size="sm"
            @change="onChangeValue({ key: 'roundBars', value: currentVisualizerOptions.roundBars })"
          />
        </ConfigItem>
        <ConfigItem item-name="Lumi Bars" style="min-width: 5rem">
          <Switch
            v-model="currentVisualizerOptions.lumiBars"
            size="sm"
            @change="onChangeValue({ key: 'lumiBars', value: currentVisualizerOptions.lumiBars })"
          />
        </ConfigItem>
        <ConfigItem item-name="Outline Bars" style="min-width: 5rem">
          <Switch
            v-model="currentVisualizerOptions.outlineBars"
            size="sm"
            @change="
              onChangeValue({ key: 'outlineBars', value: currentVisualizerOptions.outlineBars })
            "
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
              v-model="currentVisualizerOptions.barSpace"
              size="sm"
              :min="1"
              select-all-on-focus
              class="text-right"
              style="max-width: 8rem"
              @update:model-value="
                onChangeValue({ key: 'barSpace', value: currentVisualizerOptions.barSpace })
              "
            />
            px
          </div>
          <div v-else class="flex align-items-center" style="height: 2.5rem">
            <Slider
              v-model="currentVisualizerOptions.barSpace"
              :min="0"
              :max="0.95"
              :step="0.05"
              :format="(val) => `${Number.parseFloat((val * 100).toFixed(10))}%`"
              :bar-width="0.75"
              @update:model-value="
                onChangeValue({ key: 'barSpace', value: currentVisualizerOptions.barSpace })
              "
            />
          </div>
        </ConfigItem>
      </ConfigRow>

      <ConfigRow>
        <!-- // TODO:  (mode 10 only) -->
        <ConfigItem item-name="Line Width" class="flex-grow-1" style="max-width: 18rem">
          <div class="flex align-items-center" style="height: 1.75rem">
            <Slider
              v-model="currentVisualizerOptions.lineWidth"
              :min="0"
              :max="5"
              :step="0.1"
              :bar-width="0.75"
              :format="(val) => `${val}px`"
              @update:model-value="
                onChangeValue({ key: 'lineWidth', value: currentVisualizerOptions.lineWidth })
              "
            />
          </div>
        </ConfigItem>
        <ConfigItem item-name="Fill Alpha" class="flex-grow-1" style="max-width: 18rem">
          <div class="flex align-items-center" style="height: 1.75rem">
            <Slider
              v-model="currentVisualizerOptions.fillAlpha"
              :min="0"
              :max="1"
              :step="0.01"
              :bar-width="0.75"
              :format="(val) => `${Number.parseFloat((val * 100).toFixed(10))}%`"
              @update:model-value="
                onChangeValue({ key: 'fillAlpha', value: currentVisualizerOptions.fillAlpha })
              "
            />
          </div>
        </ConfigItem>
      </ConfigRow>

      <ConfigRow>
        <ConfigItem item-name="Reflex Ratio" class="flex-grow-1" style="max-width: 18rem">
          <div class="flex align-items-center" style="height: 1.75rem">
            <Slider
              v-model="currentVisualizerOptions.reflexRatio"
              :min="0"
              :max="0.7"
              :step="0.01"
              :bar-width="0.75"
              @update:model-value="
                onChangeValue({ key: 'reflexRatio', value: currentVisualizerOptions.reflexRatio })
              "
            />
          </div>
        </ConfigItem>
        <ConfigItem v-if="currentVisualizerOptions.reflexRatio > 0" item-name="Relex Fit">
          <Switch
            v-model="currentVisualizerOptions.reflexFit"
            size="sm"
            @change="onChangeValue({ key: 'reflexFit', value: currentVisualizerOptions.reflexFit })"
          />
        </ConfigItem>
      </ConfigRow>

      <div v-if="currentVisualizerOptions.reflexRatio > 0" class="config-row">
        <ConfigItem item-name="Reflex Alpha" class="flex-grow-1" style="max-width: 18rem">
          <div class="flex align-items-center" style="height: 1.75rem">
            <Slider
              v-model="currentVisualizerOptions.reflexAlpha"
              :min="0"
              :max="1"
              :step="0.05"
              :bar-width="0.75"
              @update:model-value="
                onChangeValue({ key: 'reflexAlpha', value: currentVisualizerOptions.reflexAlpha })
              "
            />
          </div>
        </ConfigItem>
        <ConfigItem item-name="Reflex Bright" class="flex-grow-1" style="max-width: 18rem">
          <div class="flex align-items-center" style="height: 1.75rem">
            <Slider
              v-model="currentVisualizerOptions.reflexBright"
              :min="0"
              :max="2.5"
              :step="0.1"
              :bar-width="0.75"
              @update:model-value="
                onChangeValue({ key: 'reflexBright', value: currentVisualizerOptions.reflexBright })
              "
            />
          </div>
        </ConfigItem>
      </div>

      <ConfigRow>
        <ConfigItem item-name="Show Peaks">
          <Switch
            v-model="currentVisualizerOptions.showPeaks"
            size="sm"
            @change="onChangeValue({ key: 'showPeaks', value: currentVisualizerOptions.showPeaks })"
          />
        </ConfigItem>

        <ConfigItem v-if="currentVisualizerOptions.showPeaks" item-name="Show Peak Line">
          <Switch
            v-model="currentVisualizerOptions.peakLine"
            size="sm"
            @change="onChangeValue({ key: 'peakLine', value: currentVisualizerOptions.peakLine })"
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
            v-model="currentVisualizerOptions.showScaleY"
            size="sm"
            @change="
              onChangeValue({ key: 'showScaleY', value: currentVisualizerOptions.showScaleY })
            "
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
