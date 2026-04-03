import { useRef, useState, useEffect, useContext, useLayoutEffect } from 'react'

import { useHistory, useLocation } from 'react-router-dom'

import PageLayout from 'components/PageLayout'
import Select from 'components/atomic/Select'
import NoResult from 'components/NoResult'
import Pagination from 'components/Pagination'
import Checkbox from 'components/atomic/Checkbox'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { MktContext } from 'modules/common/MktContext'
import { UserContext } from 'modules/common/UserContext'
import { getCsQnaList } from 'modules/consts/MktApi'
import { getTotalNumberBoard } from 'modules/common'
import moment from 'moment'

const QnaList = () => {
  const location = useLocation()
  let path = location.pathname
  let category = path.split('/')[2]
  const mktContext = useContext(MktContext)
  const userContext = useContext(UserContext)
  const history = useHistory()
  const [paging, setPaging] = useState(null)
  // 검색필터 : 전체, 답변완료, 답변대기
  let filterSelect = useRef(null)
  const [filterSelList, setFilterSelList] = useState({
    active: mktContext.state.qnaParam.inquSttId === '' ? 'all' : mktContext.state.qnaParam.inquSttId,
    list: [
      { id: 'all', value: 'all', label: '전체' },
      { id: 'AIS01002', value: 'AIS01002', label: '답변완료' },
      { id: 'AIS01001', value: 'AIS01001', label: '답변대기' }
    ]
  })

  // 문의유형 체크박스
  const [csCheckList, setCsCheckList] = useState([
    { id: 'all', value: '전체', status: true },
    { id: 'AIS00001', value: '배송', status: false },
    { id: 'AIS00002', value: '구매', status: false },
    { id: 'AIS00003', value: '판매', status: false },
    { id: 'AIS00004', value: '에이전시', status: false },
    { id: 'AIS00006', value: '이벤트', status: false },
    { id: 'AIS00005', value: '기타', status: false }
  ])
  const [qnaListData, setQnaListData] = useState([])

  // ===== 문의유형 체크박스
  const handleSetType = () => {
    let options = mktContext.state.qnaParam.inquTypeId.split(',')
    let cnt = 0
    let newList = []
    csCheckList.map((item, idx) => {
      if (options.includes(item.id)) {
        cnt++
      }
    })
    if (cnt === csCheckList.length - 1) {
      newList = csCheckList.map((item) => (item.id === 'all' ? { ...item, status: true } : { ...item, status: false }))
    } else {
      newList = csCheckList.map((item) =>
        options.includes(item.id) ? { ...item, status: true } : { ...item, status: false }
      )
    }
    setCsCheckList(newList)
  }

  const handleCsCheck = (e) => {
    let newList = []
    let searchAllUsed = true
    //체크 액션 설정
    newList = csCheckList.map((list) => (list.id === e.target.id ? { ...list, status: e.target.checked } : list))
    if (e.target.id == 'all') {
      //전체인경우
      newList = newList.map((list) => (list.id != 'all' ? { ...list, status: false } : list)) //나머지항목 체크 해제
    } else {
      //전체가 아닌 경우
      newList = newList.map((list) => (list.id === 'all' ? { ...list, status: false } : list)) //전체항목 체크 해제
      //마저지 항목이 선택이 완료되었다면 전체항목으로 변경
      if (newList.filter((list) => list.id != 'all' && list.status == true).length == csCheckList.length - 1) {
        newList = newList.map((list) => (list.id == 'all' ? { ...list, status: true } : list)) //전체 선택
        newList = newList.map((list) => (list.id != 'all' ? { ...list, status: false } : list)) //나머지항목 체크 해제
      } else {
        searchAllUsed = false
      }
    }
    setCsCheckList(newList)
    let searchIds = []
    newList
      .filter((list) => list.id != 'all')
      .map((item, idx) => {
        //전체검색
        if (searchAllUsed) {
          searchIds.push(item.id)
          //부분검색
        } else {
          if (item.status) {
            searchIds.push(item.id)
          }
        }
      })
    mktContext.actions.handleQnaParam({ inquTypeId: searchIds.join(','), page: 1 })
  }

  // ===== 답변상태
  const onFilterActive = (selected) => {
    if (selected) {
      setFilterSelList({
        ...filterSelList,
        active: selected
      })
      mktContext.actions.handleQnaParam({
        inquSttId: selected === 'all' ? '' : selected,
        page: 1
      })
    }
  }

  // ===== reset
  const handleReset = async () => {
    mktContext.actions.handleQnaParam(null)
  }

  const getList = async () => {
    let res = await getCsQnaList(mktContext.state.qnaParam)
    if (res.data.code === '200') {
      let data = res.data.data
      setQnaListData(data.list)
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

  // ===== 페이징
  const handlePaging = async (param) => {
    mktContext.actions.handleQnaParam(param)
  }

  useLayoutEffect(() => {
    if ('qna' !== userContext.state.category) {
      userContext.actions.setCategory('qna')
      mktContext.actions.handleQnaParam(null)
    }
  }, [userContext.state.category])

  useEffect(async () => {
    await getList()
    handleSetType() // 문의 체크박스
    onFilterActive() // 답변 상태
  }, [mktContext.state.qnaParam])

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'cs'} currentPage={'csQna'}>
      <div className="content_inner page_cs">
        <div className="page_header">
          <h4 className="page_title">문의관리</h4>
          <div className="btn_group">
            <p className="label">답변상태</p>
            <Select optionList={filterSelList} ref={filterSelect} handleSelectActive={onFilterActive} />
            <button className={'btn_refresh'} title={'새로고침'} onClick={handleReset}>
              <span className="hide">새로고침</span>
            </button>
          </div>
        </div>
        {/*section start*/}
        <div className="section filter_section">
          <div className="filter_header">
            <p className="filter_title">문의</p>
            <div className="filter_checkbox_wrap">
              <p className="label">문의유형</p>
              <div className="checkbox_list">
                {csCheckList?.map((chk, idx) => (
                  <Checkbox
                    key={chk.id + idx}
                    className={'type02'}
                    checkbox={chk}
                    onChange={(e) => handleCsCheck(e)}
                    checked={chk.status}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        {/*section end*/}
        {/*section start*/}
        <div className="section order_table_section">
          {!qnaListData || qnaListData.length === 0 ? (
            <div className="table_no_result">
              <NoResult />
            </div>
          ) : (
            <div className="table_wrap table_th_border">
              <table className="table type02">
                <caption>문의 관리 테이블</caption>
                <colgroup>
                  <col width={'5%'} />
                  <col width={'13%'} />
                  <col width={'*'} />
                  <col width={'15%'} />
                  <col width={'18%'} />
                  <col width={'10%'} />
                </colgroup>
                <thead>
                  <tr>
                    <th>NO</th>
                    <th>문의유형</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>등록일시</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {qnaListData.map((item, idx) => (
                    <tr
                      key={'qna_item_' + idx}
                      onClick={() => history.push(`${ROUTER_NAMES.COMMERCE_CS_QNA_VIEW}/${item.admInquInfId}`)}
                    >
                      <td className={'ta_center'}>
                        {paging && getTotalNumberBoard(paging.total, paging.page, paging.record, idx)}
                      </td>
                      <td className={'ta_center'}>{item.inquTypeName}</td>
                      <td>
                        <p className={'text_ellipsis'}>{item.ttl}</p>
                      </td>
                      <td className={'ta_center'}>{item.bplcNm}</td>
                      <td className={'ta_center'}>
                        {item.rgsnTs ? moment(item.rgsnTs).format('YYYY-MM-DD HH:mm') : '-'}
                      </td>
                      <td className={'ta_center'}>
                        {item.inquSttId === 'AIS01001' && <span className="highlight_yellow">답변대기</span>}
                        {item.inquSttId === 'AIS01002' && <span className="highlight_blue">답변완료</span>}
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

export default QnaList
