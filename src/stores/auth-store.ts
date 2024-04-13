import { defineStore } from "pinia";
import { User } from "../models/user-model";
import { useTrailsStore } from "./trails-store";
import { useAdministrationStore } from "./administration-store";
import authService from "../services/auth-service";
import administrationService from "../services/administration-service";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: {} as Partial<User>,
    authToken: "" as string,
  }),
  actions: {
    async login(
      user: Partial<User>
    ): Promise<Partial<User> | { message: string } | null> {
      const response = await authService.login(user.email, user.password);
      if (response?.user && response.authToken) {
        this.user = response.user;
        this.authToken = response.authToken;
        return this.user;
      }
      return response || null;
    },
    async logout() {
      this.user = {} as User;
      this.authToken = "";
      useTrailsStore().cleanStore();
      useAdministrationStore().cleanStore();
    },
    async register(
      user: Partial<User>
    ): Promise<Partial<User> | { message: string } | null> {
      const response = await authService.register(user);
      if (response?.user && response.authToken) {
        this.user = response.user;
        this.authToken = response.authToken;
        return this.user;
      }
      return response || null;
    },
    async getUser(): Promise<Partial<User> | null> {
      const response = await administrationService.getUser(
        this.user.id,
        this.authToken
      );

      if ("message" in response && response.message) {
        return null;
      }
      this.user = response;
      return (response as Partial<User>) || null;
    },
    async updateUser(user: Partial<User>): Promise<Partial<User> | null> {
      const response = await administrationService.updateUser(
        user,
        this.authToken
      );
      if (user) {
        this.user = response;
      }
      return response;
    },
    addTrailToUser(trailId: string) {
      this.user.trails.push(trailId);
    },
    removeTrailFromUser(trailId: string) {
      this.user.trails = this.user.trails.filter(
        (id: string) => id !== trailId
      );
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "auth",
        storage: localStorage,
      },
    ],
  },
});
