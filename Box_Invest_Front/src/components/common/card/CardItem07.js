import { useRef } from 'react'
import Badge from 'components/atomic/Badge'
import { useHistory } from 'react-router-dom'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import ConfirmPopup from 'pageComponents/common/pop/ConfirmPopup'
import { exeFunc } from 'modules/utils/ReactUtils'

// TODO : 확인 후 삭제

const CardItem07 = (props) => {
  const history = useHistory()
  const { data } = props
  const editRef = useRef(null)
  const confirmPopupRemoveRef = useRef()
  const inputCopyRef = useRef()
  const handleEditTooltip = () => {
    const classList = editRef.current['classList']
    if (classList.contains('active')) {
      classList.remove('active')
    } else {
      classList.add('active')
    }
  }
  const onDetail = () => {
    // const origin = window.location.origin
    // const url = origin + '/event'
    // window.open(url)
  }
  const onClickModify = () => {
    history.push(ROUTER_NAMES.MY_PAGE_INVESTOR_EXCLUSIVE_WRITE)
  }
  const onClickRemove = () => {
    exeFunc(confirmPopupRemoveRef, 'open', '삭제 하시겠습니까?')
  }
  const onConfirmRemove = () => {
    // console.log('remove')
  }
  const onClickCopyUrl = () => {
    document.addEventListener('copy', copyEventListener)
    document.execCommand('copy')
  }
  const copyEventListener = (event) => {
    const input = inputCopyRef.current
    event.clipboardData.setData('text/plain', input.value)
    event.preventDefault()
    document.removeEventListener('copy', copyEventListener)
  }
  return (
    <>
      <div className="cardItem07">
        <div className="img_wrap">
          <img src={data.image} alt={data.title} onClick={onDetail} />
        </div>
        <div className="card_container">
          <div className="card_txt_wrap">
            <div className="card_header">
              <p className="title">{data.title}</p>
              <div className="edit_wrap" ref={editRef}>
                <button className={'btn_edit'} onClick={handleEditTooltip}>
                  <span className="hide">수정 삭제 버튼</span>
                </button>
                <div className="edit_tooltip">
                  <button className={'button btn_amend'} onClick={onClickModify}>
                    수정하기
                  </button>
                  <button className={'button btn_delete'} onClick={onClickRemove}>
                    삭제하기
                  </button>
                  <button className={'button btn_delete'} onClick={onClickCopyUrl}>
                    URL복사
                  </button>
                </div>
              </div>
            </div>
            <p className="content">{data.content}</p>
          </div>
          <div className="card_bottom">
            <p className="term">
              {data.term.strDate} &#126; {data.term.endDate}
            </p>
            {/* 이벤트 진행 일정일 경우 '진행'으로, 이벤트 진행 일정이 끝난 경우 '종료'로 표시*/}
            <Badge className={'status_ing'}>진행</Badge>
            {/*<Badge className={'status_end'}>종료</Badge>*/}
          </div>
        </div>
      </div>
      <input
        ref={inputCopyRef}
        type={'text'}
        defaultValue={'http://www.daum.net/'}
        style={{ display: 'none' }}
      />
      <ConfirmPopup ref={confirmPopupRemoveRef} onConfirm={onConfirmRemove} />
    </>
  )
}
export default CardItem07
