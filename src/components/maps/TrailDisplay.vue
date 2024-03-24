<template>
  <div class="border-2 border-black rounded-xl p-2 mx-4 max-w-xl min-h-96">
    <div class="grid grid-cols-2 gap-2">
      <BaseInput
        v-model="localTrail.name"
        id="name"
        label="Name"
        class="w-full"
        :disabled="!editable"
      />
      <BaseInput
        v-model="localTrail.location"
        id="location"
        label="Location"
        class="w-full"
        :disabled="!editable"
      />
    </div>
    <div class="h-80 w-full" ref="mapContainer" />

    <div
      v-if="editable"
      class="flex items-center justify-center gap-2 pt-5 pb-2"
    >
      <BaseButton id="save">Save</BaseButton>
      <BaseButton id="cancel" secondary>Cancel</BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseInput from "../shared/BaseInput.vue";
import BaseButton from "../shared/BaseButton.vue";
import { Trail } from "../../models/trail-model";
import { User } from "../../models/user-model";
import LeafletService from "../../services/leaflet-service";
import { ref, computed, onMounted } from "vue";

const props = defineProps<{
  trail: Trail;
  user: Partial<User>;
  editable?: boolean;
}>();

const localTrail = computed({
  get: () => props.trail,
  set: (value: Trail) => {
    Object.assign(props.trail, value);
  },
});

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

function initMap() {
  if (mapContainer.value) {
    new LeafletService(
      mapContainer,
      {
        lat: props.trail.path.length ? meanCoordinates.value.lat : 51.505,
        lng: props.trail.path.length ? meanCoordinates.value.lng : -0.09,
      },
      props.editable,
      props.trail.path
    );
  }
}

onMounted(() => initMap());
</script>
