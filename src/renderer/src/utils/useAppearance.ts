import { watch } from 'vue';
import { useSettingsStore } from '@renderer/stores/settings';
import { storeToRefs } from 'pinia';
import { getNewShade, hexToRgb, rgbToHex } from './utils';

export const useAppearance = () => {
  const { fontFamily, theme, primaryColor } = storeToRefs(useSettingsStore());
  const el = document.documentElement;

  watch(
    fontFamily,
    () => {
      el.style.setProperty(
        '--font-family',
        fontFamily.value ??
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif'
      );
    },
    { immediate: true }
  );

  watch(
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
};
