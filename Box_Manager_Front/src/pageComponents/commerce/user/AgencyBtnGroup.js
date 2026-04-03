/*************************
 "COC01001": "요청"
 "COC01002": "대기"
 "COC01003": "승인" - approve
 "COC01004": "반려" - reject
 "COC01005": "취소"(반려취소) - cancel
 "COC01006": "승인취소"(권한해제) - approveCancel
 "COC01007": "취소요청"(해제취소) - cancelRequest
 * ************************* */

import Button from 'components/atomic/Button'

const AgencyBtnGroup = (props) => {
  const { id, selId, status, handleApprove, handleCancelReserve, handleCancel, handleOnClickButton } = props

  const handleClick = (type) => {
    handleOnClickButton(type, id, selId)
  }

  return (
    <div className="status_btn_group">
      {status !== 'COC01001' && (
        <span
          className={`${
            status === 'COC01003' ? 'highlight_blue' : status === 'COC01004' ? 'highlight_red' : 'highlight_light_grey'
          }`}
        >
          {status === 'COC01003' ? '승인' : status === 'COC01004' ? '반려' : '권한해제'}
        </span>
      )}
      <div className="btn_group">
        {status === 'COC01001' && (
          <>
            <Button className={'full_grey'} onClick={() => handleClick('reject')}>
              반려
            </Button>
            <Button className={'full_blue'} onClick={() => handleApprove(id, selId)}>
              승인
            </Button>
          </>
        )}
        {status === 'COC01003' && (
          <Button className="full_grey" onClick={() => handleClick('authCancel')}>
            권한 해제
          </Button>
        )}
        {status === 'COC01004' && (
          <Button className="full_grey" onClick={() => handleCancel(id, selId)}>
            반려 취소
          </Button>
        )}
        {status === 'COC01006' && (
          <Button className="full_grey" onClick={() => handleCancelReserve(id, selId)}>
            해제 취소
          </Button>
        )}
      </div>
    </div>
  )
}

export default AgencyBtnGroup
