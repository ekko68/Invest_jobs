import React, {useContext, useEffect, useRef, useState} from 'react'
import {useHistory, useParams} from "react-router-dom";

//modules
import { UserContext } from 'modules/common/UserContext'
import {getMoreCreditCardImageDetail, saveMoreCreditCardImage} from 'modules/consts/MainApi'
import { getTotalFileSize } from 'modules/common'
import {getFileUploadConfigMain} from "modules/utils/CommonUtils";
import * as commonFn from "modules/fns/commonFn";
import CommonAxios from "modules/utils/CommonAxios";
import ResponseUtils from "modules/utils/ResponseUtils";

//components
import PageLayout from 'components/PageLayout'
import Button from "components/atomic/Button";
import PopupConfirm from 'components/PopupConfirm'
import PopupAlert from 'components/PopupAlert'

//const
const initUploadData = {fileId: "", imgFileInfo: {}};

const Write = () => {

  const { id } = useParams()
  const history = useHistory()
  const userContext = useContext(UserContext)
  const fileRef = useRef(null)

  const [cardImgForm, setCardImgForm] = useState({
    crcdCd: "", //카드발급사 코드
    crccNm: "", //카드발급사명
    crccCardImgFileId: "", //이미지 파일 ID
    crccCardImgFileUrl: "", //이미지 url
    saveUserId: "", // userId
  })
  const [popup, setPopup] = useState({active: false, type: null, text: null});
  const [uploadData, setUploadData] = useState(initUploadData);

  useEffect(async () => {
    if(id) {
      let res = await getMoreCreditCardImageDetail(id);
      if(res.data.code === "200"){
        setCardImgForm({
          ...cardImgForm,
          ...res.data.data
        });
        setUploadData({
          ...uploadData,
          fileId:  res.data.data.crccCardImgFileId,
          imgFileInfo: {
            ...uploadData.imgFileInfo,
            fileNm:  res.data.data.fileInfoVO?.fileNm,
            fileEtns:  res.data.data.fileInfoVO?.fileEtns,
            fileSize:  res.data.data.fileInfoVO.fileSize,
            imgUrl:  res.data.data.crccCardImgFileUrl,
          }
        })
      } else {
        setPopup({active: true, type: "error"});
      }
    }
  }, [id])

  const handleUpload = () => {
    if(uploadData && uploadData.fileId?.length > 0){
      return alert("최대 업로드 이미지를 초과하였습니다.\n기존 이미지를 삭제하세요.");
    }

    fileRef.current.click()
  }

  const handleGetImageFileInfo = async (e) => {
    const { files, id } = e.target
    const input = document.querySelector(`#${id}`)
    if (commonFn.handleFileFormatCheck(e)) {
      if (!files[0]) return
      let object = null
      const formData = new FormData()
      formData.append('file', files[0])
      const res = await CommonAxios('MNB', getFileUploadConfigMain(formData))
      if (ResponseUtils.isValidateResponse(res)) {
        object = res.data.data
      }
      setUploadData({
        ...uploadData,
        fileId: object.fileId,
        imgFileInfo: object
      })
      setCardImgForm({
        ...cardImgForm,
        crccCardImgFileId: object.fileId
      })
    } else {
      alert('업로드할 수 없는 파일입니다.')
      input.value = ''
    }
    input.removeEventListener('change', handleGetImageFileInfo)
  }

  const handleValidate = () => {
    if(uploadData.fileId?.length < 1) {
      return alert("이미지를 업로드 해주세요.")
    }

    setPopup({active: true, type: "check"});
  }

  const handleSave = async () => {
    let params = cardImgForm;
    params["crccCardImgFileId"] = id? cardImgForm.crccCardImgFileId : uploadData.fileId;
    params["saveUserId"] = userContext.state?.userInfo?.mngrId; //수정자 ID

    let res = await saveMoreCreditCardImage(params);
    if(res.data.code === "200"){
      setPopup({active: true, type: "confirm"});
    } else {
      setPopup({active: true, type: "error"});
    }
  }


  return (
    <PageLayout currentMenu={'mainBox'} currentCate={'mainMoreMenu'} currentPage={'mainMoreCardImg'}>
      {popup.active && popup.type === "check" && (
        <PopupConfirm msg={"수정된 내역을 저장하시겠습니까?"}>
          <Button className={'full_grey'} onClick={() => setPopup({active: false, type: null})}>
            취소
          </Button>
          <Button className={'full_blue'} onClick={handleSave} >
            확인
          </Button>
        </PopupConfirm>
      )}

      {popup.active && popup.type === "confirm" && (
        <PopupAlert msg={"수정된 내역이 저장되었습니다."}
                    handlePopup={() => history.goBack()} />
      )}

      {popup.active && popup.type === "error" && (
        <PopupAlert
          msg={'오류가 발생했습니다.'}
          handlePopup={() => setPopup({active: false, type: null})}
        />
      )}

      <div className='content_inner page_main'>
        <h4 className='page_title'>카드이미지 수정</h4>
        <div className="table_wrap main_more_card_write">
          <table className="table form_table bg_none border_none">
            <caption>기본 정보 테이블</caption>
            <colgroup>
              <col width={'13%'} />
              <col width={'*'} />
            </colgroup>
            <tbody>
            <tr>
              <th className={'ta_left'}>
                <p className="">카드발급사</p>
              </th>
              <td>
                <input type="text" className="input" name={'card'}
                       title={'카드'}
                       value={cardImgForm?.crccNm}
                       readOnly
                       disabled={true} />
              </td>
            </tr>
            <tr>
              <th className={'ta_left'}>
                <p className="">이미지 등록</p>
              </th>
              <td>
                <div className="attach_content">
                  <div className="add_file">
                    <div className="img_wrap_card">
                      {
                        uploadData && Object.keys(uploadData.imgFileInfo).length && uploadData.imgFileInfo.imgUrl ? (
                          <img src={uploadData.imgFileInfo.imgUrl} alt={uploadData.imgFileInfo.fileNm} />
                        ) : (
                          <div className="no_img">
                            <img src={require('assets/images/no_img.jpg').default} alt="이미지 없음" />
                          </div>
                        )
                      }
                    </div>
                    <div className="upload_file">
                      <input
                        type="file"
                        accept=".jpg, .jpeg, .png"
                        className={'input require input_file'}
                        hidden
                        id={'mkt_main_banner_file_input'}
                        ref={fileRef}
                        onChange={handleGetImageFileInfo}
                        title={'파일업로드'}
                      />
                      <Button className={'linear linear_blue'} onClick={handleUpload}>
                        업로드 추가
                      </Button>
                      <p className="file_size">
                        [파일 : {uploadData && uploadData?.imgFileInfo?.fileSize > 0 ? 1 : 0} / 1]
                        [용량 : {Object.keys(uploadData.imgFileInfo).length ? getTotalFileSize([uploadData?.imgFileInfo]) : 0} MB / 100 MB]
                      </p>
                    </div>
                    <div className="file_list">
                      <div className="text">{uploadData.imgFileInfo?.fileNm}</div>
                      {
                        uploadData && uploadData.fileId?.length > 0 && (
                          <Button onClick={() => setUploadData(initUploadData)}/>
                        )
                      }
                    </div>
                  </div>
                </div>
                <p className="notice highlight_red require" style={{ margin: '10px 0 10px 10px', fontSize: '13px' }}>
                  이미지 적정사이즈는 가로 780px / 세로 492px 입니다.
                </p>
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
            저장
          </Button>
        </div>

      </div>
    </PageLayout>
  )
}

export default Write
