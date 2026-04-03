import PageLayout from 'components/PageLayout'
import NoResult from 'components/NoResult'
import Pagination from 'components/Pagination'
import SearchForm from 'components/SearchForm'
import Select from 'components/atomic/Select'
import { useHistory, useLocation } from 'react-router-dom'
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { UserContext } from 'modules/common/UserContext'
import { BooksContext } from 'modules/common/BooksContext'
import {
  getCollectionDashboard,
  getCollectionDetail,
  getCollectionList, getUserBooksList,
  getUserCommerceList,
  getUserList, saveCollectionState
} from 'modules/consts/BooksApi'
import moment from 'moment'
import * as commonFn from 'modules/fns/commonFn'
import ROUTER_NAMES from 'modules/consts/RouterConst'


const statusList = {
  CLT01001 : '접수완료',
  CLT01002 : '진행중',
  CLT01003 : '진행완료',
  CLT01004 : '취소',
}

const getStatusClass = (status) => {
  switch (status) {
    case 'CLT01001': // 접수완료
      return 'bill_finish';
    case 'CLT01002': // 진행중
      return 'status_ready';
    case 'CLT01003': // 진행완료
      return 'bill_blue';
    case 'CLT01004': // 취소
      return 'bill_red';
    default:
      return '';
  }
};


const List = () => {


  const location = useLocation()
  let path = location.pathname
  let category = path.split('/')[2]
  const history = useHistory()
  const userContext = useContext(UserContext)
  const booksContext = useContext(BooksContext)
  const [collectionInfoData, setCollectionInfoData] = useState([]) // 추심 정보
  const [collectionData, setCollectionData] = useState([]) // 추심 리스트
  const [paging, setPaging] = useState(null)
  const [searchInput, setSearchInput] = useState('')

  const [searchFilter, setSearchFilter] = useState({
    active: booksContext.state.collectionListParam.etnm !== '' ? 'etmn' : 'clctIntt',
    list: [
      { id: 'etnm', value: 'etnm', label: '신청기업명' },
      { id: 'clctIntt', value: 'clctIntt', label: '담당기관' },
    ]
  })

  // 페이징
  const handlePaging = async (param) => {
    let params = {
      ...booksContext.state.collectionListParam,
      ...param
    }
    booksContext.actions.setCollectionListParams(params)
  }

  const filterSelect = useRef(null)
  const [filterSelList, setFilterSelList] = useState({
    active: 'CLT01000',
    list: [
      { id: 'CLT01000', value: ["CLT01001", "CLT01002", "CLT01003", "CLT01004"], label: '전체'},
      { id: 'CLT01001', value: ['CLT01001'], label: '접수완료' },
      { id: 'CLT01002', value: ['CLT01002'], label: '진행중' },
      { id: 'CLT01003', value: ['CLT01003'], label: '진행완료' },
      { id: 'CLT01004', value: ['CLT01004'], label: '취소' },
    ]
  })


  const onFilterActive = (selected) => {
    booksContext.actions.setCollectionListParams({
      ...booksContext.state.collectionListParam,
      pgrsSttsCdList: selected === "CLT01000" ? ["CLT01001", "CLT01002", "CLT01003", "CLT01004"] : [selected],
      page: 1,
    })
  }

  // ===== search
  const onSelectActive = (selected) => {
    setSearchFilter({
      ...searchFilter,
      active: selected
    })

    // 선택된 필터에 따라 userListParam을 업데이트
    const newParam = {
      ...booksContext.state.collectionListParam,
      etnm: selected === 'etnm' ? '' : booksContext.state.collectionListParam.etnm,
      clctIntt: selected === 'clctIntt' ? '' : booksContext.state.collectionListParam.clctIntt
    };
    booksContext.actions.setCollectionListParams(newParam);
  }

  const handleSearch = async () => {
    let params = {
      ...booksContext.state.collectionListParam,
      searchText: searchInput ? searchInput : '',
      page: 1
    }
    // 선택된 검색 필터에 따라 검색 타입 설정
    if (searchFilter.active === 'etnm') {
      params.etnm = searchInput;
      params.clctIntt = ''; // 다른 필터 초기화
    } else if (searchFilter.active === 'clctIntt') {
      params.clctIntt = searchInput;
      params.etnm = ''; // 다른 필터 초기화
    }

    // userListParam을 업데이트
    booksContext.actions.setCollectionListParams(params);

    await getList(params);
  }

  const getList = async (params = {}) => {
    let res = await getCollectionList(params)
    if (res?.data?.code === '200') {
      let data = res.data.data
      setCollectionData(data.list)
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

  const getInfoData = async () => {
    let res = await getCollectionDashboard()
    if(res.data?.code === '200') {
      let data = res.data.data.list
      setCollectionInfoData(data)
    }
  }


  // reset
  const handleReset = async () => {
    booksContext.actions.setCollectionListParams({
      etnm: '',
      pgrsSttsCdList: ["CLT01001", "CLT01002", "CLT01003", "CLT01004"],
      clctIntt: '',
      page: 1,
      searchInput : '',
    });

    setFilterSelList({
      ...filterSelList,
      active: 'CLT01000'
    })

    setSearchInput('')
    await getList();
  }

  useLayoutEffect(() => {
    if (category !== userContext.state.category) {
      handleReset()
      userContext.actions.setCategory(category)
    }
  }, [userContext.state.category])


  useEffect(async () => {
    await getList(booksContext.state.collectionListParam)
    await getInfoData()
  }, [booksContext.state.collectionListParam])


  const handleClickDetail = (params)=> {
    history.push({
      pathname: `${ROUTER_NAMES.BOOKS_COLLECTION_VIEW}`,
      state:  params
    });
  }


  return (
    <PageLayout currentMenu={'books'} currentCate={'booksCollection'} >
      <div className='content_inner page_books_collection'>
        <div className='page_header'>
          <h4 className='page_title'>추심관리</h4>
        </div>



        <div className='collection_card'>
          {
            collectionInfoData.map((item, idx) => {
              return (
                <div className='collection_item' key={idx}>
                  <p className='collection_title'>{item.name}</p>
                  <div className='collection_number'>{item.value} <span className='case'>건</span></div>
                </div>
              )
            })
          }
        </div>



        <div className='btn_group'>
          <Select optionList={filterSelList} ref={filterSelect} handleSelectActive={onFilterActive} />
          <button className={'btn_refresh'} title={'새로고침'} onClick={handleReset}>
            <span className="hide">새로고침</span>
          </button>
        </div>
        <div className="section user_table_section">
          {
            collectionData && collectionData.length === 0 ?
              booksContext.state.collectionListParam.etnm !== '' || booksContext.state.collectionListParam.clctIntt !== '' ?
                (
                  <div className="table_no_result">
                    <NoResult msg={'검색 결과가 없습니다.'} />
                  </div>
                ) : (
                  <div className="table_no_result">
                    <NoResult msg={'등록된 추심신청이 없습니다.'} />
                  </div>
                ) : (
                <div className="table_over_width scroll">
                  <div className="table_wrap border_bottom_none table_th_border">
                    <table className="table type02">
                      <caption>주문 관리 테이블</caption>
                      <colgroup>
                        <col width={'15%'} />
                        <col width={'25%'} />
                        <col width={'15%'} />
                        <col width={'15%'} />
                        <col width={'*'} />
                        <col width={'10%'} />
                      </colgroup>
                      <thead>
                      <tr>
                        <th>신청기업명</th>
                        <th>거래종류</th>
                        <th>담당기관</th>
                        <th>신청일자</th>
                        <th>추심금액(원)</th>
                        <th>상태</th>
                      </tr>
                      </thead>
                      <tbody>
                      {
                        collectionData?.map((item, idx) => {
                          return (
                            <tr key={idx} onClick={()=>handleClickDetail({
                              utlinsttId: item.utlinsttId,
                              clctAplcId: item.clctAplcId
                            })}>
                              <td>{item.etnm}</td>
                              <td>{item.aplcPtrnCdNm || '-'}</td>
                              <td>{item.clctInttCdNm || '-'}</td>
                              <td>{item.rgsnDt ? moment(item.rgsnDt).format('YYYY-MM-DD') : '-'}</td>
                              <td>{item.aplcAmt ? commonFn.krwFormatter(item.aplcAmt) : 0}</td>
                              <td className={getStatusClass(item.pgrsSttsCd)}>{statusList[item.pgrsSttsCd]}</td>
                            </tr>

                          )
                        })
                      }
                      </tbody>
                    </table>
                  </div>
                </div>
              )
          }

          {
            paging && collectionData?.length > 0 && (
              <>
                <div className={'paging_wrap'}>
                  <Pagination pagingData={paging} handlePaging={handlePaging}/>
                </div>
              </>
            )
          }

          <SearchForm
            onSelectActive={onSelectActive}
            selectList={searchFilter}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            handleSearch={handleSearch}/>
        </div>

        
      </div>
    </PageLayout>
  )
}

export default List