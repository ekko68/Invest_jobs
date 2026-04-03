import axios from 'axios'

const BoxAxios = axios.create({
  baseURL: process.env.REACT_APP_BOX_API_URL,
  timeout: 300000
})
const ErrorHandler = (e) => {
  let error = e
  if (e === undefined) {
    error = {
      data: 400,
      message: 'timeout error',
      path: '/'
    }
  }
  const response = {
    code: error.data.state,
    message: error.data.error,
    path: error.data.path
  }
  return response
}
const loadingState = (state) => {
  // const active = state === true ? 'block' : 'none'
  // document.querySelector('#loadingstate').style.display = active
}

BoxAxios.interceptors.request.use(
  function (config) {
    loadingState(true) //로딩 오픈
    //token이 없을때 Bearer null 로 넣으면 500에러로 발생으로 공백값 넣어줌
    // const token = localStorage.getItem('jwt') === null ? '' : localStorage.getItem('jwt')
    // config.headers['Authorization'] = `Bearer ${token}`

    const fileused = config.fileused === undefined ? false : true
    //파일업로드 요청인경우
    if (fileused) {
      config.headers['Content-Type'] = 'multipart/form-data'
    } else {
      config.headers['Content-Type'] = 'application/json; charset=utf-8'
    }
    return config
  },
  function (e) {
    loadingState(false) //로딩 종료
    return ErrorHandler(e.response)
  }
)

BoxAxios.interceptors.response.use(
  function (response) {
    loadingState(false) //로딩 종료
    return response.data
  },
  function (e) {
    loadingState(false) //로딩 종료
    return Error(e.response)
  }
)

export default BoxAxios
