/** @jsxImportSource @emotion/react */

import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper'

import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import CardItem03 from 'components/common/card/CardItem03'
import {createKey} from "modules/utils/CommonUtils";


const Slider4 = (props) => {
  const { data, children, slidesPerView=6 } = props

  SwiperCore.use([Navigation, Pagination, Autoplay])

  return (
    <div className="slider4 slider04_wrap">
      <div className="slide_block">
        <Swiper
          pagination={{ clickable: true }}
          className="mySwiper04"
          slidesPerView={slidesPerView}
          slidesPerGroup={6}
          spaceBetween={25}
        >
            {children}
        </Swiper>
      </div>
    </div>
  )
}

export default Slider4
