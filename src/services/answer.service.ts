import { BASE_API_URL } from '@/common/const'
import axios from 'axios'
export const getAnswers = (username: string) => {
  return axios.get(`${BASE_API_URL}/answers/${username}`)
}

export const addAnswers = (answers: Array<any>) => {
  return axios.post(`${BASE_API_URL}/answers`, answers)
}