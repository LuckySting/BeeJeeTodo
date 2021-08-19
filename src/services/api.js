import axios from 'axios'

export const apiAddress = 'https://uxcandy.com/~shapoval/test-task-backend/v2?developer=TretyakRoman'

export const commonAxios = axios.create({
  baseURL: apiAddress
})

export const adminAxios = axios.create({
  baseURL: apiAddress
})


function getAccessToken() {
  return window.localStorage.getItem('accessToken')
}

adminAxios.interceptors.request.use(async config => {
  const accessToken = getAccessToken()
  config.headers.Authorization = `Bearer ${accessToken}`
  return config
})
