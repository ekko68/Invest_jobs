// 메시지 확인하기 팝업
import PopupHeader from 'components/popups/PopupHeader'
import PopupFooter from 'components/popups/PopupFooter'
import Button from 'components/atomic/Button'
import { colors } from 'assets/style/style.config'
import { useEffect } from 'react'
import ReactEvent from 'modules/utils/ReactEvent'

const PopupMessageCheck = (props) => {
  const { handlePopup } = props

  useEffect(() => {}, [])
  // 페이지에서 팝업 자체 핸들러 (팝업 닫기)
  const onPopup = () => {
    handlePopup && handlePopup()
  }

  const onReply = () => {
    const params = {
      type: 'send'
    }
    ReactEvent.dispatchEvent('replyMessage', params)
  }

  return (
    <div className="popup_wrap popup_message_check">
      <div className="popup_layout">&nbsp;</div>
      <div className="popup_container scroll">
        <PopupHeader title={'메시지 확인하기'} handlePopup={onPopup} />
        <div className="popup_content_inner">
          <table className="table type04">
            <caption>계정 정보 테이블</caption>
            <colgroup>
              <col width={'15%'} />
              <col width={'85%'} />
            </colgroup>
            <tbody>
              <tr>
                <th>보낸사람</th>
                <td>주식회사 일루넥스</td>
              </tr>
              <tr>
                <th>날&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;짜</th>
                <td>2021/12/23 15:23:11</td>
              </tr>
              <tr className="title">
                <th>제&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;목</th>
                <td className="limit">
                  <p>주주 명부 보내드립니다.</p>
                </td>
              </tr>
              <tr className="contents">
                <th>내&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;용</th>
                <td className="content_text">
                  <p className="scroll">이슈있으면 연락주세요 010 1111 1111 보냅니다 확인 부탁드러요</p>
                </td>
              </tr>
              <tr className="attach_file">
                <th>첨부파일</th>
                <td className="limit content">
                  <p>downloadir/일루넥스홍보자료.......</p>
                  <p>downloadir/일루넥스홍보자료.......</p>
                  <p>downloadir/일루넥스홍보자료.......</p>
                  <p>downloadir/일루넥스홍보자료.......</p>
                  <p>downloadir/일루넥스홍보자료.......</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <PopupFooter>
          <div className="btn_group">
            <Button theme={colors.lightGrey} onClick={onPopup}>
              닫기
            </Button>
            <Button theme={colors.blue} onClick={onReply}>
              답장하기
            </Button>
          </div>
        </PopupFooter>
      </div>
    </div>
  )
}

export default PopupMessageCheck
