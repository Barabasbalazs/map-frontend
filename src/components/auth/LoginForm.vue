<template>
  <div class="flex flex-col gap-2 w-full">
    <div class="flex flex-col gap-3 w-full">
      <h3 class="text-lg">Login</h3>
      <div class="grid grid-cols-2 gap-4">
        <BaseInput v-model="model.email" id="email" label="Email" />
        <BaseInput
          v-model="model.password"
          id="password"
          label="Password"
          type="password"
        />
      </div>
      <div class="flex justify-center w-full">
        <BaseButton
          id="loginButton"
          class="w-1/2"
          @click="emit('submit', model)"
          >Submit</BaseButton
        >
      </div>
      <div class="flex md:justify-center gap-1 pt-5">
        <p>Don't have an account yet?</p>
        <button
          id="registerButton"
          class="text-blue-500"
          @click="emit('register')"
        >
          Register
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import BaseInput from "../shared/BaseInput.vue";
import BaseButton from "../shared/BaseButton.vue";
import { ref } from "vue";

const emit = defineEmits<{
  submit: [value: { email: string; password: string }];
  register: [];
}>();

const model = ref({
  email: "",
  password: "",
});
</script>
