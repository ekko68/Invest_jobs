import NoResult from 'components/NoResult'
import { Link } from 'react-router-dom'

// @description
// Ex--- 파일명은 퍼블확인용
// 개발시에는 'Ex' 제외한 파일명으로 새로 생성후 작업부탁드려요

const ExSaleTableNew = (props) => {
  const { dataList } = props

  return (
    <>
      <div className={'banner_list_wrap table_th_border'}>
        <table className="table type02">
          <caption>번호, 회사명, 대표자명, 회원 타입 판매 타입, 상태, 판매 상품, 총 판매 금액(원) 정보 테이블</caption>
          <colgroup>
            <col width={'5%'} />
            <col width={'15%'} />
            <col width={'10%'} />
            <col width={'12%'} />
            <col width={'17%'} />
            <col width={'16%'} />
            <col width={'10%'} />
            <col width={'15%'} />
          </colgroup>
          <thead>
            {dataList.header.map((item, idx) => {
              return (
                <tr key={'banner_board_header' + idx}>
                  <th>{item.first}</th>
                  <th>{item.companyName}</th>
                  <th>{item.leader}</th>
                  <th>{item.member}</th>
                  <th>{item.sale}</th>
                  <th>{item.state}</th>
                  <th>{item.product}</th>
                  <th>{item.total}</th>
                </tr>
              )
            })}
          </thead>
          <tbody>
            {dataList.data.map((item, idx) => (
              <tr key={'banner_board_item_' + idx} onClick={() => {}}>
                <td className={'ta_center'}>{item.first}</td>
                <td>
                  <Link to={'#'} className={'bannerText'}>
                    {item.companyName}
                  </Link>
                </td>
                <td className={'ta_center'}>{item.leader}</td>

                <td className={'ta_center'}>{item.member}</td>
                <td className={'ta_center'}>{item.sale}</td>
                <td className={'ta_center'}>{item.state}</td>
                <td className={'ta_center'}>{item.product}</td>
                <td className={'ta_center'}>
                  <Link to={'#'} className={'bannerText'}>
                    {item.total}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* start: 데이터 없음 */}
      <div className={'banner_list_wrap table_th_border'}>
        <table className="table type02">
          <caption>번호, 회사명, 대표자명, 회원 타입 판매 타입, 상태, 판매 상품, 총 판매 금액(원) 정보 테이블</caption>
          <colgroup>
            <col width={'5%'} />
            <col width={'15%'} />
            <col width={'10%'} />
            <col width={'12%'} />
            <col width={'17%'} />
            <col width={'16%'} />
            <col width={'10%'} />
            <col width={'15%'} />
          </colgroup>
          <thead>
            {dataList.header.map((item, idx) => {
              return (
                <tr key={'banner_board_header' + idx}>
                  <th>{item.first}</th>
                  <th>{item.companyName}</th>
                  <th>{item.leader}</th>
                  <th>{item.member}</th>
                  <th>{item.sale}</th>
                  <th>{item.state}</th>
                  <th>{item.product}</th>
                  <th>{item.total}</th>
                </tr>
              )
            })}
          </thead>
          <tbody>
            <tr>
              <td className={'ta_center'} colSpan={8}>
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

export default ExSaleTableNew
