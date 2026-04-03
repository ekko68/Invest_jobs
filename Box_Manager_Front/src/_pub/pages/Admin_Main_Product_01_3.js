import Button from 'components/atomic/Button'
import ExPurchaseItem from 'components/ExPurchaseItem'
const Admin_Corporate_Management_01_3 = (props) => {
  return (
    <div className="popup_wrap popup_product">
      <div className="layer">&nbsp;</div>
      <div className="popup_container">
        <div className="popup_content scroll">
          <div className="popup_main_header">
            <div className="title">판매 중지</div>
            <Button className="popup_close_button" aria-label="팝업 닫기" onClick={() => {}} />
          </div>
          <div className="popup_title_m">상품 정보</div>

          <ExPurchaseItem />

          <div className="popup_title_m">판매 중지 사유</div>
          <textarea
            className="textarea"
            placeholder="판매 중지 사유를 입력해주세요."
            maxLength={''}
            id=""
            title="판매 중지 사유"
          />

          <div className="rounded_btn_group">
            <Button className={'basic'} onClick={() => {}}>
              취소
            </Button>
            <Button className={'full_blue'} onClick={() => {}}>
              확인
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin_Corporate_Management_01_3
