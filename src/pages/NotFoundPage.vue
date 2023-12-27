<template>
  <div class="h-screen w-screen flex flex-col items-center justify-center">
    <div class="flex justify-center items-center h-1/3">
      <h1 class="text-4xl text-center">Balázs's Map App</h1>
    </div>
    <div class="h-full flex flex-col items-center gap-2">
      <h2 class="text-5xl">404</h2>
      <div class="flex items-center justify-center gap-4">
        <img class="w-8 h-8" :src="mapMarkerOff" alt="mapMarkerOff" />
        <p>Even on a map, we couldn't find the page you were looking for :(</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import mapMarkerOff from "../assets/icons/map-marker-off-outline.svg";
</script>
