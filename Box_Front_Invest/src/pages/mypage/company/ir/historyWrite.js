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
import Calendar from 'components/atomic/Calendar'
import {MinusBtn, NextBtn, PrevBtn} from 'components/atomic/IconButton'

import ProfileImage from "pageComponents/mypage/common/ProfileImage";
import CheckCloseAlertPopup from 'pageComponents/common/pop/CheckCloseAlertPopup'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import ConfirmPopup from 'pageComponents/common/pop/ConfirmPopup'
import MoveTabConfirmPopup from 'pageComponents/common/pop/MoveTabConfirmPopup'

import DateUtils from 'modules/utils/DateUtils'
import FormUtils from 'modules/utils/FormUtils'
import ValidateUtils from 'modules/utils/ValidateUtils'
import CommonConst from 'modules/consts/CommonConst'
import {getPostConfig} from 'modules/utils/CommonAxios'
import {AlertLabels, UsisType} from 'modules/consts/BizConst'
import VoUtils from 'modules/utils/VoUtils'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import {exeFunc} from 'modules/utils/ReactUtils'
import ResponseUtils from 'modules/utils/ResponseUtils'
import Api from 'modules/consts/Api'
import CommonAxios from 'modules/utils/CommonAxios'
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey} from "modules/utils/CommonUtils";

const HistoryWrite = (props) => {

    const galleryData = {
        title: '마이페이지',
        img: '/images/gallery02_img1.png'
    }

    const history = useHistory()
    const commonContext = useContext(CommonContext);

    const [progress, setProgress] = useState(0)
    const [list, setList] = useState([])
    const [reload, setReload] = useState(false)

    const [tabList, setTabList] = useState({
        active: ROUTER_NAMES.MY_PAGE_IR_HISTORY_WRITE,
        list: CommonConst.IR_TAB_WRITE_LIST
    })

    const alertPopRef = useRef();
    const checkCloseAlertPopupRef = useRef();
    const confirmPopRef = useRef();
    const moveTabConfirmRef = useRef();
    const moveTabEmptyConfirmRef = useRef();

    const onChangeInput = (event, item) => {
        FormUtils.setVoInput(item, event.target.id, event.target.value)
    }
    const onChangeDate = (item, property, currentDate) => {
        FormUtils.setVoDateExceptDash(item, property, currentDate)
    }
    const onClickRemove = (item) => {
        let index = -1
        const ordvSqn = item.ordvSqn
        for (let i = 0; i < list.length; i++) {
            const listItem = list[i]
            if (listItem.ordvSqn === ordvSqn) {
                index = i
                break
            }
        }
        if (index > -1) {
            list.splice(index, 1)
            setReload(!reload)
        }
    }

    const onClickAdd = () => {
        let ordvSqn = 0
        if (list.length > 0) {
            const lastItem = list[list.length - 1]
            ordvSqn = lastItem.ordvSqn + 1
        }
        const tempItem = {
            utlinsttId: '',
            ordvSqn: ordvSqn,
            ordvYm: '',
            ordvCon: '',
            groupYear: ''
        }
        const tempList = list.concat(tempItem)
        setList(tempList)
    }

    /** Validation */

    const validateFirst = () => {
        if (list.length === 0) return false
        return true
    }

    const validateCompare = async () => {
        let r = true
        const resHistoryList = await loadHistoryList()
        VoUtils.setListVoNullToEmpty(resHistoryList, ['ordvSqn'])
        if (JSON.stringify(list) !== JSON.stringify(resHistoryList)) {
            r = false
        }
        return r
    }

    /** Move */

    const onClickMove = async (url) => {
        await commonContext.actions.callbackAfterSessionRefresh(async () => {
            if ((await onBeforeMove(url)) === false) {
                return
            }
            history.replace(url)
        }, true, true);
    }

    const onBeforeMove = async (url) => {
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
        onClickMove(ROUTER_NAMES.MY_PAGE_IR_BASIC_INFO_WRITE);
    }

    const onClickNext = async () => {
        onClickMove(ROUTER_NAMES.MY_PAGE_IR_WORKER_WRITE);
    }

    /** Cancel Button */

    const onClickCancel = () => {
        if (progress === 0) {
            // history.replace(ROUTER_NAMES.MY_PAGE_IR);
            onClickMove(ROUTER_NAMES.MY_PAGE_IR);
        } else if (progress > 0) {
            // history.replace(ROUTER_NAMES.MY_PAGE_IR_HISTORY)
            onClickMove(ROUTER_NAMES.MY_PAGE_IR_HISTORY);
        }
    }


    /** Save Button */

    const onClickSave = async () => {
        if (progress === 0) {
            if (list.length === 0) {
                exeFunc(alertPopRef, 'open', AlertLabels.noData);
                return
            }
        }

        exeFunc(confirmPopRef, 'open', AlertLabels.saveIt);
    }

    /** pop ref onConfirm */

    const onConfirmSave = async () => {
        await commonContext.actions.callbackAfterSessionRefresh(save, true, true);
    }

    const onCancelMoveTab = (url) => {
        location.replace(url)
    }

    const onConfirmMoveTabEmpty = async (url) => {
        location.replace(url)
    }

    const save = async () => {
        let isSaveComplete = true
        const saveRes = await CommonAxios(getPostConfig(Api.my.company.irHistorySave, list))
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
        const saveRes = await CommonAxios(getPostConfig(Api.my.company.irHistorySave, list))
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
        const resHistoryList = await loadHistoryList()
        VoUtils.setListVoNullToEmpty(resHistoryList, ['ordvSqn'])
        setList(resHistoryList)
    }

    const loadProgress = async () => {
        const resProgress = await ResponseUtils.getSimpleResponse(Api.my.company.irProgress)
        return resProgress
    }

    const loadHistoryList = async () => {
        const resHistoryList = await ResponseUtils.getList(Api.my.company.irHistoryList)
        return resHistoryList
    }

    const isMounted = useRef(false);

    useEffect(() => {
        if(commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
            isMounted.current = true;
            commonContext.actions.pageMountPathCheck(history, loadDataSet);
        }
    }, [commonContext.state.user]);

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
                                <div className="ir_history write">
                                    <CardLayout>
                                        <div className="section section01">
                                            <div className="info_header">
                                                <h3 className="ico_title">연혁</h3>
                                                <div className="btn_wrap">
                                                    <Button className={'btn_add dashed linear  light_grey'} onClick={onClickAdd}>
                                                        <span className="ico_plus">입력내용추가</span>
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="history_wrap">
                                                <div className="history_section">
                                                    <ul className="history_form_list">{

                                                        list?.map((item, idx) => (
                                                            <li className="history_form_item" key={createKey()}>
                                                                {
                                                                    idx === 0 &&
                                                                    <span className="essen_ico2">*</span>
                                                                }
                                                                <div className="date">
                                                                    <div className="input_wrap">
                                                                        <Calendar
                                                                            title='주요연혁 년월'
                                                                            notFast={true}
                                                                            item={item}
                                                                            property={'ordvYm'}
                                                                            date={DateUtils.customDateFormat(item.ordvYm, 'yyyy-MM')}
                                                                            showMonthYearPicker={true}
                                                                            onChangeDate={(currentDate, item, property) => onChangeDate(item, property, currentDate)}
                                                                            todayLimit={true}
                                                                            calendarChangeType={'year'}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="content">
                                                                    <div className="input_wrap">
                                                                        <input
                                                                            title='연혁내용'
                                                                            type="text"
                                                                            id={'ordvCon'}
                                                                            placeholder=""
                                                                            defaultValue={item.ordvCon}
                                                                            onChange={(event) => onChangeInput(event, item)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="btn_wrap">
                                                                    <MinusBtn onClick={() => onClickRemove(item)}>
                                                                        <span className="hide">삭제</span>
                                                                    </MinusBtn>
                                                                </div>
                                                            </li>
                                                        ))

                                                    }</ul>
                                                </div>
                                            </div>
                                        </div>
                                        {/*<HistoryRegisterForm ref={historyRegisterRef} />*/}
                                    </CardLayout>
                                    <div className="prev_next_wrap">
                                        <PrevBtn onClick={onClickPrev}/>
                                        <NextBtn onClick={onClickNext}/>
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
                onConfirm={onConfirmSave}
                onCancel={onCancelMoveTab}
            />
            <MoveTabConfirmPopup ref={moveTabEmptyConfirmRef} onConfirm={onConfirmMoveTabEmpty}/>
        </>
    )
}
export default HistoryWrite
