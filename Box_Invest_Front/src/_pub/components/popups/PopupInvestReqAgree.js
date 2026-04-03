/** @jsxImportSource @emotion/react */
import { useState } from 'react'
import {
  investReq01Style,
  investReq02Style,
  investReq03Style,
  investReq04Style,
  PopupInvestReqAgreeStyle,
  popupRequestStyle
} from 'assets/style/PopupStyle'
import { colors } from 'assets/style/style.config'
import { popupLayoutStyle } from 'assets/style/ComponentStyle'

import PopupHeader from 'components/popups/PopupHeader'
import PopupFooter from 'components/popups/PopupFooter'
import Button from 'components/atomic/Button'
import Checkbox from 'components/atomic/Checkbox'
import Input from 'components/atomic/Input'
import MaxCount from 'components/atomic/MaxCount'
import {CheckYn} from "modules/consts/BizConst";

/**
 * TODO : 확인 후 삭제
 */

const PopupInvestReqAgree = (props) => {
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
  // 추가자료제출
  const [inputPPT, setInputPPT] = useState('') // 발표자료PPT
  const [inputDoc, setInputDoc] = useState('') // 추가서류
  const [inputLink, setInputLink] = useState('') // 홍보영상
  // 메시지입력
  const [message, setMessage] = useState('') // 메시지

  /****************************/
  /* 함수 정의 */
  /****************************/
  // 페이지에서 팝업 자체 핸들러 (팝업 닫기)
  const onPopup = () => {
    if (handlePopup) handlePopup()
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

  // 투자심사요청 조회기간설정
  const [calcValue, setCalcValue] = useState(15) // 기본 15일
  const handleCalc = (type) => {
    if (type === 'minus') {
      if (calcValue > 0) {
        setCalcValue(calcValue - 1)
      } else {
        return false
      }
    } else {
      if(calcValue < 30) {
        setCalcValue(calcValue + 1)
      } else {
        return false
      }
    }
  }

  /* popup활성화 active 클래스 추가 */
  return (
    <div className="popup_wrap popup_invest_req_agree active" css={popupLayoutStyle('500px')}>
      <div className="popup_layout" onClick={onPopup}>
        &nbsp;
      </div>
      {/*
      @INFO
      section01: 투자심사 요청하기
      section02: 투자심사 요청 - IR등록 전
      section03: 투자심사 요청 - IR등록 후
      section04: 간편서류 제출
      section05: 추가자료 제출
      section06: 메시지 입력

      섹션별 활성화 :  popup_section + active
      */}
      <div className="popup_container scroll ">
        {/*투자심사요청하기 start */}
        <div className="popup_section section01 active">
          <PopupHeader title={'투자심사 요청하기'} handlePopup={onPopup} />
          <div className="popup_content" css={PopupInvestReqAgreeStyle}>
            <div className="popup_content_wrap">
              <div className="agree_box_wrap">
                <p className="popup_title">개인정보 동의</p>
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
              <Button type="linear" theme={colors.blue}>
                이전
              </Button>
              <Button theme={colors.blue}>다음</Button>
            </div>
          </PopupFooter>
        </div>
        {/*투자심사요청하기 end*/}

        {/*투자심사요청-IR등록전 start*/}
        <div className="popup_section section02 ">
          <PopupHeader title={'투자심사 요청 (1/3)'} handlePopup={onPopup} />
          <div className="popup_content" css={investReq02Style}>
            <div className="popup_container01">
              <p className="main_txt">IR 정보 확인하기</p>
              <p className="txt">단한번의 IR 작성을 통해 원하는 투자사에게 투자심사요청을 해보세요.</p>
              <div className="inner_box">
                <div className="txt_wrap">
                  <p className="sub_txt">IR 등록이 필요합니다</p>
                </div>
                <div className="btn_add">
                  <p>등록하기</p>
                </div>
              </div>
            </div>
          </div>
          {/*<PopupFooter>*/}
          {/*  <div className="btn_group">*/}
          {/*    <Button theme={colors.blue} disabled={CHECK_YN.YES}>*/}
          {/*      다음*/}
          {/*    </Button>*/}
          {/*  </div>*/}
          {/*</PopupFooter>*/}
          <PopupFooter>
            <div className="btn_group">
              <Button type="linear" theme={colors.blue}>
                이전
              </Button>
              <Button theme={colors.blue}>다음</Button>
            </div>
          </PopupFooter>
        </div>
        {/*투자심사요청-IR등록전 end*/}

        {/*투자심사요청-IR등록후 start*/}
        <div className="popup_section section03 ">
          <PopupHeader title={'투자심사 요청 (1/4)'} handlePopup={onPopup} />
          <div className="popup_content" css={investReq01Style}>
            <div className="popup_container01">
              <p className="main_txt">IR 정보 확인하기</p>
              <p className="txt">단한번의 IR 작성을 통해 원하는 투자사에게 투자심사요청을 해보세요.</p>
              <div className="term_setup">
                <span className="label">조회 기간 설정 : </span>
                <MinusPlus value={calcValue} handleCalc={handleCalc} />
              </div>
              <div className="inner_box">
                <div className="txt_wrap">
                  <p className="sub_txt">일루넥스 2021 IR 자료</p>
                  <p className="DateTime">2021년 10월 01일 오후14:54:23</p>
                </div>
                <div className="btn_preview">
                  <p>미리보기</p>
                </div>
              </div>
            </div>
          </div>
          <PopupFooter>
            <div className="btn_group">
              <Button theme={colors.blue}>다음</Button>
            </div>
          </PopupFooter>
        </div>
        {/*투자심사요청-IR등록후 end*/}

        {/*간편서류체줄 start*/}
        <div className="popup_section section04 ">
          <PopupHeader title={'간편서류 제출 (2/4)'} handlePopup={onPopup} />
          <div className="popup_content" css={investReq01Style}>
            <div className="popup_container01">IBK협의 후 디자인</div>
          </div>
          <PopupFooter>
            <div className="btn_group">
              <Button theme={colors.blue}>다음</Button>
            </div>
          </PopupFooter>
        </div>
        {/*간편서류체줄 end*/}

        {/*추가자료제출 start*/}
        <div className="popup_section section05 ">
          <PopupHeader title={'추가자료 제출 (3/4)'} handlePopup={onPopup} />
          <div className="popup_content" css={investReq03Style}>
            <div className="popup_container02">
              <div className="cnt_wrap">
                <p className="cnt_title">발표자료PPT</p>
                <div className="input_section">
                  <Input name={'input01'} value={inputPPT} placeholder={''} readOnly />
                  <Button type={'linear'} theme={colors.blue}>
                    파일추가
                  </Button>
                </div>
              </div>
              <div className="cnt_wrap">
                <p className="cnt_title">추가서류</p>
                <div className="input_section">
                  <Input name={'input01'} value={inputDoc} placeholder={''} readOnly />
                  <Button type={'linear'} theme={colors.blue}>
                    파일추가
                  </Button>
                </div>
              </div>
              <div className="cnt_wrap">
                <p className="cnt_title">홍보영상</p>
                <div className="input_section bg_color">
                  <Input
                    name={'input02'}
                    value={inputLink}
                    onChange={(e) => setInputLink(e.target.value)}
                    placeholder={'URL입력'}
                  />
                </div>
              </div>
            </div>
          </div>
          <PopupFooter>
            <div className="btn_group">
              <Button theme={colors.blue} disabled={CheckYn.NO}>
                다음
              </Button>
            </div>
          </PopupFooter>
        </div>
        {/*추가자료제출 end*/}

        {/*메시지입력 start*/}
        <div className="popup_section section06 ">
          <PopupHeader title={'메시지 입력 (4/4)'} handlePopup={onPopup} />
          <div className="popup_content" css={investReq04Style}>
            <div className="popup_container03">
              <textarea
                className="message_box"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="투자자에게 보내는 메시지를 입력해 주세요."
                maxLength={1000}
              >
                &nbsp;
              </textarea>
              <div className="count_wrap">
                {/*<p className="overtext">요청 메시지를 20자 이상 입력해 주세요.</p>*/}
                &nbsp; {/* <= 있어야함 */}
                <MaxCount count={0} max={1000} />
              </div>
            </div>
          </div>
          <PopupFooter>
            <div className="btn_group">
              <Button className={'linear blue'} disabled={CheckYn.NO}>
                이전
              </Button>
              <Button className={'blue'} disabled={CheckYn.NO}>
                제출
              </Button>
            </div>
          </PopupFooter>
        </div>
        {/*메시지입력 end*/}

        {/*신청완료 start*/}
        <div className="popup_section section07 popup_apply_finish">
          <div className="popup_container scroll ">
            <PopupHeader title={'신청완료'} handlePopup={onPopup} className="popup_header" />
            <div className="popup_content">
              <p className="title">
                <span className="company_name">(주)선보엔젤 파트너스</span>에 <br />
                온라인 투자심사 요청이 완료되었습니다.
              </p>
            </div>
            <PopupFooter>
              <div className="btn_group">
                <Button className={'blue'}>확인</Button>
              </div>
            </PopupFooter>
          </div>
        </div>
        {/*신청완료 end*/}
      </div>
    </div>
  )
}

export default PopupInvestReqAgree
