<template>
  <PageLayout>
    <div class="flex flex-col items-center h-full w-full gap-2 px-5 md:px-0">
      <router-link to="/trails" id="trails" class="flex items-center gap-4">
        <div class="flex items-center justify-center pr-4">
          <img class="w-8 h-8" :src="mapIcon" alt="mapIcon" />
        </div>
        <p>View Trails</p>
      </router-link>
      <router-link
        to="/simulator"
        id="simulator"
        class="flex items-center gap-4"
      >
        <div class="flex items-center justify-center px-2">
          <img class="w-8 h-8" :src="monitorAccount" alt="monitorAccount" />
        </div>
        <p>Simulate Hike</p></router-link
      >
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import PageLayout from "../components/shared/PageLayout.vue";
import monitorAccount from "../assets/icons/monitor-account.svg";
import mapIcon from "../assets/icons/map.svg";
import { useAuthStore } from "../stores/auth-store";
import { onMounted } from "vue";

const authStore = useAuthStore();

onMounted(() => authStore.getUser());
</script>
