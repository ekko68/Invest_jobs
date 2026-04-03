import NoResult from 'components/NoResult'
import { Link } from 'react-router-dom'

// @description
// Ex--- 파일명은 퍼블확인용
// 개발시에는 'Ex' 제외한 파일명으로 새로 생성후 작업부탁드려요

const ExSearchTableNew = (props) => {
  const { dataList } = props

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
            {dataList.header.map((item, idx) => {
              return (
                <tr key={'banner_board_header' + idx}>
                  <th>{item.first}</th>
                  <th>{item.title}</th>
                  <th>{item.views}</th>
                </tr>
              )
            })}
          </thead>
          <tbody>
            {dataList.data.map((item, idx) => (
              <tr key={'banner_board_item_' + idx} onClick={() => {}}>
                <td className={'ta_center'}>{item.first}</td>
                <td>
                  <Link to={'#'} className={'link'}>
                    {item.title}
                  </Link>
                </td>
                <td className={'ta_center'}>{item.views}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* start: 데이터 없음 */}
      <div className={'banner_list_wrap table_th_border'}>
        <table className="table type02">
          <caption>검색 순위, 검색어, 조회수 정보 테이블</caption>
          <colgroup>
            <col width={'10%'} />
            <col width={'*'} />
            <col width={'10%'} />
          </colgroup>
          <thead>
            {dataList.header.map((item, idx) => {
              return (
                <tr key={'banner_board_header' + idx}>
                  <th>{item.first}</th>
                  <th>{item.title}</th>
                  <th>{item.views}</th>
                </tr>
              )
            })}
          </thead>
          <tbody>
            <tr>
              <td className={'ta_center'} colSpan={6}>
                <NoResult msg={`데이터가 없습니다.`} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* end: 데이터 없음 */}
    </>
  )
}

export default ExSearchTableNew
