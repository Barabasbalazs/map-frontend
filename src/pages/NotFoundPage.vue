<template>
  <PageLayout>
    <div class="h-full flex flex-col items-center gap-2">
      <h2 class="text-5xl">404</h2>
      <div class="flex items-center justify-center gap-4">
        <img class="w-8 h-8" :src="mapMarkerOff" alt="mapMarkerOff" />
        <p>Even on a map, we couldn't find the page you were looking for :(</p>
      </div>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import PageLayout from "../components/shared/PageLayout.vue";
import mapMarkerOff from "../assets/icons/map-marker-off-outline.svg";
</script>
