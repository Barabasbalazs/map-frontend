<template>
  <div class="h-screen w-screen relative" ref="mapContainer" />
  <BaseModal
    v-model:is-open="isErrorModalOpen"
    title="Error"
    warning
    cancel
    :buttonTexts="['Return']"
    @confirm="router.go(-1)"
    @cancel="setUpConnection"
  >
    <div class="flex flex-col text-center">
      <p>There was an error while trying to establish connection.</p>
      <p>You can try waiting 3 seconds or just return to the previous page.</p>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from "../shared/BaseModal.vue";
import LeafletService from "../../services/leaflet-service";
import SocketService from "../../services/socket-service";
import router from "../../routing/router";
import { onMounted, ref, onBeforeUnmount } from "vue";

const mapContainer = ref();
let socketService: SocketService;

const isErrorModalOpen = ref(false);

onMounted(async () => {
  if (mapContainer.value) {
    const leafletService = new LeafletService(mapContainer, {
      lat: 51.505,
      lng: -0.09,
    });
    socketService = new SocketService(leafletService);
    socketService.setUpSocket();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    isErrorModalOpen.value = socketService.getConnectionError();
  }
});

async function setUpConnection() {
  isErrorModalOpen.value = false;
  await new Promise((resolve) => setTimeout(resolve, 3000));
  socketService.setUpSocket();
  isErrorModalOpen.value = socketService.getConnectionError();
}

onBeforeUnmount(() => {
  socketService.destroy();
});
</script>
