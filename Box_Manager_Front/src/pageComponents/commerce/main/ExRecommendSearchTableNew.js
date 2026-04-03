import NoResult from 'components/NoResult'
import { Link } from 'react-router-dom'

// @description
// Ex--- 파일명은 퍼블확인용
// 개발시에는 'Ex' 제외한 파일명으로 새로 생성후 작업부탁드려요

const ExRecommendSearchTableNew = (props) => {
  const { dataList } = props

  return (
    <>
      <div className={'banner_list_wrap table_th_border'}>
        <table className="table type02">
          <caption>선택, 검색어, 기간, 조회수, 상태, 순서 관리 테이블</caption>
          <colgroup>
            <col width={'10%'} />
            <col width={'*'} />
            <col width={'25%'} />
            <col width={'10%'} />
            <col width={'10%'} />
            <col width={'10%'} />
          </colgroup>
          <thead>
            {dataList.header.map((item, idx) => {
              return (
                <tr key={'banner_board_header' + idx}>
                  <th>{item.first}</th>
                  <th>{item.title}</th>
                  <th>{item.date}</th>
                  <th>{item.views}</th>
                  <th>{item.status}</th>
                  <th>{item.order}</th>
                </tr>
              )
            })}
          </thead>
          <tbody>
            {dataList.data.map((item, idx) => (
              <tr key={'banner_board_item_' + idx} onClick={() => {}}>
                <td className={'ta_center'}>{item.first}</td>
                <td>{item.title}</td>
                <td className={'ta_center'}>
                  <Link to={'#'} className={'link'}>
                    {item.date}
                  </Link>
                </td>
                <td className={'ta_center'}>
                  <Link to={'#'} className={'link'}>
                    {item.views}
                  </Link>
                </td>
                <td className={'ta_center'}>{item.status}</td>
                <td className={'ta_center'}>{item.order}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* start: 데이터 없음 */}
      <div className={'banner_list_wrap table_th_border'}>
        <table className="table type02">
          <caption>선택, 검색어, 기간, 조회수, 상태, 순서 관리 테이블</caption>
          <colgroup>
            <col width={'10%'} />
            <col width={'*'} />
            <col width={'25%'} />
            <col width={'10%'} />
            <col width={'10%'} />
            <col width={'10%'} />
          </colgroup>
          <thead>
            {dataList.header.map((item, idx) => {
              return (
                <tr key={'banner_board_header' + idx}>
                  <th>{item.first}</th>
                  <th>{item.title}</th>
                  <th>{item.date}</th>
                  <th>{item.views}</th>
                  <th>{item.status}</th>
                  <th>{item.order}</th>
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

export default ExRecommendSearchTableNew
