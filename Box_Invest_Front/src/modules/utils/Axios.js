import axios from 'axios'
import {LOGIN_LINK_KEYS} from "modules/contexts/common/LoginContext";

const Axios = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 300000
})
Axios.interceptors.request.use(
    (config) => {

        /*const token = window.tokenCheck() ? sessionStorage.getItem(LOGIN_LINK_KEYS.SI_TOKEN) : ''*/
        const token = window.tokenCheck() ? window.getCookieValue(LOGIN_LINK_KEYS.AUTH_COOKIE) : ''

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        const fileUsed = config.fileused === undefined ? false : true
        if (fileUsed) {
            config.headers['Content-Type'] = 'multipart/form-data'
        } else {
            config.headers['Content-Type'] = 'application/json; charset=utf-8'
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)
Axios.interceptors.response.use(
    (config) => {
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)
export default Axios
