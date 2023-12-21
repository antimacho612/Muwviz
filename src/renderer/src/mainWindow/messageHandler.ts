import { ChangeVisualizerOptionPayload, SubToMainMessage } from '@renderer/commonUtils/messagePort';
import { useVisualizersStore } from './stores/visualizers';

const handleOnChangeVisualizerOption = (payload: ChangeVisualizerOptionPayload) => {
  const { changeVisualizerProperty } = useVisualizersStore();
  changeVisualizerProperty(payload.index, { ...payload });
};

const handleOnChangeVisualizerState = (payload: { index: number; isOn: boolean }) => {
  const { toggleVisualizer } = useVisualizersStore();
  toggleVisualizer(payload.index, payload.isOn);
};

const handleOnChangeVisualizerBackgroundColor = (payload: { index: number; color: string }) => {
  const { changeBackgroundColor } = useVisualizersStore();
  changeBackgroundColor(payload.index, payload.color);
};

export const handleOnReceiveMessageFromSub = (message: SubToMainMessage) => {
  switch (message.channel) {
    case 'changeVisualizerOption':
      handleOnChangeVisualizerOption(message.payload);
      break;
    case 'changeVisualizerState':
      handleOnChangeVisualizerState(message.payload);
      break;
    case 'changeVisualizerBackgroundColor':
      handleOnChangeVisualizerBackgroundColor(message.payload);
      break;
  }
};
