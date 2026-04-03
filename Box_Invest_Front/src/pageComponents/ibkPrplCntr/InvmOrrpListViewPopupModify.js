import { useRef, useContext, useState, useMemo } from 'react'
import { Box, Button, MenuItem, Typography, Grid, IconButton } from '@mui/material'
import { CloseOutlined } from '@mui/icons-material'

import PopupConfirm from 'components/popups/PopupConfirm'
import PopupFooter from 'components/popups/PopupFooter'
import { BtSelect } from 'components/bt/BtSelect'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'

import { FileUploadExtOpt, FileUploadSizeOpt } from 'modules/consts/BizConst'
import { exeFunc } from 'modules/utils/ReactUtils'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import { isNumber } from 'modules/utils/NumberUtils'

const InvmOrrpListViewPopupModify = (props) => {
  const { onCancel, onSave, initSection, initFile } = props
  const commonContext = useContext(CommonContext)
  const inputRef = useRef()
  const alertPopupRef = useRef()
  const [section, setSection] = useState(initSection || 0)
  const [file, setFile] = useState(initFile)

  const options = { limitSizeOpt: FileUploadSizeOpt.DEFAULT, acceptExtOpt: FileUploadExtOpt.DOC }

  const sections = useMemo(() => {
    let newSections = []
    const currentYear = new Date().getUTCFullYear()
    for (let year = currentYear; year > currentYear - 5; year--) {
      newSections.push(`${year}년 4분기`)
      newSections.push(`${year}년 3분기`)
      newSections.push(`${year}년 2분기`)
      newSections.push(`${year}년 1분기`)
    }
    return newSections
  }, [])

  const sectionComp = () => {
    return (
      <BtSelect defaultValue={section}>
        <MenuItem disabled value={0}>
          선택하세요
        </MenuItem>
        {sections.map((section) => {
          return (
            <MenuItem
              value={section}
              onClick={() => {
                setSection(section)
              }}
              key={section}
            >
              {section}
            </MenuItem>
          )
        })}
      </BtSelect>
    )
  }

  const handleUploadFileLocally = () => {
    inputRef.current.click()
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
    setFile({ file: file, fileNm: file.name })
  }

  return (
    <>
      <PopupConfirm handlePopup={onCancel}>
        <div className="popup_content_wrap">
          <Grid container paddingLeft={3} paddingRight={3}>
            <Grid item xs={12}>
              <Typography className="title" fontWeight={'bold'} fontSize={20} paddingBottom={'10px'}>
                투자 운용 보고서 수정
              </Typography>
            </Grid>
            <Grid item xs={4} alignSelf={'center'}>
              <Box p={1.5} display={'flex'} justifyContent={'flex-start'}>
                <Typography> 구분 </Typography>
              </Box>
            </Grid>
            <Grid item xs={8}>
              <Box p={1.5} flexGrow={1}>
                {sectionComp()}
              </Box>
            </Grid>

            <Grid item xs={4} alignSelf={'center'}>
              <Box p={1.5} display={'flex'} justifyContent={'flex-start'}>
                <Typography> 첨부파일 </Typography>
              </Box>
            </Grid>
            <Grid item xs={8}>
              <Box p={1.5} flexGrow={1} minHeight={'60px'} display={'flex'}>
                {!file ? (
                  <>
                    <input
                      ref={inputRef}
                      title="투자 운용 보고서"
                      type="file"
                      name="file"
                      multiple={false}
                      accept={FileUploadExtOpt.DOC.str}
                      style={{ display: 'none' }}
                      onChange={handleFileInput}
                    />
                    <Button color="info" variant="outlined" fullWidth onClick={handleUploadFileLocally}>
                      파일 찾기
                    </Button>
                  </>
                ) : (
                  <Box
                    sx={{
                      borderColor: '#aaa',
                      borderRadius: '4px',
                      borderStyle: 'solid',
                      borderWidth: 'thin',
                      width: '100%'
                    }}
                    display={'flex'}
                    alignItems={'center'}
                    paddingLeft={'10px'}
                  >
                    <Typography noWrap flexGrow={1}>
                      {file.fileNm}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setFile(null)
                      }}
                    >
                      <CloseOutlined />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </div>
        <PopupFooter>
          <Grid container>
            <Grid item xs={6}>
              <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                <Button disableElevation color="primary" variant="contained" onClick={() => onCancel()}>
                  취소
                </Button>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                <Button
                  disableElevation
                  color="primary"
                  variant="contained"
                  onClick={() => onSave(section, file)}
                  disabled={!file || !section}
                >
                  저장
                </Button>
              </Box>
            </Grid>
          </Grid>
        </PopupFooter>
      </PopupConfirm>
      <AlertPopup ref={alertPopupRef} />
    </>
  )
}

export default InvmOrrpListViewPopupModify
