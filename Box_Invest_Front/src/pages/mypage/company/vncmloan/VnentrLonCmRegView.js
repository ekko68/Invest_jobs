import { useState, useEffect, useRef, useContext, useCallback } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Container, Paper, Stack, useTheme, Button, Avatar, TextField } from '@mui/material'

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
import RegButtons from 'pageComponents/mypage/company/vncmloan/cmReg/RegViewButtons'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'

import ResponseUtils from 'modules/utils/ResponseUtils'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { deepCopyByRecursion } from 'modules/utils/CommonUtils'
import Api from 'modules/consts/Api'
import CommonAxios, { getPostConfig, getConfig, fileDownload, getFileDownloadConfig } from 'modules/utils/CommonAxios'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import { exeFunc } from 'modules/utils/ReactUtils'
import { AlertLabels } from 'modules/consts/BizConst'

const fileVO = { fileNm: null, fileId: null, file: null, isAutoUploaded: false }

const variableToHangul = {
  bizrno: '사업자등록증',
  vatStdtaxProof: '부가세과세표준증명원',
  cprRgistMatterAllCrtf: '법인등기사항전부증명서',
  stchInfoMngmNo: '주주명부',
  cmpnyIntrcn: '회사소개서(IR자료)',
  //
  etnm: '기업명',
  rprnm: '대표자명',
  bzn: '사업자번호',
  col: '설립년월일',
  adr: '본사 주소',
  rsprNm: '기업 담당자명',
  rsprJbclNm: '담당자 직책',
  rsprCnplTpn: '담당자 연락처',
  rsprEad: '담당자 이메일',
  //
  innfInqCosn: '개인(신용)정보 조회동의서',
  innfClusCosn: '개인(신용)정보 수집 이용 동의서',
  invtCnfrmn: '투자확인서',
  cptalUsgpln: '자금사용계획서',
  sprnApfr: '지원신청서',
  atcscAtchmnfl: '정관',
  gmtsckAnact: '주주총회 또는 이사회 결의서'
}

// 테스트용 데이터 삭제
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
    etnm: '', // '(주)홀핏',
    // 대표자명
    rprnm: '', // '엄선진',
    // 사업자번호
    bzn: '', // '6178611111',
    // 설립년월일
    col: '', // '2017-01-25',
    // 본사 주소
    adr: '', // '서울특별시 강남구 선릉로', // 108길 51, 3층(삼성동)',
    // 기업 담당자명
    rsprNm: '', // '김정근',
    // 담당자 직책
    rsprJbclNm: '', // '매니저',
    // 담당자 연락처
    rsprCnplTpn: '', // '01012341234',
    // 담당자 이메일
    rsprEad: '' // 'abc@gmail.com'
  },
  '신용평가에 필요한 기타 서류': {
    // 개인(신용)정보 조회동의서
    innfInqCosn: { ...fileVO },
    // 개인(신용)정보 수집 이용 동의서
    innfClusCosn: { ...fileVO }
  },
  'IBK벤처대출 투자확인서, 자금사용계획서': {
    //투자확인서
    invtCnfrmn: { ...fileVO },
    // 자금사용계획서
    cptalUsgpln: { ...fileVO }
  },
  'IBK벤처대출 지원신청서': {
    //지원신청서
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

  const [gita, setGita] = useState(deepCopyByRecursion(initSubmitVO['기타 파일 첨부']))

  const [isEditing, setIsEditing] = useState(false)
  const [isPopup, setIsPopup] = useState(false)
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
  const addGita = useCallback((files) => {
    setGita((pre) => [...pre, ...files])
  }, [])

  const deleteGita = useCallback((fileData) => {
    let key = 'fileId'
    if (fileData.id) {
      key = 'id'
    }
    setGita((pre) => pre.filter((file) => file[key] !== fileData[key]))
  })

  useEffect(async () => {
    if (commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck) {
      const isEditPage = !!history.location.state?.vnentrlonId
      setIsEditing(isEditPage)
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
        parsingData(res.data.data)
      }
    }
    const companyInfoDetail = await ResponseUtils.getSimpleResponse(Api.my.company.basicInfoDetail, null, false)

    if (companyInfoDetail) {
      const { bizrno, rprsntvNm, bplcNm, fondDe, addr } = companyInfoDetail
      if (!companyInfo.etnm) changeCompanyInfo('etnm', bplcNm)
      if (!companyInfo.bzn) changeCompanyInfo('bzn', bizrno)
      if (!companyInfo.rprnm) changeCompanyInfo('rprnm', rprsntvNm)
    }
  }

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
  const failMessage = (key) => {
    const hangul = variableToHangul[key]
    return { valid: false, message: `${hangul}은(는) 필수입력사항입니다.` }
  }
  const validateData = () => {
    for (const key in onlineDoc) {
      const file = onlineDoc[key].file
      if (!file) {
        return failMessage(key)
      }
    }
    for (const key in companyInfo) {
      const text = companyInfo[key]
      if (!text) {
        return failMessage(key)
      }
    }
    for (const key in evaluationDoc) {
      const file = evaluationDoc[key].file
      if (!file) {
        return failMessage(key)
      }
    }
    for (const key in investDoc) {
      const file = investDoc[key].file
      if (!file) {
        return failMessage(key)
      }
    }
    for (const key in applyDoc) {
      const file = applyDoc[key].file
      if (!file) {
        return failMessage(key)
      }
    }
    for (const key in article) {
      const file = article[key].file
      if (!file) {
        return failMessage(key)
      }
    }
    return { valid: true, message: '' }
  }
  const submit = async () => {
    const { valid, message } = validateData()
    if (!valid) {
      exeFunc(alertPopup, 'open', message)
      return
    }

    const formData = new FormData()

    const addToForm = async (docData) => {
      for (const property in docData) {
        if (docData[property].file) {
          const key = 'req' + property[0].toUpperCase() + property.substring(1) + 'List'
          formData.append(key, docData[property].file)
        }
      }
    }
    addToForm(onlineDoc)
    addToForm(evaluationDoc)
    addToForm(investDoc)
    addToForm(applyDoc)
    addToForm(article)

    gita.map((fileData) => {
      if (fileData?.file) {
        const key = 'reqGitaList'
        formData.append(key, fileData.file)
      }
    })

    for (const property in companyInfo) {
      formData.append(property, companyInfo[property])
    }
    const res = await CommonAxios(fileUploadConfig(Api.vncmloan.aplcSave, formData), true)

    if (res.data.code === '200') {
      setIsPopup(true)
    } else {
      exeFunc(alertPopup, 'open', AlertLabels.notSaved)
    }
  }
  const modify = async () => {
    const formData = new FormData()
    const previousData = history.location.state

    for (const key in previousData) {
      const data = previousData[key]
      if (!data || Array.isArray(data)) {
        continue
      }
      formData.append(key, data)
    }

    const addEmptyToForm = (docData) => {
      for (const property in docData) {
        formData.append(property, ' ')
      }
    }
    addEmptyToForm(onlineDoc)
    addEmptyToForm(evaluationDoc)
    addEmptyToForm(investDoc)
    addEmptyToForm(applyDoc)
    addEmptyToForm(article)

    for (const property in companyInfo) {
      formData.append(property, companyInfo[property])
    }

    const addFormWithDown = async (docData) => {
      for (const property in docData) {
        const key = 'req' + property[0].toUpperCase() + property.substring(1) + 'List'
        const { fileId, fileNm, file } = docData[property]
        if (fileId) {
          const res = await CommonAxios(getFileDownloadConfig(fileId), true)
          if (res && res.status === 200) {
            const file = new File([res.data], fileNm, { type: res.headers['content-type'] })
            formData.append(key, file)
          }
        } else if (file) {
          formData.append(key, file)
        }
      }
    }

    await addFormWithDown(onlineDoc)
    await addFormWithDown(evaluationDoc)
    await addFormWithDown(investDoc)
    await addFormWithDown(applyDoc)
    await addFormWithDown(article)

    for (const fileData of gita) {
      const { fileId, fileNm, file } = fileData

      const key = 'reqGitaList'

      if (fileId) {
        const res = await CommonAxios(getFileDownloadConfig(fileId), true)
        if (res && res.status === 200) {
          const file = new File([res.data], fileNm, { type: res.headers['content-type'] })
          formData.append(key, file)
        }
      } else if (file) {
        formData.append(key, file)
      }
    }
    const res = await CommonAxios(fileUploadConfig(Api.vncmloan.aplcSave, formData), true)

    if (res.data.code === '200') {
      setIsPopup(true)
    } else {
      exeFunc(alertPopup, 'open', AlertLabels.notSaved)
    }
  }
  const onConfirmPopup = () => {
    goListView()
  }
  const fileUploadConfig = (url, form) => {
    const config = {
      url: url,
      method: 'post',
      data: form,
      fileused: true
    }
    return config
  }

  const downloadLocalFile = useCallback((file) => {
    const blob = file.file
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.setAttribute('download', blob.name)
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
  })

  const downloadFromBack = useCallback((file) => {
    commonContext.actions.callbackAfterSessionRefresh(
      async () => {
        await fileDownload(file)
      },
      true,
      true
    )
  }, [])
  const download = useCallback(
    (file) => {
      if (file.file) {
        downloadLocalFile(file)
      } else {
        downloadFromBack(file)
      }
    },
    [downloadLocalFile, downloadFromBack]
  )

  // Backend 필요한거
  // TODO: 온라인 재무서류 제출
  //  - 혁신투자BOX에 등록된 IR 정보가 있다면 해당 정보가 자동 등록됨
  //  : 자동 등록된 정보가 있어도 직접 파일 첨부로 덮어쓰기 가능
  //  - 법인등기사항전부증명서, 주주명부는 직접 파일 첨부
  //  TODO: 필요서류 자동 수집 버튼 선택 시 공동인증서 인증 모듈 호출
  //  - 스크래핑 항목 : 사업자등록증, 부가세과세표준증명원
  //  - 수집 완료된 항목은 ʻ자동 수집 완료’ 표기
  //  - 수집되지 않은 항목은 파일첨부 버튼으로 직접 파일 첨부 가능

  // TODO: 신용평가에 필요한 자서 서류 제출
  // - 각 동의서 버튼 선택 시 동의서 양식 다운로드됨
  // - 파일 첨부 버튼 선택 시 탐색기 호출 및 파일 업로드가능

  return (
    <VnentrLonCmWrapper>
      <Container maxWidth="false" disableGutters sx={{ maxWidth: '1280px', px: '1.25rem' }}>
        <Stack spacing={4} direction={'column'} sx={{ py: 5 }}>
          <Paper sx={{ p: 4 }}>
            <Stack direction={'column'} spacing={4}>
              {/* 온라인 재무서류 제출 */}
              <VnentrLonCmRegViewOnlineDoc
                targetUsisId={history.location.state?.utlinsttId}
                onlineDoc={onlineDoc}
                changeOnlineDoc={changeOnlineDoc}
                onAutoDocSubmit={() => {}}
                onClickFile={download}
              />
              {/* 기업 정보 입력 */}
              <VnentrLonCmRegViewCompanyInfo companyInfo={companyInfo} changeCompanyInfo={changeCompanyInfo} />
              {/* 신용평가에 필요한 기타 서류 */}
              <VnentrLonCmRegViewEvalutaionDoc
                evaluationDoc={evaluationDoc}
                changeEvalutaionDoc={changeEvalutaionDoc}
                onClickFile={download}
              />
              {/* IBK벤처대출 투자확인서, 자금사용계획서 */}
              <VnentrLonCmRegViewInvestDoc
                investDoc={investDoc}
                changeInvestDoc={changeInvestDoc}
                onClickFile={download}
              />
              {/* IBK벤처대출 지원신청서 */}
              <VnentrLonCmRegViewApplyDoc applyDoc={applyDoc} changeApplyDoc={changeApplyDoc} onClickFile={download} />
              {/* 정관(신주인수권부사채 발행 가능여부 확인) */}
              <VnentrLonCmRegViewArticle article={article} changeArticle={changeArticle} onClickFile={download} />

              {/* 기타 파일 첨부 */}
              <VnentrLonCmRegViewGita
                gita={gita}
                onAddFile={addGita}
                onRemove={deleteGita}
                onFileNameClick={download}
              />

              <RegButtons
                onClickCancel={goListView}
                onClickSubmit={submit}
                onClickModify={modify}
                editMode={isEditing}
              />
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
            <div className="text grey black">저장되었습니다</div>
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
