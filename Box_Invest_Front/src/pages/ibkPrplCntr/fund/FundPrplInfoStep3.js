import { CheckOutlined, HomeOutlined } from '@mui/icons-material'
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useTheme
} from '@mui/material'
import { BtNavSelect } from 'components/bt/BtNavSelect'
// import Grid from '@mui/material/Unstable_Grid2';
import Header from 'components/header/Header'
import Api from 'modules/consts/Api'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import ResponseUtils from 'modules/utils/ResponseUtils'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { createKey } from 'modules/utils/CommonUtils'

const FundPrplInfoStep3 = (props) => {
  const theme = useTheme()
  const history = useHistory()

  // 추천기업 목록
  const [rcmdList, setRcmdList] = useState([])
  const isMounted = useRef(false) // useEffect에서 mount 유무 동기확인을 위함
  const commonContext = useContext(CommonContext)

  const loadRecommendCompanyList = async () => {
    const recommendCompanyList = await ResponseUtils.getList(Api.my.vc.recommendCompanyList, null, 'list', false)
    console.log('recommendCompanyList = ', recommendCompanyList)
    return recommendCompanyList
  }

  const showFundPrplInfoView = () => {
    const url =
      ROUTER_NAMES.FUND_PRPL_INFO_STEP_VIEW +
      '?utlinsttId=' +
      commonContext.state.user.info.groupId +
      '&fundId=' +
      props.location.state.fundId

    history.push(url)
  }

  useEffect(() => {
    if (commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
      isMounted.current = true

      commonContext.actions.pageMountPathCheck(history, async () => {
        // api 조회
        const resultObj = await loadRecommendCompanyList()
        console.log('resultObj = ', resultObj)
        setRcmdList(resultObj)
      })
    }
  }, [commonContext.state.user])

  return (
    <>
      <Container maxWidth="false" disableGutters sx={{ maxWidth: '1280px', px: '1.25rem' }}>
        <Stack spacing={8} direction={'column'} sx={{ py: 5 }}>
          <Paper sx={{ p: 4 }}>
            <Stepper activeStep={2} alternativeLabel>
              <Step key={'0'}>
                <StepLabel>제안 펀드 정보</StepLabel>
              </Step>
              <Step key={'1'}>
                <StepLabel>운용사 상세 정보</StepLabel>
              </Step>
              <Step key={'2'}>
                <StepLabel>제출 완료</StepLabel>
              </Step>
            </Stepper>
          </Paper>

          {/* complete message */}
          <Paper sx={{ p: 6 }}>
            <Stack direction={'column'} justifyContent="center" alignItems="center" spacing={4}>
              <Box sx={{ p: 3, borderRadius: 20, backgroundColor: theme.palette.primary.lighter }}>
                <CheckOutlined color="primary" sx={{ fontSize: '3rem' }} />
              </Box>

              <Typography variant="h6" sx={{ textAlign: 'center' }}>
                IBK 혁신투자부에 펀드 출자를 제안해주셔서 감사합니다.
                <br />
                담당자 검토 후 답변 드릴 수 있도록 하겠습니다.
                <br />
                <br />
                투자를 할 기업을 찾고 계시다면 아래 추천 기업을 확인해 보시기 바랍니다.
              </Typography>
              <Stack direction={'row'} spacing={1}>
                <Button variant="outlined" onClick={showFundPrplInfoView} disableElevation>
                  제안내용 보기
                </Button>
                <Button
                  variant="contained"
                  onClick={() => history.push(ROUTER_NAMES.FUND_PRPL_INFO_LIST_VIEW)}
                  disableElevation
                >
                  확인
                </Button>
              </Stack>
            </Stack>
          </Paper>

          {/* 추천기업 */}
          <Stack spacing={2}>
            <Stack spacing={1}>
              <Stack direction={'row'} alignItems="flex-end" spacing={1}>
                <Typography variant="h2" flexGrow={1}>
                  추천 기업
                </Typography>
              </Stack>
              <Divider />
            </Stack>

            <Grid container spacing={2} sx={{ mt: 0, position: 'relative', left: '-1rem' }}>
              {rcmdList.map((item, i) => (
                <Grid item xs={2} key={createKey()}>
                  <Paper sx={{ p: 2 }}>
                    <Stack direction={'column'} spacing={1}>
                      <img height={120} src={item.logoImageUrl} style={{ objectFit: 'contain' }} />
                      <Typography variant="body2" sx={{ color: theme.palette.text.sub }}>
                        {item.invmStgNm}
                      </Typography>
                      <Typography variant="h2" sx={{ fontWeight: 500 }}>
                        {item.bplcNm}
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.palette.text.sub }}>
                        Seed | {item.invmAmtNm}
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Stack direction={'row'} alignItems="center">
              <Typography variant="h7" flexGrow={1}>
                99개 기업이 투자를 기다리고 있습니다.
              </Typography>
              <Button variant="outlined" onClick={() => history.push(ROUTER_NAMES.COMPANY)}>
                더보기
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </>
  )
}

export default FundPrplInfoStep3
