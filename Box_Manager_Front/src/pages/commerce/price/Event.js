import { useRef, useState, useEffect, useContext, useLayoutEffect } from 'react'

import PageLayout from 'components/PageLayout'
import NoResult from 'components/NoResult'
import Pagination from 'components/Pagination'
import Select from 'components/atomic/Select'
import { useLocation } from 'react-router-dom'
import { UserContext } from 'modules/common/UserContext'
import { getTotalNumberBoard } from 'modules/common'
import * as commonFn from 'modules/fns/commonFn'
import { getPriceEventList } from 'modules/consts/MktApi'
import BoxUrl from 'modules/consts/BoxUrl'
import moment from 'moment'

const Event = () => {
  const location = useLocation()
  let path = location.pathname
  let category = path.split('/')[3]
  const userContext = useContext(UserContext)
  const filterRef = useRef(null)

  // ========================
  /* state  */
  // ========================
  const [list, setList] = useState(null)
  const [paging, setPaging] = useState(null)
  const [paramList, setParamList] = useState({
    page: 1,
    priceSort: '' // sort
  })
  const [filter, setFilter] = useState({
    active: paramList.priceSort !== '' ? paramList.priceSort : 'desc',
    list: [
      { id: 'desc', value: 'desc', label: '높은 금액 순' },
      { id: 'asc', value: 'asc', label: '낮은 금액 순' }
    ]
  })

  // ========================
  /* functions  */
  // ========================
  // ===== getList
  const getList = async () => {
    let res = await getPriceEventList(paramList)
    if (res.data.code === '200') {
      const data = res.data.data
      setList(data.list)
      setPaging({
        endPage: data.endPage,
        next: data.next,
        page: data.page,
        prev: data.prev,
        record: data.record,
        startPage: data.startPage,
        total: data.total,
        totalPage: data.totalPage
      })
    }
  }

  // ===== filter: 높은 금액 순, 낮은 금액 순
  const onFilterActive = (selected) => {
    setFilter({
      ...filter,
      active: selected
    })
    setParamList({
      ...paramList,
      priceSort: selected,
      page: 1
    })
  }

  // ===== handleLink
  const handleWindowLink = (id) => {
    window.open(`${BoxUrl.getMarketBoxUrl(process.env.REACT_APP_PROFILE)}/event/detail/${id}`, 'blank')
  }

  // ===== reset
  const handleReset = () => {
    setParamList({
      page: 1,
      priceSort: '' // sort
    })
  }

  // ===== paging
  const handlePaging = (param) => {
    setParamList({
      ...paramList,
      ...param
    })
  }

  useLayoutEffect(() => {
    if (category !== userContext.state.category) {
      userContext.actions.setCategory(category)
    }
  }, [userContext.state.category])

  useEffect(async () => {
    paramList && (await getList())
  }, [paramList])

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'price'} currentPage={'priceEvent'}>
      <div className="content_inner page_price">
        <div className="page_header">
          <h4 className="page_title">이벤트 별 총 판매 금액</h4>
          <div className="btn_group">
            <Select optionList={filter} ref={filterRef} handleSelectActive={onFilterActive} />
            <button className={'btn_refresh'} title={'새로고침'} onClick={handleReset}>
              <span className="hide">새로고침</span>
            </button>
          </div>
        </div>
        {/*section start*/}
        <div className="section price_event_section">
          {!list || list.length === 0 ? (
            <div className="table_no_result">
              <NoResult />
            </div>
          ) : (
            <div className="table_wrap border_bottom_none table_th_border">
              <table className="table type02">
                <caption>이벤트 별 총 판매 금액 테이블</caption>
                <colgroup>
                  <col width={'5%'} />
                  <col width={'*'} />
                  <col width={'25%'} />
                  <col width={'22%'} />
                </colgroup>
                <thead>
                  <tr>
                    <th>NO</th>
                    <th>이벤트명</th>
                    <th>진행기간</th>
                    <th>총 판매 금액(원)</th>
                  </tr>
                </thead>
                <tbody>
                  {list?.map((item, idx) => (
                    <tr key={commonFn.createKey()}>
                      <td className={'ta_center'}>
                        {paging && getTotalNumberBoard(paging.total, paging.page, paging.record, idx)}
                      </td>
                      <td>
                        <button
                          className="btn_link"
                          onClick={() => handleWindowLink(item.evntInfId)}
                          style={{
                            display: 'block',
                            textAlign: 'left',
                            maxWidth: '400px',
                            height: '22px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {item.evntTtl}
                        </button>
                      </td>
                      <td className={'ta_center'}>
                        <div className="date_input_wrap">
                          <span>{moment(item.evntStdyTs).format('YYYY.MM.DD')}</span>
                          <span>~</span>
                          <span>{moment(item.evntFndaTs).format('YYYY.MM.DD')}</span>
                        </div>
                      </td>
                      <td className={'ta_right'}>{item.totalPrc ? commonFn.krwFormatter(item.totalPrc) : 0}원</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className={'paging_wrap'}>
            {paging && <Pagination pagingData={paging} handlePaging={handlePaging} />}
          </div>
        </div>
        {/*section end*/}
      </div>
    </PageLayout>
  )
}

export default Event
