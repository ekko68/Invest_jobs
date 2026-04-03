export const Page1DepthLabels = {
  Company: '기업정보',
  Invest: '투자기관',
  Consult: '컨설팅',
  News: '뉴스',
  MyPage: '마이페이지',
  CustomerSupport: '고객지원',
  IbkPrplCntr: 'IBK 제안센터',
  Pub: 'IBK 제안센터(pub)'
}

export const Page2DepthLabels = {
  Company: '기업 목록',
  CompanyDetail: '기업 상세보기',
  CompanyRequest: '투자 심사 요청',
  Invest: '투자자',
  InvestDetail: '투자자 상세보기',
  InvestSupport: '온라인 투자 지원',
  Consult: '컨설팅 신청목록',
  ConsultApplication: '컨설팅 신청',
  News: '뉴스 목록',
  MyPage: '대시보드',
  MyPageInfo: '내 정보',
  MyPageRequest: '투자 심사 요청',
  MyPageExclusive: '투자사 전용',
  MyPageIr: 'IR 작성',
  MyPageConsult: '컨설팅',
  MyPageNda: 'NDA',
  MyPageMessage: '메시지',
  MyPageInvmCnvrsReg: '투자사전환 요청',
  MyPageVnenrLon: 'IBK 벤처대출 신청',
  Logout: '로그아웃',
  Notice: '공지사항',
  Qa: 'Q&A',
  IbkVnentlonSgsh: 'IBK 벤처대출 추천',
  FundPrpl: '펀드 제안',
  PrplCm: '투자기업 추천',
  RcmdEnprList: 'IBK추천기업 리스트'
}

export const IrLabels = {
  basicInfo: 'IR기본정보',
  history: '주요연혁',
  worker: '주요인력',
  stock: '주주현황',
  finance: '재무정보',
  prodTechMarket: '제품/기술/시장',
  resultPlans: '성과 및 계획 '
}

export const StatusLabels = {
  all: '전체',
  approval: '완료',
  wait: '대기',
  complete: '결과보기',
  cancel: '기간만료'
}

export const AlertLabels = {
  saved: '저장되었습니다.',
  notSaved: '저장되지 않았습니다. 관리자에게 문의하세요.',
  noData: '데이타가 없습니다.',
  noInput: '입력된 내용이 없습니다.',
  emptyValueInData: '데이타 중 빈 값이 있습니다.',
  saveIt: '저장 하시겠습니까?',
  addShareholderStatus: '주주현황을 추가하세요.',
  inputShareholderStatus: '주주현황을 입력하세요.',
  hasContentSave: '입력된 내용이 있습니다. 저장 하시겠습니까?',
  doNotSaveMove: '입력되지 않은 내용이 있습니다. 저장하지 않고 이동 하시겠습니까?',
  askEditSaveBeforeCancel: '작성을 취소합니다.<br/> 편집내용을 저장 하시겠습니까?',
  noChange: '변경된 내용이 없습니다.',
  noMoreData: '데이타가 더이상 없습니다.',
  inputContent: '내용을 입력하세요.',
  inputData: '데이타를 입력하세요',
  deleted: '삭제 되었습니다',
  canceled: '취소 되었습니다',
  notSaveMove: '저장하지 않고 이동 하시겠습니까?',
  askCancel: '취소 하시겠습니까?',
  askDelete: '삭제 하시겠습니까?',
  notDeleted: '삭제 중 오류가 발생 하였습니다. 관리자에게 문의하세요.',
  askAdmin: '오류가 발생 하였습니다. 관리자에게 문의 해주세요.',
  isPrivate: '비공개 글입니다.',
  prplcmCancel: '제출 완료된 투자기업 추천을<br/>정말 취소하시겠습니까?',
  prplcmWriteCancel: '투자기업 추천이 완료되지 않았습니다.<br/>추천을 그만 하시겠습니까?',
  vnentrLonSgshContinue:
    '대출 추천하신 기업이 직접 IBK 투자도<br/>받을 수 있도록 투자 추천을 함께<br/>진행 하시겠습니까?',
  vnentrLonSgshCancel: '대출 추천서 작성이 완료되지 않았습니다. 작성을 그만 하시겠습니까?'
}

export const UsisType = {
  COMPANY: 'COM',
  INVESTOR: 'VC'
}

export const UserAuth = {
  CEO: 'C',
  MANAGER: 'M',
  USER: 'U'
}

export const CprSe = {
  CORPORATION: '0001',
  INDIVIDUAL: '0002'
}

export const ListType = {
  RECEIVE: 'RECEIVE',
  SEND: 'SEND'
}

export const RequestStatusLabels = {
  SUGGEST: '제안',
  REQUEST: '요청',
  EVALUATE: '심사중',
  COMPLETE: '심사완료',
  EXPIRED: '기간만료',
  CANCEL: '요청취소'
}

export const RequestStatusCodeLabels = {
  SUGGEST: 'EXN00000',
  REQUEST: 'EXN00001',
  EVALUATE: 'EXN00002',
  COMPLETE: 'EXN00003',
  EXPIRED: 'EXN00004',
  CANCEL: 'EXN00005'
}

export const ConsultStatusCode = {
  READY: 'CNS01000', // 대기
  COMPLETE: 'CNS01001', // 완료
  CANCEL: 'CNS01002' // 취소
}

export const QnaStatusCode = {
  READY: 'SQA00000', // 대기
  COMPLETE: 'SQA00001', // 완료
  CANCEL: 'SQA00002' // 취소
}

export const NdaLabels = {
  READY: '대기',
  APPROVAL: '체결',
  CANCEL: '미체결'
}

export const NdaCodeLabels = {
  READY: 'NDA00000',
  APPROVAL: 'NDA00001',
  CANCEL: 'NDA00002'
}

export const NdaSignTypeCode = {
  DSMS_SIGN: '01',
  RCV_SIGN: '02',
  COMPLETE: '03'
}

export const PopupApiStatus = {
  SUCCESS: 'success',
  ERROR: 'error'
}

export const BizStatusCode = {
  LOGIN_SESSION_OUT: 'BIZ0000',
  LIMIT_COUNT_OVER: 'BIZ0001',

  OUT_OF_SEARCH_PERIOD: 'BIZ0002',
  READY_APPROVAL: 'BIZ0003',
  NOT_AVAILABLE_STEP: 'BIZ0004',

  TCB_UNQUALIFIED: 'BIZ1000',
  ONGOING_AUDIT: 'BIZ1001',
  OUT_OF_AUDIT_REQUEST_PERIOD: 'BIZ1002'
}

/**
 * 벤처대출 추천상태
 */
export const RecVncmloanStatus = {
  RECOMMEND_COMPLETE: '추천완료',
  REQUEST_SUPPLEMENT: '보완요청(VC)',
  CORRECT_SUPPLEMENTARY_DATA: '보완수정제출(VC)',
  REQUEST_DATA: '자료 요청(기업)'
}
export const RecVncmloanCode = {
  RECOMMEND_COMPLETE: 'RST01001',
  REQUEST_SUPPLEMENT: 'RST01002',
  CORRECT_SUPPLEMENTARY_DATA: 'RST01003',
  REQUEST_DATA: 'RST01004'
}

/**
 * 벤처대출 신청상태 기업
 */
export const VncmloanStatus = {
  DATA_REQUEST: '자료요청',
  LOAN_APPLICATION: '대출접수',
  SUPPLEMENTARY_DATA_REQUEST: '보완자료요청',
  SUPPLEMENTARY_DATA_SUBMIT: '보완자료제출',
  EVALUATE: '심사중',
  LOAN_APPROVE: '대출승인',
  LOAN_CANCEL: '대출거절'
}
export const VncmloanCode = {
  DATA_REQUEST: 'RST01004',
  LOAN_APPLICATION: 'RST02001',
  SUPPLEMENTARY_DATA_REQUEST: 'RST02002',
  SUPPLEMENTARY_DATA_SUBMIT: 'RST02003',
  EVALUATE: 'RST02004',
  LOAN_APPROVE: 'RST02005',
  LOAN_CANCEL: 'RST02006'
}

/**
 * invest api SortTypeEnum과 맞출것
 */
export const CompanyListSortType = {
  SORT_DEFAULT: 'default',
  SORT_RANDOM: 'random',
  SORT_PREFERENCE: 'preference'
}

export const SelCmmId = {
  ALL: 'All'
}

export const CheckYn = {
  YES: 'Y',
  NO: 'N'
}

export const FileUploadSizeOpt = {
  DEFAULT: { name: '100MB', size: 100 * 1024 * 1024 },
  FIFTY_MB: { name: '50MB', size: 50 * 1024 * 1024 }
}

export const FileUploadExtOpt = {
  LICENSE: { str: '.jpg, .jpeg, .png, .pdf', list: ['.jpg', '.jpeg', '.png', '.pdf'] },
  IMAGE: { str: '.jpg, .jpeg, .png, .gif', list: ['.jpg', '.jpeg', '.png', '.gif'] },
  IMAGE_WITHOUT_GIF: { str: '.jpg, .jpeg, .png', list: ['.jpg', '.jpeg', '.png'] },
  DOC: {
    str: '.ppt, .pptx, .doc, .docx, .pdf, .hwp, .xlsx',
    list: ['.ppt', '.pptx', '.doc', '.docx', '.pdf', '.hwp', '.xlsx']
  },
  MSG_DOC: {
    str: '.ppt, .pptx, .doc, .docx, .pdf, .hwp, .zip',
    list: ['.ppt', '.pptx', '.doc', '.docx', '.pdf', '.hwp', '.zip']
  },
  PDF: { str: '.pdf', list: ['.pdf'] },
  ALL: { str: '', list: [] }
}

Object.freeze([
  Page1DepthLabels,
  Page2DepthLabels,
  IrLabels,
  StatusLabels,
  AlertLabels,
  UsisType,
  CprSe,
  ListType,
  RequestStatusLabels,
  RequestStatusCodeLabels,
  ConsultStatusCode,
  QnaStatusCode,
  NdaLabels,
  NdaCodeLabels,
  NdaSignTypeCode,
  PopupApiStatus,
  BizStatusCode,
  CompanyListSortType,
  SelCmmId,
  CheckYn,
  FileUploadSizeOpt, // object라 정확히 freeze는 되지 않음
  FileUploadExtOpt // object라 정확히 freeze는 되지 않음
])
