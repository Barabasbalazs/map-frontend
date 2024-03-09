<template>
  <div class="flex flex-col gap-2 w-full">
    <div class="flex flex-col gap-3 w-full">
      <h3 class="text-lg">Register</h3>
      <div class="grid grid-cols-2 gap-4">
        <BaseInput v-model="model.name" id="name" label="Name" :error="errors.name"/>
        <BaseInput v-model="model.email" id="email" label="Email" :error="errors.email"/>
        <BaseInput
          v-model="model.password"
          id="password"
          label="Password"
          type="password"
          :error="errors.password"
        />
        <BaseInput
          v-model="confirmPassword"
          id="confirmPassword"
          label="Confirm Password"
          type="password"
        />
      </div>
      <div class="flex items-center justify-center">
        <BaseInput
          v-model="model.role"
          id="role"
          label="Admin?"
          type="checkbox"
          @update:modelValue="(value: boolean) => model.role = value ? 'admin' : 'user'"
        />
      </div>
      <div class="flex justify-center w-full">
        <BaseButton id="registerButton" class="w-1/2" @click="validateForm"
          >Submit</BaseButton
        >
      </div>
      <div class="flex md:justify-center gap-1 pt-5">
        <p>Already have an account?</p>
        <button id="returnButton" class="text-blue-500" @click="emit('return')">
          Return to Login
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseInput from "../shared/BaseInput.vue";
import BaseButton from "../shared/BaseButton.vue";
import { userAuthSchema } from "../../validation/user-parameters-validation";
import { mapErroMessage } from "../../utils/validation-error-parser";
import { ref } from "vue";

const model = ref({
  name: "",
  email: "",
  password: "",
  role: "USER",
});

const errors = ref({
  name: "",
  email: "",
  password: "",
});

const confirmPassword = ref("");

const emit = defineEmits<{
  register: [
    value: { name: string; email: string; password: string; role: string }
  ];
  return: [];
}>();

async function validateForm() {
  errors.value = {
    name: "",
    email: "",
    password: "",
  };
  if (model.value.password !== confirmPassword.value) {
    errors.value.password = "Passwords do not match";
    return;
  }
  try {
    await userAuthSchema.validateAsync(model.value);
  } catch (error) {
    //role validation not mapped
    mapErroMessage(errors, error.message);
    return;
  }
  emit("register", model.value);
}
</script>
