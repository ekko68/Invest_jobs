import axios from 'axios'
import { InterceptorsCheck, refreshTimer } from '../consts/SessionCheck'

const AxiosAdmin = axios.create({
  baseURL: process.env.REACT_APP_ADM_API_URL,
  timeout: 300000
})

AxiosAdmin.interceptors.request.use(
  function (config) {
    //
    InterceptorsCheck({ act: 'request', url: config.url })

    //시작
    refreshTimer()

    const token = sessionStorage.getItem('token') === null ? '' : sessionStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    config.headers['Content-Type'] = config?.fileUpload ? 'multipart/form-data' : 'application/json; charset=utf-8'
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

AxiosAdmin.interceptors.response.use(
  (response) => {
    InterceptorsCheck({ act: 'response', url: response.config.url })
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default AxiosAdmin
