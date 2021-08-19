import axios from 'axios'

export const apiAddress = 'https://uxcandy.com/~shapoval/test-task-backend/v2'
const developerParam = 'TretyakRoman'

export const commonAxios = axios.create({
  baseURL: apiAddress
})

export const adminAxios = axios.create({
  baseURL: apiAddress
})


function getAccessToken() {
  return window.localStorage.getItem('accessToken')
}

commonAxios.defaults.params = {
  developer: developerParam
}

adminAxios.defaults.params = {
  developer: developerParam
}
adminAxios.interceptors.request.use(config => {
  // const accessToken = getAccessToken()
  // config.headers.Authorization = `Bearer ${accessToken}`
  console.log(config)
  return config
})
