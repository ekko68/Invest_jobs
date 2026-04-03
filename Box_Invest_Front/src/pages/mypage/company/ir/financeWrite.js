/** @jsxImportSource @emotion/react */
import React, {useContext, useEffect, useRef, useState} from 'react'
import {useHistory} from 'react-router-dom'

import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import ConfirmPopup from 'pageComponents/common/pop/ConfirmPopup'
import MoveTabConfirmPopup from 'pageComponents/common/pop/MoveTabConfirmPopup'
import CheckCloseAlertPopup from "pageComponents/common/pop/CheckCloseAlertPopup";
import NumberInput from 'pageComponents/common/number/NumberInput'
import ProfileImage from "pageComponents/mypage/common/ProfileImage";

import Button from 'components/atomic/Button'
import Calendar from 'components/atomic/Calendar'
import {MinusBtn, NextBtn, PrevBtn} from 'components/atomic/IconButton'
import BreadCrumbs from 'components/common/BreadCrumbs'
import CardLayout from 'components/common/card/CardLayout'
import Footer from 'components/common/Footer'
import Gallery01 from 'components/common/Gallery01'
import Header from 'components/header/Header'
import Tab from 'components/common/Tab'

import Api from 'modules/consts/Api'
import CommonConst from 'modules/consts/CommonConst'
import {AlertLabels} from 'modules/consts/BizConst'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import CommonAxios from 'modules/utils/CommonAxios'
import {getPostConfig} from 'modules/utils/CommonAxios'
import {exeFunc} from 'modules/utils/ReactUtils'
import ResponseUtils from 'modules/utils/ResponseUtils'
import VoUtils from 'modules/utils/VoUtils'
import moment from 'moment'
import DateUtils from "modules/utils/DateUtils";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey} from "modules/utils/CommonUtils";

const FinanceWrite = (props) => {

    const galleryData = {
        title: '마이페이지',
        img: '/images/gallery02_img1.png'
    }
    const history = useHistory()
    const commonContext = useContext(CommonContext);

    const alertPopRef = useRef();
    const moveTabConfirmRef = useRef();
    const moveTabEmptyConfirmRef = useRef();
    const confirmPopRef = useRef();
    const checkCloseAlertPopupRef = useRef();

    /** tab 목록 */
    const [tabList, setTabList] = useState({
        active: ROUTER_NAMES.MY_PAGE_IR_FINANCE_WRITE,
        list: CommonConst.IR_TAB_WRITE_LIST
    })

    /** 통합 vo - IR작성 / 주요재무현황 / 주요채무현황 List */
    const [vo, setVo] = useState({
        ampmAmt: 0,
        amslAmt: 0,
        cpcrAmt: 0,
        cpfnAmt: 0,
        cpspMnyAmt: 0,
        cptsTtsmAmt: 0,
        crlbAmt: 0,
        crtxAmt: 0,
        ctnpAmt: 0,
        debtList: [],
        ernspAmt: 0,
        etcFlasAmt: 0,
        etcInlvPlCtam: 0,
        etcNoneFlasAmt: 0,
        flasAmt: 0,
        inasAmt: 0,
        itasAmt: 0,
        ivasAmt: 0,
        lbltTtsmAmt: 0,
        nnoeAmt: 0,
        noneCrlbAmt: 0,
        noneFlasAmt: 0,
        nonopExpAmt: 0,
        opprAmt: 0,
        orpfAmt: 0,
        progress: 0,
        qckasAmt: 0,
        sacstAmt: 0,
        sltpAmt: 0,
        tgasAmt: 0,
        utlinsttId: '',
        lbltCptsTtsm: 0,
        astTtsmAmt: 0
    })

    /** 주요채무현황 vo */
    const debVo = {
        utlinsttId: vo.utlinsttId, // 이용기관(회사) ID
        brngPlceSqn: 0, // 차입처 순번
        brngPlceNm: '', // 차입처명
        brngPlceAmt: 0, // 차입처 금액
        expiDt: '', // 만기날짜
        intRt: 0.0, // 이자율
        rpmnCndtCon: '' // 상환조건 내용
    }

    /** 주요채무현황 - 자산총계 / 부채와 자본총계 자동 계산[기획 - 자동계산 사용 안함: 모두 수기입력]  */
    // const changeNow = () => {
    //   const temp = { ...vo }
    //   // 자산총계
    //   temp.flasAmt = temp.qckasAmt + temp.inasAmt + temp.etcFlasAmt
    //   temp.noneFlasAmt = temp.ivasAmt + temp.tgasAmt + temp.itasAmt + temp.etcNoneFlasAmt
    //   // 부채와 자본총계
    //   temp.lbltTtsmAmt = temp.crlbAmt + temp.noneCrlbAmt
    //   temp.cptsTtsmAmt = temp.cpspMnyAmt + temp.cpspMnyAmt + temp.cpcrAmt + temp.etcInlvPlCtam + temp.ernspAmt
    //   setVo(temp)
    // }

    /** + 입력내용 추가버튼 클릭 - 주요채무현황 item 추가 */
    const handleAdd = (e) => {
        const temp_debVo = {...debVo}
        const temp_debVoList = {...vo}.debtList
        const last_brngPlceSqn = temp_debVoList.length ? temp_debVoList[temp_debVoList.length - 1]['brngPlceSqn'] + 1 : 0
        temp_debVo.brngPlceSqn = last_brngPlceSqn
        temp_debVoList.push(temp_debVo)
        setVo((currentVo) => ({...currentVo, debtList: temp_debVoList}))
    }

    /** - 버튼 클릭 - 주요채무현황 item 삭제 */
    const handleDel = (brngPlceSqn) => {
        const temp_debVoList = vo.debtList.filter((debVo) => debVo.brngPlceSqn !== brngPlceSqn)
        setVo((currentVo) => ({...currentVo, debtList: temp_debVoList}))
    }

    /** 주요채무현황 입력값변경 */
    const handleChange = (e) => {
        const {type, id, value} = e.target
        const sqn = Number(e.target.dataset.sqn)

        const temp_debVoList = vo.debtList.map((debVo) => {
            if (debVo.brngPlceSqn === sqn) {
                debVo[id] = type === 'number' ? Number(value) : value
            }
            return debVo
        })

        setVo((currentVo) => ({...currentVo, debtList: temp_debVoList}))
    }

    /** 날짜변경 */
    const handleChangeDate = (currentDate, item, property) => {
        // item[property] = moment(currentDate).format('YYYYMMDD')
        item[property] = DateUtils.customDateFormat(currentDate, 'yyyyMMdd');
        const temp_debVoList = vo.debtList.map((debVo) => (debVo.brngPlceSqn === item.brngPlceSqn ? item : debVo))
        setVo((currentVo) => ({...currentVo, debtList: temp_debVoList}))
    }

    /** 주요채무현황 List UI */
    const debVoListUi = vo.debtList.map((debVo) => (
        <TableTr
            key={createKey()}
            debVo={debVo}
            handleDel={handleDel}
            handleChange={handleChange}
            handleChangeDate={handleChangeDate}
        />
    ))

    /** ============ Validation ============ */

    /** 통합된 vo에서 progress를 제거하여 api에 최적화된 vo 반환 */
    const makeTempVo = () => {
        const tempVo = {...vo}
        delete tempVo.progress
        return tempVo
    }

    /** api 데이타와 화면의 데이타 비교 - 같으면 false 다르면 true */
    const isApiVoAndVoEqual = async () => {
        let data = await getDataFinance()
        // 기본 vo값과 api로 넘어온 vo값을 비교하여 Number type의 property가 null값을 가진경우 0으로 초기화 해줌.
        data = VoUtils.setInitNumberToZero(makeTempVo(), data)
        return JSON.stringify(makeTempVo()) === JSON.stringify(data)
    }

    /** ============ Move ============ */

    /** 페이지 이동 전 작성 취소 확인 */
    const checkedChangeData = async (url) => {
        const _isApiVoAndVoEqual = await isApiVoAndVoEqual()
        if (vo.progress === 0 && _isApiVoAndVoEqual === false) {
            exeFunc(moveTabConfirmRef, 'open', AlertLabels.notSaveMove, url);
        }
        else if (_isApiVoAndVoEqual === false) {
            exeFunc(moveTabConfirmRef, 'open', AlertLabels.askEditSaveBeforeCancel, url);
        } else {
            history.replace(url)
        }

        // if (vo.progress === 0) {
        //     exeFunc(moveTabConfirmRef, 'open', AlertLabels.notSaveMove, url);
        // } else {
        //     exeFunc(moveTabConfirmRef, 'open', AlertLabels.askEditSaveBeforeCancel, url);
        // }
    }

    /** 변경된 내용이 존재 - 저장후 이동 클릭 */
    const handleConfirmMoveTab = async (url) => {
        await commonContext.actions.callbackAfterSessionRefresh(async () => {
            await handleConfirmSave()
            setTimeout(() => {
                location.replace(url)
            }, 500)
        }, true, true);
    }

    /** 변경된 내용이 존재 - 저장하지 않고 이동 클릭 */
    const handleCancelMoveTab = (url) => {
        location.replace(url)
    }

    /** ============ Tab Move ============ */

    /** 탭버튼 클릭 */
    const handleTabList = async (url) => {
        await commonContext.actions.callbackAfterSessionRefresh(async () => await checkedChangeData(url), true, true);
    }

    /** 이전버튼 클릭 */
    const handleClickPrev = async () => {
        const url = ROUTER_NAMES.MY_PAGE_IR_STOCK_WRITE // 이전 : 주주현황
        await commonContext.actions.callbackAfterSessionRefresh(async () => await checkedChangeData(url), true, true);
    }

    /** 다음버튼 클릭 */
    const handleClickNext = async () => {
        const url = ROUTER_NAMES.MY_PAGE_IR_PROD_TECH_MARKET_WRITE // 다음 : 성과 및 계획
        await commonContext.actions.callbackAfterSessionRefresh(async () => await checkedChangeData(url), true, true);
    }

    /** ============ Cancel Button ============ */

    /** 취소버튼 클릭  - IR작성율이 0이면 작성안내 페이지 0이상이면 Review 페이지 이동 */
    const handleCancel = async () => {
        const url = vo.progress === 0 ? ROUTER_NAMES.MY_PAGE_IR : ROUTER_NAMES.MY_PAGE_IR_FINANCE // IR작성 안내 페이지 : 재무정보 페이지
        await commonContext.actions.callbackAfterSessionRefresh(async () => await checkedChangeData(url), true, true);
    }

    /** ============ Save Button ============ */

    /** 저장버튼 클릭 - 변경된 내용 존재 - 확인 팝업창 / 없음 팝업창 */
    const handleSubmit = async () => {
        exeFunc(confirmPopRef, 'open', AlertLabels.saveIt);
    }

    /** ============ pop ref onConfirm ============ */

    /** IR작성이 0% 일때 - 저장하지 않고 이동. / IR작성이 0% 이상 일때 - 변경된 내용이 있지만, 저장하지 않고 이동. */
    const handleConfirmMoveTabEmpty = (url) => {
        location.replace(url)
    }

    const onClickHandleConfirmSave = async () => {
        await commonContext.actions.callbackAfterSessionRefresh(handleConfirmSave, true, true);
    }

    /** 변경된 내용 저장 - API 호출 */
    const handleConfirmSave = async () => {
        const saveVo = makeTempVo()
        const saveRes = await CommonAxios(getPostConfig(Api.my.company.irFinancialSave, saveVo), false)
        if (saveRes && saveRes.status === 200) {
            if (saveRes.data.message === 'OK') {
                exeFunc(checkCloseAlertPopupRef, 'open', AlertLabels.saved);
                await getData();
            } else {
                exeFunc(alertPopRef, 'open', AlertLabels.notSaved);
            }
        } else {
            exeFunc(alertPopRef, 'open', AlertLabels.notSaved);
        }
    }

    /** IR작성 진행율 API 호출 */
    const getDataProgress = async () => {
        return await ResponseUtils.getObject(Api.my.company.irProgress, null, ['progress'])
    }

    /** 주요채무현황 / 주요채무현황 API 호출 */
    const getDataFinance = async () => {
        const properties = Object.keys(makeTempVo())
        return await ResponseUtils.getObject(Api.my.company.irFinanceDetail, null, properties)
    }

    /** IR작성 / 주요채무현황 / 주요채무현황 API 최초 한번 호출 */
    const getData = async () => {
        Promise.all([getDataFinance(), getDataProgress()]).then(([irFinanceDetail, irProgres]) => {
            // 기본 vo값과 api로 넘어온 vo값을 비교하여 Number type의 property가 null값을 가진경우 0으로 초기화 해줌.
            irFinanceDetail = VoUtils.setInitNumberToZero(makeTempVo(), irFinanceDetail)
            setVo((currentVo) => ({...currentVo, ...irFinanceDetail, progress: irProgres.progress || 0}))
        })
    }

    /** 최초 한번 모든 데이타 호출 */

    const isMounted = useRef(false);

    useEffect(() => {
        if(commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
            isMounted.current = true;

            commonContext.actions.pageMountPathCheck(history, getData);
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
                                    IR 작성<strong className="progress highlight_blue">&#40;{vo.progress}%&#41;</strong>
                                </h3>
                                <p className="main_writing_title">* 표시항목은 주요 작성사항입니다.</p>
                            </div>
                            <div className="tab_header">
                                <Tab handleTabActive={handleTabList} data={tabList}/>
                                <div className="btn_group">
                                    <Button onClick={handleCancel}>
                                        취소
                                    </Button>
                                    <Button className={'blue'} onClick={handleSubmit}>
                                        저장
                                    </Button>
                                </div>
                            </div>
                            {/*ir_section_wrap start*/}
                            <div className="ir_section_wrap ">
                                <div className="ir_finance_write">
                                    <CardLayout>
                                        {/*section01 start*/}
                                        <div className="section section01">
                                            <h3 className="ico_title">주요재무현황</h3>
                                            <div className="table_section_wrap flex_btw">
                                                {/*재무상태표 start*/}
                                                <div className="table_section">
                                                    <div className="section_header">
                                                        <p className="section_title"><span className="essen_ico2">*</span>재무상태표</p>
                                                        <span className="info">&#40;단위:원&#41;</span>
                                                    </div>
                                                    <table className="table">
                                                        <caption>재무상태표 테이블</caption>
                                                        <colgroup>
                                                            <col width={'33%'}/>
                                                            <col width={'30%'}/>
                                                            <col width={'37%'}/>
                                                        </colgroup>
                                                        <tbody>
                                                        <tr>
                                                            <th rowSpan={3}>
                                                                <div className="text_box">
                                                                    <p className="name">유동자산</p>
                                                                    <div className="static">
                                                                        <NumberInput
                                                                            title='유동자산'
                                                                            item={vo}
                                                                            numberProperty={'flasAmt'}
                                                                            displayValue={vo.flasAmt}
                                                                            size={12}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </th>
                                                            <td>당좌자산</td>
                                                            <td className="text_right">
                                                                <NumberInput item={vo} title='당좌자산' numberProperty={'qckasAmt'} displayValue={vo.qckasAmt}/>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>재고자산</td>
                                                            <td className="text_right">
                                                                <NumberInput item={vo} title='재고자산' numberProperty={'inasAmt'} displayValue={vo.inasAmt}/>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>기타 유동자산</td>
                                                            <td className="text_right">
                                                                <NumberInput item={vo} title='기타유동자산' numberProperty={'etcFlasAmt'} displayValue={vo.etcFlasAmt}/>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th rowSpan={4}>
                                                                <div className="text_box">
                                                                    <p className="name">비유동자산</p>
                                                                    <p className="static">
                                                                        <NumberInput
                                                                            item={vo}
                                                                            title='비유동자산'
                                                                            numberProperty={'noneFlasAmt'}
                                                                            displayValue={vo.noneFlasAmt}
                                                                            size={12}
                                                                        />
                                                                    </p>
                                                                </div>
                                                            </th>
                                                            <td>투자자산</td>
                                                            <td className="text_right">
                                                                <NumberInput item={vo} title='투자자산' numberProperty={'ivasAmt'} displayValue={vo.ivasAmt}/>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>유형자산</td>
                                                            <td className="text_right">
                                                                <NumberInput item={vo} title='유형자산' numberProperty={'tgasAmt'} displayValue={vo.tgasAmt}/>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>무형자산</td>
                                                            <td className="text_right">
                                                                <NumberInput item={vo} title='무형자산' numberProperty={'itasAmt'} displayValue={vo.itasAmt}/>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>기타 비유동자산</td>
                                                            <td className="text_right">
                                                                <NumberInput
                                                                    item={vo}
                                                                    title='기타비유동자산'
                                                                    numberProperty={'etcNoneFlasAmt'}
                                                                    displayValue={vo.etcNoneFlasAmt}
                                                                />
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                        <tfoot>
                                                        <tr>
                                                            <td colSpan={3}>
                                                                {/*<div className="total_box flex_btw">*/}
                                                                {/*  <span>자산총계</span>*/}
                                                                {/*  <span>{StringUtils.comma(vo.astTtsmAmt)}</span>*/}
                                                                {/*</div>*/}
                                                                <div className="total_box flex_btw">
                                                                    <span>자산총계</span>
                                                                    <NumberInput item={vo} title='자산총계' numberProperty={'astTtsmAmt'} displayValue={vo.astTtsmAmt}/>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        </tfoot>
                                                    </table>
                                                </div>
                                                {/*재무상태표 end*/}

                                                {/*부채상태표 start*/}
                                                <div className="table_section">
                                                    <div className="section_header">
                                                        <p className="section_title"><span className="essen_ico2">*</span>부채상태표</p>
                                                        <span className="info">&#40;단위:원&#41;</span>
                                                    </div>
                                                    <table className="table">
                                                        <caption>부채상태표 테이블</caption>
                                                        <colgroup>
                                                            <col width={'33%'}/>
                                                            <col width={'30%'}/>
                                                            <col width={'37%'}/>
                                                        </colgroup>
                                                        <tbody>
                                                        <tr>
                                                            <th rowSpan={2}>
                                                                <div className="text_box">
                                                                    <p className="name">부채총계</p>
                                                                    <p className="static">
                                                                        <NumberInput
                                                                            item={vo}
                                                                            title='부채총계'
                                                                            numberProperty={'lbltTtsmAmt'}
                                                                            displayValue={vo.lbltTtsmAmt}
                                                                            size={12}
                                                                        />
                                                                    </p>
                                                                </div>
                                                            </th>
                                                            <td>유동부채</td>
                                                            <td className="text_right">
                                                                <NumberInput item={vo} title='유동부채' numberProperty={'crlbAmt'} displayValue={vo.crlbAmt}/>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>비유동부채</td>
                                                            <td className="text_right">
                                                                <NumberInput item={vo} title='비유동부채' numberProperty={'noneCrlbAmt'} displayValue={vo.noneCrlbAmt}/>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th rowSpan={5}>
                                                                <div className="text_box">
                                                                    <p className="name">자본총계</p>
                                                                    <p className="static">
                                                                        <NumberInput
                                                                            item={vo}
                                                                            title='자본총계'
                                                                            numberProperty={'cptsTtsmAmt'}
                                                                            displayValue={vo.cptsTtsmAmt}
                                                                            size={12}
                                                                        />
                                                                    </p>
                                                                </div>
                                                            </th>
                                                            <td>자본금</td>
                                                            <td className="text_right">
                                                                <NumberInput item={vo} title='자본금' numberProperty={'cpfnAmt'} displayValue={vo.cpfnAmt}/>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>자본잉여금</td>
                                                            <td className="text_right">
                                                                <NumberInput item={vo} title='자본잉여금' numberProperty={'cpspMnyAmt'} displayValue={vo.cpspMnyAmt}/>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>자본조정</td>
                                                            <td className="text_right">
                                                                <NumberInput item={vo} title='자본조정' numberProperty={'cpcrAmt'} displayValue={vo.cpcrAmt}/>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>기타포괄손익 누계액</td>
                                                            <td className="text_right">
                                                                <NumberInput
                                                                    item={vo}
                                                                    title='기타포괄손익누계액'
                                                                    numberProperty={'etcInlvPlCtam'}
                                                                    displayValue={vo.etcInlvPlCtam}
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>이익잉여금</td>
                                                            <td className="text_right">
                                                                <NumberInput item={vo} title='이익잉여금' numberProperty={'ernspAmt'} displayValue={vo.ernspAmt}/>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                        <tfoot>
                                                        <tr>
                                                            <td colSpan={3}>
                                                                {/*<div className="flex_btw">*/}
                                                                {/*  <span>부채와 자본총계</span>*/}
                                                                {/*  <span>{StringUtils.comma(vo.lbltTtsmAmt + vo.cptsTtsmAmt)}</span>*/}
                                                                {/*</div>*/}
                                                                <div className="flex_btw">
                                                                    <span>부채와 자본총계</span>
                                                                    <NumberInput
                                                                        item={vo}
                                                                        title='부채와자본총계'
                                                                        numberProperty={'lbltCptsTtsm'}
                                                                        displayValue={vo.lbltCptsTtsm}
                                                                    />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        </tfoot>
                                                    </table>
                                                </div>
                                                {/*부채상태표 end*/}
                                            </div>

                                            {/*손익계산서 start*/}
                                            <div className="profit_loss_wrap">
                                                <div className="section_header">
                                                    <p className="section_title"><span className="essen_ico2">*</span>손익계산서</p>
                                                    <span className="info">&#40;단위:원&#41;</span>
                                                </div>
                                                <ul className="profit_loss_list">
                                                    <li className="profit_loss_item">
                                                        <span className="name">매출액</span>
                                                        <NumberInput item={vo} title='손익계산서' numberProperty={'amslAmt'} displayValue={vo.amslAmt}/>
                                                    </li>
                                                    <li className="profit_loss_item">
                                                        <span className="name">매출원가</span>
                                                        <NumberInput item={vo} title='매출원가' numberProperty={'ampmAmt'} displayValue={vo.ampmAmt}/>
                                                    </li>
                                                    <li className="profit_loss_item">
                                                        <span className="name">매출총이익</span>
                                                        <NumberInput item={vo} title='매출총이익' numberProperty={'sltpAmt'} displayValue={vo.sltpAmt}/>
                                                    </li>
                                                    <li className="profit_loss_item">
                                                        <span className="name">판매관리비</span>
                                                        <NumberInput item={vo} title='판매관리비' numberProperty={'sacstAmt'} displayValue={vo.sacstAmt}/>
                                                    </li>
                                                    <li className="profit_loss_item">
                                                        <span className="name">영업이익</span>
                                                        <NumberInput item={vo} title='영업이익' numberProperty={'opprAmt'} displayValue={vo.opprAmt}/>
                                                    </li>
                                                    <li className="profit_loss_item">
                                                        <span className="name">영업외수익</span>
                                                        <NumberInput item={vo} title='영업외수익' numberProperty={'nnoeAmt'} displayValue={vo.nnoeAmt}/>
                                                    </li>
                                                    <li className="profit_loss_item">
                                                        <span className="name">영업외비용</span>
                                                        <NumberInput item={vo} title='영업외비용' numberProperty={'nonopExpAmt'} displayValue={vo.nonopExpAmt}/>
                                                    </li>
                                                    <li className="profit_loss_item">
                                                        <span className="name">경상이익</span>
                                                        <NumberInput item={vo} title='경상이익' numberProperty={'orpfAmt'} displayValue={vo.orpfAmt}/>
                                                    </li>
                                                    <li className="profit_loss_item">
                                                        <span className="name">법인세</span>
                                                        <NumberInput item={vo} title='법인세' numberProperty={'crtxAmt'} displayValue={vo.crtxAmt}/>
                                                    </li>
                                                    <li className="profit_loss_item">
                                                        <span className="name">당기순이익</span>
                                                        <NumberInput item={vo} title='당기순이익' numberProperty={'ctnpAmt'} displayValue={vo.ctnpAmt}/>
                                                    </li>
                                                </ul>
                                            </div>
                                            {/*손익계산서 end*/}
                                        </div>
                                        {/*section01 end*/}

                                        {/*section02 start*/}
                                        <div className="section section02">
                                            <div className="card_header">
                                                <h3 className="ico_title"><span className="essen_ico2">*</span>주요채무현황</h3>
                                                <div className="btn_group">
                                                    <Button type={'dashed'} className={'btn_add'} onClick={handleAdd}>
                                                        <span className="ico_plus">입력내용 추가</span>
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="table_wrap">
                                                <table className="table">
                                                    <caption>주요채무현황 테이블</caption>
                                                    <colgroup>
                                                        <col width={'16%'}/>
                                                        <col width={'16%'}/>
                                                        <col width={'16%'}/>
                                                        <col width={'16%'}/>
                                                        <col width={'56%'}/>
                                                    </colgroup>
                                                    <thead>
                                                    <tr>
                                                        <th>차입처</th>
                                                        <th>차입금액</th>
                                                        <th>만기일</th>
                                                        <th>이자율</th>
                                                        <th>상환조건</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {debVoListUi}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        {/*section02 end*/}
                                    </CardLayout>
                                    <div className="prev_next_wrap">
                                        <PrevBtn onClick={handleClickPrev}/>
                                        <NextBtn onClick={handleClickNext}/>
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
            {/*<AlertPopup ref={(current) => (alertPopRef = current)} />*/}
            <AlertPopup ref={alertPopRef}/>
            {/*<ConfirmPopup ref={(ref) => (confirmPopRef = ref)} onConfirm={handleConfirmSave} />*/}
            <CheckCloseAlertPopup ref={checkCloseAlertPopupRef}/>
            <ConfirmPopup ref={confirmPopRef} onConfirm={onClickHandleConfirmSave}/>
            <MoveTabConfirmPopup
                ref={moveTabConfirmRef}
                // onConfirm={handleConfirmMoveTab}
                onConfirm={onClickHandleConfirmSave}
                onCancel={handleCancelMoveTab}
            />
            <MoveTabConfirmPopup ref={moveTabEmptyConfirmRef} onConfirm={handleConfirmMoveTabEmpty}/>
        </>
    )
}
const TableTr = (props) => {
    const {debVo, handleDel, handleChange, handleChangeDate} = props
    return (
        <tr>
            <td>
                <input
                    type="text"
                    title='차입처명'
                    id={'brngPlceNm'}
                    className={'input'}
                    placeholder={'차입처'}
                    defaultValue={debVo.brngPlceNm}
                    data-sqn={debVo.brngPlceSqn}
                    onBlur={handleChange}
                />
            </td>
            <td className={'text_right'}>
                {/*<input type="text" className={'input'} placeholder={'금액'} />*/}
                <NumberInput item={debVo} title='차입처금액' numberProperty={'brngPlceAmt'} displayValue={debVo.brngPlceAmt}/>
            </td>
            <td>
                <Calendar
                    item={debVo}
                    title='만기날짜'
                    property={'expiDt'}
                    date={debVo.expiDt ? moment(debVo.expiDt) : ''}
                    onChangeDate={handleChangeDate}
                />
            </td>
            <td>
                <input
                    type="number"
                    id={'intRt'}
                    title='이자율'
                    className={'input'}
                    placeholder={'이자율'}
                    defaultValue={debVo.intRt}
                    data-sqn={debVo.brngPlceSqn}
                    onBlur={handleChange}
                />
            </td>
            <td>
                <div className="input_wrap">
                    <input
                        type="text"
                        id={'rpmnCndtCon'}
                        title='상환조건내용'
                        className={'input'}
                        placeholder={'상환조건 (50자 이내)'}
                        maxLength={50}
                        defaultValue={debVo.rpmnCndtCon}
                        data-sqn={debVo.brngPlceSqn}
                        onBlur={handleChange}
                    />
                    <MinusBtn onClick={() => handleDel(debVo.brngPlceSqn)}>
                        <span className="hide">삭제</span>
                    </MinusBtn>
                </div>
            </td>
        </tr>
    )
}
export default FinanceWrite
