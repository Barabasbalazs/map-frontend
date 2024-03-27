<template>
  <PageLayout>
    <div class="flex flex-col items-center h-full w-full px-5 md:w-1/3 gap-6">
      <Loader v-if="isLoading" />
      <template v-else>
        <LoginForm
          v-if="loginForm"
          @register="loginForm = false"
          @submit="(val) => authenticate(val)"
        />
        <RegisterForm
          v-else
          @return="loginForm = true"
          @register="(val) => authenticate(val, false)"
        />
        <p v-if="apiError" id="apiError" class="text-red-500">
          {{ capitalizeFirstLetter(apiError) }}
        </p>
      </template>
    </div>
  </PageLayout>
</template>
<script setup lang="ts">
import PageLayout from "../components/shared/PageLayout.vue";
import LoginForm from "../components/auth/LoginForm.vue";
import RegisterForm from "../components/auth/RegisterForm.vue";
import Loader from "../components/shared/LoadingAnimation.vue";
import { User } from "../models/user-model";
import { useAuthStore } from "../stores/auth-store";
import router from "../routing/router";
import { capitalizeFirstLetter } from "../utils/string-manipulation";
import { ref } from "vue";

const authStore = useAuthStore();

const loginForm = ref(true);
const apiError = ref("");
const isLoading = ref(false);

async function authenticate(value: Partial<User>, login = true) {
  isLoading.value = true;
  apiError.value = "";
  const response = login
    ? await authStore.login(value)
    : await authStore.register(value);
  if (response.hasOwnProperty("message") && "message" in response) {
    apiError.value = response.message;
    isLoading.value = false;
    return;
  }
  isLoading.value = false;
  return router.push("/");
}
</script>
