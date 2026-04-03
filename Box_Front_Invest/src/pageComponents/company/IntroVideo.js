/** @jsxImportSource @emotion/react */

import React, {useEffect} from 'react'

import {Swiper, SwiperSlide} from 'swiper/react'
import SwiperCore, {Navigation, Pagination, Autoplay} from 'swiper'
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'

import {introVideoStyle} from 'assets/style/CompanyStyle'
import NoResult from "components/common/NoResult";
import {createKey} from "modules/utils/CommonUtils";


// swiper
SwiperCore.use([Navigation, Pagination, Autoplay])

const IntroVideo = (props) => {
    const {vo} = props
    
    // todo: 공통화 처리
    const convertYouTubeLing = (inrdPictUrl) => {
        let movieId = ''
        const array = String(inrdPictUrl).split('/')
        if (array) {
            if (array.length > 0) {
                movieId = array[array.length - 1]
                movieId = movieId.replace('watch?v=', '');
            }
        }
        return 'https://www.youtube.com/embed/' + movieId
    }

    useEffect(() => {
    }, []);
    
    return (
        <div className="intro_video card_inner" css={introVideoStyle}>
            <div className="card_header">
                <div className="card_title ico_title">소개영상</div>
            </div>
            <div className="intro_video_slider">
                {
                    vo?.mediaList?.length > 0
                        ? <Swiper slidesPerView={1.44} spaceBetween={0} navigation={true} className="intro">
                            {
                                vo.mediaList.map((item, i) => (
                                    <SwiperSlide key={createKey()}>
                                        <div className="img_wrap">
                                            <iframe
                                                width="346px"
                                                height="197px"
                                                src={convertYouTubeLing(item['inrdPictUrl'])}
                                                title="YouTube video player"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                key={createKey()}
                                            >
                                                &nbsp;
                                            </iframe>
                                        </div>
                                    </SwiperSlide>
                                ))
                            }
                        </Swiper>
                        : <NoResult msg={'등록된 소개영상 정보가 없습니다.'}/>
                }
            </div>
        </div>
    )
}

export default IntroVideo
