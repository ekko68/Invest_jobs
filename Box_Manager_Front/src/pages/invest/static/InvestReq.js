import { useEffect, useState, useContext, useLayoutEffect } from 'react'
import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import NoResult from 'components/NoResult'
import TermSearchForm from 'pageComponents/invest/static/TermSearchForm'
import { dateFormatUnitSplit } from 'modules/common'
import { getStatisticsList, getStatisticsTotal } from 'modules/consts/InvestApi'
import { loader } from 'modules/utils/CommonAxios'
import Pagination from 'components/Pagination'
import moment from 'moment'
import { excelDownloadIVT } from 'modules/utils/CommonUtils'
import { useLocation } from 'react-router-dom'
import { UserContext } from 'modules/common/UserContext'
import * as commonFn from 'modules/fns/commonFn'
import {IVT_CODE} from "modules/consts/BizCode";

const InvestReq = () => {
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

  // ===== 목록조회
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
    let res = await getStatisticsList('request', paramsList)
    // 합계
    let total = await getStatisticsTotal('request', paramsList)
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

  const getResultStatusClassName = (item) => {
    let classNm = '';
    switch (item.exntRsltCd) {
      case IVT_CODE.EXNT_RSLT.HOLD:
        classNm = 'highlight_yellow';
        break;
      case IVT_CODE.EXNT_RSLT.ACCEPT:
        classNm = 'highlight_blue';
        break;
      case IVT_CODE.EXNT_RSLT.REFUSE:
        classNm = 'highlight_red';
        break;
    }
    return classNm;
  }

  // ===== excel download
  const hanldeExcelDownload = async () => {
    let _startDate = moment(searchDate.startDate).format('YYYYMMDD')
    let _endDate = moment(searchDate.endDate).format('YYYYMMDD')
    let res = await excelDownloadIVT('request', _startDate, _endDate)
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
    <PageLayout currentMenu={'invest'} currentCate={'static'} currentPage={'investReq'}>
      <div className="content_inner page_static">
        <h4 className="page_title">진행 중인 투자심사요청</h4>
        <TermSearchForm searchDate={searchDate} setSearchDate={setSearchDate} getList={getList} />
        {searchDate && (
          <div className="search_info">
            <span className={'start_date'}>{dateFormatUnitSplit(searchDate.startDate)}</span> ~{' '}
            <span className="end_date">{dateFormatUnitSplit(searchDate.endDate)}</span> 투자심사요청
          </div>
        )}

        {/*static_table start*/}
        <div className="static_table ">
          <table className="table type02">
            <caption>진행 중인 투자심사요청 테이블</caption>
            <colgroup>
              <col width={'20%'} />
              <col width={'20%'} />
              <col width={'20%'} />
              <col width={'15%'} />
              <col width={'*'} />
            </colgroup>
            <thead>
              <tr>
                <th>날짜</th>
                <th>투자사</th>
                <th>투자희망기업</th>
                <th>결과</th>
                <th>투자예정액(원)</th>
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
                    <td className={'ta_center'}>{item.displayDate}</td>
                    <td className={'ta_center'}>{item.invmCmpNm}</td>
                    <td className={'ta_center'}>{item.rqstEnprNm}</td>
                    <td className={'ta_center'}>
                      <span className={getResultStatusClassName(item)}>{item.exntRsltNm}</span>
                    </td>
                    <td className={'ta_center'}>{item.invmPrfrScdlAmtStr}</td>
                  </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th className={'ta_right'} colSpan={5}>
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

export default InvestReq
