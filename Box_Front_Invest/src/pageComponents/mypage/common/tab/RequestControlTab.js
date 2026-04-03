import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react'
import { useHistory } from 'react-router-dom'
import Badge from 'components/atomic/Badge'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import ResponseUtils from 'modules/utils/ResponseUtils'
import Api from 'modules/consts/Api'
import {createKey} from "modules/utils/CommonUtils";

const RequestControlTab = forwardRef((props, ref) => {
  const history = useHistory()
  const { requestType } = props
  const [tabList, setTabList] = useState({
    active: requestType,
    list: [
      { id: 'receive', label: '받은 요청', count: '0' },
      { id: 'send', label: '보낸 요청', count: '0' }
    ]
  })
  const handleTabList = (id) => {
    if (id === requestType) return
    if (id === 'receive') {
      history.push(ROUTER_NAMES.MY_PAGE_COMPANY_REQUEST_RECEIVE_VIEW)
    } else {
      history.push(ROUTER_NAMES.MY_PAGE_COMPANY_REQUEST_SEND_VIEW)
    }
  }

  useImperativeHandle(ref, () => ({
    setData
  }));

  const setData = async () => {
    let receiveTotal = 0
    let sendTotal = 0
    const receiveObject = await loadReceive()
    const sendObject = await loadSend()
    if (receiveObject) {
      receiveTotal = receiveObject['total']
    }
    if (sendObject) {
      sendTotal = sendObject['total']
    }
    setTabList({
      active: requestType,
      list: [
        { id: 'receive', label: '받은 요청', count: receiveTotal },
        { id: 'send', label: '보낸 요청', count: sendTotal }
      ]
    })
  }

  useEffect(async () => {
  }, [])

  const loadReceive = async () => {
    const params = {
      page: 1,
      record: 5,
      pageSize: 5
    }
    const receiveObject = await ResponseUtils.getSimpleResponse(Api.my.company.auditReceiveList, params, false)
    if (receiveObject) {
      return receiveObject
    }
    return null
  }
  const loadSend = async () => {
    const params = {
      page: 1,
      record: 5,
      pageSize: 5
    }
    const sendObject = await ResponseUtils.getSimpleResponse(Api.my.company.auditSendList, params, false)
    if (sendObject) {
      return sendObject
    }
    return null
  }
  return (
    <div className="tab_wrap">
      {tabList &&
        tabList.list?.map((d, idx) => (
          <button
            className={`btn_tab ${tabList.active === d.id ? 'active' : ''}`}
            key={createKey()}
            onClick={() => handleTabList(d.id)}
          >
            <span className="text">{d.label}</span>
            <Badge className={`rounded ${tabList.active === d.id ? 'blue' : ''}`}>{d.count}</Badge>
          </button>
        ))}
    </div>
  )
});

export default RequestControlTab;
