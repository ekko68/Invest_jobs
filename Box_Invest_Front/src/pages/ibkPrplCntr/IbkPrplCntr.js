import { ArrowForward } from '@mui/icons-material'
import { Button, Container, Divider, Paper, Stack, Typography, useTheme } from '@mui/material'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { useHistory } from 'react-router-dom'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import CommonAxios, { getConfig, getPostConfig, getFileUploadConfig } from 'modules/utils/CommonAxios'

const IbkPrplCntr = (props) => {
  const theme = useTheme()
  const history = useHistory()
  const [agremYn, setAgremYn] = useState(false)

  useEffect(async () => {
    const res = await CommonAxios(getConfig('/api/main/vc/check'), true)
    
    if (res.data.code === '200') {
      if (res.data.data.adminAgisVO !== null) {
        if (res.data.data.adminAgisVO.agremYn === 'N') {
          setAgremYn(true)
        }
      }
    }
  }, [])
  return (
    <>
      <Container maxWidth="false" disableGutters sx={{ maxWidth: '1280px', px: '1.25rem' }}>
        <Stack spacing={4} direction={'column'} sx={{ py: 5 }}>
          {/* 내정보 */}

          <Paper sx={{ p: 4 }}>
            <Stack direction={'column'} spacing={3}>
              <Stack direction={'row'} alignItems={'center'} spacing={1}>
                <Typography variant="h2" sx={{ width: '12rem' }}>
                  펀드 제안
                </Typography>
                <Typography flexGrow={1} variant="body1">
                  IBK에 펀드를 제안해 주세요.
                  <br /> 내부 심사를 통해 출자검토가 이루어집니다.
                </Typography>
                <Button
                  variant="contained"
                  disableElevation
                  endIcon={<ArrowForward />}
                  onClick={() => history.push(ROUTER_NAMES.FUND_PRPL_INFO_LIST_VIEW)}
                >
                  제안하기
                </Button>
              </Stack>
              <Divider />
              <Stack direction={'row'} alignItems={'center'} spacing={1}>
                <Typography variant="h2" sx={{ width: '12rem' }}>
                  투자기업 추천
                </Typography>
                <Typography flexGrow={1} variant="body1">
                  투자할만한 좋은 기업을 알고계신가요?
                  <br />
                  IBK에 추천해 주시면 기업이 직접 투자받을 수 있는 기회도 생깁니다.
                </Typography>
                <Button
                  variant="contained"
                  disableElevation
                  endIcon={<ArrowForward />}
                  onClick={() => history.push(ROUTER_NAMES.PRPL_CM_LIST_VIEW)}
                >
                  추천하기
                </Button>
              </Stack>
              <Divider />
              <Stack direction={'row'} alignItems={'center'} spacing={1}>
                <Typography variant="h2" sx={{ width: '12rem' }}>
                  IBK 벤처대출 신청
                </Typography>
                <Typography flexGrow={1} variant="body1">
                  IBK와 업무협약한 벤처투자기관이 투자하고 추천한 벤처기업에게 저금리 대출을 지원합니다.
                  <br />
                  (협약기관만 사용할 수 있습니다.)
                </Typography>
                <Button
                  variant="contained"
                  disabled={agremYn}
                  endIcon={<ArrowForward />}
                  onClick={() => history.push(ROUTER_NAMES.VNENTR_LON_SGSH_GDNC_VIEW)}
                >
                  신청하기
                </Button>
              </Stack>
              <Divider />
              <Stack direction={'row'} alignItems={'center'} spacing={1}>
                <Typography variant="h2" sx={{ width: '12rem' }}>
                  IBK 추천기업 리스트
                </Typography>
                <Typography flexGrow={1} variant="body1">
                  입력된 VC의 전문투자분야 정보를 기반으로 IBK가 투자를 기다리는 기업을 추천해 드립니다.
                  <br />
                  지금 확인해 보세요.
                </Typography>
                <Button
                  variant="contained"
                  disableElevation
                  endIcon={<ArrowForward />}
                  onClick={() => history.push(ROUTER_NAMES.RCMD_ENPR_LIST_VIEW)}
                >
                  확인하기
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </>
  )
}

export default IbkPrplCntr
