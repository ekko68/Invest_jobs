/** @jsxImportSource @emotion/react */
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper'
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import { sliderStyle02 } from 'assets/style/ComponentStyle'
import {createKey} from "modules/utils/CommonUtils";

const Slider2 = (props) => {
  const { data } = props

  SwiperCore.use([Navigation, Pagination, Autoplay])

  return (
    <div className={'slider02_wrap'} css={sliderStyle02}>
      <Swiper pagination={{ clickable: true }} className="mySwiper">
        {data.map((img, i) => (
          <SwiperSlide key={createKey()}>
            <div
              className="slider_inner"
              style={{ background: `url(${img}) center center no-repeat`, backgroundSize: 'cover' }}
            >
              &nbsp;
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default Slider2
