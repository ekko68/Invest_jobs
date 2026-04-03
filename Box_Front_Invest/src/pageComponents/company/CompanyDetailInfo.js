/** @jsxImportSource @emotion/react */

import React, { useEffect } from 'react'

import { companyDetailInfoStyle } from 'assets/style/CompanyStyle'
import { tableStyle } from 'assets/style/AtomicStyle'

import DateUtils from 'modules/utils/DateUtils'
import { StringUtils } from 'modules/utils/StringUtils'
import { CheckYn } from 'modules/consts/BizConst'
import { isNumber } from 'modules/utils/NumberUtils'

const CompanyDetailInfo = (props) => {
  const { vo } = props

  const onClickOpenHomePage = (url) => {
    window.open(url)
  }

  const getMsrnAmslAmt = () => {
    if (!StringUtils.hasLength(vo?.basicData?.msrnAmslAmt)) return ''
    const year = StringUtils.hasLength(vo?.basicData?.msrnAmslYear) ? ' (' + vo.basicData.msrnAmslYear + '년)' : ''
    return StringUtils.comma(vo.basicData['msrnAmslAmt']) + '원' + year
  }

  useEffect(() => {}, [])

  return (
    <div className="company_detail_info card_inner" css={companyDetailInfoStyle}>
      <div className="card_header">
        <div className="card_title ico_title">기업상세</div>
      </div>
      <div className="table_wrap scroll_lightgrey">
        <table className="table" css={tableStyle}>
          <caption>기업상세 정보 테이블</caption>
          <colgroup>
            <col width={'25%'} />
            <col width={'*'} />
          </colgroup>
          <tbody>
            <tr>
              <th>설립일</th>
              <td>{DateUtils.customDateFormat(vo.basicData.fondDe, 'yyyy년 MM월 dd일')}</td>
            </tr>
            <tr>
              <th>직원수</th>
              <td>{isNumber(vo.basicData?.empCnt) ? `${vo.basicData.empCnt} 명` : ''}</td>
            </tr>
            <tr>
              <th>기업규모</th>
              <td>{vo.basicData['enprDsncClsfNm']}</td>
            </tr>
            <tr>
              <th>최근매출</th>
              <td>{getMsrnAmslAmt()}</td>
            </tr>
            <tr>
              <th>홈페이지</th>
              <td>
                <span onClick={() => onClickOpenHomePage(vo.basicData.hmpgAdres)}>{vo.basicData.hmpgAdres}</span>
              </td>
            </tr>
            <tr>
              <th>주소</th>
              <td>
                {StringUtils.hasLength(vo.basicData?.postNo) ? `(${vo.basicData.postNo}) ` : ''}
                {StringUtils.hasLength(vo.basicData?.addr) ? vo.basicData.addr : ''}
              </td>
            </tr>
            <tr>
              <th>연락처</th>
              <td>{vo.basicData['reprsntTelno']}</td>
            </tr>
            <tr>
              <th>업종</th>
              <td>{vo.basicData['btnm']}</td>
            </tr>
            <tr>
              <th>업태</th>
              <td>{vo.basicData['bzstNm']}</td>
            </tr>
            <tr>
              <th>기업구분</th>
              <td>{vo.basicData['enfmClsfNm']}</td>
            </tr>
            <tr>
              <th>상장구분</th>
              <td>
                {vo.basicData?.lstnYn === CheckYn.YES ? '상장' : vo.basicData?.lstnYn === CheckYn.NO ? '비상장' : ''}
              </td>
            </tr>
            <tr>
              <th>비즈니스 분야</th>
              <td>
                {vo.investData?.investFieldList?.length > 0 &&
                  StringUtils.makeReduceDelimiterString(
                    ', ',
                    ...vo.investData.investFieldList.map((item) => item.invmFildNm)
                  )}
              </td>
            </tr>
            <tr>
              <th>관심기술</th>
              <td>
                {vo.investData?.utilTechList?.length > 0 &&
                  StringUtils.makeReduceDelimiterString(
                    ', ',
                    ...vo.investData.utilTechList.map((item) => item.utlzTchnNm)
                  )}
              </td>
            </tr>
            <tr>
              <th>희망 투자유치 단계</th>
              <td>
                {vo.investData?.investHope?.oppbYn === CheckYn.YES
                  ? vo.investData.investHope.invmStgNm
                  : vo.investData?.investHope?.oppbYn === CheckYn.NO
                  ? '비공개'
                  : ''}
              </td>
            </tr>
            <tr>
              <th>희망 투자유치 금액</th>
              <td>
                {vo.investData?.investHope?.oppbYn === CheckYn.YES
                  ? vo.investData.investHope.invmAmtNm
                  : vo.investData?.investHope?.oppbYn === CheckYn.NO
                  ? '비공개'
                  : ''}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CompanyDetailInfo
