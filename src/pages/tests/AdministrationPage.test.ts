import AdministrationPage from "../AdministrationPage.vue";
import { useAuthStore } from "../../stores/auth-store";
import { useAdministrationStore } from "../../stores/administration-store";
import { useTrailsStore } from "../../stores/trails-store";
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
  test("If user is admin by clicking the delete button on UserCard it should open the modal, on confirmation it should delete the user", async () => {
    useAuthStore().user = mockedAdmin;
    useAuthStore().authToken = "token";
    useAdministrationStore().users = [mockedUser];

    globalThis.fetch = vi.fn().mockResolvedValue(
      createFetchResponse({
        message: "User deleted successfully.",
      })
    );

    useAdministrationStore().getUsers = vi.fn().mockResolvedValue(() => {
      useAdministrationStore().users = [mockedUser];
    });
    useAuthStore().getUser = vi.fn().mockResolvedValue(() => {
      useAuthStore().user = mockedAdmin;
      useAuthStore().authToken = "token";
    });

    const page = mount(AdministrationPage, { attachTo: document.body });

    await new Promise((resolve) => setTimeout(resolve, 100));

    const userCards = page.findAllComponents({ name: "UserCard" });

    expect(page.findComponent({ name: "BaseModal" }).isVisible()).toBe(false);

    expect(userCards.length).toBe(2);

    userCards[1].vm.$emit("delete-user");

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(page.findComponent({ name: "BaseModal" }).exists()).toBe(true);

    page.findComponent({ name: "BaseModal" }).vm.$emit("close-modal");

    await new Promise((resolve) => setTimeout(resolve, 100));

    userCards[1].vm.$emit("delete-user");

    await new Promise((resolve) => setTimeout(resolve, 100));

    page.findComponent({ name: "BaseModal" }).vm.$emit("confirm");

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(page.findComponent({ name: "BaseModal" }).isVisible()).toBe(false);

    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:8080/v1/administration/users/${mockedUser.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token",
        },
        method: "DELETE",
        mode: "cors",
      }
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(useAdministrationStore().users).toEqual([]);
  });
  test("If user clicks on delete account button it should open the modal, on confirmation it should delete the user and logout", async () => {
    useAuthStore().user = mockedUser;
    useAuthStore().authToken = "token";

    globalThis.fetch = vi.fn().mockResolvedValue(
      createFetchResponse({
        message: "User deleted successfully.",
      })
    );

    useAuthStore().getUser = vi.fn().mockResolvedValue(() => {});

    const page = mount(AdministrationPage, { attachTo: document.body });

    const deleteButton = page.findComponent({ name: "BaseButton" });

    deleteButton.trigger("click");

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(page.findComponent({ name: "BaseModal" }).exists()).toBe(true);

    page.findComponent({ name: "BaseModal" }).vm.$emit("confirm");

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:8080/v1/administration/users/${mockedUser.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token",
        },
        method: "DELETE",
        mode: "cors",
      }
    );

    expect(useAuthStore().user).toEqual({});
    expect(useAuthStore().authToken).toBe("");
    expect(useAdministrationStore().users).toEqual([]);
    expect(useTrailsStore().trails).toEqual([]);
  });
});
