<template>
  <div class="flex flex-col gap-2 w-full">
    <div class="flex flex-col gap-3 w-full">
      <h3 class="text-lg">User Information</h3>
      <div class="grid grid-cols-2 gap-4">
        <BaseInput
          v-model="model.user.id"
          label="Id"
          type="number"
          :error="errors.id"
        />
        <BaseInput
          v-model="model.user.name"
          label="Name"
          :error="errors.name"
        />
      </div>
    </div>
    <div class="flex flex-col gap-3 w-full">
      <h3 class="text-lg">The Users starting point</h3>
      <div class="grid grid-cols-2 gap-4">
        <BaseInput
          v-model="model.user.coords.lat"
          label="Latitude"
          type="number"
          :error="errors.lat"
        />
        <BaseInput
          v-model="model.user.coords.lng"
          label="Longitude"
          type="number"
          :error="errors.lng"
        />
      </div>
    </div>
    <div class="flex flex-col gap-3 w-full">
      <h3 class="text-lg">Route specifications</h3>
      <div class="grid grid-cols-2 gap-4">
        <BaseInput
          v-model="model.parameters.distance"
          label="Total distance"
          type="number"
          tooltip="Km"
          :error="errors.distance"
        />
        <BaseInput
          v-model="model.parameters.time"
          label="Total time"
          type="number"
          tooltip="Km/h"
          :error="errors.time"
        />
      </div>
    </div>
    <BaseButton @click="validateModel">Generate Path</BaseButton>
  </div>
</template>

<script setup lang="ts">
import BaseInput from "../inputs/BaseInput.vue";
import BaseButton from "../inputs/BaseButton.vue";
import { UserWithParameters } from "../../types/user-parameters";
import { userParametersSchema } from "../../validation/user";
import { capitalizeFirstLetter } from "../../utils/string-manipulation";
import { ref } from "vue";

const props = defineProps<{
  modelValue: UserWithParameters;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: UserWithParameters];
}>();

const model = ref(props.modelValue);

const errors = ref({
  id: "",
  name: "",
  lat: "",
  lng: "",
  distance: "",
  time: "",
});

function mapErroMessage(errorMessage: string) {
  const key = Object.keys(errors.value).find((key) =>
    errorMessage.includes(key)
  );
  if (key) {
    const errorWithoutQutes = errorMessage.replace(/"/g, "");
    const lastDotIndex = errorWithoutQutes.lastIndexOf(".");
    errors.value[key] = capitalizeFirstLetter(
      lastDotIndex === -1
        ? errorWithoutQutes
        : errorWithoutQutes.substring(lastDotIndex + 1)
    );
  }
}

async function validateModel() {
  errors.value = {
    id: "",
    name: "",
    lat: "",
    lng: "",
    distance: "",
    time: "",
  };
  try {
    await userParametersSchema.validateAsync(model.value);
  } catch (error) {
    mapErroMessage(error.message);
    return;
  }
  emit("update:modelValue", model.value);
}
</script>
