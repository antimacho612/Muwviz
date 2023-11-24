<script setup lang="ts">
import { useAppearance } from './utils/useAppearance';
import Titlebar from '@renderer/components/Titlebar/Titlebar.vue';

useAppearance();
</script>

<template>
  <Titlebar></Titlebar>
  <RouterView></RouterView>
</template>
