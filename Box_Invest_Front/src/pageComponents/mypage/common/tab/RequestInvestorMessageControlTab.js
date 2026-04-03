import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react'
import { useHistory } from 'react-router-dom'
import Badge from 'components/atomic/Badge'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import ResponseUtils from 'modules/utils/ResponseUtils'
import Api from 'modules/consts/Api'
import {createKey} from "modules/utils/CommonUtils";

/** @deprecated */
const RequestInvestorMessageControlTab = forwardRef((props, ref) => {
  const history = useHistory()
  const { requestType } = props
  const [tabList, setTabList] = useState({
    active: requestType,
    list: [
      { id: 'receive', label: '받은 메시지', count: '0' },
      { id: 'send', label: '보낸 메시지', count: '0' }
    ]
  })

  useImperativeHandle(ref, () => ({
    setData
  }))

  const setData = async () => {
    let receiveTotal = 0
    let sendTotal = 0
    const receiveObject = await loadReceive()
    if (receiveObject) {
      receiveTotal = receiveObject['receiveCnt']
    }
    setTabList({
      active: requestType,
      list: [
        { id: 'receive', label: '받은 메시지', count: receiveTotal },
        { id: 'send', label: '보낸 메시지', count: sendTotal }
      ]
    })
  }

  const handleTabList = (id) => {
    if (id === requestType) return
    if (id === 'receive') {
      history.push(ROUTER_NAMES.MY_PAGE_INVESTOR_MESSAGE_RECEIVE_VIEW)
    } else {
      history.push(ROUTER_NAMES.MY_PAGE_INVESTOR_MESSAGE_SEND_VIEW)
    }
  }
  useEffect(() => {
  }, []);

  const loadReceive = async () => {
    const receiveObject = await ResponseUtils.getSimpleResponse(Api.my.vc.messageReceiveCount, null, false)
    if (receiveObject) {
      return receiveObject
    }
    return null
  }
  // const loadSend = async () => {
  //   const params = {
  //     page: 1,
  //     record: 5,
  //     pageSize: 5
  //   }
  //   const sendObject = await ResponseUtils.getSimpleResponse(Api.my.vc.messageCount, null, false)
  //   if (sendObject) {
  //     return sendObject
  //   }
  //   return null
  // }
  const getDisplayBadge = (item) => {
    if (item.id === 'receive')
      return <Badge className={`rounded ${tabList.active === item.id ? 'blue' : ''}`}>{item.count}</Badge>
    else return <></>
  }
  return (
    <div className="tab_wrap">
      {tabList &&
        tabList.list?.map((item, idx) => (
          <button
            className={`btn_tab ${tabList.active === item.id ? 'active' : ''}`}
            key={createKey()}
            onClick={() => handleTabList(item.id)}
          >
            <span className="text">{item.label}</span>
            {/*{getDisplayBadge(item)}*/}
          </button>
        ))}
    </div>
  )
});

export default RequestInvestorMessageControlTab;
