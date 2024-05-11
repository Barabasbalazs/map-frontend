<template>
  <LoadingAnimation v-if="isLoading" />
  <PageLayout v-else title="Balázs's Map App Simulator">
    <div class="flex flex-col items-center h-full w-full px-5 md:w-1/3 gap-6">
      <h2>
        Based on the input data, a path of coordinates will be generated. These
        can be tracked on the Tracking Page
      </h2>
      <SimulationInput
        v-if="!isBroadcasting"
        :model-value="userWithParametersModel"
        @update:model-value="createPath"
      />
      <PathDisplay
        v-else-if="path && isBroadcasting"
        :trail-id="trail?.id"
        :path="path"
        :user="user"
        @finished-broadcast="isBroadcasting = false"
      >
        {{ path }}
      </PathDisplay>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import PathDisplay from "../components/simulator/PathDisplay.vue";
import LoadingAnimation from "../components/shared/LoadingAnimation.vue";
import SimulationInput from "../components/simulator/SimulationInput.vue";
import PageLayout from "../components/shared/PageLayout.vue";
import { UserWithParameters } from "../types/user-parameters";
import { generatePath } from "../utils/path-generator";
import { usePermissionRerouting } from "../composables/permission-rerouting";
import { useTrailsStore } from "../stores/trails-store";
import { useAuthStore } from "../stores/auth-store";
import { computed, ref } from "vue";

const { isLoading } = usePermissionRerouting();
const trailsStore = useTrailsStore();
const authStore = useAuthStore();

const path = ref();
const user = ref();
const isBroadcasting = ref(false);

const userWithParametersModel = ref({
  user: {
    id: authStore.user?.id || "",
    name: authStore.user?.name || "User",
    email: authStore.user?.email || "",
    coords: {
      lat: 51.507,
      lng: 0.1,
    },
  },
  parameters: {
    speed: undefined,
  },
});

const trail = computed(() => trailsStore.trail);

function createPath(generatedData: UserWithParameters) {
  path.value = generatePath(
    trail.value?.path?.map((point) => point.coordinates),
    userWithParametersModel.value?.parameters?.speed
  );
  user.value = generatedData.user;
  isBroadcasting.value = true;
}
</script>
../utils/random-path-generator
