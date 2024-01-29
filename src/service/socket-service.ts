import { Socket, io } from "socket.io-client";
import configProvider from "../config/config-provider";
import { User } from "../models/user-model";
import LeafletService from "./leaflet-service";

class SocketService {
  #socket: Socket;
  #leafletService: LeafletService;

  constructor(leafletService: LeafletService) {
    this.#socket = io(`${configProvider.wsServerUrl}/markers`);

    this.#socket.on("error", (error: any) => {
      console.log('err',error);
    });

    this.#socket.on("connect_error", (error: any) => {
      console.log('err',error);
    });

    this.#leafletService = leafletService;

    this.#socket.on("update-location", (users: User[]) => {
      this.#leafletService.updateMarkers(users);
    });
  }

  public destroy() {
    this.#socket.disconnect();
  }
}

export default SocketService;
