import { RouteRecordRaw, createRouter, createWebHashHistory, createWebHistory } from 'vue-router';

import DefaultLayout from '@renderer/layouts/Default/Default.vue';

import Songs from '@renderer/pages/Songs.vue';
import Albums from '@renderer/pages/Albums/Albums.vue';
import AlbumList from '@renderer/pages/Albums/AlbumList.vue';
import Album from '@renderer/pages/Albums/Album.vue';
import Artists from '@renderer/pages/Artists.vue';
import PLayLists from '@renderer/pages/Playlists.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '',
    redirect: '/songs',
    component: DefaultLayout,
    children: [
      {
        path: 'songs',
        name: 'songs',
        component: Songs,
      },
      {
        path: 'albums',
        name: 'albums',
        component: Albums,
        children: [
          {
            path: '',
            component: AlbumList,
          },
          {
            path: ':id',
            component: Album,
          },
        ],
      },
      {
        path: 'artists',
        name: 'artists',
        component: Artists,
      },
      {
        path: 'playlists',
        name: 'playlists',
        component: PLayLists,
      },
    ],
  },
];

const router = createRouter({
  history: import.meta.env.IS_ELECTRON
    ? createWebHashHistory(import.meta.env.BASE_URL)
    : createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
