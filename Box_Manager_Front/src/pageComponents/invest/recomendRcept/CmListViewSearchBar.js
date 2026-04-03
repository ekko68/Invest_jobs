import { useState, useEffect } from 'react'

import SearchIcon from '@mui/icons-material/Search'
import { Box, IconButton, PaginationItem, Stack, useTheme } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'

import { BtaSelect } from 'components/BtaSelect'

const CmListViewSearchBar = (props) => {
  const { onChangeCategory, onChangeKeyword, onClickSearch } = props

  const theme = useTheme()

  const handleTextChange = (e) => {
    onChangeKeyword(e.target.value)
  }
  const handleCategoryChange = (category) => {
    onChangeCategory(category)
  }

  const keyPress = (e) => {
    const isEnterPressed = e.keyCode == 13
    if (isEnterPressed) {
      triggerSearch()
    }
  }

  const triggerSearch = () => {
    onClickSearch()
  }

  return (
    <>
      <Stack direction={'row'} spacing={1}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <BtaSelect>
            <MenuItem value={10} onClick={() => handleCategoryChange('회사명')}>
              회사명
            </MenuItem>
            <MenuItem value={20} onClick={() => handleCategoryChange('사업자번호')}>
              사업자번호
            </MenuItem>
          </BtaSelect>
        </FormControl>

        <TextField size="small" sx={{ width: '32rem' }} onKeyDown={keyPress} onChange={handleTextChange} />

        <IconButton
          sx={{
            py: 0.875,
            px: 1.25,
            backgroundColor: theme.palette.secondary.main,
            borderRadius: 1,
            '&:hover': {
              backgroundColor: theme.palette.secondary.dark
            }
          }}
          onClick={triggerSearch}
        >
          <SearchIcon color={'white'} />
        </IconButton>
      </Stack>
    </>
  )
}

export default CmListViewSearchBar
