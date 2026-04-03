/** @jsxImportSource @emotion/react */
import React, { useState, useEffect, useRef, useContext } from 'react'
import { useHistory } from 'react-router-dom'

import { InvestViewStyle } from 'assets/style/InvestStyle'

import Header from 'components/header/Header'
import Gallery01 from 'components/common/Gallery01'
import Footer from 'components/common/Footer'
import CardLayout from 'components/common/card/CardLayout'
import BreadCrumbs from 'components/common/BreadCrumbs'

import InvestDetailInfo from 'pageComponents/invest/detail/InvestDetailInfo'
import InvestDetailPreference from 'pageComponents/invest/detail/InvestDetailPreference'
import InvestDetailPortfolio from 'pageComponents/invest/detail/InvestDetailPortfolio'
import InvestDetailExecChart from 'pageComponents/invest/detail/InvestDetailExecChart'
import InvestDetailMemberList from 'pageComponents/invest/detail/InvestDetailMemberList'

import { exeFunc, setFunc } from 'modules/utils/ReactUtils'
import ResponseUtils from 'modules/utils/ResponseUtils'
import QueryUtils from 'modules/utils/QueryUtils'
import Api from 'modules/consts/Api'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import { UsisType } from '../../modules/consts/BizConst'

const Detail = (props) => {
  // 갤러리 임시데이터
  const galleryData = {
    title: '투자기관',
    subInfo: '',
    img: '/images/gallery01_img1.png'
  }

  const investDetailInfoRef = useRef()
  const investDetailPreferenceRef = useRef()
  const investDetailMemberListRef = useRef()
  const investDetailExecChartRef = useRef()
  const investDetailPortfolioRef = useRef()

  const [pieChartData, setPieChartData] = useState([])

  const history = useHistory()

  const commonContext = useContext(CommonContext)

  const loadInvestDetail = async () => {
    const query = QueryUtils.getQuery(props)
    if (query.hasOwnProperty('utlinsttId')) {
      const url = Api.vc.infoDetail + '/' + query['utlinsttId']
      const res = await ResponseUtils.getSimpleResponse(url, null, false)
      return res
    }
    return null
  }
  const loadPortfolio = async () => {
    const query = QueryUtils.getQuery(props)
    if (query.hasOwnProperty('utlinsttId')) {
      const params = {
        page: 1,
        record: 5,
        pageSize: 5,
        utlinsttId: query['utlinsttId']
      }
      const resPortfolio = await ResponseUtils.getSimpleResponse(Api.vc.portfolioList, params, false)
      return resPortfolio
    }
    return null
  }

  const loadInvestMemberList = async () => {
    const query = QueryUtils.getQuery(props)
    if (query.hasOwnProperty('utlinsttId')) {
      const params = {
        page: 1,
        record: 4,
        pageSize: 1,
        utlinsttId: query['utlinsttId']
      }
      const resMemberList = await ResponseUtils.getSimpleResponse(Api.vc.memberList, params, false)
      return resMemberList
    }
    return null
  }

  const isMountRef = useRef(false)
  const mountApiCntRef = useRef(0)

  useEffect(() => {
    if (commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMountRef.current) {
      isMountRef.current = true
      window.scrollTo(window.scrollX, 0)

      commonContext.actions.pageMountPathCheck(
        history,
        async () => {
          mountApiCntRef.current = 3

          loadInvestDetail()
            .then((res) => {
              console.log('loadInvestDetail = ', res)
              mountApiCntRef.current--
              if (res) {
                setFunc(investDetailInfoRef, 'setData', res)
                setFunc(investDetailExecChartRef, 'setData', res.execChartList, res.invmPrfrCnt)
                setPieChartData(res.pfrcChartList) // set Pie chart data separately
                if (commonContext.state.user.info?.type === UsisType.COMPANY)
                  exeFunc(investDetailInfoRef, 'checkRequestAvailable')
              }
            })
            .catch((err) => {
              console.error(err)
              mountApiCntRef.current--
            })
          loadPortfolio()
            .then((res) => {
              mountApiCntRef.current--
              if (res) {
                setFunc(investDetailPortfolioRef, 'setPage', res)
                setFunc(investDetailPortfolioRef, 'setData', res.list)
              }
            })
            .catch((err) => {
              console.error(err)
              mountApiCntRef.current--
            })
          loadInvestMemberList()
            .then((res) => {
              mountApiCntRef.current--
              setFunc(investDetailMemberListRef, 'setPage', res.page, res.totalPage)
              setFunc(investDetailMemberListRef, 'setData', res.list)
            })
            .catch((err) => {
              console.error(err)
              mountApiCntRef.current--
            })
        },
        mountApiCntRef
      )
    }
  }, [commonContext.state.user])

  useEffect(() => {
    return () => (isMountRef.current = false)
  }, [])

  return (
    <>
      <Header {...props} />
      <div className="page_container">
        <Gallery01 data={galleryData} />
        <BreadCrumbs {...props} />
        {/*투자심사-신청요청제한 팝업*/}
        <div className="sub_wrap bg02 invest_wrap invest_detail_wrap" css={InvestViewStyle}>
          <div className="invest_inner default_size02">
            <div className="invest_left">
              <div className="section section01">
                {/*투자사 정보*/}
                <InvestDetailInfo ref={investDetailInfoRef} {...props} />
              </div>
              <div className="section section02">
                {/*선호 투자 유형*/}
                <InvestDetailPreference ref={investDetailPreferenceRef} chartData={pieChartData} {...props} />
              </div>
            </div>
            <div className="invest_right">
              <div className="section section01">
                {/*총 투자 집행*/}
                <CardLayout>
                  <InvestDetailExecChart ref={investDetailExecChartRef} {...props} />
                  <InvestDetailPortfolio ref={investDetailPortfolioRef} {...props} />
                </CardLayout>
              </div>
              {/*section02 start*/}
              <div className="section section02 judge_wrap_top">
                {/*대표심사역*/}
                <InvestDetailMemberList ref={investDetailMemberListRef} {...props} />
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  )
}

export default Detail
