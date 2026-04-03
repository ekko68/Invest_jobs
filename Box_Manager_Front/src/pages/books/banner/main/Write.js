import React, { useContext, useEffect, useState, useRef } from 'react'
import { useHistory, useParams } from 'react-router-dom'

//modules
import { UserContext } from 'modules/common/UserContext'
import { getBannerMainDetail, saveBannerMain } from 'modules/consts/BooksApi'
import { getTotalFileSize } from 'modules/common'
import { getFileUploadConfigBooks } from 'modules/utils/CommonUtils'
import * as commonFn from 'modules/fns/commonFn'
import CommonAxios from 'modules/utils/CommonAxios'
import ResponseUtils from 'modules/utils/ResponseUtils'
import ROUTER_NAMES from 'modules/consts/RouterConst'

//components
import PageLayout from 'components/PageLayout'
import PopupConfirm from 'components/PopupConfirm'
import Button from 'components/atomic/Button'
import PopupAlert from 'components/PopupAlert'
import Radio from 'components/atomic/Radio'

const Write = () => {
  const { id } = useParams()
  const history = useHistory()
  const userContext = useContext(UserContext)
  const pcFileRef = useRef(null)
  const moFileRef = useRef(null)

  const [bannerForm, setBannerForm] = useState({
    bnnrSqn: '', //배너 순번 - 미입력시 등록, 입력시 수정
    bnnrPhrsCon: '', //배너 문구 내용
    lrrnPhrsCon: '', //하위 문구 내용
    expuYn: 'Y', // 노출 여부
    rgsnUserId: '', //등록시 등록자 ID
    amnnUserId: '', //수정시 수정자 ID
    pcFileId: '', //배너 이미지 파일 ID - pc
    moFileId: '', //배너 이미지 파일 ID - mo
    pcImgFileInfo: {}, //배너 이미지 파일 정보 - pc
    moImgFileInfo: {}, //배너 이미지 파일 정보 - mo
    bnnrLnknUrl: '' //링크
  })
  const [popup, setPopup] = useState({ active: false, type: null, text: null })
  const [uploadData, setUploadData] = useState({
    pcFileId: '',
    pcImgFileInfo: {},
    moFileId: '',
    moImgFileInfo: {}
  })
  const [saveData, setSaveData] = useState({})

  useEffect(async () => {
    if (id) {
      let res = await getBannerMainDetail(id)
      if (res.data.code === '200') {
        setBannerForm({
          ...bannerForm,
          ...res.data.data
        })
        setUploadData({
          ...uploadData,
          pcFileId: res.data.data.bnnrImgFileId,
          moFileId: res.data.data.mblBanImgFileId,
          pcImgFileInfo: {
            ...uploadData.pcImgFileInfo,
            fileNm: res.data.data.pcFileNm,
            fileEtns: res.data.data.pclFileEtns,
            fileSize: res.data.data.pcFileSize,
            imgUrl: res.data.data.pcImgUrl
          },
          moImgFileInfo: {
            ...uploadData.moImgFileInfo,
            fileNm: res.data.data.mblFileNm,
            fileEtns: res.data.data.mblFileEtns,
            fileSize: res.data.data.mblFileSize,
            imgUrl: res.data.data.moImgUrl
          }
        })
      }
    }
  }, [id])

  const handleText = (type, value) => {
    setBannerForm({
      ...bannerForm,
      [type]: value.replace(/[^A-Za-z0-9ㄱ-ㅎ가-힣\s`~!?@#$%•*-_=+^&*()<>[\]{};:'",.\\/|]/g, '')
    })
  }

  const handleUpload = (type) => {
    switch (type) {
      case 'pc':
        if (uploadData && uploadData.pcFileId?.length > 0) {
          return alert('최대 업로드 PC 이미지를 초과하였습니다.\n기존 이미지를 삭제하세요.')
        }
        pcFileRef.current.click()
        break
      case 'mo':
        if (uploadData && uploadData.moFileId?.length > 0) {
          return alert('최대 업로드 Mobile 이미지를 초과하였습니다.\n기존 이미지를 삭제하세요.')
        }
        moFileRef.current.click()
    }
  }

  const handleGetImageFileInfo = async (e, type) => {
    const { files, id } = e.target
    const input = document.querySelector(`#${id}`)
    if (commonFn.handleFileFormatCheck(e)) {
      if (!files[0]) return
      let object = null
      const formData = new FormData()
      formData.append('file', files[0])
      const res = await CommonAxios('BKB', getFileUploadConfigBooks(formData))
      if (ResponseUtils.isValidateResponse(res)) {
        object = res.data.data
      }
      setUploadData({
        ...uploadData,
        [`${type}FileId`]: object.fileId,
        [`${type}ImgFileInfo`]: object
      })
    } else {
      alert('업로드할 수 없는 파일입니다.')
      input.value = ''
    }
    input.removeEventListener('change', handleGetImageFileInfo)
  }

  const handleValidate = () => {
    let params = bannerForm
    if (params?.bnnrPhrsCon?.length < 3) {
      return alert('메인 타이틀을 최소 3자 이상 입력해주세요.')
    }

    if (uploadData.pcFileId?.length < 1) {
      return alert('PC 이미지를 업로드 해주세요.')
    }

    if (uploadData.moFileId?.length < 1) {
      return alert('Mobile 이미지를 업로드 해주세요.')
    }

    setPopup({ active: true, type: 'check', text: id ? '수정된 내역을 저장하시겠습니까?' : '등록하시겠습니까?' })
  }

  const handleSave = async () => {
    let params = bannerForm
    params['bnnrImgFileId'] = uploadData.pcFileId
    params['mblBanImgFileId'] = uploadData.moFileId

    if (id) {
      params['amnnUserId'] = userContext.state?.userInfo?.mngrId //수정자 ID
    } else {
      params['rgsnUserId'] = userContext.state?.userInfo?.mngrId //등록자 ID
    }

    let res = await saveBannerMain(params)
    if (res.data.code === '200') {
      setSaveData(res.data.data)
      setPopup({ active: true, type: 'confirm', text: id ? '수정된 내역이 저장되었습니다.' : '배너가 등록되었습니다.' })
    } else {
      setPopup({ active: true, type: 'error' })
    }
  }

  const handleInitUploadData = (type) => {
    setUploadData({
      ...uploadData,
      [`${type}FileId`]: '',
      [`${type}ImgFileInfo`]: {}
    })
  }

  return (
    <PageLayout currentMenu={'books'} currentCate={'booksBanner'} currentPage={'booksBannerMain'}>
      {popup.active && popup.type === 'check' && (
        <PopupConfirm msg={popup.text}>
          <Button className={'full_grey'} onClick={() => setPopup({ active: false, type: null })}>
            취소
          </Button>
          <Button className={'full_blue'} onClick={handleSave}>
            확인
          </Button>
        </PopupConfirm>
      )}

      {popup.active && popup.type === 'confirm' && (
        <PopupAlert
          msg={popup.text}
          handlePopup={() => history.push(`${ROUTER_NAMES.BOOKS_BANNER_MAIN_VIEW}/${saveData.bnnrSqn}`)}
        />
      )}

      {popup.active && popup.type === 'error' && (
        <PopupAlert msg={'에러가 발생했습니다.'} handlePopup={() => setPopup({ active: false, type: null })} />
      )}

      <div className="content_inner page_books books_write">
        <h4 className="page_title">메인배너 {id ? '수정' : '등록'}</h4>
        <div className="table_wrap">
          <table className="table form_table bg_none border_none">
            <caption>기본 정보 테이블</caption>
            <colgroup>
              <col width={'13%'} />
              <col width={'*'} />
            </colgroup>
            <tbody>
              <tr>
                <th className={'ta_left'}>
                  <p className="">메인타이틀</p>
                </th>
                <td>
                  <input
                    type="text"
                    className="input"
                    value={bannerForm.bnnrPhrsCon}
                    maxLength={34}
                    onChange={(e) => handleText('bnnrPhrsCon', e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <th />
                <td>
                  <div className="limit">{`${bannerForm.bnnrPhrsCon?.length || 0}/34`}</div>
                </td>
              </tr>

              <tr>
                <th className={'ta_left'}>
                  <p className="">서브타이틀</p>
                </th>
                <td>
                  <textarea
                    className={'textarea h100'}
                    value={bannerForm.lrrnPhrsCon}
                    maxLength={47}
                    onChange={(e) => handleText('lrrnPhrsCon', e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <th />
                <td>
                  <div className="limit reduce_top">{`${bannerForm.lrrnPhrsCon?.length || 0}/47`}</div>
                </td>
              </tr>
              <tr>
                <th className={'ta_left'}>
                  <p className="">이미지 등록</p>
                </th>
                <td>
                  <>
                    <p className="notice">PC 이미지</p>
                    <div className="attach_content">
                      <div className="add_file">
                        <div className="upload_file">
                          <input
                            type="file"
                            accept=".jpg, .jpeg, .png"
                            className={'input require input_file'}
                            hidden
                            id={'books_main_banner_file_input'}
                            ref={pcFileRef}
                            onChange={(e) => handleGetImageFileInfo(e, 'pc')}
                            title={'파일업로드'}
                          />
                          <Button className={'linear linear_blue'} onClick={() => handleUpload('pc')}>
                            업로드 추가
                          </Button>
                          <p className="file_size">
                            [파일 : {uploadData && uploadData?.pcImgFileInfo?.fileSize > 0 ? 1 : 0} / 1] [용량 :{' '}
                            {Object.keys(uploadData.pcImgFileInfo).length
                              ? getTotalFileSize([uploadData?.pcImgFileInfo])
                              : 0}{' '}
                            MB / 100 MB]
                          </p>
                        </div>
                        <div className="file_list">
                          <div className="text">{uploadData.pcImgFileInfo?.fileNm}</div>
                          {uploadData && uploadData.pcFileId?.length > 0 && (
                            <Button onClick={() => handleInitUploadData('pc')} />
                          )}
                        </div>
                      </div>
                    </div>
                    <p
                      className="notice highlight_red require"
                      style={{ margin: '10px 0 30px 10px', fontSize: '13px' }}
                    >
                      PC용 메인배너 적정사이즈는 가로 1268px / 세로 231px 입니다.
                    </p>
                  </>

                  <>
                    <p className="notice">Mobile 이미지</p>
                    <div className="attach_content">
                      <div className="add_file">
                        <div className="upload_file">
                          <input
                            type="file"
                            accept=".jpg, .jpeg, .png"
                            className={'input require input_file'}
                            hidden
                            id={'books_main_banner_file_input'}
                            ref={moFileRef}
                            onChange={(e) => handleGetImageFileInfo(e, 'mo')}
                            title={'파일업로드'}
                          />
                          <Button className={'linear linear_blue'} onClick={() => handleUpload('mo')}>
                            업로드 추가
                          </Button>
                          <p className="file_size">
                            [파일 : {uploadData && uploadData?.moImgFileInfo?.fileSize > 0 ? 1 : 0} / 1] [용량 :{' '}
                            {Object.keys(uploadData.moImgFileInfo).length
                              ? getTotalFileSize([uploadData?.moImgFileInfo])
                              : 0}{' '}
                            MB / 100 MB]
                          </p>
                        </div>
                        <div className="file_list">
                          <div className="text">{uploadData.moImgFileInfo?.fileNm}</div>
                          {uploadData && uploadData.moFileId?.length > 0 && (
                            <Button onClick={() => handleInitUploadData('mo')} />
                          )}
                        </div>
                      </div>
                    </div>
                    <p
                      className="notice highlight_red require"
                      style={{ margin: '10px 0 10px 10px', fontSize: '13px' }}
                    >
                      Mobile용 메인배너 적정사이즈는 가로 640px / 세로 856px 입니다.
                    </p>
                  </>
                </td>
              </tr>
              <tr>
                <th className={'ta_left'}>
                  <p className="">링크</p>
                </th>
                <td>
                  <input
                    type="text"
                    className="input"
                    name={'link'}
                    title={'링크'}
                    value={bannerForm.bnnrLnknUrl}
                    maxLength={1000}
                    onChange={(e) => handleText('bnnrLnknUrl', e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <th className={'ta_left'}>공개여부</th>
                <td>
                  <Radio
                    radio={{ id: 'Y', value: '공개' }}
                    onChange={() => setBannerForm({ ...bannerForm, expuYn: 'Y' })}
                    checked={bannerForm.expuYn === 'Y'}
                  />
                  <Radio
                    radio={{ id: 'N', value: '비공개' }}
                    onChange={() => setBannerForm({ ...bannerForm, expuYn: 'N' })}
                    checked={bannerForm.expuYn === 'N'}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="warning_wrap">
          <p className=" warning mkt_main_banner_required">&nbsp;</p>
        </div>
        <div className="rounded_btn_group">
          <Button className={'basic'} onClick={() => history.goBack()}>
            취소
          </Button>
          <Button className={'full_blue'} onClick={handleValidate}>
            {id ? '수정' : '등록'}
          </Button>
        </div>
      </div>
    </PageLayout>
  )
}

export default Write
