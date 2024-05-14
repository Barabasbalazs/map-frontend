import { Trail } from "../models/trail-model";
import { RequestParameters } from "../types/request-parameter";
import { useTrailsStore } from "../stores/trails-store";
import { useAuthStore } from "../stores/auth-store";
import { useRoute } from "vue-router";
import { ref, computed, onMounted } from "vue";

export function useTrails() {
  const emptyTrail = {
    name: "",
    description: "",
    path: [],
  };

  const route = useRoute();
  const trailsStore = useTrailsStore();
  const authStore = useAuthStore();

  const isLoading = ref(true);
  const trailToDelete = ref("");
  const isModalOpen = ref(false);
  const isCreatingNewTrail = ref(false);

  const isTrailsPage = computed(() => route.name === "Trails Page");
  const user = computed(() => authStore.user);
  const isGuide = computed(() => user.value?.role === "guide");
  const trails = computed(() => {
    if (isTrailsPage.value) return trailsStore.trails;
    return isGuide.value
      ? trailsStore.createdTrails
      : trailsStore.subscribedTrails;
  });
  const isButtonVisible = computed(
    () => isGuide.value && !isLoading.value && !isCreatingNewTrail.value
  );

  function openDeleteModal(id: string) {
    trailToDelete.value = id;
    isModalOpen.value = true;
  }

  async function getTrails(parameters: RequestParameters = {}) {
    isLoading.value = true;
    await trailsStore.getTrails(parameters);
    isLoading.value = false;
  }

  async function deleteTrail(isCreatedTrail = false) {
    isLoading.value = true;
    await trailsStore.deleteTrail(trailToDelete.value, isCreatedTrail);
    isLoading.value = false;
  }

  async function createTrail(trail: Trail) {
    isLoading.value = true;
    await trailsStore.createTrail(trail);
    isCreatingNewTrail.value = false;
    isLoading.value = false;
  }

  async function trailsPageMountingFunction() {
    if (isGuide.value) {
      getTrails({ sort: "name", order: "asc", search: "" });
    } else {
      await Promise.all([
        getTrails({ sort: "name", order: "asc", search: "" }),
        authStore.getUser(),
      ]);
    }
    isLoading.value = false;
  }

  async function createdTrailsPageMountingFunction() {
    isGuide.value
      ? await trailsStore.getCreatedTrails()
      : await trailsStore.getSubscribedTrails();
    isLoading.value = false;
  }

  onMounted(async () =>
    isTrailsPage.value
      ? await trailsPageMountingFunction()
      : await createdTrailsPageMountingFunction()
  );

  return {
    isTrailsPage,
    emptyTrail,
    isLoading,
    deleteTrail,
    isModalOpen,
    openDeleteModal,
    isCreatingNewTrail,
    user,
    isGuide,
    trails,
    isButtonVisible,
    createTrail,
    getTrails,
  };
}
