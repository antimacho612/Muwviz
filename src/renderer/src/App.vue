<script setup lang="ts">
import { useAppearance } from './utils/useAppearance';
import { useIpcEventHandler } from './utils/useIpcEventHandler';
import Titlebar from '@renderer/components/Titlebar/Titlebar.vue';

useAppearance();
useIpcEventHandler();
</script>

<template>
  <Titlebar></Titlebar>
  <RouterView></RouterView>
</template>
