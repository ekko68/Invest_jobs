import Button from 'components/atomic/Button'
import Select from 'components/atomic/Select'
import PageLayout from 'components/PageLayout'
import Pagination from 'components/Pagination'
import ko from 'date-fns/locale/ko'
import { MktContext, } from 'modules/common/MktContext'
import { UserContext } from 'modules/common/UserContext'
import moment from 'moment'
import AuditTableInfoList from 'pageComponents/invest/audit/AuditTableInfoList'
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import Api from '../../../modules/consts/Api'
import CommonAxios from '../../../modules/utils/CommonAxios'
import { getConfig } from '../../../modules/utils/CommonUtils'

const AuditInfoList = (props) => {
  const { selectList, selectListResult, selectListSort, value } = props

  const searchSelect = useRef(null)
  const searchSelectResult = useRef(null)
  const searchSelectSort = useRef(null)
  const totalPageRef = useRef(0)
  const EXN00002Ref = useRef(0)
  const [defaultSelect, setDefaultSelect] = useState({
    active: 'all',
    list: [
      { id: 'all', value: 'all', label: '전체' },
      { id: 'EXN00001', value: 'EXN00001', label: '신청' },
      { id: 'EXN00002', value: 'EXN00002', label: '심사중' },
      { id: 'EXN00003', value: 'EXN00003', label: '심사완료' }
    ]
  })

  const [defaultSelectResult, setDefaultSelectResult] = useState({
    active: 'all',
    list: [
      { id: 'all', value: 'all', label: '전체' },
      { id: 'EXN01000', value: 'EXN01000', label: '투자승인' },
      { id: 'EXN01002', value: 'EXN01002', label: '투자미승인' },
      { id: 'EXN01001', value: 'EXN01001', label: '투자보류' }
    ]
  })

  const [defaultSelectSort, setDefaultSelectSort] = useState({
    active: 'date',
    list: [
      { id: 'date', value: 'date', label: '신청일순' },
      { id: 'company', value: 'company', label: '기업명순' },
      { id: 'bzn', value: 'bzn', label: '사업자번호순' },
      { id: 'state', value: 'state', label: '상태순' }
    ]
  })

  const [searchParams, setSearchParams] = useState({
    searchFromDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    searchToDate: new Date(),
    searchComNm: '',
    searchBzn: '',
    searchType: 'date'
  })
  
  const userContext = useContext(UserContext)
  const pageRef = useRef(1)
  const mktContext = useContext(MktContext)
  const [paging, setPaging] = useState(null)

  const [list, setList] = useState([{}])
  const [disabledDate, setDisabledDate] = useState('on')
  const [active, setActive] = useState({
    Y: 'btn_tab active',
    N: 'btn_tab',
    type: '1'
  })

  // ===== datepicker
  const onChangeDate = (currentDate, type, type2) => {
    // type: 신청기간인지 진행기간인지, type2: 시작일인지 종료일인지
    if (type === 'date1') {
      type2 === 'start'
      ? setSearchParams({
          ...searchParams,
          searchFromDate: currentDate
        })
      : setSearchParams({
          ...searchParams,
          searchToDate: currentDate
      })
    }
  }

  // 기간 선택
  const selectDate = (gubun) => {
    let now = new Date()
    let newDate = ''
    document.querySelector('.period_calendar').style.backgroundColor = '#f1f2f4'
    if (gubun === '1') {
      newDate = new Date(now.setMonth(now.getMonth() - 1))
      setSearchParams({ ...searchParams, searchFromDate: new Date(newDate) })
      setActive({ ...active, type: '1' })
      setDisabledDate('on')
    } else if (gubun === '3') {
      newDate = new Date(now.setMonth(now.getMonth() - 3))
      setSearchParams({ ...searchParams, searchFromDate: new Date(newDate) })
      setActive({ ...active, type: '3' })
      setDisabledDate('on')
    } else if (gubun === '6') {
      newDate = new Date(now.setMonth(now.getMonth() - 6))
      setSearchParams({ ...searchParams, searchFromDate: new Date(newDate) })
      setActive({ ...active, type: '6' })
      setDisabledDate('on')
    } else if (gubun === 'all') {
      newDate = new Date(now.setFullYear(now.getFullYear() - 4))
      setSearchParams({ ...searchParams, searchFromDate: new Date(newDate) })
      setActive({ ...active, type: 'all' })
      setDisabledDate('on')
    } else {
      console.log('기간선택 ')
      setActive({ ...active, type: 'none' })
      setDisabledDate('off')

      document.querySelector('.period_calendar').style.backgroundColor = '#ffffff'
    }
  }

  // 직접투자 심사내역 리스트 조회
  const investAuditList = async (selected) => {
    let startYear = searchParams.searchFromDate.getFullYear().toString()
    let startMonth =
      (searchParams.searchFromDate.getMonth() + 1) < 10
        ? '0' + (searchParams.searchFromDate.getMonth() + 1)
        : searchParams.searchFromDate.getMonth() +1
    let startDays =
      searchParams.searchFromDate.getDate() < 10
        ? '0' + searchParams.searchFromDate.getDate().toString()
        : searchParams.searchFromDate.getDate().toString()

    let startYmd = startYear + startMonth.toString() + startDays

    let endYear = searchParams.searchToDate.getFullYear().toString()
    let endMonth =
      (searchParams.searchToDate.getMonth() + 1) < 10
        ? '0' + (searchParams.searchToDate.getMonth() + 1)
        : searchParams.searchToDate.getMonth() + 1
    let endDays =
      searchParams.searchToDate.getDate() < 10
        ? '0' + searchParams.searchToDate.getDate().toString()
        : searchParams.searchToDate.getDate().toString()

    let endYmd = endYear + endMonth.toString() + endDays
  
    const params = {
      searchComNm: searchParams.searchComNm,
      searchBzn: searchParams.searchBzn,
      searchFromDate: startYmd,
      searchToDate: endYmd,
      searchType: selected === undefined ? 'date' : selected,
      searchResStatus: defaultSelectResult.active,
      searchStatus: defaultSelect.active,
      page: pageRef.current,
      record: 10,
      pageSize: 5
    }

    let res = await CommonAxios('IVT', getConfig(Api.invest.auditReceiveList, params))

    if (res.data.data.list.length > 0) {

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
      totalPageRef.current = res.data.data.total
      EXN00002Ref.current = res.data.data.badgeCnt
      for (let i = 0; i < res.data.data.list.length; i++) {
        if (res.data.data.list[i].invmExntPgsgCd === 'EXN00001') {
          res.data.data.list[i].invmExntPgsgNm = '신청'
        }

        if (res.data.data.list[i].exntRsltCdNm !== null) {
          res.data.data.list[i].exntRsltCdNm = '투자' + res.data.data.list[i].exntRsltCdNm
        }
        res.data.data.list[i].invmSttgDt = moment(res.data.data.list[i].invmSttgDt).format('YYYY-MM-DD')
      }

      setList(res.data.data.list)
    } else {
      setList([])
      totalPageRef.current = 0
    }
  }

  //===== 페이징
  const handlePaging = (param) => {
    let params = {
      ...mktContext.state.bannerParam,
      ...param
    }
    mktContext.actions.handleSetBannerParam(params)
    pageRef.current = param.page
    investAuditList()
  }

  // ===== reset
  const handleReset = () => {
    mktContext.actions.handleSetBannerCurrType('webMain')
  }

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

    setSearchParams({
      ...searchParams,
      searchFromDate: oneMonthBefore,
      searchToDate: new Date(),
      searchComNm: '',
      searchBzn: '',
      searchType: 'date'
    })
    setActive({ ...active, type: '1' })
    setDefaultSelectResult({...defaultSelectResult, active : 'all'})
    setDefaultSelect({...defaultSelect, active: 'all'})
    setDefaultSelectSort({...defaultSelectSort, active: 'date'})
    setDisabledDate('on')
  }

  useLayoutEffect(() => {
    if ('webMain' !== userContext.state.category) {
      userContext.actions.setCategory('webMain')
      handleReset()
    }
  }, [userContext.state.category])

  useEffect(() => {
    if(props.location.state !== undefined) {
      searchParams.searchFromDate = props.location.state.searchParams.searchFromDate
      searchParams.searchToDate = props.location.state.searchParams.searchToDate
      searchParams.searchBzn = props.location.state.searchParams.searchBzn
      searchParams.searchComNm = props.location.state.searchParams.searchComNm
      searchParams.searchType = props.location.state.searchParams.searchType
      defaultSelectSort.active = props.location.state.defaultSelectSort.active
      defaultSelectResult.active = props.location.state.defaultSelectResult.active
      defaultSelect.active = props.location.state.defaultSelect.active
      active.type = props.location.state.active.type
    }
    investAuditList()
  }, [])

  return (
    <>
      <PageLayout currentMenu={'invest'} currentCate={'auditMngm'} currentPage={'auditInfoList'}>
        <div className="content_inner page_main">
          <div className="page_header">
            <h4 className="page_title">투자희망신청현황</h4>
          </div>
          <div className="commerce_banner_wrap">
            <div className={'maximum_notice'}>
              <p className="highlight_grey">투자유치를 희망하는 사업의 신청 내역입니다.</p>
            </div>
            <div className={'search_table_wrap'}>
              <table className="table_search">
                <caption>투자 희망 신청 검색 테이블</caption>
                <colgroup>
                  <col width={'15%'} />
                  <col width={'31.2%'} />
                  <col width={'15%'} />
                  <col width={'*'} />
                </colgroup>
                <tbody>
                  <tr>
                    <th>신청일자</th>
                    <td colSpan={3}>
                      <div className="period_calendar disabled">
                        <DatePicker
                          selected={searchParams.searchFromDate ? searchParams.searchFromDate : null}
                          onChange={(currentDate) => onChangeDate(currentDate, 'date1', 'start')}
                          locale={ko}
                          dateFormat={'yyyy-MM-dd'}
                          maxDate={searchParams.searchToDate ? searchParams.searchToDate : null}
                          title={'기간조회'}
                          disabled={disabledDate === 'on' ? true : false}
                        />
                        <span>~</span>
                        <DatePicker
                          selected={searchParams.searchToDate ? searchParams.searchToDate : null}
                          onChange={(currentDate) => onChangeDate(currentDate, 'date1', 'end')}
                          locale={ko}
                          dateFormat={'yyyy-MM-dd'}
                          minDate={searchParams.searchFromDate ? searchParams.searchFromDate : null}
                          title={'기간조회'}
                          disabled={disabledDate === 'on' ? true : false}
                        />
                      </div>
                      <div className="tab_wrap">
                        {/* 선택된 날짜버튼 date 에 active 클래스 추가  */}
                        <button
                          className={active.type === 'all' ? active.Y : active.N}
                          onClick={() => selectDate('all')}
                        >
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
                    {/* <th>관리번호</th>
                    <td>
                      <input
                        name={''}
                        type="text"
                        className="input"
                        value={value}
                        defaultValue={value}
                        title={'관리번호 입력'}
                        placeholder={'관리번호 입력'}
                      />
                    </td> */}
                    <th>기업명</th>
                    <td>
                      <input
                        name={''}
                        type="text"
                        className="input"
                        title={'기업명 입력'}
                        placeholder={'기업명 입력'}
                        value={searchParams.searchComNm}
                        onChange={(event) => onChangeText(event.target.value, 'comNm')}
                      />
                    </td>
                    <th>사업자번호</th>
                    <td>
                      <input
                        name={''}
                        type="text"
                        className="input"
                        title={'사업자번호 입력'}
                        placeholder={'사업자번호 입력'}
                        value={searchParams.searchBzn}
                        onChange={(event) => onChangeText(event.target.value, 'bzn')}
                        maxLength={10}
                      />
                    </td>
                  </tr>

                  <tr>
                    <th>심사결과</th>
                    <td>
                      <Select
                        optionList={defaultSelectResult}
                        handleSelectActive={(selected) => {
                          setDefaultSelectResult({ ...defaultSelectResult, active: selected })
                        }}
                        ref={searchSelectResult}
                      />
                    </td>
                    <th>상태</th>
                    <td>
                      <Select
                        optionList={selectList ? selectList : defaultSelect}
                        handleSelectActive={(selected) => {
                          setDefaultSelect({ ...defaultSelect, active: selected })
                        }}
                        ref={searchSelect}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="button_bottom_group">
              <Button
                className={'basic'}
                onClick={() => {
                  clearData()
                }}
              >
                초기화
              </Button>
              <Button
                className={'full_blue'}
                onClick={() => {
                  investAuditList()
                }}
              >
                조회
              </Button>
            </div>
            {/* result_header start*/}
            <div className="result_header">
              <h4 className="result_title">
                심사중 <span className="highlight_red">{EXN00002Ref.current}</span>건
              </h4>
              <div className="btn_group">
                <div className="counter">
                  총<span className="highlight_red">{totalPageRef.current}</span>건
                </div>
                <Select
                  optionList={selectListSort ? selectListSort : defaultSelectSort}
                  handleSelectActive={(selected) => {
                    setDefaultSelectSort({ ...defaultSelectSort, active: selected })
                    investAuditList(selected)
                  }}
                  ref={searchSelectSort}
                />
              </div>
            </div>
            <AuditTableInfoList
              dataList={list}
              paging={paging}
              searchParams={searchParams}
              defaultSelectSort={defaultSelectSort}
              defaultSelectResult={defaultSelectResult}
              defaultSelect={defaultSelect}
              active={active}
            />
            <div className={'paging_wrap'}>
              <Pagination pagingData={paging} handlePaging={handlePaging} />
            </div>
          </div>
          {/*commerce_banner_wrap end*/}
        </div>
      </PageLayout>
    </>
  )
  // }
}

export default AuditInfoList
