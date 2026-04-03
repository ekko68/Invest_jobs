import { Swiper } from 'swiper/react'
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper'

import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'

const Slider6 = (props) => {
    const { data, children, loop=false, autoplay=false } = props
    SwiperCore.use([Navigation, Pagination, Autoplay])

    return (
        <div className="slider6 slider06_wrap">
            <Swiper
                pagination={{ clickable: true }}
                navigation={true}
                className="mySwiper05"
                slidesPerView={3}
                spaceBetween={24}
                loop={loop}
                autoplay={autoplay}
            >
                {children}
            </Swiper>
        </div>
    )
}

export default Slider6
