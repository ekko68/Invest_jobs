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

const Admin_Notice_List_InvestBusiness = (props) => {
  const { selectListSort, onSelectActive, value } = props
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
      { id: 'searchSelect', value: 'searchSelect', label: '선정공고' },
      { id: 'searchStatus', value: 'searchStatus', label: '접수현황' },
      { id: 'searchResult', value: 'searchResult', label: '선정결과' }
    ]
  }
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState({
    active: 'investBusinessTitle',
    list: [
      { id: 'investBusinessTitle', value: 'investBusinessTitle', label: '제목' },
      { id: 'investBusinessMan', value: 'investBusinessMan', label: '등록자' },
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
          <h4 className="page_title mb_none">출자사업 공고</h4>

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
              <Button className={'full_blue'} onClick={() => {}}>
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
              <tr>
                <td className={'ta_center'}>10</td>
                <td className={'ta_center'}>선정결과</td>
                <td className={'ta_center'}>-</td>
                <td className={'ta_left'} style={{ cursor: 'pointer' }} onClick={() => {}}>
                  핀테크 혁신펀드 위탁운용사 선정결과핀테크 혁신펀드 위탁운용사 선정결과
                </td>
                <td className={'ta_center'}>홍길동</td>
                <td className={'ta_center'}>2023-04-15</td>
                <td className={'ta_center'}>
                  <Toggle
                    className="theme_blue2"
                    data={{
                      id: `invest_toggle_10`,
                      value: '',
                      status: true
                    }}
                    onChange={() => {}}
                  />
                </td>
              </tr>
              <tr>
                <td className={'ta_center'}>09</td>
                <td className={'ta_center'}>접수현황</td>
                <td className={'ta_center'}>-</td>
                <td className={'ta_left'} style={{ cursor: 'pointer' }} onClick={() => {}}>
                  핀테크 혁신펀드 위탁운용사
                </td>
                <td className={'ta_center'}>홍길동</td>
                <td className={'ta_center'}>2023-04-15</td>
                <td className={'ta_center'}>
                  <Toggle
                    className="theme_blue2"
                    data={{
                      id: `invest_toggle_09`,
                      value: '',
                      status: true
                    }}
                    onChange={() => {}}
                  />
                </td>
              </tr>
              <tr>
                <td className={'ta_center'}>08</td>
                <td className={'ta_center'}>선정공고</td>
                <td className={'ta_center'}>A008</td>
                <td className={'ta_left'} style={{ cursor: 'pointer' }} onClick={() => {}}>
                  핀테크 혁신펀드 위탁운용사
                </td>
                <td className={'ta_center'}>홍길동</td>
                <td className={'ta_center'}>2023-04-15</td>
                <td className={'ta_center'}>
                  <Toggle
                    className="theme_blue2"
                    data={{
                      id: `invest_toggle_08`,
                      value: '',
                      status: true
                    }}
                    onChange={() => {}}
                  />
                </td>
              </tr>
              <tr>
                <td className={'ta_center'}>07</td>
                <td className={'ta_center'}>선정결과</td>
                <td className={'ta_center'}>A006</td>
                <td className={'ta_left'} style={{ cursor: 'pointer' }} onClick={() => {}}>
                  핀테크 혁신펀드 위탁운용사
                </td>
                <td className={'ta_center'}>홍길동</td>
                <td className={'ta_center'}>2023-04-15</td>
                <td className={'ta_center'}>
                  <Toggle
                    className="theme_blue2"
                    data={{
                      id: `invest_toggle_07`,
                      value: '',
                      status: true
                    }}
                    onChange={() => {}}
                  />
                </td>
              </tr>
              <tr>
                <td className={'ta_center'}>06</td>
                <td className={'ta_center'}>선정결과</td>
                <td className={'ta_center'}>A005</td>
                <td className={'ta_left'} style={{ cursor: 'pointer' }} onClick={() => {}}>
                  핀테크 혁신펀드 위탁운용사
                </td>
                <td className={'ta_center'}>홍길동</td>
                <td className={'ta_center'}>2023-04-15</td>
                <td className={'ta_center'}>
                  <Toggle
                    className="theme_blue2"
                    data={{
                      id: `invest_toggle_06`,
                      value: '',
                      status: false
                    }}
                    onChange={() => {}}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={7}>
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

export default Admin_Notice_List_InvestBusiness
