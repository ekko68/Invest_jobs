import NoResult from 'components/NoResult'
import { getTotalNumberBoard, termFormatter } from 'modules/common'
import { Nolast02 } from 'modules/consts/Img'
import Checkbox from 'components/atomic/Checkbox'

// @description
// Ex--- 파일명은 퍼블확인용
// 개발시에는 'Ex' 제외한 파일명으로 새로 생성후 작업부탁드려요

const ExBannerTableNew = (props) => {
  const { dataList } = props

  return (
    <>
      <div className={'banner_list_wrap table_th_border'}>
        <table className="table type02">
          <caption>기업명, 카테고리, 기업 형태,IBK 인증여부 정보 테이블</caption>
          <colgroup>
            <col width={'5%'} />
            <col width={'*'} />
            <col width={'30%'} />
            <col width={'15%'} />
            <col width={'15%'} />
          </colgroup>
          <thead>
            {dataList.header.map((item, idx) => {
              return (
                <tr key={'banner_board_header' + idx}>
                  <th>{item.first}</th>
                  <th>{item.title}</th>
                  <th>{item.category}</th>
                  <th>{item.type}</th>
                  <th>{item.last}</th>
                </tr>
              )
            })}
          </thead>
          <tbody>
            {dataList.data.map((item, idx) => (
              <tr key={'banner_board_item_' + idx} onClick={() => {}}>
                <td className={'ta_center'}>{item.first}</td>
                <td className={'ta_center'}>{item.title}</td>
                <td className={'ta_center'}>{item.category}</td>

                <td className={'ta_center'}>{item.type}</td>
                <td className={'ta_center'}>{item.last}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* start: 데이터 없음 */}
      <div className={'banner_list_wrap table_th_border'}>
        <table className="table type02">
          <caption>기업명, 카테고리, 기업 형태,IBK 인증여부 정보 테이블</caption>
          <colgroup>
            <col width={'5%'} />
            <col width={'*'} />
            <col width={'30%'} />
            <col width={'15%'} />
            <col width={'15%'} />
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
                  <th>{item.category}</th>
                  <th>{item.type}</th>
                  <th>{item.last}</th>
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

export default ExBannerTableNew
