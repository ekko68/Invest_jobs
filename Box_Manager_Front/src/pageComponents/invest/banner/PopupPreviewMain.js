/* ==========================
 *  투자메인 미리보기 팝업
 * ========================== */

import Button from 'components/atomic/Button'
import { useEffect } from 'react'
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'

const PopupPreviewMain = (props) => {
  const { handlePopup, mainGallery = [], bannerList = [] } = props
  SwiperCore.use([Navigation, Pagination, Autoplay])

  /** link button click handle */
  const windowOpen = (url) => window.open(url, 'blank')

  useEffect(() => {
    bannerList.length &&
      setTimeout(() => {
        document.querySelector('.popup_content.preview_main_wrap.scroll').scrollTo(0, 900)
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
          <div className="preview_main_inner">
            <div className="preview_img_top">
              <img
                className={'preview_img_top01'}
                src={require('assets/images/preview_main01_01.png').default}
                alt=""
              />
              <img
                className={'preview_img_top02'}
                src={require('assets/images/preview_main01_02.png').default}
                alt=""
              />
              {/*preview_swiper_wrap start*/}
              <div className="preview_swiper_wrap">
                <div className="main_gallery_wrap">
                  {/* ================ 업로드된 이미지가 없는 경우*/}
                  {/*<div className="no_img">*/}
                  {/*  <img src={require('assets/images/no_img.jpg').default} alt="이미지없음" />*/}
                  {/*</div>*/}
                  <Swiper
                    pagination={{ clickable: true }}
                    className="mySwiper"
                    autoplay={{ delay: '1000', disableOnInteraction: false }}
                  >
                    {mainGallery
                      .filter((banner) => banner.expuYn === 'Y')
                      .map((banner, idx) => (
                        <SwiperSlide key={'main_slider_' + idx}>
                          <div className="main_gallery_item">
                            <div className="img_wrap">
                              <img src={banner.fileInfo.imgUrl} alt={banner.bnnrPhrsCon} />
                            </div>
                            <div className="gallery_content">
                              <div className="gallery_inner">
                                {banner.bnnrPhrsCon && (
                                  <p className="title">{banner.bnnrPhrsCon.replaceAll('<br/>', '\n')}</p>
                                )}
                                {banner.btnPhrsCon && (
                                  <div className="btn_group">
                                    <button className="full_blue" onClick={() => windowOpen(banner.bnnrLnknUrl)}>
                                      {banner.btnPhrsCon}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                  </Swiper>
                </div>
              </div>
              {/*preview_swiper_wrap end*/}
            </div>
            <div className="preview_img_bottom">
              {/*<img className="tmp" src={require('assets/images/preview_main02.png').default} alt="" />*/}
              <img
                className={'preview_img_bottom01'}
                src={require('assets/images/preview_main02_01.png').default}
                alt=""
              />
              {/*preview_banner_wrap start*/}
              <div className="preview_banner_wrap">
                <div className="banner_inner">
                  {/* ================ 업로드된 이미지가 없는 경우*/}
                  {/*<div className="no_img">*/}
                  {/*  <img src={require('assets/images/no_img.jpg').default} alt="이미지 없음" />*/}
                  {/*</div>*/}
                  {/*<div className="no_img">*/}
                  {/*  <img src={require('assets/images/no_img.jpg').default} alt="이미지 없음" />*/}
                  {/*</div>*/}

                  {bannerList
                    .filter((banner) => banner.expuYn === 'Y')
                    .map((banner, idx) => (
                      <div
                        className="bannerItem01"
                        style={{ background: `url(${banner?.fileInfo?.imgUrl}) 0 center no-repeat` }}
                        key={'preview_bottom_banner_' + idx}
                      >
                        <div className="container">
                          <p className="content">{banner.bnnrPhrsCon}</p>
                          {banner.bnnrLnknUrl && (
                            <Button
                              className={idx === 0 ? 'full_dark_blue' : 'full_blue'}
                              onClick={() => windowOpen(banner.bnnrLnknUrl)}
                            >
                              {banner.btnPhrsCon === '' ? '더보기' : banner.btnPhrsCon}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              {/*preview_banner_wrap end*/}
              <img
                className={'preview_img_bottom02'}
                src={require('assets/images/preview_main02_02.png').default}
                alt=""
              />
            </div>
          </div>
        </div>
        {/*preview_main_wrap end*/}
      </div>
    </div>
  )
}

export default PopupPreviewMain
