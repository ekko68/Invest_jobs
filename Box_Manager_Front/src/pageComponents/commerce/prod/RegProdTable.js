import NoResult from 'components/NoResult'
import Button from 'components/atomic/Button'
import Pagination from 'components/Pagination'
import { getTotalNumberBoard } from 'modules/common'
import * as commonFn from 'modules/fns/commonFn'
import BoxUrl from "modules/consts/BoxUrl";

const RegProdTable = (props) => {
  const { type, data, handleConfirmDeprive, handleCancelStopSale, handlePaging, paging } = props

  if (!data || !data.list || data.list.length === 0) {
    return (
      <div className="table_no_result">
        <NoResult />
      </div>
    )
  } else {
    if (type === 'regProd') {
      // reg table
      return (
        <div className="table_wrap border_bottom_none table_th_border">
          <table className="table type02">
            <caption>등록 상품 테이블</caption>
            <colgroup>
              <col width={'5%'} />
              <col width={'*'} />
              <col width={'12%'} />
              <col width={'12%'} />
              <col width={'14%'} />
              <col width={'14%'} />
            </colgroup>
            <thead>
              <tr>
                <th>NO</th>
                <th>상품정보</th>
                <th>상품 등록일</th>
                <th>결제완료 수</th>
                <th>바로가기</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {data?.list?.map((item, idx) => (
                <tr key={'reg_prod_table_item_' + idx}>
                  <td className={'ta_center'}>
                    {paging && getTotalNumberBoard(paging.total, paging.page, paging.record, idx)}
                  </td>
                  <td className={'ta_center'}>
                    <div className="img_title_wrap">
                      <div className="img_wrap">
                        {item.imgUrl ? (
                          <img src={item.imgUrl} alt={item.pdfNm} />
                        ) : (
                          <div className="no_img">
                            <img src={require('assets/images/no_img.jpg').default} alt="이미지 없음" />
                          </div>
                        )}
                      </div>
                      <div className="title_price_wrap">
                        <p className="name">{item.pdfNm}</p>
                        <div className="price_wrap">
                          <p className={`price ${item.salePrc && item.salePrc !== '0' ? 'text_through' : ''}`}>
                            {commonFn.krwFormatter(item.pdfPrc)}원
                          </p>
                          {item.salePrc && item.salePrc !== '0' && (
                            <p className={'sale_price highlight_pink'}>{commonFn.krwFormatter(item.salePrc)}원</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className={'ta_center'}>{item.rgsnDate}</td>
                  <td className={'ta_center'}>{commonFn.krwFormatter(item.payOrderCnt)}</td>
                  <td className={'ta_center'}>
                    <Button
                      className={'basic'}
                      onClick={() =>
                        // window.open(`${process.env.REACT_APP_MKT_API_URL}/product/detail/${item.pdfInfoId}`, '_blank')
                        window.open(`${BoxUrl.getMarketBoxUrl(process.env.REACT_APP_PROFILE)}/product/detail/${item.pdfInfoId}`, '_blank')
                      }
                    >
                      상세페이지
                    </Button>
                  </td>
                  <td className={'ta_center'}>
                    {item.isAbleAdmStopYn === 'Y' ? (
                      <Button className={'full_red'} onClick={() => handleConfirmDeprive(item.pdfInfoId)}>
                        판매 중지
                      </Button>
                    ) : item.isAbleAdmCancelYn === 'Y' ? (
                      <>
                        <p className="text highlight_red">판매 중지</p>
                        <Button className={'full_red'} onClick={() => handleCancelStopSale(item.pdfInfoId)}>
                          판매 중지 취소
                        </Button>
                      </>
                    ) : (
                      <>-</>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={'paging_wrap'}>
            {paging && <Pagination pagingData={paging} handlePaging={handlePaging} />}
          </div>
        </div>
      )
    } else {
      // Agency table
      return (
        <div className="table_wrap border_bottom_none table_th_border">
          <table className="table type02">
            <caption>에이전시 상품 테이블</caption>
            <colgroup>
              <col width={'5%'} />
              <col width={'*'} />
              <col width={'10%'} />
              <col width={'10%'} />
              <col width={'10%'} />
              <col width={'14%'} />
              <col width={'14%'} />
            </colgroup>
            <thead>
              <tr>
                <th>NO</th>
                <th>상품정보</th>
                <th>
                  에이전시
                  <br />
                  승인일
                </th>
                <th>원판매사</th>
                <th>
                  결제완료
                  <br />수
                </th>
                <th>바로가기</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {data?.list?.map((item, idx) => (
                <tr key={'reg_prod_table_item_' + idx}>
                  <td className={'ta_center'}>
                    {paging && getTotalNumberBoard(paging.total, paging.page, paging.record, idx)}
                  </td>
                  <td className={'ta_center'}>
                    <div className="img_title_wrap">
                      <div className="img_wrap">
                        {item.imgUrl ? (
                          <img src={item.imgUrl} alt={item.pdfNm} />
                        ) : (
                          <div className="no_img">
                            <img src={require('assets/images/no_img.jpg').default} alt="이미지 없음" />
                          </div>
                        )}
                      </div>
                      <div className="title_price_wrap">
                        <p className="name">{item.pdfNm}</p>
                        <div className="price_wrap">
                          <p className={`price ${item.salePrc && item.salePrc !== '0' ? 'text_through' : ''}`}>
                            {commonFn.krwFormatter(item.pdfPrc)}원
                          </p>
                          {item.salePrc && item.salePrc !== '0' && (
                            <p className={'sale_price highlight_pink'}>{commonFn.krwFormatter(item.salePrc)}원</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className={'ta_center'}>{item.rgsnDate}</td>
                  <td className={'ta_center'}>{item.selrUsisName}</td>
                  <td className={'ta_center'}>결제완료수</td>
                  <td className={'ta_center'}>
                    <Button
                      className={'basic'}
                      onClick={() =>
                        // window.open(`${process.env.REACT_APP_MKT_API_URL}/product/detail/${item.pdfInfoId}`, '_blank')
                        window.open(`${BoxUrl.getMarketBoxUrl(process.env.REACT_APP_PROFILE)}/product/detail/${item.pdfInfoId}`, '_blank')
                      }
                    >
                      상세페이지
                    </Button>
                  </td>
                  <td className={'ta_center'}>
                    {item.isAbleAdmStopYn === 'Y' && (
                      <Button className={'full_red'} onClick={() => handleConfirmDeprive(item.pdfInfoId)}>
                        판매 중지
                      </Button>
                    )}
                    {item.isAbleAdmCancelYn === 'Y' && (
                      <>
                        <p className="text highlight_red">판매 중지</p>
                        <Button className={'full_red'} onClick={() => handleCancelStopSale(item.pdfInfoId)}>
                          판매 중지 취소
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={'paging_wrap'}>
            {paging && <Pagination pagingData={paging} handlePaging={handlePaging} />}
          </div>
        </div>
      )
    }
  }
}

export default RegProdTable
