import { useTheme } from '@emotion/react'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import RefreshIcon from '@mui/icons-material/Refresh'
import { IconButton } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { grey } from '@mui/material/colors'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
/**
 * 구글 mui 공통 컴포넌트
 * select box
 * name: MuiCommSelect
 * fdcd
 */

export const MuiCommSelect = forwardRef(
  (
    {
      optionList,
      handleOptions,
      defaultValue,
      handleReset,
      pageTitle = '',
      showDownLoad = false,
      showReSetYn = false,
      handleExcelDownload,
      children
    },
    ref
  ) => {
    useImperativeHandle(ref, () => ({}))

    const theme = useTheme()
    const [selectList, setSelectList] = useState(optionList)
    const [value, setValue] = useState(defaultValue)

    // select box 변경시
    const handleChange = (event) => {
      setValue(event.target.value)
      handleOptions(event.target.value)
    }
    const handleResetEvent = () => {
      setValue('ALL')
      handleReset()
    }
    // 엑셀 다운로드
    const handleDownload = () => {
      handleExcelDownload()
    }
    // select box 이벤드
    useEffect(() => {
      optionList && setSelectList(optionList)
      if (defaultValue) {
        setValue(defaultValue)
      }
    }, [defaultValue, optionList])

    return (
      <Stack direction={'row'} alignItems="flex-end" spacing={1}>
        {pageTitle != '' && (
          <Typography
            flexGrow={1}
            variant="h1"
            sx={{ lineHeight: '2.375rem', fontSize: '1.875rem', fontWeight: 'bold' }}
          >
            {pageTitle}
          </Typography>
        )}
        {showDownLoad && (
          <IconButton
            onClick={handleDownload}
            sx={{
              p: 0.75,
              border: `1px solid ${grey[400]}`,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: `${grey[100]}`
              }
              // backgroundColor: '#1fcee8'
            }}
          >
            {/* <Typography sx={{ margin: '2px', color: 'rgba(224, 224, 224, 1)' }}>엑셀다운로드</Typography>
            <ArrowCircleDownIcon sx={{ color: 'rgba(224, 224, 224, 1)' }} /> */}
            <InsertDriveFileIcon sx={{ color: '#5FB742' }} />
          </IconButton>
        )}

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select value={value} onChange={handleChange} displayEmpty id="btaSelect" ref={ref}>
            {selectList.map((opt, idx) => (
              <MenuItem key={idx} value={opt.KEY}>
                {opt.VALUE}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {showReSetYn && (
          <IconButton
            sx={{
              p: 0.875,
              backgroundColor: theme.palette.primary.main,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark
              }
            }}
            onClick={handleResetEvent}
          >
            <RefreshIcon color={'white'} />
          </IconButton>
        )}
      </Stack>
    )
  }
)

export default MuiCommSelect
