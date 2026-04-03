import React, { Fragment } from 'react'
import NoResult from 'components/NoResult'
import { Link } from 'react-router-dom'
import Skeleton from 'pageComponents/commerce/common/Skeleton'
import Button from 'components/atomic/Button'
import BoxUrl from 'modules/consts/BoxUrl'

const List = (props) => {
  const { data, paging, handleSellerPopup } = props

  // 조회 된 데이터 번호 자동세팅 함수
  const getTotalNumberBoard = (index, page, record) => {
    return (page - 1) * record + (index + 1)
  }

  return (
    <Fragment>
      <div className={'banner_list_wrap table_th_border'}>
        <table className="table type02">
          <caption>
            번호, 회사명, 대표자명, 회원타입, 판매타입, 판매 상품, 상태, 판매 자격 박탈 버튼, 박탈 사유 관리 테이블
          </caption>
          <colgroup>
            <col width={'8%'} />
            <col width={'*'} />
            <col width={'10%'} />
            <col width={'10%'} />
            <col width={'15%'} />
            <col width={'10%'} />
            <col width={'15%'} />
            <col width={'15%'} />
          </colgroup>
          <thead>
            <tr key={'banner_board_header'}>
              <th>번호</th>
              <th>회사명</th>
              <th>대표자명</th>
              <th>회원 타입</th>
              <th>판매 타입</th>
              <th>판매 상품</th>
              <th>상태</th>
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
                          `${BoxUrl.getMarketBoxUrl(process.env.REACT_APP_PROFILE)}/company/detail/${item.selrUsisId}`
                        )
                      }}
                    >
                      {item.bplcNm}
                    </Link>
                  </td>
                  <td className={'ta_center'}>{item.rprsntvNm}</td>
                  <td className={'ta_center'}>{item.mmbrtypeNm}</td>
                  <td className={'ta_center'}>{`${item.agtPrdtCnt > 0 ? '에이전시' : '판매자'}`}</td>
                  <td className={'ta_center'}>{`${Number(item.prdtCnt) > 0 ? item.prdtCnt : '0'}`}</td>
                  <td className={'ta_center'}>{`${item.mmbrsttsId === 'AUA01002' ? '판매 자격 박탈' : '판매'}`}</td>
                  <td className={'ta_center'}>
                    <Button className={'grayLine'} onClick={() => handleSellerPopup({ active: true, item })}>
                      {`${item.mmbrsttsId === 'AUA01002' ? '박탈 사유' : '판매 자격 박탈'}`}
                    </Button>
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
    </Fragment>
  )
}

export default List
