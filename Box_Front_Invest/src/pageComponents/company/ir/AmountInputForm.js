import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'
import Button from 'components/atomic/Button'
import Calendar from 'components/atomic/Calendar'
import { MinusBtn } from 'components/atomic/IconButton'
import DateUtils from 'modules/utils/DateUtils'
import NumberInput from 'pageComponents/common/number/NumberInput'
import {createKey} from "modules/utils/CommonUtils";

const AmountInputForm = forwardRef((props, ref) => {
  const { keyProp, idProp, pkIdProp, seqProp, dateProp, nameProp, amountProp, list, showMonthYearPicker, enprTtl, title } = props
  const scrollRef = useRef()
  const [isUpdate, setIsUpdate] = useState(true)
  useImperativeHandle(ref, () => ({}))
  useEffect(() => {}, [])
  useEffect(() => {}, [list])

  const onChangeCompanyName = (e, item) => {
    item[nameProp] = e.target.value
  }

  const onClickAdd = () => {
    const item = createEmptyItem()
    list.push(item)
    setIsUpdate(!isUpdate)
    moveToBottom()
  }
  const createEmptyItem = () => {
    const item = {}
    if (list.length > 0) {
      const lastItem = list[list.length - 1]
      item[seqProp] = lastItem[seqProp] + 1
    } else {
      item[seqProp] = 1;
    }
    item[idProp] = ''
    item[pkIdProp] = ''
    item[dateProp] = ''
    item[nameProp] = ''
    item[amountProp] = 0
    return item
  }

  const onClickDelete = (item) => {
    if (list.length > 0) {
      let index = -1
      const seq = item[seqProp]
      for (let i = 0; i < list.length; i++) {
        const listItem = list[i]
        if (listItem[seqProp] === seq) {
          index = i
          break
        }
      }
      if (index > -1) {
        list.splice(index, 1)
      }
      setIsUpdate(!isUpdate)
    }
  }

  const onChangeDate = (selectedDate, item) => {
    const d = DateUtils.customDateFormat(selectedDate, 'yyyyMMdd');
    item[dateProp] = d
  }

  const moveToBottom = () => {
    setTimeout(() => {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }, 1)
  }

  const render = () => {
    if (list.length === 0) {
      return <></>
    } else if (list.length > 0) {
      const rowList = []
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        const row = (
          <li className="info_row" key={createKey()}>
            <div className="info_cell date">
              <div className="input_wrap">
                <Calendar
                  valueType={'dash'}
                  title={title + ' 날짜'}
                  showMonthYearPicker={showMonthYearPicker}
                  date={DateUtils.insertYyyyMmDdDash(item[dateProp])}
                  onChangeDate={onChangeDate}
                  item={item}
                />
              </div>
            </div>
            <div className="info_cell name">
              <div className="input_wrap">
                <input
                  type="text"
                  title={enprTtl}
                  placeholder={''}
                  defaultValue={item[nameProp]}
                  onChange={(e) => onChangeCompanyName(e, item)}
                />
              </div>
            </div>
            <div className="info_cell price">
              <div className="input_wrap">
                <NumberInput item={item} title={title + ' 금액'} numberProperty={amountProp} displayValue={item[amountProp]} />
                <MinusBtn onClick={(e) => onClickDelete(item)}>
                  <span className="hide">삭제</span>
                </MinusBtn>
              </div>
            </div>
          </li>
        )
        rowList.push(row)
      }
      return rowList
    }
  }

  return (
    <div className="info_area">
      <div className="info_header">
        <h4 className="info_title">{props.title}</h4>
        <div className="btn_wrap">
          <Button type={'dashed'} className={'btn_add'}>
            <span className="ico_plus" onClick={onClickAdd}>
              입력내용추가
            </span>
          </Button>
        </div>
      </div>
      <div className="info_content h275">
        <div className="list_box">
          <ul className="info_list_header">
            <div className="info_cell date">년월</div>
            <div className="info_cell name">{enprTtl}</div>
            <div className="info_cell price">금액</div>
          </ul>
          <ul className="info_list scroll" ref={scrollRef}>
            {/*<li className="info_row">*/}
            {/*  <div className="info_cell date">*/}
            {/*    <div className="input_wrap">*/}
            {/*      <Calendar valueType={'dash'} />*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*  <div className="info_cell name">*/}
            {/*    <div className="input_wrap">*/}
            {/*      <input type="text" placeholder={'기업명'} />*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*  <div className="info_cell price">*/}
            {/*    <div className="input_wrap">*/}
            {/*      <input type="text" placeholder={'금액'} />*/}
            {/*      <MinusBtn>*/}
            {/*        <span className="hide">삭제</span>*/}
            {/*      </MinusBtn>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</li>*/}
            {render()}
          </ul>
        </div>
      </div>
    </div>
  )
})

export default AmountInputForm
