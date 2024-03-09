import AppVue from "../../App.vue";
import NotFoundPage from "../NotFoundPage.vue";
import { Router, createRouter, createWebHistory } from "vue-router";
import {
  mount,
  shallowMount,
  enableAutoUnmount,
  flushPromises,
} from "@vue/test-utils";
import { expect, test, describe, afterEach, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import router from "../../routing/router";

enableAutoUnmount(afterEach);

let localRouter: Router;
beforeEach(async () => {
  localRouter = createRouter({
    history: createWebHistory(),
    routes: router.options.routes,
  });
  setActivePinia(createPinia());
});

describe("NoFoundPage mounting tests", () => {
  test("NotFoundPage mounts properly", () => {
    const wrapper = shallowMount(NotFoundPage);
    expect(wrapper.exists()).toBe(true);
  });
  /*
  test("NotFoundPage mounts when the route is not found", async () => {
    localRouter.push("/nonexistent");

    await localRouter.isReady();
    const wrapper = mount(AppVue, {
      global: {
        plugins: [localRouter],
      },
    });

    expect(wrapper.findComponent(NotFoundPage).exists()).toBe(true);

    await flushPromises();
  });
  */
});
