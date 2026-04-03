import Button from 'components/atomic/Button'

const Admin_Corporate_Management_01_2 = (props) => {
  return (
    <div className="popup_wrap popup_corporate">
      <div className="layer">&nbsp;</div>
      <div className="popup_container">
        <div className="popup_content scroll">
          <div className="popup_main_header">
            <div className="title">판매사 권한 박탈</div>
            <Button className="popup_close_button" aria-label="팝업 닫기" onClick={() => {}} />
          </div>

          <div className="enterpriseItem">
            <div className="enterpriseItem_name">
              <div className="enterpriseItem_name_text">픽셀로픽셀로</div>
              <div className="enterpriseItem_certify ico" title="인증기관" />
              <div className="enterpriseItem_client ico" title="거래처" />
              <div className="enterpriseItem_ceo ico" title="최고 경영자" />
              <div className="enterpriseItem_future ico" title="미래 경영자" />
              <div className="enterpriseItem_female ico" title="여성 경영자" />
              <div className="enterpriseItem_fame ico" title="명예의 전당" />
            </div>
            <div className="enterpriseItem_detail">
              <div className="enterpriseItem_old">설립 14년차</div>
              <div className="enterpriseItem_scale">중소기업 2013</div>
              <div className="enterpriseItem_type">수출입</div>
              <div className="enterpriseItem_old">설립 14년차</div>
              <div className="enterpriseItem_scale">중소기업 2013</div>
              <div className="enterpriseItem_type">수출입 100만불</div>
            </div>

            <div className="enterpriseItem_more">기업 홍보관 바로가기</div>
          </div>
          <div className="popup_title_m">박탈 사유</div>
          <textarea
            className="textarea"
            placeholder="박탈 사유를 입력해주세요."
            maxLength={''}
            id=""
            title="박탈 사유"
          />

          <div className="rounded_btn_group">
            <Button className={'basic'} onClick={() => {}}>
              닫기
            </Button>
            <Button className={'full_blue'} onClick={() => {}}>
              판매 권한 박탈
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin_Corporate_Management_01_2
