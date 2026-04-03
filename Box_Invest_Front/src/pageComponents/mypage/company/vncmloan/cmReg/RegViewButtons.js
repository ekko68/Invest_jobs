import { Button, Stack } from '@mui/material'

const VnentrLonCmRegViewButtons = (props) => {
  const { onClickCancel, onClickSubmit, onClickModify, editMode } = props

  return (
    <Stack direction={'row'} spacing={1} justifyContent="center" alignItems="center">
      <Button
        size="large"
        variant="outlined"
        onClick={() => {
          onClickCancel()
        }}
        disableElevation
      >
        취소
      </Button>
      {editMode ? (
        <Button
          size="large"
          variant="contained"
          onClick={() => {
            onClickModify()
          }}
          disableElevation
        >
          수정
        </Button>
      ) : (
        <Button
          size="large"
          variant="contained"
          onClick={() => {
            onClickSubmit()
          }}
          disableElevation
        >
          제출
        </Button>
      )}
    </Stack>
  )
}

export default VnentrLonCmRegViewButtons
