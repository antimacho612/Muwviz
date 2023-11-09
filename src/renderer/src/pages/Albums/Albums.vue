<script setup lang="ts"></script>

<template>
  <div>
    <h2 class="title">Albums</h2>
    <RouterLink to="/albums/14">to 14</RouterLink>
    <div>
      <RouterView></RouterView>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.title {
  font-weight: bold;
}
</style>
