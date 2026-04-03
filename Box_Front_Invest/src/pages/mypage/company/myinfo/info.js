/** @jsxImportSource @emotion/react */
import { useContext, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'

import Button from 'components/atomic/Button'
import BreadCrumbs from 'components/common/BreadCrumbs'
import Footer from 'components/common/Footer'
import Gallery01 from 'components/common/Gallery01'
import CardLayout from 'components/common/card/CardLayout'
import Header from 'components/header/Header'

import AlertPopup from "pageComponents/common/pop/AlertPopup"
import ProfileImage from "pageComponents/mypage/common/ProfileImage"
import ConvertResponsePopup from "pageComponents/mypage/common/info/ConvertResponsePopup"
import StampSection from "pageComponents/mypage/common/info/StampSection"
import BasicInfo from 'pageComponents/mypage/company/info/BasicInfo'
import IntroMedia from 'pageComponents/mypage/company/info/IntroMedia'
import Invest from 'pageComponents/mypage/company/info/Invest'
import KiprisSection from 'pageComponents/mypage/company/info/KiprisSection'
import Member from 'pageComponents/mypage/company/info/Member'
import Product from 'pageComponents/mypage/company/info/Product'
import PopupProdDetail from 'pageComponents/mypage/company/myinfo/PopupProdDetail'

import Api from 'modules/consts/Api'
import { AlertLabels, BizStatusCode, CheckYn } from "modules/consts/BizConst"
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import CommonAxios, { getPostConfig } from 'modules/utils/CommonAxios'
import { exeFunc, getFunc, setFunc, setPromiseFunc } from 'modules/utils/ReactUtils'
import ResponseUtils from 'modules/utils/ResponseUtils'
import ConvertRequestPopupNew from 'pageComponents/mypage/common/info/ConvertRequestPopupNew'
import ConvertRequestPopup from 'pageComponents/mypage/common/info/ConvertRequestPopup'

const Info = (props) => {

    const history = useHistory();
    const commonContext = useContext(CommonContext)

    const galleryData = {
        title: '마이페이지',
        img: '/images/gallery02_img1.png'
    }

    const memberRef = useRef();
    const introMediaRef = useRef();
    const investRef = useRef();
    const popupProdDetailRef = useRef();
    const productRef = useRef();
    const basicInfoRef = useRef();
    const stampRef = useRef();

    const convertInfo = useRef({});
    const convertRequestPopupRef = useRef();
    const convertResponsePopupRef = useRef();
    const convertResponseConfirmPopupRef = useRef();
    const alertPopupRef = useRef();


    const onClickVideoWrite = () => {
        history.push(ROUTER_NAMES.MY_PAGE_COMPANY_VIDEO_WRITE)
    }

    const onClickAddProduct = () => {
        // history.push(ROUTER_NAMES.MY_PAGE_COMPANY_INFO_PROD_WRITE, { create: CHECK_YN.YES })
        const productListGroup = getFunc(productRef, 'getData');

        if(productListGroup?.commerceListYn === CheckYn.YES) {
            window.location.href = `${process.env.REACT_APP_COMMERCE_BOX_URL}/mypage/product`;
            return;
        }
        else if (productListGroup?.productList?.length >= 10) {
            exeFunc(alertPopupRef, 'open', '제한된 개수를 초과하였습니다.');
            return
        }
        history.push(ROUTER_NAMES.MY_PAGE_COMPANY_INFO_PROD_WRITE)
    }

    const onClickRequestConvert = async () => {
        await commonContext.actions.callbackAfterSessionRefresh(async () => {
            const res = await ResponseUtils.getSimpleResponse(Api.my.company.convertCheckRequest, null, false);
            if (res) {
                if (res['ongoingYn'] === CheckYn.YES) {
                    exeFunc(convertResponsePopupRef, 'open', '요청 승인 대기 중입니다.', res['rqstDt']);
                } else if (res['ongoingYn'] === CheckYn.NO) {
                    exeFunc(convertRequestPopupRef, 'open');
                }
            }
        }, true, true)
    }

    const confirmRequestConvert = async (fileVo) => {
        history.push(ROUTER_NAMES.MY_PAGE_COMPANY_INFO_INVM_CNVRS);
        // tobe .... .에서
        // await commonContext.actions.callbackAfterSessionRefresh(async () => {
        //     const res = await CommonAxios(getPostConfig(Api.my.company.convert, { fileId: fileVo.fileId }));
            
        //     if (res && res.status === 200 && res.data.hasOwnProperty('code')) {
        //         if (res.data.code === '200') {
        //             const msg = '투자사 전환 요청이 완료됐습니다.<br /> 관리자 승인 후 투자사 회원으로 전환됩니다.'
        //             if(res.data.data != null){
        //                 exeFunc(convertResponsePopupRef, 'open', msg, res.data.data['rgsnTs']);
        //             } else {
        //                 history.push(ROUTER_NAMES.MY_PAGE_COMPANY_INFO_INVM_CNVRS);
        //             }
        //         } else if (res.data.code === BizStatusCode.READY_APPROVAL) {
        //             // exeFunc(convertResponsePopupRef, 'open', res.data.message, res.data.data['rgsnTs']);
        //         } else {
        //             exeFunc(alertPopupRef, 'open', AlertLabels.askAdmin);
        //         }
        //     } else {
        //         exeFunc(alertPopupRef, 'open', AlertLabels.askAdmin);
        //     }
        // }, true, true);
    }

    const confirmCheckConvertResult = async () => {
        await commonContext.actions.callbackAfterSessionRefresh(async () => {
            const res = await CommonAxios(getPostConfig(Api.my.company.convertCheckResult, {...convertInfo.current}));

            if (!(res && res.status === 200 && res.data.hasOwnProperty('code') && res.data.code === '200')) {
                exeFunc(alertPopupRef, 'open', AlertLabels.askAdmin);
            }
        }, true, true)
    }

    const loadBasicInfo = async () => {
        const basicInfo = await ResponseUtils.getSimpleResponse(Api.my.company.basicInfoDetail, null, false)
        return basicInfo
    }
    const loadMemberList = async () => {
        const list = await ResponseUtils.getList(Api.my.company.memberList, null, 'list', false)
        return list
    }
    const loadProductList = async () => {
        const productListGroup = await ResponseUtils.getSimpleResponse(Api.my.company.productList, null, false)
        return productListGroup
    }
    const loadIntroMediaList = async () => {
        const list = await ResponseUtils.getList(Api.my.company.introMediaList, null, 'list', false)
        return list
    }
    const loadInvestInfo = async () => {
        const investInfo = await ResponseUtils.getSimpleResponse(Api.my.company.investHopeDetail, null, false)
        return investInfo
    }

    const isMounted = useRef(false);
    const mountApiCntRef = useRef(0);

    useEffect(() => {
        if(commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
            isMounted.current = true;
            window.scrollTo(window.scrollX, 0);

            commonContext.actions.pageMountPathCheck(history, async () => {
                // mountApiCntRef.current = process.env.REACT_APP_RENDER_TYPE === 'prod' ? 7 : 6;
                mountApiCntRef.current = 6;

                // 타임아웃으로 데이터 바인딩 에러가 발생할 수 있으므로 먼저 처리 후 나머지 로드
                await loadBasicInfo().then(res => {
                    mountApiCntRef.current--;
                    setFunc(basicInfoRef, 'setData', res);

                    if (res && res.hasOwnProperty('convertInfo') && res.convertInfo !== null) {
                        if (res.convertInfo['alrtCnfaYn'] === CheckYn.NO) {
                            convertInfo.current = res.convertInfo;
                            exeFunc(convertResponseConfirmPopupRef, 'open', '투자사 전환 요청이 반려되었습니다', res.convertInfo.rgsnTs);
                        }
                    }
                }).catch(err => {
                    console.error(err);
                    mountApiCntRef.current--;
                });
                loadProductList().then(res => {
                    mountApiCntRef.current--;
                    setFunc(productRef, 'setData', res);
                }).catch(err => {
                    console.error(err);
                    mountApiCntRef.current--;
                });
                loadInvestInfo().then(res => {
                    mountApiCntRef.current--;
                    setFunc(investRef, 'setData', res);
                }).catch(err => {
                    console.error(err);
                    mountApiCntRef.current--;
                });
                loadMemberList().then(res => {
                    mountApiCntRef.current--;
                    setFunc(memberRef, 'setData', res);
                }).catch(err => {
                    console.error(err);
                    mountApiCntRef.current--;
                });
                loadIntroMediaList().then(res => {
                    mountApiCntRef.current--;
                    setFunc(introMediaRef, 'setData', res);
                }).catch(err => {
                    console.error(err);
                    mountApiCntRef.current--;
                });

                setPromiseFunc(stampRef, 'setData')
                    .then(_ => mountApiCntRef.current--)
                    .catch(err => {
                        console.error(err);
                        mountApiCntRef.current--;
                    });
            }, mountApiCntRef);
        }
    }, [commonContext.state.user]);

    useEffect(() => {
        return () => isMounted.current = false;
    }, []);

    return (
        <>
            <Header/>
            <div className="page_container">
                <div className="wrap mypage_wrap info_wrap company bg02">
                    <div className="gallery_logo_wrap">
                        <Gallery01 data={galleryData}/>
                        <ProfileImage/>
                    </div>

                    <BreadCrumbs {...props} />

                    <div className="container default_size02">
                        {/*section01 start*/}
                        <BasicInfo ref={basicInfoRef} onClickConvert={onClickRequestConvert}/>

                        {/* 지적재산권 section06 start*/}
                        <KiprisSection />

                        <div className="section section02">
                            <div className="section_header">
                                <h3 className="section_title">주요제품</h3>
                                <Button className={'blue'} onClick={onClickAddProduct}>
                                    추가하기
                                </Button>
                            </div>
                            <Product ref={productRef} />
                        </div>
                        <Invest ref={investRef} {...props} />
                        <Member ref={memberRef} {...props} />
                        <div className="section section05">
                            <div className="section_header">
                                <h3 className="section_title">소개영상</h3>
                                <Button className={'blue'} onClick={onClickVideoWrite}>
                                    수정하기
                                </Button>
                            </div>
                            <CardLayout>
                                <IntroMedia ref={introMediaRef} {...props} />
                            </CardLayout>
                        </div>
                        {/*section05 end*/}

                        {/*section06 start*/}
                        <div className="section section06">
                            <StampSection ref={stampRef} {...props}
                                          writeRouteUrl={ROUTER_NAMES.MY_PAGE_COMPANY_STAMP_WRITE}
                                          searchApiUrl={Api.my.company.seal}
                            />
                        </div>
                        {/*section06 end*/}
                    </div>
                    <Footer/>
                </div>
            </div>
            <ConvertRequestPopupNew
                ref={convertRequestPopupRef}
                alertPopupRef={alertPopupRef}
                onConfirm={confirmRequestConvert}/>
            {/* <ConvertRequestPopup
                ref={convertRequestPopupRef}
                alertPopupRef={alertPopupRef}
                onConfirm={confirmRequestConvert}/> */}
            <ConvertResponsePopup
                ref={convertResponseConfirmPopupRef}
                onConfirm={confirmCheckConvertResult}/>
            <ConvertResponsePopup ref={convertResponsePopupRef}/>
            <PopupProdDetail ref={popupProdDetailRef}/>
            <AlertPopup ref={alertPopupRef}/>
        </>
    )
}

export default Info
