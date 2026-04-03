const MinusPlus = (props) => {
  const { value = 0, handleCalc } = props

  return (
    <div className="minus_plus_wrap">
      <button className="btn btn_minus" onClick={() => handleCalc('minus')}>
        -
      </button>
      <p className="value">{value}</p>
      <button className="btn btn_plus" onClick={() => handleCalc('plus')}>
        +
      </button>
    </div>
  )
}

export default MinusPlus
