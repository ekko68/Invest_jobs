import NoResult from 'components/NoResult'
import { Link } from 'react-router-dom'
import Checkbox from 'components/atomic/Checkbox'

// @description
// Ex--- 파일명은 퍼블확인용
// 개발시에는 'Ex' 제외한 파일명으로 새로 생성후 작업부탁드려요

const ExEstimateTableNew = (props) => {
  const { dataList } = props

  return (
    <>
      <div className={'banner_list_wrap table_th_border'}>
        <table className="table type02">
          <caption>번호, 상품명, 분류, 판매사, 견적 요청일, 견적서, 구매사 정보 테이블</caption>
          <colgroup>
            <col width={'10%'} />
            <col width={'*'} />
            <col width={'15%'} />
            <col width={'15%'} />
            <col width={'15%'} />
            <col width={'15%'} />
            <col width={'15%'} />
          </colgroup>
          <thead>
            {dataList.header.map((item, idx) => {
              return (
                <tr key={'estimate_board_header' + idx}>
                  <th>{item.first}</th>
                  <th>{item.name}</th>
                  <th>{item.type}</th>
                  <th>{item.company}</th>
                  <th>{item.date}</th>
                  <th>{item.estimate}</th>
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
                <td className={'ta_center'}>{item.date}</td>
                <td className={'ta_center'}>{item.estimate}</td>
                <td className={'ta_center'}>{item.purchaser}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* start: 데이터 없음 */}
      <div className={'banner_list_wrap table_th_border '}>
        <table className="table type02">
          <caption>번호, 상품명, 분류, 판매사, 견적 요청일, 견적서, 구매사 정보 테이블</caption>
          <colgroup>
            <col width={'10%'} />
            <col width={'15%'} />
            <col width={'15%'} />
            <col width={'15%'} />
            <col width={'15%'} />
            <col width={'15%'} />
            <col width={'15%'} />
          </colgroup>
          <thead>
            {dataList.header.map((item, idx) => {
              return (
                <tr key={'estimate_board_header' + idx}>
                  <th>{item.first}</th>
                  <th>{item.name}</th>
                  <th>{item.type}</th>
                  <th>{item.company}</th>
                  <th>{item.date}</th>
                  <th>{item.estimate}</th>
                  <th>{item.purchaser}</th>
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

export default ExEstimateTableNew
