import { useEffect, useRef, useState, useContext, useLayoutEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import PageLayout from 'components/PageLayout'
import Pagination from 'components/Pagination'
import Toggle from 'components/Toggle'
import Select from 'components/atomic/Select'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { InvestContext } from 'modules/common/InvestContext'
import { UserContext } from 'modules/common/UserContext'

import Button from 'components/atomic/Button'

import * as mainFn from 'modules/fns/mkt/mainFn'
import { MktContext } from 'modules/common/MktContext'
import SearchForm from 'components/SearchForm'
import NoResult from 'components/NoResult'
import { BtaSelect } from 'components/BtaSelect'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'

const Admin_Accept_State_List_InvestBusiness = (props) => {
  const { selectListSort, onSelectActive } = props
  const mktContext = useContext(MktContext)
  const userContext = useContext(UserContext)
  const history = useHistory()
  const location = useLocation()
  let path = location.pathname
  let page = path.split('/')[1]
  const [paging, setPaging] = useState(null)
  const searchSelectSort = useRef(null)
  const defaultSelectSort = {
    active: 'searchContent',
    list: [
      { id: 'searchContent', value: 'searchContent', label: '전체' },
      { id: 'searchRegiComp', value: 'searchRegiComp', label: '접수완료' },
      { id: 'searchRegiCancel', value: 'searchRegiCancel', label: '접수취소' },
      { id: 'searchUnderReview', value: 'searchUnderReview', label: '심사중' },
      { id: 'searchFinish', value: 'searchFinish', label: '심사완료' }
    ]
  }

  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState({
    active: 'investBusinessTitle',
    list: [
      { id: 'investBusinessTitle', value: 'investBusinessTitle', label: '제목' },
      { id: 'investBusinessCompany', value: 'investBusinessCompany', label: '운용사명' },
      { id: 'investBusinessCode', value: 'investBusinessCode', label: '공고코드' }
    ]
  })
  // ===== search
  const handleSearch = () => {
    let params = {}
    if (search.active === 'bplcNm') {
      params = {
        bplcNm: searchInput,
        utlinsttId: ''
      }
    } else {
      params = {
        bplcNm: '',
        utlinsttId: searchInput
      }
    }
    investContext.actions.handleVcParam({
      ...investContext.state.vcParam,
      ...params,
      page: 1
    })
  }
  const [maximumAlert, setMaximumAlert] = useState(false)

  // ===== 상세화면 이동 : id
  const handleView = (id) => {
    history.push(`${ROUTER_NAMES.COMMERCE_MAIN_BANNER_VIEW}/${id}`)
  }

  // ===== 등록 이동 : type (type is eventListTab, eventStatusTab)
  const [alertMsg, setAlertMsg] = useState('')

  // ===== 페이징
  const handlePaging = (param) => {
    let params = {
      ...mktContext.state.bannerParam,
      ...param
    }
    mktContext.actions.handleSetBannerParam(params)
  }

  // ===== reset
  const handleReset = () => {
    mktContext.actions.handleSetBannerCurrType('eventListTab')
  }

  useLayoutEffect(() => {
    if ('eventListTab' !== userContext.state.category) {
      userContext.actions.setCategory('eventListTab')
      handleReset()
    }
  }, [userContext.state.category])

  return (
    <PageLayout currentMenu={'invest'} currentCate={'investUser'}>
      {/* {maximumAlert && <PopupAlert msg={alertMsg} handlePopup={handleMaximunAlert} />} */}
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

              <button className={'btn_refresh'} title={'새로고침'} onClick={handleReset}>
                <span className="hide">새로고침</span>
              </button>
              <button className="excel_down" title={'엑셀다운로드'} onClick={() => {}}>
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
              <tr>
                <td className={'ta_center'}>10</td>
                <td className={'ta_center'}>A008</td>
                <td className={'ta_left'} style={{ cursor: 'pointer' }} onClick={() => {}}>
                  핀테크 혁신펀드 위탁운용사 선정결과
                </td>
                <td className={'ta_center'}>에스브이인베스트</td>
                <td className={'ta_center'}>접수완료</td>
                <td className={'ta_center'}>2023-04-15</td>
              </tr>
              <tr>
                <td className={'ta_center'}>09</td>
                <td className={'ta_center'}>A007</td>
                <td className={'ta_left'} style={{ cursor: 'pointer' }} onClick={() => {}}>
                  핀테크 혁신펀드 위탁운용사 선정결과
                </td>
                <td className={'ta_center'}>홍길동</td>
                <td className={'ta_center'}>접수완료</td>
                <td className={'ta_center'}>2023-04-15</td>
              </tr>
              <tr>
                <td className={'ta_center'}>08</td>
                <td className={'ta_center'}>A008</td>
                <td className={'ta_left'} style={{ cursor: 'pointer' }} onClick={() => {}}>
                  핀테크 혁신펀드 위탁운용사 선정결과
                </td>
                <td className={'ta_center'}>에스브이인베스트</td>
                <td className={'ta_center'}>심사중</td>
                <td className={'ta_center'}>2023-04-15</td>
              </tr>
              <tr>
                <td className={'ta_center'}>07</td>
                <td className={'ta_center'}>A008</td>
                <td className={'ta_left'} style={{ cursor: 'pointer' }} onClick={() => {}}>
                  핀테크 혁신펀드 위탁운용사 선정결과
                </td>
                <td className={'ta_center'}>홍길동</td>
                <td className={'ta_center'}>접수취소</td>
                <td className={'ta_center'}>2023-04-15</td>
              </tr>
              <tr>
                <td className={'ta_center'}>06</td>
                <td className={'ta_center'}>A008</td>
                <td className={'ta_left'} style={{ cursor: 'pointer' }} onClick={() => {}}>
                  핀테크 혁신펀드 위탁운용사 선정결과
                </td>
                <td className={'ta_center'}>에스브이인베스트</td>
                <td className={'ta_center'}>접수완료</td>
                <td className={'ta_center'}>2023-04-15</td>
              </tr>
              <tr>
                <td className={'ta_center'}>05</td>
                <td className={'ta_center'}>A008</td>
                <td className={'ta_left'} style={{ cursor: 'pointer' }} onClick={() => {}}>
                  핀테크 혁신펀드 위탁운용사 선정결과
                </td>
                <td className={'ta_center'}>홍길동</td>
                <td className={'ta_center'}>심사완료</td>
                <td className={'ta_center'}>2023-04-15</td>
              </tr>

              <tr>
                <td colSpan={6}>
                  <NoResult />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/*table_wrap end*/}
        <div className="pagination_wrap">
          <Pagination
            pagingData={{ totalPage: 40, startPage: 1, page: 5, prev: true, next: true, endPage: 10 }}
            handlePaging={handlePaging}
          />
        </div>
        <SearchForm
          selectList={search}
          onSelectActive={onSelectActive}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          handleSearch={handleSearch}
        />
      </div>
    </PageLayout>
  )
}

export default Admin_Accept_State_List_InvestBusiness
