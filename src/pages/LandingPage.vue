<template>
  <PageLayout>
    <div class="flex flex-col items-center h-full w-full gap-2 px-5 md:px-0">
      <router-link to="/tracking" id="tracking" class="flex items-center gap-4">
        <div class="flex items-center justify-center pr-2">
          <img class="w-8 h-8" :src="crossHairGps" alt="crossHairGps" />
        </div>
        <p>Go to Tracking Page</p>
      </router-link>
      <router-link
        to="/simulator"
        id="simulator"
        class="flex items-center gap-4"
      >
        <div class="flex items-center justify-center px-2">
          <img class="w-8 h-8" :src="monitorAccount" alt="monitorAccount" />
        </div>
        <p>Go to Simulator Page</p></router-link
      >
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import PageLayout from "../components/shared/PageLayout.vue";
import monitorAccount from "../assets/icons/monitor-account.svg";
import crossHairGps from "../assets/icons/crosshairs-gps.svg";
</script>
