<script setup lang="ts"></script>

<template>
  <div class="music-info">
    <img src="" alt="" width="48" height="48" class="artwork" />
    <div class="info">
      <div class="title">曲のタイトル</div>
      <div class="artist-and-album">
        <a class="artist">アーティスト</a>
        <span>／</span>
        <a class="album">アルバム</a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.music-info {
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
  gap: 0.5rem;
}

.artwork {
  flex: 0 0 3.5rem;
  width: 3rem;
  height: 3rem;
  border-radius: $borderRadiusSm;
}

.info {
  flex: auto 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  white-space: nowrap;
}

.title {
  margin-bottom: 0.5rem;
  font-size: map-get($fontSizes, xl);
  line-height: 1.2;
  color: var(--primary-text-color);
  text-overflow: ellipsis;
  overflow: hidden;
}

.artist-and-album {
  display: flex;
  flex-wrap: nowrap;
  justify-content: start;
  font-size: map-get($fontSizes, sm);
  line-height: 1.2;
  color: var(--secondary-text-color);
}

.artist {
  flex: 0 1 auto;
  text-overflow: ellipsis;
  overflow: hidden;
}

.album {
  flex: 0 1 auto;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
