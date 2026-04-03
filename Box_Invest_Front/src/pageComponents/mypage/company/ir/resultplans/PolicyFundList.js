import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import Button from 'components/atomic/Button'
import Calendar from 'components/atomic/Calendar'
import { MinusBtn } from 'components/atomic/IconButton'

import ValidateUtils from 'modules/utils/ValidateUtils'
import DateUtils from 'modules/utils/DateUtils'
import NumberInput from 'pageComponents/common/number/NumberInput'
import {createKey} from "modules/utils/CommonUtils";

const PolicyFundList = forwardRef((props, ref) => {
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
      seq = list[list.length - 1].plfnSqn + 1
    }
    const createItem = {
      plfnAmt: 0,
      plfnCon: '',
      plfnPrfrDd: '',
      plfnSqn: seq,
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
      if (listItem['plfnSqn'] !== item['plfnSqn']) {
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
    item['plfnPrfrDd'] = d
  }
  const validateIsEmpty = () => {
    let r = false
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      const isEmpty = ValidateUtils.isListItemEmpty(item, ['plfnCon', 'plfnPrfrDd'], ['plfnAmt'])
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
        <p className="section_title">정책자금</p>
        <Button className={'btn_add dashed linear  light_grey'} onClick={onClickAdd}>
          <span className="ico_plus">입력내용추가</span>
        </Button>
      </div>
      <table className="table type03">
        <caption>정책자금 테이블</caption>
        <colgroup>
          <col width={'33%'} />
          <col width={'30%'} />
          <col width={'37%'} />
        </colgroup>
        <thead>
          <tr>
            <th>내용</th>
            <th>금액</th>
            <th>날짜</th>
          </tr>
        </thead>
        <tbody>{list?.map((item, i) => (
            <tr key={createKey()}>
              <td>
                <input
                    type="text"
                    title='정책자금내용'
                    id={'plfnCon'}
                    className="input"
                    placeholder={''}
                    defaultValue={item['plfnCon']}
                    onChange={(event) => onChangeInput(event, item)}
                />
              </td>
              <td>
                <NumberInput item={item} title='정책자금금액' numberProperty={'plfnAmt'} displayValue={item['plfnAmt']} />
              </td>
              <td>
                <div className="input_wrap">
                  <Calendar
                      valueType={'dash'}
                      title='날짜'
                      date={DateUtils.insertYyyyMmDdDash(item['plfnPrfrDd'])}
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
        ))}</tbody>
      </table>
    </div>
  )
});
export default PolicyFundList;
