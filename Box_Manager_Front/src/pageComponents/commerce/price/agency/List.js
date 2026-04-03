import NoResult from 'components/NoResult'
import { Link } from 'react-router-dom'
import Checkbox from 'components/atomic/Checkbox'
import { termFormatter } from 'modules/common'
import Skeleton from 'pageComponents/commerce/common/Skeleton'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getTotalNumberBoardReverse } from 'modules/common'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import * as commonFn from 'modules/fns/commonFn'
import BoxUrl from 'modules/consts/BoxUrl'

const List = (props) => {
  const { dataList, paging, setDetailArg } = props

  return (
    <>
      <div className={'banner_list_wrap table_th_border'}>
        <table className="table type02">
          <caption>번호, 회사명, 대표자명, 회원 타입 판매 타입, 상태, 판매 상품, 총 판매 금액(원) 정보 테이블</caption>
          <colgroup>
            <col width={'5%'} />
            <col width={'13%'} />
            <col width={'9%'} />
            <col width={'12%'} />
            <col width={'16%'} />
            <col width={'9%'} />
            <col width={'13%'} />
            <col width={'9%'} />
            <col width={'14%'} />
          </colgroup>
          <thead>
            <tr key={'banner_board_header'}>
              <th>번호</th>
              <th>회사명</th>
              <th>대표자명</th>
              <th>회원 타입</th>
              <th>판매 타입</th>
              <th>승인업체</th>
              <th>상태</th>
              <th>판매 상품</th>
              <th>총 판매 금액(원)</th>
            </tr>
          </thead>
          <tbody>
            {dataList.isLoading ? (
              <Skeleton type="list" count={5} colSpan={9} />
            ) : dataList.list?.length > 0 ? (
              dataList.list?.map((item, idx) => (
                <tr key={'banner_board_header' + idx}>
                  <td className={'ta_center'}>{item.rnum}</td>
                  <td
                    className={'ta_center'}
                    onClick={() => {
                      window.open(
                        `${BoxUrl.getMarketBoxUrl(process.env.REACT_APP_PROFILE)}/company/detail/${item.selrUsisId}`,
                        '_blank'
                      )
                    }}
                  >
                    {item.bplcNm}
                  </td>
                  <td className={'ta_center'}>{item.rprsntvNm}</td>
                  <td className={'ta_center'}>{item.mmbrtypeNm}</td>
                  <td className={'ta_center'}>{item.selrtypeNm}</td>
                  <td className={'ta_center'}>{item.agenArlCnt}</td>
                  <td className={'ta_center'}>{item.mmbrsttsNm}</td>
                  <td className={'ta_center'}>{item.totalPdfCnt ? commonFn.krwFormatter(item.totalPdfCnt) : 0}개</td>
                  <td
                    className={'ta_right'}
                    onClick={() => {
                      setDetailArg({
                        flag: true,
                        id: item.selrUsisId
                      })
                    }}
                  >
                    {item.totalPrc ? commonFn.krwFormatter(item.totalPrc) : 0}원
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className={'ta_center'} colSpan={8}>
                  <NoResult msg={`데이터가 없습니다.`} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default List
