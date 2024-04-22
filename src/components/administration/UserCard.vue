<template>
  <div class="border-2 border-black rounded-xl p-2 mx-4 max-w-md md:w-[28rem]">
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
      <SelectInput
        v-if="isAdmin && modelValue.id !== loggedInUser.id"
        id="role"
        v-model="modelValue.role"
        label="Role"
        :disabled="!isEditing || isLoading"
        :options="roleOptions"
        type="checkbox"
      />
    </div>
    <div class="flex items-center justify-center gap-2">
      <BaseButton
        id="modifyUser"
        :disabled="isLoading"
        @click="isEditing ? updateUser() : (isEditing = true)"
        >{{ isEditing ? "Save" : "Edit" }}</BaseButton
      >
      <BaseButton
        v-if="isEditing || (isAdmin && modelValue.id !== loggedInUser.id)"
        id="cancelDeleteButton"
        secondary
        @click="isEditing ? cancelEdit() : emit('delete-user')"
        >{{ isEditing ? "Cancel" : "Delete" }}</BaseButton
      >
    </div>
  </div>
</template>
<script setup lang="ts">
import BaseInput from "../shared/BaseInput.vue";
import BaseButton from "../shared/BaseButton.vue";
import SelectInput from "../shared/SelectInput.vue";
import roleOptions from "../../constants/roles";
import { User } from "../../models/user-model";
import { useAdministrationStore } from "../../stores/administration-store";
import { useAuthStore } from "../../stores/auth-store";
import { ref, computed } from "vue";

const props = defineProps<{
  user: User;
}>();

const emit = defineEmits<{
  "delete-user": [void];
}>();

const authStore = useAuthStore();
const administrationStore = useAdministrationStore();

const isLoading = ref(false);
const isEditing = ref(false);
const originalUser = ref({ ...props.user });
const modelValue = ref(props.user);

const loggedInUser = computed(() => authStore.user as User);
const isAdmin = computed(() => loggedInUser.value?.role === "admin");

function cancelEdit() {
  modelValue.value = { ...originalUser.value };
  isEditing.value = false;
}

async function updateUser() {
  isLoading.value = true;
  const newUser =
    loggedInUser.value?.id === modelValue.value?.id
      ? await authStore.updateUser(modelValue.value)
      : await administrationStore.updateUser(modelValue.value);
  if (newUser) {
    originalUser.value = { ...newUser } as User;
  }
  isEditing.value = false;
  isLoading.value = false;
}
</script>
