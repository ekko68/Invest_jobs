/** @jsxImportSource @emotion/react */
import { popupHeaderStyle } from 'assets/style/ComponentStyle'
import { CloseBtn, linkBtnStyle } from 'components/atomic/IconButton'

const PopupHeader = (props) => {
  const { title, handlePopup, ...other } = props

  const onPopup = () => {
    if (handlePopup) {
      handlePopup()
    }
  }

  return (
    <div className="popup_header" css={popupHeaderStyle} {...other}>
      <div className="title">{title}</div>
      <CloseBtn onClick={onPopup} />
    </div>
  )
}

export default PopupHeader
