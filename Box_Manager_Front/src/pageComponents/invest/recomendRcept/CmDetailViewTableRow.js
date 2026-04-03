import { Typography } from '@mui/material'
import { Stack, useTheme } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'

const CmViewFileTableRow = (props) => {
  const { title, title2nd, title3rd, children, full, auto } = props
  const theme = useTheme()
  return (
    <Grid
      xs={full ? 12 : 6}
      container
      sx={{
        borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}`
      }}
    >
      <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
        <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{ height: '100%' }}>
          <Typography variant="body1">
            {title}
            {title2nd && <br />}
            {title2nd}
            {title3rd && <br />}
            {title3rd}
          </Typography>
        </Stack>
      </Grid>
      <Grid xs sx={{ p: 2 }}>
        <Stack
          direction={auto ? 'row' : 'column'}
          justifyContent="center"
          alignItems={auto ? 'center' : 'flex-start'}
          spacing={2}
          sx={{ width: '100%', height: '100%' }}
        >
          {children}
        </Stack>
      </Grid>
    </Grid>
  )
}
export default CmViewFileTableRow
