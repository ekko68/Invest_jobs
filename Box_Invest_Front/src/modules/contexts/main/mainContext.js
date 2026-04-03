import React, { useState, useLayoutEffect, useEffect } from 'react'
import CommonAxios from 'modules/utils/CommonAxios'
import Api from 'modules/consts/Api'
import {getConfig} from "modules/utils/CommonAxios";
import {CheckYn} from "modules/consts/BizConst";

/**
 * @deprecated
 */
const MainContext = React.createContext({
  state: {
    alarmUnreadYn: CheckYn.NO,
    badgeCount: 0
  },
  actions: {
    loadAlarmUnreadYn: () => {},
    loadBadgeCount: () => {},
    setAppAlarmUnreadYn: () => {},
  }
})

const { Provider } = MainContext


/**
 * @deprecated
 */
const MainProvider = ({ children }) => {
  const [alarmUnreadYn, setAlarmUnreadYn] = useState(CheckYn.NO);
  const [badgeCount, setBadgeCount] = useState(0);
  useLayoutEffect(() => {}, [])
  useEffect(() => {}, [])

  const loadAlarmUnreadYn = async () => {
    if(!window.tokenCheck()) {
      return;
    }
    const res = await CommonAxios(getConfig(Api.common.alarmInvestUnread, null), false);
    if(res && res.status === 200 && res.data.code === '200') {
      setAlarmUnreadYn(String(res.data.data.unreadYn));
    }
  }

  const setAppAlarmUnreadYn = (unreadYn) => {
    setAlarmUnreadYn(String(unreadYn));
  }

  const loadBadgeCount = async () => {
    setBadgeCount(0)
  }

  const contextValue = {
    state: { alarmUnreadYn, badgeCount },
    actions: { loadAlarmUnreadYn, loadBadgeCount, setAppAlarmUnreadYn }
  }
  return <Provider value={contextValue}>{children}</Provider>
}

export { MainContext, MainProvider }
