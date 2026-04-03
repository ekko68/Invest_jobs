import React, {useEffect} from 'react';
import {popupConsultReqStyle} from "assets/style/PopupStyle";
import {colors} from "assets/style/style.config";
import PopupFooter from "components/popups/PopupFooter";
import PopupHeader from "components/popups/PopupHeader";
import Button from "components/atomic/Button";

import {StringUtils} from "modules/utils/StringUtils";
import {UsisType} from "modules/consts/BizConst";

const RequestDetailCompletePopup = (props) => {

    const { vo, usisType, onClickClose=()=>{} } = props;

    useEffect(() => {
        document.body.classList.add("popupScrollLock");

        return () => {
            document.body.classList.remove("popupScrollLock");
        }
    }, []);

    return (
        <div className="popup_wrap invest_review">
            <div className="popup_layout">&nbsp;</div>
            <div className="popup_container" css={popupConsultReqStyle}>
                <PopupHeader title={'투자 심사 총평'} handlePopup={onClickClose}/>
                {/*popup_content start*/}
                <div className="popup_inner">
                    <table className="table">
                        <caption>투자 심사 총평 테이블</caption>
                        <colgroup>
                            <col width={'15%'} />
                            <col width={'85%'} />
                        </colgroup>
                        <tbody>
                        <tr>
                            <td className='name'>심사결과</td>
                            {/*<td className='content'>승인 / 200억 / 행복펀드(비고)</td>*/}
                            {
                                usisType === UsisType.INVESTOR
                                    ?   <td className='content'>{StringUtils.makeReduceDelimiterString(' / ', vo.exntRsltNm, vo.invmPrfrScdlAmtStr + ' 원', vo.exntRsltRmrk)}</td>
                                    :   <td className='content'>{StringUtils.makeReduceDelimiterString(' / ', vo.exntRsltNm, vo.exntRsltRmrk)}</td>
                            }
                        </tr>
                        <tr>
                            <td className='name'>투자심사역</td>
                            <td className='content'>{vo.invmcrofRepnm}</td>
                        </tr>
                        <tr>
                            <td className='name'>심사평</td>
                            <td className='content'>
                                <p dangerouslySetInnerHTML={{__html: StringUtils.toBr(vo.exntMsgCon)}}/>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                {/*popup_content end*/}
                <PopupFooter>
                    <div className="btn_group">
                        <Button theme={colors.blue} onClick={onClickClose}>확인</Button>
                    </div>
                </PopupFooter>
            </div>
        </div>
    )
}

export default RequestDetailCompletePopup;