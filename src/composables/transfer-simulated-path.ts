import configProvider from "../config/config-provider";
import { User } from "../models/user-model";
import { Coordinates } from "../types/coordinates";
import { useInterval } from "@vueuse/core";
import { io } from "socket.io-client";
import type { Ref } from "vue";
import { ref } from "vue";

export function useTransferSimulatedPath(
  props: {
    path: Coordinates[];
    user: User;
  },
  emit: {
    (e: "finishedBroadcast"): void;
  },
  pathOfUser: Ref<Coordinates[]>,
  interval: Ref<number>,
  isNoConnection: Ref<boolean>
) {
  const inputError = ref();

  const socket = ref();

  const isModalOpen = ref(false);

  const isBroadcasting = ref(false);

  function setupSocket() {
    socket.value = io(`${configProvider.wsServerUrl}/updates`, {
      reconnection: false,
    });
    socket.value.on("connect", () => {
      isNoConnection.value = false;
    });
    socket.value.on("connect_error", () => {
      isNoConnection.value = true;
      isModalOpen.value = true;
    });
    socket.value.on("error", () => {
      isNoConnection.value = true;
      isModalOpen.value = true;
    })
  }

  function startSendingProcess() {
    inputError.value = "";

    if (interval.value <= 0) {
      inputError.value = "Interval must be greater than 0";
      return;
    }

    if (isNoConnection.value) {
      setupSocket();
      return;
    }

    isBroadcasting.value = true;

    const { pause } = useInterval(interval.value * 1000, {
      callback: () => {
        if (pathOfUser.value.length === 0) {
            try {
          socket.value.disconnect();
            } catch (e) {}
          pause();
          emit("finishedBroadcast");
        }
        try {
          socket.value.emit("update-location", [
            {
              id: props.user.id,
              name: props.user.name,
              coords: pathOfUser.value[0],
            },
          ]);
        } catch (e) {}
        pathOfUser.value.shift();
      },
      controls: true,
    });
  }

  return {
    inputError,
    isModalOpen,
    isBroadcasting,
    startSendingProcess,
    socket,
    setupSocket
  };
}
