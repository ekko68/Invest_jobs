import { useEffect, useRef, useState, useContext, useLayoutEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import Button from 'components/atomic/Button'
import Select from 'components/atomic/Select'
import { MktContext } from 'modules/common/MktContext'
import { UserContext } from 'modules/common/UserContext'
import ExEventSituationTable from 'pageComponents/commerce/main/ExEventSituationTable'
import ExProductTableAddNew from 'pageComponents/commerce/main/ExProductTableAddNew'
import Checkbox from 'components/atomic/Checkbox'
import Pagination from 'components/Pagination'
const Admin_event_Current_situation_01_2 = (props) => {
  const { selectList, selectList2, onSelectActive, onSelectActive2, value } = props
  const mktContext = useContext(MktContext)
  const userContext = useContext(UserContext)
  const sortSelect = useRef(null)
  const defaultSelect = {
    active: 'categoryMain',
    list: [
      { id: 'categoryMain', value: 'categoryMain', label: '상품명' },
      { id: 'categoryMain1', value: 'categoryMain1', label: '상품명1' }
    ]
  }

  // 탭
  const tabList = {
    active: mktContext.state.currType,
    list: [
      { id: 'eventPartIn', label: '이벤트 참여 상품' },
      { id: 'eventAdd', label: '참여 상품 추가' }
    ]
  }
  const handleTab = async (selected) => {
    mktContext.actions.handleSetBannerCurrType(selected)
  }

  // ===== reset
  const handleReset = () => {
    mktContext.actions.handleSetBannerCurrType('eventPartIn')
  }
  useLayoutEffect(() => {
    if ('eventPartIn' !== userContext.state.category) {
      userContext.actions.setCategory('eventPartIn')
      handleReset()
    }
  }, [userContext.state.category])
  const mainData = {
    header: [
      {
        first: '상품명',
        type: '소분류 / 세분류',
        price: '판매가',
        state: '상태',
        policy: '판매 정책',
        action: '',
        last: '순서'
      }
    ],
    data: [
      {
        first: '상품명',
        type: '남아 수영복',
        price: '45,000 원',
        state: '판매중',
        policy: 'BOX POS 결제',
        action: <Button className="grayLine">승인</Button>,
        last: <button type="button" className="drag_button" aria-label="드래그해서 이동" />
      },
      {
        first: '상품명',
        type: '튜브',
        price: '45,000 원',
        state: '판매중',
        policy: '견적 요청 받기',
        action: <Button className="grayLine">승인 취소</Button>,
        last: <button type="button" className="drag_button" aria-label="드래그해서 이동" />
      },
      {
        first: '상품명',
        type: '남아 수영복',
        price: '45,000 원',
        state: '판매중',
        policy: 'BOX POS 결제',
        action: <Button className="grayLine">승인</Button>,
        last: <button type="button" className="drag_button" aria-label="드래그해서 이동" />
      }
    ]
  }
  const eventAddData = {
    header: [
      {
        first: (
          <Checkbox
            className="no_label"
            checkbox={{ id: 'cell_checkAll', value: '', status: true }}
            onChange={() => {}}
          />
        ),
        name: '상품명',
        type: '소분류/세분류',
        price: '판매가',
        status: '상태',
        policy: '판매 정책'
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
        name: '미키 마우스 레시가드',
        type: '남아 수영복',
        price: '45,000 원',
        status: '판매중',
        policy: 'BOX POS 결제'
      },
      {
        first: (
          <Checkbox
            className="no_label"
            checkbox={{ id: 'cell_check02', value: '', status: true }}
            onChange={() => {}}
          />
        ),
        name: '미키 마우스 레시가드',
        type: '튜브',
        price: '45,000 원',
        status: '판매중',
        policy: 'BOX POS 결제'
      },
      {
        first: (
          <Checkbox
            className="no_label"
            checkbox={{ id: 'cell_check03', value: '', status: true }}
            onChange={() => {}}
          />
        ),
        name: '미키 마우스 아쿠아슈즈',
        type: '아쿠아슈즈',
        price: '45,000 원',
        status: '판매중',
        policy: '견적 요청 받기'
      },
      {
        first: (
          <Checkbox
            className="no_label"
            checkbox={{ id: 'cell_check04', value: '', status: true }}
            onChange={() => {}}
          />
        ),
        name: '미키 마우스 아쿠아슈즈',
        type: '아쿠아슈즈',
        price: '45,000 원',
        status: '판매중',
        policy: '견적 요청 받기'
      },
      {
        first: (
          <Checkbox
            className="no_label"
            checkbox={{ id: 'cell_check05', value: '', status: true }}
            onChange={() => {}}
          />
        ),
        name: '미키 마우스 아쿠아슈즈',
        type: '아쿠아슈즈',
        price: '45,000 원',
        status: '판매중',
        policy: '견적 요청 받기'
      },
      {
        first: (
          <Checkbox
            className="no_label"
            checkbox={{ id: 'cell_check06', value: '', status: true }}
            onChange={() => {}}
          />
        ),
        name: '미키 마우스 아쿠아슈즈',
        type: '아쿠아슈즈',
        price: '45,000 원',
        status: '판매중',
        policy: '견적 요청 받기'
      },
      {
        first: (
          <Checkbox
            className="no_label"
            checkbox={{ id: 'cell_check07', value: '', status: true }}
            onChange={() => {}}
          />
        ),
        name: '미키 마우스 아쿠아슈즈',
        type: '아쿠아슈즈',
        price: '45,000 원',
        status: '판매중',
        policy: '견적 요청 받기'
      }
    ]
  }
  return (
    <div className="popup_wrap popup_event_situation">
      <div className="layer">&nbsp;</div>
      <div className="popup_container">
        <div className="popup_content scroll">
          <div className="popup_main_header">
            <div className="title">이벤트 참여 상품</div>
            <Button className="popup_close_button" aria-label="팝업 닫기" onClick={() => {}} />
          </div>
          <div className="tab_header">
            <ul className="tab_header_list">
              {tabList.list.map((tab, idx) => (
                <li
                  className={`tab_header_item ${tabList.active === tab.id ? 'active' : ''}`}
                  key={tab.id}
                  onClick={() => handleTab(tab.id)}
                >
                  <span className="label">{tab.label}</span>
                </li>
              ))}
            </ul>
          </div>
          {tabList.active === 'eventPartIn' ? (
            <div className="tabContents" id="tab_eventPartIn">
              {/* start: 이벤트 참여 상품  */}
              <div className="sortingArea">
                <div className="button_group_right">
                  <Button className={'full_grey_dark'} onClick={() => {}}>
                    전체 거절
                  </Button>

                  <Button className={'full_blue'} onClick={() => {}}>
                    전체 승인
                  </Button>
                </div>
              </div>
              <ExEventSituationTable dataList={mainData} />
              <div className="pagination_wrap">
                <Pagination
                  pagingData={{ totalPage: 40, startPage: 1, page: 5, prev: true, next: true, endPage: 10 }}
                  handlePaging={() => {}}
                />
              </div>
              {/* end: 이벤트 참여 상품  */}
            </div>
          ) : tabList.active === 'eventAdd' ? (
            <div className="tabContents" id="tab_eventAdd">
              {/* start: 참여 상품 추가  */}
              <div className="sortingArea">
                <Select
                  optionList={selectList ? selectList : defaultSelect}
                  handleSelectActive={onSelectActive}
                  ref={sortSelect}
                />
                <input
                  name={''}
                  type="text"
                  className="input"
                  value={value}
                  defaultValue={value}
                  title={'타이틀'}
                  placeholder={'타이틀을 입력해주세요'}
                />
                <Button className={'full_blue_deep search_btn'} onClick={() => {}}>
                  검색
                </Button>
                <div className="button_group_right">
                  <Button className={'full_grey_dark'} onClick={() => {}}>
                    선택 추가
                  </Button>

                  <Button className={'full_blue'} onClick={() => {}}>
                    초기화
                  </Button>
                </div>
              </div>
              <ExProductTableAddNew dataList={eventAddData} />
              <div className="pagination_wrap">
                <Pagination
                  pagingData={{ totalPage: 40, startPage: 1, page: 5, prev: true, next: true, endPage: 10 }}
                  handlePaging={() => {}}
                />
              </div>
              {/* end: 참여 상품 추가  */}
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  )
}

export default Admin_event_Current_situation_01_2
