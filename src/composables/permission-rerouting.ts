import { useTrailsStore } from "../stores/trails-store";
import { useRoute } from "vue-router";
import router from "../routing/router";
import { ref, onMounted } from "vue";

export function usePermissionRerouting() {
  const route = useRoute();
  const trailsStore = useTrailsStore();

  const isLoading = ref(true);

  onMounted(async () => {
    const trailResponse = await trailsStore.getTrail(route.params.id as string);
    if (!trailResponse) {
      return router.push({ name: "NotFound Page" });
    }
    isLoading.value = false;
  });

  return { isLoading };
}
