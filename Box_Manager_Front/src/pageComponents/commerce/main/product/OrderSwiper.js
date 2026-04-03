import React, { Fragment } from 'react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { EffectCoverflow, Navigation, Pagination, Autoplay } from 'swiper'
// import { EffectCoverflow, Pagination } from 'swiper/modules'
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import { StringUtils } from 'modules/utils/StringUtils'
import 'assets/style/component/swiper.scss'
import * as commonFn from 'modules/fns/commonFn'

const MainSlider = (props) => {
  const { data, handleAcitveSwipe, maintype } = props
  const playerRefs = useRef([])

  const handleOnReady = (e) => {
    playerRefs.current.push(e.target)
  }
  const handleStopAllVideos = (e) => {
    handleAcitveSwipe(e.realIndex)
    if (playerRefs.current?.length > 0) {
      playerRefs.current.forEach((player) => {
        if (player && player.pauseVideo) {
          player.pauseVideo()
        }
      })
    }
  }

  //배너 제목,내용 컴포넌트
  const ConData = (prop) => {
    if (!StringUtils.hasLength(prop?.data)) {
      return <Fragment></Fragment>
    }

    if (maintype === 'eventBanner') {
      return (
        <Fragment>
          <div className="title">{StringUtils.hasLength(prop.data?.ttl) && <div>{prop.data?.ttl}</div>}</div>
          <div className="content">{StringUtils.hasLength(prop.data?.con) && <div>{prop.data?.con}</div>}</div>
        </Fragment>
      )
    } else {
      let bannerData
      if (commonFn.isInvalidJSON(prop.data.con)) {
        bannerData = JSON.parse(prop.data.con)
      }
      return (
        <Fragment>
          <div className="title">
            {StringUtils.hasLength(bannerData?.ttlTxt1) && <div>{bannerData?.ttlTxt1}</div>}
            {StringUtils.hasLength(bannerData?.ttlTxt2) && <div>{bannerData?.ttlTxt2}</div>}
            {StringUtils.hasLength(bannerData?.ttlTxt3) && <div>{bannerData?.ttlTxt3}</div>}
          </div>
          <div className="content">
            {StringUtils.hasLength(bannerData?.conTxt1) && <div>{bannerData?.conTxt1}</div>}
            {StringUtils.hasLength(bannerData?.conTxt2) && <div>{bannerData?.conTxt2}</div>}
            {StringUtils.hasLength(bannerData?.conTxt3) && <div>{bannerData?.conTxt3}</div>}
          </div>
        </Fragment>
      )
    }
  }

  SwiperCore.use([EffectCoverflow, Navigation, Pagination]) // , Autoplay
  return data?.length > 1 ? (
    <div className="swiper_inner">
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={1.2}
        coverflowEffect={{
          rotate: 40,
          stretch: 0,
          depth: 0,
          modifier: 1,
          sliderShadows: true
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        pagination={{
          type: 'fraction'
        }}
        onSlideChange={(e) => {
          handleStopAllVideos(e)
        }}
        loop={true}
        navigation={true}
        // pagination={{ clickable: true }}
        // modules={[EffectCoverflow, Pagination]} //Autoplay
        className="mySwiper"
      >
        {data?.map((item, index) => (
          <SwiperSlide key={'swiper_slider_' + index}>
            <div className="swiper_content">
              <div className="swiper_content_inner">
                <ConData data={item} />
                <div className="swiper_content_buttonArea"></div>
              </div>
            </div>

            <picture className="img_wrap">
              <img src={item.imgUrlMo} srcSet={item.imgUrl} alt="슬라이드 이미지" />
            </picture>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  ) : (
    <div className="swiper_inner">
      <Swiper
        slidesPerView={1.2}
        centeredSlides={true}
        loop={false}
        navigation={true}
        // modules={[Navigation]}
        className="mySwiper only"
      >
        {data?.map((item, index) => (
          <SwiperSlide key={'swiper_slider_' + index}>
            <div className="swiper_content">
              <div className="swiper_content_inner">
                <ConData data={item} />
                <div className="swiper_content_buttonArea"></div>
              </div>
            </div>
            <picture className="img_wrap">
              <source media="(min-width:1024px)" srcSet={item.imgUrl} />
              <img src={item.imgUrlMo} alt="슬라이드 이미지" />
            </picture>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default MainSlider
