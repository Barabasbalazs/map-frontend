<template>
   <!-- with a z index value of 500 I can add a layer on top-->
  <div class="h-screen w-screen relative" ref="mapContainer" />
</template>

<script setup lang="ts">
import LeafletService from "../../service/leaflet-service";
import SocketService from "../../service/socket-service";
import { onMounted, ref } from "vue";

const mapContainer = ref();

onMounted(() => {
  if (mapContainer.value) {
    const leafletService = new LeafletService(mapContainer, { lat: 51.505, lng: -0.09 });
    new SocketService(leafletService);
  }
});
</script>