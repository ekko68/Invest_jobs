import { useTheme } from '@mui/material'
import NoResult from 'components/NoResult'
import PageLayout from 'components/PageLayout'
import Pagination from 'components/Pagination'
import SearchForm from 'components/SearchForm'
import Toggle from 'components/Toggle'
import Button from 'components/atomic/Button'
import Select from 'components/atomic/Select'
import { getTotalNumberBoard } from 'modules/common'
import { UserContext } from 'modules/common/UserContext'
import Api from 'modules/consts/Api'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { createKey } from 'modules/fns/commonFn'
import CommonAxios from 'modules/utils/CommonAxios'
import { excelDownloadIvtByPostConfigOption, getConfig, getPostConfig } from 'modules/utils/CommonUtils'
import moment from 'moment'
import { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'

const FncnBsnsPbanList = (props) => {
  const theme = useTheme()
  const userContext = useContext(UserContext)
  const history = useHistory()
  const [paging, setPaging] = useState({})
  const pageRef = useRef(1)
  const totalPageRef = useRef(1)
  const activeRef = useRef('')
  const activeRefTwo = useRef('')
  const searchSelectSort = useRef(null)
  const [defaultSelectSort,setDefaultSelectSort] = useState({
    active: '',
    list: [
      { id: '', value: '', label: '전체' },
      { id: '01', value: '01', label: '선정공고' },
      { id: '02', value: '02', label: '접수현황' },
      { id: '03', value: '03', label: '선정결과' }
    ]
  })
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState({
    active: 'searchFncnBsnsPbanTtlNm',
    list: [
      { id: 'searchFncnBsnsPbanTtlNm', value: 'searchFncnBsnsPbanTtlNm', label: '제목' },
      { id: 'searchRgsrNm', value: 'searchRgsrNm', label: '등록자' },
      { id: 'searchFncnBsnsPbanNo', value: 'searchFncnBsnsPbanNo', label: '공고코드' }
    ]
  })
  
  const [isUpdate, setIsUpdate] = useState(false)
  const [list, setList] = useState([])

  // 공고 리스트 조회
  const getListData = async()=> {
    const params = {
      page: pageRef.current,
      record: 10,
      pageSize: 10,
      selectFncnBsnsPbanDcd: activeRef.current,
      searchFncnBsnsPbanNo: activeRefTwo.current === 'searchFncnBsnsPbanNo' ? searchInput: '',
      searchRgsrNm: activeRefTwo.current === 'searchRgsrNm' ? searchInput: '',
      searchFncnBsnsPbanTtlNm: activeRefTwo.current === 'searchFncnBsnsPbanTtlNm' ? searchInput: ''
    }
    
    let res = await CommonAxios('IVT', getConfig(Api.invest.fncnBsnsPbanList, params))

    if(res.data.code === '200') {
      if(res.data.data.list.length > 0) {
        const response = res.data.data
        setPaging({
          endPage: response.endPage,
          next: response.next,
          page: response.page,
          prev: response.prev,
          record: response.record,
          startPage: response.startPage,
          total: response.total,
          totalPage: response.totalPage
        })

        const resArr = []
        response.list.forEach((item,i) => {
          if(item.fncnBsnsPbanDcd === '01') {
            item.fncnBsnsPbanDcd = '선정공고'
          }else if(item.fncnBsnsPbanDcd === '02'){
            item.fncnBsnsPbanDcd = '접수현황'
          }else if(item.fncnBsnsPbanDcd === '03') {
            item.fncnBsnsPbanDcd = '선정결과'
          } 
          const resObj = {
            ...item,
            seq: i+1
          }
          resArr.push(resObj)
        })
        let cnt = 0
        for (let i = response.startPage; i <= response.endPage; i++) {
          cnt++
        }
        totalPageRef.current = cnt
        setList(resArr)
      }else {
        setList([])
      }
    }
  }

  // 상태 변경
  const handleToggle = async(e, data)=> {
    if(data.delYn === 'N') {
      data.delYn = 'Y'
    }else {
      data.delYn = 'N'
    }
    const params = {
      ...data,
      delYn : data.delYn
    }
    
    await CommonAxios('IVT', getPostConfig(Api.invest.fncnBsnsPbanStateUpd, params))
    setIsUpdate(!isUpdate)
  }

  // 상태 셀렉트박스
  const onSelectActive = (selected) => {
    setDefaultSelectSort({ ...defaultSelectSort, active: selected })
    activeRef.current = selected
    setIsUpdate(!isUpdate)

    getListData()
  }

  // 검색 상태 셀렉트박스
  const onSelectActive2 = (selected)=> {
    setSearch({...search, active : selected})
    activeRefTwo.current = selected
    pageRef.current = 1
    setSearchInput('')
  }

  // == excel download
  const handleExcelDownload = async () => {
    const params = {
      page: pageRef.current,
      record: 20,
      pageSize: 5
    }

    await excelDownloadIvtByPostConfigOption(
      // content-disposition header 인코딩이 utf-8로 세팅할 경우에도 깨지는 현상 있음 -> 사용자 지정 파일명 세팅
      getPostConfig(Api.invest.excelFncnBsnsPbanList, params),
      '출자사업 공고' + moment(new Date()).format('YYYYMMDD')
    )
  }

  // ===== 페이징
  const handlePaging = useCallback(
    (event) => {
      let params = {
        ...paging,
        page: event.page
      }
      pageRef.current = event.page
      setPaging(params)
      getListData()
    },
    [paging]
  )

  // ===== reset
  const handleReset = useCallback(() => {
    activeRef.current = ''
    activeRefTwo.current = 'searchFncnBsnsPbanTtlNm'
    setSearchInput('')
    setSearch({...search, active : 'searchFncnBsnsPbanTtlNm'})
    setDefaultSelectSort({...defaultSelectSort, active : ''})
    pageRef.current = 1
    
    getListData()
  },[activeRef, activeRefTwo])

  useLayoutEffect(() => {
    if ('eventListTab' !== userContext.state.category) {
      userContext.actions.setCategory('eventListTab')
      handleReset()
    }
  }, [userContext.state.category])
  
  useEffect(()=> {
    activeRefTwo.current = 'searchFncnBsnsPbanTtlNm'
    if(props.location.state !== undefined) {
      pageRef.current = props.location.state
      let params = {
        ...paging,
        page: props.location.state
      }
      setPaging(params)
    }
    getListData()
  },[])

  return (
    <PageLayout currentMenu={'invest'} currentCate={'fncnBsns'} currentPage={'fncnBsnsPbanList'}>
      {/* {maximumAlert && <PopupAlert msg={alertMsg} handlePopup={handleMaximunAlert} />} */}
      <div className="content_inner page_invest_user">
        <div className="page_header">
          <h4 className="page_title mb_none">출자사업 공고</h4>

          <div className="page_header_right">
            <div className="btn_group">
              <Select
                className="select_sort"
                optionList={defaultSelectSort}
                handleSelectActive={(selected) => {
                  onSelectActive(selected)
                }}
                ref={searchSelectSort}
              />
              <button className={'btn_refresh'} title={'새로고침'} onClick={handleReset}>
                <span className="hide">새로고침</span>
              </button>
              <button className="excel_down" title={'엑셀다운로드'} onClick={() => {handleExcelDownload()}}>
                <img src={require('assets/images/ico_excel.png').default} alt="엑셀 아이콘" />
              </button>
              <Button className={'full_blue'} onClick={() => {history.push(ROUTER_NAMES.INVEST_FNCN_BSNS_PBAN_VIEW, {type : 'write'})}}>
                공고 등록
              </Button>
            </div>
          </div>
        </div>
        {/*table_wrap start*/}
        <div className="table_wrap ">
          <table className="table ">
            <caption>순번, 구분, 공고코드, 제목, 등록자, 등록일, 상태 정보 테이블</caption>
            <colgroup>
              <col width={'4%'} />
              <col width={'12%'} />
              <col width={'12%'} />
              <col width={'*'} />
              <col width={'10%'} />
              <col width={'14%'} />
              <col width={'12%'} />
            </colgroup>
            <thead>
              <tr>
                <th>순번</th>
                <th>구분</th>
                <th>공고코드</th>
                <th>제목</th>
                <th>등록자</th>
                <th>등록일</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {
                list.length > 0 ? 
                  list.map((item, idx)=> (
                    <tr key={createKey()}>
                      <td className={'ta_center'}>{getTotalNumberBoard(paging.total, paging.page, paging.record, idx)}</td>
                      <td className={'ta_center'}>{item.fncnBsnsPbanDcd}</td>
                      <td className={'ta_center'}>{item.fncnBsnsPbanNo}</td>
                      <td className={'ta_left'} style={{ cursor: 'pointer' }} 
                        onClick={() => {history.push(ROUTER_NAMES.INVEST_FNCN_BSNS_PBAN_VIEW + '?fncnBsnsPbanNo=' + item.fncnBsnsPbanNo, 
                        {type : 'detail', data : item, pageNum : pageRef.current, searchCon : searchInput, activeOption : search })}}>
                        {item.fncnBsnsPbanTtlNm}
                      </td>
                      <td className={'ta_center'}>{item.rgsrNm}</td>
                      <td className={'ta_center'}>{item.iibsFrrgTs}</td>
                      <td className={'ta_center'}>
                        <Toggle
                          className="pale_blue"
                          data={{
                            id: 'toggle' + idx,
                            value: '',
                            status: item?.delYn === 'N' ? true : false
                          }}
                          onChange={(e) => {handleToggle(e, item)}}
                        />
                      </td>
                    </tr>
                  )) : 
                <tr>
                  <td colSpan={7}>
                    <NoResult />
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        {/*table_wrap end*/}
        <div className={'paging_wrap'}>{paging && <Pagination pagingData={paging} handlePaging={handlePaging} />}</div>
        <SearchForm
          selectList={search}
          onSelectActive={onSelectActive2}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          handleSearch={()=> {
            pageRef.current = 1
            getListData()
          }}
        />
      </div>
    </PageLayout>
  )
}

export default FncnBsnsPbanList
