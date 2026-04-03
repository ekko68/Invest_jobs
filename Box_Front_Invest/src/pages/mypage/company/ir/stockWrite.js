/** @jsxImportSource @emotion/react */
import React, {useState, useLayoutEffect, useRef, useEffect, useContext} from 'react'
import {useHistory} from 'react-router-dom'

import Header from 'components/header/Header'
import Footer from 'components/common/Footer'
import Gallery01 from 'components/common/Gallery01'
import BreadCrumbs from 'components/common/BreadCrumbs'
import Tab from 'components/common/Tab'
import Button from 'components/atomic/Button'
import CardLayout from 'components/common/card/CardLayout'
import {MinusBtn, NextBtn, PrevBtn} from 'components/atomic/IconButton'
import InformationTooltip from 'components/atomic/InformationTooltip'

import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import NumberInput from 'pageComponents/common/number/NumberInput'
import CheckCloseAlertPopup from 'pageComponents/common/pop/CheckCloseAlertPopup'
import MoveTabConfirmPopup from 'pageComponents/common/pop/MoveTabConfirmPopup'
import ConfirmPopup from 'pageComponents/common/pop/ConfirmPopup'
import ProfileImage from "pageComponents/mypage/common/ProfileImage";

import ROUTER_NAMES from 'modules/consts/RouterConst'
import {exeFunc} from 'modules/utils/ReactUtils'
import ResponseUtils from 'modules/utils/ResponseUtils'
import Api from 'modules/consts/Api'
import CommonConst from 'modules/consts/CommonConst'
import FormUtils from 'modules/utils/FormUtils'
import {AlertLabels} from 'modules/consts/BizConst'
import CommonAxios from 'modules/utils/CommonAxios'
import {getPostConfig} from 'modules/utils/CommonAxios'
import VoUtils from 'modules/utils/VoUtils'
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey} from "modules/utils/CommonUtils";

const StockWrite = (props) => {

    const history = useHistory()
    const commonContext = useContext(CommonContext);

    const galleryData = {
        title: '마이페이지',
        img: '/images/gallery02_img1.png'
    }

    const [progress, setProgress] = useState(0)
    const [list, setList] = useState([])
    const [reload, setReload] = useState(false)
    const [tabList, setTabList] = useState({
        active: ROUTER_NAMES.MY_PAGE_IR_STOCK_WRITE,
        list: CommonConst.IR_TAB_WRITE_LIST
    })

    const alertPopRef = useRef();
    const checkCloseAlertPopupRef = useRef();
    const moveTabConfirmRef = useRef();
    const moveTabEmptyConfirmRef = useRef();
    const confirmPopRef = useRef();

    const onClickAdd = () => {
        let stchSqn = 0
        if (list.length > 0) {
            stchSqn = list[list.length - 1].stchSqn + 1
        }
        const createItem = {
            utlinsttId: '',
            stchSqn: stchSqn,
            stchNm: '',
            pfstHoldCnt: 0,
            pfstPvpr: 0,
            pfstAmt: 0,
            cmscHoldCnt: 0,
            cmscPvpr: 0,
            cmscAmt: 0,
            prra: 0,
            rmrk: ''
        }
        const tempList = [...list]
        tempList.push(createItem)
        setList(tempList)
    }

    const onChangeInput = (event, item) => {
        FormUtils.setVoInput(item, event.target.id, event.target.value, [
            'stchSqn',
            'pfstHoldCnt',
            'pfstPvpr',
            'pfstAmt',
            'cmscHoldCnt',
            'cmscPvpr',
            'cmscAmt',
            'prra'
        ])
    }

    const onChangeNumberInput = (event, item) => {
        item[event.target.id] = event.target.value
    }

    const onChangeRemove = (event, item) => {
        let index = -1
        for (let i = 0; i < list.length; i++) {
            const listItem = list[i]
            if (item['stchSqn'] === listItem['stchSqn']) {
                index = i
            }
        }
        if (index > -1) {
            list.splice(index, 1)
            setReload(!reload)
        }
    }

    /** Validation */

    const validateFirst = () => {
        if (list.length === 0) return false
        return true
    }

    const validateCompare = async () => {
        let r = true
        const stockholderList = await loadStockholderList()
        VoUtils.setListVoNullToEmpty(stockholderList, ['prra', 'stchSqn', 'stckAmt'])
        if (JSON.stringify(stockholderList) !== JSON.stringify(list)) {
            r = false
        }
        return r
    }

    /** Move */

    const onClickMove = (url) => {
        commonContext.actions.callbackAfterSessionRefresh(async () => {
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
        onClickMove(ROUTER_NAMES.MY_PAGE_IR_WORKER_WRITE);
    }
    const onClickNext = () => {
        onClickMove(ROUTER_NAMES.MY_PAGE_IR_FINANCE_WRITE);
    }

    /** Cancel Button */

    const onClickCancel = () => {
        if (progress === 0) {
            onClickMove(ROUTER_NAMES.MY_PAGE_IR);
        } else if (progress > 0) {
            onClickMove(ROUTER_NAMES.MY_PAGE_IR_STOCK);
        }
    }

    /** Save Button */

    const onClickSave = () => {
        if (progress === 0) {
            if (list.length === 0) {
                exeFunc(alertPopRef, 'open', AlertLabels.noData);
                return
            }
        }

        exeFunc(confirmPopRef, 'open', AlertLabels.saveIt);
    }

    /** pop ref confirm */

    const onCancelMoveTab = (url) => {
        location.replace(url)
    }

    const onConfirmMoveTabEmpty = async (url) => {
        location.replace(url)
    }

    const onConfirmSave = async () => {
        await commonContext.actions.callbackAfterSessionRefresh(save, true, true);
    }

    const onConfirmMoveTab = async (url) => {
        await commonContext.actions.callbackAfterSessionRefresh(async () => {
            if ((await saveBeforeTabMove()) === false) {
                return
            }
            setTimeout(() => {
                location.replace(url)
            }, 500)
        }, true, true);
    }

    const save = async () => {
        let isSaveComplete = true
        const saveRes = await CommonAxios(getPostConfig(Api.my.company.irStockholdersSave, list))
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
        const saveRes = await CommonAxios(getPostConfig(Api.my.company.irStockholdersSave, list))
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
        const stockholderList = await loadStockholderList()
        VoUtils.setListVoNullToEmpty(stockholderList, [
            'stchSqn',
            'pfstHoldCnt',
            'pfstPvpr',
            'pfstAmt',
            'cmscHoldCnt',
            'cmscPvpr',
            'cmscAmt',
            'prra'
        ])
        setList(stockholderList)
    }

    const loadProgress = async () => {
        const resProgress = await ResponseUtils.getSimpleResponse(Api.my.company.irProgress)
        return resProgress
    }

    const loadStockholderList = async () => {
        const stockholderList = await ResponseUtils.getList(Api.my.company.irStockholdersList)
        return stockholderList
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
                            <div className="ir_section_wrap ">
                                <div className="ir_stock_write">
                                    <CardLayout>
                                        {/*section01 start*/}
                                        <div className="section section01">
                                            <div className="card_header">
                                                <h3 className="ico_title">주주</h3>
                                                <div className="btn_group">
                                                    <Button type={'dashed'} className={'btn_add'} onClick={onClickAdd}>
                                                        <span className="ico_plus">입력내용추가</span>
                                                    </Button>
                                                </div>
                                            </div>

                                            <table className="table type02">
                                                <caption>주주현황 등록 테이블</caption>
                                                <colgroup>
                                                    <col width={'10%'}/>
                                                    <col width={'8%'}/>
                                                    <col width={'8%'}/>
                                                    <col width={'10%'}/>
                                                    <col width={'8%'}/>
                                                    <col width={'8%'}/>
                                                    <col width={'10%'}/>
                                                    <col width={'12%'}/>
                                                    <col width={'*'}/>
                                                    <col width={'5%'}/>
                                                </colgroup>
                                                <thead>
                                                <tr>
                                                    <th rowSpan={2} className="middle">
                                                        주주명
                                                    </th>
                                                    <th colSpan={3}>우선주</th>
                                                    <th colSpan={3}>보통주</th>
                                                    <th rowSpan={2} className={'middle'}>
                                                        지분율
                                                    </th>
                                                    <th colSpan={2} rowSpan={2} className={'middle'}>
                                                        비고
                                                    </th>
                                                </tr>
                                                <tr>
                                                    <th>보유주</th>
                                                    <th>액면가</th>
                                                    <th>금액</th>
                                                    <th>보유주</th>
                                                    <th>액면가</th>
                                                    <th>금액</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {/*{*/}
                                                {/*    // todo : 해당 span은 문법적으로 지양되므로 확인 및 수정 요청*/}
                                                {/*    (list?.length > 0) && <span className="essen_ico2">*</span>*/}
                                                {/*}*/}
                                                {/*{*/}
                                                {/*    list?.map((item, idx) => <StockItem item={item} idx={idx}*/}
                                                {/*                                        key={createKey()}/>)*/}
                                                {/*}*/}
                                                {
                                                    list?.map((item, idx) => (
                                                        <tr key={createKey()}>
                                                            <td>
                                                                {(idx == 0) && <span className="essen_ico2">*</span>}
                                                                <input
                                                                    title='주주명'
                                                                    type="text"
                                                                    id={'stchNm'}
                                                                    className="input"
                                                                    placeholder=""
                                                                    defaultValue={item['stchNm']}
                                                                    onChange={(event) => onChangeInput(event, item)}
                                                                />
                                                            </td>
                                                            <td>
                                                                <NumberInput title='우선주 보유주' item={item} numberProperty={'pfstHoldCnt'}
                                                                             displayValue={item['pfstHoldCnt']}/>
                                                            </td>
                                                            <td>
                                                                <NumberInput title='우선주 액면가' item={item} numberProperty={'pfstPvpr'}
                                                                             displayValue={item['pfstPvpr']}/>
                                                            </td>
                                                            <td>
                                                                <NumberInput title='우선주 금액' item={item} numberProperty={'pfstAmt'} displayValue={item['pfstAmt']}/>
                                                            </td>
                                                            <td>
                                                                <NumberInput title='보통주 보유주' item={item} numberProperty={'cmscHoldCnt'}
                                                                             displayValue={item['cmscHoldCnt']}/>
                                                            </td>
                                                            <td>
                                                                <NumberInput title='보통주 액면가' item={item} numberProperty={'cmscPvpr'}
                                                                             displayValue={item['cmscPvpr']}/>
                                                            </td>
                                                            <td>
                                                                <NumberInput title='보통주 금액' item={item} numberProperty={'cmscAmt'} displayValue={item['cmscAmt']}/>
                                                            </td>
                                                            <td className="text_right">
                                                                {/*<NumberInput item={item} numberProperty={'prra'} displayValue={item['prra']} />*/}
                                                                <div className="input_rate unit_input_wrap">
                                                                    <input
                                                                        title='지분율'
                                                                        type="number"
                                                                        id={'prra'}
                                                                        className={'input'}
                                                                        defaultValue={item['prra']}
                                                                        onChange={(event) => onChangeNumberInput(event, item)}
                                                                    />
                                                                    <span className="unit">%</span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <input
                                                                    title='비고'
                                                                    type="text"
                                                                    id={'rmrk'}
                                                                    className="input"
                                                                    placeholder=""
                                                                    defaultValue={item['rmrk']}
                                                                    onChange={(event) => onChangeInput(event, item)}
                                                                />
                                                            </td>
                                                            <td>
                                                                <MinusBtn onClick={(event) => onChangeRemove(event, item)}>
                                                                    <span className="hide">삭제</span>
                                                                </MinusBtn>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                                </tbody>
                                            </table>
                                            <div className="notice_wrap">
                                                <InformationTooltip>
                                                    <p className="text">
                                                        본 지분율은 일반적인 산정방식인 우선주에 의결권이 없음을 전제로 한 것이며 따라서 해당 기업의
                                                        정관에서 정한 사항에 따라 실제와 차이가 있을 수 있습니다.
                                                    </p>
                                                </InformationTooltip>
                                            </div>
                                        </div>
                                        {/*section01 end*/}
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
            <MoveTabConfirmPopup
                ref={moveTabConfirmRef}
                // onConfirm={onConfirmMoveTab}
                onConfirm={onConfirmSave}
                onCancel={onCancelMoveTab}
            />
            <MoveTabConfirmPopup ref={moveTabEmptyConfirmRef} onConfirm={onConfirmMoveTabEmpty}/>
            <ConfirmPopup ref={confirmPopRef} onConfirm={onConfirmSave}/>
        </>
    )
}
export default StockWrite
