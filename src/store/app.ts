// Utilities
import { defineStore } from "pinia";

const savedUserStr = localStorage.getItem("user") || "";
let savedUser: any = null;
try {
  savedUser = JSON.parse(savedUserStr);
} catch {
  savedUser = null;
}

export const useAppStore = defineStore("app", {
  state: () => ({
    user: savedUser,
  }),
  actions: {
    setUser(user: any) {
      this.user = user;
    },
  },
});
