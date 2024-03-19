import { describe, test, expect, vi } from "vitest";
import trailsService from "../trails-service";
import { createFetchResponse } from "../../utils/testing-utilites";

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

describe("Trails-service tests", () => {
  test("Get trails calls the correct endpoint", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      createFetchResponse({
        trails: [],
      })
    );

    await trailsService.getTrails({}, 'token');

    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/v1/trails", {
      headers: { "Content-Type": "application/json", "Authorization": "Bearer token", },
      method: "GET",
      mode: "cors",
    });
  });
  test("Get trails sends request with correct parameters", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      createFetchResponse({
        trails: [mockedTrailResponse],
      })
    );

    await trailsService.getTrails({ creator: 1, sort: "location", order: "asc", search: "Test", id: "1" }, 'token');

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/v1/trails?creator=1&sort=location&order=asc&search=Test&id=1&",
      {
        headers: { "Content-Type": "application/json", "Authorization": "Bearer token", },
        method: "GET",
        mode: "cors",
      }
    );
  });
});
