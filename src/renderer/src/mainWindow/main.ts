import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { isRejected } from '@shared/utils';

import {
  clickOutsideDirective,
  getRippleEffectOptions,
  getToastPluginOptions,
  registErrorHandler,
} from '@renderer/commonUtils/setup';

import 'modern-css-reset/dist/reset.min.css';
import 'animate.css';
import 'primeflex/primeflex.min.css';

import VWave from 'v-wave';
import Toast from 'vue-toastification';

import VueVirtualScroller from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

import ContextMenu from '@imengyu/vue3-context-menu';
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css';

import App from './App.vue';
import router from '@renderer/mainWindow/router/index';

import { audioPlayerKey, sendMessageToSubWindowKey } from './injectionKeys';
import { audioPlayer } from './core/audioPlayer';

import { connectMessagePort } from '@renderer/commonUtils/messagePort';
import { handleOnRecieveMessageFromSub } from './messageHandler';

import { useSettingsStore } from './stores/settings';
import { useEntitiesStore } from './stores/entities';

import '@renderer/assets/styles/style.scss';
import { useWindowStore } from './stores/window';

registErrorHandler();

const app = createApp(App);
app.config.errorHandler = (err) => console.error(err);

// Toast
app.use(Toast, getToastPluginOptions());

// Context Menu
app.use(ContextMenu);

// Virtual Scroller
app.use(VueVirtualScroller);

// Store
app.use(createPinia());
await fetchDatas();

// Router
app.use(router);

// Ripple Effect Directive
app.use(VWave, getRippleEffectOptions());

// Click Outside Directive
app.use(clickOutsideDirective);

// Audio Player
app.provide(audioPlayerKey, audioPlayer());

// Message Port
const messagePort = connectMessagePort<'Main'>(handleOnRecieveMessageFromSub);
app.provide(sendMessageToSubWindowKey, messagePort.sendMessage);

app.mount('#app');

async function fetchDatas() {
  const { fetch: fetchWindowState } = useWindowStore();
  const { fetch: fecthSettings } = useSettingsStore();
  const { fetch: fecthEntities } = useEntitiesStore();

  const results = await Promise.allSettled([fetchWindowState(), fecthSettings(), fecthEntities()]);
  results.filter(isRejected).forEach((result) => console.error(result.reason.toString()));
}
