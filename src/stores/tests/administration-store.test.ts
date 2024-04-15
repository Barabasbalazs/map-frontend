import { setActivePinia, createPinia } from "pinia";
import { useAdministrationStore } from "../administration-store";
import { useAuthStore } from "../auth-store";
import { createFetchResponse } from "../../utils/testing-utilites";
import { describe, beforeEach, test, expect, vi } from "vitest";

const userCredentials = { id: "1", email: "test@mail.com", name: "Test" };

beforeEach(() => {
  setActivePinia(createPinia());
});
describe("Administration Store", () => {
  test("Administration Store ", async () => {
    useAdministrationStore().users = [{ ...userCredentials, role: "admin" }];
    useAuthStore().authToken = "testToken";

    globalThis.fetch = vi
      .fn()
      .mockResolvedValue(
        createFetchResponse({ ...userCredentials, role: "admin" })
      );

    await useAdministrationStore().updateUser({
      ...userCredentials,
      role: "admin",
    });

    await new Promise((r) => setTimeout(r, 100));

    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:8080/v1/administration/users/${userCredentials.id}`,
      {
        body: JSON.stringify({
          ...userCredentials,
          role: "admin",
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer testToken",
        },
        method: "PATCH",
        mode: "cors",
      }
    );

    expect(useAdministrationStore().users).toEqual([]);
  });
});
