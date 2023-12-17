import { ref } from "vue";
import type { Ref } from "vue";
import L, { Marker } from "leaflet";
import { Coordinates } from "../types/coordinates";
import configProvider from "../config/config-provider";
import { User } from "../models/user-model";
import markerIcon from "../assets/icons/marker.svg";
class LeafletService {
  private mapInstance: Ref<any> = ref();
  private markerMapping: Map<number, Marker<any>>;

  constructor(mapDiv: Ref<HTMLElement>, coords: Coordinates) {
    const { tileLayerSource } = configProvider;
    this.mapInstance.value = L.map(mapDiv.value).setView(
      [coords.lat, coords.lng],
      13
    );
    L.tileLayer(tileLayerSource).addTo(this.mapInstance.value);
    this.markerMapping = new Map<number, Marker<any>>();
  }

  public addMarker(user: User) {
    const { coords } = user;
    if (!coords) return;
    const icon = L.icon({
      iconUrl: markerIcon,
      iconSize: [25, 41],
    });
    const marker = L.marker([coords.lat, coords.lng], { icon })
      .addTo(this.mapInstance.value)
      .bindPopup(user.name);
    this.markerMapping.set(user.id, marker);
  }

  public updateMarkers(users: User[]) {
    users.forEach((user) => {
      const { coords } = user;
      console.log("Updating marker for user: ", user);
      if (!coords) return;
      const marker = this.markerMapping.get(user.id);
      console.log("Marker: ", marker);
      if (marker) {
        marker.setLatLng([coords.lat, coords.lng])
        return;
      };
      this.addMarker(user);
    });
  }
}

export default LeafletService;
