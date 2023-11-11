<script setup lang="ts">
import Timeline from './Timeline.vue';
import SongInfo from './SongInfo.vue';
import PlayerControls from './PlayerControls.vue';
import VolumeControl from './VolumeControl.vue';
</script>

<template>
  <div class="controls-pane">
    <div class="timeline-container">
      <Timeline />
    </div>
    <div class="controls-pane-bottom">
      <div class="song-info-container">
        <SongInfo />
      </div>
      <div class="player-controls-container">
        <PlayerControls />
      </div>
      <div class="volume-control-container">
        <VolumeControl />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.controls-pane {
  height: 100%;
  padding: 1rem 1.5rem;
  border-radius: $borderRadiusXl;
  box-shadow: $shadow;
}

.timeline-container {
  margin-bottom: 0.75rem;
}

.controls-pane-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.song-info-container,
.player-controls-container,
.volume-control-container {
  flex: 0 1 calc(100% / 3);
}

.song-info-container {
  overflow: hidden;
}
</style>
