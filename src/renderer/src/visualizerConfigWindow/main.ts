import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

import {
  getToastPluginOptions,
  getRippleEffectOptions,
  registerErrorHandler,
} from '@renderer/commonUtils/setup';

import 'modern-css-reset/dist/reset.min.css';
import 'primeflex/primeflex.min.css';
import '@renderer/assets/styles/style.scss';

import VWave from 'v-wave';

import Toast from 'vue-toastification';
import '@renderer/assets/styles/toastification.scss';

import { useWindowStore } from './stores/window';

import { sendMessageToMainWindowKey } from './injectionKeys';
import { isRejected } from '@shared/utils';
import { useVisualizersConfigStore } from './stores/visualizersConfig';

import { connectMessagePort } from '@renderer/commonUtils/messagePort';
import { handleOnReceiveMessageFromMain } from './messageHandler';

registerErrorHandler();

const app = createApp(App);
app.config.errorHandler = (err) => console.error(err);

// Toast
app.use(Toast, getToastPluginOptions());

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
  const { fetch: fetchVisualizersConfig } = useVisualizersConfigStore();

  const results = await Promise.allSettled([fetchWindowState(), fetchVisualizersConfig()]);
  results.filter(isRejected).forEach((result) => console.error(result.reason.toString()));
}
