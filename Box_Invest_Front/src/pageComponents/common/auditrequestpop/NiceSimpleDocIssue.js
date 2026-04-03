import { useEffect, useImperativeHandle, useState } from 'react'
import { forwardRef } from 'react'
import Checkbox from 'components/atomic/Checkbox'

const NiceSimpleDocIssue = forwardRef((props, ref) => {
  // checkbox for user agree
  const { onChangeAgree, agreeCheck } = props
  const [userAgreeCheck, setUserAgreeCheck] = useState({
    id: 'userAgree',
    value: '내용을 이해하였으며 동의합니다.',
    status: false
  })
  // checkbox
  const handleUserAgreeCheck = (e) => {
    setUserAgreeCheck({
      ...userAgreeCheck,
      status: e.target.checked
    })
    if (onChangeAgree) {
      onChangeAgree(e.target.checked)
    }
  }
  useEffect(() => {
    setUserAgreeCheck({
      id: 'userAgree',
      value: '내용을 이해하였으며 동의합니다.',
      status: agreeCheck
    })
  }, [agreeCheck])
  return (
    <div className={'ir_doc_issue_wrap'}>
      {/*진행절차 start*/}
      <div className="ir_doc_issue_container ">
        {/*진행절차 start*/}
        <div className="ir_doc_section">
          <div className="card_header">
            <div className="ico_title">진행절차</div>
          </div>
          <div className="ir_doc_content">
            <ul className="ir_progress_list">
              <li className="step01">공동인증</li>
              <li className="step02">서류발급 &amp; 제출</li>
              <li className="step03">발급확인</li>
            </ul>
          </div>
        </div>
        {/*진행절차 end*/}
        {/*유의사항 start*/}
        <div className="ir_doc_section">
          <div className="card_header">
            <div className="ico_title">유의사항</div>
          </div>
          <div className="ir_doc_content">
            <ul className="text_list">
              <li className="text_item prefix_dot">
                국세청 홈택스에 등록된 인증서(개인사업자인 경우 순수 개인용)가 필요합니다.
              </li>
              <li className="text_item prefix_dot">지방세 납부확인서는 위택스 가입 후 발급이 가능합니다.</li>
            </ul>
          </div>
        </div>
        {/*유의사항 end*/}
        {/*발급가능 서류 start*/}
        <div className="ir_doc_section">
          <div className="card_header">
            <div className="ico_title">
              발급<span className={'highlight_blue'}>가능</span> 서류
            </div>
          </div>
          <div className="ir_doc_content">
            <ul className="text_list column_2">
              <li className="text_item prefix_dot">사업자등록증명원</li>
              <li className="text_item prefix_dot">부가세 신고내역</li>
              <li className="text_item prefix_dot">표준재무제표증명원</li>
              <li className="text_item prefix_dot">법인세 신고내역</li>
              <li className="text_item prefix_dot">납세증명서</li>
            </ul>
          </div>
        </div>
        {/*발급가능 서류 end*/}
        {/*발급불가 서류 start*/}
        <div className="ir_doc_section">
          <div className="card_header">
            <div className="ico_title">
              발급<span className={'highlight_red'}>불가</span> 서류
            </div>
          </div>
          <div className="ir_doc_content">
            <ul className="text_list">
              <li className="text_item prefix_dot">금융거래확인서(채권 은행 별)</li>
              <li className="text_item prefix_dot">가족관계증명서</li>
              <li className="text_item prefix_dot">주민등록초본 등</li>
            </ul>
          </div>
        </div>
        {/*발급불가 서류 end*/}
        {/*<PopupFooter>*/}
        {/*  <div className="btn_group">*/}
        {/*    <Button theme={colors.blue}>서류발급</Button>*/}
        {/*  </div>*/}
        {/*</PopupFooter>*/}
      </div>
      {/*진행절차 end*/}

      <div className="ir_section section01">
        <div className={'ir_doc_issue_container'}>
          <div className="ir_doc_section">
            <div className="section_title">사용자동의</div>
            <div className="ir_user_agree_content">
              <p className="text">간편서류발급&제출 사용자 동의</p>
              <div className="agree_info_box">
                <ul className="text_list">
                  <li className="text_item prefix_dot">서류 제출이 완료되어도 대출 신청이 완료되는 것은 아닙니다.</li>
                  <li className="text_item prefix_dot">가까운 영업점을 방문해 상담 받으시기 바랍니다.</li>
                </ul>
              </div>
              <Checkbox checkbox={userAgreeCheck} onChange={handleUserAgreeCheck} checked={userAgreeCheck.status} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default NiceSimpleDocIssue
