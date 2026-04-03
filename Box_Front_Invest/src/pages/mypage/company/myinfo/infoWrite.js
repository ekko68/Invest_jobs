import React, {useContext, useEffect, useRef, useState} from 'react'
import {useHistory} from 'react-router-dom'

import Footer from 'components/common/Footer'
import Button from 'components/atomic/Button'
import CardLayout from 'components/common/card/CardLayout'
import BreadCrumbs from 'components/common/BreadCrumbs'
import Gallery01 from 'components/common/Gallery01'
import Header from 'components/header/Header'
import Select from 'components/atomic/Select'
import Radio from 'components/atomic/Radio'

import NumberInput from 'pageComponents/common/number/NumberInput'
import MaxLengthCount from 'pageComponents/common/number/MaxLengthCount'
import TagForm from 'pageComponents/common/TagForm'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import ConfirmPopup from 'pageComponents/common/pop/ConfirmPopup'
import ProfileImage from "pageComponents/mypage/common/ProfileImage";

import ROUTER_NAMES from 'modules/consts/RouterConst'
import {setFunc, getFunc, exeFunc} from 'modules/utils/ReactUtils'
import ResponseUtils from 'modules/utils/ResponseUtils'
import Api from 'modules/consts/Api'
import DateUtils from 'modules/utils/DateUtils'
import VoUtils from 'modules/utils/VoUtils'
import CommonAxios from 'modules/utils/CommonAxios'
import {getPostConfig} from 'modules/utils/CommonAxios'
import {AlertLabels, CheckYn} from 'modules/consts/BizConst'
import {CommonContext} from "modules/contexts/common/CommomContext";
import {StringUtils} from "modules/utils/StringUtils";
import {createKey} from "modules/utils/CommonUtils";
import {CodeContext} from "modules/contexts/common/CodeContext";
import CheckCloseCallBackAlertPopup from "pageComponents/common/pop/CheckCloseCallBackAlertPopup";

const InfoWrite = (props) => {

    const galleryData = {
        title: '마이페이지',
        img: '/images/gallery02_img1.png'
    }

    const history = useHistory()
    const commonContext = useContext(CommonContext);
    const codeContext = useContext(CodeContext);

    const interestRef = useRef()
    const maxLengthCountRef = useRef()
    const alertPopRef = useRef()
    const checkCloseAlertPopupRef = useRef()
    const confirmPopRef = useRef()
    const moveConfirmPopupRef = useRef()
    const confirmCancelPopRef = useRef()

    const [vo, setVo] = useState({
        addr: '',
        adres: '',
        bizrno: '',
        bplcNm: '',
        bsunDwarCd: '',
        bsunDwarNm: '',
        btnm: '',
        bzstNm: '',
        cnrnFildList: [],
        crewRtrv: '',
        empCnt: 0,
        enfmClsfCd: '',
        enfmClsfNm: '',
        enprDsncClsfCd: '',
        enprDsncClsfNm: '',
        enprInrdCon: '',
        fondDe: '',
        guAdrAllNm: '',
        hmpgAdres: '',
        ipList: [],
        jurirno: '',
        logoImageUrl: '',
        lstnYn: '',
        msrnAmslAmt: '',
        msrnAmslYear: '',
        nwAdrAllNm: '',
        postNo: '',
        reprsntEmail: '',
        reprsntFxnum: '',
        reprsntTelno: '',
        rprsntvNm: '',
        rvsRnum: '',
        salamt: 0,
        utlinsttId: '',
        convertInfo: {},

        // oppbYn: '',
        // invmAmtCd: '',
        // invmAmtNm: '',
        // invmStgCd: '',
        // invmStgNm: '',
    })


    // 기업형태 :: 셀렉트
    const [goalSelect, setGoalSelect] = useState({
        selected: '',
        selList: []
    })
    const handleGoalSelect = (e) => {
        setVo({
            ...vo,
            enfmClsfCd: e.target.value
        })
        setGoalSelect({
            ...goalSelect,
            selected: e.target.value
        })
    }

    // 기업구분 :: 셀렉트
    const [sectionSelect, setSectionSelect] = useState({
        selected: '',
        selList: []
    })
    const handleSectionSelect = (e) => {
        setVo({
            ...vo,
            enprDsncClsfCd: e.target.value
        })
        setSectionSelect({
            ...sectionSelect,
            selected: e.target.value
        })
    }
    // 최근매출 :: 셀렉트
    const [salesSelect, setSalesSelect] = useState({
        selected: '',
        selList: []
    })
    const handleSaleSelect = (e) => {
        setVo({
            ...vo,
            msrnAmslYear: e.target.value
        });
        setSalesSelect({
            ...salesSelect,
            selected: e.target.value
        });

    }
    // 상장 비상장
    const [publicRadio, setPublicRadio] = useState({
        selected: CheckYn.NO,
        radioList: [
            {id: CheckYn.YES, value: '상장'},
            {id: CheckYn.NO, value: '비상장'}
        ]
    })
    const handlePublicRadio = (e) => {
        setVo({
            ...vo,
            lstnYn: e.target.id
        })
        setPublicRadio({
            ...publicRadio,
            selected: e.target.id
        })
    }

    const setCurrentYear = () => {
        const year = new Date().getFullYear()
        const years = []
        for (let i = year; i >= year - 9; i--) {
            const item = {
                id: i,
                value: i
            }
            years.push(item)
        }
        setSalesSelect({
            selected: '',
            selList: years
        })
    }
    // 사업장소재지 :: 셀렉트
    const [locationSelect, setLocationSelect] = useState({
        selected: '',
        selList: []
    })

    const handleLocationSelect = (e) => {
        setVo({
            ...vo,
            bsunDwarCd: e.target.value
        })
        setLocationSelect({
            ...locationSelect,
            selected: e.target.value
        })
    }
    const onChangeIntroduce = (event) => {
        vo[event.target.id] = event.target.value
        setFunc(maxLengthCountRef, 'setData', event.target.value.length)
    }
    const onChangeInput = (event) => {
        vo[event.target.id] = event.target.value
    }

    /** Cancel Button */

    const onClickCancel = async () => {
        history.replace(ROUTER_NAMES.MY_PAGE_COMPANY_INFO)
    }

    /** Save Button */

    const onClickSave = async () => {
        exeFunc(confirmPopRef, 'open', '저장 하시겠습니까?')
    }

    /** pop ref confirm */
    const onConfirmSave = async () => {
        await commonContext.actions.callbackAfterSessionRefresh(save, true, true);
    }

    const save = async () => {
        const cnrnFildNmList = getFunc(interestRef, 'getData')
        const tempCnrnFildNmList = []
        if (cnrnFildNmList.length > 0) {
            for (let i = 0; i < cnrnFildNmList.length; i++) {
                const item = cnrnFildNmList[i]
                const tempItem = {
                    cnrnFildNm: item['cnrnFildNm']
                }
                tempCnrnFildNmList.push(tempItem)
            }
        }
        vo.cnrnFildList = tempCnrnFildNmList
        let isSaveComplete = true
        const saveRes = await CommonAxios(getPostConfig(Api.my.company.basicInfoSave, vo))
        if (saveRes && saveRes.status === 200) {
            if (saveRes.data.hasOwnProperty('code') && saveRes.data.code !== '200') {
                isSaveComplete = false
            }
        } else {
            isSaveComplete = false
        }
        if (isSaveComplete) {
            exeFunc(checkCloseAlertPopupRef, 'open', AlertLabels.saved) // '저장되었습니다.'
            // await loadAll()
        } else {
            exeFunc(alertPopRef, 'open', AlertLabels.notSaved) // '저장되지 않았습니다. 관리자에게 문의하세요'
        }
    }

    const loadBasciInfo = async () => {
        const investInfo = ResponseUtils.getSimpleResponse(Api.my.company.basicInfoDetail, null, false)
        return investInfo
    }

    const isMounted = useRef(false);

    useEffect(() => {
        if(commonContext.state.user.isLoaded && codeContext.state.isLoaded
            && !commonContext.state.user.isPageMountCheck && !isMounted.current) {

            isMounted.current = true;
            window.scrollTo(window.scrollX, 0)

            commonContext.actions.pageMountPathCheck(history, async () => {
                const basicInfo = await loadBasciInfo()
                VoUtils.setVoNullToEmpty(basicInfo, ['empCnt', 'salamt'], ['convertInfo'])
                setVo(basicInfo)
                const shapeList = codeContext.actions.getCompanyShapeList();
                if (shapeList.length > 0) {
                    const emptyItem = {
                        comCdId: '',
                        comCdNm: '',
                        id: '',
                        rvsRnum: '',
                        value: ''
                    }
                    shapeList.unshift(emptyItem)
                }
                setGoalSelect({
                    selected: basicInfo.enfmClsfCd,
                    selList: shapeList
                })
                const companyTypeList = codeContext.actions.getCompanyTypeList();
                if (companyTypeList.length > 0) {
                    const emptyItem = {
                        comCdId: '',
                        comCdNm: '',
                        id: '',
                        rvsRnum: '',
                        value: ''
                    }
                    companyTypeList.unshift(emptyItem)
                }
                setSectionSelect({
                    selected: basicInfo.enprDsncClsfCd,
                    selList: companyTypeList
                })
                const regionList = codeContext.actions.getRegionList();
                if (regionList.length > 0) {
                    const emptyItem = {
                        comCdId: '',
                        comCdNm: '',
                        id: '',
                        rvsRnum: '',
                        value: ''
                    }
                    regionList.unshift(emptyItem)
                }
                setLocationSelect({
                    selList: regionList,
                    selected: basicInfo.bsunDwarCd
                })
                setFunc(interestRef, 'setData', basicInfo.cnrnFildList)
                setPublicRadio({
                    selected: basicInfo.lstnYn,
                    radioList: [
                        {id: CheckYn.YES, value: '상장'},
                        {id: CheckYn.NO, value: '비상장'}
                    ]
                })
                setCurrentYear()
            });
        }
    }, [commonContext.state.user, codeContext.state.isLoaded]);

    useEffect(() => {
        return () => isMounted.current = false;
    }, []);

    return (
        <>
            <Header/>
            <div className="page_container">
                <div className="wrap mypage_wrap info_wrap company write bg02">
                    <div className="gallery_logo_wrap">
                        <Gallery01 data={galleryData}/>
                        <ProfileImage/>
                    </div>
                    <BreadCrumbs {...props} />
                    <div className="container default_size02">
                        <div className="section section01">
                            <div className="section_header">
                                <h3 className="section_title"> 내 정보</h3>
                                <div className="btn_group">
                                    <Button onClick={onClickCancel}>취소</Button>
                                    <Button className={'blue'} onClick={onClickSave}>
                                        저장
                                    </Button>
                                </div>
                            </div>
                            <CardLayout>
                                <div className="basic_wrap info_section">
                                    <div className="card_header">
                                        <h3 className="ico_title title">기본정보</h3>
                                    </div>
                                    <div className="info_table">
                                        <table className="table type03">
                                            <caption>기본정보 수정 테이블</caption>
                                            <colgroup>
                                                <col width={'12%'}/>
                                                <col width={'38%'}/>
                                                <col width={'12%'}/>
                                                <col width={'38%'}/>
                                            </colgroup>
                                            <tbody>
                                            <tr>
                                                <th>기업명</th>
                                                <td>
                                                    <div className="input_wrap">
                                                        <input type="text" className="input" defaultValue={vo.bplcNm} disabled={true} title="기업명"/>
                                                    </div>
                                                </td>
                                                <th>대표번호</th>
                                                <td>
                                                    <div className="input_wrap">
                                                        <input type="text" className="input" defaultValue={vo.reprsntTelno} disabled={true} title="대표번호"/>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>대표</th>
                                                <td>
                                                    <div className="input_wrap">
                                                        <input type="text" className="input" defaultValue={vo.rprsntvNm} disabled={true} title="대표"/>
                                                    </div>
                                                </td>
                                                <th>팩스번호</th>
                                                <td>
                                                    <div className="input_wrap">
                                                        <input type="text" className="input" defaultValue={vo.reprsntFxnum} disabled={true} title="팩스번호"/>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>설립일</th>
                                                <td>
                                                    <div className="input_wrap">
                                                        <input
                                                            type="text"
                                                            className="input"
                                                            defaultValue={DateUtils.insertYyyyMmDdDash(vo.fondDe)}
                                                            disabled={true}
                                                            title="설립일"
                                                        />
                                                    </div>
                                                </td>
                                                <th>이메일</th>
                                                <td>
                                                    <div className="input_wrap">
                                                        <input type="text" className="input" defaultValue={vo.reprsntEmail} disabled={true} title="이메일"/>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>기업형태</th>
                                                <td className="com_shape">
                                                    <Select
                                                        optList={goalSelect.selList}
                                                        selected={goalSelect.selected}
                                                        onChange={handleGoalSelect}
                                                        title="기업형태"
                                                    />
                                                </td>
                                                <th>직원수</th>
                                                <td>
                                                    <div className="input_wrap">
                                                        <NumberInput item={vo} numberProperty={'empCnt'} displayValue={vo['empCnt']} title="직원수"/>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="vertical_top">주소</th>
                                                <td>
                                                    <input
                                                        type="text"
                                                        defaultValue={StringUtils.hasLength(vo.postNo) ? `(${vo.postNo}) ${vo.addr}` : vo.addr}
                                                        className={'input'}
                                                        placeholder={''}
                                                        disabled={true}
                                                        title="주소"
                                                    />
                                                </td>
                                                <th className="vertical_top">홈페이지</th>
                                                <td className="vertical_top">
                                                    <div className="input_wrap">
                                                        <input type="text" className="input" disabled={true} defaultValue={vo.hmpgAdres} title="홈페이지"/>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>업종</th>
                                                <td>
                                                    <div className="input_wrap">
                                                        <input
                                                            id={'btnm'}
                                                            type="text"
                                                            className="input"
                                                            defaultValue={vo.btnm}
                                                            onChange={(event) => onChangeInput(event)}
                                                            title="업종"
                                                        />
                                                    </div>
                                                </td>
                                                <th>최근매출(원)</th>
                                                <td className="com_shape">
                                                    <div className="input_wrap sales">
                                                        <Select
                                                            optList={salesSelect.selList}
                                                            selected={salesSelect.selected}
                                                            onChange={handleSaleSelect}
                                                            title="최근매출(년도)"
                                                        />
                                                        <NumberInput item={vo} numberProperty={'msrnAmslAmt'} displayValue={vo['msrnAmslAmt']} title="최근매출(금액)"/>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>업태</th>
                                                <td>
                                                    <div className="input_wrap">
                                                        <input
                                                            id={'bzstNm'}
                                                            type="text"
                                                            className="input"
                                                            defaultValue={vo.bzstNm}
                                                            onChange={(event) => onChangeInput(event)}
                                                            title="업태"
                                                        />
                                                    </div>
                                                </td>
                                                <th>기업구분</th>
                                                <td className="com_shape">
                                                    <Select
                                                        optList={sectionSelect.selList}
                                                        selected={sectionSelect.selected}
                                                        onChange={handleSectionSelect}
                                                        title="기업구분"
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="vertical_top">관심분야</th>
                                                <td>
                                                    <TagForm ref={interestRef} property={'cnrnFildNm'} placeholder={'관심분야'} maxCount={5} title="관심분야"/>
                                                </td>
                                                <th className="vertical_top">상장구분</th>
                                                <td className="com_shape vertical_top">
                                                    <div className="radio_box_wrap">
                                                        {publicRadio.radioList.map((radio) => (
                                                            <Radio
                                                                className={'type02'}
                                                                key={createKey()}
                                                                radio={radio}
                                                                onChange={(e) => handlePublicRadio(e)}
                                                                checked={radio.id === publicRadio.selected}
                                                                title="상장구분"
                                                            />
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>사업장 소재지</th>
                                                <td className="com_shape">
                                                    <Select
                                                        optList={locationSelect.selList}
                                                        selected={locationSelect.selected}
                                                        onChange={handleLocationSelect}
                                                        title="사업장소재지"
                                                    />
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="introduce_wrap info_section">
                                    <div className="card_header">
                                        <h3 className="ico_title title">소개</h3>
                                    </div>
                                    <div className="introduce_text">
                                        <textarea
                                            id={'enprInrdCon'}
                                            className={'textarea'}
                                            defaultValue={vo.enprInrdCon}
                                            maxLength={500}
                                            onChange={(event) => onChangeIntroduce(event)}
                                            title="소개"
                                        />
                                        <div className="max_count_wrap">
                                            *
                                            <MaxLengthCount ref={maxLengthCountRef} max={500} defaultCount={String(vo.enprInrdCon).length}/>
                                        </div>
                                    </div>
                                </div>
                            </CardLayout>
                        </div>
                    </div>
                    <Footer/>
                </div>
            </div>
            <AlertPopup ref={alertPopRef}/>
            <CheckCloseCallBackAlertPopup ref={checkCloseAlertPopupRef}
                                          callBack={() => history.push(ROUTER_NAMES.MY_PAGE_COMPANY_INFO)} />
            <ConfirmPopup ref={confirmPopRef} onConfirm={onConfirmSave}/>
        </>
    )
}

export default InfoWrite
