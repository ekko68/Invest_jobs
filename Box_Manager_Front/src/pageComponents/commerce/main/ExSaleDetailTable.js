import NoResult from 'components/NoResult'
import { getTotalNumberBoard, termFormatter } from 'modules/common'
import { Nolast02 } from 'modules/consts/Img'
import { Link } from 'react-router-dom'

// @description
// Ex--- 파일명은 퍼블확인용
// 개발시에는 'Ex' 제외한 파일명으로 새로 생성후 작업부탁드려요

const ExSaleDetailTable = (props) => {
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
            {dataList.header.map((item, idx) => {
              return (
                <tr key={'banner_board_header' + idx}>
                  <th>{item.first}</th>
                  <th>{item.type}</th>
                  <th>{item.price}</th>
                  <th>{item.state}</th>
                  <th>{item.quantity}</th>
                  <th>{item.total}</th>
                </tr>
              )
            })}
          </thead>
          <tbody>
            {dataList.data.map((item, idx) => (
              <tr key={'banner_board_item_' + idx} onClick={() => {}}>
                <td className={'ta_center'}>{item.first}</td>
                <td className={'ta_center'}>{item.type}</td>
                <td className={'ta_center'}>{item.price}</td>
                <td className={'ta_center'}>{item.state}</td>
                <td className={'ta_center'}>{item.quantity}</td>
                <td className={'ta_center'}>{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* start: 데이터 없음 */}
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
            {dataList.header.map((item, idx) => {
              return (
                <tr key={'banner_board_header' + idx}>
                  <th>{item.first}</th>
                  <th>{item.type}</th>
                  <th>{item.price}</th>
                  <th>{item.state}</th>
                  <th>{item.quantity}</th>
                  <th>{item.total}</th>
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

export default ExSaleDetailTable
