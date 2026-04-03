import { getTotalNumberBoard } from 'modules/common'
import Button from 'components/atomic/Button'
import BoxUrl from "modules/consts/BoxUrl";
import * as commonFn from 'modules/fns/commonFn'

const ListSellertable = (props) => {
  const { data, paging, handleConfirmDeprive, handleConfirmDepriveCancel } = props
  if (data) {
    return (
      <table className="table type02">
        <caption>판매사 관리 테이블</caption>
        <colgroup>
          <col width={'5%'} />
          <col width={'*'} />
          <col width={'10%'} />
          <col width={'10%'} />
          <col width={'10%'} />
          <col width={'10%'} />
          <col width={'12%'} />
          <col width={'15%'} />
        </colgroup>
        <thead>
          <tr>
            <th>NO</th>
            <th>회사명</th>
            <th>대표자명</th>
            <th>답변평균시간</th>
            <th>회원타입</th>
            <th>판매 상품</th>
            <th>바로가기</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={'main_bind_item_' + idx}>
              <td className={'ta_center'}>
                {paging && getTotalNumberBoard(paging.total, paging.page, paging.record, idx)}
              </td>
              <td className={'ta_center'}>{item.bplcNm}</td>
              <td className={'ta_center'}>{item.rprsntvNm}</td>
              <td className={'ta_center'}>{item.avgDate > 0 ? `${commonFn.krwFormatter(item.avgDate)}분` : '-'}</td>
              <td className={'ta_center'}>{item.mmbrtypeNm}</td>
              <td className={'ta_center'}>{item.prdtCnt ? item.prdtCnt : 0}</td>
              <td className={'ta_center'}>
                <Button
                  className={'basic'}
                  onClick={() =>
                    // window.open(`${process.env.REACT_APP_MKT_API_URL}/sellerstore/${item.selrUsisId}`, '_blank')
                    window.open(`${BoxUrl.getMarketBoxUrl(process.env.REACT_APP_PROFILE)}/sellerstore/${item.selrUsisId}`, '_blank')
                  }
                >
                  상점페이지
                </Button>
              </td>
              <td className={'ta_center'}>
                {item.mmbrsttsNm === '승인' ? (
                  <Button className={'full_red'} onClick={() => handleConfirmDeprive(item.selrUsisId)}>
                    판매 자격 박탈
                  </Button>
                ) : (
                  <>
                    <p className="info highlight_red">판매 자격 박탈</p>
                    <Button className={'full_red'} onClick={() => handleConfirmDepriveCancel(item.selrUsisId)}>
                      박탈 해제
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  } else {
    return <div>&nbsp;</div>
  }
}

export default ListSellertable
