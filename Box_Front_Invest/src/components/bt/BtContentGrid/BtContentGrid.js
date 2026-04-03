import { useTheme } from '@emotion/react'
import { Box, Grid, Stack, Typography, IconButton, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'
import { BtAsteriskIcon } from '../BtAsteriskIcon'
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import { grey } from '@mui/material/colors'
// import { color } from 'html2canvas/dist/types/css/types/color'
import { fileDownload } from 'modules/utils/CommonAxios'

export const BtContentGrid = ({ children, gridXs, title, required, additionalContents, type }) => {
  const theme = useTheme()

  // const HtmlTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
  //   ({ theme }) => ({
  //     [`& .${tooltipClasses.tooltip}`]: {
  //       backgroundColor: '#f5f5f9',
  //       color: 'red',
  //       maxWidth: 220,
  //       fontSize: theme.typography.pxToRem(12),
  //       border: '1px solid #dadde9'
  //     }
  //   })
  // )
  
  // 사전검토표 양식 다운로드
  const handleDownload = async()=> {
    const params = {
      fileId: 'd14dfd72-ccf5-4d1f-ad74-d74a33ba6349',
      fileNm: '사전검토표 양식.xlsx'
    }

    await fileDownload(params)
  }

  return (
    <Grid item xs={gridXs} sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
      <Stack direction={'row'} sx={{ height: '100%' }}>
        <Box p={1.5} sx={{ width: '10rem' }}>
          <Stack
            direction="column"
            spacing={1}
            alignItems={'flex-start'}
            justifyContent="center"
            sx={{ height: '100%' }}
          >
            <Stack
              direction="row"
              spacing={0.75}
              justifyContent="flex-start"
              alignItems="center"
              // sx={additionalContents ? {} : { height: '100%' }}
            >
              <Typography variant="body1" sx={{ color: theme.palette.text.sub }}>
                {title}
                {(title === '징계여부' || title === '전문자격증 보유인력' || title === "파일 첨부") && (
                  <Tooltip
                    title={
                      (title === '징계여부' && (
                        <>
                          <h5>최근 5년간 기관경고</h5>
                          <br />
                          <h5>이상의 징계사실 여부</h5>
                        </>
                      )) ||
                      (title === '전문자격증 보유인력' && (
                        <>
                          <h5>리스크 부서 상근 변호사,</h5>
                          <br />
                          <h5>회계사 보유 여부</h5>
                        </>
                      )) || 
                      (title === '파일 첨부' && (
                        <>
                          <h5>작성 기준일은 월말 기준으로 작성요망</h5>
                        </>
                      ))
                    }
                  >
                    <IconButton sx={{ padding: '0px 0px 3px 0px' }}>
                      <QuestionMarkIcon sx={{ height: '1rem' }} />
                    </IconButton>
                  </Tooltip>
                )}
              </Typography>
              {required && <BtAsteriskIcon />}
            </Stack>
            <Stack
              direction="row"
              spacing={0.75}
              justifyContent="flex-start"
              alignItems="center"
              // sx={additionalContents ? {} : { height: '100%' }}
            >
              {title === '운용인력 유지율' ? `(기준일로부터 3년 전 재직 기준)` : ''}
            </Stack>
            {type === 'download' && (
              <Stack
                direction="row"
                spacing={0.75}
                justifyContent="flex-start"
                alignItems="center"
                // sx={additionalContents ? {} : { height: '100%' }}
              >
                <Button
                  variant="outlined"
                  onClick={handleDownload}
                >
                  <Typography>사전검토표 양식 다운로드</Typography>
                </Button>

              </Stack>
            )}
            {additionalContents && additionalContents}
          </Stack>
        </Box>
        <Box p={1.5} flexGrow={1}>
          <Stack direction="row" justifyContent="flex-start" alignItems="center" sx={{ height: '100%' }}>
            {children}
          </Stack>
        </Box>
      </Stack>
    </Grid>
  )
}
