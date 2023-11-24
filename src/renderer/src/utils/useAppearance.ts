import { watch } from 'vue';
import { watchDebounced } from '@vueuse/core';
import { useSettingsStore } from '@renderer/stores/settings';
import { storeToRefs } from 'pinia';
import { getNewShade, hexToRgb, rgbToHex } from './utils';

export const useAppearance = () => {
  const { fontFamily, theme, primaryColor } = storeToRefs(useSettingsStore());
  const el = document.documentElement;

  watchDebounced(
    fontFamily,
    () => {
      el.style.setProperty('--font-family', fontFamily.value ?? 'system-ui');
    },
    {
      immediate: true,
      debounce: 500,
      maxWait: 1000,
    }
  );

  watch(
    theme,
    () => {
      if (theme.value === 'Light') {
        el.classList.remove('dark');
      } else {
        el.classList.add('dark');
      }
    },
    {
      immediate: true,
    }
  );

  watchDebounced(
    primaryColor,
    () => {
      const { r, g, b } = hexToRgb(primaryColor.value);
      el.style.setProperty('--primary-color', primaryColor.value);
      el.style.setProperty('--primary-color-rgb', `${r}, ${g}, ${b}`);

      const lighter = getNewShade(primaryColor.value, 0.15);
      el.style.setProperty('--primary-color--lighter', rgbToHex(lighter));
      el.style.setProperty(
        '--primary-color--lighter-rgb',
        `${lighter.r}, ${lighter.g}, ${lighter.b}`
      );

      const lightest = getNewShade(primaryColor.value, 0.6);
      el.style.setProperty('--primary-color--lightest', rgbToHex(lightest));
      el.style.setProperty(
        '--primary-color--lightest-rgb',
        `${lightest.r}, ${lightest.g}, ${lightest.b}`
      );
    },
    {
      immediate: true,
      debounce: 500,
      maxWait: 1000,
    }
  );
};
