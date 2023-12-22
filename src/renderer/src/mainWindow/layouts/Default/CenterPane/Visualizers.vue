<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, ref } from 'vue';
import { ConstructorOptions } from 'audiomotion-analyzer';
import { useAudioPlayer } from '@mainWindow/composables/useAudioPlayer';
import visualizer from '@mainWindow/core/visualizer';
import { useVisualizersStore } from '@renderer/mainWindow/stores/visualizers';
import { sendMessageToSubWindowKey } from '@mainWindow/injectionKeys';

import PowerIcon from '@renderer/assets/icons/power.svg?component';
import Settings2Icon from '@renderer/assets/icons/settings2.svg?component';

const visualizersStore = useVisualizersStore();
const containerEls = ref<HTMLDivElement[]>();

const { htmlAudioElement } = useAudioPlayer();

onMounted(async () => {
  const configs = await window.electron.invoke.getAllVisualizersConfig();

  let source: HTMLMediaElement | AudioNode = htmlAudioElement;
  containerEls.value?.forEach((containerEl, index) => {
    const isFirst = index === 0;

    const { isOn, backgroundColor, ...options } = configs[index];
    const constructorOpts: ConstructorOptions = {
      source,
      start: isOn,
      overlay: true,
      bgAlpha: 0,
      showBgColor: false,
      connectSpeakers: isFirst,
      ...options,
    };
    const instance = visualizer(containerEl, constructorOpts);

    // ストアにセット
    visualizersStore.visualizers[index] = {
      instance,
      isOn,
      backgroundColor,
    };

    if (isFirst) source = instance.getConnectedSource();
  });
});

onBeforeUnmount(() => {
  visualizersStore.visualizers.forEach((visualizer) => visualizer.instance?.destroy());
});

const onClickToggleButton = async (index: number) => {
  const target = visualizersStore.visualizers[index];
  const newState = !target.isOn;

  // ビジュアライザーOn / Off切り替え
  visualizersStore.toggleVisualizer(index, newState);

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
        :class="{ 'is-on': visualizersStore.visualizers[n - 1].isOn }"
        :style="{
          gridArea: `visualizer${n}`,
          background: visualizersStore.visualizers[n - 1].backgroundColor,
        }"
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
