import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import PopupHeader from 'components/popups/PopupHeader'
import PopupFooter from 'components/popups/PopupFooter'
import Button from 'components/atomic/Button'
import ResponseUtils from 'modules/utils/ResponseUtils'
import Api from 'modules/consts/Api'
import {createKey} from "modules/utils/CommonUtils";


const PopupProdDetail = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const [vo, setVo] = useState({
    fileId: '',
    keywordList: [],
    prdtId: '',
    prdtChrc: '',
    prdtDesc: '',
    imgUrl: '',
    prdtNm: '',
    prdtPtrn: '',
    utlinsttId: ''
  })
  useEffect(() => {}, [])
  useImperativeHandle(ref, () => ({
    open,
    close
  }))
  const open = async (prdtId) => {
    const url = Api.my.company.productDetail + '/' + prdtId
    const res = await loadProductDetail(url)
    setVo(res)
    setIsOpen(true)
    document.body.classList.add("popupScrollLock");
  }
  const close = () => {
    setIsOpen(false)
    document.body.classList.remove("popupScrollLock");
  }
  const onClose = () => {
    close();
  }
  const loadProductDetail = (url) => {
    const res = ResponseUtils.getSimpleResponse(url)
    return res
  }
  const onClickModify = () => {
    props.onModify(vo)
  }
  const onClickRemove = () => {
    props.onRemove(vo)
  }
  const getRender = () => {
    if (isOpen === false) return <></>
    if (isOpen) {
      return (
        <div className="popup_wrap popup_prod_detail">
          <div className="popup_layout">&nbsp;</div>
          <div className="popup_container">
            <PopupHeader title={vo.prdtNm} handlePopup={onClose} />
            {/*popup_content start*/}
            <div className="popup_content scroll_lightgrey">
              <div className="thumbnail_wrap">
                <div className="img_wrap">
                  <img src={vo.imgUrl} alt="" />
                </div>
                <ul className="tag_box_list">{vo?.keywordList?.map((listItem, index) => (
                    <li className="tag_box_item" key={createKey()}>
                      {listItem['kwrNm']}
                    </li>
                ))}</ul>
              </div>
              <div className="content_wrap">
                <p className="introduce">{vo.prdtDesc}</p>
                <p className="info">{vo.prdtChrc}</p>
              </div>
            </div>
            {/*popup_content end*/}
            <PopupFooter>
              <div className="btn_group">
                <Button className={'light'} onClick={onClickRemove}>
                  삭제
                </Button>
                <Button className={'light'} onClick={onClickModify}>
                  수정
                </Button>
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

export default PopupProdDetail;
