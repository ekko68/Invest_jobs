import { useEffect, useState, useRef, useCallback } from 'react'
import { CloudUploadOutlined, CheckBox, Close } from '@mui/icons-material'
import { Grid, Box, Stack, Typography, useTheme, TextField, Button, IconButton } from '@mui/material'
import { BtContentGrid } from 'components/bt/BtContentGrid'
import { createKey } from 'modules/utils/CommonUtils'
import { FileUploadExtOpt, FileUploadSizeOpt } from 'modules/consts/BizConst'

//이미지 미리보기 등록/삭제
const DocFileUpload = (props) => {
  const { docComponents } = props
  const [selectedImages, setSelectedImages] = useState([])
  const [tempImages, setTempImages] = useState([])
  const [deleteImages, setDeleteImages] = useState([])
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
          {
            fileKey: fileId.current++,
            fileData: file
          }
        ]
      }

      console.log('filedAdded = ', filedAdded)
      docComponents.prevDocumentList = filedAdded
      console.log('docComponents.prevDocumentList = ', docComponents.prevDocumentList)
    },
    [docComponents.prevDocumentList]
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

  const handleFiles = () => {
    inputRef.current.click()
    inputRef.current.addEventListener('change', (event) => onSelectFile(event), { once: true })
  }

  //이미지 선택등록(갯수제한 10개)
  const onSelectFile = (event) => {
    const selectedFiles = event.target.files
    const selectedFilesArray = Array.from(selectedFiles)

    //선택파일 + 선택된파일리스트 + 기존에 선택되어있던 파일들
    if (selectedFiles.length !== 0) {
      if (
        selectedImages.length + selectedFilesArray.length + docComponents.prevDocumentList.length >
        docComponents.maxImages
      ) {
        alert(`최대 ${docComponents.maxImages}장까지 등록 가능합니다.`)
        event.target.value = ''
        return
      }

      if (selectedFiles[0].size > 1024 * 1024 * docComponents.maxSize) {
        alert(`최대 ${docComponents.maxSize}MB까지 등록 가능합니다.`)
        event.target.value = ''
        return
      }

      let isExtPass = true
      if (docComponents?.extension?.length > 0) {
        const ext = selectedFiles[0].name.substring(selectedFiles[0].name.lastIndexOf('.'))
        if (docComponents.extension.findIndex((e) => e === ext) < 0) isExtPass = false
      }

      if (!isExtPass) {
        alert(`해당 확장자는 등록할수 없습니다.`)
        event.target.value = ''
        return
      }

      const imagesArray = selectedFilesArray.map((file) => URL.createObjectURL(file))
      setSelectedImages((previousImages) => previousImages.concat(imagesArray))

      setTempImages(tempImages.concat({ fileData: selectedFiles[0], fileKey: imagesArray[0] }))

      event.target.value = ''
    }
  }
  //이미지 삭제
  function deleteHandler(image) {
    setSelectedImages(selectedImages.filter((e) => e !== image.fileKey))
    URL.revokeObjectURL(image.fileKey)

    setTempImages(tempImages.filter((e) => e.fileKey !== image.fileKey))
  }

  //이미지 삭제
  function preDeleteHandler(image) {
    docComponents.prevDocumentList = docComponents.prevDocumentList.filter((e) => e.fileKey !== image.fileKey)
    setDeleteImages(deleteImages.concat(image.fileData.fileId))
  }

  useEffect(() => {
    docComponents.documentList = tempImages
  }, [tempImages])

  useEffect(() => {
    docComponents.deleteFileKey = deleteImages
  }, [deleteImages])
  return (
    <Box>
      <Typography variant="h4">{docComponents.title}</Typography>
      <Grid container sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
        <BtContentGrid gridXs={12} title={'파일첨부'} required>
          <Stack direction={'column'} spacing={2} sx={{ width: '100%' }}>
            <Box
              sx={{ p: 2, boxSizing: 'border-box', width: '100%', backgroundColor: theme.palette.background.default }}
              ref={dragRef}
            >
              {selectedImages.length > 0 || docComponents.prevDocumentList.length > 0 ? (
                <Stack
                  direction="column"
                  justifyContent="center"
                  sx={{ borderRadius: 3, p: 3, border: `3px solid ${theme.palette.disabled.light}` }}
                >
                  {docComponents.prevDocumentList &&
                    docComponents.prevDocumentList.map((image, idx) => {
                      return (
                        <>
                          <Box key={createKey()} width={600} alignItems={'center'} display={'flex'}>
                            <Typography>{image.fileData.name}</Typography>
                            <IconButton
                              onClick={() => preDeleteHandler(image)}
                              size="small"
                              sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                            >
                              <Close />
                            </IconButton>
                          </Box>
                        </>
                      )
                    })}
                  {tempImages &&
                    tempImages.map((image, idx) => {
                      return (
                        <>
                          <Box key={createKey()} width={600} alignItems={'center'} display={'flex'}>
                            <Typography>{image.fileData.name}</Typography>
                            <IconButton
                              onClick={() => deleteHandler(image)}
                              size="small"
                              sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                            >
                              <Close />
                            </IconButton>
                          </Box>
                        </>
                      )
                    })}
                </Stack>
              ) : (
                <Stack
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ borderRadius: 3, p: 3, border: `3px solid ${theme.palette.disabled.light}` }}
                >
                  <CloudUploadOutlined sx={{ color: theme.palette.disabled.light, fontSize: '4rem' }} />
                  <Typography sx={{ textAlign: 'center' }}>
                    파일을 드래그해서 올려 놓거나,
                    <br />
                    파일첨부 버튼을 눌러 파일을 등록해 주세요.
                  </Typography>
                </Stack>
              )}
            </Box>
            <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
              <input
                type="file"
                id={'file'}
                accept={FileUploadExtOpt.DOC.str}
                name="images"
                style={{ display: 'none' }}
                multiple
                ref={inputRef}
              />

              <Button variant="outlined" onClick={handleFiles}>
                파일 첨부
              </Button>
              <Typography variant="body2" sx={{ color: theme.palette.text.sub }}>
                {docComponents.content}
              </Typography>
            </Stack>
          </Stack>
        </BtContentGrid>
      </Grid>
    </Box>
  )
}
export default DocFileUpload
