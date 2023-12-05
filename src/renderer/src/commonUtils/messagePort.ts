import { useEventListener } from '@vueuse/core';
import { VisualizerConfig } from '@shared/visualizerTypes';
import { AppearanceSettings, KeyValue } from '@shared/types';

export type ChangeAppearancePayload = KeyValue<AppearanceSettings>;
export type MainToSubMessage =
  | {
      channel: 'changeAppearance';
      payload: ChangeAppearancePayload;
    }
  | {
      channel: 'changeVisualizerSelection';
      payload: { index: number };
    }
  | {
      channel: 'closeWindow';
    };

export type ChangeVisualizerConfigPayload = { index: number } & KeyValue<VisualizerConfig>;
export type SubToMainMessage = {
  channel: 'changeVisualizerConfig';
  payload: ChangeVisualizerConfigPayload;
};

export const connectMessagePort = <T extends 'Main' | 'Sub'>(
  listener: (message: T extends 'Main' ? SubToMainMessage : MainToSubMessage) => void
) => {
  let port: MessagePort & { onclose: () => void };
  let anotherPortClosed = true;

  useEventListener(window, 'message', (e: MessageEvent) => {
    if (e.source === window && e.data === 'messagePort') {
      port = e.ports[0] as MessagePort & { onclose: () => void };
      anotherPortClosed = false;
    }

    port.onmessage = (e: MessageEvent) => {
      listener(e.data as T extends 'Main' ? SubToMainMessage : MainToSubMessage);
    };

    port.onclose = () => {
      anotherPortClosed = true;
    };
  });

  const sendMessage = (message: T extends 'Main' ? MainToSubMessage : SubToMainMessage) => {
    if (!port || anotherPortClosed) return;
    port.postMessage(message);
  };

  return { sendMessage };
};
