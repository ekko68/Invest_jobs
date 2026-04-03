import React from "react"
import { useHistory } from 'react-router-dom'
import moment from "moment"

//modules
import ROUTER_NAMES from 'modules/consts/RouterConst'
import * as commonFn from "modules/fns/commonFn";

//const
const codeClubImgList = { //클럽인증 뱃지 아이콘 이미지
  QFN00000: require('assets/images/ico_honor.png').default, //명예의전당
  QFN00001: require('assets/images/ico_best.png').default, //최고경영자클럽
  QFN00002: require('assets/images/ico_woman.png').default, //여성경영자클럽
  QFN00003: require('assets/images/ico_future.png').default, //미래경영자클럽
}

const MemberListItem = (props) => {

  const { item } = props;

  const history = useHistory();

  return (
    <tr onClick={() => history.push(`${ROUTER_NAMES.MAIN_MEMBER_VIEW}/${item.utlinsttId}`)}>
      <td>{item?.etnm?.trim() || "-"}</td>
      <td>법인(없음)</td>
      <td>{item.bzn ? commonFn.formatBusinessNumber(item.bzn) : "-"}</td>
      <td>{item.rpprNm || "-"}</td>
      <td>Y N(없음)</td>
      <td>{item.ceoCrtcTs != null ? "Y" : "N"}</td>
      <td>
        <div className='auth_wrap'>
          {
            item.clubQualificationList?.map((club) => (
              <div className='auth_item' key={club?.crtcPtrnCd} style={{justifyContent: 'center'}}>
                <img src={codeClubImgList[club?.crtcPtrnCd]} alt={club?.crtcPtrnNm}/>
                {club?.crtcPtrnNm}
              </div>
            ))
          }
        </div>
      </td>
      <td>
        {
          item.ventureQualificationList?.map((venture) => (
            <div className='auth_item' key={venture?.crtcPtrnCd}>
              {venture?.crtcPtrnNm}
            </div>
          ))
        }
      </td>
      <td>3년(없음)</td>
      <td>3억원(없음)</td>
      <td>10만불(없음)</td>
    </tr>
  )
}

export default MemberListItem
