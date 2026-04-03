import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import moment from 'moment'
import { useLocation } from 'react-router-dom'

import ROUTER_NAMES from 'modules/consts/RouterConst'
import { getTotalNumberBoard } from 'modules/common'
import * as commonFn from 'modules/fns/commonFn'
import { BooksContext } from 'modules/common/BooksContext'
import { UserContext } from 'modules/common/UserContext'
import {
  getUserBooksDetail,
  getUserBooksList, getUserCommerceDetail,
  getUserCommerceList,
  getUserDetail
} from 'modules/consts/BooksApi'

import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import BoxUrl from 'modules/consts/BoxUrl'
import Pagination from 'components/Pagination'
import NoResult from 'components/NoResult'
import SearchForm from 'components/SearchForm'
import PopupBooksDetail from 'pageComponents/books/PopupBooksDetail'
import PopupCommerceDetail from 'pageComponents/books/PopupCommerceDetail'

const View = (props) => {

  const userContext = useContext(UserContext)
  const booksContext = useContext(BooksContext)
  const location = useLocation()
  const id = props.match.params.id

  let path = location.pathname
  let category = path.split('/')[2]

  const [companyInfoData, setCompanyInfoData] = useState({}); // 회사정보
  const [userDetailListData, setUserDetailListData] = useState([]) // 장부, 홍보관 리스트
  const [paging, setPaging] = useState(null)
  const [searchInput, setSearchInput] = useState('')

  // 수금BOX search
  const [booksSearchFilter, setBooksSearchFilter] = useState({
    active: 'bsacNm',
    list: [
      { id: 'bsacNm', value: 'bsacNm', label: '거래처명' },
    ]
  });

  // 홍보관BOX search
  const [commerceSearchFilter, setCommerceSearchFilter] = useState({
    active: 'bsacNm',
    list: [
      { id: 'bsacNm', value: 'bsacNm', label: '거래처명' },
    ]
  })

  // 탭 정보
  const [tabList, setTabList] = useState({
    active: 'books',
    list: [
      {id: 'books', label: '장부(수금)관리 BOX'},
      {id: 'commerce', label: '홍보관 BOX'}
    ]
  })

  // ===== search
  // const onBooksSelectActive = (selected) => {
  //   setBooksSearchFilter({
  //     ...booksSearchFilter,
  //     active: selected
  //   })
  //
  //   // 선택된 필터에 따라 userListParam을 업데이트
  //   const newParam = {
  //     ...booksContext.state.userDetailInitData,
  //     bsacNm: selected === 'bsacNm' ? '' : booksContext.state.userDetailInitData.bsacNm,
  //   };
  //   booksContext.actions.setUserDetailParams(newParam);
  //
  // }


  const onBooksSelectActive = (selected) => {
    setBooksSearchFilter({
      ...booksSearchFilter,
      active: selected
    })

    // 선택된 필터에 따라 userListParam을 업데이트
    const newParam = {
      ...booksContext.state.userDetailBooksListParam,
      bsacNm: selected === 'bsacNm' ? '' : booksContext.state.userDetailBooksListParam.bsacNm,
    };
    booksContext.actions.setUserDetailBooksListParams(newParam);
  }


  const handleBooksSearch = async () => {
    let params = {
      ...booksContext.state.userDetailBooksListParam,
      searchText: searchInput ? searchInput : '',
      utlinsttId: id,
      page: 1
    }

    // 선택된 검색 필터에 따라 검색 타입 설정
    if (booksSearchFilter.active === 'bsacNm') {
      params.bsacNm = searchInput;
    }

    // userDetailBooksListParam을 업데이트
    booksContext.actions.setUserDetailBooksListParams(params);
    await getDetailData('books', params);
  }

  const onCommerceSelectActive = (selected) => {
    setCommerceSearchFilter({
      ...commerceSearchFilter,
      active: selected
    })

    // 선택된 필터에 따라 userListParam을 업데이트
    const newParam = {
      ...booksContext.state.userDetailCommerceListParam,
      bsacNm: selected === 'bsacNm' ? '' : booksContext.state.userDetailCommerceListParam.bsacNm,
    };
    booksContext.actions.setUserDetailCommerceListParams(newParam);
  }

  const handleCommerceSearch = async () => {
    let params = {
      ...booksContext.state.userDetailCommerceListParam,
      searchText: searchInput ? searchInput : '',
      loginUtlinsttId: id,
      page: 1
    }
    // 선택된 검색 필터에 따라 검색 타입 설정
    if (commerceSearchFilter.active === 'bsacNm') {
      params.bsacNm = searchInput;
    }

    // userListParam을 업데이트
    booksContext.actions.setUserDetailCommerceListParams(params);

    await getDetailData('commerce', params);
  }


  // 탭
  const handleTab = async (selected) => {
    setSearchInput('')
    setTabList({
      ...tabList,
      active: selected
    })

    if(tabList.active === 'books') {
      booksContext.actions.setUserDetailBooksListParams({
        ...booksContext.state.userDetailBooksListParam,
        page: 1, //현재페이지
        bsacNm: '' ,// 거래처명
        searchInput : ''
      })
      await getDetailData(selected, {
        ...booksContext.state.userDetailBooksListParam,
        page: 1, //현재페이지
        bsacNm: '' ,// 거래처명
        searchInput : ''
      })
    } else {
      booksContext.actions.setUserDetailCommerceListParams({
        ...booksContext.state.userDetailCommerceListParam,
        page: 1, //현재페이지
        bsacNm: '',
        searchInput : ''
      })
      await getDetailData(selected, {
        ...booksContext.state.userDetailCommerceListParam,
        page: 1, //현재페이지
        bsacNm: '',
        searchInput : ''
      })
    }
  }

  // 회사 정보
  const getInfoData = async () => {
    let res = await getUserDetail(id)
    if (res?.data?.code === '200') {
      let data = res.data.data
      setCompanyInfoData(data)
    }
  }

  // 장부관리 , 홍보관 박스 리스트
  const getDetailData = async (type, param= {}) => {
    setUserDetailListData(null)
    let res
    if (type === 'books') {
      res = await getUserBooksList({utlinsttId: id, ...param})
    } else  {
      res = await getUserCommerceList({loginUtlinsttId: id, ...param})
    }

    if (res?.data?.code === '200') {
      let data= res.data.data
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
      setUserDetailListData(data.list)
    }
  }

  // 페이징
  const handlePaging = async (param) => {
    let params
    if(tabList.active === 'books') {
      params = {
        ...booksContext.state.userDetailBooksListParam,
        ...param
      }
      booksContext.actions.setUserDetailBooksListParams(params)
    } else {
      params = {
        ...booksContext.state.userDetailCommerceListParam,
        ...param
      }
      booksContext.actions.setUserDetailCommerceListParams(params)
    }

    await getDetailData(tabList.active, params)
  }

  useLayoutEffect(() => {
    if (category !== userContext.state.category) {
      userContext.actions.setCategory(category)
    }
  }, [userContext.state.category])

  useEffect(async () => {
    booksContext.actions.setUserDetailBooksListParams({...booksContext.state.userDetailBooksListParam, utlinsttId: id})
    booksContext.actions.setUserDetailCommerceListParams({...booksContext.state.userDetailCommerceListParam, loginUtlinsttId:id})
    await getInfoData()
    await getDetailData('books')
  }, [])

  // popup
  const [booksDetailPopup, setBooksDetailPopup] = useState(false)
  const [booksData, setBooksData] = useState(null)

  const [commerceDetailPopup, setCommerceDetailPopup] = useState(false)
  const [commerceData, setCommerceData] = useState(false)

  const getBooksDetailData = async (id1, id2) => {
    const res = await getUserBooksDetail(id1, id2)


    if (res?.data?.code === '200') {
      setBooksData(res.data.data)
      setBooksDetailPopup(true)
    } else {
      console.log('Error has been occurred')
    }
  }

  const handleBooksDetailPopup = async (id1, id2) => {

    let params = {
      ...booksContext.state.userDetailBooksDetailParam,
      utlinsttId: id1,
      trnDlstId: id2,
    }

    booksContext.actions.setUserDetailBooksDetailParams(params)
    await getBooksDetailData(id1, id2)
  }

  const closeBooksPopup = () => {
    setBooksDetailPopup(false)
  }

  const getCommerceDetailData = async (id1, id2) => {
    const res = await getUserCommerceDetail(id1, id2)


    if (res?.data?.code === '200') {
      setCommerceData(res.data.data)
      setCommerceDetailPopup(true)
    } else {
      console.log('Error has been occurred')
    }
  }

  const handleCommerceDetailPopup = async (id1, id2) => {

    let params = {
      ...booksContext.state.userDetailCommerceDetailParam,
      loginUtlinsttId: id1,
      ordnInfoId: id2,
    }

    booksContext.actions.setUserDetailCommerceDetailParams(params)
    await getCommerceDetailData(id1, id2)
  }

  const closeCommercePopup = () => {
    setCommerceDetailPopup(false)
  }

  return (
    <PageLayout currentMenu={'books'} currentCate={'booksUser'}>

      {booksDetailPopup && booksData && <PopupBooksDetail data={booksData} handlePopup={closeBooksPopup} /> }

      {commerceDetailPopup && commerceData && <PopupCommerceDetail data={commerceData} handlePopup={closeCommercePopup}/>}


      <div className='content_inner page_books_user'>
        {
          companyInfoData && Object.keys(companyInfoData).length > 0 && (
            <>
              <div className="page_header">
                <h4 className="page_title">
                  {companyInfoData.indvBsnnYn === 'Y' ? companyInfoData.rpprNm : companyInfoData.etnm}
                </h4>
                <div className="page_title_sub_text">
                  가입일 : {companyInfoData.svcJnngDt ? moment(companyInfoData.svcJnngDt).format('YYYY-MM-DD') : '-'} <br />
                  매출채권보험 인증 : {companyInfoData.insuranceCertYn} / 상담신청 : {companyInfoData.insuranceApplyYn}
                </div>
              </div>
              <div className='user_view_section'>
                <div className='user_info user_info_item'>
                  <p className='title'>
                    {companyInfoData.rpprNm || "-"} <span>대표</span>
                  </p>
                  <div className='info'>
                    <div className='img_wrap'>
                      <img src={require('assets/images/ico_message.png').default} alt="메시지 아이콘"/>
                    </div>
                    <div className='text'>
                      <div>{companyInfoData.reprsntEmail.trim() ? companyInfoData.reprsntEmail.trim() : "-"}</div>
                    </div>
                  </div>

                  <div className='info'>
                    <div className='img_wrap'>
                      <img src={require('assets/images/ico_phone.png').default} alt="전화 아이콘"/>
                    </div>
                    <div className='text'>
                      <div>{companyInfoData.usisRprsTpn ? commonFn.formatPhoneNumber(companyInfoData.usisRprsTpn) : "-"}</div>
                    </div>
                  </div>

                  <div className='info'>
                    <div className='img_wrap'>
                      <img src={require('assets/images/ico_map.png').default} alt="지도 아이콘"/>
                    </div>
                    <div className='text'>
                      <div>{companyInfoData.nwAdres || "-"} {companyInfoData.nwAdresDetail} </div>
                    </div>
                  </div>
                </div>
                <div className='user_info user_item'>
                  <p className='title'>미수금</p>
                  <p className='sub'>
                    {companyInfoData.receivableCnt ? commonFn.krwFormatter(companyInfoData.receivableCnt) : 0} <span>건</span>
                  </p>
                </div>
                <div className='user_info user_item'>
                  <p className='title'>미수금액</p>
                  <p className='sub'>
                    {companyInfoData.receivableAmt ? commonFn.krwFormatter(companyInfoData.receivableAmt) : 0} <span>원</span>
                  </p>
                </div>
                <div className='user_info user_item'>
                  <p className='title'>미수율(%)</p>
                  <p className='sub'>
                    {companyInfoData.receivableRate || 0} <span>%</span>
                  </p>
                </div>
              </div>
            </>

          )
        }
        <div className='sub_text'>* 해당 사업자를 거래처로 지정하고 입력한 장부(거래)명세서-매출 기준으로 미수 내역을 표시합니다.</div>



        <div className='section books_user_tab_section'>
          <div className='tab_header'>
            <ul className='tab_header_list'>
              {
                tabList.list.map((tab, idx) => (
                  <li
                    className={`tab_header_item ${tabList.active === tab.id ? 'active' : ''}`}
                    key={tab.id}
                    onClick={() => handleTab(tab.id)}
                  >
                    <span className='label'>{tab.label}</span>
                  </li>
                ))
              }
            </ul>
          </div>


          <>
            {
              userDetailListData && userDetailListData.length === 0 ?
                booksContext.state.userDetailBooksListParam.bsacNm !== '' || booksContext.state.userDetailCommerceListParam.bsacNm !== '' ?
                  (
                    <div className="table_no_result">
                      <NoResult msg={'검색 결과가 없습니다.'}/>
                    </div>
                  ) : (
                    <div className="table_no_result">
                      <NoResult msg={'등록된 장부(거래)명세서가 없습니다.'}/>
                    </div>
                  ) : (
                    <>
                      {
                        tabList.active === 'books' ? (
                          <div className='tab_container'>
                            <div className="table_wrap border_bottom_none table_th_border">
                              <table className="table type02">
                                <caption>등록 상품 테이블</caption>
                                <colgroup>
                                  <col width={'5%'} />
                                  <col width={'*'} />
                                  <col width={'18%'} />
                                  <col width={'18%'} />
                                  <col width={'14%'} />
                                  <col width={'14%'} />
                                  <col width={'14%'} />
                                </colgroup>
                                <thead>
                                <tr>
                                  <th>구분</th>
                                  <th>거래처명</th>
                                  <th>거래(예정)일</th>
                                  <th>수금/지급(예정)일</th>
                                  <th>구매확인</th>
                                  <th>거래액(원)</th>
                                  <th>수금/지급상태</th>
                                </tr>
                                </thead>
                                <tbody>
                                  {
                                    userDetailListData?.map((item, idx) =>{
                                      return (
                                        <tr key={'user_detail_list' + idx}
                                          onClick={() => handleBooksDetailPopup(item.utlinsttId, item.trnDlstId)}
                                        >
                                          <td className='ta_center'>
                                            {
                                              item.buslPtrnCd === 'BSL00001' ? (
                                                <div className='type purchase'>
                                                  <img src={require('assets/images/arr_down_blue.png').default} alt="매입 아이콘"/>
                                                  <p>매입</p>
                                                </div>
                                              ) : (
                                                <div className='type sales'>
                                                  <img src={require('assets/images/arr_up_red.png').default} alt="매출 아이콘"/>
                                                  <p>매출</p>
                                                </div>
                                              )
                                            }
                                          </td>
                                          <td className='ta_center'>
                                            {item.bsacNm}
                                          </td>
                                          <td className='ta_center'>
                                            {item.saleScdlDt ? moment(item.saleScdlDt).format('YYYY-MM-DD') : '-'}
                                          </td>
                                          <td className='ta_center'>
                                            {item.pamtScdlDt ? moment(item.pamtScdlDt).format('YYYY-MM-DD'): '-'}
                                          </td>
                                          <td className='ta_center'>
                                            {item.athzYn === 'Y' ?
                                              <div className='check'>
                                                <img src={require('assets/images/ico_check_orange.png').default} alt="체크 아이콘"/>
                                                확인
                                              </div>
                                              : <div>-</div>
                                            }
                                          </td>
                                          <td className='ta_center'>
                                            {item.lastTrnAmt ? commonFn.krwFormatter(item.lastTrnAmt) : 0}
                                          </td>
                                          <td className='ta_center'>
                                            {item.clomSttsCdNm}
                                          </td>
                                        </tr>
                                      )
                                    })

                                  }
                                </tbody>
                              </table>
                              {
                                paging && userDetailListData?.length > 0 && (
                                  <>
                                    <div className={'paging_wrap'}>
                                      <Pagination pagingData={paging} handlePaging={handlePaging}/>
                                    </div>
                                  </>
                                )
                              }


                              <SearchForm
                                onSelectActive={onBooksSelectActive}
                                selectList={booksSearchFilter}
                                searchInput={searchInput}
                                setSearchInput={setSearchInput}
                                handleSearch={handleBooksSearch}
                              />

                            </div>
                          </div>
                        ) : (
                          <div className='tab_container'>
                            <div className="table_wrap border_bottom_none table_th_border">
                              <table className="table type02">
                                <caption>등록 상품 테이블</caption>
                                <colgroup>
                                  <col width={'5%'} />
                                  <col width={'*'} />
                                  <col width={'12%'} />
                                  <col width={'18%'} />
                                  <col width={'14%'} />
                                  <col width={'14%'} />
                                </colgroup>
                                <thead>
                                <tr>
                                  <th>구분</th>
                                  <th>거래처명</th>
                                  <th>거래일</th>
                                  <th>품목</th>
                                  <th>거래액(원)</th>
                                  <th>수금/지급상태</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                  userDetailListData?.map((item, idx) => {
                                    return (
                                      <tr key={'user_detail_list' + idx}
                                          onClick={() => handleCommerceDetailPopup(id, item.ordnInfoId)}
                                      >
                                        <td className={'ta_center'}>
                                          {
                                            item.ordnType === '001' ? (
                                              <div className='type purchase'>
                                                <img src={require('assets/images/arr_down_blue.png').default} alt="매입 아이콘"/>
                                                <p>매입</p>
                                              </div>
                                            ) : (
                                              <div className='type sales'>
                                                <img src={require('assets/images/arr_up_red.png').default} alt="매출 아이콘"/>
                                                <p>매출</p>
                                              </div>
                                            )
                                          }
                                        </td>

                                        <td className={'ta_center'}>{item.bsacNm}</td>
                                        <td className={'ta_center'}>
                                          {item.rgsnDate ? moment(item.rgsnDate).format('YYYY-MM-DD'): '-'}
                                        </td>
                                        <td className={'ta_center'}>
                                          {item.pdfNm}
                                        </td>
                                        <td className={'ta_center'}>
                                          {item.totalPrc ? commonFn.krwFormatter(item.totalPrc): 0}
                                        </td>
                                        <td className={'ta_center'}>수금완료</td>
                                      </tr>
                                    )
                                  })
                                }

                                </tbody>
                              </table>
                              {
                                paging && userDetailListData?.length > 0 && (
                                  <>
                                    <div className={'paging_wrap'}>
                                      <Pagination pagingData={paging} handlePaging={handlePaging}/>
                                    </div>
                                  </>
                                )
                              }

                              <SearchForm
                                onSelectActive={onCommerceSelectActive}
                                selectList={booksSearchFilter}
                                searchInput={searchInput}
                                setSearchInput={setSearchInput}
                                handleSearch={handleCommerceSearch}
                              />
                            </div>
                          </div>
                        )
                      }
                    </>
                )
            }
          </>

        </div>


      </div>
    </PageLayout>
  )
}

export default View



// <img src={require('assets/images/ico_excel.png').default} alt="엑셀 아이콘"/>
