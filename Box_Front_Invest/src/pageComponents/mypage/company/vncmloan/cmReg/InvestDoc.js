import { FiberManualRecordOutlined } from '@mui/icons-material'
import { Button, Divider, Grid, Stack, Typography, useTheme } from '@mui/material'
import { BtContentGrid } from 'components/bt/BtContentGrid'
import VnentrLonCmRegFileInput from 'pageComponents/mypage/company/vncmloan/cmReg/FileInput'
import { memo, useRef } from 'react'
import { fileDownload } from 'modules/utils/CommonAxios'

const fileVO = { fileNm: null, fileId: null, isAutoUploaded: false }

const VnentrLonCmRegViewInvestDoc = (props) => {
  const { investDoc, changeInvestDoc, readOnly, onClickFile } = props
  const theme = useTheme()
  const inputMaker = (key) => {
    return (
      <VnentrLonCmRegFileInput
        filename={investDoc[key].fileNm}
        isAuto={investDoc[key].isAutoUploaded}
        onFileUpload={(file) => {
          changeInvestDoc(key, { ...file, isAutoUploaded: false })
        }}
        onRemoveFile={() => {
          changeInvestDoc(key, { ...fileVO })
        }}
        readOnly={readOnly}
        onFileNameClick={() => {
          onClickFile(investDoc[key])
        }}
      />
    )
  }

  // 양식 다운로드
  const onClickVnentrLonCmReg = async (id) => {
    const params = {
      fileId: '',
      fileNm: ''
    }
    if (id === 'invtCnfrmn') {
      params.fileId = 'c0ff2862-e7c5-421c-9cdc-17f472d64f89'
      params.fileNm = '투자 확인서 양식.hwp'
    } else if (id === 'cptalUsgpln') {
      params.fileId = 'a7e22372-0609-4124-8398-124f113d6449'
      params.fileNm = '자금사용계획서 양식.hwp'
    }

    await fileDownload(params)
  }

  return (
    <>
      <Stack direction={'row'} spacing={2}>
        <Typography flexGrow={1} variant="h3">
          <FiberManualRecordOutlined color="primary" sx={{ mr: 1, fontSize: '1rem' }} />
          IBK벤처대출 투자확인서, 자금사용계획서
        </Typography>

        <Button variant="outlined" disabled={readOnly} onClick={() => onClickVnentrLonCmReg('invtCnfrmn')}>
          투자 확인서 양식
        </Button>
        <Button variant="outlined" disabled={readOnly} onClick={() => onClickVnentrLonCmReg('cptalUsgpln')}>
          자금사용계획서 양식
        </Button>
      </Stack>
      <Divider sx={{ height: '1px', backgroundColor: theme.palette.primary.main }} />

      <Stack direction={'column'} spacing={1}>
        <Grid container sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
          <BtContentGrid gridXs={6} title={'투자확인서'}>
            {inputMaker('invtCnfrmn')}
          </BtContentGrid>

          <BtContentGrid gridXs={6} title={'자금사용계획서'}>
            {inputMaker('cptalUsgpln')}
          </BtContentGrid>
        </Grid>
      </Stack>
    </>
  )
}
export default memo(VnentrLonCmRegViewInvestDoc)
