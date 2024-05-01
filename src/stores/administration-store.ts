import { defineStore } from "pinia";
import { useAuthStore } from "./auth-store";
import { User } from "../models/user-model";
import { AdminRequest } from "../models/admin-request";
import administrationService from "../services/administration-service";
import adminRequestService from "../services/admin-request-service";

export const useAdministrationStore = defineStore("administration", {
  state: () => ({
    users: [] as User[],
    adminRequests: [] as AdminRequest[],
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

      this.users = this.users?.map((u: User) =>
        u.id === response.id ? response : u
      );

      return response;
    },
    async deleteUser(id: string): Promise<void> {
      const response = await administrationService.deleteUser(
        id,
        useAuthStore().authToken
      );
      if (response.message) {
        this.users = this.users?.filter((u: User) => u.id !== id);
      }
    },
    async getAdminRequests(): Promise<AdminRequest[] | { message: string }> {
      const response = await adminRequestService.getAdminRequests(
        useAuthStore().authToken
      );
      if (response) {
        this.adminRequests = response;
      }
      return response;
    },
    async respondToAdminRequest(adminRequest: AdminRequest, accepted: boolean) {
      const response = await adminRequestService.respondToAdminRequest(
        adminRequest.id,
        accepted,
        useAuthStore().authToken
      );
      if (response) {
        this.adminRequests = this.adminRequests?.filter(
          (r: AdminRequest) => r.id !== adminRequest.id
        );
        if (response.accepted) {
          this.users = this.users.map((u: User) => {
            if (u.id === adminRequest.user?.id) {
              u.role = "admin";
            }
            return u;
          });
        }
      }
    },
    cleanStore() {
      this.users = [];
      this.adminRequests = [];
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
