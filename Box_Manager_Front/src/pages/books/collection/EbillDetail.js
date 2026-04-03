// 어음 상세
import React from 'react'
import moment from 'moment'

//modules
import * as commonFn from 'modules/fns/commonFn'

//const
/* 어음상태 */
const ebillStatus = {
  ELB00001: {code: "ELB00001", name: "결제받을어음", className: "bill_blue"},
  ELB00002: {code: "ELB00002", name: "부도어음", className: "bill_red"},
  ELB00003: {code: "ELB00003", name: "결제받은어음", className: "bill_grey"}
}

const EbillDetail = (props) => {

  const {clctDetail} = props

  return (
      <>
        <div className='collection_view_section'>
          <div className='view_title'>어음정보</div>
          <div className="section">
            <table className="table">
              <caption>어음정보 테이블</caption>
              <colgroup>
                <col width="15%" />
                <col width="35%" />
                <col width="15%" />
                <col width="35%" />
              </colgroup>
              <tbody>
              <tr>
                <th>전자어음번호</th>
                <td>{clctDetail?.note?.elbNo || '-'}</td>
                <th>분할번호</th>
                <td>{clctDetail?.note?.prttNo || '-'}</td>
              </tr>
              <tr>
                <th>배서횟수</th>
                <td>{clctDetail?.note?.edsrCnt || '-'}</td>
                <th>배서번호</th>
                <td>{clctDetail?.note?.endsNo || '-'}</td>
              </tr>
              <tr>
                <th>거래액(원)</th>
                <td>{clctDetail?.note?.elbAmt ? commonFn.krwFormatter(clctDetail?.note?.elbAmt) : 0}</td>
                <th>상태</th>
                <td className={ebillStatus[clctDetail?.note?.elbSttsCd]?.className}>
                  {ebillStatus[clctDetail?.note?.elbSttsCd]?.name || '-'}
                </td>
              </tr>
              <tr>
                <th>발행일</th>
                <td>{clctDetail?.note ? moment(clctDetail?.note?.issDt).format('YYYY-MM-DD') : '-'}</td>
                <th>만기일</th>
                <td>{clctDetail?.note ? moment(clctDetail?.note?.expiDt).format('YYYY-MM-DD'): '-'}</td>
              </tr>
              <tr>
                <th>지급은행 및 지점</th>
                <td>{clctDetail?.note?.pamtBankNm}</td>
                <th>부도일</th>
                <td>{clctDetail?.note && clctDetail?.note?.dshrDt ? moment(clctDetail?.note?.dshrDt).format('YYYY-MM-DD') : '-'}</td>
              </tr>
              <tr>
                <th>발행지</th>
                <td colSpan={3}>{clctDetail?.note?.issPlac || '-'}</td>
              </tr>
              <tr>
                <th>보증내역 여부</th>
                <td>{clctDetail?.noteGuarantee?.grnyNo !== null ? "Y" : "N"}</td>
                <th>사고신고 여부</th>
                <td>
                  {clctDetail?.note?.rcipYn || "-"}
                  {clctDetail?.note?.rcipYn === "Y" && `(접수일시 : ${moment(clctDetail?.note?.rcipTs).format('YYYY-MM-DD')})`}
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className='collection_view_section'>
          <div className='view_title'>보증내역</div>
          <div className="section collection_table_section">
            <div className="table_wrap border_bottom_none table_th_border">
              <table className="table type02">
                <caption>보증내역 테이블</caption>
                <colgroup>
                  <col width={'25%'} />
                  <col width={'10%'} />
                  <col width={'20%'} />
                  <col width={'10%'} />
                  <col width={'20%'} />
                  <col width={'15%'} />
                </colgroup>
                <thead>
                <tr>
                  <th>보증번호</th>
                  <th>보증구분</th>
                  <th>보증인 사업자(주민)번호</th>
                  <th>보증승인일자</th>
                  <th>보증인 법인명</th>
                  <th>보증인 성명(대표자명)</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>{clctDetail?.noteGuarantee?.grnyNo || "-"}</td>
                  <td>
                    {
                      clctDetail?.noteGuarantee?.grnrIndvCorpDcd === '001' ? '법인' :
                          clctDetail?.noteGuarantee?.grnrIndvCorpDcd === '002' ? '개인' : '-'
                    }
                  </td>
                  <td>{clctDetail?.noteGuarantee?.grnrBsnnRgsnNo || '-'}</td>
                  <td>{clctDetail?.noteGuarantee ? moment(clctDetail?.noteGuarantee?.grnyAthzDt).format('YYYY-MM-DD') : '-'}</td>
                  <td className="txt_start">{clctDetail?.noteGuarantee?.grnrBsnnNm || '-'}</td>
                  <td>{clctDetail?.noteGuarantee?.grnrRpprNm || '-'}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className='collection_view_section'>
          <div className='view_title'>발행인 정보</div>
          <div className="section">
            <table className="table">
              <caption>발행인 정보 테이블</caption>
              <colgroup>
                <col width="15%" />
                <col width="35%" />
                <col width="15%" />
                <col width="35%" />
              </colgroup>
              <tbody>
              <tr>
                <th>법인명</th>
                <td>{clctDetail?.noteIssue?.issBsnnNm || '-'}</td>
                <th>사업자(주민)번호</th>
                <td>{clctDetail?.noteIssue?.issPrsnBsnnRgsnNo || '-'}</td>
              </tr>
              <tr>
                <th>성명(대표자명)</th>
                <td>{clctDetail?.noteIssue?.issRpprNm || ''}</td>
                <th>법인/개인구분</th>
                <td>
                  {
                    clctDetail?.noteIssue?.grnrIndvCorpDcd === '001' ? '법인' :
                        clctDetail?.noteIssue?.grnrIndvCorpDcd === '002' ? '개인' : '-'
                  }
                </td>
              </tr>
              <tr>
                <th>발행인 주소</th>
                <td colSpan={3}>{clctDetail?.noteIssue?.issBsunAdr || '-'}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className='collection_view_section'>
          <div className='view_title'>배서인 정보</div>
          <div className="section">
            <table className="table">
              <caption>배서인 정보 테이블</caption>
              <colgroup>
                <col width="15%" />
                <col width="35%" />
                <col width="15%" />
                <col width="35%" />
              </colgroup>
              <tbody>
              <tr>
                <th>법인명</th>
                <td>{clctDetail?.noteEndorse?.edsrBsnnNm || '-'}</td>
                <th>사업자(주민)번호</th>
                <td>{clctDetail?.noteEndorse?.edsrBsnnRgsnNo || '-'}</td>
              </tr>
              <tr>
                <th>성명(대표자명)</th>
                <td>{clctDetail?.noteEndorse?.edsrRpprNm || '-'}</td>
                <th>배서번호</th>
                <td>{clctDetail?.noteEndorse?.endsNo || '-'}</td>
              </tr>
              <tr>
                <th>배서금액(원)</th>
                <td>{clctDetail?.noteEndorse ? commonFn.krwFormatter(clctDetail?.noteEndorse?.endsAmt) : 0}</td>
                <th>배서구분</th>
                <td>
                  {
                    clctDetail?.noteEndorse?.edsrIndvCorpDcd === '001' ? '법인' :
                        clctDetail?.noteEndorse?.edsrIndvCorpDcd === '002' ? '개인' : '-'
                  }
                </td>
              </tr>
              <tr>
                <th>배서이전날짜</th>
                <td>{clctDetail?.noteEndorse ? moment(clctDetail?.noteEndorse?.endsTrsfYmd).format('YYYY-MM-DD') : '-'}</td>
                <th>은행 및 지점</th>
                <td>{clctDetail?.noteEndorse?.endsBkbrchNm || '-'}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </>
  )
}

export default EbillDetail;