import Api from 'modules/consts/Api'
import CommonAxios from 'modules/utils/CommonAxios'
import { getPostConfig } from '../utils/CommonUtils'

// 메인배너 리스트
export const getBannerMainList = async () => {
  const res = await CommonAxios('BKB', getPostConfig(Api.books.booksBannerMainList))
  return res
}

// 메인배너 상세
export const getBannerMainDetail = async (id) => {
  if (!id || id.length === 0) return
  const res = await CommonAxios('BKB', getPostConfig(Api.books.booksBannerMainDetail, {bnnrSqn : id}))
  return res
}

// 메인배너 등록/수정
export const saveBannerMain = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
    const res = await CommonAxios('BKB', getPostConfig(Api.books.booksBannerMainSave, params))
    return res
}

// 메인배너 삭제
export const deleteBannerMain = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('BKB', getPostConfig(Api.books.booksBannerMainDelete, params))
  return res
}

// 메인배너 순서 변경
export const saveBannerMainOrder = async (params) => {
  if (!params || params.length < 1) return;
    const res = await CommonAxios('BKB', getPostConfig(Api.books.booksBannerMainSort, params))
    return res
}

// 광고배너 목록
export const getBannerAdList = async () => {
  const res = await CommonAxios('BKB', getPostConfig(Api.books.booksBannerAdList))
  return res
}

// 광고배너 상세
export const getBannerAdDetail = async (id) => {
  if (!id || id.length === 0) return
  const res = await CommonAxios('BKB', getPostConfig(Api.books.booksBannerAdDetail, {bnnrSqn: id}))
  return res
}

// 광고배너 등록/수정
export const saveBannerAd = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('BKB', getPostConfig(Api.books.booksBannerAdSave, params))
  return res
}

// 광고배너 삭제
export const deleteBannerAd = async (params) => {
  if (!params || Object.keys(params).length < 1) return;
  const res = await CommonAxios('BKB', getPostConfig(Api.books.booksBannerAdDelete, params))
  return res
}

// 광고배너 순서 변경
export const saveBannerAdOrder = async (params) => {
  if (!params || params.length < 1) return;
  const res = await CommonAxios('BKB', getPostConfig(Api.books.booksBannerAdSort, params))
  return res
}

// 회원 목록
export const getUserList = async (params) => {
  if (params) {
    const res = await CommonAxios('BKB', getPostConfig(Api.books.booksUserList, params))
    return res
  } else {
    const res = await CommonAxios('BKB', getPostConfig(Api.books.booksUserList))
    return res
  }
}

// 회원 목록 엑셀 다운로드
export const downloadUserExcel = async (params) => {
  if (params) {
    const res = await CommonAxios('BKB', getPostConfig(Api.books.booksUserExcelDownload, params))
    return res
  } else {
    const res = await CommonAxios('BKB', getPostConfig(Api.books.booksUserExcelDownload))
    return res
  }
}

// 회원 상세
export const getUserDetail = async (id) => {
  if (!id || id.length === 0) return
  const res = await CommonAxios('BKB', getPostConfig(Api.books.booksUserDetail, { utlinsttId: id}))
  return res
}

// 회원 상세 수금BOX 장부 목록
export const getUserBooksList = async (params) => {
  if (params) {
    const res = await CommonAxios('BKB', getPostConfig(Api.books.booksUserBooksList, params))
    return res
  } else {
    const res = await CommonAxios('BKB', getPostConfig(Api.books.booksUserBooksList))
    return res
  }
}

// 회원 상세 수금BOX 장부 상세
export const getUserBooksDetail = async (utlinsttId, trnDlstId) => {
  const res = await CommonAxios('BKB', getPostConfig(Api.books.booksUserBooksDetail, {utlinsttId: utlinsttId, trnDlstId: trnDlstId}))
  return res
}

// 회원 상세 커머스BOX 장부 목록
export const getUserCommerceList = async (params) => {
  if (params) {
    const res = await CommonAxios('BKB', getPostConfig(Api.books.booksUserCommerceList, params))
    return res
  } else {
    const res = await CommonAxios('BKB', getPostConfig(Api.books.booksUserCommerceList))
    return res
  }
}

// 회원 상세 커머스BOX 장부 상세
export const getUserCommerceDetail = async (loginUtlinsttId, ordnInfoId) => {
  const res = await CommonAxios('BKB', getPostConfig(Api.books.booksUserCommerceDetail , {loginUtlinsttId: loginUtlinsttId, ordnInfoId: ordnInfoId}))
  return res
}

// 추심신청 상태별 합계 정보
export const getCollectionDashboard = async () => {
  const res = await CommonAxios('BKB', getPostConfig(Api.books.booksCollectionInfo))
  return res
}

// 추심신청 목록
export const getCollectionList = async (params) => {
  if (params) {
    const res = await CommonAxios('BKB', getPostConfig(Api.books.booksCollectionList, params))
    return res
  } else {
    const res = await CommonAxios('BKB', getPostConfig(Api.books.booksCollectionList))
    return res
  }
}

// 추심신청 상세
export const getCollectionDetail = async ({ utlinsttId, clctAplcId } ) => {
  const res = await CommonAxios('BKB', getPostConfig(Api.books.booksCollectionDetail,{utlinsttId: utlinsttId, clctAplcId: clctAplcId} ))
  return res
}

// 추심신청 상태 변경
export const saveCollectionState = async (params) => {
  if (params) {
    const res = await CommonAxios('BKB', getPostConfig(Api.books.booksCollectionUpdate, params))
    return res
  } else {
    const res = await CommonAxios('BKB', getPostConfig(Api.books.booksCollectionUpdate))
    return res
  }
}

// 대시보드 정보 조회
export const getDashboardCount = async () => {
  const res = await CommonAxios('BKB', getPostConfig(Api.books.booksDashboardInfo))
  return res
}

// 대시보드 기간별 가입자 수
export const getDashboardJoined = async (params) => {
  if (params) {
    const res = await CommonAxios('BKB', getPostConfig(Api.books.booksDashboardUserCount, params))
    return res
  } else {
    const res = await CommonAxios('BKB', getPostConfig(Api.books.booksDashboardUserCount))
    return res
  }
}
