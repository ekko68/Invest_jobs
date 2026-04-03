import React, { useContext, useState, useEffect, Fragment } from 'react'
import { MktContext } from 'modules/common/MktContext'
import { StringUtils } from 'modules/utils/StringUtils'
import PopupAlert from 'components/PopupAlert'
import CommerceAlert2Button from './CommerceAlert2Button'

const Alert = () => {
  const mktContext = useContext(MktContext)
  const [alertInfo, setAlertInfo] = useState({
    active: false,
    type: ''
  })

  useEffect(() => {
    if (StringUtils.hasLength(mktContext.state.commonAlertInfo?.type)) {
      setAlertInfo({
        ...mktContext.state.commonAlertInfo
      })
    }
  }, [mktContext.state.commonAlertInfo])

  return (
    <Fragment>
      {alertInfo.type === 'error' && alertInfo.active && (
        <PopupAlert
          msg="오류가 발생했습니다. 잠시 후 다시 시도해주세요."
          handlePopup={() => {
            mktContext.actions.setCommonAlertInfo({
              active: false,
              type: 'error'
            })
          }}
        />
      )}
      {alertInfo.type === 'alert' && alertInfo.active && (
        <PopupAlert
          msg={alertInfo.msg}
          btnMsg={alertInfo.btnMsg}
          handlePopup={() => {
            mktContext.actions.setCommonAlertInfo({
              active: false,
              type: 'alert'
            })
          }}
        />
      )}
      {alertInfo.type === 'function1Btn' && alertInfo.active && (
        // 팝업후 후처리 기능 메시지
        <PopupAlert
          msg={alertInfo.msg}
          btnMsg={alertInfo.btnMsg}
          handlePopup={(btnType) => {
            if (btnType === 'btnMsg' && typeof alertInfo.action === 'function') {
              alertInfo.action()
            }
            mktContext.actions.setCommonAlertInfo({
              active: false,
              type: 'function1Btn'
            })
          }}
        />
      )}
      {alertInfo.type === 'function' && alertInfo.active && (
        // 팝업후 후처리 기능 메시지
        <CommerceAlert2Button
          msg={alertInfo.msg}
          btnMsgCancel={alertInfo.btnMsg}
          btnMsgConfirm={alertInfo.btnMsg2}
          handlePopup={(btnType) => {
            console.log(btnType)
            if (btnType === 'btnMsg' && typeof alertInfo.action === 'function') {
              alertInfo.action()
            }
            if (btnType === 'btnMsg2' && typeof alertInfo.action2 === 'function') {
              alertInfo.action2()
            }
            mktContext.actions.setCommonAlertInfo({
              active: false,
              type: 'function'
            })
          }}
        />
      )}
    </Fragment>
  )
}

export default Alert
