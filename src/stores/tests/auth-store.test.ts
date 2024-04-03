import { setActivePinia, createPinia } from "pinia";
import { useAuthStore } from "../auth-store";
import { createFetchResponse } from "../../utils/testing-utilites";
import { describe, beforeEach, test, expect, vi } from "vitest";

const userCredentials = { id: "1", email: "test@mail.com", name: "Test" };

beforeEach(() => {
  setActivePinia(createPinia());
});

describe("Auth Store tests", () => {
  test("Logout should clear user and authToken", () => {
    const authStore = useAuthStore();
    authStore.user = userCredentials;
    authStore.authToken = "testToken";
    authStore.logout();

    expect(authStore.user).toEqual({});
    expect(authStore.authToken).toEqual("");
  });
  test("Login should send fetch request with provided credentials", async () => {
    const authStore = useAuthStore();
    globalThis.fetch = vi.fn().mockResolvedValue(
      createFetchResponse({
        user: userCredentials,
        authToken: "testToken",
      })
    );

    await authStore.login({
      email: userCredentials.email,
      password: "123456789",
    });

    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/v1/auth/login", {
      body: JSON.stringify({
        email: userCredentials.email,
        password: "123456789",
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
      mode: "cors",
    });
  });
  test("Register should send fetch request with provided credentials", async () => {
    const authStore = useAuthStore();
    globalThis.fetch = vi.fn().mockResolvedValue(
      createFetchResponse({
        user: userCredentials,
        authToken: "testToken",
      })
    );
    await authStore.register({
      email: userCredentials.email,
      password: "123456789",
      name: userCredentials.name,
    });
    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/v1/auth/signup", {
      body: JSON.stringify({
        email: userCredentials.email,
        password: "123456789",
        name: userCredentials.name,
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
      mode: "cors",
    });
  });
  test("AddtrailsToUser should add trailId to user's trails", () => {
    const authStore = useAuthStore();
    authStore.user = { ...userCredentials, trails: ["1"] };
    authStore.addTrailToUser("2");
    expect(authStore.user.trails).toEqual(["1", "2"]);
  });
  test("RemoveTrailFromUser should remove trailId from user's trails", () => {
    const authStore = useAuthStore();
    authStore.user = { ...userCredentials, trails: ["1", "2"] };
    authStore.removeTrailFromUser("2");
    expect(authStore.user.trails).toEqual(["1"]);
  });
  test("GetUser should send fetch request with user id and authToken", async () => {
    const authStore = useAuthStore();
    authStore.user = userCredentials;
    authStore.authToken = "testToken";
    globalThis.fetch = vi.fn().mockResolvedValue(
      createFetchResponse({
        userCredentials,
      })
    );
    await authStore.getUser();
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/v1/administration/users/1",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer testToken",
        },
        method: "GET",
        mode: "cors",
      }
    );
  });
});
