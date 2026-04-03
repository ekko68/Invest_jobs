import { useState, useRef, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import Button from 'components/atomic/Button'
import PageLayout from 'components/PageLayout'
import PopupConfirm from 'components/PopupConfirm'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import ResponseUtils from 'modules/utils/ResponseUtils'
import { loader } from 'modules/utils/CommonAxios'
import { getNoticeDetail, saveNoticeDetail } from 'modules/consts/InvestApi'
import { getTotalFileSize } from 'modules/common'
import { InvestContext } from 'modules/common/InvestContext'
import * as commonFn from 'modules/fns/commonFn'
import {UserContext} from "../../../modules/common/UserContext";

const initData = {
  pbnsId: '',
  pbnsTtl: '',
  pbnsCon: '',
  attachFileList: []
}
const Write = (props) => {
  const investContext = useContext(InvestContext)
  const userContext = useContext(UserContext);
  const history = useHistory()
  const id = props.match.params.id

  const [form, setForm] = useState(initData);

  // 삭제 confirm
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [confirmReg, setConfirmReg] = useState(false)

  // ===== 등록 취소
  // 등록취소팝업
  const handleConfirmCancel = () => {
    setConfirmCancel(!confirmCancel)
  }
  // 등록 취소
  const handleCancel = (type) => {
    if (type === 'confirm') {
      history.push(`${ROUTER_NAMES.INVEST_NOTICE_LIST}`)
    } else {
      handleConfirmCancel()
    }
  }

  // ===== 등록
  // 등록확인컨펌
  const handleConfirmReg = () => {
    // 필수값 체크
    if (form.pbnsTtl === '') {
      alert('제목을 입력하세요')
      return false
    }
    if (form.pbnsCon === '') {
      alert('내용을 입력하세요')
      return false
    }
    setConfirmReg(!confirmReg)
  }
  // 게시글 등록
  const handleConfirm = async (type) => {
    if (type === 'confirm') {
      loader(true, 'Uploading...')
      const res = await saveNoticeDetail({
        params: form,
        adminUser: userContext.actions.getIvtAdminUser()
      })
      if (res.data.code === '200') {
        history.push(`${ROUTER_NAMES.INVEST_NOTICE_LIST}`)
        loader()
      }
    } else {
      setConfirmReg(!confirmReg)
    }
  }

  // ==== File Upload
  let maxMegaByte = useRef(100).current
  let megaByte = useRef(1048576).current
  let maximumCnt = 3
  const onClickUpload = async () => {
    const input = document.querySelector('#uploadFile')
    if (input) {
      input.click()
      input.addEventListener('change', onChangeFile)
    }
  }

  const onChangeFile = async (event) => {
    if (commonFn.handleFileFormatCheckBoard(event)) {
      if (form.attachFileList.length + event.target.files.length > 3) {
        alert('파일은 3개까지만 가능합니다')
        event.target.value = ''
        const input = document.querySelector('#uploadFile')
        input.removeEventListener('change', onChangeFile)
        return
      }
      if (event.target.files) {
        let response = await commonFn.onChangeFileHandler(event, megaByte, maxMegaByte, maximumCnt)
        if (response && response.successFileNames) {
          setForm({
            ...form,
            attachFileList: [...form.attachFileList, ...response.successFileNames]
          })
          loader()
        }
      }
    } else {
      alert('업로드할 수 없는 파일입니다.')
    }

    event.target.value = ''
    const input = document.querySelector('#uploadFile')
    input.removeEventListener('change', onChangeFile)
  }

  // Delete Uploaded File from the List
  const onClickRemoveFile = (fileId) => {
    let temp = form.attachFileList.filter((f) => f.fileId !== fileId)
    setForm({
      ...form,
      attachFileList: temp
    })
  }

  // ===== 상세조회
  const getView = async () => {
    const res = await getNoticeDetail(id)
    if (res.data.code === '200') {
      setForm(res.data.data)
    }
  }

  useEffect(async () => {
    if (id) {
      await getView()
    } else {
      investContext.actions.handleSetSearch({
        searchContent: '',
        searchUser: '',
        page: 1
      })
    }
  }, [])

  return (
    <PageLayout currentMenu={'invest'} currentCate={'notice'}>
      {confirmCancel && (
        <PopupConfirm msg={'정말로 취소하시겠습니까?'}>
          <>
            <Button className={'full_grey_dark'} onClick={() => handleCancel('confirm')}>
              확인
            </Button>
            <Button className={'full_blue'} onClick={() => handleCancel('cancel')}>
              취소
            </Button>
          </>
        </PopupConfirm>
      )}
      {confirmReg && (
        <PopupConfirm msg={'등록하시겠습니까?'}>
          <>
            <Button className={'full_grey_dark'} onClick={() => handleConfirm('confirm')}>
              확인
            </Button>
            <Button className={'full_blue'} onClick={() => handleConfirm('cancel')}>
              취소
            </Button>
          </>
        </PopupConfirm>
      )}
      <input
        type="file"
        name="uploadFile"
        id={'uploadFile'}
        accept=".xls,.xlsx,.ppt, .haansoftpptx, .haansoftxlsx,.pptx,.doc,.docx,.pdf,.hwp,.gif,.png,.jpg,.jpeg"
        style={{ display: 'none' }}
        multiple="multiple"
        title={'파일업로드'}
      />
      <div className="content_inner page_notice">
        <h4 className="page_title">공지사항</h4>
        {/*board_view_wrap start*/}
        <div className="board_write_wrap">
          <div className="board_header">
            <p className="section_title">공지사항</p>
          </div>
          <div className="board_title">
            <input
              type="text"
              className="input"
              placeholder={'제목을 입력해주세요.'}
              value={form.pbnsTtl}
              onChange={(e) => setForm({ ...form, pbnsTtl: e.target.value })}
              title={'제목'}
            />
          </div>
          <div className="board_content">
            <textarea
              className="textarea"
              placeholder={'내용을 입력하세요.'}
              value={form.pbnsCon}
              onChange={(e) => setForm({ ...form, pbnsCon: e.target.value })}
              title={'내용'}
            />
          </div>
          {/*attach_content start*/}
          <div className="attach_content">
            <div className="title">첨부</div>
            <div className="add_file">
              <div className="upload_file">
                <Button className={'linear linear_blue'} onClick={onClickUpload}>
                  업로드 추가
                </Button>
                <p className="file_size">
                  [파일 :{form.attachFileList ? form.attachFileList.length : 0} / 3] [용량 :{' '}
                  {form.attachFileList ? getTotalFileSize(form.attachFileList) : 0} MB / 100 MB]
                </p>
              </div>
              {form?.attachFileList?.map((f, idx) => (
                <div className="file_list" key={'multiple_notice_file_' + idx}>
                  <div className="text">{f.fileNm}</div>
                  <Button onClick={() => onClickRemoveFile(f.fileId)} />
                </div>
              ))}
            </div>
          </div>
          {/*attach_content end*/}

          <div className="rounded_btn_group">
            <Button className={'full_blue'} onClick={handleConfirmReg}>
              확인
            </Button>
            <Button className={'full_red'} onClick={handleConfirmCancel}>
              취소
            </Button>
          </div>
        </div>
        {/*board_view_wrap end*/}
      </div>
    </PageLayout>
  )
}

export default Write
