<template>
  <div class="flex flex-col gap-2">
    <div class="flex flex-col gap-2">
      <h2 class="text-lg">User Information:</h2>
      <div class="flex gap-4">
        <BaseInput v-model="model.user.id" label="Id" type="number" />
        <BaseInput v-model="model.user.name" label="Name" />
      </div>
      <h2 class="text-lg">The Users starting point:</h2>
      <div class="flex gap-4">
        <BaseInput v-model="model.user.coords.lat" label="Latitude" type="number" error="This Error" />
        <BaseInput v-model="model.user.coords.lng" label="Longitude" type="number" />
      </div>
      <h2 class="text-lg">Route specifications:</h2>
      <div class="flex gap-4">
        <BaseInput v-model="model.parameters.distance" label="Total distance" type="number" tooltip="Km" />
        <BaseInput v-model="model.parameters.time" label="Total time" type="number" tooltip="Km/h" />
      </div>
      <BaseButton @click="validateModel">Generate Path</BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseInput from "../inputs/BaseInput.vue";
import BaseButton from "../inputs/BaseButton.vue";
import { UserWithParameters } from "../../types/user-parameters";
import { userParametersSchema } from "../../models/user-model.dto";
import { ref } from "vue";

const props = defineProps<{
  modelValue: UserWithParameters;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: UserWithParameters];
}>();

const model = ref(props.modelValue);

async function validateModel() {
  try {
    await userParametersSchema.validateAsync(model.value);
  }
  catch (error) {
    console.log('error',error);
  }
}
</script>