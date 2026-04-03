 import {useContext, useEffect, useLayoutEffect, useState} from "react";
import PageLayout from "../../../components/PageLayout";
import Button from "../../../components/atomic/Button";
import PopupConfirm from "../../../components/PopupConfirm";
import {StringUtils} from "../../../modules/utils/StringUtils";
import {
  getGlobalBizDetail,
  getGlobalBizList, updateGlobalBizBranchAdminMemo,
  updateGlobalBizGlobalAdminMemo
} from "../../../modules/consts/GlobalBizApi";
import {UserContext} from "../../../modules/common/UserContext";
import {getNationalName} from "../../../modules/utils/CommonUtils";
import ROUTER_NAMES from "../../../modules/consts/RouterConst";
import {useHistory} from "react-router-dom";

const View = (props) => {

  const history = useHistory()
  const id = props.match.params.id
  const userContext = useContext(UserContext)

  // // 삭제 confirm
  // const [confirmDelete, setConfirmDelete] = useState(false)
  // const handleConfirmDelete = () => {
  //   setConfirmDelete(!confirmDelete)
  // }

  // 신청서 상세 데이터
  const [data, setData] = useState ({})

  const getDetailInfo = async (fnnccnslId) => {
    const res = await getGlobalBizDetail(fnnccnslId);
    if (res.data.code === '200') {
      const detail = res.data.data
      // console.log(detail)
      setData({
        fnnccnslId: detail.fnnccnslId,
        company: detail.cnslEtnm,
        businessNum: detail.bsnnNo,
        entryNation: getNationalName(detail.natlCdHnin),
        entryArea: detail.gnnrloArea,
        entryIndustry: detail.expnTpbsNm,
        currency: detail.crncCd, // CNY, IDR, MMK, USD, JPY, GBP, EUR, VND, INR, PHP, KHR, 기타
        amount: detail.aplcAmtHnin,
        purpose: detail.aplcUsgNm,
        manager: detail.bswrRsprNm,
        contactNum: detail.bswrRsprCnpl,
        email: detail.bswrRsprEml,
        request: detail.cnslAplcCon,
        endpMngrMemo: detail.endpMngrMemo,
        rspbMngrMemo: detail.rspbMngrMemo,
      });
    }
  }

  const updateGlobalAdminComment = async () => {
    const res = await updateGlobalBizGlobalAdminMemo(data.fnnccnslId, data.endpMngrMemo, data.amnnUserId);
      // console.log(res);
    if (res.data.code === '200') {
      const result = res.data.data
      console.log(res);
    }
  }

  const updateBranchAdminComment = async () => {
      // console.log(params);
    const res = await updateGlobalBizBranchAdminMemo(data.fnnccnslId, data.rspbMngrMemo, data.amnnUserId);
    console.log(res);
    // if (res.data.code === '200') {
    //   const result = res.data.data
    //   console.log(result);
    // }
  }

  // useEffect(async () => {
  //
  // }, [userContext.state.userInfo])

  useLayoutEffect( () => {
    if(id) {
      getDetailInfo(id);
    }
  }, []);

  return (
    <PageLayout currentMenu={'global'} currentCate={'localConsult'} currentPage={'applyList'}>

      {/*/!*================ 퍼블확인용 start *!/*/}
      {/*<div className="popup_controller_for_dev">*/}
      {/*  <h4>팝업 목록</h4>*/}
      {/*  <button onClick={handleConfirmDelete}>삭제 컨펌</button>*/}
      {/*</div>*/}
      {/*/!*================ 퍼블확인용 end *!/*/}
      {/*{confirmDelete && <PopupConfirm msg={'삭제하시겠습니까?'} />}*/}

      <div className="content_inner page_apply_view">
        <h4 className="page_title">신청내역</h4>
        <div className="section_header">
          <p className="section_title">신청서 상세</p>
        </div>
        <div className="div_table">
          {/* 기업명, 사업자번호 */}
          <div className='item_section'>
            <div className={'item item_header'}>기업명</div>
            <div className={'item item_cnt'}>{data.company}</div>
            <div className={'item item_header'}>사업자번호</div>
            <div className={'item item_cnt'}>{data.businessNum}</div>
          </div>
          {/* 진출국가, 진출지역 */}
          <div className='item_section'>
            <div className={'item item_header'}>진출&#40;예정&#41;국가</div>
            <div className={'item item_cnt'}>{data.entryNation}</div>
            <div className={'item item_header'}>진출지역</div>
            <div className={'item item_cnt'}>{data.entryArea}</div>
          </div>
          {/* 진출업종 */}
          <div className='item_section'>
            <div className={'item item_header'}>진출업종</div>
            <div className={'item item_cnt w84'}>{data.entryIndustry}</div>
          </div>
          {/* 신청내용 */}
          <div className='item_section'>
            <div className={'item item_header'}>신청금액</div>
            <div className={'item item_cnt w84'}>{data.currency}&nbsp;{data.amount == null ? '0' : Number(data.amount.replaceAll(",", "")).toLocaleString()}</div>
          </div>
          {/* 신청용도 */}
          <div className='item_section'>
            <div className={'item item_header'}>신청용도</div>
            <div className={'item item_cnt w84'}>{data.purpose}</div>
          </div>
          {/* 업무 담당자, 연락처 */}
          <div className='item_section'>
            <div className={'item item_header'}>업무 담당자</div>
            <div className={'item item_cnt'}>{data.manager}</div>
            <div className={'item item_header'}>연락처</div>
            <div className={'item item_cnt'}>{data.contactNum}</div>
          </div>
          {/* 이메일 */}
          <div className='item_section'>
            <div className={'item item_header'}>E-mail</div>
            <div className={'item item_cnt w84'}>{data.email}</div>
          </div>
          {/* 주요 요청사항 */}
          <div className='item_section'>
            <div className={'item item_header align_start'}>상담신청내용</div>
            <div className={'item item_cnt w84 h182 align_start'}>{data.request}</div>
          </div>
          <div className='item_section'>
            <div className={'item item_header align_start'}>글로벌 사업부 메모</div>
            {/*<div className={'item item_cnt w84 h182 align_start'}>{data.endpMngrMemo}</div>*/}
            <div className={'item item_cnt w84 h182 align_start textarea_form'}>
              <textarea className="textarea"
                        value={data.endpMngrMemo ?? ''}
                        onChange={(e) => setData({...data, endpMngrMemo : e.target.value})}
                        title={'글로벌 사업부 관리자 메모'}
                        maxLength={3000}
                        style={{
                          lineHeight: '3.6',
                          width: '90%'
                        }} />
              <Button className={'full_grey'} title={'저장'} onClick={updateGlobalAdminComment} >메모 저장</Button>
            </div>
          </div>
          <div className='item_section'>
            <div className={'item item_header align_start'}>지점 관리자 메모</div>
            {/*<div className={'item item_cnt w84 h182 align_start'}>{data.rspbMngrMemo}</div>*/}
            <div className={'item item_cnt w84 h182 align_start textarea_form'}>
              <textarea className="textarea"
                        value={data.rspbMngrMemo ?? ''}
                        onChange={(e) => setData({...data, rspbMngrMemo : e.target.value})}
                        title={'지점 관리자 메모'}
                        maxLength={3000}
                        style={{
                          lineHeight: '3.6',
                          width: '90%'
                        }} />
              <Button className={'full_grey'} title={'저장'} onClick={updateBranchAdminComment} >메모 저장</Button>
            </div>
            <div>

            </div>
          </div>
        </div>
        <div className="rounded_btn_group">
          <Button className={'basic'} onClick={() => history.push(`${ROUTER_NAMES.GLOBAL_CONSULT_LIST}`)}>목록</Button>
          {/*<Button className={'full_red'}>삭제</Button>*/}
        </div>
      </div>
    </PageLayout>
  )
}

export default View