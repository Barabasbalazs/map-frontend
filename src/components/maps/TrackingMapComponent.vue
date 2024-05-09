<template>
  <!--THIS IS WHERE THE MAP IS-->
  <div class="h-screen w-screen relative" ref="mapContainer" />
  <!--MAP-->
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
import { useTrailsStore } from "../../stores/trails-store";
import LeafletService from "../../services/leaflet-service";
import SocketService from "../../services/socket-service";
import router from "../../routing/router";
import { onMounted, ref, onBeforeUnmount, computed } from "vue";

let socketService: SocketService;

const trailsStore = useTrailsStore();

const mapContainer = ref();
const isErrorModalOpen = ref(false);

const trail = computed(() => trailsStore.trail);

onMounted(async () => {
  if (mapContainer.value) {
    const leafletService = new LeafletService(mapContainer, {
      lat: trail.value?.path?.[0]?.coordinates?.lat || 51.505,
      lng: trail.value?.path?.[0]?.coordinates?.lng || -0.09,
    }, false, trail.value?.path);
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
