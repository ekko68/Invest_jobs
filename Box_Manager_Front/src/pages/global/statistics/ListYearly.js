import PageLayout from 'components/PageLayout'
import NoResult from '../../../components/NoResult'
import { useContext, useEffect, useLayoutEffect, useState } from 'react'
import Pagination from '../../../components/Pagination'
import { UserContext } from '../../../modules/common/UserContext'
import moment from 'moment'
import { excelDownloadIVT } from '../../../modules/utils/CommonUtils'
import { useLocation } from 'react-router-dom'
import Button from '../../../components/atomic/Button'
import { loader } from 'modules/utils/CommonAxios'
import TermSearchForm from '../../../pageComponents/invest/static/TermSearchForm'
import { dateFormatUnitSplit } from '../../../modules/common'
import * as commonFn from '../../../modules/fns/commonFn'
import {
  getConsultStatisticsDaily,
  getConsultStatisticsExcel,
  getConsultStatisticsMonthly,
  getConsultStatisticsYearly
} from '../../../modules/consts/AdminApi'

const List = () => {
  const location = useLocation()
  let path = location.pathname
  let category = path.split('/')[3]
  const userContext = useContext(UserContext)

  const [dataList, setDataList] = useState([])
  const [paging, setPaging] = useState({})

  let startDate = new Date()
  startDate.setMonth(startDate.getMonth() - 1)
  let endDate = new Date()
  const [searchDate, setSearchDate] = useState({
    startDate: startDate,
    endDate: endDate
  })
  const [total, setTotal] = useState(0)

  // ==== 목록 조회
  const getList = async (params) => {
    loader(true, 'Uploading...')
    let paramsList, _searchFromDate, _searchToDate

    if (params?.searchFromDate || params?.searchFromDate) {
      _searchFromDate = moment(params.searchFromDate).format('YYYY')
      _searchToDate = moment(params.searchToDate).format('YYYY')
    } else {
      _searchFromDate = moment(searchDate.startDate).format('YYYY')
      _searchToDate = moment(searchDate.endDate).format('YYYY')
    }

    paramsList = {
      page: params && params.page ? params.page : 1,
      svcDsnc: 'GLOBALBIZ',
      stDt: _searchFromDate,
      enDt: _searchToDate
    }

    let res = await getConsultStatisticsYearly(paramsList) // 목록
    // let total = await getConsultStatisticsTotal(paramsList)   // 합계
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
      setTotal(res.data.data.total)
      loader()
    }
  }

  // ===== excel download
  const hanldeExcelDownload = async () => {
    loader(true, 'Uploading...')
    let _startDate = moment(searchDate.startDate).format('YYYY')
    let _endDate = moment(searchDate.endDate).format('YYYY')
    let paramsList = {
      page: paging && paging.page ? paging.page : 1,
      svcDsnc: 'GLOBALBIZ',
      stDt: _startDate,
      enDt: _endDate,
      menuAccessType: '003' // 003 : Yearly
    }

    let res = await getConsultStatisticsExcel(paramsList) // 엑셀 다운로드
    if (res) {
      if (res.status === 200) {
        let _fileName = `기간별 방문자 (${_startDate}~${_endDate})`
        const blob = new Blob([res.data], { type: res.headers['content-type'] })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.setAttribute('download', _fileName)
        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)
      }
    }
    loader()
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
    <PageLayout currentMenu={'global'} currentCate={'globalConsult'} currentPage={'globalStatisticsYearList'}>
      <div className="content_inner page_static">
        <h4 className="page_title">현지금융 상담 접속 통계</h4>
        <TermSearchForm
          searchDate={searchDate}
          setSearchDate={setSearchDate}
          getList={getList}
          format={'yyyy'}
          calendar={'year'}
        />
        {searchDate && (
          <div className="search_info">
            <span className={'start_date'}>{dateFormatUnitSplit(searchDate.startDate)}</span> ~{' '}
            <span className="end_date">{dateFormatUnitSplit(searchDate.endDate)}</span>
          </div>
        )}
        {/*static_table start*/}
        <div className="static_table">
          <table className="table type02">
            <caption>년별 접속이력 현황 테이블</caption>
            <colgroup>
              <col width={'40%'} />
              <col width={'*'} />
            </colgroup>
            <thead>
              <tr>
                <th>날짜</th>
                <th className={'ta_left'}>방문자 수</th>
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
                  <td className={'ta_center'}>{item.dateLabel}</td>
                  <td>
                    <p className="text_ellipsis">
                      <span
                        style={{
                          textAlign: 'center',
                          minWidth: '90px',
                          display: 'inline-block'
                        }}
                      >
                        {item.count}
                      </span>
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              {/*<tr>*/}
              {/*  <th className={'ta_right'} colSpan={2}>*/}
              {/*    <div className="total_wrap">*/}
              {/*      <dl className="total dl">*/}
              {/*        <dt>합계</dt>*/}
              {/*        <dd>{total ? commonFn.krwFormatter(total) : 0}</dd>*/}
              {/*      </dl>*/}
              {/*      <Button className={'btn_excel basic'} onClick={hanldeExcelDownload}>*/}
              {/*        엑셀저장*/}
              {/*      </Button>*/}
              {/*    </div>*/}
              {/*  </th>*/}
              {/*</tr>*/}
              <tr>
                <th className={'ta_right'} colSpan={2}>
                  <div className="total_wrap">
                    {/*<dl className="total dl">
                    <dt>합계</dt>
                    <dd>{total ? commonFn.krwFormatter(total) : 0}</dd>
                  </dl>*/}
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

export default List
