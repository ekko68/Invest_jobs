import React from 'react'
import { Box, Stack, Typography, useTheme } from '@mui/material'

import { useHistory } from 'react-router-dom'

import Header from 'components/header/Header'
import BreadCrumbs from 'components/common/BreadCrumbs'
import ROUTER_NAMES from 'modules/consts/RouterConst'

const BALayout = ({ children }) => {
  const theme = useTheme()
  const history = useHistory()
  const pathname = history.location.pathname
  const isRootPage = pathname === ROUTER_NAMES.IBK_PRPL_CNTR

  return (
    <>
      <Header />
      <Stack direction={'column'} sx={{ backgroundColor: theme.palette.background.default }}>
        {/* page banner*/}
        <Box
          sx={{
            position: 'relative',
            background: `linear-gradient(0deg, rgba(81, 105, 153, 0.7), rgba(81, 105, 153, 0.7)), url("./banners/IBK_center.jpg")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            height: '23rem',
            pt: '5.25rem'
          }}
        >
          {isRootPage ? (
            <Stack
              spacing={2}
              sx={{
                textAlign: 'center',
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%,-50%)'
              }}
            >
              <Typography variant="h1" color={'white'}>
                IBK 제안센터
              </Typography>
              <Typography variant="body1" color={'white'}>
                IBK는 VC 여러분과 함께합니다.
                <br />
                좋은 펀드 및 투자기업을 IBK에 제안해 주시고,
                <br />
                IBK가 추천하는 투자대상 기업도 확인해 보세요.
              </Typography>
            </Stack>
          ) : (
            <Typography
              variant="h1"
              color={'white'}
              sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}
            >
              IBK 제안센터
            </Typography>
          )}
        </Box>

        {/* end of page banner*/}
        <BreadCrumbs />
        {children}
      </Stack>
    </>
  )
}

export default BALayout
