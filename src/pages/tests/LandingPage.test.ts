import LandingPage from "../LandingPage.vue";
import { useAuthStore } from "../../stores/auth-store";
import { mount, shallowMount, enableAutoUnmount } from "@vue/test-utils";
import { expect, test, describe, afterEach, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";

enableAutoUnmount(afterEach);

const testUser = {
  role: "admin",
  name: "test",
  email: "ffff@mail.com",
  id: 123,
};

beforeEach(async () => {
  setActivePinia(createPinia());
  useAuthStore().user = testUser;
  useAuthStore().authToken = "test";
});

describe("LandingPage mounting tests", () => {
  test("LandingPage mounts properly", () => {
    const wrapper = shallowMount(LandingPage);
    expect(wrapper.exists()).toBe(true);
  });
});
describe("LandinPage auth level tests", () => {
  test("LandingPage renders Tracking and Simulator hrefs when user is admin or guide", () => {
    const wrapper = mount(LandingPage, {
      global: {
        plugins: [createPinia()],
      },
    });

    const trackingLink = wrapper.find("#tracking");
    expect(trackingLink.exists()).toBe(true);
    const simulatorLink = wrapper.find("#simulator");
    expect(simulatorLink.exists()).toBe(true);
    const trailsLink = wrapper.find("#trails");
    expect(trailsLink.exists()).toBe(true);
  });
  test("LandingPage does not render Tracking href when user is not admin or guide", async () => {
    const wrapper = mount(LandingPage, {
      global: {
        plugins: [createPinia()],
      },
    });
    useAuthStore().user = { ...testUser, role: "user" };

    await wrapper.vm.$nextTick();

    const trackingLink = wrapper.find("#tracking");
    expect(trackingLink.exists()).toBe(false);
  });
});
