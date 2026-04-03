import React, {forwardRef, useContext, useImperativeHandle, useRef, useState} from 'react'
import {useHistory} from 'react-router-dom'

import {Swiper, SwiperSlide} from 'swiper/react'
import SwiperCore, {Navigation, Pagination, Autoplay} from 'swiper'
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'

import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import CheckCloseAlertPopup from 'pageComponents/common/pop/CheckCloseAlertPopup'
import PopupProdDetail from 'pageComponents/mypage/company/myinfo/PopupProdDetail'
import ConfirmPopup from 'pageComponents/common/pop/ConfirmPopup'

import CardLayout from 'components/common/card/CardLayout'

import {exeFunc} from 'modules/utils/ReactUtils'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import Api from 'modules/consts/Api'
import CommonAxios from 'modules/utils/CommonAxios'
import {getPostConfig} from 'modules/utils/CommonAxios'
import {AlertLabels, CheckYn} from 'modules/consts/BizConst'
import ResponseUtils from 'modules/utils/ResponseUtils'
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey} from "modules/utils/CommonUtils";
import {FormatUtils} from "modules/utils/StringUtils";
import {isNumber} from "modules/utils/NumberUtils";

const Product = forwardRef((props, ref) => {
    SwiperCore.use([Navigation, Pagination, Autoplay]);

    const history = useHistory()
    const commonContext = useContext(CommonContext);

    const [vo, setVo] = useState({
        commerceListYn: '',
        productList: [],
        commerceProductList: []
    });

    const confirmPopDeleteRef = useRef()
    const confirmPopRemoveRef = useRef()
    const alertPopRef = useRef()
    const checkCloseAlertPopupRef = useRef()
    const popupProdDetailRef = useRef()

    useImperativeHandle(ref, () => ({
        setData,
        getData,
    }));

    const onClickOpenProductDetail = (item) => {
        exeFunc(popupProdDetailRef, 'open', item['prdtId'])

    }
    const onClickProductModify = (item) => {
        const url = ROUTER_NAMES.MY_PAGE_COMPANY_INFO_PROD_WRITE + '?prdtId=' + item['prdtId']
        history.push(url)
    }

    const setData = (temp) => {
        setVo(temp)
    }

    const getData = () => {
        return vo;
    }

    const onClickDelete = (item) => {
        exeFunc(confirmPopDeleteRef, 'openParams', '삭제 하시겠습니까?', item);
    }

    const onConfirmDelete = async (item) => {
        await loadDelete(item)
    }

    const onModify = (item) => {
        exeFunc(popupProdDetailRef, 'close')
        const url = ROUTER_NAMES.MY_PAGE_COMPANY_INFO_PROD_WRITE + '?prdtId=' + item['prdtId']
        history.push(url)
    }

    const onRemove = (item) => {
        exeFunc(confirmPopRemoveRef, 'openParams', '삭제 하시겠습니까?', item);
    }

    const onConfirmRemove = async (item) => {
        exeFunc(popupProdDetailRef, 'close')
        await loadDelete(item)
    }

    const loadDelete = async (item) => {
        await commonContext.actions.callbackAfterSessionRefresh(async () => {
            const params = {
                id: item.prdtId
            }
            const res = await CommonAxios(getPostConfig(Api.my.company.productDelete, params))
            if (res && res.status === 200) {
                if (res.data.hasOwnProperty('code') && res.data.code !== '200') {
                    exeFunc(alertPopRef, 'open', AlertLabels.notDeleted);
                    return
                }
                exeFunc(checkCloseAlertPopupRef, 'open', AlertLabels.deleted);
                const loadData = await loadProductList();
                setVo(loadData);
            } else {
                exeFunc(alertPopRef, 'open', AlertLabels.notDeleted);
            }
        }, true, true);
    }

    const loadProductList = async () => {
        const productListGroup = await ResponseUtils.getSimpleResponse(Api.my.company.productList, null, false)
        return productListGroup
    }

    const getCommerceItemPrice = (price, currency) => {
        return isNumber(price) ? FormatUtils.numberWithCommas.format(price) + currency : ''
    }

    return (
        <>
            <CardLayout>
                <div className="prod_info_wrap">
                    <div className="card_header">
                        <h3 className="ico_title title">제품정보</h3>
                    </div>
                    <div className="prod_content">
                        {
                            !(vo?.productList?.length > 0 || vo?.commerceProductList?.length > 0)
                                ? <div className="no_prod">
                                    <div className="no_prod_inner">
                                        <p className="text">현재 등록된 제품 정보가 없습니다</p>
                                    </div>
                                </div>

                                : <div className="prod_inner">
                                    <div className="img_list_wrap">
                                        <div className="product_list_slider">
                                            <div className="slide-block">
                                                <Swiper
                                                    navigation={true}
                                                    loop={false}
                                                    spaceBetween={22}
                                                    slidesPerView={4}
                                                    className="prd-list-swiper"
                                                >
                                                    {
                                                        vo.commerceListYn === CheckYn.YES
                                                            ?
                                                            vo.commerceProductList?.map(item => (
                                                                <SwiperSlide key={createKey()}
                                                                    onClick={() => window.location.href = `${process.env.REACT_APP_COMMERCE_BOX_URL}/mypage/product`}>
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
                                                            ))
                                                            :
                                                            vo.productList?.map((item, index) => (
                                                                <SwiperSlide key={createKey()}>
                                                                    <div className="img_wrap">
                                                                        <img src={item['imgUrl']} alt=""/>
                                                                        <div className="edit_wrap">
                                                                            <button className="btn_edit" onClick={() => onClickProductModify(item)}>
                                                                                <span className="hide">수정</span>
                                                                            </button>
                                                                            <button className="btn_more" onClick={() => onClickOpenProductDetail(item)}>
                                                                                <span className="hide">상세보기</span>
                                                                            </button>
                                                                            <button className="btn_delete" onClick={() => onClickDelete(item)}>
                                                                                <span className="hide">삭제</span>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </SwiperSlide>
                                                            ))}
                                                </Swiper>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        }
                        {
                            vo?.commerceListYn === CheckYn.YES &&
                            <div className="guide_text">
                                * 현재 커머스박스에 서비스/제품을 등록되어있는 상태로 제품 정보를 수정하거나
                                추가등록을 하시려면 커머스박스 제품 수정/등록 메뉴에서 가능합니다.
                            </div>
                        }
                    </div>
                </div>
            </CardLayout>
            <PopupProdDetail ref={popupProdDetailRef} onModify={onModify} onRemove={onRemove}/>
            <AlertPopup ref={alertPopRef}/>
            {/*<ConfirmPopup ref={(ref) => (confirmPopModifyRef = ref)} onConfirm={onConfirmModify} />*/}
            <CheckCloseAlertPopup ref={checkCloseAlertPopupRef}/>
            <ConfirmPopup ref={confirmPopRemoveRef} onConfirm={onConfirmRemove}/>
            <ConfirmPopup ref={confirmPopDeleteRef} onConfirm={onConfirmDelete}/>
        </>
    )
});
export default Product;
