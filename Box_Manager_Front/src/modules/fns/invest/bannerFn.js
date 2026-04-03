import CommonAxios from '../../utils/CommonAxios'
import { getFileUploadConfig } from '../../utils/CommonUtils'
import ResponseUtils from '../../utils/ResponseUtils'
import * as commonFn from '../commonFn'

/** toggle checkbox handler */
const handleToggle = (e, id, bannerList, setBannerList) => {
  const status = e.target.checked ? 'Y' : 'N'
  const tempBannerList = bannerList.map((item) => (item.bnnrSqn === id ? { ...item, expuYn: status } : item))
  setBannerList(tempBannerList)
}

/** add file button, img tag, image name input onClick */
const handleAddImage = (id) => {
  const el = document.querySelector(`#banner_file_${id}`)
  if (el) el.click()
}

/** hidden file input onChange */
const handleGetImageFileInfo = async (e, bannerList, setBannerList) => {
  const { id, files } = e.target
  const input = document.querySelector(`#${id}`)

  if (commonFn.handleFileFormatCheck(e)) {
    if (!files[0]) return
    let object = null
    const formData = new FormData()
    formData.append('file', files[0])
    const res = await CommonAxios('IVT', getFileUploadConfig(formData))
    if (ResponseUtils.isValidateResponse(res)) {
      object = res.data.data
    }
    const tempBannerList = bannerList.map((item) =>
      id.includes(item.bnnrSqn) ? { ...item, expuYn: 'Y', fileInfo: object } : item
    )
    setBannerList(tempBannerList)
  } else {
    alert('업로드할 수 없는 파일입니다.')
    input.value = ''
  }
  input.removeEventListener('change', handleGetImageFileInfo)
}

/** banner info delete button onClick */
const handleDelete = (id, bannerList, bannerListVo, setBannerList, setConfirmDelete) => {
  const tempBannerList = bannerList.map((item) =>
    item.bnnrSqn === id ? { ...bannerListVo, bnnrSqn: id, bnnrLnknUrl: 'http://' } : item
  )
  // document.querySelector(`#banner_file_${getId}`).value = null // hidden file input value delete.
  // document.querySelector(`#banner_content_${getId}`).value = ''
  // document.querySelector(`#banner_title_${id}`).value = ''
  // document.querySelector(`#banner_btn_text_${getId}`).value = ''
  // document.querySelector(`#banner_url_${getId}`).value = 'http://'
  setBannerList(tempBannerList)
  setConfirmDelete(null) // confirm popup init
}

/** text type inputs change handle */
const handleChangeInputTexts = (e, id, fn, bannerList, setBannerList) => {
  const tempBannerList = bannerList.map((item) => {
    return item.bnnrSqn === id ? fn(item) : item
  })
  setBannerList(tempBannerList)
}

/** save handle */
const handleSave = async (data, setAlertImg, saveFn, getListFn, setAlert) => {
  // if (validationMainGallery(async () => console.log('API 호출'), bannerList, setAlertImg)) {
  if (validationMainGallery(async () => console.log('API 호출'), data?.list, setAlertImg)) {
    await saveFn(data).then((res) => {
      if (res.data.code === '200') {
        setAlert({
          status: true,
          msg: '저장이 완료되었습니다.'
        })
        getListFn()
      } else {
        setAlert({
          status: true,
          msg: '저장에 실패하였습니다'
        })
      }
    })
  }
}

/** validation bannerList function */
const validationMainGallery = (fn, bannerList, setAlertImg) => {
  // toggle === true && no image
  const activeBannerList = bannerList.filter((item) => item.expuYn === 'Y')
  const tempBannerList = activeBannerList.filter((item) => !item.fileInfo?.imgUrl)
  if (activeBannerList.length === 0) {
    alert('활성화된 이미지가 없습니다')
    return
  }
  if (tempBannerList.length === 0) {
    fn()
    return true
  }
  setAlertImg(true) // 활성화된 배너중 등록된 이미지가 없습니다.
}
//
// const validationMainGallery = (fn, getBannerList, bannerList, setAlertImg) => {
//   // toggle === true && no image
//   const activeBannerList = bannerList.filter((item) => item.expuYn === 'Y')
//   const tempBannerList = activeBannerList.filter((item) => !item.fileInfo?.imgUrl)
//   if (activeBannerList.length === 0) {
//     alert('활성화된 이미지가 없습니다')
//     return
//   }
//   if (tempBannerList.length === 0) {
//     fn(bannerList).then((res) => {
//       if (res.data.code === 200) {
//         console.log('Success!')
//         getBannerList()
//       }
//     })
//
//     return
//   }
//   setAlertImg(true) // 활성화된 배너중 등록된 이미지가 없습니다.
// }

/** popup review */
const handlePopupPreview = (setPopupPreview, popupPreview, bannerList, setAlertImg) =>
  validationMainGallery(() => setPopupPreview(!popupPreview), bannerList, setAlertImg)

/** popup banner info delete confirm */
const handleConfirmDelete = (id, setConfirmDelete) => setConfirmDelete(id)

/** popup image file require alert */
const handleAlertImg = (setAlertImg, alertImg) => setAlertImg(!alertImg)

export {
  handleAddImage,
  handleAlertImg,
  handleGetImageFileInfo,
  handleChangeInputTexts,
  handleConfirmDelete,
  handleDelete,
  handlePopupPreview,
  handleSave,
  handleToggle
}
