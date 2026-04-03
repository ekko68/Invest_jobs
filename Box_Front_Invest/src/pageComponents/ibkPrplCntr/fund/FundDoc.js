import { useState, useEffect, useRef, useCallback, useContext } from 'react'
import { FiberManualRecordOutlined, CloudUploadOutlined, Close } from '@mui/icons-material'
import { Grid, Box, Button, Divider, Stack, Typography, useTheme, IconButton } from '@mui/material'
import { BtContentGrid } from 'components/bt/BtContentGrid'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'

import { FileUploadExtOpt, FileUploadSizeOpt } from 'modules/consts/BizConst'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import { createKey } from 'modules/utils/CommonUtils'
import { isNumber } from 'modules/utils/NumberUtils'
import { exeFunc } from 'modules/utils/ReactUtils'

const FundDoc = (props) => {
  const { setEtcDoc, etcDoc, onRemove, readOnly } = props
  const theme = useTheme()

  // TODO: Drag 중일 때 box에 highlight 주면 좋다
  const [isDragging, setIsDragging] = useState(false)

  const fileId = useRef(0)
  const dragRef = useRef(null)
  const inputRef = useRef()
  const alertPopRef = useRef()

  const onChangeFiles = useCallback(
    (e) => {
      let selectFiles = []
      let filedAdded = []

      if (e.type === 'drop') {
        selectFiles = e.dataTransfer.files
      } else {
        selectFiles = e.target.files
      }

      for (const file of selectFiles) {
        filedAdded = [
          ...filedAdded,
          {
            id: fileId.current++,
            blob: file
          }
        ]
      }

      setEtcDoc((pre) => [...pre, ...filedAdded])
    },
    [etcDoc]
  )

  const handleDragIn = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  })
  const handleDragOut = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  })
  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer && e.dataTransfer.files) {
      setIsDragging(true)
    }
  })
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()

      onChangeFiles(e)
      setIsDragging(false)
    },
    [onChangeFiles]
  )
  const initDragEvents = useCallback((e) => {
    if (dragRef.current !== null) {
      dragRef.current.addEventListener('dragenter', handleDragIn)
      dragRef.current.addEventListener('dragleave', handleDragOut)
      dragRef.current.addEventListener('dragover', handleDragOver)
      dragRef.current.addEventListener('drop', handleDrop)
    }
  })
  const resetDragEvents = useCallback((e) => {
    if (dragRef.current !== null) {
      dragRef.current.removeEventListener('dragenter', handleDragIn)
      dragRef.current.removeEventListener('dragleave', handleDragOut)
      dragRef.current.removeEventListener('dragover', handleDragOver)
      dragRef.current.removeEventListener('drop', handleDrop)
    }
  })

  useEffect(() => {
    initDragEvents()

    return () => resetDragEvents()
  }, [initDragEvents, resetDragEvents])

  // useEffect(() => {
  //     inputRef.current.addEventListener('change', onChangeFiles)

  //     return () => {
  //     inputRef.current.removeEventListener('change', onChangeFiles)
  //     }
  // }, [onChangeFiles])

  const handleFiles = () => {
    inputRef.current.click()
    const options = { limitSizeOpt: FileUploadSizeOpt.DEFAULT, acceptExtOpt: FileUploadExtOpt.DOC }
    inputRef.current.addEventListener('change', (event) => onUploadFile(event, alertPopRef, options), { once: true })
  }

  const onUploadFile = (event, alertPopupRef = null, options = {}) => {
    if (event.target.files?.length > 0) {
      const file = event.target.files[0]

      const limitSizeOpt = isNumber(options?.limitSizeOpt?.size) ? options.limitSizeOpt : FileUploadSizeOpt.DEFAULT

      let isExtPass = true
      if (options?.acceptExtOpt?.list?.length > 0) {
        const ext = file.name.substring(file.name.lastIndexOf('.'))
        if (options.acceptExtOpt.list.findIndex((e) => e === ext) < 0) isExtPass = false
      }

      if (file.size > limitSizeOpt.size) {
        if (alertPopupRef)
          exeFunc(alertPopupRef, 'open', `업로드 파일 용량(${limitSizeOpt.name} 이하)을 초과 하였습니다.`)
      } else if (!isExtPass) {
        if (alertPopupRef) exeFunc(alertPopupRef, 'open', '파일 확장자를 확인해 주세요.')
      } else {
        onChangeFiles(event)
      }
    } else {
      if (alertPopupRef) exeFunc(alertPopupRef, 'open', '잠시 후에 다시 시도해주세요.')
    }

    event.target.value = ''
  }

  return (
    <>
      <AlertPopup ref={alertPopRef} />
      <Stack direction={'column'} spacing={1}>
        <Grid container sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
          <BtContentGrid gridXs={12} title={'파일 첨부'} type="download">
            <Stack direction={'column'} spacing={2} sx={{ width: '100%' }}>
              <Box
                sx={{
                  p: 2,
                  boxSizing: 'border-box',
                  width: '100%',
                  backgroundColor: isDragging ? theme.palette.primary.lighter : theme.palette.background.default
                }}
                ref={dragRef}
              >
                <Stack
                  direction="column"
                  justifyContent="center"
                  sx={{ borderRadius: 3, p: 3, border: `3px solid ${theme.palette.disabled.light}` }}
                >
                  {etcDoc.length > 0 ? (
                    etcDoc.map((file) => {
                      // TODO: file이 {fileNm, fileId} 타입으로 들어올 때 처리하기
                      return (
                        <Box key={createKey()} width={340} alignItems={'center'} display={'flex'}>
                          <Typography>{file.blob.name}</Typography>
                          {!readOnly && (
                            <IconButton
                              onClick={() => onRemove(file)}
                              size="small"
                              sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                            >
                              <Close />
                            </IconButton>
                          )}
                        </Box>
                      )
                    })
                  ) : (
                    <Stack direction="column" justifyContent="center" alignItems="center">
                      <CloudUploadOutlined sx={{ color: theme.palette.disabled.light, fontSize: '4rem' }} />
                      <Typography sx={{ textAlign: 'center' }}>
                        파일을 드래그해서 올려 놓거나,
                        <br />
                        파일첨부 버튼을 눌러 파일을 등록해 주세요.
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Box>
              {!readOnly && (
                <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
                  <div className="filebox file-add">
                    <input
                      type="file"
                      name="file"
                      accept={FileUploadExtOpt.DOC.str}
                      ref={inputRef}
                      multiple
                      style={{ display: 'none' }}
                    />
                    <Button variant="outlined" onClick={handleFiles}>
                      파일 첨부
                    </Button>
                  </div>
                  <Typography variant="body2" sx={{ color: theme.palette.text.sub }}>
                    * 사전검토표(필수), 펀드 제안서 자료 첨부.pptx, doc, docx, hwp, pdf 100MB 이내
                  </Typography>
                </Stack>
              )}
            </Stack>
          </BtContentGrid>
        </Grid>
      </Stack>
    </>
  )
}

export default FundDoc
