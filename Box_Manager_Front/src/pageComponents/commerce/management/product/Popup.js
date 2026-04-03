import React, { useState, useContext, useRef, Fragment } from 'react'
import Button from 'components/atomic/Button'
import { StringUtils } from 'modules/utils/StringUtils'
import { MktContext } from 'modules/common/MktContext'
import ProdDetail from './ProdDetail'
const Popup = (props) => {
  /*========================================================================================
   * 변수 및 state 선언
   *========================================================================================*/
  const mktContext = useContext(MktContext)
  const { data, handleUpdateStopSell, handleProductPopupClose } = props
  const pdfSttsConRef = useRef(null)

  let params = {
    pdfSttsId: '', // 상품 상태 ID
    pdfInfoId: '', // 상품 정보 ID
    pdfSttsCon: '' // 상품 상태 사유
  }

  const [textArea, setTextArea] = useState({
    pdfSttsCon: data.data.pdfSttsCon
  })

  /*========================================================================================
   * 확인, 취소, 닫기 , 판매중지취소 , 사유입력 이벤트
   *========================================================================================*/
  // "확인" 버튼 이벤트
  const handleStopSell = async () => {
    if (StringUtils.hasLength(textArea.pdfSttsCon) > 0) {
      params = {
        selrUsisId: data.data.selrUsisId, // 이용기관 ID
        pdfSttsId: data.data.pdfSttsId, // 상품 상태 ID
        pdfInfoId: data.data.pdfInfoId, // 상품 정보 ID
        pdfSttsCon: textArea.pdfSttsCon // 상품 상태 사유
      }
      handleUpdateStopSell(params)
    } else {
      await mktContext.actions.setCommonAlertInfo({
        type: 'function1Btn',
        active: true,
        msg: '판매 중지 사유를 입력해주세요.',
        action: () => {
          pdfSttsConRef.current.focus()
        }
      })
      return false
    }
  }

  const handleTextArea = (e) => {
    setTextArea({
      pdfSttsCon: e.currentTarget.value
    })
  }

  // "판매중지취소" 버튼 이벤트
  const handleStopSellCancle = async () => {
    if (data.data.mmbrsttsId === 'AUA01001') {
      params = {
        pdfSttsId: data.data.pdfSttsId, // 상품 상태 ID
        pdfInfoId: data.data.pdfInfoId, // 상품 정보 ID
        pdfSttsCon: '' // 상품 상태 사유
      }
      handleUpdateStopSell(params)
    } else if (data.data.mmbrsttsId === 'AUA01002') {
      await mktContext.actions.setCommonAlertInfo({
        type: 'function1Btn',
        active: true,
        msg: '판매자 권한이 박탈 된 업체 상품입니다.\n 판매자 권환 회복 후 재시도바랍니다.'
      })
      return false
    }
  }

  // "취소","닫기" 버튼 이벤트
  const handleConfirmCancle = async () => {
    if (data.data.pdfSttsId === 'GDS00005') {
      handleProductPopupClose()
    } else {
      // 상태가 "관리자 판매중단" 이 아닐 경우
      mktContext.actions.setCommonAlertInfo({
        type: 'function',
        active: true,
        msg: '판매 중지를 취소하시겠습니까?',
        btnMsg: '취소',
        btnMsg2: '확인',
        action2: () => {
          handleProductPopupClose()
        }
      })
    }
  }

  return (
    <div className="popup_wrap popup_product">
      <div className="layer">&nbsp;</div>
      <div className="popup_container">
        <div className="popup_content scroll">
          <div className="popup_main_header">
            <div className="title">판매 중지</div>
            <Button className="popup_close_button" aria-label="팝업 닫기" onClick={handleConfirmCancle} />
          </div>
          <div className="popup_title_m">상품 정보</div>

          <ProdDetail data={data.data} />

          <div className="popup_title_m">판매 중지 사유</div>
          <textarea
            className="textarea"
            placeholder="판매 중지 사유를 입력해주세요."
            maxLength={100}
            id={'pdfSttsCon'}
            name={'pdfSttsCon'}
            ref={pdfSttsConRef}
            title="판매 중지 사유"
            value={textArea.pdfSttsCon || ''}
            onChange={handleTextArea}
            readOnly={data.data.pdfSttsId === 'GDS00005' ? true : false}
          />

          <div className="rounded_btn_group">
            {data.data.pdfSttsId === 'GDS00005' ? (
              <Fragment>
                <Button className={'basic'} onClick={handleConfirmCancle}>
                  닫기
                </Button>
                <Button className={'full_blue'} onClick={handleStopSellCancle}>
                  판매 중지 취소
                </Button>
              </Fragment>
            ) : (
              <Fragment>
                <Button className={'basic'} onClick={handleConfirmCancle}>
                  취소
                </Button>
                <Button className={'full_blue'} onClick={handleStopSell}>
                  확인
                </Button>
              </Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Popup
