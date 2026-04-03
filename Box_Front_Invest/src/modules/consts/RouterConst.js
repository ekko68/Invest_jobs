/**
 * Router 페이지 경로명 정의.
 */
const ROUTER_NAMES = {
  MAIN: '/main', // 메인
  COMPANY: '/company', // 기업정보
  COMPANY_DETAIL: '/company/detail',
  INVEST: '/invest', // 투자기관
  INVEST_DETAIL: '/invest/detail',
  CONSULT: '/consult', // 컨설팅,
  PRPL_CNTR: '/ibkPrplCntr', // 간접투자: IBK 제안센터 신규 추가

  IBK_PRPL_CNTR: '/ibkPrplCntr/IbkPrplCntr', // IBK 제안센터 메인
  FUND_PRPL_INFO_LIST_VIEW: '/ibkPrplCntr/fund/FundPrplInfoLIstView', // 펀드 제안 목록
  FUND_PRPL_INFO_STEP: '/ibkPrplCntr/fund/FundPrplInfoStep', // 펀드 제안 등록 step 1
  FUND_PRPL_INFO_STEP2: '/ibkPrplCntr/fund/FundPrplInfoStep2', // 펀드 제안 등록 step 2
  FUND_PRPL_INFO_STEP3: '/ibkPrplCntr/fund/FundPrplInfoStep3', // 펀드 제안 등록 step 3
  FUND_PRPL_INFO_STEP_VIEW: '/ibkPrplCntr/fund/FundPrplInfoStepView', // 펀드 제안 조회1
  FUND_PRPL_INFO_STEP_VIEW2: '/ibkPrplCntr/fund/FundPrplInfoStepView2', // 펀드 제안 조회2
  FUND_PRPL_INFO_STEP_VIEW3: '/ibkPrplCntr/fund/FundPrplInfoStepView3', // 펀드 제안 조회3
  PRPL_CM_LIST_VIEW: '/ibkPrplCntr/PrplCmListView', // 투자기업 추천 이력
  PRPL_CM_WRITE_VIEW: '/ibkPrplCntr/PrplCmWriteView', // 투자기업 추천정보 등록
  PRPL_CM_DETAIL_VIEW: '/ibkPrplCntr/PrplCmDetailView', // 투자기업 추천정보 상세
  VNENTR_LON_SGSH_GDNC_VIEW: '/ibkPrplCntr/vncmloan/VnentrLonSgshGdncView', // IBK 벤처대출
  VNENTR_LON_SGSH_REG_VIEW: '/ibkPrplCntr/vncmloan/VnentrLonSgshRegView', // IBK 벤처대출 추천서 제출
  VNENTR_LON_SGSH_LIST_VIEW: '/ibkPrplCntr/vncmloan/VnentrLonSgshListView', // IBK 벤처대출 추천서 내역
  RCMD_ENPR_LIST_VIEW: '/ibkPrplCntr/RcmdEnprListView', // IBK 추천기업 리스트

  BA10101: '/ibkPrplCntr/BA10101', // 마이페이지(내정보) - 기업

  // 고객센터
  CUSTOMER_SUPPORT: '/customersupport',
  CUSTOMER_SUPPORT_NOTICE: '/customersupport/notice',
  CUSTOMER_SUPPORT_NOTICE_VIEW: '/customersupport/noticeView',
  CUSTOMER_SUPPORT_QA: '/customersupport/qa',
  CUSTOMER_SUPPORT_QA_VIEW: '/customersupport/qa/view',
  CUSTOMER_SUPPORT_QA_WRITE: '/customersupport/qa/write',

  // 마이페이지
  MY_PAGE: '/mypage',

  /* 기업 마이페이지 */

  // 대시보드, 내정보
  MY_PAGE_COMPANY: '/mypage/company', // 마이페이지 기업 대시보드
  MY_PAGE_COMPANY_INFO: '/mypage/company/info', // 마이페이지 기업 내정보
  MY_PAGE_COMPANY_INFO_WRITE: '/mypage/company/info/info/write', // 마이페이지 기업 내정보 수정
  MY_PAGE_COMPANY_INFO_PROD_WRITE: '/mypage/company/info/prod/write', // 마이페이지 기업 주요제품 수정
  MY_PAGE_COMPANY_INFO_INVM_CNVRS: '/mypage/company/info/InvmCnvrsReg', // 마이페이지(기업) - 투자사 전환요청
  MY_PAGE_COMPANY_INVEST_WRITE: '/mypage/company/invest/write', // 마이페이지(기업) - 투자희망 수정
  MY_PAGE_COMPANY_TEAM_WRITE: '/mypage/company/team/write', // 마이페이지(기업) - 팀원정보 수정
  MY_PAGE_COMPANY_VIDEO_WRITE: '/mypage/company/video/write', // 마이페이지(기업) - 소개영상 수정
  MY_PAGE_COMPANY_STAMP_WRITE: '/mypage/company/stamp/write', // 마이페이지(기업) - 인감정보 수정

  // 투자심사
  MY_PAGE_COMPANY_REQUEST_RECEIVE_VIEW: '/mypage/company/request/receive', // 마이페이지 기업 투자 심사 받은 요청.
  MY_PAGE_COMPANY_REQUEST_SEND_VIEW: '/mypage/company/request/send', // 마이페이지 기업 투자 심사 보낸 요청.
  MY_PAGE_COMPANY_REQUEST_DETAIL: '/mypage/company/request/detail', // 마이페이지 기업 투자 심사 요청 상세

  // 컨설팅
  MY_PAGE_CONSULT: '/mypage/company/consult', // 마이페이지(기업) 컨설팅 의뢰 리스트
  MY_PAGE_CONSULT_DETAIL: '/mypage/company/consult/detail', // 마이페이지(기업) 컨설팅 의뢰 상세
  MY_PAGE_CONSULT_WRITE: '/mypage/company/consult/write', // 마이페이지(기업) 컨설팅 의뢰 수정

  // NDA
  MY_PAGE_COMPANY_NDA_RECEIVE: '/mypage/company/nda/receive', // 마이페이지 기업 NDA
  MY_PAGE_COMPANY_NDA_SEND: '/mypage/company/nda/send', // 마이페이지 기업 NDA
  MY_PAGE_COMPANY_NDA_WRITE: '/mypage/company/nda/write', // 마이페이지 기업 NDA 작성
  MY_PAGE_COMPANY_NDA_VIEW: '/mypage/company/nda/view', // 마이페이지 기업 NDA 확인

  // IR
  MY_PAGE_IR: '/mypage/company/ir', // 마이페이지 기업 IR작성
  MY_PAGE_IR_BASIC_INFO: '/mypage/company/ir/basicinfo', // 마이페이지 기업 IR기본정보
  MY_PAGE_IR_FINANCE: '/mypage/company/ir/finance', // 마이페이지 기업 재무정보
  MY_PAGE_IR_HISTORY: '/mypage/company/ir/history', // 마이페이지 기업 연혁
  MY_PAGE_IR_PROD_TECH_MARKET: '/mypage/company/ir/prodtechmarket', // 마이페이지 기업 제품/기술/시장
  MY_PAGE_IR_RESULT_PLANS: '/mypage/company/ir/resultplans', // 마이페이지 기업 성과 및 계획
  MY_PAGE_IR_STOCK: '/mypage/company/ir/stock', // 마이페이지 기업 주주현황
  MY_PAGE_IR_WORKER: '/mypage/company/ir/worker', // 마이페이지 기업 주요인력
  MY_PAGE_IR_BASIC_INFO_WRITE: '/mypage/company/ir/basicInfo/write',
  MY_PAGE_IR_FINANCE_WRITE: '/mypage/company/ir/finance/write',
  MY_PAGE_IR_HISTORY_WRITE: '/mypage/company/ir/history/write',
  MY_PAGE_IR_PROD_TECH_MARKET_WRITE: '/mypage/company/ir/prodtechmarket/write',
  MY_PAGE_IR_RESULT_PLANS_WRITE: '/mypage/company/ir/resultplanswrite',
  MY_PAGE_IR_STOCK_WRITE: '/mypage/company/ir/stock/write',
  MY_PAGE_IR_WORKER_WRITE: '/mypage/company/ir/worker/write',

  // 메시지
  MY_PAGE_COMPANY_MESSAGE_SEND_VIEW: '/mypage/company/message/send/view', // 마이페이지 보낸 메시지
  MY_PAGE_COMPANY_MESSAGE_RECEIVE_VIEW: '/mypage/company/message/receive/view', // 마이페이지 보낸 메시지

  // 벤처 대출
  VNENTR_LON_CM_LIST_VIEW: '/mypage/company/vncmloan/list', // 마이페이지 (내정보) - 기업 IBK 벤처대출
  VNENTR_LON_CM_REG_VIEW: '/mypage/company/vncmloan/register', // 마이페이지 (내정보) - 기업 IBK 벤처대출 등록
  VNENTR_LON_CM_DETAIL_VIEW: '/mypage/company/vncmloan/detail', // 마이페이지 (내정보) - 기업 IBK 벤처대출 상세

  /* 투자사 마이페이지 */

  // 대시보드, 내정보
  MY_PAGE_INVESTOR: '/mypage/investor', // 마이페이지 투자사 대시보드
  MY_PAGE_INVESTOR_INFO: '/mypage/investor/info', // 마이페이지 투자사 내정보
  MY_PAGE_INVESTOR_INFO_WRITE: '/mypage/investor/info/write', // 마이페이지 투자사 내정보 수정
  MY_PAGE_INVESTOR_JUDGE_WRITE: '/mypage/investor/judge/write', // // 마이페이지 투자사 내정보>대표심사역 수정
  MY_PAGE_INVESTOR_STAMP_WRITE: '/mypage/investor/stamp/write', // 마이페이지 투자사 - 인감정보 수정

  // 투자심사
  MY_PAGE_INVESTOR_REQUEST_RECEIVE_VIEW: '/mypage/investor/request/receive', // 마이페이지 투자사 투자 심사 받은 요청
  MY_PAGE_INVESTOR_REQUEST_SEND_VIEW: '/mypage/investor/request/send', // 마이페이지 투자사 투자 심사 보낸 요청
  MY_PAGE_INVESTOR_REQUEST_DETAIL: '/mypage/investor/request/detail', // 마이페이지 투자사 투자심사요청 상세

  // 투자사전용
  MY_PAGE_INVESTOR_EXCLUSIVE: '/mypage/investor/exclusive', // 마이페이지 투자사 투자사전용
  MY_PAGE_INVESTOR_EXCLUSIVE_WRITE: '/mypage/investor/exclusive/write', // 마이페이지 투자사 투자사전용 수정

  // NDA
  MY_PAGE_INVESTOR_NDA_RECEIVE: '/mypage/investor/nda/receive', // 마이페이지 투자사 NDA
  MY_PAGE_INVESTOR_NDA_SEND: '/mypage/investor/nda/send', // 마이페이지 투자사 NDA
  MY_PAGE_INVESTOR_NDA_WRITE: '/mypage/investor/nda/write', // 마이페이지 투자사 NDA 작성
  MY_PAGE_INVESTOR_NDA_VIEW: '/mypage/investor/nda/view', // 마이페이지 투자사 NDA 확인

  // 메시지
  MY_PAGE_INVESTOR_MESSAGE_SEND_VIEW: '/mypage/investor/message/send/view', // 마이페이지 보낸 메시지
  MY_PAGE_INVESTOR_MESSAGE_RECEIVE_VIEW: '/mypage/investor/message/receive/view', // 마이페이지 보낸 메시지

  EVENT: '/event', // 마이페이지 투자사 이벤트(새창)

  LOGIN: '/login',
  LOGOUT: '/logout'
}
Object.freeze(ROUTER_NAMES)
export default ROUTER_NAMES
