/** @jsxImportSource @emotion/react */

import React, {forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useState} from 'react'

import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import {Swiper, SwiperSlide} from 'swiper/react'
import SwiperCore, {Navigation, Pagination, Autoplay} from 'swiper'

import {sliderStyle03} from 'assets/style/ComponentStyle'

import MainFundInvestSwiperCard from 'pageComponents/main/mainfundinvestswiper/MainFundInvestSwiperCard'
import {createKey} from "modules/utils/CommonUtils";

const MainFundInvestSwiper = forwardRef((props, ref) => {
    SwiperCore.use([Navigation, Pagination, Autoplay])
    const [list, setList] = useState([])

    useImperativeHandle(ref, () => ({
        setData
    }))
    const setData = (list) => {
        setList(list)
    }

    useLayoutEffect(() => {}, [])
    useEffect(async () => {}, [])

    return (
        <>
            {
                (list?.length > 0) &&
                <div className="slider3" css={sliderStyle03}>
                    <div className="slide_block">
                        <Swiper
                            pagination={{clickable: true}}
                            loop={true}
                            slidesPerView={3}
                            spaceBetween={39}
                            className="mySwiper"
                            autoplay={{delay: '5000', disableOnInteraction: false}}
                        >
                            {
                                list?.map((listItem, i) => (
                                    <SwiperSlide key={createKey()}>
                                        <div className="slider_inner">
                                            <MainFundInvestSwiperCard data={listItem} />
                                        </div>
                                    </SwiperSlide>
                                ))
                            }
                        </Swiper>
                    </div>
                </div>
            }
        </>
    )
})
export default MainFundInvestSwiper
