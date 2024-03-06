<template>
  <PageLayout title="Balázs's Map App Simulator">
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
import SimulationInput from "../components/simulator/SimulationInput.vue";
import PageLayout from "../components/shared/PageLayout.vue";
import { UserWithParameters } from "../types/user-parameters";
import { generateRandomizedPath } from "../utils/path-generator";
import { ref } from "vue";

const path = ref();
const user = ref();
const isBroadcasting = ref(false);

const userWithParametersModel = ref({
  user: {
    id: undefined,
    name: "",
    email: "email@email.com",
    coords: {
      lat: 51.507,
      lng: 0.1,
    },
  },
  parameters: {
    distance: undefined,
    speed: undefined,
  },
});

function createPath(generatedData: UserWithParameters) {
  path.value = generateRandomizedPath(
    generatedData.user.coords,
    generatedData.parameters.distance,
    generatedData.parameters.speed
  );
  user.value = generatedData.user;
  isBroadcasting.value = true;
}
</script>
