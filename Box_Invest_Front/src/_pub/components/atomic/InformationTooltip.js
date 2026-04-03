/** @jsxImportSource @emotion/react */
import { informationTooltipStyle } from 'assets/style/AtomicStyle'

const InformationTooltip = (props) => {
  const { className, id, theme = 'blue', children, onClose, notCloseBtn = false, textWrapOff=false } = props
  // theme = blue || red
  const onClickClose = () => {
    if (onClose) onClose()
  }
  return (
    <div className={`information_tooltip ${className ? className : ''}`} css={informationTooltipStyle(theme)}>
      {
        // 기업 마이페이지 requestDetail 쪽에서 호출하는 경우 text-wrap class가 겹치게 됨.
        textWrapOff
            ? <div>{children}</div>
            : <div className="text_wrap">{children}</div>
      }
      {/*<div className="text_wrap">{children}</div>*/}
      {/*{children}*/}
        {
            !notCloseBtn &&
            <button className="btn btn_close" data-id={id} onClick={onClickClose}>
                <span className="hide">닫기</span>
            </button>
        }
    </div>
  )
}

export default InformationTooltip
