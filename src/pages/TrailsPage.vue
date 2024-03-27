<template>
  <PageLayout>
    <div class="flex flex-col gap-4 items-center">
      <TrailFilters :user="user" @search="getTrails" />
      <Loader v-if="isLoading" />
      <template v-else>
        <TrailDisplay
          v-for="trail in trails"
          :key="trail.id"
          :trail="trail"
          :user="user"
          :editable="user.role === 'guide'"
        />
      </template>
      <TrailDisplay
        v-if="user.role === 'guide'"
        :user="user"
        :trail="emptyTrail"
        editable
      />
    </div>
  </PageLayout>
</template>
<script setup lang="ts">
import PageLayout from "../components/shared/PageLayout.vue";
import TrailDisplay from "../components/maps/TrailDisplay.vue";
import TrailFilters from "../components/trails/TrailFilters.vue";
import Loader from "../components/shared/LoadingAnimation.vue";
import { RequestParameters } from "../types/request-parameter";
import { useAuthStore } from "../stores/auth-store";
import { useTrailsStore } from "../stores/trails-store";
import { onMounted, computed, ref } from "vue";

const authStore = useAuthStore();
const trailsStore = useTrailsStore();

const isLoading = ref(false);

const user = computed(() => authStore.user);
const trails = computed(() => trailsStore.trails);

const emptyTrail = {
  name: "",
  description: "",
  path: [],
};

async function getTrails(parameters: RequestParameters = {}) {
  // if (user.value.role === "guide") {
  //   parameters.creator = user.value.id;
  // }
  isLoading.value = true;
  await trailsStore.getTrails(parameters);
  isLoading.value = false;
}

onMounted(() => getTrails());
</script>
