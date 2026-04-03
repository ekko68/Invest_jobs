import { useRef, useContext, useEffect } from 'react'
import { CheckOutlined, CloseOutlined } from '@mui/icons-material'
import { Button, IconButton, Typography, useTheme } from '@mui/material'

import AlertPopup from 'pageComponents/common/pop/AlertPopup'

import { FileUploadExtOpt, FileUploadSizeOpt } from 'modules/consts/BizConst'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import { exeFunc } from 'modules/utils/ReactUtils'
import { isNumber } from 'modules/utils/NumberUtils'

const VnentrLonCmRegFileInput = (props) => {
  const { filename, isAuto, onFileUpload, onRemoveFile, readOnly, onFileNameClick, vcType } = props

  if (!filename) {
    return (
      <>
        <TextNeedUpload />
        <DocFileInputComp
          vcType={vcType}
          onFileUpload={(file) => {
            onFileUpload(file)
          }}
        />
      </>
    )
  }

  if (isAuto) {
    return (
      <>
        <AutoCompleteMessage />
        {!readOnly && (
          <DocFileInputComp
            vcType={vcType}
            onFileUpload={(file) => {
              onFileUpload(file)
            }}
          />
        )}
      </>
    )
  }

  return (
    <>
      <Typography flexGrow={1} sx={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={onFileNameClick}>
        {filename}
      </Typography>
      {!readOnly && (
        <IconButton
          size="small"
          onClick={() => {
            onRemoveFile()
          }}
        >
          <CloseOutlined />
        </IconButton>
      )}
    </>
  )
}

const DocFileInputComp = (props) => {
  const { onFileUpload, vcType } = props

  const commonContext = useContext(CommonContext)

  const inputRef = useRef(null)
  const alertPopupRef = useRef()

  const options = {
    limitSizeOpt: FileUploadSizeOpt.DEFAULT,
    acceptExtOpt: vcType ? FileUploadExtOpt.LICENSE : FileUploadExtOpt.DOC
  }
  const handleUploadFileLocally = () => {
    inputRef.current.click()
  }

  const instalyUpload = () => {
    commonContext.actions.onClickUploadFile(
      inputRef.current,
      (res) => {
        const fileData = { fileId: res['fileId'], fileNm: res['fileNm'] }
        onFileUpload(fileData)
      },
      alertPopupRef,
      { limitSizeOpt: FileUploadSizeOpt.DEFAULT, acceptExtOpt: FileUploadExtOpt.DOC }
    )
  }
  const handleFileInput = (event) => {
    if (!(event.target.files?.length > 0)) {
      if (alertPopupRef) exeFunc(alertPopupRef, 'open', '잠시 후에 다시 시도해주세요.')
      return
    }
    const file = event.target.files[0]
    const limitSizeOpt = isNumber(options?.limitSizeOpt?.size) ? options.limitSizeOpt : FileUploadSizeOpt.DEFAULT
    let isExtPass = true
    if (options?.acceptExtOpt?.list?.length > 0) {
      const ext = file.name.substring(file.name.lastIndexOf('.'))
      if (options.acceptExtOpt.list.findIndex((e) => e === ext) < 0) isExtPass = false
    }
    if (file.size > limitSizeOpt.size) {
      if (alertPopupRef) {
        exeFunc(alertPopupRef, 'open', `업로드 파일 용량(${limitSizeOpt.name} 이하)을 초과 하였습니다.`)
      }
      return
    }
    if (!isExtPass) {
      if (alertPopupRef) {
        exeFunc(alertPopupRef, 'open', '파일 확장자를 확인해 주세요.')
      }
      return
    }
    onFileUpload({ file: file, fileNm: file.name })
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        name="file"
        multiple={false}
        accept={FileUploadExtOpt.DOC.str}
        style={{ display: 'none' }}
        onChange={handleFileInput}
      />

      <Button variant="outlined" onClick={handleUploadFileLocally}>
        파일 첨부
      </Button>
      <AlertPopup ref={alertPopupRef} />
    </>
  )
}

const TextNeedUpload = () => {
  const theme = useTheme()
  return (
    <Typography flexGrow={1} sx={{ color: theme.palette.disabled.main }}>
      파일을 등록해 주세요.
    </Typography>
  )
}

const AutoCompleteMessage = () => {
  return (
    <>
      <CheckOutlined color="primary" />
      <Typography flexGrow={1}>자동 수집 완료</Typography>
    </>
  )
}
export default VnentrLonCmRegFileInput
