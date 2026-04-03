import { useState, useEffect, useRef, useContext, useCallback } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Container, Paper, Stack, useTheme, Button } from '@mui/material'

import PopupConfirm from 'components/popups/PopupConfirm'
import PopupFooter from 'components/popups/PopupFooter'

import VnentrLonCmRegViewOnlineDoc from 'pageComponents/mypage/company/vncmloan/cmReg/OnlineDoc'
import VnentrLonCmRegViewCompanyInfo from 'pageComponents/mypage/company/vncmloan/cmReg/CompanyInfo'
import VnentrLonCmRegViewEvalutaionDoc from 'pageComponents/mypage/company/vncmloan/cmReg/EvaluationDoc'
import VnentrLonCmRegViewInvestDoc from 'pageComponents/mypage/company/vncmloan/cmReg/InvestDoc'
import VnentrLonCmRegViewApplyDoc from 'pageComponents/mypage/company/vncmloan/cmReg/ApplyDoc'
import VnentrLonCmRegViewArticle from 'pageComponents/mypage/company/vncmloan/cmReg/Article'
import VnentrLonCmRegViewGita from 'pageComponents/mypage/company/vncmloan/cmReg/Gita'
import VnentrLonCmWrapper from 'pageComponents/mypage/company/vncmloan/Wrapper'
import DetailButtons from 'pageComponents/mypage/company/vncmloan/cmReg/DetailViewButtons'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'

import ROUTER_NAMES from 'modules/consts/RouterConst'
import { deepCopyByRecursion } from 'modules/utils/CommonUtils'
import Api from 'modules/consts/Api'
import CommonAxios, { getConfig, getPostConfig, fileDownload } from 'modules/utils/CommonAxios'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import { exeFunc } from 'modules/utils/ReactUtils'
import { AlertLabels } from 'modules/consts/BizConst'

const fileVO = { fileNm: null, file: null, isAutoUploaded: false }

const initSubmitVO = {
  '온라인 재무서류 제출': {
    // 사업자등록증
    bizrno: { ...fileVO },
    // 부가세과세표준증명원
    vatStdtaxProof: { ...fileVO },
    // 법인등기사항전부증명서
    cprRgistMatterAllCrtf: { ...fileVO },
    // 주주명부
    stchInfoMngmNo: { ...fileVO },
    // 회사소개서(IR자료)
    cmpnyIntrcn: { ...fileVO }
  },
  '기업 정보 입력': {
    // 기업명
    etnm: '',
    // 대표자명
    rprnm: '',
    // 사업자번호
    bzn: '',
    // 설립년월일
    col: '',
    // 본사 주소
    adr: '',
    // 기업 담당자명
    rsprNm: '',
    // 담당자 직책
    rsprJbclNm: '',
    // 담당자 연락처
    rsprCnplTpn: '',
    // 담당자 이메일
    rsprEad: ''
  },
  '신용평가에 필요한 기타 서류': {
    // 개인(신용)정보 조회동의서
    innfInqCosn: { ...fileVO },
    // 개인(신용)정보 수집 이용 동의서
    innfClusCosn: { ...fileVO }
  },
  'IBK벤처대출 투자확인서, 자금사용계획서': {
    invtCnfrmn: { ...fileVO },
    cptalUsgpln: { ...fileVO }
  },
  'IBK벤처대출 지원신청서': {
    sprnApfr: { ...fileVO }
  },
  정관: {
    // 정관
    atcscAtchmnfl: { ...fileVO },
    // '주주총회 또는 이사회 결의서'
    gmtsckAnact: { ...fileVO }
  },
  '기타 파일 첨부': []
}
const VnentrLonCmRegView = () => {
  const theme = useTheme()
  const history = useHistory()
  const commonContext = useContext(CommonContext)
  const alertPopup = useRef()

  const [onlineDoc, setOnlineDoc] = useState(deepCopyByRecursion(initSubmitVO['온라인 재무서류 제출']))
  const [companyInfo, setCompanyInfo] = useState(deepCopyByRecursion(initSubmitVO['기업 정보 입력']))
  const [evaluationDoc, setEvalutaionDoc] = useState(deepCopyByRecursion(initSubmitVO['신용평가에 필요한 기타 서류']))
  const [investDoc, setInvestDoc] = useState(
    deepCopyByRecursion(initSubmitVO['IBK벤처대출 투자확인서, 자금사용계획서'])
  )
  const [applyDoc, setApplyDoc] = useState(deepCopyByRecursion(initSubmitVO['IBK벤처대출 지원신청서']))
  const [article, setArticle] = useState(deepCopyByRecursion(initSubmitVO['정관']))
  const [ectDoc, setGita] = useState(deepCopyByRecursion(initSubmitVO['기타 파일 첨부']))

  const [detailData, setDetailData] = useState(null)
  const [isPopup, setIsPopup] = useState(false)

  const isDetailView = true

  useEffect(async () => {
    if (commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck) {
      commonContext.actions.pageMountPathCheck(history, async () => {
        await initializePage()
      })
    }
  }, [commonContext.state.user])

  const initializePage = async () => {
    const vnentrlonId = history.location.state?.vnentrlonId
    if (vnentrlonId) {
      const param = { vnentrlonId }
      const res = await CommonAxios(getConfig(Api.vncmloan.aplcDetail, param), true)
      if (res.data.code === '200') {
        setDetailData(res.data.data)
        parsingData(res.data.data)
      }
    }
  }

  const changeOnlineDoc = useCallback((key, value) => {
    setOnlineDoc((pre) => {
      return { ...pre, [key]: value }
    })
  }, [])
  const changeCompanyInfo = useCallback((key, value) => {
    setCompanyInfo((pre) => {
      return { ...pre, [key]: value }
    })
  }, [])
  const changeEvalutaionDoc = useCallback((key, value) => {
    setEvalutaionDoc((pre) => {
      return { ...pre, [key]: value }
    })
  }, [])
  const changeInvestDoc = useCallback((key, value) => {
    setInvestDoc((pre) => {
      return { ...pre, [key]: value }
    })
  }, [])
  const changeApplyDoc = useCallback((key, value) => {
    setApplyDoc((pre) => {
      return { ...pre, [key]: value }
    })
  }, [])
  const changeArticle = useCallback((key, value) => {
    setArticle((pre) => {
      return { ...pre, [key]: value }
    })
  }, [])

  const convertKey = (key) => {
    return 'res' + key[0].toUpperCase() + key.substring(1) + 'List'
  }

  const parsingData = (data) => {
    for (const key in onlineDoc) {
      const fileList = data[convertKey(key)]
      if (fileList.length > 0) changeOnlineDoc(key, fileList[0])
    }
    for (const key in companyInfo) {
      changeCompanyInfo(key, data[key])
    }
    for (const key in evaluationDoc) {
      const fileList = data[convertKey(key)]
      if (fileList.length > 0) changeEvalutaionDoc(key, fileList[0])
    }
    for (const key in investDoc) {
      const fileList = data[convertKey(key)]
      if (fileList.length > 0) changeInvestDoc(key, fileList[0])
    }
    for (const key in applyDoc) {
      const fileList = data[convertKey(key)]
      if (fileList.length > 0) changeApplyDoc(key, fileList[0])
    }
    for (const key in article) {
      const fileList = data[convertKey(key)]
      if (fileList.length > 0) changeArticle(key, fileList[0])
    }
    const fileList = data['resGitaList']
    if (fileList) {
      setGita(fileList)
    }
  }

  const goListView = () => {
    history.push(ROUTER_NAMES.VNENTR_LON_CM_LIST_VIEW)
  }

  const downloadFromBack = useCallback((file) => {
    commonContext.actions.callbackAfterSessionRefresh(
      async () => {
        await fileDownload(file)
      },
      true,
      true
    )
  }, [])

  const cancelLoan = useCallback(async () => {
    const params = new FormData()
    params.append('recomendSttusCm', detailData.recomendSttusCm)
    params.append('utlinsttId', detailData.utlinsttId)
    params.append('vnentrlonId', detailData.vnentrlonId)

    const res = await CommonAxios(getPostConfig(Api.vncmloan.aplcCancel, params), true)
    if (res.data.code === '200') {
      setIsPopup(true)
    } else {
      exeFunc(alertPopup, 'open', AlertLabels.askAdmin)
    }
  }, [detailData])

  const onConfirmPopup = () => {
    goListView()
  }

  return (
    <VnentrLonCmWrapper>
      <Container maxWidth="false" disableGutters sx={{ maxWidth: '1280px', px: '1.25rem' }}>
        <Stack spacing={4} direction={'column'} sx={{ py: 5 }}>
          <Paper sx={{ p: 4 }}>
            <Stack direction={'column'} spacing={4}>
              {/* 온라인 재무서류 제출 */}
              <VnentrLonCmRegViewOnlineDoc
                onlineDoc={onlineDoc}
                readOnly={isDetailView}
                onClickFile={downloadFromBack}
              />
              {/* 기업 정보 입력 */}
              <VnentrLonCmRegViewCompanyInfo companyInfo={companyInfo} readOnly={isDetailView} />
              {/* 신용평가에 필요한 기타 서류 */}
              <VnentrLonCmRegViewEvalutaionDoc
                evaluationDoc={evaluationDoc}
                readOnly={isDetailView}
                onClickFile={downloadFromBack}
              />
              {/* IBK벤처대출 투자확인서, 자금사용계획서 */}
              <VnentrLonCmRegViewInvestDoc
                investDoc={investDoc}
                readOnly={isDetailView}
                onClickFile={downloadFromBack}
              />
              {/* IBK벤처대출 지원신청서 */}
              <VnentrLonCmRegViewApplyDoc applyDoc={applyDoc} readOnly={isDetailView} onClickFile={downloadFromBack} />
              {/* 정관(신주인수권부사채 발행 가능여부 확인) */}
              <VnentrLonCmRegViewArticle article={article} readOnly={isDetailView} onClickFile={downloadFromBack} />

              {/* 기타 파일 첨부 */}
              <VnentrLonCmRegViewGita gita={ectDoc} readOnly={isDetailView} onFileNameClick={downloadFromBack} />

              <DetailButtons onClickList={goListView} onClickLoanCancel={cancelLoan}></DetailButtons>
            </Stack>
          </Paper>
        </Stack>
      </Container>
      {isPopup ? (
        <PopupConfirm
          handlePopup={() => {
            setIsPopup(false)
          }}
        >
          <div className="popup_content_wrap">
            <div className="text grey black">취소되었습니다</div>
          </div>
          <PopupFooter>
            <div className="btn_group gap">
              <Button className={'blue'} variant="contained" onClick={() => onConfirmPopup()}>
                확인
              </Button>
            </div>
          </PopupFooter>
        </PopupConfirm>
      ) : (
        <></>
      )}
      <AlertPopup ref={alertPopup} />
    </VnentrLonCmWrapper>
  )
}

export default VnentrLonCmRegView
