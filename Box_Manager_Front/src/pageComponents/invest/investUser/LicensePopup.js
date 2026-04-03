import React, { useEffect, useRef, useState } from 'react'
import Button from 'components/atomic/Button'
import { StringUtils } from 'modules/utils/StringUtils'
import CommonAxios from 'modules/utils/CommonAxios'
import { blobDownloadClick, getPostConfig } from 'modules/utils/CommonUtils'
import Api from 'modules/consts/Api'
import { isSafari } from 'react-device-detect'

const LicensePopup = (props) => {
  const { usisId = '', usisNm = '', usisBzn = '', closePopup = null, handleAlert = null } = props

  const [loadData, setLoadData] = useState({
    isLoaded: false,

    isImage: false,
    isPdf: false,

    binaryUrl: ''
  })

  const loadLicenseFile = async (targetUsisId = '') => {
    if (!StringUtils.hasLength(targetUsisId)) {
      if (closePopup) closePopup()
      return
    }

    // call axios
    let config = getPostConfig(Api.invest.convertTargetLicenseDownload, { id: targetUsisId })
    config = { ...config, responseType: 'blob' }
    const res = await CommonAxios('IVT', config)
    if (res && res.status == 200) {
      // 파일 없음 -> responseType이 blob binary라 content-type으로 체크하는 것으로 해야할듯
      // if (res.data?.code == "MNB0003") {
      //     if (handleAlert) handleAlert("등록된 사업자등록증 정보가 없습니다.");
      //     if (closePopup) closePopup();
      //     return;
      // }
      // // controller exception
      // else if (res.data?.code == '400') {
      //     if (handleAlert) handleAlert("시스템오류입니다. 관리자에게 문의하세요.");
      //     if (closePopup) closePopup();
      //     return;
      // }

      const contentType = res.headers['content-type']
      const blob = new Blob([res.data], { type: contentType })
      // 이미지 파일인 경우
      if (contentType?.startsWith('image')) {
        setLoadData({
          ...loadData,
          isLoaded: true,
          isImage: true,
          binaryUrl: window.URL.createObjectURL(blob)
        })
      }
      // pdf 파일인 경우
      else if (contentType?.indexOf('application/pdf') > -1) {
        // 사파리 브라우저의 경우 pdf 뷰어가 iframe 등으로 되지 않으므로
        // 다운로드를 시킨다.
        if (isSafari) {
          // 인코딩을 할 경우에도 한글 파일명이 깨지는 현상 으로 우선 프론트에서 파일명 구성
          // const fileName = StringUtils.getContentDispositionFileName(
          //     res.headers['content-disposition'], '테스트'
          // );
          const fileName = `${usisNm}(${usisBzn?.replace('-', '')})_사업자등록증.pdf`

          blobDownloadClick(blob, fileName)
          return
        }

        const reader = new FileReader()
        reader.readAsDataURL(blob)
        console.log('')
        new Promise((resolve) => {
          reader.onload = () => {
            resolve(reader.result)
          }
        })
          .then((res) => {
            setLoadData({
              ...loadData,
              isLoaded: true,
              isPdf: true,
              binaryUrl: res
            })
          })
          .catch((err) => {
            console.error(err)
            if (handleAlert) handleAlert('시스템오류입니다. 관리자에게 문의하세요.')
            if (closePopup) closePopup()
            return
          })
      } else {
        if (handleAlert) handleAlert('등록된 사업자등록증 정보를 확인할 수 없습니다.')
        if (closePopup) closePopup()
        return
      }
    }
  }

  const iframeRef = useRef()
  const iframeBodyRef = useRef()

  useEffect(() => {
    loadLicenseFile(usisId)

    return () => {
      const iframe = document.querySelector('#licensePdfIframe')
      if (iframe) iframeBodyRef.current.removeChild(iframe)
    }
  }, [])

  return (
    <>
      {loadData.isLoaded && (
        <div className="popup_wrap popup_confirm popup_view">
          <div className="layer"></div>
          <div className="popup_container">
            {loadData.isPdf && (
              <div className="popup_content scroll" style={{ padding: '0px' }} ref={iframeBodyRef}>
                <iframe
                  // onLoad={() => {
                  //     if (!frameLoad) setFrameLoad(true)
                  // }}
                  src={loadData.binaryUrl}
                  width="100%"
                  height="100%"
                  ref={iframeRef}
                  id={'licensePdfIframe'}
                />
              </div>
            )}

            {loadData.isImage && (
              <div className="popup_content scroll">
                <img src={loadData.binaryUrl} alt="사업자 등록증" />
              </div>
            )}

            <div className="popup_footer">
              <Button className={'full_blue'} onClick={closePopup}>
                확인
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default LicensePopup
