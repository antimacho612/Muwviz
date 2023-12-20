import { RouteRecordRaw, createRouter, createWebHashHistory, createWebHistory } from 'vue-router';

import DefaultLayout from '@mainWindow/layouts/Default/Default.vue';

import Songs from '@mainWindow/pages/Songs/Songs.vue';
import Album from '@mainWindow/pages/Album/Album.vue';
import Albums from '@mainWindow/pages/Albums/Albums.vue';
import Artist from '@mainWindow/pages/Artist/Artist.vue';
import Artists from '@mainWindow/pages/Artists/Artists.vue';

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
        children: [
          {
            path: '',
            name: 'albums',
            component: Albums,
          },
          {
            path: ':albumId',
            name: 'album',
            component: Album,
            props: true,
          },
        ],
      },
      {
        path: 'artists',
        children: [
          {
            path: '',
            name: 'artists',
            component: Artists,
          },
          {
            path: ':artistId',
            name: 'artist',
            component: Artist,
            props: true,
          },
        ],
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
