const Toggle = (props) => {
  const { className = '', data, onChange } = props

  const handleChange = (e) => {
    if (onChange) {
      onChange(e)
    }
  }
  return (
    <div className={`toggle_wrap ${className}`}>
      <input type="checkbox" id={data.id} onChange={(e) => handleChange(e)} checked={data.status} />
      <label htmlFor={data.id}>&nbsp;</label>
      <label htmlFor={data.id}>{data.value}</label>
    </div>
  )
}

export default Toggle
