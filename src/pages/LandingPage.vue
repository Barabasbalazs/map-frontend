<template>
  <div class="flex flex-col w-screen h-screen">
    <div class="flex justify-center items-center h-1/3">
      <h1 class="text-4xl">Balázs's Map App</h1>
    </div>
    <div class="flex flex-col items-center h-full w-full gap-2">
      <a href="/tracking" class="flex items-center gap-4">
        <div class="flex items-center justify-center pr-2">
          <img class="w-8 h-8" :src="crossHairGps" alt="crossHairGps" />
        </div>
        <p>Go to Tracking Page</p>
      </a>
      <a href="/simulator" class="flex items-center gap-4">
        <div class="flex items-center justify-center px-2">
            <img class="w-8 h-8" :src="monitorAccount" alt="monitorAccount" />
        </div>
        <p>Go to Simulator Page</p></a
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import monitorAccount from "../assets/icons/monitor-account.svg";
import crossHairGps from "../assets/icons/crosshairs-gps.svg";
</script>
