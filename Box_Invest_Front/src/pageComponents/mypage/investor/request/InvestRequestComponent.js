import React, {useContext, useEffect, useRef, useState} from "react";
import {useHistory} from "react-router-dom";

import CardLayout from "components/common/card/CardLayout";
import Button from "components/atomic/Button";
import PopupRequestComplete from "pageComponents/mypage/investor/request/PopupRequestComplete";

import PopupHeader from "components/popups/PopupHeader";
import PopupFooter from "components/popups/PopupFooter";
import Radio from "components/atomic/Radio";

import {StringUtils} from "modules/utils/StringUtils";
import {exeFunc} from "modules/utils/ReactUtils";
import QueryUtils from "modules/utils/QueryUtils";
import CommonAxios from "modules/utils/CommonAxios";
import {getPostConfig} from "modules/utils/CommonAxios";
import Api from "modules/consts/Api";
import {AlertLabels, RequestStatusCodeLabels, UsisType} from "modules/consts/BizConst";
import ROUTER_NAMES from "modules/consts/RouterConst";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {CodeContext} from "modules/contexts/common/CodeContext";
import {createKey, deepCopyByRecursion} from "modules/utils/CommonUtils";
import {NumInput} from "pageComponents/common/number/NumInput";
import RequestDetailCompletePopup from "pageComponents/mypage/common/request/RequestDetailCompletePopup";
import {isNumber} from "modules/utils/NumberUtils";
import IrPreviewPopup from "../../../common/irpreviewpop/IrPreviewPopup";
import IrPreviewApi from "../../../../modules/consts/IrPreviewApi";
import {RequestReference} from "../../company/request/CompanyRequestComponent";

export {RequestSuggestBody, RequestEvaluateButton, RequestEvaluatingBody, RequestCompleteBody, RequestCancelBody, RequestBody}

const RequestSuggestBody = ({vo, getLogoImage}) => {

    return (
        <div className="card_section card02">
            <CardLayout>
                <div className="company_info_wrap">
                    <div className="company_info">
                        <div className="img">{getLogoImage(vo.invmLogoImageUrl)}</div>
                        <div className="info">
                            <p className="title">{vo.invmCmpBplcNm}</p>
                            <p className="text">{vo.invmCmpPtrnNm}</p>
                        </div>
                    </div>
                    <div className="text_wrap">
                        <p className="title">안녕하세요 {vo.invmCmpBplcNm} 입니다.</p>
                        <p
                            className="content_text scroll"
                            dangerouslySetInnerHTML={{__html: StringUtils.toBr(vo.prplMsgCon)}}
                        ></p>
                    </div>
                </div>
            </CardLayout>
        </div>
    )
}

const RequestBody = ({vo, getLogoImage}) => {

    return (
        <div className="card_section card02">
            <CardLayout>
                <div className="company_info_wrap">
                    <div className="company_info">
                        <div className="img">{getLogoImage(vo.enprLogoImageUrl)}</div>
                        <div className="info">
                            <p className="title">{vo.rqstBplcNm}</p>
                            <p className="text">{vo.rqstEnprRprsntvNm}</p>
                        </div>
                    </div>
                    <div className="text_wrap">
                        <p className="title">안녕하세요. {vo.rqstBplcNm} 입니다.</p>
                        <p
                            className="content_text scroll"
                            dangerouslySetInnerHTML={{__html: StringUtils.toBr(vo.rqstMsgCon)}}
                        ></p>
                    </div>
                </div>
            </CardLayout>
        </div>
    )
}

const RequestEvaluateButton = (props) => {

    const { alertPopRef } = props;
    const history = useHistory();
    const commonContext = useContext(CommonContext);

    const [isConfirmPopOpen, setIsConfirmPopOpen] = useState(false);

    const onClickJudge = () => {
        setIsConfirmPopOpen(true);
    }

    const onConfirm = async () => {
        await commonContext.actions.callbackAfterSessionRefresh(loadAuditEvaluateProgress, true, true);
    }

    const loadAuditEvaluateProgress = async () => {
        const query = QueryUtils.getQuery(props)
        const params = {
            id: query['invmExntRqstId']
        }
        const res = await CommonAxios(getPostConfig(Api.my.vc.auditEvaluateProgress, params))
        if (res) {
            if (res.status === 200) {

                if (res.data.hasOwnProperty('code') && res.data.code !== '200') {
                    exeFunc(alertPopRef, 'open', AlertLabels.askAdmin);
                    return;
                }

                let type = 'receive'
                let url = ROUTER_NAMES.MY_PAGE_INVESTOR_REQUEST_DETAIL + '?invmExntRqstId=' + query['invmExntRqstId']
                if (query.hasOwnProperty('type')) {
                    type = query['type']
                }
                url += '&type=' + type
                history.push(url)
            } else {
                exeFunc(alertPopRef, 'open', AlertLabels.askAdmin)
            }
        }
    }

    return (
        <>
            <Button className={'blue'} onClick={onClickJudge}>
                심사하기
            </Button>
            {
                // 팝업 내부 버튼 css 가 overwrite 되어 따로 구현 후 인라인 css 설정함
                isConfirmPopOpen &&
                <div className="popup_wrap popup_nda">
                    <div className="popup_layout">&nbsp;</div>
                    <div className="popup_container">
                        <PopupHeader handlePopup={() => setIsConfirmPopOpen(false)}/>
                        <div className="popup_content">
                            <div className="popup_nda_wrap">
                                <div className="img_wrap">
                                    <img src="/images/ico_warning.png" alt=""/>
                                </div>
                                <p className="text">{'심사를 진행하시겠습니까?'}</p>
                            </div>
                        </div>
                        <PopupFooter>
                            <div className="btn_group gap">
                                <Button className={'light_grey'}
                                        style={{height: '38px', fontSize: '14px'}}
                                        onClick={() => setIsConfirmPopOpen(false)}>
                                  취소
                                </Button>
                                <Button className={'blue'}
                                        style={{height: '38px', fontSize: '14px'}}
                                        onClick={async () => {
                                            setIsConfirmPopOpen(false);
                                            await onConfirm();
                                        }}>
                                    확인
                                </Button>
                            </div>
                        </PopupFooter>
                    </div>
                </div>
            }
        </>
    )
}

const RequestEvaluatingBody = (props) => {

    const { alertPopRef, vo } = props;
    const history = useHistory();
    const commonContext = useContext(CommonContext);
    const codeContext = useContext(CodeContext);

    const completeTextAreaRef = useRef();
    const popupRequestCompleteRef = useRef();

    const [evaluate, setEvaluate] = useState({
        invmExntRqstId: QueryUtils.getQuery(props)?.invmExntRqstId,
        exntMsgCon: '',
        exntRsltCd: '',
        invmPrfrScdlAmt: null,
        exntRsltRmrk: '',
        invmcrofRepnm: ''
    });

    const [auditResultTypeSelect, setAuditResultTypeSelect] = useState({
        selected: '',
        selList: []
    });

    const onClickJudgeComplete = () => {
        // todo : 투자심사역 대표명 입력 가능 처리 후 validation 추가
        if (!isNumber(evaluate.invmPrfrScdlAmt)) {
            exeFunc(alertPopRef, 'open', '투자예상액 입력해주세요.')
            return
        }
        if (!StringUtils.hasLength(evaluate.exntMsgCon)) {
            exeFunc(alertPopRef, 'open', '심사평을 입력하세요.')
            return
        }
        exeFunc(popupRequestCompleteRef, 'open')
    }

    const onComplete = async () => {
        await commonContext.actions.callbackAfterSessionRefresh(loadEvaluateComplete, true, true);
    }

    const loadEvaluateComplete = async () => {
        const query = QueryUtils.getQuery(props)
        if (query) {
            if (query.hasOwnProperty('invmExntRqstId')) {
                const params = {
                    ...evaluate,
                    invmExntRqstId: query.invmExntRqstId,
                    exntRsltCd: auditResultTypeSelect.selected,
                }

                const saveRes = await CommonAxios(getPostConfig(Api.my.vc.auditEvaluateComplete, params))
                if (saveRes) {
                    if (saveRes.status === 200) {

                        if (saveRes.data.hasOwnProperty('code') && saveRes.data.code !== '200') {
                            exeFunc(alertPopRef, 'open', AlertLabels.askAdmin);
                            return;
                        }

                        let type = 'receive'
                        let url = ROUTER_NAMES.MY_PAGE_INVESTOR_REQUEST_DETAIL + '?invmExntRqstId=' + query['invmExntRqstId']
                        if (query.hasOwnProperty('type')) {
                            type = query['type']
                        }
                        url += '&type=' + type
                        history.push(url)
                    } else if (saveRes.status !== 200) {
                        exeFunc(alertPopRef, 'open', '심사평 등록 중 오류가 발생하였습니다. 관리자에게 문의해주세요')
                    }
                }
            }
        }
    }

    const isMountedRef = useRef(false);

    useEffect(() => {
        if(commonContext.state.user.isLoaded && codeContext.state.isLoaded && !isMountedRef.current) {
            isMountedRef.current = true;

            const _auditResultTypeSelect = deepCopyByRecursion(auditResultTypeSelect);

            _auditResultTypeSelect.selList = codeContext.actions.getAuditResultTypeList();
            if(_auditResultTypeSelect.selList?.length > 0) {
                if(StringUtils.hasLength(vo?.exntRsltCd)) _auditResultTypeSelect.selected = vo.exntRsltCd;
                else _auditResultTypeSelect.selected = _auditResultTypeSelect.selList[0].id;
            }
            setAuditResultTypeSelect(_auditResultTypeSelect);
            setEvaluate({
                ...evaluate,
                exntMsgCon: StringUtils.hasLength(vo?.exntMsgCon) ? vo.exntMsgCon : '',
                invmPrfrScdlAmt: isNumber(vo?.invmPrfrScdlAmt) ? vo.invmPrfrScdlAmt : null,
                exntRsltRmrk: StringUtils.hasLength(vo?.exntRsltRmrk) ? vo.exntRsltRmrk : '',
                invmcrofRepnm: StringUtils.hasLength(vo?.invmcrofRepnm) ? vo.invmcrofRepnm : commonContext.state.user.info?.userNm
            });
        }
    }, [codeContext.state.isLoaded, commonContext.state.user]);

    return (
        <div className="card_section card02 commentary_wrap">
            <CardLayout>
                <div className="commentary_guide">
                    <div className="commentary_guide_text">
                        <p className="main_text">심사평을 남겨주세요.</p>
                        <p className="text">
                            심사결과가 스타트업에게 전달됩니다. <br/>
                            성공적인 투자를 기원합니다.
                        </p>
                    </div>
                </div>

                <div className="check_wrap">
                    <div className="check_list">
                        {auditResultTypeSelect.selList?.map((item) => (
                            <Radio
                                key={createKey()}
                                radio={item}
                                checked={item.id === auditResultTypeSelect.selected}
                                onChange={e => {
                                    setAuditResultTypeSelect({
                                        ...auditResultTypeSelect,
                                        selected: e.target.id
                                    })
                                }}
                            />
                        ))}
                    </div>
                    <div className="input_wrap">
                        <div className="input_item">
                            <p className="title">투자예상액 (원)</p>
                            <NumInput type="text" className="input"
                                      defaultValue={evaluate.invmPrfrScdlAmt}
                                      // isPositiveNum={false}
                                      defaultData={0}
                                      setState={value => setEvaluate({...evaluate, invmPrfrScdlAmt: value})} />
                        </div>
                        <div className="input_item">
                            <p className="title">비고(펀드명 등 입력)</p>
                            <input type="text" className="input"
                                   defaultValue={evaluate.exntRsltRmrk}
                                   maxLength={2000}
                                   onChange={event => {
                                       event.target.value = StringUtils.cutStrByLimit(event.target.value, 2000);
                                       setEvaluate({...evaluate, exntRsltRmrk: event.target.value})
                                   }}/>
                        </div>
                    </div>
                    <div className="guide_text">※ 투자예상액과 비고란에 입력하신 내용은 투자사 계정에서만 확인이 가능하며 투자희망기업 담당자에게는 보이지 않습니다.</div>
                </div>

                <div className="commentary_title">심사평</div>

                <div className="textarea_wrap">
                    <textarea title='심사평'
                              className="textarea"
                              defaultValue={evaluate.exntMsgCon}
                              maxLength={2000}
                              onChange={event => {
                                  event.target.value = StringUtils.cutStrByLimit(event.target.value, 2000);
                                  setEvaluate({...evaluate, exntMsgCon: event.target.value});
                              }}
                    />
                </div>

                <div className="commentary_title">투자심사역 대표(담당자)</div>
                <div className="input_wrap">
                    <input type="text"
                           className="input"
                           maxLength={1000}
                           defaultValue={evaluate.invmcrofRepnm}
                           onChange={event => {
                               event.target.value = StringUtils.cutStrByLimit(event.target.value, 1000);
                               setEvaluate({...evaluate, invmcrofRepnm: event.target.value})
                           }}/>
                </div>

                <div className="btn_group">
                    <Button className={'blue'} onClick={onClickJudgeComplete}>
                        심사완료
                    </Button>
                </div>
            </CardLayout>
            <PopupRequestComplete ref={popupRequestCompleteRef} onComplete={onComplete} />
        </div>
    )
}

const RequestCompleteBody = ({vo, getLogoImage}) => {

    const [isResultPopOpen, setIsResultPopOpen] = useState(false);

    return (
        <>
            {
                isResultPopOpen &&
                <RequestDetailCompletePopup
                    vo={vo}
                    usisType={UsisType.INVESTOR}
                    onClickClose={() => setIsResultPopOpen(false)} />
            }
            <div className="card_section card02">
                <CardLayout>
                    {/* 모달 버튼 처리 방식 */}
                    <div className="end_wrap judge_end">
                        <div className="end_top">
                            <p className="title">모든 투자 심사가 종료되었습니다.</p>
                            <p className="sub_title">
                                심사결과가 스타트업에게 전달되었습니다. <br />
                                성공적인 투자를 기원합니다.
                            </p>
                            <div className="button_wrap">
                                <button className="btn"
                                        onClick={() => setIsResultPopOpen(true)}>투자심사 내용보기</button>
                            </div>
                        </div>
                    </div>
                </CardLayout>
            </div>
        </>
    )
}

const RequestCancelBody = ({progressList}) => {

    const getCancelOrExpireText = () => {
        let r = ''
        if (progressList.length > 0) {
            for (let i = 0; i < progressList.length; i++) {
                const item = progressList[i]
                if (item['invmExntPgsgCd'] === RequestStatusCodeLabels.EXPIRED) {
                    r = '기간 만료 되었습니다.'
                    break
                } else if (item['invmExntPgsgCd'] === RequestStatusCodeLabels.CANCEL) {
                    r = '요청 취소 되었습니다.'
                    break
                }
            }
        }
        return r
    }

    return (
        <div className="card_section card02">
            <CardLayout>
                <div className="end_wrap">
                    <div className="end_top">
                        <p className="title">투자 심사가 취소되었습니다.</p>
                        <p className="sub_title">{getCancelOrExpireText()}</p>
                    </div>
                </div>
            </CardLayout>
        </div>
    )
}