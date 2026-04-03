import { useState, useLayoutEffect, useEffect, useContext } from 'react'
import Header from 'components/Header'
import Lnb from 'components/Lnb'
import BreadCrumb from 'components/BreadCrumb'
import { getAuthMenuList, getMenuAuthApi, getMenuListAPi, getUserInfo } from 'modules/consts/AdminApi'
import { UserContext } from 'modules/common/UserContext'
import { useHistory } from 'react-router-dom'
import USER_AUTH_URL_MATCH from 'modules/consts/userAuthUrlMatch'
import { InvestContext } from 'modules/common/InvestContext'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import MuiCommModal from './BtaModal/MuiCommModal'
import MktAlert from 'pageComponents/commerce/common/Alert'
/*
 * currentMenu : 현재 대메뉴 [invest || commerce || global || admin ]
 * currentCate : 현재 중메뉴 - modules/common.js > lnbList 의 id값
 * currentPage: 현재 페이지 - modules/common.js > lnbList > subList 의 id값
 * */

const PageLayout = (props) => {
  const { className = '', currentMenu, currentCate, currentPage = '', children, ...other } = props
  const userToken = sessionStorage.getItem('token')
  const userContext = useContext(UserContext)
  const investContext = useContext(InvestContext)
  const history = useHistory()

  // ===== state
  // const [navList, setNavList] = useState(null)

  // ===== get user info
  const handleGetUserInfo = async () => {
    if (userContext.state.userInfo === null) {
      const res = await getUserInfo()
      if (res.status === 200) {
        userContext.actions.setUserInfo(res.data.data)
      }
    }
  }

  const useMenuCheck = (data) => {
    const pathName = history.location.pathname

    //일반관리자가 슈퍼관리자 경로를 접근하는 경우 접속을 제한함
    if (userContext.state.userInfo.supMngrYn == 'N') {
      // 2023.11.14 --> 관리자계정 관리 화면 : 본인 계정인 경우 수퍼관리자가 아니더라도 조회 가능하도록 변경 (일부 기능 제한)
      if (pathName === ROUTER_NAMES.ADMIN_WRITE + '/' + userContext.state.userInfo.mngrId) {
        return
      }

      if (pathName.indexOf('admin') == 1) {
        location.href = '/notFound'
        return
      }

      //라우터 정보에서 허용가능한 url인지 가져오기
      const getRouterMatchData = USER_AUTH_URL_MATCH.filter((item) => pathName.indexOf(item.router) == 0)
      let successCnt = 0

      data?.map((lnb1, idx1) => {
        successCnt += getRouterMatchData.filter((item) => item.menuId == lnb1.menuId).length
        lnb1?.lnbList.map((lnb2, idx2) => {
          successCnt += getRouterMatchData.filter((item) => item.menuId == lnb2.menuId).length
          lnb2?.subList.map((lnb3, idx3) => {
            successCnt += getRouterMatchData.filter((item) => item.menuId == lnb3.menuId).length
          })
        })
      })

      //메뉴를 찾아도 내용이 없는경우 권한이 없는것
      if (successCnt == 0) {
        // location.href='/notAuthInfo';
        return
      }
    }
  }

  const getMenuList = async () => {
    if (userContext.state.navList === null || userContext.state.navList.length < 1) {
      const res = await getMenuListAPi()
      if (res.status === 200) {
        const responseData = res.data.data.list
        userContext.actions.setNavList(responseData)
        useMenuCheck(responseData)
      }
    }
  }

  useEffect(async () => {
    await handleGetUserInfo()
    if (!userToken) {
      window.location.href = '/'
    }
  }, [userToken])

  useEffect(async () => {
    if (userContext.state.userInfo) {
      await getMenuList()
    }
  }, [userContext.state.userInfo])

  useEffect(() => {
    investContext.actions.handlePagePath(history)
  }, [])

  return (
    <div className={`wrap ${className}`}>
      {/*header start*/}
      {userContext.state.navList && <Header currentMenu={currentMenu} navList={userContext.state.navList} />}
      {/*header end*/}
      {/*container start*/}
      <MktAlert />
      <div className="container default_size">
        {
          // 2023.11.14 --> 관리자계정 관리 화면 : 본인 계정인 경우 수퍼관리자가 아니더라도 조회 가능하도록 변경 (일부 기능 제한)
          // 우선 사이드 메뉴의 경우 조회되는 것이 없으므로 제외시킴
          !(
            userContext.state.userInfo?.supMngrYn == 'N' &&
            history?.location?.pathname?.startsWith(ROUTER_NAMES.ADMIN_WRITE)
          ) && (
            <Lnb
              currentMenu={currentMenu}
              currentCate={currentCate}
              currentPage={currentPage}
              navList={userContext.state.navList}
            />
          )
        }

        <div className="main_content">
          <BreadCrumb currentMenu={currentMenu} currentCate={currentCate} currentPage={currentPage} />
          {children}
        </div>
      </div>
      {/*container end*/}
    </div>
  )
}

export default PageLayout
