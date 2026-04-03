import Api from './Api'
import AxiosAdmin from '../utils/AxiosAdmin'

export const InterceptorsCheck = ({ act, url, loading = false, method }) => {
  if (act == 'request') {
    // console.log("request---->",API.AxiosInterceptors);
    Api.AxiosInterceptors.push(url)

    if (Api.AxiosInterceptors.length > 0) {
      if (loading || method === 'post') {
        document.querySelector('#loadingstate').style.display = 'flex'
      }
    }
  } else if (act == 'response') {
    Api.AxiosInterceptors = Api.AxiosInterceptors.filter((data) => data != url)

    // console.log("response--->",API.AxiosInterceptors, "len--->",API.AxiosInterceptors.length);

    if (Api.AxiosInterceptors.length == 0) {
      document.querySelector('#loadingstate').style.display = 'none'
      if (Api.refreshCheck) {
        Api.refreshCheck = false
        //TODO 외부망 테스트인 경우 주석 처리
        refreshToken()
      }
    }
  }
}

//컴포넌트가 랜더링 될때마다, 타이머가 생성되는 문제로 인하여 API 파일에 object 및 변수를 담아서 사용
export const refreshTimer = () => {
  //로그인 후 부터는 카운트 증가로 세션 연결시간을 체크 하기 위함
  Api.TIMERCNT = 0

  //로그인 후 발생하는 상황
  if (sessionStorage.getItem('token')) {
    //타이머 시작
    if (Api.TIMEROBJ == null) {
      Api.TIMEROBJ = setInterval(() => {
        if (Api.TIMERCNT == Api.LIMITCNT) {
          sessionInit()
        }
        Api.TIMERCNT++
        // console.log("로그인 세션 종료까지 남은 시간 --->", API.TIMERCNT, "/", API.LIMITCNT, "=", (API.LIMITCNT / 60), "분");
      }, 1000)
    }
  }
}

//토큰 갱신
export const refreshToken = () => {
  //로그인 후 발생하는 상황
  if (sessionStorage.getItem('token')) {
    const sessionData = window.parseJwt(sessionStorage.getItem('token'))
    if (sessionData.exp > window.getCurTimestamp()) {
      Api.refreshCheck = true
    } else if (sessionData.exp <= window.getCurTimestamp()) {
      AxiosAdmin({
        method: 'get',
        url: Api.admin.jwt_check
      })
        .then((response) => {
          if (response?.data.token) {
            Api.refreshCheck = true
            sessionStorage.setItem('token', response?.data.token)
          } else {
            Api.refreshCheck = true
            sessionStorage.removeItem('token')
            alert('로그인 세션이 만료되었습니다')
            window.location.href = '/login'
          }
        })
        .catch(() => {
          Api.refreshCheck = true
          sessionStorage.removeItem('token')
          alert('로그인 세션이 만료되었습니다')
          window.location.href = '/login'
        })
    } else {
      sessionInit()
      Api.refreshCheck = true
      sessionStorage.removeItem('token')
      alert('로그인 세션이 만료되었습니다')
      window.location.href = '/login'
    }

    // AxiosAdmin({
    //   method: 'get',
    //   url: Api.admin.jwt_check
    // })
    //   .then((response) => {
    //     if (response?.data.token) {
    //       Api.refreshCheck = true
    //       sessionStorage.setItem('token', response?.data.token)
    //     } else {
    //       Api.refreshCheck = true
    //       sessionStorage.removeItem('token')
    //       alert('로그인 세션이 만료되었습니다')
    //       window.location.href = '/login'
    //     }
    //   })
    //   .catch(() => {
    //     Api.refreshCheck = true
    //     sessionStorage.removeItem('token')
    //     alert('로그인 세션이 만료되었습니다')
    //     window.location.href = '/login'
    //   })
  }
}

//세션 초기화
export const sessionInit = () => {
  console.log('로그인 세션이 만료 혹은 갱신에 실패하였습니다.')
  sessionStorage.removeItem('token')
  window.location.href = '/'
}
