<template>
  <div class="flex flex-col w-screen h-screen">
    <div class="flex justify-center items-center h-1/3">
      <h1 class="text-4xl text-center">Balázs's Map App Simulator</h1>
    </div>
    <div class="flex flex-col items-center h-full w-full">
      <p>
        Based on the input data, a path of coordinates will be generated. These
        can be tracked on the Tracking Page
      </p>
      <SimulationInput />
    </div>
  </div>
</template>

<script setup lang="ts">
import SimulationInput from "../components/simulator/SimulationInput.vue"
</script>
