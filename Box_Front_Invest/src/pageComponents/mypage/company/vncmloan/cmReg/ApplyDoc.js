import { FiberManualRecordOutlined } from '@mui/icons-material'
import { Button, Divider, Grid, Stack, Typography, useTheme } from '@mui/material'
import { BtContentGrid } from 'components/bt/BtContentGrid'
import { fileDownload } from 'modules/utils/CommonAxios'
import VnentrLonCmRegFileInput from 'pageComponents/mypage/company/vncmloan/cmReg/FileInput'
import { memo } from 'react'

const fileVO = { fileNm: null, fileId: null, isAutoUploaded: false }

const VnentrLonCmRegViewApplyDoc = (props) => {
  const { applyDoc, changeApplyDoc, readOnly, onClickFile } = props
  const theme = useTheme()

  const inputMaker = (key) => {
    return (
      <VnentrLonCmRegFileInput
        filename={applyDoc[key].fileNm}
        isAuto={applyDoc[key].isAutoUploaded}
        onFileUpload={(file) => {
          changeApplyDoc(key, { ...file, isAutoUploaded: false })
        }}
        onRemoveFile={() => {
          changeApplyDoc(key, { ...fileVO })
        }}
        readOnly={readOnly}
        onFileNameClick={() => {
          onClickFile(applyDoc[key])
        }}
      />
    )
  }

  // 양식 다운로드
  const onClickVnentrLonCmReg = async () => {
    const params = {
      fileId: 'e625d36d-1d50-4aaf-95ee-8e3cbe9f9dbf',
      fileNm: 'IBK벤처대출 지원신청서 양식.hwp'
    }

    await fileDownload(params)
  }

  return (
    <>
      <Stack direction={'row'} spacing={2}>
        <Typography flexGrow={1} variant="h3">
          <FiberManualRecordOutlined color="primary" sx={{ mr: 1, fontSize: '1rem' }} />
          IBK벤처대출 지원신청서
        </Typography>
        <Button variant="outlined" disabled={readOnly} onClick={onClickVnentrLonCmReg}>
          IBK벤처대출 지원신청서 양식
        </Button>
      </Stack>
      <Divider sx={{ height: '1px', backgroundColor: theme.palette.primary.main }} />

      <Stack direction={'column'} spacing={1}>
        <Grid container sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
          <BtContentGrid gridXs={6} title={'지원신청서'}>
            {inputMaker('sprnApfr')}
          </BtContentGrid>
        </Grid>
      </Stack>
      <Stack direction={'column'} spacing={1}>
        <Grid container sx={{ borderTop: `1px solid ${theme.palette.divider}` }}></Grid>
      </Stack>
    </>
  )
}
export default memo(VnentrLonCmRegViewApplyDoc)
