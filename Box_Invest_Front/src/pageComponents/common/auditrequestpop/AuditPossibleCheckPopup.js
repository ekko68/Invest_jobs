/** @jsxImportSource @emotion/react */
import React, {forwardRef, useImperativeHandle, useState} from 'react'
import {useHistory} from 'react-router-dom';

import {warningIrStyle} from 'assets/style/PopupStyle'
import {popupLayoutStyle} from 'assets/style/ComponentStyle'
import {colors} from 'assets/style/style.config'

import {CloseBtn} from 'components/atomic/IconButton'
import Button from 'components/atomic/Button'
import PopupFooter from 'components/popups/PopupFooter'
import PopupConfirm from "components/popups/PopupConfirm";
import {BizStatusCode, RequestStatusCodeLabels} from "modules/consts/BizConst";
import {StringUtils} from "modules/utils/StringUtils";
import ROUTER_NAMES from "modules/consts/RouterConst";

const AuditPossibleCheckPopup = forwardRef((props, ref) => {

    const {auditStatus = RequestStatusCodeLabels.REQUEST} = props;
    const history = useHistory();

    const initSwitch = {
        isOpen: false,
        code: '',
        tcbCd: ''
    }

    const [popupSwitch, setPopupSwitch] = useState({...initSwitch});

    useImperativeHandle(ref, () => ({
        open,
        close
    }))

    const open = (code, tcbCd) => {
        setPopupSwitch({
            ...popupSwitch,
            isOpen: true,
            code: code,
            // tcbCd: tcbCd
            tcbCd: '-'
        });
        document.body.classList.add("popupScrollLock");
    }
    const close = () => {
        setPopupSwitch({...initSwitch});
        document.body.classList.remove("popupScrollLock");
    }

    return (
        <>
            {
                popupSwitch.isOpen &&
                <>
                    {
                        popupSwitch.code === BizStatusCode.LIMIT_COUNT_OVER &&
                        <div className="popup_wrap popup_invest_req_warning" css={popupLayoutStyle('460px', '300px')}>
                            <div className="popup_layout">&nbsp;</div>
                            <div className="popup_container scroll " css={warningIrStyle}>
                                <CloseBtn onClick={close} className={'btn_popup_close'}/>
                                <div className="popup_content">
                                    {/* 간격이 너무 넓어 임시로 높이값 수정함 */}
                                    <div className="ir_warning_wrap" style={{maxHeight: '220px'}}>
                                        <p className="text">
                                            한 번에 &nbsp;
                                            <span className="highlight_full_lemon">
                                                    <span className="text">최대 5번의 투자 심사를</span>
                                                </span>
                                            {/*<br/> 받으실 수 있습니다.*/}
                                            &nbsp; 받으실 수 있습니다.
                                        </p>
                                        <p className="info">다른 투자 심사가 종료된 후, 신청이 가능합니다.</p>
                                    </div>
                                </div>
                                <PopupFooter className="popup_footer">
                                    <div className="btn_group">
                                        <Button theme={colors.blue} onClick={close}>확인</Button>
                                    </div>
                                </PopupFooter>
                            </div>
                        </div>
                    }
                    {
                        popupSwitch.code === BizStatusCode.TCB_UNQUALIFIED &&
                        <PopupConfirm handlePopup={close}>
                            <div className="popup_content invest_judge">
                                {
                                    (auditStatus === RequestStatusCodeLabels.REQUEST && !StringUtils.hasLength(popupSwitch.tcbCd))
                                        ? <div className="txt_inner">
                                            <p className={'highlight_blue'}>
                                                고객님의 IBK 내 유효한 기술등급이 존재하지 않습니다. <br/>
                                                투자심사를 위해 가까운 영업점 방문해주시어 <br/>
                                                기술등급을 신청해 주십시오.
                                            </p>
                                        </div>

                                        : <div className="txt_inner">
                                            <p className={'highlight_blue'}>
                                                IBK기업은행의 기술투자 대상은 다음과 같습니다. <br/>
                                                해당 고객님은 기술투자 대상조건 미달로 신청이 불가합니다. <br/>
                                            </p>
                                            <div className="text_box">
                                                <div className="text_box_title">
                                                    <p>-TCB평가 기술등급 T-3 이상 기업</p>
                                                </div>
                                                <div className="text_box_title">
                                                    <p>-TCB평가 기술등급 T-4 기업 중 12대 국가전략기술 해당 기업</p>
                                                    <div className="text_box_list">
                                                        <p>1. 반도체, 디스플레이</p>
                                                        <p>2. 이차전지</p>
                                                        <p>3. 차세대 원자력</p>
                                                        <p>4. 모빌리티</p>
                                                        <p>5. 우주항공, 해양</p>
                                                        <p>6. 첨단 바이오</p>
                                                        <p>7. 사이버 보안</p>
                                                        <p>8. 수소</p>
                                                        <p>9. AI</p>
                                                        <p>10. 차세대 통신</p>
                                                        <p>11. 첨단로봇</p>
                                                        <p>12. 양자</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                }
                            </div>
                            <PopupFooter className="popup_footer">
                                <div className="btn_group">
                                    <Button className={'button btn_blue'} onClick={close}>확인</Button>
                                </div>
                            </PopupFooter>
                        </PopupConfirm>
                    }
                    {
                        popupSwitch.code === BizStatusCode.OUT_OF_AUDIT_REQUEST_PERIOD &&
                        <PopupConfirm handlePopup={close}>
                            <div className="popup_content invest_judge">
                                <div className="txt_inner">
                                    <p className={'highlight_full_lemon'}>
                                        <span className='text'>투자 유치 신청을 이미 완료하셨습니다.</span>
                                    </p>
                                </div>
                                <p className='title_text'>신청현황에서 진행상황을 확인할 수 있습니다.</p>
                                <p className="highlight_blue">*최근 투자신청일로부터 1년 이후에 재신청이 가능합니다.</p>
                                <div className="text_box">
                                    <p>궁금한 사항은 아래로 문의하세요.</p>
                                    <p>IBK 혁신투자부 02)729-7093</p>
                                    <p>(평일) 오전 9시 ~ 오후 6시</p>
                                </div>
                            </div>
                            <PopupFooter className="popup_footer">
                                <div className="btn_group">
                                    <Button className={'button btn_blue'}
                                            onClick={() => history.push(ROUTER_NAMES.MY_PAGE_COMPANY_REQUEST_SEND_VIEW)}>신청현황 보기</Button>
                                </div>
                            </PopupFooter>
                        </PopupConfirm>
                    }
                </>
            }
        </>
    )
});
export default AuditPossibleCheckPopup;
