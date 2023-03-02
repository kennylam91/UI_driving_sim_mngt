import axios from 'axios'
export const login = (user: any) => {
   return axios.post('https://ej7sgrs4h5.execute-api.ap-southeast-1.amazonaws.com/test/login', user)
}