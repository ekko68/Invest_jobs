import React from 'react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { EffectCoverflow, Navigation, Pagination, Autoplay } from 'swiper'
// import { EffectCoverflow, Pagination } from 'swiper/modules'
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'

import 'assets/style/component/swiper.scss'

const MainSlider = (props) => {
  const { data } = props
  const playerRefs = useRef([])

  const handleOnReady = (e) => {
    playerRefs.current.push(e.target)
  }
  const handleStopAllVideos = () => {
    if (playerRefs.current?.length > 0) {
      playerRefs.current.forEach((player) => {
        if (player && player.pauseVideo) {
          player.pauseVideo()
        }
      })
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
        onSlideChange={() => {
          handleStopAllVideos()
        }}
        loop={true}
        navigation={true}
        // pagination={{ clickable: true }}
        modules={[EffectCoverflow, Pagination]} //Autoplay
        className="mySwiper"
      >
        {data?.map((item, index) => (
          <SwiperSlide key={'swiper_slider_' + index}>
            <div className="swiper_content">
              <div className="swiper_content_inner">
                <p className="title">
                  가장 진화된 금융으로
                  <br />
                  기업을 앞으로
                </p>
                <p className="content">
                  가장 진화된 금융으로 기업을 앞으로!
                  <br /> 홍보관BOX에서 관리해 보세요.
                </p>
                <div className="swiper_content_buttonArea">
                  <Link to={'#'} target="_blank">
                    시작하기
                  </Link>
                </div>
              </div>
            </div>
            {item?.fileType === 'video' ? (
              <video className="img_wrap" poster={item.videoPoster} playsInline autoPlay loop>
                <source src={item.mp4Url} type="video/mp4" />
                브라우저가 video 태그를 지원하지 않을 때 이 문장이 노출됩니다.
              </video>
            ) : (
              <picture className="img_wrap">
                <source media="(min-width:1024px)" srcSet={item.imgUrlPc} />
                <img src={item.imgUrlMo} alt="슬라이드 이미지" />
              </picture>
            )}
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
        modules={[Navigation]}
        className="mySwiper only"
      >
        {data?.map((item, index) => (
          <SwiperSlide key={'swiper_slider_' + index}>
            <div className="swiper_content">
              <div className="swiper_content_inner">
                <p className="title">
                  가장 진화된 금융으로
                  <br />
                  기업을 앞으로
                </p>
                <p className="content">
                  가장 진화된 금융으로 기업을 앞으로!
                  <br /> 홍보관BOX에서 관리해 보세요.
                </p>
                <div className="swiper_content_buttonArea">
                  <Link to={'#'} target="_blank">
                    시작하기
                  </Link>
                </div>
              </div>
            </div>
            <picture className="img_wrap">
              <source media="(min-width:1024px)" srcSet={item.imgUrlPc} />
              <img src={item.imgUrlMo} alt="슬라이드 이미지" />
            </picture>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default MainSlider
