import NoResult from 'components/NoResult'
import { Link } from 'react-router-dom'

// @description
// Ex--- 파일명은 퍼블확인용
// 개발시에는 'Ex' 제외한 파일명으로 새로 생성후 작업부탁드려요

const ExCorporateProductTableNew = (props) => {
  const { dataList } = props

  return (
    <>
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
            {dataList.header.map((item, idx) => {
              return (
                <tr key={'banner_board_header' + idx} >
                  <th>{item.first}</th>
                  <th>{item.product}</th>
                  <th>{item.category}</th>
                  <th>{item.price}</th>
                  <th>{item.state}</th>
                  <th>{item.policy}</th>
                  <th>{item.action}</th>
                </tr>
              )
            })}
          </thead>
          <tbody>
            {dataList.data.map((item, idx) => (
              <tr key={'banner_board_item_' + idx} onClick={() => {}}>
                <td className={'ta_center'}>{item.first}</td>
                <td>
                  <Link to={'#'} className={'ellipsis_link'}>
                    {item.product}
                  </Link>
                </td>
                <td className={'ta_center'}>{item.category}</td>

                <td className={'ta_center'}>{item.price}</td>
                <td className={'ta_center'}>{item.state}</td>
                <td className={'ta_center'}>{item.policy}</td>
                <td className={'ta_center'}>{item.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* start: 데이터 없음 */}
      <div className={'banner_list_wrap table_th_border'}>
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
            {dataList.header.map((item, idx) => {
              return (
                <tr key={'banner_board_header' + idx} >
                  <th>{item.first}</th>
                  <th>{item.product}</th>
                  <th>{item.category}</th>
                  <th>{item.price}</th>
                  <th>{item.state}</th>
                  <th>{item.policy}</th>
                  <th>{item.action}</th>
                </tr>
              )
            })}
          </thead>
          <tbody>
            <tr>
              <td className={'ta_center'} colSpan={7}>
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

export default ExCorporateProductTableNew
