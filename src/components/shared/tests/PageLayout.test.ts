import PageLayout from "../PageLayout.vue";
import { useAuthStore } from "../../../stores/auth-store";
import { describe, test, expect, beforeEach, afterEach } from "vitest";
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

describe("PageLayout tests", () => {
  test("Clicking the logout button on the PageLayout logs out the user", async () => {
    const wrapper = mount(PageLayout);
    wrapper.get("#logout-button").trigger("click");
    await wrapper.vm.$nextTick();
    expect(useAuthStore().user).toStrictEqual({});
    expect(useAuthStore().authToken).toBe("");
  });
});
