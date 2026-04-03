import { FiberManualRecordOutlined } from '@mui/icons-material'
import { Divider, Grid, Stack, Typography, useTheme } from '@mui/material'
import { BtContentGrid } from 'components/bt/BtContentGrid'
import { memo } from 'react'

import { BtAsteriskIcon } from 'components/bt/BtAsteriskIcon'
import VnentrLonCmRegFileInput from 'pageComponents/mypage/company/vncmloan/cmReg/FileInput'

const fileVO = { fileNm: null, fileId: null, isAutoUploaded: false }

const EvaluationDocs = (props) => {
  const {
    evaluationDoc,
    changeEvalutaionDoc,
    onClickPersonalInfoInquiry,
    onClickPersonalInfoCollection,
    readOnly,
    onClickFile
  } = props
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

  return (
    <>
      <Stack direction={'column'} spacing={1}>
        <Typography variant="h3">
          <FiberManualRecordOutlined color="primary" sx={{ mr: 1, fontSize: '1rem' }} />
          필요한서류 제출
        </Typography>
        <Divider sx={{ height: '1px', backgroundColor: theme.palette.primary.main }} />
      </Stack>
      <Stack direction={'row'} spacing={1}>
        <Grid container sx={{flexDirection:'row-reverse'}}>
          <BtAsteriskIcon />
          <BtContentGrid gridXs={6} title={'사업자등록증 등록'}>
            {inputMaker('innfInqCosn')}
          </BtContentGrid>
        </Grid>
      </Stack>
    </>
  )
}
export default memo(EvaluationDocs)
