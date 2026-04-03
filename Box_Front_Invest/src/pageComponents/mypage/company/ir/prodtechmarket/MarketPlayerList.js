import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import Button from 'components/atomic/Button'
import Select from 'components/atomic/Select'
import { MinusBtn } from 'components/atomic/IconButton'

import ValidateUtils from 'modules/utils/ValidateUtils'
import NumberInput from 'pageComponents/common/number/NumberInput'
import {createKey} from "modules/utils/CommonUtils";

const MarketPlayerList = forwardRef((props, ref) => {
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
      seq = list[list.length - 1].mrktPtcnSqn + 1
    }
    const createItem = {
      amslAmt: 0,
      areaDsncCd: '',
      areaDsncNm: '',
      mrktPtcnCon: '',
      mrktPtcnNm: '',
      mrktPtcnSqn: seq,
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
      if (listItem['mrktPtcnSqn'] !== item['mrktPtcnSqn']) {
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
      const isEmpty = ValidateUtils.isListItemEmpty(item, ['areaDsncNm', 'mrktPtcnNm', 'mrktPtcnCon'], ['amslAmt'])
      if (isEmpty) {
        r = true
        break
      }
    }
    return r
  }

  const MarketPlayerItem = ({item, idx}) => {
    return (
        <tr>
          <td>
            <Select
                optList={domesticSelect.selList}
                title='시장플레이어지역'
                selected={item.areaDsncCd}
                onChange={(event) => handleDomesticSelect(event, item)}
            />
          </td>
          <td className={'text_left'}>
            <input
                type="text"
                id={'mrktPtcnNm'}
                title='시장플레이어'
                className="input"
                placeholder={''}
                defaultValue={item['mrktPtcnNm']}
                onChange={(event) => onChangeInput(event, item)}
            />
          </td>
          <td className={'text_left'}>
            <input
                type="text"
                title='시장플레이어내용'
                id={'mrktPtcnCon'}
                className="input"
                placeholder={''}
                defaultValue={item['mrktPtcnCon']}
                onChange={(event) => onChangeInput(event, item)}
            />
          </td>
          <td>
            <div className="input_wrap">
              <NumberInput item={item} title='시장플레이어매출' numberProperty={'amslAmt'} displayValue={item['amslAmt']} />
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
        <p className="section_title">시장 플레이어</p>
        <div className="btn_wrap">
          <Button className={'btn_add dashed linear light_grey'} onClick={onClickAdd}>
            <span className="ico_plus">입력내용추가</span>
          </Button>
        </div>
      </div>
      <table className="table type03">
        <caption>시장 플레이어 테이블</caption>
        <colgroup>
          <col width={'15%'} />
          <col width={'20%'} />
          <col width={'45%'} />
          <col width={'20%'} />
        </colgroup>
        <thead>
          <tr>
            <th>지역</th>
            <th>플레이어</th>
            <th>내용</th>
            <th>매출</th>
          </tr>
        </thead>
        <tbody>{list?.map((item, i) => <MarketPlayerItem item={item} idx={i} key={createKey()} />)}</tbody>
      </table>
    </div>
  )
});
export default MarketPlayerList;
