import Api from 'modules/consts/Api'
import CommonAxios from 'modules/utils/CommonAxios'
import { getPostConfig } from '../utils/CommonUtils'


/** ---------------------------------------------
 *    배너관리 (거래처채팅, 더보기, 카드한도조회, 서비스, PC화면배너)
 --------------------------------------------- */
// 배너관리 - 목록
export const getBannerList = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.bannerList, params))
  return res
}

// 배너관리 - 순서 변경
export const saveBannerOrder = async (params) => {
  if (!params || params.length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.bannerSort, params))
  return res
}

// 배너관리 - 상세
export const getBannerDetail = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.bannerDetail, params))
  return res
}

// 배너관리 - 등록/수정
export const saveBanner = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.bannerSave, params))
  return res
}

// 배너관리 - 삭제
export const deleteBanner = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.bannerDelete, params))
  return res
}


/** ---------------------------------------------
 *    더보기메뉴관리 > 링크메뉴 설정
 --------------------------------------------- */
// 더보기메뉴관리 > 링크메뉴 설정 > 목록
export const getMoreLinkList = async () => {
  const res = await CommonAxios('MNB', getPostConfig(Api.main.moreLinkList))
  return res
}

// 더보기메뉴관리 > 링크메뉴 설정 > 상세
export const getMoreLinkDetail = async (id) => {
  if (!id || id.length === 0) return
  const res = await CommonAxios('MNB', getPostConfig(Api.main.moreLinkDetail, { id: id }))
  return res
}

// 더보기메뉴관리 > 링크메뉴 설정 > 등록/수정
export const saveMoreLink = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.moreLinkSave, params))
  return res
}

/** ---------------------------------------------
 *    더보기메뉴관리 > 카드이미지 등록
 --------------------------------------------- */
// 더보기메뉴관리 > 카드이미지등록 목록
export const getMoreCreditCardImageList = async (params) => {
  const res = await CommonAxios('MNB', getPostConfig(Api.main.moreCreditCardImageList, params))
  return res
}

// 더보기메뉴관리 > 카드이미지등록 상세
export const getMoreCreditCardImageDetail = async (id) => {
  if (!id || id.length === 0) return
  const res = await CommonAxios('MNB', getPostConfig(Api.main.moreCreditCardImageDetail, { crccCd: id }))
  return res
}

// 더보기메뉴관리 > 카드이미지등록 수정
export const saveMoreCreditCardImage = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.moreCreditCardImageSave, params))
  return res
}


/** ---------------------------------------------
 *    서비스메뉴관리 (이벤트, 금융서비스, 유용한혜택)
 --------------------------------------------- */
// 서비스메뉴관리 - 이벤트 > 목록
export const getServiceEventList = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.serviceEventList, params))
  return res
}

// 서비스메뉴관리 - 이벤트 > 상세
export const getServiceEventDetail = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.serviceEventDetail, params))
  return res
}

// 서비스메뉴관리 - 이벤트 > 등록/수정
export const saveServiceEvent = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.serviceEventSave, params))
  return res
}

// 서비스메뉴관리 - 이벤트 > 삭제
export const deleteServiceEvent = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.serviceEventDelete, params))
  return res
}


// 서비스메뉴관리 - 금융서비스 > 목록
export const getServiceFinanceList = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.serviceFinanceList, params))
  return res
}

// 서비스메뉴관리 - 금융서비스 > 상세
export const getServiceFinanceDetail = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.serviceFinanceDetail, params))
  return res
}

// 서비스메뉴관리 - 금융서비스 > 등록/수정
export const saveServiceFinance = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.serviceFinanceSave, params))
  return res
}


// 서비스메뉴관리 - 금융서비스 > 삭제
export const deleteServiceFinance = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.serviceFinanceDelete, params))
  return res
}

// 서비스메뉴관리 - 유용한혜택 > 목록
export const getServiceBenefitList = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.serviceBenefitList, params))
  return res
}

// 서비스메뉴관리 - 유용한혜택 > 상세
export const getServiceBenefitDetail = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.serviceBenefitDetail, params))
  return res
}

// 서비스메뉴관리 - 유용한혜택 > 등록/수정
export const saveServiceBenefit = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.serviceBenefitSave, params))
  return res
}

// 서비스메뉴관리 - 유용한혜택 > 삭제
export const deleteServiceBenefit = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.serviceBenefitDelete, params))
  return res
}


/** ---------------------------------------------
 *    고객센터관리 > 공지사항
 --------------------------------------------- */
export const getCsNoticeList = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.csNoticeList, params))
  return res
}

export const getCsNoticeDetail = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.csNoticeDetail, params))
  return res
}

export const saveCsNotice = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.csNoticeSave, params))
  return res
}

export const deleteEachCsNotice = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.csNoticeEachDelete, params))
  return res
}

export const deleteMultiCsNotice = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.csNoticeMultiDelete, params))
  return res
}


/** ---------------------------------------------
 *    고객센터관리 > FAQ(자주하는질문)
 --------------------------------------------- */
export const getCsFaqList = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.csFaqList, params))
  return res
}

export const getCsFaqDetail = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.csFaqDetail, params))
  return res
}

export const saveCsFaq = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.csFaqSave, params))
  return res
}

export const deleteEachCsFaq = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.csFaqEachDelete, params))
  return res
}

export const deleteMultiCsFaq = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.csFaqMultiDelete, params))
  return res
}

export const getCsFaqCategoryList = async () => {
  const res = await CommonAxios('MNB', getPostConfig(Api.main.csFaqCategoryList))
  return res
}

export const deleteCsFaqCategory = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.csFaqCategoryDelete, params))
  return res
}

export const getCsFaqCategoryEditList = async (params) => {
  const res = await CommonAxios('MNB', getPostConfig(Api.main.csFaqCategoryEditList))
  return res
}

export const reorderCsFaqCategory = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.csFaqCategoryOrder, params))
  return res
}

export const saveCsFaqCategory = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.csFaqCategorySave, params))
  return res
}


/** ---------------------------------------------
 *    전자문서함관리 > 전송꾸러미 설정
 --------------------------------------------- */
// 전송꾸러미 설정 - 목록
export const getDocumentPackageList = async () => {
  const res = await CommonAxios('MNB', getPostConfig(Api.main.documentPackageList))
  console.log('[getDocumentPackageList]', res)
  return res
}

// 전송꾸러미 설정 - 순서 변경
export const saveDocumentPackageOrder = async (params) => {
  if (!params || params.length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.documentPackageSort, params))
  return res
}

// 전송꾸러미 설정 - 상세
export const getDocumentPackageDetail = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.documentPackageDetail+'/'+params.id))
  return res
}

// 전송꾸러미 설정 - 등록/수정
export const saveDocumentPackage = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.documentPackageSave, params))
  return res
}

// 전송꾸러미 설정 - 등록/수정
export const updateDocumentPackage = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.documentPackageUpdate, params))
  return res
}

// 전송꾸러미 설정 - 삭제
export const deleteDocumentPackage = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.documentPackageDelete, params))
  return res
}


/** ---------------------------------------------
 *    회원사관리
 --------------------------------------------- */
// 회원사관리 - 목록
export const getMemberBoxMemberList = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.memberBoxMemberList, params))
  return res
}

// 회원사관리 - 목록 - 클럽인증 코드
export const getMemberClubCodeList = async () => {
  const res = await CommonAxios('MNB', getPostConfig(Api.main.memberClubCodeList))
  return res
}

// 회원사관리 - 목록 - 벤처인증 코드
export const getMemberVentureCodeList = async () => {
  const res = await CommonAxios('MNB', getPostConfig(Api.main.memberVentureCodeList))
  return res
}

// 회원사관리 - 상세 - 조회
export const getMemberDetail = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.memberBoxMemberDetail, params))
  return res
}

// 회원사관리 - 상세 - 저장
export const saveMemberBadge = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.memberBoxMemberSave, params))
  return res
}


/** ---------------------------------------------
 *    약관관리 > 회원가입
 --------------------------------------------- */

/** ---------------------------------------------
 *    약관관리 > 개인정보처리방침
 --------------------------------------------- */
// ibk box 이용약관
export const saveIBKBOXServiceTerms = async () => {
  const res = await CommonAxios('MNB', getPostConfig(Api.main.termsService))
  return res
}
// 신용정보활용체제
export const saveIBKBOXCreditTerms = async () => {
  const res = await CommonAxios('MNB', getPostConfig(Api.main.termsCredit))
  return res
}
// 개인정보처리방침
export const saveIBKBOXPersonalTerms = async () => {
  const res = await CommonAxios('MNB', getPostConfig(Api.main.termsPersonal))
  return res
}

export const saveTerms = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('MNB', getPostConfig(Api.main.saveTerms, params))
  return res
}



/** ---------------------------------------------
 *    대시보드
 --------------------------------------------- */
export const getDashboardTodayCount = async () => {
  const res = await CommonAxios('MNB', getPostConfig(Api.main.statisticsCount))
  return res
}


// 대시보드 사용자 현황 통계
export const getDashboardUser = async (params) => {
  if (params) {
    const res = await CommonAxios('MNB', getPostConfig(Api.main.statisticsUser, params))
    return res
  } else {
    const res = await CommonAxios('MNB', getPostConfig(Api.main.statisticsUser))
    return res
  }
}

//기간별 분석
export const getDashboardPeriod = async (params) => {
  if (params) {
    const res = await CommonAxios('MNB', getPostConfig(Api.main.statisticsPeriod, params))
    return res
  } else {
    const res = await CommonAxios('MNB', getPostConfig(Api.main.statisticsPeriod))
    return res
  }
}



