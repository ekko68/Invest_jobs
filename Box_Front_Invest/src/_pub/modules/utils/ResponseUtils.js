import CommonAxios from './CommonAxios'
import { getConfig, getFileUploadConfig } from "modules/utils/CommonAxios";

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
  getList: async (url, params, property = 'list', loading = false) => {
    let list = []
    const config = getConfig(url, params)
    const res = await CommonAxios(config, loading)
    if (ResponseUtils.isValidateResponse(res)) {
      if (res.data.data.hasOwnProperty('list')) list = res.data.data[property]
    }
    return list
  },
  // getMultiListObject: async (url, params, listProperties, loading = false) => {
  //   let object = null
  //   const config = getConfig(url, params)
  //   const res = await CommonAxios(config, loading)
  //   if (ResponseUtils.isValidateResponse(res)) {
  //     object = {}
  //     for (let i = 0; i < listProperties.length; i++) {
  //       const property = listProperties[i]
  //       if (res.data.data.hasOwnProperty(property)) {
  //         object[property] = res.data.data[property]
  //       }
  //     }
  //   }
  //   return object
  // },
  getObject: async (url, params, properties = [], listProperty = 'list', loading = false) => {
    let object = null
    const config = getConfig(url, params)
    const res = await CommonAxios(config, loading)
    if (ResponseUtils.isValidateResponse(res)) {
      object = {}
      for (let i = 0; i < properties.length; i++) {
        const property = properties[i]
        if (res.data.data.hasOwnProperty(property)) {
          object[property] = res.data.data[property]
        }
      }
      if (res.data.data.hasOwnProperty('list')) object['list'] = res.data.data[listProperty]
    }
    return object
  },
  // getSimpleObject: async (url, params, properties = [], loading = false) => {
  //   let object = null
  //   const config = getConfig(url, params)
  //   const res = await CommonAxios(config, loading)
  //   if (ResponseUtils.isValidateResponse(res)) {
  //     object = {}
  //     for (let i = 0; i < properties.length; i++) {
  //       const property = properties[i]
  //       if (res.data.data.hasOwnProperty(property)) {
  //         object[property] = res.data.data[property]
  //       }
  //     }
  //   }
  //   return object
  // },
  getMultiObjectMultiList: async (url, params, objectProperties, listProperties, loading = false) => {
    let object = null
    const config = getConfig(url, params)
    const res = await CommonAxios(config, loading)
    if (ResponseUtils.isValidateResponse(res)) {
      object = {}
      for (let i = 0; i < objectProperties.length; i++) {
        const objectProperty = objectProperties[i]
        if (res.data.data.hasOwnProperty(objectProperty)) {
          object[objectProperty] = res.data.data[objectProperty]
        }
      }
      for (let i = 0; i < listProperties.length; i++) {
        const listProperty = listProperties[i]
        if (res.data.data.hasOwnProperty(listProperty)) {
          object[listProperty] = res.data.data[listProperty]
        }
      }
    }
    return object
  },
  getSimpleResponse: async (url, params, loading = false) => {
    let object = null
    const config = getConfig(url, params)
    const res = await CommonAxios(config, loading)
    if (ResponseUtils.isValidateResponse(res)) {
      object = res.data.data
    }
    return object
  },
  getFileUploadResponse: async (file, loading = false) => {
    let object = null
    const formData = new FormData()
    formData.append('file', file)
    const res = await CommonAxios(getFileUploadConfig(formData))
    if (ResponseUtils.isValidateResponse(res)) {
      object = res.data.data
    }
    return object
  },
  // getMultiFileUploadResponse: async (files) => {
  //   let successFileNames = []
  //   let errorFileNames = []
  //   for (let i = 0; i < files.length; i++) {
  //     const file = files[i]
  //     const formData = new FormData()
  //     formData.append('file', file)
  //     const res = await CommonAxios(getFileUploadConfig(formData), false)
  //     if (ResponseUtils.isFileUploadValidateResponse(res)) {
  //       successFileNames.push(res.data.data)
  //     } else {
  //       errorFileNames.push(res.data.data)
  //     }
  //   }
  //   return { successFileNames: successFileNames, errorFileNames: errorFileNames }
  // },
  // isFileUploadValidateResponse: (res) => {
  //   let r = false
  //   if (res) {
  //     if (res.status === 200) {
  //       if (res.data) {
  //         if (res.data.hasOwnProperty('code')) {
  //           if (res.data.code === '200') {
  //             r = true
  //           }
  //         }
  //       }
  //     }
  //   }
  //   return r
  // },
  getIrSimpleResponse: async (url, params = null, loading = false) => {
    let object = null
    const config = getConfig(url, params)
    const res = await CommonAxios(config, loading)
    if (ResponseUtils.isValidateResponse(res)) {
      object = res.data.data
    }
    return object
  }
}

export default ResponseUtils
