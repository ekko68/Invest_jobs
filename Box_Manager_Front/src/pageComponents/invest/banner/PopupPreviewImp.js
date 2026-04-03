/* ==========================
 *  투자사 마이페이지 미리보기 팝업
 * ========================== */

import Button from 'components/atomic/Button'
import { useEffect } from 'react'

const PopupPreviewImp = (props) => {
  const { handlePopup, bannerList = [] } = props

  /** link button click handle */
  const windowOpen = (url) => window.open(url, 'blank')

  useEffect(() => {
    bannerList.length &&
      setTimeout(() => {
        document.querySelector('.popup_content.preview_main_wrap.scroll').scrollTo(0, 500)
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
          <div className="preview_mp_banner_wrap">
            <img src={require('assets/images/preview_investor_mypage.png').default} alt="" />
            <div className="mp_banner_inner">
              <div className="img_wrap">
                <div className="preview_banner_wrap">
                  <div className="banner_inner">
                    {bannerList
                      .filter((banner) => banner.expuYn === 'Y')
                      .map((banner, idx) => (
                        <div
                          className="bannerItem01"
                          style={{ background: `url(${banner.fileInfo.imgUrl}) 0 center no-repeat` }}
                          key={'preview_imp_img_' + idx}
                        >
                          <div className="container">
                            <p className="content">{banner.bnnrPhrsCon}</p>
                            <Button className={idx === 0 ? 'full_dark_blue' : 'full_blue'}>{banner.btnPhrsCon}</Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*preview_main_wrap end*/}
      </div>
    </div>
  )
}

export default PopupPreviewImp
