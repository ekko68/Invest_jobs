/** @jsxImportSource @emotion/react */

import React, {useContext, useEffect, useRef} from 'react'

import {serviceProductStyle} from 'assets/style/CompanyStyle'
import {Swiper, SwiperSlide} from 'swiper/react'
import SwiperCore, {Navigation, Pagination, Autoplay} from 'swiper'
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'

import {setFunc} from 'modules/utils/ReactUtils'
import CompanyProdDetail from 'pageComponents/company/CompanyProdDetail'
import QueryUtils from 'modules/utils/QueryUtils'
import NoResult from "components/common/NoResult";
import {createKey} from "modules/utils/CommonUtils";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {CheckYn} from "modules/consts/BizConst";
import {FormatUtils} from "modules/utils/StringUtils";
import {isNumber} from "modules/utils/NumberUtils";

const ServiceProduct = (props) => {
    SwiperCore.use([Navigation, Pagination, Autoplay]);

    const commonContext = useContext(CommonContext);

    const {productGroup} = props;
    const popupProdDetailRef = useRef();

    const onClickOpenProductDetail = (item) => {
        const query = QueryUtils.getQuery(props)
        if (query.hasOwnProperty('utlinsttId')) {
            setFunc(popupProdDetailRef, 'open', query.utlinsttId, item.prdtId)
        }
    }

    const getCommerceItemPrice = (price, currency) => {
        return isNumber(price) ? FormatUtils.numberWithCommas.format(price) + currency : ''
    }

    useEffect(() => {
    }, [])

    return (
        <>
            <div className="service_product card_inner" css={serviceProductStyle}>
                <div className="card_header">
                    <div className="card_title ico_title">서비스 / 제품</div>
                </div>
                <div className="slider_wrap">
                    {
                        // 커머스 등록 정보가 있을 경우
                        (productGroup?.commerceListYn === CheckYn.YES && productGroup?.commerceProductList?.length > 0)
                            ?
                            <Swiper slidesPerView={3} spaceBetween={0} navigation={true} className="service_product_swiper">
                                {productGroup.commerceProductList.map(item => (
                                    <SwiperSlide key={createKey()} onClick={() => {
                                        window.location.href = `${process.env.REACT_APP_COMMERCE_BOX_URL}/sellerstore/${QueryUtils.getQuery(props)?.utlinsttId}`
                                    }}>
                                        <div className="card_wrap">
                                            <div className="img_wrap">
                                                <img src={item.imgUrl} alt=""/>
                                            </div>
                                            <div className="content_wrap">
                                                <p className="title_text">{item.pdfNm}</p>
                                                <div className="price_text">{getCommerceItemPrice(item.pdfPrc, item.comPrcutName)}</div>
                                                <div className="change_price_text">
                                                    <div className="before_price">{getCommerceItemPrice(item.pdfPrc, item.comPrcutName)}</div>
                                                    <div className="change_price">{getCommerceItemPrice(item.salePrc, item.comPrcutName)}</div>
                                                </div>
                                                <div className="sell_stop">{item.pdfSttsNm}</div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            :
                            productGroup?.productList?.length > 0

                                ? <Swiper slidesPerView={3} spaceBetween={0} navigation={true} className="service_product_swiper">
                                    {productGroup.productList.map((item, index) => (

                                        // 커머스 등록정보가 없을 때
                                        <SwiperSlide key={createKey()} onClick={() => onClickOpenProductDetail(item)}>
                                            <div className="img_wrap">
                                                {/*<img src={item['imgUrl']} alt="" />*/}
                                                {
                                                    String(item['imgUrl']).trim() === ''
                                                        ? <img src={require('assets/images/no_img.jpg').default} alt="이미지없음"/>
                                                        : <img src={item['imgUrl']} alt={item['prdtNm']}/>
                                                }
                                            </div>
                                        </SwiperSlide>


                                    ))}
                                </Swiper>
                                : <NoResult msg={'등록된 서비스/제품 정보가 없습니다.'}/>
                    }
                </div>

                {
                    (commonContext.state.user?.info?.groupId == QueryUtils.getQuery(props)?.utlinsttId
                        && productGroup?.commerceListYn !== CheckYn.YES) &&
                    <div className="text_wrap">
                        <p className="text">커머스박스에 서비스/제품을 등록하시면 효과적인 홍보 및 판매를 할 수 있습니다.</p>
                        <button className="text"
                                onClick={() => {
                                    window.location.href = `${process.env.REACT_APP_COMMERCE_BOX_URL}/mypage/product`
                                }}>
                            커머스박스에 서비스/제품 등록하기 &gt;</button>
                    </div>
                }

            </div>
            <CompanyProdDetail ref={popupProdDetailRef}/>
        </>
    )
}

export default ServiceProduct
