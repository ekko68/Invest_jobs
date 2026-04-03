/** @jsxImportSource @emotion/react */

import MainStyle from 'assets/style/MainStyle'
import Footer from 'components/common/Footer'
import Header from 'components/header/Header'
import Api from 'modules/consts/Api'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import CommonAxios, { getConfig, getPostConfig } from 'modules/utils/CommonAxios'
import { exeFunc, setFunc } from 'modules/utils/ReactUtils'
import ResponseUtils from 'modules/utils/ResponseUtils'
import ConfirmPopup from 'pageComponents/common/pop/ConfirmPopup'
import MainBanner from 'pageComponents/main/MainBanner'
import MainCategory from 'pageComponents/main/MainCategory'
import MainCompany from 'pageComponents/main/MainCompany'
import MainFundInvestSwiper from 'pageComponents/main/MainFundInvestSwiper'
import MainInvestStatus from 'pageComponents/main/MainInvestStatus'
import MainParticipationCompany from 'pageComponents/main/MainParticipationCompany'
import MainSwiper from 'pageComponents/main/MainSwiper'
import MainTotalFundAmount from 'pageComponents/main/MainTotalFundAmount'
import React, { useContext, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'

const Main = (props) => {
  const commonContext = useContext(CommonContext)

  const mainInvestStatusRef = useRef()
  const mainSwiperRef = useRef()
  const mainCategoryRef = useRef()
  const mainCompanyRef = useRef()
  const mainBannerRef = useRef()
  const mainTotalFundAmountRef = useRef()
  const mainParticipationCompanyRef = useRef()
  const mainFundInvestSwiperRef = useRef()
  const confirmPop = useRef()

  const countIvtBoxVisitor = async () => {
    await CommonAxios(getPostConfig(Api.common.visitorCount, null))
  }

  const loadMainInvestStatus = async () => {
    const mainInvestStatusData = await ResponseUtils.getSimpleResponse(Api.main.investStatus, null, false)
    if (mainInvestStatusData) {
      setFunc(mainInvestStatusRef, 'setData', mainInvestStatusData)
    }
  }

  const loadMainSwiper = async () => {
    const mainSwiperList = await ResponseUtils.getList(Api.main.bannerTop, null, 'list', false)
    for (let item of mainSwiperList) {
      item.text = item.title
    }
    setFunc(mainSwiperRef, 'setData', mainSwiperList)
  }

  const loadMainCompany = async () => {
    const params = {
      page: 1,
      record: 8,
      pageSize: 1
    }
    const companyRecentObject = await ResponseUtils.getObject(
      Api.main.companyRecent,
      params,
      ['page', 'totalPage'],
      'list'
    )
    if (companyRecentObject) {
      const list = companyRecentObject['list']
      setFunc(mainCompanyRef, 'setAllData', companyRecentObject['page'], companyRecentObject['totalPage'], list)
    }
  }

  const loadMainBanner = async () => {
    const mainBannerList = await ResponseUtils.getList(Api.main.bannerBottom, null, 'list', false)
    for (let item of mainBannerList) {
      item.text = item.title
    }
    setFunc(mainBannerRef, 'setData', mainBannerList)
  }

  const loadMainTotalFundAmount = async () => {
    const resObj = await ResponseUtils.getSimpleResponse(Api.main.fundInfo, null, false)
    setFunc(mainTotalFundAmountRef, 'setData', resObj ? resObj['invmAmtStr'] : '0')
  }

  const loadMainFundInvestSwiper = async () => {
    const mainFundInvestSwiperList = await ResponseUtils.getList(Api.main.investWebLinkList, null, 'list', false)
    for (let item of mainFundInvestSwiperList) {
      item['img'] = item['logo']
      item['name'] = item['type']
      item['info'] = item['intro']
    }
    setFunc(mainFundInvestSwiperRef, 'setData', mainFundInvestSwiperList)
  }

  const isMounted = useRef(false)
  const mountApiCntRef = useRef(0)

  const history = useHistory()

  useEffect(() => {
    if (commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
      isMounted.current = true
      commonContext.actions.pageMountPathCheck(
        history,
        async () => {
          mountApiCntRef.current = 7

          loadMainInvestStatus()
            .then((_) => mountApiCntRef.current--)
            .catch((err) => {
              console.error(err)
              mountApiCntRef.current--
            })
          loadMainSwiper()
            .then((_) => mountApiCntRef.current--)
            .catch((err) => {
              console.error(err)
              mountApiCntRef.current--
            })

          loadMainCompany()
            .then((_) => mountApiCntRef.current--)
            .catch((err) => {
              console.error(err)
              mountApiCntRef.current--
            })
          loadMainBanner()
            .then((_) => mountApiCntRef.current--)
            .catch((err) => {
              console.error(err)
              mountApiCntRef.current--
            })
          loadMainTotalFundAmount()
            .then((_) => mountApiCntRef.current--)
            .catch((err) => {
              console.error(err)
              mountApiCntRef.current--
            })
          loadMainFundInvestSwiper()
            .then((_) => mountApiCntRef.current--)
            .catch((err) => {
              console.error(err)
              mountApiCntRef.current--
            })

          countIvtBoxVisitor()
            .then((_) => mountApiCntRef.current--)
            .catch((err) => {
              console.error(err)
              mountApiCntRef.current--
            })
        },
        mountApiCntRef
      )
      if (sessionStorage.getItem('SI') !== null) {
        loadVncmloanAccessiblity()
      }
    }
  }, [commonContext.state.user])

  useEffect(() => {
    commonContext.actions.contextMountUserInfoSet()
  }, [])

  const loadVncmloanAccessiblity = async () => {
    const res = await CommonAxios(getConfig(Api.vncmloan.aplcCount), false)
    if (res?.data?.code == '200' && res.data.data) {
      const data = res.data.data
      const canAccessVentureLoan = data.rowCountAll > 0
      sessionStorage.setItem('canAccessVentureLoan', canAccessVentureLoan)
      const isRequestData = data.rowCountByStatus > 0
      if (isRequestData) {
        exeFunc(
          confirmPop,
          'openParams',
          'IBK 벤처대출 신청이 진행 중입니다. <br/> 내용 확인 후 필요 서류를 제출해 주세요.'
        )
      }
    } else {
      sessionStorage.setItem('canAccessVentureLoan', false)
    }
  }

  const onApplyConfirm = () => {
    history.push(ROUTER_NAMES.VNENTR_LON_CM_LIST_VIEW)
  }

  return (
    <div className="wrap main" css={MainStyle}>
      {/*<Header page={'main'} {...props} />*/}
      <Header page={'type02'} isSetMountContextUser={false} {...props} />
      <div className="main_gallery">
        {/*투자유치 신청 현황*/}
        <MainInvestStatus {...props} ref={mainInvestStatusRef} />
        {/*스와이퍼*/}
        <MainSwiper {...props} ref={mainSwiperRef} />
      </div>
      <div className="container">
        {/*분야*/}
        <MainCategory {...props} ref={mainCategoryRef} />
        {/*기업*/}
        <MainCompany {...props} ref={mainCompanyRef} />
        {/*배너*/}
        <MainBanner {...props} ref={mainBannerRef} />
        {/*총 펀드 금액*/}
        <MainTotalFundAmount {...props} ref={mainTotalFundAmountRef} />
        {/*참여중인 투자사*/}
        <MainParticipationCompany {...props} ref={mainParticipationCompanyRef} />
        {/*투자사 전용 스와이퍼*/}
        <MainFundInvestSwiper {...props} ref={mainFundInvestSwiperRef} />
      </div>
      <Footer />
      <ConfirmPopup ref={confirmPop} onConfirm={onApplyConfirm} />
    </div>
  )
}
export default Main
