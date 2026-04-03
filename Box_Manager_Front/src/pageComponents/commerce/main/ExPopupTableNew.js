import NoResult from 'components/NoResult'
import { Link } from 'react-router-dom'
import Checkbox from 'components/atomic/Checkbox'

// @description
// Ex--- 파일명은 퍼블확인용
// 개발시에는 'Ex' 제외한 파일명으로 새로 생성후 작업부탁드려요

const ExPopupTableNew = (props) => {
  const { dataList } = props

  return (
    <>
      <div className={'banner_list_wrap table_th_border'}>
        <table className="table type02">
          <caption>선택, 제목, 기간, 상태 , 이미지 정보 테이블</caption>
          <colgroup>
            <col width={'5%'} />
            <col width={'*'} />
            <col width={'22%'} />
            <col width={'10%'} />
            <col width={'20%'} />
          </colgroup>
          <thead>
            {dataList.header.map((item, idx) => {
              return (
                <tr key={'banner_board_header' + idx}>
                  <th>{item.first}</th>
                  <th>{item.title}</th>
                  <th>{item.date}</th>
                  <th>{item.status}</th>
                  <th>{item.image}</th>
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
                    {item.title}
                  </Link>
                </td>
                <td className={'ta_center'}>{item.date}</td>

                <td className={'ta_center'}>{item.status}</td>
                <td className={'ta_center'}>
                  <div className="bannerImg_wrap">{item.image}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* start: 데이터 없음 */}
      <div className={'banner_list_wrap table_th_border'}>
        <table className="table type02">
          <caption>선택, 제목, 기간, 상태 , 이미지 정보 테이블</caption>
          <colgroup>
            <col width={'5%'} />
            <col width={'*'} />
            <col width={'22%'} />
            <col width={'10%'} />
            <col width={'20%'} />
          </colgroup>
          <thead>
            {dataList.header.map((item, idx) => {
              return (
                <tr key={'banner_board_header' + idx}>
                  <th>
                    <Checkbox
                      className="no_label"
                      checkbox={{ id: 'cell_checkAll_no', value: '', status: false }}
                      onChange={() => {}}
                    />
                  </th>
                  <th>{item.title}</th>
                  <th>{item.date}</th>
                  <th>{item.status}</th>
                  <th>{item.image}</th>
                </tr>
              )
            })}
          </thead>
          <tbody>
            <tr>
              <td className={'ta_center'} colSpan={5}>
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

export default ExPopupTableNew
