<template>
  <router-view />
  <BaseModal
    v-if="isErrorModalOpen"
    v-model:is-open="isErrorModalOpen"
    :title="notificationStore.title"
    :text="notificationStore.message"
    warning
    @confirm="notificationStore.hideNotification"
  />
</template>

<script setup lang="ts">
import BaseModal from "./components/shared/BaseModal.vue";
import { useNotificationStore } from "./stores/notification-store";
import { computed } from "vue";

const notificationStore = useNotificationStore();

const isErrorModalOpen = computed(() => notificationStore.isDisplayed);
</script>
