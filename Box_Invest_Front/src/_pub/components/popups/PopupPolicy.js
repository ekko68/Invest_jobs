/** @jsxImportSource @emotion/react */
import { useState } from 'react'
import { PopupInvestReqAgreeStyle, popupRequestStyle } from 'assets/style/PopupStyle'
import { colors } from 'assets/style/style.config'
import { popupLayoutStyle } from 'assets/style/ComponentStyle'

import PopupHeader from 'components/popups/PopupHeader'
import PopupFooter from 'components/popups/PopupFooter'
import Button from 'components/atomic/Button'
import Checkbox from 'components/atomic/Checkbox'

const PopupPolicy = (props) => {
  const { handlePopup } = props

  /****************************/
  /* STATE 정의 */
  /****************************/
  //투자심사 요청하기
  const [CheckboxList, setCheckboxList] = useState([
    { id: 'chk01', value: '동의', status: false },
    { id: 'chk02', value: '동의', status: false },
    { id: 'chk03', value: '전체동의', status: false }
  ])

  /****************************/
  /* 함수 정의 */
  /****************************/
  // 페이지에서 팝업 자체 핸들러 (팝업 닫기)
  const onPopup = () => {
    handlePopup && handlePopup()
  }

  // 투자심사 요청하기 checkbox 핸들러
  const handleCheckbox = (e) => {
    let newList = []
    CheckboxList.map((chk, idx) => {
      if (chk.id === e.target.id) {
        chk.status = e.target.checked
      }
      newList.push(chk)
    })
    setCheckboxList(newList)
  }

  return (
    <div className="popup_wrap popup_policy" css={popupLayoutStyle('500px')}>
      <div className="popup_layout">&nbsp;</div>
      {/*
      @INFO
      스텝별 내용 활성화 클래스 : popup_container + active_section01 ~active_section06
      active_section01: 투자심사 요청하기
      */}
      <div className="popup_container scroll active_section01" css={popupRequestStyle}>
        {/*투자심사요청하기 start */}
        <div className="popup_section section01">
          <PopupHeader title={'IR 자료요청'} handlePopup={onPopup} />
          <div className="popup_content">
            <div className="popup_content_wrap">
              <div className="agree_box_wrap">
                <p className="popup_title">서비스 제공 동의</p>
                <div className="agree_box">
                  <div className="agree_box_top">
                    <span className="title">개인정보 동의</span>
                    <Checkbox
                      type={'reverse'}
                      checkbox={CheckboxList[0]}
                      onChange={handleCheckbox}
                      checked={CheckboxList[0].status}
                    />
                  </div>
                  <div className="agree_box_bottom">
                    <div className="content scroll">
                      개인정보의 제3자 제공도 꼭 필요한 범위에서 최소한으로 하여야 하며, 제3자 제공 동의를 받는 경우에는
                      개인정보를 제공받는 자, 제공받는 자의 이용 목적, 제공하는 개인정보 항목 등 중요한 사항은 부호·색채
                      및 굵고 큰 글자 등으로 명확히 표시하여야 개인정보의 제3자 제공도 꼭 필요한 범위에서 최소한으로
                      하여야 하며, 제3자 제공 동의를 받는 경우에는 개인정보를 제공받는 자, 제공받는 자의 이용 목적,
                      제공하는 개인정보 항목 등 중요한 사항은 부호·색채 및 굵고 큰 글자 등으로 명확히 표시하여야
                      개인정보의 제3자 제공도 꼭 필요한 범위에서 최소한으로 하여야 하며, 제3자 제공 동의를 받는 경우에는
                      개인정보를 제공받는 자, 제공받는 자의 이용 목적, 제공하는 개인정보 항목 등 중요한 사항은 부호·색채
                      및 굵고 큰 글자 등으로 명확히 표시하여야
                    </div>
                  </div>
                </div>
                <div className="agree_box">
                  <div className="agree_box_top">
                    <span className="title">IBK 서비스 제공 동의</span>
                    <Checkbox
                      type={'reverse'}
                      checkbox={CheckboxList[1]}
                      onChange={handleCheckbox}
                      checked={CheckboxList[1].status}
                    />
                  </div>
                  <div className="agree_box_bottom">
                    <div className="content scroll">
                      개인정보의 제3자 제공도 꼭 필요한 범위에서 최소한으로 하여야 하며, 제3자 제공 동의를 받는 경우에는
                      개인정보를 제공받는 자, 제공받는 자의 이용 목적, 제공하는 개인정보 항목 등 중요한 사항은 부호·색채
                      및 굵고 큰 글자 등으로 명확히 표시하여야 개인정보의 제3자 제공도 꼭 필요한 범위에서 최소한으로
                      하여야 하며, 제3자 제공 동의를 받는 경우에는 개인정보를 제공받는 자, 제공받는 자의 이용 목적,
                      제공하는 개인정보 항목 등 중요한 사항은 부호·색채 및 굵고 큰 글자 등으로 명확히 표시하여야
                      개인정보의 제3자 제공도 꼭 필요한 범위에서 최소한으로 하여야 하며, 제3자 제공 동의를 받는 경우에는
                      개인정보를 제공받는 자, 제공받는 자의 이용 목적, 제공하는 개인정보 항목 등 중요한 사항은 부호·색채
                      및 굵고 큰 글자 등으로 명확히 표시하여야
                    </div>
                  </div>
                </div>
                <div className="agree_box">
                  <div className="all_agree">
                    <span className="title">투자희망기업정보 업데이트 동의</span>
                    <Checkbox
                      type={'reverse'}
                      checkbox={CheckboxList[2]}
                      onChange={handleCheckbox}
                      checked={CheckboxList[2].status}
                    />
                  </div>
                  <div className="agree_box_bottom">
                    <div className="content scroll">
                      개인정보의 제3자 제공도 꼭 필요한 범위에서 최소한으로 하여야 하며, 제3자 제공 동의를 받는 경우에는
                      개인정보를 제공받는 자, 제공받는 자의 이용 목적, 제공하는 개인정보 항목 등 중요한 사항은 부호·색채
                      및 굵고 큰 글자 등으로 명확히 표시하여야 개인정보의 제3자 제공도 꼭 필요한 범위에서 최소한으로
                      하여야 하며, 제3자 제공 동의를 받는 경우에는 개인정보를 제공받는 자, 제공받는 자의 이용 목적,
                      제공하는 개인정보 항목 등 중요한 사항은 부호·색채 및 굵고 큰 글자 등으로 명확히 표시하여야
                      개인정보의 제3자 제공도 꼭 필요한 범위에서 최소한으로 하여야 하며, 제3자 제공 동의를 받는 경우에는
                      개인정보를 제공받는 자, 제공받는 자의 이용 목적, 제공하는 개인정보 항목 등 중요한 사항은 부호·색채
                      및 굵고 큰 글자 등으로 명확히 표시하여야
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <PopupFooter>
            <div className="btn_group">
              <Button theme={colors.blue}>동의</Button>
            </div>
          </PopupFooter>
        </div>
        {/*투자심사요청하기 end*/}
      </div>
    </div>
  )
}

export default PopupPolicy
