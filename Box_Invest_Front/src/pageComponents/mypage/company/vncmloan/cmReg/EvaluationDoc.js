import { useState, useEffect, useRef, useContext, memo } from 'react'
import { useHistory } from 'react-router-dom'
import { FiberManualRecordOutlined, HomeOutlined, CheckOutlined, CloseOutlined } from '@mui/icons-material'
import { Grid, Button, Divider, Stack, Typography, useTheme } from '@mui/material'
import { BtContentGrid } from 'components/bt/BtContentGrid'

import VnentrLonCmRegFileInput from 'pageComponents/mypage/company/vncmloan/cmReg/FileInput'
import { fileDownload } from 'modules/utils/CommonAxios'

const fileVO = { fileNm: null, fileId: null, isAutoUploaded: false }

const VnentrLonCmRegViewEvalutaionDoc = (props) => {
  const { evaluationDoc, changeEvalutaionDoc, readOnly, onClickFile } = props
  const theme = useTheme()

  const inputMaker = (key) => {
    return (
      <VnentrLonCmRegFileInput
        filename={evaluationDoc[key].fileNm}
        isAuto={evaluationDoc[key].isAutoUploaded}
        onFileUpload={(file) => {
          changeEvalutaionDoc(key, { ...file, isAutoUploaded: false })
        }}
        onRemoveFile={() => {
          changeEvalutaionDoc(key, { ...fileVO })
        }}
        readOnly={readOnly}
        onFileNameClick={() => {
          onClickFile(evaluationDoc[key])
        }}
      />
    )
  }
  // 양식 다운로드
  const onClickPersonalInfo = async (id) => {
    const params = {
      fileId: '',
      fileNm: ''
    }
    if (id === 'inquiry') {
      params.fileId = '3416c326-fc2d-49e0-aaa5-2f722916a7d8'
      params.fileNm = '개인(신용)정보 조회동의서.pdf'
    } else if (id === 'collection') {
      params.fileId = '87494bec-5fc0-4cae-b046-f774bcf8bf0f'
      params.fileNm = '개인(신용)정보 수집 이용 동의서.pdf'
    }
    await fileDownload(params)
  }

  return (
    <>
      <Stack direction={'column'} spacing={1}>
        <Typography variant="h3">
          <FiberManualRecordOutlined color="primary" sx={{ mr: 1, fontSize: '1rem' }} />
          신용평가에 필요한 기타 서류
        </Typography>
        <Divider sx={{ height: '1px', backgroundColor: theme.palette.primary.main }} />
      </Stack>

      <Stack direction={'row'} alignItems={'center'} spacing={2}>
        <Typography flexGrow={1} sx={{ color: theme.palette.text.sub }}>
          • 우측의 각 동의서를 다운로드 받으시고 대표님 서명 후 스캔하셔서 파일 첨부해 주세요.
        </Typography>
        <Button variant="outlined" disabled={readOnly} onClick={() => onClickPersonalInfo('inquiry')}>
          개인(신용)정보 조회동의서
        </Button>
        <Button variant="outlined" disabled={readOnly} onClick={() => onClickPersonalInfo('collection')}>
          개인(신용)정보 수집 이용 동의서
        </Button>
      </Stack>

      <Stack direction={'column'} spacing={1}>
        <Grid container sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
          <BtContentGrid gridXs={6} title={'개인(신용)정보 조회동의서'}>
            {inputMaker('innfInqCosn')}
          </BtContentGrid>

          <BtContentGrid gridXs={6} title={'개인(신용)정보 수집 이용 동의서'}>
            {inputMaker('innfClusCosn')}
          </BtContentGrid>
        </Grid>
      </Stack>
    </>
  )
}
export default memo(VnentrLonCmRegViewEvalutaionDoc)
