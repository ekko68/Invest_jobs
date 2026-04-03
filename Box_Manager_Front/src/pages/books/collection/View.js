import React, { useContext, useEffect, useState, useRef } from 'react'
import moment from 'moment'
import { useLocation } from 'react-router-dom'

//modules
import * as commonFn from 'modules/fns/commonFn'
import { UserContext } from 'modules/common/UserContext'
import { BooksContext } from 'modules/common/BooksContext'
import { getCollectionDetail, saveCollectionState } from 'modules/consts/BooksApi'

//components
import Select from 'components/atomic/Select'
import PageLayout from 'components/PageLayout'
import PopupConfirm from 'components/PopupConfirm'
import Button from 'components/atomic/Button'
import PopupAlert from 'components/PopupAlert'
import BooksDetail from "pages/books/collection/BooksDetail";
import TaxbillDetail from "pages/books/collection/TaxbillDetail";
import EbillDetail from "pages/books/collection/EbillDetail";
import EbondDetail from "pages/books/collection/EbondDetail";

//const
const stateCodeList = [
  {id: "CLT01001", value: "CLT01001", label: "접수완료"},
  {id: "CLT01002", value: "CLT01002", label: "진행중"},
  {id: "CLT01003", value: "CLT01003", label: "진행완료"},
  {id: "CLT01004", value: "CLT01004", label: "취소"},
]
const actionResultTextList = {
  CLT01001: "접수완료로 변경이 불가합니다.",
  CLT01002: "추심신청이 진행 중 상태로\n변경 처리되었습니다.",
  CLT01003: "추심신청이 진행완료 상태로\n변경 처리되었습니다.",
  CLT01004: "추심신청이 취소되었습니다.",
  FAIL: "오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.",
}

const View = (props) => {

  const userContext = useContext(UserContext)
  const booksContext = useContext(BooksContext)
  const location = useLocation()

  const selectRef= useRef(null);

  const id = props.match.params.id
  let path = location.pathname
  let category = path.split('/')[2]

  const paramsObj = props.location.state

  const [collection, setCollection] = useState({});
  const [clctDetail, setClctDetail] = useState();

  const [selectList, setSelectList] = useState({active: stateCodeList[0]?.id, list: stateCodeList});
  const [popup, setPopup] = useState({active: false, result: false, popupKey: ""});

  const getDetailData = async (params) => {
    const res = await getCollectionDetail(params)

    if (res?.data?.code === '200') {
      let data = res.data.data
      setCollection(data?.collection)
      setClctDetail(data?.clctDetailInfo)
      setSelectList({...selectList, active: data?.collection?.pgrsSttsCd});
    }
  }

  const postChangeState = async (params) => {
    const res = await saveCollectionState(params)

    if(res?.data?.code === "200"){
      setPopup({active: true, result: true, popupKey: popup.popupKey});
    } else {
      setPopup({active: true, result: true, popupKey: "FAIL"});
    }
  }

  useEffect(async()=> {
    await getDetailData({
      utlinsttId: paramsObj.utlinsttId,
      clctAplcId: paramsObj.clctAplcId
    })
  },[])

  const handleChangeStatus = async (id) => {
    switch (id){
      case "CLT01002": //진행중
      case "CLT01003": //처리완료
      case "CLT01004": //취소
        await postChangeState({
          utlinsttId: paramsObj.utlinsttId, //이용기관(회사) ID
          clctAplcId: paramsObj.clctAplcId, //추심 신청 ID
          pgrsSttsCd: id, //진행상태 코드 - CLT01001:접수완료, CLT01002:진행중, CLT01003:처리완료, CLT01004:취소
          amnnUserId: userContext.state?.userInfo?.mngrId // 수정자 ID
        });
        break;
      default: //팝업 취소
        //CLT01001은 선택이 불가하므로 refresh할 필요 없음
        if(popup.result && popup.popupKey != "CLT01001"){
          await getDetailData({
            utlinsttId: paramsObj.utlinsttId,
            clctAplcId: paramsObj.clctAplcId
          })
        }
        setPopup({active: false, result: false, popupKey: ""});
    }
  }

  return (
    <PageLayout currentMenu={'books'} currentCate={'booksCollection'} >

      {popup.active && !popup.result && popup.popupKey === "CLT01002" && (
        <PopupConfirm msg={'추심신청을 진행 중 상태로\n변경하시겠습니까?'}>
          <Button className={'full_grey'} onClick={() => handleChangeStatus("CLOSE")}>
            취소
          </Button>
          <Button className={'full_blue'} onClick={() => handleChangeStatus(popup.popupKey)}>
            확인
          </Button>
        </PopupConfirm>
      )}

      {/** 팝업: 진행완료 **/}
      {popup.active && !popup.result && popup.popupKey === "CLT01003" && (
        <PopupConfirm msg={'추심신청을 진행완료 상태로\n변경하시겠습니까?'}>
          <Button className={'full_grey'} onClick={() => handleChangeStatus("CLOSE")}>
            취소
          </Button>
          <Button className={'full_blue'} onClick={() => handleChangeStatus(popup.popupKey)}>
            확인
          </Button>
        </PopupConfirm>
      )}

      {/** 팝업: 취소 **/}
      {popup.active && !popup.result && popup.popupKey === "CLT01004" && (
        <PopupConfirm msg={'추심신청을 취소하시겠습니까?\n취소 처리하는 경우 변경이 불가하며\n다시 추심을 진행하려면 회원이 다시\n추심신청을 진행해야 합니다.'}>
          <Button className={'full_grey'} onClick={() => handleChangeStatus("CLOSE")}>
            취소
          </Button>
          <Button className={'full_blue'} onClick={() => handleChangeStatus(popup.popupKey)}>
            확인
          </Button>
        </PopupConfirm>
      )}

      {/** 팝업: 결과 **/}
      {popup.active && popup.result && (
        <PopupAlert msg={actionResultTextList[popup.popupKey]}
                    handlePopup={()=> handleChangeStatus("CLOSE")} />
      )}

      <div className='content_inner page_books_collection'>
        <div className='page_header'>
          <h4 className='page_title'>추심관리</h4>
        </div>

        {/*** 장부명세서, 세금계산서, 어음, 채권 공통 start */}
        <div className='collection_view_section'>
          <div className='view_title'>신청정보</div>
          <div className="section">
            <table className="table">
              <caption>신청정보 테이블</caption>
              <colgroup>
                <col width="15%" />
                <col width="35%" />
                <col width="15%" />
                <col width="35%" />
              </colgroup>
              <tbody>
              <tr>
                <th>추심담당기관</th>
                <td colSpan={3}>{collection?.clctInttCdNm || '-'}</td>
              </tr>
              <tr>
                <th>신청기업</th>
                <td>{collection?.etnm || '-'}</td>
                <th>사업자번호</th>
                <td>{collection?.bzn && collection?.bzn !== '' ? commonFn.formatBusinessNumber(collection?.bzn.trim()) : '-'}</td>
              </tr>
              <tr>
                <th>신청인</th>
                <td>{collection?.aplcNm || '-'}</td>
                <th>연락처</th>
                <td>{collection?.aplcMoblphonNo && collection?.aplcMoblphonNo !== '' ? commonFn.formatPhoneNumber(collection?.aplcMoblphonNo.trim()) : '-'}</td>
              </tr>
              <tr>
                <th>신청일</th>
                <td>{collection?.rgsnDt && collection?.rgsnDt !== '' ? moment(collection?.rgsnDt).format('YYYY-MM-DD') : '-'}</td>
                <th>신청상태</th>
                <td className={collection?.pgrsSttsCd === "CLT01004" ? "collection_cancel" : ""}>
                  {
                    collection?.pgrsSttsCd === "CLT01004" ? (
                      `${stateCodeList.filter((el) => el.id === collection?.pgrsSttsCd)[0]?.label}`
                    ) : (
                      <Select ref={selectRef}
                              optionList={selectList}
                              handleSelectActive={(id) => {
                                if(id === "CLT01001") {
                                  setPopup({active: true,  result: true, popupKey: id})
                                } else {
                                  setPopup({...popup, active: true, popupKey: id})
                                }
                              }} />
                    )
                  }
                </td>
              </tr>
              <tr>
                <th>거래종류</th>
                <td colSpan={3}>{collection?.aplcPtrnCdNm || '-'}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/*** 장부명세서, 세금계산서, 어음, 채권 공통 end */}

        <>
          {/***********장부(거래)명세서 start*/}
          {
            collection?.aplcPtrnCd === 'CLT00001' && clctDetail &&
            <BooksDetail clctDetail={clctDetail}/>
          }
          {/***********장부(거래)명세서 end*/}

          {/***********세금계산서 start*/}
          {
            collection?.aplcPtrnCd === 'CLT00002' && clctDetail &&
            <TaxbillDetail clctDetail={clctDetail}/>
          }
          {/***********세금계산서 end*/}

          {/***********어음 start*/}
          {
            collection?.aplcPtrnCd === 'CLT00003' && clctDetail &&
            <EbillDetail clctDetail={clctDetail} />
          }
          {/***********어음 end*/}

          {/***********채권 start*/}
          {
            collection?.aplcPtrnCd === 'CLT00004' && clctDetail &&
            <EbondDetail clctDetail={clctDetail} />
          }
          {/***********채권 end*/}
        </>

      </div>
    </PageLayout>
  )
}

export default View
