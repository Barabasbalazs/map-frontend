import AppVue from "../../App.vue";
import { useAuthStore } from "../../stores/auth-store";
import { setActivePinia, createPinia } from "pinia";
import { Router, createRouter, createWebHistory } from "vue-router";
import router from "../../routing/router";
import redirectService from "../../services/router-service";
import { mount, enableAutoUnmount } from "@vue/test-utils";
import { describe, test, afterEach, beforeEach, expect } from "vitest";

enableAutoUnmount(afterEach);

let localRouter: Router;
beforeEach(async () => {
  localRouter = createRouter({
    history: createWebHistory(),
    routes: router.options.routes,
  });
  localRouter.beforeEach((to, _from, next) =>
    redirectService.beforeEach(to, _from, next)
  );
  setActivePinia(createPinia());
});

describe("Auth based rerouting tests", () => {
  test("When not authenticated, any existing route should redirect to login", async () => {
    const authStore = useAuthStore();
    authStore.authToken = "";

    localRouter.push("/tracking");
    await localRouter.isReady();

    mount(AppVue, {
      global: {
        plugins: [localRouter],
      },
    });

    console.log(localRouter.currentRoute.value.path);

    expect(localRouter.currentRoute.value.path).toBe("/login");
  });
  test("When authenticated, login route should redirect to landing page", async () => {
    const authStore = useAuthStore();
    authStore.authToken = "123";

    localRouter.push("/login");
    await localRouter.isReady();

    mount(AppVue, {
      global: {
        plugins: [localRouter],
      },
    });

    expect(localRouter.currentRoute.value.path).toBe("/");
  });
  test("Invalid route should redirect to not found page", async () => {
    const authStore = useAuthStore();
    authStore.authToken = "123";

    localRouter.push("/invalid-route");
    await localRouter.isReady();

    mount(AppVue, {
      global: {
        plugins: [localRouter],
      },
    });

    expect(localRouter.currentRoute.value.path).toBe("/invalid-route");
  });
});
