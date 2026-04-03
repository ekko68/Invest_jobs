import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { colors } from 'assets/style/style.config'

import Button from 'components/atomic/Button'
import PopupHeader from 'components/popups/PopupHeader'
import PopupFooter from 'components/popups/PopupFooter'

import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import ConfirmPopup from 'pageComponents/common/pop/ConfirmPopup'
import MaxLengthCount from 'pageComponents/common/number/MaxLengthCount'
import CheckCloseCallBackAlertPopup from 'pageComponents/common/pop/CheckCloseCallBackAlertPopup'

import { CommonContext } from 'modules/contexts/common/CommomContext'
import { createKey, deepCopyByRecursion } from 'modules/utils/CommonUtils'
import { StringUtils } from 'modules/utils/StringUtils'
import { exeFunc, setFunc } from 'modules/utils/ReactUtils'
import CommonAxios, { getPostConfig } from 'modules/utils/CommonAxios'
import { AlertLabels, FileUploadExtOpt, FileUploadSizeOpt } from 'modules/consts/BizConst'
import ResponseUtils from 'modules/utils/ResponseUtils'
import { isNumber } from 'modules/utils/NumberUtils'

const SendFormPopup = forwardRef((props, ref) => {
  const { title = '메시지 보내기', sendApi = '', refreshList = null, invmExntRqstId = '' } = props

  const commonContext = useContext(CommonContext)
  const initVo = {
    msgTtl: '',
    msgCon: '',
    prnsMsgId: '',
    fileList: []
  }

  useImperativeHandle(ref, () => ({
    open,
    close
  }))

  const fileRef = useRef()
  const msgConCntRef = useRef()

  const alertPopupRef = useRef()
  const cancelPopupRef = useRef()
  const confirmPopupRef = useRef()
  const successAlertPopupRef = useRef()

  const fileListValidateRef = useRef({
    totalSize: 0,
    fileCnt: 0,
    isNewFileSet: false
  })

  const [isOpen, setIsOpen] = useState(false)
  const [vo, setVo] = useState({ ...initVo })
  const [fileTotalSize, setFileTotalSize] = useState(0)

  const open = async (prnsMsgId, parentTtl, invmExntRqstId) => {
    if (StringUtils.hasLength(sendApi)) {
      const _vo = { ...initVo }
      if (StringUtils.hasLength(prnsMsgId)) _vo.prnsMsgId = prnsMsgId
      if (StringUtils.hasLength(invmExntRqstId)) _vo.invmExntRqstId = invmExntRqstId // invmExntRqstId 필드는 초기값에 없음

      // 답장 제목 로직 추가
      if (StringUtils.hasLength(parentTtl)) _vo.msgTtl = 'RE: ' + parentTtl

      setVo(_vo)
      setIsOpen(true)
    }
    document.body.classList.add('popupScrollLock')
  }

  const close = () => {
    setVo({ ...initVo })
    setIsOpen(false)
    document.body.classList.remove('popupScrollLock')
  }

  const closeWithoutSubmit = async () => {
    if (
      (StringUtils.hasLength(vo.msgTtl) && !StringUtils.hasLength(vo.prnsMsgId)) || // 답장, 추가메시지의 경우 제목 자동생성
      StringUtils.hasLength(vo.msgCon) ||
      vo.fileList?.length > 0
    ) {
      exeFunc(cancelPopupRef, 'open', '입력된 내용이 있습니다. 저장하지 않고 취소 하시겠습니까?')
      return
    }
    close()
  }

  const onClickSubmit = () => {
    if (!StringUtils.hasLength(vo.msgTtl)) {
      exeFunc(alertPopupRef, 'open', '제목을 입력하세요.')
      return
    }
    if (!StringUtils.hasLength(vo.msgCon)) {
      exeFunc(alertPopupRef, 'open', '내용을 입력하세요.')
      return
    }
    exeFunc(confirmPopupRef, 'open', '메시지를 전송 하시겠습니까?')
  }

  const submit = async () => {
    if (!StringUtils.hasLength(sendApi)) return

    const message = { ...vo }
    if (StringUtils.hasLength(invmExntRqstId)) message.invmExntRqstId = invmExntRqstId

    const res = await CommonAxios(getPostConfig(sendApi, message))
    if (res?.status === 200 && res?.data?.code == '200') exeFunc(successAlertPopupRef, 'open', AlertLabels.saved)
    else exeFunc(alertPopupRef, 'open', AlertLabels.notSaved)
  }

  const successPopupCallback = async () => {
    close()
    if (refreshList !== null) await refreshList()
  }

  // todo : 파일에 관련하여 추후 재점검이 필요할 수 있음 (주로 리스트로 들어가는 경우)
  // -> 확인 사항 : state 변경 시점 정확히 체크, eventListener 지양
  const uploadFile = async (event) => {
    if (!(event.target.files?.length > 0)) {
      exeFunc(alertPopupRef, 'open', '잠시 후에 다시 시도해주세요.')
      return
    }

    const file = event.target.files[0]
    if (vo.fileList.length >= 5) {
      exeFunc(alertPopupRef, 'open', '파일은 최대 5개까지 업로드 가능합니다.')
      return
    }

    const limitSize = FileUploadSizeOpt.DEFAULT.size
    if (fileListValidateRef.current.totalSize + file.size > limitSize) {
      exeFunc(alertPopupRef, 'open', `업로드 파일 용량을 초과 하였습니다. 총 ${FileUploadSizeOpt.DEFAULT.name} 입니다.`)
      return
    }

    const ext = file.name.substring(file.name.lastIndexOf('.'))
    if (FileUploadExtOpt.MSG_DOC.list.findIndex((e) => e === ext) < 0) {
      exeFunc(alertPopupRef, 'open', '파일 확장자를 확인해 주세요.')
      return
    }

    const res = await ResponseUtils.getFileUploadResponse(file)
    if (res) {
      fileListValidateRef.current.isNewFileSet = true
      fileListValidateRef.current.totalSize += isNumber(res.fileSize) ? res.fileSize : 0
      res.rowNumber = vo.fileList?.length > 0 ? vo.fileList[vo.fileList.length - 1].rowNumber + 1 : 1

      const _vo = deepCopyByRecursion(vo)
      _vo.fileList.push(res)
      setVo(_vo)
      setFileTotalSize((fileListValidateRef.current.totalSize / (1024 * 1024)).toFixed(2))
    }
  }

  const removeFile = (item) => {
    if (!(vo.fileList?.length > 0)) return

    const _vo = deepCopyByRecursion(vo)
    const _fileList = []
    let calcTotalSize = 0

    _vo.fileList.forEach((file) => {
      if (file.rowNumber !== item.rowNumber) {
        _fileList.push(file)
        calcTotalSize += isNumber(file.fileSize) ? file.fileSize : 0
      }
    })
    _vo.fileList = _fileList
    setVo(_vo)

    fileListValidateRef.current.fileCnt = _fileList.length
    fileListValidateRef.current.totalSize = calcTotalSize

    setFileTotalSize((calcTotalSize / (1024 * 1024)).toFixed(2))
  }

  useEffect(() => {
    fileListValidateRef.current.isNewFileSet = false
  }, [vo.fileList])

  return (
    <>
      {isOpen && (
        <>
          <div className="popup_wrap popup_message_send">
            <div className="popup_layout">&nbsp;</div>
            <div className="popup_container scroll">
              <PopupHeader title={title} handlePopup={closeWithoutSubmit} />
              <div className="popup_content_inner">
                <div className="content_wrap">
                  <div className="inner_wrap">
                    <table className="table type02">
                      <caption>메시지 보내기 테이블</caption>
                      <colgroup>
                        <col width="8%" />
                        <col width="92%" />
                      </colgroup>
                      <tbody>
                        <tr>
                          <th>제목</th>
                          <td>
                            <div className="input_wrap">
                              <input
                                id={'msgTtl'}
                                title="메시지 제목"
                                type="text"
                                className={'input'}
                                maxLength={200}
                                placeholder={'제목을 입력해 주세요.'}
                                defaultValue={vo.msgTtl}
                                disabled={StringUtils.hasLength(vo.prnsMsgId)}
                                onChange={(e) => {
                                  e.target.value = StringUtils.cutStrByLimit(e.target.value, 200)
                                  setVo({ ...vo, msgTtl: e.target.value })
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <th className={'vertical_top'}>내용</th>
                          <td>
                            <div className="content_wrap">
                              <textarea
                                id={'msgCon'}
                                title="메시지 내용"
                                placeholder="내용을 입력해 주세요."
                                className="scroll"
                                defaultValue={vo.msgCon}
                                maxLength={1000}
                                onChange={(e) => {
                                  e.target.value = StringUtils.cutStrByLimit(e.target.value, 1000)
                                  setVo({ ...vo, msgCon: e.target.value })
                                  setFunc(msgConCntRef, 'setData', e.target.value.length)
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="max_count_wrap">
                      <MaxLengthCount ref={msgConCntRef} max={1000} defaultCount={String(vo.msgCon).length} />
                    </div>
                  </div>
                </div>
                <div className="attach_wrap">
                  <div className="inner_wrap">
                    <div className="attach_content">
                      <div className="title">첨부</div>
                      <div className="add_file">
                        <div className="upload_file">
                          <input
                            id={'MessageWriteUploadInput'}
                            ref={fileRef}
                            title="메시지 첨부파일"
                            type="file"
                            name="file"
                            accept={FileUploadExtOpt.MSG_DOC.str}
                            multiple={false}
                            style={{ display: 'none' }}
                            onChange={async (e) => {
                              await commonContext.actions.callbackAfterSessionRefresh(
                                async () => await uploadFile(e),
                                true,
                                true
                              )
                            }}
                          />
                          <Button
                            className={'linear blue'}
                            onClick={(e) => {
                              e.preventDefault()
                              if (!fileListValidateRef.current.isNewFileSet) fileRef.current.click()
                            }}
                          >
                            업로드 추가
                          </Button>
                          <p className="file_size">
                            [파일 :{vo.fileList.length} / 5] [용량 : {fileTotalSize} MB / 100 MB] (ppt, pptx, doc, docx,
                            pdf, hwp, zip)
                          </p>
                        </div>
                        {vo?.fileList?.map((item, index) => (
                          <div className="file_list" key={createKey()}>
                            <div className="text">{item.fileNm}</div>
                            <Button onClick={() => removeFile(item)} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <PopupFooter>
                <div className="btn_group">
                  <Button theme={colors.lightGrey} onClick={closeWithoutSubmit}>
                    취소
                  </Button>
                  <Button theme={colors.blue} onClick={onClickSubmit}>
                    보내기
                  </Button>
                </div>
              </PopupFooter>
            </div>
          </div>
          <AlertPopup ref={alertPopupRef} />
          <ConfirmPopup
            ref={confirmPopupRef}
            onConfirm={() => commonContext.actions.callbackAfterSessionRefresh(submit, true, true)}
          />
          <ConfirmPopup ref={cancelPopupRef} onConfirm={close} />
          <CheckCloseCallBackAlertPopup ref={successAlertPopupRef} callBack={successPopupCallback} />
        </>
      )}
    </>
  )
})

export default SendFormPopup
