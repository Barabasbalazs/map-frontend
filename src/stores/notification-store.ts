import { defineStore } from "pinia";

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    isDisplayed: false,
    message: "",
    warning: true,
    title: "Error",
  }),
  actions: {
    displayNotification(title: string, message: string, warning = true): void {
      this.title = title;
      this.message = message;
      this.warning = warning;
      this.isDisplayed = true;
    },
    hideNotification(): void {
      this.isDisplayed = false;
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "notifications",
        storage: localStorage,
      },
    ],
  },
});
