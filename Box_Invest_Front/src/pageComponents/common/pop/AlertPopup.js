import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react'
import Button from 'components/atomic/Button'
import {colors} from 'assets/style/style.config'

const AlertPopup = forwardRef((props, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const message = useRef('')

    useImperativeHandle(ref, () => ({
        open,
        close
    }))

    const open = (msg = '') => {
        message.current = msg
        setIsOpen(true);
        document.body.classList.add("alertScrollLock");
    }

    const close = () => {
        setIsOpen(false)
        document.body.classList.remove("alertScrollLock");
    }

    useEffect(() => {
        setIsOpen(false)
    }, [])

    const getMessage = () => {
        if (message.current !== '') {
            return message.current
        } else {
            return props.children
        }
    }

    const render = () => {
        if (isOpen === false) {
            return <></>
        } else {
            return (
                <div className="alert_wrap" style={{zIndex: '100000000'}}>
                    <div className="layer">&nbsp;</div>
                    <div className="alert_inner">
                        {/*<p> {getMessage()}</p>*/}
                        <p dangerouslySetInnerHTML={{__html: getMessage()}}/>
                        {/* 팝업 하위에서 alert가 생기는 경우 marginBottom이 생기게 css 구조가 겹쳐 인라인으로 제거 */}
                        <div className="btn_wrap" style={{marginBottom: '0px'}}>
                            <Button theme={colors.blue} onClick={close}>
                                확인
                            </Button>
                        </div>
                    </div>
                </div>
            )
        }
    }

    return render()
})

export default AlertPopup
