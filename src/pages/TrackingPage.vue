<template>
  <!--check permissions first-->
  <LoadingAnimation v-if="isLoading" />
  <TrackingMapComponent v-else />
</template>

<script setup lang="ts">
import TrackingMapComponent from "../components/maps/TrackingMapComponent.vue";
import LoadingAnimation from "../components/shared/LoadingAnimation.vue";
import { useTrailsStore } from "../stores/trails-store";
import { useRoute } from "vue-router";
import router from "../routing/router";
import { onMounted, ref } from "vue";

const route = useRoute();
const trailsStore = useTrailsStore();

const isLoading = ref(true);

onMounted(async () => {
  const trailResponse = await trailsStore.getTrail(route.params.id as string);
  if (!trailResponse) {
    return router.push({ name: "NotFound Page" });
  }
  isLoading.value = false;
});
</script>
