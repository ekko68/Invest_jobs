import ROUTER_NAMES from './RouterConst'

/*
1. url로 그룹을 만들고 대표 아이디를 지정한 데이터 생성
2. 접속한 url을 가지고 데이터에서 찾고 해당 아이디를 가져온다.
3. 승인된 menuId가 있는지 정보를 비교한다.
4. 없으면 404
 */
const USER_AUTH_URL_MATCH = [
  /** INVEST */
  { router: ROUTER_NAMES.INVEST_BANNER_MAIN_TOP, menuId: 'invest' }, // 투자BOX > 배너관리 > 투자 메인(상단) : '/invest/banner/MainTop'
  { router: ROUTER_NAMES.INVEST_BANNER_MAIN_BOTTOM, menuId: 'mainBottom' }, // 투자BOX > 배너관리 > 투자 메인(상단) : '/invest/banner/MainBottom'
  { router: ROUTER_NAMES.INVEST_BANNER_COMPANY_MAIN_BOTTOM, menuId: 'companyMainBottom' }, // 투자BOX > 배너관리 > 기업정보메인(하단) : '/invest/banner/CompanyMainBottom'
  { router: ROUTER_NAMES.INVEST_BANNER_COMPANY_MYPAGE, menuId: 'companyMypage' }, // 투자BOX > 배너관리 > 마이페이지(기업) : '/invest/banner/CompanyMypage'
  { router: ROUTER_NAMES.INVEST_BANNER_INVESTOR_MYPAGE, menuId: 'investorMypage' }, // 투자BOX > 배너관리 > 마이페이지(투자사) : '/invest/banner/InvestorMypage'
  { router: ROUTER_NAMES.INVEST_NOTICE_LIST, menuId: 'notice' }, // 투자BOX > 공지사항 > 목록 : '/invest/notice/List'
  { router: ROUTER_NAMES.INVEST_NOTICE_VIEW, menuId: 'notice' }, // 투자BOX > 공지사항 > 상세 : '/invest/notice/View'
  { router: ROUTER_NAMES.INVEST_NOTICE_WRITE, menuId: 'notice' }, // 투자BOX > 공지사항 > 수정 : '/invest/notice/Write'
  { router: ROUTER_NAMES.INVEST_CONSULT_LIST, menuId: 'consult' }, // 투자BOX > 컨설팅 > 목록 : '/invest/consult/List'
  { router: ROUTER_NAMES.INVEST_CONSULT_VIEW, menuId: 'consult' }, // 투자BOX > 컨설팅 > 상세 : '/invest/consult/View'
  { router: ROUTER_NAMES.INVEST_DOCUMENT_LIST, menuId: 'document' }, // 투자BOX > 문서관리 > 목록 : '/invest/document/List'
  { router: ROUTER_NAMES.INVEST_DOCUMENT_VIEW, menuId: 'document' }, // 투자BOX > 문서관리 > 상세 : '/invest/document/View'
  { router: ROUTER_NAMES.INVEST_DOCUMENT_WRITE, menuId: 'document' }, // 투자BOX > 문서관리 > 수정 : '/invest/document/Write'
  { router: ROUTER_NAMES.INVEST_QNA_LIST, menuId: 'qna' }, // 투자BOX > QnA > 목록 : '/invest/qna/List'
  { router: ROUTER_NAMES.INVEST_QNA_VIEW, menuId: 'qna' }, // 투자BOX > QnA > 상세 : '/invest/qna/View'
  { router: ROUTER_NAMES.INVEST_USER_LIST, menuId: 'investUser' }, // 투자BOX > 투사사 회원 관리 : '/invest/investUser/List'
  { router: ROUTER_NAMES.INVEST_RECOMMEND_LIST, menuId: 'recommend' }, // 투자BOX > 투사사 회원 관리 : '/invest/recommend/List'
  { router: ROUTER_NAMES.INVEST_STATIC_VISITOR, menuId: 'visitor' }, // 투자BOX > 기간별방문자 : '/invest/static/Visitor'
  { router: ROUTER_NAMES.INVEST_STATIC_OFFER, menuId: 'investOffer' }, // 투자BOX > 진행중인투자 심사제안(투자사 -> 기업) : '/invest/static/InvestOffer'
  { router: ROUTER_NAMES.INVEST_STATIC_REQ, menuId: 'investReq' }, // 투자BOX > 통계 > 진행중인투자 심사요청(기업 -> 투자사) : '/invest/static/InvestReq'
  { router: ROUTER_NAMES.INVEST_STATIC_COMP, menuId: 'investComp' }, // 투자BOX > 통계 > 투자심사 완료 : '/invest/static/InvestComp'

  { router: ROUTER_NAMES.INVEST_AUDIT_INFO_LIST, menuId: 'auditMngm' }, // 투자BOX > 투자희망신청현황 : /invest/auditMngm/AuditInfoList

  { router: ROUTER_NAMES.INVEST_VCMNGM_INVMCNVRSLISTVIEW, menuId: 'vcMngm' }, // 투자BOX > VC 관리 > 투자심사 완료 : '/invest/vcMngm/InvmCnvrsListView'
  { router: ROUTER_NAMES.INVEST_VCMNGM_INVMCNVRSETCINFOVIEW, menuId: 'vcMngm' }, // 투자BOX > VC 관리 > 투자심사 완료 : '/invest/vcMngm/InvmCnvrsEtcInfoView'
  { router: ROUTER_NAMES.INVEST_VCMNGM_INVMCNVRSUPSTVIEW, menuId: 'vcMngm' }, // 투자BOX > VC 관리 > 투자심사 완료 : '/invest/vcMngm/InvmCnvrsUpStView'
  { router: ROUTER_NAMES.INVEST_VCMNGM_INVMCNVRSUPSTVIEW2, menuId: 'vcMngm' }, // 투자BOX > VC 관리 > 투자심사 완료 : '/invest/vcMngm/InvmCnvrsUpStView2'

  { router: ROUTER_NAMES.INVEST_FUNDMNGM_FUNDPRPLINFO, menuId: 'fundMngm' }, // 투자BOX > 펀드 관리 > 제안받은 펀드 : '/invest/fundMngm/FundPrplInfo'
  { router: ROUTER_NAMES.INVEST_FUNDMNGM_FUNDPRPLVIEW, menuId: 'fundMngm' }, // 투자BOX > 펀드 관리 > 펀드 평가 결과 등록 : '/invest/fundMngm/InvestComp'

  { router: ROUTER_NAMES.INVEST_RCMDENPRMNGM_PRPLCM, menuId: 'rcmdEnprMngm' }, // 투자BOX > 추천기업관리 > 추천기업 관리 : '/invest/rcmdEnprMngm/PrplCm'
  { router: ROUTER_NAMES.INVEST_RCMDENPRMNGM_PRPLCMVIEW, menuId: 'rcmdEnprMngm' }, // 투자BOX > 추천기업관리 > 추천받은 기업 : '/invest/rcmdEnprMngm/PrplCmView'

  { router: ROUTER_NAMES.INVEST_RECOMENDRCEPT_AGREMVNENTRINVTMGLISTVIEW, menuId: 'recomendRcept' }, // 투자BOX > IBK 벤처대출 > 협약 벤처투자기관 관리 : '/invest/recomendRcept/AgremVnentrInvtMgListView'
  { router: ROUTER_NAMES.INVEST_RECOMENDRCEPT_VNENTRLONSGSHPRTRCEPTVIEW, menuId: 'recomendRcept' }, // 투자BOX > IBK 벤처대출 > IBK벤처대출 추천 접수(VC) : '/invest/recomendRcept/VnentrLonSgshPrtRceptView'
  { router: ROUTER_NAMES.INVEST_RECOMENDRCEPT_VNENTRLONSGSHPRTRCEPTDETAILVIEW, menuId: 'recomendRcept' }, // 투자BOX > IBK 벤처대출 > IBK벤처대출 추천 접수(VC) 상세 : '/invest/recomendRcept/VnentrLonSgshPrtRceptDetailView'
  { router: ROUTER_NAMES.INVEST_RECOMENDRCEPT_MGVNENTRLONCMLISTVIEW, menuId: 'recomendRcept' }, // 투자BOX > IBK 벤처대출 > IBK벤처대출 접수(기업) : '/invest/recomendRcept/MgVnentrLonCmListView'
  { router: ROUTER_NAMES.INVEST_RECOMENDRCEPT_MGVNENTRLONCMDETAILVIEW, menuId: 'recomendRcept' }, // 투자BOX > IBK 벤처대출 > 벤처대출신청접수상세조회 : '/invest/recomendRcept/MgVnentrLonCmDetailView'

  /** 커머스BOX */
  { router: ROUTER_NAMES.COMMERCE_MAIN_BANNER_LIST, menuId: 'bannerList' }, // 커머스BOX > 배너관리 목록 : '/commerce/main/BannerList'
  { router: ROUTER_NAMES.COMMERCE_MAIN_BANNER_WRITE, menuId: 'bannerList' }, // 커머스BOX > 배너관리 등록 : '/commerce/main/BannerWrite'
  { router: ROUTER_NAMES.COMMERCE_MAIN_BANNER_VIEW, menuId: 'bannerList' }, // 커머스BOX > 배너관리 상세 : '/commerce/main/BannerViewInfo'
  { router: ROUTER_NAMES.COMMERCE_MAIN_BIND_LIST, menuId: 'bindList' }, // 커머스BOX > 묶음상품관리 : '/commerce/main/BindList'
  { router: ROUTER_NAMES.COMMERCE_MAIN_POPUP_LIST, menuId: 'popupList' }, // 커머스BOX > 팝업관리 : '/commerce/main/PopupList'
  { router: ROUTER_NAMES.COMMERCE_MAIN_POPUP_WRITE, menuId: 'popupList' }, // 커머스BOX > 팝업관리(등록) : '/commerce/main/PopupWrite'
  { router: ROUTER_NAMES.COMMERCE_MAIN_POPUP_VIEW, menuId: 'popupList' }, // 커머스BOX > 팝업관리(상세) : '/commerce/main/PopupView'
  { router: ROUTER_NAMES.COMMERCE_USER_LIST_AGENCY, menuId: 'listAgency' }, // : '/commerce/user/ListAgency'
  { router: ROUTER_NAMES.COMMERCE_USER_LIST_SELLER, menuId: 'listSeller' }, // : '/commerce/user/ListSeller'
  { router: ROUTER_NAMES.COMMERCE_PROD_LIST, menuId: 'prod' }, // 목록 : '/commerce/prod/List'
  { router: ROUTER_NAMES.COMMERCE_PROD_VIEW, menuId: 'prod' }, // 상세 : '/commerce/prod/View'
  { router: ROUTER_NAMES.COMMERCE_EVENT_LIST, menuId: 'event' }, // 목록 : '/commerce/event/List'
  { router: ROUTER_NAMES.COMMERCE_EVENT_VIEW, menuId: 'event' }, // 상세 : '/commerce/event/View'
  { router: ROUTER_NAMES.COMMERCE_EVENT_WRITE, menuId: 'event' }, // 등록 : '/commerce/event/Write'
  { router: ROUTER_NAMES.COMMERCE_EVENT_MANAGE, menuId: 'event' }, // 이벤트관리 : '/commerce/event/Manage'
  { router: ROUTER_NAMES.COMMERCE_PRICE_SELLER, menuId: 'seller' }, // 판매사별 : '/commerce/price/Seller'
  { router: ROUTER_NAMES.COMMERCE_PRICE_AGENCY, menuId: 'seller' }, // 에이전시 : '/commerce/price/Agency'
  { router: ROUTER_NAMES.COMMERCE_PRICE_EVENT, menuId: 'seller' }, // 이벤트별 : '/commerce/price/Event'
  { router: ROUTER_NAMES.COMMERCE_ORDER_LIST, menuId: 'order' }, // 목록 : '/commerce/order/List'
  { router: ROUTER_NAMES.COMMERCE_CS_QNA_LIST, menuId: 'csQna' }, // 문의관리 목록 : '/commerce/cs/QnaList'
  { router: ROUTER_NAMES.COMMERCE_CS_QNA_VIEW, menuId: 'csQna' }, // 문의관리 상세 : '/commerce/cs/QnaView'
  { router: ROUTER_NAMES.COMMERCE_CS_FAQ_LIST, menuId: 'faq' }, // FAQ 목록 : '/commerce/cs/FaqList'
  { router: ROUTER_NAMES.COMMERCE_CS_FAQ_WRITE, menuId: 'faq' }, // FAQ 등록/수정 : '/commerce/cs/FaqWrite'

  /** 해외진출BOX */
  { router: ROUTER_NAMES.GLOBAL_CONSULT_LIST, menuId: 'applyList' }, // 목록
  { router: ROUTER_NAMES.GLOBAL_CONSULT_VIEW, menuId: 'applyList' }, // 상세
  { router: ROUTER_NAMES.GLOBAL_STATISTICS_LIST_YEARLY, menuId: 'statisticsListDaily' }, // 해외진출상담 접속 통계 (연도별)
  { router: ROUTER_NAMES.GLOBAL_STATISTICS_LIST_MONTHLY, menuId: 'statisticsListMonthly' }, // 해외진출상담 접속 통계 (월별)
  { router: ROUTER_NAMES.GLOBAL_STATISTICS_LIST_DAILY, menuId: 'statisticsListYearly' } // 해외진출상담 접속 통계 (일자별)
]
export default USER_AUTH_URL_MATCH
