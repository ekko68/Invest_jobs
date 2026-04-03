import NoResult from 'components/NoResult'
import { getTotalNumberBoard, termFormatter } from 'modules/common'
import { Nolast02 } from 'modules/consts/Img'
import { Link } from 'react-router-dom'
import Skeleton from 'pageComponents/commerce/common/Skeleton'
import * as commonFn from 'modules/fns/commonFn'

// @description
// Ex--- 파일명은 퍼블확인용
// 개발시에는 'Ex' 제외한 파일명으로 새로 생성후 작업부탁드려요

const DetailList = (props) => {
  const { dataList } = props

  return (
    <>
      <div className={'banner_list_wrap table_th_border'}>
        <table className="table type02">
          <caption>상품명, 소분류 / 세분류, 판매가, 상태 정보 , 판매 수량, 총판매 금액 정보 테이블</caption>
          <colgroup>
            <col width={'25%'} />
            <col width={'20%'} />
            <col width={'15%'} />
            <col width={'15%'} />
            <col width={'10%'} />
            <col width={'15%'} />
          </colgroup>
          <thead>
            <tr key={'banner_board_header'}>
              <th>상품명</th>
              <th>소분류/세분류</th>
              <th>판매가</th>
              <th>상태</th>
              <th>판매수량</th>
              <th>총 판매 금액(원)</th>
            </tr>
          </thead>
          <tbody>
            {dataList.isLoading ? (
              <Skeleton type="list" count={4} colSpan={8} />
            ) : dataList.list?.length > 0 ? (
              dataList.list?.map((item, idx) => (
                <tr key={'banner_board_header' + idx}>
                  <td className={'ta_center'}>{item.pdfNm}</td>
                  <td className={'ta_center'}>{item.ctgyNm}</td>
                  <td>{item.pdfPrc ? commonFn.krwFormatter(item.pdfPrc) : 0}원</td>
                  <td className={'ta_center'}>{item.sellStatNm}</td>
                  <td className={'ta_center'}>{item.totalPdfCnt ? commonFn.krwFormatter(item.totalPdfCnt) : 0}개</td>
                  <td>{item.totalPrc ? commonFn.krwFormatter(item.totalPrc) : 0}원</td>
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

export default DetailList
