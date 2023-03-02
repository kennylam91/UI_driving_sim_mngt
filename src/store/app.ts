// Utilities
import { defineStore } from 'pinia'

const savedUserStr = localStorage.getItem('user') || ''
const savedUser = JSON.parse(savedUserStr)

export const useAppStore = defineStore('app', {
  state: () => ({
    user: savedUser
  }),
  actions: {
    setUser(user: any) {
      this.user = user
    }
  }
})
