import { FiberManualRecordOutlined, KeyboardArrowDown } from '@mui/icons-material'
import {
  Autocomplete,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import Alert from 'components/atomic/Alert'
import { BtContentGrid } from 'components/bt/BtContentGrid'
import NoResult from 'components/common/NoResult'
import TextAreaInput from 'components/common/TextAreaInput'
import TextFieldInput from 'components/common/TextFieldInput'
import dayjs from 'dayjs'
import Api from 'modules/consts/Api'
import { AlertLabels } from 'modules/consts/BizConst'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { CodeContext } from 'modules/contexts/common/CodeContext'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import CommonAxios, { getConfig } from 'modules/utils/CommonAxios'
import { createKey } from 'modules/utils/CommonUtils'
import DateUtils from 'modules/utils/DateUtils'
import { exeFunc, setFunc } from 'modules/utils/ReactUtils'
import Moment from 'moment'
import MuiNumberInput from 'pageComponents/common/number/MuiNumberInput'
import Paging from 'pageComponents/common/Paging'
import ConfirmCancelAlertPopup from 'pageComponents/common/pop/ConfirmCancelAlertPopup'
import ConfirmSaveAlertPopup from 'pageComponents/common/pop/ConfirmSaveAlertPopup'
import React, { Suspense, useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import DocFileUpload from './DocFileUpload'

const VnentrLonSgshRegViewDetail = (props) => {
  const theme = useTheme()
  const confirmPopRef = useRef()
  const cancelPopRef = useRef()
  const history = useHistory()
  const codeContext = useContext(CodeContext)

  const [docInvtFactPrufPapersAtch, setDocInvtFactPrufPapersAtch] = useState({
    title: '3. 투자사실 증빙 서류 첨부',
    maxImages: 10,
    documentList: [],
    prevDocumentList: [],
    deleteFileKey: [],
    content: '* pdf 100MB 이내',
    maxSize: '100',
    extension: ['.pdf']
  })
  const [docInvtAnalsReprtAtch, setDocInvtAnalsReprtAtch] = useState({
    title: '4. 투자분석 보고서(투자심사자료) 첨부',
    maxImages: 10,
    documentList: [],
    prevDocumentList: [],
    deleteFileKey: [],
    content: '* pdf 100MB 이내',
    maxSize: '100',
    extension: ['.pdf']
  })
  const [docEtcFileAtch, setDocEtcFileAtch] = useState({
    title: '5. 기타 파일 첨부',
    maxImages: 10,
    documentList: [],
    prevDocumentList: [],
    deleteFileKey: [],
    content: '* pptx, doc, docx, hwp, pdf 100MB 이내',
    maxSize: '100',
    extension: ['.pptx', '.doc', '.docx', '.hwp', '.pdf']
  })
  const [ibkBuzplc, setIbkBuzplc] = useState({ brcd: '', krnBrm: '' })
  const [btnm, setBtnm] = useState(null)

  const [invtIndutySeSelect, setInvtIndutySeSelect] = useState({
    selList: []
  }) //주요업종 select box

  const [invtDtlsInvtPnttmSelect, setInvtDtlsInvtPnttmSelect] = useState({
    selList: []
  }) //투자라운드(직전) select box

  const [autoBtnmSearchArr, setAutoBtnmSearchArr] = useState([]) //업종명(표준산업분류) 자동검색
  const [autoRecomendIbkBuzplchArr, setAutoRecomendIbkBuzplchArr] = useState([]) //추천 기업은행 영업점 자동검색

  const [chkVnentr, setChkVnentr] = useState(false) //체크박스

  const [alertContents, setAlertContents] = useState('') //알림 내용
  const [alertOpen, setAlertOpen] = useState(false) //알림 오픈 여부
  const [actionHome, setActionHome] = useState(false) //알림 홈

  const [obj, setObj] = useState({
    vnentrlonId: '', // 벤처대출추천id
    utlinsttId: '', //	이용기관(회사) id
    rcmdEnprBzn: '', //	제안 기업 사업자번호
    etnm: '', //	기업명
    rprnm: '', //	대표자명
    col: new Date(), //	설립년월일
    adr: '', //	본사 주소
    btnm: '', //업종명(표준산업분류)
    invtIndutySe: '', //	투자업종 구분
    mainProduct: '', //	주요제품
    rsprNm: '', //	기업 담당자명
    rsprJbclNm: '', //	담당자 직책
    rsprCnplTpn: '', //	담당자 연락처
    rsprEad: '', //	담당자 이메일
    entrprsCmptpw: '', //	기업 경쟁력 또는성장가능성
    fllwinvtPosbltyExpectEra: '', //후속투자 가능성 및예상시기
    invtDtlsInvtInstt: '', //	투자내_투자기관
    invtDtlsInvtPnttm: '', //투자내역_투자라운드(직전)
    invtDtlsInvtAmount: '', //투자내역_투자금액(원)
    invtDtlsInvtDe: new Date(), //투자내역_투자일자(직전)
    invtDtlsStkpc: '', //투자내역_주당가격(원)
    invtDtlsEtvlAmt: '', //투자내역_기업가치(원)
    invtDtlsInvtKnd: '', //	투자내역_투자종류
    invtDtlsRm: '', //	투자내역_비고
    chrgAudofirRsprNm: '', //	담당심사역_담당자이름
    chrgAudofirRsprJbclNm: '', //	담당심사역_담당자직책
    chrgAudofirRsprCnplTpn: '', //	담당심사역_담당자연락처
    chrgAudofirRsprEad: '', //	담당심사역_담당자이메일
    contactAudofirRsprNm: '', //	연락담당자_담당자이름
    contactAudofirRsprJbclNm: '', //	연락담당자_담당자직책
    contactAudofirRsprCnplTpn: '', // 연락담당자_담당자연락처
    contactAudofirRsprEad: '', //	연락담당자_담당자이메일
    recomendIbkBuzplc: '', //	추천 기업은행 영업점
    recomendSttus: '' //	추천 진행 상태
  })

  // 투자 유치 명세
  const [vncmLoanInvest, setVncmLoanInvest] = useState({
    invtDtlsInvtDe: '', // 투자 일자
    invtDtlsInvtInstt: '', // 투자 기관명
    invtDtlsInvtKnd: '', // 투자 종류
    invtDtlsInvtAmount: 0, // 투자 금액
    invtDtlsRm: '' // 비고
  })
  const pagingRef = useRef()
  const commonContext = useContext(CommonContext)
  // 페이징
  const onChangePage = (pageNumber) => {
    console.log('pageNumber = ', pageNumber)
    pageReload(pageNumber)
  }

  // 페이지 번호 조회
  const pageReload = async (pageNumber = 1) => {
    commonContext.actions.pageMountPathCheck(history, async () => {
      await vncmInvestList(pageNumber)
    })
  }

  /** 전화번호 하이픈 및 입력제한 */
  const handlePhoneNum = (e) => {
    const regex = /^[0-9]*$/
    const num = e.target.value.replace(/-/g, '', '')
    if (regex.test(num) && e.target.value.length < 14 && num.length < 12) {
      const {
        target: { name }
      } = e
      setObj((prev) => ({ ...prev, [name]: isTelFormat(num) }))
    }
  }

  const isTelFormat = (tel) => {
    let result = ''
    if (tel.length === 8) {
      return tel.replace(/(\d{4})(\d{4})/, '$1-$2')
    } else if (tel.indexOf('02') === 0) {
      if (tel.length === 9) {
        //02-000-0000
        return tel.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3')
      } else if (tel.length === 10) {
        //02-0000-0000
        return tel.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3')
      }
    } else if (tel.length === 10) {
      //000-000-0000
      return tel.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})$/g, '$1-$2-$3')
    } else if (tel.length === 11) {
      //000-0000-0000
      return tel.replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
    }
    return tel
  }

  /**
   * (info): 자동완성 변경마다
   */
  const handleAutoBtnmSearch = (e) => {
    if (e.target.value.length > 0) {
      let data = { sicNm: e.target.value }
      $.ajax({
        type: 'POST',
        url: process.env.REACT_APP_PLATFORM_URL + '/api/cm/v1/cao002/aoSicCdListInq',
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Content-Type', 'application/json')
          xhr.setRequestHeader('appKey', process.env.REACT_APP_PLATFORM_APPKEY)
        },
        data: JSON.stringify(data),
        async: true,
        success: function (resultData) {
          setAutoBtnmSearchArr(resultData.RSLT_DATA.sicCdList)
        }
      })
    }
  }
  /**
   * (info): 자동완성 변경마다
   */
  const handleAutoRecomendIbkBuzplch = async (e) => {
    if (e.target.value.length > 0) {
      let data = { krnBrm: e.target.value }

      $.ajax({
        type: 'POST',
        url: process.env.REACT_APP_PLATFORM_URL + '/api/cm/v1/cmi012/bobInq',
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Content-Type', 'application/json')
          xhr.setRequestHeader('appKey', process.env.REACT_APP_PLATFORM_APPKEY)
        },
        data: JSON.stringify(data),
        async: true,
        success: function (resultData) {
          setAutoRecomendIbkBuzplchArr(resultData.RSLT_LIST)
        }
      })
    }
  }

  const chkAllDoc = () => {
    if (chkVnentr) {
      if (obj.etnm.length <= 0) {
        setAlertOpen(true)
        setAlertContents('기업명은 필수 입력 항목입니다.')
        return false
      } else if (obj.rprnm.length <= 0) {
        setAlertOpen(true)
        setAlertContents('대표자명은 필수 입력 항목입니다.')
        return false
      } else if (obj.rcmdEnprBzn.length <= 0) {
        setAlertOpen(true)
        setAlertContents('사업자번호는 필수 입력 항목입니다.')
        return false
      } else if (obj.col.length <= 0) {
        setAlertOpen(true)
        setAlertContents('설립년월일은 필수 입력 항목입니다.')
        return false
      } else if (obj.adr.length <= 0) {
        setAlertOpen(true)
        setAlertContents('본사 주소는 필수 입력 항목입니다.')
        return false
      } else if (null === btnm || btnm.length <= 0) {
        setAlertOpen(true)
        setAlertContents('업종명(표준산업분류)은 필수 입력 항목입니다.')
        return false
      } else if (obj.invtIndutySe.length <= 0) {
        setAlertOpen(true)
        setAlertContents('투자업종 구분은 필수 입력 항목입니다.')
        return false
      } else if (obj.mainProduct.length <= 0) {
        setAlertOpen(true)
        setAlertContents('주요제품은 필수 입력 항목입니다.')
        return false
      } else if (obj.rsprNm.length <= 0) {
        setAlertOpen(true)
        setAlertContents('기업 담당자명은 필수 입력 항목입니다.')
        return false
      } else if (obj.rsprJbclNm.length <= 0) {
        setAlertOpen(true)
        setAlertContents('담당자 직책은 필수 입력 항목입니다.')
        return false
      } else if (obj.rsprCnplTpn.length <= 0) {
        setAlertOpen(true)
        setAlertContents('담당자 이메일은 필수 입력 항목입니다.')
        return false
      } else if (obj.entrprsCmptpw.length <= 0) {
        setAlertOpen(true)
        setAlertContents('기업 경쟁력 또는 성장가능성은 필수 입력 항목입니다.')
        return false
      } else if (obj.fllwinvtPosbltyExpectEra.length <= 0) {
        setAlertOpen(true)
        setAlertContents('후속투자 가능성 및예상시기는 필수 입력 항목입니다.')
        return false
      } else if (obj.invtDtlsInvtInstt.length <= 0) {
        setAlertOpen(true)
        setAlertContents('투자기관은 필수 입력 항목입니다.')
        return false
      } else if (obj.invtDtlsInvtPnttm.length <= 0) {
        setAlertOpen(true)
        setAlertContents('투자라운드는 필수 입력 항목입니다.')
        return false
      } else if (obj.invtDtlsInvtAmount.length <= 0) {
        setAlertOpen(true)
        setAlertContents('투자금액은 필수 입력 항목입니다.')
        return false
      } else if (obj.invtDtlsInvtDe.length <= 0) {
        setAlertOpen(true)
        setAlertContents('투자일자(직전)은 필수 입력 항목입니다.')
        return false
      } else if (obj.invtDtlsStkpc.length <= 0) {
        setAlertOpen(true)
        setAlertContents('주당가격은 필수 입력 항목입니다.')
        return false
      } else if (obj.invtDtlsEtvlAmt.length <= 0) {
        setAlertOpen(true)
        setAlertContents('기업가치(원)은 필수 입력 항목입니다.')
        return false
      } else if (obj.invtDtlsInvtKnd.length <= 0) {
        setAlertOpen(true)
        setAlertContents('투자종류는 필수 입력 항목입니다.')
        return false
      } else if (obj.invtDtlsRm.length <= 0) {
        setAlertOpen(true)
        setAlertContents('비고는 필수 입력 항목입니다.')
        return false
      } else if (obj.chrgAudofirRsprNm.length <= 0) {
        setAlertOpen(true)
        setAlertContents('담당자이름은 필수 입력 항목입니다.')
        return false
      } else if (obj.chrgAudofirRsprJbclNm.length <= 0) {
        setAlertOpen(true)
        setAlertContents('담당자직책은 필수 입력 항목입니다.')
        return false
      } else if (obj.chrgAudofirRsprCnplTpn.length <= 0) {
        setAlertOpen(true)
        setAlertContents('담당자연락처는 필수 입력 항목입니다.')
        return false
      } else if (obj.chrgAudofirRsprEad.length <= 0) {
        setAlertOpen(true)
        setAlertContents('담당자이메일은 필수 입력 항목입니다.')
        return false
      } else if (obj.contactAudofirRsprNm.length <= 0) {
        setAlertOpen(true)
        setAlertContents('담당자이름은 필수 입력 항목입니다.')
        return false
      } else if (obj.contactAudofirRsprJbclNm.length <= 0) {
        setAlertOpen(true)
        setAlertContents('담당자직책은 필수 입력 항목입니다.')
        return false
      } else if (obj.contactAudofirRsprCnplTpn.length <= 0) {
        setAlertOpen(true)
        setAlertContents('담당자연락처는 필수 입력 항목입니다.')
        return false
      } else if (obj.contactAudofirRsprEad.length <= 0) {
        setAlertOpen(true)
        setAlertContents('담당자이메일은 필수 입력 항목입니다.')
        return false
      } else if (
        docInvtFactPrufPapersAtch.prevDocumentList.length + docInvtFactPrufPapersAtch.documentList.length <=
        0
      ) {
        setAlertOpen(true)
        setAlertContents('투자사실 증빙 서류 첨부는 필수 항목입니다.')
        return false
      } else if (docInvtAnalsReprtAtch.prevDocumentList.length + docInvtAnalsReprtAtch.documentList.length <= 0) {
        setAlertOpen(true)
        setAlertContents('투자분석 보고서(투자심사자료) 첨부는 필수 항목입니다.')
        return false
      } else if (docEtcFileAtch.prevDocumentList.length + docEtcFileAtch.documentList.length <= 0) {
        setAlertOpen(true)
        setAlertContents('기타 파일 첨부는 필수 항목입니다.')
        return false
      }
      sendDoc()
    } else {
      setAlertOpen(true)
      setAlertContents('투자 및 추천확인 체크박스 체크 필수입니다.')
    }
  }

  const sendDoc = async () => {
    const formData = new FormData()

    //금액 , 제거
    // obj.invtDtlsStkpc = obj.invtDtlsStkpc.replace(/,/g, '', '')
    // obj.invtDtlsEtvlAmt = obj.invtDtlsEtvlAmt.replace(/,/g, '', '')
    // obj.invtDtlsInvtAmount = obj.invtDtlsInvtAmount.replace(/,/g, '', '')

    //날짜 포멧 설정
    obj.col = Moment(obj.col).format('YYYYMMDD')
    obj.invtDtlsInvtDe = Moment(obj.invtDtlsInvtDe).format('YYYYMMDD')

    //하이픈 제거
    obj.rsprCnplTpn = obj.rsprCnplTpn.replace(/-/g, '', '')
    obj.rcmdEnprBzn = obj.rcmdEnprBzn.replace(/-/g, '', '')
    obj.rprnm = obj.rprnm.replace(/-/g, '', '')
    obj.chrgAudofirRsprCnplTpn = obj.chrgAudofirRsprCnplTpn.replace(/-/g, '', '')
    obj.contactAudofirRsprCnplTpn = obj.contactAudofirRsprCnplTpn.replace(/-/g, '', '')

    //자동완성 코드 설정
    obj.recomendIbkBuzplc !== null ? ibkBuzplc.krnBrm : ''
    obj.btnm = btnm.sicCdNm + '(' + btnm.sicCd + ')'

    //파일 삭제키
    docInvtFactPrufPapersAtch.deleteFileKey.map((delKey, idx) => {
      formData.append('deleteKeys', delKey)
    })
    docInvtAnalsReprtAtch.deleteFileKey.map((delKey, idx) => {
      formData.append('deleteKeys', delKey)
    })
    docEtcFileAtch.deleteFileKey.map((delKey, idx) => {
      formData.append('deleteKeys', delKey)
    })

    for (let key in obj) {
      formData.append(key, obj[key])
    }
    //	투자사실 증빙 서류 첨부
    for (let j = 0; j < docInvtFactPrufPapersAtch.documentList.length; j++) {
      formData.append('invtFactPrufPapersAtch', docInvtFactPrufPapersAtch.documentList[j].fileData)
    }
    //	투자분석 보고서(투자심사자료) 첨부
    for (let j = 0; j < docInvtAnalsReprtAtch.documentList.length; j++) {
      formData.append('invtAnalsReprtAtch', docInvtAnalsReprtAtch.documentList[j].fileData)
    }
    //	기타 파일 첨부
    for (let j = 0; j < docEtcFileAtch.documentList.length; j++) {
      formData.append('etcFileAtch', docEtcFileAtch.documentList[j].fileData)
    }

    const res = await CommonAxios(fileUploadConfig(formData), true)

    // 리스트개발후 리스트로 이동
    if (res?.data?.code == '200') {
      if (obj.vnentrlonId !== '') {
        setActionHome(true)
        setAlertContents('저장되었습니다.')
        setAlertOpen(true)
      } else {
        exeFunc(confirmPopRef, 'open', AlertLabels.vnentrLonSgshContinue)
      }
    } else {
      setAlertContents(res.data.message)
      setAlertOpen(true)
    }
  }

  const onCancelAlert = () => {
    exeFunc(cancelPopRef, 'open', AlertLabels.vnentrLonSgshCancel)
  }

  const savePrplcm = async (e) => {
    let vo = {}

    vo.cnpl = obj.chrgAudofirRsprCnplTpn //제안기업 담당자 심사 연락처
    vo.chrgAudofir = obj.chrgAudofirRsprNm //제안기업 담당자 이름
    vo.ead = obj.chrgAudofirRsprEad //제안기업 담당자 이메일

    vo.rcmdEnprBzn = obj.rcmdEnprBzn //추천기업 사업자번호
    vo.rcmdEnprNm = obj.etnm //추천기업 명
    vo.mainBiz = obj.mainProduct //추천기업 주요사업

    const url = Api.ibkPrplCntr.prplCmWrite

    const formData = new FormData()
    for (let key in vo) {
      formData.append(key, vo[key])
    }
    formData.append('json', new Blob([JSON.stringify(vo)], { type: 'application/json' }))

    const res = await CommonAxios(getFileUploadConfig(url, formData))

    if (res?.data?.code == '200') {
      setActionHome(true)
      setAlertContents('저장되었습니다.')
      setAlertOpen(true)
    } else {
      setActionHome(true)
      setAlertContents('투자 추천 신청에 실패하였습니다.')
      setAlertOpen(true)
    }
  }

  const fileUploadConfig = (form) => {
    const config = {
      url: Api.vncmloan.prplSave,
      method: 'post',
      data: form,
      fileused: true
    }
    return config
  }

  const getFileUploadConfig = (url, form) => {
    const config = {
      url: url,
      method: 'post',
      data: form,
      fileused: true
    }
    return config
  }

  const checkEvent = (checked) => {
    setChkVnentr(checked)
  }
  const isBusiFormat = (busiNum) => {
    return busiNum.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3')
  }

  //기업 명 가져오기 및 벤처투자기관 권한 체크
  const getUserInfo = async (vnentrlonId) => {
    const res = await CommonAxios(getConfig(Api.vncmloan.prplDetail, { vnentrlonId: vnentrlonId }), true)

    if (res?.data?.code == '200') {
      const resData = res.data.data

      if ('undefined' === resData.vnentrlonId || null === resData.vnentrlonId) {
        setObj((prev) => ({ ...prev, ['invtDtlsInvtInstt']: resData.invtDtlsInvtInstt }))
      } else {
        setObj({
          ['rcmdEnprBzn']: isBusiFormat(resData.rcmdEnprBzn),
          ['etnm']: resData.etnm,
          ['rprnm']: resData.rprnm,
          ['col']: resData.col,
          ['adr']: resData.adr,
          ['invtIndutySe']: resData.invtIndutySe,
          ['mainProduct']: resData.mainProduct,
          ['rsprNm']: resData.rsprNm,
          ['rsprJbclNm']: resData.rsprJbclNm,
          ['rsprCnplTpn']: isTelFormat(resData.rsprCnplTpn),
          ['rsprEad']: resData.rsprEad,
          ['entrprsCmptpw']: resData.entrprsCmptpw,
          ['fllwinvtPosbltyExpectEra']: resData.fllwinvtPosbltyExpectEra,
          ['invtDtlsInvtInstt']: resData.invtDtlsInvtInstt,
          ['invtDtlsInvtPnttm']: resData.invtDtlsInvtPnttm,
          ['invtDtlsInvtAmount']: resData.invtDtlsInvtAmount,
          ['invtDtlsInvtDe']: resData.invtDtlsInvtDe,
          ['invtDtlsStkpc']: resData.invtDtlsStkpc,
          ['invtDtlsEtvlAmt']: resData.invtDtlsEtvlAmt,
          ['invtDtlsInvtKnd']: resData.invtDtlsInvtKnd,
          ['invtDtlsRm']: resData.invtDtlsRm,
          ['chrgAudofirRsprNm']: resData.chrgAudofirRsprNm,
          ['chrgAudofirRsprJbclNm']: resData.chrgAudofirRsprJbclNm,
          ['chrgAudofirRsprEad']: resData.chrgAudofirRsprEad,
          ['contactAudofirRsprNm']: resData.contactAudofirRsprNm,
          ['contactAudofirRsprJbclNm']: resData.contactAudofirRsprJbclNm,
          ['contactAudofirRsprEad']: resData.contactAudofirRsprEad,
          ['chrgAudofirRsprCnplTpn']: isTelFormat(resData.chrgAudofirRsprCnplTpn),
          ['contactAudofirRsprCnplTpn']: isTelFormat(resData.contactAudofirRsprCnplTpn),
          ['recomendSttus']: resData.recomendSttus,
          ['vnentrlonId']: vnentrlonId
        })

        const docInvtFactPrufPapersFileInfo = []
        resData.invtFactPrufPapersFileInfo.map((fileInfo, idx) => {
          docInvtFactPrufPapersFileInfo.push({
            fileData: { name: fileInfo.fileNm, fileId: fileInfo.fileId },
            fileKey: 'oldData' + idx
          })
        })
        setDocInvtFactPrufPapersAtch((prev) => ({ ...prev, ['prevDocumentList']: docInvtFactPrufPapersFileInfo }))
        const docInvtAnalsReprtFileInfo = []
        resData.invtAnalsReprtFileInfo.map((fileInfo, idx) => {
          docInvtAnalsReprtFileInfo.push({
            fileData: { name: fileInfo.fileNm, fileId: fileInfo.fileId },
            fileKey: 'oldData2' + idx
          })
        })
        setDocInvtAnalsReprtAtch((prev) => ({ ...prev, ['prevDocumentList']: docInvtAnalsReprtFileInfo }))
        const docEtcFileFileInfo = []
        resData.etcFileFileInfo.map((fileInfo, idx) => {
          docEtcFileFileInfo.push({
            fileData: { name: fileInfo.fileNm, fileId: fileInfo.fileId },
            fileKey: 'oldData3' + idx
          })
        })
        setDocEtcFileAtch((prev) => ({ ...prev, ['prevDocumentList']: docEtcFileFileInfo }))

        const newBtnm = {
          sicCd: resData.btnm.split('(')[1].replace(')', ''),
          sicCdNm: resData.btnm.split('(')[0],
          sicCdAbbrNm: ''
        }
        const newibkBuzplc = { brcd: '', krnBrm: resData.recomendIbkBuzplc }
        setBtnm(newBtnm)
        setIbkBuzplc(newibkBuzplc)
      }
    } else {
      setAlertContents(res.data.message)
      setAlertOpen(true)
      setActionHome(true)
    }
  }
  //일반 문자
  const handleText = (e) => {
    const {
      target: { value, name }
    } = e
    setObj((prev) => ({ ...prev, [name]: value }))
  }

  // 투자 유치 내역 조회
  const vncmInvestList = async (pageNumber) => {
    const params = {
      page: pageNumber,
      record: 5,
      pageSize: 5
    }
    const getVncmInvestList = await CommonAxios(getConfig(Api.vncmloan.prplInvestList, params), true)
    console.log('getVncmInvestList = ', getVncmInvestList)
    if (getVncmInvestList.data.code === '200') {
      setVncmLoanInvest(getVncmInvestList.data.data.list)
      setFunc(pagingRef, 'setPaging', getVncmInvestList.data.data)
    } else {
      setAlertContents(getVncmInvestList.data.message)
      setAlertOpen(true)
      setActionHome(true)
    }
  }

  const alertConfirm = () => {
    if (actionHome) {
      history.push(ROUTER_NAMES.VNENTR_LON_SGSH_LIST_VIEW)
    } else {
      setAlertOpen(false)
    }
  }

  const alertCancelConfirm = () => {
    history.push(ROUTER_NAMES.VNENTR_LON_SGSH_LIST_VIEW)
  }

  useEffect(() => {
    //투자업종 셀렉트박스
    const invtIndutyList = codeContext.actions.getPrmrInvmTpbsList()
    setInvtIndutySeSelect({
      selList: invtIndutyList
    })

    //투자업종 셀렉트박스
    const invtDtlsInvtPnttmList = codeContext.actions.getInvestStepList()
    const item = invtDtlsInvtPnttmList.splice(5, 1)
    invtDtlsInvtPnttmList.splice(6, 0, item[0])
    setInvtDtlsInvtPnttmSelect({
      selList: invtDtlsInvtPnttmList
    })

    if (
      typeof history.location.state !== 'undefined' &&
      typeof history.location.state.data.vnentrlonId !== 'undefined'
    ) {
      getUserInfo(history.location.state.data.vnentrlonId)
      vncmInvestList(1)
    } else {
      getUserInfo('')
      vncmInvestList(1)
    }
  }, [])

  return (
    <>
      <Container maxWidth="false" disableGutters sx={{ maxWidth: '1280px', px: '1.25rem' }}>
        <Stack spacing={4} direction={'column'} sx={{ py: 5 }}>
          {/* 제안 펀드 정보 */}
          <Paper sx={{ p: 4 }}>
            <Stack direction={'column'} spacing={4}>
              <Stack direction={'column'} spacing={1}>
                <Typography variant="h3">
                  <FiberManualRecordOutlined color="primary" sx={{ mr: 1, fontSize: '1rem' }} />
                  추천기업
                </Typography>
                <Divider sx={{ height: '1px', backgroundColor: theme.palette.primary.main }} />
              </Stack>
              <Stack direction={'column'} spacing={1}>
                <Typography variant="h4">1. 기본정보</Typography>
                <Grid container sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
                  <BtContentGrid gridXs={6} title={'기업명'} required>
                    <TextFieldInput
                      size="small"
                      name="etnm"
                      item={obj}
                      values={obj.etnm}
                      numberProperty="etnm"
                      maxLength="33"
                    />
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'대표자명'} required>
                    <TextFieldInput
                      size="small"
                      name="rprnm"
                      item={obj}
                      values={obj.rprnm}
                      numberProperty="rprnm"
                      maxLength="33"
                    />
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'사업자번호'} required>
                    <TextFieldInput
                      size="small"
                      name="rcmdEnprBzn"
                      item={obj}
                      values={obj.rcmdEnprBzn}
                      numberProperty="rcmdEnprBzn"
                      maxLength="12"
                    />
                  </BtContentGrid>

                  <BtContentGrid gridXs={6} title={'설립년월일'} required>
                    <DatePicker
                      format="YYYY-MM-DD"
                      name="col"
                      value={dayjs(obj.col)}
                      onChange={(event) => {
                        obj.col = event.format('YYYYMMDD')
                      }}
                      sx={{ width: '100%' }}
                      slotProps={{ textField: { size: 'small' } }}
                    />
                  </BtContentGrid>
                  <BtContentGrid gridXs={12} title={'본사 주소'} required>
                    <TextFieldInput
                      size="small"
                      name="adr"
                      item={obj}
                      values={obj.adr}
                      numberProperty="adr"
                      maxLength="160"
                    />
                  </BtContentGrid>
                  <BtContentGrid gridXs={12} title={'업종명(표준산업분류)'} required>
                    <Autocomplete
                      disablePortal
                      size="small"
                      value={btnm}
                      onChange={(event, newValue) => {
                        setBtnm(newValue)
                      }}
                      id="combo-box-demo"
                      options={autoBtnmSearchArr}
                      getOptionLabel={(option) => option.sicCdNm.toString() + '(' + option.sicCd.toString() + ')'}
                      sx={{ width: '100%' }}
                      renderInput={(params) => (
                        <TextField {...params} onChange={handleAutoBtnmSearch} label="업종명(표준산업분류)" />
                      )}
                    />
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'투자업종 구분'} required>
                    <Stack direction={'column'} spacing={1} sx={{ width: '100%' }}>
                      <Select
                        defaultValue={6}
                        sx={{ width: '100%' }}
                        name="invtIndutySe"
                        value={obj.invtIndutySe}
                        onChange={handleText}
                        IconComponent={() => <KeyboardArrowDown sx={{ mr: 1 }} />}
                        size="small"
                      >
                        {invtIndutySeSelect.selList.map((item, index) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.value}
                          </MenuItem>
                        ))}
                      </Select>
                      <Typography variant="body2">* 영상・공연・음반, 게임은 ‘ICT 서비스’에 포함</Typography>
                    </Stack>
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'주요제품'} required>
                    <TextFieldInput
                      size="small"
                      name="mainProduct"
                      item={obj}
                      values={obj.mainProduct}
                      numberProperty="mainProduct"
                      maxLength="66"
                    />
                  </BtContentGrid>
                </Grid>
              </Stack>
              <Stack direction={'column'} spacing={1}>
                <Typography variant="h4">2. 담당자 정보</Typography>
                <Grid container sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
                  <BtContentGrid gridXs={6} title={'기업 담당자명'} required>
                    <TextFieldInput
                      size="small"
                      name="rsprNm"
                      item={obj}
                      values={obj.rsprNm}
                      numberProperty="rsprNm"
                      maxLength="33"
                    />
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'담당자 직책'} required>
                    <TextFieldInput
                      size="small"
                      name="rsprJbclNm"
                      item={obj}
                      values={obj.rsprJbclNm}
                      numberProperty="rsprJbclNm"
                      maxLength="33"
                    />
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'담당자 연락처'} required>
                    <TextFieldInput
                      size="small"
                      name="rsprCnplTpn"
                      item={obj}
                      values={obj.rsprCnplTpn}
                      numberProperty="rsprCnplTpn"
                      maxLength="13"
                    />
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'담당자 이메일'} required>
                    <TextFieldInput
                      size="small"
                      name="rsprEad"
                      item={obj}
                      values={obj.rsprEad}
                      numberProperty="rsprEad"
                      maxLength="30"
                    />
                  </BtContentGrid>
                </Grid>
              </Stack>
              <Stack direction={'column'} spacing={1}>
                <Typography variant="h4">3. 투자 의견</Typography>
                <Grid container sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
                  <BtContentGrid gridXs={12} title={'기업 경쟁력 또는 성장가능성'} required>
                    <TextAreaInput
                      size="small"
                      name="entrprsCmptpw"
                      item={obj}
                      values={obj.entrprsCmptpw}
                      numberProperty="entrprsCmptpw"
                      rows={5}
                      maxLength="1000"
                    />
                  </BtContentGrid>
                  <BtContentGrid gridXs={12} title={'후속투자 가능성 및 예상시기'} required>
                    <TextAreaInput
                      size="small"
                      name="fllwinvtPosbltyExpectEra"
                      item={obj}
                      values={obj.fllwinvtPosbltyExpectEra}
                      numberProperty="fllwinvtPosbltyExpectEra"
                      rows={5}
                      maxLength="1000"
                    />
                  </BtContentGrid>
                </Grid>
              </Stack>
              <Stack direction={'column'} spacing={1}>
                <Typography variant="h3">
                  <FiberManualRecordOutlined color="primary" sx={{ mr: 1, fontSize: '1rem' }} />
                  투자기관
                </Typography>
                <Divider sx={{ height: '1px', backgroundColor: theme.palette.primary.main }} />
              </Stack>
              <Stack direction={'column'} spacing={1}>
                <Typography variant="h4">1. 투자 내역</Typography>
                <Grid container sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
                  <BtContentGrid gridXs={6} title={'기업명'} required>
                    <TextField
                      size="small"
                      disabled
                      name="invtDtlsInvtInstt"
                      value={obj.invtDtlsInvtInstt}
                      inputProps={{ maxLength: 10 }}
                      onChange={handleText}
                      sx={{ width: '100%' }}
                    />
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'투자라운드(직전)'} required>
                    <Select
                      defaultValue={6}
                      sx={{ width: '100%' }}
                      name="invtDtlsInvtPnttm"
                      value={obj.invtDtlsInvtPnttm}
                      onChange={handleText}
                      IconComponent={() => <KeyboardArrowDown sx={{ mr: 1 }} />}
                      size="small"
                    >
                      {invtDtlsInvtPnttmSelect.selList.map((item, index) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.value}
                        </MenuItem>
                      ))}
                    </Select>
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'투자금액(원)'} required>
                    <MuiNumberInput
                      item={obj}
                      numberProperty="invtDtlsInvtAmount"
                      sx={{ width: '100%' }}
                      displayValue={obj.invtDtlsInvtAmount}
                    />
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'투자일자(직전)'} required>
                    <DatePicker
                      format="YYYY-MM-DD"
                      value={dayjs(obj.invtDtlsInvtDe)}
                      onChange={(event) => {
                        setObj((prev) => ({ ...prev, ['invtDtlsInvtDe']: event.format('YYYYMMDD') }))
                      }}
                      sx={{ width: '100%' }}
                      slotProps={{ textField: { size: 'small' } }}
                    />
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'주당가격(원)'} required>
                    <MuiNumberInput
                      item={obj}
                      numberProperty="invtDtlsStkpc"
                      sx={{ width: '100%' }}
                      displayValue={obj.invtDtlsStkpc}
                    />
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'기업가치(원)'} required>
                    <MuiNumberInput
                      item={obj}
                      numberProperty="invtDtlsEtvlAmt"
                      sx={{ width: '100%' }}
                      displayValue={obj.invtDtlsEtvlAmt}
                    />
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'투자종류'} required>
                    <TextFieldInput
                      size="small"
                      name="invtDtlsInvtKnd"
                      item={obj}
                      values={obj.invtDtlsInvtKnd}
                      numberProperty="invtDtlsInvtKnd"
                      maxLength="66"
                    />
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'비고'} required>
                    <TextFieldInput
                      size="small"
                      name="invtDtlsRm"
                      item={obj}
                      values={obj.invtDtlsRm}
                      numberProperty="invtDtlsRm"
                      maxLength="66"
                    />
                  </BtContentGrid>

                  <BtContentGrid gridXs={12} title={'투자 유치 명세'}>
                    <TableContainer component={Paper} sx={{ borderRadius: 0, boxShadow: 'none' }}>
                      <Stack sx={{ textAlign: 'right' }}>(단위 : 백만원)</Stack>
                      <Table size="small" sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead
                          sx={{
                            borderTop: `1px solid ${theme.palette.divider}`
                          }}
                        >
                          <TableRow>
                            <TableCell align="center">투자일자</TableCell>
                            <TableCell align="center" sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}>
                              투자기관명
                            </TableCell>
                            <TableCell align="center" sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}>
                              투자종류
                            </TableCell>
                            <TableCell align="center" sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}>
                              투자금액
                            </TableCell>
                            <TableCell align="center" sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}>
                              비고
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {vncmLoanInvest?.length > 0 ? (
                            vncmLoanInvest?.map((data, idx) => (
                              <TableRow key={createKey()}>
                                <TableCell align="center" component="th" scope="row">
                                  <TextFieldInput
                                    size="small"
                                    item={data}
                                    name={'invtDtlsInvtDe'}
                                    numberProperty={'invtDtlsInvtDe'}
                                    values={DateUtils.customDateFormat(data.invtDtlsInvtDe, 'yyyy-MM-dd')}
                                    disabled
                                  />
                                </TableCell>
                                <TableCell
                                  align="center"
                                  component="th"
                                  scope="row"
                                  sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                                >
                                  <TextFieldInput
                                    size="small"
                                    item={data}
                                    name={'invtDtlsInvtInstt'}
                                    numberProperty={'invtDtlsInvtInstt'}
                                    values={data.invtDtlsInvtInstt}
                                    disabled
                                  />
                                </TableCell>
                                <TableCell
                                  align="left"
                                  component="th"
                                  scope="row"
                                  sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                                >
                                  <TextFieldInput
                                    size="small"
                                    item={data}
                                    name={'invtDtlsInvtKnd'}
                                    numberProperty={'invtDtlsInvtKnd'}
                                    values={data.invtDtlsInvtKnd}
                                    disabled
                                  />
                                </TableCell>
                                <TableCell
                                  align="left"
                                  component="th"
                                  scope="row"
                                  sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                                >
                                  <MuiNumberInput
                                    item={data}
                                    numberProperty="invtDtlsInvtAmount"
                                    sx={{ width: '100%' }}
                                    displayValue={data.invtDtlsInvtAmount}
                                    disabled
                                  />
                                </TableCell>
                                <TableCell
                                  align="left"
                                  component="th"
                                  scope="row"
                                  sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                                >
                                  <TextFieldInput
                                    size="small"
                                    item={data}
                                    name={'invtDtlsRm'}
                                    numberProperty={'invtDtlsRm'}
                                    values={data.invtDtlsRm}
                                    disabled
                                  />
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <td colSpan={5}>
                              <NoResult
                                msg={'최근 2년이내 투자 유치 내역이 없습니다.'}
                                style={{ marginTop: '20px', marginBottom: '20px' }}
                              />
                            </td>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </BtContentGrid>
                </Grid>
                <Stack alignItems={'center'}>
                  <Paging ref={pagingRef} onChangePage={onChangePage} onPrev={onChangePage} onNext={onChangePage} />
                </Stack>
              </Stack>
              <Stack direction={'column'} spacing={1}>
                <Typography variant="h4">2. 담당자 정보</Typography>
                <Typography sx={{ color: theme.palette.text.sub }}>* 담당 심사역 정보</Typography>
                <Grid container sx={{ pb: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                  <BtContentGrid gridXs={6} title={'이름'} required>
                    <TextFieldInput
                      size="small"
                      name="chrgAudofirRsprNm"
                      item={obj}
                      values={obj.chrgAudofirRsprNm}
                      numberProperty="chrgAudofirRsprNm"
                      maxLength="33"
                    />
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'직책'} required>
                    <TextFieldInput
                      size="small"
                      name="chrgAudofirRsprJbclNm"
                      item={obj}
                      values={obj.chrgAudofirRsprJbclNm}
                      numberProperty="chrgAudofirRsprJbclNm"
                      maxLength="33"
                    />
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'연락처'} required>
                    <TextFieldInput
                      size="small"
                      name="chrgAudofirRsprCnplTpn"
                      item={obj}
                      values={obj.chrgAudofirRsprCnplTpn}
                      numberProperty="chrgAudofirRsprCnplTpn"
                      maxLength="13"
                    />
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'이메일'} required>
                    <TextFieldInput
                      size="small"
                      name="chrgAudofirRsprEad"
                      item={obj}
                      values={obj.chrgAudofirRsprEad}
                      numberProperty="chrgAudofirRsprEad"
                      maxLength="33"
                    />
                  </BtContentGrid>
                </Grid>
                <Typography sx={{ color: theme.palette.text.sub }}>* 연락 담당자 정보</Typography>
                <Grid container sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
                  <BtContentGrid gridXs={6} title={'이름'} required>
                    <TextFieldInput
                      size="small"
                      name="contactAudofirRsprNm"
                      item={obj}
                      values={obj.contactAudofirRsprNm}
                      numberProperty="contactAudofirRsprNm"
                      maxLength="33"
                    />
                  </BtContentGrid>

                  <BtContentGrid gridXs={6} title={'직책'} required>
                    <TextFieldInput
                      size="small"
                      name="contactAudofirRsprJbclNm"
                      item={obj}
                      values={obj.contactAudofirRsprJbclNm}
                      numberProperty="contactAudofirRsprJbclNm"
                      maxLength="33"
                    />
                  </BtContentGrid>

                  <BtContentGrid gridXs={6} title={'연락처'} required>
                    <TextFieldInput
                      size="small"
                      name="contactAudofirRsprCnplTpn"
                      item={obj}
                      values={obj.contactAudofirRsprCnplTpn}
                      numberProperty="contactAudofirRsprCnplTpn"
                      maxLength="13"
                    />
                  </BtContentGrid>

                  <BtContentGrid gridXs={6} title={'이메일'} required>
                    <TextFieldInput
                      size="small"
                      name="contactAudofirRsprEad"
                      item={obj}
                      values={obj.contactAudofirRsprEad}
                      numberProperty="contactAudofirRsprEad"
                      maxLength="33"
                    />
                  </BtContentGrid>
                </Grid>
              </Stack>

              <Stack direction={'column'} spacing={1}>
                <DocFileUpload docComponents={docInvtFactPrufPapersAtch} />
              </Stack>

              <Stack direction={'column'} spacing={1}>
                <DocFileUpload docComponents={docInvtAnalsReprtAtch} />
              </Stack>

              <Stack direction={'column'} spacing={1}>
                <DocFileUpload docComponents={docEtcFileAtch} />
              </Stack>

              <Grid container sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
                <BtContentGrid gridXs={12} title={'추천 기업은행 영업점'}>
                  <Stack sx={{ width: '100%' }} spacing={1}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo2"
                      value={ibkBuzplc}
                      onChange={(event, newValue) => {
                        setIbkBuzplc(newValue)
                      }}
                      size="small"
                      options={autoRecomendIbkBuzplchArr}
                      getOptionLabel={(option) => option.krnBrm.toString()}
                      sx={{ width: '100%' }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="recomendIbkBuzplc"
                          value={obj.recomendIbkBuzplc}
                          onChange={handleAutoRecomendIbkBuzplch}
                          label="추천 기업은행 영업점"
                        />
                      )}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox value={chkVnentr} onChange={(e) => checkEvent(e.target.checked)} sx={{ pl: 0 }} />
                      }
                      label={
                        <Typography variant="body1" sx={{ color: theme.palette.text.sub }}>
                          당사는 위 추천 기업에 대해 {Moment(obj.invtDtlsInvtDe).format('YYYY')}년{' '}
                          {Moment(obj.invtDtlsInvtDe).format('MM')}월 {Moment(obj.invtDtlsInvtDe).format('DD')}일
                          투자하고, IBK벤처대출 지원 대상기업으로 IBK기업은행에 추천하였음을 확인합니다.
                        </Typography>
                      }
                    />
                  </Stack>
                </BtContentGrid>
              </Grid>
              <Stack direction={'row'} spacing={1} justifyContent="center" alignItems="center">
                <Button size="large" variant="outlined" onClick={onCancelAlert} disableElevation>
                  취소
                </Button>
                <Button
                  onClick={() => {
                    chkAllDoc()
                  }}
                  size="large"
                  variant="contained"
                  disableElevation
                >
                  {obj.vnentrlonId !== '' ? '수정' : '제출'}
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Container>
      <ConfirmSaveAlertPopup ref={confirmPopRef} onConfirm={savePrplcm} />
      <ConfirmCancelAlertPopup ref={cancelPopRef} onConfirm={alertCancelConfirm} />
      <Suspense fallback={<></>}>
        {alertOpen ? <Alert handleAlert={alertConfirm} msg={alertContents} /> : <></>}
      </Suspense>
      {/* End of Contents */}
    </>
  )
}

export default VnentrLonSgshRegViewDetail
