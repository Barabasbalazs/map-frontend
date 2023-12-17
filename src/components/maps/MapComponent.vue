<template>
  <div class="h-96 w-screen" ref="mapContainer" />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import LeafletService from "../../service/leaflet-service";
import SocketService from "../../service/socket-service";

const mapContainer = ref();
let leafletService: LeafletService;
let socketService: SocketService;

onMounted(() => {
  if (mapContainer.value) {
    leafletService = new LeafletService(mapContainer, { lat: 51.505, lng: -0.09 });
    socketService = new SocketService(leafletService);
    socketService.setUserToTrack();
  }
});
</script>