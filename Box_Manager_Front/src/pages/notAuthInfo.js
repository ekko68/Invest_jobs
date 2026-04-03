import { UserContext } from '../modules/common/UserContext'
import React, {useContext} from "react";
import Button from "../components/atomic/Button";

const notAuthInfo = () => {
    const userContext = useContext(UserContext)

    return (
      <div className="not_found_wrap">
        <div className="not_found_container">
          <h3 className="not_found_title">안내</h3>
          <div className="not_found_main_text">
            <p className={'p01'}>사용 가능한 권한이 없습니다.</p>
            <p className={'p02'}>관리자에게 문의 해주세요.</p>
          </div>
            <div className={'btn_group'}>
                <div className="button not_found_button">
                    <Button className={'button_login full_blue'} onClick={()=> userContext.actions.logOut()}>
                        로그아웃
                    </Button>
                </div>
            </div>
        </div>

      </div>
    )
}
export default notAuthInfo
