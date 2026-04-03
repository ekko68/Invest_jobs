import { useEffect, useState } from 'react'

import Button from 'components/atomic/Button'
import moment from 'moment'
import { dateCalculation } from 'modules/utils/DateUtil'
import * as commonFn from 'modules/fns/commonFn'

const PopupBooksDetail = ({ data, handlePopup }) => {

  const txtnPtrnCd = data.booksItemList[0].txtnPtrnCd;

  let taxType;
  switch (txtnPtrnCd) {
    case 'TXN00001':
      taxType = '과세';
      break;
    case 'TXN00002':
      taxType = '면세';
      break;
    case 'TXN00003':
      taxType = '영세';
      break;
    case 'TXN00004':
      taxType = '혼합';
      break;
    default:
      taxType = '알 수 없음';
  }

  const varTaxfree = 'txexAmt'

  const [taxPriceData, setTaxPriceData] = useState({
    saleAmt : 0, //판매가
    sppcAmt : 0, //공급가
    taxAmt : 0, //세액
    [varTaxfree] : 0, //면세금액
    rtgdAmt : 0 //반품금액
  });

  useEffect(() => {
    let sumTotal = {
      saleAmt : 0, //판매가
      sppcAmt : 0, //공급가
      taxAmt : 0, //세액
      [varTaxfree] : 0, //면세금액
      rtgdAmt : 0 //반품금액
    };
    data?.booksItemList.map((item,idx)=>{
      sumTotal.saleAmt+=Number(item.saleAmt);
      sumTotal.sppcAmt+=Number(item.sppcAmt);
      sumTotal.taxAmt+=Number(item.taxAmt);
      sumTotal[varTaxfree]+=Number(item[varTaxfree]);
      sumTotal.rtgdAmt+=Number(item.rtgdAmt);
    })
    setTaxPriceData(sumTotal);

  }, [data]);


  //할인금액 계산
  const calcDiscountAmt = () => {
    if(data?.books?.dscnPtrnCd === 'DSC00002'){ //할인율
      // 할인율 적용일 경우 반품금액을 제외한 총 합계에서 할인율 적용함
      let exceptReturnSaleSum = 0;
      data?.booksItemList?.map((item) => {
        exceptReturnSaleSum += Number(item.saleAmt) - Number(item.rtgdAmt)
      })

      return parseInt(exceptReturnSaleSum * data?.books.dscnAmt/100) > 0 ? `-${commonFn.krwFormatter(parseInt(exceptReturnSaleSum * data?.books.dscnAmt/100))}` : 0

    } else { //할인금액
      return Number(data?.books.dscnAmt) > 0 ? `-${commonFn.krwFormatter(data?.books.dscnAmt)}` : 0;
    }
  }


  return (
    <div className="popup_wrap popup_books">
      <div className='layer'>&nbsp;</div>
      <div className='popup_container'>
        <div className='popup_content scroll'>

          {/*일단 N으로 해놓음
            날짜가 어떻게 오는것일까 확인완료일 ?
          */}
          {data.books.athzYn === 'Y' ? <div className='top_banner'>
            <div className='ico_text'>
              <img src={require('assets/images/ico_alarm.png').default} alt="종 아이콘" />
              <p>구매확인</p>
            </div>
            <div className='date_text'>확인완료일 {moment(data.books.athzDt).format('YYYY-MM-DD')}</div>
          </div> : null}


          <div className='com_info'>
            <div className='img_wrap'>
              {
                data.books.lgtyFileId ? <img src={data.books.lgtyFileId} alt='회사 로고' /> :
                  <img src={require('assets/images/img_default_company.png').default} alt="회사 기본 로고" />
              }
            </div>
            <div className='com_name'>
              <p>{data.books.bsacNm}</p>
              {
                data.bizAcquaintance.certYn === 'Y' ?
                  <img src={require('assets/images/ico_accredit.png').default} alt="인증 아이콘" />
                  : null
              }
            </div>
          </div>
          
          <div className='com_card_list'>
            <div className='com_card_item'>
              <p className='title_text'>판매(예정)일</p>
              <div className='date_wrap'>
                <span className='date'>{moment(data.books.saleScdlDt).format('YYYY-MM-DD')}</span>
              </div>
            </div>
            <div className='com_card_item'>
              <p className='title_text'>수금(예정)일</p>
              <div className='date_wrap'>
                {dateCalculation(data.books.pamtScdlDt).type === 'plus' ?
                  <span className='dday'>{dateCalculation(data.books.pamtScdlDt).value}일 경과</span> : null
                }
                <span className='date'>{moment(data.books.pamtScdlDt).format('YYYY-MM-DD')}</span>
              </div>
            </div>
            <div className='com_card_item'>
              <p className='title_text'>거래유형</p>
              <div className='date_wrap'>
                <span className='date'>
                  {data.books.buslPtrnCd === 'BSL00001' ? '매입(지급)' : '매출(수금)'}
                </span>
              </div>
            </div>
            <div className='com_card_item'>
              <p className='title_text'>수금상태</p>
              <div className='date_wrap'>
                <span className='date'>
                  {data.books.clomSttsCd === 'COL00001' ? '미수금(지급)' : '수금(지급)완료'}
                </span>
              </div>
            </div>
          </div>


          <div className='header_title_wrap'>
            <div className='header_title_text'>거래내역</div>
          </div>


          <ul className='card_list_wrap'>
            {
              data?.booksItemList.map((item,idx) => {
                return (
                  <li className='card_item' key={idx}>
                    <div className='card_info'>
                      <div className='card_price'>
                        {item.saleAmt ? commonFn.krwFormatter(item.saleAmt) : 0} <span className='won'>원</span>
                      </div>
                      <div className='card_text_wrap'>
                        <div className='card_text'>
                          <span>{taxType}</span>
                          <span>공급가액 {item.sppcAmt ? commonFn.krwFormatter(item.sppcAmt) : 0}원</span>
                          <span>부가세 {item.taxAmt ? commonFn.krwFormatter(item.taxAmt) : 0}원</span>
                        </div>
                        {
                          item.rtgdAmt &&
                          <div className='card_text red'>
                            <span>반품금액 {item.rtgdAmt ? commonFn.krwFormatter(item.rtgdAmt) : 0}원</span>
                            {
                              item.rtgdMemo && <span>{item.rtgdMemo}</span>
                            }
                          </div>
                        }
                      </div>
                    </div>

                    <div className='card_info'>
                      <div className='card_text black'>
                        <span>품목명 {item.lsarNm || '-'}</span>
                        <span>단가 {item.upcAmt ? commonFn.krwFormatter(item.upcAmt) : 0}원</span>
                        <span>수량 {item.qty || '0'}개</span>
                      </div>
                    </div>
                  </li>
                )
              })
            }
          </ul>
          
          <div className='total_item'>
            <div className='total_top'>
              <div className='total_text'>총 거래액</div>
              <div className='total_price'>{commonFn.krwFormatter(data.books.lastTrnAmt) || 0} <span className='won'>원</span></div>
            </div>
            <div className='total_box'>
              <div className='total_line'>
                <div className='total_text'>공급가액</div>
                <div className='total_price'>{commonFn.krwFormatter(taxPriceData.sppcAmt)} <span className='won'>원</span></div>
              </div>
              <div className='total_line'>
                <div className='total_text'>부가세</div>
                <div className='total_price'>{commonFn.krwFormatter(taxPriceData.taxAmt)} <span className='won'>원</span></div>
              </div>
              <div className='total_line'>
                <div className='total_text'>면세금액</div>
                <div className='total_price'>{commonFn.krwFormatter(taxPriceData[varTaxfree])} <span className='won'>원</span></div>
              </div>
              <div className='total_line'>
                <div className='total_text'>할인금액</div>
                    <div className="total_price">{calcDiscountAmt()}<span className='won'>원</span></div>
              </div>


              <div className='total_line'>
                <div className='total_text'>반품금액</div>
                <div className='total_price'>{taxPriceData.rtgdAmt && '-'  + commonFn.krwFormatter(Math.abs(taxPriceData.rtgdAmt)) || '0'} <span className='won'>원</span></div>
              </div>
            </div>
            
          </div>

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

export default PopupBooksDetail