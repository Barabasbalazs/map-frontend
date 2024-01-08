<template>
  <div class="flex flex-col w-screen h-screen items-center">
    <div class="flex justify-center items-center h-1/3">
      <h1 class="text-4xl text-center">Balázs's Map App Simulator</h1>
    </div>
    <div class="flex flex-col items-center h-full w-full px-5 md:w-1/3 gap-6">
      <h2>
        Based on the input data, a path of coordinates will be generated. These
        can be tracked on the Tracking Page
      </h2>
      <SimulationInput v-if="!path" :model-value="userWithParametersModel" @update:model-value="createPath"/>
      <PathDisplay v-else :path="path" :user="user">
        {{ path }}
      </PathDisplay>
    </div>
  </div>
</template>

<script setup lang="ts">
import PathDisplay from "../components/simulator/PathDisplay.vue";
import SimulationInput from "../components/simulator/SimulationInput.vue";
import { UserWithParameters } from "../types/user-parameters";
import { generateRandomizedPath } from "../utils/path-generator";
import { ref } from "vue";

const path = ref();
const user = ref();

const userWithParametersModel = ref({
  user: {
    id: undefined,
    name: "",
    coords: {
      lat: 51.507,
      lng: 0.1,
    },
  },
  parameters: {
    distance: undefined,
    speed: undefined,
  },
})


function createPath(generatedData: UserWithParameters) {
  path.value = generateRandomizedPath(
    generatedData.user.coords,
    generatedData.parameters.distance,
    generatedData.parameters.speed
  );
  user.value = generatedData.user;
}
</script>