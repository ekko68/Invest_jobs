import { useContext, useEffect, useState, useLayoutEffect } from 'react'
import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import NoResult from 'components/NoResult'
import { useLocation } from 'react-router-dom'
import { UserContext } from 'modules/common/UserContext'
import TermSearchForm from 'pageComponents/invest/static/TermSearchForm'
import moment from 'moment'
import { excelDownloadIVT } from 'modules/utils/CommonUtils'
import { loader } from '../../../modules/utils/CommonAxios'
import { getStatisticsList, getStatisticsTotal } from '../../../modules/consts/InvestApi'
import { dateFormatUnitSplit } from '../../../modules/common'
import Pagination from '../../../components/Pagination'
import * as commonFn from 'modules/fns/commonFn'

const Visitor = () => {
  const location = useLocation()
  let path = location.pathname
  let category = path.split('/')[3]
  const userContext = useContext(UserContext)

  const [dataList, setDataList] = useState([])
  const [paging, setPaging] = useState({})
  const [searchDate, setSearchDate] = useState({
    startDate: new Date(),
    endDate: new Date()
  })
  const [total, setTotal] = useState(0)

  // ==== 목록 조회
  const getList = async (params) => {
    loader(true, 'Uploading...')
    let paramsList, _searchFromDate, _searchToDate

    if (params?.searchFromDate || params?.searchFromDate) {
      _searchFromDate = moment(params.searchFromDate).format('YYYYMMDD')
      _searchToDate = moment(params.searchToDate).format('YYYYMMDD')
    } else {
      _searchFromDate = moment(searchDate.startDate).format('YYYYMMDD')
      _searchToDate = moment(searchDate.endDate).format('YYYYMMDD')
    }

    paramsList = {
      page: params && params.page ? params.page : 1,
      searchFromDate: _searchFromDate,
      searchToDate: _searchToDate
    }

    // 목록
    let res = await getStatisticsList('visitor', paramsList)
    // 합계
    let total = await getStatisticsTotal('visitor', paramsList)
    if (res.data.code === '200') {
      setPaging({
        endPage: res.data.data.endPage,
        next: res.data.data.next,
        page: res.data.data.page,
        prev: res.data.data.prev,
        record: res.data.data.record,
        startPage: res.data.data.startPage,
        total: res.data.data.total,
        totalPage: res.data.data.totalPage
      })
      setDataList(res.data.data.list)
      setTotal(total.data.data)
      loader()
    }
  }

  // ===== excel download
  const hanldeExcelDownload = async () => {
    let _startDate = moment(searchDate.startDate).format('YYYYMMDD')
    let _endDate = moment(searchDate.endDate).format('YYYYMMDD')
    let res = await excelDownloadIVT('visitor', _startDate, _endDate)
  }

  // ===== 페이징
  const handlePaging = async (param) => {
    await getList(param)
  }

  useEffect(async () => {
    await getList()
  }, [])

  useLayoutEffect(() => {
    if (category !== userContext.state.category) {
      userContext.actions.setCategory(category)
    }
  }, [userContext.state.category])

  return (
    <PageLayout currentMenu={'invest'} currentCate={'static'} currentPage={'visitor'}>
      <div className="content_inner page_static">
        <h4 className="page_title">기간별 방문자 현황</h4>
        <TermSearchForm searchDate={searchDate} setSearchDate={setSearchDate} getList={getList} />
        {searchDate && (
          <div className="search_info">
            <span className={'start_date'}>{dateFormatUnitSplit(searchDate.startDate)}</span> ~{' '}
            <span className="end_date">{dateFormatUnitSplit(searchDate.endDate)}</span> 투자심사요청
          </div>
        )}
        {/*static_table start*/}
        <div className="static_table">
          <table className="table type02">
            <caption>기간별 방문자 현황 테이블</caption>
            <colgroup>
              <col width={'40%'} />
              <col width={'*'} />
            </colgroup>
            <thead>
              <tr>
                <th>날짜</th>
                <th>방문자 수</th>
              </tr>
            </thead>
            <tbody>
              {(!dataList || dataList.length === 0) && (
                <tr>
                  <td colSpan={6}>
                    <NoResult />
                  </td>
                </tr>
              )}
              {dataList.map((item, idx) => (
                <tr key={'static_visitor_' + idx}>
                  <td className={'ta_center'}>{item.cctnDt}</td>
                  <td className={'ta_center'}>
                    {item.vstoCnt}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th className={'ta_right'} colSpan={2}>
                  <div className="total_wrap">
                    <dl className="total dl">
                      <dt>합계</dt>
                      <dd>{total ? commonFn.krwFormatter(total) : 0}</dd>
                    </dl>
                    <Button className={'btn_excel basic'} onClick={hanldeExcelDownload}>
                      엑셀저장
                    </Button>
                  </div>
                </th>
              </tr>
            </tfoot>
          </table>
          <div className={'paging_wrap'}>
            {paging && <Pagination pagingData={paging} handlePaging={handlePaging} />}
          </div>
        </div>
        {/*static_table end*/}
      </div>
    </PageLayout>
  )
}

export default Visitor
