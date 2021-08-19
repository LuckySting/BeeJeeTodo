import axios from 'axios'

export const apiAddress = 'https://uxcandy.com/~shapoval/test-task-backend/v2'
const developerParam = 'TretyakRoman3'

export const commonAxios = axios.create({
  baseURL: apiAddress
})

export const adminAxios = axios.create({
  baseURL: apiAddress
})

export function checkToken() {
  return !!getAccessToken()
}

function setAccessToken(accessToken) {
  if (accessToken) {
    window.localStorage.setItem('accessToken', accessToken)
  } else {
    window.localStorage.removeItem('accessToken')
  }
}

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
  const accessToken = getAccessToken()
  config.data.append('token', accessToken)
  config.headers['Content-Type'] = 'multipart/form-data'
  return config
})

export async function login(username, password) {
  const formData = new FormData()
  formData.append('username', username)
  formData.append('password', password)
  const response = await commonAxios.post('/login', formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
  if (response.data.status !== 'ok' || !('message' in response.data)) {
    throw Error
  }
  setAccessToken(response.data.message.token)
}

export function logout() {
  setAccessToken(null)
}