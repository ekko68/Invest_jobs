import Button from 'components/atomic/Button'
import CardLayout from 'components/common/card/CardLayout'
import NoResult from 'components/common/NoResult'
import Total01 from 'components/common/number/Total01'
import Api from 'modules/consts/Api'
import { CheckYn } from 'modules/consts/BizConst'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import { createKey } from 'modules/utils/CommonUtils'
import DateUtils from 'modules/utils/DateUtils'
import { exeFunc, setFunc } from 'modules/utils/ReactUtils'
import ResponseUtils from 'modules/utils/ResponseUtils'
import { StringUtils } from 'modules/utils/StringUtils'
import Paging from 'pageComponents/common/Paging'
import PopupPortfolio from 'pageComponents/mypage/investor/info/PopupPortfolio'
import React, { forwardRef, useContext, useImperativeHandle, useRef, useState } from 'react'

const Portfolio = forwardRef((props, ref) => {
  const commonContext = useContext(CommonContext)

  const [list, setList] = useState([])

  const pagingRef = useRef()
  const pageRef = useRef(1)
  const totalPageRef = useRef(1)
  const [total, setTotal] = useState(0)
  const portfolioSavePopupRef = useRef()

  useImperativeHandle(ref, () => ({
    setData
  }))

  const setData = async () => {
    await loadPortfolioInvestList()
  }

  const loadPortfolioInvestList = async () => {
    const params = {
      page: pageRef.current,
      record: 5,
      pageSize: 5
    }
    const resPortfolioObject = await ResponseUtils.getSimpleResponse(Api.my.vc.portfolioInvestList, params, false)
    if (resPortfolioObject) {
      pageRef.current = resPortfolioObject['page']
      totalPageRef.current = resPortfolioObject['totalPage']
      setTotal(resPortfolioObject['total'])
      setFunc(pagingRef, 'setPaging', resPortfolioObject)
      const temp = resPortfolioObject['list']
      setList(temp)
    }
  }

  const onClickSavePopup = (item) => {
    exeFunc(portfolioSavePopupRef, 'open', item)
  }

  const onRefresh = async () => {
    await commonContext.actions.callbackAfterSessionRefresh(loadPortfolioInvestList, true, true)
  }

  const onChangePage = async (pageNumber) => {
    pageRef.current = pageNumber
    await commonContext.actions.callbackAfterSessionRefresh(loadPortfolioInvestList, true, true)
  }

  return (
    <div className="section section02">
      <div className="section_header">
        <h3 className="section_title">포트폴리오</h3>
        {/*<Button className={'blue'} onClick={onClickModifyPortfolio}>*/}
        <Button className={'blue'} onClick={() => onClickSavePopup()}>
          등록하기
        </Button>
      </div>
      <CardLayout>
        <div className="portfolio_info_wrap">
          <div className="card_header">
            <h3 className="ico_title title">투자 리스트</h3>
          </div>
          <div className="portfolio_content">
            <table className="table type02">
              <caption>포트폴리오 테이블</caption>
              <colgroup>
                <col width={'*'} />
                <col width={'20%'} />
                <col width={'20%'} />
                <col width={'10%'} />
                <col width={'10%'} />
                <col width={'10%'} />
                <col width={'10%'} />
              </colgroup>
              <thead>
                <tr>
                  <th>기업명</th>
                  <th>비즈니스 분야</th>
                  <th>관심기술</th>
                  <th>투자단계</th>
                  <th>투자금액</th>
                  <th>투자년월</th>
                  <th>수정</th>
                </tr>
              </thead>
              <tbody>
                {list?.length > 0 ? (
                  list.map((item, i) => (
                    <tr key={createKey()}>
                      <td>
                        <div className="ci_logo_wrap">
                          <div className="logo">
                            {StringUtils.hasLength(item.imgUrl) ? (
                              <img src={item.imgUrl} alt="" />
                            ) : (
                              <img src="/images/tmp/portfolio_no_img.png" alt="" />
                            )}
                          </div>
                          <span className="name">{item['invmEnprNm']}</span>
                        </div>
                      </td>
                      <td>{item['invmFildNm']}</td>
                      <td>{item['utlzTchnNm']}</td>
                      <td>{item['oppbYn'] === CheckYn.NO ? '비공개' : item['invmStgNm']}</td>
                      <td>{item['oppbYn'] === CheckYn.NO ? '비공개' : StringUtils.comma(item['invmAmt'])}</td>
                      <td>{DateUtils.insertYyyyMmDdDash(item['invmPrfrDt'])}</td>
                      <td>
                        <Button
                          className={'btn_update blue'}
                          onClick={() => {
                            exeFunc(portfolioSavePopupRef, 'open', item)
                          }}
                        >
                          수정
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7}>
                      <NoResult msg={'등록된 포트폴리오 정보가 없습니다.'} />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Total01 data={total} />
          <div className="pagination_wrap">
            <Paging ref={pagingRef} onChangePage={onChangePage} onPrev={onChangePage} onNext={onChangePage} />
          </div>
        </div>
      </CardLayout>
      <PopupPortfolio ref={portfolioSavePopupRef} onRefresh={onRefresh} />
    </div>
  )
})
export default Portfolio
