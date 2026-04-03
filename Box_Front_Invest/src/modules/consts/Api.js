// const base = '/api/iv/v1'
const base = '/api'
const Api = {
  login: {
    login: base + '/login',
    logOut: base + '/login/logout',
    jwtCheck: base + '/login/jwt/check'
  },

  common: {
    categoryList: base + '/common/category/list', // 공통 >  > 분야 목록 조회
    techList: base + '/common/tech/list', // 공통 >  > 활용 기술 목록 조회
    investStepList: base + '/common/invest/step/list', // 공통 >  > 투자단계 목록 조회
    regionList: base + '/common/region/list', // 공통 >  > 지역 정보 목록 조회
    consultingTypeList: base + '/common/consulting/type/list', // 공통 >  > 컨설팅 유형 목록 조회
    companyTypeList: base + '/common/company/type/list', // 기업구분목록 조회
    irIndexList: base + '/common/ir/index/list', // (IR) 주요지표목록 조회
    irIpStatusList: base + '/common/ir/ip/status/list', // (IR) 지적재산권상태목록 조회
    irDomesticList: base + '/common/ir/domestic/list', // (IR) 국내외지표목록 조회
    investAmountList: base + '/common/invest/amount/list', // 투자희망금액목록 조회
    vcTypeList: base + '/common/vc/type/list', // 투자사유형목록 조회
    shapeList: base + '/common/company/shape/list', // 기업형태목록 조회
    qaStatusList: base + '/common/qa/status/list', // Q&A 상태 목록 조회
    qaTypeList: base + '/common/qa/type/list', // Q&A 타입 목록 조회

    codeAll: base + '/common/code/all',

    // file
    fileUpload: base + '/file/upload', //파일 업로드
    fileUploadCommerce: base + '/file/upload/commerce', // 커머스 파일 업로드

    fileDownload: base + '/file/download', // 파일다운로드
    fileNdaPdfDownload: base + '/file/download/nda/pdf', // NDA PDF 다운도도

    // Alarm
    alarmInvestUnread: base + '/common/alarm/invest/unread', // 투자박스 알림 미수신 건 확인
    alarmInvestList: base + '/common/alarm/invest/list', // 투자박스 알림 리스트 조회
    alarmCheck: base + '/common/alarm/check', // 알림 수신 체크

    // Count
    visitorCount: base + '/common/visitor/count', // 방문자 접속 카운트

    // ibk 영업점, 직원 조회
    ibkBrncList: base + '/common/ibk/brnc/list', // IBK 영업점 조회
    ibkBrncEmpList: base + '/common/ibk/brnc/emp/list', // IBK 영업점 직원 조회

    // Terms
    termsBoxPersonalInfo: base + '/common/terms/box/personal/info', // 개인정보 처리방침 약관 조회
    termsBoxServiceInfo: base + '/common/terms/box/service/info', // BOX 서비스 제공 동의
    termsBoxAutoCollect: base + '/common/terms/box/auto/collect', // IBK BOX 고객정보 자동 수집 서비스 약관 조회

    // Document
    niceSimpleKeySave: base + '/doc/nice/simple/key/save', // 간편서류 NICE 스크래핑 키 생성
    niceSimpleList: base + '/doc/nice/simple/list', // 투자박스 제출 간편서류 최신 목록 조회
    niceSimpleDownload: base + '/doc/nice/simple/download', // 간편서류 파일 다운로드
    infotechCertKeySave: base + '/doc/infotech/cert/key/save', // INFOTECH 스크래핑 인증키 발급
    bobInq: base + '/cmi012/bobInq', // 영업점조회
    aoSicCdListInq: base + '/cao002/aoSicCdListInq' // 산업표준코드 조회
  },

  main: {
    // banner: base + '/main/banner/list', // 메인 화면 > 메인 화면 > 배너 목록 조회,
    bannerTop: base + '/main/banner/top', // 메인 화면 > 메인 화면 > 상단 배너 목록 조회,
    bannerBottom: base + '/main/banner/bottom', // 메인 화면 > 메인 화면 > 하단 배너 조회,
    investStatus: base + '/main/invest/req/status', //  투자유치신청현황 조회
    companyRecent: base + '/main/company/recent/list', // 기업
    fundInfo: base + '/main/vc/fund/info', //총펀드 금액
    // investParticipate: base + '/main/vc/participate/list', // 참여중인 투자사
    investWebLinkList: base + '/main/vc/weblink/list', // 창업 투자사
    categoryImageList: base + '/main/category/image/list' // 분야리스트 조회
  },
  consulting: {
    consultingSave: base + '/consulting/save' // 컨설팅 > 컨설팅 메인 화면 > 컨설팅 신청하기
  },

  company: {
    infoList: base + '/company/info/list', // 기업 정보 > 목록 화면 > 기업 목록 조회
    infoDetail: base + '/company/info/detail', // 기업 정보 > 상세 화면 > 기업 기본정보 상세 조회
    businessAsk: base + '/company/business/ask', // 기업 정보 > 상세 화면 > 사업문의 요청
    memberList: base + '/company/member/list', // 기업 정보 > 상세 화면 > 팀원 목록 조회
    newsList: base + '/company/news/list', // 기업 정보 > 상세 화면 > 관련 뉴스 목록 조회
    investReqStatus: base + '/company/invest/req/status', // 기업 정보 > 메인 화면 > 투자 유치 신청 현황 조회
    infoRecentList: base + '/company/info/recent/list', // 기업 정보 > 메인 화면 > 최신 등록 기업 목록 조회
    auditOnGoing: base + '/company/audit/ongoing', // 투자 심사 요청 상태 구분 (기업 상세 화면)
    auditLimit: base + '/company/audit/limit',
    auditSuggestSave: base + '/company/audit/suggest/save', // 투자심사제안
    productDetail: base + '/company/product/detail', // 기업제품상세조회
    banner: base + '/company/banner', // 기업목록 페이지 하단 배너 조회
    likeToggleSave: base + '/company/like/toggle/save' // 기업 좋아요 토글 수정
  },

  vc: {
    infoList: base + '/vc/info/list', // 투자기관 정보 > 목록 화면 > 투자자 목록
    infoDetail: base + '/vc/info/detail', // 투자기관 정보 > 상세 화면 > 투자기관 상세 정보 조회
    portfolioList: base + '/vc/portfolio/list', // 투자기관 정보 > 상세 화면 > 포트폴리오 목록 조회
    memberList: base + '/vc/member/list', // 투자기관 정보 > 상세 화면 > 대표심사역 목록 조회
    newsList: base + '/vc/news/list', // 투자기관 정보 > 상세 화면 > 관련 뉴스 목록 조회
    fundInfo: base + '/vc/fund/info', // 투자기관 정보 > 메인 화면 > 총 펀드금액 조회
    participateList: base + '/vc/participate/list', // 투자기관 정보 > 메인 화면 > 참여중인 투자사 목록 조회
    weblinkList: base + '/vc/weblink/list', // 투자기관 정보 > 메인 화면 > 마이페이지 보유 투자사 목록 조회
    auditCompanyLimit: base + '/vc/audit/company/limit', // 투자심사제한확인
    auditIrAgreementSave: base + '/vc/audit/ir/agreement/save', // 자동갱신 약관 동의여부 저장
    auditIrPreview: base + '/vc/audit/company/ir/preview', // IR 미리보기
    auditRequestSave: base + '/vc/audit/request/save', // 투자심사요청
    auditOnGoing: base + '/vc/audit/ongoing', // 투자 심사 요청 상태 구분 (투자심사요청 화면)
    // auditSimpleDocKeySave: base + '/vc/audit/company/simple/doc/key/save', // 간편서류제출 key 생성 요청
    webLinkPage: base + '/vc/weblink/page' // 투자사 전용페이지 화면정보
  },

  my: {
    company: {
      messageList: base + '/my/company/message/list', // 마이페이지 (기업) > 대시보드 > 최근 메시지 목록 조회
      messageDetail: base + '/my/company/message/detail', // 마이페이지 (기업) > 대시보드 > 최근 메시지 상세 조회
      recommendVc: base + '/my/company/recommend/vc', // 마이페이지 (기업) > 대시보드 > 추천 투자사 목록 조회
      auditSuggest: base + '/my/company/audit/suggest', // 마이페이지 (기업) > 대시보드 > 받은 투자심사요청 제안 목록 조회
      infoSave: base + '/my/company/info/save', // 마이페이지 (기업) > 내 정보 > 기본정보 등록/수정
      productSave: base + '/my/company/product/save', // 마이페이지 (기업) > 내 정보 > 주요제품 등록/수정
      investHopeSave: base + '/my/company/invest/hope/save', // 마이페이지 (기업) > 내 정보 > 투자희망 등록/수정
      memberSave: base + '/my/company/member/save', // 마이페이지 (기업) > 내 정보 > 팀원정보 등록/수정
      introMediaSave: base + '/my/company/intro/media/save', // 마이페이지 (기업) > 내 정보 > 소개영상 등록/수정
      ir: base + '/my/company/ir', // 마이페이지 (기업) > IR  > IR 목록 조회
      irBasicSave: base + '/my/company/ir/basic/save', // 마이페이지 (기업) > IR  > IR 기본정보 등록/수정
      irHistorySave: base + '/my/company/ir/history/save', // 마이페이지 (기업) > IR  > IR 주요연혁 정보 등록/수정
      irMemberSave: base + '/my/company/ir/member/save', // 마이페이지 (기업) > IR  > IR 주요인력 정보 등록/수정
      irStockholdersSave: base + '/my/company/ir/stockholders/save', // 마이페이지 (기업) > IR  > IR 주주현황 정보 등록/수정
      irFinancialSave: base + '/my/company/ir/financial/save', // 마이페이지 (기업) > IR  > IR 재무정보 등록/수정
      irExtraInfoSave: base + '/my/company/ir/extrainfo/save', // 마이페이지 (기업) > IR  > IR 제품/기술/시장 정보 등록/수정
      irPlanSave: base + '/my/company/ir/plan/save', // 마이페이지 (기업) > IR  > IR 성과 및 계획 정보 등록/수정
      auditSuggestReceive: base + '/my/company/audit/suggest/receive', // 마이페이지 (기업) > 투자심사요청 > 받은 투자심사요청 제안 목록 조회
      auditSuggestSend: base + '/my/company/audit/suggest/send', // 마이페이지 (기업) > 투자심사요청 > 보낸 투자심사요청 제안 목록 조회
      auditSuggestDetail: base + '/my/company/audit/suggest/detail', // 마이페이지 (기업) > 투자심사요청 > 투자심사요청 제안 정보 조회
      auditRequestSave: base + '/my/company/audit/request/save', // 마이페이지 (기업) > 투자심사요청 > 투자심사요청 입력
      auditMessageSend: base + '/my/company/audit/message/send', // 마이페이지 (기업) > 투자심사요청 > 메시지 보내기
      auditMessageList: base + '/my/company/audit/message/list', // 마이페이지 (기업) > 투자심사요청 > 메시지 목록 조회
      auditMessageDetail: base + '/my/company/audit/message/detail', // 마이페이지 (기업) > 투자심사요청 > 메시지 정보 조회
      auditMessageReply: base + '/my/company/audit/message/reply', // 마이페이지 (기업) > 투자심사요청 > 메시지 답장하기
      consultingList: base + '/my/company/consulting/list', // 마이페이지 (기업) > 컨설팅 > 컨설팅 리스트 목록 조회
      consultingDetail: base + '/my/company/consulting/detail', // 마이페이지 (기업) > 컨설팅 > 컨설팅 상세 정보 조회
      consultingCancel: base + '/my/company/consulting/cancel', // 마이페이지 (기업) > 컨설팅 > 컨설팅 의뢰 취소
      consultingSave: base + '/my/company/consulting/save', // 마이페이지 (기업) > 컨설팅 > 컨설팅 의뢰 수정
      messageReceive: base + '/my/company/message/receive', // 마이페이지 (기업) > 메시지 > 받은 메시지 목록 조회
      messageSend: base + '/my/company/message/send', // 마이페이지 (기업) > 메시지 > 보낸 메시지 목록 조회
      messageReadAll: base + '/my/company/message/read/all', // 마이페이지 (기업) > 메시지 > 메시지 전체 읽음 요청
      irProgress: base + '/my/company/ir/progress', // IR 작성 진행도 조회
      irBasicInfoDetail: base + '/my/company/ir/basic/detail', // IR 기본정보 조회
      irHistoryList: base + '/my/company/ir/history/list', // IR 주요연력 조회 (수정용 조회)
      irMemberList: base + '/my/company/ir/member/list', // IR 주요연혁 조회
      irStockholdersList: base + '/my/company/ir/stockholders/list', // IR 주주현황 조회
      irFinanceDetail: base + '/my/company/ir/financial/detail', // IR 재무정보 조회
      irExtraInfoDetail: base + '/my/company/ir/extrainfo/detail', // IR 제품/기술/시장 정보 조회
      irPlanDetail: base + '/my/company/ir/plan/detail', //IR 성과 및 계획 정보 조회
      irHistoryGroupList: base + '/my/company/ir/history/group/list', // (조회용 조회)
      memberList: base + '/my/company/member/list', // 팀원정보 조회
      introMediaList: base + '/my/company/intro/media/list', // 소개영상 등록/수정
      investHopeDetail: base + '/my/company/invest/hope/detail', // 투자희망 조회
      productList: base + '/my/company/product/list', // 주요 제품 리스트
      productDetail: base + '/my/company/product/detail', // 주요 제품 상세
      productDelete: base + '/my/company/product/delete', // 주요 제품 삭제
      auditRequestList: base + '/my/company/audit/request/list', // 대쉬보드 - 보낸 투자 심사 요청 목록 조회
      auditSuggestList: base + '/my/company/audit/suggest/list', // 대쉬보드 - 받은 투자 심사 요청 목록 조회
      auditReceiveList: base + '/my/company/audit/receive/list', // 받은 투자 심사 요청 목록 조회
      auditSendList: base + '/my/company/audit/send/list', // 보낸 투자 심사 요청 목록 조회
      auditSendCount: base + '/my/company/audit/send/count', // 진행중 보낸투자심사요청 개수 조회
      auditDetail: base + '/my/company/audit/detail', // 투자심사정보조회
      auditProgress: base + '/my/company/audit/progress', // 투자심사진행도조회
      auditIrPreview: base + '/my/company/audit/request/ir/preview', // IR자료미리보기정보조회
      auditIrAgreementSave: base + '/my/company/audit/ir/agreement/save', // 자동갱신 약관 동의여부 저장
      auditRequestCancel: base + '/my/company/audit/request/cancel', //
      messageReceiveList: base + '/my/company/message/receive/list', // 받은메시지목록조회
      messageSendList: base + '/my/company/message/send/list', // 보낸메시지목록조회
      messageCount: base + '/my/company/message/count', // 메시지카운트조회
      recommendVcList: base + '/my/company/recommend/vc/list', // 추천투자사목록조회
      messageRecentList: base + '/my/company/message/recent/list', // 최근메시지목록조회
      messageReceiveCount: base + '/my/company/message/receive/count', // 받은메시지카운트조회
      messageReply: base + '/my/company/message/reply', // 메시지 답변하기
      basicInfoDetail: base + '/my/company/basic/info/detail', // 기본정보 조회
      basicInfoSave: base + '/my/company/basic/info/save', // 기본정보 등록/수정
      banner: base + '/my/company/banner', // 기업 마이페이지 대시보드 배너 조회

      convert: base + '/my/company/vc/convert/request', // 투자사 전환 요청
      invmCnvrsRegSave: base + '/my/company/vc/convert/invmCnvrsRegSave', // 투자사 전환 요청 정보 등록
      convertCheckRequest: base + '/my/company/vc/convert/check/request', // 진행중 투자사 전환 요청건 확인
      convertCheckResult: base + '/my/company/vc/convert/check/result', // 투자사 전환 요청 반려 확인

      kiprisTabTotal: base + '/my/company/kipris/tab/total', // 기업 마이페이지 내정보 보유지적재산권 탭별 총계 조회
      kiprisIpList: base + '/my/company/kipris/ip/list', // 기업 마이페이지 내정보 보유지적재산권 IP 리스트 조회
      kiprisTrademarkList: base + '/my/company/kipris/trademark/list', // 기업 마이페이지 내정보 보유지적재산권 상표 리스트 조회
      kiprisDesignList: base + '/my/company/kipris/design/list', // 기업 마이페이지 내정보 보유지적재산권 디자인 리스트 조회

      ndaReceiveList: base + '/my/company/nda/receive/list', // 마이페이지 (기업) > NDA > 보낸 NDA 목록 조회
      ndaSendList: base + '/my/company/nda/send/list', // 마이페이지 (기업) > NDA > 보낸 NDA 목록 조회
      ndaRgistFormInttData: base + '/my/company/nda/regist/form/intt', // 마이페이지 (기업) > NDA > NDA 체결 등록 이용기관 기본 설정 정보 조회
      ndaContractDetail: base + '/my/company/nda/contract/detail', // 마이페이지 (기업) > NDA > NDA 상세 조회
      ndaTargetList: base + '/my/company/nda/target/list', // 기업 마이페이지 NDA 대상 이용기관 리스트 조회
      ndaSubmit: base + '/my/company/nda/submit', // 마이페이지 (기업) > NDA > NDA 제출
      ndaContractSign: base + '/my/company/nda/contract/sign', // 기업 마이페이지 NDA 최종 서명 체결
      ndaContractCancel: base + '/my/company/nda/contract/cancel', // 기업 마이페이지 NDA 반려

      seal: base + '/my/company/seal', // 기업 마이페이지 내정보 인감 조회
      sealSave: base + '/my/company/seal/save' // 기업 마이페이지 내정보 인감 등록/수정
    },
    vc: {
      auditRequestList: base + '/my/vc/audit/request/list', // 대쉬보드 - 받은 투자 심사 요청 목록 조회
      auditSuggestList: base + '/my/vc/audit/suggest/list', // 대쉬보드 - 보낸 투자 심사 요청 목록 조회
      auditReceiveList: base + '/my/vc/audit/receive/list', // 받은 투자 심사 요청 목록 조회
      auditSendList: base + '/my/vc/audit/send/list', // 보낸 투자 심사 요청 목록 조회
      basicInfoDetail: base + '/my/vc/basic/info/detail', // 기본정보조회
      basicInfoSave: base + '/my/vc/basic/info/save', // 기본정보 등록/수정
      portfolioInvestList: base + '/my/vc/portfolio/invest/list', //포트폴리오 투자목록조회
      portfolioSave: base + '/my/vc/portfolio/save', // 포트폴리오 등록/수정
      memberList: base + '/my/vc/member/list', // 대표심사역 목록 조회
      memberSave: base + '/my/vc/member/save', // 대표심사역 등록/수정
      operationReportList: base + '/my/vc/orrp/list', // 투자 운용 리포트 목록 조회
      operationReportSave: base + '/my/vc/orrp/save', // 투자 운용 리포트 등록/수정
      auditListExcelDown: base + '/my/vc/audit/excel/list', // 받은요청, 보낸요청 리스트 엑셀 다운로드
      auditDetailExcelDown: base + '/my/vc/audit/excel/detail', // 받은요청, 보낸요청 세부내용 엑셀 다운로드
      updateRecommend: base + '/my/vc/audit/recommend/save', // 추천직원 및 영업점 수정

      auditDetail: base + '/my/vc/audit/detail', //투자심사요청 정보 조회
      auditProgress: base + '/my/vc/audit/progress', // 투자심사진행도조회
      auditMessageList: base + '/my/vc/audit/message/list', // 메시지목록조회
      auditMessageDetail: base + '/my/vc/audit/message/detail', // 메시지 정보 조회
      auditMessageSend: base + '/my/vc/audit/message/send', // 메시지보내기
      auditMessageReply: base + '/my/vc/audit/message/reply', // 메시지답변하기
      auditIrPreview: base + '/my/vc/audit/ir/preview', // IR자료미리보기정보조회
      weblinkList: base + '/my/vc/weblink/list', // 투자사전용페이지목록조회
      webLinkDelete: base + '/my/vc/weblink/delete', // 투자사전용페이지 삭제
      webLinkDetail: base + '/my/vc/weblink/detail', // 투자사전용페이지수정화면조회
      webLinkSave: base + '/my/vc/weblink/save', // 투자사전용페이지 등록/수정
      auditEvaluateProgress: base + '/my/vc/audit/evaluate/progress', // 투자심사진행
      auditEvaluateComplete: base + '/my/vc/audit/evaluate/complete', // 투자심사완료
      messageReceiveList: base + '/my/vc/message/receive/list', // 받은메시지목록조회
      messageSendList: base + '/my/vc/message/send/list', // 보낸메시지목록조회
      messageCount: base + '/my/vc/message/count', // 메시지카운트조회
      messageDetail: base + '/my/vc/message/detail', // 메시지상세조회
      messageReadAll: base + '/my/vc/message/read/all', // 메시지전체읽음요청
      messageList: base + '/my/vc/message/recent/list', //  대쉬보드 메시지 리스트
      messageRecentList: base + '/my/vc/message/recent/list', // 최근메시지목록조회
      recommendCompanyList: base + '/my/vc/recommend/company/list', // 추천기업목록조회
      messageReply: base + '/my/vc/message/reply', // 메시지 답변하기
      messageReceiveCount: base + '/my/vc/message/receive/count', // 받은메시지카운트조회
      banner: base + '/my/vc/banner', // 투자사 마이페이지 대시보드 배너 조회

      convertCheckResult: base + '/my/vc/convert/check/result', // 투자사 전환 승인 확인

      ndaReceiveList: base + '/my/vc/nda/receive/list', // 마이페이지 (기업) > NDA > 보낸 NDA 목록 조회
      ndaSendList: base + '/my/vc/nda/send/list', // 마이페이지 (기업) > NDA > 보낸 NDA 목록 조회
      ndaRgistFormIntt: base + '/my/vc/nda/regist/form/intt', // 마이페이지 (기업) > NDA > NDA 체결 등록 이용기관 기본 설정 정보 조회
      ndaContractDetail: base + '/my/vc/nda/contract/detail', // 마이페이지 (기업) > NDA > NDA 상세 조회
      ndaTargetList: base + '/my/vc/nda/target/list', // 기업 마이페이지 NDA 대상 이용기관 리스트 조회
      ndaSubmit: base + '/my/vc/nda/submit', // 마이페이지 (기업) > NDA > NDA 제출
      ndaContractSign: base + '/my/vc/nda/contract/sign', // 투자사 마이페이지 NDA 최종 서명 체결
      ndaContractCancel: base + '/my/vc/nda/contract/cancel', // 투자사 마이페이지 NDA 반려

      seal: base + '/my/vc/seal', // 기업 마이페이지 내정보 인감 조회
      sealSave: base + '/my/vc/seal/save' // 기업 마이페이지 내정보 인감 등록/수정
    }
  },
  support: {
    noticeList: base + '/support/notice/list', // 공지사항 리스트 조회
    noticeDetail: base + '/support/notice/detail', // 공지사항 상세 조회
    qaList: base + '/support/qa/list', // Q&A 리스트 조회
    qaDetail: base + '/support/qa/detail', // Q&A 상세 조회
    qaSave: base + '/support/qa/save', // Q&A 등록
    qaCancel: base + '/support/qa/cancel' // Q&A 취소
  },
  fund: {
    fundList: base + '/fund/list', // 펀드제안 이력 조회
    loadFundList: base + '/fund/load/list', // 펀드제안 이력 조회
    fundPrplInfoSave: base + '/fund/info/save', // 펀드제안 step1 저장
    fundOpcmInfoSave: base + '/fund/opcm/save', // 펀드제안 step2 저장
    fundPrplInfoView: base + '/fund/info/detail', // 펀드제안 step1 상세보기
    fundOpcmlInfoView: base + '/fund/opcm/detail', // 펀드제안 step2 상세보기
    fundPrplInfoCancle: base + '/fund/cancle', // 제안 취소
    fundCopy: base + '/fund/copy', // 펀드제안 복사본 만들기
    fundPrplInfoReply: base + '/fund/message/view', // 펀드제안 step3 답변보기
    fundIrStockExcel: base + '/fund/excel/download', // 양식 다운로드
    fundExcelUpload: base + '/fund/excel/upload' // 엑셀 업로드
  },
  ibkPrplCntr: {
    prplCmList: base + '/prplcm/list', //IBK제안센터 투자기업 추천리스트
    prplCmDetail: base + '/prplcm/detail', //IBK제안센터 투자기업 상세
    prplCmWrite: base + '/prplcm/save', //IBK제안센터 투자기업 등록
    prplCmCancel: base + '/prplcm/cancel', //IBK제안센터 투자기업 추천 이력 추천 취소
    rcmdEnprListView: base + '/prplcm/rcmdEnprList' //IBK제안센터 IBK 추천기업 리스트
  },
  vncmloan: {
    prplSave: base + '/vncmloan/prpl/save', // 공지사항 리스트 조회
    prplList: base + '/vncmloan/prpl/list', // 벤처대출추천내역조회
    prplDetail: base + '/vncmloan/prpl/detail', // 벤처대출추천내역조회
    prplInvestList: base + '/vncmloan/prpl/invest/list', // 벤처대출추천 투자유치명세 조회
    aplcList: base + '/vncmloan/aplc/list', // 벤처대출신청내역조회
    aplcSave: base + '/vncmloan/aplc/save', // 벤처대출신청내역조회
    aplcDetail: base + '/vncmloan/aplc/detail', // 벤처대출신청내역조회
    aplcCancel: base + '/vncmloan/aplc/cancel', // 벤처대출신청내역조회
    aplcCount: base + '/vncmloan/aplc/count' // 벤처대출 추천 여부 및 자료요청 확인
  }
}

export default Api
