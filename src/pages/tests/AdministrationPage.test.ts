import AdministrationPage from "../AdministrationPage.vue";
import { useAuthStore } from "../../stores/auth-store";
import { useAdministrationStore } from "../../stores/administration-store";
import { createFetchResponse } from "../../utils/testing-utilites";
import { setActivePinia, createPinia } from "pinia";
import { mount, enableAutoUnmount } from "@vue/test-utils";
import { expect, test, describe, beforeEach, vi, afterEach } from "vitest";

const mockedAdmin = {
  id: "1",
  email: "bb@mail.com",
  name: "mockedAdmin",
  role: "admin",
};

const mockedUser = {
  id: "2",
  email: "bb@mail.com",
  name: "mockedUser",
  role: "user",
};

enableAutoUnmount(afterEach);

beforeEach(() => {
  setActivePinia(createPinia());
  useAuthStore().authToken = "token";
});

describe("AdministrationPage", () => {
  test("If user is not an admin it should fetch current user data from the API", async () => {
    useAuthStore().user = mockedUser;
    globalThis.fetch = vi.fn().mockResolvedValue(
      createFetchResponse({
        user: mockedUser,
      })
    );

    const page = mount(AdministrationPage);
    await page.vm.$nextTick();

    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:8080/v1/administration/users/${mockedUser.id}`,
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
  test("If user is an admin it should fetch all users data from the API", async () => {
    useAuthStore().user = mockedAdmin;
    globalThis.fetch = vi
      .fn()
      .mockResolvedValue(createFetchResponse([mockedUser]));

    const page = mount(AdministrationPage);

    await page.vm.$nextTick();

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/v1/administration/users",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token",
        },
        method: "GET",
        mode: "cors",
      }
    );

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(useAdministrationStore().users).toEqual([mockedUser]);
  });
});
