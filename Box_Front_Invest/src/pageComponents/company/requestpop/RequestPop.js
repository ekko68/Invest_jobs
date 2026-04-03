import React, {forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState} from 'react'

import Request0 from 'pageComponents/company/requestpop/Request0'
import Request1 from 'pageComponents/company/requestpop/Request1'
import Request2 from 'pageComponents/company/requestpop/Request2'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'

import {exeFunc} from 'modules/utils/ReactUtils'
import ReactEvent from 'modules/utils/ReactEvent'
import {CompanyContext} from 'modules/contexts/company/companyContext'

const RequestPop = forwardRef((props, ref) => {
    const companyContext = useContext(CompanyContext)
    const {vo, alertPopup} = props

    const requestRef0 = useRef()
    const requestRef1 = useRef()
    const requestRef2 = useRef()

    const [isOpen, setIsOpen] = useState(false)
    let currentPop = useRef(-1).current

    useImperativeHandle(ref, () => ({
        open,
        close
    }))

    const open = () => {
        companyContext.actions.setSuggestId('')
        changePop(0)
        setIsOpen(true)
        document.body.classList.add("popupScrollLock");
    }
    const close = () => {
        currentPop = -1
        setIsOpen(false)
        document.body.classList.remove("popupScrollLock");
    }
    const changePop = (currentPopNumber) => {
        currentPop = currentPopNumber
        const comps = [requestRef0, requestRef1, requestRef2]
        for (let i = 0; i < comps.length; i++) {
            const comp = comps[i]
            if (i === currentPop) exeFunc(comp, 'open')
            else exeFunc(comp, 'close')
        }
    }

    useEffect(() => {
        ReactEvent.addEventListener('step', onStep)
        ReactEvent.addEventListener('close', onClose)
        ReactEvent.addEventListener('alert', onAlert)
        return () => {
            ReactEvent.removeEventListener('step')
            ReactEvent.removeEventListener('close')
            ReactEvent.removeEventListener('alert')
        }
    }, [])

    const onStep = (step) => {
        changePop(step)
    }
    const onClose = () => {
        const comps = [requestRef0, requestRef1, requestRef2]
        for (let i = 0; i < comps.length; i++) {
            if(comps[i] != requestRef2) exeFunc(comps[i], 'init');
            exeFunc(comps[i], 'close')
        }
        close()
    }
    const onAlert = (message) => {
        exeFunc(alertPopup, 'open', message)
    }
    return (
        <>
            <Request0 ref={requestRef0} {...props} alertPopup={alertPopup}/>
            <Request1 ref={requestRef1} vo={vo} {...props} />
            <Request2 ref={requestRef2} vo={vo} {...props} />
            <AlertPopup ref={alertPopup}/>
        </>
    )
});

export default RequestPop;
