<template>
  <div class="flex justify-between">
    <div class="grid grid-cols-3 gap-2">
      <BaseInput
        id="nameInput"
        v-model="localModel.name"
        :error="errors.name"
        label="Name"
        class="w-full"
      />
      <BaseInput
        v-model="localModel.coordinates.lat"
        :error="errors.coordinates"
        id="latInput"
        label="Latitude"
        class="w-full"
      />
      <BaseInput
        v-model="localModel.coordinates.lng"
        id="lngInput"
        label="Longitude"
        class="w-full"
      />
    </div>

    <button id="deletePointButton" class="pt-1" @click="emit('deletePoint')">
      <img :src="closeCircleIcon" alt="close icon" class="w-8 h-8" />
    </button>
  </div>
</template>

<script setup lang="ts">
import BaseInput from "../shared/BaseInput.vue";
import closeCircleIcon from "../../assets/icons/close-circle.svg";
import { PathPoint } from "../../models/trail-model";
import { pathPointSchema } from "../../validation/trail-validation";
import { mapErroMessage } from "../../utils/validation-error-parser";
import { debouncedWatch } from "@vueuse/core";
import { ref } from "vue";

const props = defineProps<{
  modelValue: PathPoint;
}>();

const emit = defineEmits<{
  deletePoint: [];
  "update:modelValue": [value: PathPoint];
}>();

const localModel = ref({
  name: props.modelValue.name,
  coordinates: {
    lat: props.modelValue.coordinates.lat,
    lng: props.modelValue.coordinates.lng,
  },
});

const errors = ref({
  name: "",
  coordinates: "",
});

async function validateModel() {
  errors.value = {
    name: "",
    coordinates: "",
  };
  try {
    await pathPointSchema.validateAsync(localModel.value);
  } catch (error) {
    mapErroMessage(errors, error.message);
    return;
  }
  emit("update:modelValue", localModel.value);
}

debouncedWatch(
  () => [
    localModel.value.name,
    localModel.value.coordinates.lat,
    localModel.value.coordinates.lng,
  ],
  async () => await validateModel(),
  { debounce: 500 }
);
</script>
