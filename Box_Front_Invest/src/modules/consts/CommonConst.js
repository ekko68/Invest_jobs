import ROUTER_NAMES from 'modules/consts/RouterConst'
import { IrLabels } from 'modules/consts/BizConst'

const CommonConst = {
  IR_TAB_LIST: [
    { id: ROUTER_NAMES.MY_PAGE_IR_BASIC_INFO, label: IrLabels.basicInfo }, // IR 기본정보
    { id: ROUTER_NAMES.MY_PAGE_IR_HISTORY, label: IrLabels.history }, // 주요연혁
    { id: ROUTER_NAMES.MY_PAGE_IR_WORKER, label: IrLabels.worker }, // 주요인력
    { id: ROUTER_NAMES.MY_PAGE_IR_STOCK, label: IrLabels.stock }, // 주주현황
    { id: ROUTER_NAMES.MY_PAGE_IR_FINANCE, label: IrLabels.finance }, // 재무정보
    { id: ROUTER_NAMES.MY_PAGE_IR_PROD_TECH_MARKET, label: IrLabels.prodTechMarket }, // 제품/기술시장
    { id: ROUTER_NAMES.MY_PAGE_IR_RESULT_PLANS, label: IrLabels.resultPlans } // 성과 및 계획
  ],
  IR_TAB_WRITE_LIST: [
    { id: ROUTER_NAMES.MY_PAGE_IR_BASIC_INFO_WRITE, label: IrLabels.basicInfo }, // IR 기본정보
    { id: ROUTER_NAMES.MY_PAGE_IR_HISTORY_WRITE, label: IrLabels.history }, // 주요연혁
    { id: ROUTER_NAMES.MY_PAGE_IR_WORKER_WRITE, label: IrLabels.worker }, // 주요인력
    { id: ROUTER_NAMES.MY_PAGE_IR_STOCK_WRITE, label: IrLabels.stock }, // 주주현황
    { id: ROUTER_NAMES.MY_PAGE_IR_FINANCE_WRITE, label: IrLabels.finance }, // 재무정보
    { id: ROUTER_NAMES.MY_PAGE_IR_PROD_TECH_MARKET_WRITE, label: IrLabels.prodTechMarket }, // 제품/기술시장
    { id: ROUTER_NAMES.MY_PAGE_IR_RESULT_PLANS_WRITE, label: IrLabels.resultPlans } // 성과 및 계획
  ]
}
export default CommonConst
