import vue from '@vitejs/plugin-vue';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import { resolve } from 'path';
import svgLoader from 'vite-svg-loader';

/**
 * @type {import('electron-vite').UserConfig}
 */
export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@main': resolve('src/main'),
        '@renderer': resolve('src/renderer/src'),
        '@shared': resolve('src/shared'),
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@main': resolve('src/main'),
        '@preload': resolve('src/preload'),
        '@shared': resolve('src/shared'),
      },
    },
  },
  renderer: {
    plugins: [vue(), svgLoader()],
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src/renderer/index.html'),
          visualizerConfig: resolve(__dirname, 'src/renderer/visualizer-config.html'),
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: "@use '@renderer/assets/styles/global' as *;",
        },
      },
    },
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@mainWindow': resolve('src/renderer/src/mainWindow'),
        '@visualizerConfigWindow': resolve('src/renderer/src/visualizerConfigWindow'),
        '@shared': resolve('src/shared'),
      },
    },
  },
});
