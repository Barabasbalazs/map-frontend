<template>
  <PageLayout
    ><div class="flex flex-col gap-4 items-center">
      <Loader v-if="isLoading" />
      <BaseButton v-if="isButtonVisible" @click="isCreatingNewTrail = true"
        >Create New Trail</BaseButton
      >
      <TrailDisplay
        v-if="isCreatingNewTrail"
        :trail="emptyTrail"
        :user="user"
        editable
        is-creating
        @delete="isCreatingNewTrail = false"
        @create="createTrail"
      />
      <template v-if="!isLoading">
        <TrailDisplay
          v-for="trail in trails"
          :key="trail.id"
          :trail="trail"
          :user="user"
          @delete="openDeleteModal"
        />
      </template></div
  ></PageLayout>
</template>
<script setup lang="ts">
import PageLayout from "../components/shared/PageLayout.vue";
import Loader from "../components/shared/LoadingAnimation.vue";
import TrailDisplay from "../components/trails/TrailDisplay.vue";
import BaseButton from "../components/shared/BaseButton.vue";
import { Trail } from "../models/trail-model";
import { useTrailsStore } from "../stores/trails-store";
import { useAuthStore } from "../stores/auth-store";
import { computed, ref, onMounted } from "vue";

const trailsStore = useTrailsStore();
const authStore = useAuthStore();

const emptyTrail = {
  name: "",
  description: "",
  path: [],
};
const isCreatingNewTrail = ref(false);
const isLoading = ref(true);

const user = computed(() => authStore.user);
const isGuide = computed(() => user.value?.role === "guide");
const trails = computed(() =>
  isGuide.value ? trailsStore.createdTrails : trailsStore.subscribedTrails
);
const isButtonVisible = computed(
  () => isGuide.value && !isLoading.value && !isCreatingNewTrail.value
);

//probably put this into a composable for better code quality
function openDeleteModal() {}

async function createTrail(trail: Trail) {
  isLoading.value = true;
  await trailsStore.createTrail(trail);
  isCreatingNewTrail.value = false;
  isLoading.value = false;
}

onMounted(async () => {
  isGuide.value
    ? await trailsStore.getCreatedTrails()
    : await trailsStore.getSubscribedTrails();
  isLoading.value = false;
});
</script>
