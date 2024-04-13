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
  test("If user is Admin admin redirect apears", async () => {
    useAuthStore().user = { ...testUser, role: "admin" };
    const wrapper = mount(PageLayout);
    const redirect = wrapper.find("#administration");
    expect(redirect.exists()).toBe(true);
    expect(redirect.text()).toBe("Administration");
    expect(redirect.attributes("to")).toBe("/administration");
  })
  test("If user is not Admin only account settings apear", async () => {
    useAuthStore().user = testUser;
    const wrapper = mount(PageLayout);
    const redirect = wrapper.find("#administration");
    expect(redirect.exists()).toBe(true);
    expect(redirect.text()).toBe("Account settings");
    expect(redirect.attributes("to")).toBe("/administration");
  })
});
