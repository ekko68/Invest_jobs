/** @jsxImportSource @emotion/react */
import { sliderStyle } from 'assets/style/ComponentStyle'

import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper'

import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'

import Button from 'components/atomic/Button'
import { colors } from 'assets/style/style.config'
import { useHistory } from 'react-router-dom'
import {createKey} from "modules/utils/CommonUtils";

const Slider1 = (props) => {
  const { data } = props
  const history = useHistory()
  SwiperCore.use([Navigation, Pagination, Autoplay])

  // img: "/images/tmp/img_news_b01.jpg"
  // text: "채용 홍보, 넥스트 유니콘이 대신 해드릴께요! 01"
  // title: "채용 홍보, 넥스트 유니콘이 대신 해드릴께요! 01"
  // url: "/main/banner"
  const onClickUrl = (item) => {
    history.push(item.url)
  }
  return (
    <div className={'slider01_wrap'} css={sliderStyle}>
      <Swiper
        pagination={{ clickable: true }}
        className="mySwiper"
        autoplay={{ delay: '5000', disableOnInteraction: false }}
      >
        {data.map((d, i) => (
          <SwiperSlide key={createKey()}>
            <div className="slider_inner">
              <img src={d.img} alt="배경이미지" />
              <div className="slider_content">
                <p className="text">{d.text}</p>
                <Button theme={colors.blue} onClick={() => onClickUrl(d)}>
                  {d.title}
                </Button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default Slider1
