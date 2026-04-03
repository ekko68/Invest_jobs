import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react'

import NoResult from 'components/common/NoResult'
import Paging from 'pageComponents/common/Paging'
import StatusSelect from 'pageComponents/common/StatusSelect'

import { getFunc, setFunc } from 'modules/utils/ReactUtils'
import ResponseUtils from 'modules/utils/ResponseUtils'
import DateUtils from 'modules/utils/DateUtils'
import LabelUtils from 'modules/utils/LabelUtils'
import { ListType, UsisType } from 'modules/consts/BizConst'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import { createKey } from 'modules/utils/CommonUtils'
import Button from 'components/atomic/Button'
import { excelDownloadIvtByPostConfigOption } from 'modules/utils/CommonUtils'
import Api from 'modules/consts/Api'
import { getPostConfig } from 'modules/utils/CommonAxios'
import moment from 'moment'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { colors } from 'assets/style/style.config'
import dayjs from 'dayjs'

const RequestList = forwardRef((props, ref) => {
  const {
    setBadgeCnt,
    loadCompanySendRequestCnt,
    history,
    apiUrl,
    routerUrl,
    usisType,
    listType,
    noResultMsg,
    numberProperty = 'name',

    format
  } = props

  const commonContext = useContext(CommonContext)

  const [list, setList] = useState([])

  const statusSelectRef = useRef()
  const pagingRef = useRef()
  const pageRef = useRef(1)
  const totalPageRef = useRef(1)
  const [searchParams, setSearchParams] = useState({
    searchFromDate: moment(new Date()).format('YYYYMMDD'),
    searchToDate: moment(new Date()).format('YYYYMMDD'),
    searchComNm: '',
    searchBzn: ''
  })
  const [disabledDate, setDisabledDate] = useState('on')

  const [active, setActive] = useState({
    Y: 'period_btn_tab active',
    N: 'period_btn_tab',
    type: '1'
  })

  useImperativeHandle(ref, () => ({
    setData
  }))

  const setData = async () => {
    await loadAuditList()
  }

  const onClickDetail = (item) => {
    let url =
      routerUrl +
      '?invmExntRqstId=' +
      item['invmExntRqstId'] +
      '&type=' +
      (listType === ListType.SEND ? 'send' : 'receive')
    history.push(url)
  }

  const onChangePage = async (pageNumber) => {
    pageRef.current = pageNumber
    await commonContext.actions.callbackAfterSessionRefresh(loadAuditList, true, true)
  }

  const onChangeStatusSelect = async () => {
    pageRef.current = 1
  }

  const loadAuditList = async () => {
    const invmExntPgsgCd = getFunc(statusSelectRef, 'getSelectedCode')
    const params = {
      searchComNm: searchParams.searchComNm,
      searchBzn: searchParams.searchBzn,
      searchFromDate: searchParams.searchFromDate,
      searchToDate: searchParams.searchToDate,
      page: pageRef.current,
      record: 5,
      pageSize: 5,
      invmExntPgsgCd: invmExntPgsgCd
    }

    const pageRes = await ResponseUtils.getSimpleResponse(apiUrl, params, true)
    if (pageRes) {
      pageRef.current = pageRes['page']
      totalPageRef.current = pageRes['totalPage']
      setFunc(pagingRef, 'setPaging', pageRes)
      setList(pageRes['list'])

      if (setBadgeCnt) {
        setBadgeCnt(pageRes.badgeCntMap[ListType.RECEIVE], pageRes.badgeCntMap[ListType.SEND])
      }
    }

    if (usisType === UsisType.COMPANY && listType === ListType.SEND && loadCompanySendRequestCnt) {
      await loadCompanySendRequestCnt()
    }
  }

  // 엑셀 목록 다운로드
  const handleExcelDownload = async () => {
    const invmExntPgsgCd = getFunc(statusSelectRef, 'getSelectedCode')
    const params = {
      searchComNm: searchParams.searchComNm,
      searchBzn: searchParams.searchBzn,
      searchFromDate: moment(searchParams.searchFromDate).format('YYYYMMDD'),
      searchToDate: moment(searchParams.searchToDate).format('YYYYMMDD'),
      comType: listType,
      invmExntPgsgCd: invmExntPgsgCd,
      bizrno: '',
      excelDownKey: listType === ListType.RECEIVE ? 'request' : 'send'
    }

    await excelDownloadIvtByPostConfigOption(
      // content-disposition header 인코딩이 utf-8로 세팅할 경우에도 깨지는 현상 있음 -> 사용자 지정 파일명 세팅
      getPostConfig(Api.my.vc.auditListExcelDown, params),
      listType === ListType.RECEIVE
        ? '투자심사 받은 요청 리스트_' + moment(new Date()).format('YYYYMMDD')
        : '투자심사 보낸 요청 리스트_' + moment(new Date()).format('YYYYMMDD')
    )
  }

  // 엑셀 세부내용 다운로드
  const handleExcelDetailDownload = async () => {
    const invmExntPgsgCd = getFunc(statusSelectRef, 'getSelectedCode')
    const params = {
      searchComNm: searchParams.searchComNm,
      searchBzn: searchParams.searchBzn,
      searchFromDate: moment(searchParams.searchFromDate).format('YYYYMMDD'),
      searchToDate: moment(searchParams.searchToDate).format('YYYYMMDD'),
      comType: listType,
      invmExntPgsgCd: invmExntPgsgCd,
      bizrno: '',
      excelDownKey: listType === ListType.RECEIVE ? 'request' : 'send'
    }

    await excelDownloadIvtByPostConfigOption(
      // content-disposition header 인코딩이 utf-8로 세팅할 경우에도 깨지는 현상 있음 -> 사용자 지정 파일명 세팅
      getPostConfig(Api.my.vc.auditDetailExcelDown, params),
      listType === ListType.RECEIVE
        ? '투자심사 받은 요청 세부내용_' + moment(new Date()).format('YYYYMMDD')
        : '투자심사 보낸 요청 세부내용_' + moment(new Date()).format('YYYYMMDD')
    )
  }

  // 기간 선택
  const selectDate = (gubun) => {
    let now = new Date()
    let newDate = ''
    if (gubun === '1') {
      newDate = new Date(now.setMonth(now.getMonth() - 1))
      setSearchParams({ ...searchParams, searchFromDate: moment(newDate).format('YYYYMMDD') })
      setDisabledDate('on')
      setActive({ ...active, type: '1' })
    } else if (gubun === '3') {
      newDate = new Date(now.setMonth(now.getMonth() - 3))
      setSearchParams({ ...searchParams, searchFromDate: moment(newDate).format('YYYYMMDD') })
      setDisabledDate('on')
      setActive({ ...active, type: '3' })
    } else if (gubun === '6') {
      newDate = new Date(now.setMonth(now.getMonth() - 6))
      setSearchParams({ ...searchParams, searchFromDate: moment(newDate).format('YYYYMMDD') })
      setDisabledDate('on')
      setActive({ ...active, type: '6' })
    } else if (gubun === 'all') {
      newDate = new Date(now.setFullYear(now.getFullYear() - 4))
      setSearchParams({ ...searchParams, searchFromDate: moment(newDate).format('YYYYMMDD') })
      setDisabledDate('on')
      setActive({ ...active, type: 'all' })
    } else {
      setDisabledDate('off')
      setActive({ ...active, type: 'none' })
    }
  }
  // 달력 값 셋팅
  const onDatePickerChange = (currentDate, id) => {
    const year = currentDate.$y
    const month = currentDate.$M < 10 ? '0' + Number(currentDate.$M + 1) : currentDate.$M
    const day = currentDate.$D < 10 ? '0' + currentDate.$D : currentDate.$D
    const ymd = year + month + day

    if (id === 'start') {
      setSearchParams({ ...searchParams, searchFromDate: moment(ymd).format('YYYYMMDD') })
    } else {
      setSearchParams({ ...searchParams, searchToDate: moment(ymd).format('YYYYMMDD') })
    }
  }

  // 검색조건 입력 함수
  const onChangeText = (val, gubun) => {
    const regex = /^[0-9]*$/
    if (gubun === 'bzn') {
      if (regex.test(val)) {
        setSearchParams({
          ...searchParams,
          searchBzn: val
        })
      }
    } else {
      setSearchParams({
        ...searchParams,
        searchComNm: val
      })
    }
  }

  // 초기화 버튼
  const clearData = () => {
    let now = new Date()
    let oneMonthBefore = new Date(now.setMonth(now.getMonth() - 1))

    setFunc(statusSelectRef, 'selectedSetLabel', 'all')

    setSearchParams({
      ...searchParams,
      searchFromDate: moment(oneMonthBefore).format('YYYYMMDD'),
      searchToDate: moment(new Date()).format('YYYYMMDD'),
      searchComNm: '',
      searchBzn: ''
    })
    setDisabledDate('on')
    setActive({ ...active, type: '1' })
  }

  useEffect(() => {
    let now = new Date()
    let oneMonthBefore = new Date(now.setMonth(now.getMonth() - 1))
    setSearchParams({ ...searchParams, searchFromDate: moment(oneMonthBefore).format('YYYYMMDD') })
  }, [])

  return (
    <>
      <div className="info_header">
        <div className="basic_wrap inquiry_section">
          <div className="info_header">
            <h3 className="ico_title">{listType === ListType.RECEIVE ? '받은 요청' : '보낸 요청'} 리스트</h3>
          </div>
          <div className="info_table inquiry_table">
            <table className="table type03">
              <caption>기본정보 테이블</caption>
              <colgroup>
                <col width={'12%'} />
                <col width={'38%'} />
                <col width={'12%'} />
                <col width={'38%'} />
              </colgroup>
              <tbody>
                <tr>
                  <th>신청일자</th>
                  <td colSpan={3}>
                    {/* disabled 상태일 때
                        1. DatePicker 에 disabled 추가 */}
                    <div className="period_calendar">
                      <DatePicker
                        className="datepicker"
                        value={dayjs(searchParams.searchFromDate)}
                        format={format}
                        name={numberProperty}
                        slotProps={{ textField: { size: 'small' } }}
                        sx={{ width: '150px' }}
                        disabled={disabledDate === 'on' ? true : false}
                        onChange={(currentDate) => onDatePickerChange(currentDate, 'start')}
                      />
                      <span className="datepicker_dash">~</span>
                      <DatePicker
                        className="datepicker"
                        value={dayjs(searchParams.searchToDate)}
                        format={format}
                        name={numberProperty}
                        slotProps={{ textField: { size: 'small' } }}
                        sx={{ width: '150px' }}
                        disabled={disabledDate === 'on' ? true : false}
                        onChange={(currentDate) => onDatePickerChange(currentDate, 'end')}
                      />
                    </div>
                    <div className="period_tab_wrap">
                      {/* 선택된 날짜버튼 date 에 active 클래스 추가  */}
                      <button className={active.type === 'all' ? active.Y : active.N} onClick={() => selectDate('all')}>
                        전체
                      </button>
                      <button className={active.type === '1' ? active.Y : active.N} onClick={() => selectDate('1')}>
                        1개월
                      </button>
                      <button className={active.type === '3' ? active.Y : active.N} onClick={() => selectDate('3')}>
                        3개월
                      </button>
                      <button className={active.type === '6' ? active.Y : active.N} onClick={() => selectDate('6')}>
                        6개월
                      </button>
                      <button
                        className={active.type === 'none' ? active.Y : active.N}
                        onClick={() => selectDate('none')}
                      >
                        기간선택
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>
                    <label htmlFor="companyName">기업명</label>
                  </th>
                  <td>
                    <input
                      type="text"
                      className="input"
                      id="companyName"
                      title="기업명"
                      placeholder="기업명을 입력해주세요"
                      value={searchParams.searchComNm}
                      onChange={(event) => onChangeText(event.target.value, 'comNm')}
                    />
                  </td>
                  <th>
                    <label htmlFor="businessNum">사업자번호</label>
                  </th>
                  <td>
                    <input
                      type="text"
                      className="input"
                      id="businessNum"
                      title="사업자번호"
                      placeholder="사업자번호를 입력해주세요"
                      value={searchParams.searchBzn}
                      onChange={(event) => onChangeText(event.target.value, 'bzn')}
                      maxLength={10}
                    />
                  </td>
                </tr>
                <tr>
                  <th>
                    <label htmlFor="companyName">상태</label>
                  </th>
                  <td>
                    <StatusSelect ref={statusSelectRef} title="투자심사단계" onChange={onChangeStatusSelect} />
                  </td>
                  {/* s: 1022 추가 */}
                  {/* <th>
                    <label htmlFor="receptionCategory">접수 구분</label>
                  </th>
                  <td>
                    <StatusSelect
                      id="receptionCategory"
                      ref={statusSelectRef}
                      title="접수구분"
                      onChange={onChangeStatusSelect}
                    />
                  </td> */}
                  {/* e: 1022 추가 */}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="inquiry_btn_group">
          <Button
            type={'linear'}
            theme={colors.blue}
            onClick={() => {
              clearData()
            }}
          >
            초기화
          </Button>
          <Button theme={colors.blue} onClick={() => loadAuditList()}>
            조회
          </Button>
        </div>
      </div>
      <div className="table_wrap">
        <table className="table">
          <caption>{listType === ListType.RECEIVE ? '받은 요청' : '보낸 요청'} 리스트 테이블</caption>
          <colgroup>
            <col width={'5%'} />
            <col width={'20%'} />
            <col width={'53%'} />
            <col width={'15%'} />
            <col width={'12%'} />
          </colgroup>
          <thead>
            <tr>
              <th>NO</th>
              <th>기관</th>
              <th>내용</th>
              <th>{listType === ListType.RECEIVE ? '받은날짜' : '보낸날짜'}</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {list?.length > 0 ? (
              list.map((item, index) => (
                <tr key={createKey()} style={{ cursor: 'pointer' }} onClick={() => onClickDetail(item)}>
                  <td>{item['rnum']}</td>
                  <td>{usisType === UsisType.COMPANY ? item['invmCmpBplcNm'] : item['rqstBplcNm']}</td>
                  <td className="content">
                    {usisType === UsisType.COMPANY
                      ? listType === ListType.RECEIVE
                        ? item['prplMsgCon']
                        : item['rqstMsgCon']
                      : listType === ListType.RECEIVE
                      ? item['rqstMsgCon']
                      : item['prplMsgCon']}
                  </td>
                  <td>{DateUtils.convertYyyyMmDdNormalDate(item['invmSttgDt'])}</td>
                  <td>
                    <p className={LabelUtils.getBadgeStyle(String(item['invmExntPgsgNm']))}>{item['invmExntPgsgNm']}</p>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>
                  <NoResult msg={noResultMsg} style={{ marginTop: '40px', marginBottom: '40px' }} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* s: 1022 추가 */}
      {/* <div className="table_wrap">
        <table className="table">
          <caption>접수구분 리스트 테이블</caption>
          <colgroup>
            <col width={'5%'} />
            <col width={'10%'} />
            <col width={'15%'} />
            <col width={'12%'} />
            <col width={'10%'} />
            <col width={'24%'} />
            <col width={'12%'} />
            <col width={'12%'} />
          </colgroup>
          <thead>
            <tr>
              <th>NO</th>
              <th>신청일자</th>
              <th>기업명</th>
              <th>사업자번호</th>
              <th>설립일자</th>
              <th>내용</th>
              <th>상태</th>
              <th>접수구분</th>
            </tr>
          </thead>
          <tbody>
            {list?.length > 0 ? (
              list.map((item, index) => (
                <tr key={createKey()} style={{ cursor: 'pointer' }} onClick={() => onClickDetail(item)}>
                  <td>{item['rnum']}</td>
                  <td>2024.10.22</td>
                  <td>블레이저소프트</td>
                  <td>98765433</td>
                  <td>2024.10.22</td>
                  <td className="content">내용자리 입니다.</td>
                  <td>심사중</td>
                  <td>IBK 벤처투자</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8}>
                  <NoResult msg={noResultMsg} style={{ marginTop: '40px', marginBottom: '40px' }} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div> */}
      {/* e: 1022 추가 */}
      <div className={'btn_group'}>
        <Button
          className={'blue'}
          style={{ margin: '10px', padding: '10px', float: 'right', cursor: 'pointer' }}
          onClick={handleExcelDownload}
        >
          목록 엑셀 다운로드
        </Button>

        <Button
          className={'blue'}
          style={{ margin: '10px', padding: '10px', float: 'right', cursor: 'pointer' }}
          onClick={handleExcelDetailDownload}
        >
          세부내용 엑셀 다운로드
        </Button>
      </div>
      <div className="pagination_wrap">
        <Paging ref={pagingRef} onChangePage={onChangePage} onPrev={onChangePage} onNext={onChangePage} />
      </div>
    </>
  )
})

export default RequestList
