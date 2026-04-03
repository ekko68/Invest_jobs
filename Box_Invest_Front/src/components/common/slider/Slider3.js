/** @jsxImportSource @emotion/react */

import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper'

import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import CardItem02 from 'components/common/card/CardItem02'
import { sliderStyle03 } from 'assets/style/ComponentStyle'
import {createKey} from "modules/utils/CommonUtils";

const Slider3 = ({ data }) => {
  SwiperCore.use([Navigation, Pagination, Autoplay])

  return (
    <div className="slider3 slider03_wrap" css={sliderStyle03}>
      <div className="slide_block">
        <Swiper
          pagination={{ clickable: true }}
          loop={true}
          slidesPerView={3}
          spaceBetween={39}
          className="mySwiper"
          autoplay={{ delay: '5000', disableOnInteraction: false }}
        >
          {data.map((d, i) => (
            <SwiperSlide key={createKey()}>
              <div className="slider_inner">
                <CardItem02 data={d} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default Slider3
