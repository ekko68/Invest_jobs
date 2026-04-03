import { DoDisturbOnOutlined } from '@mui/icons-material'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import PageLayout from 'components/PageLayout'
import PopupAlert from 'components/PopupAlert'
import Toggle from 'components/Toggle'
import Button from 'components/atomic/Button'
import Select from 'components/atomic/Select'
import ko from 'date-fns/locale/ko'
import { getUserInfo } from "modules/consts/AdminApi"
import Api from 'modules/consts/Api'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import CommonAxios from 'modules/utils/CommonAxios'
import { getPostConfig, getConfig } from 'modules/utils/CommonUtils'
import ResponseUtils from "modules/utils/ResponseUtils"
import FncnBsnsSelectPop from 'pages/invest/fncnBsns/FncnBsnsSelectPop'
import { useCallback, useEffect, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import { useHistory } from 'react-router-dom'
import moment from 'moment'

const FncnBsnsPbanView = (props) => {
  const [isUpdate, setIsUpdate] = useState(true)
  const [fileList, setFileList] = useState([])
  const searchSelectSort = useRef(null)
  const fileId = useRef(0)
  const inputRef = useRef()
  const dragRef = useRef(null)
  const pageType = useRef('')
  const idxRef = useRef(0)
  const fncnBsnsSelectRef = useRef()
  const [isDragging, setIsDragging] = useState(false)
  const history = useHistory()

  const [defaultSelectSort, setDefaultSelectSort] = useState({
    active: '',
    list: [
      { id: '', value: '', label: '선택' },
      { id: '01', value: '01', label: '선정공고' },
      { id: '02', value: '02', label: '접수현황' },
      { id: '03', value: '03', label: '선정결과' }
    ]
  })
  const [enlsFildList, setEnlsFildList] = useState([])
  const [info, setInfo] = useState({
    fncnBsnsPbanNo : '',
    fncnBsnsPbanTtlNm : '',
    fncnBsnsPbanDcd : '',
    fncnBsnsNm : '',
    pbanYmd : '',
    prdoRccgYmd : '',
    rspbEmn : ' ',
    rprsCnplCon : '',
    pbanDtlCon : '',
    fileUnqNo : '',
    delYn : 'N',
    rgsrNm : '',
    iibsFrrgId : '',
    iibsFrrgTs : '',
    adminFncnBsnsEnlsFild : []
  })

  const [isOpen, setIsOpen] = useState({
    active : false
  })

  const [isAlertOpen, setIsAlertOpen] = useState({
    active : false,
    text : ''
  })
  const [validAlertOpen, setValidAlertOpen] = useState({
    active : false,
    text : ''
  })
  const fileLenRef = useRef()

  // ===== datepicker
  const onChangeDate = (currentDate, type, type2) => {
    // type: 신청기간인지 진행기간인지, type2: 시작일인지 종료일인지
    if (type === 'pbanYmd') {
      setInfo({...info, pbanYmd : currentDate})
    } else if(type === 'prdoRccgYmd') {
      setInfo({...info, prdoRccgYmd : currentDate})
    }
  }

  // 날짜 형태 변경
  const changeDate = (date)=> {
    let year = date.getFullYear().toString()
    let month = (date.getMonth() + 1) < 10
    ? '0' + (date.getMonth() + 1)
    : date.getMonth() + 1
    let day = date.getDate() < 10
    ? '0' + date.getDate()
    : date.getDate()

    let ymd = year + month.toString() + day

    return ymd
  }

  //파일 업로드 config
  const getFileUploadConfig = (url, form) => {
    const config = {
      url: url,
      method: 'post',
      data: form,
      fileused: true
    }
    return config
  }

  // 출자사업 공고 저장
  const save = async()=> {
    if(chkValidation()) {
      return false
    }

    let fileInfo = []
    let fileIdStr = []
    let fileUnqNoList = []
    let fileUnqDta = ''
    const url = Api.invest.fileUpload
    for (let i = 0; i < fileList.length; i++) {
      if (fileList[i].blob.fileId === undefined) {
        const formData = new FormData()
        formData.append('file', fileList[i].blob)
        const res = await CommonAxios('IVT', getFileUploadConfig(url, formData))
        if (ResponseUtils.isValidateResponse(res)) {
          fileUnqNoList.push(res.data.data.fileId)
        }
      } else {
        let fileId = fileList[i].blob.fileId
        let keyStr = fileId.split('-')
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
    
    const res = await getUserInfo();
    const params = {
      ...info,
      pbanYmd : defaultSelectSort.active === '01' ? changeDate(info.pbanYmd) : '', 
      prdoRccgYmd : defaultSelectSort.active === '01' ? changeDate(info.prdoRccgYmd) : '', 
      fileUnqNo : fileUnqDta === '' ? ' ' : fileUnqDta,
      adminFncnBsnsEnlsFild : defaultSelectSort.active === '01' ? enlsFildList : [],
      iibsFrrgId : res.data.data.mngrId,
      rgsrNm : res.data.data.mngrNm,
      fncnBsnsPbanDcd : defaultSelectSort.active,
      delYn : info.delYn,
    }
    console.log('params = ', params)
    // 저장
    const saveRes = await CommonAxios('IVT', getPostConfig(Api.invest.fncnBsnsPbanSave, params));

    if(saveRes.data.code === '200') {
      if( saveRes.data.data.pban.isUpdate === 'N') {
        await CommonAxios('IVT', getPostConfig(Api.invest.rgsnFncnBsnsPbanInfo, saveRes.data.data.pban));
      }
      setIsAlertOpen({ ...isOpen, active: true, text: '저장되었습니다.' })
    }else{
      setValidAlertOpen({ ...isOpen, active: true, text: saveRes.data.message })
    }

  }

  // 행추가 버튼 클릭
  const onClickAdd = () => {
    if (enlsFildList.length >= 20) {
        setValidAlertOpen({ ...isOpen, active: true, text: '등록 가능한 행을 초과하였습니다. 최대 20행까지 입니다.' })
        return
    }
    const item = createEmptyItem()
    enlsFildList.push(item)
    setIsUpdate(!isUpdate)
  }

  // 행추가
  const createEmptyItem = () => {
      const item = {}

      item['rgsnSqn'] = enlsFildList.length+1
      item['fncnBsnsEnlsFildUqn'] = ''
      item['orcyFncnAmt'] = 0
      item['fncnBsnsChcOpcmCnt'] = ''
      item['iibsFrrgId'] = ''

      return item
  }

  // 행 삭제
  const onClickDelete = (item) => {
    if (enlsFildList.length > 0) {
      let index = -1
      const seq = item['rgsnSqn']
      for (let i = 0; i < enlsFildList.length; i++) {
        const listItem = enlsFildList[i]
        if (listItem['rgsnSqn'] === seq) {
          index = i
          break
        }
      }
      if (index > -1) {
        enlsFildList.splice(index, 1)
      }
    }
    setIsUpdate(!isUpdate)
  }

  // 저장 전 빈값 체크
  const chkValidation = () => {
    if (defaultSelectSort.active === '') {
      setValidAlertOpen({ ...validAlertOpen, active: true, text: '구분은(는) 필수 입력 항목입니다.' })
      return true
    }
    
    if (defaultSelectSort.active === '01') {
      if (info.fncnBsnsPbanTtlNm === '') {
        setValidAlertOpen({ ...validAlertOpen, active: true, text: '제목은(는) 필수 입력 항목입니다.' })
        return true
      } else if (info.fncnBsnsNm === '') {
        setValidAlertOpen({ ...validAlertOpen, active: true, text: '출자사업명은(는) 필수 입력 항목입니다.' })
        return true
      } else if (info.pbanYmd === '') {
        setValidAlertOpen({ ...validAlertOpen, active: true, text: '공고일자은(는) 필수 입력 항목입니다.'})
        return true
      } else if (info.prdoRccgYmd === '') {
        setValidAlertOpen({ ...validAlertOpen, active: true, text: '제안서 접수 마감일은(는) 필수 입력 항목입니다.'})
        return true
      } else if (info.rprsCnplCon === '') {
        setValidAlertOpen({ ...validAlertOpen, active: true, text: '대표 연락처은(는) 필수 입력 항목입니다.'})
        return true
      }
  
      for(let i = 0 ; i<enlsFildList.length ; i++) {
        if(i === 0) {
          if(enlsFildList[i].fncnBsnsEnlsFildUqn === '') {
            setValidAlertOpen({ ...validAlertOpen, active: true, text: '모집분야의 지원분야은(는) 필수 입력 항목입니다.'})
            return true
          } else if (info.orcyFncnAmt === 0) {
            setValidAlertOpen({ ...validAlertOpen, active: true, text: '모집분야의 IBK출자금액은(는) 필수 입력 항목입니다.'})
            return true
          } else if (info.fncnBsnsChcOpcmCnt === '') {
            setValidAlertOpen({ ...validAlertOpen, active: true, text: '모집분야의 선정운용사수은(는) 필수 입력 항목입니다.'})
            return true
          }
        }
  
        if(i > 0) {
          if (info.orcyFncnAmt === 0) {
            if(enlsFildList[i].fncnBsnsEnlsFildUqn !== '') {
              setValidAlertOpen({ ...validAlertOpen, active: true, text: '모집분야의 지원분야은(는) 필수 입력 항목입니다.'})
              return true
            } else if (info.orcyFncnAmt === 0) {
              setValidAlertOpen({ ...validAlertOpen, active: true, text: '모집분야의 IBK출자금액은(는) 필수 입력 항목입니다.'})
              return true
            } else if (info.fncnBsnsChcOpcmCnt === '') {
              setValidAlertOpen({ ...validAlertOpen, active: true, text: '모집분야의 선정운용사수은(는) 필수 입력 항목입니다.'})
              return true
            }
          } 
        }
      }
    }
    
    if(info.pbanDtlCon === '') {
      setValidAlertOpen({ ...validAlertOpen, active: true, text: '공고내용은(는) 필수 입력 항목입니다.'})
      return true
    }

  }

  // 파일첨부 버튼 클릭 
  const handleFiles = () => {
    inputRef.current.click()
    inputRef.current.addEventListener('change', (event) => onUploadFile(event), { once: true })
  }

  // 숫자형 체크
  const isNumber = (number) => {
    if(!isNaN(number) && (number !== null && number !== undefined && String(number).trim() !== '')) return true;
    else return false;
  };

  // 파일첨부 파일 체크
  const onUploadFile = (event) => {
    const options = {
       limitSizeOpt: { name: '100MB', size: 100 * 1024 * 1024 }, 
      acceptExtOpt: { str: '.ppt, .pptx, .doc, .docx, .pdf, .hwp, .xlsx' }
        , list: ['.ppt', '.pptx', '.doc', '.docx', '.pdf', '.hwp', '.xlsx']  
    }
    if (event.target.files?.length > 0) {
      const file = event.target.files[0]
      const limitSizeOpt = isNumber(options?.limitSizeOpt?.size) ? options.limitSizeOpt : options.limitSizeOpt

      let isExtPass = true
      if (options?.acceptExtOpt?.list?.length > 0) {
        const ext = file.name.substring(file.name.lastIndexOf('.'))
        if (options.acceptExtOpt.list.findIndex((e) => e === ext) < 0) isExtPass = false
      }

      if (file.size > limitSizeOpt.size) {
        if (alertPopupRef)
          setValidAlertOpen({ ...validAlertOpen, active: true, text:  `업로드 파일 용량(${limitSizeOpt.name} 이하)을 초과 하였습니다.`}) 
      } else if (!isExtPass) {
        setValidAlertOpen({ ...validAlertOpen, active: true, text: '파일 확장자를 확인해 주세요.'}) 
      } else {
        onChangeFiles(event)
      }
    } else {
      setValidAlertOpen({ ...validAlertOpen, active: true, text: '잠시 후에 다시 시도해주세요.'})
    }

    event.target.value = ''
  }

  // 파일 첨부2
  const onChangeFiles = useCallback((e) => {
    let selectFiles = []
    let filedAdded = []
    let uploadType = ['.ppt', '.pptx', '.doc', '.docx', '.pdf', '.hwp', '.xlsx']
    let isExtPass = true

    if (e.type === 'drop') {
      
      if (uploadType.length > 0) {
        const ext = e.dataTransfer.files[0].name.substring(e.dataTransfer.files[0].name.lastIndexOf('.'))
        if (uploadType.findIndex((e) => e === ext) < 0) isExtPass = false
      }
      if (!isExtPass) {
        setValidAlertOpen({ ...validAlertOpen, active: true, text: '파일 확장자를 확인해 주세요.'})
        return false;
      }else {
        selectFiles = e.dataTransfer.files
      }
    } else {
      if (uploadType.length > 0) {
        const ext = e.target.files[0].name.substring(e.target.files[0].name.lastIndexOf('.'))
        if (uploadType.findIndex((e) => e === ext) < 0) isExtPass = false
      }
      if (!isExtPass) {
        setValidAlertOpen({ ...validAlertOpen, active: true, text: '파일 확장자를 확인해 주세요.'})
        return false;
      }else {
        selectFiles = e.target.files
      }
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

    fileLenRef.current = fileList.length + filedAdded.length

    if(fileLenRef.current > 5) {
      setValidAlertOpen({ ...validAlertOpen, active: true, text: '파일은 최대 5개까지 첨부가능합니다.'})
    }else {
      setFileList((pre) => [...pre, ...filedAdded])
      setIsUpdate(!isUpdate)
    }
  },[fileList])

  // 파일 드래그 첨부
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

  // 첨부 파일 삭제
  const deleteEtcDoc = (param) => {
    setFileList((pre) => pre.filter((file) => file.id !== param.id))
  }

  // 상태 변경
  const handleToggle = async(e)=> {
    
    let state = ''
    if(e.target.checked === true) {
      state = 'N'
      setInfo({...info, delYn : 'N'})
    }else {
      state = 'Y'
      setInfo({...info, delYn : 'Y'})
    }
    setIsUpdate(!isUpdate)
  }

  // 지원분야 팝업 호출
  const openSelectPopup = (idx)=> {
    idxRef.current = idx
    setIsOpen({ ...isOpen , active: true})
  }

  // 지원분야 팝업 리턴 값 셋팅
  const enlsFildSetList = (data)=> {
    for(let i=0 ; i<enlsFildList.length ; i++) {
      if(data[0].fncnBsnsEnlsFildNm === enlsFildList[i].fncnBsnsEnlsFildUqnNm) {
        setValidAlertOpen({ ...validAlertOpen, active: true, text: '중복된 지원분야가 있습니다. 다시 선택해주세요.' })
        return false
      }else {
        if(data[0].rgsnSqn === enlsFildList[i].rgsnSqn) {
          enlsFildList[i].fncnBsnsEnlsFildUqnNm = data[0].fncnBsnsEnlsFildNm
          enlsFildList[i].fncnBsnsEnlsFildUqn = data[0].fncnBsnsEnlsFildUqn
        }
      }
    }
    setIsUpdate(!isUpdate)
  }

  // /* 휴대폰 formating function */
  const isTelFormat = (tel) => {
    if (tel.length === 3) {
      return tel.replace(/(\d{3})/, '$1-')
    } else if (tel.length === 7) {
      return tel.replace(/(\d{3})(\d{4})/, '$1-$2')
    } else if (tel.length === 11) {
      //000-0000-0000
      return tel.replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
    }
    return tel
  }

  // 상세화면 조회
  const loadDetail = async(state)=> {
    // 조회
    const detailRes = await CommonAxios('IVT', getConfig(Api.invest.fncnBsnsPbanDetail + '/' + state.data.fncnBsnsPbanNo), false);
    const res = {...detailRes.data.data,
      pbanYmd : detailRes.data.data.pbanYmd === " " ? new Date() : moment(detailRes.data.data.pbanYmd,"YYYY-MM-DD").toDate(),
      prdoRccgYmd : detailRes.data.data.prdoRccgYmd === " " ? new Date() : moment(detailRes.data.data.prdoRccgYmd,"YYYY-MM-DD").toDate(),
      rprsCnplCon : isTelFormat(detailRes.data.data.rprsCnplCon)
    }

    let fileArr = []  
    for(let i=0 ; i<res.fileList.length ; i++) {
      const params = {
        id: res.fileList[i].fileId,
        blob: {
          fileId : res.fileList[i].fileId,
          name : res.fileList[i].fileNm,
          path : res.fileList[i].filePath,
          type : res.fileList[i].filePtrn,
          size : res.fileList[i].fileSize,
        }
      }
      fileArr.push(params)
    }
    setFileList(fileArr)
    setInfo(res)
    setDefaultSelectSort({...defaultSelectSort, active : res.fncnBsnsPbanDcd})

    let arr = []
    for(let i=0 ; i<detailRes.data.data.adminFncnBsnsEnlsFild.length ; i++) { 
      const params = {
        ...detailRes.data.data.adminFncnBsnsEnlsFild[i]
        , fncnBsnsEnlsFildNm : ''
      }
      arr.push(params)
    }
    setEnlsFildList(arr)
  }

  useEffect(()=> {
    pageType.current = props.location.state.type
    if(pageType.current === 'write') {
      const item = createEmptyItem()
      let arr = [];
      arr.push(item)
      setEnlsFildList(arr)
    }else {
      loadDetail(props.location.state)
    }
  },[])

  useEffect(() => {
    initDragEvents()

    return () => resetDragEvents()
  }, [initDragEvents, resetDragEvents])

  return (
    <PageLayout currentMenu={'invest'} currentCate={'fncnBsns'}>
      {isOpen.active && (
        <FncnBsnsSelectPop
          {...enlsFildList}
          ref={fncnBsnsSelectRef}
          activeOption={isOpen.active}
          list={enlsFildList}
          idx={idxRef.current}
          close={() => setIsOpen({ ...isOpen , active: false})}
          onComplete={enlsFildSetList}
        />
      )}
      {isAlertOpen.active && (
        <PopupAlert
          msg={isAlertOpen.text}
          handlePopup={() => {
            setIsAlertOpen({ ...isAlertOpen, active: false, text: '' })
            history.push(ROUTER_NAMES.INVEST_FNCN_BSNS_PBAN_LIST)
          }}
        />
      )}
      {validAlertOpen.active && (
        <PopupAlert
          msg={validAlertOpen.text}
          handlePopup={() => {
            setValidAlertOpen({ ...validAlertOpen, active: false, text: '' })
          }}
        />
      )}
      <div className="content_inner page_invest_user page_invest_view">
        <div className="page_header">
          <h4 className="page_title">
            {
              pageType.current === 'write' ? 
                '출자사업 공고 등록' :
                '출자사업 공고 상세'
            }
          </h4>
        </div>
        {/*table_wrap start*/}
        <div className="table_wrap">
          <table className="table form_table bg_none border_none">
            <caption>
              구분, 제목, 출자사업명, 공고일자, 대표 연락처, 내용, 파일첨부, 상태 정보를 나타내는 테이블
            </caption>
            <colgroup>
              <col width={'18%'} />
              <col width={'32%'} />
              <col width={'18%'} />
              <col width={'32%'} />
            </colgroup>
            <tbody>
              <tr>
                <th className={'ta_left'}>
                  <span className="require" aria-label="필수 요소" />
                  구분
                </th>
                <td colSpan={3}>
                  <Select
                    className="select_sort"
                    optionList={defaultSelectSort}
                    handleSelectActive={(selected) => {
                      setDefaultSelectSort({ ...defaultSelectSort, active: selected })
                    }}
                    ref={searchSelectSort}
                  />
                </td>
              </tr>
              <tr>
                <th className={'ta_left'}>
                  <span className="require" aria-label="필수 요소" />
                  제목
                </th>
                <td colSpan={3}>
                  <input
                    name={''}
                    type="text"
                    className="input"
                    title={'제목'}
                    placeholder={'제목을 입력하세요.'}
                    value={info.fncnBsnsPbanTtlNm}
                    onChange={(event) => {setInfo({...info, fncnBsnsPbanTtlNm : event.target.value})}}
                  />
                </td>
              </tr>
              {
                (defaultSelectSort.active === '01') &&
                ((
                  <>
                    <tr>
                      <th className={'ta_left'}>
                        <span className="require" aria-label="필수 요소" />
                        출자사업명
                      </th>
                      <td colSpan={3}>
                        <input
                          name={''}
                          type="text"
                          className="input"
                          title={'출자사업명'}
                          placeholder={'출자사업명을 입력하세요.'}
                          value={info.fncnBsnsNm}
                          onChange={(event) => {setInfo({...info, fncnBsnsNm : event.target.value})}}
                        />
                      </td>
                    </tr>
                    <tr>
                      <th className={'ta_left'}>
                        <span className="require" aria-label="필수 요소" />
                        공고일자
                      </th>
                      <td>
                        <div className="period_calendar">
                          <DatePicker
                            selected={info.pbanYmd ? info.pbanYmd : null}
                            onChange={(currentDate) => onChangeDate(currentDate, 'pbanYmd', null)}
                            locale={ko}
                            dateFormat={'yyyy-MM-dd'}
                            title={'기간조회'}
                          />
                        </div>
                      </td>
                      <th className={'ta_left'}>
                        <span className="require" aria-label="필수 요소" />
                        제안서 접수마감일
                      </th>
                      <td>
                        <div className="period_calendar">
                          <DatePicker
                            selected={info.prdoRccgYmd ? info.prdoRccgYmd : null}
                            onChange={(currentDate) => onChangeDate(currentDate, 'prdoRccgYmd', null)}
                            locale={ko}
                            dateFormat={'yyyy-MM-dd'}
                            title={'기간조회'}
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th className={'ta_left'}>
                        <span className="require" aria-label="필수 요소" />
                        대표 연락처
                      </th>
                      <td colSpan={3}>
                        <input
                          name={'rprsCnplCon'}
                          type="text"
                          className="input"
                          title={'연락처'}
                          placeholder={'연락처을 입력하세요.'}
                          value={info.rprsCnplCon}
                          maxLength={13}
                          onChange={(event) => {
                            const regex = /^[0-9]*$/
                            const num = event.target.value.replace(/-/g, '', '')
                            if(regex.test(num)) {
                              setInfo({...info, rprsCnplCon : isTelFormat(num)})
                            }
                          }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <th className={'ta_left'}>
                        <span className="require" aria-label="필수 요소" />
                        지원분야
                      </th>
                      <td colSpan={3}>
                        <div className="inner_table_wrap">
                          <table className="inner_table">
                            <colgroup>
                              <col width="10%" />
                              <col width="" />
                              <col width="30%" />
                              <col width="20%" />
                              <col width="" />
                            </colgroup>
                            <tbody>
                              <tr>
                                <th scope="col">구분</th>
                                <th scope="col">지원분야</th>
                                <th scope="col">IBK출자금액(억원)</th>
                                <th scope="col">선정운용사수</th>
                                <th scope="col"></th>
                              </tr>
                              {
                                enlsFildList.length > 0 &&
                                  enlsFildList.map((item, idx)=> (
                                  <tr>
                                    <td className="center">{idx+1}</td>
                                    <td>
                                      <div className="td_inner">
                                        <input
                                          name={'fncnBsnsEnlsFildUqnNm'}
                                          type="text"
                                          className="input"
                                          title={'지원분야'}
                                          value={item.fncnBsnsEnlsFildUqnNm}
                                          disabled
                                        />
                                        <Button className="outline_blue" onClick={()=> {openSelectPopup(idx+1)}}>찾기</Button>
                                      </div>
                                    </td>
                                    <td>
                                      <input
                                        name={'orcyFncnAmt'}
                                        type="text"
                                        className="input"
                                        title={'IBK출자금액(억원)'}
                                        value={item.orcyFncnAmt}
                                        onChange={(event) => {
                                          const regex = /^[0-9 ,]*$/
                                          if(regex.test(event.target.value)) {
                                            item.orcyFncnAmt = Number(event.target.value)
                                          }
                                          setIsUpdate(!isUpdate)
                                        }}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        name={'fncnBsnsChcOpcmCnt'}
                                        type="text"
                                        className="input"
                                        title={'선정운용사수'}
                                        value={item.fncnBsnsChcOpcmCnt}
                                        onChange={(event) => {
                                          item.fncnBsnsChcOpcmCnt = event.target.value
                                          setIsUpdate(!isUpdate)
                                        }}
                                      />
                                    </td>
                                    <td>
                                      <button type="button" className="button_add_row" onClick={()=>onClickDelete(item)}>
                                        삭제
                                      </button>
                                    </td>
                                  </tr>
                                ))
                              }
                              <tr>
                                <td className="td_add_row" colSpan={5}>
                                  <button type="button" className="button_add_row" onClick={()=>onClickAdd()}>
                                    행 추가 +
                                  </button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  </>
                ))
              }

              <tr>
                <th className={'ta_left'}>
                  <span className="require" aria-label="필수 요소" />
                  내용
                </th>
                <td colSpan={3}>
                  <textarea className="textarea textarea_h200" 
                    maxLength={'500'} 
                    id="pbanDtlCon" 
                    title="내용" 
                    value={info.pbanDtlCon} 
                    onChange={(event)=>{setInfo({...info, pbanDtlCon : event.target.value})}}
                  />
                </td>
              </tr>

              <tr>
                <th className={'ta_left'}>파일첨부</th>
                <td colSpan={3} ref={dragRef}>
                  {
                    fileList.length > 0 ?
                      fileList.map((file)=> (
                        <>
                          <ul className="fileAttach_list">
                            <li className="fileAttach_item">
                              {file.blob.name}
                              <Button className={'fileAttach_delete_button'} aria-label="삭제" onClick={() => {deleteEtcDoc(file)}}>
                                <DoDisturbOnOutlined />
                              </Button>
                            </li>
                          </ul>
                        </>
                      )):
                    <div className="attach_area">
                      <PlaylistAddIcon color="secondary" />
                      파일을 드래그해서 올려 놓거나, 파일추가를 통해 파일을 등록하세요.
                    </div>
                  }
                  
                  {/* e:: 업로드 후 */}
                  <div className="attach_area_guide">
                    <input 
                      className="fileAttach_input" 
                      type="file" 
                      id="inputFile01" 
                      ref={inputRef}
                      multiple
                      style={{display : 'none'}}
                    />
                    <Button className={'grayLine2'} onClick={handleFiles}>
                      파일첨부
                    </Button>
                    <div className="attach_area_guide_text">
                      <span className="star">*</span> pptx, doc, docx, hwp, pdf 100MB 이내
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th className={'ta_left'}>상태</th>
                <td>
                  <Toggle
                    className="pale_blue"
                    data={{
                      id: `invest_toggle_10`,
                      value: '',
                      status: info.delYn === 'N' ? true : false
                    }}
                    onChange={(e) => {handleToggle(e)}}
                  />
                </td>
              </tr>
              {
                pageType.current !== 'write' &&
                <>
                  <tr>
                    <th className={'ta_left'}>공고코드</th>
                    <td>{info.fncnBsnsPbanNo}</td>
                  </tr>
                  <tr>
                    <th className={'ta_left'}>등록자</th>
                    <td>{info.rgsrNm}</td>
                  </tr>
                  <tr>
                    <th className={'ta_left'}>등록일</th>
                    <td>{info.iibsFrrgTs}</td>
                  </tr>
                </>
              }
            </tbody>
          </table>
        </div>
        {/*table_wrap end*/}
        <div className="rounded_btn_group">
          <Button className={'basic'} onClick={() => {history.push(ROUTER_NAMES.INVEST_FNCN_BSNS_PBAN_LIST, props.location.state.pageNum)}}>
            목록
          </Button>

          <Button className={'full_blue'} onClick={() => {save()}}>
            저장
          </Button>
        </div>
      </div>
    </PageLayout>
  )
}

export default FncnBsnsPbanView
