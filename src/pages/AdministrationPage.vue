<template>
  <PageLayout :title="isAdmin ? 'Admin Page' : 'Account Settings'"
    ><div class="flex flex-col gap-4 items-center">
      <LoadingAnimation v-if="isLoading" />
      <template v-else>
        <h2 class="text-2xl">Account Settings</h2>
        <UserCard :user="user" />
        <template v-if="isAdmin">
          <template v-if="adminRequests.length">
            <h2 class="text-2xl">Administration Requests</h2>
            <AdminRequestCard
              v-for="adminRequest in adminRequests"
              :key="adminRequest.id"
              :admin-request="adminRequest"
            />
          </template>
          <template v-if="allUsers.length">
            <h2 class="text-2xl">Users</h2>
            <UserCard
              v-for="user in allUsers"
              :id="`user-${user.id}`"
              :key="user.id"
              :user="user"
              @delete-user="openDeleteModal(user)" /></template
        ></template>
      </template>
      <BaseButton
        class="mt-4"
        id="delete-account"
        @click="openDeleteModal(user)"
        >Delete Account</BaseButton
      >
    </div>
  </PageLayout>
  <BaseModal
    id="delete-user-modal"
    v-model:is-open="isModalOpen"
    title="Delete User"
    :text="modalText"
    warning
    cancel
    @confirm="deleteUser"
    @close="isModalOpen = false"
    @cancel="isModalOpen = false"
  />
</template>
<script setup lang="ts">
import LoadingAnimation from "../components/shared/LoadingAnimation.vue";
import PageLayout from "../components/shared/PageLayout.vue";
import UserCard from "../components/administration/UserCard.vue";
import BaseModal from "../components/shared/BaseModal.vue";
import BaseButton from "../components/shared/BaseButton.vue";
import AdminRequestCard from "../components/administration/AdminRequestCard.vue";
import { User } from "../models/user-model";
import { useAuthStore } from "../stores/auth-store";
import { useAdministrationStore } from "../stores/administration-store";
import router from "../routing/router";
import { computed, onMounted, ref } from "vue";

const authStore = useAuthStore();
const administrationStore = useAdministrationStore();

const isLoading = ref(true);
const isModalOpen = ref(false);
const modalText = ref("");
const userToDelete = ref<User | null>(null);

const user = computed(() => authStore.user as User);
const allUsers = computed(() => administrationStore.users);
const isAdmin = computed(() => user.value?.role === "admin");
const adminRequests = computed(() => administrationStore.adminRequests);

function openDeleteModal(userToBeDeleted: User) {
  userToDelete.value = userToBeDeleted;
  modalText.value =
    userToBeDeleted.id === user.value.id
      ? "Are you sure you would like to delete your own account?"
      : `Are you sure you would like to delete ${userToBeDeleted.name}?`;
  isModalOpen.value = true;
}

async function deleteUser() {
  isLoading.value = true;
  if (userToDelete.value?.id === user.value.id) {
    await authStore.deleteUserAccount();
    router.push("/");
    return;
  }
  await administrationStore.deleteUser(userToDelete.value?.id);
  isModalOpen.value = false;
  isLoading.value = false;
}

onMounted(async () => {
  isAdmin.value
    ? await Promise.all([
        administrationStore.getUsers(),
        authStore.getUser(),
        administrationStore.getAdminRequests(),
      ])
    : await authStore.getUser();
  isLoading.value = false;
});
</script>
