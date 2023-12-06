import { useWindowStore } from './stores/window';
import { ChangeAppearancePayload, MainToSubMessage } from '@renderer/commonUtils/messagePort';

const handleOnChangeVisualizerSelection = (payload: { index: number }) =>
  (useWindowStore().currentVisualizerIndex = payload.index);

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

const handleOnCloseMainWindow = async () => await window.electron.invoke.closeWindow(false);

export const handleOnReceiveMessageFromMain = (message: MainToSubMessage) => {
  switch (message.channel) {
    case 'changeAppearance':
      handleOnChangeAppearance(message.payload);
      break;
    case 'changeVisualizerSelection':
      handleOnChangeVisualizerSelection(message.payload);
      break;
    case 'closeWindow':
      handleOnCloseMainWindow();
      break;
  }
};
