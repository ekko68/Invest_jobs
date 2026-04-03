/** @jsxImportSource @emotion/react */
import { popupLayoutStyle } from 'assets/style/ComponentStyle'
import { linkBtnStyle } from 'components/atomic/IconButton'

const PopupLayout = (props) => {
  const { width = '500px', height = '349px', children, ...other } = props

  const onPopup = () => {
    if (props.handlePopup) {
      props.handlePopup()
    }
  }

  return (
    <div className="popup_wrap" css={popupLayoutStyle(width, height)} {...other}>
      <div className="popup_layout" onClick={onPopup}>
        &nbsp;
      </div>
      <div className="popup_container">{children}</div>
    </div>
  )
}

export default PopupLayout
