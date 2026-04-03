import { useEffect, useRef, useState, useContext, useLayoutEffect } from 'react'
import Button from 'components/atomic/Button'
import DatePicker, { registerLocale } from 'react-datepicker'
import Radio from 'components/atomic/Radio'
import Select from 'components/atomic/Select'
import ko from 'date-fns/locale/ko'
import { MktContext } from 'modules/common/MktContext'
import { UserContext } from 'modules/common/UserContext'
import ExProductTableNew from 'pageComponents/commerce/main/ExProductTableNew'
import ExProductTableAddNew from 'pageComponents/commerce/main/ExProductTableAddNew'
import Checkbox from 'components/atomic/Checkbox'
import Pagination from 'components/Pagination'
const Admin_Product_Menu_01_3 = (props) => {
  const { selectList, onSelectActive, value } = props

  const mktContext = useContext(MktContext)
  const userContext = useContext(UserContext)
  const sortSelect = useRef(null)
  const defaultSelect = {
    active: 'productSort1',
    list: [
      { id: 'productSort1', value: 'productSort1', label: '상품명' },
      { id: 'productSort2', value: 'productSort2', label: '상품명2' }
    ]
  }
  // 탭
  const tabList = {
    active: mktContext.state.currType,
    list: [
      { id: 'productRegistration', label: '상품 등록' },
      { id: 'productAdd', label: '상품 추가' }
    ]
  }
  const handleTab = async (selected) => {
    mktContext.actions.handleSetBannerCurrType(selected)
  }
  // ===== reset
  const handleReset = () => {
    mktContext.actions.handleSetBannerCurrType('productRegistration')
  }

  useLayoutEffect(() => {
    if ('productRegistration' !== userContext.state.category) {
      userContext.actions.setCategory('productRegistration')
      handleReset()
    }
  }, [userContext.state.category])

  const [date1, setDate1] = useState({
    startDate: null,
    endDate: null
  })

  const [date2, setDate2] = useState({
    startDate: null,
    endDate: null
  })
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

  const typeRadioList = [
    { id: 'publicY', value: '공개', name: 'public' },
    { id: 'publicN', value: '비공개', name: 'public' }
  ]
  const productData = {
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
        policy: '판매 정책',
        order: '순서'
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
        policy: 'BOX POS 결제',
        order: <button type="button" className="drag_button" aria-label="드래그해서 이동" />
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
        policy: 'BOX POS 결제',
        order: <button type="button" className="drag_button" aria-label="드래그해서 이동" />
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
        policy: '견적 요청 받기',
        order: <button type="button" className="drag_button" aria-label="드래그해서 이동" />
      }
    ]
  }
  const productAddData = {
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
    <div className="popup_wrap popup_enterprise">
      <div className="layer">&nbsp;</div>
      <div className="popup_container">
        <div className="popup_content scroll">
          <div className="popup_main_header">
            <div className="title">메뉴 상세 설정</div>
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
          {tabList.active === 'productRegistration' ? (
            <div className="tabContents" id="tab_productRegistration">
              {/* start: 상품 등록  */}
              <div className="sortingArea">
                <div className="button_group_right">
                  <Button className={'full_grey_dark'} onClick={() => {}}>
                    삭제
                  </Button>
                  {/* 
                  <Button className={'full_blue'} onClick={() => {}}>
                    저장
                  </Button> */}
                </div>
              </div>
              <ExProductTableNew dataList={productData} />
              <div className="popup_title">메뉴 관리</div>

              <div className={'search_table_wrap'}>
                <table className="table_search">
                  <caption>공개, 메뉴명 입력 테이블 </caption>
                  <colgroup>
                    <col width={'15%'} />
                    <col width={'*'} />
                  </colgroup>
                  <tbody>
                    <tr>
                      <th>
                        <span className="require" aria-label="필수 요소" />
                        공개
                      </th>

                      <td>
                        {typeRadioList.map((radio) => (
                          <Radio key={radio.id} radio={radio} name={radio.name} onChange={() => {}} />
                        ))}
                        <div className="caution">비공개 선택시 메뉴 모두 비공개 처리 됩니다.</div>
                      </td>
                    </tr>

                    <tr>
                      <th>
                        <span className="require" aria-label="필수 요소" />
                        메뉴명
                      </th>
                      <td>
                        <input
                          name={''}
                          type="text"
                          className="input"
                          value={value}
                          defaultValue={value}
                          title={'메뉴명'}
                          placeholder={'변경하실 메뉴명을 입력하세요.'}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="rounded_btn_group">
                <Button className={'basic'} onClick={() => {}}>
                  취소
                </Button>
                <Button className={'full_blue'} onClick={() => {}}>
                  저장
                </Button>
              </div>
              {/* end: 상품 등록  */}
            </div>
          ) : tabList.active === 'productAdd' ? (
            <div className="tabContents" id="tab_productAdd">
              {/* start: 상품 추가  */}
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
              <ExProductTableAddNew dataList={productAddData} />
              <div className="pagination_wrap">
                <Pagination
                  pagingData={{ totalPage: 40, startPage: 1, page: 5, prev: true, next: true, endPage: 10 }}
                  handlePaging={() => {}}
                />
              </div>
              {/* end: 상품 추가  */}
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  )
}

export default Admin_Product_Menu_01_3
