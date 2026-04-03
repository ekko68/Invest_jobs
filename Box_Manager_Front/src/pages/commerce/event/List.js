import { useRef, useEffect, useContext, useState, useLayoutEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import PageLayout from 'components/PageLayout'
import Select from 'components/atomic/Select'
import Button from 'components/atomic/Button'
import NoResult from 'components/NoResult'
import Pagination from 'components/Pagination'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { UserContext } from 'modules/common/UserContext'
import { MktContext } from 'modules/common/MktContext'
import { getEventListApi } from 'modules/consts/MktApi'
import { loader } from 'modules/utils/CommonAxios'
import { getTotalNumberBoard } from 'modules/common'
import moment from 'moment'

const List = () => {
  const location = useLocation()
  let path = location.pathname
  let category = path.split('/')[2]
  const userContext = useContext(UserContext)
  const mktContext = useContext(MktContext)
  const history = useHistory()
  const [paging, setPaging] = useState(null)
  // 이벤트 관리 목록
  const [eventListData, setEventListData] = useState([])

  // const colorClass = {
  //   ETS00001: 'blue',
  //   ETS00002: 'yellow',
  //   ETS00003: 'red'
  // }

  const colorClass = {
    ETS00001: {
      color: 'blue',
      name: '진행중'
    },
    ETS00002: {
      color: 'yellow',
      name: '준비중'
    },
    ETS00003: {
      color: 'red',
      name: '마감'
    }
  }

  // 검색필터 : 전체, 게시중, 대기, 종료
  const filterSelect = useRef(null)
  const filterSelList = {
    active: mktContext.state.eventParam.pgstId,
    list: [
      { id: 'filter_all', value: 'filter_all', label: '전체' },
      { id: 'ETS00001', value: 'ETS00001', label: '진행중' },
      { id: 'ETS00002', value: 'ETS00002', label: '준비중' },
      { id: 'ETS00003', value: 'ETS00003', label: '마감' }
    ]
  }
  const onFilterActive = (selected) => {
    mktContext.actions.handleEventParam({
      page: 1,
      pgstId: selected
    })
  }

  // 페이지이동
  const linktoPage = (type, id, evntTtl, status) => {
    history.push(
      type === 'manage'
        ? `${ROUTER_NAMES.COMMERCE_EVENT_MANAGE}/${id}/${evntTtl}/${status}`
        : type === 'detail'
        ? `${ROUTER_NAMES.COMMERCE_EVENT_VIEW}/${id}`
        : `${ROUTER_NAMES.COMMERCE_EVENT_WRITE}`
    )
  }

  const handlePaging = async (param) => {
    let params = {
      ...mktContext.state.eventParam,
      ...param
    }
    mktContext.actions.handleEventParam(params)
  }

  const getList = async (params) => {
    loader(true, 'Uploading...')
    setEventListData(null)
    let res = await getEventListApi(params)
    if (res.data.code === '200') {
      let data = res.data.data
      setEventListData(data.list)
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
      loader()
    }
  }

  // ===== reset
  const handleReset = async () => {
    mktContext.actions.handleEventParam(null)
    await getList()
  }

  useLayoutEffect(() => {
    if (category !== userContext.state.category) {
      handleReset()
      userContext.actions.setCategory(category)
    }
  }, [userContext.state.category])

  useEffect(async () => {
    await getList(mktContext.state.eventParam)
  }, [mktContext.state.eventParam])

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'event'}>
      <div className="content_inner page_event">
        <div className="page_header">
          <h4 className="page_title">이벤트 관리</h4>
          <div className="btn_group">
            <Select optionList={filterSelList} ref={filterSelect} handleSelectActive={onFilterActive} />
            <button className={'btn_refresh'} title={'새로고침'} onClick={handleReset}>
              <span className="hide">새로고침</span>
            </button>
            <Button className={'full_blue w80'} onClick={() => linktoPage('write')}>
              이벤트 등록
            </Button>
          </div>
        </div>
        {/*section start*/}
        <div className="section seller_list_section">
          {!eventListData || eventListData.length === 0 ? (
            <div className="table_no_result">
              <NoResult msg={'등록된 이벤트가 없습니다.'} />
            </div>
          ) : (
            <div className="table_wrap border_bottom_none table_th_border">
              <table className="table type02">
                <caption>메인 배너 관리 테이블</caption>
                <colgroup>
                  <col width={'5%'} />
                  <col width={'*'} />
                  <col width={'13%'} />
                  <col width={'12%'} />
                  <col width={'13%'} />
                </colgroup>
                <thead>
                  <tr>
                    <th>NO</th>
                    <th>제목</th>
                    <th>기간</th>
                    <th>상태</th>
                    <th>바로가기</th>
                  </tr>
                </thead>
                <tbody>
                  {eventListData?.map((item, idx) => (
                    <tr key={'event_item_' + idx}>
                      <td className={'ta_center'}>
                        {paging && getTotalNumberBoard(paging.total, paging.page, paging.record, idx)}
                      </td>
                      <td className={'ta_center'}>
                        <div className="img_title_wrap">
                          <div className="img_wrap">
                            {item.imgUrl ? (
                              <img src={item.imgUrl} alt={item.fileNm} />
                            ) : (
                              <div className="no_img">
                                <img src={require('assets/images/no_img.jpg').default} alt="이미지 없음" />
                              </div>
                            )}
                          </div>
                          <p className="name">{item.evntTtl}</p>
                        </div>
                      </td>
                      <td className={'ta_center'}>
                        <div className="date_inputs">
                          <span>{moment(item.evntStdyTs).format('YYYY.MM.DD')}</span>
                          <span>~</span>
                          <span>{moment(item.evntFndaTs).format('YYYY.MM.DD')}</span>
                        </div>
                      </td>
                      <td className={'ta_center'}>
                        <span className={`highlight_${colorClass[item.pgstId].color}`}>
                          {colorClass[item.pgstId].name}
                        </span>
                      </td>
                      <td className={'ta_center'}>
                        <div className="btn_group_column">
                          <Button
                            className={'basic'}
                            onClick={() => linktoPage('manage', item.evntInfId, item.evntTtl, item.pgstId)}
                          >
                            이벤트 관리
                          </Button>
                          <Button className={'basic'} onClick={() => linktoPage('detail', item.evntInfId)}>
                            상세보기
                          </Button>
                        </div>
                      </td>
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

export default List
