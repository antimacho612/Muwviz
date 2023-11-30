import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

import { getRippleEffectOptions, registErrorHandler } from '@renderer/commonUtils/setup';

import 'modern-css-reset/dist/reset.min.css';
import 'primeflex/primeflex.min.css';
import '@renderer/assets/styles/style.scss';

import VWave from 'v-wave';

import { useWindowStore } from './stores/window';

import { MainToSubMessage, connectMessagePort } from '@renderer/commonUtils/messagePort';
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

function handleOnRecieveMessageFromMain(message: MainToSubMessage) {
  const windowStore = useWindowStore();

  switch (message.channel) {
    case 'fontFamily':
      windowStore.fontFamily = message.value;
      break;
    case 'theme':
      windowStore.theme = message.value;
      break;
    case 'primaryColor':
      windowStore.primaryColor = message.value;
      break;
  }
}

async function fetchDatas() {
  await useWindowStore().fetch();
}
