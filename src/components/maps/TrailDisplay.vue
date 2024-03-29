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
      v-if="props.user?.role === 'user'"
      class="flex items-center justify-center gap-2 pt-5 pb-2"
    >
      <BaseButton
        id="subscribe"
        :secondary="isSubscribed"
        @click="handleSubscribe"
        :disabled="isLoading"
        >{{ isSubscribed ? "Unsubscribe" : "Subscribe" }}</BaseButton
      >
    </div>
    <div
      v-else-if="editable"
      class="flex items-center justify-center gap-2 pt-5 pb-2"
    >
      <BaseButton id="save" :disabled="isLoading">Save</BaseButton>
      <BaseButton id="cancel" :disabled="isLoading" secondary
        >Cancel</BaseButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseInput from "../shared/BaseInput.vue";
import BaseButton from "../shared/BaseButton.vue";
import { Trail } from "../../models/trail-model";
import { User } from "../../models/user-model";
import LeafletService from "../../services/leaflet-service";
import { useTrailsStore } from "../../stores/trails-store";
import { ref, computed, watch, onMounted } from "vue";

const props = defineProps<{
  trail: Trail;
  user: Partial<User>;
  editable?: boolean;
}>();

let leafletService = null;

const trailsStore = useTrailsStore();

//known issue here, the init map is called twice on mounting
const isLoading = ref(false);
const initialMount = ref(true);
const mapContainer = ref();

const localTrail = computed({
  get: () => props.trail,
  set: (value: Trail) => value,
});
const isSubscribed = computed(() =>
  props.user?.trails?.includes(props.trail._id)
);

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

function initMap(trail: Trail) {
  if (mapContainer.value) {
    if (leafletService) {
      leafletService.destroyMap();
      leafletService.initializeMap(
        mapContainer,
        {
          lat: trail.path.length ? meanCoordinates.value.lat : 51.505,
          lng: trail.path.length ? meanCoordinates.value.lng : -0.09,
        },
        props.editable,
        trail.path
      );
    } else {
      leafletService = new LeafletService(
        mapContainer,
        {
          lat: trail.path.length ? meanCoordinates.value.lat : 51.505,
          lng: trail.path.length ? meanCoordinates.value.lng : -0.09,
        },
        props.editable,
        trail.path
      );
    }
  }
}

async function handleSubscribe() {
  isLoading.value = true;
  const reponse = isSubscribed.value
    ? await trailsStore.unsubscribeFromTrail(props.trail._id)
    : await trailsStore.subscribeToTrail(props.trail._id);
  if (reponse) {
    localTrail.value = reponse;
  }
  isLoading.value = false;
}

onMounted(() => {
  initMap(props.trail);
  initialMount.value = false;
});

watch(
  () => props.trail,
  () => {
    if (initialMount.value) return;
    initMap(localTrail.value);
  },
  { deep: true }
);
</script>
