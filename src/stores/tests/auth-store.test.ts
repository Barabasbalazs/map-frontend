import { setActivePinia, createPinia } from "pinia";
import { useAuthStore } from "../auth-store";
import { createFetchResponse } from "../../utils/testing-utilites";
import { describe, beforeEach, test, expect, vi } from "vitest";

const userCredentials = { id: 1, email: "test@mail.com", name: "Test" };

beforeEach(() => {
  setActivePinia(createPinia());
});

describe("Auth Store", () => {
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

    await authStore.login({ email: userCredentials.email, password: '123456789'});
  
    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/v1/auth/login", {
      body: JSON.stringify({email: userCredentials.email, password: '123456789'}),
      headers: { "Content-Type": "application/json" },
      method: "POST",
      mode: "cors",
    });
  });
});
