import { useTrailsStore } from "../stores/trails-store";
import { ref } from "vue";

export function useTrails() {
  const trailsStore = useTrailsStore();

  const isLoading = ref(true);
  const trailToDelete = ref("");
  const isModalOpen = ref(false);

  function openDeleteModal(id: string) {
    trailToDelete.value = id;
    isModalOpen.value = true;
  }

  async function deleteTrail(isCreatedTrail = false) {
    isLoading.value = true;
    await trailsStore.deleteTrail(trailToDelete.value, isCreatedTrail);
    isLoading.value = false;
  }

  return { isLoading, deleteTrail, isModalOpen, openDeleteModal };
}
