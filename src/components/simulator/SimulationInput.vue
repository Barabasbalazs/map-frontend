<template>
  <div class="flex flex-col gap-2 w-full">
    <div class="flex flex-col items-center gap-3 w-full">
      <h3 class="text-lg">Route specifications</h3>
      <div class="flex justify-center">
        <BaseInput
          v-model="model.parameters.speed"
          id="speed"
          label="Speed"
          type="number"
          tooltip="Km/h"
          :error="errors.speed"
        />
      </div>
      <BaseButton class="" @click="validateModel">Generate Path</BaseButton>
    </div>
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
  speed: "",
});

async function validateModel() {
  errors.value = {
    id: "",
    name: "",
    lat: "",
    lng: "",
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
</script>
