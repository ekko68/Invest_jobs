/** @jsxImportSource @emotion/react */
import { noResultStyle } from 'assets/style/ComponentStyle'
import {StringUtils} from "modules/utils/StringUtils";
const NoResult = (props) => {
  const { msg = '결과가 없습니다.', isIrView=false, style = {} } = props;
  const getStyleStr = (styleObj) => {
      return Object.keys(styleObj)?.map(key => {
          if(StringUtils.hasLength(styleObj[key])) return `${StringUtils.toCssCase(key)}: ${style[key]};`;
      })
  }
  return (
    <div className={`no_result${isIrView ? ' ir_view' : ''}`} css={noResultStyle(getStyleStr(style))}>
      {/*{msg}*/}
      <div className="no_result_title">{msg}</div>
    </div>
  )
}

export default NoResult