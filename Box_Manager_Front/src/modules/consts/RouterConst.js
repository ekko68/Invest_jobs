/** Page pathname constant */
const ROUTER_NAMES = {
  LOGIN: '/login', // 로그인
  LOGOUT: '/logout', // 로그아웃

  /** ADMIN */
  ADMIN: '/admin', // 관리자계정 관리
  ADMIN_LIST: '/admin/List', // 관리자계정 관리 > 계정 리스트
  ADMIN_WRITE: '/admin/Write', // 관리자계정 관리 > 계정 등록, 수정, 상세
  ADMIN_DASHBOARD: '/admin/dashboard', //

  /** INVEST */
  INVEST: '/invest', // 투자BOX
  INVEST_BANNER_MAIN_TOP: '/invest/banner/MainTop', // 투자BOX > 배너관리 > 투자 메인(상단)
  INVEST_BANNER_MAIN_BOTTOM: '/invest/banner/MainBottom', // 투자BOX > 배너관리 > 투자 메인(상단)
  INVEST_BANNER_COMPANY_MAIN_BOTTOM: '/invest/banner/CompanyMainBottom', // 투자BOX > 배너관리 > 기업정보메인(하단)
  INVEST_BANNER_COMPANY_MYPAGE: '/invest/banner/CompanyMypage', // 투자BOX > 배너관리 > 마이페이지(기업)
  INVEST_BANNER_INVESTOR_MYPAGE: '/invest/banner/InvestorMypage', // 투자BOX > 배너관리 > 마이페이지(투자사)

  // INVEST > NOTICE: '/invest/consult', // 공지사항
  INVEST_NOTICE_LIST: '/invest/notice/List', // 투자BOX > 공지사항 > 목록
  INVEST_NOTICE_VIEW: '/invest/notice/View', // 투자BOX > 공지사항 > 상세
  INVEST_NOTICE_WRITE: '/invest/notice/Write', // 투자BOX > 공지사항 > 수정

  // INVEST > CONSULT: '/consult', // 컨설팅
  INVEST_CONSULT_LIST: '/invest/consult/List', // 투자BOX > 컨설팅 > 목록
  INVEST_CONSULT_VIEW: '/invest/consult/View', // 투자BOX > 컨설팅 > 상세

  // INVEST > DOCUMENT: '/document', // 문서관리
  INVEST_DOCUMENT: '/invest/document', // 투자BOX > 문서관리
  INVEST_DOCUMENT_LIST: '/invest/document/List', // 투자BOX > 문서관리 > 목록
  INVEST_DOCUMENT_VIEW: '/invest/document/View', // 투자BOX > 문서관리 > 상세
  INVEST_DOCUMENT_WRITE: '/invest/document/Write', // 투자BOX > 문서관리 > 수정

  // INVEST > QnA // QnA
  INVEST_QNA: '/invest/qna', // QnA
  INVEST_QNA_LIST: '/invest/qna/List', // 투자BOX > QnA > 목록
  INVEST_QNA_VIEW: '/invest/qna/View', // 투자BOX > QnA > 상세

  // INVEST > investUser
  INVEST_USER_LIST: '/invest/investUser/List', // 투자BOX > 투사사 회원 관리

  // INVEST > company
  INVEST_COMPANY_RECOMMEND_LIST: '/invest/company/RecommendList', // 투자BOX > 기업 > 추천기업
  INVEST_COMPANY_FOREIGN_LIST: '/invest/company/ForeignList', // 투자BOX > 기업 > 해외투자희망기업

  /** STATISTICS */
  INVEST_STATIC_VISITOR: '/invest/static/Visitor', // 투자BOX > 기간별방문자
  INVEST_STATIC_OFFER: '/invest/static/InvestOffer', // 투자BOX > 진행중인투자 심사제안(투자사 -> 기업)
  INVEST_STATIC_REQ: '/invest/static/InvestReq', // 투자BOX > 통계 > 진행중인투자 심사요청(기업 -> 투자사)
  INVEST_STATIC_COMP: '/invest/static/InvestComp', // 투자BOX > 통계 > 투자심사 완료

  INVEST_VCMNGM_INVMCNVRSLISTVIEW: '/invest/vcMngm/InvmCnvrsListView', //투자BOX > VC 관리 > VC 관리
  INVEST_VCMNGM_INVMCNVRSETCINFOVIEW: '/invest/vcMngm/InvmCnvrsEtcInfoView', //투자BOX > VC 관리 > 기타 입력 항목 관리
  INVEST_VCMNGM_INVMCNVRSUPSTVIEW: '/invest/vcMngm/InvmCnvrsUpStView', //상세-대기
  INVEST_VCMNGM_INVMCNVRSUPSTVIEW2: '/invest/vcMngm/InvmCnvrsUpStView2', //상세-승인완료-대기

  INVEST_FUNDMNGM_FUNDPRPLINFO: '/invest/fundMngm/FundPrplInfo', //투자BOX > 펀드 관리 > 제안받은 펀드
  INVEST_FUNDMNGM_FUNDPRPLVIEW: '/invest/fundMngm/FundPrplView', //투자BOX > 펀드 관리 > 펀드 평가 결과 등록

  INVEST_RCMDENPRMNGM_PRPLCM: '/invest/rcmdEnprMngm/PrplCm', //투자BOX > 추천기업관리 > 추천기업 관리
  INVEST_RCMDENPRMNGM_PRPLCMVIEW: '/invest/rcmdEnprMngm/PrplCmView', //투자BOX > 추천기업관리 > 추천받은 기업

  INVEST_RECOMENDRCEPT_AGREMVNENTRINVTMGLISTVIEW: '/invest/recomendRcept/AgremVnentrInvtMgListView', //투자BOX > IBK 벤처대출 > 협약벤처투자기관목록조회
  INVEST_RECOMENDRCEPT_AGREMVNENTRINVTMGDETAILVIEW: '/invest/recomendRcept/AgremVnentrInvtMgDetailView', //투자BOX > IBK 벤처대출 > 협약벤처투자기관상세조회
  INVEST_RECOMENDRCEPT_VNENTRLONSGSHPRTRCEPTVIEW: '/invest/recomendRcept/VnentrLonSgshPrtRceptView', //투자BOX > IBK 벤처대출 > IBK벤처대출추천접수(VC)
  INVEST_RECOMENDRCEPT_VNENTRLONSGSHPRTRCEPTDETAILVIEW: '/invest/recomendRcept/VnentrLonSgshPrtRceptDetailView', //투자BOX > IBK 벤처대출 > IBK벤처대출추천접수(VC)
  INVEST_RECOMENDRCEPT_MGVNENTRLONCMLISTVIEW: '/invest/recomendRcept/MgVnentrLonCmListView', //투자BOX > IBK 벤처대출 > IBK벤처대출접수(기업)
  INVEST_RECOMENDRCEPT_MGVNENTRLONCMDETAILVIEW: '/invest/recomendRcept/MgVnentrLonCmDetailView', //투자BOX > IBK 벤처대출 > 벤처대출신청접수상세조회

  INVEST_AUDIT_INFO_LIST: '/invest/auditMngm/AuditInfoList', //투자BOX > 투자희망신청현황
  INVEST_AUDIT_INFO_DETAIL: '/invest/auditMngm/AuditInfoDetail', //투자BOX > 투자희망신청현황 상세화면

  INVEST_FNCN_BSNS_PBAN_LIST : '/invest/fncnBsns/FncnBsnsPbanList', //투자BOX > 출자사업 > 출자사업 공고 목록
  INVEST_FNCN_BSNS_PBAN_VIEW : '/invest/fncnBsns/FncnBsnsPbanView', //투자BOX > 출자사업 > 출자사업 공고 상세&등록
  INVEST_FNCN_BSNS_RCIP_LIST : '/invest/fncnBsns/FncnBsnsRcipList', //투자BOX > 출자사업 > 출자사업 접수 목록
  INVEST_FNCN_BSNS_RCIP_DETAIL : '/invest/fncnBsns/FncnBsnsRcipDetail', //투자BOX > 출자사업 > 출자사업 접수 상세

  /** 커머스BOX */
  COMMERCE_MAIN: '/commerce',
  // COMMERCE > main : 메인관리
  COMMERCE_MAIN_BANNER_LIST: '/commerce/main/BannerList', // 커머스BOX > 배너관리 목록
  COMMERCE_MAIN_BANNER_WRITE: '/commerce/main/BannerWrite', // 커머스BOX > 배너관리 등록
  COMMERCE_MAIN_BANNER_VIEW: '/commerce/main/BannerViewInfo', // 커머스BOX > 배너관리 상세
  COMMERCE_MAIN_BIND_LIST: '/commerce/main/BindList', // 커머스BOX > 묶음상품관리
  COMMERCE_MAIN_POPUP_LIST: '/commerce/main/PopupList', // 커머스BOX > 팝업관리
  COMMERCE_MAIN_POPUP_WRITE: '/commerce/main/PopupWrite', // 커머스BOX > 팝업관리(등록)
  COMMERCE_MAIN_POPUP_VIEW: '/commerce/main/PopupView', // 커머스BOX > 팝업관리(상세)
  COMMERCE_MAIN_PRODUCT: '/commerce/main/product', //커머스BOX > 메인관리 > 상품메인
  COMMERCE_MAIN_PRODUCT_REGISTRATION: '/commerce/main/product/registration', //커머스BOX > 메인관리 > 상품메인 > 등록
  COMMERCE_MAIN_PRODUCT_UPDATE: '/commerce/main/product/update', // 커머스BOX > 메인관리 > 상품메인 >  수정
  COMMERCE_MAIN_COMPANY: '/commerce/main/company', //커머스BOX > 메인관리 > 상품메인
  COMMERCE_MAIN_COMPANY_REGISTRATION: '/commerce/main/company/registration', //커머스BOX > 메인관리 > 상품메인 > 등록
  COMMERCE_MAIN_COMPANY_UPDATE: '/commerce/main/company/update', // 커머스BOX > 메인관리 > 상품메인 >  수정
  COMMERCE_MAIN_EVENT: '/commerce/main/event', //커머스BOX > 메인관리 > 상품메인
  COMMERCE_MAIN_EVENT_REGISTRATION: '/commerce/main/event/registration', //커머스BOX > 메인관리 > 상품메인 > 등록
  COMMERCE_MAIN_EVENT_UPDATE: '/commerce/main/event/update', // 커머스BOX > 메인관리 > 상품메인 >  수정
  // COMMERCE > 팝업관리
  COMMERCE_MANAGEMENT_POPUP: '/commerce/management/popup', // 커머스BOX > 팝업관리
  COMMERCE_MANAGEMENT_POPUP_REGISTRATION: '/commerce/management/popup/registration', // 커머스BOX > 팝업관리 > 등록
  COMMERCE_MANAGEMENT_POPUP_UPDATE: '/commerce/management/popup/update', // 커머스BOX > 팝업관리 > 수정
  //COMMERCE > search : 검색관리
  COMMERCE_MANAGEMENT_SEARCH: '/commerce/management/search',

  // COMMERCE > user : 회원관리
  COMMERCE_USER_LIST_AGENCY: '/commerce/user/ListAgency',
  COMMERCE_USER_LIST_SELLER: '/commerce/user/ListSeller',

  // COMMERCE > 판매자관리
  COMMERCE_USER_SELLER: '/commerce/user/seller',

  // COMMERCE > prod : 판매사 상품관리
  COMMERCE_PROD_LIST: '/commerce/prod/List', // 목록
  COMMERCE_PROD_VIEW: '/commerce/prod/View', // 상세

  // COMMERCE > management > product : 판매사 상품관리
  COMMERCE_MANAGEMENT_PRODUCT: '/commerce/management/product', // 목록

  // COMMERCE > event : 이벤트
  COMMERCE_EVENT_LIST: '/commerce/event/List', // 목록
  COMMERCE_EVENT_VIEW: '/commerce/event/View', // 상세
  COMMERCE_EVENT_WRITE: '/commerce/event/Write', // 등록
  COMMERCE_EVENT_MANAGE: '/commerce/event/Manage', // 이벤트관리
  COMMERCE_MANAGEMENT_EVENT: '/commerce/management/event', //신규 이벤트 관리
  COMMERCE_MANAGEMENT_EVENT_REGISTRATION: '/commerce/management/event/registration', // 신규 이벤트 등록

  // COMMERCE > price : 판매금액관리
  COMMERCE_PRICE_SELLER: '/commerce/price/seller', // 판매사별
  COMMERCE_PRICE_AGENCY: '/commerce/price/Agency', // 에이전시
  COMMERCE_PRICE_EVENT: '/commerce/price/Event', // 이벤트별

  // COMMERCE > order : 주문관리
  COMMERCE_ORDER_LIST: '/commerce/order/List', // 목록

  // COMMERCE > cs : 고객지원관리
  // COMMERCE_CS_QNA_LIST: '/commerce/cs/QnaList', // 문의관리 목록
  // COMMERCE_CS_QNA_VIEW: '/commerce/cs/QnaView', // 문의관리 상세
  // COMMERCE_CS_FAQ_LIST: '/commerce/cs/FaqList', // FAQ 목록
  // COMMERCE_CS_FAQ_WRITE: '/commerce/cs/FaqWrite', // FAQ 등록/수정
  COMMERCE_CS_QNA_LIST: '/commerce/cs/qna',
  COMMERCE_CS_FAQ_LIST: '/commerce/cs/faq',
  COMMERCE_CS_NOTICE_LIST: '/commerce/cs/notice',
  COMMERCE_CS_QNA_REGISTRATION: '/commerce/cs/qna/registration',
  COMMERCE_CS_FAQ_REGISTRATION: '/commerce/cs/faq/registration',
  COMMERCE_CS_NOTICE_REGISTRATION: '/commerce/cs/notice/registration',

  COMMERCE_MANAGEMENT_MENU_PRODUCT: '/commerce/management/menu/product', // 커머스/메뉴관리/상품관리
  COMMERCE_MANAGEMENT_MENU_COMPANY: '/commerce/management/menu/company', // 커머스/메뉴관리/기업관리

  // COMMERCE > 테마기업관리
  COMMERCE_MANAGEMENT_THEME: '/commerce/management/theme', // 커머스BOX > 팝업관리
  COMMERCE_MANAGEMENT_THEME_REGISTRATION: '/commerce/management/theme/registration', // 커머스BOX > 팝업관리 > 등록
  COMMERCE_MANAGEMENT_THEME_UPDATE: '/commerce/management/theme/update', // 커머스BOX > 팝업관리 > 수정
  /** 해외진출BOX */
  GLOBAL: '/global',
  GLOBAL_CONSULT_LIST: '/global/consult/list',
  GLOBAL_CONSULT_VIEW: '/global/consult/detail',
  GLOBAL_STATISTICS_LIST_YEARLY: '/global/statistics/listYearly',
  GLOBAL_STATISTICS_LIST_MONTHLY: '/global/statistics/listMonthly',
  GLOBAL_STATISTICS_LIST_DAILY: '/global/statistics/listDaily',

  /** 수금관리BOX */
  BOOKS: '/books',
  BOOKS_BANNER_MAIN_LIST: '/books/banner/main/List', // 메인배너 목록
  BOOKS_BANNER_MAIN_VIEW: '/books/banner/main/View', // 메인배너 상세
  BOOKS_BANNER_MAIN_EDIT: '/books/banner/main/Write', // 메인배너 수정

  BOOKS_BANNER_AD_LIST: '/books/banner/ad/List', // 광고배너 목록
  BOOKS_BANNER_AD_VIEW: '/books/banner/ad/View', // 광고배너 상세
  BOOKS_BANNER_AD_EDIT: '/books/banner/ad/Write', // 광고배너 수정

  BOOKS_USER_LIST: '/books/user/List', // 회원관리 목록
  BOOKS_USER_VIEW: '/books/user/View', // 회원관리 상세

  BOOKS_COLLECTION_LIST: '/books/collection/List', // 추심관리 목록
  BOOKS_COLLECTION_VIEW: '/books/collection/View', // 추심관리 상세

  /** 대시보드 */
  DASHBOARD: '/dashboard',
  DASHBOARD_MAIN: '/dashboard/main', // 대시보드
  DASHBOARD_BOOKS: '/dashboard/books', // 대시보드

  /** 메인BOX */
  MAIN: '/main',
  MAIN_BANNER_BUSINESSCHAT_LIST: '/main/banner/businesschat/List', // 거래처채팅 리스트
  MAIN_BANNER_BUSINESSCHAT_VIEW: '/main/banner/businesschat/View', // 거래처채팅 상세
  MAIN_BANNER_BUSINESSCHAT_WRITE: '/main/banner/businesschat/Write', // 거래처채팅 등록/수정
  MAIN_BANNER_MORE_LIST: '/main/banner/more/List', // 더보기 리스트
  MAIN_BANNER_MORE_VIEW: '/main/banner/more/View', // 더보기 상세
  MAIN_BANNER_MORE_WRITE: '/main/banner/more/Write', // 더보기 등록/수정
  MAIN_BANNER_CARDLIMIT_LIST: '/main/banner/cardlimit/List', // 카드한도조회 리스트
  MAIN_BANNER_CARDLIMIT_VIEW: '/main/banner/cardlimit/View', // 카드한도조회 상세
  MAIN_BANNER_CARDLIMIT_WRITE: '/main/banner/cardlimit/Write', // 카드한도조회 등록/수정
  MAIN_BANNER_SERVICE_LIST: '/main/banner/service/List', // 서비스 리스트
  MAIN_BANNER_SERVICE_VIEW: '/main/banner/service/View', // 서비스 상세
  MAIN_BANNER_SERVICE_WRITE: '/main/banner/service/Write', // 서비스 등록/수정
  MAIN_BANNER_COMMON_LIST: '/main/banner/common/List', // PC화면배너(우측) 리스트
  MAIN_BANNER_COMMON_VIEW: '/main/banner/common/View', // PC화면배너(우측) 상세
  MAIN_BANNER_COMMON_WRITE: '/main/banner/common/Write', // PC화면배너(우측) 등록/수정

  MAIN_MOREMENU_LINKMENU_LIST: '/main/moremenu/linkmenu/List', // 링크메뉴 리스트
  MAIN_MOREMENU_LINKMENU_WRITE: '/main/moremenu/linkmenu/Write', // 링크메뉴 수정
  MAIN_MOREMENU_CARDIMG_LIST: '/main/moremenu/cardimg/List', // 카드이미지 리스트
  MAIN_MOREMENU_CARDIMG_WRITE: '/main/moremenu/cardimg/Write', // 카드이미지 등록/수정

  MAIN_SERVICEMENU_EVENT_LIST: '/main/servicemenu/event/List', // 이벤트 리스트
  MAIN_SERVICEMENU_EVENT_VIEW: '/main/servicemenu/event/View', // 이벤트 상세
  MAIN_SERVICEMENU_EVENT_WRITE: '/main/servicemenu/event/Write', // 이벤트 등록/수정
  MAIN_SERVICEMENU_FINANCE_LIST: '/main/servicemenu/finance/List', // 금융서비스 리스트
  MAIN_SERVICEMENU_FINANCE_VIEW: '/main/servicemenu/finance/View', // 금융서비스 상세
  MAIN_SERVICEMENU_FINANCE_WRITE: '/main/servicemenu/finance/Write', // 금융서비스 등록/수정
  MAIN_SERVICEMENU_BENEFITS_LIST: '/main/servicemenu/benefits/List', // 혜택 리스트
  MAIN_SERVICEMENU_BENEFITS_VIEW: '/main/servicemenu/benefits/View', // 혜택 상세
  MAIN_SERVICEMENU_BENEFITS_WRITE: '/main/servicemenu/benefits/Write', // 혜택 등록/수정

  MAIN_CS_NOTICE_LIST: '/main/cs/notice/List', // 공지사항 리스트
  MAIN_CS_NOTICE_VIEW: '/main/cs/notice/View', // 공지사항 상세
  MAIN_CS_NOTICE_WRITE: '/main/cs/notice/Write', // 공지사항 등록/수정
  MAIN_CS_FAQ_LIST: '/main/cs/faq/List', // faq 리스트
  MAIN_CS_FAQ_VIEW: '/main/cs/faq/View', // faq 상세
  MAIN_CS_FAQ_WRITE: '/main/cs/faq/Write', // faq 등록/수정

  MAIN_DOCUMENT_PACKAGE_LIST: '/main/document/package/List', // 전송꾸러미 설정 리스트
  MAIN_DOCUMENT_PACKAGE_VIEW: '/main/document/package/View', // 전송꾸러미 설정 상세
  MAIN_DOCUMENT_PACKAGE_WRITE: '/main/document/package/Write', // 전송꾸러미 설정 등록/수정

  MAIN_MEMBER_LIST: '/main/member/List', // 회원사관리 리스트
  MAIN_MEMBER_VIEW: '/main/member/View', // 회원사관리 상세

  MAIN_TERMS_SERVICE: '/main/terms/Service', // 약관관리 IBK BOX 이용약관
  MAIN_TERMS_PRIVACY: '/main/terms/Privacy', // 약관관리 개인정보처리방침
  MAIN_TERMS_CREDIT: '/main/terms/Credit', // 약관관리 신용정보활용체제

  NOT_FOUND: '/notFound',
  NOT_AUTH_INFO: '/notAuthInfo'
}
export default ROUTER_NAMES
