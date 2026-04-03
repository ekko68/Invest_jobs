import NoResult from 'components/NoResult'
import { getTotalNumberBoard, termFormatter } from 'modules/common'
import { NoImage02 } from 'modules/consts/Img'

const BannerTable = (props) => {
  const { paging = null, type = 'banner', dataList, handleView } = props

  if (!dataList || dataList.length === 0) {
    return (
      <div className="table_no_result">
        <NoResult msg={`등록된 ${type !== 'banner' ? '팝업이' : '배너가'} 없습니다.`} />
      </div>
    )
  } else {
    return (
      <div className={'banner_list_wrap table_th_border'}>
        <table className="table type02">
          <caption>메인 배너 관리 테이블</caption>
          <colgroup>
            <col width={'5%'} />
            <col width={'*'} />
            <col width={'25%'} />
            <col width={'10%'} />
          </colgroup>
          <thead>
            <tr>
              <th>NO</th>
              <th>제목</th>
              <th>기간</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {dataList?.map((item, idx) => (
              <tr
                key={'banner_board_item_' + idx}
                onClick={() => handleView(type === 'popup' ? item.popupInfId : item.banInfId)}
              >
                <td className={'ta_center'}>
                  {paging && getTotalNumberBoard(paging.total, paging.page, paging.record, idx)}
                  {/*{!paging && dataList?.length - idx < 10 ? '0' + (dataList?.length - idx) : dataList?.length - idx}*/}
                </td>
                <td>
                  <div className="img_title_wrap">
                    <div className="img_wrap">
                      {item.imgUrl ? (
                        <img src={item.imgUrl} alt={item.ttl} />
                      ) : (
                        <div className="no_img">
                          <img src={NoImage02} alt="이미지 없음" />
                        </div>
                      )}
                    </div>
                    <p className="name">{item.ttl}</p>
                  </div>
                </td>
                <td className={'ta_center'}>
                  {termFormatter(item.stdy)}-{termFormatter(item.fnda)}
                </td>
                <td className={'ta_center'}>
                  <span
                    className={`${
                      item.status === '공개'
                        ? 'status_public'
                        : item.status === '대기'
                        ? 'status_ready'
                        : item.status === '종료'
                        ? 'status_close'
                        : 'status_private'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}

export default BannerTable
