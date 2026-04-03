import { FiberManualRecordOutlined } from '@mui/icons-material'
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useTheme
} from '@mui/material'
import { BtContentGrid } from 'components/bt/BtContentGrid'
import Api from 'modules/consts/Api'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import CommonAxios, { getConfig, getPostConfig } from 'modules/utils/CommonAxios'
import { createKey } from 'modules/utils/CommonUtils'
import QueryUtils from 'modules/utils/QueryUtils'
import { exeFunc } from 'modules/utils/ReactUtils'
import ConfirmPopup from 'pageComponents/common/pop/ConfirmPopup'
import ManageHnfInfo from 'pageComponents/ibkPrplCntr/fund/ManageHnfInfo'
import OprtorFundInfo from 'pageComponents/ibkPrplCntr/fund/OprtorFundInfo'
import OprtorHmfInfo from 'pageComponents/ibkPrplCntr/fund/OprtorHmfInfo'
import OprtorInfo from 'pageComponents/ibkPrplCntr/fund/OprtorInfo'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'

const FundPrplInfoStepView2 = (props) => {
  const theme = useTheme()
  const history = useHistory()
  const isMounted = useRef(false) // useEffect에서 mount 유무 동기확인을 위함
  const commonContext = useContext(CommonContext)
  const oprtorInfoRef = useRef()
  const oprtorHmfRef = useRef()
  const manageHnfRef = useRef()
  const confirmPopupRef = useRef()
  const alertPop = useRef()

  const [vo, setVo] = useState({
    utlinsttId: '',
    prnNm: '',
    fundId: '',
    fundNm: '',
    bzn: '',
    rprNm: '',
    adres: '',
    incrYmd: '',
    fundOprTs: '',
    cptsTtsm: '',
    payCapl: '',
    dscplYn: '',
    astTtsmAmt: '',
    lbltCpstAmt: '',
    cptsTtsmAmt: '',
    bsnErn: '',
    bsnCt: '',
    ctnpAmt: '',
    astTtsmAmt1y: '',
    astTtsmAmt2y: '',
    lbltCpstAmt1y: '',
    lbltCpstAmt2y: '',
    cptsTtsmAmt1y: '',
    cptsTtsmAmt2y: '',
    bsnErn1y: '',
    bsnErn2y: '',
    bsnCt1y: '',
    bsnCt2y: '',
    ctnpAmt1y: '',
    ctnpAmt2y: '',
    progrsStg: '',
    opratnScaleCo: '',
    opratnScaleAm: '',
    blindCo: '',
    blindAm: '',
    prjctCo: '',
    prjctAm: '',
    lqdFundErnrt: '',
    fundExhsRt: '',
    opratnHnfInfoTotCo: '',
    opratnHnfInfoMngrNm: '',
    opratnHnfInfoDscplYn: '',
    proFundPartcptn: [], // 제안 펀드 참여 운용 인력
    opratnHmfMntnc: [], // 운용인력 유지율
    manageHnfInfoTotCo: '',
    manageHnfInfoHnf: '',
    managedtaAtchmnfl: 'none', // 첨부파일 등록
    manageHnfInfo: '', // 운용인력 징계여부
    rgsnTs: '',
    rgsnUserId: '',
    amnnTs: '',
    amnnUserId: '',
    fundStchCnfgList: [], // 주요 주주구성
    managedtaAtchmnflList: [] //파일 불러올때 저장될 배열
  })

  // 작성된 데이터 불러오기
  const loadFundOpemDetail = useCallback(async () => {
    const query = QueryUtils.getQuery(props)
    const url = Api.fund.fundOpcmInfoSave + '/' + query['fundId']
    const res = await CommonAxios(getConfig(url), false)

    if (res && res.status === 200) {
      return res.data.data
    }
  }, [])

  // 이전
  const moveBeforePage = useCallback(() => {
    const url = ROUTER_NAMES.FUND_PRPL_INFO_STEP_VIEW + props.location.search
    history.push(url)
  }, [])

  // 제안 취소 팝업 호출
  const showConfirmPop = () => {
    exeFunc(confirmPopupRef, 'open', '제출 완료된 펀드제안을 정말 취소하시겠습니까?')
  }

  // 제안 취소
  const fundSupportCancel = async () => {
    console.log('cancel Vo = ', vo)
    const param = { ...vo, auditStg: 'cancel' }
    let isSaveComplete = true

    const url = Api.fund.fundPrplInfoCancle + '/' + vo.fundId
    const updateRes = await CommonAxios(getPostConfig(url, param))
    console.log('updateRes ==== ', updateRes)

    if (updateRes) {
      if (updateRes.data.code !== '200') {
        isSaveComplete = false
        exeFunc(alertPop, 'open', updateRes.data.message)
      }
    } else {
      isSaveComplete = false
    }

    if (isSaveComplete) {
      history.push(ROUTER_NAMES.FUND_PRPL_INFO_LIST_VIEW)
    }
  }

  // 복사본 만들기
  const copyData = () => {
    const url =
      ROUTER_NAMES.FUND_PRPL_INFO_STEP + '?utlinsttId=' + commonContext.state.user.info.groupId + '&fundId=' + vo.fundId
    history.push(url, { copy: 'write' })
  }

  useEffect(() => {
    if (commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
      isMounted.current = true
      commonContext.actions.pageMountPathCheck(history, async () => {
        const query = QueryUtils.getQuery(props)

        if (query && query.hasOwnProperty('utlinsttId')) {
          const fundDetailObject = await loadFundOpemDetail()
          console.log('view2 fundDetailObject = ', fundDetailObject)
          if (fundDetailObject !== null && fundDetailObject !== undefined) {
            let str1 = fundDetailObject.bzn.slice(0, 3) + '-'
            let str2 = fundDetailObject.bzn.slice(3, 5) + '-'
            let str3 = fundDetailObject.bzn.slice(5, 10)

            setVo({
              ...fundDetailObject,
              copy: props.location.state.copy,
              bzn: str1 + str2 + str3,
              fundNm: props.location.state.fundNm
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
                <StepLabel>답변 확인</StepLabel>
              </Step>
            </Stepper>
          </Paper>

          {/* 운용사 상세 정보 */}
          <Paper sx={{ p: 4 }}>
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
                <Button variant="outlined" disabled>
                  재무정보 자동 입력
                </Button>
              </Stack>
              {/* 운용사 정보 */}
              <Stack direction={'column'} spacing={1}>
                <OprtorInfo vo={vo} ref={oprtorInfoRef} theme={theme} copy={props.location.state.copy} />
              </Stack>
              {/* 운용사 정보 END */}
              <Stack direction={'column'} spacing={1}>
                <Typography variant="h3">
                  <FiberManualRecordOutlined color="primary" sx={{ mr: 1, fontSize: '1rem' }} />
                  기운용 펀드 정보
                </Typography>
                <Divider sx={{ height: '1px', backgroundColor: theme.palette.primary.main }} />
              </Stack>

              <Stack direction={'column'}>
                {/* 기운용 펀드 */}
                <OprtorFundInfo vo={vo} theme={theme} copy={props.location.state.copy} />
                {/* 기운용 펀드 END */}
              </Stack>

              <Stack direction={'column'} spacing={1}>
                <Typography variant="h3">
                  <FiberManualRecordOutlined color="primary" sx={{ mr: 1, fontSize: '1rem' }} />
                  운용인력 정보
                </Typography>
                <Divider sx={{ height: '1px', backgroundColor: theme.palette.primary.main }} />
              </Stack>

              <Stack direction={'column'} spacing={1}>
                {/* 운용인력 정보 */}
                <OprtorHmfInfo vo={vo} ref={oprtorHmfRef} theme={theme} copy={props.location.state.copy} />
                {/* 운용인력 정보 END */}
              </Stack>

              <Stack direction={'column'} spacing={1}>
                <Typography variant="h3">
                  <FiberManualRecordOutlined color="primary" sx={{ mr: 1, fontSize: '1rem' }} />
                  관리인력 정보
                </Typography>
                <Divider sx={{ height: '1px', backgroundColor: theme.palette.primary.main }} />
              </Stack>

              <Stack direction={'column'} spacing={1}>
                {/* 관리인력 정보 */}
                <ManageHnfInfo ref={manageHnfRef} vo={vo} theme={theme} copy={props.location.state.copy} />
                {/* 관리인력 정보 END */}
              </Stack>

              <Stack direction={'column'} spacing={1}>
                <Typography variant="h3">
                  <FiberManualRecordOutlined color="primary" sx={{ mr: 1, fontSize: '1rem' }} />
                  관련자료 첨부
                </Typography>
                <Divider sx={{ height: '1px', backgroundColor: theme.palette.primary.main }} />
              </Stack>

              <Stack direction={'column'} spacing={1}>
                <Grid container sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
                  <BtContentGrid gridXs={12} title={'파일 첨부'}>
                    <Stack direction={'column'} spacing={2} sx={{ width: '100%' }}>
                      <Box
                        sx={{
                          p: 2,
                          boxSizing: 'border-box',
                          width: '100%',
                          backgroundColor: theme.palette.background.default
                        }}
                      >
                        <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" sx={{ p: 2 }}>
                          {vo.managedtaAtchmnfl !== ' ' && vo.managedtaAtchmnflList.length > 0 ? (
                            vo.managedtaAtchmnflList.map((fileData) => {
                              return (
                                <div key={createKey()}>
                                  <Typography>{fileData.fileNm}</Typography>
                                </div>
                              )
                            })
                          ) : (
                            <Typography></Typography>
                          )}
                        </Stack>
                      </Box>
                    </Stack>
                  </BtContentGrid>
                </Grid>
              </Stack>
              <Stack direction={'row'} spacing={1} justifyContent="center" alignItems="center">
                {vo.progrsStg === 'AUD01001' && (
                  <Button size="large" variant="outlined" onClick={showConfirmPop} disableElevation>
                    제안 취소
                  </Button>
                )}
                {vo.progrsStg === 'cancel' && (
                  <Button size="large" variant="outlined" onClick={copyData} disableElevation>
                    복사본 만들기
                  </Button>
                )}
                {(vo.progrsStg === 'AUD01001' ||
                  vo.progrsStg === 'AUD01003' ||
                  vo.progrsStg === 'AUD01004' ||
                  vo.progrsStg === 'AUD01005' ||
                  vo.progrsStg === 'AUD01006' ||
                  vo.progrsStg === 'cancel') && (
                  <Button size="large" variant="outlined" onClick={moveBeforePage} disableElevation>
                    이전
                  </Button>
                )}
                <Button
                  size="large"
                  variant="contained"
                  onClick={() => history.push(ROUTER_NAMES.FUND_PRPL_INFO_LIST_VIEW)}
                  disableElevation
                >
                  확인
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Stack>
        <ConfirmPopup ref={confirmPopupRef} onConfirm={fundSupportCancel} />
        <AlertPopup ref={alertPop} />
      </Container>
    </>
  )
}

export default FundPrplInfoStepView2
