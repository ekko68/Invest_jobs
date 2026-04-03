import { Button, Stack } from '@mui/material'

const VnentrLonCmDetailViewButtons = (props) => {
  const { onClickList, onClickLoanCancel } = props

  return (
    <Stack direction={'row'} spacing={1} justifyContent="center" alignItems="center">
      <Button
        size="large"
        variant="outlined"
        onClick={() => {
          onClickList()
        }}
        disableElevation
      >
        목록
      </Button>
      <Button
        size="large"
        variant="outlined"
        onClick={() => {
          onClickLoanCancel()
        }}
        disableElevation
      >
        대출신청 취소
      </Button>
    </Stack>
  )
}

export default VnentrLonCmDetailViewButtons
