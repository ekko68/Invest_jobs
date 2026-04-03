import { useState, useEffect } from 'react'
import Badge from 'components/atomic/Badge'
import * as commonFn from 'modules/fns/commonFn'
import { NoImage02 } from 'modules/consts/Img'

const EstimateProductItem = (props) => {
  const { type, item, index, isNarrow } = props
  const [prcLabel, setPrcLabel] = useState(0)
  const [cntLabel, setCntLabel] = useState(0)
  const [totalPrcLabel, setTotalPrcLabel] = useState(0)

  useEffect(() => {
    if (Number(item?.salePrc) > 0) setPrcLabel(commonFn.krwFormatter(Number(item.salePrc))) //금액(할인가 있음)
    else setPrcLabel(commonFn.krwFormatter(Number(item.pdfPrc))) //금액(할인가 없음)
    if (item?.ordnQty > 0) setCntLabel(commonFn.krwFormatter(Number(item.ordnQty))) //수량
    if (item?.totalPrc > 0) setTotalPrcLabel(commonFn.krwFormatter(Number(item.totalPrc))) //총 금액
  }, [item])

  useEffect(() => {
    let prc = prcLabel ? parseInt(prcLabel.replace(/\D/g, '')) : 0
    let cnt = cntLabel ? parseInt(cntLabel.replace(/\D/g, '')) : 1
    let totalPrc = prc * cnt
    let newPdf = item
    newPdf['totalPrc'] = totalPrc
    setTotalPrcLabel(Number(totalPrc) > 0 ? commonFn.krwFormatter(Number(totalPrc)) : 0)
  }, [prcLabel, cntLabel])

  const pdfNmItem = () => {
    if (item?.imgUrl) {
      return (
        //이미지 있으면
        <div className="contents_wrap">
          <div className="img_wrap">
            <img src={item?.imgUrl ? item?.imgUrl : NoImage02} alt={item?.pdfNm} />
          </div>
          <div className="name_badge_wrap">
            {item?.agenInfId && (
              <div className="badge_wrap">
                <Badge className="badge full_blue">에이전시</Badge>
              </div>
            )}
            <div className="name_text">{item?.pdfNm}</div>
          </div>
        </div>
      )
    } else {
      return (
        //이미지 없으면
        <div className="name_badge_wrap full_width">
          {item?.agenInfId && <Badge className="badge full_blue">에이전시</Badge>}
          <div className="name_text">{item?.pdfNm}</div>
        </div>
      )
    }
  }

  if (isNarrow) {
    return (
      <div className="estimate_resp_mo">
        <div className="cell tr accent">{index + 1}</div>
        <div className="cell through pdname">
          <div className="title">상품명</div>
          <div className="info_c">{pdfNmItem()}</div>
        </div>
        <div className="cell through">
          <div className="title">단가(원)</div>
          {type === 'sheet' && <div className="info_c">{prcLabel}</div>}
        </div>
        <div className="cell through">
          <div className="title">주문수량</div>
          {type === 'sheet' && <div className="info_c">{cntLabel}</div>}
        </div>
        <div className="cell through">
          <div className="title">단위</div>
          <div className="info_c">개</div>
        </div>
        <div className="cell through">
          <div className="title">금액(원)</div>
          <div className="info_c">{totalPrcLabel}</div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="cell_wrap cell_td">
        <div className="cell num">{index + 1}</div>
        <div className="cell name">{pdfNmItem()}</div>
        {type === 'sheet' && (
          <>
            <div className="cell unitprice">{prcLabel}</div>
            <div className="cell quantity">{cntLabel}</div>
          </>
        )}
        <div className="cell unit">개</div>
        <div className="cell money">{totalPrcLabel}</div>
      </div>
    )
  }
}

export default EstimateProductItem
