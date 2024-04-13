<template>
  <div class="border-2 border-black rounded-xl p-2 mx-4">
    <div class="grid grid-cols-2 gap-2">
      <BaseInput
        v-model="modelValue.email"
        id="email"
        label="Email"
        class="w-full"
        :disabled="!isEditing || isLoading"
      />
      <BaseInput
        v-model="modelValue.name"
        id="name"
        label="Name"
        class="w-full"
        :disabled="!isEditing || isLoading"
      />
      <BaseButton
        id="modifyUser"
        :disabled="isLoading"
        @click="isEditing ? updateUser() : (isEditing = true)"
        >{{ isEditing ? "Save" : "Edit" }}</BaseButton
      >
      <BaseButton
        v-if="isEditing || isAdmin"
        id="cancelDeleteButton"
        secondary
        @click="isEditing ? cancelEdit() : deleteUser()"
        >{{ isEditing ? "Cancel" : "Delete" }}</BaseButton
      >
    </div>
  </div>
</template>
<script setup lang="ts">
import BaseInput from "../shared/BaseInput.vue";
import BaseButton from "../shared/BaseButton.vue";
import { User } from "../../models/user-model";
import { useAdministrationStore } from "../../stores/administration-store";
import { useAuthStore } from "../../stores/auth-store";
import { ref, computed } from "vue";

const props = defineProps<{
  user: User;
}>();

const authStore = useAuthStore();
const administrationStore = useAdministrationStore();

const isLoading = ref(false);
const isEditing = ref(false);
const originalUser = ref({ ...props.user });
const modelValue = ref(props.user);

const isAdmin = computed(() => authStore.user?.role === "admin");

function cancelEdit() {
  modelValue.value = { ...originalUser.value };
  isEditing.value = false;
}

async function updateUser() {
  isLoading.value = true;
  const newUser = isAdmin.value
    ? await administrationStore.updateUser(modelValue.value)
    : await authStore.updateUser(modelValue.value);
  if (newUser) {
    originalUser.value = { ...newUser } as User;
  }
  isEditing.value = false;
  isLoading.value = false;
}

async function deleteUser() {
  isLoading.value = true;
  await administrationStore.deleteUser(modelValue.value.id);
  isLoading.value = false;
}
</script>
