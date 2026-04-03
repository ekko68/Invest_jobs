import { FiberManualRecordOutlined } from '@mui/icons-material'
import { Button, Container, Divider, Paper, Stack, Step, StepLabel, Stepper, Typography, useTheme } from '@mui/material'
import dayjs from 'dayjs'
import Api from 'modules/consts/Api'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import CommonAxios, { getConfig, getPostConfig, getFileUploadConfig } from 'modules/utils/CommonAxios'
import QueryUtils from 'modules/utils/QueryUtils'
import { exeFunc } from 'modules/utils/ReactUtils'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import FundDoc from 'pageComponents/ibkPrplCntr/fund/FundDoc'
import FundValidtionPop from 'pageComponents/ibkPrplCntr/fund/FundValidtionPop'
import ManageHnfInfo from 'pageComponents/ibkPrplCntr/fund/ManageHnfInfo'
import OprtorFundInfo from 'pageComponents/ibkPrplCntr/fund/OprtorFundInfo'
import OprtorHmfInfo from 'pageComponents/ibkPrplCntr/fund/OprtorHmfInfo'
import OprtorInfo from 'pageComponents/ibkPrplCntr/fund/OprtorInfo'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import ResponseUtils from 'modules/utils/ResponseUtils'
import html2canvas from 'html2canvas'
import jsPdf from 'jspdf'
import { openSessionAlert } from 'pageComponents/common/pop/SessionCheckAlert'

const FundPrplInfoStep2 = (props) => {
  const theme = useTheme()
  const history = useHistory()
  const commonContext = useContext(CommonContext)
  const oprtorInfoRef = useRef()
  const oprtorHmfRef = useRef()
  const manageHnfRef = useRef()
  const [chkVal, setChkVal] = useState('')
  const popupRef = useRef()
  const idRef = useRef()

  const [copyData, setCopyData] = useState('')
  const [searchYear, setSearchYear] = useState([])
  const [vo, setVo] = useState({
    utlinsttId: '',
    prnNm: '',
    fundId: '',
    fundNm: '',
    bzn: '',
    rprNm: '',
    adres: '',
    incrYmd: dayjs(new Date()).format('YYYYMMDD'),
    fundOprTs: dayjs(new Date()).format('YYYYMMDD'),
    cptsTtsm: 0,
    payCapl: 0,
    dscplYn: '',
    astTtsmAmt: 0,
    lbltCpstAmt: 0,
    cptsTtsmAmt: 0,
    bsnErn: 0,
    bsnCt: 0,
    ctnpAmt: 0,
    astTtsmAmt1y: 0,
    astTtsmAmt2y: 0,
    lbltCpstAmt1y: 0,
    lbltCpstAmt2y: 0,
    cptsTtsmAmt1y: 0,
    cptsTtsmAmt2y: 0,
    bsnErn1y: 0,
    bsnErn2y: 0,
    bsnCt1y: 0,
    bsnCt2y: 0,
    ctnpAmt1y: 0,
    ctnpAmt2y: 0,
    progrsStg: '',
    opratnScaleCo: 0,
    opratnScaleAm: 0,
    blindCo: 0,
    blindAm: 0,
    prjctCo: 0,
    prjctAm: 0,
    lqdFundErnrt: 0,
    fundExhsRt: '',
    opratnHnfInfoTotCo: 0,
    opratnHnfInfoMngrNm: '',
    opratnHnfInfoDscplYn: '',
    manageHnfInfoTotCo: '',
    manageHnfInfoHnf: '',
    rgsnTs: '',
    rgsnUserId: '',
    amnnTs: '',
    amnnUserId: '',
    managedtaAtchmnfl: '', // 첨부파일 등록
    proFundPartcptn: [], // 제안 펀드 참여 운용 인력
    opratnHmfMntnc: [], // 운용인력 유지율
    opratnHnfInfoDscplL: [], // 운용인력 징계여부
    fundStchCnfgList: [], // 주요 주주구성
    cogpYn: '', // CO-GP여부
    majorPrnNm: '' // 주 운용사명
  })
  const alertPopRef = useRef()
  const [tempFiles, setTempFiles] = useState([])

  /** 재무정보 자동입력 스크래핑 */
  const getDataFinance = useCallback(async () => {
    const clientCertKeyYn = await CommonAxios(getPostConfig('/api/doc/infotech/simple/clientcertKey'), true)

    // 클라우드에 등록된 인증서 조회 후 있으면 재무자동 입력 스크래핑 조회
    const compareStr = clientCertKeyYn.data.data.clientCertKey.split('/')
    if (clientCertKeyYn !== null && compareStr[0] !== '9999') {
      const params = {
        clientCertKey: clientCertKeyYn.data.data.clientCertKey,
        bzn: clientCertKeyYn.data.data.bzn
      }
      const resultData = await CommonAxios(getPostConfig('/api/fund/B1003', params), true)
      console.log('resultData = ', resultData)
      if (resultData.data.message !== 'OK') {
        exeFunc(alertPopRef, 'open', resultData.data.message)
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
          astTtsmAmt1y: astTtsmAmt1yRes, // 자산총계-1y
          astTtsmAmt2y: astTtsmAmt2yRes, // 자산총계-2y
          lbltCpstAmt1y: lbltCpstAmt1yRes, // 부채총계-1y
          lbltCpstAmt2y: lbltCpstAmt2yRes, // 부채총계-2y
          cptsTtsmAmt1y: cptsTtsmAmt1yRes, // 자본총계-1y
          cptsTtsmAmt2y: cptsTtsmAmt2yRes, // 자본총계-2y
          bsnErn1y: bsnErn1yRes, // 영업수익-1y
          bsnErn2y: bsnErn2yRes, // 영업수익-2y
          bsnCt1y: bsnCt1yRes, // 영업비용-1y
          bsnCt2y: bsnCt2yRes, // 영업비용-2y
          ctnpAmt1y: ctnpAmt1yRes, // 당기순이익-1y
          ctnpAmt2y: ctnpAmt2yRes, // 당기순이익-2y
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

  //필수 값 체크
  const chkValidation = (chkYn) => {
    if (vo.prnNm === '') {
      setChkVal('운용사명')
      return true
    } else if (vo.bzn === '') {
      setChkVal('사업자번호')
      return true
    } else if (vo.rprNm === '') {
      setChkVal('대표이사')
      return true
    } else if (vo.adres === '') {
      setChkVal('회사 소재지')
      return true
    } else if (vo.incrYmd === null) {
      setChkVal('설립년월일')
      return true
    } else if (vo.fundOprTs === '') {
      setChkVal('펀드운용 시작일')
      return true
    } else if (vo.cptsTtsm === 0) {
      setChkVal('자본총계')
      return true
    } else if (vo.payCapl === 0) {
      setChkVal('납입 자본금')
      return true
    } else if (vo.astTtsmAmt === 0) {
      setChkVal('자산총계')
      return true
    } else if (vo.astTtsmAmt1y === 0 && chkYn === 'N') {
      setChkVal('자산총계 -1Y')
      return true
    } else if (vo.astTtsmAmt2y === 0 && chkYn === 'N') {
      setChkVal('자산총계 -2Y')
      return true
    } else if (vo.lbltCpstAmt === 0) {
      setChkVal('부채총계')
      return true
    } else if (vo.lbltCpstAmt1y === 0 && chkYn === 'N') {
      setChkVal('부채총계 -1Y')
      return true
    } else if (vo.lbltCpstAmt2y === 0 && chkYn === 'N') {
      setChkVal('부채총계 -2Y')
      return true
    } else if (vo.cptsTtsmAmt === 0) {
      setChkVal('자본총계')
      return true
    } else if (vo.cptsTtsmAmt1y === 0 && chkYn === 'N') {
      setChkVal('자본총계 -1Y')
      return true
    } else if (vo.cptsTtsmAmt2y === 0 && chkYn === 'N') {
      setChkVal('자본총계 -2Y')
      return true
    } else if (vo.bsnErn === 0) {
      setChkVal('영업수익')
      return true
    } else if (vo.bsnErn1y === 0 && chkYn === 'N') {
      setChkVal('영업수익 -1Y')
      return true
    } else if (vo.bsnErn2y === 0 && chkYn === 'N') {
      setChkVal('영업수익 -2Y')
      return true
    } else if (vo.bsnCt === 0) {
      setChkVal('영업비용')
      return true
    } else if (vo.bsnCt1y === 0 && chkYn === 'N') {
      setChkVal('영업비용 -1Y')
      return true
    } else if (vo.bsnCt2y === 0 && chkYn === 'N') {
      setChkVal('영업비용 -2Y')
      return true
    } else if (vo.ctnpAmt === 0) {
      setChkVal('당기순이익')
      return true
    } else if (vo.ctnpAmt1y === 0 && chkYn === 'N') {
      setChkVal('당기순이익 -1Y')
      return true
    } else if (vo.ctnpAmt2y === 0 && chkYn === 'N') {
      setChkVal('당기순이익 -2Y')
      return true
    } else if (vo.opratnHnfInfoTotCo === 0) {
      setChkVal('총 운용인력 수')
      return true
    } else if (vo.opratnHnfInfoMngrNm === '') {
      setChkVal('대표 펀드 매니저명')
      return true
    }

    if (oprtorInfoRef.current.oprtorInfoResult()[0].length === 0) {
      setChkVal('주요 주주 구성')
      return true
    } else {
      for (let i = 0; i < oprtorInfoRef.current.oprtorInfoResult()[0].length; i++) {
        if (i === 0) {
          if (oprtorInfoRef.current.oprtorInfoResult()[0][i].stchNm === '') {
            setChkVal('주요 주주 구성 주주명')
            return true
          } else if (oprtorInfoRef.current.oprtorInfoResult()[0][i].prtnAmt === 0) {
            setChkVal('주요 주주 구성 지분액')
            return true
          } else if (oprtorInfoRef.current.oprtorInfoResult()[0][i].prtnRto === 0) {
            setChkVal('주요 주주 구성 지분율')
            return true
          }
        }

        if (i > 0) {
          if(oprtorInfoRef.current.oprtorInfoResult()[0][i].stchNm !== '') {
            if (oprtorInfoRef.current.oprtorInfoResult()[0][i].prtnAmt === 0) {
              setChkVal('주요 주주 구성 지분액')
              return true
            } else if (oprtorInfoRef.current.oprtorInfoResult()[0][i].prtnRto === 0) {
              setChkVal('주요 주주 구성 지분율')
              return true
            }
          }
        }
      }
    }

    if (vo.opratnHnfInfoTotCo === 0) {
      setChkVal('총 운용인력 수')
      return true
    } else if (vo.opratnHnfInfoMngrNm === '') {
      setChkVal('대표 펀드 매니저명')
      return true
    }

    if (oprtorHmfRef.current.resultObj()[1].length === 0) {
      setChkVal('제안펀드 참여 운용인력')
      return true
    } else {
      for (let i = 0; i < oprtorHmfRef.current.resultObj()[1].length; i++) {
        if (i === 0) {
          if (oprtorHmfRef.current.resultObj()[1][i].hmrsDsnc === '0') {
            setChkVal('제안펀드 참여 운용인력 인력구분')
            return true
          }else if (oprtorHmfRef.current.resultObj()[1][i].partcptnNm === '') {
            setChkVal('제안펀드 참여 운용인력 이름')
            return true
          } else if (oprtorHmfRef.current.resultObj()[1][i].invtCareer === '') {
            setChkVal('제안펀드 참여 운용인력 투자경력')
            return true
          } else if (oprtorHmfRef.current.resultObj()[1][i].cnwkYyCnt === '') {
            setChkVal('제안펀드 참여 운용인력 근속연수')
            return true
          } else if (oprtorHmfRef.current.resultObj()[1][i].fiveFyerInvmAmt === '') {
            setChkVal('제안펀드 참여 운용인력 5년간 투자금액')
            return true
          } else if (oprtorHmfRef.current.resultObj()[1][i].tenFyerInvmRtrvlacrsInvt === '') {
            setChkVal('제안펀드 참여 운용인력 10년간 투자중 완전회수 실적 투자')
            return true
          } else if (oprtorHmfRef.current.resultObj()[1][i].tenFyerInvmRtrvlacrsRtrvl === '') {
            setChkVal('제안펀드 참여 운용인력 10년간 투자중 완전회수 실적 회수')
            return true
          }
        }

        if (i > 0) {
          if (oprtorHmfRef.current.resultObj()[1][i].hmrsDsnc !== '0') {
            if (oprtorHmfRef.current.resultObj()[1][i].partcptnNm === '') {
              setChkVal('제안펀드 참여 운용인력 이름')
              return true
            }else if (oprtorHmfRef.current.resultObj()[1][i].invtCareer === '') {
              setChkVal('제안펀드 참여 운용인력 투자경력')
              return true
            } else if (oprtorHmfRef.current.resultObj()[1][i].cnwkYyCnt === '') {
              setChkVal('제안펀드 참여 운용인력 근속연수')
              return true
            } else if (oprtorHmfRef.current.resultObj()[1][i].fiveFyerInvmAmt === '') {
              setChkVal('제안펀드 참여 운용인력 5년간 투자금액')
              return true
            } else if (oprtorHmfRef.current.resultObj()[1][i].tenFyerInvmRtrvlacrsInvt === '') {
              setChkVal('제안펀드 참여 운용인력 10년간 투자중 완전회수 실적 투자')
              return true
            } else if (oprtorHmfRef.current.resultObj()[1][i].tenFyerInvmRtrvlacrsRtrvl === '') {
              setChkVal('제안펀드 참여 운용인력 10년간 투자중 완전회수 실적 회수')
              return true
            }
          }
        }
      }
    }

    if (oprtorHmfRef.current.resultObj()[0].length === 0) {
      setChkVal('운용인력 유지율')
      return true
    } else {
      for (let i = 0; i < oprtorHmfRef.current.resultObj()[0].length; i++) {
        if (oprtorHmfRef.current.resultObj()[0][i].opratnHnfNm === '') {
          setChkVal('운용인력 유지율 운용인력명')
          return true
        }
      }
    }

    if (vo.manageHnfInfoTotCo === '') {
      setChkVal('총 관리인력 수')
      return true
    } else if (vo.manageHnfInfoHnf === '') {
      setChkVal('전문자격증 보유인력')
      return true
    }

    return false
  }

  // 저장
  const savePrplInfo = async (id) => {
    const fundStchCnfgList = oprtorInfoRef.current.oprtorInfoResult()[0]
    const irInfoList = oprtorInfoRef.current.oprtorInfoResult()[1]
    const proFundPartcptnList = oprtorHmfRef.current.resultObj()[1]
    const opratnHmfMntncList = oprtorHmfRef.current.resultObj()[0]
    const manageHnfInfoList = manageHnfRef.current.manageHnfInfoResult()

    let fileInfo = []
    let fileIdStr = []
    let managedtaAtchmnflList = []
    let manageDta = ''

    for (let i = 0; i < tempFiles.length; i++) {
      if (tempFiles[i].blob.fileId === undefined) {
        const formData = new FormData()
        formData.append('file', tempFiles[i].blob)
        const res = await CommonAxios(getFileUploadConfig(formData), true)
        if (ResponseUtils.isValidateResponse(res)) {
          managedtaAtchmnflList.push(res.data.data.fileId)
        }
      } else {
        let test = tempFiles[i].blob.fileId
        let keyStr = test.split('-')
        fileIdStr.push(keyStr[0])
      }
    }
    managedtaAtchmnflList.forEach((item) => {
      let keyStr = item.split('-')
      fileInfo.push(keyStr[0])
    })

    if (Number(dayjs(vo.fundOprTs).format('YYYYMMDD')) < Number(dayjs(vo.incrYmd).format('YYYYMMDD'))) {
      exeFunc(alertPopRef, 'open', '펀드운용 시작일은 설립년월일 보다 미래 날짜로 입력해주세요.')

      return false
    }

    if (chkValidation(irInfoList.chkYn)) {
      exeFunc(popupRef, 'open')

      return false
    }

    //기존에 있는 파일 추가
    if (fileIdStr.toString() !== '') {
      manageDta = fileIdStr.toString()
      if (fileInfo.toString() !== '') {
        manageDta = fileIdStr.toString() + ',' + fileInfo.toString()
      }
    } else {
      // 첫 파일 추가
      manageDta = fileInfo.toString()
    }

    const params = {
      ...vo,
      fundStchCnfgList : fundStchCnfgList,
      opratnHmfMntnc: opratnHmfMntncList,
      proFundPartcptn: proFundPartcptnList,
      opratnHnfInfoDscplL: manageHnfInfoList,
      irInfo: irInfoList,
      utlinsttId: commonContext.state.user.info.groupId,
      fundId: props.location.state.fundId,
      managedtaAtchmnfl: manageDta === '' ? ' ' : manageDta,
      progrsStg: id === 'next' ? 'AUD01001' : 'save',
      fundOprTs: dayjs(vo.fundOprTs).format('YYYYMMDD'),
      cogpYn: oprtorInfoRef.current.oprtorInfoResult()[2],
      dscplYn: oprtorInfoRef.current.oprtorInfoResult()[3],
      opratnHnfInfoDscplYn: oprtorHmfRef.current.resultObj()[2]
    }

    console.log('params === ', params)

    const url = Api.fund.fundOpcmInfoSave
    const saveRes = await CommonAxios(getPostConfig(url, params), true)
    console.log('saveRes ==== ', saveRes)

    let isSaveComplete = true
    if (saveRes) {
      if (saveRes.data.code !== '200') {
        isSaveComplete = false
        exeFunc(alertPopRef, 'open', saveRes.data.message)
      }
    } else {
      isSaveComplete = false
    }
    if (isSaveComplete) {
      if (id === 'next') {
        history.push(ROUTER_NAMES.FUND_PRPL_INFO_STEP3, { ...vo, fundId: props.location.state.fundId })
      } else {
        history.push(ROUTER_NAMES.FUND_PRPL_INFO_LIST_VIEW)
      }
    }
  }

  // 이전
  const moveBeforePage = useCallback(() => {
    const url = ROUTER_NAMES.FUND_PRPL_INFO_STEP + props.location.search
    history.push(url)
  }, [])

  // 작성된 데이터 불러오기
  const loadFundOpemDetail = useCallback(async () => {
    const query = QueryUtils.getQuery(props)
    const url = Api.fund.fundOpcmInfoSave + '/' + query['fundId']
    const res = await CommonAxios(getConfig(url), false)

    if (res && res.status === 200) {
      return res.data.data
    }
  }, [])

  // IR 정보 조회
  const basicIrInfoSearch = useCallback(async () => {
    const url = Api.fund.fundOpcmlInfoView + '/' + idRef.current
    const res = await CommonAxios(getConfig(url), false)

    if (res && res.status === 200) {
      return res.data.data
    }
  }, [])

  // 첨부 파일 삭제
  const deleteEtcDoc = useCallback(
    (param) => {
      setTempFiles((pre) => pre.filter((file) => file.blob.fileId !== param.blob.fileId))
    },
    [tempFiles]
  )

  // pdf 저장
  const handlePdfPrint = async () => {
    const paper = document.getElementById('pdfContents')
    document.getElementById('btn1').style.display = 'none'

    const canvas = await html2canvas(paper, { scale: 1.5 })
    const imgFile = canvas.toDataURL('image/png')
    document.getElementById('btn1').style.display = ''

    const doc = new jsPdf('p', 'mm', 'a4')

    const imgWidth = 210
    const pageHeight = imgWidth * 1.414
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0

    // 첫 페이지 출력
    doc.addImage(imgFile, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // 한 페이지 이상일 경우 루프 돌면서 페이지 추가
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      doc.addPage()
      doc.addImage(imgFile, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    window.open(doc.output('bloburl'))
    const pdf = new File([doc.output('blob')], 'test.pdf', { type: 'application/pdf' })

    return pdf
  }

  const isMounted = useRef(false) // useEffect에서 mount 유무 동기확인을 위함

  useEffect(() => {
    if (commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
      isMounted.current = true

      commonContext.actions.pageMountPathCheck(history, async () => {
        // 페이지 진입 시 상태별 분기
        idRef.current = commonContext.state.user.info.groupId

        const fundDetailObject = await loadFundOpemDetail()
        console.log('fundDetailObject = ', fundDetailObject)
        const currentYear = new Date().getUTCFullYear()
        const year = [currentYear - 1, currentYear - 2, currentYear - 3]
        setSearchYear(year)
        if (fundDetailObject !== null) {
          setCopyData(props.location.state.copy === undefined ? 'write' : props.location.state.copy)
          setVo({
            ...fundDetailObject,
            copy: copyData,
            managedtaAtchmnfl: fundDetailObject.managedtaAtchmnfl,
            cptsTtsm: fundDetailObject.cptsTtsmAmt,
            fundNm: props.location.state.fundNm
          })
          const fileObj = []
          if (fundDetailObject.managedtaAtchmnflList[0] !== null) {
            for (let i = 0; i < fundDetailObject.managedtaAtchmnflList.length; i++) {
              const loadFileIfo = {
                blob: {
                  name: fundDetailObject.managedtaAtchmnflList[i].fileNm,
                  fileId: fundDetailObject.managedtaAtchmnflList[i].fileId,
                  fileEtns: fundDetailObject.managedtaAtchmnflList[i].fileEtns,
                  filePath: fundDetailObject.managedtaAtchmnflList[i].filePath,
                  filePtrn: fundDetailObject.managedtaAtchmnflList[i].filePtrn,
                  fileSize: fundDetailObject.managedtaAtchmnflList[i].fileSize
                }
              }
              fileObj.push(loadFileIfo)
            }
            setTempFiles(fileObj)
          }
        } else {
          // ir 정보 자동입력
          const irInfoSearch = await basicIrInfoSearch()
          console.log("irInfoSearch - ", Object.keys(irInfoSearch).length)
          if (Object.keys(irInfoSearch).length > 0) {
            setVo({
              ...vo,
              fundNm: props.location.state.fundNm,
              prnNm: irInfoSearch.investRelation.bnnm !== null ? irInfoSearch.investRelation.bnnm : '',
              bzn: irInfoSearch.investRelation.bzn !== null ? irInfoSearch.investRelation.bzn : '',
              incrYmd: irInfoSearch.investRelation.col !== null ? irInfoSearch.investRelation.col : '',
              rprNm: irInfoSearch.investRelation.rprnm !== null ? irInfoSearch.investRelation.rprnm : '',
              adres: irInfoSearch.investRelation.adr !== null ? irInfoSearch.investRelation.adr : '',
              cptsTtsm: irInfoSearch.irFinance !== null ? irInfoSearch.irFinance.cptsTtsmAmt : 0,
              astTtsmAmt: irInfoSearch.irFinance !== null ? irInfoSearch.irFinance.astTtsmAmt : 0,
              lbltCpstAmt: irInfoSearch.irFinance !== null ? irInfoSearch.irFinance.lbltTtsmAmt : 0,
              cptsTtsmAmt: irInfoSearch.irFinance !== null ? irInfoSearch.irFinance.cptsTtsmAmt : 0,
              bsnErn: irInfoSearch.irFinance !== null ? irInfoSearch.irFinance.opprAmt : 0,
              bsnCt: irInfoSearch.irFinance !== null ? irInfoSearch.irFinance.nonopExpAmt : 0,
              ctnpAmt: irInfoSearch.irFinance !== null ? irInfoSearch.irFinance.ctnpAmt : 0
            })
          }
        }
      })
    }
  }, [commonContext.state.user])

  return (
    <>
      <Container maxWidth="false" disableGutters sx={{ maxWidth: '1280px', px: '1.25rem' }}>
        <Stack spacing={4} direction={'column'} sx={{ py: 5 }}>
          <Paper sx={{ p: 4 }}>
            <Stepper activeStep={1} alternativeLabel>
              <Step key={'0'}>
                <StepLabel>제안 펀드 정보</StepLabel>
              </Step>
              <Step key={'1'}>
                <StepLabel>운용사 상세 정보</StepLabel>
              </Step>
              <Step key={'2'}>
                <StepLabel>제출 완료</StepLabel>
              </Step>
            </Stepper>
          </Paper>
          <FundValidtionPop ref={popupRef} theme={theme} emptyVal={chkVal} />
          {/* 운용사 상세 정보 */}
          <Paper sx={{ p: 4 }} id="pdfContents">
            <Stack direction={'column'} spacing={4}>
              <Stack direction={'column'} spacing={1}>
                <Typography variant="h3">
                  <FiberManualRecordOutlined color="primary" sx={{ mr: 1, fontSize: '1rem' }} />
                  운용사 정보(IR정보)
                </Typography>
                <Divider sx={{ height: '1px', backgroundColor: theme.palette.primary.main }} />
              </Stack>

              <Stack direction={'row'} spacing={2}>
                <Typography flexGrow={1} variant="body1">
                  등록되어 있는 IR 정보를 자동으로 불러옵니다.
                  <br />
                  그리고 아래 항목을 입력하시면 BOX IR 정보에 자동으로 반영됩니다.
                </Typography>
                <Button variant="outlined" onClick={getDataFinance}>
                  재무정보 자동 입력
                </Button>
              </Stack>
              {/* 운용사 정보(IR) */}
              <OprtorInfo vo={vo} ref={oprtorInfoRef} theme={theme} copy={copyData} searchYear={searchYear} />
              {/* 운용사 정보(IR) END */}
              <Stack direction={'column'} spacing={1}>
                <Typography variant="h3">
                  <FiberManualRecordOutlined color="primary" sx={{ mr: 1, fontSize: '1rem' }} />
                  기운용 펀드 정보
                </Typography>
                <Divider sx={{ height: '1px', backgroundColor: theme.palette.primary.main }} />
              </Stack>
              {/* 기운용 펀드 정보 */}
              <OprtorFundInfo vo={vo} theme={theme} copy={copyData} />
              {/* 기운용 펀드 정보 END */}

              <Stack direction={'column'} spacing={1}>
                <Typography variant="h3">
                  <FiberManualRecordOutlined color="primary" sx={{ mr: 1, fontSize: '1rem' }} />
                  운용인력 정보
                </Typography>
                <Divider sx={{ height: '1px', backgroundColor: theme.palette.primary.main }} />
              </Stack>
              {/* 운용인력 정보  */}
              <OprtorHmfInfo vo={vo} ref={oprtorHmfRef} theme={theme} copy={copyData} />
              {/* 운용인력 정보 END  */}

              <Stack direction={'column'} spacing={1}>
                <Typography variant="h3">
                  <FiberManualRecordOutlined color="primary" sx={{ mr: 1, fontSize: '1rem' }} />
                  관리인력 정보
                </Typography>
                <Divider sx={{ height: '1px', backgroundColor: theme.palette.primary.main }} />
              </Stack>
              {/* 관리인력 정보 */}
              <ManageHnfInfo setVo={setVo} ref={manageHnfRef} vo={vo} theme={theme} copy={copyData} />
              {/* 관리인력 정보 END */}

              <Stack direction={'column'} spacing={1}>
                <Typography variant="h3">
                  <FiberManualRecordOutlined color="primary" sx={{ mr: 1, fontSize: '1rem' }} />
                  관련자료 첨부
                </Typography>
                <Divider sx={{ height: '1px', backgroundColor: theme.palette.primary.main }} />
              </Stack>

              <Stack direction={'column'} spacing={1}>
                <FundDoc etcDoc={tempFiles} setEtcDoc={setTempFiles} onRemove={deleteEtcDoc} />
              </Stack>
              <Stack direction={'row'} spacing={1} justifyContent="center" alignItems="center" id="btn1">
                <Button size="large" variant="outlined" onClick={() => savePrplInfo('quit')} disableElevation>
                  저장 및 종료
                </Button>
                <Button size="large" variant="outlined" disableElevation onClick={handlePdfPrint}>
                  PDF 다운로드
                </Button>
                <Button size="large" variant="outlined" onClick={moveBeforePage} disableElevation>
                  이전
                </Button>
                <Button size="large" variant="contained" onClick={() => savePrplInfo('next')} disableElevation>
                  저장 후 다음
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Container>
      <AlertPopup ref={alertPopRef} />
    </>
  )
}

export default FundPrplInfoStep2
