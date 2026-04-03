import { MarkChatReadOutlined } from '@mui/icons-material'
import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useTheme
} from '@mui/material'
import Api from 'modules/consts/Api'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import CommonAxios, { getConfig } from 'modules/utils/CommonAxios'
import QueryUtils from 'modules/utils/QueryUtils'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'

const FundPrplInfoStepView3 = (props) => {
  const theme = useTheme()
  const isMounted = useRef(false) // useEffect에서 mount 유무 동기확인을 위함
  const commonContext = useContext(CommonContext)
  const history = useHistory()
  const [vo, setVo] = useState({
    auditStg: '',
    fundId: '',
    wody: '',
    utlinsttId: ''
  })

  // 답변 내용 조회
  const loadReplyCon = async () => {
    const url = Api.fund.fundPrplInfoReply + '/' + props.location.state.fundId
    const res = await CommonAxios(getConfig(url), false)

    if (res && res.status === 200) {
      return res.data.data
    }
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
        const resultObj = await loadReplyCon()
        console.log('resultObj = ', resultObj)
        setVo(resultObj)
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
                <MarkChatReadOutlined color="primary" sx={{ fontSize: '3rem' }} />
              </Box>

              <Typography variant="h6" sx={{ textAlign: 'center' }}>
                IBK 혁신투자부에 제안해 주신 펀드에 답변이 등록되었습니다.
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

          <Paper sx={{ p: 3 }}>
            <Stack direction={'column'} justifyContent="center" alignItems="flex-start" spacing={2}>
              {(vo.auditStg === 'AUD01003' && (
                <Chip
                  label="심사 완료 - 수락"
                  sx={{
                    borderRadius: 1,
                    width: '10rem',
                    backgroundColor: theme.palette.info.main,
                    color: theme.palette.text.contrastText
                  }}
                />
              )) ||
                (vo.auditStg === 'AUD01004' && (
                  <Chip
                    label="심사 완료 - 일부 수락"
                    sx={{
                      borderRadius: 1,
                      width: '10rem',
                      backgroundColor: theme.palette.info.main,
                      color: theme.palette.text.contrastText
                    }}
                  />
                )) ||
                (vo.auditStg === 'AUD01005' && (
                  <Chip
                    label="심사 완료 - 거절"
                    sx={{
                      borderRadius: 1,
                      width: '10rem',
                      backgroundColor: theme.palette.info.main,
                      color: theme.palette.text.contrastText
                    }}
                  />
                )) ||
                (vo.auditStg === 'AUD01006' && (
                  <Chip
                    label="심사 완료 - 보류"
                    sx={{
                      borderRadius: 1,
                      width: '10rem',
                      backgroundColor: theme.palette.info.main,
                      color: theme.palette.text.contrastText
                    }}
                  />
                ))}
              <Box
                p={3}
                sx={{
                  width: '100%',
                  height: '14rem',
                  overflow: 'scroll',
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: theme.palette.background.tableOddRow
                }}
              >
                <Typography variant="body1">{vo.rplyCon}</Typography>
              </Box>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </>
  )
}

export default FundPrplInfoStepView3
