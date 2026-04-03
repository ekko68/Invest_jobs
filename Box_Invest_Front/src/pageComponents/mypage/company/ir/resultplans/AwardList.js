import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import Button from 'components/atomic/Button'
import Calendar from 'components/atomic/Calendar'
import { MinusBtn } from 'components/atomic/IconButton'

import DateUtils from 'modules/utils/DateUtils'
import ValidateUtils from 'modules/utils/ValidateUtils'
import {createKey} from "modules/utils/CommonUtils";
const AwardList = forwardRef((props, ref) => {
  const [list, setList] = useState([])
  useEffect(() => {}, [])
  useImperativeHandle(ref, () => ({
    setData,
    getData,
    validateIsEmpty
  }))
  const setData = (data) => {
    setList(data)
  }
  const getData = () => {
    return list
  }
  const onClickAdd = () => {
    let seq = 0
    if (list.length > 0) {
      seq = list[list.length - 1].beawAcrsSqn + 1
    }
    const createItem = {
      beawAcrsSqn: seq,
      beawDt: '',
      beawHst: '',
      hldPlac: '',
      utlinsttId: ''
    }
    const temp = [...list]
    temp.push(createItem)
    setList(temp)
  }
  const onClickRemove = (item) => {
    const temp = []
    for (let i = 0; i < list.length; i++) {
      const listItem = list[i]
      if (listItem['beawAcrsSqn'] !== item['beawAcrsSqn']) {
        temp.push(listItem)
      }
    }
    setList(temp)
  }
  const onChangeInput = (event, item) => {
    item[event.target.id] = event.target.value
  }
  const onChangeDate = (selectedDate, item) => {
    const d = DateUtils.customDateFormat(selectedDate, 'yyyyMMdd');
    item['beawDt'] = d
  }

  const AwardItem = ({item, idx}) => {
    return (
        <tr>
          <td>
            <input
                type="text"
                title='주최지역'
                id={'hldPlac'}
                className="input"
                placeholder={''}
                defaultValue={item['hldPlac']}
                onChange={(event) => onChangeInput(event, item)}
            />
          </td>
          <td>
            <input
                type="text"
                title='수상내역'
                id={'beawHst'}
                className="input"
                placeholder={'수상내역 (50자 이내)'}
                defaultValue={item['beawHst']}
                maxLength={50}
                onChange={(event) => onChangeInput(event, item)}
            />
          </td>
          <td>
            <div className="input_wrap">
              <Calendar
                  valueType={'dash'}
                  title='수상날짜'
                  date={DateUtils.insertYyyyMmDdDash(item['beawDt'])}
                  onChangeDate={onChangeDate}
                  item={item}
                  notFast={true}
              />
              <MinusBtn onClick={() => onClickRemove(item)}>
                <span className="hide">삭제</span>
              </MinusBtn>
            </div>
          </td>
        </tr>
    )
  }

  const validateIsEmpty = () => {
    let r = false
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      const isEmpty = ValidateUtils.isListItemEmpty(item, ['beawHst', 'hldPlac', 'beawDt'])
      if (isEmpty) {
        r = true
        break
      }
    }
    return r
  }
  return (
    <div className="table_section">
      <div className="section_header">
        <p className="section_title">수상실적</p>
        <Button className={'btn_add dashed linear  light_grey'} onClick={onClickAdd}>
          <span className="ico_plus">입력내용추가</span>
        </Button>
      </div>
      <table className="table type03">
        <caption>수상실적 테이블</caption>
        <colgroup>
          <col width={'33%'} />
          <col width={'30%'} />
          <col width={'37%'} />
        </colgroup>
        <thead>
          <tr>
            <th>주최</th>
            <th>수상내역</th>
            <th>날짜</th>
          </tr>
        </thead>
        <tbody>{list?.map((item, i) => <AwardItem item={item} idx={i} key={createKey()}/> )}</tbody>
      </table>
    </div>
  )
});
export default AwardList;
