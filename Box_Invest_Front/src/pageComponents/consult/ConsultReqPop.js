import React, {forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState} from 'react'
import PopupConsultReq from 'components/popups/PopupConsultReq'
import ReactEvent from 'modules/utils/ReactEvent'
import {CodeContext} from "modules/contexts/common/CodeContext";
import {deepCopyByRecursion} from "modules/utils/CommonUtils";


const ConsultReqPop = forwardRef((props, ref) => {

    const codeContext = useContext(CodeContext);

    const [isOpen, setIsOpen] = useState(false)
    const [typeList, setTypeList] = useState([]);

    useImperativeHandle(ref, () => ({
        show,
        hide,
        // setCategoryTypeList
    }))

    const show = () => {
        setIsOpen(true)
        document.body.classList.add("popupScrollLock");
    }

    const hide = () => {
        setIsOpen(false)
        document.body.classList.remove("popupScrollLock");
    }

    const onHideConsultPop = () => {
        hide()
    }

    // const setCategoryTypeList = (list) => {
    //     setTypeList(list);
    // }

    const isMountedRef = useRef(false);

    useEffect(() => {
        if(codeContext.state.isLoaded && !isMountedRef.current) {
            isMountedRef.current = true;
            setTypeList(codeContext.actions.getConsultingTypeList());
        }
    }, [codeContext.state.isLoaded]);

    useEffect(() => {
        ReactEvent.addEventListener('hideConsultPop', onHideConsultPop)
        return () => {
            ReactEvent.removeEventListener('hideConsultPop')
        }
    }, [])

    const render = () => {
        if (isOpen === false) {
            return <></>
        } else if (isOpen) {
            return <PopupConsultReq typeList={typeList}/>
        }
    }

    return render()
})

export default ConsultReqPop
