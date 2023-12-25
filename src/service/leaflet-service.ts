import { ref } from "vue";
import type { Ref } from "vue";
import L, { Marker, TileLayer } from "leaflet";
import { Coordinates } from "../types/coordinates";
import { User } from "../models/user-model";
import markerIcon from "../assets/icons/marker.svg";
import tileLayers from "../constants/tilelayers";
class LeafletService {
  private mapInstance: Ref<any> = ref();
  private markerMapping: Map<number, Marker<any>>;
  private tileLayers: Array<TileLayer>;

  constructor(mapDiv: Ref<HTMLElement>, coords: Coordinates) {
    this.tileLayers = tileLayers.map(({ source }) =>
      L.tileLayer(source, { maxZoom: 19 })
    );

    this.mapInstance.value = L.map(mapDiv.value, {
      layers: this.tileLayers,
    }).setView([coords.lat, coords.lng], 13);

    const layerControl = L.control
      .layers(
        Object.fromEntries(
          tileLayers.map(({ name }, index) => [name, this.tileLayers[index]])
        ),
        {},
        { position: "bottomright" }
      )
      .addTo(this.mapInstance.value);

    //css classes for styling the control buttons  
    L.DomUtil.addClass(layerControl.getContainer(), "control-layer");
    L.DomUtil.addClass(this.mapInstance.value.zoomControl.getContainer(), "control-zoom");

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
      .bindPopup(user.name, { offset: [0, -7], className: "marker-popup" });
    this.markerMapping.set(user.id, marker);
  }

  public updateMarkers(users: User[]) {
    users.forEach((user) => {
      const { coords } = user;
      if (!coords) return;
      const marker = this.markerMapping.get(user.id);
      if (marker) {
        marker.setLatLng([coords.lat, coords.lng]);
        return;
      }
      this.addMarker(user);
    });
  }
}

export default LeafletService;
