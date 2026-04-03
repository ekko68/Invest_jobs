const ToggleCheckBox = (props) => {
  const { className = '', data, onChange, title='' } = props

  const handleChange = (e) => {
    if (onChange) {
      onChange(e)
    }
  }

  return (
    <div className={`toggle_checkbox ${className}`}>
      <input type="checkbox" title={title} id={data.id} onChange={(e) => handleChange(e)} checked={data.status} />
      <label htmlFor={data.id}>&nbsp;</label>
      <label htmlFor={data.id}>{data.value}</label>
    </div>
  )
}

export default ToggleCheckBox
