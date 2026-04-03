import Pagination from 'components/Pagination'
import Button from 'components/atomic/Button'
import Radio from 'components/atomic/Radio'
import Select from 'components/atomic/Select'
import ko from 'date-fns/locale/ko'
import { MktContext } from 'modules/common/MktContext'
import { UserContext } from 'modules/common/UserContext'
import {
  deleteSearchProductApiV2,
  getRecommendSearchDetailApi,
  getSearchProductListApiV2,
  saveSearchRecommendApiV2,
  deleteSearchApiV2
} from 'modules/consts/MktApi'
import { loader } from 'modules/utils/CommonAxios'
import { StringUtils } from 'modules/utils/StringUtils'
import moment from 'moment'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import ProductAddTable from '../ProductAddTable'
import ProductTable from '../ProductTable'

const RecommentSearchPopup = (props) => {
  const { onClosePopup, value, initialEditId, recommendSearchData } = props
  const mktContext = useContext(MktContext)
  const userContext = useContext(UserContext)
  const sortSelect = useRef(null)
  const [paging, setPaging] = useState(null)
  const [regPdfInfoIds, setRegPdfInfoIds] = useState([]) //상품 등록 테이블
  const [addPdfInfoIds, setAddPdfInfoIds] = useState([]) //상품 추가 테이블
  const [editId, setEditId] = useState(initialEditId)

  // 탭
  const tabList = {
    active: mktContext.state.productSearchType,
    list: [
      { id: 'productRegistration', label: '상품 등록' },
      { id: 'productAdd', label: '상품 추가' }
    ]
  }

  const handleTab = async (selected) => {
    setSearchInput('')
    onSelectActive('productSort1')
    setAddPdfInfoIds([])
    mktContext.actions.handleSetProductSearchCurrType(selected)
  }

  const [data, setData] = useState({
    srwdInfId: '',
    srwdPtrn: 'STS00001',
    oppbYn: 'N',
    srwd: '',
    stdy: '',
    fnda: '',
    stdyTs: null,
    fndaTs: null,
    recommendProductList: []
  })

  const typeRadioList = [
    { id: 'Y', value: '공개', name: 'public' },
    { id: 'N', value: '비공개', name: 'public' }
  ]

  // ===== datepicker
  const onChangeDate = (currentDate, type) => {
    if (type === 'start') {
      setData({
        ...data,
        stdy: moment(currentDate).format('yyyy-MM-DD').toString(),
        stdyTs: currentDate
      })
    } else if (type === 'end') {
      setData({
        ...data,
        fnda: moment(currentDate).format('yyyy-MM-DD 23:59:59').toString(),
        fndaTs: currentDate
      })
    }
  }

  const handleSetData = (type, value) => {
    setData({
      ...data,
      [type]: value
    })
  }

  const [searchProductData, setSearchProductData] = useState({
    isLoading: true,
    list: []
  })

  const [selectList, setSelectList] = useState({
    active: 'productSort1',
    list: [
      { id: 'productSort1', value: 'productSort1', label: '상품명' },
      { id: 'productSort2', value: 'productSort2', label: '상품키워드' }
    ]
  })

  const [searchInput, setSearchInput] = useState('') // 검색
  const [search, setSearch] = useState({
    page: 1,
    record: 10,
    pdfInfoCon: ''
  })

  const onSelectActive = (selected) => {
    setSelectList({
      ...selectList,
      active: selected
    })
  }

  // Enter + 검색
  const onKeyPress = (e) => {
    e.key === 'Enter' && handleSearch()
  }

  const handleSearch = async () => {
    // 검색 클릭시 페이지 초기화, 조건중 나머지값 초기화
    let params = {}
    const _searchInput = searchInput.trim()
    params = {
      page: 1,
      record: 10,
      pdfInfoCon: _searchInput
    }
    getSearchProductList(params)
  }

  // 상품추가 리스트 조회
  const getSearchProductList = useCallback((params) => {
    getSearchProductListApiV2(
      params,
      handleSearchListCallback(setSearchProductData),
      handleSearchListErrorCallback(setSearchProductData)
    )
  }, [])

  // 상품추가 리스트 조회
  const handleSearchListCallback = (setData) => (res) => {
    if (res.data.code === '200') {
      const data = res.data.data
      setData({
        isLoading: false,
        list: data?.list
      })
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

  // 에러 메세지
  const handleSearchListErrorCallback = (setData) => () => {
    setData({
      isLoading: false,
      list: []
    })
    mktContext.actions.setCommonAlertInfo({
      type: 'error',
      active: true
    })
  }

  // ===== reset
  const handleReset = () => {
    handleTab('productAdd')
    setSearch({
      page: 1,
      record: 10,
      pdfInfoCon: ''
    })
  }

  // ===== 페이징
  const handlePaging = (param) => {
    if (search.page != param.page) {
      setSearch({
        ...search,
        page: param.page,
        record: search.record,
        pdfInfoCon: searchInput.trim()
      })
    }
  }

  // 중복상품
  const handleAddProducts = () => {
    setEditId(null)

    const duplicateProducts = addPdfInfoIds.filter((addItem) =>
      data.recommendProductList.some((regItem) => regItem.pdfInfoId === addItem.pdfInfoId)
    )

    if (duplicateProducts.length > 0) {
      mktContext.actions.setCommonAlertInfo({
        type: 'alert',
        active: true,
        msg: '선택한 상품과 동일한 상품이 추가되어있습니다.'
      })
      return
    }

    const filterProducts = addPdfInfoIds.filter(
      (addItem) => !data.recommendProductList.some((regItem) => regItem.pdfInfoId === addItem.pdfInfoId)
    )
    const newRecommendProductList = [...data.recommendProductList, ...filterProducts]

    setData({
      ...data,
      recommendProductList: newRecommendProductList
    })

    setRegPdfInfoIds([...regPdfInfoIds, filterProducts])
    handleInsertCallback()
  }

  const handleInsertCallback = () => {
    mktContext.actions.setCommonAlertInfo({
      type: 'alert',
      active: true,
      msg: '선택한 상품이 추가되었습니다.'
    })
  }

  const handleRequiredCheck = () => {
    if (
      StringUtils.hasLength(data.oppbYn) &&
      StringUtils.hasLength(data.srwd) &&
      StringUtils.hasLength(data.stdy) &&
      StringUtils.hasLength(data.fnda)
    ) {
      return true
    }
    return false
  }

  //상품저장
  const handleSave = () => {
    const recommentCnt = recommendSearchData.list.filter(
      (item) => item.oppbYn === 'Y' && item.srwdInfId !== data.srwdInfId
    ).length
    if (data.oppbYn === 'Y' && recommentCnt >= 5) {
      mktContext.actions.setCommonAlertInfo({
        type: 'alert',
        active: true,
        msg: '추천 검색어는 5개 이상 설정할 수 없습니다.'
      })
      return
    }

    if (!handleRequiredCheck()) {
      mktContext.actions.setCommonAlertInfo({
        type: 'alert',
        active: true,
        msg: '필수 정보를 모두 입력해주세요.'
      })
      return false
    }
    saveSearchRecommendApiV2(data, handleSaveCb, handleSaveErrCb)
  }

  const handleSaveCb = () => {
    mktContext.actions.setCommonAlertInfo({
      type: 'function1Btn',
      active: true,
      msg: '저장되었습니다.',
      action: () => {
        handleTab('productRegistration')
        onClosePopup()
      }
    })
  }

  const handleSaveErrCb = () => {
    mktContext.actions.setCommonAlertInfo({
      type: 'error',
      active: true
    })
  }

  const handleUpdateDataSet = async () => {
    if (editId) {
      loader(true, 'Uploading...')
      let res = await getRecommendSearchDetailApi(editId)
      if (res.data.code === '200') {
        let data = res.data.data
        setData({
          srwdInfId: data.adminSearch.srwdInfId,
          srwdPtrn: data.adminSearch.srwdPtrn,
          oppbYn: data.adminSearch.oppbYn,
          srwd: data.adminSearch.srwd,
          stdy: data.adminSearch.stdy,
          stdyTs: new Date(data.adminSearch.stdy),
          fnda: data.adminSearch.fnda,
          fndaTs: new Date(data.adminSearch.fnda),
          recommendProductList: data.recommendProductList
        })
        await loader()
      }
    } else {
      mktContext.actions.setCommonAlertInfo({
        type: 'alert',
        active: true,
        msg: '저장 후 선택해주세요.'
      })
    }
  }

  //상품 테이블 삭제
  const handleProductDelete = () => {
    if (regPdfInfoIds?.length > 0) {
      mktContext.actions.setCommonAlertInfo({
        type: 'function',
        active: true,
        msg: '삭제 하시겠습니까?',
        btnMsg: '취소',
        btnMsg2: '확인',
        action2: () => {
          deleteSearchProductApiV2(
            regPdfInfoIds.map((_item) => _item.pdfInfoId),
            handleDeleteCallback,
            handleDeleteErrorCallback
          )
          setRegPdfInfoIds([])
        }
      })
    } else {
      mktContext.actions.setCommonAlertInfo({
        type: 'alert',
        active: true,
        msg: '삭제할 상품을 선택해주세요.'
      })
    }
  }

  const handleClose = () => {
    if (
      data.oppbYn === 'Y' ||
      StringUtils.hasLength(data.srwd) ||
      StringUtils.hasLength(data.stdy) ||
      StringUtils.hasLength(data.fnda)
    ) {
      mktContext.actions.setCommonAlertInfo({
        type: 'function',
        active: true,
        msg: '작성중인 내용이 있습니다. 나가시겠습니까?',
        btnMsg: '취소',
        btnMsg2: '확인',
        action2: () => {
          handleTab('productRegistration')
          onClosePopup()
        }
      })
    } else {
      handleTab('productRegistration')
      onClosePopup()
    }
  }

  const handleDelete = () => {
    if (!editId) {
      mktContext.actions.setCommonAlertInfo({
        type: 'function',
        active: true,
        msg: '작성중인 내용이 있습니다. 나가시겠습니까?',
        btnMsg: '취소',
        btnMsg2: '확인',
        action2: () => {
          handleTab('productRegistration')
          onClosePopup()
        }
      })
    } else {
      if (data.oppbYn === 'Y') {
        mktContext.actions.setCommonAlertInfo({
          type: 'alert',
          active: true,
          msg: '공개 검색어는 삭제가 불가능 합니다.'
        })
        return false
      } else {
        mktContext.actions.setCommonAlertInfo({
          type: 'function',
          active: true,
          msg: '삭제 하시겠습니까?',
          btnMsg: '취소',
          btnMsg2: '확인',
          action2: () => {
            deleteSearchApiV2([data.srwdInfId], handleDelete2Callback, handleDeleteErrorCallback)
          }
        })
      }
    }
  }

  //수정, 삭제 후처리
  const handleDeleteCallback = () => {
    handleUpdateDataSet()
  }

  const handleDelete2Callback = () => {
    handleTab('productRegistration')
    onClosePopup()
  }

  //수정, 삭제 실패시
  const handleDeleteErrorCallback = () => () => {
    mktContext.actions.setCommonAlertInfo({
      type: 'error',
      active: true
    })
  }

  useEffect(() => {
    editId && handleUpdateDataSet()
    if (tabList.active === 'productAdd') {
      getSearchProductList(search)
    }
  }, [editId, search, tabList.active])

  if (editId && !data?.srwdInfId) {
    return null
  }
  return (
    <div className="popup_wrap popup_enterprise">
      <div className="layer">&nbsp;</div>
      <div className="popup_container">
        <div className="popup_content scroll">
          <div className="popup_main_header">
            <div className="title">추천 검색어 관리</div>
            <Button className="popup_close_button" aria-label="팝업 닫기" onClick={handleClose} />
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
                  <Button className={'full_grey_dark'} onClick={handleProductDelete}>
                    삭제
                  </Button>

                  {/* <Button className={'full_blue'} onClick={handleSave}>
                    저장
                  </Button> */}
                </div>
              </div>
              <ProductTable
                dataList={data}
                setDataList={setData}
                regPdfInfoIds={regPdfInfoIds}
                setRegPdfInfoIds={setRegPdfInfoIds}
              />
              <div className="popup_title">추천 검색어 정보</div>

              <div className={'search_table_wrap'}>
                <table className="table_search">
                  <caption>공개, 검색어, 기간 관리 테이블 </caption>
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
                          <Radio
                            key={radio.id}
                            radio={radio}
                            name={radio.name}
                            defaultChecked={radio.id == (data.oppbYn || 'N')}
                            onChange={(e) => {
                              handleSetData('oppbYn', e.target.id)
                            }}
                          />
                        ))}
                      </td>
                    </tr>

                    <tr>
                      <th>
                        <span className="require" aria-label="필수 요소" />
                        검색어
                      </th>
                      <td>
                        <input
                          name={''}
                          type="text"
                          className="input"
                          value={data.srwd}
                          // defaultValue={data.srwd ? data.srwd : ''}
                          title={'검색어'}
                          placeholder={'검색어를 입력해주세요'}
                          onChange={(e) => setData({ ...data, srwd: e.target.value })}
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>
                        <span className="require" aria-label="필수 요소" />
                        기간
                      </th>
                      <td>
                        <div className="period_calendar">
                          <DatePicker
                            selected={data.stdyTs ? data.stdyTs : null}
                            onChange={(currentDate) => onChangeDate(currentDate, 'start')}
                            locale={ko}
                            dateFormat={'yyyy-MM-dd'}
                            maxDate={data.fndaTs ? data.fndaTs : null}
                            title={'기간조회'}
                          />
                          <span className="datepicker_dash">~</span>
                          <DatePicker
                            selected={data.fndaTs ? data.fndaTs : null}
                            onChange={(currentDate) => onChangeDate(currentDate, 'end')}
                            locale={ko}
                            dateFormat={'yyyy-MM-dd'}
                            minDate={data.stdyTs ? data.stdyTs : null}
                            title={'기간조회'}
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="rounded_btn_group">
                <Button className={'basic'} onClick={handleDelete}>
                  삭제
                </Button>
                <Button
                  className={'full_blue'}
                  onClick={handleSave}
                  children={initialEditId ? '수정' : '등록'}
                ></Button>
              </div>
              {/* end: 상품 등록  */}
            </div>
          ) : tabList.active === 'productAdd' ? (
            <div className="tabContents" id="tab_productAdd">
              {/* start: 상품 추가  */}
              <div className="sortingArea">
                <Select optionList={selectList} handleSelectActive={onSelectActive} ref={sortSelect} />
                <input
                  name={''}
                  type="text"
                  className="input"
                  value={searchInput}
                  title={'타이틀'}
                  placeholder={'검색어를 입력해주세요.'}
                  onChange={(e) => {
                    setSearchInput(e.target.value)
                  }}
                  onKeyDown={onKeyPress}
                />
                <Button className={'full_blue_deep search_btn'} onClick={handleSearch}>
                  검색
                </Button>
                <div className="button_group_right">
                  <Button className={'full_grey_dark'} onClick={handleAddProducts}>
                    선택 추가
                  </Button>

                  <Button className={'full_blue'} onClick={handleReset}>
                    초기화
                  </Button>
                </div>
              </div>
              <ProductAddTable
                dataList={searchProductData}
                addPdfInfoIds={addPdfInfoIds}
                setAddPdfInfoIds={setAddPdfInfoIds}
              />
              <div className="pagination_wrap">
                <Pagination pagingData={paging} handlePaging={handlePaging} />
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

export default RecommentSearchPopup
