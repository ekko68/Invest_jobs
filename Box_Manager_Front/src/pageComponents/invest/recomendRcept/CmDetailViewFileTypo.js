import { Typography } from '@mui/material'

const CmViewFileTypo = (props) => {
  const { file, onClick } = props

  return (
    <>
      <Typography
        sx={{ cursor: 'pointer', textDecoration: 'underline' }}
        onClick={() => {
          if (onClick) onClick(file)
        }}
      >
        {file?.fileNm || ''}
      </Typography>
    </>
  )
}
export default CmViewFileTypo
