/** @jsxImportSource @emotion/react */
import React, {useEffect, useRef, useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'

import InformationTooltip from 'components/atomic/InformationTooltip'
import Gallery01 from 'components/common/Gallery01'
import BreadCrumbs from 'components/common/BreadCrumbs'
import Footer from 'components/common/Footer'
import Header from 'components/header/Header'

import RecommendInvestorSection from 'pageComponents/mypage/company/dashboard/RecommendInvestorSection'
import RecentAuditView from 'pageComponents/mypage/company/dashboard/RecentAuditView'
import DashboardBanner from "pageComponents/mypage/common/dashboard/DashboardBanner";
import ProfileImage from "pageComponents/mypage/common/ProfileImage";
import AlertPopup from "pageComponents/common/pop/AlertPopup";
import RecentMessageList from "pageComponents/mypage/common/message/RecentMessageList";

import ROUTER_NAMES from 'modules/consts/RouterConst'
import ResponseUtils from 'modules/utils/ResponseUtils'
import Api from 'modules/consts/Api'
import DateUtils from 'modules/utils/DateUtils'
import {setFunc, setPromiseFunc} from "modules/utils/ReactUtils";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey} from "modules/utils/CommonUtils";

const MyPage = (props) => {
    const history = useHistory()
    const commonContext = useContext(CommonContext);

    const galleryData = {
        title: '마이페이지',
        img: '/images/gallery02_img1.png'
    }

    const progressInfoRef = useRef()
    const [progress, setProgress] = useState(null)
    const [lastModifiedDate, setLastModifiedDate] = useState('')

    const screenViewRef = useRef()
    const dashBoardBannerRef = useRef();
    const section02Ref = useRef();
    const section03Ref = useRef();
    const alertPopupRef = useRef();

    const onClose = () => {
        if (progressInfoRef.current) {
            progressInfoRef.current.style.display = 'none'
        }
    }
    const onClickIrCreate = () => {
        history.push(ROUTER_NAMES.MY_PAGE_IR_BASIC_INFO_WRITE)
    }
    const onClickIrPreview = () => {
        history.push(ROUTER_NAMES.MY_PAGE_IR_BASIC_INFO)
    }

    const loadProgress = async () => {
        const resProgress = await ResponseUtils.getSimpleResponse(Api.my.company.irProgress)
        return resProgress
    }

    const loadBannerList = async () => {
        const resBannerList = await ResponseUtils.getList(Api.my.company.banner, null, 'list', false);
        return resBannerList;
    }

    const loadRecommendInvestList = async () => {
        const recommendInvestorList = await ResponseUtils.getList(Api.my.company.recommendVcList, null, 'list', false);
        return recommendInvestorList;
    }

    const isMounted = useRef(false);
    const mountApiCntRef = useRef(0);

    useEffect(() => {
        if(commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
            isMounted.current = true;

            commonContext.actions.pageMountPathCheck(history, async () => {
                mountApiCntRef.current = 5;

                loadProgress().then(res => {
                    mountApiCntRef.current--;

                    if(res) {
                        setProgress(res.progress);
                        setLastModifiedDate(res.lastModifiedDate);
                    }
                }).catch(err => {
                    console.error(err);
                    mountApiCntRef.current--;
                });

                loadBannerList().then(list => {
                    mountApiCntRef.current--;
                    setFunc(dashBoardBannerRef, 'setData', list);
                }).catch(err => {
                    console.error(err);
                    mountApiCntRef.current--;
                });
                loadRecommendInvestList().then(list => {
                    mountApiCntRef.current--;
                    setFunc(section02Ref, "setData", list?.map(item => { return {...item, key: createKey() } }));
                }).catch(err => {
                    console.error(err);
                    mountApiCntRef.current--;
                });

                setPromiseFunc(screenViewRef, "setData")
                    .then(_ => mountApiCntRef.current--)
                    .catch(err => {
                        console.error(err);
                        mountApiCntRef.current--;
                    });
                setPromiseFunc(section03Ref, "setData")
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
            <Header {...props} />
            <div className="page_container">
                <div className="wrap mypage_wrap mypage_dashboard bg02">
                    <div className="gallery_logo_wrap">
                        <Gallery01 data={galleryData}/>
                        <ProfileImage/>
                    </div>
                    <BreadCrumbs {...props} />
                    <div className="container default_size02">
                        <div className="info_wrap" ref={progressInfoRef}>
                            {
                                (() => {
                                    if(progress === null) return <></>

                                    else if (progress === 0) {
                                        return (
                                            <InformationTooltip theme={'red'} onClose={onClose}>
                                                <div className="info_content ico_warning">
                                                    <p className="text">IR 작성이 필요합니다. (투자심사를 위해서는 최초 1회 IR 작성필수!)</p>
                                                    <button onClick={onClickIrCreate}>IR 작성보기</button>
                                                </div>
                                            </InformationTooltip>
                                        )
                                    } else if (0 < progress && progress < 100) {
                                        return (
                                            <InformationTooltip onClose={onClose}>
                                                <div className="info_content ico_smile">
                                                    <p className="text">
                                                        {`IR 작성이 ${progress}% 완료되었습니다.`}
                                                        <span className="date">{DateUtils.customDateFormat(lastModifiedDate, 'yyyy년 MM월 dd일')}</span>
                                                    </p>
                                                    <button onClick={onClickIrPreview}>IR자료 보기</button>
                                                </div>
                                            </InformationTooltip>
                                        )
                                    } else if (progress === 100) {
                                        return (
                                            <InformationTooltip onClose={onClose}>
                                                <div className="info_content ico_smile">
                                                    <p className="text">
                                                        IR 작성이 완료되었습니다.
                                                        <span className="date">{DateUtils.customDateFormat(lastModifiedDate, 'yyyy년 MM월 dd일')}</span>
                                                    </p>
                                                    <button onClick={onClickIrPreview}>IR 자세히보기</button>
                                                </div>
                                            </InformationTooltip>
                                        )
                                    }
                                })()
                            }
                        </div>
                        <RecentAuditView ref={screenViewRef}/>
                        <RecommendInvestorSection ref={section02Ref}/>

                        <RecentMessageList ref={section03Ref}
                                           listRouter={ROUTER_NAMES.MY_PAGE_COMPANY_MESSAGE_RECEIVE_VIEW}
                                           apiProps={{
                                               loadListApi: Api.my.company.messageRecentList,
                                               detailApi: Api.my.company.messageDetail,
                                               replyApi: Api.my.company.messageReply,
                                           }}/>

                        <DashboardBanner {...props} ref={dashBoardBannerRef}/>
                    </div>
                    <Footer/>
                    <AlertPopup ref={alertPopupRef}/>
                </div>
            </div>
        </>
    )
}
export default React.memo(MyPage)
