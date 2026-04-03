import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { CloseBtn } from 'components/atomic/IconButton'
import Checkbox from 'components/atomic/Checkbox'
import Button from 'components/atomic/Button'
import {createKey} from "modules/utils/CommonUtils";


const InvestAmountPopup = forwardRef((props, ref) => {
  const { onComplete, onAlert, ...other } = props
  const onPopup = () => {
    setIsOpen(false)
    document.body.classList.remove("alertScrollLock");
  }
  const [list, setList] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const setData = (temp) => {
    const tempList = []
    if (list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        item['status'] = false
        compareItem(temp, item)
        tempList.push(item)
      }
    }
    setList(tempList)
    setIsOpen(true)
    document.body.classList.add("alertScrollLock");
  }
  const getData = () => {
    return list
  }
  const open = () => {
    setIsOpen(true)
    document.body.classList.add("alertScrollLock");
  }
  const close = () => {
    setIsOpen(false)
    document.body.classList.remove("alertScrollLock");
  }
  useEffect(async () => {
    await loadTechList()
  }, [])
  useImperativeHandle(ref, () => ({
    open,
    close,
    setData,
    getData
  }))
  const compareItem = (compareList, item) => {
    for (let i = 0; i < compareList.length; i++) {
      const compareItem = compareList[i]
      if (item['id'] === compareItem['id']) {
        item['status'] = true
      }
    }
  }
  const loadTechList = async () => {
    const investAmountList = [
      { id: 'A', value: '5억 이하' },
      { id: 'B', value: '10억 이하' },
      { id: 'C', value: '30억 이하' },
      { id: 'D', value: '50억 이하' },
      { id: 'E', value: '100억 이하' },
      { id: 'F', value: '100억 초과' }
    ]
    for (let i = 0; i < investAmountList.length; i++) {
      const item = investAmountList[i]
      item.status = false
    }
    setList(investAmountList)
  }
  const onChangeCheckBox = (event) => {
    const temp = []
    const id = event.target.id
    const checked = event.target.checked
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      if (item.id === id) {
        item.status = checked
      }
      temp.push(item)
    }
    setList(temp)
  }
  const onClickCancel = () => {
    close()
  }
  const onClickComplete = () => {
    const items = []
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      if (item.status) {
        items.push(item)
      }
    }
    if (items.length === 0) {
      onAlert('선택된 활용 기술이 없습니다.')
      return
    }
    if (items.length > 5) {
      onAlert('최대 5개까지 복수 선택 가능합니다.')
      return
    }
    if (onComplete) {
      onComplete(items)
    }
    close()
  }
  const render = () => {
    if (isOpen === false) return <></>
    else {
      return (
        <div className="popup_wrap popup_biz" {...other}>
          <div className="popup_layout" onClick={onPopup}>
            &nbsp;
          </div>
          <div className="popup_container scroll ">
            <div className="popup_header">
              <div className="popup_header_inner">
                <div className="title">투자 금액 범위</div>
                <p className="sub_title">* 최대 5개까지 복수 선택 가능</p>
              </div>
              <CloseBtn onClick={onPopup} />
            </div>
            <div className="popup_content">
              <ul className="biz_sel_list">{list?.map((item, i) => (
                  <li className="biz_sel_item" key={createKey()}>
                    <Checkbox className={'type02'} checkbox={item} onChange={onChangeCheckBox} checked={item.status} />
                  </li>
              ))}</ul>
            </div>
            <div className="popup_footer ">
              <Button className={'light_grey'} onClick={onClickCancel}>
                취소
              </Button>
              <Button className={'blue'} onClick={onClickComplete}>
                선택 완료
              </Button>
            </div>
          </div>
        </div>
      )
    }
  }
  return render()
});

export default InvestAmountPopup;
