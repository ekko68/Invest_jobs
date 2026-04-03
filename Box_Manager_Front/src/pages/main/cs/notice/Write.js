import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'

// modules
import { UserContext } from 'modules/common/UserContext'
import * as commonFn from 'modules/fns/commonFn'
import CommonAxios from 'modules/utils/CommonAxios'
import { getFileUploadConfigMain } from 'modules/utils/CommonUtils'
import ResponseUtils from 'modules/utils/ResponseUtils'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { NoImage02 } from 'modules/consts/Img'
import { getTotalFileSize } from 'modules/common'
import { saveCsNotice, getCsNoticeDetail } from 'modules/consts/MainApi'

//components
import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import PopupConfirm from 'components/PopupConfirm'
import PopupAlert from 'components/PopupAlert'
import {handleFileFormatCheckDocs} from "modules/fns/commonFn";

//const
const initUploadData = {fileId: "", fileInfo: {}};

const Write = () => {

  const { id } = useParams()
  const history = useHistory()
  const userContext = useContext(UserContext)
  const fileRef = useRef(null)

  const [noticeForm, setNoticeForm] = useState({
    pbnsId: "", //공지 id
    pbnsTtl: "", //제목
    pbnsCon: "", //내용
    fileId: "", //첨부파일 목록
  })
  const [popup, setPopup] = useState({active: false, type: null, text: null})
  const [uploadData, setUploadData] = useState( [initUploadData]);
  const [saveData, setSaveData] = useState({});


  useEffect(async () => {
    if(id) {
      let res = await getCsNoticeDetail({id: id});
      if(res.data?.code === "200"){
        setNoticeForm({
          ...noticeForm,
          ...res.data.data
        });

        if(res.data.data?.attachedFileList?.length > 0) {
          setUploadData([
            ...res.data.data?.attachedFileList?.map((file) => {
              return {
                fileId: file.atchId,
                fileInfo: file
              }
            })
          ])
        }

      } else {
        setPopup({active: true, type: "error"});
      }
    }
  }, [id])

  const handleText = (e) => {
    setNoticeForm({
      ...noticeForm,
      [e.target.id]: e.target.value.replace(/[^A-Za-z0-9ㄱ-ㅎ가-힣\s`~!?@#$%*-_=+^&*()<>[\]{};:'",.\\/|]/g, "")
    })
  }

  const handleUpload = () => {
    if(uploadData && uploadData.length >= 3){
      return alert("최대 업로드 파일을 초과하였습니다.\n기존 첨부한 파일을 삭제하세요.");
    }

    fileRef.current.click()
  }

  const handleGetFileInfo = async (e) => {
    const { files, id } = e.target
    const input = document.querySelector(`#${id}`)
    if (commonFn.handleFileFormatCheckDocs(e)) {
      if (!files[0]) return
      let object = null
      const formData = new FormData()
      formData.append('file', files[0])
      const res = await CommonAxios('MNB', getFileUploadConfigMain(formData))
      if (ResponseUtils.isValidateResponse(res)) {
        object = res.data.data
      }
      setUploadData([
        ...uploadData.filter((file) => file.fileId.length),
        {
          fileId: object.fileId,
          fileInfo: object
        }
      ]);
    } else {
      alert('업로드할 수 없는 파일입니다.')
      input.value = ''
    }
    input.removeEventListener('change', handleGetFileInfo)
  }

  const handleValidate = () => {
    let params = noticeForm;
    if(params?.pbnsTtl?.length < 1) {
      return alert("제목을 입력해주세요.");
    }

    if(params?.pbnsCon?.length < 1) {
      return alert("내용을 입력해주세요.");
    }

    setPopup({active: true, type: "check", text: id ? "수정된 내역을 저장하시겠습니까?" : "등록하시겠습니까?"});
  }

  const handleSave = async () => {
    let params = noticeForm;

    //첨부파일
    let attachedList = uploadData.filter((file) => file.fileId.length) || [];
    if(attachedList?.length > 0){
      params["atchIdList"] = attachedList.map((file) => file.fileId);
    }

    params["amnnUserId"] = userContext.state?.userInfo?.mngrId; //계정 ID

    let res = await saveCsNotice(params);
    if(res.data.code === "200"){
      setSaveData(res.data.data);
      setPopup({active: true, type: "confirm", text: id ? "수정된 내역이 저장되었습니다." : "게시글이 등록되었습니다."});
    } else {
      setPopup({active: true, type: "error"});
    }
  }

  const calcFileCount = () => {
    let conditionFileList = uploadData.filter((file) => file.fileId.length) || [];
    return conditionFileList.length;
  }

  const calcFileTotalSize = () => {
    let conditionFileList = uploadData.filter((file) => file.fileId.length) || [];
    let newFileList = conditionFileList.map((file) => file.fileInfo) || [];
    let totalSize = getTotalFileSize(newFileList) || 0;

    return totalSize;
  }

  const handleDeleteFile = (fileId) => {
    let originData = uploadData;
    let newFileData = originData.filter((el) => el.fileId != fileId);

    if(newFileData.length < 1) setUploadData([initUploadData]);
    else setUploadData(newFileData);
  }

  return (
    <PageLayout currentMenu={'mainBox'} currentCate={'mainCs'} currentPage={'mainCsNotice'}>
      {popup.active && popup.type === "check" && (
        <PopupConfirm msg={popup.text}>
          <Button className={'full_grey'} onClick={() => setPopup({active: false, type: null})}>
            취소
          </Button>
          <Button className={'full_blue'} onClick={handleSave} >
            확인
          </Button>
        </PopupConfirm>
      )}

      {popup.active && popup.type === "confirm" && (
        <PopupAlert msg={popup.text}
                    handlePopup={() => history.push(`${ROUTER_NAMES.MAIN_CS_NOTICE_VIEW}/${saveData?.pbnsId}`)} />
      )}

      {popup.active && popup.type === "error" && (
        <PopupAlert msg={'오류가 발생했습니다.'}
                    handlePopup={() => setPopup({active: false, type: null})} />
      )}

      <div className='content_inner page_main_notice'>
        <div className='page_header'>
          <h4 className='page_title'>공지사항 등록</h4>
        </div>

        <div className="board_write_wrap">
          <div className="board_title">
            <input
              type="text"
              className="input"
              placeholder={'제목을 입력해주세요.'}
              id={"pbnsTtl"}
              value={noticeForm.pbnsTtl}
              title={'제목'}
              onChange={handleText}
            />
          </div>
          <div className="board_content">
            <textarea
              className="textarea"
              placeholder={'내용을 입력하세요.'}
              id={"pbnsCon"}
              value={noticeForm.pbnsCon}
              title={'내용'}
              onChange={handleText}
            />
          </div>

          <div className="attach_content">
            <div className="title">첨부</div>
            <div className="add_file">
              <div className="upload_file">
                <input
                  type="file"
                  accept=".jpg, .jpeg, .png, .xls, .xlsx, .ppt, .pptx, .doc, .docx, .pdf .hwp"
                  className={'input require input_file'}
                  hidden
                  id={'mkt_main_banner_file_input'}
                  ref={fileRef}
                  onChange={handleGetFileInfo}
                  title={'파일업로드'}
                />
                <Button className={'linear linear_blue'} onClick={handleUpload}>
                  업로드 추가
                </Button>
                <p className="file_size">
                  [파일 : {calcFileCount()} / 3]
                  [용량 : {calcFileTotalSize()} MB / 100 MB]
                </p>
              </div>
              {
                uploadData && uploadData.length && (
                  uploadData.map((file) => (
                    <div className="file_list" key={file.fileId}>
                      <div className="text">{file.fileInfo.fileNm}</div>
                      {
                        file?.fileId?.length > 0 && (
                          <Button onClick={() => handleDeleteFile(file.fileId)} />
                        )
                      }
                    </div>
                  ))
                )
              }
            </div>
          </div>

          <div className="rounded_btn_group">
            <Button className={'basic'} onClick={() => history.goBack()}>
              취소
            </Button>
            <Button className={'full_blue'} onClick={handleValidate}>
              등록
            </Button>
          </div>
        </div>

      </div>
    </PageLayout>
  )
}

export default Write
