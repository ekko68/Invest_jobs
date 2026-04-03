import CommonAxios from '../../utils/CommonAxios'
import { getFileUploadConfigMKT } from '../../utils/CommonUtils'
import ResponseUtils from '../../utils/ResponseUtils'
import { getBannerCountApi } from '../../consts/MktApi'
import * as commonFn from '../commonFn'
import resizer from 'modules/hooks/resizer'

/** ===== banner form */
// ===== 카운터 조회 및 체크
export const maximumCnt = {
  mainBanner: 5,
  subBanner: 9,
  prodBanner: 5,
  eventBanner: 9
}

export const handleMaximumCheck = async (type, handleMaximunAlert) => {
  const res = await getBannerCountApi()
  if (res.data.code === '200') {
    let data = res.data.data
    let key = ''
    if (type === 'mainBanner') key = 'mainBanCnt'
    if (type === 'subBanner') key = 'subBanCnt'
    if (type === 'prodBanner') key = 'prdtBanCnt'
    if (type === 'eventBanner') key = 'eventBanCnt'
    if (data === null) {
      data['mainBanner'] = 0
      data['subBanner'] = 0
      data['prodBanner'] = 0
      data['eventBanner'] = 0
    }
    if (data[key] >= maximumCnt[type]) {
      handleMaximunAlert()
      return false
    } else {
      return true
    }
  }
}

// 파일첨부 팝업 띄우기
export const clickToFileExistCheck = (imgFile) => {
  if (imgFile) {
    alert('최대 업로드 이미지를 초과하였습니다. \n 기존 이미지를 삭제하세요')
    return
  }
  let fileInput = document.getElementById('mkt_main_banner_file_input')
  fileInput.click()
}
const resizeFile = (file) =>
  new Promise((res) => {
    let maxWidth = 1200
    let maxHeight = 1200
    let quality = 80

    const checkSize1 = 1 * 1024 * 1024
    const checkSize2 = 2 * 1024 * 1024

    if (file.size <= checkSize1) {
      // 1메가 이하
      maxWidth = 2000
      maxHeight = 2000
      quality = 100
    } else if (file.size <= checkSize2) {
      // 2메가 이하
      maxWidth = 1500
      maxHeight = 1500
      quality = 90
    }

    resizer.imageFileResizer(
      file, // target file
      maxWidth, // maxWidth
      maxHeight, // maxHeight
      'WEBP', // compressFormat : Can be either JPEG, PNG or WEBP.
      quality, // quality : 0 and 100. Used for the JPEG compression
      0, // rotation
      (uri) => res(uri), // responseUriFunc
      'file' // outputType : Can be either base64, blob or file.(Default type is base64)
    )
  })
// 파일업로드 - 1개
export const handleGetImageFileInfo = async (e, form, setForm) => {
  const { files, id } = e.target
  const input = document.querySelector(`#${id}`)
  if (commonFn.handleFileFormatCheck(e)) {
    if (!files[0]) return
    let object = null
    const formData = new FormData()
    const compressedFile = await resizeFile(files[0])
    formData.append('file', compressedFile)
    const res = await CommonAxios('MKT', getFileUploadConfigMKT(formData))
    if (ResponseUtils.isValidateResponse(res)) {
      object = res.data.data
    }
    setForm({
      ...form,
      fileId: object.fileId,
      imgFileInfo: object
    })
  } else {
    alert('업로드할 수 없는 파일입니다.')
    input.value = ''
  }
  input.removeEventListener('change', handleGetImageFileInfo)
}

// ===== Banner & Popup
// 필수값 체크
export const handleRequiredCheck = (dataObj, type) => {
  let requireList = []
  let keyList = Object.keys(dataObj)
  // 필수값만 배열에 등록 : 메인배너인 경우에만 상세 체크
  requireList =
    type === 'popup'
      ? keyList.filter((f) => f !== 'oppbYn' && f !== 'con')
      : type !== 'mainBanner'
      ? keyList.filter((f) => f !== 'con')
      : keyList
  // 빈 값 체크
  let checkCnt = 0
  for (let i = 0; i < requireList.length; i++) {
    let key = requireList[i]
    if (!dataObj[key] || dataObj[key] === '' || dataObj[key].length <= 0) {
      checkCnt++
    }
  }
  if (checkCnt > 0) {
    return false
  } else {
    return true
  }
}
