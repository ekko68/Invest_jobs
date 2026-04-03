/** @jsxImportSource @emotion/react */
import { useEffect, useRef, useState } from 'react'
import { popupConsultReqStyle } from 'assets/style/PopupStyle'
import { popupLayoutStyle } from 'assets/style/ComponentStyle'
import PopupHeader from 'components/popups/PopupHeader'
import PopupFooter from 'components/popups/PopupFooter'
import Button from 'components/atomic/Button'
import { colors } from 'assets/style/style.config'
import Radio from 'components/atomic/Radio'
import Input from 'components/atomic/Input'
import ReactEvent from 'modules/utils/ReactEvent'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import {exeFunc} from 'modules/utils/ReactUtils'
import {createKey} from "modules/utils/CommonUtils";
import {StringUtils} from "modules/utils/StringUtils";

const PopupConsultReq = (props) => {
  const { handlePopup, typeList } = props
  const alertPop = useRef()
  const titleRef = useRef()
  const contentRef = useRef()

  // 페이지에서 팝업 자체 핸들러 (팝업 닫기)
  const hide = () => {
    ReactEvent.dispatchEvent('hideConsultPop')
  }

  // radio button
  const [radioList, setRadioList] = useState({
    selected: '',
    radioList: []
  })
  const handleRadio = (e) => {
    setRadioList({
      ...radioList,
      selected: e.target.id
    })
  }

  const [inputValues, setInputValues] = useState({
    title: '',
    content: ''
  })

  const handleOnChange = (e) => {
    setInputValues({
      ...inputValues,
      [e.target.name]: e.target.value
    })
  }

  const apply = () => {

    if (String(inputValues.title).trim() === '') {
      exeFunc(alertPop, 'open', '제목을 입력하세요');
      return
    }
    if (String(inputValues.content).trim() === '') {
      exeFunc(alertPop, 'open', '내용을 입력하세요');
      return
    }

    const vo = {
      cnsgPtrnCd: radioList.selected,
      cnsgReqsTtl: inputValues.title,
      cnsgReqsCon: inputValues.content
    }

    ReactEvent.dispatchEvent('applyConfirm', vo);
  }

  const executeApply = async () => {
    // const vo = {
    //   cnsgPtrnCd: radioList.selected,
    //   cnsgReqsTtl: inputValues.title,
    //   cnsgReqsCon: inputValues.content
    // }
    //
    // const res = await CommonAxios(getPostConfig(Api.consulting.consultingSave, vo))
    //
    // if(res) {
    //   if(res.status !== 200) {
    //     ReactEvent.dispatchEvent('applyFail');
    //   }
    // } else {
    //   ReactEvent.dispatchEvent('applyFail');
    // }

    // ReactEvent.dispatchEvent('applyComplete')
  }

  useEffect( async () => {
    if(typeList.length > 0) {
      setRadioList({
        selected: typeList[0].id,
        radioList: typeList
      })
    }
    ReactEvent.addEventListener('executeApply', executeApply)
    return () => {
      ReactEvent.removeEventListener('executeApply')
    }
  }, [])

  return (
    <div className="popup_wrap popup_consult_req" css={popupLayoutStyle('620px')}>
      <div className="popup_layout">&nbsp;</div>
      <div className="popup_container scroll " css={popupConsultReqStyle}>
        <PopupHeader title={'컨설팅 의뢰하기'} handlePopup={hide} />
        {/*popup_content start*/}
        <div className="popup_content">
          {/*타입*/}
          <div className="input_wrap">
            <p className="tit">타입</p>
            <div className="radio_inner">
              {radioList.radioList.map((radio) => (
                <Radio
                  key={createKey()}
                  radio={radio}
                  onChange={(e) => handleRadio(e)}
                  checked={radio.id === radioList.selected}
                />
              ))}
            </div>
          </div>
          {/*제목*/}
          <label className="input_wrap">
            <p className="tit">제목</p>
            <Input
              type={'text'}
              className="input"
              maxLength={200}
              name="title"
              value={inputValues.title}
              onChange={(e) => {
                e.target.value = StringUtils.cutStrByLimit(e.target.value, 200);
                handleOnChange(e)
              }}
              placeholder={'제목을 입력해 주세요.'}
            />
          </label>
          {/*내용*/}
          <label className="input_wrap tit_top">
            <p className="tit">내용</p>
            <textarea
              className="input textarea"
              maxLength={1000}
              name="content"
              value={inputValues.content}
              onChange={(e) => {
                e.target.value = StringUtils.cutStrByLimit(e.target.value, 1000);
                handleOnChange(e)
              }}
              placeholder={'내용을 입력해 주세요.'}
            />
          </label>
        </div>
        {/*popup_content end*/}
        <PopupFooter>
          <div className="btn_group">
            <Button theme={colors.blue} onClick={apply}>
              신청
            </Button>
            <Button theme={colors.lightGrey} onClick={hide}>
              취소
            </Button>
          </div>
        </PopupFooter>
        <AlertPopup ref={alertPop} />
      </div>
    </div>
  )
}

export default PopupConsultReq
