import Button from "components/atomic/Button";
import {colors} from "assets/style/style.config";

/**
 * loading bar 처리 모든 페이지 및 필요 컴포넌트에 바로 사용할 수 있겠금 예외적으로 처리함
 */
const SessionCheckAlert = () => {
    return (
        <div className="alert_wrap" style={{ zIndex: '100000000', display: 'none' }} id="session_check_alert">
            <div className="layer">&nbsp;</div>
            <div className="alert_inner">
                <p id="session_check_alert_message" style={{fontSize: '16px'}}></p>
                <div className="btn_wrap">
                    {/*<Button theme={colors.blue} onClick={onClickCheck}>*/}
                    <Button theme={colors.blue} id="session_check_alert_btn">
                        확인
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default SessionCheckAlert;

const openSessionAlert = (isOpen = false, message='', confirmCallback=null) => {
    document.querySelector("#session_check_alert").style.display = isOpen ? 'flex' : 'none';
    if(message) {
        document.querySelector("#session_check_alert_message").innerHTML = message;
    }

    if(confirmCallback !== null) {
        document.querySelector("#session_check_alert_btn").addEventListener("click", () => {
            document.querySelector("#session_check_alert").style.display = 'none';
            confirmCallback();
        }, {once: true});
    }
}

export {openSessionAlert}