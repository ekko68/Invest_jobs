import CommonAxios, { getConfig, getPostConfig } from "modules/utils/CommonAxios";
import {StringUtils} from "modules/utils/StringUtils";

export const createKey = () => {
    const createKey = (window.crypto || window.msCrypto).getRandomValues(new Uint32Array(1))[0];
    return createKey;
}

export const deepCopyByRecursion = (original) => {
    let clone;

    if(Array.isArray(original)) {
        clone = [];
        for(let item of original) {
            if(Array.isArray(item) || (typeof item == 'object')) clone.push(deepCopyByRecursion(item));
            else clone.push(item);
        }
    }
    else {
        clone = {};

        for(let key in original) {
            if(typeof  original[key] == 'object' && original[key] != null && original[key] != undefined) {
                clone[key] = deepCopyByRecursion(original[key]);
            }
            else clone[key] = original[key];
        }
    }

    return clone;
}

export const randomEmptyLogoImageIdx = (numberKey = null) => {
    let idx = (!isNaN(numberKey) && (numberKey !== null && numberKey !== undefined && String(numberKey).trim() !== ''))
        ? (numberKey % 12) + 1 : (createKey() % 12) + 1;

    if(idx < 10) idx = '0' + idx;
    return idx;
}

export const excelDownloadIvtByPostConfigOption = async (config, setFileName) => {
    config = {
      ...config,
      method: 'post',
      responseType: 'blob'
    }
  
    const res = await CommonAxios(config);
    console.log("config = ", config);
    console.log("res = ", res);
    if(res) {
      const blob = new Blob([res.data], { type: res.headers['content-type'] })
  
      let fileName = '';
      if(StringUtils.hasLength(setFileName)) {
          fileName = setFileName;
      } else {
        const disposition = res.headers['content-disposition'];
        fileName = StringUtils.getContentDispositionFileName(disposition, "테스트");
      }
  
      blobDownloadClick(blob, fileName);
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