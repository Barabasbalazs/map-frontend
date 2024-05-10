<template>
  <LoadingAnimation v-if="isLoading" />
  <TrackingMapComponent v-else />
</template>

<script setup lang="ts">
import TrackingMapComponent from "../components/maps/TrackingMapComponent.vue";
import LoadingAnimation from "../components/shared/LoadingAnimation.vue";
import { usePermissionRerouting } from "../composables/permission-rerouting";

const { isLoading } = usePermissionRerouting();
</script>
