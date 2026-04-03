import NoResult from 'components/NoResult'
import { termFormatter } from 'modules/common'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import Skeleton from 'pageComponents/commerce/common/Skeleton'
import { Link } from 'react-router-dom'

// @description
// Ex--- 파일명은 퍼블확인용
// 개발시에는 'Ex' 제외한 파일명으로 새로 생성후 작업부탁드려요

const List = (props) => {
  const { dataList, paging } = props

  const getTotalNumberBoard = (index) => {
    if (!paging) return

    const { page, record } = paging
    let number = (page - 1) * record + (index + 1)
    return number
  }

  return (
    <>
      <div className={'banner_list_wrap table_th_border'}>
        <table className="table type02">
          <caption>번호, 문의 유형, 제목, 등록일, 작성자, 답변 상태, 담당자, 답변 등록일 정보 테이블</caption>
          <colgroup>
            <col width={'5%'} />
            <col width={'15%'} />
            <col width={'30%'} />
            <col width={'10%'} />
            <col width={'10%'} />
            <col width={'10%'} />
            <col width={'10%'} />
            <col width={'10%'} />
          </colgroup>
          <thead>
            <tr key={'banner_board_header'}>
              <th>번호</th>
              <th>문의유형</th>
              <th>제목</th>
              <th>등록일</th>
              <th>작성자</th>
              <th>답변상태</th>
              <th>담당자</th>
              <th>답변등록일</th>
            </tr>
          </thead>
          <tbody>
            {dataList.isLoading ? (
              <Skeleton type="list" count={10} colSpan={10} />
            ) : dataList.list && dataList.list.length > 0 ? (
              dataList.list.map((item, idx) => (
                <tr key={'banner_board_item_' + idx}>
                  <td className={'ta_center'}>{getTotalNumberBoard(idx)}</td>
                  <td className={'ta_center'}>{item.inquTypeName}</td>
                  <td>
                    <Link
                      to={`${ROUTER_NAMES.COMMERCE_CS_QNA_REGISTRATION}/${item.admInquInfId}`}
                      className={'bannerText'}
                    >
                      {item.ttl}
                    </Link>
                  </td>
                  <td className={'ta_center'}>{termFormatter(item.rgsnTs)}</td>
                  <td className={'ta_center'}>{item.bplcNm}</td>
                  <td className={'ta_center'}>{item.inquSttName}</td>
                  <td className={'ta_center'}>{item.ansRgsnUserId}</td>
                  <td className={'ta_center'}>{termFormatter(item.ansRgsnTs)}</td>
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
