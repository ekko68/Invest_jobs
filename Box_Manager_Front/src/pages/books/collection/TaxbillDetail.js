// 세금계산서 상세
import React from 'react'
import moment from 'moment'

//modules
import * as commonFn from 'modules/fns/commonFn'
import { bizFormatter } from 'modules/fns/commonFn'
import * as Finance from 'assets/images/svg/Finance';

//const
/* 공급받는자 */
const titleLabels = {
  TXB01001: "상호", //사업자
  TXB01002: "주민번호", //개인
  TXB01003: "주민번호 (또는 여권번호)" //외국인
}

/* 단위 */
const unitCodeList = {
  UNT00001: {code: "UNT00001", name: "개"},
  UNT00002: {code: "UNT00002", name: "kg"},
  UNT00003: {code: "UNT00003", name: "t"},
  UNT00004: {code: "UNT00004", name: "box"},
  UNT00005: {code: "UNT00005", name: "직접입력"}
}

/* 청구/영수 */
const claimReceipt = {
  TXB02001: {code: "TXB02001", name: "청구"},
  TXB02002: {code: "TXB02002", name: "영수"}
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

const TaxbillDetail = (props) => {

  const { clctDetail } = props

  return (
      <>
        <div className='collection_view_section'>
          <div className='view_title'>기본정보</div>
          <div className="section">
            <table className="table">
              <caption>기본정보 테이블</caption>
              <colgroup>
                <col width="15%" />
                <col width="35%" />
                <col width="15%" />
                <col width="35%" />
              </colgroup>
              <tbody>
              <tr>
                <th>승인번호</th>
                <td colSpan={3}>{clctDetail?.taxbill?.hmtxAthzNo || '-'}</td>
              </tr>
              <tr>
                <th>거래액(원)</th>
                <td colSpan={3}>{commonFn.krwFormatter(clctDetail?.taxbill?.sumTtalAmt) || 0}</td>
              </tr>
              <tr>
                <th>메모</th>
                <td colSpan={3}>{clctDetail?.taxbill?.hninMemo || '-'}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className='collection_view_section mt80'>
          <div className='view_title'>공급자</div>
          <div className="section">
            <table className="table">
              <caption>공급자 테이블</caption>
              <colgroup>
                <col width="15%" />
                <col width="35%" />
                <col width="15%" />
                <col width="35%" />
              </colgroup>
              <tbody>
              <tr>
                <th>상호</th>
                <td>{clctDetail?.taxbillSender?.splEntpNm || '-'}</td>
                <th>성명</th>
                <td>{clctDetail?.taxbillSender?.rpprNm || '-'}</td>
              </tr>
              <tr>
                <th>등록번호</th>
                <td>{bizFormatter(clctDetail?.taxbillSender?.splrIdntNo) || "-"}</td>
                <th>종사업장번호</th>
                <td>{clctDetail?.taxbillSender?.blzPlacDsncNo || '-'}</td>
              </tr>
              <tr>
                <th>사업장 주소</th>
                <td colSpan={3}>{clctDetail?.taxbillSender?.bsunAdr || '-'}</td>
              </tr>
              <tr>
                <th>업태</th>
                <td>{clctDetail?.taxbillSender?.bzstNm || '-'}</td>
                <th>종목</th>
                <td>{clctDetail?.taxbillSender?.tpbsNm || '-'}</td>
              </tr>
              <tr>
                <th>이메일</th>
                <td colSpan={3}>
                  <div className='email_wrap'>
                    <span>{clctDetail?.taxbillSender?.rsprEml || '-'}</span>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className='collection_view_section mt80'>
          <div className='view_title'>공급받는자</div>
          <div className="section section01">
            <table className="table">
              <caption>공급받는자 테이블</caption>
              <colgroup>
                <col width="15%" />
                <col width="35%" />
                <col width="15%" />
                <col width="35%" />
              </colgroup>
              <tbody>
              <tr>
                {/*상호 || 주민번호 || 주민번호(또는 여권번호) */}
                <th>{titleLabels[clctDetail?.taxbillReceiver?.bsacPtrnCd] || '-'}</th>
                {
                  clctDetail?.taxbillReceiver?.bsacPtrnCd === "TXB01001" ? (
                    //법인: 상호명
                      <td>{clctDetail?.taxbillReceiver?.splRcvrEnnm || '-'}</td>
                ) : (
                    //개인/외국인: 주민번호/여권번호
                      <td>{clctDetail?.taxbillReceiver?.splRcvrIdntNo || '-'}</td>
                )}

                <th>성명</th>
                <td>{clctDetail?.taxbillReceiver?.splRcvrNm || '-'}</td>
              </tr>

              {/** 사업자 **/}
              {
                clctDetail?.taxbillReceiver?.bsacPtrnCd === "TXB01001" &&
                <>
                  <tr>
                    <th>등록번호</th>
                    <td>{bizFormatter(clctDetail?.taxbillReceiver?.splRcvrIdntNo) || "-"}</td>
                    <th>종사업장번호</th>
                    <td>{clctDetail?.taxbillReceiver?.blzPlacDsncNo || '-'}</td>
                  </tr>
                  <tr>
                    <th>사업장 주소</th>
                    <td colSpan={3}>{clctDetail?.taxbillReceiver?.bsunAdr || '-'}</td>
                  </tr>
                </>
              }

              {/** 외국인 **/}
              {
                clctDetail?.taxbillReceiver?.bsacPtrnCd === "TXB01003" &&
                <tr>
                  <th>주소</th>
                  <td>{clctDetail?.taxbillReceiver?.bsunAdr || '-'}</td>
                  <th>종사업장번호</th>
                  <td>{clctDetail?.taxbillReceiver?.blzPlacDsncNo || '-'}</td>
                </tr>
              }

              {/** 사업자일때만 업태/종목 표시 **/}
              {
                clctDetail?.taxbillReceiver?.bsacPtrnCd === "TXB01001" &&
                <tr>
                  <th>업태</th>
                  <td>{clctDetail?.taxbillReceiver?.bzstNm || '-'}</td>
                  <th>종목</th>
                  <td>{clctDetail?.taxbillReceiver?.tpbsNm || '-'}</td>
                </tr>
              }

              <tr>
                <th>이메일</th>
                <td colSpan={3}>
                  <div className='email_wrap'>
                    <span>{clctDetail?.taxbillReceiver?.prcpRsprEml || '-'}</span>
                    {
                      clctDetail?.taxbillReceiver?.asstRsprEml && <span>{clctDetail?.taxbillReceiver?.asstRsprEml}</span>
                    }
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className='collection_view_section mt80'>
          <div className='view_title'>거래정보</div>
          <div className="section collection_table_section">
            <div className="table_wrap border_bottom_none table_th_border">
              <table className="table type02">
                <caption>작성일자 공급가액 부가세 테이블</caption>
                <colgroup>
                  <col width={'20%'} />
                  <col width={'40%'} />
                  <col width={'40%'} />
                </colgroup>
                <thead>
                <tr>
                  <th>작성일자</th>
                  <th>공급가액(원)</th>
                  <th>부가세(원)</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>
                    {moment(clctDetail?.taxbill?.wrtnDt).format('YYYY-MM-DD') || "-"}
                  </td>
                  <td className="txt_end">{commonFn.krwFormatter(clctDetail?.taxbill?.sumSppcAmt) || 0}</td>
                  <td className="txt_end">{commonFn.krwFormatter(clctDetail?.taxbill?.sumTaxAmt) || 0}</td>
                </tr>
                </tbody>
              </table>
              <table className="table">
                <caption>비고 테이블</caption>
                <colgroup>
                  <col width="15%" />
                  <col width="35%" />
                  <col width="15%" />
                  <col width="35%" />
                </colgroup>
                <tbody>
                <tr>
                  <th className="txt_center">비고 1</th>
                  <td className="txt_start" colSpan={3}>{clctDetail?.taxbill?.rmrkCon || '-'}</td>
                </tr>
                {
                  clctDetail?.taxbill?.rmrkConTwo &&
                  <tr>
                    <th className="txt_center">비고 2</th>
                    <td className="txt_start" colSpan={3}>{clctDetail?.taxbill?.rmrkConTwo || '-'}</td>
                  </tr>
                }
                {
                  clctDetail?.taxbill?.rmrkConTee &&
                  <tr>
                    <th className="txt_center">비고 3</th>
                    <td className="txt_start" colSpan={3}>{clctDetail?.taxbill?.rmrkConTee || '-'}</td>
                  </tr>
                }
                </tbody>
              </table>
            </div>
          </div>

          <div className="section collection_table_section scroll">
            <div className="table_wrap border_bottom_none table_th_border">
              <table className="table type02">
                <caption>상세 테이블</caption>
                <colgroup>
                  <col width={'5%'} />
                  <col width={'5%'} />
                  <col width={'15%'} />
                  <col width={'5%'} />
                  <col width={'10%'} />
                  <col width={'15%'} />
                  <col width={'15%'} />
                  <col width={'15%'} />
                  <col width={'20%'} />
                </colgroup>
                <thead>
                <tr>
                  <th>월</th>
                  <th>일</th>
                  <th>품목명</th>
                  <th>규격</th>
                  <th>수량</th>
                  <th>단가(원)</th>
                  <th>공급가액(원)</th>
                  <th>부가세(원)</th>
                  <th>비고</th>
                </tr>
                </thead>
                <tbody>
                {
                  clctDetail?.taxbillItemList?.map((item, idx) => {
                    return (
                      <tr key={idx}>
                        <td>
                          {moment(item?.trnDt).format('MM') || "-"}
                        </td>
                        <td>
                          {moment(item?.trnDt).format('DD') || "-"}
                        </td>
                        <td>
                          {item?.lsarNm || "-"}
                        </td>
                        <td>
                          {unitCodeList[item?.qtyUtCd]?.name}
                          {item?.qtyUtCd === 'UNT00005' && item?.hninUtNm}
                        </td>
                        <td>{commonFn.krwFormatter(item?.qty) || 0}</td>
                        <td className="txt_end">{commonFn.krwFormatter(item?.upcAmt) || 0}</td>
                        <td className="txt_end">{commonFn.krwFormatter(item?.sppcAmt) || 0}</td>
                        <td className="txt_end">{commonFn.krwFormatter(item?.taxAmt) || 0}</td>
                        <td>{item?.rmrk || '-'}</td>
                      </tr>
                    )
                  })
                }
                </tbody>
              </table>
              <table className="table type03">
                <caption>합계금액 테이블</caption>
                <colgroup>
                  <col width="17%" />
                  <col width="17%" />
                  <col width="17%" />
                  <col width="17%" />
                  <col width="17%" />
                  <col width="15%" />
                </colgroup>
                <thead>
                <tr>
                  <th>합계금액(원)</th>
                  <th>현금(원)</th>
                  <th>수표(원)</th>
                  <th>어음(원)</th>
                  <th>외상미수금(원)</th>
                  <th>금액청구</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td className="txt_end">{commonFn.krwFormatter(clctDetail?.taxbill?.sumTtalAmt) || 0}</td>
                  <td className="txt_end">{commonFn.krwFormatter(clctDetail?.taxbill?.cashAmt) || 0}</td>
                  <td className="txt_end">{commonFn.krwFormatter(clctDetail?.taxbill?.chckAmt) || 0}</td>
                  <td className="txt_end">{commonFn.krwFormatter(clctDetail?.taxbill?.noteAmt) || 0}</td>
                  <td className="txt_end">{commonFn.krwFormatter(clctDetail?.taxbill?.oncrAmt) || 0}</td>
                  <td>
                    위 금액을&nbsp;
                    {claimReceipt[clctDetail?.taxbill?.rectBilgDsncCd]?.name}
                    함
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
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

          {/** 전자어음 start **/}
          <div className='collection_view_section yellow'>
            <div className='view_title'>전자어음 <span>({clctDetail?.noteList?.length})</span></div>

            <div className="section_wrap">
              {
                clctDetail?.noteList?.map((item, idx) => {
                  return (
                      <div className="section" key={idx}>
                        <table className="table">
                          <caption>전자어음 테이블</caption>
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
                            <th>어음번호</th>
                            <td colSpan={3}>
                              {item?.elbNo || '-'}
                            </td>
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
                            <td colSpan={3}  className={ebillStatus[item?.elbSttsCd]?.className}>
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
                  )
                })
              }
            </div>
          </div>
          {/** 전자어음 end **/}

          {/** 채권(외매채포함) start **/}
          <div className='collection_view_section purple'>
            <div className='view_title'>채권(외매채 포함) <span>({clctDetail?.bondList?.length})</span></div>

            <div className="section_wrap">
              {
                clctDetail?.bondList?.map((item, idx) => {
                  return (
                      <div className="section" key={idx}>
                        <table className="table">
                          <caption>채권(외매채 포함) 테이블</caption>
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
                            <th>채권번호</th>
                            <td colSpan={3}>{item?.elboNo || '-'}</td>
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
                  )
                })
              }
            </div>
          </div>
          {/** 채권(외매채포함) end **/}

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
                            <td>{moment(item?.trnDt).format("YYYY-MM-DD") || '-'}</td>
                            <th>거래액(원)</th>
                            <td>{commonFn.krwFormatter(item?.trnAmt) || 0}</td>
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
          {/** 기타매출 end **/}
        </div>
      </>
  )
}

export default TaxbillDetail;