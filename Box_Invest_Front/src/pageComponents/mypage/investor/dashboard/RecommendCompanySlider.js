/** @jsxImportSource @emotion/react */

import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper'

import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import RecommendCompanyCard from 'pageComponents/mypage/investor/dashboard/RecommendCompanyCard'
import {createKey} from "modules/utils/CommonUtils";

const RecommendCompanyCardSlider = (props) => {
  const { list, toggleLike } = props
  SwiperCore.use([Navigation, Pagination, Autoplay])
  return (
    <div className="slider4 slider04_wrap">
      <div className="slide_block">
        <Swiper
          pagination={{ clickable: true }}
          className="mySwiper04"
          slidesPerView={6}
          slidesPerGroup={6}
          spaceBetween={25}
        >
          {
            list?.map((item, index) => (
                <SwiperSlide key={item.key}>
                  <div className="recommend_invest_section">
                    <div className="recommend_invest_item">
                      <RecommendCompanyCard item={item} toggleLike={toggleLike} />
                    </div>
                  </div>
                </SwiperSlide>
            ))
          }
        </Swiper>
      </div>
    </div>
  )
}

export default RecommendCompanyCardSlider
