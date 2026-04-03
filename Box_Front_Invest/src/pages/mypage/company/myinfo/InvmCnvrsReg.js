import { Add, CloseOutlined, FiberManualRecordOutlined } from '@mui/icons-material'
import {
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
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
import BreadCrumbs from 'components/common/BreadCrumbs'
import DatePickerItem from 'components/common/DatePickerItem'
import Footer from 'components/common/Footer'
import Gallery01 from 'components/common/Gallery01'
import TextFieldInput from 'components/common/TextFieldInput'
import Header from 'components/header/Header'
import dayjs from 'dayjs'
import Api from 'modules/consts/Api'
import { AlertLabels, BizStatusCode, CheckYn } from 'modules/consts/BizConst'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { CodeContext } from 'modules/contexts/common/CodeContext'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import CommonAxios, { getConfig, getPostConfig } from 'modules/utils/CommonAxios'
import { deepCopyByRecursion } from 'modules/utils/CommonUtils'
import { exeFunc, setFunc, setPromiseFunc } from 'modules/utils/ReactUtils'
import ResponseUtils from 'modules/utils/ResponseUtils'
import { StringUtils } from 'modules/utils/StringUtils'
import MuiNumberInput from 'pageComponents/common/number/MuiNumberInput'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import CategoryCheckBoxPopup from 'pageComponents/common/pop/CategoryCheckBoxPopup'
import ProfileImage from 'pageComponents/mypage/common/ProfileImage'
import ConvertResponsePopup from 'pageComponents/mypage/common/info/ConvertResponsePopup'
import ConvrsHnfInfo from 'pageComponents/mypage/company/myinfo/ConvrsHnfInfo'
import StchInfo from 'pageComponents/mypage/company/myinfo/StchInfo'
import VnentrLonCmRegFileInput from 'pageComponents/mypage/company/vncmloan/cmReg/FileInput'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { openSessionAlert } from 'pageComponents/common/pop/SessionCheckAlert'

const InvmCnvrsReg = (props) => {
  const fileVO = { fileNm: null, file: null, isAutoUploaded: false }
  const initSubmitVO = {
    '신용평가에 필요한 기타 서류': {
      // 개인(신용)정보 조회동의서
      innfInqCosn: { ...fileVO }
    }
  }
  const theme = useTheme()
  const history = useHistory()
  const commonContext = useContext(CommonContext)
  const codeContext = useContext(CodeContext)
  const isMounted = useRef(false)
  const messageListRef = useRef()
  const mountApiCntRef = useRef(0)
  const alertPopupRef = useRef()
  const convertInfo = useRef({})
  const techPopRef = useRef()
  const prmrInvmTpbsRef = useRef()
  const investStepListRef = useRef()
  const interestBizPopupRef = useRef()
  const convertResponsePopupRef = useRef()
  const convertResponseConfirmPopupRef = useRef()
  const [reload, setReload] = useState(false)
  const utlinsttId = useRef('')
  const [evaluationDoc, setEvalutaionDoc] = useState(deepCopyByRecursion(initSubmitVO['신용평가에 필요한 기타 서류']))
  const galleryData = {
    title: '마이페이지',
    img: '/images/gallery02_img1.png'
  }
  const rpdirInfo = {
    rpdirInfoSeq: 'rpdirInfoSeq',
    utlinsttId: 'utlinsttId',
    invmHnfNm: '',
    tpn: '',
    ead: ''
  }
  const ivcpHmrsInfo = {
    rpdirInfoSeq: 'rpdirInfoSeq',
    utlinsttId: 'utlinsttId',
    invmHnfNm: '',
    tpn: '',
    ead: ''
  }
  const mngmHmrsInfo = {
    rpdirInfoSeq: 'rpdirInfoSeq',
    utlinsttId: 'utlinsttId',
    invmHnfNm: '',
    tpn: '',
    ead: ''
  }
  const stchInfo = {
    stchInfoSeq: 'stchInfoSeq',
    utlinsttId: 'utlinsttId',
    stchNm: 'stchNm',
    cmscAmt: 'cmscAmt',
    prra: 'prra',
    rmrk: 'rmrk'
  }
  const [searchYear, setSearchYear] = useState([])
  // 입력정보 셋팅
  const [vo, setVo] = useState({
    cmpnNm: ' ', // 	회사명
    bzn: ' ', // 	사업자 등록번호
    adres: ' ', // 	화사소재지
    incrYmd: dayjs(), // 	설립년월일
    fundOprTs: dayjs(), //  펀드운용시작일
    cptsTtsm: 0, // 	자본총계
    payCapl: 0, // 	납입자본금
    dscplYn: ' ', //  징계여부
    msrnFsyr: ' ', //  최근회계연도
    astTtsmAmt: 0, //  자산총계
    lbltCpstAmt: 0, //  부채총계
    cptsTtsmAmt: 0, //  자본총계
    bsnErn: 0, //  영업수익
    bsnCt: 0, //  영업비용
    ctnpAmt: 0, //  당기순이익
    astTtsmAmt_1Y: 0, // 	자산총계1Y
    astTtsmAmt_2Y: 0, // 	자산총계2Y
    astTtsmAmt_3Y: 0,
    lbltCpstAmt_1Y: 0, // 	부채총계1Y
    lbltCpstAmt_2Y: 0, // 	부채총계2Y
    lbltCpstAmt_3Y: 0,
    cptsTtsmAmt_1Y: 0, // 	자본총계1Y
    cptsTtsmAmt_2Y: 0, // 	자본총계2Y
    cptsTtsmAmt_3Y: 0,
    bsnErn_1Y: 0, // 	영업수익1Y
    bsnErn_2Y: 0, // 	영업수익2Y
    bsnErn_3Y: 0,
    bsnCt_1Y: 0, // 	영업비용1Y
    bsnCt_2Y: 0, // 	영업비용2Y
    bsnCt_3Y: 0,
    ctnpAmt_1Y: 0, // 	당기순이익1Y
    ctnpAmt_2Y: 0, // 	당기순이익2Y
    ctnpAmt_3Y: 0,
    invmCnvsStts: '1', // 	투자사전환상태
    cnrnBizFildCon: ' ', //  관심비즈니스분야
    utlzTchn: ' ', //  관심기술유무
    prmrInvmTpbs: ' ', //  주요투자업종
    prmpInvmStg: ' ', //  주요투자단계
    rpdirInfoList: [rpdirInfo], //  대표이사 저보
    ivcpHmrsInfoList: [ivcpHmrsInfo], //  투자인력 정보
    mngmHmrsInfoList: [mngmHmrsInfo], //  관리인력 정보
    investFieldList: [], //  비즈니스분야정보
    utilTechList: [], //  관심기술정보
    prmrInvmTpbsList: [], //  주요투자업종
    investStepList: [], //  주요투자단계
    stchInfo: [], //  주주정보
    etcList: [], //  기타항목정보
    rprNm: '' // 등록자명
  })

  /**
   * 메세지 알림
   */
  const onAlert = (message) => {
    console.log('onAlert')
    exeFunc(alertPopupRef, 'open', message)
  }
  const onClickOpenInterestBizPop = () => {
    setFunc(interestBizPopupRef, 'setDataOpen', vo.investFieldList)
  }
  const onCompleteInterestBizSelect = (items) => {
    vo.investFieldList = items
    setReload(!reload)
  }
  const onClickRemoveTagListItem = (item, listName) => {
    console.table(item)
    const tempList = [...vo[String(listName)]]
    const tempVo = { ...vo }
    tempVo[String(listName)] = tempList.filter((e) => e.id !== item.id)
    setVo(tempVo)
  }

  /**
   * 관심기술
   */
  const onClickOpenTechPop = () => {
    setFunc(techPopRef, 'setDataOpen', vo.utilTechList)
  }
  const onCompleteTechSelect = (items) => {
    vo.utilTechList = items
    setReload(!reload)
  }

  /**
   * 주요투자업종
   */
  const onClickOpenPrmrInvmTpbsList = () => {
    setFunc(prmrInvmTpbsRef, 'setDataOpen', vo.prmrInvmTpbsList)
  }
  const onCompleteOpenPrmrInvmTpbsList = (items) => {
    vo.prmrInvmTpbsList = items
    setReload(!reload)
  }

  /**
   * 주요투자단계
   */
  const onClickOpenInvestStepList = () => {
    setFunc(investStepListRef, 'setDataOpen', vo.investStepList)
  }
  const onCompleteInvestStepList = (items) => {
    vo.investStepList = items
    setReload(!reload)
  }

  // 기업 기본정보 조회
  const loadBasicInfo = async () => {
    const basicInfo = await ResponseUtils.getSimpleResponse(Api.my.company.basicInfoDetail, null, false)
    return basicInfo
  }

  // 투자사 전환 요청 정보 작성 const saveRes = await CommonAxios(getPostConfig(Api.my.company.investHopeSave, saveVo), false)
  const invmCnvrsRegSaveToVc = async () => {
    if (evaluationDoc.innfInqCosn.file == null) {
      exeFunc(alertPopupRef, 'open', '사업자등록증 등록 PDF 아니면 이미지 파일 첨부 필수입니다.')
      return
    }

    let etcList = []
    let voBox = { ...vo }
    voBox.incrYmd = dayjs(voBox.incrYmd).format('YYYYMMDD')
    voBox.fundOprTs = dayjs(voBox.fundOprTs).format('YYYYMMDD')

    // 인력관리 미입력항목 체크 tobe.....
    let rpdirInfoListCount = vo.rpdirInfoList.filter((item) => item.invmHnfNm != '')
    voBox.rpdirInfoList = rpdirInfoListCount
    let ivcpHmrsInfoListCount = vo.ivcpHmrsInfoList.filter((item) => item.invmHnfNm != '')
    voBox.ivcpHmrsInfoList = ivcpHmrsInfoListCount
    let mngmHmrsInfoListCount = vo.mngmHmrsInfoList.filter((item) => item.invmHnfNm != '')
    voBox.mngmHmrsInfoList = mngmHmrsInfoListCount

    // 관심 비즈니스 분야 셋팅  "IVF00041"
    if (vo.investFieldList.length > 0) {
      voBox.cnrnBizFildCon = vo.investFieldList
        .map((item) => {
          return item.id
        })
        .toString()
      let investFieldListEtc = vo.investFieldList.filter((item) => item.id === 'IVF00041')
      if (investFieldListEtc.length) {
        etcList.push(investFieldListEtc[0].other)
      }
    }

    // 관심기술  "UTH00011"
    if (vo.utilTechList.length > 0) {
      voBox.utlzTchn = vo.utilTechList
        .map((item) => {
          return item.id
        })
        .toString()
      let utilTechListEtc = vo.utilTechList.filter((item) => item.id === 'UTH00011')
      if (utilTechListEtc.length) {
        etcList.push(utilTechListEtc[0].other)
      }
    }

    // 주요투자업종  "TPBS1009"
    if (vo.prmrInvmTpbsList.length > 0) {
      voBox.prmrInvmTpbs = vo.prmrInvmTpbsList
        .map((item) => {
          return item.id
        })
        .toString()
      let prmrInvmTpbsListEtc = vo.prmrInvmTpbsList.filter((item) => item.id === 'TPBS1009')
      if (prmrInvmTpbsListEtc.length) {
        etcList.push(prmrInvmTpbsListEtc[0].other)
      }
    }

    // 주요투자단계   "INV00005"
    if (vo.investStepList.length > 0) {
      voBox.prmpInvmStg = vo.investStepList
        .map((item) => {
          return item.id
        })
        .toString()
      let investStepListEtc = vo.investStepList.filter((item) => item.id === 'INV00005')
      if (investStepListEtc.length) {
        etcList.push(investStepListEtc[0].other)
      }
    }

    // 주요 주주 구성 정보 체크
    if (vo.stchInfo.length) {
      let arr = []
      arr = vo.stchInfo.filter((item) => item.stchNm.trim() != '')
      vo.stchInfo = arr
    }

    voBox.etcList = etcList
    console.log('voBox >>> ', voBox)
    let formData = new FormData()
    formData.append('file', evaluationDoc.innfInqCosn.file)
    formData.append('invmCnvrsRegSaveToVcVO', new Blob([JSON.stringify(voBox)], { type: 'application/json' }))

    await commonContext.actions.callbackAfterSessionRefresh(
      async () => {
        const res = await CommonAxios(getPostConfig(Api.my.company.invmCnvrsRegSave, formData), false)
        if (res && res.status === 200 && res.data.hasOwnProperty('code')) {
          if (res.data.code === '200') {
            const msg = '투자사 전환 요청이 완료됐습니다.<br /> 관리자 승인 후 투자사 회원으로 전환됩니다.'
            if (res.data.data != null) {
              exeFunc(convertResponsePopupRef, 'open', msg, res.data.data['rgsnTs'])
            }
          } else if (res.data.code === BizStatusCode.READY_APPROVAL) {
            exeFunc(convertResponsePopupRef, 'open', res.data.message, res.data.data['rgsnTs'])
          } else {
            exeFunc(alertPopupRef, 'open', AlertLabels.askAdmin)
          }
        } else {
          exeFunc(alertPopupRef, 'open', AlertLabels.askAdmin)
        }
      },
      true,
      true
    )
  }

  /** 재무정보 자동입력 스크래핑 */
  const getDataFinance = useCallback(async () => {
    const clientCertKeyYn = await CommonAxios(getPostConfig('/api/doc/infotech/simple/clientcertKey'), true)

    const compareStr = clientCertKeyYn.data.data.clientCertKey.split('/')
    // 클라우드에 등록된 인증서 조회 후 있으면 재무자동 입력 스크래핑 조회
    if (clientCertKeyYn !== null && compareStr[0] !== '9999') {
      const params = {
        clientCertKey: clientCertKeyYn.data.data.clientCertKey,
        bzn: clientCertKeyYn.data.data.bzn
      }
      const resultData = await CommonAxios(getPostConfig('/api/fund/B1003', params), true)
      console.log('resultData = ', resultData)
      if (resultData.data.message !== 'OK') {
        exeFunc(alertPopupRef, 'open', resultData.data.message)
        return
      } else {
        const firstYearList01 = resultData.data.data.list[0].fnstBrkdDVOList01.rows
        const firstYearPndlList01 = resultData.data.data.list[0].fnstBrkdDVOPndlList01.rows

        const secondYearList01 = resultData.data.data.list[1].fnstBrkdDVOList01.rows
        const secondYearPndlList01 = resultData.data.data.list[1].fnstBrkdDVOPndlList01.rows

        const lastYearList01 = resultData.data.data.list[2].fnstBrkdDVOList01.rows
        const lastYearPndlList01 = resultData.data.data.list[2].fnstBrkdDVOPndlList01.rows
        let astTtsmAmt1yRes,
          astTtsmAmt2yRes,
          lbltCpstAmt1yRes,
          lbltCpstAmt2yRes,
          cptsTtsmAmt1yRes,
          cptsTtsmAmt2yRes,
          bsnErn1yRes,
          bsnErn2yRes,
          bsnCt1yRes,
          bsnCt2yRes,
          ctnpAmt1yRes,
          ctnpAmt2yRes,
          astTtsmAmtRes,
          lbltCpstAmtRes,
          cptsTtsmAmtRes,
          bsnErnRes,
          bsnCtRes,
          ctnpAmtRes

        const arr = []

        for (let i = 0; i < firstYearList01.length; i++) {
          if (firstYearList01[i].frmlClusRfrnNo === '228') {
            astTtsmAmtRes = Number(firstYearList01[i].debAmt)
          }
          if (firstYearList01[i].frmlClusRfrnNo === '333') {
            lbltCpstAmtRes = Number(firstYearList01[i].debAmt)
          }
          if (firstYearList01[i].frmlClusRfrnNo === '382') {
            cptsTtsmAmtRes = Number(firstYearList01[i].debAmt)
          }
          if (i < 3) {
            arr.push(resultData.data.data.list[i].searchYear)
          }
        }

        for (let i = 0; i < firstYearPndlList01.length; i++) {
          if (firstYearPndlList01[i].frmlClusRfrnNo === '129') {
            bsnErnRes = Number(firstYearPndlList01[i].debAmt)
          }
          if (firstYearPndlList01[i].frmlClusRfrnNo === '085') {
            bsnCtRes = Number(firstYearPndlList01[i].debAmt)
          }
          if (firstYearPndlList01[i].frmlClusRfrnNo === '219') {
            ctnpAmtRes = Number(firstYearPndlList01[i].debAmt)
          }
        }

        for (let i = 0; i < secondYearList01.length; i++) {
          if (secondYearList01[i].frmlClusRfrnNo === '228') {
            astTtsmAmt1yRes = Number(secondYearList01[i].debAmt)
          }
          if (secondYearList01[i].frmlClusRfrnNo === '333') {
            lbltCpstAmt1yRes = Number(secondYearList01[i].debAmt)
          }
          if (secondYearList01[i].frmlClusRfrnNo === '382') {
            cptsTtsmAmt1yRes = Number(secondYearList01[i].debAmt)
          }
        }

        for (let i = 0; i < lastYearList01.length; i++) {
          if (lastYearList01[i].frmlClusRfrnNo === '228') {
            astTtsmAmt2yRes = Number(lastYearList01[i].debAmt)
          }
          if (lastYearList01[i].frmlClusRfrnNo === '333') {
            lbltCpstAmt2yRes = Number(lastYearList01[i].debAmt)
          }
          if (lastYearList01[i].frmlClusRfrnNo === '382') {
            cptsTtsmAmt2yRes = Number(lastYearList01[i].debAmt)
          }
        }

        for (let i = 0; i < secondYearPndlList01.length; i++) {
          if (secondYearPndlList01[i].frmlClusRfrnNo === '129') {
            bsnErn1yRes = Number(secondYearPndlList01[i].debAmt)
          }
          if (secondYearPndlList01[i].frmlClusRfrnNo === '085') {
            bsnCt1yRes = Number(secondYearPndlList01[i].debAmt)
          }
          if (secondYearPndlList01[i].frmlClusRfrnNo === '219') {
            ctnpAmt1yRes = Number(secondYearPndlList01[i].debAmt)
          }
        }

        for (let i = 0; i < lastYearPndlList01.length; i++) {
          if (lastYearPndlList01[i].frmlClusRfrnNo === '129') {
            bsnErn2yRes = Number(lastYearPndlList01[i].debAmt)
          }
          if (lastYearPndlList01[i].frmlClusRfrnNo === '085') {
            bsnCt2yRes = Number(lastYearPndlList01[i].debAmt)
          }
          if (lastYearPndlList01[i].frmlClusRfrnNo === '219') {
            ctnpAmt2yRes = Number(lastYearPndlList01[i].debAmt)
          }
        }
        setSearchYear(arr)
        setVo({
          ...vo,
          astTtsmAmt_1Y: astTtsmAmt1yRes, // 자산총계-1y
          astTtsmAmt_2Y: astTtsmAmt2yRes, // 자산총계-2y
          // astTtsmAmt_3Y: astTtsmAmt3yRes, // 자산총계-3y
          lbltCpstAmt_1Y: lbltCpstAmt1yRes, // 부채총계-1y
          lbltCpstAmt_2Y: lbltCpstAmt2yRes, // 부채총계-2y
          // lbltCpstAmt_3Y: lbltCpstAmt3yRes, // 부채총계-3y
          cptsTtsmAmt_1Y: cptsTtsmAmt1yRes, // 자본총계-1y
          cptsTtsmAmt_2Y: cptsTtsmAmt2yRes, // 자본총계-2y
          // cptsTtsmAmt_3Y: cptsTtsmAmt3yRes, // 자본총계-3y
          bsnErn_1Y: bsnErn1yRes, // 영업수익-1y
          bsnErn_2Y: bsnErn2yRes, // 영업수익-2y
          // bsnErn_3Y: bsnErn3yRes, // 영업수익-3y
          bsnCt_1Y: bsnCt1yRes, // 영업비용-1y
          bsnCt_2Y: bsnCt2yRes, // 영업비용-2y
          // bsnCt_3Y: bsnCt3yRes, // 영업비용-2y
          ctnpAmt_1Y: ctnpAmt1yRes, // 당기순이익-1y
          ctnpAmt_2Y: ctnpAmt2yRes, // 당기순이익-2y
          astTtsmAmt: astTtsmAmtRes, // 자산총계
          lbltCpstAmt: lbltCpstAmtRes, // 부채총계
          cptsTtsmAmt: cptsTtsmAmtRes, // 자본총계
          bsnErn: bsnErnRes, // 영업수익
          bsnCt: bsnCtRes, // 영업비용
          ctnpAmt: ctnpAmtRes // 당기순이익
        })
      }
    } else {
      // 인증서 등록 페이지 이동
      const errMsg = clientCertKeyYn.data.data.clientCertKey.split('/')
      openSessionAlert(true, errMsg[1], () =>
        window.open('https://mybank.ibk.co.kr/uib/jsp/guest/cer/cer10/cer1000/CCER100000_i.jsp')
      )
    }
  }, [vo])

  // 투자사 전환 요청 반려
  const confirmCheckConvertResult = async () => {
    await commonContext.actions.callbackAfterSessionRefresh(
      async () => {
        const res = await CommonAxios(getPostConfig(Api.my.company.convertCheckResult, { ...convertInfo.current }))

        if (!(res && res.status === 200 && res.data.hasOwnProperty('code') && res.data.code === '200')) {
          exeFunc(alertPopupRef, 'open', AlertLabels.askAdmin)
        }
      },
      true,
      true
    )
  }

  const changeEvalutaionDoc = useCallback((key, value) => {
    setEvalutaionDoc((pre) => {
      return { ...pre, [key]: value }
    })
  }, [])

  const upDateList = (itemList) => {
    setVo((pre) => ({ ...pre, ['stchInfo']: itemList }))
  }

  const basicIrInfoSearch = useCallback(async () => {
    const url = Api.fund.fundOpcmlInfoView + '/' + utlinsttId.current
    const res = await CommonAxios(getConfig(url), false)

    if (res && res.status === 200) {
      return res.data.data
    }
  }, [])
  // 재무정보 회계연도 계산
  const useBeforeYear = (type) => {
    return dayjs().subtract(type, 'year').format('YYYY') + '년'
  }

  // 첨부 파일 삭제
  const onClickFile = useCallback((param) => {
    setEvalutaionDoc((pre) => pre.filter((file) => file.blob.fileId !== param.blob.fileId))
  }, [])

  useEffect(() => {
    if (commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
      isMounted.current = true
      commonContext.actions.pageMountPathCheck(history, async () => {
        mountApiCntRef.current = 2
        // 기업 기본정보 조회
        await loadBasicInfo()
          .then((res) => {
            mountApiCntRef.current--
            // setFunc(basicInfoRef, 'setData', res);
            if (res && res.hasOwnProperty('convertInfo') && res.convertInfo !== null) {
              if (res.convertInfo['alrtCnfaYn'] === CheckYn.NO) {
                convertInfo.current = res.convertInfo
                exeFunc(
                  convertResponseConfirmPopupRef,
                  'open',
                  '투자사 전환 요청이 반려되었습니다',
                  res.convertInfo.rgsnTs
                )
              }
            }

            setVo((pre) => ({ ...pre, bzn: res.bizrno, cmpnNm: res.bplcNm, adres: res.addr }))
            utlinsttId.current = res.utlinsttId
            console.log('JSON DATA: -> ' + JSON.stringify(res))
          })
          .catch((err) => {
            console.error(err)
            mountApiCntRef.current--
          })
        // ir 정보 자동입력
        await basicIrInfoSearch()
          .then((res) => {
            mountApiCntRef.current--
            if (res && res.convertInfo !== null) {
              setVo((pre) => ({
                ...pre,
                prnNm: res.investRelation?.bnnm,
                bzn: res.investRelation?.bzn,
                incrYmd: res.investRelation.col,
                rprNm: res.investRelation?.rprnm,
                cptsTtsm: parseInt(res.irFinance?.cptsTtsmAmt),
                adres: res.investRelation?.adr,
                astTtsmAmt: parseInt(res.irFinance?.astTtsmAmt),
                lbltCpstAmt: parseInt(res.irFinance?.lbltTtsmAmt),
                cptsTtsmAmt: parseInt(res.irFinance?.cptsTtsmAmt),
                bsnErn: parseInt(res.irFinance?.opprAmt),
                bsnCt: parseInt(res.irFinance?.nonopExpAmt),
                ctnpAmt: parseInt(res.irFinance?.ctnpAmt)
                // prskCnfgInfo: res.stockHolderList
              }))
            }
            console.log('JSON DATA: -> ' + JSON.stringify(res))
          })
          .catch((err) => {
            console.error(err)
            mountApiCntRef.current--
          })

        await setPromiseFunc(messageListRef, 'setData')
      })
    }
  }, [commonContext.state.user])

  useEffect(() => {
    return () => (isMounted.current = false)
  }, [])

  return (
    <>
      <Header />
      <div className="page_container">
        <div className="wrap mypage_wrap msg_list_wrap mypage_common bg02">
          <div className="gallery_logo_wrap">
            <Gallery01 data={galleryData} />
            <ProfileImage />
          </div>
          <BreadCrumbs {...props} />
          <Container maxWidth="false" disableGutters sx={{ maxWidth: '1280px', px: '1.25rem' }}>
            <Stack spacing={4} direction={'column'} sx={{ py: 2 }}>
              <Paper sx={{ p: 4 }}>
                <Stack direction={'column'} spacing={4}>
                  <Stack direction={'column'} spacing={1}>
                    <Typography variant="h3">
                      <FiberManualRecordOutlined color="primary" sx={{ mr: 1, fontSize: '1rem' }} />
                      투자사 전환요청
                    </Typography>
                    <Grid container sx={{ borderTop: `2px solid ${theme.palette.primary.main}` }}>
                      <BtContentGrid gridXs={6} title={'회사명'}>
                        <TextFieldInput
                          item={vo}
                          title={'회사명'}
                          size="small"
                          name="cmpnNm"
                          disabled={true}
                          values={vo.cmpnNm}
                          numberProperty="cmpnNm"
                        />
                      </BtContentGrid>
                      <BtContentGrid gridXs={6} title={'사업자 등록번호'}>
                        <TextFieldInput
                          item={vo}
                          title={'사업자 등록번호'}
                          size="small"
                          name="bzn"
                          disabled={true}
                          values={StringUtils.bizNum(vo.bzn)}
                          numberProperty="bzn"
                        />
                      </BtContentGrid>
                      {/* tobe 에서 컨포넌트 공퉁으로 작성예정 시작*/}
                      <BtContentGrid gridXs={6} title={'관심 비즈니스 분야'}>
                        <Stack direction={'row'} spacing={1}>
                          <div className="tag_box_list">
                            {vo?.investFieldList?.map((_item, i) => (
                              <Button
                                className="tag_box_item"
                                key={i}
                                size="small"
                                color="info"
                                variant="outlined"
                                endIcon={
                                  <CloseOutlined onClick={() => onClickRemoveTagListItem(_item, 'investFieldList')} />
                                }
                              >
                                {_item.value == '기타' ? _item['other'] : _item['invmFildCdnm']}
                              </Button>
                            ))}
                            {vo.investFieldList !== null && vo.investFieldList.length < 5 && (
                              <Button
                                onClick={onClickOpenInterestBizPop}
                                size="small"
                                color="primary"
                                variant="outlined"
                                endIcon={<Add />}
                              >
                                추가
                              </Button>
                            )}
                          </div>
                        </Stack>
                      </BtContentGrid>
                      <BtContentGrid gridXs={6} title={'관심기술'}>
                        <Stack direction={'row'} spacing={1}>
                          <div className="tag_box_list">
                            {vo?.utilTechList?.map((_item, i) => (
                              <Button
                                className="tag_box_item"
                                key={i}
                                size="small"
                                color="info"
                                variant="outlined"
                                endIcon={
                                  <CloseOutlined onClick={() => onClickRemoveTagListItem(_item, 'utilTechList')} />
                                }
                              >
                                {_item.value == '기타' ? _item['other'] : _item['utlzTchnCdnm']}
                              </Button>
                            ))}
                            {vo.utilTechList !== null && vo.utilTechList.length < 5 && (
                              <Button
                                onClick={onClickOpenTechPop}
                                size="small"
                                color="primary"
                                variant="outlined"
                                endIcon={<Add />}
                              >
                                추가
                              </Button>
                            )}
                          </div>
                        </Stack>
                      </BtContentGrid>
                      <BtContentGrid gridXs={6} title={'주요투자업종'}>
                        <Stack direction={'row'} spacing={1}>
                          <div className="tag_box_list">
                            {vo?.prmrInvmTpbsList?.map((_item, i) => (
                              <Button
                                className="tag_box_item"
                                key={i}
                                size="small"
                                color="info"
                                variant="outlined"
                                endIcon={
                                  <CloseOutlined onClick={() => onClickRemoveTagListItem(_item, 'prmrInvmTpbsList')} />
                                }
                              >
                                {_item.value == '기타' ? _item['other'] : _item['comCdNm']}
                              </Button>
                            ))}
                            {vo.prmrInvmTpbsList !== null && vo.prmrInvmTpbsList.length < 5 && (
                              <Button
                                onClick={onClickOpenPrmrInvmTpbsList}
                                size="small"
                                color="primary"
                                variant="outlined"
                                endIcon={<Add />}
                              >
                                추가
                              </Button>
                            )}
                          </div>
                        </Stack>
                      </BtContentGrid>
                      <BtContentGrid gridXs={6} title={'주요투자단계'}>
                        <Stack direction={'row'} spacing={1}>
                          <div className="tag_box_list">
                            {vo?.investStepList?.map((_item, i) => (
                              <Button
                                className="tag_box_item"
                                key={i}
                                size="small"
                                color="info"
                                variant="outlined"
                                endIcon={
                                  <CloseOutlined onClick={() => onClickRemoveTagListItem(_item, 'investStepList')} />
                                }
                              >
                                {_item.value == '기타' ? _item['other'] : _item['comCdNm']}
                              </Button>
                            ))}
                            {vo.investStepList !== null && vo.investStepList.length < 5 && (
                              <Button
                                onClick={onClickOpenInvestStepList}
                                size="small"
                                color="primary"
                                variant="outlined"
                                endIcon={<Add />}
                              >
                                추가
                              </Button>
                            )}
                          </div>
                        </Stack>
                      </BtContentGrid>
                      {/* tobe 에서 컨포넌트 공퉁으로 작성예정 종료*/}
                      {/* 
                                                1. 대표이사 정보 추
                                                2. 투자인력 정보
                                                3. 관리인력 정보 */}
                      <ConvrsHnfInfo
                        key={'rpdirInfoList'}
                        title={'대표이사 정보'}
                        type={'rpdirInfoList'}
                        keyProp={'rpdirInfoList'}
                        {...rpdirInfo}
                        showMonthYearPicker={true}
                        list={vo['rpdirInfoList']}
                        setList={setVo}
                      />
                      <ConvrsHnfInfo
                        key={'ivcpHmrsInfoList'}
                        title={'투자인력 정보'}
                        type={'ivcpHmrsInfoList'}
                        keyProp={'ivcpHmrsInfoList'}
                        {...ivcpHmrsInfo}
                        showMonthYearPicker={true}
                        list={vo['ivcpHmrsInfoList']}
                      />
                      <ConvrsHnfInfo
                        key={'mngmHmrsInfoList'}
                        title={'관리인력 정보'}
                        type={'mngmHmrsInfoList'}
                        keyProp={'mngmHmrsInfoList'}
                        {...mngmHmrsInfo}
                        showMonthYearPicker={true}
                        list={vo['mngmHmrsInfoList']}
                      />
                    </Grid>
                  </Stack>
                  {/* 필요 서류 제출*/}

                  <Stack direction={'column'} spacing={1}>
                    <Typography variant="h3">
                      <FiberManualRecordOutlined color="primary" sx={{ mr: 1, fontSize: '1rem' }} />
                      필요한서류 제출
                    </Typography>
                    <Divider sx={{ height: '1px', backgroundColor: theme.palette.primary.main }} />
                  </Stack>
                  <Stack direction={'row'} spacing={1}>
                    <Grid container sx={{ flexDirection: 'row' }}>
                      <BtContentGrid gridXs={6} title={'사업자등록증 등록'} required={true}>
                        <VnentrLonCmRegFileInput
                          filename={evaluationDoc['innfInqCosn'].fileNm}
                          isAuto={evaluationDoc['innfInqCosn'].isAutoUploaded}
                          vcType={true}
                          onFileUpload={(file) => {
                            changeEvalutaionDoc('innfInqCosn', { ...file, isAutoUploaded: false })
                          }}
                          onRemoveFile={() => {
                            changeEvalutaionDoc('innfInqCosn', { ...fileVO })
                          }}
                          readOnly={false}
                          onFileNameClick={() => {
                            onClickFile(evaluationDoc['innfInqCosn'])
                          }}
                        />
                      </BtContentGrid>
                    </Grid>
                  </Stack>

                  <Stack direction={'column'} spacing={1}>
                    <Stack direction={'row'} spacing={2}>
                      <Typography variant="h3">
                        <FiberManualRecordOutlined color="primary" sx={{ mr: 1, fontSize: '1rem' }} />
                        상세 정보 등록(선택)
                      </Typography>

                      <Typography variant="body1" sx={{ color: theme.palette.text.sub }}>
                        * 상세등록을 하시면 IBK 금융그룹에 출자 신청 시 편리합니다.
                      </Typography>
                    </Stack>

                    <Stack
                      direction={'row'}
                      spacing={2}
                      justifyContent="flex-start"
                      alignItems="center"
                      sx={{ pt: 2, pb: 1, borderTop: `2px solid ${theme.palette.primary.main}` }}
                    >
                      <Typography variant="body1" flexGrow={1}>
                        등록되어 있는 IR 정보를 자동으로 불러옵니다.
                        <br />
                        그리고 아래 항목을 입력하시면 BOX IR 정보에 자동으로 반영됩니다.
                      </Typography>
                      <Button size="small" color="primary" variant="outlined" onClick={getDataFinance}>
                        재무정보 자동 입력
                      </Button>
                    </Stack>

                    <Grid container sx={{ marginTop: 0, borderTop: `1px solid ${theme.palette.divider}` }}>
                      <BtContentGrid gridXs={6} title={'회사명'}>
                        <TextFieldInput
                          item={vo}
                          title={'회사명'}
                          size="small"
                          name="cmpnNm"
                          values={vo.cmpnNm}
                          numberProperty="cmpnNm"
                        />
                      </BtContentGrid>
                      <BtContentGrid gridXs={6} title={'회사소재지'}>
                        <TextFieldInput
                          item={vo}
                          title={'회사소재지'}
                          name="adres"
                          size="small"
                          values={vo.adres}
                          numberProperty="adres"
                        />
                      </BtContentGrid>
                      <DatePickerItem
                        item={vo}
                        title={'설립년월일'}
                        size="small"
                        name="incrYmd"
                        format={'YYYY-MM-DD'}
                        values={dayjs(vo.incrYmd)}
                        numberProperty="incrYmd"
                        // changeNow={(newval) => {
                        //   let box = dayjs(newval).diff(vo.incrYmd, 'day')
                        //   if (box < 0) {
                        //     // alert(dayjs(newval).diff(vo.incrYmd, 'day'))
                        //   } else {
                        //     // alert('dayjs(newval).diff(vo.incrYmd')
                        //     setVo((pre) => ({ ...pre, ['incrYmd']: dayjs() }))
                        //   }
                        // }}
                      />
                      <DatePickerItem
                        item={vo}
                        title={'펀드운용 시작일'}
                        size="small"
                        name="fundOprTs"
                        format={'YYYY-MM-DD'}
                        values={dayjs(vo.fundOprTs)}
                        numberProperty="fundOprTs"
                        // changeNow={(newval) => {
                        //   let box = dayjs(newval).diff(vo.incrYmd, 'day')
                        //   if (box > 0) {
                        //     // alert(dayjs(newval).diff(vo.incrYmd, 'day'))
                        //   } else {
                        //     // alert('dayjs(newval).diff(vo.incrYmd')
                        //     setVo((pre) => ({ ...pre, ['fundOprTs']: dayjs() }))
                        //   }
                        // }}
                      />
                      <BtContentGrid gridXs={6} title={'자본 총계'}>
                        <MuiNumberInput
                          item={vo}
                          title={' 금액'}
                          name="cptsTtsm"
                          value={vo.cptsTtsm}
                          numberProperty="cptsTtsm"
                          sx={{
                            width: '100%',
                            backgroundColor: theme.palette.disabled.lighter
                          }}
                        />
                      </BtContentGrid>
                      <BtContentGrid gridXs={6} title={'납입 자본금'}>
                        <MuiNumberInput
                          item={vo}
                          title={' 금액'}
                          name="payCapl"
                          value={vo.payCapl}
                          numberProperty="payCapl"
                          sx={{
                            width: '100%',
                            backgroundColor: theme.palette.disabled.lighter
                          }}
                        />
                      </BtContentGrid>
                      <BtContentGrid gridXs={12} title={'징계여부'}>
                        <TextFieldInput
                          item={vo}
                          title={'징계여부'}
                          name="dscplYn"
                          size="small"
                          value={vo.dscplYn}
                          numberProperty="dscplYn"
                        />
                      </BtContentGrid>
                      <BtContentGrid
                        gridXs={12}
                        title={'제무정보'}
                        additionalContents={
                          <Typography variant="body2" sx={{ color: theme.palette.text.sub }}>
                            (단위:원)
                          </Typography>
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
                                <TableCell align="center">구분 / 연도</TableCell>
                                <TableCell align="center" sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}>
                                  {searchYear[0] === undefined ? useBeforeYear(1) : searchYear[0] + '년'}
                                </TableCell>
                                <TableCell align="center" sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}>
                                  {searchYear[1] === undefined ? useBeforeYear(2) : searchYear[1] + '년'}
                                </TableCell>
                                <TableCell align="center" sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}>
                                  {searchYear[2] === undefined ? useBeforeYear(3) : searchYear[2] + '년'}
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
                                    item={vo}
                                    title={' 금액'}
                                    name="astTtsmAmt"
                                    value={vo.astTtsmAmt}
                                    numberProperty="astTtsmAmt"
                                    sx={{
                                      width: '100%',
                                      backgroundColor: theme.palette.disabled.lighter
                                    }}
                                  />
                                </TableCell>
                                <TableCell
                                  align="left"
                                  component="th"
                                  scope="row"
                                  sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                                >
                                  <MuiNumberInput
                                    item={vo}
                                    title={' 금액'}
                                    name="astTtsmAmt_1Y"
                                    value={vo.astTtsmAmt_1Y}
                                    numberProperty="astTtsmAmt_1Y"
                                    sx={{
                                      width: '100%',
                                      backgroundColor: theme.palette.disabled.lighter
                                    }}
                                  />
                                </TableCell>
                                <TableCell
                                  align="left"
                                  component="th"
                                  scope="row"
                                  sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                                >
                                  <MuiNumberInput
                                    item={vo}
                                    title={' 금액'}
                                    name="astTtsmAmt_2Y"
                                    value={vo.astTtsmAmt_2Y}
                                    numberProperty="astTtsmAmt_2Y"
                                    sx={{
                                      width: '100%',
                                      backgroundColor: theme.palette.disabled.lighter
                                    }}
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
                                    item={vo}
                                    title={' 금액'}
                                    name="lbltCpstAmt"
                                    value={vo.lbltCpstAmt}
                                    numberProperty="lbltCpstAmt"
                                    sx={{
                                      width: '100%',
                                      backgroundColor: theme.palette.disabled.lighter
                                    }}
                                  />
                                </TableCell>
                                <TableCell
                                  align="left"
                                  component="th"
                                  scope="row"
                                  sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                                >
                                  <MuiNumberInput
                                    item={vo}
                                    title={' 금액'}
                                    name="lbltCpstAmt_1Y"
                                    value={vo.lbltCpstAmt_1Y}
                                    numberProperty="lbltCpstAmt_1Y"
                                    sx={{
                                      width: '100%',
                                      backgroundColor: theme.palette.disabled.lighter
                                    }}
                                  />
                                </TableCell>
                                <TableCell
                                  align="left"
                                  component="th"
                                  scope="row"
                                  sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                                >
                                  <MuiNumberInput
                                    item={vo}
                                    title={' 금액'}
                                    name="lbltCpstAmt_2Y"
                                    value={vo.lbltCpstAmt_2Y}
                                    numberProperty="lbltCpstAmt_2Y"
                                    sx={{
                                      width: '100%',
                                      backgroundColor: theme.palette.disabled.lighter
                                    }}
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
                                    item={vo}
                                    title={' 금액'}
                                    name="cptsTtsmAmt"
                                    value={vo.cptsTtsmAmt}
                                    numberProperty="cptsTtsmAmt"
                                    sx={{
                                      width: '100%',
                                      backgroundColor: theme.palette.disabled.lighter
                                    }}
                                  />
                                </TableCell>
                                <TableCell
                                  align="left"
                                  component="th"
                                  scope="row"
                                  sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                                >
                                  <MuiNumberInput
                                    item={vo}
                                    title={' 금액'}
                                    name="cptsTtsmAmt_1Y"
                                    value={vo.cptsTtsmAmt_1Y}
                                    numberProperty="cptsTtsmAmt_1Y"
                                    sx={{
                                      width: '100%',
                                      backgroundColor: theme.palette.disabled.lighter
                                    }}
                                  />
                                </TableCell>
                                <TableCell
                                  align="left"
                                  component="th"
                                  scope="row"
                                  sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                                >
                                  <MuiNumberInput
                                    item={vo}
                                    title={' 금액'}
                                    name="cptsTtsmAmt_2Y"
                                    value={vo.cptsTtsmAmt_2Y}
                                    numberProperty="cptsTtsmAmt_2Y"
                                    sx={{
                                      width: '100%',
                                      backgroundColor: theme.palette.disabled.lighter
                                    }}
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
                                    item={vo}
                                    title={' 금액'}
                                    name="bsnErn"
                                    value={vo.bsnErn}
                                    numberProperty="bsnErn"
                                    sx={{
                                      width: '100%',
                                      backgroundColor: theme.palette.disabled.lighter
                                    }}
                                  />
                                </TableCell>
                                <TableCell
                                  align="left"
                                  component="th"
                                  scope="row"
                                  sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                                >
                                  <MuiNumberInput
                                    item={vo}
                                    title={' 금액'}
                                    name="bsnErn_1Y"
                                    value={vo.bsnErn_1Y}
                                    numberProperty="bsnErn_1Y"
                                    sx={{
                                      width: '100%',
                                      backgroundColor: theme.palette.disabled.lighter
                                    }}
                                  />
                                </TableCell>
                                <TableCell
                                  align="left"
                                  component="th"
                                  scope="row"
                                  sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                                >
                                  <MuiNumberInput
                                    item={vo}
                                    title={' 금액'}
                                    name="bsnErn_2Y"
                                    value={vo.bsnErn_2Y}
                                    numberProperty="bsnErn_2Y"
                                    sx={{
                                      width: '100%',
                                      backgroundColor: theme.palette.disabled.lighter
                                    }}
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
                                    item={vo}
                                    title={' 금액'}
                                    name="bsnCt"
                                    value={vo.bsnCt}
                                    numberProperty="bsnCt"
                                    sx={{
                                      width: '100%',
                                      backgroundColor: theme.palette.disabled.lighter
                                    }}
                                  />
                                </TableCell>
                                <TableCell
                                  align="left"
                                  component="th"
                                  scope="row"
                                  sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                                >
                                  <MuiNumberInput
                                    item={vo}
                                    title={' 금액'}
                                    name="bsnCt_1Y"
                                    value={vo.bsnCt_1Y}
                                    numberProperty="bsnCt_1Y"
                                    sx={{
                                      width: '100%',
                                      backgroundColor: theme.palette.disabled.lighter
                                    }}
                                  />
                                </TableCell>
                                <TableCell
                                  align="left"
                                  component="th"
                                  scope="row"
                                  sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                                >
                                  <MuiNumberInput
                                    item={vo}
                                    title={' 금액'}
                                    name="bsnCt_2Y"
                                    value={vo.bsnCt_2Y}
                                    numberProperty="bsnCt_2Y"
                                    sx={{
                                      width: '100%',
                                      backgroundColor: theme.palette.disabled.lighter
                                    }}
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
                                    item={vo}
                                    title={'당기순이익'}
                                    name="ctnpAmt"
                                    value={vo.ctnpAmt}
                                    numberProperty="ctnpAmt"
                                    sx={{
                                      width: '100%',
                                      backgroundColor: theme.palette.disabled.lighter
                                    }}
                                  />
                                </TableCell>
                                <TableCell
                                  align="left"
                                  component="th"
                                  scope="row"
                                  sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                                >
                                  <MuiNumberInput
                                    item={vo}
                                    title={'당기순이익1년전'}
                                    name="ctnpAmt_1Y"
                                    value={vo.ctnpAmt_1Y}
                                    numberProperty="ctnpAmt_1Y"
                                    sx={{
                                      width: '100%',
                                      backgroundColor: theme.palette.disabled.lighter
                                    }}
                                  />
                                </TableCell>
                                <TableCell
                                  align="left"
                                  component="th"
                                  scope="row"
                                  sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                                >
                                  <MuiNumberInput
                                    item={vo}
                                    title={'당기순이익2년전'}
                                    name="ctnpAmt_2Y"
                                    value={vo.ctnpAmt_2Y}
                                    numberProperty="ctnpAmt_2Y"
                                    sx={{
                                      width: '100%',
                                      backgroundColor: theme.palette.disabled.lighter
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </BtContentGrid>
                      {/* 주주 */}
                      <StchInfo
                        title={'주요 주주 구성'}
                        type={'stchSqn'}
                        keyProp={'stchSqn'}
                        {...stchInfo}
                        showMonthYearPicker={true}
                        list={vo['stchInfo']}
                        upDateList={upDateList}
                      />
                    </Grid>
                  </Stack>
                  <Stack
                    direction={'row'}
                    spacing={1}
                    justifyContent="center"
                    alignItems="center"
                    sx={{ px: 2, py: 2 }}
                  >
                    <Button
                      onClick={() => history.push(ROUTER_NAMES.MY_PAGE_COMPANY_INFO)}
                      variant="outlined"
                      size="large"
                      color="primary"
                      disableElevation
                    >
                      취소
                    </Button>
                    <Button
                      variant="contained"
                      size="large"
                      color="primary"
                      disableElevation
                      onClick={invmCnvrsRegSaveToVc}
                    >
                      신청
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            </Stack>
          </Container>
          <Footer />
        </div>
      </div>
      <ConvertResponsePopup ref={convertResponseConfirmPopupRef} onConfirm={confirmCheckConvertResult} />
      <CategoryCheckBoxPopup
        ref={interestBizPopupRef}
        onAlert={onAlert}
        onComplete={onCompleteInterestBizSelect}
        title={'비즈니스 분야'}
        getCodeContextFunc={codeContext.actions.getCategoryList}
      />
      <CategoryCheckBoxPopup
        ref={techPopRef}
        onAlert={onAlert}
        onComplete={onCompleteTechSelect}
        title={'관심기술'}
        getCodeContextFunc={codeContext.actions.getTechList}
      />
      <CategoryCheckBoxPopup
        ref={prmrInvmTpbsRef}
        onAlert={onAlert}
        onComplete={onCompleteOpenPrmrInvmTpbsList}
        title={'주요투자업종'}
        getCodeContextFunc={codeContext.actions.getPrmrInvmTpbsList}
      />
      <CategoryCheckBoxPopup
        ref={investStepListRef}
        onAlert={onAlert}
        onComplete={onCompleteInvestStepList}
        title={'주요투자단계'}
        getCodeContextFunc={codeContext.actions.getInvestStepList}
      />
      <ConvertResponsePopup ref={convertResponsePopupRef} redirectUrl={true} />
      <AlertPopup ref={alertPopupRef} />
    </>
  )
}
export default InvmCnvrsReg
