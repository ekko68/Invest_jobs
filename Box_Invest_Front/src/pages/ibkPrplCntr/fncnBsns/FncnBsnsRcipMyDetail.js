import { FileDownloadOutlined } from '@mui/icons-material'
import { Button } from '@mui/material'
import Api from 'modules/consts/Api'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import CommonAxios, { fileDownload, getConfig, getPostConfig } from "modules/utils/CommonAxios"
import { createKey } from "modules/utils/CommonUtils"
import moment from 'moment'
import { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { openSessionAlert } from 'pageComponents/common/pop/SessionCheckAlert'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import {StringUtils} from "modules/utils/StringUtils";

const FncnBsnsRcipMyDetail = (props) => {
  const history = useHistory()
  const fncnBsnsPbanNoRef = useRef('')
  const alertPopRef = useRef('')
  const [myDetailVo, setMyDetailVo] = useState({
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
    fncnBsnsEnlsFildUqnNm : '',
    fncnBsnsJntOpcm : [],
    fncnBsnsInvvHmrs : [],
    fncnEnls : [],
    fncnBsnsPmglItm : [],
    fncnBsnsChcPrnl : [],
    fileList : []
  })

  // 상세조회
  const loadDetail = async()=> {
    const url = Api.fncnBsns.rcipMyDetail + '/' + fncnBsnsPbanNoRef.current
    const res = await CommonAxios(getConfig(url), false)

    if (res && res.data.code === '200') {
      setMyDetailVo(res.data.data)
    }
  }

  // 파일 다운로드
  const clickFileDownload = async(params)=> {
    await fileDownload(params)
  }

  // 접수 취소
  const cancelData = async()=> {
    const url = Api.fncnBsns.rcipCancel
    const params = {
      ...myDetailVo,
      fncnBsnsPgrsScd : '3'
    }
    const res = await CommonAxios(getPostConfig(url, params), true)

    if (res && res.data.code === '200') {
      openSessionAlert(true, '접수가 취소 되었습니다.', () =>
      history.push(ROUTER_NAMES.FNCN_BSNS_RCIP_MY_LIST))
    }
  }

  useEffect(()=> {
    fncnBsnsPbanNoRef.current = props.location.state.fncnBsnsRcipNo
    loadDetail()
  },[])

  return (
    <>
      {/* Contents */}
      <div className="investBusiness_container investBusiness_accept">
        <div className="section_header">
          <h3 className={'title'}>나의 출자사업 신청현황</h3>
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
                <td>{myDetailVo.fncnBsnsPbanTtlNm}</td>
                <th>공고일자</th>
                <td>{moment(myDetailVo.pbanYmd === " " ? myDetailVo.iibsFrrgTs : myDetailVo.pbanYmd).format('YYYY-MM-DD')}</td>
              </tr>
            </tbody>
          </table>
          <h3 className="accept_title">운용사 정보</h3>
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
                  운용사명
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>{myDetailVo.opcmNm}</td>
                <th>
                  대표자명
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>{myDetailVo.opcmRpprNm}</td>
              </tr>

              <tr>
                <th>
                  설립일자
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>{moment(myDetailVo.opcmIncrYmd).format('YYYY-MM-DD')}</td>
                <th>
                  회사 형태
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>
                  {
                    (myDetailVo.opcmLicsKcd === '1') && (('창업투자회사')) ||
                    (myDetailVo.opcmLicsKcd === '2') && (('신기술사업금융업자')) ||
                    (myDetailVo.opcmLicsKcd === '3') && (('LLC')) ||
                    (myDetailVo.opcmLicsKcd === '4') && (('창업기획자(AC)')) ||
                    (myDetailVo.opcmLicsKcd === '5') && (('자산운용사')) ||
                    (myDetailVo.opcmLicsKcd === '6') && (('사모집합투자기구운용사')) ||
                    (myDetailVo.opcmLicsKcd === '7') && (('기타'))
                  }
                </td>
              </tr>

              <tr>
                <th>
                  사업자등록번호
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>{StringUtils.formatBusinessNumber(myDetailVo.opcmBzn)}</td>
                <th>
                  담당자
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>{myDetailVo.opcmRsprNm}</td>
              </tr>

              <tr>
                <th>
                  연락처
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>{StringUtils.isTelFormat(String(myDetailVo.opcmCnplCon))}</td>
                <th>
                  이메일
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>{myDetailVo.opcmEad}</td>
              </tr>

              <tr>
                <th>
                  공동GP여부
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td colSpan={3}>{myDetailVo.jntOpcmYn}</td>
              </tr>
              {
                myDetailVo.jntOpcmYn === 'Y' ? 
                <>
                  <tr>
                    <th>
                      공동GP정보
                      <span className="required" aria-label="필수요소">
                        *
                      </span>
                    </th>
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
                              myDetailVo.fncnBsnsJntOpcm.map((item)=> (
                                <tr key={createKey()}>
                                  <td>{item.opcmNm}</td>
                                  <td>{item.opcmRpprNm}</td>
                                  <td>{moment(item.opcmIncrYmd).format('YYYY-MM-DD')}</td>
                                  <td>{StringUtils.formatBusinessNumber(item.opcmBzn)}</td>
                                  <td>{item.opcmRsprNm}</td>
                                  <td>{StringUtils.isTelFormat(String(item.cnplCon))}</td>
                                  <td>{item.emlCon}</td>
                                </tr>
                              ))
                            }
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                </> : 
                <></>
              }
            
            </tbody>
          </table>
          <h3 className="accept_title">출자제안서 정보</h3>
          <table className="view_table">
            <colgroup>
              <col width={'13%'} />
              <col width={'37%'} />
              <col width={'13%'} />
              <col width={'37%'} />
            </colgroup>
            <tbody>
              <tr>
                <th>지원분야</th>
                <td colSpan="3">{myDetailVo.fncnBsnsEnlsFildUqnNm}</td>
              </tr>
              <tr>
                <th>
                  조합명
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>{myDetailVo.fundNm}</td>
                <th>
                  펀드구분
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>
                  {
                    (myDetailVo.fncnBsnsCprtDcd === '1') &&(('벤처투자조합')) || 
                    (myDetailVo.fncnBsnsCprtDcd === '2') &&(('신기술사업투자조합')) || 
                    (myDetailVo.fncnBsnsCprtDcd === '3') &&(('기관전용PEF')) || 
                    (myDetailVo.fncnBsnsCprtDcd === '4') &&(('기타')) 
                  }
                </td>
              </tr>
              <tr>
                <th>
                  IBK출자요청액(억원)
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>{myDetailVo.ibkFncnRqstAmt}</td>
                <th>
                  펀드결성규모(억원)
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>{myDetailVo.fundOrgzScdlAmt}</td>
              </tr>
              <tr>
                <th>
                  존속기간(년)
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>{myDetailVo.fundAsceTrm}</td>
                <th>
                  출자금 납부방식
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>
                  {
                    (myDetailVo.fnmnPmntMcd === '1') && (('일시납')) ||
                    (myDetailVo.fnmnPmntMcd === '2') && (('수시납')) ||
                    (myDetailVo.fnmnPmntMcd === '3') && (('분할납'))
                  }
                </td>
              </tr>
              <tr>
                <th>
                  기준수익률(%)
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>{myDetailVo.baseEnrtCon}</td>
                <th>
                  관리보수(%)
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>{myDetailVo.mnrmCon}</td>
              </tr>
              <tr>
                <th>
                  성과보수(%)
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td colSpan={3}>{myDetailVo.otcmRmnrCon}</td>
              </tr>

              <tr>
                <th>
                  펀드참여인력
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
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
                          <th scope="col">GP명</th>
                          <th scope="col">인력구분</th>
                          <th scope="col">이름</th>
                          <th scope="col">투자경력(년)</th>
                          <th scope="col">대표번호</th>
                          <th scope="col">휴대폰번호</th>
                          <th scope="col">이메일주소</th>
                        </tr>
                        {
                          myDetailVo.fncnBsnsInvvHmrs.map((item)=> (
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
                              <td>{StringUtils.isTelFormat(String(item.opcmCmpnTpn))}</td>
                              <td>{StringUtils.isTelFormat(String(item.opcmRsprCpn))}</td>
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
                <th>
                  출자자 모집현황
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                  <br />
                  (GP 포함)
                  <div className="th_guide_text">관련자료 첨부 필수</div>
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
                          myDetailVo.fncnEnls.map((item)=> (
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
                <th>
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
                          myDetailVo.fncnBsnsPmglItm.length > 0 ?
                          myDetailVo.fncnBsnsPmglItm.map((item)=> (
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
                <th>
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
                          myDetailVo.fncnBsnsChcPrnl.length > 0 ?
                          myDetailVo.fncnBsnsChcPrnl.map((item)=> (
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
                  <div className="textarea_view">
                    {myDetailVo.rmrkCon}
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
                <td colSpan={3}>
                  <ul className="fileAttach_list">
                    {
                      myDetailVo.fileList.map((item)=> (
                        <li className="fileAttach_item" key={createKey()}>
                          <button type="button" className="fileAttach_download" onClick={()=> clickFileDownload(item)}>
                            <FileDownloadOutlined className="fileAttach_download_icon" />
                            {item.fileNm}
                          </button>
                        </li>
                      ))
                    }
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="bottom_buttons">
            {
              myDetailVo.fncnBsnsPgrsScd === '2' && (
                <Button size="large" variant="outlined" disableElevation onClick={()=> {cancelData()}}>
                  접수 취소
                </Button>
              )
            }
            <Button size="large" variant="contained" disableElevation onClick={()=> {history.push(ROUTER_NAMES.FNCN_BSNS_RCIP_MY_LIST)}}>
              목록으로
            </Button>
          </div>
        </div>
      </div>
      <AlertPopup ref={alertPopRef} />                    
      {/* End of Contents */}
    </>
  )
}

export default FncnBsnsRcipMyDetail
