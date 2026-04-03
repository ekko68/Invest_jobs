/** @jsxImportSource @emotion/react */
import { numberBoxStyle } from 'assets/style/ComponentStyle'
import {createKey} from "modules/utils/CommonUtils";

const NumberBox = (props) => {
  const { data = '000', unit = false, comma = false, listIndex = 0 } = props
  const numbers = data && data.toString().split('')
  return (
      <>
        <div className="number_box" css={numberBoxStyle}>
          {numbers?.map((num, idx) => (
              <div className="number" key={createKey()}>
                {num}
              </div>
          ))}
          {unit && <p className="unit_text">단위:천원</p>}
        </div>
        {comma && <p className="comma">,</p>}
      </>
  )
}

export default NumberBox
