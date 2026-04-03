import React, {useContext, useEffect, useState} from 'react'
import { useParams, useHistory } from 'react-router-dom'

//modules
import {getMemberClubCodeList, getMemberDetail, getMemberVentureCodeList, saveMemberBadge} from 'modules/consts/MainApi'
import { MainContext } from 'modules/common/MainContext'
import * as commonFn from "modules/fns/commonFn";

//components
import Checkbox from 'components/atomic/Checkbox'
import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import PopupConfirm from 'components/PopupConfirm'
import PopupAlert from 'components/PopupAlert'

//const
const codeClubImgList = {
  QFN00000: "honor", //명예의전당
  QFN00001: "best", //최고경영자클럽
  QFN00002: "woman", //여성경영자클럽
  QFN00003: "future", //미래경영자클럽
}

const View = () => {

  const mainContext = useContext(MainContext)
  const history = useHistory()
  const {id} = useParams();

  const [memberDetail, setMemberDetail] = useState({
    clubQualificationList: [],
    ventureQualificationList: [],
  });
  const [codeClub, setCodeClub] = useState([]) //클럽인증
  const [codeVenture, setCodeVenture] = useState([]) //벤쳐인증
  const [popup, setPopup] = useState({active: false, type: null})

  useEffect(async () => {
    if(id) {
      //회원상세
      let res = await getMemberDetail({utlinsttId: id});
      if (res.data?.code === "200") {
        setMemberDetail({
          ...res.data.data,
          clubQualificationList: res.data.data.clubQualificationList.map((el) => el.crtcPtrnCd),
          ventureQualificationList: res.data.data.ventureQualificationList.map((el) => el.crtcPtrnCd),
        });
      } else {
        setPopup({active: true, type: "ERROR"});
      }

      //클럽인증
      let clubRes = await getMemberClubCodeList(mainContext.state.memberListParam);
      if (clubRes.data?.code === '200') setCodeClub(clubRes.data.data?.list);

      //벤쳐인증
      let ventureRes = await getMemberVentureCodeList(mainContext.state.memberListParam);
      if (ventureRes.data?.code === '200') setCodeVenture(ventureRes.data.data?.list);
    }
  }, [id])

  // checkbox
  const handleBadgeCheckbox = (e, type) => {
    let updateList = memberDetail[type];

    let isExist = updateList.filter((el) => el === e.target.id);
    if(isExist.length > 0){
      updateList = updateList.filter((el) => el != e.target.id);
    } else {

      //클럽인증일 경우 최고경영자클럽, 여성경영자클럽, 미래경영자클럽은 택 1만 가능
      if(type === "clubQualificationList" && e.target.id != "QFN00000"){
        updateList = updateList.filter((el) => el === "QFN00000");
      }
      updateList.push(e.target.id);

    }

    setMemberDetail({...memberDetail, [type]: updateList});
  }

  const handleSave = async () => {
    let saveRes = await saveMemberBadge({
      ...memberDetail,
      utlinsttId: id
    });
    if(saveRes.data.code === "200"){
      setPopup({active: true, type: "SUCCESS"});
    } else {
      setPopup({active: true, type: "FAIL"});
    }
  }

  return (
    <PageLayout currentMenu={'mainBox'} currentCate={'mainMember'} >

      {popup.active && popup.type === "SAVE" && (
        <PopupConfirm msg={'수정된 내역을 저장하시겠습니까?'}>
          <Button className={'full_grey'} onClick={() => setPopup({active: false, type: null})}>
            취소
          </Button>
          <Button className={'full_blue'} onClick={handleSave} >
            확인
          </Button>
        </PopupConfirm>
      )}

      {popup.active && popup.type === "ERROR" && (
        <PopupAlert msg={'오류가 발생했습니다.\n잠시 후 다시 시도해주세요.'}
                    handlePopup={() => history.goBack()} />
      )}

      {popup.active && popup.type === "SUCCESS" && (
        <PopupAlert msg={'수정된 내역이 저장되었습니다.'}
                    handlePopup={() => history.goBack()} />
      )}

      {popup.active && popup.type === "FAIL" && (
        <PopupAlert msg={'저장에 실패했습니다.\n잠시 후 다시 시도해주세요.'}
                    handlePopup={() => setPopup({active: false, type: null})} />
      )}

      <div className='content_inner page_member'>
        <div className='page_header'>
          <h4 className='page_title'>회원사정보 상세</h4>
        </div>
        <div className='member_view_section'>
          <div className="section">
            <table className="table">
              <caption>회원사정보 상세 테이블</caption>
              <colgroup>
                <col width="15%" />
                <col width="35%" />
                <col width="15%" />
                <col width="35%" />
              </colgroup>
              <tbody>
              <tr>
                <th>회사명</th>
                <td colSpan={3}>{memberDetail?.etnm?.trim() || "-"}</td>
              </tr>
              <tr>
                <th>구분</th>
                <td>법인(없음)</td>
                <th>사업자번호</th>
                <td>{memberDetail?.bzn ? commonFn.formatBusinessNumber(memberDetail.bzn) : "-"}</td>
              </tr>
              <tr>
                <th>대표자명</th>
                <td>{memberDetail?.rpprNm || "-"}</td>
                <th>정회원등록여부</th>
                <td>YN(없음)</td>
              </tr>
              <tr>
                <th>CEO인증여부</th>
                <td>{memberDetail?.ceoCrtcTs != null ? "Y" : "N"}</td>
                <th>업력</th>
                <td>15년 미만(없음)</td>
              </tr>
              <tr>
                <th>매출</th>
                <td>100억원 이상(없음)</td>
                <th>수출입액</th>
                <td>200만불 이하(없음)</td>
              </tr>
              <tr>
                <th>클럽인증</th>
                <td colSpan={3}>
                  <div className='auth_list'>
                    {
                      codeClub?.map((club) => {
                        let itemValue = {
                          id: club.id,
                          value: club.value,
                          src: codeClubImgList[club.id]
                        };
                        return (
                          <Checkbox
                            key={club.id}
                            checkbox={itemValue}
                            onChange={(e) => handleBadgeCheckbox(e,'clubQualificationList')}
                            checked={memberDetail.clubQualificationList?.includes(club.id)}
                          />
                        )
                      })
                    }
                  </div>
                </td>
              </tr>
              <tr>
                <th>벤처인증</th>
                <td colSpan={3}>
                  <div className='auth_list'>
                    {
                      codeVenture?.map((venture) => {
                        let itemValue = {id: venture.id, value: venture.value};
                        return (
                          <Checkbox
                            key={venture.id}
                            checkbox={itemValue}
                            onChange={(e) => handleBadgeCheckbox(e,'ventureQualificationList')}
                            checked={memberDetail.ventureQualificationList?.includes(venture.id)}
                          />
                        )
                      })
                    }
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="rounded_btn_group">
          <Button className={'basic'} onClick={() => history.goBack()}>
            목록
          </Button>
          <Button className={'full_blue'} onClick={() => setPopup({active: true, type: "SAVE"})}>
            등록
          </Button>
        </div>
      </div>
    </PageLayout>
  )
}

export default View
