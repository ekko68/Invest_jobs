/* ==========================
 *  기업정보메인 미리보기 팝업
 * ========================== */

import { useEffect } from 'react'

const PopupPreviewCompany = (props) => {
  const { handlePopup, bannerList = [] } = props

  useEffect(() => {
    bannerList.length &&
      setTimeout(() => {
        document.querySelector('.popup_content.preview_main_wrap.scroll').scrollTo(0, 250)
      }, 250)
  }, [])

  return (
    <div className="popup_wrap popup_preview">
      <div className="layer">&nbsp;</div>
      <div className="popup_container ">
        <div className="popup_header">
          <button className={'btn_close'} onClick={handlePopup && handlePopup}>
            <span className="hide">팝업 닫기</span>
          </button>
        </div>
        {/*preview_main_wrap start*/}
        <div className="popup_content preview_main_wrap scroll">
          <div className="preview_company_banner_wrap">
            <img src={require('assets/images/preview_company01.png').default} alt="" />
            <div className="company_banner_inner">
              {/* ================ 업로드된 이미지가 없는 경우*/}
              {/*<div className="no_img">*/}
              {/*  <img src={require('assets/images/no_img.jpg').default} alt="" />*/}
              {/*</div>*/}
              <p className="img_wrap">
                <img src={bannerList[0].fileInfo?.imgUrl} alt={bannerList[0].fileInfo?.fileNm} />
              </p>
            </div>
          </div>
        </div>
        {/*preview_main_wrap end*/}
      </div>
    </div>
  )
}

export default PopupPreviewCompany
