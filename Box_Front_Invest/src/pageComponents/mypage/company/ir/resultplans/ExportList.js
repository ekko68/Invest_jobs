import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import Button from 'components/atomic/Button'
import Calendar from 'components/atomic/Calendar'
import { MinusBtn } from 'components/atomic/IconButton'

import ValidateUtils from 'modules/utils/ValidateUtils'
import DateUtils from 'modules/utils/DateUtils'
import NumberInput from 'pageComponents/common/number/NumberInput'
import {createKey} from "modules/utils/CommonUtils";


const ExportList = forwardRef((props, ref) => {
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
      seq = list[list.length - 1].eprtHstSqn + 1
    }
    const createItem = {
      eprtAmt: 0,
      eprtDt: '',
      eprtHstSqn: seq,
      eprtTgt: '',
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
      if (listItem['eprtHstSqn'] !== item['eprtHstSqn']) {
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
    item['eprtDt'] = d
  }
  const validateIsEmpty = () => {
    let r = false
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      const isEmpty = ValidateUtils.isListItemEmpty(item, ['eprtTgt', 'eprtDt'], ['eprtAmt'])
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
        <p className="section_title">수출</p>
        <Button className={'btn_add dashed linear  light_grey'} onClick={onClickAdd}>
          <span className="ico_plus">입력내용추가</span>
        </Button>
      </div>
      <table className="table type03">
        <caption>수출 테이블</caption>
        <colgroup>
          <col width={'33%'} />
          <col width={'30%'} />
          <col width={'37%'} />
        </colgroup>
        <thead>
          <tr>
            <th>장소</th>
            <th>금액</th>
            <th>날짜</th>
          </tr>
        </thead>
        <tbody>{
          list?.map((item, i) => (
              <tr key={createKey()}>
                <td>
                  <input
                      type="text"
                      title='수출장소'
                      id={'eprtTgt'}
                      className="input"
                      placeholder={''}
                      defaultValue={item['eprtTgt']}
                      onChange={(event) => onChangeInput(event, item)}
                  />
                </td>
                <td className={'text_right'}>
                  <NumberInput item={item} title='수출금액' numberProperty={'eprtAmt'} displayValue={item['eprtAmt']} />
                </td>
                <td>
                  <div className="input_wrap">
                    <Calendar
                        valueType={'dash'}
                        title='수출날짜'
                        date={DateUtils.insertYyyyMmDdDash(item['eprtDt'])}
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
          ))
        }</tbody>
      </table>
    </div>
  )
});
export default ExportList;
