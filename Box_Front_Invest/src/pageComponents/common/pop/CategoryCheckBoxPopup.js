import { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react'

import Button from 'components/atomic/Button'
import CheckboxAndEtc from 'components/atomic/CheckboxAndEtc'
import { CloseBtn } from 'components/atomic/IconButton'

import { CodeContext } from 'modules/contexts/common/CodeContext'
import { createKey, deepCopyByRecursion } from 'modules/utils/CommonUtils'

const CategoryCheckBoxPopup = forwardRef((props, ref) => {
  const {
    onComplete = null,
    onAlert = null,
    title = '',
    getCodeContextFunc = null,

    ...other
  } = props

  const codeContext = useContext(CodeContext)

  const selectedCountRef = useRef(0)

  const [list, setList] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  const getData = () => {
    return list
  }

  const setDataOpen = (selectedList = []) => {
    selectedCountRef.current = 0
    const tempList = []

    if (list.length > 0) {
      for (let item of list) {
        const _item = deepCopyByRecursion(item)
        _item.status = false

        for (let t_item of selectedList) {
          if (_item.id === t_item.id) {
            _item.status = true
            selectedCountRef.current++
          }
        }

        tempList.push(_item)
      }
    }
    setList(tempList)
    setIsOpen(true)
    document.body.classList.add('popupScrollLock')
  }

  const close = () => {
    setIsOpen(false)
    document.body.classList.remove('popupScrollLock')
  }

  useImperativeHandle(ref, () => ({
    setDataOpen,
    close,
    getData
  }))

  const onChangeCheckBox = (event) => {
    if (event.target.checked) {
      if (selectedCountRef.current >= 5) {
        if (onAlert !== null) onAlert('최대 5개까지 복수 선택 가능합니다.')
        return
      }
      selectedCountRef.current++
    } else selectedCountRef.current--

    const tempList = []
    for (let item of list) {
      console.table('onChangeCheckBox' + item.value)
      const _item = deepCopyByRecursion(item)
      if (_item.id === event.target.id) _item.status = event.target.checked
      if (event.target.name == 'other') _item.other = ''
      tempList.push(_item)
    }
    setList(tempList)
  }

  const onClickComplete = () => {
    const selectedItems = []

    for (let item of list) {
      const _item = deepCopyByRecursion(item)
      if (_item.status && _item.value === '기타' && _item.other === '') {
        onAlert('기타 항목 입력하세요')
        return
      }
      if (_item.status) selectedItems.push(_item)
    }

    if (selectedItems.length === 0) {
      if (onAlert !== null) onAlert('선택된 항목이 없습니다.')
      return
    }

    if (onComplete !== null) onComplete(selectedItems)
    close()
  }

  const isMountedRef = useRef(false)

  useEffect(() => {
    if (codeContext.state.isLoaded && !isMountedRef.current) {
      isMountedRef.current = true

      // const categoryList = codeContext.actions.getCategoryList();
      let categoryList = []
      if (getCodeContextFunc) categoryList = getCodeContextFunc()

      for (let i = 0; i < categoryList.length; i++) {
        const item = categoryList[i]
        item.status = false
      }
      if (categoryList.length === 7) {
        const item = categoryList.splice(6, 1, categoryList[6])
        categoryList.splice(4, 1, item[0])
        categoryList.pop()
        setList(categoryList)
      }
      setList(categoryList)
    }
  }, [codeContext.state.isLoaded])

  return (
    <>
      {isOpen && (
        <div className="popup_wrap popup_biz" {...other}>
          <div className="popup_layout" onClick={close}>
            &nbsp;
          </div>
          <div className="popup_container scroll ">
            <div className="popup_header">
              <div className="popup_header_inner">
                <div className="title">{title}</div>
                <p className="sub_title">* 최대 5개까지 복수 선택 가능</p>
              </div>
              <CloseBtn onClick={close} />
            </div>
            <div className="popup_content">
              <ul className="biz_sel_list">
                {list?.map((item, i) => (
                  <>
                    <li className="biz_sel_item" key={createKey()}>
                      <CheckboxAndEtc
                        className={'type02'}
                        checkbox={item}
                        onChange={onChangeCheckBox}
                        checked={item.status}
                      />
                    </li>
                  </>
                ))}
              </ul>
            </div>
            <div className="popup_footer ">
              <Button className={'light_grey'} onClick={close}>
                취소
              </Button>
              <Button className={'blue'} onClick={onClickComplete}>
                선택 완료
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
})

export default CategoryCheckBoxPopup
