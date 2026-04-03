import { FiberManualRecordOutlined } from '@mui/icons-material'
import { Button, Divider, Grid, Stack, Typography, useTheme } from '@mui/material'
import { BtContentGrid } from 'components/bt/BtContentGrid'
import CommonAxios, { getPostConfig, getFileUploadConfig } from 'modules/utils/CommonAxios'
import VnentrLonCmRegFileInput from 'pageComponents/mypage/company/vncmloan/cmReg/FileInput'
import { memo, useRef, useContext, useCallback, useState } from 'react'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import ReactEvent from 'modules/utils/ReactEvent'
import { LOGIN_LINK_KEYS } from 'modules/contexts/common/LoginContext'
import { PopupApiStatus } from 'modules/consts/BizConst'
import { exeFunc } from 'modules/utils/ReactUtils'
import jsPdf from 'jspdf'
import { openSessionAlert } from 'pageComponents/common/pop/SessionCheckAlert'

const fileVO = { fileNm: null, fileId: null, isAutoUploaded: false }

const VnentrLonCmRegViewOnlineDoc = (props) => {
  const { onlineDoc, changeOnlineDoc, onAutoDocSubmit, readOnly, onClickFile, targetUsisId } = props
  const theme = useTheme()
  const infotechStatusRef = useRef('fail')
  const alertPopupRef = useRef()
  const [isAutoChk, setIsAutoChk] = useState(false)
  const commonContext = useContext(CommonContext)

  const inputMaker = (key) => {
    return (
      <VnentrLonCmRegFileInput
        filename={onlineDoc[key].fileNm}
        isAuto={onlineDoc[key].isAutoUploaded}
        onFileUpload={(file) => {
          changeOnlineDoc(key, { ...file, isAutoUploaded: false })
        }}
        onRemoveFile={() => {
          changeOnlineDoc(key, { ...fileVO })
        }}
        readOnly={readOnly}
        onFileNameClick={() => {
          onClickFile(onlineDoc[key])
        }}
      />
    )
  }

  // 필요서류 자동 제출
  const searchInfotechFile = useCallback(async () => {
    if (isAutoChk === true) {
      setIsAutoChk(false)
    }
    const clientCertKeyYn = await CommonAxios(getPostConfig('/api/doc/infotech/simple/clientcertKey'), true)
    const compareStr = clientCertKeyYn.data.data.clientCertKey.split('/')
    if (clientCertKeyYn !== null && compareStr[0] !== '9999') {
      // 필요서류 자동제출
      // 사업자 등록증 세팅
      const bznData = await CommonAxios(getPostConfig('/api/vncmloan/aplc/B1001'), true)

      if (bznData.data.data !== null) {
        onlineDoc['bizrno'].file = bznData.data.data.bznFile
        onlineDoc['bizrno'].fileId = bznData.data.data.bznFile.fileId
        onlineDoc['bizrno'].fileNm = bznData.data.data.bznFile.fileNm
        onlineDoc['bizrno'].isAutoUploaded = true

        inputMaker('bizrno')
      } else {
        exeFunc(alertPopupRef, 'open', bznData.data.message)
        return
      }

      // 부가가치세 과세 표준증명서 세팅
      const vatData = await CommonAxios(getPostConfig('/api/vncmloan/aplc/B4009'), true)

      if (vatData.data.data !== null) {
        onlineDoc['vatStdtaxProof'].file = vatData.data.data.vatFile
        onlineDoc['vatStdtaxProof'].fileId = vatData.data.data.vatFile.fileId
        onlineDoc['vatStdtaxProof'].fileNm = vatData.data.data.vatFile.fileNm
        onlineDoc['vatStdtaxProof'].isAutoUploaded = true

        inputMaker('vatStdtaxProof')
      } else {
        exeFunc(alertPopupRef, 'open', vatData.data.message)
        return
      }
    } else {
      // 인증서 등록 페이지 이동
      const errMsg = clientCertKeyYn.data.data.clientCertKey.split('/')
      openSessionAlert(true, errMsg[1], () =>
        window.open('https://mybank.ibk.co.kr/uib/jsp/guest/cer/cer10/cer1000/CCER100000_i.jsp')
      )
    }
    setIsAutoChk(true)
  }, [isAutoChk])

  return (
    <>
      <Stack direction={'column'} spacing={1}>
        <Typography variant="h3">
          <FiberManualRecordOutlined color="primary" sx={{ mr: 1, fontSize: '1rem' }} />
          온라인 재무서류 제출
        </Typography>
        <Divider sx={{ height: '1px', backgroundColor: theme.palette.primary.main }} />
      </Stack>

      <Stack direction={'row'} alignItems={'flex-start'} spacing={2}>
        <Typography flexGrow={1} sx={{ color: theme.palette.text.sub }}>
          • 사업자등록증, 부가세과세표준증명원
          <br />
          : 우측의 재무서류 자동 수집 버튼을 누르시고 홈택스에 등록된 공동인증서로 인증하시면 서류가 자동으로
          제출됩니다.
          <br />
          • 주주명부, 회사소개서(IR자료)
          <br />: 혁신투자BOX에 등록되어 있는 IR 정보가 있다면 등록된 정보를 자동으로 불러옵니다. 다른 자료를 제출하고
          싶으시면 파일 첨부 버튼으로 자료를 직접 등록해 주세요.
        </Typography>
        {!readOnly && (
          <Button variant="outlined" sx={{ wordBreak: 'keep-all' }} disableElevation onClick={searchInfotechFile}>
            필요서류 자동 제출
          </Button>
        )}
      </Stack>

      <Stack direction={'column'} spacing={1}>
        <Grid container sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
          <BtContentGrid gridXs={6} title={'사업자등록증'}>
            <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ width: '100%' }}>
              {inputMaker('bizrno')}
            </Stack>
          </BtContentGrid>

          <BtContentGrid
            gridXs={6}
            title={'부가세과세표준증명원'}
            additionalContents={<Typography sx={{ color: theme.palette.text.sub }}>(최근 3개년도)</Typography>}
          >
            <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ width: '100%' }}>
              {inputMaker('vatStdtaxProof')}
            </Stack>
          </BtContentGrid>

          <BtContentGrid gridXs={6} title={'법인등기사항전부증명서'}>
            {inputMaker('cprRgistMatterAllCrtf')}
          </BtContentGrid>

          <BtContentGrid gridXs={6} title={'주주명부'}>
            {inputMaker('stchInfoMngmNo')}
          </BtContentGrid>

          <BtContentGrid gridXs={6} title={'회사소개서(IR자료)'}>
            {inputMaker('cmpnyIntrcn')}
          </BtContentGrid>

          <BtContentGrid gridXs={6} title={''}>
            <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ width: '100%' }}></Stack>
          </BtContentGrid>
        </Grid>
      </Stack>
      <AlertPopup ref={alertPopupRef} />
    </>
  )
}

export default memo(VnentrLonCmRegViewOnlineDoc)
