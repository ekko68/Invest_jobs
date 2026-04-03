import { useState, forwardRef, useImperativeHandle } from 'react'
import Select from 'components/atomic/Select'
import { RequestStatusLabels } from 'modules/consts/BizConst'
const StatusSelect = forwardRef((props, ref) => {
  const { onChange, title = '' } = props
  const [SelectList, setSelectList] = useState({
    selected: 'all',
    selList: [
      { id: 'all', value: '전체' }, // '전체'
      { id: 'standBy', value: RequestStatusLabels.SUGGEST }, // '제안'
      { id: 'approval', value: RequestStatusLabels.REQUEST }, // '요청'
      { id: 'evaluate', value: RequestStatusLabels.EVALUATE }, // '심사중'
      { id: 'complete', value: RequestStatusLabels.COMPLETE }, // '심사완료'
      { id: 'expiration', value: RequestStatusLabels.EXPIRED }, // '기간만료'
      { id: 'cancel', value: RequestStatusLabels.CANCEL } // '요청취소'
    ]
  })
  const handleSelect = (e) => {
    setSelectList({
      ...SelectList,
      selected: e.target.value
    })
    if (onChange) {
      const code = getCode(e.target.value)
      setTimeout(() => onChange(code), 100)
    }
  }
  const selectedLabel = () => {
    return SelectList.selected
  }

  const selectedSetLabel = (val) => {
    setSelectList({
      ...SelectList,
      selected: val
    })
  }

  const getSelectedCode = () => {
    const codeList = [
      { id: '', code: 'all', label: '전체' },
      { id: 'standBy', code: 'EXN00000', label: '제안' },
      { id: 'approval', code: 'EXN00001', label: '요청' },
      { id: 'evaluate', code: 'EXN00002', label: '심사중' },
      { id: 'complete', code: 'EXN00003', label: '심사완료' },
      { id: 'expiration', code: 'EXN00004', label: '기간만료' },
      { id: 'cancel', code: 'EXN00005', label: '요청취소' }
    ]
    const label = SelectList.selected
    if (label === 'all') {
      return ''
    }
    let r = 'EXN00000'
    for (let i = 0; i < codeList.length; i++) {
      const codeItem = codeList[i]
      if (codeItem.id === label) {
        r = codeItem.code
        break
      }
    }
    return r
  }
  const getCode = (label) => {
    const codeList = [
      { id: '', code: 'all', label: '전체' },
      { id: 'standBy', code: 'EXN00000', label: '제안' },
      { id: 'approval', code: 'EXN00001', label: '요청' },
      { id: 'evaluate', code: 'EXN00002', label: '심사중' },
      { id: 'complete', code: 'EXN00003', label: '심사완료' },
      { id: 'expiration', code: 'EXN00004', label: '기간만료' },
      { id: 'cancel', code: 'EXN00005', label: '요청취소' }
    ]
    if (label === 'all') {
      return ''
    }
    let r = 'EXN00000'
    for (let i = 0; i < codeList.length; i++) {
      const codeItem = codeList[i]
      if (codeItem.id === label) {
        r = codeItem.code
        break
      }
    }
    return r
  }
  useImperativeHandle(ref, () => ({
    selectedLabel,
    getSelectedCode,
    selectedSetLabel
  }))

  return (
    <Select
      className={'type02'}
      optList={SelectList.selList}
      title={title}
      selected={SelectList.selected}
      onChange={handleSelect}
      style={{ width: '100%', height: '37px' }}
    />
  )
})

export default StatusSelect
