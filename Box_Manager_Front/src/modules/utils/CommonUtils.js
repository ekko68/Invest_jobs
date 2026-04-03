import Api from 'modules/consts/Api'
import CommonAxios from './CommonAxios'
import { StringUtils } from './StringUtils'

// common get
export const getConfig = (url, params = null) => {
  const config = {
    url: url,
    method: 'get'
  }
  if (params) {
    config.params = params
  }
  return config
}

// common post
export const getPostConfig = (url, params = null) => {
  const config = {
    url: url,
    method: 'post'
  }
  if (params) {
    config.data = params
  }
  return config
}

export const getPutConfig = (url, params = null) => {
  const config = {
    url: url,
    method: 'put'
  }
  if (params) {
    config.data = params
  }
  return config
}

export const getDeleteConfig = (url, params = null) => {
  const config = {
    url: url,
    method: 'delete'
  }
  if (params) {
    config.data = params
  }
  return config
}

// file upload - invest
export const getFileUploadConfig = (form) => {
  const config = {
    url: Api.invest.fileUpload,
    method: 'post',
    data: form,
    fileused: true
  }
  return config
}

// file upload - commerce
export const getFileUploadConfigMKT = (form) => {
  const config = {
    url: Api.mkt.fileUpload,
    method: 'post',
    data: form,
    fileused: true
  }
  return config
}

// file upload - books
export const getFileUploadConfigBooks = (form) => {
  const config = {
    url: Api.books.fileUpload,
    method: 'post',
    data: form,
    fileused: true
  }
  return config
}

// file upload - main
export const getFileUploadConfigMain = (form) => {
  const config = {
    url: Api.main.fileUpload,
    method: 'post',
    data: form,
    fileused: true
  }
  return config
}

// get file download - invest
export const getFileDownloadConfig = (fileId) => {
  const config = {
    url: Api.invest.fileDownload + '/' + fileId,
    method: 'get',
    responseType: 'blob'
  }
  return config
}

// get file download - commerce
export const getFileDownloadConfigMkt = (fileId) => {
  const config = {
    url: Api.mkt.fileDownload + '/' + fileId,
    method: 'get',
    responseType: 'blob'
  }
  return config
}

// get file download - books
export const getFileDownloadConfigBooks = (form) => {
  const config = {
    url: Api.books.fileDownload,
    method: 'post',
    data: form,
    responseType: 'blob'
  }
  return config
}

// get file download - main
export const getFileDownloadConfigMain = (form) => {
  const config = {
    url: Api.main.fileDownload,
    method: 'post',
    data: form,
    responseType: 'blob'
  }
  return config
}

// file download - invest
export const fileDownload = async (item) => {
  const res = await CommonAxios('IVT', getFileDownloadConfig(item['fileId']))
  if (res) {
    if (res.status === 200) {
      const blob = new Blob([res.data], { type: res.headers['content-type'] })
      blobDownloadClick(blob, item['fileNm'])
    }
  }
}

export const getfile = async (item) => {
  const res = await CommonAxios('IVT', getFileDownloadConfig(item['fileId']))
  if (res) {
    if (res.status === 200) {
      return new File([res.data], item['fileNm'], { type: res.headers['content-type'] })
    }
  }
}

// file download - commerce
export const fileDownloadMkt = async (item) => {
  const res = await CommonAxios('MKT', getFileDownloadConfigMkt(item['fileId']))
  if (res) {
    if (res.status === 200) {
      const blob = new Blob([res.data], { type: res.headers['content-type'] })
      blobDownloadClick(blob, item['fileNm'])
    }
  }
}

// file download - books
export const fileDownloadBooks = async (item) => {
  const res = await CommonAxios('BKB', getFileDownloadConfigBooks(item))
  if (res) {
    if (res.status === 200) {
      const blob = new Blob([res.data], { type: res.headers['content-type'] })
      blobDownloadClick(blob, item['fileNm'])
    }
  }
}

// file download - main
export const fileDownloadMain = async (item) => {
  const res = await CommonAxios('MNB', getFileDownloadConfigMain(item))
  if (res) {
    if (res.status === 200) {
      const blob = new Blob([res.data], { type: res.headers['content-type'] })
      blobDownloadClick(blob, item['fileNm'])
    }
  }
}

// get excel download - invest
export const getExcelDownloadConfigIvt = (type, startDate, endDate) => {
  const config = {
    method: 'get',
    responseType: 'blob'
  }
  if (type === 'visitor') {
    // 기간별방문자
    config.url = Api.invest.visitorExcelDownload + '?searchFromDate=' + startDate + '&searchToDate=' + endDate
  } else if (type === 'request') {
    // 투자심사요청
    config.url = Api.invest.requestExcelDownload + '?searchFromDate=' + startDate + '&searchToDate=' + endDate
  } else if (type === 'suggest') {
    // 투자심사제안
    config.url = Api.invest.suggestExcelDownload + '?searchFromDate=' + startDate + '&searchToDate=' + endDate
  } else {
    // 투자심사완료
    config.url = Api.invest.completeExcelDownload + '?searchFromDate=' + startDate + '&searchToDate=' + endDate
  }
  return config
}

// file download - commerce
export const excelDownloadIVT = async (type, startDate, endDate) => {
  /*
   * type: 기간별방문자(visitor) || 투자심사요청(request) || 투자심사제안(suggest) || 투자심사완료(complete)
   * */
  const res = await CommonAxios('IVT', getExcelDownloadConfigIvt(type, startDate, endDate))
  if (res) {
    if (res.status === 200) {
      let _fileName = ''
      type === 'visitor'
        ? (_fileName = `기간별 방문자 (${startDate}~${endDate})`)
        : type === 'request'
        ? (_fileName = `진행중인 투자심사요청 (${startDate}~${endDate})`)
        : type === 'suggest'
        ? (_fileName = `진행중인 투자심사제안 (${startDate}~${endDate})`)
        : (_fileName = `투자심사완료 (${startDate}~${endDate})`)

      const blob = new Blob([res.data], { type: res.headers['content-type'] })
      blobDownloadClick(blob, _fileName)
    }
  }
}

export const excelDownloadIvtByPostConfigOption = async (config, setFileName) => {
  config = {
    ...config,
    method: 'post',
    responseType: 'blob'
  }

  const res = await CommonAxios('IVT', config)

  if (res) {
    const blob = new Blob([res.data], { type: res.headers['content-type'] })

    let fileName = ''
    if (StringUtils.hasLength(setFileName)) {
      fileName = setFileName
    } else {
      const disposition = res.headers['content-disposition']
      fileName = StringUtils.getContentDispositionFileName(disposition, '테스트')
    }

    blobDownloadClick(blob, fileName)
  }
}

export const excelDownloadBkbByPostConfigOption = async (config, setFileName) => {
  config = {
    ...config,
    method: 'post',
    responseType: 'blob'
  }

  const res = await CommonAxios('BKB', config)

  if (res) {
    const blob = new Blob([res.data], { type: res.headers['content-type'] })

    let fileName = ''
    if (StringUtils.hasLength(setFileName)) {
      fileName = setFileName
    } else {
      const disposition = res.headers['content-disposition']
      fileName = StringUtils.getContentDispositionFileName(disposition, '테스트')
    }

    blobDownloadClick(blob, fileName)
  }
}

export const excelDownloadGlbByPostConfigOption = async (config, setFileName) => {
  config = {
    ...config,
    method: 'post',
    responseType: 'blob'
  }

  const res = await CommonAxios('ADM', config)

  if (res) {
    const blob = new Blob([res.data], { type: res.headers['content-type'] })

    let fileName = ''
    if (StringUtils.hasLength(setFileName)) {
      fileName = setFileName
    } else {
      const disposition = res.headers['content-disposition']
      fileName = StringUtils.getContentDispositionFileName(disposition, '테스트')
    }

    blobDownloadClick(blob, fileName)
  }
}

export const blobDownloadClick = (blob, fileName) => {
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.setAttribute('download', fileName)

  document.body.appendChild(link)
  link.click()
  link.parentNode.removeChild(link)
}

//랜덤 수를 발생
export const generateKey = () => {
  const createKey = (window.crypto || window.msCrypto).getRandomValues(new Uint32Array(1))[0]
  return createKey
}

export const getNationalName = (code) => {
  let name
  switch (code) {
    case 'CN':
      name = '중국'
      break
    case 'ID':
      name = '인도네시아'
      break
    case 'MM':
      name = '미얀마'
      break
    case 'US':
      name = '미국'
      break
    case 'JP':
      name = '일본'
      break
    case 'HK':
      name = '홍콩'
      break
    case 'GB':
      name = '영국'
      break
    case 'VN':
      name = '베트남'
      break
    case 'IN':
      name = '인도'
      break
    case 'MI':
      name = '필리핀'
      break
    case 'KH':
      name = '캄보디아'
      break
    case 'RU':
      name = '러시아'
      break
    case 'PL':
      name = '폴란드'
      break
    default:
      name = code
  }
  return name
}

const CommonUtils = {
  getSelectedValue: (list, compareProperty, returnProperty, value) => {
    if (list.length === 0) return ''
    let r = ''
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      if (item[compareProperty] === value) {
        r = item[returnProperty]
        break
      }
    }
    return r
  }
}

export default CommonUtils
