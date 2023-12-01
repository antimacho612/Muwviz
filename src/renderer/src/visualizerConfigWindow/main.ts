import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

import { getRippleEffectOptions, registErrorHandler } from '@renderer/commonUtils/setup';

import 'modern-css-reset/dist/reset.min.css';
import 'primeflex/primeflex.min.css';
import '@renderer/assets/styles/style.scss';

import VWave from 'v-wave';

import { useWindowStore } from './stores/window';

import {
  ChangeAppearancePayload,
  MainToSubMessage,
  connectMessagePort,
} from '@renderer/commonUtils/messagePort';
import { sendMessageToMainWindowKey } from './injectionKeys';

registErrorHandler();

const app = createApp(App);
app.config.errorHandler = (err) => console.log(err);

// Store
app.use(createPinia());
await fetchDatas();

// Ripple Effect Directive
app.use(VWave, getRippleEffectOptions());

// Message Port
const messagePort = connectMessagePort<'Sub'>(handleOnRecieveMessageFromMain);
app.provide(sendMessageToMainWindowKey, messagePort.sendMessage);

app.mount('#app');

async function handleOnRecieveMessageFromMain(message: MainToSubMessage) {
  switch (message.channel) {
    case 'changeAppearance':
      handleOnChangeAppearance(message.payload);
      break;
    case 'closeWindow':
      handleOnCloseMainWindow();
      break;
  }
}

function handleOnChangeAppearance(payload: ChangeAppearancePayload) {
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
}

async function handleOnCloseMainWindow() {
  await window.electronAPI.invoke.closeWindow(false);
}

async function fetchDatas() {
  await useWindowStore().fetch();
}
