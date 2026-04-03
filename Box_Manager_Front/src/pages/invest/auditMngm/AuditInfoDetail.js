import Button from 'components/atomic/Button'
import Checkbox from 'components/atomic/Checkbox'
import PageLayout from 'components/PageLayout'
import { useEffect, useState, useRef } from 'react'
import { Link , useHistory} from 'react-router-dom'
import Api from '../../../modules/consts/Api'
import { getConfig, getPostConfig } from '../../../modules/utils/CommonUtils'
import CommonAxios from 'modules/utils/CommonAxios'
import PopupAlert from 'components/PopupAlert'
import PopupConfirm from 'components/PopupConfirm'
import AuditResultPopup from '../../../pageComponents/invest/audit/AuditResultPopup'
import RecomendUpdatePopup from '../../../pageComponents/invest/audit/RecomendUpdatePopup'
import moment from 'moment'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { fileDownload } from 'modules/utils/CommonUtils'

const AuditInfoDetail = (props) => {
  const recomandPopupRef = useRef()
  const history = useHistory()
  const [isOpen, setIsOpen] = useState({
    confirmPop: {
      active: false,
      text: null
    },
    alertPop: {
      active: false,
      text: null,
      type : null
    },
    auditOpenPop: {
      active: false
    },
    recomendPop: {
      active: false
    }
  })

  const [info, setInfo] = useState({
    utlinsttId: '',
    adr: '',
    bnnm : '',
    hmpgUrlAdr: '',
    empCnt: '',
    ttisStcnt: '',
    cpfnAmt: '',
    enprInrdCon: '',
    invmHopeStgNm: '',
    invmHopeAmtNm: '',
    irStchList: [],
    techUtilList: [],
    investList: [],
    rsprNm: '',
    cnpl: '',
    brcd : '',
    brcdNm : '',
    emm: '',
    infotechDoc: [],
    anncDatFileId: '',
    addtDocFileId: '',
    invmExntRqstId: '',
    exntRsltCd: '',
    invmExntPgsgCd: '',
    invmExntPgsgNm: '',
    exntMsgCon : ''
  })

  const [popParams, setPopParams] = useState({
    info : {},
    amnnTs : ''
  })


  const [bsinList, setBsinList] = useState('')
  const [techUtilList, setTechUtilList] = useState('')
  const [bznDoc, setBznDoc] = useState({fileNm : '', fileId : '', check : false, filePtrn: ''})
  const [taxDoc, setTaxDoc] = useState({fileNm : '', fileId : '', check : false})
  const [financialDoc, setFinancialDoc] = useState([])
  const [lawDoc, setLawDoc] = useState([])
  const [vatDoc, setVatDoc] = useState([])
  const [anncDatFile, setAnncDatFile] = useState({fileNm : '', fileId : '', check : false})
  const [addtDocFile, setAddtDocFile] = useState({fileNm : '', fileId : '', check : false})
  const [chk, setChk] = useState([])
  const bnnm = useRef('');
  const amnnUserId = useRef('');

  // 상세 조회
  const searchDetail = async (id) => {
    let res = await CommonAxios(
      'IVT',
      getConfig(Api.invest.auditReceiveDetail + '/' + id, {
        id: id
      })
    )

    if (res !== undefined) {
      res.data.data.bzn = res.data.data.bzn.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3')
      if (res.data.data.bsinList.length > 0) {
        let arr1 = []
        for (let i = 0; i < res.data.data.bsinList.length; i++) {
          arr1.push(res.data.data.bsinList[i].invmFildNm)
        }

        setBsinList(arr1.toString())
      }
      if (res.data.data.techUtilList.length > 0) {
        let arr2 = []
        for (let i = 0; i < res.data.data.techUtilList.length; i++) {
          arr2.push(res.data.data.techUtilList[i].utlzTchnNm)
        }

        setTechUtilList(arr2.toString())
      }

      if(res.data.data.infotechDoc.length > 0) {
        let financialArr = []
        let lawArr = []
        let vatArr = []

        for(let i=0 ; i< res.data.data.infotechDoc.length ; i++) {
          let tmp = res.data.data.infotechDoc[i].fileNm.split('_')
          let obj = {}
          if(res.data.data.infotechDoc[i].fileNm.indexOf('e101') != -1) {
            setBznDoc({fileNm : tmp[0].substring(0,6) + '_' +'사업자등록증명', 
            fileId : res.data.data.infotechDoc[i].fileId 
            ,check : false
            ,filePath : res.data.data.infotechDoc[i].filePath
            ,fileEtns : res.data.data.infotechDoc[i].fileEtns
          })
          }else if(res.data.data.infotechDoc[i].fileNm.indexOf('e103') != -1) {
            setTaxDoc({fileNm : tmp[0].substring(0,6) + '_' +'납세증명', 
            fileId : res.data.data.infotechDoc[i].fileId
            ,check : false
            ,filePath : res.data.data.infotechDoc[i].filePath
            ,fileEtns : res.data.data.infotechDoc[i].fileEtns
          })
          }else if(res.data.data.infotechDoc[i].fileNm.indexOf('e102') != -1) {            
            obj = {fileNm : tmp[1]+ '_' +'표준재무제표증명' 
            ,fileId : res.data.data.infotechDoc[i].fileId 
            ,check : false
            ,fileEtns : res.data.data.infotechDoc[i].fileEtns
            ,filePath : res.data.data.infotechDoc[i].filePath
          }
            financialArr.push(obj)
          }else if(res.data.data.infotechDoc[i].fileNm.indexOf('e105') != -1) {
            obj = {fileNm : tmp[1]+ '_' +'법인세 신고내역' 
            ,fileId : res.data.data.infotechDoc[i].fileId 
            ,check : false
            ,filePath : res.data.data.infotechDoc[i].filePath
            ,fileEtns : res.data.data.infotechDoc[i].fileEtns
          }
            lawArr.push(obj)
          }else if(res.data.data.infotechDoc[i].fileNm.indexOf('e107') != -1) {
            obj = {fileNm : tmp[1]+ '_' +'부가가치세 신고내역' 
            ,fileId : res.data.data.infotechDoc[i].fileId 
            ,check : false
            ,filePath : res.data.data.infotechDoc[i].filePath
            ,fileEtns : res.data.data.infotechDoc[i].fileEtns
          }
            vatArr.push(obj)
          }
        }
        
        setFinancialDoc(financialArr)
        setVatDoc(vatArr)
        setLawDoc(lawArr)
      }

      if(res.data.data.annc !== null) {
        setAnncDatFile({
          fileNm : res.data.data.annc.fileNm
          ,fileId : res.data.data.annc.fileId
          ,check : false
          ,fileEtns : res.data.data.annc.fileEtns
        })  
      }

      if(res.data.data.addt !== null) {
        setAddtDocFile({
          fileNm : res.data.data.addt.fileNm
          ,fileId : res.data.data.addt.fileId
          ,check : false
          ,fileEtns : res.data.data.addt.fileEtns
        })  
      }
      return res.data.data
    }
  }

  // 심사결과 팝업 호출
  const openAuditResPop = () => {
    setIsOpen({ ...isOpen, 
      confirmPop : {active: false, text: '' }, 
      auditOpenPop : {active: true }})
  }

  // 알림 팝업 호출
  const isOpenPopCheck = (gubun) => {
    if (gubun === 'alert') {
      setIsOpen({ ...isOpen, alertPop: { active: true, text: '이미 심사가 완료된 건입니다.' } })
    } else if (gubun === 'confirm') {
      setIsOpen({ ...isOpen, confirmPop: { active: true, text: '심사완료로 상태를 변경하시겠습니까?', type: 'auditResult' } })
    }else if(gubun === 'confirm2') {
      setIsOpen({...isOpen, confirmPop : {active: true, text: '심사중으로 상태를 변경하시겠습니까?' , type: 'insertAudit'}})
    } else if (gubun === 'recomend') {
      setIsOpen({ ...isOpen, recomendPop: { active: true } })
    } else if(gubun === 'clear') {
      setIsOpen({ ...isOpen, confirmPop: { active: true, text: '초기화 하시겠습니까?', type: 'rcmdClear' } })
    } else if(gubun === 'insert') {
      setIsOpen({...isOpen, confirmPop : {active: true, text: '접수하시겠습니까?' , type: 'insertAudit'}})
    }
  }

  /** 금액 숫자 콤마 */
  const handleCommaNum = (val) => {
    if(val !== 0 && val !== null) {
      const num = val.toString().replace(/,/g, '', '')
      return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }

  /** 추천영업점 및 직원 초기화 */
  const clearRcmd = async() => {
    setIsOpen({ ...isOpen, 
      confirmPop : {active: false, text: '', type: null }})

    const params = {
      ...info,
      brcd : null,
      emm: null,
      emn: null,
    }
    const res = await CommonAxios('IVT', getPostConfig(Api.invest.updateRecommendPop, params))

    if(res.data.code === '200') {
      window.location.reload()
    }
  }

  /**
   * 체크박스 전체선택
   */
  const handleCheckBoxAll = (e)=> {
    
    let obj = {}
    let finArr = []
    let lawArr = []
    let vatArr = []
    if(e.target.checked === true) {
      if(bznDoc.fileNm !== '') {
        setBznDoc({...bznDoc, check : true})
      }
      if(taxDoc.fileNm !== '') {
        setTaxDoc({...taxDoc, check : true})
      }
      if(anncDatFile.fileNm !== '') {
        setAnncDatFile({...anncDatFile, check : true})
      }
      if(addtDocFile.fileNm !== '') {
        setAddtDocFile({...addtDocFile, check : true})
      }
      if(financialDoc !== null) {
        financialDoc.forEach((item)=> {
          obj = {
            fileNm : item.fileNm,
            fileId : item.fileId,
            check : true
          }
          finArr.push(obj)
        })
      }

      if(lawDoc !== null) {
        lawDoc.forEach((item)=> {
          obj = {
            fileNm : item.fileNm,
            fileId : item.fileId,
            check : true
          }
          lawArr.push(obj)
        })

      }

      if(vatDoc !== null) {
        vatDoc.forEach((item)=> {
          obj = {
            fileNm : item.fileNm,
            fileId : item.fileId,
            check : true
          }
          vatArr.push(obj)
        })
      }

      setVatDoc(vatArr)
      setFinancialDoc(finArr)
      setLawDoc(lawArr)
    }else {
      
      setBznDoc({...bznDoc, check : false})
      setTaxDoc({...taxDoc, check : false})
      setAnncDatFile({...anncDatFile, check : false})
      setAddtDocFile({...addtDocFile, check : false})
      financialDoc.forEach((item)=> {
        obj = {
          fileNm : item.fileNm,
          fileId : item.fileId,
          check : false
        }
        finArr.push(obj)
      })

      lawDoc.forEach((item)=> {
        obj = {
          fileNm : item.fileNm,
          fileId : item.fileId,
          check : false
        }
        lawArr.push(obj)
      })

      vatDoc.forEach((item)=> {
        obj = {
          fileNm : item.fileNm,
          fileId : item.fileId,
          check : false
        }
        vatArr.push(obj)
      })
      setVatDoc(vatArr)
      setFinancialDoc(finArr)
      setLawDoc(lawArr)
    }
  }

  /**
   * 파일 선택 다운로드
   */
  const selectFileDownload = async()=> {
    let arr = []

    if(bznDoc.check === true) {
      arr.push(bznDoc)
    }
    if(taxDoc.check === true) {
      arr.push(taxDoc)
    }
    if(anncDatFile.check === true) {
      arr.push(anncDatFile)
    }
    if(addtDocFile.check === true) {
      arr.push(addtDocFile)
    }
    financialDoc.forEach((item)=> {
      if(item.check === true) {
        arr.push(item)
      }
    })

    lawDoc.forEach((item)=> {
      if(item.check === true) {
        arr.push(item)
      }
    })

    vatDoc.forEach((item)=> {
      if(item.check === true) {
        arr.push(item)
      }
    })
    console.log("arr = ", arr)
    if(arr.length > 0) {
      const res = await CommonAxios('IVT', getPostConfig(Api.invest.auditFileDownload, arr))
      if (res) {
        const params = {
          fileId : res.data.data,
          fileNm : bnnm.current + "_투자심사 검토결과"
        }
  
        await fileDownload(params)
      }
    }else {
      setIsOpen({ ...isOpen, alertPop: { active: true, text : '선택된 첨부 파일이 없습니다.' } })
    }
  }

  // 인쇄버튼 클릭
  const handlePrintBtn = ()=> {
    let initBody = document.body
    let hiddenBtn1 = document.querySelector('.rounded_btn_group')
    let hiddenBtn2 = document.querySelector('.download_buttonArea')
    let hiddenLnb = document.querySelector('.lnb_wrap')
    let hiddenHeader = document.querySelector('.header_wrap')
    let hiddenBread = document.querySelector('.breadcrumb_list')

    window.onbeforeprint = ()=> {
      hiddenBtn1.style.display = 'none'
      hiddenBtn2.style.display = 'none'
      hiddenLnb.style.display = 'none'
      hiddenHeader.style.display = 'none'
      hiddenBread.style.display = 'none'

      document.body = document.querySelector('.content_inner page_main')
    }

    window.onafterprint = ()=> {
      hiddenBtn1.style.display = ''
      hiddenBtn2.style.display = ''
      hiddenLnb.style.display = ''
      hiddenHeader.style.display = ''
      hiddenBread.style.display = ''

      document.body = initBody
    }

    window.print();
  }

  // 접수 버튼 클릭 시 심사중 상태로 변경
  const insertAuditFunc = async()=> {
    setIsOpen({ ...isOpen, 
      confirmPop : {active: false, text: '' }})

    const res = await CommonAxios('IVT', getPostConfig(Api.invest.auditEvaluateProgress,info))
    
    if(res.data.code === '200'){
      window.location.reload()
    }
  }

  useEffect(async () => {
    const detailRes = await searchDetail(props.match.params.id)
    bnnm.current = detailRes.bnnm
    amnnUserId.current = detailRes.rgsnUserId
    setPopParams({...popParams, info: detailRes, amnnTs : detailRes.amnnTs})
    setInfo(detailRes)
  }, [])

  return (
    <PageLayout currentMenu={'invest'} currentCate={'auditMngm'} currentPage={'auditInfoList'}>
      <div className="content_inner page_main">
        <div className="page_header">
          <h4 className="page_title">신청상세내역</h4>
        </div>
        <div className="invest_content_wrap">
          <div className={'maximum_notice'}>
            <p className="highlight_grey">
              투자유치를 희망하는 기업의 신청 상세 내역입니다. 스탭을 클릭해 상태를 변경할 수 있습니다.
            </p>
          </div>
          {/* 상태에 따라 step 에 step01, step02 클래스 추가됨 */}
          {/* <div className="step">
            <ul>
              <li className="step_item">
                <Link to={'#'}>
                  <span>신청</span>
                </Link>
              </li>
              <li className="step_item">
                <Link to={'#'}>
                  <span>심사중</span>
                </Link>
              </li>
              <li className="step_item">
                <Link to={'#'}>
                  <span>심사완료</span>
                </Link>
              </li>
            </ul>
          </div> */}
          {/* CASE 01:  step01 */}
          {(info.invmExntPgsgCd === 'EXN00001' 
          || info.invmExntPgsgCd === 'EXN00000') && (
            <div className="step step01">
              <ul>
                <li className="step_item">
                  <Link to={'#'}>
                    <span>신청</span>
                  </Link>
                </li>
                <li className="step_item">
                  <a
                    onClick={() => isOpenPopCheck('confirm2')}
                    style={{
                      cursor: 'pointer'
                    }}
                  >
                    <span>심사중</span>
                  </a>
                </li>
                <li className="step_item">
                  <Link to={'#'}>
                    <span>심사완료</span>
                  </Link>
                </li>
              </ul>
            </div>
          )}

          {/* CASE 02:  step02 */}
          {info.invmExntPgsgCd === 'EXN00002' && (
            <div className="step step02">
              <ul>
                <li className="step_item">
                  <a>
                    <span>신청</span>
                  </a>
                </li>
                <li className="step_item">
                  <a>
                    <span>심사중</span>
                  </a>
                </li>
                <li className="step_item">
                  <a
                    onClick={() => isOpenPopCheck('confirm')}
                    style={{
                      cursor: 'pointer'
                    }}
                  >
                    <span>심사완료</span>
                  </a>
                </li>
              </ul>
            </div>
          )}

          {/* CASE 03:  step03 */}
          {info.invmExntPgsgCd === 'EXN00003' && (
            <div className="step step03">
              <ul>
                <li className="step_item">
                  <Link onClick={() => isOpenPopCheck('alert')}>
                    <span>신청</span>
                  </Link>
                </li>
                <li className="step_item">
                  <Link onClick={() => isOpenPopCheck('alert')}>
                    <span>심사중</span>
                  </Link>
                </li>
                <li className="step_item">
                  <Link onClick={() => isOpenPopCheck('alert')}>
                    <span>심사완료</span>
                  </Link>
                </li>
              </ul>
            </div>
          )}

          {isOpen.alertPop.active && (
            <PopupAlert
              msg={isOpen.alertPop.text}
              handlePopup={() => setIsOpen({ ...isOpen, alertPop: { active: false } })}
            />
          )}
          {isOpen.confirmPop.active && (
            <PopupConfirm msg={isOpen.confirmPop.text}>
              <Button
                className={'full_grey_dark'}
                onClick={() => setIsOpen({ ...isOpen, confirmPop: { active: false } })}
              >
                취소
              </Button>
              <Button className={'full_blue'} onClick={() => {
                if(isOpen.confirmPop.type === 'auditResult') {
                  openAuditResPop()
                }else if(isOpen.confirmPop.type === 'insertAudit') {
                  insertAuditFunc()
                }else {
                  clearRcmd()
                }
              }}>
                확인
              </Button>
            </PopupConfirm>
          )}
          {isOpen.auditOpenPop.active && (
            <AuditResultPopup
              amnnTs={info.amnnTs}
              activeOption={isOpen.auditOpenPop.active}
              params={popParams}
              close={() => setIsOpen({ ...isOpen, auditOpenPop: { active: false } })}
            />
          )}

          {isOpen.recomendPop.active && (
            <RecomendUpdatePopup
              ref={recomandPopupRef}
              invmExntRqstId={info.invmExntRqstId}
              activeOption={isOpen.recomendPop.active}
              amnnUserId={amnnUserId.current}
              close={() => setIsOpen({ ...isOpen, recomendPop: { active: false } })}
            />
          )}

          {/*table_wrap start*/}
          <h4 className="table_invest_title">기업프로필</h4>
          <div className="invest_table_wrap">
            <table className="table_invest_coporation">
              <caption>기업명, 사업자등록번호, 업종코드, 주소, 기업소개 등 정보 테이블</caption>
              <colgroup>
                <col width={'20%'} />
                <col width={'30%'} />
                <col width={'20%'} />
                <col width={'30%'} />
              </colgroup>
              <tbody>
                <tr>
                  <th>기업명</th>
                  <td>{info.bnnm}</td>
                  <th>사업자등록번호</th>
                  <td>{info.bzn}</td>
                </tr>
                <tr>
                  <th>업종코드</th>
                  <td>{info.mainBizCd}</td>
                  <th>업종</th>
                  <td>{info.mainBizCdNm}</td>
                </tr>

                <tr>
                  <th>주소</th>
                  <td colSpan={3}>{info.adr}</td>
                </tr>

                <tr>
                  <th>기업소개</th>
                  <td colSpan={3}>{info.enprInrdCon}</td>
                </tr>

                <tr>
                  <th>비즈니스 분야</th>
                  <td>{bsinList}</td>
                  <th>활용기술</th>
                  <td>{techUtilList}</td>
                </tr>

                <tr>
                  <th>홈페이지</th>
                  <td>
                    <a href={'https://' +info.hmpgUrlAdr} target={'_blank'} rel="noreferrer" style={{textDecoration : 'underline'}}>{info.hmpgUrlAdr}</a>
                  </td>
                  <th>직원수</th>
                  <td>{info.empCnt !== 0 ? info.empCnt : 0}명</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="table_invest_title_small">주식정보</h3>
          <div className="invest_table_wrap">
            <table className="table_invest_coporation">
              <caption>총발행주식수, 자본금 등 정보 테이블</caption>
              <colgroup>
                <col width={'20%'} />
                <col width={'30%'} />
                <col width={'20%'} />
                <col width={'30%'} />
              </colgroup>
              <tbody>
                <tr>
                  <th>총발행주식수</th>
                  <td>{info.ttisStcnt !== 0 ? handleCommaNum(info.ttisStcnt) : 0}주</td>
                  <th>자본금</th>
                  <td>{info.cpfnAmt !== 0 ? handleCommaNum(info.cpfnAmt) : 0}원</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="table_invest_title_small">주주정보</h3>
          <div className="invest_table_wrap">
            <table className="table_invest_coporation table_center">
              <caption>주주명, 생년월일,보유주식수, 보유비율 정보 테이블</caption>
              <colgroup>
                <col width={'19%'} />
                <col width={'27%'} />
                <col width={'27%'} />
                <col width={'27%'} />
              </colgroup>
              <thead>
                <tr>
                  <th>순번</th>
                  <th>주주명</th>
                  <th>보유주식수</th>
                  <th>보유비율</th>
                </tr>
              </thead>
              <tbody>
                {info.irStchList?.length > 0 ? (
                  info?.irStchList?.map((item) => (
                    <tr>
                      <td>{item.stchSqn !== null ? item.stchSqn : '-'}</td>
                      <td>{item.stchNm !== null ? item.stchNm : '-'}</td>
                      <td>{item.cmscHoldCnt !== 0 ? handleCommaNum(item.cmscHoldCnt) : 0}주</td>
                      <td>{item.prra !== 0 ? item.prra : 0}%</td>
                    </tr>
                  ))
                ) : (
                  <></>
                )}
              </tbody>
            </table>
          </div>

          <h4 className="table_space_title">투자정보</h4>
          <div className="invest_table_wrap">
            <table className="table_invest_coporation">
              <caption>희망기관, 희망 투자 단계, 희망 유치 금액 정보 테이블</caption>
              <colgroup>
                <col width={'20%'} />
                <col width={'30%'} />
              </colgroup>
              <tbody>
                <tr>
                  <th>희망 투자 단계</th>
                  <td>{info.invmHopeStgNm}</td>
                  <th>희망 유치 금액</th>
                  <td colSpan={3}>{info.invmHopeAmtNm}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="table_invest_title_small">기존 투자 유치 정보</h3>
          <div className="invest_table_wrap">
            <table className="table_invest_coporation table_center">
              <caption>투자일자, 투자기관, 투자액, 기업가치, 투자단계 정보 테이블</caption>
              <colgroup>
                <col width={'20%'} />
                <col width={'20%'} />
                <col width={'20%'} />
                <col width={'20%'} />
                <col width={'20%'} />
              </colgroup>
              <thead>
                <tr>
                  <th>투자일자</th>
                  <th>투자기관</th>
                  <th>투자액</th>
                  <th>기업가치</th>
                  <th>투자단계</th>
                </tr>
              </thead>
              <tbody>
                {info?.investList?.length > 0 ? (
                  info?.investList?.map((item) => (
                    <tr>
                      <td>{moment(item.invtDtlsInvtDe).format('YYYY-MM-DD')}</td>
                      <td>{item.invtDtlsInvtInstt}</td>
                      <td>{item.invtDtlsInvtAmount !== 0 ? handleCommaNum(item.invtDtlsInvtAmount) : 0}원</td>
                      <td>{item.invtDtlsEtvlAmt !== 0 ? handleCommaNum(item.invtDtlsEtvlAmt) : 0}원</td>
                      <td>{item.invtDtlsInvtPnttm}</td>
                    </tr>
                  ))
                ) : (
                  <></>
                )}
              </tbody>
            </table>
          </div>

          <h3 className="table_invest_title_small">제출서류</h3>
          <Checkbox
            className="check_all_document"
            checkbox={{ id: 'check_table_all', value: '전체', status: true }}
            onChange={(e) => {
              handleCheckBoxAll(e)
            }}
          />
          <div className="invest_table_wrap">
            <table className="table_invest_coporation table_document">
              <caption>IR 자료, 법인등기부등본, 사업자등록증명 등 기타 서류 정보 테이블</caption>
              <colgroup>
                <col width={'15%'} />
                <col width={'35%'} />
                <col width={'15%'} />
                <col width={'35%'} />
              </colgroup>
              <tbody>
                <tr>
                  <th>추가자료</th>
                  <td>
                    {anncDatFile.fileNm !== '' ? (
                      <Checkbox
                        checkbox={{ id: 'check_annc', value: anncDatFile.fileNm, status: true }}
                        onChange={(e) => {
                          setAnncDatFile({ ...anncDatFile, check: e.target.checked })
                        }}
                        checked={anncDatFile.check === true}
                      />
                    ) : (
                      <></>
                    )}
                  </td>
                  <th>기타자료</th>
                  <td>
                    {addtDocFile.fileNm !== '' ? (
                      <Checkbox
                        checkbox={{ id: 'check_addt', value: addtDocFile.fileNm, status: true }}
                        onChange={(e) => {
                          setAddtDocFile({ ...addtDocFile, check: e.target.checked })
                        }}
                        checked={addtDocFile.check === true}
                      />
                    ) : (
                      <></>
                    )}
                  </td>
                </tr>

                <tr>
                  <th>사업자등록증명</th>
                  <td>
                    {
                      bznDoc.fileNm !== "" ? 
                      <Checkbox
                        checkbox={{ id: bznDoc.fileId, value: bznDoc.fileNm, status: true }}
                        onChange={(e) => {
                          setBznDoc({ ...bznDoc, check: e.target.checked })
                        }}
                        checked={bznDoc.check === true}
                      />
                      : <></>
                    }
                  </td>
                  <th>표준재무제표증명</th>
                  <td>
                    {financialDoc?.length > 0 ? (
                      financialDoc.map((item, i) => (
                        <Checkbox
                          checkbox={{ id: item.fileId, value: item.fileNm, status: true }}
                          onChange={(e) => {
                            item.check = e.target.checked
                            setChk(item)
                          }}
                          checked={item.check === true}
                        />
                      ))
                    ) : (
                      <></>
                    )}
                  </td>
                </tr>

                <tr>
                  <th>납세증명</th>
                  <td>
                    {
                      taxDoc.fileNm !== "" ? 
                      <Checkbox
                        checkbox={{ id: taxDoc.fileId, value: taxDoc.fileNm, status: true }}
                        onChange={(e) => {
                          setTaxDoc({ ...taxDoc, check: e.target.checked })
                        }}
                        checked={taxDoc.check === true}
                      /> : 
                      <></>
                    }
                  </td>

                  <th>부가가치세 신고내역</th>
                  <td>
                    {vatDoc?.length > 0 ? (
                      vatDoc?.map((item, i) => (
                        <Checkbox
                          checkbox={{ id: item.fileId, value: item.fileNm, status: true }}
                          onChange={(e) => {
                            item.check = e.target.checked
                            setChk(item)
                          }}
                          checked={item.check === true}
                        />
                      ))
                    ) : (
                      <></>
                    )}
                  </td>
                </tr>

                <tr>
                  <th>법인세 신고내역</th>
                  <td>
                    {lawDoc?.length > 0 ? (
                      lawDoc?.map((item, i) => (
                        <Checkbox
                          checkbox={{ id: item.fileId, value: item.fileNm, status: true }}
                          onChange={(e) => {
                            item.check = e.target.checked
                            setChk(item)
                          }}
                          checked={item.check === true}
                        />
                      ))
                    ) : (
                      <></>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="download_buttonArea">
              <Button
                className={'file_download_button grayLine'}
                onClick={() => {
                  selectFileDownload()
                }}
              >
                선택 다운로드
              </Button>
            </div>
          </div>

          <div className="invest_table_wrap">
            <table className="table_invest_coporation">
              <caption>담당자명, 연락처, 부서, 진행 안내 채널 정보테이블</caption>
              <colgroup>
                <col width={'15%'} />
                <col width={'35%'} />
              </colgroup>
              <tbody>
                <tr>
                  <th>담당자명</th>
                  <td>{info.userNm}</td>
                  <th>연락처</th>
                  <td>{info.moblphonNo}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="invest_table_wrap">
            <table className="table_invest_coporation">
              <caption>추천 영업점, 추천 직원 정보테이블</caption>
              <colgroup>
                <col width={'15%'} />
                <col width={'35%'} />
                <col width={'15%'} />
                <col width={'35%'} />
              </colgroup>
              <tbody>
                <tr>
                  <th>추천 영업점</th>
                  <td>
                    {info.brcdNm}{info.brcd !== null ? "("+info.brcd+")" : ""}
                    <Button
                      className={'graySmallButton'}
                      onClick={() => {
                        setIsOpen({ ...isOpen, recomendPop: { active: true } })
                      }}
                    >
                      수정
                    </Button>
                    <Button className={'graySmallButton'} onClick={() => {isOpenPopCheck('clear')}}>
                      초기화
                    </Button>
                  </td>
                  <th>추천 직원</th>
                  <td>
                    {info.emm}{info.emn !== null ? "("+info.emn+")" : ""}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="download_buttonArea">
              <Button
                className={'grayLine'}
                onClick={() => {
                  handlePrintBtn()
                }}
              >
                인쇄
              </Button>
            </div>
          </div>

          <div className="rounded_btn_group">
            { (info.invmExntPgsgCd === 'EXN00001' || info.invmExntPgsgCd === 'EXN00000') &&
              <Button className={'btn_download basic'} onClick={() => {isOpenPopCheck('insert')}}>
                접수
              </Button>
            }
            <Button className={'btn_download basic'} onClick={() => {history.push(ROUTER_NAMES.INVEST_AUDIT_INFO_LIST, props.location.state)}}>
              목록
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default AuditInfoDetail
