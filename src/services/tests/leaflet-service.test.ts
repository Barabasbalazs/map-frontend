import LeafletService from "../leaflet-service";
import { describe, test, expect } from "vitest";
import { ref } from "vue";

describe("LeafletService tests", () => {
  test("Creates an instance of LeafletService", () => {
    const mapDiv = ref(document.createElement("div"));
    const coords = { lat: 51.505, lng: -0.09 };
    const leafletService = new LeafletService(mapDiv, coords);

    expect(leafletService).toBeDefined();
  });

  test("Adds a marker to the map", () => {
    const mapDiv = ref(document.createElement("div"));
    const coords = { lat: 51.505, lng: -0.09 };
    const user = { id: "1", name: "John Doe", coords, email: "ttt@mail.com" };
    const leafletService = new LeafletService(mapDiv, coords);

    leafletService.addUserMarker(user);

    const marker = leafletService.getMarkerMapping().get(user.name);

    expect(marker).toBeDefined();
    expect(marker.getLatLng().lat).toBe(coords.lat);
    expect(marker.getLatLng().lng).toBe(coords.lng);
  });

  test("Updates markers on the map", () => {
    const mapDiv = ref(document.createElement("div"));
    const coords = { lat: 51.505, lng: -0.09 };
    const user1 = { id: "1", name: "John Doe", coords, email: "tt2@mail.com" };
    const user2 = { id: "2", name: "Jane Doe", coords: { lat: 52.0, lng: -0.1 }, email: "rr@mail.com" };

    const leafletService = new LeafletService(mapDiv, coords);

    leafletService.addUserMarker(user1);

    // Update markers with a new user list
    leafletService.updateUserMarkers([user1, user2]);

    const marker1 = leafletService.getMarkerMapping().get(user1.name);
    const marker2 = leafletService.getMarkerMapping().get(user2.name);

    // Check that the first marker has been updated and the second one has been added
    expect(marker1).toBeDefined();
    expect(marker1.getLatLng().lat).toBe(user1.coords.lat);

    expect(marker2).toBeDefined();
    expect(marker2.getLatLng().lat).toBe(user2.coords.lat);
  });
});
