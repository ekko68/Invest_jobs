import {
  Button,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Checkbox
} from '@mui/material'
import { BtContentGrid } from 'components/bt/BtContentGrid'
import DatePickerItem from 'components/common/DatePickerItem'
import TextFieldInput from 'components/common/TextFieldInput'
import dayjs from 'dayjs'
import Api from 'modules/consts/Api'
import { FileUploadExtOpt, FileUploadSizeOpt } from 'modules/consts/BizConst'
import CommonAxios, { getPostConfig } from 'modules/utils/CommonAxios'
import { excelDownloadIvtByPostConfigOption } from 'modules/utils/CommonUtils'
import { isNumber } from 'modules/utils/NumberUtils'
import { exeFunc } from 'modules/utils/ReactUtils'
import moment from 'moment'
import MuiNumberInput from 'pageComponents/common/number/MuiNumberInput'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import PrskCnfgInfoList from 'pageComponents/ibkPrplCntr/fund/PrskCnfgInfoList'
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'

const OprtorInfo = forwardRef((props, ref) => {
  const alertPopRef = useRef()
  const excelFileIdRef = useRef()
  const { vo, theme, copy, searchYear } = props
  const [prtnAmt, setPrtnAmt] = useState(0)
  const [prtnRto, setPrtnRto] = useState(0)

  const [cogpYn, setCogpYn] = useState('')
  const [dscplYn, setDscplYn] = useState('')
  const [chkYn, setChkYn] = useState('N')

  useImperativeHandle(ref, () => ({
    oprtorInfoResult
  }))

  // 주요 주주 구성
  const [fundStchCnfg, setFundStchCnfg] = useState([])

  // 부모에 전달할 최종 값
  const oprtorInfoResult = () => {
    const irSetData = {
      utlinsttId: vo.utlinsttId,
      astTtsmAmt: vo.astTtsmAmt,
      flasAmt: 0, // 유동자산
      qckasAmt: 0, // 당좌자산 금액
      inasAmt: 0, // 재고자산 금액
      etcFlasAmt: 0, // 기타 유동자산 금액
      noneFlasAmt: 0, // 비유동자산
      ivasAmt: 0, // 투자자산 금액
      tgasAmt: 0, // 유형자산 금액
      itasAmt: 0, // 무형자산 금액
      etcNoneFlasAmt: 0, // 기타 비유동자산 금액
      /** 부채상태표 */
      lbltTtsmAmt: vo.lbltCpstAmt, // 부채총계
      crlbAmt: 0, // 유동부채 금액
      noneCrlbAmt: 0, // 비유동부채 금액
      cptsTtsmAmt: vo.cptsTtsmAmt, // 자본총계
      cpfnAmt: 0, // 자본금 금액
      cpspMnyAmt: 0, // 자본잉여금 금액
      cpcrAmt: 0, // 자본조정 금액
      etcInlvPlCtam: 0, // 기타포괄손익 누계액
      ernspAmt: 0, // 이익잉여금 금액
      /** 손익계산서 */
      amslAmt: 0, // 매출액
      ampmAmt: 0, // 매출원가 금액
      sltpAmt: 0, // 매출총이익 금액
      sacstAmt: 0, // 판매관리비 금액
      opprAmt: vo.bsnErn, // 영업이익 금액
      nnoeAmt: 0, // 영업외수익 금액
      nonopExpAmt: vo.bsnCt, // 영업외비용 금액
      orpfAmt: 0, // 경상이익 금액
      crtxAmt: 0, // 법인세 금액
      ctnpAmt: vo.ctnpAmt, // 당기순이익 금액
      chkYn : chkYn

    }

    const temp = [fundStchCnfg, irSetData, cogpYn, dscplYn]
    return temp
  }

  // == 양식 다운로드
  const handleExcelDownload = async () => {
    //vnemtrlonReqst data
    const boardParamData = {
      stchNm: '',
      prtnAmt: '',
      prtnRto: '',
      rmrk: ''
    }
    await excelDownloadIvtByPostConfigOption(
      // content-disposition header 인코딩이 utf-8로 세팅할 경우에도 깨지는 현상 있음 -> 사용자 지정 파일명 세팅
      getPostConfig(Api.fund.fundIrStockExcel, boardParamData),
      '주요 주주 구성 양식_' + moment(new Date()).format('YYYYMMDD')
    )
  }

  // 주요 주주 구성 엑셀 업로드 클릭
  const handleFiles = () => {
    excelFileIdRef.current.click()
    const options = { limitSizeOpt: FileUploadSizeOpt.DEFAULT, acceptExtOpt: FileUploadExtOpt.DOC }
    excelFileIdRef.current.addEventListener('change', (event) => hadleExcelUpload(event, alertPopRef, options), {
      once: true
    })
  }

  // 엑셀 업로드 후 그리드에 데이터 출력
  const hadleExcelUpload = async (event, alertPopupRef, options) => {
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
        const res = await CommonAxios(getPostConfig(Api.fund.fundExcelUpload, formData), true)

        if (res.data.data !== null && res.data.data.list.length !== 0) {
          const arr = []
          for (let i = 0; i < res.data.data.list.length; i++) {
            const resObj = {
              rgsnSqn: i + 1,
              stchNm: res.data.data.list[i].stchNm,
              prtnAmt: res.data.data.list[i].prtnAmt,
              prtnRto: res.data.data.list[i].prtnRto,
              rmrk: res.data.data.list[i].rmrk
            }
            if (res.data.data.list[i].stchNm !== '' && i < 20) {
              arr.push(resObj)
            }
          }

          setPrskCnfgInfo(arr)

          let total1 = 0
          let total2 = 0
          for (let i = 0; i < arr.length; i++) {
            total1 += arr[i].prtnAmt === '' ? 0 : Number(arr[i].prtnAmt)
            total2 += arr[i].prtnRto === '' ? 0 : Number(arr[i].prtnRto)
          }
          setPrtnAmt(total1)
          setPrtnRto(total2)
        } else {
          exeFunc(alertPopupRef, 'open', '데이터 형식이 맞지 않습니다. 엑셀 양식 다운로드 후 양식에 맞게 입력해주세요.')
        }
      }
    } else {
      if (alertPopupRef) exeFunc(alertPopupRef, 'open', '잠시 후에 다시 시도해주세요.')
    }
    event.target.value = ''
  }

  // 주요 주주구성 파악
  const prskCnfgInfoListSet = () => {
    const tempArr = [...vo.fundStchCnfgList]
    const fundStchCnfgRes = []

    for (let i = 0; i < tempArr.length; i++) {
      const resObj = {
        fundId: vo.fundId,
        rgsnSqn: tempArr[i].rgsnSqn,
        stchNm: tempArr[i].stchNm,
        prtnAmt: tempArr[i].prtnAmt.toString().replace('.0', ''),
        prtnRto: tempArr[i].prtnRto.toString().replace('.0', ''),
        rmrk: tempArr[i].rmrk === null ? '' : tempArr[i].rmrk,
        rgsnUserId : tempArr[i].rgsnUserId
      }
      fundStchCnfgRes.push(resObj)
    }
    setFundStchCnfg(fundStchCnfgRes)

    let total1 = 0
    let total2 = 0
    for (let i = 0; i < vo.fundStchCnfgList.length; i++) {
      total1 += vo.fundStchCnfgList[i].prtnAmt === '' ? 0 : vo.fundStchCnfgList[i].prtnAmt
      total2 += vo.fundStchCnfgList[i].prtnRto === '' ? 0 : vo.fundStchCnfgList[i].prtnRto
    }
    setPrtnAmt(total1)
    setPrtnRto(total2)
  }

  // 재무정보 회계연도 계산
  const useBeforeYear = (type) => {
    return dayjs().subtract(type, 'year').format('YYYY') + '년도'
  }

  // 라디오 버튼 컨트롤
  const rdoClickBtn = useCallback((e, item) => {
    if (e.target.id === 'cogpY') {
      setCogpYn('Y')
    } else if (e.target.id === 'cogpN') {
      document.getElementsByName('majorPrnNm')[0].value = ''
      console.log('props.vo.majorPrnNm = ', document.getElementsByName('majorPrnNm')[0].value)
      setCogpYn('N')
      if((vo.astTtsmAmt1y,
        vo.astTtsmAmt2y,
        vo.lbltCpstAmt1y,
        vo.lbltCpstAmt2y,
        vo.cptsTtsmAmt1y,
        vo.cptsTtsmAmt2y,
        vo.bsnErn1y,
        vo.bsnErn2y,
        vo.bsnCt1y,
        vo.bsnCt2y,
        vo.ctnpAmt1y,
        vo.ctnpAmt2y) === 0) {
          setChkYn('Y');
      }
    } else if (e.target.id === 'dscplY') {
      setDscplYn('Y')
    } else if (e.target.id === 'dscplN') {
      setDscplYn('N')
    }
  }, [])

  useEffect(() => {
    if (vo.fundId !== '') {
      // 계속 작성시
      prskCnfgInfoListSet()
      if (vo.dscplYn === 'Y') {
        setDscplYn('Y')
      } else if (vo.dscplYn === 'N') {
        setDscplYn('N')
      }

      if (vo.cogpYn === 'Y') {
        setCogpYn('Y')
      } else if (vo.cogpYn === 'N') {
        setCogpYn('N')
      }

      if((vo.astTtsmAmt1y,
        vo.astTtsmAmt2y,
        vo.lbltCpstAmt1y,
        vo.lbltCpstAmt2y,
        vo.cptsTtsmAmt1y,
        vo.cptsTtsmAmt2y,
        vo.bsnErn1y,
        vo.bsnErn2y,
        vo.bsnCt1y,
        vo.bsnCt2y,
        vo.ctnpAmt1y,
        vo.ctnpAmt2y) === 0) {
          setChkYn('Y');
      }
    } else {
      // 신규 작성시
      if (vo.fundStchCnfgList.length !== 0) {
        prskCnfgInfoListSet()
        setCogpYn('N')
        setDscplYn('N')
      }
    }
  }, [vo])

  // 재무정보 미존재 시 disabled 처리
  const checkEvent = (chk)=> {
    if(chk) {
      vo.astTtsmAmt1y = 0
      vo.astTtsmAmt2y = 0
      vo.lbltCpstAmt1y = 0
      vo.lbltCpstAmt2y = 0
      vo.cptsTtsmAmt1y = 0
      vo.cptsTtsmAmt2y = 0
      vo.bsnErn1y = 0
      vo.bsnErn2y = 0
      vo.bsnCt1y = 0
      vo.bsnCt2y = 0
      vo.ctnpAmt1y = 0
      vo.ctnpAmt2y = 0
      setChkYn('Y')
    }else{
      setChkYn('N')
    }
  }

  return (
    <>
      <Stack direction={'column'} spacing={1}>
        <Grid container sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
          <BtContentGrid gridXs={6} title={'운용사명'} required={true}>
            <TextFieldInput
              title={'운용사명'}
              size="small"
              numberProperty="prnNm"
              name="prnNm"
              item={vo}
              values={vo.prnNm}
              disabled={copy === 'view'}
            />
          </BtContentGrid>

          <BtContentGrid gridXs={6} title={'사업자번호'} required={true}>
            <TextFieldInput
              title={'사업자번호'}
              size="small"
              numberProperty="bzn"
              name="bzn"
              item={vo}
              values={vo.bzn}
              disabled={copy === 'view'}
              maxLength={10}
            />
          </BtContentGrid>
          <BtContentGrid gridXs={6} title={'대표이사'} required={true}>
            <TextFieldInput
              title={'대표이사'}
              size="small"
              numberProperty="rprNm"
              name="rprNm"
              item={vo}
              values={vo.rprNm}
              disabled={copy === 'view'}
            />
          </BtContentGrid>
          <BtContentGrid gridXs={6} title={'회사 소재지'} required={true}>
            <TextFieldInput
              title={'회사 소재지'}
              size="small"
              numberProperty="adres"
              name="adres"
              item={vo}
              values={vo.adres}
              disabled={copy === 'view'}
            />
          </BtContentGrid>
          <DatePickerItem
            format="YYYY-MM-DD"
            title={'설립년월일'}
            sx={{ width: '100%' }}
            numberProperty="incrYmd"
            item={vo}
            values={dayjs(vo.incrYmd)}
            disabled={copy === 'view'}
          />

          <DatePickerItem
            format="YYYY-MM-DD"
            title={'펀드운용 시작일'}
            sx={{ width: '100%' }}
            numberProperty="fundOprTs"
            item={vo}
            values={dayjs(vo.fundOprTs)}
            disabled={copy === 'view'}
          />
          <BtContentGrid gridXs={6} title={'CO-GP여부'}>
            <Stack direction="row" justifyContent="center">
              <RadioGroup row>
                <FormControlLabel
                  value="Y"
                  control={
                    <Radio
                      id={'cogpY'}
                      onClick={(e) => rdoClickBtn(e, 'Y')}
                      checked={cogpYn === 'Y'}
                      disabled={copy === 'view'}
                    />
                  }
                  label="Y"
                />
                <FormControlLabel
                  value="N"
                  control={
                    <Radio
                      id={'cogpN'}
                      onClick={(e) => rdoClickBtn(e, 'N')}
                      checked={cogpYn === 'N'}
                      disabled={copy === 'view'}
                    />
                  }
                  label="N"
                />
              </RadioGroup>
            </Stack>
          </BtContentGrid>
          <BtContentGrid gridXs={6} title={'주 운용사명'}>
            <TextFieldInput
              title={'주 운용사명'}
              size="small"
              numberProperty="majorPrnNm"
              item={vo}
              name="majorPrnNm"
              values={vo.majorPrnNm}
              disabled={copy === 'view' || cogpYn === 'N'}
            />
          </BtContentGrid>
          <BtContentGrid gridXs={6} title={'자본 총계'} required={true}>
            <MuiNumberInput
              item={vo}
              title={'cptsTtsm'}
              numberProperty="cptsTtsm"
              sx={{ width: '100%', backgroundColor: theme.palette.disabled.lighter }}
              displayValue={vo['cptsTtsm']}
              disabled={copy === 'view'}
            />
          </BtContentGrid>

          <BtContentGrid gridXs={6} title={'납입 자본금'} required={true}>
            <MuiNumberInput
              item={vo}
              title={'payCapl'}
              numberProperty="payCapl"
              sx={{ width: '100%' }}
              displayValue={vo['payCapl']}
              disabled={copy === 'view'}
            />
          </BtContentGrid>

          <BtContentGrid gridXs={12} title={'징계여부'}>
            <Stack direction="row" justifyContent="center">
              <RadioGroup row>
                <FormControlLabel
                  value="Y"
                  control={
                    <Radio
                      id={'dscplY'}
                      onClick={(e) => rdoClickBtn(e, 'Y')}
                      checked={dscplYn === 'Y'}
                      disabled={copy === 'view'}
                    />
                  }
                  label="Y"
                />
                <FormControlLabel
                  value="N"
                  control={
                    <Radio
                      id={'dscplN'}
                      onClick={(e) => rdoClickBtn(e, 'N')}
                      checked={dscplYn === 'N'}
                      disabled={copy === 'view'}
                    />
                  }
                  label="N"
                />
              </RadioGroup>
            </Stack>
          </BtContentGrid>
          <BtContentGrid
            gridXs={12}
            title={'제무정보'}
            required={true}
            additionalContents={
              <Typography variant="body2" sx={{ color: theme.palette.text.sub }}>
                (단위:원)
              </Typography>
            }
          >
            <TableContainer component={Paper} sx={{ borderRadius: 0, boxShadow: 'none' }}>
            <FormControlLabel
                control={
                  <Checkbox checked={chkYn === 'Y'} onChange={(e) => checkEvent(e.target.checked)} />
                }
                label={
                  <Typography variant="body1" sx={{ color: theme.palette.text.sub }}>
                    재무정보 미존재
                  </Typography>
                }
              />
              <Table size="small" sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead
                  sx={{
                    borderTop: `1px solid ${theme.palette.divider}`
                  }}
                >
                  <TableRow>
                    <TableCell align="center">구분 / 연도</TableCell>
                    <TableCell align="center" sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}>
                      {copy === 'view' ? useBeforeYear(1) : searchYear[0] + '년'}
                    </TableCell>
                    <TableCell align="center" sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}>
                      {copy === 'view' ? useBeforeYear(2) : searchYear[1] + '년'}
                    </TableCell>
                    <TableCell align="center" sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}>
                      {copy === 'view' ? useBeforeYear(3) : searchYear[2] + '년'}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="center" component="th" scope="row">
                      자산총계
                    </TableCell>
                    <TableCell
                      align="center"
                      component="th"
                      scope="row"
                      sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                    >
                      <MuiNumberInput
                        size="small"
                        value={vo.astTtsmAmt}
                        item={vo}
                        numberProperty="astTtsmAmt"
                        disabled={copy === 'view'}
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      component="th"
                      scope="row"
                      sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                    >
                      <MuiNumberInput
                        size="small"
                        value={vo.astTtsmAmt1y}
                        item={vo}
                        numberProperty="astTtsmAmt1y"
                        disabled={copy === 'view' || chkYn === 'Y'}
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      component="th"
                      scope="row"
                      sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                    >
                      <MuiNumberInput
                        size="small"
                        value={vo.astTtsmAmt2y}
                        item={vo}
                        numberProperty="astTtsmAmt2y"
                        disabled={copy === 'view' || chkYn === 'Y'}
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell align="center" component="th" scope="row">
                      부채총계
                    </TableCell>
                    <TableCell
                      align="center"
                      component="th"
                      scope="row"
                      sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                    >
                      <MuiNumberInput
                        size="small"
                        value={vo.lbltCpstAmt}
                        item={vo}
                        numberProperty="lbltCpstAmt"
                        disabled={copy === 'view'}
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      component="th"
                      scope="row"
                      sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                    >
                      <MuiNumberInput
                        size="small"
                        value={vo.lbltCpstAmt1y}
                        item={vo}
                        numberProperty="lbltCpstAmt1y"
                        disabled={copy === 'view' || chkYn === 'Y'}
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      component="th"
                      scope="row"
                      sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                    >
                      <MuiNumberInput
                        size="small"
                        value={vo.lbltCpstAmt2y}
                        item={vo}
                        numberProperty="lbltCpstAmt2y"
                        disabled={copy === 'view' || chkYn === 'Y'}
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell align="center" component="th" scope="row">
                      자본총계
                    </TableCell>
                    <TableCell
                      align="center"
                      component="th"
                      scope="row"
                      sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                    >
                      <MuiNumberInput
                        size="small"
                        value={vo.cptsTtsmAmt}
                        item={vo}
                        numberProperty="cptsTtsmAmt"
                        disabled={copy === 'view'}
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      component="th"
                      scope="row"
                      sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                    >
                      <MuiNumberInput
                        size="small"
                        value={vo.cptsTtsmAmt1y}
                        item={vo}
                        numberProperty="cptsTtsmAmt1y"
                        disabled={copy === 'view' || chkYn === 'Y'}
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      component="th"
                      scope="row"
                      sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                    >
                      <MuiNumberInput
                        size="small"
                        value={vo.cptsTtsmAmt2y}
                        item={vo}
                        numberProperty="cptsTtsmAmt2y"
                        disabled={copy === 'view' || chkYn === 'Y'}
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell align="center" component="th" scope="row">
                      영업수익
                    </TableCell>
                    <TableCell
                      align="center"
                      component="th"
                      scope="row"
                      sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                    >
                      <MuiNumberInput
                        size="small"
                        item={vo}
                        value={vo.bsnErn}
                        numberProperty="bsnErn"
                        disabled={copy === 'view'}
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      component="th"
                      scope="row"
                      sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                    >
                      <MuiNumberInput
                        size="small"
                        item={vo}
                        value={vo.bsnErn1y}
                        numberProperty="bsnErn1y"
                        disabled={copy === 'view' || chkYn === 'Y'}
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      component="th"
                      scope="row"
                      sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                    >
                      <MuiNumberInput
                        size="small"
                        item={vo}
                        value={vo.bsnErn2y}
                        numberProperty="bsnErn2y"
                        disabled={copy === 'view' || chkYn === 'Y'}
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell align="center" component="th" scope="row">
                      영업비용
                    </TableCell>
                    <TableCell
                      align="center"
                      component="th"
                      scope="row"
                      sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                    >
                      <MuiNumberInput
                        size="small"
                        value={vo.bsnCt}
                        item={vo}
                        numberProperty="bsnCt"
                        disabled={copy === 'view'}
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      component="th"
                      scope="row"
                      sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                    >
                      <MuiNumberInput
                        size="small"
                        value={vo.bsnCt1y}
                        item={vo}
                        numberProperty="bsnCt1y"
                        disabled={copy === 'view' || chkYn === 'Y'}
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      component="th"
                      scope="row"
                      sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                    >
                      <MuiNumberInput
                        size="small"
                        value={vo.bsnCt2y}
                        item={vo}
                        numberProperty="bsnCt2y"
                        disabled={copy === 'view' || chkYn === 'Y'}
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell align="center" component="th" scope="row">
                      당기순이익
                    </TableCell>
                    <TableCell
                      align="center"
                      component="th"
                      scope="row"
                      sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                    >
                      <MuiNumberInput
                        size="small"
                        value={vo.ctnpAmt}
                        item={vo}
                        numberProperty="ctnpAmt"
                        disabled={copy === 'view'}
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      component="th"
                      scope="row"
                      sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                    >
                      <MuiNumberInput
                        size="small"
                        value={vo.ctnpAmt1y}
                        item={vo}
                        numberProperty="ctnpAmt1y"
                        disabled={copy === 'view' || chkYn === 'Y'}
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      component="th"
                      scope="row"
                      sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                    >
                      <MuiNumberInput
                        size="small"
                        value={vo.ctnpAmt2y}
                        item={vo}
                        numberProperty="ctnpAmt2y"
                        disabled={copy === 'view' || chkYn === 'Y'}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </BtContentGrid>

          <BtContentGrid
            gridXs={12}
            title={'주요 주주 구성'}
            required={true}
            additionalContents={
              <>
                <Button
                  size="small"
                  color="primary"
                  variant="outlined"
                  onClick={handleExcelDownload}
                  disabled={copy === 'view'}
                >
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
                <Button
                  size="small"
                  color="primary"
                  variant="outlined"
                  onClick={handleFiles}
                  disabled={copy === 'view'}
                >
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  <PrskCnfgInfoList
                    {...fundStchCnfg}
                    list={fundStchCnfg}
                    prtnAmt={prtnAmt}
                    setPrtnAmt={setPrtnAmt}
                    prtnRto={prtnRto}
                    setPrtnRto={setPrtnRto}
                    copy={copy}
                  />
                  
                </TableBody>
              </Table>
            </TableContainer>
          </BtContentGrid>
        </Grid>
      </Stack>
      <AlertPopup ref={alertPopRef} />
    </>
  )
})

export default React.memo(OprtorInfo)
