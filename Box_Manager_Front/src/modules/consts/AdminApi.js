import Api from 'modules/consts/Api'
import CommonAxios from 'modules/utils/CommonAxios'
import { getConfig, getPostConfig } from '../utils/CommonUtils'

/** login */
export const loginApi = async (data) => {
  const res = await CommonAxios('ADM', getPostConfig(Api.admin.login, data))
  return res
}

/** login user info */
export const getUserInfo = async () => {
  const res = await CommonAxios('ADM', getConfig(Api.admin.getUserInfo))
  return res
}

/** user list */
export const getMenuListAPi = async (params = {}) => {
  const res = await CommonAxios('ADM', getConfig(Api.admin.getMenuList, params))
  return res
}

/** user list auth */
export const getMenuAuthApi = async (params = {}) => {
  const res = await CommonAxios('ADM', getConfig(Api.admin.getMenuAuth, params))
  return res
}

/** user list */
export const getUserListApi = async (params) => {
  const res = await CommonAxios('ADM', getConfig(Api.admin.getUserList, params))
  return res
}

/** user detail */
export const getUserDetail = async (params) => {
  const res = await CommonAxios('ADM', getConfig(Api.admin.getUserDetail, params))
  return res
}

export const getUserMenu = async (params) => {
  const res = await CommonAxios('ADM', getConfig(Api.admin.getUserMenu, params))
  return res
}

export const getUserAthrMenu = async (params) => {
  const res = await CommonAxios('ADM', getConfig(Api.admin.getUserAthrMenu, params))
  return res
}

export const setUserInfo = async (params) => {
  const res = await CommonAxios('ADM', getPostConfig(Api.admin.setUserInfo, params))
  return res
}

export const setUserAthrMenu = async (params) => {
  const res = await CommonAxios('ADM', getPostConfig(Api.admin.setUserAthrMenu, params))
  return res
}

export const deleteUserInfo = async (params) => {
  const res = await CommonAxios('ADM', getPostConfig(Api.admin.deleteUserInfo, params))
  return res
}

// export const getNoticeDetail = async (id) => {
//   if (!id) return
//   const res = await CommonAxios('IVT', getConfig(Api.invest.noticeDetail, { pbnsId: id }))
//   return res
// }

// export const saveNoticeDetail = async (data) => {
//   const res = await CommonAxios('IVT', getPostConfig(Api.invest.noticeSave, data))
//   return res
// }

export const getConsultStatisticsDaily = async (params) => {
    const res = await CommonAxios('ADM', getPostConfig(Api.admin.statisticsConsultVisitorDaily, params))
    return res
}

export const getConsultStatisticsMonthly = async (params) => {
  const res = await CommonAxios('ADM', getPostConfig(Api.admin.statisticsConsultVisitorMonthly, params))
  return res
}

export const getConsultStatisticsYearly = async (params) => {
  const res = await CommonAxios('ADM', getPostConfig(Api.admin.statisticsConsultVisitorYearly, params))
  return res
}

export const getConsultStatisticsExcel = async (params) => {
  let config = {
    url: Api.admin.statisticsConsultVisitorExcel,
    method: 'post',
    responseType: 'blob',
    data: params
  }
  const res = await CommonAxios('ADM', config)

  return res;
}
