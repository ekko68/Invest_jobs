// 장부명세서 상세
import React, { useEffect, useState } from 'react'
import moment from 'moment'

//modules
import * as commonFn from 'modules/fns/commonFn'
import * as Finance from 'assets/images/svg/Finance';

//const
/* 단위 */
const unitCodeList = {
  UNT00000: {code: "UNT00000", name: "전체"},
  UNT00001: {code: "UNT00001", name: "개"},
  UNT00002: {code: "UNT00002", name: "kg"},
  UNT00003: {code: "UNT00003", name: "t"},
  UNT00004: {code: "UNT00004", name: "box"},
  UNT00005: {code: "UNT00005", name: "직접입력"},
}

/* 과세유형 */
const taxType = {
  TXN00001: {code: "TXN00001", name: "과세"},
  TXN00002: {code: "TXN00002", name: "면세"},
  TXN00004: {code: "TXN00004", name: "혼합"},
}

/* 어음상태 */
const ebillStatus = {
  ELB00001: {code: "ELB00001", name: "결제받을어음", className: "bill_blue"},
  ELB00002: {code: "ELB00002", name: "부도어음", className: "bill_red"},
  ELB00003: {code: "ELB00003", name: "결제받은어음", className: "bill_grey"}
}

/* 채권구분 */
const ebondsType = {
  EBO00001: {code: "EBO00001", name: "전자채권"},
  EBO00002: {code: "EBO00002", name: "외상매출채권"}
}

/* 채권상태 */
const ebondsStatus = {
  EBO01001: {code: "EBO01001", name: "활동채권", className: "bonds_blue"},
  EBO01002: {code: "EBO01002", name: "완제채권", className: "bonds_grey"}
}

/* 카드승인/취소 */
const cardStatus = {
  CRC01001: {code: "CRC01001", name: "승인"},
  CRC01002: {code: "CRC01002", name: "취소"}
}

/* 현금영수증 발행구분 */
const issueType = {
  CSH00001: {code: "CSH00001", name: "사업자"},
  CSH00002: {code: "CSH00002", name: "국세청"},
  CSH00003: {code: "CSH00003", name: "명세서"}
}

/* 현금영수증 거래구분 */
const transType = {
  CSH01001: {code: "CSH01001", name: "승인거래"},
  CSH01002: {code: "CSH01002", name: "취소거래"}
}

/* 은행목록*/
const bankList = {
  BANK001: {code: "001", name: "한국은행", briefNm: "한국", symbol: ""},
  BANK002: {code: "002", name: "산업은행", briefNm: "산업", symbol: Finance.NewKdbBank},
  BANK003: {code: "003", name: "기업은행", briefNm: "기업",  symbol: Finance.NewIbkBank},
  BANK004: {code: "004", name: "국민은행", briefNm: "국민", symbol: Finance.NewKbBank},
  BANK005: {code: "005", name: "외환은행", briefNm: "외환", symbol: Finance.NewHanaBank},
  BANK007: {code: "007", name: "수협은행", briefNm: "수협", symbol: Finance.NewShBank},
  BANK008: {code: "008", name: "수출입은행", briefNm: "수출입", symbol: ""},
  BANK011: {code: "011", name: "NH농협은행", briefNm: "NH농협", symbol: Finance.NewNhBank},
  BANK012: {code: "012", name: "지역농·축협", briefNm: "농·축협", symbol: Finance.NewNhBank},
  BANK020: {code: "020", name: "우리은행", briefNm: "우리", symbol: Finance.NewWooriBank},
  BANK023: {code: "023", name: "SC제일은행", briefNm: "SC제일", symbol: Finance.NewScBank},
  BANK027: {code: "027", name: "한국씨티은행", briefNm: "한국씨티", symbol: Finance.NewCitiBank},
  BANK031: {code: "031", name: "대구은행", briefNm: "대구", symbol: Finance.NewDgbBank},
  BANK032: {code: "032", name: "부산은행", briefNm: "부산", symbol: Finance.NewBusanBank},
  BANK034: {code: "034", name: "광주은행", briefNm: "광주", symbol: Finance.NewKjbBank},
  BANK035: {code: "035", name: "제주은행", briefNm: "제주", symbol: Finance.NewJejuBank},
  BANK037: {code: "037", name: "전북은행", briefNm: "전북", symbol: Finance.NewJbBank},
  BANK039: {code: "039", name: "경남은행", briefNm: "경남", symbol: Finance.NewGyeongnamBank},
  BANK045: {code: "045", name: "새마을금고", briefNm: "새마을", symbol: Finance.NewMgBank},
  BANK048: {code: "048", name: "신협은행", briefNm: "신협", symbol: Finance.NewShinhyupBank},
  BANK050: {code: "050", name: "저축은행", briefNm: "저축", symbol: ""},
  BANK051: {code: "051", name: "기타외국계은행", briefNm: "기타외국계", symbol: ""},
  BANK052: {code: "052", name: "모건스탠리은행", briefNm: "모건스탠리", symbol: ""},
  BANK054: {code: "054", name: "HSBC은행", briefNm: "HSBC", symbol: ""},
  BANK055: {code: "055", name: "도이치은행", briefNm: "도이치", symbol: ""},
  BANK056: {code: "056", name: "알비에스은행", briefNm: "알비에스", symbol: ""},
  BANK057: {code: "057", name: "제이피모간체이스은행", briefNm: "제이피모간체이스", symbol: ""},
  BANK058: {code: "058", name: "미즈호은행", briefNm: "미즈호", symbol: ""},
  BANK059: {code: "059", name: "엠유에프지은행", briefNm: "엠유에프지", symbol: ""},
  BANK060: {code: "060", name: "BOA은행", briefNm: "BOA", symbol: ""},
  BANK064: {code: "064", name: "산림조합중앙회", briefNm: "산림조합중앙", symbol: ""},
  BANK071: {code: "071", name: "우체국은행", briefNm: "우체국", symbol: Finance.NewPostBank},
  BANK076: {code: "076", name: "신용보증기금", briefNm: "신용보증기금", symbol: ""},
  BANK077: {code: "077", name: "기술보증기금", briefNm: "기술보증기금", symbol: ""},
  BANK081: {code: "081", name: "KEB하나은행", briefNm: "KEB하나", symbol: Finance.NewHanaBank},
  BANK088: {code: "088", name: "신한은행", briefNm: "신한", symbol: Finance.NewShinhanBank},
  BANK089: {code: "089", name: "케이뱅크", briefNm: "케이", symbol: Finance.NewKBank},
  BANK090: {code: "090", name: "카카오뱅크", briefNm: "카카오", symbol: Finance.NewKakaoBank}
}

const getClientCommonCodeInfo = (findCode) => {
  const codeList = bankList;
  let getInfo = codeList[`BANK${findCode}`];
  return getInfo
}

const BooksDetail = (props) => {

  const { clctDetail } = props

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
    clctDetail?.booksItemList.map((item,idx)=>{
      sumTotal.saleAmt+=Number(item.saleAmt);
      sumTotal.sppcAmt+=Number(item.sppcAmt);
      sumTotal.taxAmt+=Number(item.taxAmt);
      sumTotal[varTaxfree]+=Number(item[varTaxfree]);
      sumTotal.rtgdAmt+=Number(item.rtgdAmt);
    })
    setTaxPriceData(sumTotal);

  }, [clctDetail]);


  //할인금액 계산
  const calcDiscountAmt = () => {
    if(clctDetail?.books?.dscnPtrnCd === 'DSC00002'){ //할인율
      // 할인율 적용일 경우 반품금액을 제외한 총 합계에서 할인율 적용함
      let exceptReturnSaleSum = 0;
      clctDetail?.booksItemList?.map((item) => {
        exceptReturnSaleSum += Number(item.saleAmt) - Number(item.rtgdAmt)
      })

      return parseInt(exceptReturnSaleSum * clctDetail?.books.dscnAmt/100) > 0 ? `-${commonFn.krwFormatter(parseInt(exceptReturnSaleSum * clctDetail?.books.dscnAmt/100))}` : 0

    } else { //할인금액
      return Number(clctDetail?.books.dscnAmt) > 0 ? `-${commonFn.krwFormatter(clctDetail?.books.dscnAmt)}` : 0;
    }
  }


  return (
      <>
        <div className='collection_view_section'>
          <div className='view_title'>거래정보</div>
          <div className="section">
            <table className="table">
              <caption>거래정보 테이블</caption>
              <colgroup>
                <col width="15%" />
                <col width="35%" />
                <col width="15%" />
                <col width="35%" />
              </colgroup>
              <tbody>
              <tr>
                <th>거래처명</th>
                <td>{clctDetail?.bizAcquaintance?.bsacNm || "-"}</td>
                <th>대표자명</th>
                <td>{clctDetail?.bizAcquaintance?.rpprNm || "-"}</td>
              </tr>
              <tr>
                <th>사업자번호</th>
                <td colSpan={3}>{clctDetail?.bizAcquaintance?.bzn && clctDetail?.bizAcquaintance?.bzn.trim() !== '' ? commonFn.formatBusinessNumber(clctDetail?.bizAcquaintance?.bzn) : '-'}</td>
              </tr>
              <tr>
                <th>판매(예정)일</th>
                <td>{moment(clctDetail?.books?.saleScdlDt).format('YYYY-MM-DD') || '-'}</td>
                <th>수금(예정)일</th>
                <td>{moment(clctDetail?.books?.pamtScdlDt).format('YYYY-MM-DD') || '-'}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className='collection_view_section history'>
          <div className='view_title'>거래내역</div>

          <ul className='card_list_wrap'>
            {
              clctDetail?.booksItemList?.map((item, idx) => {
                return (
                    <li className='card_item' key={idx}>
                      <div className='card_info'>
                        <div className='card_price'>
                          {commonFn.krwFormatter(item?.saleAmt) || 0} <span className='won'>원</span>
                        </div>
                        <div className='card_text_wrap'>
                          <div className='card_text'>
                            <span>{taxType[item?.txtnPtrnCd]?.name || '-'}</span>
                            <span>공급가액 {commonFn.krwFormatter(item?.sppcAmt) || 0}원</span>
                            <span>부가세 {commonFn.krwFormatter(item?.taxAmt) || 0}원</span>
                          </div>
                          {
                            item?.rtgdAmt !== null &&
                            <div className='card_text red'>
                              <span>반품금액 {commonFn.krwFormatter(item?.rtgdAmt) || 0}원</span>
                              {
                                item?.rtgdMemo && <span>{item?.rtgdMemo}</span>
                              }
                            </div>
                          }
                        </div>
                      </div>

                      <div className='card_info'>
                        <div className='card_text black'>
                          <span>품목명 {item?.lsarNm || '-'}</span>
                          <span>단가 {commonFn.krwFormatter(item?.upcAmt) || 0}원</span>
                          <span>수량&nbsp;
                            {item?.qty || 0}
                            {
                              unitCodeList[item?.qtyUtCd]?.name
                            }
                            {
                              item?.qtyUtCd === 'UNT00005' && item?.hninUtNm
                            }
                          </span>
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
              <div className='total_price'>{commonFn.krwFormatter(clctDetail?.books?.lastTrnAmt) || 0} <span className='won'>원</span></div>
            </div>

            <div className='total_box'>
              <div className='total_line'>
                <div className='total_text'>공급가액</div>
                <div className='total_price'>{commonFn.krwFormatter(taxPriceData?.sppcAmt) || 0} <span className='won'>원</span></div>
              </div>
              <div className='total_line'>
                <div className='total_text'>부가세</div>
                <div className='total_price'>{commonFn.krwFormatter(taxPriceData?.taxAmt) || 0} <span className='won'>원</span></div>
              </div>
              <div className='total_line'>
                <div className='total_text'>면세금액</div>
                <div className='total_price'>{commonFn.krwFormatter(taxPriceData[varTaxfree]) || 0} <span className='won'>원</span></div>
              </div>
              <div className='total_line'>
                <div className='total_text'>할인금액</div>
                <div className='total_price'>{calcDiscountAmt() || 0} <span className='won'>원</span></div>
              </div>
              <div className='total_line'>
                <div className='total_text'>반품금액</div>
                <div className='total_price'>{taxPriceData?.rtgdAmt && '-'  + commonFn.krwFormatter(Math.abs(taxPriceData?.rtgdAmt)) || 0} <span className='won'>원</span></div>
              </div>
            </div>

          </div>
        </div>

        <div className='collection_view_section memo'>
          <div className="section section01">
            <table className="table">
              <caption>메모 테이블</caption>
              <colgroup>
                <col width="15%" />
                <col width="85%" />
              </colgroup>
              <tbody>
              <tr>
                <th>메모</th>
                <td>{clctDetail?.books?.hninMemo || '-'}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>


        <div className="linked_section">
          <div className='connect_title'>
            <img src={require('assets/images/ico_link.png').default} alt="연결 아이콘" />
            수금연결
          </div>

          {/** 계좌내역 start **/}
          <div className='collection_view_section green'>
            <div className='view_title'>계좌내역 <span>({clctDetail?.transactionList?.length})</span></div>

            <div className="section_wrap">
              {
                clctDetail?.transactionList?.map((item, idx) => {
                  return (
                      <div className="section" key={idx}>
                        <table className="table">
                          <caption>계좌내역 테이블</caption>
                          <colgroup>
                            <col width="15%" />
                            <col width="35%" />
                            <col width="15%" />
                            <col width="35%" />
                          </colgroup>
                          <tbody>
                          <tr>
                            <th colSpan={4}>
                              <div className='numberling'>
                                <div className='num'>No.{idx+1}</div>
                              </div>
                            </th>
                          </tr>
                          <tr>
                            <th>일시</th>
                            <td>{moment(item?.trnTs).format('YYYY-MM-DD HH:mm:ss') || '-'}</td>
                            <th>거래자명</th>
                            <td>{item?.trnrNm || '-'}</td>
                          </tr>
                          <tr>
                            <th>은행</th>
                            <td>{item?.gearBankNm || '-'}</td>
                            <th>계좌번호</th>
                            <td>{item?.acntNo || '-'}</td>
                          </tr>
                          <tr>
                            <th>거래액(원)</th>
                            <td colSpan={3}>
                              <div className='price'>
                                {commonFn.krwFormatter(item?.mnrcAmt) || 0}
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <th>메모</th>
                            <td colSpan={3}>{item?.hninMemo || '-'}</td>
                          </tr>
                          </tbody>
                        </table>
                      </div>
                  )
                })
              }
            </div>
          </div>
          {/** 계좌내역 end **/}
          
          {/** 세금계산서 start **/}
          <div className='collection_view_section pink'>
            <div className='view_title'>세금계산서 <span>({clctDetail?.taxbillList?.length})</span></div>

            <div className="section_wrap">
              {
                clctDetail?.taxbillList?.map((item, idx) => {
                  return (
                      <div className="section" key={idx}>
                        <table className="table">
                          <caption>세금계산서 테이블</caption>
                          <colgroup>
                            <col width="15%" />
                            <col width="35%" />
                            <col width="15%" />
                            <col width="35%" />
                          </colgroup>
                          <tbody>
                          <tr>
                            <th colSpan={4}>
                              <div className='numberling'>
                                <div className='num'>No.{idx+1}</div>
                              </div>
                            </th>
                          </tr>
                          <tr>
                            <th>승인번호</th>
                            <td colSpan={3}>{item?.taxbill?.hmtxAthzNo || '-'}</td>
                          </tr>
                          <tr>
                            <th>공급받는자</th>
                            <td>{item?.taxbillReceiver?.splRcvrNm || '-'}</td>
                            <th>거래액(원)</th>
                            <td colSpan={3}>
                              <div className='price'>
                                {commonFn.krwFormatter(item?.taxbill?.sumTtalAmt) || 0}
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <th>이메일</th>
                            <td colSpan={3}>
                              <div className='email_wrap'>
                                <span>{item?.taxbillReceiver?.prcpRsprEml || '-'}</span>
                                {
                                  item?.taxbillReceiver?.asstRsprEml && <span>{item?.taxbillReceiver?.asstRsprEml}</span>
                                }
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <th>메모</th>
                            <td colSpan={3}>{item?.taxbill?.hninMemo || '-'}</td>
                          </tr>
                          </tbody>
                        </table>

                        <div className="inner_section_wrap">


                          {/*transactionList*/}
                          {/** 세금계산서 > 계좌내역 start **/}

                              {
                                item?.transactionList?.map((item, idx) => {
                                  return (
                                    <div className="inner_section" key={idx}>
                                      <div className='collection_view_section grey'>
                                        <div className="section" >
                                          <table className="table">
                                            <caption>계좌내역 테이블</caption>
                                            <colgroup>
                                              <col width="15%" />
                                              <col width="35%" />
                                              <col width="15%" />
                                              <col width="35%" />
                                            </colgroup>
                                            <tbody>
                                            <tr>
                                              <th colSpan={4}>
                                                <div className='numberling'>
                                                  <div className='num'>계좌내역</div>
                                                </div>
                                              </th>
                                            </tr>
                                            <tr>
                                              <th>일시</th>
                                              <td>{moment(item?.trnTs).format('YYYY-MM-DD HH:mm:ss') || '-'}</td>
                                              <th>거래자명</th>
                                              <td>{item?.trnrNm || '-'}</td>
                                            </tr>
                                            <tr>
                                              <th>은행</th>
                                              <td>{item?.gearBankNm || '-'}</td>
                                              <th>계좌번호</th>
                                              <td>{item?.acntNo || '-'}</td>
                                            </tr>
                                            <tr>
                                              <th>거래액(원)</th>
                                              <td colSpan={3}>
                                                <div className='price'>
                                                  {commonFn.krwFormatter(item?.mnrcAmt) || 0}
                                                </div>
                                              </td>
                                            </tr>
                                            <tr>
                                              <th>메모</th>
                                              <td colSpan={3}>{item?.hninMemo || '-'}</td>
                                            </tr>
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                })
                              }

                          {/** 세금계산서 > 계좌내역 end **/}

                          {/*noteList*/}
                          {/** 세금계산서 > 어음 start **/}

                              {
                                item?.noteList.map((item, idx) => {
                                  return (
                                      <div className="inner_section" key={idx}>
                                        <div className='collection_view_section grey'>
                                          <div className="section" >
                                            <table className="table">
                                              <caption>어음번호 테이블</caption>
                                              <colgroup>
                                                <col width="15%" />
                                                <col width="35%" />
                                                <col width="15%" />
                                                <col width="35%" />
                                              </colgroup>
                                              <tbody>
                                              <tr>
                                                <th colSpan={4}>
                                                  <div className='numberling'>
                                                    <div className='num'>어음번호</div>
                                                    <span>{item?.elbNo || '-'}</span>
                                                  </div>
                                                </th>
                                              </tr>
                                              <tr>
                                                <th>발행업체명</th>
                                                <td>{item?.issBsnnNm || '-'}</td>
                                                <th>배서업체명</th>
                                                <td>{item?.edsrBsnnNm || '-'}</td>
                                              </tr>
                                              <tr>
                                                <th>거래액(원)</th>
                                                <td colSpan={3}>
                                                  <div className='price'>
                                                    {commonFn.krwFormatter(item?.elbAmt) || 0}
                                                  </div>
                                                </td>
                                              </tr>
                                              <tr>
                                                <th>어음상태</th>
                                                <td colSpan={3} className={ebillStatus[item?.elbSttsCd]?.className}>
                                                  {ebillStatus[item?.elbSttsCd]?.name || '-'}
                                                </td>
                                              </tr>
                                              <tr>
                                                <th>계좌연결</th>
                                                <td colSpan={3}>
                                                  {item?.linkedTrx ? (
                                                  <div className='connect_wrap'>
                                                    <div className='connect_info'>
                                                      <div className='img_wrap'>
                                                        {commonFn.stringHasLength(getClientCommonCodeInfo(item?.linkedTrx?.gearBankCd)?.symbol) && getClientCommonCodeInfo(item?.linkedTrx?.gearBankCd)?.symbol()}
                                                      </div>
                                                      <div className='bank_info'>
                                                        <div className='text'>{item?.linkedTrx?.acntNo || '-'}</div>
                                                        <div className='bank_name'>
                                                          {getClientCommonCodeInfo(item?.linkedTrx?.gearBankCd)?.briefNm || '-'}
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className='connect_price'>
                                                      {commonFn.krwFormatter(item?.linkedTrx?.mnrcAmt) || 0} <span>원</span>
                                                    </div>
                                                  </div>
                                                  ) : (
                                                      <span className="none">-</span>
                                                  )}
                                                </td>
                                              </tr>
                                              <tr>
                                                <th>메모</th>
                                                <td colSpan={3}>{item?.hninMemo || '-'}</td>
                                              </tr>
                                              </tbody>
                                            </table>
                                          </div>
                                        </div>
                                      </div>
                                  )
                                })
                              }

                          {/** 세금계산서 > 어음 end **/}

                          {/*bondList*/}
                          {/** 세금계산서 > 채권 start **/}
                              {
                                item?.bondList.map((item ,idx) =>{
                                  return (
                                      <div className="inner_section" key={idx}>
                                        <div className='collection_view_section grey'>
                                          <div className="section" >
                                            <table className="table">
                                              <caption>채권번호 테이블</caption>
                                              <colgroup>
                                                <col width="15%" />
                                                <col width="35%" />
                                                <col width="15%" />
                                                <col width="35%" />
                                              </colgroup>
                                              <tbody>
                                              <tr>
                                                <th colSpan={4}>
                                                  <div className='numberling'>
                                                    <div className='num'>채권번호</div>
                                                    <span>{item?.elboNo || '-'}</span>
                                                  </div>
                                                </th>
                                              </tr>
                                              <tr>
                                                <th>구매업체명</th>
                                                <td>{item?.elboBuyEnprNm || '-'}</td>
                                                <th>구분</th>
                                                <td>{ebondsType[item?.elboPtrnCd]?.name || '-'}</td>
                                              </tr>
                                              <tr>
                                                <th>거래액(원)</th>
                                                <td colSpan={3}>
                                                  <div className='price'>
                                                    {commonFn.krwFormatter(item?.elboAmt) || 0}
                                                  </div>
                                                </td>
                                              </tr>
                                              <tr>
                                                <th>채권상태</th>
                                                <td colSpan={3} className={ebondsStatus[item?.elboSttsCd]?.className}>
                                                  {ebondsStatus[item?.elboSttsCd]?.name || '-'}
                                                </td>
                                              </tr>
                                              <tr>
                                                <th>계좌연결</th>
                                                <td colSpan={3}>
                                                  {item?.linkedTrx ? (
                                                  <div className='connect_wrap'>
                                                    <div className='connect_info'>
                                                      <div className='img_wrap'>
                                                        {commonFn.stringHasLength(getClientCommonCodeInfo(item?.linkedTrx?.gearBankCd)?.symbol) && getClientCommonCodeInfo(item?.linkedTrx?.gearBankCd)?.symbol()}
                                                      </div>
                                                      <div className='bank_info'>
                                                        <div className='text'>{item.linkedTrx.acntNo || '-'}</div>
                                                        <div className='bank_name'>
                                                          {getClientCommonCodeInfo(item?.linkedTrx?.gearBankCd)?.briefNm || '-'}
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className='connect_price'>
                                                      {commonFn.krwFormatter(item?.linkedTrx?.mnrcAmt) || 0} <span>원</span>
                                                    </div>
                                                  </div>
                                                  ) : (
                                                      <span className="none">-</span>
                                                  )}
                                                </td>
                                              </tr>
                                              <tr>
                                                <th>메모</th>
                                                <td colSpan={3}>{item?.hninMemo || '-'}</td>
                                              </tr>
                                              </tbody>
                                            </table>
                                          </div>
                                        </div>
                                      </div>
                                  )
                                })
                              }
                          {/** 세금계산서 > 채권 end **/}

                          {/*etcSalesList*/}
                          {/** 세금계산서 > 기타매출 start **/}
                          {
                            item?.etcSalesList?.map((item, idx) => {
                              return (
                                <div className="inner_section" key={idx}>
                                  <div className='collection_view_section grey'>
                                    <div className="section">
                                      <table className="table">
                                        <caption>기타매출 테이블</caption>
                                        <colgroup>
                                          <col width="15%" />
                                          <col width="35%" />
                                          <col width="15%" />
                                          <col width="35%" />
                                        </colgroup>
                                        <tbody>
                                        <tr>
                                          <th colSpan={4}>
                                            <div className='numberling'>
                                              <div className='num'>기타매출</div>
                                            </div>
                                          </th>
                                        </tr>
                                        <tr>
                                          <th>거래일</th>
                                          <td>{moment(item?.trnDt).format("YYYY-MM-DD") || '-'}</td>
                                          <th>거래액(원)</th>
                                          <td>
                                            <div className='price'>
                                              {commonFn.krwFormatter(item?.trnAmt) || 0}
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <th>메모</th>
                                          <td colSpan={3}>{item?.hninMemo || '-'}</td>
                                        </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              )
                            })
                          }

                          {/** 세금계산서 > 기타매출 end **/}
                        </div>
                      </div>
                  )
                })
              }
            </div>
          </div>
          {/** 세금계산서 end **/}

          {/** 카드매출 start **/}
          <div className='collection_view_section sky'>
            <div className='view_title'>카드매출 <span>({clctDetail?.cardSalesList?.length})</span></div>

            <div className="section_wrap">
              {
                clctDetail?.cardSalesList?.map((item, idx) => {
                  return (
                      <div className="section" key={idx}>
                        <table className="table">
                          <caption>카드매출 테이블</caption>
                          <colgroup>
                            <col width="15%" />
                            <col width="35%" />
                            <col width="15%" />
                            <col width="35%" />
                          </colgroup>
                          <tbody>
                          <tr>
                            <th colSpan={4}>
                              <div className='numberling'>
                                <div className='num'>No.{idx+1}</div>
                              </div>
                            </th>
                          </tr>
                          <tr>
                            <th>일시</th>
                            <td>{moment(item?.trnTs).format('YYYY-MM-DD HH:mm:ss') || '-'}</td>
                            <th>구분</th>
                            <td>{cardStatus[item?.athzCnclDsncCd]?.name || '-'}</td>
                          </tr>
                          <tr>
                            <th>카드사</th>
                            <td>{item?.crcoNm?.replace("카드", "") || "-"}</td>
                            <th>금액(원)</th>
                            <td>{commonFn.krwFormatter(item?.athzAmt) || 0}</td>
                          </tr>
                          <tr>
                            <th>카드번호</th>
                            <td>{commonFn.cardNoFormatter(item?.cardNo) || "-"}</td>
                            <th>승인번호</th>
                            <td>{item?.athzNo || "-"}</td>
                          </tr>
                          </tbody>
                        </table>
                      </div>
                  )
                })
              }
            </div>
          </div>
          {/** 카드매출 end **/}

          {/** 현금영수증 start **/}
          <div className='collection_view_section black'>
            <div className='view_title'>현금영수증 <span>({clctDetail?.cashReceiptList?.length})</span></div>

            <div className="section_wrap">
              {
                clctDetail?.cashReceiptList?.map((item, idx) => {
                  return (
                      <div className="section" key={idx}>
                        <table className="table">
                          <caption>현금영수증 테이블</caption>
                          <colgroup>
                            <col width="15%" />
                            <col width="35%" />
                            <col width="15%" />
                            <col width="35%" />
                          </colgroup>
                          <tbody>
                          <tr>
                            <th colSpan={4}>
                              <div className='numberling'>
                                <div className='num'>No.{idx+1}</div>
                              </div>
                            </th>
                          </tr>
                          <tr>
                            <th>일자</th>
                            <td>{moment(item?.issDt).format('YYYY-MM-DD') || '-'}</td>
                            <th>발행구분</th>
                            <td>{issueType[item?.issdsncCd]?.name || '-'}</td>
                          </tr>
                          <tr>
                            <th>승인번호</th>
                            <td>{item?.hmtxAthzNo || "-"}</td>
                            <th>거래구분</th>
                            <td>{transType[item?.trnDsncCd]?.name || '-'}</td>
                          </tr>
                          <tr>
                            <th>발급수단</th>
                            <td>{item?.isncMeanNo || "-"}</td>
                            <th>봉사료(원)</th>
                            <td>{commonFn.krwFormatter(item?.srcgAmt) || 0}</td>
                          </tr>
                          <tr>
                            <th>공급가액(원)</th>
                            <td>{commonFn.krwFormatter(item?.sppcAmt) || 0}</td>
                            <th>부가세(원)</th>
                            <td>{commonFn.krwFormatter(item?.srtxAmt) || 0}</td>
                          </tr>
                          <tr>
                            <th>합계금액(원)</th>
                            <td colSpan={3}>{commonFn.krwFormatter(item?.sumAmt) || 0}</td>
                          </tr>
                          </tbody>
                        </table>
                      </div>
                  )
                })
              }
            </div>
          </div>
          {/** 현금영수증 end **/}

          {/** 기타매출 start **/}
          <div className='collection_view_section blue'>
            <div className='view_title'>기타매출 <span>({clctDetail?.etcSalesList?.length})</span></div>

            <div className="section_wrap">
              {
                clctDetail?.etcSalesList?.map((item, idx) => {
                  return (
                      <div className="section" key={idx}>
                        <table className="table">
                          <caption>기타매출 테이블</caption>
                          <colgroup>
                            <col width="15%" />
                            <col width="35%" />
                            <col width="15%" />
                            <col width="35%" />
                          </colgroup>
                          <tbody>
                          <tr>
                            <th colSpan={4}>
                              <div className='numberling'>
                                <div className='num'>No.{idx+1}</div>
                              </div>
                            </th>
                          </tr>
                          <tr>
                            <th>거래일</th>
                            <td>{moment(item?.trnDt).format("YYYY-MM-DD") || "-"}</td>
                            <th>거래액(원)</th>
                            <td>{commonFn.krwFormatter(item?.trnAmt) || 0}</td>
                          </tr>
                          <tr>
                            <th>메모</th>
                            <td colSpan={3}>{item?.hninMemo || "-"}</td>
                          </tr>
                          </tbody>
                        </table>
                      </div>
                  )
                })
              }
            </div>
          </div>
          {/** 기타매출 end **/}
        </div>
      </>
  )
}

export default BooksDetail;