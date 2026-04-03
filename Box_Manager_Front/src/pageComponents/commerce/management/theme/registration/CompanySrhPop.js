import { useEffect, useRef, useState, useContext, useCallback } from 'react'
import Button from 'components/atomic/Button'
import Select from 'components/atomic/Select'
import PopList from 'pageComponents/commerce/management/theme/registration/PopList'
import Checkbox from 'components/atomic/Checkbox'
import Pagination from 'components/Pagination'
import { getThemeComapnyListApi } from 'modules/consts/MktApi'
import { MktContext } from 'modules/common/MktContext'
import { UserContext } from 'modules/common/UserContext'
const CompanySrhPop = (props) => {
  const {
    selectList,
    selectList2,
    onSelectActive,
    onSelectActive2,
    value,
    popFlag,
    setPopFlag,
    companyInfo,
    setCompanyInfo,
    lClass,
    mClass
  } = props

  const mktContext = useContext(MktContext)
  const userContext = useContext(UserContext)
  const categorySelect = useRef(null)
  const categorySelect2 = useRef(null)
  const [delvCompanyInfo, setDelvCompanyInfo] = useState([])

  const [lClassSelect, setLClassSelect] = useState({
    active: 'categoryMain',
    list: lClass || []
  })
  // useEffect(() => {
  //   setLClassSelect({ active: lClass[0].id, list: lClass })
  // }, [lClass])
  const [mClassSelect, setMClassSelect] = useState({
    active: 'categoryMiddle',
    list: [{ id: 'categoryMiddle', value: 'categoryMiddle', label: '중분류' }]
  })
  // useEffect(() => {
  //   const filterList = mClass.filter((_item) => _item.parentId === lClass[0].id)
  //   setMClassSelect({ active: filterList[0].id, list: filterList })
  // }, [mClass])

  const initSearch = () => {
    setCheckItem1({
      label: '상태',
      items: [
        {
          label: '전체',
          id: 'allCertify',
          checked: true
        },
        {
          label: '인증',
          id: 'certify',
          checked: true
        },
        {
          label: '미인증',
          id: 'certifynot',
          checked: true
        }
      ]
    })
    setLClassSelect({ active: lClass[0].id, list: lClass })
    const filterList = mClass.filter((_item) => _item.parentId === lClass[0].id)
    setMClassSelect({ active: filterList[0].id, list: filterList })

    setParamList({
      certGb: 'allCertify',
      bplcNm: '',
      lctgyCd: lClass[0].id || '',
      mctgyCd: filterList[0]?.id || '',
      page: 1
    })
  }

  const typeCheckboxEnterprise = [
    { id: 'check_allEnterprise', value: '전체', checked: true },
    { id: 'check_big', value: '대기업', checked: true },
    { id: 'check_medium', value: '중소기업', checked: true },
    { id: 'check_small', value: '강소기업', checked: true }
  ]

  const typeCheckboxCeo = [
    { id: 'check_allCeo', value: '전체', checked: true },
    { id: 'check_ceo', value: '최고 경영자 클럽', checked: true },
    { id: 'check_future', value: '미래 경영자 클럽', checked: true },
    { id: 'check_female', value: '여성 경영자 클럽', checked: true },
    { id: 'check_fame', value: '명예의 전당', checked: true }
  ]
  const [checkItem1, setCheckItem1] = useState({
    label: '상태',
    items: [
      {
        label: '전체',
        id: 'allCertify',
        checked: true
      },
      {
        label: '인증',
        id: 'certify',
        checked: true
      },
      {
        label: '미인증',
        id: 'certifynot',
        checked: true
      }
    ]
  })

  const handleSearch = () => {
    setDelvCompanyInfo([])
    if (paramList.page === 1) {
      getComapnyList()
    } else {
      setParamList({
        ...paramList,
        page: 1
      })
    }
  }
  const [list, setList] = useState({
    isLoading: true,
    list: []
  })

  const [paramList, setParamList] = useState({
    certGb: 'allCertify',
    bplcNm: '',
    lctgyCd: lClass[0].id || '',
    mctgyCd: mClass.filter((_item) => _item.parentId === lClass[0].id)[0]?.id || '',
    page: 1
  })

  const [paging, setPaging] = useState(null)

  const handlePaging = (param) => {
    if (paramList.page != param.page) {
      setParamList({
        ...paramList,
        page: param.page
      })
      // getComapnyList()
    }
  }
  //조회
  const getComapnyList = () => {
    getThemeComapnyListApi(paramList, DetailListCallback, handleListErrorCallback)
  }
  //조회 후 콜백
  const DetailListCallback = (res) => {
    if (res.data.code === '200') {
      let data = res.data.data
      setList({
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

  //에러콜백
  const handleListErrorCallback = () => {
    setList({
      isLoading: false,
      list: []
    })
    mktContext.actions.setCommonAlertInfo({
      type: 'error',
      active: true
    })
  }

  ///선택기업목록부모화면 전달
  const handleDeliver = () => {
    if (delvCompanyInfo.length < 1) {
      mktContext.actions.setCommonAlertInfo({
        type: 'alert',
        active: true,
        msg: '선택된 기업이 없습니다.'
      })
    } else if (delvCompanyInfo.length < 7) {
      setCompanyInfo(delvCompanyInfo)
      setPopFlag(false)
    } else {
      mktContext.actions.setCommonAlertInfo({
        type: 'alert',
        active: true,
        msg: '기업은 최대 6개까지 선택가능합니다.'
      })
    }
  }

  const handleCheckChange = (e) => {
    const id = e.target.id
    const value = e.target.checked

    handleCheckData(id, value, setCheckItem1)
  }

  const handleCheckData = (id, value, setData) => {
    setData((prev) => {
      const newCheck = { ...prev }
      const newItems = [...newCheck.items]

      newItems.map((item) => {
        if (id.toLowerCase().indexOf('all') >= 0) {
          // 전체 일경우 다같이 처리
          item.checked = value
        } else {
          // 전체가 아닌경우 해당건만 반영
          if (item.id.toLowerCase().indexOf('all') >= 0) {
            item.checked = false // 전체 해제
          } else if (item.id === id) {
            item.checked = value
          }
        }
      })
      const allList = newItems.filter((item) => item.id.toLowerCase().indexOf('all') >= 0)
      if (allList.length > 0) {
        // 전체가 잇을경우 전체 제외 나머지 다체크되어잇으면 전체도 체크되도록 처리
        const allLength = newItems.length - 1
        if (newItems.filter((item) => item.id.toLowerCase().indexOf('all') < 0 && item.checked).length === allLength) {
          allList.map((item) => {
            item.checked = true
          })
        }
      }

      const checkList = newItems.filter((_item) => _item.checked)
      setParamList({ ...paramList, certGb: checkList.length < 1 ? '' : checkList[0].id })

      return newCheck
    })
  }

  useEffect(() => {
    initSearch()
  }, [])

  useEffect(() => {
    getComapnyList()
  }, [paramList.page])

  return (
    <div className="popup_wrap popup_enterprise">
      <div className="layer">&nbsp;</div>
      <div className="popup_container">
        <div className="popup_content scroll">
          <div className="popup_main_header">
            <div className="title">기업 검색</div>
            <Button
              className="popup_close_button"
              aria-label="팝업 닫기"
              onClick={() => {
                setPopFlag(false)
              }}
            />
          </div>

          <div className={'search_table_wrap'}>
            <table className="table_search">
              <caption>기업 형태, 경영자 클럽, IBK 인증, 기업명, 카테고리 선택 조회 테이블</caption>
              <colgroup>
                <col width={'15%'} />
                <col width={'*'} />
              </colgroup>
              <tbody>
                {/* <tr>
                  <th>기업 형태</th>
                  <td>
                    {typeCheckboxEnterprise.map((check) => (
                      <Checkbox
                        key={check.id}
                        checkbox={{ id: check.id, value: check.value }}
                        checked={check.checked}
                        onChange={() => {}}
                      />
                    ))}
                  </td>
                </tr> */}
                {/* <tr>
                  <th>경영자 클럽</th>
                  <td>
                    {typeCheckboxCeo.map((check) => (
                      <Checkbox
                        key={check.id}
                        checkbox={{ id: check.id, value: check.value }}
                        checked={check.checked}
                        onChange={() => {}}
                      />
                    ))}
                  </td>
                </tr> */}
                <tr>
                  <th>IBK 인증</th>
                  <td>
                    {checkItem1.items.map((check) => (
                      <Checkbox
                        key={check.id}
                        checkbox={{ id: check.id, value: check.label }}
                        checked={check.checked || false}
                        onChange={(e) => {
                          handleCheckChange(e)
                        }}
                      />
                    ))}
                  </td>
                </tr>
                <tr>
                  <th>기업명</th>
                  <td>
                    <input
                      name={''}
                      type="text"
                      className="input"
                      value={paramList.bplcNm}
                      title={'기업명'}
                      placeholder={'기업명을 입력해주세요'}
                      onChange={(e) => {
                        setParamList({ ...paramList, bplcNm: e.target.value })
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <th>카테고리</th>
                  <td>
                    <div className={'selectCategory_wrap'}>
                      <Select
                        optionList={lClassSelect}
                        handleSelectActive={(selected) => {
                          let newMClass = mClass.filter((item) => item.parentId === selected)
                          setMClassSelect({ active: newMClass[0].id, list: newMClass })
                          setParamList({ ...paramList, lctgyCd: selected, mctgyCd: newMClass[0].id })
                        }}
                        ref={categorySelect}
                      />
                      {/* <Select
                        optionList={mClassSelect}
                        handleSelectActive={(selected) => {
                          setParamList({ ...paramList, mctgyCd: selected })
                        }}
                        ref={categorySelect2}
                      /> */}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="button_bottom_group">
            <Button
              className={'basic'}
              onClick={() => {
                initSearch()
              }}
            >
              초기화
            </Button>
            <Button className={'full_blue_deep'} onClick={handleSearch}>
              검색
            </Button>
          </div>

          <div className="button_group_right">
            <Button
              className={'full_grey_dark'}
              onClick={() => {
                setDelvCompanyInfo([])
              }}
            >
              초기화
            </Button>
            <Button className={'full_blue'} onClick={handleDeliver}>
              저장
            </Button>
          </div>
          <PopList
            dataList={list}
            delvCompanyInfo={delvCompanyInfo}
            setDelvCompanyInfo={setDelvCompanyInfo}
            mktContext={mktContext}
          />
          <div className="pagination_wrap">
            <Pagination pagingData={paging} handlePaging={handlePaging} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanySrhPop
