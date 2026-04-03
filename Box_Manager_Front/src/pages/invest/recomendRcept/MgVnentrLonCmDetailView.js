import React, { useState, useRef, useCallback, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'

import LensOutlinedIcon from '@mui/icons-material/LensOutlined'
import { Box, Stack, useTheme } from '@mui/material'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Grid from '@mui/material/Unstable_Grid2'
import Typography from '@mui/material/Typography'
import CheckOutlined from '@mui/icons-material/CheckOutlined'
import TextField from '@mui/material/TextField'

import CmViewFileTypo from 'pageComponents/invest/recomendRcept/CmDetailViewFileTypo'
import Table from 'pageComponents/invest/recomendRcept/CmDetailViewTable'
import TableRow from 'pageComponents/invest/recomendRcept/CmDetailViewTableRow'
import PageLayout from 'components/PageLayout'
import PopupAlert from 'components/PopupAlert'
import { useReactToPrint } from 'react-to-print'

import ROUTER_NAMES from 'modules/consts/RouterConst'
import {
  getVnemtrlonAplcDetail,
  saveVnemtrlonAplcDetail,
  getVnentrLonSgshPrtRceptDetail,
  getVncmLoanCodeList
} from 'modules/consts/InvestApi'
import { generateKey, fileDownload } from 'modules/utils/CommonUtils'
import { UserContext } from 'modules/common/UserContext'
import { StringUtils } from 'modules/utils/StringUtils'
import html2canvas from 'html2canvas'
import jsPdf from 'jspdf'

const fileVO = { fileNm: null, fileId: null, file: null, isAutoUploaded: false }
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
  '기타 파일': [],
  '추가 요청 파일': [],
  '상태 등록': ''
}

const MgVnentrLonCmDetailView = () => {
  const theme = useTheme()
  const history = useHistory()
  const userContext = useContext(UserContext)
  const printContents = useRef()
  const vnentrlonId = history.location.state?.vnentrlonId

  const [onlineDoc, setOnlineDoc] = useState(initSubmitVO['온라인 재무서류 제출'])
  const [companyInfo, setCompanyInfo] = useState(initSubmitVO['기업 정보 입력'])
  const [evaluationDoc, setEvalutaionDoc] = useState(initSubmitVO['신용평가에 필요한 기타 서류'])
  const [investDoc, setInvestDoc] = useState(initSubmitVO['IBK벤처대출 투자확인서, 자금사용계획서'])

  const [applyDoc, setApplyDoc] = useState(initSubmitVO['IBK벤처대출 지원신청서'])
  const [article, setArticle] = useState(initSubmitVO['정관'])

  const [gita, setGita] = useState(initSubmitVO['기타 파일'])

  const [addtionalRequestDocs, setAddtionalRequestDocs] = useState(initSubmitVO['추가 요청 파일'])
  const [recomendSttusCm, setRecomendSttusCm] = useState(initSubmitVO['상태 등록'])

  const [recommendStatusList, setRecommendStatusList] = useState([])

  const [isConfirmPopup, setIsConfirmPopup] = useState(false)
  const [isAlertFail, setIsAlertFail] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [recomendSttus, setRecomendSttus] = useState('N')
  const [recomendSttusCmRm, setRecomendSttusCmRm] = useState('')

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

  useEffect(async () => {
    await initializePage()
  }, [])

  const initializePage = async () => {
    const resCodes = await getVncmLoanCodeList()

    if (resCodes?.data?.code === '200') {
      const codeList = resCodes?.data?.data?.list
      const rst02CodeList = codeList.filter((code) => code.comCdId.startsWith('RST02'))
      const parsedList = rst02CodeList.map((code) => {
        let disabled = false
        if (code.comCdId === 'RST02002' || code.comCdId === 'RST02003') {
          disabled = true
        }
        return { recomendSttusCm: code.comCdId, recomendSttusCmNm: code.comCdNm, show: true, disabled: disabled }
      })
      setRecommendStatusList(parsedList)
    }
    if (vnentrlonId) {
      const params = { vnentrlonId, bzn: '' }
      const res = await getVnemtrlonAplcDetail(params)
      if (res?.data?.code === '200') {
        console.log('res.data.data = ', res.data.data)
        if (res.data.data.recomendSttusCm === 'RST02007') {
          setRecomendSttus('Y')
        }
        parsingData(res.data.data)
      } else {
        setAlertMessage('정보를 불러올 수 없습니다')
        setIsAlertFail(true)
      }
    }
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

    setRecomendSttusCm(data['recomendSttusCm'])
    setRecomendSttusCmRm(data['recomendSttusCmRm'])
  }

  const convertKey = (key) => {
    return 'res' + key[0].toUpperCase() + key.substring(1) + 'List'
  }

  const handleStatusChange = (event) => {
    setRecomendSttusCm(event.target.value)
  }

  const goList = () => {
    history.push(ROUTER_NAMES.INVEST_RECOMENDRCEPT_MGVNENTRLONCMLISTVIEW)
  }
  const goCompanyRecommend = async () => {
    const res = await getVnentrLonSgshPrtRceptDetail('', companyInfo.bzn)
    if (res?.data?.code === '200' && res.data.data?.vnentrlonId) {
      history.push(`${ROUTER_NAMES.INVEST_RECOMENDRCEPT_VNENTRLONSGSHPRTRCEPTDETAILVIEW}/${res.data.data.vnentrlonId}`)
    } else {
      setAlertMessage('기업 추천 정보를 찾을 수 없습니다')
      setIsAlertFail(true)
    }
  }

  const submit = async () => {
    const params = {
      params: { vnentrlonId, recomendSttusCm, recomendSttusCmRm },
      adminUser: userContext.actions.getIvtAdminUser()
    }
    console.log('param = ', params)
    let res = await saveVnemtrlonAplcDetail(params)
    if (res?.data?.code === '200') {
      setIsConfirmPopup(true)
    } else {
      setAlertMessage('저장에 실패하였습니다')
      setIsAlertFail(true)
    }
  }

  const onFileNameClick = async (file) => {
    await fileDownload(file)
  }

  // 출력 버튼
  const handlePrint = useReactToPrint({
    content: () => printContents.current
  })

  // pdf 저장
  const handlePdfPrint = async () => {
    const paper = document.getElementById('pdfContents')
    paper.style.padding = '30px 20px 0px 20px'
    document.getElementById('btn1').style.display = 'none'
    document.getElementById('btn2').style.display = 'none'

    const canvas = await html2canvas(paper, { scale: 1.5 })
    const imgFile = canvas.toDataURL('image/png')

    const doc = new jsPdf('p', 'mm', 'a4')

    const imgWidth = 210
    const pageHeight = imgWidth * 1.414
    const imgHeight = ((canvas.height + 120) * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0

    doc.addImage(imgFile, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      doc.addPage()
      doc.addImage(imgFile, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    window.open(doc.output('bloburl'))
    const pdf = new File([doc.output('blob')], 'test.pdf', { type: 'application/pdf' })
    document.getElementById('btn1').style.display = ''
    document.getElementById('btn2').style.display = ''

    return pdf
  }

  return (
    <>
      <PageLayout currentMenu={'invest'} currentCate={'recomendRcept'} currentPage={'MgVnentrLonCmDetailView'}>
        <Stack direction={'column'} spacing={4} alignItems="center" id="pdfContents" ref={printContents}>
          <Stack direction={'column'} spacing={2} sx={{ width: '100%' }}>
            <Stack direction={'row'} alignItems="center" spacing={1}>
              <Typography
                flexGrow={1}
                variant="h1"
                sx={{
                  lineHeight: '2.375rem',
                  fontSize: '1.875rem',
                  fontWeight: 'bold'
                }}
              >
                IBK벤처대출 추천 접수(기업)
              </Typography>
            </Stack>

            <Divider />

            <Stack direction={'column'} spacing={6}>
              <Stack direction={'column'} spacing={4}>
                <Table title="1. 온라인 재무서류 제출">
                  <TableRow title={'사업자등록증'} auto>
                    {onlineDoc.bizrno.fileNm && (
                      <>
                        <CheckOutlined color="primary" />
                        <Typography flexGrow={1}>자동 수집 완료</Typography>
                      </>
                    )}
                  </TableRow>
                  <TableRow title="부가세과세" title2nd="표준증명원" title3rd="(최근 3개년도)" auto>
                    {onlineDoc.vatStdtaxProof.fileNm && (
                      <>
                        <CheckOutlined color="primary" />
                        <Typography flexGrow={1}>자동 수집 완료</Typography>
                      </>
                    )}
                  </TableRow>
                  <TableRow title="법인등기사항" title2nd="전부증명서">
                    <CmViewFileTypo file={onlineDoc.cprRgistMatterAllCrtf} onClick={onFileNameClick} />
                  </TableRow>
                  <TableRow title="주주명부">
                    <CmViewFileTypo file={onlineDoc.stchInfoMngmNo} onClick={onFileNameClick} />
                  </TableRow>
                  <TableRow title="회사소개서(IR자료)" auto>
                    {onlineDoc.cmpnyIntrcn.fileNm && (
                      <>
                        <CheckOutlined color="primary" />
                        <Typography flexGrow={1}>자동 등록 완료</Typography>
                      </>
                    )}
                  </TableRow>
                  <TableRow></TableRow>
                </Table>

                <Table title="2. 기업 정보 입력">
                  <TableRow title="기업명">
                    <Typography variant="body1">{companyInfo.etnm}</Typography>
                  </TableRow>
                  <TableRow title="대표자명">
                    <Typography variant="body1">{companyInfo.rprnm}</Typography>
                  </TableRow>
                  <TableRow title="사업자번호">
                    <Typography variant="body1">{!!companyInfo.bzn && StringUtils.bizNum(companyInfo.bzn)}</Typography>
                  </TableRow>
                  <TableRow title="설립년월일">
                    <Typography variant="body1">{companyInfo.col}</Typography>
                  </TableRow>
                  <TableRow title="본사 주소" full>
                    <Typography variant="body1">{companyInfo.adr}</Typography>
                  </TableRow>
                  <TableRow title="기업 담당자명">
                    <Typography variant="body1">{companyInfo.rsprNm}</Typography>
                  </TableRow>
                  <TableRow title="담당자 직책">
                    <Typography variant="body1">{companyInfo.rsprJbclNm}</Typography>
                  </TableRow>
                  <TableRow title="담당자 연락처">
                    <Typography variant="body1">
                      {!!companyInfo.rsprCnplTpn && StringUtils.telNumber(companyInfo.rsprCnplTpn)}
                    </Typography>
                  </TableRow>
                  <TableRow title="담당자 이메일">
                    <Typography variant="body1">{companyInfo.rsprEad}</Typography>
                  </TableRow>
                </Table>

                <Table title="3. 신용평가에 필요한 기타 서류">
                  <TableRow title="개인(신용)정보" title2nd="조회동의서">
                    <CmViewFileTypo file={evaluationDoc.innfInqCosn} onClick={onFileNameClick} />
                  </TableRow>
                  <TableRow title="개인(신용)정보" title2nd="수집 이용 동의서">
                    <CmViewFileTypo file={evaluationDoc.innfClusCosn} onClick={onFileNameClick} />
                  </TableRow>
                </Table>

                <Table title="4. IBK벤처대출 투자확인서, 자금사용계획서">
                  <TableRow title="투자확인서">
                    <CmViewFileTypo file={investDoc.invtCnfrmn} onClick={onFileNameClick} />
                  </TableRow>
                  <TableRow title="자금사용계획서">
                    <CmViewFileTypo file={investDoc.cptalUsgpln} onClick={onFileNameClick} />
                  </TableRow>
                </Table>

                <Table title="5. IBK벤처대출 지원신청서">
                  <TableRow title="지원신청서" full>
                    <CmViewFileTypo file={applyDoc.sprnApfr} onClick={onFileNameClick} />
                  </TableRow>
                </Table>

                <Table title="6. 정관(신주인수권부사채 발행 가능여부) 확인">
                  <TableRow title="정관">
                    <CmViewFileTypo file={article.atcscAtchmnfl} onClick={onFileNameClick} />
                  </TableRow>
                  <TableRow title="주주총회 또는" title2nd="이사회 결의서">
                    <CmViewFileTypo file={article.gmtsckAnact} onClick={onFileNameClick} />
                  </TableRow>
                </Table>

                <Table title="7. 기타 파일">
                  <TableRow title="파일명" full>
                    {gita.map((file) => {
                      return <CmViewFileTypo file={file} onClick={onFileNameClick} key={generateKey()} />
                    })}
                  </TableRow>
                </Table>

                <Table title="8. 추가 요청 파일">
                  <TableRow title="파일명" full>
                    {addtionalRequestDocs.map((file) => {
                      return <CmViewFileTypo file={file} onClick={onFileNameClick} key={generateKey()} />
                    })}
                  </TableRow>
                </Table>
              </Stack>

              <Stack direction={'column'} spacing={4}>
                <Stack direction={'column'} spacing={1}>
                  <Stack direction={'row'} spacing={1} alignItems={'center'}>
                    <LensOutlinedIcon color="secondary" />
                    <Typography
                      flexGrow={1}
                      variant="h2"
                      sx={{
                        lineHeight: '1.375rem',
                        fontSize: '1.375rem',
                        fontWeight: 'bold'
                      }}
                    >
                      상태 등록
                    </Typography>
                  </Stack>
                  <Grid
                    container
                    sx={{
                      borderTop: `1px solid ${theme.palette.info.main}`
                    }}
                  >
                    <TableRow title="투자기관">
                      <FormControl size="small" sx={{ minWidth: 280 }}>
                        <Select value={recomendSttusCm || ''} onChange={handleStatusChange}>
                          {recommendStatusList
                            .filter((recStatus) => {
                              if (recStatus.show) {
                                return true
                              } else {
                                return false
                              }
                            })
                            .map((recStatus) => {
                              return (
                                <MenuItem
                                  value={recStatus.recomendSttusCm}
                                  key={recStatus.recomendSttusCm}
                                  disabled={recStatus.disabled}
                                  onClick={() => {
                                    if (recStatus.recomendSttusCm === 'RST02007') {
                                      setRecomendSttus('Y')
                                    } else {
                                      setRecomendSttus('N')
                                    }
                                  }}
                                >
                                  {recStatus.recomendSttusCmNm}
                                </MenuItem>
                              )
                            })}
                        </Select>
                      </FormControl>
                    </TableRow>
                    {recomendSttus === 'Y' && (
                      <TableRow>
                        <TextField
                          size="small"
                          sx={{ width: '100%' }}
                          value={recomendSttusCmRm}
                          onChange={(e) => {
                            setRecomendSttusCmRm(e.target.value)
                          }}
                        />
                      </TableRow>
                    )}

                    <Grid xs={12}>
                      <Stack
                        direction={'row'}
                        justifyContent="flex-end"
                        spacing={1}
                        paddingTop={1}
                        sx={{ width: '100%' }}
                        id="btn1"
                      >
                        <Button size="small" color="info" variant="outlined" onClick={handlePrint}>
                          출력
                        </Button>
                        <Button size="small" color="info" variant="outlined" onClick={handlePdfPrint}>
                          PDF 저장
                        </Button>
                        {/* <Button size="small" color="info" variant="outlined">
                          BPR 저장
                        </Button> */}
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
              </Stack>
            </Stack>
          </Stack>

          <Stack spacing={2} direction="row" justifyContent="center" id="btn2">
            <Button
              color={'info'}
              variant="outlined"
              size="large"
              sx={{
                width: 120,
                fontWeight: 'bold',
                borderRadius: 12
              }}
              onClick={goList}
            >
              목록
            </Button>

            <Button
              color={'info'}
              variant="outlined"
              size="large"
              sx={{
                width: 120,
                fontWeight: 'bold',
                borderRadius: 12,
                px: 0
              }}
              onClick={goCompanyRecommend}
            >
              기업 추천 정보
            </Button>

            <Button
              color="secondary"
              variant="contained"
              size="large"
              sx={{
                width: 120,
                color: theme.palette.white.main,
                fontWeight: 'bold',
                borderRadius: 12,
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none'
                }
              }}
              onClick={submit}
            >
              저장
            </Button>
          </Stack>
        </Stack>
        {isConfirmPopup && <PopupAlert msg="저장되었습니다" btnMsg="확인" handlePopup={goList} />}
      </PageLayout>
      {isAlertFail && <PopupAlert msg={alertMessage} handlePopup={(e) => setIsAlertFail(false)} />}
    </>
  )
}

export default MgVnentrLonCmDetailView
