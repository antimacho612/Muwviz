import { ChangeVisualizerOptionPayload, SubToMainMessage } from '@renderer/commonUtils/messagePort';
import { useWindowStore } from './stores/window';

const handleOnChangeVisualizerOption = (payload: ChangeVisualizerOptionPayload) => {
  const { changeVisualizerProperty } = useWindowStore();
  changeVisualizerProperty(payload.index, { ...payload });
};

const handleOnChangeVisualizerState = (payload: { index: number; isOn: boolean }) => {
  const { toggleVisualizer } = useWindowStore();
  toggleVisualizer(payload.index, payload.isOn);
};

export const handleOnReceiveMessageFromSub = (message: SubToMainMessage) => {
  switch (message.channel) {
    case 'changeVisualizerOption':
      handleOnChangeVisualizerOption(message.payload);
      break;
    case 'changeVisualizerState':
      handleOnChangeVisualizerState(message.payload);
      break;
  }
};
