<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useEntitiesStore } from '@renderer/stores/entities';
import { Order, Song, SongsSortKey } from '@shared/types';
import { sortArrayOfObjects } from '@shared/utils';

import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/20/solid';
import Button from '@renderer/components/base/Button/Button.vue';
import InputText from '@renderer/components/base/InputText/InputText.vue';
import SortWidget from '@renderer/components/SortWidget/SortWidget.vue';
import SongList from '@renderer/components/SongList/SongList.vue';

const entitiesStore = useEntitiesStore();
const { songs } = storeToRefs(entitiesStore);

const searchText = ref('');
const sortKey = ref<SongsSortKey>('Artist');
const order = ref<Order>('ASC');

const sortedSongs = ref<Song[]>([...songs.value]);

const filteredSongs = computed(() => {
  // フィルタリング
  if (searchText.value !== '') {
    const searchString = searchText.value.toLocaleLowerCase();
    return sortedSongs.value.filter(
      (song) =>
        song.title.toLocaleLowerCase().includes(searchString) ||
        song.album.toLocaleLowerCase().includes(searchString) ||
        song.artist.toLocaleLowerCase().includes(searchString)
    );
  } else {
    return sortedSongs.value;
  }
});

watch([sortKey, order], () => {
  // ソート
  if (sortKey.value === 'Artist' && order.value === 'ASC') {
    sortedSongs.value = [...songs.value];
  } else {
    sortedSongs.value = sortArrayOfObjects(
      [...songs.value],
      [
        {
          key: 'title',
          order: 'DESC',
        },
      ]
    );
  }
});
</script>

<template>
  <div class="songs-page">
    <div class="mb-2" style="display: flex; align-items: center; justify-content: space-between">
      <h2 class="title">すべての曲 ({{ songs.length }})</h2>
      <div>
        <Button size="sm">s</Button>
      </div>
    </div>

    <div
      class="mb-2 ml-3"
      style="display: flex; align-items: center; justify-content: space-between"
    >
      <SortWidget
        v-model:sort-by="sortKey"
        v-model:order="order"
        :items="[
          { key: 'Artist', title: 'アーティスト' },
          { key: 'Album', title: 'アルバム' },
          { key: 'Title', title: 'タイトル' },
          { key: 'PlayCount', title: '再生回数' },
        ]"
      />
      <div>
        <div style="position: relative; display: inline-block">
          <MagnifyingGlassIcon
            style="
              position: absolute;
              top: 50%;
              left: 0.5rem;
              transform: translateY(-50%);
              color: var(--primary-color);
              width: 1.5rem;
              height: 1.5rem;
            "
          />
          <InputText
            v-model="searchText"
            type="text"
            size="sm"
            select-all-on-focus
            placeholder="検索..."
            style="padding-left: 2.25rem; padding-right: 2.25rem"
          />
          <XMarkIcon
            v-if="searchText !== ''"
            style="
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              right: 0.5rem;
              color: var(--secondary-text-color);
              width: 1.5rem;
              height: 1.5rem;
              cursor: pointer;
            "
            @click="searchText = ''"
          />
        </div>
      </div>
    </div>

    <SongList :songs="filteredSongs" />
  </div>
</template>

<style lang="scss" scoped>
.songs-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.title {
  font-weight: bold;
}

.headers {
  display: flex;
  align-items: center;
}
</style>
