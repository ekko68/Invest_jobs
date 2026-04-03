import NoResult from 'components/NoResult'
import { Link } from 'react-router-dom'
import Checkbox from 'components/atomic/Checkbox'

// @description
// Ex--- 파일명은 퍼블확인용
// 개발시에는 'Ex' 제외한 파일명으로 새로 생성후 작업부탁드려요

const ExOrderTableNew = (props) => {
  const { dataList } = props

  return (
    <>
      <div className={'banner_list_wrap table_th_border table_scroll_order'}>
        <table className="table type02">
          <caption>주문번호, 상품명, 판매사, 옵션, 수량, 판매 금액, 결제일 정보 테이블</caption>
          <colgroup>
            <col width={'10%'} />
            <col width={'*'} />
            <col width={'12%'} />
            <col width={'12%'} />
            <col width={'7%'} />
            <col width={'8%'} />
            <col width={'8%'} />
            <col width={'8%'} />
            <col width={'12%'} />
            <col width={'8%'} />
            <col width={'10%'} />
          </colgroup>
          <thead>
            {dataList.header.map((item, idx) => {
              return (
                <tr key={'order_board_header' + idx}>
                  <th>{item.first}</th>
                  <th>{item.name}</th>
                  <th>{item.type}</th>
                  <th>{item.company}</th>
                  <th>{item.option}</th>
                  <th>{item.quantity}</th>
                  <th>{item.price}</th>
                  <th>{item.delivery}</th>
                  <th>{item.state}</th>
                  <th>{item.date}</th>
                  <th>{item.purchaser}</th>
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
                    {item.name}
                  </Link>
                </td>
                <td className={'ta_center'}>{item.type}</td>
                <td className={'ta_center'}>
                  <Link to={'#'} className={'ellipsis_link'}>
                    {item.company}
                  </Link>
                </td>
                <td className={'ta_center'}>{item.option}</td>
                <td className={'ta_center'}>{item.quantity}</td>
                <td className={'ta_center'}>{item.price}</td>
                <td className={'ta_center'}>{item.delivery}</td>
                <td className={'ta_center'}>{item.state}</td>
                <td className={'ta_center'}>{item.date}</td>
                <td className={'ta_center'}>{item.purchaser}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* start: 데이터 없음 */}
      <div className={'banner_list_wrap table_th_border '}>
        <table className="table type02">
          <caption>주문번호, 상품명, 판매사, 옵션, 수량, 판매 금액, 결제일 정보 테이블</caption>
          <colgroup>
            <col width={'10%'} />
            <col width={'8%'} />
            <col width={'12%'} />
            <col width={'12%'} />
            <col width={'7%'} />
            <col width={'8%'} />
            <col width={'8%'} />
            <col width={'8%'} />
            <col width={'12%'} />
            <col width={'8%'} />
            <col width={'10%'} />
          </colgroup>
          <thead>
            {dataList.header.map((item, idx) => {
              return (
                <tr key={'order_board_header' + idx}>
                  <th>{item.first}</th>
                  <th>{item.name}</th>
                  <th>{item.type}</th>
                  <th>{item.company}</th>
                  <th>{item.option}</th>
                  <th>{item.quantity}</th>
                  <th>{item.price}</th>
                  <th>{item.delivery}</th>
                  <th>{item.state}</th>
                  <th>{item.date}</th>
                  <th>{item.purchaser}</th>
                </tr>
              )
            })}
          </thead>
          <tbody>
            <tr>
              <td className={'ta_center'} colSpan={11}>
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

export default ExOrderTableNew
