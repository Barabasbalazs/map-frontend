<template>
  <PageLayout>
    <div class="flex flex-col items-center h-full w-full px-5 md:w-1/3 gap-6">
      <LoginForm v-if="loginForm" @register="loginForm = false" @submit="(val) => submitLogin(val)"/>
      <RegisterForm v-else @return="loginForm = true" @register="(val) => registerUser(val)"/>
    </div>
  </PageLayout>
</template>
<script setup lang="ts">
import PageLayout from "../components/shared/PageLayout.vue";
import LoginForm from "../components/auth/LoginForm.vue";
import RegisterForm from "../components/auth/RegisterForm.vue";
import { User } from "../models/user-model";
import { useAuthStore } from "../stores/auth-store";
import router from "../routing/router";
import { ref } from "vue";

const loginForm = ref(true);

const authStore = useAuthStore();

async function submitLogin(value: { email: string; password: string }) {
  const user = await authStore.login(value);
  if (user) {
    router.push("/");
  }
}

async function registerUser(value: Partial< User>) {
  const user = await authStore.register(value);
  if (user) {
    router.push("/");
  }
}

</script>
