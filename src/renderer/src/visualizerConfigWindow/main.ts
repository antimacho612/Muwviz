import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

import { getRippleEffectOptions, registerErrorHandler } from '@renderer/commonUtils/setup';

import 'modern-css-reset/dist/reset.min.css';
import 'primeflex/primeflex.min.css';
import '@renderer/assets/styles/style.scss';

import VWave from 'v-wave';

import { useWindowStore } from './stores/window';

import { sendMessageToMainWindowKey } from './injectionKeys';
import { isRejected } from '@shared/utils';
import { useVisualizerConfigStore } from './stores/visualizerConfig';

import { connectMessagePort } from '@renderer/commonUtils/messagePort';
import { handleOnReceiveMessageFromMain } from './messageHandler';

registerErrorHandler();

const app = createApp(App);
app.config.errorHandler = (err) => console.log(err);

// Store
app.use(createPinia());
await fetchDatas();

// Ripple Effect Directive
app.use(VWave, getRippleEffectOptions());

// Message Port
const messagePort = connectMessagePort<'Sub'>(handleOnReceiveMessageFromMain);
app.provide(sendMessageToMainWindowKey, messagePort.sendMessage);

app.mount('#app');

async function fetchDatas() {
  const { fetch: fetchWindowState } = useWindowStore();
  const { fetch: fetchVisualizerConfig } = useVisualizerConfigStore();

  const results = await Promise.allSettled([fetchWindowState(), fetchVisualizerConfig()]);
  results.filter(isRejected).forEach((result) => console.error(result.reason.toString()));
}
