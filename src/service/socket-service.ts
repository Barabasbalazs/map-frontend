import { Socket, io } from "socket.io-client";
import configProvider from "../config/config-provider";
import { User } from "../models/user-model";
import LeafletService from "./leaflet-service";

class SocketService {
  private socket: Socket;
  private leafletService: LeafletService;

  constructor(leafletService: LeafletService) {
    this.socket = io(`${configProvider.wsServerUrl}/markers`);

    this.leafletService = leafletService;

    this.socket.on("update-location", (users: User[]) => {
      this.leafletService.updateMarkers(users);
    });
  }
}

export default SocketService;
