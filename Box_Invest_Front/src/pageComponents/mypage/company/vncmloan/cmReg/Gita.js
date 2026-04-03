import { useState, useEffect, useRef, useCallback, useContext } from 'react'
import { FiberManualRecordOutlined, CloudUploadOutlined, Close } from '@mui/icons-material'
import { Grid, Box, Button, Divider, Stack, Typography, useTheme, IconButton } from '@mui/material'
import { BtContentGrid } from 'components/bt/BtContentGrid'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'

import { FileUploadExtOpt, FileUploadSizeOpt } from 'modules/consts/BizConst'
import { createKey } from 'modules/utils/CommonUtils'

const VnentrLonCmRegViewGita = (props) => {
  const { onAddFile, gita, onRemove, readOnly, onFileNameClick } = props
  const theme = useTheme()

  const [isDragging, setIsDragging] = useState(false)

  const fileId = useRef(1)
  const dragRef = useRef(null)
  const inputRef = useRef()
  const alertPopRef = useRef()

  const onChangeFiles = useCallback(
    (e) => {
      if (readOnly) return

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
            file: file
          }
        ]
      }
      onAddFile(filedAdded)
    },
    [gita]
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

  useEffect(() => {
    if (inputRef.current) inputRef.current.addEventListener('change', onChangeFiles)

    return () => {
      if (inputRef.current) inputRef.current.removeEventListener('change', onChangeFiles)
    }
  }, [onChangeFiles])

  return (
    <>
      <AlertPopup ref={alertPopRef} />
      <Stack direction={'column'} spacing={1}>
        <Typography variant="h3">
          <FiberManualRecordOutlined color="primary" sx={{ mr: 1, fontSize: '1rem' }} />
          기타 파일 첨부
        </Typography>
        <Divider
          sx={{
            height: '1px',
            backgroundColor: theme.palette.primary.main
          }}
        />
      </Stack>

      <Stack direction={'column'} spacing={1}>
        <Grid container sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
          <BtContentGrid gridXs={12} title={'파일첨부'}>
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
                  {gita.length > 0 ? (
                    gita.map((fileData) => {
                      return (
                        <Box key={createKey()} width={340} alignItems={'center'} display={'flex'}>
                          <Typography
                            noWrap
                            sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                            onClick={() => {
                              onFileNameClick(fileData)
                            }}
                          >
                            {fileData.file?.name || fileData.fileNm || ''}
                          </Typography>
                          {!readOnly && (
                            <IconButton onClick={() => onRemove(fileData)} size="small">
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
                    <Button
                      variant="outlined"
                      onClick={() => {
                        inputRef.current.click()
                      }}
                    >
                      파일 첨부
                    </Button>
                  </div>
                  <Typography variant="body2" sx={{ color: theme.palette.text.sub }}>
                    * pptx, doc, docx, hwp, pdf 100MB 이내
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

export default VnentrLonCmRegViewGita
