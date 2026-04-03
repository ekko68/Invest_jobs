/** @jsxImportSource @emotion/react */
import { popupFooterStyle } from 'assets/style/ComponentStyle'

const PopupFooter = (props) => {
    const { children } = props

    return (
        <div className="popup_footer preview_footer" css={popupFooterStyle}>
            {children}
        </div>
    )
}

export default PopupFooter
