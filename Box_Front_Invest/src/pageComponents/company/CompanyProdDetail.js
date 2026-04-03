import {forwardRef, useContext, useEffect, useImperativeHandle, useState} from 'react'
import PopupHeader from 'components/popups/PopupHeader'
import PopupFooter from 'components/popups/PopupFooter'
import Button from 'components/atomic/Button'
import ResponseUtils from 'modules/utils/ResponseUtils'
import Api from 'modules/consts/Api'

import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey} from "modules/utils/CommonUtils";

const CompanyProdDetail = forwardRef((props, ref) => {

    const commonContext = useContext(CommonContext);
    const [isOpen, setIsOpen] = useState(false)
    const [vo, setVo] = useState({
        fileId: '',
        imgUrl: '',
        keywordList: [],
        prdtChrc: '',
        prdtDesc: '',
        prdtId: '',
        prdtNm: '',
        prdtPtrn: '',
        utlinsttId: ''
    })

    useImperativeHandle(ref, () => ({
        open,
        close
    }))

    const open = async (utlinsttId, prdtId) => {
        await commonContext.actions.callbackAfterSessionRefresh(async () => {
            const url = Api.company.productDetail + '?utlinsttId=' + utlinsttId + '&prdtId=' + prdtId;
            const res = await ResponseUtils.getSimpleResponse(url, null, false);
            setVo(res);
            setIsOpen(true);
        }, true, true);
    }
    const close = () => {
        setIsOpen(false)
    }
    const onClose = () => {
        setIsOpen(false)
    }

    useEffect(() => {
    }, [])

    const getRender = () => {
        if (isOpen === false) return <></>
        if (isOpen) {
            return (
                <div className="popup_wrap popup_prod_detail">
                    <div className="popup_layout">&nbsp;</div>
                    <div className="popup_container">
                        <PopupHeader title={vo['prdtNm']} handlePopup={onClose}/>
                        {/*popup_content start*/}
                        <div className="popup_content scroll_lightgrey">
                            <div className="thumbnail_wrap">
                                <div className="img_wrap">
                                    {/*<img src={vo.imgUrl} alt="" />*/}
                                    <img
                                        src={String(vo.imgUrl).trim() === '' ? require('assets/images/no_img.jpg').default : vo.imgUrl}
                                        alt=""
                                    />
                                </div>
                                <ul className="tag_box_list">{
                                    vo?.keywordList?.map((listItem, index) => (
                                        <li className="tag_box_item" key={createKey()}>
                                            {listItem['kwrNm']}
                                        </li>
                                    ))
                                }</ul>
                            </div>
                            <div className="content_wrap">
                                <p className="introduce">{vo.prdtDesc}</p>
                                <p className="info">{vo.prdtChrc}</p>
                            </div>
                        </div>
                        {/*popup_content end*/}
                        <PopupFooter>
                            <div className="btn_group">
                                <Button className={'blue'} onClick={onClose}>
                                    확인
                                </Button>
                            </div>
                        </PopupFooter>
                    </div>
                </div>
            )
        }
    }
    return <>{getRender()}</>
});

export default CompanyProdDetail;
