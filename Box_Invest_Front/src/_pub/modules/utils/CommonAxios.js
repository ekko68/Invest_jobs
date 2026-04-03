import Axios from 'modules/utils/Axios'
import Api from "modules/consts/Api";

const CommonAxios = async (config, loading = false) => {
  if (loading) loader(true)
  return await Axios(config)
    .then((res) => {
      if (loading) loader(false);
      return res
    })
    .catch((error) => {
      if (loading) loader(false);
      return error
    })
}
export default CommonAxios

const loader = (loading = false, text = 'Loading...') => {
  document.querySelector('#loadingstate').style.display = loading ? 'flex' : 'none'
  const display = document.querySelector('#loadingstatetext')
  if (display) {
    display.innerHTML = text
  }

  // 푸터 들뜸으로 인한 scrollLock 처리 추가 (common.css 최하단에 해당 클래스 추가함 : 인포텍 제외 리액트 App 영역에서는 기존에 해당 class 없음을 확인완료)
  if(loading) {
    // window.scrollTo(0,0);
    document.body.classList.add("scrollLock");
  } else {
    document.body.classList.remove("scrollLock");
  }
}
export { loader }

const getConfig = (url, params = null) => {
  const config = {
    url: url,
    method: 'get'
  }
  if (params) {
    config.params = params
  }
  return config
}

const getPostConfig = (url, params = null) => {
  const config = {
    url: url,
    method: 'post'
  }
  if (params) {
    config.data = params
  }
  return config
}

const getFileUploadConfig = (form) => {
  const config = {
    url: Api.common.fileUpload,
    method: 'post',
    data: form,
    fileused: true
  }
  return config
}
const getFileDownloadConfig = (fileId) => {
  const config = {
    url: Api.common.fileDownload + '/' + fileId,
    method: 'get',
    responseType: 'blob'
  }
  return config
}

const getfile = async (item) => {
  const res = await CommonAxios('IVT', getFileDownloadConfig(item['fileId']))
  if (res) {
    if (res.status === 200) {
      return new File([res.data], item['fileNm'], { type: res.headers['content-type'] })
       
    }
  }
}

const fileDownload = async (item) => {
  const res = await CommonAxios(getFileDownloadConfig(item['fileId']))
  if (res) {
    if (res.status === 200) {
      const blob = new Blob([res.data], { type: res.headers['content-type'] })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.setAttribute('download', item['fileNm'])
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
    }
  }
}

export { getConfig, getPostConfig, getFileUploadConfig, getFileDownloadConfig, fileDownload, getfile}
