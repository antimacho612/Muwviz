import log from 'electron-log/renderer';
import deepEqual from 'fast-deep-equal';
import { POSITION, PluginOptions } from 'vue-toastification';

export const registerErrorHandler = () => {
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
};

export const getToastPluginOptions = (): PluginOptions => ({
  position: POSITION.TOP_CENTER,
  timeout: 5000,
  draggable: false,
  maxToasts: 5,
  transition: 'Vue-Toastification__fade',
  filterBeforeCreate: (toast, toasts) => {
    // 同一Type, IDのメッセージは重複して表示しない
    if (toasts.some((t) => t.type === toast.type && t.id === toast.id)) {
      return false;
    }
    return toast;
  },
});

export const getRippleEffectOptions = () => ({
  directive: 'ripple',
  color: 'var(--ripple-color)',
  duration: 0.25,
});

export const clickOutsideDirective = {
  install(app) {
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
  },
};
