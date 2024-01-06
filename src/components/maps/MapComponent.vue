<template>
  <div class="h-screen w-screen relative" ref="mapContainer" >
    <!-- with a z index value of 500 I can add a layer on top-->
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import LeafletService from "../../service/leaflet-service";
import SocketService from "../../service/socket-service";

const mapContainer = ref();

onMounted(() => {
  if (mapContainer.value) {
    const leafletService = new LeafletService(mapContainer, { lat: 51.505, lng: -0.09 });
    new SocketService(leafletService);
  }
});
</script>