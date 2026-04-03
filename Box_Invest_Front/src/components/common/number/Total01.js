/** @jsxImportSource @emotion/react */
import { total01Style } from 'assets/style/ComponentStyle'

const Total01 = (props) => {
  const { data = '0' } = props
  return (
    <div className="total01" css={total01Style}>
      전체 : {data}
    </div>
  )
}

export default Total01
