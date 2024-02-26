import { setActivePinia, createPinia } from "pinia";
import { useAuthStore } from "../auth-store";
import { describe, beforeEach, test, expect } from "vitest";

beforeEach(() => {
  setActivePinia(createPinia());
});

describe("Auth Store", () => {
  test("Logout should clear user and authToken", () => {
    const authStore = useAuthStore();
    authStore.user = { id: 1, email: "test@mail.com", name: "Test" };
    authStore.authToken = "testToken";
    authStore.logout();

    expect(authStore.user).toEqual({});
    expect(authStore.authToken).toEqual("");
  });
});
