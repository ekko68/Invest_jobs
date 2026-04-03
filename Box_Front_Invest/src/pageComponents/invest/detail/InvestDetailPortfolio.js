import React, { forwardRef, useContext, useImperativeHandle, useRef, useState } from 'react'
import Total01 from 'components/common/number/Total01'
import NoResult from 'components/common/NoResult'

import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import Paging from 'pageComponents/common/Paging'

import { StringUtils } from 'modules/utils/StringUtils'
import DateUtils from 'modules/utils/DateUtils'
import { setFunc } from 'modules/utils/ReactUtils'
import QueryUtils from 'modules/utils/QueryUtils'
import ResponseUtils from 'modules/utils/ResponseUtils'
import Api from 'modules/consts/Api'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import { createKey } from 'modules/utils/CommonUtils'
import { CheckYn } from 'modules/consts/BizConst'

const InvestDetailPortfolio = forwardRef((props, ref) => {
  const commonContext = useContext(CommonContext)

  const alertPopRef = useRef()
  const pagingRef = useRef()
  const pageRef = useRef(0)
  const totalPageRef = useRef(1)

  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)

  useImperativeHandle(ref, () => ({
    setData,
    setPage
  }))
  const setData = (temp) => {
    setList(temp)
  }
  const setPage = (paging) => {
    setFunc(pagingRef, 'setPaging', paging)
    setTotal(paging.total)
  }
  const loadPortfolioPage = async () => {
    const query = QueryUtils.getQuery(props)
    if (query.hasOwnProperty('utlinsttId')) {
      const params = {
        page: pageRef.current,
        record: 5,
        pageSize: 5,
        utlinsttId: query['utlinsttId']
      }
      const resPortfolio = await ResponseUtils.getSimpleResponse(Api.vc.portfolioList, params, false)
      if (resPortfolio) {
        pageRef.current = resPortfolio['page']
        totalPageRef.current = resPortfolio['totalPage']
        setTotal(resPortfolio['total'])
        const list = resPortfolio['list']
        if (pageRef.current === 1) {
          setPage(resPortfolio)
          setData(list)
        } else if (pageRef.current > 1) {
          setPage(resPortfolio)
          setData(list, true)
        }
      }
    }
  }
  const onChangePage = async (pageNumber) => {
    pageRef.current = pageNumber
    await commonContext.actions.callbackAfterSessionRefresh(loadPortfolioPage, true, true)
  }

  return (
    <div className="portfolio">
      <h3 className="section_title bold">포트폴리오</h3>
      <div className="company_list_wrap">
        <div className="company_list_title">
          <div className="name">기업명</div>
          <div className="field">비즈니스 분야</div>
          <div className="skill">관심기술</div>
          <div className="group">투자단계</div>
          <div className="amount">투자금액</div>
          <div className="y_m">투자년월</div>
        </div>
        {list?.length > 0 ? (
          list.map((item, index) => (
            <div className="company_list_item" key={createKey()}>
              <div className="name">
                <div className="img">
                  {StringUtils.hasLength(item?.imgUrl) ? (
                    <img src={item.imgUrl} alt={item?.invmEnprNm + ' 로고'} />
                  ) : (
                    <img src="/images/tmp/portfolio_no_img.png" alt="이미지없음" />
                  )}
                </div>
                <p className="title">{item['invmEnprNm']}</p>
              </div>
              <div className="field">{item['invmFildNm']}</div>
              <div className="skill">{item['utlzTchnNm']}</div>
              <div className="group">{item['oppbYn'] === CheckYn.YES ? item['invmStgNm'] : '비공개'}</div>
              <div className="amount">
                {item['oppbYn'] === CheckYn.YES ? StringUtils.comma(item['invmAmt']) : '비공개'}
              </div>
              <div className="y_m">{DateUtils.insertYyyyMmDdDash(item['invmPrfrDt'])}</div>
            </div>
          ))
        ) : (
          <NoResult msg={'등록된 포트폴리오 정보가 없습니다.'} style={{ marginTop: '10px' }} />
        )}
      </div>
      <Total01 data={StringUtils.comma(total)} />
      <div className="page_wrap">
        <Paging ref={pagingRef} onChangePage={onChangePage} onPrev={onChangePage} onNext={onChangePage} />
      </div>
      <AlertPopup ref={alertPopRef} />
    </div>
  )
})

export default InvestDetailPortfolio
