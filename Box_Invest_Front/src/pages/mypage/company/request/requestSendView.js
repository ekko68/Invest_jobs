/** @jsxImportSource @emotion/react */
import React, {useContext, useEffect, useLayoutEffect, useRef, useState} from 'react'
import {useHistory} from 'react-router-dom'

import Header from 'components/header/Header'
import Footer from 'components/common/Footer'
import Gallery01 from 'components/common/Gallery01'
import BreadCrumbs from 'components/common/BreadCrumbs'
import CardLayout from "components/common/card/CardLayout";
import InformationTooltip from "components/atomic/InformationTooltip";

import ProfileImage from "pageComponents/mypage/common/ProfileImage";
import RequestTab from "pageComponents/mypage/common/request/RequestTab";
import RequestList from "pageComponents/mypage/common/request/RequestList";

import ROUTER_NAMES from 'modules/consts/RouterConst'
import {setFunc, setPromiseFunc} from "modules/utils/ReactUtils";
import {ListType, UsisType} from "modules/consts/BizConst";
import Api from "modules/consts/Api";
import ResponseUtils from "modules/utils/ResponseUtils";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {StringUtils} from "modules/utils/StringUtils";
import {isNumber} from "modules/utils/NumberUtils";

const RequestSendView = (props) => {
    const history = useHistory();
    const commonContext = useContext(CommonContext);

    const galleryData = {
        title: '마이페이지',
        img: '/images/gallery02_img1.png'
    }

    const requestTabRef = useRef();
    const requestListRef = useRef();

    const [requestCnt, setRequestCnt] = useState(null);

    const loadSendCount = async () => {
        const sendCountObject = await ResponseUtils.getSimpleResponse(Api.my.company.auditSendCount, null, false)
        if (sendCountObject) {
            const cnt = isNumber(sendCountObject?.requestCnt) ? sendCountObject.requestCnt : 0;
            setRequestCnt((cnt > 5) ? 5 : cnt);
        }
    }

    const listProps = {
        ...props,
        setBadgeCnt: (receiveCnt = 0, sendCnt = 0) => setFunc(requestTabRef, 'setData', receiveCnt, sendCnt),
        loadCompanySendRequestCnt: loadSendCount,
        history: history,
        apiUrl: Api.my.company.auditSendList,
        routerUrl: ROUTER_NAMES.MY_PAGE_COMPANY_REQUEST_DETAIL,
        usisType: UsisType.COMPANY,
        listType: ListType.SEND,
        noResultMsg: '요청하신 투자심사 정보가 없습니다.'
    }

    const tabProps = {
        ...props,
        tabType: 'send',
        history: history,
        receiveRouter: ROUTER_NAMES.MY_PAGE_COMPANY_REQUEST_RECEIVE_VIEW,
        sendRouter: ROUTER_NAMES.MY_PAGE_COMPANY_REQUEST_SEND_VIEW,
    }

    const isMounted = useRef(false);

    useEffect(() => {
        if(commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
            isMounted.current = true;

            commonContext.actions.pageMountPathCheck(history, async () => {
                await setPromiseFunc(requestListRef, 'setData');
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
                <div className="wrap mypage_wrap request_wrap mypage_common bg02">
                    <div className="gallery_logo_wrap">
                        <Gallery01 data={galleryData}/>
                        <ProfileImage/>
                    </div>
                    <BreadCrumbs {...props} />
                    <div className="container default_size02">
                        {/*section start*/}
                        <div className="section section01">
                            <div className="section_header">
                                <RequestTab ref={requestTabRef} {...tabProps}/>
                            </div>
                            <div className="card_layout_wrap">
                                <CardLayout>
                                    <RequestList ref={requestListRef} {...listProps} />
                                    {
                                        isNumber(requestCnt) &&
                                        <InformationTooltip className={'pink'}>
                                            {/*<p>투자심사 요청은 최대 5건까지 진행가능합니다. {requestCnt !== null && `( ${5 - requestCnt} 건 남음 )`}</p>*/}
                                            <p>투자심사 요청은 최대 5건까지 동시에 진행 가능합니다. {requestCnt !== null && ` ( 현재 ${5 - requestCnt} 건 남음 )`}</p>
                                        </InformationTooltip>
                                    }
                                </CardLayout>
                            </div>
                        </div>
                    </div>
                    <Footer/>
                </div>
            </div>
        </>
    )
}
export default RequestSendView
