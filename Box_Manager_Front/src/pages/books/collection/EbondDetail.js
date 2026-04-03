// 채권 상세
import React from 'react'
import moment from 'moment'

//modules
import * as commonFn from 'modules/fns/commonFn'

/* 채권구분 */
const ebondsType = {
  EBO00001: {code: "EBO00001", name: "전자채권"},
  EBO00002: {code: "EBO00002", name: "외상매출채권"}
}

/* 채권상태 */
const ebondsStatus = {
  EBO01001: {code: "EBO01001", name: "활동채권", className: "bonds_blue"},
  EBO01002: {code: "EBO01002", name: "완제채권", className: "bonds_grey"}
}

const EbondDetail = (props) => {

  const {clctDetail} = props

  return (
      <>
        <div className='collection_view_section'>
          <div className='view_title'>채권정보</div>
          <div className="section">
            <table className="table">
              <caption>채권정보 테이블</caption>
              <colgroup>
                <col width="15%" />
                <col width="35%" />
                <col width="15%" />
                <col width="35%" />
              </colgroup>
              <tbody>
              <tr>
                <th>채권번호</th>
                <td>{clctDetail?.elboNo || '-'}</td>
                <th>채권종류</th>
                <td>{ebondsType[clctDetail?.elboPtrnCd]?.name || '-'}</td>
              </tr>
              <tr>
                <th>거래액(원)</th>
                <td>{clctDetail?.elboAmt ? commonFn.krwFormatter(clctDetail?.elboAmt) : 0}</td>
                <th>상태</th>
                <td className={ebondsStatus[clctDetail?.elboSttsCd]?.className}>
                  {ebondsStatus[clctDetail?.elboSttsCd]?.name || '-'}
                </td>
              </tr>
              <tr>
                <th>발행일</th>
                <td>
                  {clctDetail?.issDdDt ? moment(clctDetail?.issDdDt).format("YYYY-MM-DD") : "-"}
                </td>
                <th>만기일</th>
                <td>
                  {clctDetail?.exdyDt ? moment(clctDetail?.exdyDt).format("YYYY-MM-DD") : "-"}
                </td>
              </tr>
              <tr>
                <th>은행명</th>
                <td colSpan={3}>{clctDetail?.gearBankNm || '-'}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className='collection_view_section'>
          <div className='view_title'>구매업체정보</div>
          <div className="section">
            <table className="table">
              <caption>구매업체정보 테이블</caption>
              <colgroup>
                <col width="15%" />
                <col width="35%" />
                <col width="15%" />
                <col width="35%" />
              </colgroup>
              <tbody>
              <tr>
                <th>업체명</th>
                <td colSpan={3}>{clctDetail?.elboBuyEnprNm || '-'}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </>
  )
}

export default EbondDetail;