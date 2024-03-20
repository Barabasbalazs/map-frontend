import { Socket, io } from "socket.io-client";
import configProvider from "../config/config-provider";
import { User } from "../models/user-model";
import LeafletService from "./leaflet-service";

class SocketService {
  #socket: Socket;
  #leafletService: LeafletService;
  #isConnectionError: boolean;

  public getConnectionError() {
    return this.#isConnectionError;
  }

  public setUpSocket() {
    this.#socket = io(`${configProvider.wsServerUrl}/markers`, {
      reconnection: false,
    });

    this.#socket.on("connect", () => {
      this.#isConnectionError = false;
    });

    this.#socket.on("error", () => {
      this.#isConnectionError = true;
    });

    this.#socket.on("connect_error", () => {
      this.#isConnectionError = true;
    });

    this.#socket.on("update-location", (users: User[]) => {
      this.#leafletService.updateUserMarkers(users);
    });

    this.#socket.on("disconnect", () => {
      this.#isConnectionError = true;
    });
  }

  constructor(leafletService: LeafletService) {
    this.#leafletService = leafletService;
    this.setUpSocket();
  }

  public destroy() {
    this.#socket.disconnect();
  }
}

export default SocketService;
