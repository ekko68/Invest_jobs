import { Add, Remove } from '@mui/icons-material'
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme
} from '@mui/material'
import { BtContentGrid } from 'components/bt/BtContentGrid'
import Api from 'modules/consts/Api'
import { FileUploadExtOpt, FileUploadSizeOpt } from 'modules/consts/BizConst'
import CommonAxios, { getPostConfig } from 'modules/utils/CommonAxios'
import { createKey, excelDownloadIvtByPostConfigOption } from 'modules/utils/CommonUtils'
import { isNumber } from 'modules/utils/NumberUtils'
import { exeFunc } from 'modules/utils/ReactUtils'
import { StringUtils } from 'modules/utils/StringUtils'
import moment from 'moment/moment'
import MuiNumberInput from 'pageComponents/common/number/MuiNumberInput'
import MuiTextField from 'pageComponents/common/number/MuiTextField'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'

const StchInfo = forwardRef(({ stchInfoSeq, utlinsttId, stchNm, cmscAmt, prra, list, rmrk, upDateList }, ref) => {
  const theme = useTheme()
  const excelFileIdRef = useRef()
  const alertPopRef = useRef()
  const [isUpdate, setIsUpdate] = useState(true)
  const [cmscAmtMny, setCmscAmtMny] = useState(0)
  const [prraMny, setPrraMny] = useState(0)
  const [prskCnfgInfo, setPrskCnfgInfo] = useState([]) // 주요 주주 구성

  useImperativeHandle(ref, () => ({}))
  useEffect(() => {}, [])
  useEffect(() => {}, [list])

  const onClickAdd = () => {
    if (prskCnfgInfo.length >= 20) {
      alert('등록 가능한 인원수를 초과하였습니다.최대 20 입니다.')
      // exeFunc(alertPopRef, 'open', '등록 가능한 인원수를 초과하였습니다.최대 20 입니다.');
      return
    }
    const item = createEmptyItem()
    setPrskCnfgInfo((pre) => [...pre, item])
    // list.push(item)

    setIsUpdate(!isUpdate)
    // moveToBottom()
  }
  const createEmptyItem = () => {
    const item = {}
    if (prskCnfgInfo.length > 0) {
      const lastItem = prskCnfgInfo[prskCnfgInfo.length - 1]
      item[stchInfoSeq] = lastItem[stchInfoSeq] + 1
    } else {
      item[stchInfoSeq] = 1
    }
    item[utlinsttId] = ''
    item[stchNm] = ''
    item[cmscAmt] = ''
    item[prra] = ''
    item[rmrk] = ''
    item['key'] = createKey()
    return item
  }

  // item 삭제
  const onClickDelete = (item) => {
    let sum = 0
    let box = prskCnfgInfo.filter((ele) => item[stchInfoSeq] != ele[stchInfoSeq])
    setPrskCnfgInfo(box)
    prskCnfgInfo.forEach((item) => {
      if (item.cmscAmt > 0 || item.cmscAmt != '' || item.cmscAmt != '0') {
        if (typeof item.cmscAmt == 'number') {
          sum += item.cmscAmt
        } else {
          sum += Number(item.cmscAmt.replaceAll(',', ''))
        }
      }
    })
    setCmscAmtMny(sum)
  }

  // 주요 주주구성 합계: 지원액(원) 계산
  const changeNow = (ele, numberProperty) => {
    let sum = 0
    if (numberProperty === 'cmscAmt') {
      if (prskCnfgInfo.length > 0) {
        prskCnfgInfo.forEach((item) => {
          if (item.cmscAmt > 0 || item.cmscAmt != '' || item.cmscAmt != '0') {
            if (typeof item.cmscAmt == 'number') {
              sum += item.cmscAmt
            } else {
              sum += Number(item.cmscAmt.replaceAll(',', ''))
            }
          }
        })
        setCmscAmtMny(sum)
      } else {
        setCmscAmtMny(0)
      }
    } else {
      if (prskCnfgInfo.length > 0) {
        prskCnfgInfo.forEach((item) => {
          if (item.prra > 0 || item.prra != '' || item.prra != '0') {
            sum += Number(item.prra)
          }
        })
        setPrraMny(sum)
      } else {
        setPrraMny(0)
      }
    }
  }

  // 주요 주주 구성 엑셀 업로드 클릭
  const handleFiles = () => {
    excelFileIdRef.current.click()
    const options = { limitSizeOpt: FileUploadSizeOpt.DEFAULT, acceptExtOpt: FileUploadExtOpt.DOC }
    excelFileIdRef.current.addEventListener('change', (event, alertPopRef, options) => hadleExcelUpload(event), {
      once: true
    })
  }

  // 엑셀 업로드 후 그리드에 데이터 출력
  const hadleExcelUpload = async (event, alertPopupRef, options) => {
    console.log('files = ', event.target.files[0])
    if (event.target.files?.length > 0) {
      const file = event.target.files[0]

      const limitSizeOpt = isNumber(options?.limitSizeOpt?.size) ? options.limitSizeOpt : FileUploadSizeOpt.DEFAULT

      let isExtPass = true
      if (options?.acceptExtOpt?.list?.length > 0) {
        const ext = file.name.substring(file.name.lastIndexOf('.'))
        if (options.acceptExtOpt.list.findIndex((e) => e === ext) < 0) isExtPass = false
      }

      if (file.size > limitSizeOpt.size) {
        if (alertPopupRef)
          exeFunc(alertPopupRef, 'open', `업로드 파일 용량(${limitSizeOpt.name} 이하)을 초과 하였습니다.`)
      } else if (!isExtPass) {
        if (alertPopupRef) exeFunc(alertPopupRef, 'open', '파일 확장자를 확인해 주세요.')
      } else {
        const formData = new FormData()
        formData.append('file', file)
        const res = await CommonAxios(getPostConfig(Api.fund.fundExcelUpload, formData))
        if (res) {
          console.log('upload res ===== ', res.data.data.list)
          const arr = []
          for (let i = 0; i < res.data.data.list.length; i++) {
            const resObj = {
              stchInfoSeq: i + 1,
              stchNm: res.data.data.list[i].stchNm,
              cmscAmt: res.data.data.list[i].cmscAmt,
              prra: res.data.data.list[i].prra,
              rmrk: res.data.data.list[i].rmrk,
              key: createKey()
            }
            if (res.data.data.list[i].stchNm !== '') {
              arr.push(resObj)
            }
          }
          const resultLength = prskCnfgInfo.length - arr.length

          for (let i = 0; i < resultLength; i++) {
            const resultObj = {
              stchInfoSeq: arr[i].stchInfoSeq + 1,
              stchNm: '',
              cmscAmt: 0,
              prra: 0,
              rmrk: ''
            }
            arr.push(resultObj)
          }

          setPrskCnfgInfo(arr)
          let total1 = 0
          let total2 = 0
          for (let i = 0; i < arr.length; i++) {
            total1 += arr[i].cmscAmt === '' ? 0 : Number(arr[i].cmscAmt)
            total2 += arr[i].prra === '' ? 0 : Number(arr[i].prra)
          }
          setCmscAmtMny(total1)
          setPrraMny(total2)
        }
      }
    } else {
      if (alertPopupRef) exeFunc(alertPopupRef, 'open', '잠시 후에 다시 시도해주세요.')
    }
    event.target.value = ''
  }

  // == excel download
  const handleExcelDownload = async () => {
    //vnemtrlonReqst data
    const boardParamData = {
      stchNm: '',
      cmscAmt: '',
      prra: '',
      rmrk: ''
    }
    await excelDownloadIvtByPostConfigOption(
      // content-disposition header 인코딩이 utf-8로 세팅할 경우에도 깨지는 현상 있음 -> 사용자 지정 파일명 세팅
      getPostConfig(Api.fund.fundIrStockExcel, boardParamData),
      '주요 주주 구성 양식_' + moment(new Date()).format('YYYYMMDD')
    )
  }
  // 조요 주주 정보
  const renderStchInfo = useCallback(() => {
    if (prskCnfgInfo.length === 0) {
      return <></>
    } else if (prskCnfgInfo.length > 0) {
      const rowList = []
      for (let i = 0; i < prskCnfgInfo.length; i++) {
        const item = prskCnfgInfo[i]
        const item2 = list[i]
        const row = (
          <TableRow key={item.key}>
            <TableCell align="center" component="th" scope="row">
              <MuiTextField item={item} value={item['stchNm']} numberProperty="stchNm" />
            </TableCell>
            <TableCell
              align="center"
              component="th"
              scope="row"
              sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
            >
              <MuiNumberInput
                item={item}
                title={'지분액(원)'}
                numberProperty="cmscAmt"
                changeNow={changeNow}
                value={item['cmscAmt']}
              />
            </TableCell>
            <TableCell
              align="left"
              component="th"
              scope="row"
              sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
            >
              <MuiNumberInput
                ref={alertPopRef}
                item={item}
                title={'지분율(%)'}
                numberProperty="prra"
                changeNow={changeNow}
                value={item['prra']}
              />
            </TableCell>
            <TableCell
              align="left"
              component="th"
              scope="row"
              sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
            >
              <MuiTextField item={item} value={item['rmrk']} numberProperty="rmrk" />
            </TableCell>
            <TableCell>
              <Box sx={{ px: 2 }}>
                <IconButton
                  onClick={() => onClickDelete(item)}
                  size="small"
                  sx={{ border: `1px solid ${theme.palette.text.sub}` }}
                >
                  <Remove />
                </IconButton>
              </Box>
            </TableCell>
          </TableRow>
        )
        rowList.push(row)
      }
      return rowList
    }
  })
  useEffect(() => {
    let sum = 0
    prskCnfgInfo.forEach((item) => {
      if (item.cmscAmt > 0 || item.cmscAmt != '' || item.cmscAmt != '0') {
        console.log('주주구성', typeof item.cmscAmt)
        if (typeof item.cmscAmt == 'number') {
          sum += item.cmscAmt
        } else {
          console.log('typeof string', typeof item.cmscAmt)
          console.log(item.cmscAmt)
          sum += Number(item.cmscAmt.replaceAll(',', ''))
        }
      }
    })
    setCmscAmtMny(sum)
  }, [prskCnfgInfo])
  useEffect(() => {
    let sum = 0
    prskCnfgInfo.forEach((item) => {
      if (item.prra > 0 || item.prra != '' || item.prra != '0') {
        sum += Number(item.prra)
      }
    })
    setPrraMny(sum)
  }, [prskCnfgInfo])

  useEffect(() => {
    upDateList(prskCnfgInfo)
  }, [prskCnfgInfo])

  return (
    <BtContentGrid
      gridXs={12}
      title={'주요 주주 구성'}
      additionalContents={
        <>
          <Button onClick={handleExcelDownload} size="small" color="primary" variant="outlined">
            양식 다운로드
          </Button>
          <input
            ref={excelFileIdRef}
            type="file"
            name="file"
            multiple={false}
            accept={FileUploadExtOpt.DOC.str}
            style={{ display: 'none' }}
          />
          <Button onClick={handleFiles} size="small" color="primary" variant="outlined">
            엑셀 업로드
          </Button>
        </>
      }
    >
      <TableContainer component={Paper} sx={{ borderRadius: 0, boxShadow: 'none' }}>
        <Table size="small" sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead
            sx={{
              borderTop: `1px solid ${theme.palette.divider}`
            }}
          >
            <TableRow>
              <TableCell align="center">주주명</TableCell>
              <TableCell align="center" sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}>
                지분액(원)
              </TableCell>
              <TableCell align="center" sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}>
                지분율(%)
              </TableCell>
              <TableCell align="center" sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}>
                비고
              </TableCell>
              <TableCell align="center" sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}>
                상태
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderStchInfo()}
            <TableRow>
              <TableCell colSpan={5} align="center" component="th" scope="row">
                <Button onClick={() => onClickAdd()} color="primary" variant="outlined" endIcon={<Add />}>
                  행 추가
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center" component="th" scope="row">
                <Typography variant="h6" color={'primary'}>
                  합계
                </Typography>
              </TableCell>
              <TableCell
                align="center"
                component="th"
                scope="row"
                sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
              >
                <Typography variant="h6" color={'primary'}>
                  {StringUtils.comma(cmscAmtMny)}원
                </Typography>
              </TableCell>
              <TableCell
                align="center"
                component="th"
                scope="row"
                sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
              >
                <Typography variant="h6" color={'primary'}>
                  {prraMny}%
                </Typography>
              </TableCell>
              <TableCell
                align="left"
                component="th"
                scope="row"
                sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
              >
                <Typography variant="h6" color={'primary'}></Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <AlertPopup ref={alertPopRef} />
    </BtContentGrid>
  )
})

export default memo(StchInfo)
