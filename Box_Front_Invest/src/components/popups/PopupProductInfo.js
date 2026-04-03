/** @jsxImportSource @emotion/react */
import { popupLayoutStyle } from 'assets/style/ComponentStyle'
import PopupHeader from 'components/popups/PopupHeader'
import Button from 'components/atomic/Button'
import { popupProdInfoStyle } from 'assets/style/PopupStyle'

// 기업정보_상세정보보기
const PopupProductInfo = (props) => {
  const { handlePopup, imgSrc } = props

  const onPopup = () => {
    if (handlePopup) handlePopup()
  }

  return (
    <div className="popup_wrap popup_product_info" css={[popupLayoutStyle('500px'), popupProdInfoStyle]}>
      <div className="popup_layout">&nbsp;</div>
      <div className="popup_container scroll">
        <PopupHeader title={'제품정보'} handlePopup={onPopup} />
        <div className="prod_info_wrap">
          {imgSrc && (
            <div className="img_wrap">
              <img src={imgSrc.img} alt="" />
              <Button className={'btn_cart'} theme={'#111111'}>
                <span className="hide">장바구니</span>
              </Button>
            </div>
          )}

          <div className="prod_info">
            <p className="name">{imgSrc.name}</p>
            <p className="cont">{imgSrc.content}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PopupProductInfo
