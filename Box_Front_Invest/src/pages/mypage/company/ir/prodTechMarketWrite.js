/** @jsxImportSource @emotion/react */
import React, {useContext, useEffect, useRef, useState} from 'react'
import {useHistory} from 'react-router-dom'

import Header from 'components/header/Header'
import Footer from 'components/common/Footer'
import Gallery01 from 'components/common/Gallery01'
import BreadCrumbs from 'components/common/BreadCrumbs'
import Tab from 'components/common/Tab'
import Button from 'components/atomic/Button'
import CardLayout from 'components/common/card/CardLayout'
import {NextBtn, PrevBtn} from 'components/atomic/IconButton'

import MaxLengthCount from 'pageComponents/common/number/MaxLengthCount'
import SaleList from 'pageComponents/mypage/company/ir/prodtechmarket/SaleList'
import IpList from 'pageComponents/mypage/company/ir/prodtechmarket/IpList'
import MarketTargetList from 'pageComponents/mypage/company/ir/prodtechmarket/MarketTargetList'
import MarketPlayerList from 'pageComponents/mypage/company/ir/prodtechmarket/MarketPlayerList'
import {AlertLabels, UsisType} from 'modules/consts/BizConst'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import ConfirmPopup from 'pageComponents/common/pop/ConfirmPopup'
import CommonAxios from 'modules/utils/CommonAxios'
import CheckCloseAlertPopup from 'pageComponents/common/pop/CheckCloseAlertPopup'
import MoveTabConfirmPopup from 'pageComponents/common/pop/MoveTabConfirmPopup'
import ProfileImage from "pageComponents/mypage/common/ProfileImage";

import ROUTER_NAMES from 'modules/consts/RouterConst'
import ResponseUtils from 'modules/utils/ResponseUtils'
import Api from 'modules/consts/Api'
import CommonConst from 'modules/consts/CommonConst'
import {exeFunc, getFunc, setFunc} from 'modules/utils/ReactUtils'
import FormUtils from 'modules/utils/FormUtils'
import {getPostConfig} from 'modules/utils/CommonAxios'
import VoUtils from 'modules/utils/VoUtils'
import {CommonContext} from "modules/contexts/common/CommomContext";
import {CodeContext} from "modules/contexts/common/CodeContext";

const ProdTechMarketWrite = (props) => {

    const galleryData = {
        title: '마이페이지',
        img: '/images/gallery02_img1.png'
    }

    const history = useHistory()
    const commonContext = useContext(CommonContext);
    const codeContext = useContext(CodeContext);

    const alertPopRef = useRef();
    const confirmPopRef = useRef();
    const checkCloseAlertPopupRef = useRef();
    const moveTabConfirmRef = useRef();
    const moveTabEmptyConfirmRef = useRef();

    const ipListRef = useRef()
    const saleListRef = useRef()
    const marketTargetListRef = useRef()
    const marketPlayerListRef = useRef()

    const [progress, setProgress] = useState(0)
    const prdtDescRef = useRef()
    const prdtChrcRef = useRef()
    const holdTchnDescRef = useRef()
    const holdTchnChrcRef = useRef()
    const mrktInvgDescRef = useRef()
    const mrktChrcRef = useRef()

    const [vo, setVo] = useState({
        ipList: [],
        market: {mrktChrc: '', mrktInvgDesc: '', utlinsttId: ''},
        marketPlayerList: [],
        marketTargetList: [],
        product: {prdtChrc: '', prdtDesc: '', utlinsttId: ''},
        saleList: [],
        tech: {holdTchnChrc: '', holdTchnDesc: '', utlinsttId: ''}
    })
    const [ip, setIp] = useState([])
    const [domestic, setDomestic] = useState([])

    // tab 목록
    const [tabList, setTabList] = useState({
        active: ROUTER_NAMES.MY_PAGE_IR_PROD_TECH_MARKET_WRITE,
        list: CommonConst.IR_TAB_WRITE_LIST
    })

    const onChangeTextArea = (event) => {
        if (event.target.id === 'prdtDesc') {
            FormUtils.setVoInput(vo.product, event.target.id, event.target.value)
            setFunc(prdtDescRef, 'setData', event.target.value.length)
        } else if (event.target.id === 'prdtChrc') {
            FormUtils.setVoInput(vo.product, event.target.id, event.target.value)
            setFunc(prdtChrcRef, 'setData', event.target.value.length)
        } else if (event.target.id === 'holdTchnDesc') {
            FormUtils.setVoInput(vo.tech, event.target.id, event.target.value)
            setFunc(holdTchnDescRef, 'setData', event.target.value.length)
        } else if (event.target.id === 'holdTchnChrc') {
            FormUtils.setVoInput(vo.tech, event.target.id, event.target.value)
            setFunc(holdTchnChrcRef, 'setData', event.target.value.length)
        } else if (event.target.id === 'mrktInvgDesc') {
            FormUtils.setVoInput(vo.market, event.target.id, event.target.value)
            setFunc(mrktInvgDescRef, 'setData', event.target.value.length)
        } else if (event.target.id === 'mrktChrc') {
            FormUtils.setVoInput(vo.market, event.target.id, event.target.value)
            setFunc(mrktChrcRef, 'setData', event.target.value.length)
        }
    }

    /** Validation */

    const validateFirst = () => {
        const ipList = getFunc(ipListRef, 'getData')
        const saleList = getFunc(saleListRef, 'getData')
        const marketTargetList = getFunc(marketTargetListRef, 'getData')
        const marketPlayerList = getFunc(marketPlayerListRef, 'getData')
        if (ipList.length > 0) return true
        if (saleList.length > 0) return true
        if (marketTargetList.length > 0) return true
        if (marketPlayerList.length > 0) return true
        if (vo.market['mrktInvgDesc'] !== '' || vo.market['mrktChrc'] !== '') return true
        if (vo.product['prdtDesc'] !== '' || vo.product['prdtChrc'] !== '') return true
        if (vo.tech['holdTchnDesc'] !== '' || vo.tech['holdTchnChrc'] !== '') return true

        return false
    }

    const validateCompare = async () => {
        let r = true
        const ipList = getFunc(ipListRef, 'getData')
        const saleList = getFunc(saleListRef, 'getData')
        const marketTargetList = getFunc(marketTargetListRef, 'getData')
        const marketPlayerList = getFunc(marketPlayerListRef, 'getData')
        vo.ipList = ipList
        vo.saleList = saleList
        vo.marketTargetList = marketTargetList
        vo.marketPlayerList = marketPlayerList
        const resProdTechMarket = await loadProdTechMarket()
        VoUtils.setVoNullToEmpty(resProdTechMarket.market)
        VoUtils.setVoNullToEmpty(resProdTechMarket.product)
        VoUtils.setVoNullToEmpty(resProdTechMarket.tech)
        VoUtils.setListVoNullToEmpty(resProdTechMarket.ipList, ['holdTchnSqn'])
        VoUtils.setListVoNullToEmpty(resProdTechMarket.marketPlayerList, ['mrktPtcnSqn', 'amslAmt'])
        VoUtils.setListVoNullToEmpty(resProdTechMarket.marketTargetList, ['prmrGoalSqn', 'prmrGoalAmt'])
        VoUtils.setListVoNullToEmpty(resProdTechMarket.saleList, ['amplSqn', 'amslAmt', 'amslRlim'])
        if (JSON.stringify(resProdTechMarket) !== JSON.stringify(vo)) {
            r = false
        }
        return r
    }

    /** Move */

    const onClickMove = async (url) => {
        await commonContext.actions.callbackAfterSessionRefresh(async () => {
            if ((await onBeforeTabMove(url)) === false) {
                return
            }
            history.replace(url)
        }, true, true);
    }

    const onBeforeTabMove = async (url) => {
        if (progress === 0) {
            if (validateFirst()) {
                exeFunc(moveTabConfirmRef, 'open', AlertLabels.notSaveMove, url);
                return false
            }
        } else if (progress > 0) {
            if ((await validateCompare()) === false) {
                exeFunc(moveTabConfirmRef, 'open', AlertLabels.askEditSaveBeforeCancel, url);
                return false
            }
        }
        // if (progress === 0) {
        //     exeFunc(moveTabConfirmRef, 'open', AlertLabels.notSaveMove, url);
        //     return false
        // } else if (progress > 0) {
        //     exeFunc(moveTabConfirmRef, 'open', AlertLabels.askEditSaveBeforeCancel, url);
        //     return false
        // }
        return true
    }

    /** Tab Move */

    const handleTabList = (url) => {
        onClickMove(url);
    }

    const onClickPrev = () => {
        onClickMove(ROUTER_NAMES.MY_PAGE_IR_FINANCE_WRITE);
    }

    const onClickNext = () => {
        onClickMove(ROUTER_NAMES.MY_PAGE_IR_RESULT_PLANS_WRITE);
    }

    /** Cancel Button */

    const onClickCancel = () => {
        if (progress === 0) {
            // history.replace(ROUTER_NAMES.MY_PAGE_IR)
            onClickMove(ROUTER_NAMES.MY_PAGE_IR);
        } else if (progress > 0) {
            // history.replace(ROUTER_NAMES.MY_PAGE_IR_PROD_TECH_MARKET)
            onClickMove(ROUTER_NAMES.MY_PAGE_IR_PROD_TECH_MARKET);
        }
    }

    /** Save Button */

    const onClickSave = () => {
        const ipList = getFunc(ipListRef, 'getData')
        const saleList = getFunc(saleListRef, 'getData')
        const marketTargetList = getFunc(marketTargetListRef, 'getData')
        const marketPlayerList = getFunc(marketPlayerListRef, 'getData')
        vo.ipList = ipList
        vo.saleList = saleList
        vo.marketTargetList = marketTargetList
        vo.marketPlayerList = marketPlayerList

        exeFunc(confirmPopRef, 'open', AlertLabels.saveIt);
    }

    /** pop ref confirm */

    const onConfirmMoveTab = async (url) => {
        await commonContext.actions.callbackAfterSessionRefresh(async () => {
            if ((await saveBeforeTabMove()) === false) {
                return
            }
            setTimeout(() => {
                location.replace(url)
            }, 500)
        }, true, true)
    }
    const onCancelMoveTab = (url) => {
        location.replace(url)
    }
    const onConfirmMoveTabEmpty = async (url) => {
        location.replace(url)
    }

    const onConfirmSave = async () => {
        await commonContext.actions.callbackAfterSessionRefresh(save, true, true);
    }
    const save = async () => {
        let isSaveComplete = true
        const saveRes = await CommonAxios(getPostConfig(Api.my.company.irExtraInfoSave, vo))
        if (saveRes) {
            if (saveRes.status !== 200) {
                isSaveComplete = false
            }
        } else {
            isSaveComplete = false
        }
        if (isSaveComplete) {
            exeFunc(checkCloseAlertPopupRef, 'open', AlertLabels.saved);
            await loadDataSet();

        } else {
            exeFunc(alertPopRef, 'open', AlertLabels.notSaved);
        }
    }
    const saveBeforeTabMove = async () => {
        let isSaveComplete = true
        const saveRes = await CommonAxios(getPostConfig(Api.my.company.irExtraInfoSave, vo))
        if (saveRes) {
            if (saveRes.status !== 200) {
                isSaveComplete = false
            }
        } else {
            isSaveComplete = false
        }
        if (isSaveComplete) {
            exeFunc(checkCloseAlertPopupRef, 'open', AlertLabels.saved);
        } else {
            exeFunc(alertPopRef, 'open', AlertLabels.notSaved);
        }
        return isSaveComplete
    }

    const loadDataSet = async () => {
        const resProgress = await loadProgress()
        setProgress(resProgress.progress)

        const resIp = codeContext.actions.getIrIpStatusList();
        if (resIp.length > 0) {
            const emptyItem = {
                id: '',
                value: '',
                comCdId: '',
                comCdNm: ''
            }
            resIp.unshift(emptyItem)
        }
        setIp(resIp)

        const resDomestic = codeContext.actions.getIrDomesticList();
        if (resDomestic.length > 0) {
            const emptyItem = {
                id: '',
                value: '',
                comCdId: '',
                comCdNm: ''
            }
            resDomestic.unshift(emptyItem)
        }
        setDomestic(resDomestic)

        const resProdTechMarket = await loadProdTechMarket()
        VoUtils.setVoNullToEmpty(resProdTechMarket.market)
        VoUtils.setVoNullToEmpty(resProdTechMarket.product)
        VoUtils.setVoNullToEmpty(resProdTechMarket.tech)
        VoUtils.setListVoNullToEmpty(resProdTechMarket.ipList, ['holdTchnSqn'])
        VoUtils.setListVoNullToEmpty(resProdTechMarket.marketPlayerList, ['mrktPtcnSqn', 'amslAmt'])
        VoUtils.setListVoNullToEmpty(resProdTechMarket.marketTargetList, ['prmrGoalSqn', 'prmrGoalAmt'])
        VoUtils.setListVoNullToEmpty(resProdTechMarket.saleList, ['amplSqn', 'amslAmt', 'amslRlim'])
        setVo(resProdTechMarket)

        setFunc(ipListRef, 'setData', resProdTechMarket.ipList)
        setFunc(saleListRef, 'setData', resProdTechMarket.saleList)
        setFunc(marketTargetListRef, 'setData', resProdTechMarket.marketTargetList)
        setFunc(marketPlayerListRef, 'setData', resProdTechMarket.marketPlayerList)
    }

    const loadProgress = async () => {
        const resProgress = await ResponseUtils.getSimpleResponse(Api.my.company.irProgress)
        return resProgress
    }
    const loadProdTechMarket = async () => {
        const resProdTechMarket = await ResponseUtils.getSimpleResponse(Api.my.company.irExtraInfoDetail)
        return resProdTechMarket
    }

    const isMounted = useRef(false);

    useEffect(() => {
        if(commonContext.state.user.isLoaded && codeContext.state.isLoaded
            && !commonContext.state.user.isPageMountCheck && !isMounted.current) {

            isMounted.current = true;
            commonContext.actions.pageMountPathCheck(history, loadDataSet);
        }
    }, [commonContext.state.user, codeContext.state.isLoaded]);

    useEffect(() => {
        return () => isMounted.current = false;
    }, []);

    return (
        <>
            <Header/>
            <div className="page_container">
                <div className="wrap mypage_wrap ir_wrap bg02">
                    <div className="gallery_logo_wrap">
                        <Gallery01 data={galleryData}/>
                        <ProfileImage/>
                    </div>
                    <BreadCrumbs {...props} />
                    <div className="container default_size02">
                        <div className="section section01">
                            <div className="section_header writing_wrap">
                                <h3 className="section_title">
                                    IR 작성<strong className="progress highlight_blue">&#40;{progress}%&#41;</strong>
                                </h3>
                                <p className="main_writing_title">* 표시항목은 주요 작성사항입니다.</p>
                            </div>
                            <div className="tab_header">
                                <Tab handleTabActive={handleTabList} data={tabList}/>
                                <div className="btn_group">
                                    <Button onClick={onClickCancel}>
                                        취소
                                    </Button>
                                    <Button className={'blue'} onClick={onClickSave}>
                                        저장
                                    </Button>
                                </div>
                            </div>
                            <div className="ir_section_wrap ">
                                <div className="ir_prod_tech_market_write">
                                    <CardLayout>
                                        <div className="section section01">
                                            <h3 className="ico_title">제품</h3>
                                            <div className="text_box_wrap flex_btw">
                                                <div className="text_box_section">
                                                    <div className="section_header">
                                                        <p className="section_title"><span
                                                            className="essen_ico2">*</span>설명</p>
                                                    </div>
                                                    <div className="textarea_box">
                                                        <textarea
                                                            className={'textarea scroll_lightgrey'}
                                                            title='제품설명'
                                                            id={'prdtDesc'}
                                                            maxLength={1000}
                                                            defaultValue={vo.product.prdtDesc}
                                                            onChange={(event) => onChangeTextArea(event)}
                                                        />
                                                    </div>
                                                    <div className="cnt_wrap">
                                                        <MaxLengthCount
                                                            ref={prdtDescRef}
                                                            max={1000}
                                                            defaultCount={String(vo.product.prdtDesc).length}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="text_box_section">
                                                    <div className="section_header">
                                                        <p className="section_title"><span
                                                            className="essen_ico2">*</span>특징 및 차별성</p>
                                                    </div>
                                                    <div className="textarea_box">
                                                        <textarea
                                                            className={'textarea scroll_lightgrey'}
                                                            title='제품 특징 및 차별성'
                                                            id={'prdtChrc'}
                                                            maxLength={1000}
                                                            defaultValue={vo.product.prdtChrc}
                                                            onChange={(event) => onChangeTextArea(event)}
                                                        />
                                                    </div>
                                                    <div className="cnt_wrap">
                                                        <MaxLengthCount
                                                            ref={prdtChrcRef}
                                                            max={1000}
                                                            defaultCount={String(vo.product.prdtChrc).length}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <SaleList ref={saleListRef} domestic={domestic}/>
                                        </div>
                                        <div className="section section02">
                                            <h3 className="ico_title">기술</h3>
                                            <div className="text_box_wrap flex_btw">
                                                <div className="text_box_section">
                                                    <div className="section_header">
                                                        <p className="section_title"><span
                                                            className="essen_ico2">*</span>주요보유기술</p>
                                                    </div>
                                                    <div className="textarea_box">
                                                        <textarea
                                                            className={'textarea scroll_lightgrey'}
                                                            title='주요보유기술'
                                                            id={'holdTchnDesc'}
                                                            maxLength={1000}
                                                            defaultValue={vo.tech.holdTchnDesc}
                                                            onChange={(event) => onChangeTextArea(event)}
                                                        />
                                                    </div>
                                                    <div className="cnt_wrap">
                                                        <div className="cnt_wrap">
                                                            <MaxLengthCount
                                                                ref={holdTchnDescRef}
                                                                max={1000}
                                                                defaultCount={String(vo.tech.holdTchnDesc).length}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text_box_section">
                                                    <div className="section_header">
                                                        <p className="section_title"><span
                                                            className="essen_ico2">*</span>장점&#47;특징&#47;차별성</p>
                                                    </div>
                                                    <div className="textarea_box">
                                                        <textarea
                                                            className={'textarea scroll_lightgrey'}
                                                            title='장점/특징/차별성'
                                                            id={'holdTchnChrc'}
                                                            maxLength={1000}
                                                            defaultValue={vo.tech.holdTchnChrc}
                                                            onChange={(event) => onChangeTextArea(event)}
                                                        />
                                                    </div>
                                                    <div className="cnt_wrap">
                                                        <MaxLengthCount
                                                            ref={holdTchnChrcRef}
                                                            max={1000}
                                                            defaultCount={String(vo.tech.holdTchnChrc).length}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <IpList ref={ipListRef} ip={ip}/>
                                        </div>
                                        <div className="section section03">
                                            <h3 className="ico_title">시장</h3>
                                            <div className="text_box_wrap flex_btw">
                                                <div className="text_box_section">
                                                    <div className="section_header">
                                                        <p className="section_title"><span
                                                            className="essen_ico2">*</span>시장리서치</p>
                                                    </div>
                                                    <div className="textarea_box">
                                                        <textarea
                                                            className={'textarea scroll_lightgrey'}
                                                            title='시장리서치'
                                                            id={'mrktInvgDesc'}
                                                            maxLength={1000}
                                                            defaultValue={vo.market.mrktInvgDesc}
                                                            onChange={(event) => onChangeTextArea(event)}
                                                        />
                                                    </div>
                                                    <div className="cnt_wrap">
                                                        <MaxLengthCount
                                                            ref={mrktInvgDescRef}
                                                            max={1000}
                                                            defaultCount={String(vo.market.mrktInvgDesc).length}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="text_box_section">
                                                    <div className="section_header">
                                                        <p className="section_title"><span
                                                            className="essen_ico2">*</span>장점&#47;특징&#47;차별성</p>
                                                    </div>
                                                    <div className="textarea_box">
                                                        <textarea
                                                            className={'textarea scroll_lightgrey'}
                                                            title='장점/특징/차별성'
                                                            id={'mrktChrc'}
                                                            maxLength={1000}
                                                            defaultValue={vo.market.mrktChrc}
                                                            onChange={(event) => onChangeTextArea(event)}
                                                        />
                                                    </div>
                                                    <div className="cnt_wrap">
                                                        <MaxLengthCount
                                                            ref={mrktChrcRef}
                                                            max={1000}
                                                            defaultCount={String(vo.market.mrktChrc).length}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <MarketTargetList ref={marketTargetListRef} domestic={domestic}/>
                                            <MarketPlayerList ref={marketPlayerListRef} domestic={domestic}/>
                                        </div>
                                    </CardLayout>
                                    <div className="prev_next_wrap">
                                        <PrevBtn onClick={onClickPrev}/>
                                        <NextBtn onClick={onClickNext}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer/>
                </div>
            </div>
            <AlertPopup ref={alertPopRef}/>
            <CheckCloseAlertPopup ref={checkCloseAlertPopupRef}/>
            <ConfirmPopup ref={confirmPopRef} onConfirm={onConfirmSave}/>
            <MoveTabConfirmPopup
                ref={moveTabConfirmRef}
                onConfirm={onConfirmSave}
                onCancel={onCancelMoveTab}
            />
            <MoveTabConfirmPopup ref={moveTabEmptyConfirmRef} onConfirm={onConfirmMoveTabEmpty}/>
        </>
    )
}

export default ProdTechMarketWrite
