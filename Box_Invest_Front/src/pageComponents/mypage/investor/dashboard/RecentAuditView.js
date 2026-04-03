import React, {forwardRef, useImperativeHandle, useState} from 'react'
import RecentAuditList from "pageComponents/mypage/common/dashboard/RecentAuditList";

import ResponseUtils from 'modules/utils/ResponseUtils'
import ROUTER_NAMES from "modules/consts/RouterConst";
import Api from 'modules/consts/Api'
import {ListType, UsisType} from "modules/consts/BizConst";

const RecentAuditView = forwardRef((props, ref) => {
  const [receiveList, setReceiveList] = useState([])
  const [receiveBadgeCnt, setReceiveBadgeCnt] = useState(0)
  const [sendList, setSendList] = useState([])
  const [sendBadgeCnt, setSendBadgeCnt] = useState(0)

  useImperativeHandle(ref, () => ({
    setData
  }));

  const setData = async () => {
    const sendObj = await loadSendObject();
    const receiveObj = await loadReceiveObject();

    if(sendObj) {
      setSendBadgeCnt(sendObj['badgeCnt'])
      setSendList(sendObj['list'])
    }
    if(receiveObj) {
      setReceiveBadgeCnt(receiveObj['badgeCnt'])
      setReceiveList(receiveObj['list'])
    }
  }

  const loadReceiveObject = async () => {
    const receiveObject = await ResponseUtils.getSimpleResponse(Api.my.vc.auditRequestList)
    return receiveObject
  }
  const loadSendObject = async () => {
    const sendObject = await ResponseUtils.getSimpleResponse(Api.my.vc.auditSuggestList)
    return sendObject
  }

  return (
    <div className="section section01">
      <div className="section_header">
        <h3 className="section_title"> 투자심사 현황</h3>
      </div>
      <div className="screening_wrap">
        <RecentAuditList  title={'보낸 투자심사'} noResultMsg={'제안하신 투자심사 정보가 없습니다.'}
                          badgeCnt={sendBadgeCnt} auditList={sendList}
                          listType={ListType.SEND} usisType={UsisType.INVESTOR}
                          router={{
                            detailRouter: ROUTER_NAMES.MY_PAGE_INVESTOR_REQUEST_DETAIL,
                            listRouter: ROUTER_NAMES.MY_PAGE_INVESTOR_REQUEST_SEND_VIEW
                          }}/>
        <RecentAuditList  title={'받은 투자심사'} noResultMsg={'요청받으신 투자심사 정보가 없습니다.'}
                          badgeCnt={receiveBadgeCnt} auditList={receiveList}
                          listType={ListType.RECEIVE} usisType={UsisType.INVESTOR}
                          router={{
                            detailRouter: ROUTER_NAMES.MY_PAGE_INVESTOR_REQUEST_DETAIL,
                            listRouter: ROUTER_NAMES.MY_PAGE_INVESTOR_REQUEST_RECEIVE_VIEW
                          }}/>
      </div>
    </div>
  )
});
export default RecentAuditView;
