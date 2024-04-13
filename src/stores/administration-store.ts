import { defineStore } from "pinia";
import { useAuthStore } from "./auth-store";
import { User } from "../models/user-model";
import administrationService from "../services/administration-service";

export const useAdministrationStore = defineStore("administration", {
  state: () => ({
    users: [] as User[],
  }),
  actions: {
    async getUsers(): Promise<User[] | { message: string }> {
      const response = await administrationService.getAllUsers(
        useAuthStore().authToken
      );
      if (response) {
        this.users = response;
      }
      return response;
    },
    async updateUser(user: User): Promise<User | { message: string }> {
      const response = await administrationService.updateUser(
        user,
        useAuthStore().authToken
      );
      if (response) {
        this.users = this.users?.map((u: User) =>
          u.id === response.id ? response : u
        );
      }
      return response;
    },
    async deleteUser(id: string): Promise<void>{
      const response = await administrationService.deleteUser(id, useAuthStore().authToken);
      if (response.message) {
        this.users = this.users?.filter((u: User) => u.id !== id);
      }
    },
    cleanStore() {
      this.users = [];
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "administration",
        storage: localStorage,
      },
    ],
  },
});
