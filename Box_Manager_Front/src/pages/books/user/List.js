import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import moment from 'moment'
import * as commonFn from 'modules/fns/commonFn'
import { getTotalNumberBoard } from 'modules/common'

import SearchForm from 'components/SearchForm'
import { BooksContext } from 'modules/common/BooksContext'
import { getUserList } from 'modules/consts/BooksApi'
import { useLocation } from 'react-router-dom'
import { UserContext } from 'modules/common/UserContext'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { useHistory } from 'react-router-dom'

import PageLayout from 'components/PageLayout'
import Select from 'components/atomic/Select'
import NoResult from 'components/NoResult'
import Badge from 'components/atomic/Badge'
import Button from 'components/atomic/Button'
import Pagination from 'components/Pagination'


import {
  excelDownloadBkbByPostConfigOption,
  getPostConfig
} from 'modules/utils/CommonUtils'
import Api from 'modules/consts/Api'
import { formatBusinessNumber, formatPhoneNumber } from 'modules/fns/commonFn'
import PopupAlert from "../../../components/PopupAlert";


const List = () => {

  const location = useLocation()
  const prevLocation = useRef(null);
  let path = location.pathname
  let category = path.split('/')[2]
  const history = useHistory()

  const userContext = useContext(UserContext)
  const booksContext = useContext(BooksContext)
  const [userListData, setUserListData] = useState([])
  const [paging, setPaging] = useState(null)
  const [searchInput, setSearchInput] = useState('')

  const [alertPop, setAlertPop] = useState({active: false, msg: ''});


  const [searchFilter, setSearchFilter] = useState({
    active: booksContext.state.userListParam.etnm !== '' ? 'etmn' : 'rpprNm',
    list: [
      { id: 'etnm', value: 'etnm', label: '회사명' },
      { id: 'rpprNm', value: 'rpprNm', label: '대표자명' },
    ]
  })

  // 페이징
  const handlePaging = async (param) => {
    let params = {
      ...booksContext.state.userListParam,
      ...param
    }
    booksContext.actions.setUserListParams(params)
  }

  // 검색필터 : 서비스 가입일, 높은 미수율,낮은 미수율, 높은 등록순,법인,개인
  const filterSelect = useRef(null)
  const filterSelList = {
    active: booksContext.state.userListParam.sortBy,
    list: [
      { id: '001', value: '001', label: '서비스 가입일' },
      { id: '002', value: '002', label: '높은 미수율' },
      { id: '003', value: '003', label: '낮은 미수율' },
      { id: '004', value: '004', label: '높은 등록순' },
      { id: '005', value: '005', label: '법인' },
      { id: '006', value: '006', label: '개인' },
    ]
  }
  const onFilterActive = (selected) => {
    booksContext.actions.setUserListParams({
      sortBy: selected,
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
      ...booksContext.state.userListParam,
      etnm: selected === 'etnm' ? '' : booksContext.state.userListParam.etnm,
      rpprNm: selected === 'rpprNm' ? '' : booksContext.state.userListParam.rpprNm
    };
    booksContext.actions.setUserListParams(newParam);
  }

  const handleSearch = async () => {
    let params = {
      ...booksContext.state.userListParam,
      searchText: searchInput ? searchInput : '',
      page: 1
    }
    // 선택된 검색 필터에 따라 검색 타입 설정
    if (searchFilter.active === 'etnm') {
      params.etnm = searchInput;
      params.rpprNm = ''; // 다른 필터 초기화
    } else if (searchFilter.active === 'rpprNm') {
      params.rpprNm = searchInput;
      params.etnm = ''; // 다른 필터 초기화
    }

    // userListParam을 업데이트
    booksContext.actions.setUserListParams(params);

    await getList(params);
  }

  const getList = async (params = {}) => {
    let res = await getUserList(params)
    if (res?.data?.code === '200') {
      let data = res.data.data
      setUserListData(data.list)
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


  // // == excel download
  const handleExcelDownload = async () => {
    await excelDownloadBkbByPostConfigOption(
      // content-disposition header 인코딩이 utf-8로 세팅할 경우에도 깨지는 현상 있음 -> 사용자 지정 파일명 세팅
      getPostConfig(Api.books.booksUserExcelDownload, booksContext.state.userExcelInitData),
      "장부(수금)관리BOX_회원관리_" + moment(new Date()).format('YYYYMMDD'));
  }

  // reset
  const handleReset = async () => {
    booksContext.actions.setUserListParams({
      "etnm": "",
      "rpprNm": "",
      "sortBy": "001",
      "page": 1,
      "searchInput" : '',
    });
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
    await getList(booksContext.state.userListParam)
  }, [booksContext.state.userListParam])


  useEffect(() => {
    if (prevLocation.current !== location.pathname) {
      // 다른 페이지로 이동한 경우, 상태 초기화
      setSearchFilter({
        active: booksContext.state.userListParam.etnm !== '' ? 'etnm' : 'rpprNm',
        list: [
          { id: 'etnm', value: 'etnm', label: '회사명' },
          { id: 'rpprNm', value: 'rpprNm', label: '대표자명' },
        ]
      });
      setSearchInput('');
    }
    prevLocation.current = location.pathname;
  }, [location.pathname, booksContext.state.userListParam]);

  return (
    <PageLayout currentMenu={'books'} currentCate={'booksUser'} >

      {
        alertPop.active &&
          <PopupAlert msg={alertPop.msg}
                      handlePopup={() => setAlertPop({...alertPop, active: false, type: null})} />
      }

      <div className="content_inner page_books_user">
        <div className="page_header">
          <h4 className="page_title">회원관리</h4>
          <div className='page_header_right'>
            <div className="btn_group">
              <Select width="133px" optionList={filterSelList} ref={filterSelect} handleSelectActive={onFilterActive} />
              <button className={'btn_refresh'} title={'새로고침'} onClick={handleReset}>
                <span className="hide">새로고침</span>
              </button>
              <button className="excel_down" title={'엑셀다운로드'} onClick={handleExcelDownload}>
                <img src={require('assets/images/ico_excel.png').default} alt="엑셀 아이콘"/>
              </button>
            </div>
          </div>

        </div>
        {/*section start*/}
        <div className="section user_table_section">
          {
            userListData && userListData.length === 0  ?
              booksContext.state.userListParam.etnm !== '' ||booksContext.state.userListParam.rpprNm!== '' ?
                (<div className="table_no_result">
                  <NoResult msg={'검색 결과가 없습니다.'} />
                </div>
              ) : (
                <div className="table_no_result">
                  <NoResult msg={'해당 서비스를 이용하는 사용자가 없습니다.'} />
                </div>
              ): (
              <div className="table_over_width scroll">
                <div className="table_wrap border_bottom_none table_th_border">
                  <table className="table type02">
                    <caption>주문 관리 테이블</caption>
                    <colgroup>
                      <col width={'2%'} />
                      <col width={'6%'} />
                      <col width={'6%'} />
                      <col width={'6%'} />
                      <col width={'6%'} />
                      <col width={'7%'} />
                      <col width={'7%'} />
                      <col width={'7%'} />
                      <col width={'8%'} />
                      <col width={'8%'} />
                      <col width={'7%'} />
                      <col width={'6%'} />
                      <col width={'6%'} />
                      <col width={'6%'} />
                      <col width={'4%'} />
                      <col width={'3%'} />
                      <col width={'8%'} />
                    </colgroup>
                    <thead>
                    <tr>
                      <th>구분</th>
                      <th>회사명</th>
                      <th>사업자번호</th>
                      <th>대표자명</th>
                      <th>휴대폰번호</th>
                      <th>매출 / 매입 장부(거래)명세서 수</th>
                      <th>공동인증서 등록 여부</th>
                      <th>최근 1년 매출액 총합계(원)</th>
                      <th>세금계산서 매출액(원)</th>
                      <th>현금영수증 매출액(원)</th>
                      <th>온라인매출액(원)</th>
                      <th>카드매출액(원)</th>
                      <th>외상매출액(원)</th>
                      <th>기타매출액(원)</th>
                      <th>미수율 (%)</th>
                      <th>활동여부</th>
                      <th>서비스 가입일</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                      userListData?.map((item, idx) => {
                        return (
                        <tr
                          key={'user_list_item' + idx}
                          onClick={() => {
                            if(item.acvtYn === 'Y') history.push(`${ROUTER_NAMES.BOOKS_USER_VIEW}/${item.utlinsttId}`);
                            else setAlertPop({...alertPop, active: true, msg: '폐쇄된 사업장은 조회가 어렵습니다.'})
                          }}
                        >
                            <td>{item.indvBsnnYn === 'Y' ? "개인" : "법인"}</td>
                            <td>{item.etnm}</td>
                            <td>{item.bzn.trim() !== '' ?  commonFn.formatBusinessNumber(item.bzn) : '-'}</td>
                            <td>{item.rpprNm === null ? '-' : item.rpprNm }</td>
                            <td>{item.usisRprsTpn === null || item.usisRprsTpn.trim() === '' ? '-' :  commonFn.formatPhoneNumber(item.usisRprsTpn)}</td>
                            <td>{item.booksCnt}</td>
                            <td>{item.iftCertYn}</td>
                            <td>{item.saleAmt ? commonFn.krwFormatter(item.saleAmt) : 0}</td>
                            <td>{item.taxbillSaleAmt ? commonFn.krwFormatter(item.taxbillSaleAmt) : 0}</td>
                            <td>{item.cashReceiptSaleAmt ? commonFn.krwFormatter(item.cashReceiptSaleAmt) : 0}</td>
                            <td>{item.onlineSaleAmt ? commonFn.krwFormatter(item.onlineSaleAmt) : 0}</td>
                            <td>{item.cardSaleAmt ? commonFn.krwFormatter(item.cardSaleAmt) : 0}</td>
                            <td>{item.creditSaleAmt ? commonFn.krwFormatter(item.creditSaleAmt) : 0}</td>
                            <td>{item.etcSaleAmt ? commonFn.krwFormatter(item.etcSaleAmt) : 0}</td>
                            <td>{item.receivableRate}</td>
                            <td>{item.acvtYn}</td>
                            <td>{item.svcJnngDt ? moment(item.svcJnngDt).format('YYYY-MM-DD') : '-'}</td>
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


          {paging && userListData?.length > 0 && (
            <>
              <div className={'paging_wrap'}>
                <Pagination pagingData={paging} handlePaging={handlePaging} />
              </div>
            </>
          )}
          <SearchForm
            onSelectActive={onSelectActive}
            selectList={searchFilter}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            handleSearch={handleSearch}
          />
        </div>
        {/*section end*/}
      </div>


    </PageLayout>
  )
}

export default List
