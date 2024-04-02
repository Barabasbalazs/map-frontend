import TrailsPage from "../TrailsPage.vue";
//import TrailDisplay from "../../components/maps/TrailDisplay.vue";
import LoadingAnimation from "../../components/shared/LoadingAnimation.vue";
import TrailFilters from "../../components/trails/TrailFilters.vue";
import { useAuthStore } from "../../stores/auth-store";
import { useTrailsStore } from "../../stores/trails-store";
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

const mockTrail = {
  id: "1",
  _id: "1",
  name: "Test trail",
  location: "Test location",
  path: [
    {
      name: "Test path",
      coordinates: { lat: 1, lng: 1 },
    },
    {
      name: "Test path 2",
      coordinates: { lat: 2, lng: 2 },
    },
  ],
  creator: testUser
};

beforeEach(async () => {
  setActivePinia(createPinia());
  useAuthStore().user = testUser;
  useAuthStore().authToken = "test";
  useTrailsStore().trails = [mockTrail];
});

describe("TrailsPage tests", () => {
  test("TrailsPage renders Loading and filtering component", async () => {
    const wrapper = mount(TrailsPage);

    expect(wrapper.findComponent(LoadingAnimation).exists()).toBe(true);
    expect(wrapper.findComponent(TrailFilters).exists()).toBe(true);
  });
});
