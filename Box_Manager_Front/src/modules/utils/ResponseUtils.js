import CommonAxios, { loader } from './CommonAxios'
import { getConfig, getFileUploadConfig } from './CommonUtils'

const ResponseUtils = {
  isValidateResponse: (res) => {
    let r = false
    if (res) {
      if (res.status === 200) {
        if (res.data) {
          if (res.data.hasOwnProperty('code')) {
            if (res.data.code === '200') {
              r = true
            } else {
              console.warn(res)
            }
          }
        }
      }
    }
    return r
  },
  getMultiFileUploadResponse: async (files) => {
    let successFileNames = []
    let errorFileNames = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const formData = new FormData()
      formData.append('file', file)
      const res = await CommonAxios('IVT', getFileUploadConfig(formData), false)
      if (ResponseUtils.isFileUploadValidateResponse(res)) {
        successFileNames.push(res.data.data)
      } else {
        errorFileNames.push(res.data.data)
      }
    }
    return { successFileNames: successFileNames, errorFileNames: errorFileNames }
  },
  isFileUploadValidateResponse: (res) => {
    let r = false
    if (res) {
      if (res.status === 200) {
        if (res.data) {
          if (res.data.hasOwnProperty('code')) {
            if (res.data.code === '200') {
              r = true
            }
          }
        }
      }
    }
    return r
  }
}

export default ResponseUtils
