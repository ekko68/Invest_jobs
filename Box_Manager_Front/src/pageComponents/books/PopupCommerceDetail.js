import Button from 'components/atomic/Button'
import * as commonFn from 'modules/fns/commonFn'


const deliveryList = {
  GDS02001 : '화물서비스 이용',
  GDS02002 : '직접배송',
  GDS02003 : '무료배송',
  GDS02004 : '구매자 직접 수령',
}

const PopupCommerceDetail = ({ data, handlePopup }) => {
  return (
    <div className="popup_wrap popup_books">
      <div className='layer'>&nbsp;</div>
      <div className='popup_container'>
        <div className='popup_content scroll'>

          <div className='com_info'>
            <div className='img_wrap'>
              {
                data.cmpnyLogoImageUrl ? <img src={data.cmpnyLogoImageUrl} alt='회사 로고' /> :
                  <img src={require('assets/images/logo_ibk_box.png').default} alt="회사 기본 로고" />
              }
            </div>
            {
              data.insuranceCertYn === 'Y' ?
                <div className='com_name'>
                  <p>{data.bsacNm}</p>
                  <img src={require('assets/images/ico_accredit.png').default} alt="인증 아이콘" />
                </div>
                :
                <div className='com_name'>
                  <p>{data.bsacNm}</p>
                </div>
            }

          </div>

          <div className='com_card_list'>
            <div className='com_card_item'>
              <p className='title_text'>거래일</p>
              <div className='date_wrap'>
                <span className='date'>{data.rgsTn}</span>
              </div>
            </div>
            <div className='com_card_item'>
              <p className='title_text'>거래유형</p>
              <div className='date_wrap'>
                <span className='date'>
                  {data.ordnType === '001' && "매입(지급)"}
                  {data.ordnType === '002' && "매출(수금)"}
                </span>
              </div>
            </div>
            <div className='com_card_item'>
              <p className='title_text'>수금상태</p>
              <div className='date_wrap'>
                <span className='date'>수금완료</span>
              </div>
            </div>
          </div>


          <div className='product_wrap'>
            <div className='product_header'>주문 상품 정보</div>
            <ul className='product_list'>
              {data.productList.map((item ,idx) => {

                return (
                  <li className='product_item' key={idx}>
                    <div className='img_wrap'>
                      {
                        item.imgUrl ? <img src={item.imgUrl} alt='이미지' /> : <img src='' alt='기본 이미지' />
                      }

                    </div>
                    <div className='text_wrap'>
                      <div className='product_title'>{item.pdfNm}</div>
                      <div className='product_sub_text'>
                        <div className='sub_text'>
                          <span>수량 {item.qty || 0}</span>
                          <span>단가 {item.pdfPrc || 0}</span>


                          {/**** 배송이 화물서비스 이용 , 직접배송일떄는*/}
                          {/***화물서비스 = 화물업체 + 금액*/}
                          {/**직접배송 = 금액*/}
                          {/**그 외의 나머지는 금액이 나오지 않는다.*/}

                          {
                            item.ordnPtrnId &&
                            <span>
                              {deliveryList[item.dvryPtrnId]} {item.dvryPtrnId === 'GDS02001' ? `(${item.entpNm} : ${item.dvrynone}원)` : item.dvryPtrnId === 'GDS02002' ? `(${item.dvrynone}원)` : null}
                          </span>
                          }

                        </div>
                        <div className='price_text'>
                          {item.ttalAmt && commonFn.krwFormatter(item.ttalAmt)} <span className='won'>원</span>
                        </div>
                      </div>
                    </div>

                  </li>
                )
              })}

            </ul>
          </div>

          {/*장바구니일때는 배송유형 영역이 나옵니다.*/}

          {data.productList !== null && data.productList.length > 0 && data.productList[0].ordnPtrnId === 'GDS03004' &&
            <div className='total_item'>
              <div className='total_top'>
                <div className='total_text'>배송유형</div>
                <div className='total_price'>
                  <span className='won'>
                    {deliveryList[data.dvryPtrnId]}
                    {/*{data.dvryPtrnId === 'GDS02001' && `${data.productList[0].entpNm} : (${data.productList[0].dvrynone}원)`}*/}
                    {data.dvryPtrnId === 'GDS02001' ? `(${data.productList[0].entpNm} : ${data.productList[0].dvrynone}원)` : data.dvryPtrnId === 'GDS02002' ? `(${data.productList[0].dvrynone}원)` : null}

                  </span>
                </div>
              </div>
            </div>
          }



          <div className='total_item'>
            <div className='total_top'>
              <div className='total_text'>총 거래액</div>
              <div className='total_price'>{commonFn.krwFormatter(data.totalPrc)} <span className='won'>원</span></div>
            </div>

            <div className='total_box'>
              <div className='total_line'>
                <div className='total_text'>상품금액</div>
                <div className='total_price'>
                  {data.pdfTtalPrc ? commonFn.krwFormatter(data.pdfTtalPrc): 0}
                  <span className='won'>원</span></div>
              </div>
              <div className='total_line'>
                <div className='total_text'>배송금액</div>
                <div className='total_price'>
                  {data.dvryTtalPrc ? commonFn.krwFormatter(data.dvryTtalPrc): 0}
                  <span className='won'>원</span></div>
              </div>
            </div>

          </div>


          {/** 홍보관에서는 결제방법 X*/}
          {/*<div className='total_item'>*/}
          {/*  <div className='total_top'>*/}
          {/*    <div className='total_text'>결제방법</div>*/}
          {/*    <div className='total_price'><span className='won'>신한 4400-****-****-**** {data.ordnType}</span><span className='type'>일시불</span></div>*/}
          {/*  </div>*/}
          {/*</div>*/}


          <div className='popup_confirm'>
            <Button className={'full_blue'} onClick={handlePopup}>
              확인
            </Button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default PopupCommerceDetail