import { defineStore } from "pinia";
import { useAuthStore } from "./auth-store";
import { Trail } from "../models/trail-model";
import trailsService from "../services/trails-service";
import { RequestParameters } from "../types/request-parameter";

export const useTrailsStore = defineStore("trails", {
  state: () => ({
    trails: [] as Trail[],
  }),
  actions: {
    async getTrails(params: RequestParameters): Promise<Trail[] | void> {
      const response = await trailsService.getTrails(
        params,
        useAuthStore().authToken
      );
      if (response) {
        this.trails = response;
      }
      return response;
    },
    cleanStore() {
      this.trails = [];
    },
    async subscribeToTrail(trailId: string): Promise<Trail | void> {
      const response = await trailsService.subscribeToTrail(
        trailId,
        useAuthStore().authToken
      );
      if (response) {
        useAuthStore().addTrailToUser(trailId);
      }
      return response;
    },
    async unsubscribeFromTrail(trailId: string): Promise<Trail | void> {
      const response = await trailsService.unsubscribeFromTrail(
        trailId,
        useAuthStore().authToken
      );
      if (response) {
        useAuthStore().removeTrailFromUser(trailId);
      }
      return response;
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "trails",
        storage: localStorage,
      },
    ],
  },
});
