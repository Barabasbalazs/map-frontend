<template>
  <div class="border-2 border-black rounded-xl p-2 mx-4 max-w-xl min-h-96">
    <div class="grid grid-cols-2 gap-2">
      <BaseInput
        v-model="localTrail.name"
        id="name"
        label="Name"
        class="w-full"
        :disabled="disabled"
      />
      <BaseInput
        v-model="localTrail.location"
        id="location"
        label="Location"
        class="w-full"
        :disabled="disabled"
      />
    </div>
    <div class="h-80 w-full" ref="mapContainer" />
    {{ trail }}
  </div>
</template>

<script setup lang="ts">
import BaseInput from "../shared/BaseInput.vue";
import { Trail } from "../../models/trail-model";
import { User } from "../../models/user-model";
import LeafletService from "../../services/leaflet-service";
import { ref, computed, onMounted } from "vue";

const props = defineProps<{
  trail: Trail;
  user: Partial<User>;
}>();

const disabled = computed(() => props.user?.role !== "guide");

const localTrail = ref(props.trail);

const mapContainer = ref();

function maxAbsoluteCoordinate(coordinates: number[]): number {
  return Math.max(...coordinates.map((coordinate) => Math.abs(coordinate)));
}

const meanCoordinates = computed(() => {
  const coordinates = props.trail.path.flatMap((point) => point.coordinates);
  const latitudes = [];
  const longitudes = [];
  for (const coordinate of coordinates) {
    latitudes.push(coordinate.lat);
    longitudes.push(coordinate.lng);
  }

  return {
    lat: maxAbsoluteCoordinate(latitudes),
    lng: maxAbsoluteCoordinate(longitudes),
  };
});

onMounted(async () => {
  if (mapContainer.value) {
    new LeafletService(mapContainer, {
      lat: props.trail.path.length ? meanCoordinates.value.lat : 51.505,
      lng: props.trail.path.length ? meanCoordinates.value.lng : -0.09,
    });
  }
});
</script>
