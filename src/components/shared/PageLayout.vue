<template>
  <div class="flex flex-col h-screen justify-between">
    <div class="flex flex-col w-screen">
      <div class="flex justify-center items-center md:py-24 py-12">
        <h1 class="text-4xl text-center">{{ title }}</h1>
      </div>
      <div class="flex justify-center">
        <slot />
      </div>
    </div>
    <div v-if="isAuthenticated" class="flex flex-col items-center justify-center py-8 gap-2">
      <p>{{ user?.name || user?.email }} ({{ capitalizeFirstLetter(user?.role) }})</p>
      <router-link id="administration" to="/administration">{{ isAdmin ? 'Administration' : 'Account settings' }}</router-link>
      <button id="logout-button" @click="logoutUser">Logout</button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { capitalizeFirstLetter } from '../../utils/string-manipulation';
import router from '../../routing/router';
import { useAuthStore } from '../../stores/auth-store';
import { computed } from 'vue';

withDefaults(
  defineProps<{
    title?: string;
  }>(),
  {
    title: "Balázs's Map App",
  }
);

const authStore = useAuthStore();

const user = computed(() => authStore.user);
const isAuthenticated = computed(() => Object.keys(user.value).length);
const isAdmin = computed(() => user.value?.role === 'admin');

async function logoutUser() {
  await authStore.logout();
  return await router.push('/login');
}
</script>
