/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper'

import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'

import { sliderStyle05 } from 'assets/style/ComponentStyle'
import CardItem05 from 'components/common/card/CardItem05'
import {createKey} from "modules/utils/CommonUtils";

const Slider5 = (props) => {
  const { data } = props
  SwiperCore.use([Navigation, Pagination, Autoplay])

  return (
    <div className="slider5 slider05_wrap" css={sliderStyle05}>
      <div className="slide_block">
        <Swiper navigation={true} loop={true} className="mySwiper">
          {data &&
            data.map((d, idx) => (
              <SwiperSlide key={createKey()}>
                <CardItem05 data={d} idx={idx} />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  )
}

export default Slider5
