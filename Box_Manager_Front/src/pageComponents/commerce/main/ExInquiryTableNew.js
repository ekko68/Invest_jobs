import NoResult from 'components/NoResult'
import { Link } from 'react-router-dom'

// @description
// Ex--- 파일명은 퍼블확인용
// 개발시에는 'Ex' 제외한 파일명으로 새로 생성후 작업부탁드려요

const ExInquiryTableNew = (props) => {
  const { dataList } = props

  return (
    <>
      <div className={'banner_list_wrap table_th_border'}>
        <table className="table type02">
          <caption>번호, 문의 유형, 제목, 등록일, 작성자, 답변 상태, 담당자, 답변 등록일 정보 테이블</caption>
          <colgroup>
            <col width={'5%'} />
            <col width={'10%'} />
            <col width={'28%'} />
            <col width={'10%'} />
            <col width={'15%'} />
            <col width={'10%'} />
            <col width={'10%'} />
            <col width={'12%'} />
          </colgroup>
          <thead>
            {dataList.header.map((item, idx) => {
              return (
                <tr key={'banner_board_header' + idx}>
                  <th>{item.first}</th>
                  <th>{item.InquiryType}</th>
                  <th>{item.title}</th>
                  <th>{item.date}</th>
                  <th>{item.writer}</th>
                  <th>{item.state}</th>
                  <th>{item.manager}</th>
                  <th>{item.registrationDate}</th>
                </tr>
              )
            })}
          </thead>
          <tbody>
            {dataList.data.map((item, idx) => (
              <tr key={'banner_board_item_' + idx} onClick={() => {}}>
                <td className={'ta_center'}>{item.first}</td>
                <td className={'ta_center'}>{item.InquiryType}</td>
                <td>
                  <Link to={'#'} className={'bannerText'}>
                    {item.title}
                  </Link>
                </td>
                <td className={'ta_center'}>{item.date}</td>
                <td className={'ta_center'}>
                  <Link to={'#'} className={'bannerText'}>
                    {item.writer}
                  </Link>
                </td>
                <td className={'ta_center'}>{item.state}</td>
                <td className={'ta_center'}>{item.manager}</td>
                <td className={'ta_center'}>{item.registrationDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* start: 데이터 없음 */}
      <div className={'banner_list_wrap table_th_border'}>
        <table className="table type02">
          <caption>번호, 문의 유형, 제목, 등록일, 작성자, 답변 상태, 담당자, 답변 등록일 정보 테이블</caption>
          <colgroup>
            <col width={'5%'} />
            <col width={'10%'} />
            <col width={'28%'} />
            <col width={'10%'} />
            <col width={'15%'} />
            <col width={'10%'} />
            <col width={'10%'} />
            <col width={'12%'} />
          </colgroup>
          <thead>
            {dataList.header.map((item, idx) => {
              return (
                <tr key={'banner_board_header' + idx}>
                  <th>{item.first}</th>
                  <th>{item.InquiryType}</th>
                  <th>{item.title}</th>
                  <th>{item.date}</th>
                  <th>{item.writer}</th>
                  <th>{item.state}</th>
                  <th>{item.manager}</th>
                  <th>{item.registrationDate}</th>
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

export default ExInquiryTableNew
