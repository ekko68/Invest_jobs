import React, { useContext } from 'react'
import { HomeOutlined } from '@mui/icons-material'
import {
  Grid,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Typography,
  useTheme,
  Avatar,
  TextField
} from '@mui/material'
import { BtNavSelect } from 'components/bt/BtNavSelect'
import Header from 'components/header/Header'
import BreadCrumbs from 'components/common/BreadCrumbs'

import { CommonContext } from 'modules/contexts/common/CommomContext'
import { StringUtils } from 'modules/utils/StringUtils'

const VnentrLonCmWrapper = (props) => {
  const { children } = props
  const theme = useTheme()
  const commonContext = useContext(CommonContext)

  return (
    <>
      <Header />
      <Stack
        className="content_wrapper"
        direction={'column'}
        sx={{ backgroundColor: theme.palette.background.default }}
      >
        <Box
          sx={{
            position: 'relative',
            background: `linear-gradient(0deg, rgba(81, 105, 153, 0.7), rgba(81, 105, 153, 0.7)), url("./banners/mypage.jpg")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            height: '23rem',
            pt: '5rem'
          }}
        >
          <Container maxWidth="false" disableGutters sx={{ maxWidth: '1280px', px: '1.25rem', height: '100%' }}>
            <Stack
              spacing={1}
              direction={'column'}
              justifyContent={'center'}
              alignItems={'center'}
              sx={{ width: '10rem', height: '100%' }}
            >
              <Box
                sx={{
                  boxSizing: 'border-box',
                  p: 3,
                  borderRadius: 1,
                  width: '10rem',
                  height: '10rem',
                  backgroundColor: theme.palette.background.white
                }}
              >
                {StringUtils.hasLength(commonContext.state.user.info?.groupLogoImgUrl) ? (
                  <Avatar
                    src={commonContext.state.user.info.groupLogoImgUrl}
                    sx={{ borderRadius: 0, width: '7rem', height: '7rem', bgcolor: theme.palette.disabled.main }}
                  />
                ) : (
                  <Avatar
                    src={'images/tmp/invest_list_card_no_image.png'}
                    sx={{ borderRadius: 0, width: '7rem', height: '7rem', bgcolor: theme.palette.disabled.main }}
                  />
                )}
              </Box>
              <Typography variant="body1" sx={{ color: theme.palette.text.contrastText }}>
                {StringUtils.hasLength(commonContext.state.user.info?.name) ? commonContext.state.user.info.name : ''}
              </Typography>
            </Stack>
          </Container>

          <Typography
            variant="h1"
            color={'white'}
            sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}
          >
            마이페이지
          </Typography>
        </Box>
        {/* end of page banner*/}
        <BreadCrumbs />

        {children}
      </Stack>
    </>
  )
}

export default VnentrLonCmWrapper
