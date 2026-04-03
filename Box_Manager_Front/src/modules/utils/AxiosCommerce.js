import axios from 'axios'
import { InterceptorsCheck, refreshTimer } from '../consts/SessionCheck'
const AxiosCommerce = axios.create({
  baseURL: process.env.REACT_APP_MKT_API_URL,
  timeout: 300000
})

AxiosCommerce.interceptors.request.use(
  function (config) {
    InterceptorsCheck({ act: 'request', url: config.url, loading: config.loading, method: config.method })

    //시작
    refreshTimer()

    const token = sessionStorage.getItem('token') === null ? '' : sessionStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
      config.headers['AuthType'] = `ADMIN`
    }
    config.headers['Content-Type'] = config?.fileUpload ? 'multipart/form-data' : 'application/json; charset=utf-8'
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

AxiosCommerce.interceptors.response.use(
  (response) => {
    InterceptorsCheck({ act: 'response', url: response.config.url })
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

//
// AxiosCommerce.interceptors.request.use(
//   (config) => {
//     // const token = sessionStorage.getItem('token')
//     const token =
//       'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJib3gwMTAwMiIsIlVUTElOU1RUSUQiOiJDMDAwMDAxNSIsIlVTRVJJRCI6ImJveDAxMDAyIiwiZXhwIjoxNjU2MDk1NzUyLCJpYXQiOjE2NTUxOTU3NTJ9.1CgF1vpytU8ImWe99rd6e_pY1OgrzenxBKntuR1pnxM'
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`
//     }
//     const fileUsed = config.fileused === undefined ? false : true
//     if (fileUsed) {
//       config.headers['Content-Type'] = 'multipart/form-data'
//     } else {
//       config.headers['Content-Type'] = 'application/json; charset=utf-8'
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )
// AxiosCommerce.interceptors.response.use(
//   (config) => {
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )
export default AxiosCommerce
