import { Close } from '@mui/icons-material'
import { Box, Button, Divider, IconButton, Modal, Stack, Typography } from '@mui/material'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import React, { forwardRef, useImperativeHandle, useState, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import Api from 'modules/consts/Api'
import ResponseUtils from 'modules/utils/ResponseUtils'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import { exeFunc } from 'modules/utils/ReactUtils'

const FundConfirm = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, vo } = props
  const history = useHistory()
  const alertPopRef = useRef(null)

  useImperativeHandle(ref, () => ({
    open,
    close
  }))

  const open = () => {
    setIsOpen(true)
  }
  const close = () => {
    setIsOpen(false)
  }

  // 마지막으로 작성한 펀드제안서 불러오기
  const loadLastDetail = async () => {
    const params = {
      utlinsttId: vo[0].utlinsttId
    }

    const res = await ResponseUtils.getSimpleResponse(Api.fund.loadFundList, params, true)
    for (let i = 0; i < res.list.length; i++) {
      if (res.list[i].auditStg === 'save') {
        const url =
          ROUTER_NAMES.FUND_PRPL_INFO_STEP + '?utlinsttId=' + res.list[i].utlinsttId + '&fundId=' + res.list[i].fundId
        history.push(url)
        break
      }else {
        exeFunc(alertPopRef, 'open', '마지막으로 작성한 펀드 제안서 내용이 없습니다.')
      }
    }
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 4,
    pb: 1
  }

  return (
    <>
      {isOpen && (
        <Modal open={isOpen} onClose={close}>
          <Box sx={style}>
            <Stack
              direction={'row'}
              justifyContent="flex-end"
              alignItems="center"
              sx={{ width: '100%', px: 1, pt: 1, boxSizing: 'border-box' }}
            >
              <IconButton onClick={close}>
                <Close />
              </IconButton>
            </Stack>
            <Stack direction={'column'} sx={{ width: 400 }}>
              <Stack direction={'column'} spacing={2} sx={{ px: 2, pb: 2 }}>
                <Typography variant="body1" align="center" sx={{ color: theme.palette.text.sub }}>
                  마지막으로 작성한 펀드 제안서 내용을 불러오시겠습니까?
                  <br />
                  (내용은 수정할 수 있습니다.)
                </Typography>
              </Stack>

              <Divider />
              <Stack direction={'row'} spacing={1} justifyContent="center" alignItems="center" sx={{ px: 2, py: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => history.push(ROUTER_NAMES.FUND_PRPL_INFO_STEP)}
                  disableElevation
                >
                  신규 작성
                </Button>
                <Button variant="contained" color="primary" onClick={loadLastDetail} disableElevation>
                  불러오기
                </Button>
              </Stack>
            </Stack>
            <AlertPopup ref={alertPopRef} />
          </Box>
        </Modal>
      )}
    </>
  )
})

export default FundConfirm
