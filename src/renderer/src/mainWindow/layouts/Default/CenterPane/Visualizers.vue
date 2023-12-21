<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, ref } from 'vue';
import { ConstructorOptions } from 'audiomotion-analyzer';
import { storeToRefs } from 'pinia';
import { useAudioPlayer } from '@mainWindow/composables/useAudioPlayer';
import visualizer from '@mainWindow/core/visualizer';
import { useWindowStore } from '@mainWindow/stores/window';
import { sendMessageToSubWindowKey } from '@mainWindow/injectionKeys';

import PowerIcon from '@renderer/assets/icons/power.svg?component';
import Settings2Icon from '@renderer/assets/icons/settings2.svg?component';

const { htmlAudioElement } = useAudioPlayer();
const { visualizers, toggleVisualizer } = useWindowStore();
const { visualizersIsOn } = storeToRefs(useWindowStore());
const containerEls = ref<HTMLDivElement[]>();

onMounted(async () => {
  const configs = await window.electron.invoke.getAllVisualizerConfig();

  let source: HTMLMediaElement | AudioNode = htmlAudioElement;
  containerEls.value?.forEach((containerEl, index) => {
    const { isOn, ...options } = configs[index];
    visualizersIsOn.value[index] = isOn;

    const isFirst = index === 0;
    const constructorOpts: ConstructorOptions = {
      source,
      start: isOn,
      overlay: true,
      bgAlpha: 0,
      showBgColor: false,
      connectSpeakers: isFirst,
      ...options,
    };
    const v = visualizer(containerEl, constructorOpts);
    visualizers.set(index, v);

    if (isFirst) source = v.getConnectedSource();
  });
});

onBeforeUnmount(() => {
  visualizers.forEach((visualizer) => visualizer.destroy());
});

const onClickToggleButton = async (index: number) => {
  const newState = !visualizersIsOn.value[index];

  // ビジュアライザーOn / Off切り替え
  toggleVisualizer(index, newState);

  // 設定ファイルに保存
  await window.electron.invoke.updateVisualizerConfig(index, { isOn: newState }, true);

  // サブウィンドウに変更を通知
  sendMessageToSubWindow &&
    sendMessageToSubWindow({
      channel: 'changeVisualizerState',
      payload: { index, isOn: newState },
    });
};

const sendMessageToSubWindow = inject(sendMessageToSubWindowKey);
const onClickOpenConfigWindowButton = async (index: number) => {
  await window.electron.invoke.openVisualizerConfigWindow();
  sendMessageToSubWindow &&
    sendMessageToSubWindow({ channel: 'changeVisualizerSelection', payload: { index } });
};
</script>

<template>
  <div class="visualizers">
    <template v-for="n in 3" :key="n">
      <div
        ref="containerEls"
        class="visualizer"
        :class="{ 'is-on': visualizersIsOn[n - 1] }"
        :style="{ gridArea: `visualizer${n}` }"
      >
        <button type="button" class="icon-button toggle-button" @click="onClickToggleButton(n - 1)">
          <PowerIcon style="width: 1.5rem; height: 1.5rem" />
        </button>

        <button
          type="button"
          class="icon-button open-config-window-button"
          @click="onClickOpenConfigWindowButton(n - 1)"
        >
          <Settings2Icon style="width: 1.5rem; height: 1.5rem" />
        </button>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.visualizers {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template:
    'visualizer1 visualizer2' 1fr
    'visualizer1 visualizer3' 1fr
    / 2fr 1fr;
  gap: 0.5rem;
}

.visualizer {
  position: relative;
  width: 100%;
  height: 100%;
  background: rgb(0, 0, 0);
  overflow: hidden;
  border-radius: $borderRadiusLg;
}

.icon-button {
  padding: 0.5rem;
  margin: 0;
  background: transparent;
  color: var(--secondary-text-color);
  border: none;
  cursor: pointer;
  opacity: 0;
  visibility: hidden;
  transition:
    color $transitionDuration,
    opacity $transitionDuration;

  &:hover {
    color: var(--primary-text-color);
  }
}

.toggle-button {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
}

.visualizer {
  &.is-on {
    .toggle-button {
      color: var(--primary-color);
    }

    &:hover {
      .toggle-button {
        color: var(--primary-color);
        visibility: visible;
        opacity: 1;
      }
    }
  }

  &:not(.is-on) .toggle-button {
    color: var(--secondary-text-color);
    visibility: visible;
    opacity: 1;

    &:hover {
      color: var(--primary-color);
    }
  }
}

.open-config-window-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}

.visualizer:hover .open-config-window-button {
  visibility: visible;
  opacity: 1;
}
</style>
