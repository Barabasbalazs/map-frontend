import NotFoundPage from "../NotFoundPage.vue";
import { shallowMount, enableAutoUnmount } from "@vue/test-utils";
import { expect, test, describe, afterEach, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";

enableAutoUnmount(afterEach);

beforeEach(async () => {
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
