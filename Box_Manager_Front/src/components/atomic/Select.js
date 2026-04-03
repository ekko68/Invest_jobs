import { forwardRef, useEffect, useState } from 'react'

const Select = (props, ref) => {
  const { className = '', type = 'default', width = '118px', optionList, handleSelectActive, disabled = false } = props
  const [selectList, setSelectList] = useState(optionList)

  useEffect(() => {
    optionList && setSelectList(optionList)
  }, [optionList])

  if (selectList) {
    const onSelectActive = (selected, label) => {
      const classList = ref.current.classList
      if (classList.contains('active')) {
        classList.remove('active')

        if (selected === selectList.active) return
        setSelectList({
          ...selectList,
          active: selected
        })
        handleSelectActive && handleSelectActive(selected, label)
      } else {
        classList.add('active')
      }
    }

    return (
      <div className={`custom_select ${className} ${type}`} ref={ref} style={{ width: width }}>
        <div className="custom_select_inner ">
          {type === 'default' &&
            selectList.list.map(
              (opt, idx) =>
                selectList.active === opt.id && disabled === false &&(
                  <p
                    className="option_item selected"
                    key={'selected_' + opt.id + idx}
                    onClick={() => onSelectActive(opt.id, opt.label)}
                  >
                    {opt.label}
                  </p>
                ) || 
                selectList.active === opt.id && disabled === true &&(
                  <p
                    className="option_item disabled_item"
                    key={'selected_' + opt.id + idx}
                  >
                    {opt.label}
                  </p>
                )
            )}
          <ul className="option_list">
            {selectList.list.map(
              (opt, idx) =>
                selectList.active !== opt.id && (
                  <li
                    className={`option_item ${opt.disabled === undefined || !opt.disabled ? '' : 'disabled_item'}`}
                    key={opt.id + '_' + idx}
                    onClick={() => {
                      if (opt.disabled === undefined || !opt.disabled) {
                        onSelectActive(opt.id, opt.label)
                      }
                    }}
                  >
                    {opt.label}
                  </li>
                )
            )}
          </ul>
          {type === 'upside' &&
            selectList.list.map(
              (opt, idx) =>
                selectList.active === opt.id && (
                  <p
                    className="option_item selected"
                    key={'selected_' + opt.id + idx}
                    onClick={() => onSelectActive(opt.id, opt.label)}
                  >
                    {opt.label}
                  </p>
                )
            )}
        </div>
      </div>
    )
  } else {
    return <div>ERROR</div>
  }
}

const SelectRef = forwardRef(Select)
export default SelectRef
