import { forwardRef, useRef } from 'react'
import Badge from 'components/atomic/Badge'
import ConfirmPopup from 'pageComponents/common/pop/ConfirmPopup'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { exeFunc } from 'modules/utils/ReactUtils'
import { useHistory } from 'react-router-dom'
import { AlertLabels, CheckYn } from 'modules/consts/BizConst'

const EventCard = forwardRef((props, ref) => {
  const { data, onRemove } = props
  const history = useHistory()
  const inputCopyRef = useRef()
  const confirmPopupRemoveRef = useRef()
  const editRef = useRef()
  const handleEditTooltip = () => {
    const classList = editRef.current['classList']
    if (classList.contains('active')) {
      classList.remove('active')
    } else {
      classList.add('active')
    }
  }
  const onClickModify = () => {
    handleEditTooltip()
    const url = ROUTER_NAMES.MY_PAGE_INVESTOR_EXCLUSIVE_WRITE + '?invmCmpExusPageId=' + data['invmCmpExusPageId']
    history.push(url)
  }
  const onClickRemove = () => {
    handleEditTooltip()
    exeFunc(confirmPopupRemoveRef, 'open', AlertLabels.askDelete)
  }
  const onConfirmRemove = () => {
    if (onRemove) {
      onRemove(data)
    }
  }
  const onClickCopyUrl = () => {
    document.addEventListener('copy', copyEventListener)
    document.execCommand('copy')
    handleEditTooltip()
  }
  const copyEventListener = (event) => {
    const input = inputCopyRef.current
    // const prefixUrl = 'http://devinvest.ibkbox.net:6301'
    const prefixUrl = process.env.REACT_APP_URL
    const url = prefixUrl + '/event?invmCmpExusPageId=' + input.value
    event.clipboardData.setData('text/plain', url)
    event.preventDefault()
    document.removeEventListener('copy', copyEventListener)
  }
  const getImage = () => {
    if (data) {
      if (data['imgUrl'] === null || data['imgUrl'] === undefined || String(data['imgUrl']).trim() === '') {
        return (
          <img
            src={require('assets/images/no_img.jpg').default}
            alt="이미지가 없습니다"
            onClick={onClickOpenEvent}
            style={{ cursor: 'pointer' }}
          />
        )
      } else {
        return (
          <img src={data['imgUrl']} alt={data['pageTtl']} onClick={onClickOpenEvent} style={{ cursor: 'pointer' }} />
        )
      }
    } else {
      return (
        <img
          src={require('assets/images/no_img.jpg').default}
          alt="이미지가 없습니다"
          onClick={onClickOpenEvent}
          style={{ cursor: 'pointer' }}
        />
      )
    }
  }
  const onClickOpenEvent = () => {
    const url = ROUTER_NAMES.EVENT + '?invmCmpExusPageId=' + data['invmCmpExusPageId']
    window.open(url)
  }
  return (
    <>
      <div className="cardItem07">
        <div className="img_wrap">
          {/*<img src={data.image} alt={data['pageTtl']} onClick={onDetail} />*/}
          {getImage()}
        </div>
        <div className="card_container">
          <div className="card_txt_wrap">
            <div className="card_header">
              <p className="title" onClick={onClickOpenEvent} style={{ cursor: 'pointer' }}>
                {data['pageTtl']}
              </p>
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
            <p className="content" onClick={onClickOpenEvent} style={{ cursor: 'pointer' }}>
              {data['pageCon']}
            </p>
          </div>
          <div className="card_bottom">
            <p className="term">
              {/*{data.term.strDate} &#126; {data.term.endDate}*/}
              {/*{'2022-03-10'} &#126; {'2022-04-10'}*/}
            </p>
            {/* 이벤트 진행 일정일 경우 '진행'으로, 이벤트 진행 일정이 끝난 경우 '종료'로 표시*/}
            {data['ongoingYn'] === CheckYn.YES ? (
              <Badge className={'status_ing'}>진행</Badge>
            ) : (
              <Badge className={'status_end'}>종료</Badge>
            )}
          </div>
        </div>
      </div>
      <input
        ref={inputCopyRef}
        type={'text'}
        title="페이지 URL"
        defaultValue={data['invmCmpExusPageId']}
        style={{ display: 'none' }}
      />
      <ConfirmPopup ref={confirmPopupRemoveRef} onConfirm={onConfirmRemove} />
    </>
  )
})
export default EventCard
