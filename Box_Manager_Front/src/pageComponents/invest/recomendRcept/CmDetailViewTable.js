import { Typography } from '@mui/material'
import { Box, useTheme } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'

const CmViewFileTable = (props) => {
  const { title, children } = props
  const theme = useTheme()
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography
        variant="h3"
        sx={{
          lineHeight: '1.5rem',
          fontSize: '1.125rem',
          fontWeight: 'bold'
        }}
        paddingBottom={true}
      >
        {title}
      </Typography>
      <Grid
        container
        sx={{
          borderTop: `1px solid ${theme.palette.info.main}`
        }}
      >
        {children}
      </Grid>
    </Box>
  )
}
export default CmViewFileTable
