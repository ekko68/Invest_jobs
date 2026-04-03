import React, {useState, forwardRef, useRef, useImperativeHandle, useContext} from 'react'

import {requestIrStyle} from 'assets/style/PopupStyle'
import {popupLayoutStyle} from 'assets/style/ComponentStyle'
import {colors} from 'assets/style/style.config'
import {maxCountStyle} from "assets/style/AtomicStyle";

import PopupHeader from 'components/popups/PopupHeader'
import PopupFooter from 'components/popups/PopupFooter'
import Button from 'components/atomic/Button'

import ReactEvent from 'modules/utils/ReactEvent'
import {getPostConfig} from 'modules/utils/CommonAxios'
import CommonAxios from 'modules/utils/CommonAxios'
import Api from 'modules/consts/Api'
import QueryUtils from 'modules/utils/QueryUtils'
import {CompanyContext} from 'modules/contexts/company/companyContext'
import {CommonContext} from "modules/contexts/common/CommomContext";
import {StringUtils} from "modules/utils/StringUtils";

const Request1 = forwardRef((props, ref) => {
    const commonContext = useContext(CommonContext);
    const companyContext = useContext(CompanyContext);

    const [count, setCount] = useState(0);
    const { vo } = props
    const messageTextAreaRef = useRef()
    // 페이지에서 팝업 자체 핸들러 (팝업 닫기)
    const onPopup = () => {
        ReactEvent.dispatchEvent('close')
    }
    const popRef = useRef()

    useImperativeHandle(ref, () => ({
        init,
        open,
        close
    }))

    const init = () => {
        messageTextAreaRef.current.value = '';
        setCount(0);
    }

    const open = () => {
        popRef.current.style.display = 'flex'
    }
    const close = () => {
        popRef.current.style.display = 'none'
    }

    const onChangeMessage = (event) => {
        setCount(event.target.value.length);
    }

    const onClickCancel = () => {
        ReactEvent.dispatchEvent('close');
    }

    const onClickNext = async () => {
        if (messageTextAreaRef.current.value.length < 20) {
            ReactEvent.dispatchEvent('alert', '20자 이상 입력해주세요.')
            return
        }

        const submit = async () => {
            let isSaveComplete = true
            const query = QueryUtils.getQuery(props)
            if (query.hasOwnProperty('utlinsttId')) {
                const params = {
                    rqstEnprId: query.utlinsttId,
                    prplMsgCon: messageTextAreaRef.current.value
                }
                const saveRes = await CommonAxios(getPostConfig(Api.company.auditSuggestSave, params), false);
                if (saveRes && saveRes.status === 200) {
                    if(saveRes.data.hasOwnProperty('code') && saveRes.data.code !== '200') {
                        isSaveComplete = false;
                    } else {
                        companyContext.actions.setSuggestId(saveRes.data.data.invmExntRqstId)
                    }
                } else {
                    isSaveComplete = false
                }
            }
            return isSaveComplete
        }

        await commonContext.actions.callbackAfterSessionRefresh(async () => {
            if ((await submit()) === false) {
                ReactEvent.dispatchEvent('alert', '심사 요청 중 오류가 발생하였습니다. 관리자에게 문의해주세요.')
                return
            }
            ReactEvent.dispatchEvent('step', 2);
        }, true, true);
    }

    return (
        <div ref={popRef} className="popup_wrap popup_ir_req" css={popupLayoutStyle('550px')} style={{display: 'none'}}>
            <div className="popup_layout">&nbsp;</div>
            <div className="popup_container scroll " css={requestIrStyle}>
                <PopupHeader title={'IR 자료요청'} handlePopup={onPopup}/>
                <div className="popup_content">
                    <div className="ir_request_wrap">
                        <div className="img_wrap">
                            {
                                StringUtils.hasLength(commonContext.state.user.info?.groupLogoImgUrl)
                                    ?   <img src={commonContext.state.user.info.groupLogoImgUrl} alt="투자사로고이미지"/>
                                    :   <img src="/images/tmp/img_user02.png" alt="이미지없음"/>
                            }
                        </div>
                        <div className="form_wrap">
                            <p className="info">
                                <span className="highlight_blue">{vo.basicData.bplcNm}</span>에게 투자심사를 위한 IR 자료를 요청합니다.
                            </p>
                            <textarea
                                ref={messageTextAreaRef}
                                id={'prplMsgConInput'}
                                placeholder="투자심사 요청 메시지를 전송합니다."
                                className="textarea scroll"
                                onChange={onChangeMessage}
                                maxLength={1000}
                                title='투자심사제안 내용'
                                style={{lineHeight:'1.4'}}
                            ></textarea>

                            <div className="addition">
                                <p className="highlight_peach">{(count < 20) ? "* 요청메시지를 20자 이상 입력해 주세요." : ''}</p>
                                <div className="number_wrap">
                                    <div className="max_count" css={maxCountStyle}>
                                        <p className="count">{count}</p>
                                        <p className="max">{1000}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <PopupFooter>
                    <div className="btn_group">
                        <Button theme={colors.lightGrey} onClick={onClickCancel}>
                            취소
                        </Button>
                        <Button theme={colors.blue} onClick={onClickNext}>
                            요청
                        </Button>
                    </div>
                </PopupFooter>
            </div>
        </div>
    )
});

export default Request1;
