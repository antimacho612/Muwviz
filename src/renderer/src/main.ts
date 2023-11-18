import { createApp } from 'vue';
import { createPinia } from 'pinia';

import log from 'electron-log/renderer';

import 'modern-css-reset/dist/reset.min.css';
import 'animate.css';
import 'primeflex/primeflex.min.css';

import VWave from 'v-wave';

import Toast, { POSITION, PluginOptions } from 'vue-toastification';

import { createVfm } from 'vue-final-modal';
import 'vue-final-modal/style.css';

import VueVirtualScroller from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

import ContextMenu from '@imengyu/vue3-context-menu';
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css';

import App from './App.vue';
import router from '@renderer/router/index';

import { useEntitiesStore } from './stores/entities';
import { audioPlayerInjectionKey, audioPlayer } from './core/audioPlayer';

import '@renderer/assets/styles/style.scss';

// Consoleをオーバーライド
Object.assign(console, log.functions);

window.onerror = (err) => {
  const messages = err instanceof Error ? [err.name, err.message, err.stack] : [err];
  console.error(...messages);
};

window.onunhandledrejection = (ev) => {
  const message = ev.reason.message ?? JSON.stringify(ev.reason) ?? ev.reason;
  console.error(`UNHANDLED PROMISE REJECTION: ${message}`);
};

const app = createApp(App);

app.config.errorHandler = (err) => console.log(err);

// Toast
const toastPluginOptions: PluginOptions = {
  position: POSITION.TOP_CENTER,
  timeout: 5000,
  draggable: false,
  maxToasts: 5,
  transition: 'Vue-Toastification__fade',
};
app.use(Toast, toastPluginOptions);

// Modal
const vfm = createVfm();
app.use(vfm);

// Context Menu
app.use(ContextMenu);

// Virtual Scroller
app.use(VueVirtualScroller);

// Store
const pinia = createPinia();
app.use(pinia);

// Entities
const { fetch } = useEntitiesStore();
await fetch();

// Router
app.use(router);

// Ripple Effect Directive
app.use(VWave, { directive: 'ripple', color: 'var(--ripple-color)', duration: 0.25 });

// Click Outside Directive
app.directive('click-outside', {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el == event.target || el.contains(event.target))) {
        binding.value(event, el);
      }
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent);
  },
});

// Audio Player
app.provide(audioPlayerInjectionKey, audioPlayer());

app.mount('#app');
