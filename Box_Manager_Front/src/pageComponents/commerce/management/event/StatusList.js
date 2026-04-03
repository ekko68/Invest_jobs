import NoResult from 'components/NoResult'
import moment from 'moment'
import Skeleton from 'pageComponents/commerce/common/Skeleton'
import EventPopup from './popup/JoinProduct'
import { StringUtils } from 'modules/utils/StringUtils'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { Link } from 'react-router-dom'
import PopupJoinCompany from 'pageComponents/commerce/management/event/popup/JoinCompany'
import PopupJoinProduct from 'pageComponents/commerce/management/event/popup/JoinProduct'
import { useState, Fragment, useContext, useEffect } from 'react'
import { MktContext } from 'modules/common/MktContext'

const StatusList = (props) => {
  const { eventData, setPopupData, setPopupHendler, getEventList, search } = props
  const mktContext = useContext(MktContext)

  const [popupCompany, setPopupCompany] = useState({
    active: false,
    evntInfId: ''
  })

  const [popupProduct, setPopupProduct] = useState({
    active: false,
    evntInfId: ''
  })

  const hendlePopupView = (data) => {
    setPopupData(data)
    setPopupHendler({ active: true })
  }

  return (
    <Fragment>
      {popupCompany.active && <PopupJoinCompany evntInfId={popupCompany.evntInfId} setPopupCompany={setPopupCompany} />}
      {popupProduct.active && (
        <PopupJoinProduct
          evntInfId={popupProduct.evntInfId}
          setPopupProduct={setPopupProduct}
          evntStatus={popupProduct.evntStatus}
          getEventList={getEventList}
          search={search}
        />
      )}
      <div className={'banner_list_wrap table_th_border table_scroll_event'}>
        <table className="table type02">
          <caption>번호, 이벤트명, 기간, 상태, 이미지, 정보 테이블</caption>
          <colgroup>
            <col width={'5%'} />
            <col width={'23%'} />
            <col width={'20%'} />
            <col width={'10%'} />
            <col width={'10%'} />
            <col width={'10%'} />
            <col width={'10%'} />
            <col width={'12%'} />
          </colgroup>
          <thead>
            <tr>
              <th>번호</th>
              <th>이벤트명</th>
              <th>기간</th>
              <th>상태</th>
              <th>대표 이미지</th>
              <th>참여 기업수</th>
              <th>참여 상품수 (승인/승인대기)</th>
              <th>총 판매 금액(원)</th>
            </tr>
          </thead>
          <tbody>
            {eventData.isLoading ? (
              <Skeleton type="list" count={10} colSpan={8} />
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
                  {/* <td onClick={() => hendlePopupView(eventData.list[idx].evntInfId)}>{item.evntTtl}</td> */}
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
                  <td className={'ta_center'}>
                    <span
                      className="bannerText"
                      onClick={() => {
                        if (item.ffpcCnt > 0) {
                          setPopupCompany({
                            active: true,
                            evntInfId: item.evntInfId
                          })
                        } else {
                          mktContext.actions.setCommonAlertInfo({
                            type: 'alert',
                            active: true,
                            msg: '참여기업이 없습니다.'
                          })
                        }
                      }}
                    >
                      {item.ffpcCnt}
                    </span>
                  </td>
                  <td className={'ta_center'}>
                    <span
                      className="bannerText"
                      onClick={() => {
                        setPopupProduct({
                          active: true,
                          evntInfId: item.evntInfId,
                          evntStatus: item.status
                        })
                      }}
                    >
                      {item.pcsnconfirmCnt + ' / ' + item.pcsnsttsCnt}
                    </span>
                  </td>
                  <td className={'ta_center'}>{StringUtils.comma(item.orderTtalAmt)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className={'ta_center'} colSpan={7}>
                  <NoResult msg={`데이터가 없습니다.`} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Fragment>
  )
}

export default StatusList
