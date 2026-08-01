<template>
  <DefaultTheme.Layout>
    <template #aside-outline-after>
      <ShareButton />
    </template>
  </DefaultTheme.Layout>
</template>

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import ShareButton from './ShareButton.vue'
</script>
