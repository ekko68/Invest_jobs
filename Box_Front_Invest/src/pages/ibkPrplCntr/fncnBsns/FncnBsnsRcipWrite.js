import { Close, DescriptionOutlined } from '@mui/icons-material'
import { Box, Button, IconButton, Typography, useTheme } from '@mui/material'
import Api from 'modules/consts/Api'
import { FileUploadExtOpt, FileUploadSizeOpt } from 'modules/consts/BizConst'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import CommonAxios, { getConfig, getFileUploadConfig, getPostConfig } from 'modules/utils/CommonAxios'
import { createKey } from 'modules/utils/CommonUtils'
import { isNumber } from 'modules/utils/NumberUtils'
import { exeFunc } from 'modules/utils/ReactUtils'
import ResponseUtils from 'modules/utils/ResponseUtils'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import { openSessionAlert } from 'pageComponents/common/pop/SessionCheckAlert'
import FncnPrdoInfo from 'pageComponents/ibkPrplCntr/fncnBsns/FncnPrdoInfo'
import OpcmInfo from 'pageComponents/ibkPrplCntr/fncnBsns/OpcmInfo'
import FundValidtionPop from 'pageComponents/ibkPrplCntr/fund/FundValidtionPop'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import moment from 'moment'

const FncnBsnsRcipWrite = (props) => {
  const theme = useTheme()
  const fncnBsnsRcipNoRef = useRef()
  const fncnBsnsPbanNoRef = useRef()
  const [writeVo, setWriteVo] = useState({
    fncnBsnsPbanTtlNm : '',
    pbanYmd : '',
    fncnBsnsRcipNo : '',
    fncnBsnsPbanNo : '',
    fncnBsnsEnlsFildUqn : '',
    fncnBsnsPgrsScd : '',
    opcmNm : '',
    opcmRpprNm : '',
    opcmIncrYmd : '',
    opcmLicsKcd : '0',
    opcmBzn : '',
    opcmRsprNm : '',
    opcmCnplCon : '',
    opcmEad : '',
    jntOpcmYn : '',
    fundNm : '',
    fncnBsnsCprtDcd : '0',
    ibkFncnRqstAmt : '',
    fundOrgzScdlAmt : '',
    fundAsceTrm : '',
    fnmnPmntMcd : '0',
    baseEnrtCon : '',
    mnrmCon : '',
    otcmRmnrCon : '',
    rmrkCon : '',
    fileUnqNo : '',
    sprnFild : '',
    fncnBsnsJntOpcm : [],
    fncnBsnsInvvHmrs : [],
    fncnEnls : [],
    fncnBsnsPmglItm : [],
    fncnBsnsChcPrnl : []
  })
  const opcmInfoRef = useRef();
  const fncnPrdoInfoRef = useRef();
  const alertPopupRef = useRef();
  const [tempFiles, setTempFiles] = useState([])
  const fileId = useRef(0)
  const inputRef = useRef()
  const dragRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [countLen, setCountLen] = useState(0)
  const [emptyVal, setEmptyVal] = useState('')
  const commonContext = useContext(CommonContext)
  const history = useHistory()
  const alertPopRef = useRef()
  const fileLenRef = useRef()

  // 제출 or 임시저장
  const save = async(gubun)=> {
    const opcmInfo = opcmInfoRef.current.opcmInfoResult()
    const prdoInfo = fncnPrdoInfoRef.current.prdoInfoResult()

    if (chkValidation()) {
      exeFunc(alertPopupRef, 'open')

      return false
    }
    let fileInfo = []
    let fileIdStr = []
    let fileUnqNoList = []
    let fileUnqDta = ''

    for (let i = 0; i < tempFiles.length; i++) {
      if (tempFiles[i].blob.fileId === undefined) {
        const formData = new FormData()
        formData.append('file', tempFiles[i].blob)
        const res = await CommonAxios(getFileUploadConfig(formData), true)
        if (ResponseUtils.isValidateResponse(res)) {
          fileUnqNoList.push(res.data.data.fileId)
        }
      } else {
        let test = tempFiles[i].blob.fileId
        let keyStr = test.split('-')
        fileIdStr.push(keyStr[0])
      }
    }
    fileUnqNoList.forEach((item) => {
      let keyStr = item.split('-')
      fileInfo.push(keyStr[0])
    })
    
    //기존에 있는 파일 추가
    if (fileIdStr.toString() !== '') {
      fileUnqDta = fileIdStr.toString()
      if (fileInfo.toString() !== '') {
        fileUnqDta = fileIdStr.toString() + ',' + fileInfo.toString()
      }
    } else {
      // 첫 파일 추가
      fileUnqDta = fileInfo.toString()
    }

    const params = {
      ...writeVo,
      fileUnqNo: fileUnqDta === '' ? ' ' : fileUnqDta,
      fncnBsnsJntOpcm : opcmInfo,
      fncnBsnsInvvHmrs : prdoInfo[0],
      fncnEnls : prdoInfo[1],
      fncnBsnsPmglItm : prdoInfo[2],
      fncnBsnsChcPrnl : prdoInfo[3],
    }

    console.log("vo = ", params);
    if(gubun === 'tmpSave') {
      params.fncnBsnsPgrsScd = '1'
    }else {
      params.fncnBsnsPgrsScd = '2'
    }
    const saveRes = await CommonAxios(getPostConfig(Api.fncnBsns.pbanSave, params), true)
    console.log("saveRes = ", saveRes);

    if (saveRes) {
      if (saveRes.data.code !== '200') {
        exeFunc(alertPopRef, 'open', saveRes.data.message)
      }else {
        if(params.fncnBsnsPgrsScd === '1') {
          openSessionAlert(true, '임시저장 되었습니다.', () =>
          history.push(ROUTER_NAMES.FNCN_BSNS_RCIP_MY_LIST))
        }else {
          openSessionAlert(true, '제출 되었습니다.', () =>
          history.push(ROUTER_NAMES.FNCN_BSNS_RCIP_MY_LIST))
        }
      }
    }  
  }

  // 파일첨부 버튼 클릭 
  const handleFiles = () => {
    inputRef.current.click()
    inputRef.current.addEventListener('change', (event) => onUploadFile(event), { once: true })
  }

  // 파일첨부 파일 체크
  const onUploadFile = (event) => {
    const options = { limitSizeOpt: FileUploadSizeOpt.DEFAULT, acceptExtOpt: FileUploadExtOpt.DOC }
    if (event.target.files?.length > 0) {
      const file = event.target.files[0]
      const limitSizeOpt = isNumber(options?.limitSizeOpt?.size) ? options.limitSizeOpt : FileUploadSizeOpt.DEFAULT

      let isExtPass = true
      if (options?.acceptExtOpt?.list?.length > 0) {
        const ext = file.name.substring(file.name.lastIndexOf('.'))
        if (options.acceptExtOpt.list.findIndex((e) => e === ext) < 0) isExtPass = false
      }

      if (file.size > limitSizeOpt.size) {
        if (alertPopRef)
          exeFunc(alertPopRef, 'open', `업로드 파일 용량(${limitSizeOpt.name} 이하)을 초과 하였습니다.`)
      } else if (!isExtPass) {
        if (alertPopRef) exeFunc(alertPopRef, 'open', '파일 확장자를 확인해 주세요.')
      } else {
        onChangeFiles(event)
      }
    } else {
      if (alertPopRef) exeFunc(alertPopRef, 'open', '잠시 후에 다시 시도해주세요.')
    }

    event.target.value = ''
  }

  // 파일 첨부2
  const onChangeFiles = (e) => {
    let selectFiles = []
    let filedAdded = []
    let uploadType = FileUploadExtOpt.DOC
    let isExtPass = true

    if (e.type === 'drop') {
      if (uploadType?.list?.length > 0) {
        const ext = e.dataTransfer.files[0].name.substring(e.dataTransfer.files[0].name.lastIndexOf('.'))
        if (uploadType.list.findIndex((e) => e === ext) < 0) isExtPass = false
      }
      if (!isExtPass) {
        exeFunc(alertPopRef, 'open', '파일 확장자를 확인해 주세요.')
        return false;
      }else {
        selectFiles = e.dataTransfer.files
      }
    } else {
      selectFiles = e.target.files
    }

    for (const file of selectFiles) {
      filedAdded = [
        ...filedAdded,
        {
          id: fileId.current++,
          blob: file
        }
      ]
    }
    
    fileLenRef.current = filedAdded.length + tempFiles.length
    if(fileLenRef.current > 5) {
      exeFunc(alertPopRef, 'open', '파일은 최대 5개까지 첨부가능합니다.')
    }else {
      setTempFiles((pre) => [...pre, ...filedAdded])
      console.log(tempFiles.length)
    }
  }

  
  // 첨부 파일 삭제
  const deleteEtcDoc = (param) => {
    setTempFiles((pre) => pre.filter((file) => file.id !== param.id))
  }

  const handleDragIn = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  })
  const handleDragOut = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  })
  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer && e.dataTransfer.files) {
      setIsDragging(true)
    }
  })
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()

      onChangeFiles(e)
      setIsDragging(false)
    },
    [onChangeFiles]
  )
  const initDragEvents = useCallback((e) => {
    if (dragRef.current !== null) {
      dragRef.current.addEventListener('dragenter', handleDragIn)
      dragRef.current.addEventListener('dragleave', handleDragOut)
      dragRef.current.addEventListener('dragover', handleDragOver)
      dragRef.current.addEventListener('drop', handleDrop)
    }
  })
  const resetDragEvents = useCallback((e) => {
    if (dragRef.current !== null) {
      dragRef.current.removeEventListener('dragenter', handleDragIn)
      dragRef.current.removeEventListener('dragleave', handleDragOut)
      dragRef.current.removeEventListener('dragover', handleDragOver)
      dragRef.current.removeEventListener('drop', handleDrop)
    }
  })

  // 저장 전 빈 값 체크
  const chkValidation = ()=> {
    
    if (writeVo.opcmNm === '') {
      setEmptyVal('운용사명')
      return true
    } else if (writeVo.opcmRpprNm === "") {
      setEmptyVal('대표자명')
      return true
    } else if (writeVo.opcmIncrYmd === '') {
      setEmptyVal('설립일자')
      return true
    } else if (writeVo.opcmLicsKcd === '0') {
      setEmptyVal('회사형태')
      return true
    } else if (writeVo.opcmBzn === '') {
      setEmptyVal('사업자등록번호')
      return true
    } else if (writeVo.opcmRsprNm === '') {
      setEmptyVal('담당자')
      return true
    } else if (writeVo.opcmCnplCon === '') {
      setEmptyVal('담당자 연락처')
      return true
    } else if (writeVo.opcmEad === '') {
      setEmptyVal('담당자 이메일')
      return true
    } else if (writeVo.jntOpcmYn === '') {
      setEmptyVal('공동GP여부')
      return true
    } 
    if(writeVo.jntOpcmYn !== 'N') {
      for (let i = 0; i < opcmInfoRef.current.opcmInfoResult().length; i++) {
        if (i === 0) {
          if (opcmInfoRef.current.opcmInfoResult()[i].opcmNm === '') {
            setEmptyVal('공동GP정보 운용사명')
            return true
          } else if (opcmInfoRef.current.opcmInfoResult()[i].opcmRpprNm === '') {
            setEmptyVal('공동GP정보 대표자명')
            return true
          } else if (opcmInfoRef.current.opcmInfoResult()[i].opcmIncrYmd === '') {
            setEmptyVal('공동GP정보 설립일자')
            return true
          } else if (opcmInfoRef.current.opcmInfoResult()[i].opcmRsprNm === '') {
            setEmptyVal('공동GP정보 담당자')
            return true
          } else if (opcmInfoRef.current.opcmInfoResult()[i].opcmBzn === '') {
            setEmptyVal('공동GP정보 사업자 등록번호')
            return true
          } else if (opcmInfoRef.current.opcmInfoResult()[i].cnplCon === '') {
            setEmptyVal('공동GP정보 연락처')
            return true
          }else if (opcmInfoRef.current.opcmInfoResult()[i].emlCon === '') {
            setEmptyVal('공동GP정보 이메일')
            return true
          }
        }
  
        if (i > 0) {
          if(opcmInfoRef.current.opcmInfoResult()[i].opcmNm !== '') {
            if (opcmInfoRef.current.opcmInfoResult()[i].opcmRpprNm === '') {
              setEmptyVal('공동GP정보 대표자명')
              return true
            } else if (opcmInfoRef.current.opcmInfoResult()[i].opcmIncrYmd === '') {
              setEmptyVal('공동GP정보 설립일자')
              return true
            } else if (opcmInfoRef.current.opcmInfoResult()[i].opcmBzn === '') {
              setEmptyVal('공동GP정보 사업자 등록번호')
              return true
            } else if (opcmInfoRef.current.opcmInfoResult()[i].opcmRsprNm === '') {
              setEmptyVal('공동GP정보 담당자')
              return true
            } else if (opcmInfoRef.current.opcmInfoResult()[i].cnplCon === '') {
              setEmptyVal('공동GP정보 연락처')
              return true
            }else if (opcmInfoRef.current.opcmInfoResult()[i].emlCon === '') {
              setEmptyVal('공동GP정보 이메일')
              return true
            }
          }
        }
      }
    }

    if(writeVo.sprnFild === '') {
      setEmptyVal('지원분야')
      return true
    } else if (writeVo.fundNm === '') {
      setEmptyVal('조합명')
      return true
    } else if (writeVo.fncnBsnsCprtDcd === '0') {
      setEmptyVal('펀드구분')
      return true
    } else if (writeVo.ibkFncnRqstAmt === '') {
      setEmptyVal('IBK출자요청액(억원)')
      return true
    } else if (writeVo.fundOrgzScdlAmt === '') {
      setEmptyVal('펀드결성규모(억원)')
      return true
    } else if (writeVo.fundAsceTrm === '') {
      setEmptyVal('존속기간(년)')
      return true
    } else if (writeVo.fnmnPmntMcd === '0') {
      setEmptyVal('출자금 납부방식')
      return true
    } else if (writeVo.baseEnrtCon === '') {
      setEmptyVal('기준수익률(%)')
      return true
    } else if (writeVo.mnrmCon === '') {
      setEmptyVal('관리보수(%)')
      return true
    } else if (writeVo.otcmRmnrCon === '') {
      setEmptyVal('성과보수(%)')
      return true
    }

    for (let i = 0; i < fncnPrdoInfoRef.current.prdoInfoResult()[0].length; i++) {
      if (i === 0) {
        if (fncnPrdoInfoRef.current.prdoInfoResult()[0][i].opcmNm === '') {
          setEmptyVal('펀드참여인력 운용사명')
          return true
        } else if (fncnPrdoInfoRef.current.prdoInfoResult()[0][i].opcmHmrsDcd === '0') {
          setEmptyVal('펀드참여인력 인력구분코드')
          return true
        } else if (fncnPrdoInfoRef.current.prdoInfoResult()[0][i].opcmHmrsNm === '') {
          setEmptyVal('펀드참여인력 이름')
          return true
        } else if (fncnPrdoInfoRef.current.prdoInfoResult()[0][i].opcmHmrsCrrNyy === '') {
          setEmptyVal('펀드참여인력 투자경력')
          return true
        } else if (fncnPrdoInfoRef.current.prdoInfoResult()[0][i].opcmCmpnTpn === '') {
          setEmptyVal('펀드참여인력 대표번호')
          return true
        } else if (fncnPrdoInfoRef.current.prdoInfoResult()[0][i].opcmRsprCpn === '') {
          setEmptyVal('펀드참여인력 휴대폰번호')
          return true
        }else if (fncnPrdoInfoRef.current.prdoInfoResult()[0][i].opcmEad === '') {
          setEmptyVal('펀드참여인력 이메일주소')
          return true
        }
      }

      if (i > 0) {
        if(fncnPrdoInfoRef.current.prdoInfoResult()[0][i].opcmNm !== '') {
          if (fncnPrdoInfoRef.current.prdoInfoResult()[0][i].opcmHmrsDcd === '0') {
            setEmptyVal('펀드참여인력 인력구분코드')
            return true
          } else if (fncnPrdoInfoRef.current.prdoInfoResult()[0][i].opcmHmrsNm === '') {
            setEmptyVal('펀드참여인력 이름')
            return true
          } else if (fncnPrdoInfoRef.current.prdoInfoResult()[0][i].opcmHmrsCrrNyy === '') {
            setEmptyVal('펀드참여인력 투자경력')
            return true
          } else if (fncnPrdoInfoRef.current.prdoInfoResult()[0][i].opcmCmpnTpn === '') {
            setEmptyVal('펀드참여인력 대표번호')
            return true
          } else if (fncnPrdoInfoRef.current.prdoInfoResult()[0][i].opcmRsprCpn === '') {
            setEmptyVal('펀드참여인력 휴대폰번호')
            return true
          }else if (fncnPrdoInfoRef.current.prdoInfoResult()[0][i].opcmEad === '') {
            setEmptyVal('펀드참여인력 이메일주소')
            return true
          }
        }
      }
    }

    for (let i = 0; i < fncnPrdoInfoRef.current.prdoInfoResult()[1].length; i++) {
      if (i === 0) {
        if (fncnPrdoInfoRef.current.prdoInfoResult()[1][i].opcmNm === '') {
          setEmptyVal('출자자 모집현황 GP명')
          return true
        } else if (fncnPrdoInfoRef.current.prdoInfoResult()[1][i].isncInttNm === '') {
          setEmptyVal('출자자 모집현황 발급기관명')
          return true
        } else if (fncnPrdoInfoRef.current.prdoInfoResult()[1][i].pgstCon === '') {
          setEmptyVal('출자자 모집현황 진행단계')
          return true
        } else if (fncnPrdoInfoRef.current.prdoInfoResult()[1][i].fncnAmt === 0) {
          setEmptyVal('출자자 모집현황 출자금액')
          return true
        } 
      }

      if (i > 0) {
        if(fncnPrdoInfoRef.current.prdoInfoResult()[1][i].opcmNm !== '') {
          if (fncnPrdoInfoRef.current.prdoInfoResult()[1][i].isncInttNm === '') {
            setEmptyVal('출자자 모집현황 발급기관명')
            return true
          } else if (fncnPrdoInfoRef.current.prdoInfoResult()[1][i].pgstCon === '') {
            setEmptyVal('출자자 모집현황 진행단계')
            return true
          } else if (fncnPrdoInfoRef.current.prdoInfoResult()[1][i].fncnAmt === 0) {
            setEmptyVal('출자자 모집현황 출자금액')
            return true
          } 
        }
      }
    }

    if(tempFiles.length === 0) {
      setEmptyVal('관련 자료 파일 첨부')
      return true
    }
  }

  // 상세조회
  const loadDetail = async()=> {
    const url = Api.fncnBsns.rcipMyDetail + '/' + fncnBsnsRcipNoRef.current
    const res = await CommonAxios(getConfig(url), false)

    if (res && res.data.code === '200') {
      setWriteVo({
        ...res.data.data
        , pbanYmd : res.data.data.fncnBsnsPbanDcd !== "1" ? res.data.data.iibsFrrgTs : res.data.data.pbanYmd
        , fncnBsnsEnlsFildUqn : 'FBN0' + res.data.data.fncnBsnsEnlsFildUqn
        , opcmIncrYmd : moment(res.data.data.opcmIncrYmd).format('YYYY-MM-DD')
      })

      let fileArr = []  
      for(let i=0 ; i<res.data.data.fileList.length ; i++) {
        const params = {
          id: res.data.data.fileList[i].fileId,
          blob: {
            fileId : res.data.data.fileList[i].fileId,
            name : res.data.data.fileList[i].fileNm,
            path : res.data.data.fileList[i].filePath,
            ptrn : res.data.data.fileList[i].filePtrn,
            size : res.data.data.fileList[i].fileSize,
          }
        }
        fileArr.push(params)
      }
      setTempFiles(fileArr)
    }
  }

  useEffect(() => {
    commonContext.actions.callbackAfterSessionRefresh(async () => {
      fncnBsnsRcipNoRef.current = props.location.state.fncnBsnsRcipNo
      fncnBsnsPbanNoRef.current = props.location.state.fncnBsnsPbanNo
      if(props.location.state.fncnBsnsPgrsScd !== '1') {
        setWriteVo({...writeVo,
          fncnBsnsPbanNo : fncnBsnsPbanNoRef.current ,
          fncnBsnsPbanTtlNm : props.location.state.fncnBsnsPbanTtlNm,
          pbanYmd : props.location.state.fncnBsnsPbanDcd !== "선정공고" ? props.location.state.iibsFrrgTs : props.location.state.pbanYmd,
        })
      }else {
        loadDetail()
      }
    }, true, true);
  }, [commonContext.state.user])

  useEffect(() => {
    initDragEvents()
    return () => resetDragEvents()
  }, [initDragEvents, resetDragEvents])

  return (
    <>
      {/* Contents */}
      <div className="investBusiness_container investBusiness_accept">
        <div className="section_header">
          <h3 className={'title'}>출자사업 접수</h3>
        </div>
        <div className="investBusiness_box">
          <h3 className="accept_title">출자사업 개요</h3>
          <table className="view_table">
            <colgroup>
              <col width={'13%'} />
              <col width={'37%'} />
              <col width={'13%'} />
              <col width={'37%'} />
            </colgroup>
            <tbody>
              <tr>
                <th>출자사업명</th>
                <td>{writeVo.fncnBsnsPbanTtlNm}</td>
                <th>공고일자</th>
                <td>{writeVo.pbanYmd}</td>
              </tr>
            </tbody>
          </table>
          <h3 className="accept_title">운용사 정보</h3>
          {/* 운용사 정보 start */}
          <OpcmInfo ref={opcmInfoRef} vo={writeVo} />
          {/* 운용사 정보 end */}

          <h3 className="accept_title">출자제안서 정보</h3>
          {/* 출자 제안서 정보 start */}
          <FncnPrdoInfo ref={fncnPrdoInfoRef} vo={writeVo} />
          {/* 출자 제안서 정보 end */}
          
          <h3 className="accept_title">비고(보완내용 등 자유작성)</h3>
          <table className="view_table">
            <colgroup>
              <col width={'13%'} />
              <col width={'37%'} />
              <col width={'13%'} />
              <col width={'37%'} />
            </colgroup>
            <tbody>
              <tr>
                <th>
                  추가 내용 입력
                </th>
                <td colSpan={3}>
                  <div className="textarea_wrap">
                    <textarea placeholder="내용" className="textarea" maxLength={1000} title="추가 내용" 
                      defaultValue={writeVo.rmrkCon}
                      onChange={e => {
                        writeVo.rmrkCon = e.target.value
                        setCountLen(writeVo.rmrkCon.length)
                      }}
                    />
                    <div className="textarea_count">
                      <span className="textarea_count_current">{countLen}</span>
                      <span className="textarea_count_total">/1000</span>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <h3 className="accept_title">관련 자료 첨부</h3>
          <table className="view_table">
            <colgroup>
              <col width={'13%'} />
              <col width={'37%'} />
              <col width={'13%'} />
              <col width={'37%'} />
            </colgroup>
            <tbody>
              <tr>
                <th>
                  파일 첨부
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td colSpan={3} ref={dragRef}>
                  {
                    tempFiles.length > 0 ? (
                      tempFiles.map((file) => {
                        return (
                          <Box key={createKey()} width={340} alignItems={'center'} display={'flex'}>
                            <Typography>{file.blob.name}</Typography>
                              <IconButton
                                onClick={() => deleteEtcDoc(file)}
                                size="small"
                                sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                              >
                                <Close />
                              </IconButton>
                          </Box>
                        )
                    })) :
                    <div className="fileAttach_drag_wrap">
                      <DescriptionOutlined className="fileAttach_drag_icon" />
                      <div className="fileAttach_drag_text">
                        파일을 드래그해서 올려 놓거나,
                        <br /> 파일첨부 버튼을 눌러 파일을 등록해 주세요.
                      </div>
                    </div>
                  }
                  <div className="fileAttach_input_wrap">
                    <input 
                      className="fileAttach_input" 
                      type="file" 
                      id="inputFile01" 
                      accept={FileUploadExtOpt.DOC.str}
                      ref={inputRef}
                      multiple
                    />
                    <label className="fileAttach_label" onClick={(e)=> {handleFiles(e)}}>
                      파일첨부
                    </label>
                    <span className="fileAttach_text">pptx, doc, docx, hwp, pdf 100MB 이내</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="bottom_guide">
            * 제출 이후에는 내용 수정이 불가합니다. 입력하신 내용이 정확한지 확인 후 제출 부탁 드립니다. (접수 취소 후
            재신청은 가능)
          </div>
          <div className="bottom_buttons">
            <Button size="large" className="cancel_button" variant="contained" onClick={()=> {history.push(ROUTER_NAMES.FNCN_BSNS_PBAN_DETAIL + '?fncnBsnsPbanNo=' + fncnBsnsPbanNoRef.current)}} disableElevation>
              취소
            </Button>
            <Button size="large" variant="outlined" disableElevation onClick={()=>{save('tmpSave')}}>
              임시저장
            </Button>
            <Button size="large" variant="contained" disableElevation onClick={()=>{save('save')}}>
              제출
            </Button>
          </div>
        </div>
      </div>
      <FundValidtionPop ref={alertPopupRef} theme={theme} emptyVal={emptyVal} />
      <AlertPopup ref={alertPopRef} />
      {/* End of Contents */}
    </>
  )
}

export default FncnBsnsRcipWrite
