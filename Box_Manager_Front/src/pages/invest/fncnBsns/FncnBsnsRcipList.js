import { useTheme } from '@mui/material'
import NoResult from 'components/NoResult'
import PageLayout from 'components/PageLayout'
import Pagination from 'components/Pagination'
import SearchForm from 'components/SearchForm'
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

const FncnBsnsRcipList = (props) => {
  const theme = useTheme()
  const { selectListSort } = props
  const userContext = useContext(UserContext)
  const history = useHistory()
  const searchSelectSort = useRef(null)
  const [defaultSelectSort, setDefaultSelectSort] = useState({
    active: '',
    list: [
      { id: '', value: 'searchContent', label: '전체' },
      { id: '2', value: 'searchRegiComp', label: '접수완료' },
      { id: '3', value: 'searchRegiCancel', label: '접수취소' },
      { id: '4', value: 'searchUnderReview', label: '심사중' },
      { id: '5', value: 'searchFinish', label: '심사완료' }
    ]
  })

  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState({
    active: 'investBusinessTitle',
    list: [
      { id: 'investBusinessTitle', value: 'investBusinessTitle', label: '제목' },
      { id: 'investBusinessCompany', value: 'investBusinessCompany', label: '운용사명' },
      { id: 'investBusinessCode', value: 'investBusinessCode', label: '공고코드' }
    ]
  })

  const [paging, setPaging] = useState({})
  const pageRef = useRef(1)
  const totalPageRef = useRef(1)
  const [isUpdate, setIsUpdate] = useState(false)
  const [list, setList] = useState([])
  const activeRef = useRef('')
  const activeRefTwo = useRef('investBusinessTitle')

  // 목록 조회
  const getList = async()=> {
    const params = {
        page: pageRef.current,
        record: 10,
        pageSize: 10,
        selectFncnBsnsPgrsScd: activeRef.current,
        searchFncnBsnsRcipNo: activeRefTwo.current === 'investBusinessCode' ? searchInput: '',
        searchOpcmNm: activeRefTwo.current === 'investBusinessCompany' ? searchInput: '',
        searchFncnBsnsRcipTtlNm: activeRefTwo.current === 'investBusinessTitle' ? searchInput: '',
    }

    let res = await CommonAxios('IVT', getConfig(Api.invest.fncnBsnsRcipList, params))
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
  
          let cnt = 0
          for (let i = response.startPage; i <= response.endPage; i++) {
            cnt++
          }
          totalPageRef.current = cnt
          setList(response.list)
        }else {
          setList([])
        }
    }
  } 

  // 상태 셀렉트박스
  const onSelectActive = (selected) => {
    setDefaultSelectSort({ ...defaultSelectSort, active: selected })
    activeRef.current = selected
    setIsUpdate(!isUpdate)
    getList()
  }
  
  // 검색 상태 셀렉트박스
  const onSelectActive2 = (selected)=> {
    activeRefTwo.current = selected
    setSearchInput('')
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
      getList()
    },
    [paging]
  )

  // ===== reset
  const handleReset = useCallback(() => {
    activeRef.current = '';
    activeRefTwo.current = 'investBusinessTitle';
    setSearchInput('')
    setSearch({...search, active : 'investBusinessTitle'})
    setDefaultSelectSort({...defaultSelectSort, active : ''})
    pageRef.current = 1

    getList()
  },[activeRef, activeRefTwo])

  // == excel download
  const handleExcelDownload = async () => {
    const params = {
      page: pageRef.current,
      record: 20,
      pageSize: 5
    }

    await excelDownloadIvtByPostConfigOption(
      // content-disposition header 인코딩이 utf-8로 세팅할 경우에도 깨지는 현상 있음 -> 사용자 지정 파일명 세팅
      getPostConfig(Api.invest.excelFncnBsnsRcipList, params),
      '출자사업 접수현황' + moment(new Date()).format('YYYYMMDD')
    )
  }

  useLayoutEffect(() => {
    if ('eventListTab' !== userContext.state.category) {
      userContext.actions.setCategory('eventListTab')
      handleReset()
    }
  }, [userContext.state.category])

  useEffect(()=> {
    if(props.location.state !== undefined) {
      pageRef.current = props.location.state
      let params = {
        ...paging,
        page: props.location.state
      }
      setPaging(params)
    }
    getList()
  },[])

  return (
    <PageLayout currentMenu={'invest'} currentCate={'fncnBsns'}  currentPage={'fncnBsnsRcipList'}>
      <div className="content_inner page_invest_user">
        <div className="page_header">
          <h4 className="page_title mb_none">출자사업 접수현황</h4>

          <div className="page_header_right">
            <div className="btn_group">
              <Select
                optionList={selectListSort ? selectListSort : defaultSelectSort}
                handleSelectActive={onSelectActive}
                ref={searchSelectSort}
              />

              <button className={'btn_refresh'} title={'새로고침'} onClick={()=> {handleReset()}}>
                <span className="hide">새로고침</span>
              </button>
              <button className="excel_down" title={'엑셀다운로드'} onClick={() => {handleExcelDownload()}}>
                <img src={require('assets/images/ico_excel.png').default} alt="엑셀 아이콘" />
              </button>
            </div>
          </div>
        </div>
        {/*table_wrap start*/}
        <div className="table_wrap ">
          <table className="table ">
            <caption>순번, 공고코드, 제목, 운영사명, 진행상태, 접수일 정보 테이블</caption>
            <colgroup>
              <col width={'4%'} />
              <col width={'10%'} />
              <col width={'*'} />
              <col width={'16%'} />
              <col width={'8%'} />
              <col width={'14%'} />
            </colgroup>
            <thead>
              <tr>
                <th>순번</th>
                <th>공고코드</th>
                <th>제목</th>
                <th>운용사명</th>
                <th>진행상태</th>
                <th>접수일</th>
              </tr>
            </thead>
            <tbody>
                {
                    list.length > 0 ?
                        list.map((item, idx)=> (
                            <tr key={createKey()}>
                                <td className={'ta_center'}>
                                {getTotalNumberBoard(paging.total, paging.page, paging.record, idx)}
                                </td>
                                <td className={'ta_center'}>{item.fncnBsnsPbanNo}</td>
                                <td className={'ta_left'} style={{ cursor: 'pointer' }} 
                                  onClick={() => {history.push(ROUTER_NAMES.INVEST_FNCN_BSNS_RCIP_DETAIL + '?fncnBsnsRcipNo=' + item.fncnBsnsRcipNo, {data : item, pageNum : pageRef.current})}}>
                                    {item.fncnBsnsPbanTtlNm}
                                </td>
                                <td className={'ta_center'}>{item.opcmNm}</td>
                                <td className={'ta_center'}>
                                    {
                                      (item.fncnBsnsPgrsScd === '1' && ('임시저장')) ||
                                      (item.fncnBsnsPgrsScd === '2' && ('접수완료')) ||
                                      (item.fncnBsnsPgrsScd === '3' && ('접수취소')) ||
                                      (item.fncnBsnsPgrsScd === '4' && ('심사중')) ||
                                      (item.fncnBsnsPgrsScd === '5' && ('심사완료'))
                                    }
                                </td>
                                <td className={'ta_center'}>{item.iibsFrrgTs}</td>
                            </tr>
                        )) : 
                    <tr>
                        <td colSpan={6}>
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
            getList()
          }}
        />
      </div>
    </PageLayout>
  )
}

export default FncnBsnsRcipList
