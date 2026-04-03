import React, {useContext, useEffect, useRef, useState} from 'react';
import {useHistory} from "react-router-dom";

import Header from "components/header/Header";
import Footer from "components/common/Footer";
import Button from "components/atomic/Button";
import Gallery01 from "components/common/Gallery01";
import BreadCrumbs from "components/common/BreadCrumbs";

import NdaList from "pageComponents/mypage/common/nda/NdaList";
import NdaListTab from "pageComponents/mypage/common/nda/NdaListTab";
import ProfileImage from "pageComponents/mypage/common/ProfileImage";

import {CommonContext} from "modules/contexts/common/CommomContext";
import ROUTER_NAMES from "modules/consts/RouterConst";
import {ListType} from "modules/consts/BizConst";
import {exeFunc, setPromiseFunc} from "modules/utils/ReactUtils";
import Api from "modules/consts/Api";
import QueryUtils from "modules/utils/QueryUtils";

const SendNda = (props) => {

    const history = useHistory()
    const commonContext = useContext(CommonContext);

    const tabRef = useRef();
    const listRef = useRef();
    const pageQueryRef = useRef();

    const galleryData = {
        title: '마이페이지',
        img: '/images/gallery02_img1.png'
    }

    const tabProps = {
        ...props,
        tabType: ListType.SEND,
        history: history,
        receiveRouter: ROUTER_NAMES.MY_PAGE_INVESTOR_NDA_RECEIVE,
        sendRouter: ROUTER_NAMES.MY_PAGE_INVESTOR_NDA_SEND,
    }

    const listProps = {
        setBadgeCnt: (receiveCnt = 0, sendCnt = 0) => {
            exeFunc(tabRef, 'setBadgeCnt', receiveCnt, sendCnt);
        },
        pageQueryRef: pageQueryRef,

        tabName: '보낸요청',
        noResultMsg: '요청하신 NDA 체결 정보가 없습니다.',
        apiUrl: Api.my.vc.ndaSendList,
        routerUrl: ROUTER_NAMES.MY_PAGE_INVESTOR_NDA_VIEW + '?type=send'
    }

    const isMounted = useRef(false);

    useEffect(() => {
        if(commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
            isMounted.current = true;

            commonContext.actions.pageMountPathCheck(history, async () => {
                const query = QueryUtils.getQuery(props);
                pageQueryRef.current = {...query};

                await setPromiseFunc(listRef, 'setData');
            });
        }
    }, [commonContext.state.user]);


    useEffect(() => {
        return () => isMounted.current = false;
    }, []);

    return (
        <>
            <Header/>
            <div className="page_container">
                <div className="wrap mypage_wrap nda_wrap mypage_common bg02">
                    <div className="gallery_logo_wrap">
                        <Gallery01 data={galleryData}/>
                        <ProfileImage/>
                    </div>

                    <BreadCrumbs {...props} />

                    <div className="container default_size02">
                        {/*section start*/}
                        <div className="section section01">
                            <div className="section_header">
                                <NdaListTab ref={tabRef} {...tabProps} />
                                <div className="btn_group">
                                    <Button className={'blue'}
                                            onClick={() => history.push(ROUTER_NAMES.MY_PAGE_INVESTOR_NDA_WRITE + + '?type=send')}>
                                        작성하기
                                    </Button>
                                </div>
                            </div>
                            <NdaList ref={listRef} {...listProps}/>
                        </div>
                        {/*section end*/}
                    </div>
                    <Footer/>
                </div>
            </div>
        </>
    )
}

export default SendNda;