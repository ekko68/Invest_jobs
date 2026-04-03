import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import Button from 'components/atomic/Button'
import { MinusBtn } from 'components/atomic/IconButton'

import Select from 'components/atomic/Select'
import NumberInput from 'pageComponents/common/number/NumberInput'
import ValidateUtils from 'modules/utils/ValidateUtils'
import FormUtils from 'modules/utils/FormUtils'
import {createKey} from "modules/utils/CommonUtils";

const PlanList = forwardRef((props, ref) => {
  const { plan } = props
  const [reload, setReload] = useState(false)
  const [list, setList] = useState([])
  const [planSelect, setPlanSelect] = useState({
    selected: ' ',
    selList: []
  })
  const handlePlanSelect = (e, item) => {
    changeEmptyItem(item)
    setPlanNmCode(item, e.target.value)
    setPlanSelect({
      selList: [...plan],
      selected: e.target.value
    })
    setReload(!reload)
  }
  const setPlanNmCode = (compareItem, compareValue) => {
    for (let i = 0; i < plan.length; i++) {
      const item = plan[i]
      if (item['id'] === compareValue) {
        compareItem['prmrIndeDsnc'] = item['id']
        compareItem['prmrIndeNm'] = item['value']
        break
      }
    }
  }
  const changeEmptyItem = (item) => {
    item['mn3IndeCon'] = ''
    item['mn6IndeCon'] = ''
    item['mn9IndeCon'] = ''
    item['psntIndeCon'] = ''
  }
  useEffect(() => {
    setPlanSelect({
      selList: [...plan],
      selected: ''
    })
  }, [plan])
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
      seq = list[list.length - 1].prmrPlanSqn + 1
    }
    const createItem = {
      mn3IndeCon: '',
      mn6IndeCon: '',
      mn9IndeCon: '',
      prmrIndeDsnc: '',
      prmrIndeNm: '',
      prmrPlanSqn: seq,
      psntIndeCon: '',
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
      if (listItem['prmrPlanSqn'] !== item['prmrPlanSqn']) {
        temp.push(listItem)
      }
    }
    setList(temp)
  }
  const getUnit = (item) => {
    let r = ''
    if (item['prmrIndeNm'] === '매출') {
      r = '원'
    } else if (item['prmrIndeNm'] === '채용') {
      r = '명'
    }
    return r
  }
  const getInputTypeRender = (item, property, title) => {
    if (item['prmrIndeNm'] === '매출' || item['prmrIndeNm'] == '채용') {
      return <NumberInput item={item} title={title} numberProperty={property} displayValue={item[property]} />
    } else {
      return (
        <input
          type="text"
          title={title}
          id={property}
          defaultValue={item[property]}
          className={'input'}
          placeholder={''}
          onChange={(event) => onChangeInput(event, item)}
        />
      )
    }
  }
  const onChangeInput = (event, item) => {
    FormUtils.setVoInput(item, event.target.id, event.target.value)
  }
  const validateIsEmpty = () => {
    let r = false
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      const isEmpty = ValidateUtils.isListItemEmpty(item, [
        'prmrIndeNm',
        'psntIndeCon',
        'mn3IndeCon',
        'mn6IndeCon',
        'mn9IndeCon'
      ])
      if (isEmpty) {
        r = true
        break
      }
    }
    return r
  }
  return (
    <div className="table_box">
      <div className="table_section">
        <div className="section_header">
          <p className="section_title">계획리스트</p>
          <Button className={'btn_add dashed linear  light_grey'} onClick={onClickAdd}>
            <span className="ico_plus">입력내용추가</span>
          </Button>
        </div>
        <table className="table type03">
          <caption>정책자금 테이블</caption>
          <colgroup>
            <col width={'20%'} />
            <col width={'20%'} />
            <col width={'20%'} />
            <col width={'20%'} />
            <col width={'20%'} />
          </colgroup>
          <thead>
            <tr>
              <th>주요지표</th>
              <th>현재</th>
              <th>&#43;3M</th>
              <th>&#43;6M</th>
              <th>&#43;9M</th>
            </tr>
          </thead>
          <tbody>{list?.map((item, index) => (
              <tr key={createKey()}>
                <td>
                  {/*<input type="text" className={'input text_left'} placeholder={'매출'} />*/}
                  <Select
                      optList={planSelect.selList}
                      title='주요지표'
                      value={item.prmrIndeDsnc}
                      onChange={(event) => handlePlanSelect(event, item)}
                  />
                </td>
                <td>
                  <div className="input_rate unit_input_wrap">
                    {getInputTypeRender(item, 'psntIndeCon', '현재')}
                    <span className="unit">{getUnit(item)}</span>
                  </div>
                </td>
                <td>
                  <div className="input_rate unit_input_wrap">
                    {getInputTypeRender(item, 'mn3IndeCon', '3개월후')}
                    <span className="unit">{getUnit(item)}</span>
                  </div>
                </td>
                <td>
                  <div className="input_rate unit_input_wrap">
                    {getInputTypeRender(item, 'mn6IndeCon', '6개월후')}
                    <span className="unit">{getUnit(item)}</span>
                  </div>
                </td>
                <td>
                  <div className="input_wrap">
                    <div className="input_rate unit_input_wrap">
                      {getInputTypeRender(item, 'mn9IndeCon', '1년후')}
                      <span className="unit">{getUnit(item)}</span>
                    </div>
                    <MinusBtn onClick={() => onClickRemove(item)}>
                      <span className="hide">삭제</span>
                    </MinusBtn>
                  </div>
                </td>
              </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  )
});

export default PlanList;
