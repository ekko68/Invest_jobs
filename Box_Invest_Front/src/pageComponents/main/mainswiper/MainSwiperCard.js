/** @jsxImportSource @emotion/react */

import React from 'react';

import { sliderStyle } from 'assets/style/ComponentStyle'

import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper'

import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';

import Button from 'components/atomic/Button';
import { colors } from 'assets/style/style.config';

import {StringUtils} from "modules/utils/StringUtils";
import {createKey} from "modules/utils/CommonUtils";

const MainSwiperCard = (props) => {
    const { data } = props
    SwiperCore.use([Navigation, Pagination, Autoplay])

    const onClickUrl = (url) => {
        if(StringUtils.hasLength(url)) window.open(url);
    }

    return (
        <div className={'slider01_wrap'} css={sliderStyle}>
            <Swiper
                pagination={{ clickable: true }}
                className="mySwiper"
                autoplay={{ delay: '5000', disableOnInteraction: false }}
                loop={true}
            >
                {
                    data?.map((item, i) => (
                        <SwiperSlide key={createKey()}>
                            <div className="slider_inner">
                                {
                                    StringUtils.hasLength(item?.imgUrl)
                                        ?   <img src={item['imgUrl']} alt="메인 스와이퍼 배경이미지" />
                                        :   <img src={'images/tmp/invest_list_card_no_image.png'} alt="이미지가 없습니다" />
                                }
                                <div className="slider_content">
                                    <p className="text" dangerouslySetInnerHTML={{ __html: StringUtils.toBr(item['bnnrPhrsCon'])}} />
                                    {
                                        StringUtils.hasLength(item?.btnPhrsCon) &&
                                        <Button theme={colors.blue} onClick={() => onClickUrl(item?.bnnrLnknUrl)}>
                                            {item?.btnPhrsCon}
                                        </Button>
                                    }
                                </div>
                            </div>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    )
}

export default MainSwiperCard