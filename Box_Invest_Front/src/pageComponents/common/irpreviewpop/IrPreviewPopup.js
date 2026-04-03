import {tabStyle} from 'assets/style/ComponentStyle'
import Button from 'components/atomic/Button'
import {CloseBtn, CloseNewBtn, NextBtn, PrevBtn} from 'components/atomic/IconButton'
import PopupFooter from 'components/popups/PopupFooter'
import {IrLabels} from 'modules/consts/BizConst'
import React, {forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState} from 'react'

import PreviewPopupFooter from "components/popups/PreviewPopupFooter";

import BasicInfoPreview from "pageComponents/common/irpreviewpop/BasicInfoPreview";
import HistoryPreview from "pageComponents/common/irpreviewpop/HistoryPreview";
import WorkerPreview from "pageComponents/common/irpreviewpop/WorkerPreview";
import StockPreview from "pageComponents/common/irpreviewpop/StockPreview";
import FinancePreview from "pageComponents/common/irpreviewpop/FinancePreview";
import ProdTechMarketPreview from "pageComponents/common/irpreviewpop/ProdTechMarketPreview";
import ResultPlansPreview from "pageComponents/common/irpreviewpop/ResultPlansPreview";
import {createKey} from "modules/utils/CommonUtils";

const IrPreviewPopup = forwardRef((props, ref) => {
    const {api, irTitle='', isCompanyRequestDetail=false} = props;
    const [isOpen, setIsOpen] = useState(false)
    const [currentIrRreviewNum, setCurrentIrRreviewNum] = useState(0)

    const onClickPrev = () => {
        // 이전
        if (currentIrRreviewNum === 0) {
            return
        }
        setCurrentIrRreviewNum(currentIrRreviewNum - 1)
    }

    const onClickNext = () => {
        // 다음
        if (irRreviews.length === currentIrRreviewNum + 1) {
            return
        }
        setCurrentIrRreviewNum(currentIrRreviewNum + 1)
    }

    // tab 목록
    const tabList = {
        active: currentIrRreviewNum,
        list: [
            {id: 0, label: IrLabels.basicInfo}, // IR 기본정보
            {id: 1, label: IrLabels.history}, // 주요연혁
            {id: 2, label: IrLabels.worker}, // 주요인력
            {id: 3, label: IrLabels.stock}, // 주주현황
            {id: 4, label: IrLabels.finance}, // 재무정보
            {id: 5, label: IrLabels.prodTechMarket}, // 제품/기술시장
            {id: 6, label: IrLabels.resultPlans} // 성과 및 계획
        ]
    }

    const Tab = (
        <div className="tab_wrap" css={tabStyle}>
            {tabList &&
            tabList.list?.map((d, idx) => (
                <button
                    className={`btn_tab ${tabList.active === d.id ? 'active' : ''}`}
                    key={createKey()}
                    onClick={() => setCurrentIrRreviewNum(d.id)}
                >
                    {d.label}
                </button>
            ))}
        </div>
    )

    const irRreviews = [
        // isCompanyRequestDetail : 기업 마이페이지의 경우 tooltip의 text-wrap을 제외해야함
        <BasicInfoPreview api={api.basic} />, // IR기본정보
        <HistoryPreview api={api.history} />, // 주요연혁
        <WorkerPreview api={api.worker} />, // 주요인력
        <StockPreview api={api.stock}
                      isCompanyRequestDetail={isCompanyRequestDetail} />, // 주주현황
        <FinancePreview api={api.finance}
                        isCompanyRequestDetail={isCompanyRequestDetail}/>, // 재무정보
        <ProdTechMarketPreview api={api.extra} />, // 제품/기술/시장
        <ResultPlansPreview api={api.plan} /> // 성과 및 계획
    ]

    useImperativeHandle(ref, () => ({
        open,
        close
    }))

    const open = () => {
        setCurrentIrRreviewNum(0)
        setIsOpen(true)
    }

    const close = () => {
        setIsOpen(false)
    }

    useEffect(() => {
        setIsOpen(false)
    }, [])

    const render = () => {
        if (isOpen === false) {
            return <></>
        } else {
            return (
                <div className="popup_wrap ir_preview_popup">
                    <div className="popup_layout">&nbsp;</div>
                    <div
                        className="popup_container mypage_wrap scroll"
                        // style={{width: '1300px', height: '872px', background: '#f8f8f8'}}
                        style={{width: '1300px'}}
                    >
                        <div className="popup_header">
                            <div className="popup_header_inner">
                                {irTitle}
                            </div>
                            {/*<CloseBtn onClick={close}/>*/}
                            <button className={'button button_close'} onClick={close} />
                        </div>
                        <div className="popup_content">
                            <div className="container default_size02" style={{}}>

                                <div className="tab_header">
                                    <div className="tab_wrap" css={tabStyle}>
                                        {tabList &&
                                        tabList.list?.map((d, idx) => (
                                            <button
                                                className={`btn_tab ${tabList.active === d.id ? 'active' : ''}`}
                                                key={createKey()}
                                                onClick={() => setCurrentIrRreviewNum(d.id)}
                                            >
                                                {d.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="section section01">
                                    {irRreviews[currentIrRreviewNum]}
                                </div>
                            </div>
                        </div>
                        {
                            <div className="prev_next_wrap"
                                 style={{
                                     display: 'flex',
                                     flexWrap: 'nowrap',
                                     justifyContent: 'space-between',
                                     margin: '30px 0'
                                 }}
                            >
                                <PrevBtn onClick={onClickPrev}/>
                                <NextBtn onClick={onClickNext}/>
                            </div>
                        }
                        {/*<PopupFooter className="popup_footer">*/}
                        <PreviewPopupFooter>
                            <div className="btn_group">
                                <Button className={'button'} onClick={close}>
                                    확인
                                </Button>
                            </div>
                        </PreviewPopupFooter>
                    </div>
                </div>
            )
        }
    }

    return render()
})

export default IrPreviewPopup
