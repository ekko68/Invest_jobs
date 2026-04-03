const base = '/api'
const Api = {
  admin: {
    login: base + '/login',
    logOut: base + '',
    jwt_check: base + '/login/check',
    getUserDetail: base + '/user/detail',
    getMenuList: base + '/menu/list', // 메뉴 리스트
    getMenuAuth: base + '/menu/athr/list', // 메뉴 권한
    getUserList: base + '/user/list',
    getUserInfo: base + '/user/login/info',
    setUserInfo: base + '/user/save', //사용자 등록
    deleteUserInfo: base + '/user/delete', //사용자 삭제
    getUserMenu: base + '/menu/list', //메뉴 권한 목록
    getUserAthrMenu: base + '/menu/athr/list', //사용자 메뉴 권한 리스트
    setUserAthrMenu: base + '/menu/athr/save', //사용자 메뉴 권한 등록/수정
    statisticsConsultVisitorDaily: base + '/menu/statistics/daily/list', // 접속 이력 통계 (일간)
    statisticsConsultVisitorMonthly: base + '/menu/statistics/monthly/list', // 접속 이력 통계 (월간)
    statisticsConsultVisitorYearly: base + '/menu/statistics/yearly/list', // 접속 이력 통계 (연간)
    statisticsConsultVisitorExcel: base + '/menu/statistics/excel/download', // 접속 이력 엑셀 다운로드
    downloadBizListExcel: base + '/menu/biz/excel/download' // 접속 이력 엑셀 다운로드 excelDownloadBizList
  },
  invest: {
    // common
    fileUpload: base + '/iv/v1/file/upload', //파일 업로드
    fileDownload: base + '/iv/v1/file/download', //파일 다운로드
    codeInfo: base + '/iv/v1/common/code/all', // 투자박스 코드 조회
    // banner
    bannerMainTop: base + '/admin/banner/main/top/list', // 메인상단 배너 조회
    bannerMainTopSave: base + '/admin/banner/main/top/save', // 메인상단 배너 저장
    bannerMainBottom: base + '/admin/banner/main/bottom/list', // 메인하단 배너 조회
    bannerMainBottomSave: base + '/admin/banner/main/bottom/save', // 메인하단 배너 저장
    bannerCompanyBottom: base + '/admin/banner/company/bottom/list', // 기업정보메인하단 배너 조회
    bannerCompanyBottomSave: base + '/admin/banner/company/bottom/save', // 기업정보메인하단 배너 저장
    bannerMypageCompany: base + '/admin/banner/mypage/company/list', // 마이페이지기업 배너 조회
    bannerMypageCompanySave: base + '/admin/banner/mypage/company/save', // 마이페이지기업 배너 저장
    bannerMypageVc: base + '/admin/banner/mypage/vc/list', // 마이페이지투자사 배너 조회
    bannerMypageVcSave: base + '/admin/banner/mypage/vc/save', // 마이페이지투자사 배너 저장
    // notice
    noticeList: base + '/admin/notice/list', // 공지사항 목록조회
    noticeDetail: base + '/admin/notice/detail', // 공지사항 상세조회
    noticeDelete: base + '/admin/notice/delete', // 공지사항 삭세
    noticeSave: base + '/admin/notice/save', // 공지사항 셍상
    // consult
    consultList: base + '/admin/consult/list', // consult 목록조회
    consultDetail: base + '/admin/consult/detail', // consult 상세 조회
    consultReply: base + '/admin/consult/reply', // consult 답글달기
    // document
    documentList: base + '/admin/document/list', // 문서관리 목록조회
    documentDetail: base + '/admin/document/detail', // 문서관리 상세조회
    documentDelete: base + '/admin/document/delete', // 문서관리 삭세
    documentSave: base + '/admin/document/save', // 문서관리 셍상
    // qna
    qnaList: base + '/admin/qna/list', // qna 목록조회
    qnaDetail: base + '/admin/qna/detail', // qna 상세 조회
    qnaReply: base + '/admin/qna/reply', // qna 답글달기
    // statics
    staticVisitor: base + '/admin/statistics/visitor', // 기간별 방문자
    staticRequest: base + '/admin/statistics/exam/request', // 투자심사요청
    staticSuggest: base + '/admin/statistics/exam/suggest', // 투자심사제안
    staticCompleted: base + '/admin/statistics/exam/complete', // 투자심사완료
    staticVisitorTotal: base + '/admin/statistics/visitor/total', // 기간별 방문자 합계
    staticRequestTotal: base + '/admin/statistics/exam/request/total', // 투자심사요청 합계
    staticSuggestTotal: base + '/admin/statistics/exam/suggest/total', // 투자심사제안 합계
    staticCompletedTotal: base + '/admin/statistics/exam/complete/total', // 투자심사완료 합계
    visitorExcelDownload: base + '/admin/statistics/visitor/excel/download', //  기간별방문자 엑셀 다운로드
    requestExcelDownload: base + '/admin/statistics/exam/request/excel/download', // 투자심사요청 엑셀 다운로드
    suggestExcelDownload: base + '/admin/statistics/exam/suggest/excel/download', // 투자심사제안 엑셀 다운로드
    completeExcelDownload: base + '/admin/statistics/exam/complete/excel/download', // 투자심사완료 엑셀 다운로드
    // investUser
    getVcList: base + '/admin/vc/list', // 투자사 회원 목록
    getVcNewList: base + '/admin/vc/newList', // 투자사 회원 목록 [간전투자 신규 추가]
    getEtcList: base + '/admin/vc/etcList', // 투자사 회원 목록
    acceptVc: base + '/admin/vc/accept', // 투자사 회원 목록
    denyVc: base + '/admin/vc/deny', // 투자사 회원 목록
    saveFncnInfo: base + '/admin/vc/saveFncnInfo', // 출자정보 저장
    getBasicInfoDetail: base + '/admin/vc/basicInfo/detail', // 기본정보 조회
    convertListExcelDownload: base + '/admin/vc/convert/excel/download', // 투자사 전환 목록 엑셀 다운로드
    convertTargetLicenseDownload: base + '/admin/vc/convert/target/license/download', // 전환 대상 사업자등록증 파일 다운로드
    convertEtcListExcelDownload: base + '/admin/vc/convert/excel/etc/download', // 투자사 전환 기타 항목 정보 다운로드
    convertVcListExcelDownload: base + '/admin/vc/convert/excel/vcList/download', // 투자사 전환 목록 엑셀 다운로드
    vncmloanAgisListExcelDownload: base + '/admin/vncmloan/agis/excel', // 협약벤처투자기관 관리
    vncmloanRcmdVcListExcelDownload: base + '/admin/vncmloan/rcmd/excel/vc', // IBK 벤처대출 추천접수(VC)
    vncmloanRcmdRcListExcelDownload: base + '/admin/vncmloan/rcmd/excel/rc', // IBK 벤처대출 추천접수(기업)

    auditReceiveDetail: base + '/admin/audit/detail', // 받은 투자 심사 요청 상세조회

    // recommend
    companyList: base + '/admin/company/list', // 기업목록조회
    companySave: base + '/admin/company/recommend/save', // 추천기업 등록
    companyDelete: base + '/admin/company/recommend/delete', // 추천기업 삭제

    //rcmdEnprMngm
    proposalCompanyList: base + '/admin/rcmdEnprMngm/prplCm/list', //추천받은 기업 리스트
    proposalCompanyDetail: base + '/admin/rcmdEnprMngm/prplCm/detail', //추천받은 기업 상세
    proposalCompanySave: base + '/admin/rcmdEnprMngm/prplCm/memo/save', //추천받은 기업 메모 저장

    // vncmLoan
    vncmloanAgisList: base + '/admin/vncmloan/agis/list', //협약 벤처투자기관 관리
    vncmloanAgisDetail: base + '/admin/vncmloan/agis/detail', //협약 벤처투자기관 관리
    vncmloanAgisSave: base + '/admin/vncmloan/agis/save', //협약 벤처투자기관 저장
    vnemtrlonReqstList: base + '/admin/vncmloan/rcmd/list', // IBK벤처대출 추천 목록조회
    vnemtrlonReqstDetail: base + '/admin/vncmloan/rcmd/detail', // IBK벤처대출 추천 상세조회
    vnemtrlonDetailSave: base + '/admin/vncmloan/rcmd/save', // IBK벤처대출 추천 상세조회
    vnemtrlonDetailMemoSave: base + '/admin/vncmloan/rcmd/memo/save', // IBK벤처대출 추천 받은 기업 메모 저장
    vnemtrlonSendEmail: base + '/admin/vncmloan/rcmd/sendEmail', // IBK벤처대출 이메일보내기
    vnemtrlonSendSms: base + '/admin/vncmloan/rcmd/sendSms', // IBK벤처대출 SMS보내기
    vnemtrlonCodeList: base + '/admin/vncmloan/rcmd/code', // IBK벤처대출 추천상태코드 조회

    // noticeDelete: base + '/admin/notice/delete', // 공지사항 삭세
    // noticeSave: base + '/admin/notice/save', // 공지사항 셍상

    vnemtrlonAplcList: base + '/admin/vncmloan/aplc/list', //벤처대출신청접수 목록조회
    vnemtrlonAplcDetail: base + '/admin/vncmloan/aplc/detail', //벤처대출신청접수 상세조회
    vnemtrlonAplcSave: base + '/admin/vncmloan/aplc/save', //벤처대출신청접수 상태 수정

    // noticeDelete: base + '/admin/notice/delete', // 공지사항 삭세
    // noticeSave: base + '/admin/notice/save', // 공지사항 생성

    // audit
    auditReceiveList: base + '/admin/audit/list', // 받은 투자 심사 요청 목록 조회
    auditExcelList: base + '/admin/audit/excel/list', // 받은 투자 심사 요청 목록 엑셀 다운로드
    auditExcelDetail: base + '/admin/audit/excel/detail', // 받은 투자 심사 요청 상세 엑셀 다운로드
    ibkBrncList: base + '/common/ibk/brnc/list', // IBK 영업점 조회
    ibkEmpList: base + '/common/ibk/brnc/emp/list', // IBK 직원 조회
    updateRecommendPop: base + '/admin/audit/recommend/save', // 추천 영업점, 직원 수정
    deleteRecommend: base + '/admin/audit/recommend/delete', // 추천 영업점, 직원 초기화
    auditFileDownload: base + '/admin/audit/file/download', // 투자검토자료 다운로드
    updateAuditResult: base + '/admin/audit/result/update', // 투자심사결과 수정
    auditEvaluateProgress: base + '/admin/audit/evaluate/progress', // 심사중 상태로 변경

    // fncnBsns
    fncnBsnsPbanSave : base + '/admin/fncn/pban/save',  // 출자사업 공고 등록 및 수정
    fncnBsnsPbanList : base + '/admin/fncn/pban/list',  // 출자사업 공고 리스트 조회
    fncnBsnsPbanDetail : base + '/admin/fncn/pban/detail',  // 출자사업 공고 상세조회
    fncnBsnsPbanStateUpd : base + '/admin/fncn/pban/state/update',  // 출자사업 공고 상세 상태 변경
    excelFncnBsnsPbanList : base + '/admin/fncn/pban/list/excel',  // 출자사업 공고 리스트 엑셀 다운로드
    fncnBsnsRcipList : base + '/admin/fncn/rcip/list',  // 출자사업 접수 리스트 조회
    fncnBsnsRcipDetail : base + '/admin/fncn/rcip/detail',  // 출자사업 접수 상세
    fncnBsnsRcipStateUpd : base + '/admin/fncn/rcip/state/update',  // 출자사업 접수 상세 상태 변경
    excelFncnBsnsRcipList : base + '/admin/fncn/rcip/list/excel',  // 출자사업 접수 리스트 엑셀 다운로드
    fncnBsnsEnlsFildList : base + '/admin/fncn/pban/enls/list',  // 출자사업 공고 모집분야 조회
    fncnBsnsEnlsFildDelete : base + '/admin/fncn/pban/enls/delete',  // 출자사업 공고 모집분야 삭제
    fncnBsnsEnlsFildSave : base + '/admin/fncn/pban/enls/save',  // 출자사업 공고 모집분야 등록 및 수정
    rgsnFncnBsnsPbanInfo : base + '/admin/fncn/pban/rgsnFncnBsnsPban',  // 출자사업 공고 접수정보 등록
  },
  mkt: {
    // common - file
    fileUpload: base + '/mk/v1/file/upload', //파일 업로드
    fileDownload: base + '/mk/v1/file/download', //파일 다운로드
    // main > banner
    bannerCount: base + '/admin/banner/reg/count', // 메인 배너 카운트 조회
    mainBannerList: base + '/admin/banner/main/list', // 메인 배너 목록조회
    subBannerList: base + '/admin/banner/sub/list', // 서브 배너 목록조회
    prodBannerList: base + '/admin/banner/product/list', // 상품 배너 목록조회
    eventBannerList: base + '/admin/banner/event/list', // 이벤트 배너 목록조회
    companyBannerList: base + '/admin/banner/company/list', // 상품 배너 목록조회
    mainBannerSave: base + '/admin/banner/main/save', // 메인 배너 저장
    subBannerSave: base + '/admin/banner/sub/save', // 서브 배너 저장
    prodBannerSave: base + '/admin/banner/product/save', // 상품 배너 저장
    eventBannerSave: base + '/admin/banner/event/save', // 이벤트 배너 저장
    companyBannerSave: base + '/admin/banner/company/save', // 기업 배너 저장
    mainBannerDetail: base + '/admin/banner/main/detail', // 메인 배너 저장
    subBannerDetail: base + '/admin/banner/sub/detail', // 서브 배너 저장
    prodBannerDetail: base + '/admin/banner/product/detail', // 상품 배너 저장
    eventBannerDetail: base + '/admin/banner/event/detail', // 이벤트 배너 저장
    companyBannerDetail: base + '/admin/banner/company/detail', // 기업 배너 상세
    mainBannerDelete: base + '/admin/banner/main/delete', // 메인 배너 삭제
    subBannerDelete: base + '/admin/banner/sub/delete', // 서브 배너 삭제
    prodBannerDelete: base + '/admin/banner/product/delete', // 상품 배너 삭제
    eventBannerDelete: base + '/admin/banner/event/delete', // 이벤트 배너 삭제
    companyBannerDelete: base + '/admin/banner/company/delete', // 이벤트 배너 삭제
    mainBannerOrderPopList: base + '/admin/banner/main/order', // 상품 배너순서관리
    companyBannerOrderPopList: base + '/admin/banner/company/order', // 기업 배너순서관리
    eventBannerOrderPopList: base + '/admin/banner/event/order', // 기업 배너순서관리
    mainBannerOrderSave: base + '/admin/banner/main/order/save', // 상품 배너순서관리
    companyBannerOrderSave: base + '/admin/banner/company/order/save', // 기업 배너순서관리
    eventBannerOrderSave: base + '/admin/banner/event/order/save', // 기업 배너순서관리
    // main > popup
    mainPopupList: base + '/admin/popup/main/list', // 메인 배너 목록조회
    mainPopupDetail: base + '/admin/popup/main/detail', // 메인 배너 상세조회
    mainPopupSave: base + '/admin/popup/main/save', // 메인 배너 저장
    mainPopupDelete: base + '/admin/popup/main/delete', // 메인 배너 삭제

    // main > theme
    themeList: base + '/admin/theme/list', // 메인 배너 목록조회
    themeOrderList: base + '/admin/theme/order/list', // 테마 순번 조회 리스트
    themeOrderUpdate: base + '/admin/theme/order/update', // 테마 순번 저장
    themeDetail: base + '/admin/theme/detail', // 메인 배너 상세조회
    themeSave: base + '/admin/theme/save', // 메인 배너 저장
    themeDelete: base + '/admin/theme/delete', // 메인 배너 삭제
    themeCompanyList: base + '/admin/theme/company/list', // 메인 배너 삭제
    ctgyClass: base + '/admin/theme/category/class',
    // main > bind list
    mainBindList: base + '/admin/product/bundle/list', // 묶음상품목록조회
    mainBindApprove: base + '/admin/product/bundle/main/used', // 묶음상품 메인 승인/취소
    // user > agency
    agencyList: base + '/admin/agency/list', // 에이전시 목록 조회
    agencyApprove: base + '/admin/agency/approve', // 에이전시 등록 승인
    agencyReject: base + '/admin/agency/reject', // 에이전시 등록 반려
    agencyApproveCancel: base + '/admin/agency/roleoff', // 에이전시 등록 권한해제
    agencyRejectCancel: base + '/admin/agency/cancel/reject', // 에이전시 등록 반려취소
    agencyReverseCancel: base + '/admin/agency/cancel/roleoff', // 에이전시 권한해제 취소
    // user > seller > list
    sellerList: base + '/admin/seller/list', // 판매자 목록 조회
    sellerRoleOff: base + '/admin/seller/roleoff', // 판매자 자격 박탈
    sellerRoleOffCancel: base + '/admin/seller/cancel/roleoff', // 판매자 자격 박탈 취소
    sellerTypeList: base + '/admin/seller/type/list', // 판매자 유형 목록 조회
    sellerCompanyInfo: base + '/company/info', //기업정보 조회
    // prod > list
    prodSellerList: base + '/admin/product/seller/list', // 판매자 유형 목록 조회
    prodSellerProdList: base + '/admin/product/seller/prod/list', // (운영자BOX) 판매자 유형 목록 조회
    // prod > detail
    prodSellerDetail: base + '/admin/product/seller/detail', // 판매자 정보 조회
    prodSellerRegList: base + '/admin/product/seller/reg/list', // 등록상품 목록 조회
    prodSellerRegCancel: base + '/admin/product/seller/reg/cancel', // 등록상품 판매중지
    prodSellerRegRecovery: base + '/admin/product/seller/reg/recovery', // 등록상품 판매중지 취소
    prodSellerAgencyList: base + '/admin/product/agency/list', // 에이전시 정보조회
    prodSellerAgencyCancel: base + '/admin/product/agency/cancel', // 에이전시 판매중지
    prodSellerAgencyRecovery: base + '/admin/product/agency/recovery', // 에이전시 판매중지 취소
    // event
    eventManageList: base + '/admin/event/list', // 이벤트 리스트
    eventManageJoinList: base + '/admin/event/join/list', // 이벤트 참여기업 리스트
    eventManageDetail: base + '/admin/event/detail', // 이벤트 상세
    eventManageSave: base + '/admin/event', // 이벤트 저장
    eventManageDelete: base + '/admin/event/del', // 이벤트 삭제
    eventManageApplyList: base + '/admin/event/apply/list', // 승인된 상품 목록
    eventManageSort: base + '/admin/event/update/sort', // 승인된 상품 정렬 업데이트
    eventManageApproveCancel: base + '/admin/event/product/apply/cancel', // 승인된 상품 승인취소(신청상품, 상품추가 공용)
    eventManageProductPartiList: base + '/admin/event/product/parti/list', //  신청 상품 목록
    eventManageProductiList: base + '/admin/event/product/list', // 상품 추가 목록
    eventManageApproveParti: base + '/admin/event/product/parti/apply', // 신청 상품 승인
    eventManageApproveProduct: base + '/admin/event/product/apply', // 상품 추가 승인
    eventManageJoinProductList: base + '/admin/event/product/join/list', // 이벤트 참여 상품 리스트
    eventManageSelectedStatus: base + '/admin/event/selectedstatus/update', // 이벤트 참여 상품 선정 상태 변경
    eventManageAllSelectedStatus: base + '/admin/event/allselectedstatus/update', // 이벤트 참여 상품 선정 상태 변경
    // price
    priceSelrList: base + '/admin/price/selr/list', // 판매금액관리 > 판매사 별 총 판매 금액
    priceAgencyList: base + '/admin/price/agency/list', // 판매금액관리 > 에이전시 별 총 판매 금액
    priceEventList: base + '/admin/price/event/list', // 판매금액관리 > 이벤트 별 총 판매 금액
    priceSelrDetailList: base + '/admin/price/selr/detail', // 판매금액관리 > 판매사 별 총 판매 금액
    // order
    orderList: base + '/admin/order/list', // 주문관리 > 목록
    estimDetail: base + '/admin/order/estim/detail', // 주문관리 > 견적상세
    // cs > faq
    csFaqList: base + '/admin/faq/list', // 고객지원관리 > FAQ 목록
    csFaqDelete: base + '/admin/faq/del', // 고객지원관리 > FAQ 삭제
    csFaqDetail: base + '/admin/faq/detail', // 고객지원관리 > FAQ 상세
    csFaqUpdate: base + '/admin/faq/update', // 고객지원관리 > FAQ 수정
    csFaqSave: base + '/admin/faq', // 고객지원관리 > FAQ 등록
    // cs > qna
    csQnaList: base + '/admin/inquiry/list', // 고객지원관리 > 문의관리 목록
    csQnaDetail: base + '/admin/inquiry/detail', // 고객지원관리 > 문의관리 목록
    csQnaSave: base + '/admin/inquiry', // 고객지원관리 > 문의관리 > 답변등록
    csQnaUpdate: base + '/admin/inquiry/update', // 고객지원관리 > 문의관리 > 답변등록
    csQnaDelete: base + '/admin/inquiry/detail/del', // 고객지원관리 > 문의관리 > 삭제

    csNoticeList: base + '/admin/cs/notice/list', //고객지원관리 > 공지사항 > 목록
    csNoticeDetail: base + '/admin/cs/notice/detail', //고객지원관리 > 공지사항 > 상세
    csNoticeSave: base + '/admin/cs/notice/save', //고객지원관리 > 공지사항 > 저장
    csNoticeDelete: base + '/admin/cs/notice/delete', //고객지원관리 > 공지사항 > 삭제

    csComCode: base + '/admin/faq/ptrn/list', //고객지원관리 > 공통코드조회

    //commerce > search
    searchList: base + '/admin/search/list',
    recommendSearchList: base + '/admin/search/recommend/list',
    popularSearchList: base + '/admin/search/popular/list',
    searchDelete: base + '/admin/search/delete', // 검색어 삭제
    updateStatus: base + '/admin/search/update/status', //검색어 상태값 수정
    productSearchList: base + '/admin/search/product/list', //상품목록 조회
    searchProductDelete: base + '/admin/search/product/delete', // 검색어 상품 삭제
    searchRecommendSave: base + '/admin/search/recommend/save', // 추천검색어 저장
    searchRecommendDetail: base + '/admin/search/recommend/detail', // 추천검색어 상세
    searchSortList: base + '/admin/search/sort/list', // 검색어 정렬

    //commerce > menu
    menuProductList: base + '/admin/menu/product/list', //상품 메뉴 목록
    menuCompanyList: base + '/admin/menu/company/list', //기업 메뉴 목록
    menuSortProductSave: base + '/admin/menu/sort/product/update', //상품 메뉴 목록 정렬
    menuSortCompanySave: base + '/admin/menu/sort/company/update' //기업 메뉴 목록 정렬
  },
  globalbiz: {
    // global > consult
    globalConsultList: base + '/global/consult/list', // 현지금융 상담 목록 조회
    globalConsultDetail: base + '/global/consult/detail', // 현지금융 상담 상세 조회
    globalConsultUpdateBranchAdmin: base + '/global/consult/update/branch/admin', // 현지금융 상담 지점 담당자 지정
    updateGlobalBizGlobalAdminMemo: base + '/global/consult/global/comment/update', // 글로벌 사업부 담당자 메모 업데이트
    updateGlobalBizBranchAdminMemo: base + '/global/consult/branch/comment/update', // 지점 사업부 담당자 메모 업데이트
    globalConsultDelete: base + '/global/consult/delete', // 현지금융 상담 삭제
    globalConsultExcelList: base + '/global/consult/excel/list',
    globalConsultExcelDownload: base + '/global/consult/excel/download' //금융상담 내역 엑셀 다운로드
  },
  books: {
    booksBannerMainList: base + '/admin/banner/main/list', // 메인관리 - 메인배너 목록
    booksBannerMainDetail: base + '/admin/banner/main/detail', // 메인관리 - 메인배너 상세
    booksBannerMainSave: base + '/admin/banner/main/save', // 메인관리 - 메인배너 등록/수정
    booksBannerMainDelete: base + '/admin/banner/main/delete', // 메인관리 - 메인배너 삭제
    booksBannerMainSort: base + '/admin/banner/main/sort', // 메인관리 - 메인배너 순서 변경
    booksBannerAdList: base + '/admin/banner/ad/list', // 메인관리 - 광고배너 목록
    booksBannerAdDetail: base + '/admin/banner/ad/detail', // 메인관리 - 광고배너 상세
    booksBannerAdSave: base + '/admin/banner/ad/save', // 메인관리 - 광고배너 등록/수정
    booksBannerAdDelete: base + '/admin/banner/ad/delete', // 메인관리 - 광고배너 삭제
    booksBannerAdSort: base + '/admin/banner/ad/sort', // 메인관리 - 광고배너 순서 변경
    booksUserList: base + '/admin/user/list', // 회원관리 - 회원목록
    booksUserExcelDownload: base + '/admin/user/excel/download', // 회원관리 - 회원목록 엑셀 다운로드
    booksUserDetail: base + '/admin/user/detail', // 회원관리 - 회원상세
    booksUserBooksList: base + '/admin/user/books/list', // 회원관리 - 회원상세 수금BOX 장부 목록
    booksUserBooksDetail: base + '/admin/user/books/detail', // 회원관리 - 회원상세 수금BOX 장부 상세
    booksUserCommerceList: base + '/admin/user/books/commerce/list', // 회원관리 - 회원상세 커머스BOX 장부 목록
    booksUserCommerceDetail: base + '/admin/user/books/commerce/detail', // 회원관리 - 회원상세 커머스BOX 장부 상세
    booksCollectionInfo: base + '/admin/collection/info', // 추심관리 - 추심신청 상태별 합계 정보
    booksCollectionList: base + '/admin/collection/list', // 추심관리 - 추심신청 목록
    booksCollectionDetail: base + '/admin/collection/detail', // 추심관리 - 추심신청 상세
    booksCollectionUpdate: base + '/admin/collection/update', // 추심관리 - 추심신청 상태 변경
    booksDashboardInfo: base + '/admin/dashboard/info', // 대시보드 - 기본 정보 조회
    booksDashboardUserCount: base + '/admin/dashboard/user/count', // 대시보드 - 기간별 가입자 수
    fileUpload: base + '/file/upload', //파일 업로드
    fileDownload: base + '/file/download' //파일 다운로드
  },
  main: {
    fileUpload: base + '/mn/v1/file/upload', //파일 업로드
    fileDownload: base + '/mn/v1/file/download', //파일 다운로드
    bannerList: base + '/mn/v1/admin/banner/list', // 배너관리 - 목록
    bannerSort: base + '/mn/v1/admin/banner/sort', // 배너관리 - 순서변경
    bannerDetail: base + '/mn/v1/admin/banner/detail', // 배너관리 - 상세
    bannerSave: base + '/mn/v1/admin/banner/save', // 배너관리 - 등록/수정
    bannerDelete: base + '/mn/v1/admin/banner/delete', // 배너관리 - 삭제
    moreLinkList: base + '/mn/v1/admin/link/list', // 더보기메뉴관리 > 링크메뉴설정 목록
    moreLinkDetail: base + '/mn/v1/admin/link/detail', // 더보기메뉴관리 > 링크메뉴설정 상세
    moreLinkSave: base + '/mn/v1/admin/link/update', // 더보기메뉴관리 > 링크메뉴설정 등록/수정
    moreCreditCardImageList: base + '/mn/v1/admin/card/img/list', // 더보기메뉴관리 > 카드이미지등록 목록
    moreCreditCardImageDetail: base + '/mn/v1/admin/card/img/detail', // 더보기메뉴관리 > 카드이미지등록 상세
    moreCreditCardImageSave: base + '/mn/v1/admin/card/img/save', // 더보기메뉴관리 > 카드이미지등록 등록/수정
    serviceEventList: base + '/mn/v1/admin/service/event/list', // 서비스관리 > 이벤트 - 목록
    serviceEventDetail: base + '/mn/v1/admin/service/event/detail', // 서비스관리 > 이벤트 - 상세
    serviceEventSave: base + '/mn/v1/admin/service/event/save', // 서비스관리 > 이벤트 - 등록/수정
    serviceEventDelete: base + '/mn/v1/admin/service/event/delete', // 서비스관리 > 이벤트 - 삭제
    serviceFinanceList: base + '/mn/v1/admin/service/finance/list', // 서비스관리 > 금융서비스 - 목록
    serviceFinanceDetail: base + '/mn/v1/admin/service/finance/detail', // 서비스관리 > 금융서비스 - 상세
    serviceFinanceSave: base + '/mn/v1/admin/service/finance/save', // 서비스관리 > 금융서비스 - 등록/수정
    serviceFinanceDelete: base + '/mn/v1/admin/service/finance/delete', // 서비스관리 > 금융서비스 - 삭제
    serviceBenefitList: base + '/mn/v1/admin/service/benefit/list', // 서비스관리 > 유용한혜텍 - 목록
    serviceBenefitDetail: base + '/mn/v1/admin/service/benefit/detail', // 서비스관리 > 유용한혜텍 - 상세
    serviceBenefitSave: base + '/mn/v1/admin/service/benefit/save', // 서비스관리 > 유용한혜텍 - 등록/수정
    serviceBenefitDelete: base + '/mn/v1/admin/service/benefit/delete', // 서비스관리 > 유용한혜텍 - 삭제
    csNoticeList: base + '/mn/v1/admin/support/notice/list', // 고객센터관리 - 공지사항 목록
    csNoticeDetail: base + '/mn/v1/admin/support/notice/detail', // 고객센터관리 - 공지사항 상세
    csNoticeSave: base + '/mn/v1/admin/support/notice/save', // 고객센터관리 - 공지사항 등록
    csNoticeEachDelete: base + '/mn/v1/admin/support/notice/delete', // 고객센터관리 - 공지사항 삭제(개별)
    csNoticeMultiDelete: base + '/mn/v1/admin/support/notice/list/delete', // 고객센터관리 - 공지사항 삭제(다중)
    csFaqList: base + '/mn/v1/admin/support/faq/list', // 고객센터관리 - FAQ 목록
    csFaqDetail: base + '/mn/v1/admin/support/faq/detail', // 고객센터관리 - FAQ 상세
    csFaqSave: base + '/mn/v1/admin/support/faq/save', // 고객센터관리 - FAQ 등록
    csFaqEachDelete: base + '/mn/v1/admin/support/faq/delete', // 고객센터관리 - FAQ 삭제(개별)
    csFaqMultiDelete: base + '/mn/v1/admin/support/faq/list/delete', // 고객센터관리 - FAQ 삭제(다중)
    csFaqCategoryList: base + '/mn/v1/admin/support/faq/category/list', // 고객센터관리 - FAQ 카테고리 목록
    csFaqCategoryDelete: base + '/mn/v1/admin/support/faq/category/list/delete', // 고객센터관리 - FAQ 카테고리 목록 삭제
    csFaqCategoryEditList: base + '/mn/v1/admin/support/faq/category/edit/list', // 고객센터관리 - FAQ 카테고리 목록 편집
    csFaqCategoryOrder: base + '/mn/v1/admin/support/faq/category/sort', // 고객센터관리 - FAQ 카테고리 순서변경
    csFaqCategorySave: base + '/mn/v1/admin/support/faq/category/save', // 고객센터관리 - FAQ 카테고리 등록
    memberBoxMemberList: base + '/mn/v1/admin/company/boxenpr/list', // 회원사관리 - 회원사 목록
    memberClubCodeList: base + '/mn/v1/admin/company/club/qualification/code/list', // 회원사관리 - 클럽인증 목록
    memberVentureCodeList: base + '/mn/v1/admin/company/venture/qualification/code/list', // 회원사관리 - 벤쳐인증 목록
    memberBoxMemberDetail: base + '/mn/v1/admin/company/boxenpr/detail', // 회원사관리 - 회원사정보 상세
    memberBoxMemberSave: base + '/mn/v1/admin/company/qualification/update', // 회원사관리 - 회원사정보 등록
    termsService: base + '/mn/v1/admin/policy/box/use', // 약관관리 - IBK BOX 약관
    termsCredit: base + '/mn/v1/admin/policy/credit/info', // 약관관리 - 신용정보활용체제
    termsPersonal: base + '/mn/v1/admin/policy/personal/info', // 약관관리 - 개인정보처리방침
    saveTerms: base + '/mn/v1/admin/policy/update', // 약관관리 - 저장
    statisticsCount: base + '/mn/v1/admin/dashboard/today', // 대시보드 > 통계
    statisticsUser: base + '/mn/v1/admin/dashboard/user', // 대시보드 > 사용자 현황 통게
    statisticsPeriod: base + '/mn/v1/admin/dashboard/term', // 대시보드 > 기간별 분석
    documentPackageList: base + '/mn/v1/wallet/package/list', // 전송꾸리미 설정 - 목록
    documentPackageSort: base + '/mn/v1/wallet/package/update-list', // 전송꾸리미 설정 - 순번 설정
    documentPackageDetail: base + '/mn/v1/wallet/package', // 전송꾸리미 설정 - 상세
    documentPackageSave: base + '/mn/v1/wallet/package/save', // 전송꾸리미 설정 - 등록/수정
    documentPackageUpdate: base + '/mn/v1/wallet/package/update', // 전송꾸리미 설정 - 등록/수정
    documentPackageDelete: base + '/mn/v1/wallet/package/delete' // 전송꾸리미 설정 - 삭제
  },
  AxiosInterceptors: [], //axios 비동기 목록
  TIMEROBJ: null, //api 시간제한을 체크하기 위한 변수
  TIMERCNT: 0, //1초씩증가
  LIMITCNT: 300000, //TIMERCNT가 도달하는 최대값으로 300=5분(300)초
  refreshCheck: true,

  adminFund: {
    fundPrplInfoList: base + '/admin/fund/list',
    fundPrplInfoDetail: base + '/admin/fund/detail',
    fundPrplInfoSave: base + '/admin/fund/save',
    fundPrplListExcel: base + '/admin/fund/list/excel' // 제안받은 펀드 엑셀다운로드
  }
}

export default Api
