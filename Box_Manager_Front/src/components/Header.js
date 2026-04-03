import { useContext, useEffect, useState } from 'react'
import { navList } from 'modules/common'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../modules/common/UserContext'
import ROUTER_NAMES from '../modules/consts/RouterConst'
import * as commonFn from 'modules/fns/commonFn'
import {getUserAthrMenu} from "../modules/consts/AdminApi";

const Header = (props) => {
  const userContext = useContext(UserContext)
  const { currentMenu, navList } = props
  const history = useHistory()

  return (
    <header className={'header_wrap'}>
      <div className="header_inner default_size">
        <h1 className={'logo'}>
          <img src={require('assets/images/logo.png').default} alt="IBK 운영자 포털" />
          <span className="logo_text">운영자 포털</span>
        </h1>
        {userContext.state.userInfo && (
          <>
            <ul className="nav_list">
              {/*{navList &&*/}
              {/*  navList.map((nav) => {*/}
              {/*    return (*/}
              {/*      <li className={`nav_item ${currentMenu === nav.menuId && 'active'}`} key={commonFn.createKey()}>*/}
              {/*        /!*<p>{nav.url}</p>*!/*/}
              {/*        /!*<Link to={nav.url}>{nav.label}</Link>*!/*/}
              {/*        <p*/}
              {/*          onClick={() => {*/}
              {/*            // console.log('# typeof currentMenu', typeof currentMenu)*/}
              {/*            // console.log('# props', props)*/}
              {/*            history.push(nav.url)*/}
              {/*          }}*/}
              {/*        >*/}
              {/*          {nav.label}*/}
              {/*        </p>*/}
              {/*      </li>*/}
              {/*    )*/}
              {/*  })}*/}
              {navList &&
                navList.map((nav) => {
                  return (
                    <li className={`nav_item ${currentMenu === nav.menuId && 'active'}`} key={commonFn.createKey()}>
                      {/*<p>{nav.url}</p>*/}
                      {/*<Link to={nav.url}>{nav.label}</Link>*/}
                      <p
                        onClick={() => {
                          // console.log('# typeof currentMenu', typeof currentMenu)
                          // console.log('# props', props)
                          history.push(nav.menuUrl)
                        }}
                      >
                        {nav.menuNm}
                      </p>
                    </li>
                  )
                })}
            </ul>

            <div className="user_menu_wrap">
              <p className="user_name">{userContext.state.userInfo.mngrNm}</p>
              <p className="user_info">
                IBK&#183;{userContext.state.userInfo.supMngrYn === 'Y' ? '슈퍼관리자' : '관리자'}
              </p>
              <button
                className="btn_setting"
                onClick={() => history.push(`${ROUTER_NAMES.ADMIN_WRITE}/${userContext.state.userInfo.mngrId}`)}
              >
                <span className="hide">설정</span>
              </button>
              <button className="btn_logout" onClick={()=>userContext.actions.logOut()}>
                <span className="hide">로그아웃</span>
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}

export default Header
