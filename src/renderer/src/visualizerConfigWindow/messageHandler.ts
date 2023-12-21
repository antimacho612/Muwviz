import { storeToRefs } from 'pinia';
import { useWindowStore } from './stores/window';
import { useVisualizerConfigStore } from './stores/visualizerConfig';
import { ChangeAppearancePayload, MainToSubMessage } from '@renderer/commonUtils/messagePort';

const handleOnChangeAppearance = (payload: ChangeAppearancePayload) => {
  const windowStore = useWindowStore();

  switch (payload.key) {
    case 'fontFamily':
      windowStore.fontFamily = payload.value;
      break;
    case 'theme':
      windowStore.theme = payload.value;
      break;
    case 'primaryColor':
      windowStore.primaryColor = payload.value;
      break;
  }
};

const handleOnChangeVisualizerSelection = (payload: { index: number }) => {
  const { currentVisualizerIndex } = storeToRefs(useWindowStore());
  currentVisualizerIndex.value = payload.index;
};

const handleOnChangeVisualizerState = (payload: { index: number; isOn: boolean }) => {
  const { visualizerConfig } = storeToRefs(useVisualizerConfigStore());
  visualizerConfig.value[payload.index].isOn = payload.isOn;
};

const handleOnCloseMainWindow = async () => await window.electron.invoke.closeWindow(false);

export const handleOnReceiveMessageFromMain = (message: MainToSubMessage) => {
  switch (message.channel) {
    case 'changeAppearance':
      handleOnChangeAppearance(message.payload);
      break;
    case 'changeVisualizerSelection':
      handleOnChangeVisualizerSelection(message.payload);
      break;
    case 'changeVisualizerState':
      handleOnChangeVisualizerState(message.payload);
      break;
    case 'closeWindow':
      handleOnCloseMainWindow();
      break;
  }
};
