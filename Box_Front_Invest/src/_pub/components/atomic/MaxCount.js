/** @jsxImportSource @emotion/react */
import { maxCountStyle } from 'assets/style/AtomicStyle'

const MaxCount = (props) => {
  const { count = 0, max = 0 } = props
  return (
    <div className="max_count" css={maxCountStyle}>
      <p className="count">{count}</p>
      <p className="max">{max}</p>
    </div>
  )
}

export default MaxCount
