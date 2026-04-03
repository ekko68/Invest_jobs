import NoResult from 'components/NoResult'
import { Link } from 'react-router-dom'
import moment from 'moment'
import Skeleton from 'pageComponents/commerce/common/Skeleton'
import ROUTER_NAMES from 'modules/consts/RouterConst'

const eventList = (props) => {
  const { eventData } = props

  return (
    <>
      <div className={'banner_list_wrap table_th_border'}>
        <table className="table type02">
          <caption>번호, 이벤트명, 기간, 상태, 이미지, 정보 테이블</caption>
          <colgroup>
            <col width={'8%'} />
            <col width={'33%'} />
            <col width={'22%'} />
            <col width={'12%'} />
            <col width={'*'} />
          </colgroup>
          <thead>
            <tr>
              <th>번호</th>
              <th>이벤트명</th>
              <th>기간</th>
              <th>상태</th>
              <th>대표 이미지</th>
            </tr>
          </thead>
          <tbody>
            {eventData.isLoading ? (
              <Skeleton type="list" count={10} colSpan={5} />
            ) : eventData.list.length > 0 ? (
              eventData.list.map((item, idx) => (
                <tr key={'banner_board_item_' + idx} onClick={() => {}}>
                  <td className={'ta_center'}>{item.rnum}</td>
                  <td>
                    <Link
                      to={`${ROUTER_NAMES.COMMERCE_MANAGEMENT_EVENT_REGISTRATION}/${item.evntInfId}`}
                      className={'bannerText'}
                    >
                      {item.evntTtl}
                    </Link>
                  </td>
                  <td className={'ta_center'}>
                    <span>{moment(item.evntStdyTs).format('YYYY.MM.DD')}</span>
                    <span>~</span>
                    <span>{moment(item.evntFndaTs).format('YYYY.MM.DD')}</span>
                  </td>
                  <td
                    className={`ta_center ${
                      item.status === '진행'
                        ? 'status_public'
                        : item.status === '대기'
                        ? 'status_ready'
                        : item.status === '종료'
                        ? 'status_close'
                        : 'status_private'
                    }`}
                  >
                    {item.status}
                  </td>
                  <td className={'ta_center'}>
                    <div className="bannerImg_wrap">
                      {item.imgUrl ? (
                        <img src={item.imgUrl} alt={item.ttl} />
                      ) : (
                        <div className="no_img">
                          <img src={NoImage02} alt="이미지 없음" />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className={'ta_center'} colSpan={6}>
                  <NoResult msg={`데이터가 없습니다.`} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default eventList
