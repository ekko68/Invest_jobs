import { useEffect, useRef, useState, useContext, useLayoutEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import Select from 'components/atomic/Select'
import Checkbox from 'components/atomic/Checkbox'
import ExPopupTableNew from 'pageComponents/commerce/main/ExPopupTableNew'
import Pagination from 'components/Pagination'
import ROUTER_NAMES from 'modules/consts/RouterConst'

import PopupAlert from 'components/PopupAlert'
import { MktContext } from 'modules/common/MktContext'
import { UserContext } from 'modules/common/UserContext'
import * as mainFn from 'modules/fns/mkt/mainFn'
import DatePicker, { registerLocale } from 'react-datepicker'
import ko from 'date-fns/locale/ko'
import { NoImage02 } from 'modules/consts/Img'

// const [searchDate, setSearchDate] = useState({
//   startDate: new Date(),
//   endDate: new Date()
// })

const Admin_Popup_01_1 = (props) => {
  const { selectList, onSelectActive, value } = props

  const searchSelect = useRef(null)
  const defaultSelect = {
    active: 'searchContent',
    list: [
      { id: 'searchContent', value: 'searchContent', label: '제목' },
      { id: 'searchDescript', value: 'searchDescript', label: '설명' }
    ]
  }
  const typeCheckboxList = [
    { id: 'check_all', value: '전체', status: true },
    { id: 'check_display', value: '공개', status: true },
    { id: 'check_stanby', value: '대기', status: true },
    { id: 'check_close', value: '종료', status: true },
    { id: 'check_off', value: '비공개', status: true }
  ]
  const [date1, setDate1] = useState({
    startDate: null,
    endDate: null
  })

  const [date2, setDate2] = useState({
    startDate: null,
    endDate: null
  })
  const mainData = {
    header: [
      {
        first: (
          <Checkbox
            className="no_label"
            checkbox={{ id: 'cell_checkAll', value: '', status: true }}
            onChange={() => {}}
          />
        ),
        title: '제목',
        date: '기간',
        status: '상태',
        image: '이미지'
      }
    ],
    data: [
      {
        first: (
          <Checkbox
            className="no_label"
            checkbox={{ id: 'cell_check01', value: '', status: true }}
            onChange={() => {}}
          />
        ),
        title: '등록시 입력한 배너 제목',
        date: '2024.08.30-2028.08.30',
        status: <span className="status_public">공개</span>,
        image: <img src={require('assets/images/tmp/enterprise_main_swiper_pc@2x.png').default} alt="" />
      },
      {
        first: (
          <Checkbox
            className="no_label"
            checkbox={{ id: 'cell_check02', value: '', status: true }}
            onChange={() => {}}
          />
        ),
        title: '등록시 입력한 배너 제목 등록시 입력한 배너 제목 등록시 입력한 배너 제목',
        date: '2024.08.30-2028.08.30',
        status: <span className="status_ready">대기</span>,
        image: (
          <div className="no_img">
            <img src={NoImage02} alt="이미지 없음" />
          </div>
        )
      },
      {
        first: (
          <Checkbox
            className="no_label"
            checkbox={{ id: 'cell_check03', value: '', status: true }}
            onChange={() => {}}
          />
        ),
        title: '등록시 입력한 배너 제목',
        date: '2024.08.30-2028.08.30',
        status: <span className="status_close">종료</span>,
        image: <img src={require('assets/images/tmp/enterprise_main_swiper_pc@2x.png').default} alt="" />
      },
      {
        first: (
          <Checkbox
            className="no_label"
            checkbox={{ id: 'cell_check04', value: '', status: true }}
            onChange={() => {}}
          />
        ),
        title: '등록시 입력한 배너 제목',
        date: '2024.08.30-2028.08.30',
        status: <span className="status_private">비공개</span>,
        image: <img src={require('assets/images/tmp/enterprise_main_swiper_pc@2x.png').default} alt="" />
      }
    ]
  }
  const mktContext = useContext(MktContext)
  const userContext = useContext(UserContext)
  const history = useHistory()
  const location = useLocation()
  let path = location.pathname
  let page = path.split('/')[1]

  const [paging, setPaging] = useState(null)

  const [maximumAlert, setMaximumAlert] = useState(false)

  // ===== 탭
  const handleTab = async (selected) => {
    mktContext.actions.handleSetBannerCurrType(selected)
  }
  // ===== datepicker
  const onChangeDate = (currentDate, type, type2) => {
    // type: 신청기간인지 진행기간인지, type2: 시작일인지 종료일인지
    if (type === 'date1') {
      type2 === 'start'
        ? (setDate1({
            ...date1,
            startDate: currentDate
          }),
          setForm({
            ...form,
            enlsSldyTs: currentDate
          }))
        : (setDate1({
            ...date1,
            endDate: currentDate
          }),
          setForm({
            ...form,
            enlsCldyTs: currentDate
          }))
    } else {
      type2 === 'start'
        ? (setDate2({
            ...date2,
            startDate: currentDate
          }),
          setForm({
            ...form,
            evntStdyTs: currentDate
          }))
        : (setDate2({
            ...date2,
            endDate: currentDate
          }),
          setForm({
            ...form,
            evntFndaTs: currentDate
          }))
    }
  }
  // ===== 검색필터 : 전체, 공개, 대기, 종료
  const filterSelect = useRef(null)

  const onFilterActive = async (selected) => {
    mktContext.actions.handleSetBannerParam({
      page: 1,
      statusCode: selected
    })
  }

  // ===== 상세화면 이동 : id
  const handleView = (id) => {
    history.push(`${ROUTER_NAMES.COMMERCE_MAIN_BANNER_VIEW}/${id}`)
  }

  // ===== 등록 이동 : type (type is webMain, MobileMain)
  const [alertMsg, setAlertMsg] = useState('')
  const handleWrite = async (type) => {
    setAlertMsg(null)
    let maximumValidate = await mainFn.handleMaximumCheck(type, handleMaximunAlert)
    setAlertMsg(`게시중인 배너는 최대 ${mainFn.maximumCnt[type]}개까지\n설정 가능합니다.`)
    if (maximumValidate) {
      history.push(`${ROUTER_NAMES.COMMERCE_MAIN_BANNER_WRITE}/${type}`)
    }
  }

  // ===== maximunAlert
  const handleMaximunAlert = () => {
    setMaximumAlert(!maximumAlert)
  }

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
    mktContext.actions.handleSetBannerCurrType('webMain')
  }

  useLayoutEffect(() => {
    if ('webMain' !== userContext.state.category) {
      userContext.actions.setCategory('webMain')
      handleReset()
    }
  }, [userContext.state.category])

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'main'} currentPage={'bannerList'}>
      {/* {maximumAlert && <PopupAlert msg={alertMsg} handlePopup={handleMaximunAlert} />} */}
      <div className="content_inner page_main">
        <div className="page_header">
          <h4 className="page_title">팝업 관리</h4>
        </div>

        {/* <TermSearchForm searchDate={searchDate} setSearchDate={setSearchDate} getList={getList} /> */}
        {/*commerce_banner_wrap start*/}
        <div className="commerce_banner_wrap">
          <div className={'maximum_notice'}>
            <p className="require highlight_grey">홍보관 BOX 상품 메인 화면에 안내창을 팝업 할 수 있습니다.</p>
          </div>
          <div className={'search_table_wrap'}>
            <table className="table_search">
              <caption>상태, 제목 날짜별 조회 테이블</caption>
              <colgroup>
                <col width={'15%'} />
                <col width={'*'} />
              </colgroup>
              <tbody>
                <tr>
                  <th>상태</th>
                  <td>
                    {typeCheckboxList.map((check) => (
                      <Checkbox
                        key={check.id}
                        checkbox={{ id: check.id, value: check.value }}
                        status={check.status}
                        onChange={() => {}}
                      />
                    ))}
                  </td>
                </tr>
                <tr>
                  <th>
                    <Select
                      optionList={selectList ? selectList : defaultSelect}
                      handleSelectActive={onSelectActive}
                      ref={searchSelect}
                    />
                  </th>
                  <td>
                    <input
                      name={''}
                      type="text"
                      className="input"
                      value={value}
                      defaultValue={value}
                      title={'타이틀'}
                      placeholder={'타이틀을 입력해주세요'}
                    />
                  </td>
                </tr>
                <tr>
                  <th>날짜 선택</th>
                  <td>
                    <div className="tab_wrap">
                      {/* 선택된 날짜버튼 date 에 active 클래스 추가  */}
                      <button className={`btn_tab active`}>15일</button>
                      <button className={`btn_tab`}>1개월</button>
                      <button className={`btn_tab`}>2개월</button>
                      <button className={`btn_tab`}>3개월</button>
                    </div>
                    <div className="period_calendar">
                      <DatePicker
                        selected={date1.startDate ? date1.startDate : null}
                        onChange={(currentDate) => onChangeDate(currentDate, 'date1', 'start')}
                        locale={ko}
                        dateFormat={'yyyy-MM-dd'}
                        maxDate={date1.endDate ? date1.endDate : null}
                        title={'기간조회'}
                      />
                      <span className="datepicker_dash">~</span>
                      <DatePicker
                        selected={date1.endDate ? date1.endDate : null}
                        onChange={(currentDate) => onChangeDate(currentDate, 'date1', 'end')}
                        locale={ko}
                        dateFormat={'yyyy-MM-dd'}
                        minDate={date1.startDate ? date1.startDate : null}
                        title={'기간조회'}
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="button_bottom_group">
            <Button className={'basic'} onClick={() => {}}>
              초기화
            </Button>
            <Button className={'full_blue_deep'} onClick={() => {}}>
              검색
            </Button>
          </div>
          {/*tab_header start*/}
          <div className="tab_header">
            <div className="page_header_right">
              <div className="btn_group">
                <button className={'btn_refresh'} title={'새로고침'} onClick={handleReset}>
                  <span className="hide">새로고침</span>
                </button>
              </div>
            </div>
          </div>
          <div className="button_group_right">
            <Button className={'full_grey_dark'} onClick={() => {}}>
              삭제
            </Button>

            <Button className={'full_blue'} onClick={() => {}}>
              등록
            </Button>
          </div>
          <ExPopupTableNew dataList={mainData} handleView={handleView} />
          <div className="pagination_wrap">
            <Pagination
              pagingData={{ totalPage: 40, startPage: 1, page: 5, prev: true, next: true, endPage: 10 }}
              handlePaging={handlePaging}
            />
          </div>
        </div>
        {/*commerce_banner_wrap end*/}
      </div>
    </PageLayout>
  )
}

export default Admin_Popup_01_1
