/******* @INFO
 type = default || reverse
 ******/

const Checkbox = (props) => {
  const { className = '', type = 'default', checkbox, onChange, ...other } = props

  return (
    <div className={`checkbox_wrap ${type === 'reverse' ? 'reverse' : ''} ${className ? className : ''}`}>
      <input type="checkbox" id={checkbox.id} onChange={(e) => onChange(e)} {...other} />
      <label htmlFor={checkbox.id}>&nbsp;</label>
      <label htmlFor={checkbox.id}>{checkbox.value}</label>
    </div>
  )
}

export default Checkbox
