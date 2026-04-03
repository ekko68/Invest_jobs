import React, {forwardRef, useContext, useEffect, useImperativeHandle, useState} from 'react'
import { useHistory } from 'react-router-dom'

import Button from 'components/atomic/Button'
import NoResult from "components/common/NoResult";
import InvestDetailMemberListCard from 'pageComponents/mypage/investor/info/InvestDetailMemberListCard'

import ResponseUtils from 'modules/utils/ResponseUtils'
import Api from 'modules/consts/Api'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import {createKey} from "modules/utils/CommonUtils";

const InvestDetailMemberList = forwardRef((props, ref) => {
  const history = useHistory()
  const [list, setList] = useState([])

  useImperativeHandle(ref, () => ({
    setData
  }));

  const setData = async () => {
    const memberList = await loadMemberList();
    setList(memberList);
  }

  useEffect(async () => {
  }, [])

  const loadMemberList = async () => {
    const memberList = await ResponseUtils.getList(Api.my.vc.memberList, null, 'list', false)
    return memberList
  }
  const onClickModify = () => {
    history.push(ROUTER_NAMES.MY_PAGE_INVESTOR_JUDGE_WRITE)
  }
  return (
    <div className="section section03">
      <div className="section_header">
        <h3 className="section_title">대표심사역</h3>
        <Button className={'blue'} onClick={onClickModify}>
          수정하기
        </Button>
      </div>
      <div className="judge_list_wrap">
        <ul className="judge_list">{
          list?.length > 0
            ? list.map((item, i) => (
                <li className="judge_item" key={createKey()}>
                  <InvestDetailMemberListCard data={item} />
                </li>
              ))
            : <NoResult msg={'등록된 대표심사역 정보가 없습니다.'}/>
        }</ul>
      </div>
    </div>
  )
});

export default InvestDetailMemberList;
