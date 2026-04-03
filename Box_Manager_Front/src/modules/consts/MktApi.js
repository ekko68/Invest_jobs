import Api from 'modules/consts/Api'
import CommonAxios from 'modules/utils/CommonAxios'
import CommonAxiosV2 from 'modules/utils/CommonAxiosV2'
import { getConfig, getPostConfig, getPutConfig, getDeleteConfig } from '../utils/CommonUtils'
import { async } from 'regenerator-runtime'

/***** List */
export const getBannerCountApi = async () => {
  const res = await CommonAxios('MKT', getConfig(Api.mkt.bannerCount))
  return res
}

export const getBannerListApi = async (type, params) => {
  let url = ''
  type === 'mainBanner'
    ? (url = Api.mkt.mainBannerList)
    : type === 'subBanner'
    ? (url = Api.mkt.subBannerList)
    : type === 'prodBanner'
    ? (url = Api.mkt.prodBannerList)
    : (url = Api.mkt.eventBannerList)
  const res = params ? await CommonAxios('MKT', getConfig(url, params)) : await CommonAxios('MKT', getConfig(url))
  return res
}

export const getBannerListApiV2 = (type, params, callback, errorCallback) => {
  let url = ''
  type === 'mainBanner'
    ? (url = Api.mkt.mainBannerList)
    : type === 'subBanner'
    ? (url = Api.mkt.subBannerList)
    : type === 'prodBanner'
    ? (url = Api.mkt.prodBannerList)
    : type === 'companyBanner'
    ? (url = Api.mkt.companyBannerList)
    : (url = Api.mkt.eventBannerList)
  params
    ? CommonAxiosV2('MKT', getConfig(url, params), callback, errorCallback)
    : CommonAxiosV2('MKT', getConfig(url), callback, errorCallback)
}

export const getBannerOrderPopListApiV2 = (type, params, callback, errorCallback) => {
  let url = ''
  type === 'mainBanner'
    ? (url = Api.mkt.mainBannerOrderPopList)
    : type === 'companyBanner'
    ? (url = Api.mkt.companyBannerOrderPopList)
    : (url = Api.mkt.eventBannerOrderPopList)
  params
    ? CommonAxiosV2('MKT', getConfig(url, params), callback, errorCallback)
    : CommonAxiosV2('MKT', getConfig(url), callback, errorCallback)
}

export const getBannerDetailApi = (type, id) => {
  let url = ''
  type === 'mainBanner'
    ? (url = Api.mkt.mainBannerDetail)
    : type === 'subBanner'
    ? (url = Api.mkt.subBannerDetail)
    : type === 'prodBanner'
    ? (url = Api.mkt.prodBannerDetail)
    : type === 'companyBanner'
    ? (url = Api.mkt.companyBannerDetail)
    : (url = Api.mkt.eventBannerDetail)

  return CommonAxios('MKT', getConfig(url, { banInfId: id }))
}

export const saveBannerApi = async (type, params) => {
  let url = ''
  type === 'mainBanner'
    ? (url = Api.mkt.mainBannerSave)
    : type === 'subBanner'
    ? (url = Api.mkt.subBannerSave)
    : type === 'prodBanner'
    ? (url = Api.mkt.prodBannerSave)
    : (url = Api.mkt.eventBannerSave)

  if (url !== '') {
    const res = await CommonAxios('MKT', getPostConfig(url, params))
    return res
  }
}

export const saveBannerApiV2 = (type, params, callback, errorCallback) => {
  let url = ''
  type === 'mainBanner'
    ? (url = Api.mkt.mainBannerSave)
    : type === 'subBanner'
    ? (url = Api.mkt.subBannerSave)
    : type === 'prodBanner'
    ? (url = Api.mkt.prodBannerSave)
    : type === 'companyBanner'
    ? (url = Api.mkt.companyBannerSave)
    : (url = Api.mkt.eventBannerSave)
  if (url !== '') {
    return CommonAxiosV2('MKT', getPostConfig(url, params), callback, errorCallback)
  }
}
export const saveBannerOrderApi = (type, params, callback, errorCallback) => {
  let url = ''
  type === 'mainBanner'
    ? (url = Api.mkt.mainBannerOrderSave)
    : type === 'companyBanner'
    ? (url = Api.mkt.companyBannerOrderSave)
    : (url = Api.mkt.eventBannerOrderSave)
  if (url !== '') {
    return CommonAxiosV2('MKT', getPostConfig(url, params), callback, errorCallback)
  }
}

export const deleteBannerApi = async (type, params) => {
  let url = ''
  type === 'mainBanner'
    ? (url = Api.mkt.mainBannerDelete)
    : type === 'subBanner'
    ? (url = Api.mkt.subBannerDelete)
    : type === 'prodBanner'
    ? (url = Api.mkt.prodBannerDelete)
    : (url = Api.mkt.eventBannerDelete)

  if (url !== '') {
    const res = await CommonAxios('MKT', getPostConfig(url, [params]))
    return res
  }
}

export const deleteBannerApiV2 = (type, params, callback, errorCallback) => {
  let url = ''
  type === 'mainBanner'
    ? (url = Api.mkt.mainBannerDelete)
    : type === 'subBanner'
    ? (url = Api.mkt.subBannerDelete)
    : type === 'prodBanner'
    ? (url = Api.mkt.prodBannerDelete)
    : type === 'companyBanner'
    ? (url = Api.mkt.companyBannerDelete)
    : (url = Api.mkt.eventBannerDelete)

  if (url !== '') {
    return CommonAxiosV2('MKT', getPostConfig(url, params), callback, errorCallback)
  }
}

/* 검색어 조회 */
export const getSearchListApiV2 = (param, callback, errorCallback) => {
  const config = {
    method: 'get',
    url: Api.mkt.searchList
  }
  if (param) config.params = param
  CommonAxiosV2('MKT', config, callback, errorCallback)
}

/* 추천 검색 관리 */
export const getRecommendSearchListApiV2 = (param, callback, errorCallback) => {
  const config = {
    method: 'get',
    url: Api.mkt.recommendSearchList
  }
  if (param) config.params = param
  CommonAxiosV2('MKT', config, callback, errorCallback)
}

/* 인기 검색 관리 */
export const getPopularSearchListApiV2 = (param, callback, errorCallback) => {
  const config = {
    method: 'get',
    url: Api.mkt.popularSearchList
  }
  if (param) config.params = param
  CommonAxiosV2('MKT', config, callback, errorCallback)
}

/* 검색어 삭제 */
export const deleteSearchApiV2 = (params, callback, errorCallback) => {
  CommonAxiosV2('MKT', getPostConfig(Api.mkt.searchDelete, params), callback, errorCallback)
}

/* 검색 상태값 수정 */
export const updateToggleApiV2 = (params, callback, errorCallback) => {
  CommonAxiosV2('MKT', getPostConfig(Api.mkt.updateStatus, params), callback, errorCallback)
}

/* 상품목록 조회 */
export const getSearchProductListApiV2 = (param, callback, errorCallback) => {
  const config = {
    method: 'get',
    url: Api.mkt.productSearchList
  }
  if (param) config.params = param
  CommonAxiosV2('MKT', config, callback, errorCallback)
}

/* 상품목록 저장 */
export const saveSearchRecommendApiV2 = async (params, callback, errorCallback) => {
  CommonAxiosV2('MKT', getPostConfig(Api.mkt.searchRecommendSave, params), callback, errorCallback)
}

/* 검색어 상세 */
export const getRecommendSearchDetailApi = (id) => {
  let url = ''
  url = Api.mkt.searchRecommendDetail

  return CommonAxios('MKT', getConfig(url, { srwdInfId: id }))
}

/* 검색어 상품목록 삭제 */
export const deleteSearchProductApiV2 = (params, callback, errorCallback) => {
  CommonAxiosV2('MKT', getPostConfig(Api.mkt.searchProductDelete, params), callback, errorCallback)
}

export const saveSearchOrder = async (params) => {
  if (!params || params.length < 1) return
  const res = await CommonAxios('MKT', getPostConfig(Api.mkt.searchSortList, params))
  return res
}

/*** Popup */
export const getPopupListApi = async (param, callback, errorCallback) => {
  const config = {
    method: 'get',
    url: Api.mkt.mainPopupList
  }
  if (param) config.params = param
  const res = await CommonAxios('MKT', config, callback, errorCallback)
  return res
}

/*** Popup */
export const getPopupListApiV2 = (param, callback, errorCallback) => {
  const config = {
    method: 'get',
    url: Api.mkt.mainPopupList
  }
  if (param) config.params = param
  CommonAxiosV2('MKT', config, callback, errorCallback)
}

export const getPopupDetailApi = async (id) => {
  const res = await CommonAxios('MKT', getConfig(Api.mkt.mainPopupDetail, { popupInfId: id }))
  return res
}

export const savePopupApi = async (params) => {
  const res = await CommonAxios('MKT', getPostConfig(Api.mkt.mainPopupSave, params))
  return res
}

export const savePopupApiV2 = async (params, callback, errorCallback) => {
  CommonAxiosV2('MKT', getPostConfig(Api.mkt.mainPopupSave, params), callback, errorCallback)
}

export const deletePopupApi = async (params) => {
  const res = await CommonAxios('MKT', getPostConfig(Api.mkt.mainPopupDelete, [params]))
  return res
}

export const deletePopupApiV2 = (params, callback, errorCallback) => {
  CommonAxiosV2('MKT', getPostConfig(Api.mkt.mainPopupDelete, params), callback, errorCallback)
}

/*** Theme */
export const getThemeComapnyListApi = (param, callback, errorCallback) => {
  const config = {
    method: 'get',
    url: Api.mkt.themeCompanyList
  }
  if (param) config.params = param
  CommonAxiosV2('MKT', config, callback, errorCallback)
}

export const saveThemeApi = (param, callback, errorCallback) => {
  return CommonAxiosV2('MKT', getPostConfig(Api.mkt.themeSave, param), callback, errorCallback)
}
export const getThemeListApi = (param, callback, errorCallback) => {
  const config = {
    method: 'get',
    url: Api.mkt.themeList
  }
  if (param) config.params = param
  CommonAxiosV2('MKT', config, callback, errorCallback)
}

export const getThemeOrderListApiV2 = (param, callback, errorCallback) => {
  const config = {
    method: 'get',
    url: Api.mkt.themeOrderList
  }
  if (param) config.params = param
  CommonAxiosV2('MKT', config, callback, errorCallback)
}

export const saveThemeOrder = async (params) => {
  const res = await CommonAxios('MKT', getPostConfig(Api.mkt.themeOrderUpdate, params))
  return res
}

export const deleteThemeApi = (param, callback, errorCallback) => {
  return CommonAxiosV2('MKT', getPostConfig(Api.mkt.themeDelete, param), callback, errorCallback)
}

export const getThemeDetailApi = (id) => {
  return CommonAxios('MKT', getConfig(Api.mkt.themeDetail, { ffpcGrpId: id }))
}

export const getCtgyClass = (callback, errorCallback) => {
  return CommonAxiosV2('MKT', getConfig(Api.mkt.ctgyClass, {}), callback, errorCallback)
}

/*** main > bind */
export const getBindListApi = async (param) => {
  const config = {
    method: 'get',
    url: Api.mkt.mainBindList
  }
  if (param) config.params = param
  const res = await CommonAxios('MKT', config)
  return res
}
// 메인 묶음 상품 승인/취소
export const approveMainBind = async (params) => {
  const res = await CommonAxios('MKT', getPostConfig(Api.mkt.mainBindApprove, params))
  return res
}

/*** user > Agency */
export const getAgencyListApi = async (param) => {
  const config = {
    method: 'get',
    url: Api.mkt.agencyList
  }
  if (param) config.params = param
  const res = await CommonAxios('MKT', config)
  return res
}

// 권한승인
export const approveAgencyApi = async (params) => {
  const res = await CommonAxios('MKT', getPostConfig(Api.mkt.agencyApprove, params))
  return res
}

// 반려
export const rejectAgencyApi = async (params) => {
  const res = await CommonAxios('MKT', getPostConfig(Api.mkt.agencyReject, params))
  return res
}

// 권한해제
export const cancelApproveApi = async (params) => {
  const res = await CommonAxios('MKT', getPostConfig(Api.mkt.agencyApproveCancel, params))
  return res
}

// 반려취소
export const cancelRejectApi = async (params) => {
  const res = await CommonAxios('MKT', getPostConfig(Api.mkt.agencyRejectCancel, params))
  return res
}

// 해제취소
export const cancelReserveApi = async (params) => {
  const res = await CommonAxios('MKT', getPostConfig(Api.mkt.agencyReverseCancel, params))
  return res
}

/*** user > Seller */
// 목록조회
export const getSellerListApi = async (param) => {
  const config = {
    method: 'get',
    url: Api.mkt.sellerList
  }
  if (param) config.params = param
  const res = await CommonAxios('MKT', config)
  return res
}

// 판매자 목록조회
export const getSellerListApiV2 = (param, callback, errorCallback) => {
  const config = {
    method: 'get',
    url: Api.mkt.sellerList
  }
  if (param) config.params = param
  CommonAxiosV2('MKT', config, callback, errorCallback)
}

// 판매자 목록조회
export const getMyInfoV2 = (param, callback, errorCallback) => {
  const config = {
    method: 'get',
    url: Api.mkt.sellerCompanyInfo + '/' + param.selrUsisId
  }
  if (param) config.params = param
  CommonAxiosV2('MKT', config, callback, errorCallback)
}

// 자격박탈
export const sellerRoleOff = async (params) => {
  const res = await CommonAxios('MKT', getPostConfig(Api.mkt.sellerRoleOff, params))
  return res
}

export const sellerRoleOffV2 = async (params, callback, errorCallback) => {
  CommonAxiosV2('MKT', getPostConfig(Api.mkt.sellerRoleOff, params), callback, errorCallback)
}

// 자격박탈 취소
export const sellerRoleOffCancel = async (params) => {
  const res = await CommonAxios('MKT', getPostConfig(Api.mkt.sellerRoleOffCancel, params))
  return res
}

export const sellerRoleOffCancelV2 = async (params, callback, errorCallback) => {
  CommonAxiosV2('MKT', getPostConfig(Api.mkt.sellerRoleOffCancel, params), callback, errorCallback)
}

// 유형 목록조회
export const getSellerTypeListApi = async () => {
  const config = {
    method: 'get',
    url: Api.mkt.sellerTypeList
  }
  const res = await CommonAxios('MKT', config)
  return res
}

/*** product > list */
export const getProdSellerList = async (params) => {
  const res = await CommonAxios('MKT', getConfig(Api.mkt.prodSellerList, params))
  return res
}

export const getProdSellerListV2 = async (param, callback, errorCallback) => {
  const config = {
    method: 'get',
    url: Api.mkt.prodSellerProdList
  }
  if (param) config.params = param
  CommonAxiosV2('MKT', config, callback, errorCallback)
}

/*** product > detail */
// get seller detail
export const getProductDetailApi = async (params) => {
  const res = await CommonAxios('MKT', getConfig(Api.mkt.prodSellerDetail, params))
  return res
}

// get reg list
export const getProdSellerRegListApi = async (params) => {
  const res = await CommonAxios('MKT', getConfig(Api.mkt.prodSellerRegList, params))
  return res
}

// cancel reg
export const prodSellerRegCancel = async (params) => {
  const res = await CommonAxios('MKT', getPostConfig(Api.mkt.prodSellerRegCancel, params))
  return res
}

export const prodSellerRegCancelV2 = async (params, callback, errorCallback) => {
  CommonAxiosV2('MKT', getPostConfig(Api.mkt.prodSellerRegCancel, params), callback, errorCallback)
}

// recovery reg
export const prodSellerRegRecovery = async (params) => {
  const res = await CommonAxios('MKT', getPostConfig(Api.mkt.prodSellerRegRecovery, params))
  return res
}

export const prodSellerRegRecoveryV2 = async (params, callback, errorCallback) => {
  CommonAxiosV2('MKT', getPostConfig(Api.mkt.prodSellerRegRecovery, params), callback, errorCallback)
}

// get agency list
export const getProdSellerAgencyListApi = async (params) => {
  const res = await CommonAxios('MKT', getConfig(Api.mkt.prodSellerAgencyList, params))
  return res
}

// cancel agency
export const prodSellerAgencyCancel = async (params) => {
  const res = await CommonAxios('MKT', getPostConfig(Api.mkt.prodSellerAgencyCancel, params))
  return res
}

// recovery agency
export const prodSellerAgencyRecovery = async (params) => {
  const res = await CommonAxios('MKT', getPostConfig(Api.mkt.prodSellerAgencyRecovery, params))
  return res
}

/*** event */
// get event list
export const getEventListApi = async (params) => {
  const res = await CommonAxios('MKT', getConfig(Api.mkt.eventManageList, params))
  return res
}
export const getEventListApiV2 = (params, callback, errorCallback) => {
  const config = {
    method: 'get',
    url: Api.mkt.eventManageList
  }
  if (params) config.params = params
  CommonAxiosV2('MKT', config, callback, errorCallback)
}

export const getEventJoinListApiV2 = (params, callback, errorCallback) => {
  const config = {
    method: 'get',
    url: Api.mkt.eventManageJoinList
  }
  if (params) config.params = params
  CommonAxiosV2('MKT', config, callback, errorCallback)
}

// get event detail
export const getEventDetailApi = async (params) => {
  const res = await CommonAxios('MKT', getConfig(Api.mkt.eventManageDetail, params))
  return res
}

export const getEventDetailApiV2 = (params, callback, errorCallback) => {
  const config = {
    method: 'get',
    url: Api.mkt.eventManageDetail
  }
  if (params) config.params = params
  CommonAxiosV2('MKT', config, callback, errorCallback)
}

// 이벤트 참여 상품 목록
export const getEventProductListApiV2 = (params, callback, errorCallback) => {
  const config = {
    method: 'get',
    url: Api.mkt.eventManageJoinProductList
  }
  if (params) config.params = params
  CommonAxiosV2('MKT', config, callback, errorCallback)
}
// 이벤트 참여 상품 선정 상태 수정
export const updateSelectedStatusApi = (params, callback, errorCallback) => {
  CommonAxiosV2('MKT', getPostConfig(Api.mkt.eventManageSelectedStatus, params), callback, errorCallback)
}
// 이벤트 참여 상품 선정 상태 전체 수정
export const UpdateAllStatusApi = (params, callback, errorCallback) => {
  CommonAxiosV2('MKT', getPostConfig(Api.mkt.eventManageAllSelectedStatus, params), callback, errorCallback)
}
// 이벤트 참여 상품 선정 상태 전체 수정
export const AddEventProduct = (params, callback, errorCallback) => {
  const config = {
    method: 'get',
    url: Api.mkt.eventManageAddEventProduct
  }
  if (params) config.params = params
  CommonAxiosV2('MKT', config, callback, errorCallback)
}

// save event
export const saveEventApi = async (params) => {
  const res = await CommonAxios('MKT', getPostConfig(Api.mkt.eventManageSave, params))
  return res
}

// save event V2
export const saveEventApiV2 = async (params, callback, errorCallback) => {
  CommonAxiosV2('MKT', getPostConfig(Api.mkt.eventManageSave, params), callback, errorCallback)
}

// delete event
export const deleteEventApi = async (params) => {
  const res = await CommonAxios('MKT', getPostConfig(Api.mkt.eventManageDelete, params))
  return res
}

// get event parti list
export const getEventApplyProdApi = async (params) => {
  const res = await CommonAxios('MKT', getConfig(Api.mkt.eventManageApplyList, params))
  return res
}

// get event parti prod
export const getEventProductPartiApi = async (params) => {
  const res = await CommonAxios('MKT', getConfig(Api.mkt.eventManageProductPartiList, params))
  return res
}

// get event prod
export const getEventProductApi = async (params) => {
  const res = await CommonAxios('MKT', getConfig(Api.mkt.eventManageProductiList, params))
  return res
}

//이벤트 참여 상품 조회
export const getEventProductApiV2 = (params, callback, errorCallback) => {
  const config = {
    method: 'get',
    url: Api.mkt.eventManageProductiList
  }
  if (params) config.params = params
  CommonAxiosV2('MKT', config, callback, errorCallback)
}

// approve prod - parti
export const approveEventPartiApi = async (params) => {
  const res = await CommonAxios('MKT', getPostConfig(Api.mkt.eventManageApproveParti, params))
  return res
}

// approve prod
export const approveEventApi = async (params) => {
  const res = await CommonAxios('MKT', getPostConfig(Api.mkt.eventManageApproveProduct, params))
  return res
}

// 이벤트 상품 추가
export const approveEventApiV2 = (params, callback, errorCallback) => {
  CommonAxiosV2('MKT', getPostConfig(Api.mkt.eventManageApproveProduct, params), callback, errorCallback)
}

// cancel approve prod
export const approveCancelEventApi = async (params) => {
  const res = await CommonAxios('MKT', getPostConfig(Api.mkt.eventManageApproveCancel, params))
  return res
}

// update sort
export const approveSortUpdate = async (params) => {
  const res = await CommonAxios('MKT', getPostConfig(Api.mkt.eventManageSort, params))
  return res
}

/*** price  */
export const getPriceSelrList = (params, callback, errorCallback) => {
  const res = CommonAxiosV2('MKT', getConfig(Api.mkt.priceSelrList, params), callback, errorCallback)
  return res
}

export const getPriceSelrDetailList = (params, callback, errorCallback) => {
  const res = CommonAxiosV2('MKT', getConfig(Api.mkt.priceSelrDetailList, params), callback, errorCallback)
  return res
}

export const getPriceAgencyList = (params, callback, errorCallback) => {
  const res = CommonAxiosV2('MKT', getConfig(Api.mkt.priceAgencyList, params), callback, errorCallback)
  return res
}

export const getPriceEventList = async (params) => {
  const res = await CommonAxios('MKT', getConfig(Api.mkt.priceEventList, params))
  return res
}

/*** order  */
export const getOrderList = async (params) => {
  const res = await CommonAxios('MKT', getConfig(Api.mkt.orderList, params))
  return res
}
export const getOrderEstimatePopup = async (params) => {
  const res = await CommonAxios('MKT', getConfig(Api.mkt.estimDetail, params))
  return res
}

/*** cs > faq */
export const getCsFaqList = async (params) => {
  const res = await CommonAxios('MKT', getConfig(Api.mkt.csFaqList, params))
  return res
}

export const getCsFaqDel = async (params) => {
  const res = await CommonAxios('MKT', getPostConfig(Api.mkt.csFaqDelete, params))
  return res
}

export const getCsFaqDetail = async (params) => {
  const res = await CommonAxios('MKT', getConfig(Api.mkt.csFaqDetail, params))
  return res
}

export const getCsFaqUpdate = async (params) => {
  const res = await CommonAxios('MKT', getPostConfig(Api.mkt.csFaqUpdate, params))
  return res
}

export const getCsFaqSave = async (params) => {
  const res = await CommonAxios('MKT', getPostConfig(Api.mkt.csFaqSave, params))
  return res
}

/*** cs > qna */
export const getCsQnaList = async (params) => {
  const res = await CommonAxios('MKT', getConfig(Api.mkt.csQnaList, params))
  return res
}

export const getCsQnaDetail = async (params) => {
  const res = await CommonAxios('MKT', getConfig(Api.mkt.csQnaDetail, params))
  return res
}

export const getCsQnaSave = async (params) => {
  const res = await CommonAxios('MKT', getPostConfig(Api.mkt.csQnaSave, params))
  return res
}

export const getCsQnaUpdate = async (params) => {
  const res = await CommonAxios('MKT', getPostConfig(Api.mkt.csQnaUpdate, params))
  return res
}

export const getCsQnaDel = async (params) => {
  const res = await CommonAxios('MKT', getPostConfig(Api.mkt.csQnaDelete, params))
  return res
}

/* 공지사항 조회 */
export const getNoticeListApiV2 = (param, callback, errorCallback) => {
  const config = {
    method: 'get',
    url: Api.mkt.csNoticeList
  }
  if (param) config.params = param
  CommonAxiosV2('MKT', config, callback, errorCallback)
}

/* 공지사항 상세 */
export const getNoticeDetailApiV2 = (id) => {
  let url = ''
  url = Api.mkt.csNoticeDetail

  return CommonAxios('MKT', getConfig(url, { pbntInfId: id }))
}

/* 공지사항 저장 */
export const saveNoticeApiV2 = async (params, callback, errorCallback) => {
  CommonAxiosV2('MKT', getPostConfig(Api.mkt.csNoticeSave, params), callback, errorCallback)
}

/* 공지사항 삭제 */
export const deleteNoticeApiV2 = (params, callback, errorCallback) => {
  CommonAxiosV2('MKT', getPostConfig(Api.mkt.csNoticeDelete, params), callback, errorCallback)
}

/* FAQ 조회 */
export const getFaqListApiV2 = (param, callback, errorCallback) => {
  const config = {
    method: 'get',
    url: Api.mkt.csFaqList
  }
  if (param) config.params = param
  CommonAxiosV2('MKT', config, callback, errorCallback)
}

/* FAQ 상세 */
export const getFaqDetailApiV2 = (id) => {
  let url = ''
  url = Api.mkt.csFaqDetail

  return CommonAxios('MKT', getConfig(url, { faqInfId: id }))
}

/* FAQ 저장 */
export const saveFaqApiV2 = async (params, callback, errorCallback) => {
  CommonAxiosV2('MKT', getPostConfig(Api.mkt.csFaqSave, params), callback, errorCallback)
}

/* FAQ 삭제 */
export const deleteFaqApiV2 = (params, callback, errorCallback) => {
  CommonAxiosV2('MKT', getPostConfig(Api.mkt.csFaqDelete, params), callback, errorCallback)
}

/* 공통코드 조회 */
export const getComcodeApi = () => {
  const config = {
    method: 'get',
    url: Api.mkt.csComCode
  }
  CommonAxios('MKT', config)
}

/* qna 조회 */
export const getQnaListApiV2 = (param, callback, errorCallback) => {
  const config = {
    method: 'get',
    url: Api.mkt.csQnaList
  }
  if (param) config.params = param
  CommonAxiosV2('MKT', config, callback, errorCallback)
}

/* qna 상세 */
export const getQnaDetailApiV2 = (id) => {
  let url = ''
  url = Api.mkt.csQnaDetail

  return CommonAxios('MKT', getConfig(url, { admInquInfId: id }))
}

/* qna 저장 */
export const saveQnaApiV2 = async (params, callback, errorCallback) => {
  CommonAxiosV2('MKT', getPostConfig(Api.mkt.csQnaUpdate, params), callback, errorCallback)
}

/* qna 삭제 */
export const deleteQnaApiV2 = (params, callback, errorCallback) => {
  CommonAxiosV2('MKT', getPostConfig(Api.mkt.csQnaDelete, params), callback, errorCallback)
}

/* 상품 카테고리 조회 */
export const getProductMenuListApiV2 = (param, callback, errorCallback) => {
  const config = {
    method: 'get',
    url: Api.mkt.menuProductList
  }
  if (param) config.params = param
  CommonAxiosV2('MKT', config, callback, errorCallback)
}

/* 기업 카테고리 조회 */
export const getCompanyMenuListApiV2 = (param, callback, errorCallback) => {
  const config = {
    method: 'get',
    url: Api.mkt.menuCompanyList
  }
  if (param) config.params = param
  CommonAxiosV2('MKT', config, callback, errorCallback)
}

export const saveCategoryProductOrder = async (params) => {
  if (!params || params.length < 1) return
  const res = await CommonAxios('MKT', getPostConfig(Api.mkt.menuSortProductSave, params))
  return res
}

export const saveCategoryCompanyOrder = async (params) => {
  if (!params || params.length < 1) return
  const res = await CommonAxios('MKT', getPostConfig(Api.mkt.menuSortCompanySave, params))
  return res
}
