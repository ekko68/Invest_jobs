import axios from 'axios'
import { InterceptorsCheck, refreshTimer } from '../consts/SessionCheck'

const AxiosGlobalBiz = axios.create({
  baseURL: process.env.REACT_APP_GLB_API_URL,
  timeout: 300000
})

AxiosGlobalBiz.interceptors.request.use(
  function (config) {
    //
    InterceptorsCheck({ act: 'request', url: config.url })

    //시작
    refreshTimer()

    const token = sessionStorage.getItem('token') === null ? '' : sessionStorage.getItem('token')
    config.headers['Authorization'] = `Bearer ${token}`
    config.headers['Content-Type'] = config?.fileUpload ? 'multipart/form-data' : 'application/json; charset=utf-8'
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

AxiosGlobalBiz.interceptors.response.use(
  (response) => {
    InterceptorsCheck({ act: 'response', url: response.config.url })
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default AxiosGlobalBiz
