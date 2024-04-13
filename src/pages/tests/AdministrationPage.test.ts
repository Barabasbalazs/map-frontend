import AdministrationPage from "../AdministrationPage.vue";
import { useAuthStore } from "../../stores/auth-store";
import { createFetchResponse } from "../../utils/testing-utilites";
import { setActivePinia, createPinia } from "pinia";
import { mount, enableAutoUnmount } from "@vue/test-utils";
import { expect, test, describe, beforeEach, vi, afterEach } from "vitest";

const mockedUser = {
  id: "1",
  email: "bb@mail.com",
  name: "mockedUser",
  role: "admin",
};

enableAutoUnmount(afterEach);

beforeEach(() => {
  setActivePinia(createPinia());
  useAuthStore().user = mockedUser;
  useAuthStore().authToken = "token";
});

describe("AdministrationPage", () => {
  test("If user is not an admin it should fetch current user data from the API", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      createFetchResponse({
        user: mockedUser,
      })
    );

    const page = mount(AdministrationPage);
    await page.vm.$nextTick();

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/v1/administration/users/1",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token",
        },
        method: "GET",
        mode: "cors",
      }
    );

    expect(useAuthStore().user).toEqual(mockedUser);
  });
});
