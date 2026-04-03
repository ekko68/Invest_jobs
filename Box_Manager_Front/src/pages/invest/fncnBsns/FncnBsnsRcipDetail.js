import { useEffect, useRef, useState, useContext, useLayoutEffect } from 'react'
import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import PopupConfirm from 'components/PopupConfirm'
import Select from 'components/atomic/Select'
import { FileDownloadOutlined, DoDisturbOnOutlined } from '@mui/icons-material'
import CommonAxios from 'modules/utils/CommonAxios'
import Api from 'modules/consts/Api'
import { fileDownload, getConfig, getPostConfig } from 'modules/utils/CommonUtils'
import moment from 'moment'
import { createKey } from 'modules/fns/commonFn'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { useHistory } from 'react-router-dom'
import PopupAlert from 'components/PopupAlert'

const FncnBsnsRcipDetail = (props) => {
    const history = useHistory()
    const [isAlertOpen, setIsAlertOpen] = useState({
        active : false,
        text : ''
    })
    const [validAlertOpen, setValidAlertOpen] = useState({
      active : false,
      text : ''
    })

    const [defaultSelect,setDefaultSelect] = useState({
    active: '',
    list: [
        { id: '2', value: 'selectCompRegi', label: '접수완료' },
        { id: '4', value: 'searchReview', label: '심사중' },
        { id: '5', value: 'selectCompExam', label: '심사완료' }
    ]})
    const [disabledSelect,setDisabledSelect] = useState({
        active: '3',
        list: [
            { id: '3', value: 'cancel', label: '접수취소' , disabled : true},
        ]})
    const searchSelectSort = useRef(null)
    const [info, setInfo] = useState({
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
        adminFncnBsnsJntOpcm : [],
        adminFncnBsnsInvv : [],
        adminFncnBsnsEnls : [],
        adminFncnBsnsPmgl : [],
        adminFncnBsnsChcPrnl : [],
        fileList : []
    })

    // 상세화면 조회
    const loadDetail = async(state)=> {
        // 조회
        const detailRes = await CommonAxios('IVT', getConfig(Api.invest.fncnBsnsRcipDetail + '/' + state.data.fncnBsnsRcipNo), false);

        const res = {...detailRes.data.data,
            rprsCnplCon : isTelFormat(String(detailRes.data.data.rprsCnplCon))
        }
        setInfo(res)
        setDefaultSelect({...defaultSelect, active : res.fncnBsnsPgrsScd})

    }

    // 상태 셀렉트박스
    const onSelectActive = (selected) => {
        setDefaultSelect({ ...defaultSelect, active: selected })
        setInfo({...info, 
            fncnBsnsPgrsScd : selected
        })
    }

    // 정규표현식을 사용하여 사업자번호 형식에 맞게 변환
    const formatBusinessNumber = (businessNumber) => {
        const formattedNumber = String(businessNumber).replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3')
        return formattedNumber
    }

    // /* 휴대폰 formating function */
    const isTelFormat = (tel) => {
        if (tel.length === 2) {
        return tel.replace(/(\d{2})/, '$1-')
        }else if (tel.length === 3) {
        return tel.replace(/(\d{3})/, '$1-')
        } else if (tel.length === 7) {
        return tel.replace(/(\d{3})(\d{4})/, '$1-$2')
        } else if (tel.length === 9) {
        //00-000-0000
        return tel.replace(/^(\d{0,2})(\d{0,3})(\d{0,4})$/g, '$1-$2-$3')
        } else if (tel.length === 10) {
        //00-0000-0000
        return tel.replace(/^(\d{0,2})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
        } else if (tel.length === 11) {
        //000-0000-0000
        return tel.replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
        }
        return tel
    }

    // 파일 다운로드
    const clickFileDownload = async(params)=> {
        await fileDownload(params)
    }

    // 저장
    const save = async()=> {
        // 저장
        const saveRes = await CommonAxios('IVT', getPostConfig(Api.invest.fncnBsnsRcipStateUpd, info));
        if(saveRes.data.code === '200') {
          setIsAlertOpen({ ...isAlertOpen, active: true, text: '저장되었습니다.' })
        }else {
          setValidAlertOpen({ ...isAlertOpen, active: true, text: saveRes.data.message })
        }
    }

    useEffect(()=> {
        loadDetail(props.location.state)
    },[])

  return (
    <PageLayout currentMenu={'invest'} currentCate={'fncnBsns'}>
      {isAlertOpen.active && (
        <PopupAlert
          msg={isAlertOpen.text}
          handlePopup={() => {
            setIsAlertOpen({ ...isAlertOpen, active: false, text: '' })
            history.push(ROUTER_NAMES.INVEST_FNCN_BSNS_RCIP_LIST)
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
          <h4 className="page_title">출자사업 접수현황 상세</h4>
        </div>
        <div className="section_header mb_none">
          <p className="section_title">출자사업 개요</p>
        </div>
        <div className="table_wrap">
          <table className="table form_table">
            <caption>출자사업명, 공고일자 를 나타내는 테이블</caption>
            <colgroup>
              <col width={'18%'} />
              <col width={'32%'} />
              <col width={'18%'} />
              <col width={'32%'} />
            </colgroup>
            <tbody>
              <tr>
                <th className={'ta_left'}>출자사업명</th>
                <td>{info.fncnBsnsPbanTtlNm}</td>
                <th className={'ta_left'}>공고일자</th>
                <td>{moment(info.pbanYmd).format('YYYY-MM-DD')}</td>
              </tr>
            </tbody>
          </table>
          <div className="section_header mb_none">
            <p className="section_title">운용사 정보</p>
          </div>
          <table className="table form_table">
            <caption>
              운영사명, 대표자명, 설립일자, 회사형태, 사업자등록번호,담당자,연락처, 공동GP여부, 공동GP정보 등 정보
              테이블
            </caption>
            <colgroup>
              <col width={'18%'} />
              <col width={'32%'} />
              <col width={'18%'} />
              <col width={'32%'} />
            </colgroup>
            <tbody>
              <tr>
                <th className={'ta_left'}>운용사명</th>
                <td>{info.opcmNm}</td>
                <th className={'ta_left'}>대표자명</th>
                <td>{info.opcmRpprNm}</td>
              </tr>
              <tr>
                <th className={'ta_left'}>설립일자</th>
                <td>{moment(info.opcmIncrYmd).format('YYYY-MM-DD')}</td>
                <th className={'ta_left'}>회사형태</th>
                <td>
                    {
                        (info.opcmLicsKcd === '1') && (('창업투자회사')) ||
                        (info.opcmLicsKcd === '2') && (('신기술사업금융업자')) ||
                        (info.opcmLicsKcd === '3') && (('LLC')) ||
                        (info.opcmLicsKcd === '4') && (('창업기획자(AC)')) ||
                        (info.opcmLicsKcd === '5') && (('자산운용사')) ||
                        (info.opcmLicsKcd === '6') && (('사모집합투자기구운용사')) ||
                        (info.opcmLicsKcd === '7') && (('기타'))
                    }
                </td>
              </tr>
              <tr>
                <th className={'ta_left'}>사업자등록번호</th>
                <td>{formatBusinessNumber(info.opcmBzn)}</td>
                <th className={'ta_left'}>담당자</th>
                <td>{info.opcmRsprNm}</td>
              </tr>
              <tr>
                <th className={'ta_left'}>연락처</th>
                <td>{isTelFormat(String(info.opcmCnplCon))}</td>
                <th className={'ta_left'}>이메일</th>
                <td>{info.opcmEad}</td>
              </tr>
              <tr>
                <th className={'ta_left'}>공동GP여부</th>
                <td colSpan={3}>{info.jntOpcmYn}</td>
              </tr>
              {
                info.jntOpcmYn === 'Y' &&
                <tr>
                  <th className={'ta_left'}>공동GP정보</th>
                  <td colSpan={3}>
                    <div className="inner_table_wrap">
                      <table className="inner_table">
                        <colgroup>
                          <col width="" />
                          <col width="" />
                          <col width="" />
                          <col width="" />
                          <col width="" />
                          <col width="" />
                          <col width="" />
                        </colgroup>
                        <tbody>
                          <tr>
                            <th scope="col">공동GP명</th>
                            <th scope="col">대표자명</th>
                            <th scope="col">설립일자</th>
                            <th scope="col">사업자등록번호</th>
                            <th scope="col">담당자</th>
                            <th scope="col">연락처</th>
                            <th scope="col">이메일</th>
                          </tr>
                          {
                              info.adminFncnBsnsJntOpcm.map((item)=> (
                                  <tr key={createKey()}>
                                      <td className="center">{item.opcmNm}</td>
                                      <td className="center">{item.opcmRpprNm}</td>
                                      <td className="center">{moment(item.opcmIncrYmd).format('YYYY-MM-DD')}</td>
                                      <td className="center">{formatBusinessNumber(item.opcmBzn)}</td>
                                      <td className="center">{item.opcmRsprNm}</td>
                                      <td className="center">{isTelFormat(String(item.cnplCon))}</td>
                                      <td className="center">{item.emlCon}</td>
                                  </tr>
                              ))
                          }
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
          <div className="section_header mb_none">
            <p className="section_title">출자제안서 정보</p>
          </div>
          <table className="table form_table">
            <caption>
              지원분야, 조합명, 펀드구분, 회사형태, IBK출자요청액 ,펀드결성규모,존속기간, 출자금 납부방식,
              기준수익률,관리보수,성과보수 , 펀드참여인력, 출자자 모집현황, 주목적 추가항목, 선정우대 항목 등 정보
              테이블
            </caption>
            <colgroup>
              <col width={'18%'} />
              <col width={'32%'} />
              <col width={'18%'} />
              <col width={'32%'} />
            </colgroup>
            <tbody>
              <tr>
                <th className={'ta_left'}>지원분야</th>
                <td colSpan={3}>{info.fncnBsnsEnlsFildUqnNm}</td>
              </tr>
              <tr>
                <th className={'ta_left'}>조합명</th>
                <td>{info.fundNm}</td>
                <th className={'ta_left'}>펀드구분</th>
                <td>
                    {
                        (info.fncnBsnsCprtDcd === '1') &&(('벤처투자조합')) || 
                        (info.fncnBsnsCprtDcd === '2') &&(('신기술사업투자조합')) || 
                        (info.fncnBsnsCprtDcd === '3') &&(('기관전용PEF')) || 
                        (info.fncnBsnsCprtDcd === '4') &&(('기타')) 
                        }
                </td>
              </tr>
              <tr>
                <th className={'ta_left'}>IBK출자요청액(억원)</th>
                <td>{info.ibkFncnRqstAmt}</td>
                <th className={'ta_left'}>펀드결성규모(억원)</th>
                <td>{info.fundOrgzScdlAmt}</td>
              </tr>
              <tr>
                <th className={'ta_left'}>존속기간(년)</th>
                <td>{info.fundAsceTrm}</td>
                <th className={'ta_left'}>출자금 납부방식</th>
                <td>
                    {
                        (info.fnmnPmntMcd === '1') && (('일시납')) ||
                        (info.fnmnPmntMcd === '2') && (('수시납')) ||
                        (info.fnmnPmntMcd === '3') && (('분할납'))
                    }
                </td>
              </tr>
              <tr>
                <th className={'ta_left'}>기준수익률(%)</th>
                <td>{info.baseEnrtCon}</td>
                <th className={'ta_left'}>관리보수(%)</th>
                <td>{info.mnrmCon}</td>
              </tr>
              <tr>
                <th className={'ta_left'}>성과보수(%)</th>
                <td colSpan={3}>{info.otcmRmnrCon}</td>
              </tr>
              <tr>
                <th className={'ta_left'}>펀드참여인력</th>
                <td colSpan={3}>
                  <div className="inner_table_wrap">
                    <table className="inner_table">
                      <colgroup>
                        <col width="" />
                        <col width="" />
                        <col width="" />
                        <col width="" />
                        <col width="" />
                        <col width="" />
                        <col width="" />
                      </colgroup>
                      <tbody>
                        <tr>
                          <th scope="col">공동GP명</th>
                          <th scope="col">인력구분</th>
                          <th scope="col">이름</th>
                          <th scope="col">투자 경력(년)</th>
                          <th scope="col">회사번호</th>
                          <th scope="col">휴대폰번호</th>
                          <th scope="col">이메일주소</th>
                        </tr>
                        {
                          info.adminFncnBsnsInvv.map((item)=> (
                            <tr key={createKey()}>
                              <td>{item.opcmNm}</td>
                              <td>
                                {
                                  (item.opcmHmrsDcd === '1') && (('대표펀드매니저')) ||
                                  (item.opcmHmrsDcd === '2') && (('핵심운용인력'))
                                }
                                </td>
                              <td>{item.opcmHmrsNm}</td>
                              <td>{item.opcmHmrsCrrNyy}</td>
                              <td>{isTelFormat(String(item.opcmCmpnTpn))}</td>
                              <td>{isTelFormat(String(item.opcmRsprCpn))}</td>
                              <td>{item.opcmEad}</td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
              <tr>
                <th className={'ta_left'}>
                  출자자 모집현황
                  <br />
                  (GP포함)
                </th>
                <td colSpan={3}>
                  <div className="inner_table_wrap">
                    <table className="inner_table">
                      <colgroup>
                        <col width="" />
                        <col width="" />
                        <col width="" />
                        <col width="" />
                      </colgroup>
                      <tbody>
                        <tr>
                          <th scope="col">GP명</th>
                          <th scope="col">발급기관명</th>
                          <th scope="col">진행단계</th>
                          <th scope="col">출자금액(억원)</th>
                        </tr>
                        {
                            info.adminFncnBsnsEnls.map((item)=> (
                                <tr key={createKey()}>
                                    <td>{item.opcmNm}</td>
                                    <td>{item.isncInttNm}</td>
                                    <td>{item.pgstCon}</td>
                                    <td>{item.fncnAmt}</td>
                                </tr>
                            ))
                        }
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
              <tr>
                <th className={'ta_left'}>
                  주목적 추가항목
                  <br />
                  (선택입력사항)
                </th>
                <td colSpan={3}>
                  <div className="inner_table_wrap">
                    <table className="inner_table">
                      <colgroup>
                        <col width="" />
                      </colgroup>
                      <tbody>
                        {
                            info.adminFncnBsnsPmgl.length > 0 ?
                                info.adminFncnBsnsPmgl.map((item)=> (
                                <tr key={createKey()}> 
                                    <td>{item.fncnBsnsPmglCon}</td>
                                </tr>
                            )) : 
                            <tr>
                                <td> - </td>
                            </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>

              <tr>
                <th className={'ta_left'}>
                  선정우대 항목
                  <br />
                  (선택입력사항)
                </th>
                <td colSpan={3}>
                  <div className="inner_table_wrap">
                    <table className="inner_table">
                      <colgroup>
                        <col width="" />
                        <col width="" />
                      </colgroup>
                      <tbody>
                        <tr>
                          <th scope="col">선정우대 내용</th>
                          <th scope="col">상세 내용</th>
                        </tr>
                        {
                          info.adminFncnBsnsChcPrnl.length > 0 ?
                          info.adminFncnBsnsChcPrnl.map((item)=> (
                            <tr key={createKey()}>
                              <td>{item.fncnBsnsChcPrnlItmNm}</td>
                              <td>{item.fncnBsnsChcPrnlCon}</td>
                            </tr>
                          )) : 
                          <tr>
                            <td> - </td>
                            <td> - </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="section_header mb_none">
            <p className="section_title">비고(보완내용 등 자유작성)</p>
          </div>
          <table className="table form_table">
            <caption>추가 내용 입력 정보 테이블</caption>
            <colgroup>
              <col width={'18%'} />
              <col width={'32%'} />
              <col width={'18%'} />
              <col width={'32%'} />
            </colgroup>
            <tbody>
              <tr>
                <th className={'ta_left'}>추가 내용 입력</th>
                <td colSpan={3}>
                  <textarea
                    readOnly
                    className="textarea textarea_h200"
                    id="rmrkCon"
                    title="내용"
                    value={info.rmrkCon}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="section_header mb_none">
            <p className="section_title">관련 자료 첨부</p>
          </div>

          <table className="table form_table">
            <caption>첨부 파일 정보 테이블</caption>
            <colgroup>
              <col width={'18%'} />
              <col width={'32%'} />
              <col width={'18%'} />
              <col width={'32%'} />
            </colgroup>
            <tbody>
              <tr>
                <th className={'ta_left'}>첨부파일</th>
                <td colSpan={3}>
                  <div className="fileAttach_wrap">
                    <ul className="fileAttach_list">
                        {
                            info.fileList.map((item)=> (
                            <li className="fileAttach_item" key={createKey()}>
                                <button type="button" className="fileAttach_download" onClick={()=> clickFileDownload(item)}>
                                    <FileDownloadOutlined className="fileAttach_download_icon" />
                                    {item.fileNm}
                                </button>
                            </li>
                        ))
                        }
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="section_header mb_none">
            <p className="section_title">상태</p>
          </div>
          <table className="table form_table">
            <caption>상태 정보 테이블</caption>
            <colgroup>
              <col width={'18%'} />
              <col width={'32%'} />
              <col width={'18%'} />
              <col width={'32%'} />
            </colgroup>
            <tbody>
              <tr>
                <th className={'ta_left'}>상태</th>
                <td colSpan={3}>
                    {
                        (info.fncnBsnsPgrsScd !== '3') &&
                        ((<Select
                            className="select_sort"
                            optionList={defaultSelect}
                            handleSelectActive={(selected) => {
                                onSelectActive(selected)
                            }}
                            ref={searchSelectSort}
                        />)) ||
                        (info.fncnBsnsPgrsScd === '3') &&
                        ((<Select
                            className="select_sort"
                            optionList={disabledSelect}
                            ref={searchSelectSort}
                            disabled={true}
                        />))
                    }
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/*table_wrap end*/}
        <div className="rounded_btn_group">
          <Button className={'basic'} onClick={()=> {history.push(ROUTER_NAMES.INVEST_FNCN_BSNS_RCIP_LIST, props.location.state.pageNum)}}>
            목록
          </Button>
          {
            info.fncnBsnsPgrsScd !== '3' &&
            <Button className={'full_blue'} onClick={()=> {save()}}>
              저장
            </Button>
          }
        </div>
      </div>
    </PageLayout>
  )
}

export default FncnBsnsRcipDetail
