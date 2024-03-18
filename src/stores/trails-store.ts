import { defineStore } from "pinia";
import { useAuthStore } from "./auth-store";
import { Trail } from "../models/trail-model";
import trailsService from "../services/trails-service";
import { RequestParameters } from "../types/request-parameter";

export const useTrailsStore = defineStore("trails", {
  state: () => ({
    trails: [] as Trail[],
    authStore: useAuthStore(),
  }),
  actions: {
    async getTrails(params: RequestParameters): Promise<void> {
      const response = await trailsService.getTrails(params, this.authStore.authToken);
      if (response) {
        this.trails = response;
      }
    },
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
