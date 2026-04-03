import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import ko from 'date-fns/locale/ko'
import Button from 'components/atomic/Button'
import Select from 'components/atomic/Select'
import Checkbox from 'components/atomic/Checkbox'
import { StringUtils } from 'modules/utils/StringUtils'
import moment from 'moment'

/**
 * 홍보관 검색 공통 컴포넌트
 * check1,2: 체크박스 1번 (전체일경우 id에 all 필요)
 * check1 {
 *  label: '라벨명'
 *  items: [
 *    {
 *      id: 'all'
 *     ,label: '전체'
 *     ,checked: false
 *    }
 *    ...
 *  ]
 * }
 *
 *
 * input: 입력데이터 필드
 * input: {
 *  active: 'id' // 초기 선택필드 id
 *  list: [
 *    id: 'id'
 *    label: '설명'
 *  ]
 * }
 *
 * date: 날짜 필드
 * date: {
 *  active: true,
 *  default: '' // 디폴트 일자선택 ex) 15d, 1m, 2m, 3m
 * }
 *
 * onSearch: 검색
 * @returns
 */
const Search = (props) => {
  const { check1, check2, input, date, onSearch } = props

  const [checkItem1, setCheckItem1] = useState(null)
  const [checkItem2, setCheckItem2] = useState(null)
  const [inputs, setInputs] = useState([])
  const [inputData, setInputData] = useState({
    id: '',
    label: '',
    value: ''
  })
  const [dateItem, setDateItem] = useState({
    default: '', // 디폴트 일자선택 ex) 15d, 1m, 2m, 3m
    active: false // 날짜선택 여부
  })

  const searchSelect = useRef(null)

  const [searchDate, setSearchDate] = useState({
    startDate: null,
    endDate: null
  })

  const initData = useCallback(() => {
    if (check1) {
      setCheckItem1(JSON.parse(JSON.stringify(check1)))
    }
    if (check2) {
      setCheckItem2(JSON.parse(JSON.stringify(check2)))
    }
    if (input) {
      setInputs(JSON.parse(JSON.stringify(input)))
    }

    if (input.list?.length > 0) {
      setInputData({
        id: input.list[0].id,
        label: input.list[0].label,
        value: ''
      })
    } else {
      setInputData({
        id: '',
        label: '',
        value: ''
      })
    }
    setDateItem(date)
    if (date?.active && StringUtils.hasLength(date?.default)) {
      handleDate(date.default)
    }
  }, [check1, check2, input, date])

  const handleCheckChange = (e, index) => {
    const id = e.target.id
    const value = e.target.checked
    if (index === 1) {
      handleCheckData(id, value, setCheckItem1)
    } else if (index === 2) {
      handleCheckData(id, value, setCheckItem2)
    }
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

      return newCheck
    })
  }

  useEffect(() => {
    initData()
  }, [])

  const handleDate = (def) => {
    let stdt = ''
    let eddt = ''
    switch (def) {
      case '15d':
        stdt = new Date(moment().subtract(15, 'days'))
        eddt = new Date() // 년월일까지만 만들어 주고 시간 x 00:00:00
        break
      case '1m':
        stdt = new Date(moment().subtract(1, 'month'))
        eddt = new Date()
        break
      case '2m':
        stdt = new Date(moment().subtract(2, 'month'))
        eddt = new Date()
        break
      case '3m':
        stdt = new Date(moment().subtract(3, 'month'))
        eddt = new Date()
        break
    }

    setSearchDate({
      startDate: stdt,
      endDate: eddt
    })
    setDateItem({
      active: true,
      default: def
    })
  }

  const handleSearch = () => {
    if (typeof onSearch === 'function') {
      // check1, check2 dateItem inputData
      let params = {}

      if (check1) {
        if (checkItem1.items?.length > 0) {
          for (let item of checkItem1.items) {
            if (item.id.toLowerCase().indexOf('all') < 0) {
              if (item.checked) {
                params[item.id] = 'Y'
              } else {
                params[item.id] = ''
              }
            }
          }
        }
      }

      if (check2) {
        if (checkItem2.items?.length > 0) {
          for (let item of checkItem2.items) {
            if (item.id.toLowerCase().indexOf('all') < 0) {
              if (item.checked) {
                params[item.id] = 'Y'
              } else {
                params[item.id] = ''
              }
            }
          }
        }
      }

      if (StringUtils.hasLength(input.active)) {
        params[inputData.id] = inputData.value
      }

      if (searchDate.startDate) {
        params.startDate = moment(searchDate.startDate).format('yyyy-MM-DD').toString()
      }

      if (searchDate.endDate) {
        params.endDate = moment(searchDate.endDate).format('yyyy-MM-DD').toString()
      }

      onSearch(params)
    }
  }

  const onChangeDate = (currentDate, type) => {
    if (type === 'st') {
      setSearchDate({
        ...searchDate,
        startDate: currentDate
      })
    } else if (type === 'ed') {
      setSearchDate({
        ...searchDate,
        endDate: currentDate
      })
    }
    setDateItem({
      ...dateItem,
      default: ''
    })
  }

  return (
    <Fragment>
      <div className={'search_table_wrap'}>
        <table className="table_search">
          <caption>상태, 제목 날짜별 조회 테이블</caption>
          <colgroup>
            <col width={'15%'} />
            <col width={'*'} />
          </colgroup>
          <tbody>
            {checkItem1 && (
              <tr>
                <th>{checkItem1.label}</th>
                <td>
                  {checkItem1.items.map((check) => (
                    <Checkbox
                      key={check.id}
                      checkbox={{ id: check.id, value: check.label }}
                      checked={check.checked || false}
                      onChange={(e) => {
                        handleCheckChange(e, 1)
                      }}
                      id={check.id}
                      name="check1"
                    />
                  ))}
                </td>
              </tr>
            )}
            {checkItem2 && (
              <tr>
                <th>{checkItem2.label}</th>
                <td>
                  {checkItem2.items.map((check) => (
                    <Checkbox
                      key={check.id}
                      checkbox={{ id: check.id, value: check.label }}
                      checked={check.checked || false}
                      onChange={(e) => {
                        handleCheckChange(e, 2)
                      }}
                      id={check.id}
                      name="check2"
                    />
                  ))}
                </td>
              </tr>
            )}
            {inputs?.list?.length > 0 && (
              <tr>
                <th>
                  {inputs.list.length > 1 ? (
                    <Select
                      optionList={inputs}
                      ref={searchSelect}
                      handleSelectActive={(selected, label) => {
                        setInputData({
                          ...inputData,
                          label: label,
                          id: selected
                        })
                      }}
                    />
                  ) : (
                    inputs.list[0].label
                  )}
                </th>
                <td>
                  <input
                    type="text"
                    className="input"
                    placeholder={`${inputData.label}을 입력해주세요`}
                    value={inputData.value}
                    maxLength={30}
                    onChange={(e) => {
                      setInputData({
                        ...inputData,
                        value: e.target.value
                      })
                    }}
                  />
                </td>
              </tr>
            )}
            {dateItem?.active && (
              <tr>
                <th>날짜 선택</th>
                <td>
                  <div className="tab_wrap">
                    {/* 선택된 날짜버튼 date 에 active 클래스 추가  */}
                    <button
                      className={`btn_tab ${dateItem.default === '15d' && 'active'}`}
                      onClick={() => {
                        handleDate('15d')
                      }}
                    >
                      15일
                    </button>
                    <button
                      className={`btn_tab ${dateItem.default === '1m' && 'active'}`}
                      onClick={() => {
                        handleDate('1m')
                      }}
                    >
                      1개월
                    </button>
                    <button
                      className={`btn_tab ${dateItem.default === '2m' && 'active'}`}
                      onClick={() => {
                        handleDate('2m')
                      }}
                    >
                      2개월
                    </button>
                    <button
                      className={`btn_tab ${dateItem.default === '3m' && 'active'}`}
                      onClick={() => {
                        handleDate('3m')
                      }}
                    >
                      3개월
                    </button>
                  </div>
                  <div className="period_calendar">
                    <DatePicker
                      selected={searchDate.startDate ? searchDate.startDate : null}
                      onChange={(currentDate) => onChangeDate(currentDate, 'st')}
                      locale={ko}
                      dateFormat={'yyyy-MM-dd'}
                      maxDate={searchDate.endDate ? searchDate.endDate : null}
                      title={'기간조회'}
                    />
                    <span className="datepicker_dash">~</span>
                    <DatePicker
                      selected={searchDate.endDate ? searchDate.endDate : null}
                      onChange={(currentDate) => onChangeDate(currentDate, 'ed')}
                      locale={ko}
                      dateFormat={'yyyy-MM-dd'}
                      minDate={searchDate.startDate ? searchDate.startDate : null}
                      title={'기간조회'}
                    />
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="button_bottom_group">
        <Button
          className={'basic'}
          onClick={() => {
            initData()
          }}
        >
          초기화
        </Button>
        <Button
          className={'full_blue_deep'}
          onClick={() => {
            handleSearch()
          }}
        >
          검색
        </Button>
      </div>
    </Fragment>
  )
}

export default Search
