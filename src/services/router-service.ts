import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { useAuthStore } from "../stores/auth-store";

const userRestrictedRoutes = ["Tracking Page", "My Trails Page"];
const guideRestrictedRoutes = ["Subscribed Trails Page", "Simulator Page"];

const redirectService = {
  beforeEach: (
    to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const authStore = useAuthStore();

    if (to.name === "NotFound Page") {
      return next();
    }

    if (!authStore.authToken && to.path !== "/login") {
      return next("/login");
    }

    if (to.path === "/login" && authStore.authToken !== "") {
      return next("/");
    }

    if (
      authStore.user.role === "user" &&
      userRestrictedRoutes.includes(to.name.toString())
    ) {
      return next("/");
    }

    if (
      authStore.user.role === "guide" &&
      guideRestrictedRoutes.includes(to.name.toString())
    ) {
      return next("/");
    }

    return next();
  },
};

export default redirectService;
