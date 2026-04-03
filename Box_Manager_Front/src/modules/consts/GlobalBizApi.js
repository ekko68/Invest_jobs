import Api from 'modules/consts/Api'
import CommonAxios from 'modules/utils/CommonAxios'
import { getConfig, getPostConfig } from '../utils/CommonUtils'

/** 해외진출 상담 : 홰외진출 상담 */
// 목록조회
export const getGlobalBizList = async (params) => {
  if (params) {
    const res = await CommonAxios('GLB', getConfig(Api.globalbiz.globalConsultList, params))
    return res
  } else {
    const res = await CommonAxios('GLB', getConfig(Api.globalbiz.globalConsultList))
    return res
  }
}

export const getExcelList = async () => {
  const res = await CommonAxios('GLB', getConfig(Api.globalbiz.globalConsultExcelList))
  return res
}

// 상세조회
export const getGlobalBizDetail = async (id) => {
  if (!id || id.length === 0) return
  const res = await CommonAxios('GLB', getConfig(Api.globalbiz.globalConsultDetail, { fnnccnslId: id }))
  return res
}
// 지점
export const updateGlobalBizBranchAdmin = async (id, mngrId) => {
  if (!id || id.length === 0) return
  const res = await CommonAxios(
    'GLB',
    getPostConfig(Api.globalbiz.globalConsultUpdateBranchAdmin, { fnnccnslId: id, ovrsDeptRsprId: mngrId })
  )
  return res
}
// 삭제
export const getGlobalBizDelete = async (id) => {
  if (!id || id.length === 0) return
  const res = await CommonAxios('GLB', getPostConfig(Api.globalbiz.globalConsultDelete, { fnnccnslId: id }))
  return res
}
// 글로벌 사업부 담당자 메모 업데이트
export const updateGlobalBizGlobalAdminMemo = async (id, memo, amnnUserId) => {
  // eslint-disable-next-line no-debugger
  if (!id || id.length === 0) return
  const res = await CommonAxios(
    'GLB',
    getPostConfig(Api.globalbiz.updateGlobalBizGlobalAdminMemo, {
      fnnccnslId: id,
      endpMngrMemo: memo,
      amnnUserId: amnnUserId
    })
  )
  return res
}
// 지점 사업부 담당자 메모 업데이트
export const updateGlobalBizBranchAdminMemo = async (id, memo, amnnUserId) => {
  if (!id || id.length === 0) return
  const res = await CommonAxios(
    'GLB',
    getPostConfig(Api.globalbiz.updateGlobalBizBranchAdminMemo, {
      fnnccnslId: id,
      rspbMngrMemo: memo,
      amnnUserId: amnnUserId
    })
  )
  return res
}
