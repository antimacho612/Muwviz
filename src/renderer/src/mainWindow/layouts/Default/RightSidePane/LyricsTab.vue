<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useAudioPlayer } from '@mainWindow/composables/useAudioPlayer';
import { useLyricsStore, LyricsData } from '@mainWindow/stores/lyrics';

// import Button from '@renderer/commonComponents/Button/Button.vue';
import Select from '@renderer/commonComponents/Select/Select.vue';

const { currentSong } = useAudioPlayer();
const lyricsStore = useLyricsStore();

const FONT_SIZES = [
  { value: '0.875rem', label: '小' },
  { value: '1rem', label: '中' },
  { value: '1.125rem', label: '大' },
] as const;

const lyricsData = ref<LyricsData | undefined>();
const fontSize = ref(FONT_SIZES[0].value);

onMounted(async () => {
  await lyricsStore.rebuild();
  // await lyrics.fetchApi('', 'title', 'artist');
});

watch(
  currentSong,
  () => {
    if (currentSong.value) {
      const cached = lyricsStore.lyricsMap[currentSong.value?.id];
      lyricsData.value = cached ?? lyricsStore.fetchLocalDb(currentSong.value.id);
    } else {
      lyricsData.value = undefined;
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="lyrics-tab">
    <div class="lyrics" :style="{ fontSize: fontSize }">
      {{ lyricsData?.lyrics ?? '歌詞情報がありません...📃' }}
    </div>
    <div class="toolbar">
      <div>
        <label>
          サイズ:
          <Select
            v-model="fontSize"
            size="xs"
            :options="FONT_SIZES.map((fontSize) => ({ ...fontSize }))"
            class="font-size-select"
          >
          </Select>
        </label>
      </div>
      <!-- <Button v-if="lyricsData?.type === 'METADATA'" size="xs">歌詞検索</Button>
      <div class="type">{{ lyricsData?.type[0] }}</div> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.lyrics-tab {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.lyrics {
  height: calc(100% - 3.5rem);
  text-align: center;
  color: var(--primary-text-color);
  overflow-y: auto;
  white-space: pre-line;
}
.toolbar {
  margin-top: 0.5rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.font-size-select {
  margin-left: 0.25rem;
}

.type {
  font-size: map-get($fontSizes, 'sm');
}
</style>
