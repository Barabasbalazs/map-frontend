import { ref } from "vue";
import type { Ref } from "vue";
import L, { Marker, TileLayer } from "leaflet";
import { Coordinates } from "../types/coordinates";
import { User } from "../models/user-model";
import { PathPoint } from "../models/trail-model";
import markerIcon from "../assets/icons/marker.svg";
import tileLayers from "../constants/tilelayers";
class LeafletService {
  #mapInstance: Ref<any> = ref();
  #markerMapping: Map<number, Marker<any>>;
  #tileLayers: Array<TileLayer>;

  public getMarkerMapping() {
    return this.#markerMapping;
  }

  constructor(
    mapDiv: Ref<HTMLElement>,
    coords: Coordinates,
    editable?: boolean,
    path?: PathPoint[]
  ) {
    this.#tileLayers = tileLayers.map(({ source }) =>
      L.tileLayer(source, { maxZoom: 19 })
    );

    this.#mapInstance.value = L.map(mapDiv.value, {
      layers: this.#tileLayers,
      //dragging: !L.Browser.mobile,
      //tap: !L.Browser.mobile
    }).setView([coords.lat, coords.lng], path?.length || editable ? 7 : 13);

    const layerControl = L.control
      .layers(
        Object.fromEntries(
          tileLayers.map(({ name }, index) => [name, this.#tileLayers[index]])
        ),
        {},
        { position: "bottomright" }
      )
      .addTo(this.#mapInstance.value);

    //css classes for styling the control buttons
    L.DomUtil.addClass(layerControl.getContainer(), "control-layer");
    L.DomUtil.addClass(
      this.#mapInstance.value.zoomControl.getContainer(),
      "control-zoom"
    );

    this.#markerMapping = new Map<number, Marker<any>>();

    if (path) {
      path.forEach((point, index) => {
        this.#addDisplayMarker(index, point.coordinates, point.name);
      });
    }

    this.#mapInstance.value.on("click", (e: any) => {
      if (editable) {
        this.#addDisplayMarker(
          this.#markerMapping.size,
          e.latlng,
          "Just added"
        );
      }
    });
  }

  #addDisplayMarker(id: number, coords: Coordinates, popupContent: string) {
    const icon = L.icon({
      iconUrl: markerIcon,
      iconSize: [25, 41],
    });
    const marker = L.marker([coords.lat, coords.lng], { icon })
      .addTo(this.#mapInstance.value)
      .bindPopup(popupContent, {
        offset: [0, -7],
        className: "marker-popup",
      });
    this.#markerMapping.set(id, marker);
  }

  public addUserMarker(user: User) {
    const { coords } = user;
    if (!coords) return;
    this.#addDisplayMarker(user.id, coords, user.name);
  }

  public updateUserMarkers(users: User[]) {
    users.forEach((user) => {
      const { coords } = user;
      if (!coords) return;
      const marker = this.#markerMapping.get(user.id);
      if (marker) {
        marker.setLatLng([coords.lat, coords.lng]);
        return;
      }
      this.addUserMarker(user);
    });
  }
}

export default LeafletService;
