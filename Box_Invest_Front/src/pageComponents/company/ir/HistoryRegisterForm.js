import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import Button from 'components/atomic/Button'
import Calendar from 'components/atomic/Calendar'
import { MinusBtn } from 'components/atomic/IconButton'
import DateUtils from 'modules/utils/DateUtils'
import {createKey} from "modules/utils/CommonUtils";

const HistoryRegisterForm = forwardRef((props, ref) => {
  const [list, setList] = useState([])
  useImperativeHandle(ref, () => ({
    setData,
    getData
  }))

  useEffect(() => {
    setList(props['list'] || [])
  }, [])

  const setData = (items) => {
    setList(items)
  }

  const getData = () => {
    return list
  }

  const onChangeDate = (selectedDate, item) => {
    const yyyymmdd = DateUtils.customDateFormat(selectedDate, 'yyyy-MM-dd');
    item.ordvYm = yyyymmdd
  }

  const onChangeHistory = (e, item) => {
    item.ordvCon = e.target.value
  }

  const onClickDelete = (item) => {
    if (list.length > 0) {
      const temp = []
      for (let i = 0; i < list.length; i++) {
        const listItem = list[i]
        if (item.rowNumber !== listItem.rowNumber) {
          temp.push(listItem)
        }
      }
      setList(temp)
    }
  }

  const onClickAdd = () => {
    const item = createEmptyItem()
    const temp = list.concat(item)
    setList(temp)
    moveToBottom()
  }

  const createEmptyItem = () => {
    let rowNumber = 0
    if (list.length > 0) {
      const lastItem = list[list.length - 1]
      rowNumber = lastItem.rowNumber + 1
    }
    const item = {
      rowNumber: rowNumber,
      utlinsttId: '',
      enprIrrsInfoId: '',
      ordvSqn: 0,
      ordvYm: '',
      v: ''
    }
    return item
  }

  const moveToBottom = () => {
    setTimeout(() => {
      // scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }, 1)
  }

  const render = () => {
    if (list.length === 0) {
      return <></>
    } else if (list.length > 0) {
      const rows = []
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        const row = (
          <ul className="history_form_list" key={createKey()}>
            <li className="history_form_item">
              <div className="date">
                <div className="input_wrap">
                  <Calendar valueType={'dash'} date={item.ordvYm} onChangeDate={onChangeDate} item={item} />
                </div>
              </div>
              <div className="content">
                <div className="input_wrap">
                  <input
                    type="text"
                    placeholder="내용  (50자 이내)"
                    defaultValue={item.ordvCon}
                    onChange={(e) => onChangeHistory(e, item)}
                    maxLength={50}
                  />
                </div>
              </div>
              <div className="btn_wrap">
                <MinusBtn onClick={(e) => onClickDelete(item)}>
                  <span className="hide">삭제</span>
                </MinusBtn>
              </div>
            </li>
          </ul>
        )
        rows.push(row)
      }
      return rows
    }
  }

  return (
    <div className="section section01">
      <div className="info_header">
        <h3 className="ico_title">연혁</h3>
        <div className="btn_wrap">
          <Button className={'btn_add dashed linear  light_grey'}>
            <span className="ico_plus" onClick={onClickAdd}>
              입력내용추가
            </span>
          </Button>
        </div>
      </div>
      <div className="history_wrap">
        <div className="history_section">
          {/*<ul className="history_form_list">*/}
          {/*  <li className="history_form_item">*/}
          {/*    <div className="date">*/}
          {/*      <div className="input_wrap">*/}
          {/*        <Calendar valueType={'dash'} date={item.date} onChangeDate={onChangeDate} item={item}/>*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*    <div className="content">*/}
          {/*      <div className="input_wrap">*/}
          {/*        <input type="text" placeholder="붐코 튜토링 서비스 런칭" />*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*    <div className="btn_wrap">*/}
          {/*      <MinusBtn>*/}
          {/*        <span className="hide">삭제</span>*/}
          {/*      </MinusBtn>*/}
          {/*    </div>*/}
          {/*  </li>*/}
          {/*</ul>*/}
          {render()}
        </div>
      </div>
    </div>
  )
})

export default HistoryRegisterForm
