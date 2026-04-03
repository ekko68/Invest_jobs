import React, {forwardRef, useContext, useEffect, useImperativeHandle, useState} from 'react'
import RecentAuditList from "pageComponents/mypage/common/dashboard/RecentAuditList";

import ResponseUtils from 'modules/utils/ResponseUtils'
import Api from 'modules/consts/Api'
import {ListType, UsisType} from "modules/consts/BizConst";
import ROUTER_NAMES from "modules/consts/RouterConst";


const RecentAuditView = forwardRef((props, ref) => {
  const [receiveList, setReceiveList] = useState([])
  const [receiveBadgeCnt, setReceiveBadgeCnt] = useState(0)
  const [sendList, setSendList] = useState([])
  const [sendBadgeCnt, setSendBadgeCnt] = useState(0)

  useImperativeHandle(ref, () => ({
      setData
  }));

  useEffect(() => {
  },[]);

  const setData = async () => {
      const sendObject = await loadSendObject();
      const receiveObject = await loadReceiveObject();

      if (sendObject) {
          setSendBadgeCnt(sendObject['badgeCnt']);
          setSendList(sendObject['list']);
      }

      if(receiveObject) {
          setReceiveBadgeCnt(receiveObject['badgeCnt']);
          setReceiveList(receiveObject['list']);
      }
  }

  const loadSendObject = async () => {
      const sendObject = await ResponseUtils.getSimpleResponse(Api.my.company.auditRequestList);
      return sendObject;
  }

  const loadReceiveObject = async () => {
      const receiveObject = await ResponseUtils.getSimpleResponse(Api.my.company.auditSuggestList);
      return receiveObject;
  }

  return (
    <div className="section section01">
      <div className="section_header">
        <h3 className="section_title"> 투자심사 현황</h3>
      </div>
      <div className="screening_wrap">
          <RecentAuditList  title={'받은 투자심사 제안'} noResultMsg={'제안받으신 투자심사 정보가 없습니다.'}
                            badgeCnt={receiveBadgeCnt} auditList={receiveList}
                            listType={ListType.RECEIVE} usisType={UsisType.COMPANY}
                            router={{
                                detailRouter: ROUTER_NAMES.MY_PAGE_COMPANY_REQUEST_DETAIL,
                                listRouter: ROUTER_NAMES.MY_PAGE_COMPANY_REQUEST_RECEIVE_VIEW
                            }}/>

          <RecentAuditList  title={'보낸 투자심사 요청'} noResultMsg={'요청하신 투자심사 정보가 없습니다.'}
                            badgeCnt={sendBadgeCnt} auditList={sendList}
                            listType={ListType.SEND} usisType={UsisType.COMPANY}
                            router={{
                                detailRouter: ROUTER_NAMES.MY_PAGE_COMPANY_REQUEST_DETAIL,
                                listRouter: ROUTER_NAMES.MY_PAGE_COMPANY_REQUEST_SEND_VIEW
                            }}/>
      </div>
    </div>
  )
});
export default RecentAuditView;
