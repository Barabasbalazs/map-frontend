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
  #markerMapping: Map<string, Marker<any>>;
  #tileLayers: Array<TileLayer>;

  public getMarkerMapping() {
    return this.#markerMapping;
  }

  public initializeMap(
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

    this.#markerMapping = new Map<string, Marker<any>>();

    if (path) {
      path.forEach((point, index) => {
        this.#addDisplayMarker(index.toString(), point.coordinates, point.name);
      });
    }

    this.#mapInstance.value.on("click", (e: any) => {
      if (editable) {
        this.#addDisplayMarker(
          this.#markerMapping.size.toString(),
          e.latlng,
          "Just added"
        );
      }
    });
  }

  constructor(
    mapDiv: Ref<HTMLElement>,
    coords: Coordinates,
    editable?: boolean,
    path?: PathPoint[]
  ) {
    this.initializeMap(mapDiv, coords, editable, path);
  }

  public destroyMap() {
    this.#mapInstance.value.remove();
  }

  #addDisplayMarker(
    id: string,
    coords: Coordinates,
    popupContent: string,
    isColored = false
  ) {
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
    if (isColored) {
      (marker as any)._icon.style.filter = `hue-rotate(${Math.floor(
        Math.random() * (360 - 10) + 10
      )}deg)`;
    }
    this.#markerMapping.set(id, marker);
  }

  public addUserMarker(user: User) {
    const { coords } = user;
    if (!coords) return;
    this.#addDisplayMarker(user.name, coords, user.name, true);
  }

  public updateUserMarkers(users: User[]) {
    users.forEach((user) => {
      const { coords } = user;
      if (!coords) return;
      const marker = this.#markerMapping.get(user.name);
      if (marker) {
        marker.setLatLng([coords.lat, coords.lng]);
        return;
      }
      this.addUserMarker(user);
    });
  }
}

export default LeafletService;
