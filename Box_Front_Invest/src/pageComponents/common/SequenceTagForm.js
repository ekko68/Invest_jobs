import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import Button from 'components/atomic/Button'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import {exeFunc} from 'modules/utils/ReactUtils'
import ValidateUtils from 'modules/utils/ValidateUtils'
import {createKey} from "modules/utils/CommonUtils";


const SequenceTagForm = forwardRef((props, ref) => {
  const { property, placeholder, maxCount, key, seqProperty, properties, title='' } = props
  const tagInputRef = useRef()
  const inputRef = useRef('')
  const alertPop = useRef()
  const [list, setList] = useState([])
  useImperativeHandle(ref, () => ({
    setData,
    getData,
    getCurrentStatus,
    getCurrentInputValue
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
  const getMaxCount = () => {
    return maxCount || 0
  }
  const onClickAdd = () => {
    if (maxCount > 0 && list.length === getMaxCount()) {
      const message = `최대 ${getMaxCount()}개까지 등록 가능합니다.`
      exeFunc(alertPop, 'open', message);
      return
    }

    tagInputRef.current.value = ''
    const classList = tagInputRef.current['classList']
    if (classList.contains('add')) return
    classList.add('active')
  }
  const onKeyUpInterestField = (e) => {
    if (e.key === 'Enter') {
      if (String(e.target.value).trim() === '') {
        removeActive()
        return
      }
      const compareText = String(e.target.value)
      if (ValidateUtils.hasEqualText(list, property, compareText)) {
        const message = `이미 등록된 ${placeholder}가(이) 있습니다.`
        exeFunc(alertPop, 'open', message);
        return
      }
      const value = e.target.value
      addItem(value)
      removeActive()
    }
  }
  const onBlurInterestField = (e) => {
    if (String(e.target.value).trim() === '') {
      removeActive()
      return
    }
    const compareText = String(e.target.value)
    if (ValidateUtils.hasEqualText(list, property, compareText)) {
      const message = `이미 등록된 ${placeholder}가(이) 있습니다.`
      exeFunc(alertPop, 'open', message);
      return
    }
    const value = e.target.value
    addItem(value)
    removeActive()
  }
  const onChangeCheck = (e) => {
    const keyword = String(e.target.value);
    if(keyword.length > 20) {
      e.target.value = keyword.substring(0, 20);
      exeFunc(alertPop, 'open', '최대 20글자까지 입력가능합니다.');
      return
    }
  }
  const removeActive = () => {
    inputRef.current.value = ''
    inputRef.current.blur()
    const classList = tagInputRef.current['classList']
    classList.remove('active')
  }
  const getCurrentStatus = () => {
    const classList = tagInputRef.current['classList']
    return classList
  }
  const getCurrentInputValue = () => {
    return inputRef.current
  }
  const addItem = (value) => {
    const item = createEmptyItem(value)
    const temp = list.concat(item)
    setList(temp)
  }
  const createEmptyItem = (value) => {
    let seq = 0
    if (list.length > 0) {
      const lastItem = list[list.length - 1]
      seq = lastItem[seqProperty] + 1
    }
    let item = {}
    for (let i = 0; i < properties.length; i++) {
      const itemProperty = properties[i]
      if (itemProperty === property) {
        item[property] = value
      } else if (itemProperty === seqProperty) {
        item[seqProperty] = seq
      } else {
        item[itemProperty] = ''
      }
    }
    return item
  }
  const onClickDelete = (item) => {
    if (list.length > 0) {
      const temp = []
      for (let i = 0; i < list.length; i++) {
        const listItem = list[i]
        if (item[seqProperty] !== listItem[seqProperty]) {
          temp.push(listItem)
        }
      }
      setList(temp)
    }
  }
  const getMaxCountRender = () => {
    if (getMaxCount() === 0) {
      return <></>
    } else if (getMaxCount() > 0) {
      return <li className="notice highlight_blue">* 최대 {getMaxCount()}개까지 등록 가능</li>
    }
  }

  const SequenceTagItem = ({item, idx}) => {
    return (
        <li className="tag_box_item">
          {item[property]}
          <button className="ico_delete" onClick={(e) => onClickDelete(item)}>
            <span className="hide">삭제</span>
          </button>
        </li>
    )
  }

  return (
    <>
      <ul className="tag_box_list edit">
        {
          list?.map((item, i) => {
            let loopKey = createKey();
            if(key) loopKey = key + '_' + loopKey;
            return <SequenceTagItem item={item} idx={i} key={loopKey} />
          })
        }
        <li className="tag_box_item add_input" ref={tagInputRef}>
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            className={'input'}
            onChange={onChangeCheck}
            onKeyUp={(e) => onKeyUpInterestField(e)}
            onBlur={(e) => onBlurInterestField(e)}
            title={title}
          />
        </li>
        <li className="tag_box_item add_tag">
          <Button className={'dashed blue linear'} onClick={onClickAdd}>
            <span className="ico_add_right">추가</span>
          </Button>
        </li>
        {getMaxCountRender()}
      </ul>
      <AlertPopup ref={alertPop} />
    </>
  )
})

export default SequenceTagForm
