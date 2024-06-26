import { setActivePinia, createPinia } from "pinia";
import { useTrailsStore } from "../trails-store";
import { useAuthStore } from "../auth-store";
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
  /*
  creator: {
    id: "1",
    email: "creator@mail.com",
    role: "guide",
    name: "Guide",
  },
  */
};

const typeSafeTrail = {
  ...mockedTrailResponse,
  path: mockedTrailResponse.path.map((segment) => ({
    ...segment,
    coordinates: segment.coordinates[0], // Assuming there is only one set of coordinates
  })),
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
  test("Subcscribeto trail should send fetch request with provided trailId and authToken", async () => {
    const trailsStore = useTrailsStore();
    const authStore = useAuthStore();
    authStore.authToken = "authToken";
    authStore.user = { id: "1", email: "mail@mail.com", trails: [] };
    globalThis.fetch = vi
      .fn()
      .mockResolvedValue(createFetchResponse([mockedTrailResponse]));

    await trailsStore.subscribeToTrail("1");

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/v1/trails/1/subscribe",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer authToken",
        },
        body: JSON.stringify({ id: "1" }),
        method: "PATCH",
        mode: "cors",
      }
    );
  });
  test("Unsubscribe from trail should send fetch request with provided trailId and authToken", async () => {
    const trailsStore = useTrailsStore();
    const authStore = useAuthStore();
    authStore.authToken = "authToken";
    authStore.user = { id: "1", email: "mmm@mail.com", trails: ["1"] };
    globalThis.fetch = vi
      .fn()
      .mockResolvedValue(createFetchResponse([mockedTrailResponse]));

    await trailsStore.unsubscribeFromTrail("1");

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/v1/trails/1/unsubscribe",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer authToken",
        },

        mode: "cors",
      }
    );
  });
  test("Delete trail should send fetch request with provided trailId and authToken and remove the trail from store", async () => {
    const trailsStore = useTrailsStore();
    const authStore = useAuthStore();

    trailsStore.trails = [
      {
        ...mockedTrailResponse,
        path: mockedTrailResponse.path.map((segment) => ({
          ...segment,
          coordinates: segment.coordinates[0], // Assuming there is only one set of coordinates
        })),
      },
    ];
    authStore.authToken = "authToken";
    globalThis.fetch = vi
      .fn()
      .mockResolvedValue(createFetchResponse([mockedTrailResponse]));

    await trailsStore.deleteTrail("1");

    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/v1/trails/1", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer authToken",
      },
      mode: "cors",
    });
    expect(trailsStore.trails).toEqual([]);
  });
  test("Delete trail should remove the trail from created trails if the corresponding parameter is passed", async () => {
    const trailsStore = useTrailsStore();
    const authStore = useAuthStore();

    trailsStore.trails = [typeSafeTrail];
    trailsStore.createdTrails = trailsStore.trails;
    authStore.authToken = "authToken";

    globalThis.fetch = vi
      .fn()
      .mockResolvedValue(createFetchResponse([mockedTrailResponse]));

    await trailsStore.deleteTrail("1", true);

    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/v1/trails/1", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer authToken",
      },
      mode: "cors",
    });
    expect(trailsStore.trails).toEqual([]);
    expect(trailsStore.createdTrails).toEqual([]);
  });
  test("Update trail should send fetch request with data, and update the stored trail", async () => {
    const trailsStore = useTrailsStore();
    const authStore = useAuthStore();

    trailsStore.trails = [typeSafeTrail];
    authStore.authToken = "authToken";

    const changedName = "Changed name";

    globalThis.fetch = vi
      .fn()
      .mockResolvedValue(
        createFetchResponse({ ...mockedTrailResponse, name: changedName })
      );

    await trailsStore.updateTrail(typeSafeTrail);

    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/v1/trails/1", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer authToken",
      },
      mode: "cors",
      body: JSON.stringify(typeSafeTrail),
    });

    expect(trailsStore.trails?.[0].name).toEqual(changedName);
  });
  test("Create trail calls correct endpoint and sets it in the created trails", async () => {
    const trailsStore = useTrailsStore();
    const authStore = useAuthStore();

    authStore.authToken = "authToken";

    globalThis.fetch = vi
      .fn()
      .mockResolvedValue(createFetchResponse(mockedTrailResponse));

    await trailsStore.createTrail(typeSafeTrail);

    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/v1/trails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer authToken",
      },
      mode: "cors",
      body: JSON.stringify(typeSafeTrail),
    });

    expect(trailsStore.createdTrails).toEqual([mockedTrailResponse]);
  });
  test("GetSubscribed trails calls correct endpoint and sets it in the subscribed trails", async () => {
    const trailsStore = useTrailsStore();
    const authStore = useAuthStore();

    authStore.authToken = "authToken";

    globalThis.fetch = vi
      .fn()
      .mockResolvedValue(createFetchResponse([mockedTrailResponse]));

    await trailsStore.getSubscribedTrails();

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/v1/trails/subscribed",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer authToken",
        },
        mode: "cors",
      }
    );

    expect(trailsStore.subscribedTrails).toEqual([mockedTrailResponse]);
  });
  test("GetCreated trails calls correct endpoint and sets it in the created trails", async () => {
    const trailsStore = useTrailsStore();
    const authStore = useAuthStore();

    authStore.authToken = "authToken";

    globalThis.fetch = vi
      .fn()
      .mockResolvedValue(createFetchResponse([mockedTrailResponse]));

    await trailsStore.getCreatedTrails();

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/v1/trails/my-trails",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer authToken",
        },
        mode: "cors",
      }
    );

    expect(trailsStore.createdTrails).toEqual([mockedTrailResponse]);
  });
});
