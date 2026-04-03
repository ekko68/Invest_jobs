import NoResult from 'components/NoResult'
import Skeleton from 'pageComponents/commerce/common/Skeleton'
import { termFormatter } from 'modules/common'
import ROUTER_NAMES from 'modules/consts/RouterConst'
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
          <caption>번호, FAQ 유형, 제목, 등록일, 담당자 정보 테이블</caption>
          <colgroup>
            <col width={'10%'} />
            <col width={'15%'} />
            <col width={'40%'} />
            <col width={'15%'} />
            <col width={'15%'} />
          </colgroup>
          <thead>
            <tr key={'banner_board_header'}>
              <th>번호</th>
              <th>FAQ 유형</th>
              <th>제목</th>
              <th>등록일</th>
              <th>담당자</th>
            </tr>
          </thead>
          <tbody>
            {dataList.isLoading ? (
              <Skeleton type="list" count={10} colSpan={10} />
            ) : dataList.list && dataList.list.length > 0 ? (
              dataList.list.map((item, idx) => (
                <tr key={'banner_board_item_' + idx}>
                  <td className={'ta_center'}>{getTotalNumberBoard(idx)}</td>
                  <td className={'ta_center'}>{item.ptrnName}</td>
                  <td>
                    <Link to={`${ROUTER_NAMES.COMMERCE_CS_FAQ_REGISTRATION}/${item.faqInfId}`} className={'bannerText'}>
                      {item.ttl}
                    </Link>
                  </td>
                  <td className={'ta_center'}>{termFormatter(item.rgsnTs)}</td>
                  <td className={'ta_center'}>{item.rgsnUserId}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className={'ta_center'} colSpan={5}>
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
