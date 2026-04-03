/** @jsxImportSource @emotion/react */
import React, {useContext, useEffect, useRef, useState} from 'react';
import {useHistory} from "react-router-dom";

import EventStyle from 'assets/style/EventStyle'
import {colors} from 'assets/style/style.config'
import Button from 'components/atomic/Button'
import TokenTimerPopup from "components/header/TokenTimerPopup";

import FaqList from 'pageComponents/event/FaqList'
import EventList from 'pageComponents/event/EventList'
import {openSessionAlert} from "pageComponents/common/pop/SessionCheckAlert";

import Api from 'modules/consts/Api'
import QueryUtils from 'modules/utils/QueryUtils'
import ResponseUtils from 'modules/utils/ResponseUtils'
import {StringUtils} from 'modules/utils/StringUtils'

import {setFunc} from 'modules/utils/ReactUtils'
import BoxUrl from "modules/consts/BoxUrl";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey} from "modules/utils/CommonUtils";
import {CheckYn} from "modules/consts/BizConst";
import {LOGIN_LINK_KEYS} from "modules/contexts/common/LoginContext";

const Event = (props) => {
    const history = useHistory();
    const commonContext = useContext(CommonContext);

    const companyRef = useRef()
    const eventRef = useRef()
    const faqRef = useRef()
    const faqListRef = useRef()
    const eventListRef = useRef()
    const rprsImgUrlBackgroundRef = useRef()

    const onClickHome = () => {
        window.scrollTo(0, 0)
    }

    const onClickScrollRef = (ref, tuning = 0) => {
        const rect = ref.current.getBoundingClientRect();
        const top = rect.top + window.scrollY + tuning;
        window.scrollTo(0, top);
    }

    const [vo, setVo] = useState({
        bannerList: [],
        eventList: [],
        faqList: [],
        pageMainData: {
            bplcNm: '',
            cscnCpyrCon: '',
            cscnEmlAdr: '',
            cscnHmpgUrl: '',
            cscnTpn: '',
            dtlLkngUrlAdr: '',
            etvlAmt: 0,
            fundAmt: 0,
            hmpgUrl: '',
            inrdCon: '',
            inrdImgFileId: '',
            inrdImgFileNm: '',
            inrdImgUrl: '',
            inrdTtl: '',
            invmAplcAbyn: '',
            invmCmpExusPageId: '',
            invmRtrvEnprCnt: 0,
            lgtyImgFileId: '',
            lgtyImgFileNm: '',
            lgtyImgUrl: '',
            pageCon: '',
            pageTtl: '',
            rprsImgFileId: '',
            rprsImgFileNm: '',
            rprsImgUrl: '',
            rvsRnum: '',
            ttalIvenCnt: 0,
            utlinsttId: '',


            fundAmtStr: '',
            etvlAmtStr: ''
        }
    })

    const loadWebLinkPage = async () => {
        let url = Api.vc.webLinkPage
        const query = QueryUtils.getQuery(props)
        if (query.hasOwnProperty('invmCmpExusPageId')) {
            url = Api.vc.webLinkPage + '/' + query['invmCmpExusPageId']
            const webLinkPage = await ResponseUtils.getSimpleResponse(url, null, false)
            if (webLinkPage) {
                return webLinkPage
            }
        }
        return null
    }
    const onClickDtlLkngUrlAdr = () => {
        window.open(vo.pageMainData.dtlLkngUrlAdr)
    }
    const onClockOpenCscnHmpgUrl = () => {
        if (!StringUtils.hasLength(vo.pageMainData.cscnHmpgUrl)) return;
        window.open(vo.pageMainData.cscnHmpgUrl)
    }
    const onClickInvestApply = () => {
        if (!StringUtils.hasLength(vo.pageMainData.utlinsttId)) return;
        window.open(BoxUrl.REACT_APP_URL[String(process.env.REACT_APP_PROFILE)] + '/invest/detail?utlinsttId=' + vo.pageMainData.utlinsttId)
    }

    const isMounted = useRef(false);

    useEffect(() => {
        if(commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
            isMounted.current = true;

            commonContext.actions.pageMountPathCheck(history, async () => {
                const webLinkPage = await loadWebLinkPage()
                if (webLinkPage) {
                    setVo(webLinkPage)
                    setFunc(eventListRef, 'setData', webLinkPage['eventList'])
                    setFunc(faqListRef, 'setData', webLinkPage['faqList'])
                    if (rprsImgUrlBackgroundRef.current) {
                        rprsImgUrlBackgroundRef.current.style.backgroundSize = 'cover'
                    }
                }
            });
        }
    }, [commonContext.state.user]);

    useEffect(() => {
        commonContext.actions.contextMountUserInfoSet(history);
        return () => isMounted.current = false;
    }, []);

    /** token session count ===================================================== */

    const tokenTime = useRef(0);
    const tokenTimer = useRef(null);

    const [tokenTimerPopupSwitch, setTokenTimerPopupSwitch] = useState(false);

    useEffect(() => {
        if (tokenTimer !== null) clearInterval(tokenTimer.current);

        // if(StringUtils.hasLength(sessionStorage.getItem('token'))) {
        if (window.tokenCheck()) {
            console.log('start count!!');
            // tokenTime.current = 270;
            // const refreshExpire = window.parseJwt(sessionStorage.getItem(LOGIN_LINK_KEYS.SI_TOKEN))?.refreshExpire;
            // const curTime = window.getCurTimestamp();

            tokenTime.current =
                Number(window.parseJwt(sessionStorage.getItem(LOGIN_LINK_KEYS.SI_TOKEN))?.refreshExpire) // 리프레시 토큰 만료
                - Number(window.getCurTimestamp())  // 현재 브라우저 시간
                - 30; // 에러 발생 방지를 위한 여유시간

            tokenTimer.current = setInterval(() => {
                if((tokenTime.current % 10) === 0) console.log('timer check : ' + tokenTime.current);

                if(!StringUtils.hasLength(sessionStorage.getItem(LOGIN_LINK_KEYS.TOKEN_TIMER_STOP))) tokenTime.current--;
                // console.log(tokenTime.current);
                if (tokenTime.current == 60) {
                    setTokenTimerPopupSwitch(true);
                }

                if (tokenTime.current == 0) {
                    setTokenTimerPopupSwitch(false);

                    // auth까지 삭제할 경우 -> 새로고침시에도 로그아웃 됨, 대신 확인버튼을 누르지 않았는데 다른 탭에서 로그아웃 될 수 있음
                    // auth는 로그인 만료 확인을 눌렀을 경우만 삭제할 경우 -> 새로고침시 실제 sso 세션이 살아있을 경우 팝업메시지와 다르게 로그아웃이 안됨, 대신 확인 버튼을 누르지 않았을 경우 다른 탭에서 로그아웃이 되지 않음

                    // 1안)
                    // deleteCookie("idSave");
                    // deleteCookie(LOGIN_LINK_KEYS.AUTH_COOKIE);
                    // deleteCookie("cookieExpires");
                    // sessionStorage.clear();

                    // 2안)
                    sessionStorage.setItem(LOGIN_LINK_KEYS.SPA_LOGOUT, "true");

                    openSessionAlert(
                        true,
                        '로그인 세션이 만료되었습니다.',
                        () => commonContext.actions.logout(true)
                    );

                    clearInterval(tokenTimer.current);

                    // commonContext.actions.logout(true);
                    // window.location.href = ROUTER_NAMES.LOGOUT + '?sessionout';
                }
            }, 1000);
        }

        return () => {
            clearInterval(tokenTimer.current);
        }
    }, [commonContext.state.tokenRefreshToggle]);

    /** ===================================================== token session count */

    return (
        <>
            {tokenTimerPopupSwitch && <TokenTimerPopup onClickClose={() => setTokenTimerPopupSwitch(false)}/>}
            <div className="event_wrap event_main_wrap" css={EventStyle}>

                {/*header*/}
                <div className="event_header">
                    <div className="header_top">
                        <div className="header_top_wrap event_size01">
                            <div className="left">
                                <ul className="info_list">
                                    <li className="info_item">
                                        <div className="img">
                                            <span className="hide">Customer Center</span>
                                        </div>
                                        <div className="text">
                                            <p className="title">TEL</p>
                                            <p className="sub_title">{vo.pageMainData.cscnTpn}</p>
                                        </div>
                                    </li>
                                    <li className="info_item">
                                        <div className="img">
                                            <span className="hide">E-mail</span>
                                        </div>
                                        <div className="text">
                                            <p className="title">E-mail</p>
                                            <p className="sub_title">{vo.pageMainData.cscnEmlAdr}</p>
                                        </div>
                                    </li>
                                    <li className="info_item">
                                        <div className="img">
                                            <span className="hide">Website</span>
                                        </div>
                                        <div className="text">
                                            <p className="title">Site</p>
                                            <p className="sub_title" onClick={onClockOpenCscnHmpgUrl} style={{cursor: 'pointer'}}>
                                                {vo.pageMainData.cscnHmpgUrl}
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="right">
                                {
                                    (vo.pageMainData.invmAplcAbyn === CheckYn.YES
                                    && window.tokenCheck()
                                    && commonContext.state.user?.info !== null)
                                        ? (
                                            <Button theme={colors.blue} onClick={onClickInvestApply}>
                                                투자신청하기
                                            </Button>
                                        )
                                        : <></>
                                }
                            </div>
                        </div>
                    </div>

                    {
                        StringUtils.hasLength(vo?.pageMainData?.invmCmpExusPageId) &&
                        <div className="header_bottom">
                            <div className="header_bottom_wrap event_size01">
                                <div className="left">
                                    <div className="logo">{
                                        StringUtils.hasLength(vo.pageMainData.lgtyImgUrl)
                                            ? <img src={vo.pageMainData.lgtyImgUrl} alt={vo.pageMainData.lgtyImgFileNm}/>
                                            : <img src={require('assets/images/no_img.jpg').default} alt='no image'/>
                                    }</div>
                                </div>
                                <div className="right">
                                    <ul className="nav_list">
                                        <li className="nav_item">
                                            <span onClick={onClickHome} style={{cursor: 'pointer'}}>
                                              Home
                                            </span>
                                        </li>
                                        <li className="nav_item">
                                            <span onClick={() => onClickScrollRef(companyRef, -120)} style={{cursor: 'pointer'}}>
                                              회사소개
                                            </span>
                                        </li>
                                        <li className="nav_item">
                                            <span onClick={() => onClickScrollRef(eventRef, -50)} style={{cursor: 'pointer'}}>
                                              이벤트
                                            </span>
                                        </li>
                                        <li className="nav_item">
                                            <span onClick={() => onClickScrollRef(faqRef, 0)} style={{cursor: 'pointer'}}>
                                              FAQ
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    }

                </div>
                {/*section01 start*/}

                {
                    StringUtils.hasLength(vo?.pageMainData?.invmCmpExusPageId) &&
                    <>

                        <div ref={rprsImgUrlBackgroundRef} className="banner_section section01">
                            {
                                StringUtils.hasLength(vo.pageMainData.rprsImgUrl)
                                    ? <div className="bg_wrap">
                                        <img src={vo.pageMainData.rprsImgUrl} alt={vo.pageMainData.rprsImgFileNm}/>
                                    </div>
                                    : <div className="bg_wrap">
                                        <img src={require('assets/images/no_img.jpg').default} alt="no image"/>
                                    </div>
                            }
                            <div className="banner_section_wrap event_size01">
                                <p className="title">{vo.pageMainData.pageTtl}</p>
                                <p
                                    className="sub_title"
                                    dangerouslySetInnerHTML={{__html: StringUtils.toBr(vo.pageMainData.pageCon)}}
                                ></p>
                                <div className="view">{
                                    StringUtils.hasLength(vo.pageMainData.dtlLkngUrlAdr) &&
                                    <Button theme={colors.blue} onClick={onClickDtlLkngUrlAdr}>
                                        자세히 보기
                                    </Button>
                                }</div>
                            </div>
                        </div>
                        <div ref={companyRef} style={{width: '0', height: '0', overflow: 'hidden'}}></div>
                        <div className="section02">
                            <div className="section02_wrap event_size01">
                                <div className="img">
                                    {
                                        StringUtils.hasLength(vo.pageMainData.inrdImgUrl)
                                            ? <img src={vo.pageMainData.inrdImgUrl} alt={vo.pageMainData.inrdImgFileNm}/>
                                            : <img src={require('assets/images/no_img.jpg').default} alt="no image"/>
                                    }
                                </div>
                                <div className="text_wrap">
                                    <p className="ibk_title">{vo.pageMainData.bplcNm}</p>
                                    <p className="title">
                                        {/*고객과 함께하는*/}
                                        {/*<br />*/}
                                        {/*성공투자의 동반자!*/}
                                        {vo.pageMainData.inrdTtl}
                                    </p>
                                    <div className="text_content">
                                        <p className="sub_title">{''}</p>
                                        <p
                                            className="sub_text"
                                            dangerouslySetInnerHTML={{__html: StringUtils.toBr(vo.pageMainData.inrdCon)}}
                                        ></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*section02 end*/}
                        {/*section03 start*/}
                        <div className="section03">
                            <div className="section03_wrap event_size01">
                                <ul className="section03_list">
                                    <li className="section03_item">
                                        <p className="content_text">{vo.pageMainData.fundAmtStr}</p>
                                        <p className="title">펀드금액</p>
                                    </li>
                                    <li className="section03_item">
                                        <p className="content_text">{StringUtils.comma(vo.pageMainData.ttalIvenCnt)}</p>
                                        <p className="title">총 투자기업 수</p>
                                    </li>
                                    <li className="section03_item">
                                        <p className="content_text">{vo.pageMainData.etvlAmtStr}</p>
                                        <p className="title">기업가치</p>
                                    </li>
                                    <li className="section03_item">
                                        <p className="content_text">{StringUtils.comma(vo.pageMainData.invmRtrvEnprCnt)}</p>
                                        <p className="title">EXIT기업</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div ref={eventRef} style={{width: '0', height: '0', overflow: 'hidden'}}></div>
                        <EventList ref={eventListRef} vo={vo}/>
                        <div ref={faqRef} style={{width: '0', height: '0', overflow: 'hidden'}}></div>
                        <FaqList ref={faqListRef}/>
                        <div className="section06">
                            <div className="section06_wrap event_size01">
                                <ul className="company_list">{vo?.bannerList?.map((item, index) => (
                                    <li className="company_item" key={createKey()}>
                                        <div>{
                                            StringUtils.hasLength(item['imgUrl'])
                                                ? <img src={item['imgUrl']} alt='배너이미지'/>
                                                : <img src={require('assets/images/no_img.jpg').default} alt='no image'/>
                                        }</div>
                                    </li>
                                ))}</ul>
                            </div>
                        </div>


                        {/*footer*/}
                        <div className="event_footer">
                            <div className="event_footer_wrap event_size01">
                                <ul className="info_list">
                                    <li className="info_item">
                                        <div className="img">
                                            <span className="hide">Customer Center</span>
                                        </div>
                                        <div className="text">
                                            <p className="title">Customer Center</p>
                                            <p className="sub_title">{vo.pageMainData.cscnTpn}</p>
                                        </div>
                                    </li>
                                    <li className="info_item">
                                        <div className="img">
                                            <span className="hide">E-mail</span>
                                        </div>
                                        <div className="text">
                                            <p className="title">E-mail</p>
                                            <p className="sub_title">{vo.pageMainData.cscnEmlAdr}</p>
                                        </div>
                                    </li>
                                    <li className="info_item">
                                        <div className="img">
                                            <span className="hide">Website</span>
                                        </div>
                                        <div className="text">
                                            <p className="title">Website</p>
                                            <p className="sub_title" onClick={onClockOpenCscnHmpgUrl} style={{cursor: 'pointer'}}>
                                                {vo.pageMainData.cscnHmpgUrl}
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                                <div className="footer_copyright">
                                    <p className="copyright" style={{textAlign: "center"}}>{vo.pageMainData.cscnCpyrCon}</p>
                                </div>
                            </div>
                        </div>
                        {/*event_footer end*/}
                    </>
                }
            </div>
        </>
    )
}

export default Event
