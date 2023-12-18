import { Socket, io } from "socket.io-client";
import configProvider from "../config/config-provider";
import { User } from "../models/user-model";
import LeafletService from "./leaflet-service";
import { useUserStore } from "../stores/user";

class SocketService {
  private socket: Socket;
  private leafletService: LeafletService;
  private userStore = useUserStore();

  constructor(leafletService: LeafletService) {
    this.socket = io(`${configProvider.wsServerUrl}/markers`);

    this.leafletService = leafletService;

    this.socket.on("update-location", (users: User[]) => {
      console.log("Updating markers:");
      this.leafletService.updateMarkers(users);
    });
  }

  public setUserToTrack() {
    this.socket.emit("track", this.userStore.user.id);
  }
}

export default SocketService;
