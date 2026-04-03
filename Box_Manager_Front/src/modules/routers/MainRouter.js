import React, { lazy } from 'react'
import { Switch, Route } from 'react-router-dom'
import ROUTER_NAMES from 'modules/consts/RouterConst'

// 배너관리
const MainBannerBusinessChatList = lazy(() => import('pages/main/banner/businesschat/List').then((c) => c))
const MainBannerBusinessChatView = lazy(() => import('pages/main/banner/businesschat/View').then((c) => c))
const MainBannerBusinessChatWrite = lazy(() => import('pages/main/banner/businesschat/Write').then((c) => c))
const MainBannerMoreList = lazy(() => import('pages/main/banner/more/List').then((c) => c))
const MainBannerMoreView = lazy(() => import('pages/main/banner/more/View').then((c) => c))
const MainBannerMoreWrite = lazy(() => import('pages/main/banner/more/Write').then((c) => c))
const MainBannerCardLimitList = lazy(() => import('pages/main/banner/cardlimit/List').then((c) => c))
const MainBannerCardLimitView = lazy(() => import('pages/main/banner/cardlimit/View').then((c) => c))
const MainBannerCardLimitWrite = lazy(() => import('pages/main/banner/cardlimit/Write').then((c) => c))
const MainBannerServiceList = lazy(() => import('pages/main/banner/service/List').then((c) => c))
const MainBannerServiceView = lazy(() => import('pages/main/banner/service/View').then((c) => c))
const MainBannerServiceWrite = lazy(() => import('pages/main/banner/service/Write').then((c) => c))
const MainBannerCommonList = lazy(() => import('pages/main/banner/common/List').then((c) => c))
const MainBannerCommonView = lazy(() => import('pages/main/banner/common/View').then((c) => c))
const MainBannerCommonWrite = lazy(() => import('pages/main/banner/common/Write').then((c) => c))

// 더보기 메뉴 관리
const MainMoreMenuLinkMenuList = lazy(() => import('pages/main/moremenu/linkmenu/List').then((c) => c))
const MainMoreMenuLinkMenuWrite = lazy(() => import('pages/main/moremenu/linkmenu/Write').then((c) => c))
const MainMoreMenuCardImgList = lazy(() => import('pages/main/moremenu/cardimg/List').then((c) => c))
const MainMoreMenuCardImgWrite = lazy(() => import('pages/main/moremenu/cardimg/Write').then((c) => c))

// 서비스 메뉴 관리
const MainServiceMenuEventList = lazy(() => import('pages/main/servicemenu/event/List').then((c) => c))
const MainServiceMenuEventView = lazy(() => import('pages/main/servicemenu/event/View').then((c) => c))
const MainServiceMenuEventWrite = lazy(() => import('pages/main/servicemenu/event/Write').then((c) => c))
const MainServiceMenuFinanceList = lazy(() => import('pages/main/servicemenu/finance/List').then((c) => c))
const MainServiceMenuFinanceView = lazy(() => import('pages/main/servicemenu/finance/View').then((c) => c))
const MainServiceMenuFinanceWrite = lazy(() => import('pages/main/servicemenu/finance/Write').then((c) => c))
const MainServiceMenuBenefitsList = lazy(() => import('pages/main/servicemenu/benefits/List').then((c) => c))
const MainServiceMenuBenefitsView = lazy(() => import('pages/main/servicemenu/benefits/View').then((c) => c))
const MainServiceMenuBenefitsWrite = lazy(() => import('pages/main/servicemenu/benefits/Write').then((c) => c))

// 고객센터 관리
const MainCsNoticeList = lazy(() => import('pages/main/cs/notice/List').then((c) => c))
const MainCsNoticeView = lazy(() => import('pages/main/cs/notice/View').then((c) => c))
const MainCsNoticeWrite = lazy(() => import('pages/main/cs/notice/Write').then((c) => c))
const MainCsFaqList = lazy(() => import('pages/main/cs/faq/List').then((c) => c))
const MainCsFaqView = lazy(() => import('pages/main/cs/faq/View').then((c) => c))
const MainCsFaqWrite = lazy(() => import('pages/main/cs/faq/Write').then((c) => c))

// 전자문서함 관리
const MainDocumentPackageList = lazy(() => import('pages/main/document/package/List').then((c) => c))
const MainDocumentPackageView = lazy(() => import('pages/main/document/package/View').then((c) => c))
const MainDocumentPackageWrite = lazy(() => import('pages/main/document/package/Write').then((c) => c))

// 회원사 관리
const MainMemberList = lazy(() => import('pages/main/member/List').then((c) => c))
const MainMemberView = lazy(() => import('pages/main/member/View').then((c) => c))

// 약관 관리
const MainTermsService = lazy(() => import('pages/main/terms/Service').then((c) => c))
const MainTemrsPrivacy = lazy(() => import('pages/main/terms/Privacy').then((c) => c))
const MainTemrsCredit = lazy(() => import('pages/main/terms/Credit').then((c) => c))





// prettier-ignore
const GlobalRouter = (props) => {
  return (
    <>
      <Switch>
        <Route exact path={ROUTER_NAMES.MAIN_BANNER_BUSINESSCHAT_LIST} component={(props) => <MainBannerBusinessChatList {...props} />} />
        <Route exact path={`${ROUTER_NAMES.MAIN_BANNER_BUSINESSCHAT_VIEW}/:id`} component={(props) => <MainBannerBusinessChatView {...props} />} />
        <Route exact path={[`${ROUTER_NAMES.MAIN_BANNER_BUSINESSCHAT_WRITE}/:id` , ROUTER_NAMES.MAIN_BANNER_BUSINESSCHAT_WRITE]} component={(props) => <MainBannerBusinessChatWrite {...props} />} />
        <Route exact path={ROUTER_NAMES.MAIN_BANNER_MORE_LIST} component={(props) => <MainBannerMoreList {...props} />} />
        <Route exact path={`${ROUTER_NAMES.MAIN_BANNER_MORE_VIEW}/:id`} component={(props) => <MainBannerMoreView {...props} />} />
        <Route exact path={[`${ROUTER_NAMES.MAIN_BANNER_MORE_WRITE}/:id` , ROUTER_NAMES.MAIN_BANNER_MORE_WRITE]} component={(props) => <MainBannerMoreWrite {...props} />} />


        <Route exact path={ROUTER_NAMES.MAIN_BANNER_CARDLIMIT_LIST} component={(props) => <MainBannerCardLimitList {...props} />} />
        <Route exact path={`${ROUTER_NAMES.MAIN_BANNER_CARDLIMIT_VIEW}/:id`} component={(props) => <MainBannerCardLimitView {...props} />} />
        <Route exact path={[`${ROUTER_NAMES.MAIN_BANNER_CARDLIMIT_WRITE}/:id` , ROUTER_NAMES.MAIN_BANNER_CARDLIMIT_WRITE]} component={(props) => <MainBannerCardLimitWrite {...props} />} />


        <Route exact path={ROUTER_NAMES.MAIN_BANNER_SERVICE_LIST} component={(props) => <MainBannerServiceList {...props} />} />
        <Route exact path={`${ROUTER_NAMES.MAIN_BANNER_SERVICE_VIEW}/:id`} component={(props) => <MainBannerServiceView {...props} />} />
        <Route exact path={[`${ROUTER_NAMES.MAIN_BANNER_SERVICE_WRITE}/:id` , ROUTER_NAMES.MAIN_BANNER_SERVICE_WRITE]} component={(props) => <MainBannerServiceWrite {...props} />} />

        <Route exact path={ROUTER_NAMES.MAIN_BANNER_COMMON_LIST} component={(props) => <MainBannerCommonList {...props} />} />
        <Route exact path={`${ROUTER_NAMES.MAIN_BANNER_COMMON_VIEW}/:id`} component={(props) => <MainBannerCommonView {...props} />} />
        <Route exact path={[`${ROUTER_NAMES.MAIN_BANNER_COMMON_WRITE}/:id` , ROUTER_NAMES.MAIN_BANNER_COMMON_WRITE]} component={(props) => <MainBannerCommonWrite {...props} />} />


        <Route exact path={ROUTER_NAMES.MAIN_MOREMENU_LINKMENU_LIST} component={(props) => <MainMoreMenuLinkMenuList {...props} />} />
        <Route exact path={[`${ROUTER_NAMES.MAIN_MOREMENU_LINKMENU_WRITE}/:id` , ROUTER_NAMES.MAIN_MOREMENU_LINKMENU_WRITE]} component={(props) => <MainMoreMenuLinkMenuWrite {...props} />} />
        <Route exact path={ROUTER_NAMES.MAIN_MOREMENU_CARDIMG_LIST} component={(props) => <MainMoreMenuCardImgList {...props} />} />
        <Route exact path={[`${ROUTER_NAMES.MAIN_MOREMENU_CARDIMG_WRITE}/:id` , ROUTER_NAMES.MAIN_MOREMENU_CARDIMG_WRITE]} component={(props) => <MainMoreMenuCardImgWrite {...props} />} />


        <Route exact path={ROUTER_NAMES.MAIN_SERVICEMENU_EVENT_LIST} component={(props) => <MainServiceMenuEventList {...props} />} />
        <Route exact path={`${ROUTER_NAMES.MAIN_SERVICEMENU_EVENT_VIEW}/:id`} component={(props) => <MainServiceMenuEventView {...props} />} />
        <Route exact path={[`${ROUTER_NAMES.MAIN_SERVICEMENU_EVENT_WRITE}/:id` , ROUTER_NAMES.MAIN_SERVICEMENU_EVENT_WRITE]} component={(props) => <MainServiceMenuEventWrite {...props} />} />
        <Route exact path={ROUTER_NAMES.MAIN_SERVICEMENU_FINANCE_LIST} component={(props) => <MainServiceMenuFinanceList {...props} />} />
        <Route exact path={`${ROUTER_NAMES.MAIN_SERVICEMENU_FINANCE_VIEW}/:id`} component={(props) => <MainServiceMenuFinanceView {...props} />} />
        <Route exact path={[`${ROUTER_NAMES.MAIN_SERVICEMENU_FINANCE_WRITE}/:id` , ROUTER_NAMES.MAIN_SERVICEMENU_FINANCE_WRITE]} component={(props) => <MainServiceMenuFinanceWrite {...props} />} />
        <Route exact path={ROUTER_NAMES.MAIN_SERVICEMENU_BENEFITS_LIST} component={(props) => <MainServiceMenuBenefitsList {...props} />} />
        <Route exact path={`${ROUTER_NAMES.MAIN_SERVICEMENU_BENEFITS_VIEW}/:id`} component={(props) => <MainServiceMenuBenefitsView {...props} />} />
        <Route exact path={[`${ROUTER_NAMES.MAIN_SERVICEMENU_BENEFITS_WRITE}/:id` , ROUTER_NAMES.MAIN_SERVICEMENU_BENEFITS_WRITE]} component={(props) => <MainServiceMenuBenefitsWrite {...props} />} />

        <Route exact path={ROUTER_NAMES.MAIN_CS_NOTICE_LIST} component={(props) => <MainCsNoticeList {...props} />} />
        <Route exact path={`${ROUTER_NAMES.MAIN_CS_NOTICE_VIEW}/:id`} component={(props) => <MainCsNoticeView {...props} />} />
        <Route exact path={[`${ROUTER_NAMES.MAIN_CS_NOTICE_WRITE}/:id` , ROUTER_NAMES.MAIN_CS_NOTICE_WRITE]} component={(props) => <MainCsNoticeWrite {...props} />} />
        <Route exact path={ROUTER_NAMES.MAIN_CS_FAQ_LIST} component={(props) => <MainCsFaqList {...props} />} />
        <Route exact path={`${ROUTER_NAMES.MAIN_CS_FAQ_VIEW}/:id`} component={(props) => <MainCsFaqView {...props} />} />
        <Route exact path={[`${ROUTER_NAMES.MAIN_CS_FAQ_WRITE}/:id` , ROUTER_NAMES.MAIN_CS_FAQ_WRITE]} component={(props) => <MainCsFaqWrite {...props} />} />

        <Route exact path={ROUTER_NAMES.MAIN_DOCUMENT_PACKAGE_LIST} component={(props) => <MainDocumentPackageList {...props} />} />
        <Route exact path={`${ROUTER_NAMES.MAIN_DOCUMENT_PACKAGE_VIEW}/:id`} component={(props) => <MainDocumentPackageView {...props} />} />
        <Route exact path={[`${ROUTER_NAMES.MAIN_DOCUMENT_PACKAGE_WRITE}/:id` , ROUTER_NAMES.MAIN_DOCUMENT_PACKAGE_WRITE]} component={(props) => <MainDocumentPackageWrite {...props} />} />

        <Route exact path={ROUTER_NAMES.MAIN_MEMBER_LIST} component={(props) => <MainMemberList {...props} />} />
        <Route exact path={`${ROUTER_NAMES.MAIN_MEMBER_VIEW}/:id`} component={(props) => <MainMemberView {...props} />} />

        <Route exact path={ROUTER_NAMES.MAIN_TERMS_SERVICE} component={(props) => <MainTermsService {...props} />} />
        <Route exact path={ROUTER_NAMES.MAIN_TERMS_PRIVACY} component={(props) => <MainTemrsPrivacy {...props} />} />
        <Route exact path={ROUTER_NAMES.MAIN_TERMS_CREDIT} component={(props) => <MainTemrsCredit {...props} />} />



      </Switch>
    </>
  )
}
export default GlobalRouter
