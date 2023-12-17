import { defineStore } from "pinia";
import { User } from "../models/user-model";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: {
      id: 1,
      name: "John Doe",
      coords: {
        lat: 51.505,
        lng: -0.09,
      }
    } as User,
  }),
  actions: {
    // trackLocation() {
    //   try {
    //   } catch (error) {
    //     console.log(error); // need error handling here
    //   }
    // },
  },
});
