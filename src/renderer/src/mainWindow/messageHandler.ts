import { ChangeVisualizerConfigPayload, SubToMainMessage } from '@renderer/commonUtils/messagePort';
import { useWindowStore } from './stores/window';

const handleOnChangeVisualizerConfig = (payload: ChangeVisualizerConfigPayload) => {
  const { visualizers } = useWindowStore();
  const visualizer = visualizers.get(payload.index);
  if (visualizer) {
    visualizer.changeProperty({ ...payload });
  }
};

export const handleOnRecieveMessageFromSub = (message: SubToMainMessage) => {
  switch (message.channel) {
    case 'changeVisualizerConfig':
      handleOnChangeVisualizerConfig(message.payload);
      break;
  }
};
