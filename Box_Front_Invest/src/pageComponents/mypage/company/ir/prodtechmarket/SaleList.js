import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import Button from 'components/atomic/Button'
import Select from 'components/atomic/Select'
import { MinusBtn } from 'components/atomic/IconButton'

import NumberInput from 'pageComponents/common/number/NumberInput'
import ValidateUtils from 'modules/utils/ValidateUtils'
import {createKey} from "modules/utils/CommonUtils";

const SaleList = forwardRef((props, ref) => {
  const { domestic } = props
  const [list, setList] = useState([])
  const [domesticSelect, setDomesticSelect] = useState({
    selList: [],
    selected: ''
  })
  const handleDomesticSelect = (e, item) => {
    setAreaNmCode(item, e.target.value)
    setDomesticSelect({
      selList: [...domestic],
      selected: e.target.value
    })
  }
  useEffect(() => {
    setDomesticSelect({
      selList: [...domestic],
      selected: ''
    })
  }, [domestic])
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
  const setAreaNmCode = (compareItem, compareValue) => {
    for (let i = 0; i < domestic.length; i++) {
      const item = domestic[i]
      if (item['id'] === compareValue) {
        compareItem['areaDsncCd'] = item['id']
        compareItem['areaDsncNm'] = item['value']
        break
      }
    }
  }
  const onClickAdd = () => {
    let seq = 0
    if (list.length > 0) {
      seq = list[list.length - 1].amplSqn + 1
    }
    const createItem = {
      amplSqn: seq,
      amslAmt: 0,
      amslCon: '',
      amslRlim: 0,
      areaCd: '',
      areaDsncNm: '',
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
      if (listItem['amplSqn'] !== item['amplSqn']) {
        temp.push(listItem)
      }
    }
    setList(temp)
  }
  const onChangeInput = (event, item) => {
    item[event.target.id] = event.target.value
  }
  const onChangeNumberInput = (event, item) => {
    item[event.target.id] = event.target.value
  }

  const validateIsEmpty = () => {
    let r = false
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      const isEmpty = ValidateUtils.isListItemEmpty(
        item,
        ['amslCon', 'areaDsncCd', 'areaDsncNm'],
        ['amslAmt', 'amslRlim']
      )
      if (isEmpty) {
        r = true
        break
      }
    }
    return r
  }

  const SaleItem = ({item, idx}) => {
    return (
        <tr>
          <td>
            <Select
                optList={domesticSelect.selList}
                title='주요매출처지역'
                value={item.areaDsncCd}
                onChange={(event) => handleDomesticSelect(event, item)}
            />
          </td>
          <td>
            <input
                type="text"
                title='주요매출처내용'
                id={'amslCon'}
                className="input"
                placeholder={''}
                defaultValue={item['amslCon']}
                onChange={(event) => onChangeInput(event, item)}
            />
          </td>
          <td className="text_right">
            <NumberInput item={item} title='매출금액' numberProperty={'amslAmt'} displayValue={item['amslAmt']} />
          </td>
          <td className={'text_right'}>
            <div className="input_wrap">
              <div className="input_rate unit_input_wrap">
                <input
                    type="number"
                    title='비중'
                    id={'amslRlim'}
                    defaultValue={item['amslRlim']}
                    onChange={(event) => onChangeNumberInput(event, item)}
                />
                <span className="unit">%</span>
              </div>
              <MinusBtn onClick={() => onClickRemove(item)}>
                <span className="hide">삭제</span>
              </MinusBtn>
            </div>
          </td>
        </tr>
    )
  }

  return (
    <div className="table_section">
      <div className="section_header">
        <p className="section_title"><span className="essen_ico2">*</span>주요 매출처</p>
        <div className="btn_wrap">
          <Button className={'btn_add dashed linear light_grey'} onClick={onClickAdd}>
            <span className="ico_plus">입력내용추가</span>
          </Button>
        </div>
      </div>
      <table className="table type03">
        <caption>주요 매출처 테이블</caption>
        <colgroup>
          <col width={'10%'} />
          <col width={'30%'} />
          <col width={'15%'} />
          <col width={'10%'} />
        </colgroup>
        <thead>
          <tr>
            <th>지역</th>
            <th>내용</th>
            <th>금액</th>
            <th>비중</th>
          </tr>
        </thead>
        <tbody>{list?.map((item, i) => <SaleItem item={item} idx={i} key={createKey()} />)}</tbody>
      </table>
    </div>
  )
});
export default SaleList;
