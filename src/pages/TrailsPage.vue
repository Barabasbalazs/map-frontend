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
          @delete="openDeleteModal"
        />
      </template>
      <!-- for adding new trails-->
      <!-- <TrailDisplay
        v-if="user.role === 'guide'"
        :user="user"
        :trail="emptyTrail"
        editable
      /> -->
    </div>
  </PageLayout>
  <BaseModal
    v-model:is-open="isModalOpen"
    cancel
    warning
    @close="isModalOpen = false"
    title="Delete Trail"
    text="Are you sure you would like to delete this Trail? There may be users subscribed to it."
    @confirm="deleteTrail"
    @cancel="isModalOpen = false"
  />
</template>
<script setup lang="ts">
import PageLayout from "../components/shared/PageLayout.vue";
import TrailDisplay from "../components/trails/TrailDisplay.vue";
import TrailFilters from "../components/trails/TrailFilters.vue";
import Loader from "../components/shared/LoadingAnimation.vue";
import BaseModal from "../components/shared/BaseModal.vue";
import { RequestParameters } from "../types/request-parameter";
import { useAuthStore } from "../stores/auth-store";
import { useTrailsStore } from "../stores/trails-store";
import { onMounted, computed, ref } from "vue";

const authStore = useAuthStore();
const trailsStore = useTrailsStore();

const isLoading = ref(true);
const isModalOpen = ref(false);
const trailToDelete = ref("");

const user = computed(() => authStore.user);
const trails = ref([]);
//const trails = computed(() => trailsStore.trails);

/*
const emptyTrail = {
  name: "",
  description: "",
  path: [],
};
*/

function openDeleteModal(id: string) {
  trailToDelete.value = id;
  isModalOpen.value = true;
}

async function getTrails(parameters: RequestParameters = {}) {
  isLoading.value = true;
  const resp = await trailsStore.getTrails(parameters);
  if (resp) {
    trails.value = resp;
  }
  isLoading.value = false;
}

async function deleteTrail() {
  isLoading.value = true;
  await trailsStore.deleteTrail(trailToDelete.value);
  isLoading.value = false;
}

onMounted(async () => {
  if (user.value.role === "guide") {
    getTrails({ sort: "name", order: "asc", search: "" });
  } else {
    await Promise.all([
      getTrails({ sort: "name", order: "asc", search: "" }),
      authStore.getUser(),
    ]);
  }
  isLoading.value = false;
});
</script>
