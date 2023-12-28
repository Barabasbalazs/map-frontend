<template>
  <form class="flex flex-col gap-2">
    <div class="flex flex-col gap-2">
      <h2 class="text-lg">User Information:</h2>
      <div class="flex gap-4">
        <BaseInput label="Id" type="number" />
        <BaseInput label="Name" />
      </div>
      <h2 class="text-lg">The Users starting point:</h2>
      <div class="flex gap-4">
        <BaseInput label="Latitude" type="number" error="This Error" />
        <BaseInput label="Longitude" type="number"/>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import BaseInput from "../inputs/BaseInput.vue";
</script>
