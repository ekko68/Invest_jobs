/******* @INFO
 type = default || reverse
 ******/
const Radio = (props) => {
  const { className = '', type = 'default', radio, onChange, ...other } = props

  return (
    <div className={`radio_wrap ${type === 'reverse' ? 'reverse' : ''} ${className}`}>
      <input type="radio" id={radio.id} onChange={(e) => onChange(e)} {...other} />
      <label htmlFor={radio.id}>&nbsp;</label>
      <label htmlFor={radio.id}>{radio.value}</label>
    </div>
  )
}

export default Radio
