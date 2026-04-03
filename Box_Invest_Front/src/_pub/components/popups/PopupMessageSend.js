// 메시지 보내기 , 답장하기 팝업
import PopupHeader from 'components/popups/PopupHeader'
import PopupFooter from 'components/popups/PopupFooter'
import Button from 'components/atomic/Button'
import { colors } from 'assets/style/style.config'
import MaxCount from 'components/atomic/MaxCount'

const PopupMessageSend = (props) => {
  const { handlePopup } = props

  // 페이지에서 팝업 자체 핸들러 (팝업 닫기)
  const onPopup = () => {
    handlePopup && handlePopup()
  }

  const getTitle = () => {
    const title = props.title || '메시지 보내기'
    return title
  }

  return (
    <div className="popup_wrap popup_message_send">
      <div className="popup_layout">&nbsp;</div>
      <div className="popup_container scroll">
        {/*메시지 보내기인경우*/}
        {/*<PopupHeader title={'메시지 보내기'} handlePopup={onPopup} />*/}
        {/*답장하기인 경우*/}
        <PopupHeader title={getTitle()} handlePopup={onPopup} />

        <div className="popup_content_inner">
          <div className="content_wrap">
            <div className="inner_wrap">
              <table className="table type02">
                <caption>메시지 보내기 테이블</caption>
                <colgroup>
                  <col width="8%" />
                  <col width="92%" />
                </colgroup>
                <tbody>
                  <tr>
                    <th>제목</th>
                    <td>
                      <div className="input_wrap">
                        <input type="text" className={'input'} placeholder={'제목을 입력해 주세요.'} />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>내용</th>
                    <td>
                      <div className="content_wrap">
                        <textarea placeholder="내용을 입력해 주세요." className="scroll" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="max_count_wrap">
                <MaxCount count={0} max={1000} />
              </div>
            </div>
          </div>
          <div className="attach_wrap">
            <div className="inner_wrap">
              <div className="attach_content">
                <div className="title">첨부</div>
                <div className="add_file">
                  <div className="upload_file">
                    <Button className={'linear blue'}>업로드 추가</Button>
                    <p className="file_size">[파일 :3 / 5] [용량 : 60 MB / 100 MB]</p>
                  </div>
                  <div className="file_list">
                    <div className="text">\DownloadsIR \일루넥스홍보자료.pptx</div>
                    <Button />
                  </div>
                  <div className="file_list">
                    <div className="text">\DownloadsIR \일루넥스홍보자료.pptx</div>
                    <Button />
                  </div>
                  <div className="file_list">
                    <div className="text">\DownloadsIR \일루넥스홍보자료.pptx</div>
                    <Button />
                  </div>
                  <div className="file_list">
                    <div className="text">\DownloadsIR \일루넥스홍보자료.pptx</div>
                    <Button />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <PopupFooter>
          <div className="btn_group">
            <Button theme={colors.lightGrey} onClick={onPopup}>
              취소
            </Button>
            <Button theme={colors.blue}>보내기</Button>
          </div>
        </PopupFooter>
      </div>
    </div>
  )
}

export default PopupMessageSend
