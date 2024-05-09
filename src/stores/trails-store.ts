import { defineStore } from "pinia";
import { useAuthStore } from "./auth-store";
import { Trail } from "../models/trail-model";
import trailsService from "../services/trails-service";
import { RequestParameters } from "../types/request-parameter";

export const useTrailsStore = defineStore("trails", {
  state: () => ({
    trails: [] as Trail[],
    subscribedTrails: [] as Trail[],
    createdTrails: [] as Trail[],
    trail: {} as Trail,
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
    async updateTrail(trail: Trail): Promise<Trail | void> {
      const response = await trailsService.updateTrail(
        trail,
        useAuthStore().authToken
      );
      if (response) {
        this.trails = this.trails.map((t: Trail) =>
          (t.id || t._id) === (trail.id || trail._id) ? response : t
        );
      }
      return response;
    },
    async deleteTrail(
      trailId: string,
      isCreatedTrail = false
    ): Promise<Trail | void> {
      const response = await trailsService.deleteTrail(
        trailId,
        useAuthStore().authToken
      );
      if (response) {
        if (isCreatedTrail) {
          this.createdTrails = this.createdTrails.filter(
            (trail: Trail) => (trail.id || trail._id) !== trailId
          );
        }
        this.trails = this.trails.filter(
          (trail: Trail) => (trail.id || trail._id) !== trailId
        );
      }
      return response;
    },
    async createTrail(trail: Trail): Promise<Trail | void> {
      const response = await trailsService.createTrail(
        trail,
        useAuthStore().authToken
      );
      if (response) {
        this.createdTrails = [...this.createdTrails, response];
      }
      return response;
    },
    async getSubscribedTrails(): Promise<Trail[] | void> {
      const response = await trailsService.getSubscribedTrails(
        useAuthStore().authToken
      );
      if (response) {
        this.subscribedTrails = response;
      }
      return response;
    },
    async getCreatedTrails(): Promise<Trail[] | void> {
      const response = await trailsService.getCreatedTrails(
        useAuthStore().authToken
      );
      if (response) {
        this.createdTrails = response;
      }
      return response;
    },
    async subscribeToTrail(trailId: string): Promise<Trail | void> {
      const response = await trailsService.subscribeToTrail(
        trailId,
        useAuthStore().authToken
      );
      if (response) {
        useAuthStore().addTrailToUser(trailId);
        this.subscribedTrails = [...this.subscribedTrails, response];
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
        this.subscribedTrails = this.subscribedTrails.filter(
          (trail: Trail) => (trail.id || trail._id) !== trailId
        );
      }
      return response;
    },
    async getTrail(trailId: string): Promise<Trail | void> {
      const response = await trailsService.getTrail(
        trailId,
        useAuthStore().authToken
      );
      if (response) {
        this.trail = response;
      }
      return response;
    },
    cleanStore() {
      this.trails = [];
      this.subscribedTrails = [];
      this.createdTrails = [];
      this.trail = {} as Trail;
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
