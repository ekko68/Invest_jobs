import { FiberManualRecordOutlined } from '@mui/icons-material'
import { Button, Divider, Grid, Stack, Typography, useTheme } from '@mui/material'
import { BtContentGrid } from 'components/bt/BtContentGrid'
import VnentrLonCmRegFileInput from 'pageComponents/mypage/company/vncmloan/cmReg/FileInput'
import { memo } from 'react'
import { fileDownload } from 'modules/utils/CommonAxios'

const fileVO = { fileNm: null, fileId: null, isAutoUploaded: false }

const VnentrLonCmRegViewArticle = (props) => {
  const { article, changeArticle, readOnly, onClickFile } = props
  const theme = useTheme()
  const inputMaker = (key) => {
    return (
      <VnentrLonCmRegFileInput
        filename={article[key].fileNm}
        isAuto={article[key].isAutoUploaded}
        onFileUpload={(file) => {
          changeArticle(key, { ...file, isAutoUploaded: false })
        }}
        onRemoveFile={() => {
          changeArticle(key, { ...fileVO })
        }}
        readOnly={readOnly}
        onFileNameClick={() => {
          onClickFile(article[key])
        }}
      />
    )
  }
  // 양식 다운로드
  const onClickVnentrLonCmReg = async (id) => {
    const params = {
      fileId: 'c555eebc-0692-46dd-a35e-45517db994ee',
      fileNm: '정관 양식.hwp'
    }

    await fileDownload(params)
  }

  return (
    <>
      <Stack direction={'column'} spacing={1}>
        <Typography variant="h3">
          <FiberManualRecordOutlined color="primary" sx={{ mr: 1, fontSize: '1rem' }} />
          정관(신주인수권부사채 발행 가능여부 확인)
        </Typography>
        <Divider sx={{ height: '1px', backgroundColor: theme.palette.primary.main }} />
      </Stack>

      <Stack direction={'row'} alignItems={'flex-start'} spacing={2}>
        <Typography flexGrow={1} sx={{ color: theme.palette.text.sub }}>
          • 신주인수권부사채 발행 가능 여부(정관상 기재 안되어 있는 경우가 많으니 꼭 확인해 주세요) 및 주주총회,
          이사회결의사항 여부 확인 부탁 드립니다.
        </Typography>
        <Button variant="outlined" disabled={readOnly} onClick={onClickVnentrLonCmReg}>
          정관 양식
        </Button>
      </Stack>

      <Stack direction={'column'} spacing={1}>
        <Grid container sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
          <BtContentGrid gridXs={6} title={'정관'}>
            {inputMaker('atcscAtchmnfl')}
          </BtContentGrid>

          <BtContentGrid gridXs={6} title={'주주총회 또는 이사회 결의서'}>
            {inputMaker('gmtsckAnact')}
          </BtContentGrid>
        </Grid>
      </Stack>
    </>
  )
}
export default memo(VnentrLonCmRegViewArticle)
