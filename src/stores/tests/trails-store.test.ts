import { setActivePinia, createPinia } from "pinia";
import { useTrailsStore } from "../trails-store";
import { createFetchResponse } from "../../utils/testing-utilites";
import { describe, beforeEach, test, expect, vi } from "vitest";

const mockedTrailResponse = {
  id: "1",
  name: "Test trail",
  location: "Test location",
  path: [
    {
      name: "Test path",
      coordinates: [
        { lat: 1, lng: 1 },
        { lat: 2, lng: 2 },
      ],
    },
  ],
  creator: {
    id: "1",
    email: "creator@mail.com",
    role: "guide",
  },
};

beforeEach(() => {
  setActivePinia(createPinia());
});

describe("Trails Store tests", () => {
  test("getTrails should send fetch request with provided parameters and set the result into the store", async () => {
    const trailsStore = useTrailsStore();
    globalThis.fetch = vi
      .fn()
      .mockResolvedValue(createFetchResponse([mockedTrailResponse]));

    await trailsStore.getTrails({
      creator: 1,
      sort: "location",
      order: "asc",
      search: "Test",
      id: "1",
    });

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/v1/trails?creator=1&sort=location&order=asc&search=Test&id=1&",
      {
        headers: { "Content-Type": "application/json" },
        method: "GET",
        mode: "cors",
      }
    );

    expect(trailsStore.trails).toEqual([mockedTrailResponse]);
  });
});
