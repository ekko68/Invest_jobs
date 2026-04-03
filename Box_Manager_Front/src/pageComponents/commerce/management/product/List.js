import React, { Fragment } from 'react'
import NoResult from 'components/NoResult'
import { Link } from 'react-router-dom'
import Skeleton from 'pageComponents/commerce/common/Skeleton'
import Button from 'components/atomic/Button'
import BoxUrl from 'modules/consts/BoxUrl'
const List = (props) => {
  const { data, paging, handleProductPopup } = props

  const isCommaFormat = (num) => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  // 조회 된 데이터 번호 자동세팅 함수
  const getTotalNumberBoard = (index, page, record) => {
    return (page - 1) * record + (index + 1)
  }

  return (
    <Fragment>
      <div className={'banner_list_wrap table_th_border table_scroll'}>
        <table className="table type02">
          <caption>번호, 상품명, 소분류/세분류, 판매가, 상태, 판매 정책, 판매중지 관리 테이블</caption>
          <colgroup>
            <col width={'8%'} />
            <col width={'*'} />
            <col width={'16%'} />
            <col width={'13%'} />
            <col width={'13%'} />
            <col width={'15%'} />
            <col width={'10%'} />
          </colgroup>
          <thead>
            <tr key={'banner_board_header'}>
              <th>번호</th>
              <th>상품명</th>
              <th>소분류/세분류</th>
              <th>판매가</th>
              <th>상태</th>
              <th>판매정책</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.isLoading ? (
              <Skeleton type="list" count={5} colSpan={8} />
            ) : data.list?.length > 0 ? (
              data.list.map((item, idx) => (
                <tr key={'banner_board_item_' + idx} onClick={() => {}}>
                  <td className={'ta_center'}>{paging && getTotalNumberBoard(idx, paging.page, paging.record)}</td>
                  <td>
                    <Link
                      to={'#'}
                      className={'bannerText'}
                      target={'_blank'}
                      onClick={() => {
                        window.open(
                          `${BoxUrl.getMarketBoxUrl(process.env.REACT_APP_PROFILE)}/product/detail/${item.pdfInfoId}`
                        )
                      }}
                    >
                      {item.pdfNm}
                    </Link>
                  </td>
                  <td className={'ta_center'}>{item.tms4ClsfNm ? item.tms4ClsfNm : '-'}</td>

                  <td className={'ta_center'}>
                    {isCommaFormat(item.pdfPrc)}
                    {item.comPrcutName}
                  </td>
                  <td className={'ta_center'}>
                    {item.pdfSttsId === 'GDS00001'
                      ? '판매중'
                      : item.pdfSttsId === 'GDS00005'
                      ? '판매 중지'
                      : item.pdfSttsName}
                  </td>
                  <td className={'ta_center'}>{item.salePolicyName ? item.salePolicyName : '-'}</td>
                  <td className={'ta_center'}>
                    {
                      <Button className={'grayLine'} onClick={() => handleProductPopup({ active: true, item })}>
                        {`${item.pdfSttsId === 'GDS00005' ? '판매 중지 사유' : '판매 중지'}`}
                      </Button>
                    }
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className={'ta_center'} colSpan={7}>
                  <NoResult msg={`데이터가 없습니다.`} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Fragment>
  )
}

export default List
