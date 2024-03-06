<template>
  <div class="flex flex-col gap-2 w-full">
    <div class="flex flex-col gap-3 w-full">
      <h3 class="text-lg">User Information</h3>
      <div class="grid grid-cols-2 gap-4">
        <BaseInput
          v-model="model.user.id"
          id="id"
          label="Id"
          type="number"
          :error="errors.id"
        />
        <BaseInput
          v-model="model.user.name"
          id="name"
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
          id="lat"
          label="Latitude"
          type="number"
          :error="errors.lat"
        />
        <BaseInput
          v-model="model.user.coords.lng"
          id="lng"
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
          id="distance"
          label="Total distance"
          type="number"
          tooltip="Km"
          :error="errors.distance"
        />
        <BaseInput
          v-model="model.parameters.speed"
          id="speed"
          label="Speed"
          type="number"
          tooltip="Km/h"
          :error="errors.speed"
        />
      </div>
    </div>
    <BaseButton @click="validateModel">Generate Path</BaseButton>
  </div>
</template>

<script setup lang="ts">
import BaseInput from "../shared/BaseInput.vue";
import BaseButton from "../shared/BaseButton.vue";
import { UserWithParameters } from "../../types/user-parameters";
import { userParametersSchema } from "../../validation/user-parameters-validation";
import { mapErroMessage } from "../../utils/validation-error-parser";
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
  speed: "",
});

async function validateModel() {
  errors.value = {
    id: "",
    name: "",
    lat: "",
    lng: "",
    distance: "",
    speed: "",
  };
  try {
    await userParametersSchema.validateAsync(model.value);
  } catch (error) {
    mapErroMessage(errors, error.message);
    return;
  }
  emit("update:modelValue", model.value);
}
</script>../shared/BaseInput.vue../shared/BaseButton.vue../../validation/user-parameters-validation