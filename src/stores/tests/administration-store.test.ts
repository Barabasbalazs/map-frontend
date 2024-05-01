import { setActivePinia, createPinia } from "pinia";
import { useAdministrationStore } from "../administration-store";
import { useAuthStore } from "../auth-store";
import { createFetchResponse } from "../../utils/testing-utilites";
import { describe, beforeEach, test, expect, vi } from "vitest";

const userCredentials = { id: "1", email: "test@mail.com", name: "Test" };

beforeEach(() => {
  setActivePinia(createPinia());
  useAuthStore().authToken = "testToken";
});

describe("Administration Store", () => {
  test("Update user should call correct endpoint with correct payload ", async () => {
    useAdministrationStore().users = [{ ...userCredentials, role: "admin" }];

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

    expect(useAdministrationStore().users).toEqual([{ ...userCredentials, role: "admin" }]);
  });

  test("Respond to admin request should call correct endpoint with correct payload, and remove user if accepted", async () => {
    useAdministrationStore().users = [{ ...userCredentials, role: "user" }];
    useAdministrationStore().adminRequests = [
      { id: "1", user: userCredentials },
    ];

    globalThis.fetch = vi
      .fn()
      .mockResolvedValue(createFetchResponse({ accepted: true }));

    await useAdministrationStore().respondToAdminRequest(
      { id: "1", user: userCredentials },
      true
    );

    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:8080/v1/admin-requests/1`,
      {
        body: JSON.stringify({
          accepted: true,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer testToken",
        },
        method: "PATCH",
        mode: "cors",
      }
    );

    expect(useAdministrationStore().users).toEqual([{ ...userCredentials, role: "admin" }]);
    expect(useAdministrationStore().adminRequests).toEqual([]);
  });
  test("Get admin requests should call correct endpoint and set the data into the store", async () => {
    const adminRequests = [{ id: "1", user: userCredentials }];

    globalThis.fetch = vi
      .fn()
      .mockResolvedValue(createFetchResponse(adminRequests));

    await useAdministrationStore().getAdminRequests();

    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:8080/v1/admin-requests`,
      {
        headers: {
          Authorization: "Bearer testToken",
          "Content-Type": "application/json",
        },
        method: "GET",
        mode: "cors",
      }
    );

    expect(useAdministrationStore().adminRequests).toEqual(adminRequests);
  });
});
