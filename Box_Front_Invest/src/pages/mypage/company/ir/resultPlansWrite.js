/** @jsxImportSource @emotion/react */
import React, {useContext, useEffect, useRef, useState} from 'react'
import {useHistory} from 'react-router-dom'

import Header from 'components/header/Header'
import Footer from 'components/common/Footer'
import Gallery01 from 'components/common/Gallery01'
import BreadCrumbs from 'components/common/BreadCrumbs'
import Tab from 'components/common/Tab'
import Button from 'components/atomic/Button'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import {PrevBtn} from 'components/atomic/IconButton'
import InformationTooltip from 'components/atomic/InformationTooltip'
import CardLayout from 'components/common/card/CardLayout'

import PlanList from 'pageComponents/mypage/company/ir/resultplans/PlanList'
import InvestList from 'pageComponents/mypage/company/ir/resultplans/InvestList'
import AwardList from 'pageComponents/mypage/company/ir/resultplans/AwardList'
import ExportList from 'pageComponents/mypage/company/ir/resultplans/ExportList'
import PolicyFundList from 'pageComponents/mypage/company/ir/resultplans/PolicyFundList'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import CheckCloseAlertPopup from 'pageComponents/common/pop/CheckCloseAlertPopup'
import ConfirmPopup from 'pageComponents/common/pop/ConfirmPopup'
import MoveTabConfirmPopup from 'pageComponents/common/pop/MoveTabConfirmPopup'
import ProfileImage from "pageComponents/mypage/common/ProfileImage";

import ResponseUtils from 'modules/utils/ResponseUtils'
import Api from 'modules/consts/Api'
import CommonConst from 'modules/consts/CommonConst'
import {setFunc, getFunc, exeFunc} from 'modules/utils/ReactUtils'
import {AlertLabels, UsisType} from 'modules/consts/BizConst'
import CommonAxios from 'modules/utils/CommonAxios'
import {getPostConfig} from 'modules/utils/CommonAxios'
import VoUtils from 'modules/utils/VoUtils'
import {CommonContext} from "modules/contexts/common/CommomContext";
import {CodeContext} from "modules/contexts/common/CodeContext";

const ResultPlansWrite = (props) => {

    const history = useHistory();
    const commonContext = useContext(CommonContext);
    const codeContext = useContext(CodeContext);

    const alertPopRef = useRef();
    const confirmPopRef = useRef();
    const checkCloseAlertPopupRef = useRef();
    const moveTabConfirmRef = useRef();
    const moveTabEmptyConfirmRef = useRef();

    const investListRef = useRef()
    const awardListRef = useRef()
    const exportListRef = useRef()
    const policyFundListRef = useRef()
    const planListRef = useRef()

    const [progress, setProgress] = useState(0)
    const [toolTip, setToolTip] = useState(true);
    const [plan, setPlan] = useState([])
    const [vo, setVo] = useState({
        awardList: [],
        exportList: [],
        investList: [],
        planList: [],
        policyFundList: []
    })

    const galleryData = {
        title: '마이페이지',
        img: '/images/gallery02_img1.png'
    }

    const [tabList, setTabList] = useState({
        active: ROUTER_NAMES.MY_PAGE_IR_RESULT_PLANS_WRITE,
        list: CommonConst.IR_TAB_WRITE_LIST
    });


    /** Validation */

    const validateFirst = () => {
        const investList = getFunc(investListRef, 'getData')
        const awardList = getFunc(awardListRef, 'getData')
        const exportList = getFunc(exportListRef, 'getData')
        const policyFundList = getFunc(policyFundListRef, 'getData')
        const planList = getFunc(planListRef, 'getData')
        if (investList.length > 0) return true
        if (awardList.length > 0) return true
        if (exportList.length > 0) return true
        if (policyFundList.length > 0) return true
        if (planList.length > 0) return true
        return false
    }
    const validateCompare = async () => {
        let r = true
        const investList = getFunc(investListRef, 'getData')
        const awardList = getFunc(awardListRef, 'getData')
        const exportList = getFunc(exportListRef, 'getData')
        const policyFundList = getFunc(policyFundListRef, 'getData')
        const planList = getFunc(planListRef, 'getData')

        vo.investList = investList
        vo.awardList = awardList
        vo.exportList = exportList
        vo.policyFundList = policyFundList
        vo.planList = planList
        const resResultPlan = await loadResultPlan()
        VoUtils.setListVoNullToEmpty(resResultPlan.awardList, ['beawAcrsSqn'])
        VoUtils.setListVoNullToEmpty(resResultPlan.exportList, ['eprtHstSqn', 'eprtAmt'])
        VoUtils.setListVoNullToEmpty(resResultPlan.investList, ['invmOtcmSqn', 'invmAmt'])
        VoUtils.setListVoNullToEmpty(resResultPlan.planList)
        VoUtils.setListVoNullToEmpty(resResultPlan.policyFundList, ['plfnSqn', 'plfnAmt'])
        if (JSON.stringify(resResultPlan) !== JSON.stringify(vo)) {
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
        onClickMove(ROUTER_NAMES.MY_PAGE_IR_PROD_TECH_MARKET_WRITE);
    }

    /** Cancel Button */

    const onClickCancel = () => {
        if (progress === 0) {
            onClickMove(ROUTER_NAMES.MY_PAGE_IR);
        } else if (progress > 0) {
            onClickMove(ROUTER_NAMES.MY_PAGE_IR_RESULT_PLANS);
        }
    }

    /** Save Button */

    const onClickSave = async () => {
        const investList = getFunc(investListRef, 'getData')
        const awardList = getFunc(awardListRef, 'getData')
        const exportList = getFunc(exportListRef, 'getData')
        const policyFundList = getFunc(policyFundListRef, 'getData')
        const planList = getFunc(planListRef, 'getData')
        vo.investList = investList
        vo.awardList = awardList
        vo.exportList = exportList
        vo.policyFundList = policyFundList
        vo.planList = planList

        exeFunc(confirmPopRef, 'open', AlertLabels.saveIt);
    }

    /** pop ref confirm */

    const onConfirmSave = async () => {
        await commonContext.actions.callbackAfterSessionRefresh(save, true, true);
        // await save()
    }

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

    const save = async () => {
        let isSaveComplete = true
        const saveRes = await CommonAxios(getPostConfig(Api.my.company.irPlanSave, vo))
        if (saveRes && saveRes.status === 200) {
            if (saveRes.data.hasOwnProperty('code') && saveRes.data.code !== '200') {
                isSaveComplete = false;
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
        const saveRes = await CommonAxios(getPostConfig(Api.my.company.irPlanSave, vo))
        if (saveRes && saveRes.status === 200) {
            if (saveRes.data.hasOwnProperty('code') && saveRes.data.code !== '200') {
                isSaveComplete = false;
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

        const resPlan = codeContext.actions.getIrIndexList();
        if (resPlan.length > 0) {
            const emptyItem = {
                id: '',
                value: '',
                comCdId: '',
                comCdNm: ''
            }
            resPlan.unshift(emptyItem)
        }
        setPlan(resPlan)

        const resResultPlan = await loadResultPlan()
        VoUtils.setListVoNullToEmpty(resResultPlan.awardList, ['beawAcrsSqn'])
        VoUtils.setListVoNullToEmpty(resResultPlan.exportList, ['eprtHstSqn', 'eprtAmt'])
        VoUtils.setListVoNullToEmpty(resResultPlan.investList, ['invmOtcmSqn', 'invmAmt'])
        VoUtils.setListVoNullToEmpty(resResultPlan.planList)
        VoUtils.setListVoNullToEmpty(resResultPlan.policyFundList, ['plfnSqn', 'plfnAmt'])
        setVo(resResultPlan)
        setFunc(investListRef, 'setData', resResultPlan.investList)
        setFunc(awardListRef, 'setData', resResultPlan.awardList)
        setFunc(exportListRef, 'setData', resResultPlan.exportList)
        setFunc(policyFundListRef, 'setData', resResultPlan.policyFundList)
        setFunc(planListRef, 'setData', resResultPlan.planList)
    }

    const loadProgress = async () => {
        const resProgress = await ResponseUtils.getSimpleResponse(Api.my.company.irProgress)
        return resProgress
    }
    const loadResultPlan = async () => {
        const resResultPlan = await ResponseUtils.getSimpleResponse(Api.my.company.irPlanDetail)
        return resResultPlan
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
                        {/*section start*/}
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
                            {/*ir_section_wrap start*/}
                            <div className="ir_section_wrap ">
                                <div className="ir_result_plans_write">
                                    <CardLayout>
                                        {/*section01 start*/}
                                        <div className="section section01">
                                            <h3 className="ico_title"><span className="essen_ico2">*</span>주요성과</h3>
                                            <div className="table_box">
                                                <InvestList ref={investListRef}/>
                                                <AwardList ref={awardListRef}/>
                                                {/*수상실적 end*/}
                                            </div>

                                            <div className="table_box">
                                                <ExportList ref={exportListRef}/>
                                                <PolicyFundList ref={policyFundListRef}/>
                                                {/*정책자금 end*/}
                                            </div>
                                        </div>
                                        {/*section01 end*/}

                                        {/*section02 start*/}
                                        <div className="section section02">
                                            <h3 className="ico_title"><span className="essen_ico2">*</span>주요계획</h3>
                                            <PlanList ref={planListRef} plan={plan}/>
                                            <div className="info_msg_wrap">
                                                {
                                                    toolTip &&
                                                    <InformationTooltip onClose={() => setToolTip(!toolTip)}>
                                                        ※ 매출, 채용, 파트너쉽 등과 같은 주요지표를 등록해 주세요.
                                                    </InformationTooltip>
                                                }
                                            </div>
                                        </div>
                                        {/*section02 end*/}
                                    </CardLayout>
                                    <div className="prev_next_wrap">
                                        <PrevBtn onClick={onClickPrev}/>
                                        {/*<NextBtn onClick={onClickNext} />*/}
                                        <div>&nbsp;</div>
                                    </div>
                                </div>
                            </div>
                            {/*ir_section_wrap end*/}
                        </div>
                        {/*section end*/}
                    </div>
                    <Footer/>
                </div>
            </div>
            <AlertPopup ref={alertPopRef}/>
            <CheckCloseAlertPopup ref={checkCloseAlertPopupRef}/>
            <ConfirmPopup ref={confirmPopRef} onConfirm={onConfirmSave}/>
            <MoveTabConfirmPopup
                ref={moveTabConfirmRef}
                // onConfirm={onConfirmMoveTab}
                onConfirm={onConfirmSave}
                onCancel={onCancelMoveTab}
            />
            <MoveTabConfirmPopup ref={moveTabEmptyConfirmRef} onConfirm={onConfirmMoveTabEmpty}/>
        </>
    )
}
export default ResultPlansWrite
