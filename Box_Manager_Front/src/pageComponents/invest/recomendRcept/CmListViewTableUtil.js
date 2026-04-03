import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import { BtaSelect } from 'components/BtaSelect'
import RefreshIcon from '@mui/icons-material/Refresh'
import { Box, IconButton, PaginationItem, Stack, useTheme } from '@mui/material'

const CmListViewTableUtil = (props) => {
  const { onChangeStatusFilter, onClickRefresh, codeList } = props
  const theme = useTheme()
  return (
    <>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <BtaSelect>
          <MenuItem value={10} onClick={() => onChangeStatusFilter('전체')}>
            전체
          </MenuItem>
          {codeList.map((code) => {
            return (
              <MenuItem value={code.comCdId} key={code.comCdId} onClick={() => onChangeStatusFilter(code.comCdId)}>
                {code.comCdNm}
              </MenuItem>
            )
          })}
        </BtaSelect>
      </FormControl>

      <IconButton
        sx={{
          p: 0.875,
          backgroundColor: theme.palette.primary.main,
          borderRadius: 1,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark
          }
        }}
        onClick={onClickRefresh}
      >
        <RefreshIcon color={'white'} />
      </IconButton>
    </>
  )
}
export default CmListViewTableUtil
