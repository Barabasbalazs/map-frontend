<template>
  <div
    class="border-2 border-black rounded-xl p-2 mx-4 max-w-md md:w-[28rem] min-h-96"
  >
    <div class="grid grid-cols-2 gap-2">
      <BaseInput
        v-model="localTrail.name"
        id="name"
        label="Name"
        class="w-full"
        :disabled="!editMode"
      />
      <BaseInput
        v-model="localTrail.location"
        id="location"
        label="Location"
        class="w-full"
        :disabled="!editMode"
      />
    </div>
    <!-- this is the mapcontainer-->
    <div
      id="trailMapContainer"
      @click="addPathPoint"
      class="h-80 w-full"
      ref="mapContainer"
    />

    <template v-if="editMode">
      <div class="flex flex-col">
        <EditablePathPoint
          v-for="(point, ind) in localTrail.path"
          :model-value="point"
          :key="ind"
          class="pt-4"
          @deletePoint="localTrail.path.splice(ind, 1)"
          @update:modelValue="(val) => updatePathPoint(ind, val)"
        />
      </div>
    </template>

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
      v-else-if="editMode"
      class="flex items-center justify-center gap-2 pt-5 pb-2"
    >
      <BaseButton id="save" :disabled="isLoading" @click="sendTrail">Save</BaseButton>
      <BaseButton
        id="cancel"
        :disabled="isLoading"
        secondary
        @click="cancelEdit"
        >Cancel</BaseButton
      >
    </div>
    <div
      v-else-if="isCreator"
      class="flex items-center justify-center gap-2 pt-5 pb-2"
    >
      <BaseButton id="edit" @click="handleEdit">Edit</BaseButton>
      <BaseButton id="delete" @click="handleDelete" secondary
        >Delete</BaseButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseInput from "../shared/BaseInput.vue";
import BaseButton from "../shared/BaseButton.vue";
import EditablePathPoint from "./EditablePathPoint.vue";
import { Trail, PathPoint } from "../../models/trail-model";
import { User } from "../../models/user-model";
import LeafletService from "../../services/leaflet-service";
import { useTrailsStore } from "../../stores/trails-store";
import { ref, computed, watch, onMounted } from "vue";

const props = defineProps<{
  trail: Trail;
  user: Partial<User>;
  editable?: boolean;
}>();

const emit = defineEmits<{
  delete: [id: string];
}>();

let leafletService = null;

const trailsStore = useTrailsStore();

const isLoading = ref(false);
const mapContainer = ref();
const editMode = ref(props.editable);
const originalTrail = ref({
  ...trailsStore.trails.find((trail) => trail._id === props.trail._id),
});

const localTrail = ref({ ...props.trail });

const isSubscribed = computed(() =>
  props.user?.trails?.includes(props.trail._id)
);
const isCreator = computed(
  () => props.user?.id === props.trail?.creator[0]?.id
);

function maxAbsoluteCoordinate(coordinates: number[]): number {
  return Math.max(...coordinates.map((coordinate) => Math.abs(coordinate)));
}

const meanCoordinates = computed(() => {
  const coordinates = localTrail.value.path.flatMap(
    (point) => point.coordinates
  );
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
        editMode.value,
        trail.path
      );
    } else {
      leafletService = new LeafletService(
        mapContainer,
        {
          lat: trail.path.length ? meanCoordinates.value.lat : 51.505,
          lng: trail.path.length ? meanCoordinates.value.lng : -0.09,
        },
        editMode.value,
        trail.path
      );
    }
  }
}

function handleEdit() {
  editMode.value = true;
}

function cancelEdit() {
  localTrail.value = { ...originalTrail.value };
  editMode.value = false;
}

function handleDelete() {
  emit("delete", props.trail._id || props.trail.id);
}

function updatePathPoint(index: number, point: PathPoint) {
  localTrail.value = {
    ...localTrail.value,
    path: localTrail.value.path.map((p, i) => (i === index ? point : p)),
  };
}

async function addPathPoint() {
  if (!editMode.value) return;

  await new Promise((resolve) => setTimeout(resolve, 100));
  const lastIndex = leafletService.getMarkerMapping().size;

  const coordinates = leafletService
    .getMarkerMapping()
    .get((lastIndex - 1).toString())._latlng;

  if (
    localTrail.value.path.find((point) => point.coordinates.lat === coordinates.lat && point.coordinates.lng === coordinates.lng)
  ) return;

  localTrail.value = {
    ...localTrail.value,
    path: [
      ...localTrail.value.path,
      {
        coordinates: {
          lat: coordinates.lat,
          lng: coordinates.lng,
        },
        name: "",
      },
    ],
  };
}

async function handleSubscribe() {
  isLoading.value = true;
  const reponse = isSubscribed.value
    ? await trailsStore.unsubscribeFromTrail(props.trail._id)
    : await trailsStore.subscribeToTrail(props.trail._id);
  if (reponse) {
    localTrail.value = { ...reponse };
  }
  isLoading.value = false;
}

async function sendTrail() {
  isLoading.value = true;
  const response = await trailsStore.updateTrail(localTrail.value);
  if (response) {
    localTrail.value = { ...response };
    originalTrail.value = { ...response };
    editMode.value = false;
  }
  isLoading.value = false;
}

onMounted(() => initMap(props.trail));

watch(
  () => [props.trail.path, editMode.value, localTrail.value.path],
  () => initMap(localTrail.value),
  { deep: true }
);
</script>
