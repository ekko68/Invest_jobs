/** @jsxImportSource @emotion/react */
import { selectStyle } from 'assets/style/AtomicStyle'
import {createKey} from "modules/utils/CommonUtils";


const Select = (props) => {
  const { className = '', optList=[], selected, title = '', ...other } = props

  const getSelected = () => {
    if (selected === null || selected === undefined) return ''
    return selected
  }

  return (
    <select value={getSelected()} {...other} css={selectStyle} className={`select ${className}`} title={title}>
      {optList?.map((item, i) => (
            <option value={item.id} key={createKey()}>
              {item.value}
            </option>
        ))}
    </select>
  )
}

export default Select
