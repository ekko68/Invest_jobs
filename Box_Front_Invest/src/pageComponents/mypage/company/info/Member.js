import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import Button from 'components/atomic/Button'
import CardLayout from 'components/common/card/CardLayout'

import ROUTER_NAMES from 'modules/consts/RouterConst'
import { useHistory } from 'react-router-dom'
import NoResult from "components/common/NoResult";
import {createKey} from "modules/utils/CommonUtils";

const Member = forwardRef((props, ref) => {
  const history = useHistory()
  const [list, setList] = useState([])
  useImperativeHandle(ref, () => ({
    setData
  }))
  const setData = (temp) => {
    setList(temp)
  }
  const onClickTeamWrite = () => {
    history.push(ROUTER_NAMES.MY_PAGE_COMPANY_TEAM_WRITE)
  }
  return (
    <div className="section section04">
      <div className="section_header">
        <h3 className="section_title">팀원정보</h3>
        <Button className={'blue'} onClick={onClickTeamWrite}>
          수정하기
        </Button>
      </div>
      <CardLayout>
        <div className="prod_info_wrap">
          <div className="card_header">
            <h3 className="ico_title title">팀원</h3>
          </div>
          <div className="team_content">
            <div className="team_inner hope">
              <div className="info_table ">
                <table className="table type03">
                  <caption>계정 정보 테이블</caption>
                  <colgroup>
                    <col width={'3%'} />
                    <col width={'12%'} />
                    <col width={'25%'} />
                    <col width={'60%'} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>이름</th>
                      <th>직급</th>
                      <th>경력</th>
                    </tr>
                  </thead>
                  <tbody>{
                    list?.length > 0
                      ? list.map((item, index) => (
                      <tr key={createKey()}>
                        <td className="number">{index + 1}</td>
                        <td className="name">
                          <div className="name_wrap">
                            <div className="img_wrap">
                              <img src={item.imgUrl ? item.imgUrl : '/images/no_img_user.png'} alt="팀원 이미지" />
                            </div>
                            <div className="text">{item.tmmbNm}</div>
                          </div>
                        </td>
                        <td className="rank">
                          <div className="rank_wrap">{item.tmmbJbcl}</div>
                        </td>
                        <td className="career">
                          <div className="career_wrap">{item.crrCon}</div>
                        </td>
                      </tr>
                      ))
                        : <tr><td colSpan={4}><NoResult msg={'등록된 팀원 정보가 없습니다.'} style={{marginTop: '40px', marginBottom: '40px'}}/></td></tr>
                  }</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </CardLayout>
    </div>
  )
});

export default Member;
