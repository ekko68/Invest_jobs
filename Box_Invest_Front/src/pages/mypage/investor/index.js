/** @jsxImportSource @emotion/react */
import React, {useContext, useEffect, useRef, useState} from 'react'
import {useHistory} from 'react-router-dom'

import Gallery01 from 'components/common/Gallery01'
import BreadCrumbs from 'components/common/BreadCrumbs'
import Footer from 'components/common/Footer'
import Header from 'components/header/Header'

import RecommendCompanySection from 'pageComponents/mypage/investor/dashboard/RecommendCompanySection'
import RecentMessageList from "pageComponents/mypage/common/message/RecentMessageList";
import RecentAuditView from 'pageComponents/mypage/investor/dashboard/RecentAuditView'
import DashboardBanner from "pageComponents/mypage/common/dashboard/DashboardBanner";
import ProfileImage from "pageComponents/mypage/common/ProfileImage";
import AlertPopup from "pageComponents/common/pop/AlertPopup";

import ResponseUtils from "modules/utils/ResponseUtils";
import Api from "modules/consts/Api";
import {setFunc, setPromiseFunc} from "modules/utils/ReactUtils";
import {CommonContext} from "modules/contexts/common/CommomContext";
import ROUTER_NAMES from "modules/consts/RouterConst";
import {createKey} from "modules/utils/CommonUtils";

const InvestorMyPage = (props) => {
    const history = useHistory();
    const commonContext = useContext(CommonContext);

    const galleryData = {
        title: '마이페이지',
        img: '/images/gallery02_img1.png'
    }

    const screenViewRef = useRef()
    const dashBoardBannerRef = useRef();
    const rcmdCmpRef = useRef();
    const messageRef = useRef();

    const alertPopRef = useRef();

    const loadBannerList = async () => {
        const resBannerList = await ResponseUtils.getList(Api.my.vc.banner, null, 'list', false);
        return resBannerList;
    }

    const loadRecommendCompanyList = async () => {
        const recommendCompanyList = await ResponseUtils.getList(Api.my.vc.recommendCompanyList, null, 'list', false)
        return recommendCompanyList;
    }

    const isMounted = useRef(false);
    const mountApiCntRef = useRef(0);

    useEffect(() => {
        if(commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
            isMounted.current = true;
            commonContext.actions.pageMountPathCheck(history, async () => {
                mountApiCntRef.current = 4;

                loadBannerList().then(res => {
                    mountApiCntRef.current--;
                    setFunc(dashBoardBannerRef, 'setData', res);
                }).catch(err => {
                    console.error(err);
                    mountApiCntRef.current--;
                });
                loadRecommendCompanyList().then(res => {
                    mountApiCntRef.current--;
                    setFunc(rcmdCmpRef, 'setData', res?.map(item => { return {...item, key: createKey() } }));
                }).catch(err => {
                    console.error(err);
                    mountApiCntRef.current--;
                });

                setPromiseFunc(screenViewRef, 'setData')
                    .then(_ => mountApiCntRef.current--)
                    .catch(err => {
                        console.error(err);
                        mountApiCntRef.current--;
                    });
                setPromiseFunc(messageRef, 'setData')
                    .then(_ => mountApiCntRef.current--)
                    .catch(err => {
                        console.error(err);
                        mountApiCntRef.current--;
                    });
            }, mountApiCntRef)
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
                        <RecentAuditView ref={screenViewRef}/>
                        <RecommendCompanySection ref={rcmdCmpRef}
                                                 alertPopRef={alertPopRef} />
                        <RecentMessageList ref={messageRef}
                                           listRouter={ROUTER_NAMES.MY_PAGE_INVESTOR_MESSAGE_RECEIVE_VIEW}
                                           apiProps={{
                                               loadListApi: Api.my.vc.messageRecentList,
                                               detailApi: Api.my.vc.messageDetail,
                                               replyApi: Api.my.vc.messageReply,
                                           }}/>

                        <DashboardBanner {...props} ref={dashBoardBannerRef}/>
                    </div>
                    <Footer/>
                </div>
            </div>
            <AlertPopup ref={alertPopRef}/>
        </>
    )
}

export default InvestorMyPage
