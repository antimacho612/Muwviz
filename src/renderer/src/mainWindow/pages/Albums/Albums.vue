<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAudioPlayer } from '@mainWindow/composables/useAudioPlayer';
import { useEntitiesStore } from '@mainWindow/stores/entities';

import PageHeader from '@mainWindow/components/PageHeader/PageHeader.vue';
import RecycleGridScroller from '@mainWindow/components/RecycleGridScroller/RecycleGridScroller.vue';
import AlbumGridItem from './AlbumGridItem.vue';

const { albumList, getAlbumSongs } = useEntitiesStore();

const router = useRouter();
const onClickItem = (albumId: string) => router.push(`albums/${albumId}`);

const { setQueue } = useAudioPlayer();
const onClickPlayButton = async (albumId: string) => {
  const albumSongs = getAlbumSongs(albumId);
  const songIds = albumSongs.map((song) => song.id);
  await setQueue(songIds);
};

const showContextMenu = (_e: MouseEvent, _albumId: string) => {
  // TODO: 未実装（コンテキストメニュー表示）
};
</script>

<template>
  <div class="albums-page">
    <PageHeader>
      <template #title>アルバム ({{ albumList.length }})</template>
      <template #default></template>
    </PageHeader>

    <RecycleGridScroller
      scroller-height="calc(100% - 96px)"
      :items="albumList"
      key-field="id"
      :item-height="208"
      :base-item-width="176"
    >
      <template #default="{ item }">
        <AlbumGridItem
          :album="item"
          @click-item="onClickItem(item.id)"
          @click-play-button="onClickPlayButton(item.id)"
          @contextmenu="showContextMenu($event, item.id)"
        />
      </template>
    </RecycleGridScroller>
  </div>
</template>

<style lang="scss" scoped>
.albums-page {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
