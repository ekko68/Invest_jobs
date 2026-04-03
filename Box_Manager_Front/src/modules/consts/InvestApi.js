import Api from 'modules/consts/Api'
import CommonAxios from 'modules/utils/CommonAxios'
import { getConfig, getPostConfig } from '../utils/CommonUtils'

/***** Banner */

// mainTop get banner List
export const getBannerMainTopList = async () => {
  const config = {
    url: Api.invest.bannerMainTop,
    method: 'get'
  }
  const res = await CommonAxios('IVT', config)
  return res
}

// mainTop save banner List
export const saveBannerMainTopList = async (data) => {
  // const config = {
  //   url: Api.invest.bannerMainTopSave,
  //   method: 'post',
  //   data: bannerList ? bannerList : null
  // }
  // const res = await CommonAxios('IVT', config)
  const res = await CommonAxios('IVT', getPostConfig(Api.invest.bannerMainTopSave, data))
  return res
}

// mainBottom get banner List
export const getBannerMainBottom = async () => {
  const config = {
    url: Api.invest.bannerMainBottom,
    method: 'get'
  }
  const res = await CommonAxios('IVT', config)
  return res
}
// mainBottom save banner List
export const saveBannerMainBottomList = async (data) => {
  // const config = {
  //   url: Api.invest.bannerMainBottomSave,
  //   method: 'post',
  //   data: bannerList ? bannerList : null
  // }
  // const res = await CommonAxios('IVT', config)
  const res = await CommonAxios('IVT', getPostConfig(Api.invest.bannerMainBottomSave, data))
  return res
}

// companyBottom get banner List
export const getBannerCompanyBottom = async () => {
  const config = {
    url: Api.invest.bannerCompanyBottom,
    method: 'get'
  }
  const res = await CommonAxios('IVT', config)
  return res
}
// companyBottom save banner List
export const saveBannerCompanyBottomList = async (data) => {
  // const config = {
  //   url: Api.invest.bannerCompanyBottomSave,
  //   method: 'post',
  //   data: bannerList ? bannerList : null
  // }
  // const res = await CommonAxios('IVT', config)
  const res = await CommonAxios('IVT', getPostConfig(Api.invest.bannerCompanyBottomSave, data))
  return res
}

// mypageCompany get banner List
export const getBannerMypageCompany = async () => {
  const config = {
    url: Api.invest.bannerMypageCompany,
    method: 'get'
  }
  const res = await CommonAxios('IVT', config)
  return res
}
// mypageCompany save banner List
export const saveBannerMypageCompany = async (data) => {
  // const config = {
  //   url: Api.invest.bannerMypageCompanySave,
  //   method: 'post',
  //   data: bannerList ? bannerList : null
  // }
  // const res = await CommonAxios('IVT', config)
  const res = await CommonAxios('IVT', getPostConfig(Api.invest.bannerMypageCompanySave, data))
  return res
}

// mypageVc get banner List
export const getBannerMypageVc = async () => {
  const config = {
    url: Api.invest.bannerMypageVc,
    method: 'get'
  }
  const res = await CommonAxios('IVT', config)
  return res
}
// mypageVc save banner List
export const saveBannerMypageVc = async (data) => {
  // const config = {
  //   url: Api.invest.bannerMypageVcSave,
  //   method: 'post',
  //   data: bannerList ? bannerList : null
  // }
  // const res = await CommonAxios('IVT', config)
  const res = await CommonAxios('IVT', getPostConfig(Api.invest.bannerMypageVcSave, data))
  return res
}

/***** 공지사항 : Notice */
// 목록조회
export const getNoticeList = async (params) => {
  if (params) {
    const res = await CommonAxios('IVT', getConfig(Api.invest.noticeList, params))
    return res
  } else {
    const res = await CommonAxios('IVT', getConfig(Api.invest.noticeList))
    return res
  }
}
// 상세조회
export const getNoticeDetail = async (id) => {
  if (!id) return
  const res = await CommonAxios('IVT', getConfig(Api.invest.noticeDetail, { pbnsId: id }))
  return res
}
// 게시글 삭제
export const deleteNoticeDetail = async (data) => {
  if (!data?.list || data?.list?.length === 0) return
  const res = await CommonAxios('IVT', getPostConfig(Api.invest.noticeDelete, data))
  return res
}

//게시글 등록
export const saveNoticeDetail = async (data) => {
  const res = await CommonAxios('IVT', getPostConfig(Api.invest.noticeSave, data))
  return res
}

/***** 컨설팅 : Consult */
// 목록조회
export const getConsultList = async (params) => {
  if (params) {
    const res = await CommonAxios('IVT', getConfig(Api.invest.consultList, params))
    return res
  } else {
    const res = await CommonAxios('IVT', getConfig(Api.invest.consultList))
    return res
  }
}
// 상세조회
export const getConsultDetail = async (id) => {
  if (!id || id.length === 0) return
  const res = await CommonAxios('IVT', getConfig(Api.invest.consultDetail, { cnsgReqsId: id }))
  return res
}

// 답변작성
export const saveConsultReply = async (data) => {
  const res = await CommonAxios('IVT', getPostConfig(Api.invest.consultReply, data))
  return res
}

/***** 문서관리 : Document */
// 목록조회
export const getDocList = async (params) => {
  if (params) {
    const res = await CommonAxios('IVT', getConfig(Api.invest.documentList, params))
    return res
  } else {
    const res = await CommonAxios('IVT', getConfig(Api.invest.documentList))
    return res
  }
}
// 상세조회
export const getDocDetail = async (id) => {
  if (!id) return
  const res = await CommonAxios('IVT', getConfig(Api.invest.documentDetail, { dcmnId: id }))
  return res
}
// 게시글 삭제
export const deleteDocDetail = async (data) => {
  if (!data?.list || data?.list?.length === 0) return
  const res = await CommonAxios('IVT', getPostConfig(Api.invest.documentDelete, data))
  return res
}

//게시글 등록
export const saveDocDetail = async (data) => {
  const res = await CommonAxios('IVT', getPostConfig(Api.invest.documentSave, data))
  return res
}

/***** Q&A : Qna */
// 목록조회
export const getQnaList = async (params) => {
  if (params) {
    const res = await CommonAxios('IVT', getConfig(Api.invest.qnaList, params))
    return res
  } else {
    const res = await CommonAxios('IVT', getConfig(Api.invest.qnaList))
    return res
  }
}
// 상세조회
export const getQnaDetail = async (id) => {
  if (!id || id.length === 0) return
  const res = await CommonAxios('IVT', getConfig(Api.invest.qnaDetail, { inqrSbjcId: id }))
  return res
}

// 답변작성
export const saveQnaReply = async (data) => {
  const res = await CommonAxios('IVT', getPostConfig(Api.invest.qnaReply, data))
  // console.log(data)
  return res
}

/***** Statistics */
// 통계 조회
/**
 * type : visitor(기간별) | request(요청) | suggest(제안) | completed(완료)
 * */
export const getStatisticsList = async (type, params) => {
  let url = ''
  type === 'visitor'
    ? (url = Api.invest.staticVisitor)
    : type === 'request'
    ? (url = Api.invest.staticRequest)
    : type === 'suggest'
    ? (url = Api.invest.staticSuggest)
    : (url = Api.invest.staticCompleted)

  if (url !== '') {
    const res = await CommonAxios('IVT', getConfig(url, params))
    return res
  }
}

export const getStatisticsTotal = async (type, params) => {
  let url = ''
  type === 'visitor'
    ? (url = Api.invest.staticVisitorTotal)
    : type === 'request'
    ? (url = Api.invest.staticRequestTotal)
    : type === 'suggest'
    ? (url = Api.invest.staticSuggestTotal)
    : (url = Api.invest.staticCompletedTotal)

  if (url !== '') {
    const res = await CommonAxios('IVT', getConfig(url, params))
    return res
  }
}

/***** invest user */
export const getVcList = async (params) => {
  const res = await CommonAxios('IVT', getConfig(Api.invest.getVcList, params))
  return res
}

/***** invest user */
export const getVcNewList = async (params) => {
  const res = await CommonAxios('IVT', getConfig(Api.invest.getVcNewList, params))
  return res
}

export const approveVc = async (data) => {
  const res = await CommonAxios('IVT', getPostConfig(Api.invest.acceptVc, data))
  return res
}

export const denyVc = async (data) => {
  const res = await CommonAxios('IVT', getPostConfig(Api.invest.denyVc, data))
  return res
}

export const saveFncnInfo = async (data) => {
  const res = await CommonAxios('IVT', getPostConfig(Api.invest.saveFncnInfo, data))
  return res
}

/***** Recommend */
export const getCompanyList = async (params) => {
  const res = await CommonAxios('IVT', getConfig(Api.invest.companyList, params))
  return res
}

export const saveRecommend = async (data) => {
  const res = await CommonAxios('IVT', getPostConfig(Api.invest.companySave, data))
  return res
}
export const deleteRecommend = async (data) => {
  const res = await CommonAxios('IVT', getPostConfig(Api.invest.companyDelete, data))
  return res
}

/* 추천받은 기업 리스트 : rcmdEnprMngm */
export const getProposalCompanyList = async (params) => {
  const res = await CommonAxios('IVT', getConfig(Api.invest.proposalCompanyList, params))
  return res
}

/* 추천받은 기업 상세 : rcmdEnprMngm */
export const getProposalCompany = async (params) => {
  const res = await CommonAxios('IVT', getConfig(Api.invest.proposalCompanyDetail, params))
  return res
}

/* 추천받은 기업 메모 저장 : rcmdEnprMngm */
export const saveProposalCompany = async (params) => {
  const res = await CommonAxios('IVT', getPostConfig(Api.invest.proposalCompanySave, params))
  return res
}

/* 협약 벤처투자기관 관리 : vncmLoan */
export const getVncmloanAgisList = async (params) => {
  const res = await CommonAxios('IVT', getConfig(Api.invest.vncmloanAgisList, params))
  return res
}

/* 협약 벤처투자기관 관리 : vncmLoan */
export const getVncmloanAgisDetail = async (id) => {
  const res = await CommonAxios('IVT', getConfig(Api.invest.vncmloanAgisDetail, { agremVnentrSeq: id }))
  return res
}

/* 협약 벤처투자기관 저장 : vncmLoan */
export const saveDetailView = async (data) => {
  const res = await CommonAxios('IVT', getPostConfig(Api.invest.vncmloanAgisSave, data))
  return res
}

/***** 벤처대출 추천 접수 목록 : Vnemtrlon */

// 목록조회
export const getVnemtrlonReqstList = async (params) => {
  if (params) {
    const res = await CommonAxios('IVT', getConfig(Api.invest.vnemtrlonReqstList, params))
    return res
  } else {
    const res = await CommonAxios('IVT', getConfig(Api.invest.vnemtrlonReqstList))
    return res
  }
}
// 상세조회
export const getVnentrLonSgshPrtRceptDetail = async (id = '', rcmdEnprBzn = '') => {
  if (!id && !rcmdEnprBzn) return
  const res = await CommonAxios(
    'IVT',
    getConfig(Api.invest.vnemtrlonReqstDetail, { vnentrlonId: id, rcmdEnprBzn: rcmdEnprBzn })
  )
  return res
}

// 상세저장
export const saveVncmLoanDetail = async (data) => {
  const res = await CommonAxios('IVT', getPostConfig(Api.invest.vnemtrlonDetailSave, data))
  return res
}
// 이메일보내기
export const sendVncmLoanEmail = async (data) => {
  const res = await CommonAxios('IVT', getPostConfig(Api.invest.vnemtrlonSendEmail, data))
  return res
}
// SMS보내기
export const sendVncmLoanSms = async (data) => {
  const res = await CommonAxios('IVT', getPostConfig(Api.invest.vnemtrlonSendSms, data))
  return res
}
// 추천상태코드 조회
export const getVncmLoanCodeList = async () => {
  const res = await CommonAxios('IVT', getConfig(Api.invest.vnemtrlonCodeList))
  return res
}
// 기타 항목 조회
export const getEtcList = async (params) => {
  const res = await CommonAxios('IVT', getConfig(Api.invest.getEtcList, params))
  return res
}

/***** 벤처대출신청접수 */
// 목록
export const getVnemtrlonAplcList = async (params) => {
  if (params) {
    const res = await CommonAxios('IVT', getConfig(Api.invest.vnemtrlonAplcList, params))
    return res
  } else {
    const res = await CommonAxios('IVT', getConfig(Api.invest.vnemtrlonAplcList))
    return res
  }
}
// 상세
export const getVnemtrlonAplcDetail = async (data) => {
  const res = await CommonAxios('IVT', getConfig(Api.invest.vnemtrlonAplcDetail, data))
  return res
}
// 상태 수정
export const saveVnemtrlonAplcDetail = async (data) => {
  const res = await CommonAxios('IVT', getPostConfig(Api.invest.vnemtrlonAplcSave, data))
  return res
}

// 기업 상세 조회
export const getBasicInfoDetail = async (params) => {
  const res = await CommonAxios('IVT', getConfig(Api.invest.getBasicInfoDetail, params))
  return res
}

// 목록조회
// export const getVnemtrlonRST01List = async (params) => {
//   const res = await CommonAxios('IVT', getConfig(Api.invest.vnemtrlonReqstList, params))

//   return res
// }
