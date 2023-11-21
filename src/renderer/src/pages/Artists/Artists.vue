<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAudioPlayer } from '@renderer/utils/useAudioPlayer';
import { useEntitiesStore } from '@renderer/stores/entities';

import PageHeader from '@renderer/components/PageHeader/PageHeader.vue';
import RecycleGridScroller from '@renderer/components/RecycleGridScroller/RecycleGridScroller.vue';
import ArtistGridItem from './ArtistGridItem.vue';

const { artistList, getArtistSongs } = useEntitiesStore();

const router = useRouter();
const onClickItem = (artistId: string) => router.push(`artists/${artistId}`);

const { setQueue } = useAudioPlayer();
const onClickPlayButton = async (artistId: string) => {
  const albumSongs = getArtistSongs(artistId);
  const songIds = albumSongs.map((song) => song.id);
  await setQueue(songIds);
};

const showContextMenu = (_e: MouseEvent, _artistId: string) => {
  // TODO: 未実装（コンテキストメニュー表示）
};
</script>

<template>
  <div class="artist-list-page">
    <PageHeader>
      <template #title>アーティスト ({{ artistList.length }})</template>
      <template #actions></template>
    </PageHeader>

    <RecycleGridScroller
      scroller-height="calc(100% - 96px)"
      :items="artistList"
      key-field="id"
      :item-height="192"
      :base-item-width="176"
    >
      <template #default="{ item }">
        <ArtistGridItem
          :artist="item"
          @click-item="onClickItem(item.id)"
          @click-play-button="onClickPlayButton(item.id)"
          @contextmenu="showContextMenu($event, item.id)"
        />
      </template>
    </RecycleGridScroller>
  </div>
</template>

<style lang="scss" scoped>
.artist-list-page {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
