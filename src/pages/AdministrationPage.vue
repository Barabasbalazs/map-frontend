<template>
  <PageLayout :title="isAdmin ? 'Admin Page' : 'Account Settings'"
    ><div class="flex flex-col gap-4 items-center">
      <LoadingAnimation v-if="isLoading" />
      Tha Admin page
    </div></PageLayout
  >
</template>
<script setup lang="ts">
import LoadingAnimation from "../components/shared/LoadingAnimation.vue";
import PageLayout from "../components/shared/PageLayout.vue";
import { useAuthStore } from "../stores/auth-store";
import { computed, onMounted, ref } from "vue";

const authStore = useAuthStore();

const isLoading = ref(true);

const user = computed(() => authStore.user);
const isAdmin = computed(() => user.value?.role === "admin");

onMounted(async () => {
  if (isAdmin.value) {
    await authStore.getUser();
  }
  isLoading.value = false;
});
</script>
