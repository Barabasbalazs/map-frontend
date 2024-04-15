<template>
  <PageLayout :title="isAdmin ? 'Admin Page' : 'Account Settings'"
    ><div class="flex flex-col gap-4 items-center">
      <LoadingAnimation v-if="isLoading" />
      <template v-else>
        <template v-if="isAdmin">
          <h2 class="text-2xl">Account Settings</h2>
          <UserCard :user="user" />
          <h2 class="text-2xl">Users</h2>
          <UserCard
            v-for="user in allNonAdminUsers"
            :key="user.id"
            :user="user"
        /></template>

        <UserCard v-else :user="user" />
      </template></div
  ></PageLayout>
</template>
<script setup lang="ts">
import LoadingAnimation from "../components/shared/LoadingAnimation.vue";
import PageLayout from "../components/shared/PageLayout.vue";
import UserCard from "../components/administration/UserCard.vue";
import { User } from "../models/user-model";
import { useAuthStore } from "../stores/auth-store";
import { useAdministrationStore } from "../stores/administration-store";
import { computed, onMounted, ref } from "vue";

const authStore = useAuthStore();
const administrationStore = useAdministrationStore();

const isLoading = ref(true);

const user = computed(() => authStore.user as User);
const allNonAdminUsers = computed(() => administrationStore.users);
const isAdmin = computed(() => user.value?.role === "admin");

onMounted(async () => {
  isAdmin.value
    ? await Promise.all([administrationStore.getUsers(), authStore.getUser()])
    : await authStore.getUser();
  isLoading.value = false;
});
</script>
