// import { app } from 'electron';
// import * as path from 'path';
// import Store from './baseJsonStore';

// const defaultMusicPaths = () => {
//   try {
//     return app.getPath('music');
//   } catch (e) {
//     console.error(e);
//   }
// };

// const defaultPreferences = () => {
//   const defaultMusicPath = defaultMusicPaths();

//   return {
//     isFirstLaunch: true,
//     musicPaths: defaultMusicPath ? [defaultMusicPath] : [],
//     desktopNotifications: true,
//     theme: 'default',
//     volume: 100,
//   };
// };

// const preferencesStore = await Store.initialize(
//   path.join(app.getPath('userData'), 'stores', 'preferences.json')
// );

// function loadPreferences() {
//   return preferencesStore.data;
// }

// export default {
//   loadPreferences,
// };

// // export function resetPreferencesToDefault() {
// // preferencesStore.save({});
// // }
