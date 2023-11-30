import { useEventListener } from '@vueuse/core';

export type MainToSubMessage =
  | {
      channel: 'fontFamily';
      value: string;
    }
  | {
      channel: 'theme';
      value: 'Light' | 'Dark';
    }
  | {
      channel: 'primaryColor';
      value: string;
    };

export type SubToMainMessage = { channel: 'TODO:'; value: string };

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

    console.log('sending a message...', message);

    port.postMessage(message);
  };

  return { sendMessage };
};
