import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import Button from 'components/atomic/Button'
import Select from 'components/atomic/Select'
import Calendar from 'components/atomic/Calendar'
import { MinusBtn } from 'components/atomic/IconButton'

import DateUtils from 'modules/utils/DateUtils'
import ValidateUtils from 'modules/utils/ValidateUtils'
import {createKey} from "modules/utils/CommonUtils";
import {RegexConst, ReplaceRegex} from "modules/consts/Regex";

const IpList = forwardRef((props, ref) => {
  const { ip } = props
  const [list, setList] = useState([])
  const [ipSelect, setIpSelect] = useState({
    selected: ' ',
    selList: []
  })
  const handleIpSelect = (e, item) => {
    setIpNmCode(item, e.target.value)
    setIpSelect({
      selList: [...ip],
      selected: e.target.value
    })
  }
  useEffect(() => {
    setIpSelect({
      selList: [...ip],
      selected: ''
    })
  }, [ip])
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
  const setIpNmCode = (compareItem, compareValue) => {
    for (let i = 0; i < ip.length; i++) {
      const item = ip[i]
      if (item['id'] === compareValue) {
        compareItem['sttsCd'] = item['id']
        compareItem['sttsNm'] = item['value']
        break
      }
    }
  }
  const onClickAdd = () => {
    let holdTchnSqn = 0
    if (list.length > 0) {
      holdTchnSqn = list[list.length - 1].holdTchnSqn + 1
    }
    const createItem = {
      alfrNo: '',
      holdTchnSqn: holdTchnSqn,
      pnotPrrgCon: '',
      pnotPrrgRgda: '',
      sttsCd: '',
      sttsNm: '',
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
      if (listItem['holdTchnSqn'] !== item['holdTchnSqn']) {
        temp.push(listItem)
      }
    }
    setList(temp)
  }
  const onChangeInput = (event, item) => {
    item[event.target.id] = event.target.value
  }
  const onChangeReplaceInput = (event, item, regex = null) => {
    if(regex !== null) event.target.value = String(event.target.value).replace(regex, '');
    item[event.target.id] = event.target.value
  }
  const onChangeDate = (selectedDate, item) => {
    const d = DateUtils.customDateFormat(selectedDate, 'yyyyMMdd');
    item['pnotPrrgRgda'] = d
  }
  const validateIsEmpty = () => {
    let r = false
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      const isEmpty = ValidateUtils.isListItemEmpty(item, ['sttsNm', 'pnotPrrgCon', 'alfrNo', 'pnotPrrgRgda'])
      if (isEmpty) {
        r = true
        break
      }
    }
    return r
  }

  const IpItem = ({item, idx}) => {
    return (
        <tr>
          <td>
            <Select optList={ipSelect.selList} title='지적재산권상태' value={item.sttsCd} onChange={(event) => handleIpSelect(event, item)} />
          </td>
          <td>
            {/*<input type="text" placeholder="내용" className="input" />*/}
            <input
                type="text"
                title='지적재산권내용'
                id={'pnotPrrgCon'}
                className="input"
                placeholder={''}
                defaultValue={item['pnotPrrgCon']}
                onChange={(event) => onChangeInput(event, item)}
            />
          </td>
          <td>
            {/*<input type="text" placeholder="출원번호" className="input" />*/}
            <input
                type="text"
                title='출원번호'
                id={'alfrNo'}
                className="input"
                placeholder={''}
                defaultValue={item['alfrNo']}
                onChange={(event) => onChangeReplaceInput(event, item, ReplaceRegex.ENG_NUM_REGEX)}
            />
          </td>
          <td>
            <div className="input_wrap">
              <Calendar
                  valueType={'dash'}
                  title='날짜'
                  date={DateUtils.insertYyyyMmDdDash(item['pnotPrrgRgda'])}
                  onChangeDate={onChangeDate}
                  item={item}
              />
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
        <p className="section_title"><span className="essen_ico2">*</span>지적재산권 현황</p>
        <div className="btn_wrap">
          <Button className={'btn_add dashed linear light_grey'} onClick={onClickAdd}>
            <span className="ico_plus">입력내용추가</span>
          </Button>
        </div>
      </div>
      <table className="table type03">
        <caption>지적재산권 현황 테이블</caption>
        <colgroup>
          <col width={'15%'} />
          <col width={'45%'} />
          <col width={'20%'} />
          <col width={'20%'} />
        </colgroup>
        <thead>
          <tr>
            <th>상태</th>
            <th>내용</th>
            <th>출원번호</th>
            <th>날짜</th>
          </tr>
        </thead>
        <tbody>{list?.map((item, i) => <IpItem item={item} idx={i} key={createKey()} />)}</tbody>
      </table>
    </div>
  )
});

export default IpList;
