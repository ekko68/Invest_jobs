import NoResult from 'components/NoResult'
import Skeleton from 'pageComponents/commerce/common/Skeleton'

const SearchTable = (props) => {
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
          <caption>검색 순위, 검색어, 조회수 정보 테이블</caption>
          <colgroup>
            <col width={'10%'} />
            <col width={'*'} />
            <col width={'10%'} />
          </colgroup>
          <thead>
            <tr>
              <th>순위</th>
              <th>검색어</th>
              <th>조회수</th>
            </tr>
          </thead>
          <tbody>
            {dataList.isLoading ? (
              <Skeleton type="list" count={10} colSpan={10} />
            ) : dataList.list && dataList.list.length > 0 ? (
              dataList.list.map((item, idx) => (
                <tr key={'search_table_item_' + idx}>
                  <td className={'ta_center'}>{getTotalNumberBoard(idx)}</td>
                  <td>{item.srwd}</td>
                  <td className={'ta_center'}>{item.iqcnt}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className={'ta_center'} colSpan={6}>
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

export default SearchTable
