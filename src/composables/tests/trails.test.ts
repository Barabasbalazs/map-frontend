import { useTrails } from "../trails";
import { createFetchResponse } from "../../utils/testing-utilites";
import { useAuthStore } from "../../stores/auth-store";
import { setActivePinia, createPinia } from "pinia";
import { describe, test, expect, vi, beforeEach } from "vitest";

beforeEach(() => {
  setActivePinia(createPinia());
});

describe("UseTrails composable", () => {
  test("After setting the modal to open, if delete function is called, it should send a delete request", async () => {
    useAuthStore().authToken = "token";
    globalThis.fetch = vi.fn().mockResolvedValue(createFetchResponse({}));
    const { isLoading, deleteTrail, isModalOpen, openDeleteModal } =
      useTrails();
    openDeleteModal("1");
    expect(isModalOpen.value).toBe(true);
    await deleteTrail();
    expect(isLoading.value).toBe(false);
    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/v1/trails/1", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token",
      },
      method: "DELETE",
      mode: "cors",
    });
  });
});
