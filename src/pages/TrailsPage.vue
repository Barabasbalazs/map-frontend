<template>
  <PageLayout>
    <div class="flex flex-col gap-4 items-center">
      <TrailDisplay v-for="(trail, ind) in trails" :key="ind" :trail="trail" :user="user"/>
    </div>
  </PageLayout>
</template>
<script setup lang="ts">
import PageLayout from "../components/shared/PageLayout.vue";
import TrailDisplay from "../components/maps/TrailDisplay.vue";
import { RequestParameters } from "../types/request-parameter";
import { useAuthStore } from "../stores/auth-store";
import { useTrailsStore } from "../stores/trails-store";
import { onMounted, computed } from "vue";

const authStore = useAuthStore();
const trailsStore = useTrailsStore();

const user = computed(() => authStore.user);
const trails = computed(() => trailsStore.trails);

async function getTrails(parameters: RequestParameters = {}) {
  if (user.value.role === "guide") {
    parameters.creator = user.value.id;
  }
  await trailsStore.getTrails(parameters);
}

onMounted(() => getTrails());
</script>
