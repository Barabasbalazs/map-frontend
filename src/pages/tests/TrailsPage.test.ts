import TrailsPage from "../TrailsPage.vue";
//import TrailDisplay from "../../components/maps/TrailDisplay.vue";
import LoadingAnimation from "../../components/shared/LoadingAnimation.vue";
import TrailFilters from "../../components/trails/TrailFilters.vue";
import { useAuthStore } from "../../stores/auth-store";
import { describe, test, expect, afterEach, beforeEach } from "vitest";
import { mount, enableAutoUnmount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";

enableAutoUnmount(afterEach);

const testUser = {
  role: "guide",
  name: "test",
  email: "ffff@mail.com",
  id: "123",
};

beforeEach(async () => {
  setActivePinia(createPinia());
  useAuthStore().user = testUser;
  useAuthStore().authToken = "test";
});

describe("TrailsPage tests", () => {
  test("TrailsPage renders Loading and filtering component", () => {
    const wrapper = mount(TrailsPage);
    // expect(wrapper.findComponent(TrailDisplay).exists()).toBe(true);
    expect(wrapper.findComponent(LoadingAnimation).exists()).toBe(true);
    expect(wrapper.findComponent(TrailFilters).exists()).toBe(true);
  });
});
