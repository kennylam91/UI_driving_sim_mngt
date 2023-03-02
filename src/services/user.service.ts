import { BASE_API_URL } from '@/common/const'
import axios from 'axios'
export const login = (user: any) => {
   return axios.post(`${BASE_API_URL}/login`, user)
}

export const register = (user: any) => {
   return axios.post(`${BASE_API_URL}/users`, user)
}