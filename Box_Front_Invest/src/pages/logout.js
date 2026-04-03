import React, { useContext, useEffect, useLayoutEffect } from 'react'
import { useHistory } from 'react-router-dom'

import Button from 'components/atomic/Button'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import QueryUtils from "modules/utils/QueryUtils";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {LOGIN_LINK_KEYS} from "modules/contexts/common/LoginContext";

/** @deprecated */
const Logout = (props) => {
  const history = useHistory()

  const commonContext = useContext(CommonContext);

  const onClickMain = () => {
    history.replace(ROUTER_NAMES.MAIN)
  }
  const onClickLogin = () => {
    window.commonLogin();
  }

  useEffect(async () => {
    const token = sessionStorage.getItem(LOGIN_LINK_KEYS.SI_TOKEN);
    const auth = getCookieValue(LOGIN_LINK_KEYS.AUTH_COOKIE);

    if((token !== null) || (auth !== null)) commonContext.actions.logout();
  }, []);

  return (
      <>
        {
          QueryUtils.getQuery(props)?.hasOwnProperty('sessionout')
            ? <div>
                <div className={'logout_wrap default_size02'}>
                  <h2 className="title">로그아웃</h2>
                  <div className="logout_content_wrap">
                    <p className="main_text">세션이 만료되었습니다.</p>
                    <p className="info_text">
                      세션이 만료되었습니다. <br />
                      다시 이용하시려면 로그인 해주세요.
                    </p>
                    <div className="btn_group">
                      <Button className={'btn_home linear'} onClick={onClickMain}>
                        홈으로
                      </Button>
                      {/*<Button className={'btn_login blue'} onClick={onClickLogin}>*/}
                      {/*  로그인*/}
                      {/*</Button>*/}
                    </div>
                  </div>
                </div>
              </div>

              : <div>
                <div className={'logout_wrap default_size02'}>
                  <h2 className="title">로그아웃</h2>
                  <div className="logout_content_wrap">
                    <p className="main_text">로그아웃 되었습니다.</p>
                    <p className="info_text">
                      투자박스 서비스를 이용해 주셔서 감사합니다. <br />
                      다시 이용하시려면 로그인 해주세요.
                    </p>
                    <div className="btn_group">
                      <Button className={'btn_home linear'} onClick={onClickMain}>
                        홈으로
                      </Button>
                      {/*<Button className={'btn_login blue'} onClick={onClickLogin}>*/}
                      {/*  로그인*/}
                      {/*</Button>*/}
                    </div>
                  </div>
                </div>
              </div>
        }
      </>
  )
}
export default Logout
