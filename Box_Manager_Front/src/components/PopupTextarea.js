import Button from './atomic/Button'
import React, {useEffect, useState} from "react";

const PopupTextarea = (props) => {

  const {data, setPopup, setTextPopup, handleSave} = props;

  const [saveData, setSaveData] = useState({
    faqCtgyId: "",
    faqCtgyNm: ""
  })

  useEffect(() => {
    if(Object.keys(data).length) setSaveData(data);
  }, [data])

  const handleClose = () => {
    setSaveData({faqCtgyId: "", faqCtgyNm: ""});
    setTextPopup({active: false, type: null, data: {}});
  }

  const handleChangeName = (e) => {
    if(e.target.value.length > 30){
      return setPopup({active: true, type: "error", text: "최대 30글자까지 입력 가능합니다."});
    }

    let target = {...saveData};
    target["faqCtgyNm"] = e.target.value;
    setSaveData(target);
  }

  return (
    <div className='popup_wrap popup_textarea'>
      <div className='layer'>&nbsp;</div>
      <div className='popup_container'>
        <div className='popup_content'>
          <div className='popup_header'>
            <div className='popup_header_title'>카테고리 {saveData.faqCtgyId?.length > 0 ? "수정" : "추가"}</div>
            <button className='popup_header_close' onClick={handleClose}>
              <img src={require('assets/images/ico_cancel_grey.png').default} alt="닫기" />
            </button>
          </div>
          <div className='textarea_wrap'>
            <div className='textarea_inner'>
              <textarea
                className="textarea"
                placeholder={'카테고리명을 입력해주세요요.'}
                value={saveData.faqCtgyNm}
                maxLength={30}
                onChange={handleChangeName}
              />
              <p className='limit'>{saveData.faqCtgyNm?.length || 0}/30</p>
            </div>
          </div>
        </div>
        <div className='popup_footer'>
          <>
            <Button className={'full_grey_dark'} onClick={handleClose}>
              취소
            </Button>
            <Button className={'full_blue'} onClick={() => handleSave(saveData)}>
              저장
            </Button>
          </>
        </div>
      </div>
    </div>
  )
}

export default PopupTextarea
