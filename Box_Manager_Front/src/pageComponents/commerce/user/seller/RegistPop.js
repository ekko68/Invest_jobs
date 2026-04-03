import Button from 'components/atomic/Button'
import { useContext, useRef } from 'react'
import { StringUtils } from 'modules/utils/StringUtils'
import { MktContext } from 'modules/common/MktContext'
import CompanyPofile from 'pageComponents/commerce/common/CompanyPofile'

const RegistPop = (props) => {
  const mktContext = useContext(MktContext)
  const { detail, submitData, handleSubmitData, handleSellerPopup, handleConfirmDeprive, handleConfirmDepriveCancel } =
    props
  const mmbrsttsConRef = useRef(null)

  const chackInputData = async () => {
    if (StringUtils.hasLength(submitData.mmbrsttsCon) > 0) {
      handleConfirmDeprive({ active: false })
    } else {
      await mktContext.actions.setCommonAlertInfo({
        type: 'function1Btn',
        active: true,
        msg: '권한 박탈 기업을 확인하고 사유를 입력해주세요.',
        action: () => {
          mmbrsttsConRef.current.focus()
        }
      })
      return false
    }
  }

  const handlerCancle = () => {
    if (detail.mmbrsttsId === 'AUA01001') {
      mktContext.actions.setCommonAlertInfo({
        type: 'function',
        active: true,
        msg: '권한 박탈을 취소 하시겠습니까??',
        btnMsg: '취소',
        btnMsg2: '확인',
        action2: () => {
          handleSellerPopup({ active: false })
        }
      })
    } else if (detail.mmbrsttsId === 'AUA01002') {
      handleSellerPopup({ active: false })
    }
  }

  return (
    <div className="popup_wrap popup_corporate">
      <div className="layer">&nbsp;</div>
      <div className="popup_container">
        <div className="popup_content scroll">
          <div className="popup_main_header">
            <div className="title">판매사 권한 박탈</div>
            <Button
              className="popup_close_button"
              aria-label="팝업 닫기"
              onClick={() => {
                handlerCancle()
              }}
            />
          </div>

          <CompanyPofile selrUsisId={detail.selrUsisId} />

          <div className="popup_title_m">박탈 사유</div>
          <textarea
            className="textarea"
            placeholder="박탈 사유를 입력해주세요."
            maxLength={100}
            id={'mmbrsttsCon'}
            name={'mmbrsttsCon'}
            title="박탈 사유"
            ref={mmbrsttsConRef}
            value={submitData.mmbrsttsCon || ''}
            onChange={handleSubmitData}
            readOnly={detail.mmbrsttsId === 'AUA01002' ? true : false}
          />

          <div className="rounded_btn_group">
            {detail.mmbrsttsId === 'AUA01002' ? (
              <Button
                className={'full_blue'}
                onClick={() => {
                  handleConfirmDepriveCancel({ active: false, selrUsisId: detail.selrUsisId })
                }}
              >
                판매 자격 복구
              </Button>
            ) : (
              ''
            )}

            <Button className={'basic'} onClick={() => handlerCancle()}>
              닫기
            </Button>

            {detail.mmbrsttsId === 'AUA01001' ? (
              <Button className={'full_blue'} onClick={() => chackInputData()}>
                판매 권한 박탈
              </Button>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegistPop
