import { ref } from "vue";
import type { Ref } from "vue";
import L, { Marker } from "leaflet";
import { Coordinates } from "../types/coordinates";
import configProvider from "../config/config-provider";
import { User } from "../models/user-model";

class LeafletService {
  private mapInstance: Ref<any> = ref();
  private markerMapping: Map<string, Marker<any>>;

  constructor(mapDiv: Ref<HTMLElement>, coords: Coordinates) {
    const { tileLayerSource } = configProvider;
    this.mapInstance.value = L.map(mapDiv.value).setView(
      [coords.lat, coords.lng],
      13
    );
    L.tileLayer(tileLayerSource).addTo(this.mapInstance.value);
    this.markerMapping = new Map<string, Marker<any>>();
  }

  public addMarker(user: User) {
    const { coords } = user;
    if (!coords) return;
    const marker = L.marker([coords.lat, coords.lng])
      .addTo(this.mapInstance.value)
      .bindPopup(user.name);
    this.markerMapping.set(user.id, marker);
  }

  public updateMarkers(users: User[]) {
    users.forEach((user) => {
      const { coords } = user;
      if (!coords) return;
      const marker = this.markerMapping.get(user.id);
      if (!marker) return;
      marker.setLatLng([coords.lat, coords.lng]);
    });
  }
}

export default LeafletService;