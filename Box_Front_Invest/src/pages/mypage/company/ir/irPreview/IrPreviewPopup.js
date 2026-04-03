import React, {forwardRef, useContext, useEffect, useImperativeHandle, useState} from 'react'

import {tabStyle} from 'assets/style/ComponentStyle'
import Button from 'components/atomic/Button'
import {CloseBtn, NextBtn, PrevBtn} from 'components/atomic/IconButton'
import PopupFooter from 'components/popups/PopupFooter'

import BasicInfoPreview from "pageComponents/common/irpreviewpop/BasicInfoPreview";
import HistoryPreview from "pageComponents/common/irpreviewpop/HistoryPreview";
import WorkerPreview from "pageComponents/common/irpreviewpop/WorkerPreview";
import StockPreview from "pageComponents/common/irpreviewpop/StockPreview";
import FinancePreview from "pageComponents/common/irpreviewpop/FinancePreview";
import ProdTechMarketPreview from "pageComponents/common/irpreviewpop/ProdTechMarketPreview";
import ResultPlansPreview from "pageComponents/common/irpreviewpop/ResultPlansPreview";

import Api from "modules/consts/Api";
import {IrLabels, UsisType} from 'modules/consts/BizConst'
import {createKey} from "modules/utils/CommonUtils";

const IrPreviewPopup = forwardRef((props, ref) => {

    const [isOpen, setIsOpen] = useState(false)
    const [currentIrRreviewNum, setCurrentIrRreviewNum] = useState(0)

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

    const onClickPrev = () => {
        if (currentIrRreviewNum === 0) return
        setCurrentIrRreviewNum(currentIrRreviewNum - 1)
    }

    const onClickNext = () => {
        if (irRreviews.length === currentIrRreviewNum + 1) return
        setCurrentIrRreviewNum(currentIrRreviewNum + 1)
    }

    const PrevNextBtns = (
        <div
            className="prev_next_wrap"
            style={{
                display: 'flex',
                flexWrap: 'nowrap',
                justifyContent: 'space-between',
                margin: '30px 40px 30px 40px'
            }}
        >
            <PrevBtn onClick={onClickPrev}/>
            <NextBtn onClick={onClickNext}/>
        </div>
    )

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

    // api 목록
    const api = {
        basic: Api.vc.auditIrPreview + '?tabType=BASIC',
        history: Api.vc.auditIrPreview + '?tabType=HISTORY',
        worker: Api.vc.auditIrPreview + '?tabType=MEMBER',
        stock: Api.vc.auditIrPreview + '?tabType=STOCKHOLDER',
        finance: Api.vc.auditIrPreview + '?tabType=FINANCE',
        extra: Api.vc.auditIrPreview + '?tabType=EXTRA',
        plan: Api.vc.auditIrPreview + '?tabType=PLAN',
    }

    const irRreviews = [
        <BasicInfoPreview Tab={Tab} PrevNextBtns={PrevNextBtns} api={api.basic} />, // IR기본정보
        <HistoryPreview Tab={Tab} PrevNextBtns={PrevNextBtns} api={api.history} />, // 주요연혁
        <WorkerPreview Tab={Tab} PrevNextBtns={PrevNextBtns} api={api.worker} />, // 주요인력
        <StockPreview Tab={Tab} PrevNextBtns={PrevNextBtns} api={api.stock} />, // 주주현황
        <FinancePreview Tab={Tab} PrevNextBtns={PrevNextBtns} api={api.finance} />, // 재무정보
        <ProdTechMarketPreview Tab={Tab} PrevNextBtns={PrevNextBtns} api={api.extra} />, // 제품/기술/시장
        <ResultPlansPreview Tab={Tab} PrevNextBtns={PrevNextBtns} api={api.plan} /> // 성과 및 계획
    ]

    useImperativeHandle(ref, () => ({
        open,
        close
    }))

    const open = (msg = null) => {
        setIsOpen(true)
    }

    const close = () => {
        setIsOpen(false)
    }

    useEffect(() => {
        setIsOpen(false)
    }, [])

    return (
        <>
            {
                isOpen &&
                <div className="popup_wrap ir_preview_popup">
                    <div className="popup_layout">&nbsp;</div>
                    <div
                        className="popup_container mypage_wrap scroll"
                        style={{width: '1300px', height: '872px', background: '#f8f8f8'}}
                    >
                        <div className="popup_header">
                            <div className="popup_header_inner">&nbsp;</div>
                            <CloseBtn onClick={close}/>
                        </div>
                        <div className="popup_content">
                            {/*ir_contents start*/}
                            <div className="container default_size02">
                                <div className="section section01">{irRreviews[currentIrRreviewNum]}</div>
                            </div>
                        </div>
                        <PopupFooter className="popup_footer">
                            <div className="btn_group">
                                <Button className={'button'} onClick={close}>
                                    확인
                                </Button>
                            </div>
                        </PopupFooter>
                    </div>
                </div>
            }
        </>
    )
})

export default IrPreviewPopup
