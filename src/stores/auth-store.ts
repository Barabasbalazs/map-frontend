import { defineStore } from "pinia";
import { User } from "../models/user-model";
import { authService } from "../services/auth-service";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: {} as Partial<User>,
    authToken: "" as string,
  }),
  actions: {
    async login(user: Partial<User>): Promise<Partial<User> | null> {
      const response = await authService.login(user.email, user.password);
      if (response) {
        this.user = response.user;
        this.authToken = response.authToken;
        return this.user;
      }
      return null;
    },
    async logout() {
      this.user = {} as User;
      this.authToken = "";
    },
    async register(user: Partial<User>): Promise<Partial<User> | null> {
      const response = await authService.register(user);
      if (response) {
        this.user = response.user;
        this.authToken = response.authToken;
        return this.user;
      }
      return null;
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
