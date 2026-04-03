/** @jsxImportSource @emotion/react */
import { alertStyle } from 'assets/style/AtomicStyle'
import { colors } from 'assets/style/style.config'
import Button from 'components/atomic/Button'

const Alert = (props) => {
  const { msg = '메시지를 입력하세요', handleAlert } = props
  const onAlert = () => {
    if (handleAlert) handleAlert()
  }
  return (
    <div className="alert_wrap" css={alertStyle()}>
      <div className="layer">&nbsp;</div>
      <div className="alert_inner">
        <p> {msg}</p>
        <div className="btn_wrap">
          <Button theme={colors.blue} onClick={onAlert}>
            확인
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Alert
