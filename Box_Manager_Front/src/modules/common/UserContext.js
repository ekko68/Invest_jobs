import React, { useState } from 'react'
import { getMenuListAPi, loginApi } from 'modules/consts/AdminApi'
import { StringUtils } from 'modules/utils/StringUtils'

const UserContext = React.createContext({
  state: {
    userInfo: {},
    token: '',
    navList: []
  },
  actions: {
    getUserInfo: () => {},
    getIvtAdminUser: () => {}
  }
})
const { Provider } = UserContext

const UserProvider = ({ children }) => {
  const [category, setCategory] = useState(null)
  const [navList, setNavList] = useState([])
  const [userInfo, setUserInfo] = useState(null)

  const login = async (params) => {
    const res = await loginApi(params)
    if (res?.data?.code === '200') {
      sessionStorage.setItem('token', res?.data.token)
      return {
        isLogin: true,
        response: res
      }
    } else {
      sessionStorage.removeItem('token')
      return {
        isLogin: false,
        response: res
      }
    }
  }

  const logOut = () => {
    sessionStorage.removeItem('token')
    location.href = '/login'
  }

  const getIvtAdminUser = () => {
    return {
      adminUserId: StringUtils.hasLength(userInfo?.mngrId) ? userInfo.mngrId : ''
    }
  }

  // 기존 Login.js에 있던 유저별 첫 화면 리다이렉트 함수를 따로 빼놓음
  // 해당 함수를 AdminApi 등으로 뺴는 처리가 필요한 경우 추후 처리할 것
  const redirectFirstMenu = async (history) => {
    const res = await getMenuListAPi()

    // 메뉴 리스트가 있는 경우
    if (res.status === 200 && res?.data?.data?.list[0]) {
      if (res.data.data.list[res.data.data.list.length - 1].menuId == 'admin') {
        history.push(res.data.data.list[res.data.data.list.length - 1].menuUrl)
        return
      }

      // 첫번째 메뉴가 URL 이 있는 메뉴일 경우
      if (StringUtils.hasLength(res.data.data.list[0]?.menuUrl)) {
        console.log(res.data.data.list[0].menuUrl)
        history.push(res.data.data.list[0].menuUrl)
        return
      }
      // URL 이 없는 메뉴(최상단 메뉴)이면서
      else {
        // 중간 메뉴가 있는경우
        res.data.data.list[0].lnbList?.some((url) => {
          // 중간 메뉴에 URL 이 있는 경우
          if (StringUtils.hasLength(url.menuUrl)) {
            history.push(url.menuUrl)
            return true
          }

          // URL 이 없는 하위 메뉴(중간메뉴) 이면서
          else {
            // 하위 메뉴가 있는 경우
            url.subList?.some((url2) => {
              // ULR 이 있는 하위 메뉴일 경우
              if (StringUtils.hasLength(url2.menuUrl)) {
                history.push(url2.menuUrl)
                return true
              }
            })
            return true
          }
        })
      }
    }
    // 메뉴 권한이 없는 경우
    else {
      history.push('/notAuthInfo')
    }
  }

  // useEffect(async () => {
  //   if (sessionStorage && sessionStorage.getItem('token') && !userInfo) {
  //     await getUserInfo()
  //   }
  // }, [sessionStorage])

  const value = {
    state: { category, userInfo, navList },
    actions: { login, logOut, setCategory, setUserInfo, setNavList, getIvtAdminUser, redirectFirstMenu }
  }
  return <Provider value={value}>{children}</Provider>
}

export { UserContext, UserProvider }
