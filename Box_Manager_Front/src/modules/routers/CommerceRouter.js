import React, { lazy } from 'react'
import { Switch, Route } from 'react-router-dom'
import ROUTER_NAMES from 'modules/consts/RouterConst'

// 배너관리
const CommerceMainBannerList = lazy(() => import('pages/commerce/main/BannerList').then((c) => c))
const CommerceMainBannerWrite = lazy(() => import('pages/commerce/main/BannerWrite').then((c) => c))
const CommerceMainBannerView = lazy(() => import('pages/commerce/main/BannerView').then((c) => c))
const CommerceMainBindList = lazy(() => import('pages/commerce/main/BindList').then((c) => c))
const CommerceMainPopupList = lazy(() => import('pages/commerce/main/PopupList').then((c) => c)) // as-is
const CommerceMainPopupView = lazy(() => import('pages/commerce/main/PopupView').then((c) => c)) // as-is
const CommerceMainPopupWrite = lazy(() => import('pages/commerce/main/PopupWrite').then((c) => c))

// 팝업관리
const CommerceManagementPopup = lazy(() => import('pages/commerce/management/popup').then((c) => c))
const CommerceManagementPopupRegi = lazy(() => import('pages/commerce/management/popup/registration').then((c) => c))
// 검색관리
const CommerceManagementSearch = lazy(() => import('pages/commerce/management/search').then((c) => c))

// 회원관리
const CommerceUserListAgency = lazy(() => import('pages/commerce/user/ListAgency').then((c) => c))
const CommerceUserListSeller = lazy(() => import('pages/commerce/user/ListSeller').then((c) => c))

// 회원관리 > 판매사관리
const CommerceUserSeller = lazy(() => import('pages/commerce/user/seller').then((c) => c))

// 판매사 상품 관리
const CommerceProdList = lazy(() => import('pages/commerce/prod/List').then((c) => c))
const CommerceProdView = lazy(() => import('pages/commerce/prod/View').then((c) => c))
const CommerceManagementProductList = lazy(() => import('pages/commerce/management/product').then((c) => c))

// 이벤트관리
const CommerceEventList = lazy(() => import('pages/commerce/event/List').then((c) => c)) // as-is
const CommerceEventView = lazy(() => import('pages/commerce/event/View').then((c) => c))
const CommerceEventWrite = lazy(() => import('pages/commerce/event/Write').then((c) => c))
const CommerceEventManage = lazy(() => import('pages/commerce/event/Manage').then((c) => c))

const CommerceManagementEvent = lazy(() => import('pages/commerce/management/event').then((c) => c)) // 신규 이벤트 관리
const CommerceManagementEventREGIST = lazy(() => import('pages/commerce/management/event/registration').then((c) => c)) // 신규 이벤트 관리

// 판매금액관리
const CommercePriceSeller = lazy(() => import('pages/commerce/price/seller').then((c) => c))
const CommercePriceAgency = lazy(() => import('pages/commerce/price/agency').then((c) => c))
const CommercePriceEvent = lazy(() => import('pages/commerce/price/Event').then((c) => c))

// 주문관리
const CommerceOrderList = lazy(() => import('pages/commerce/order/List').then((c) => c))

// 고객지원관리
// const CommerceCsQnaList = lazy(() => import('pages/commerce/cs/QnaList').then((c) => c))
// const CommerceCsQnaView = lazy(() => import('pages/commerce/cs/QnaView').then((c) => c))
// const CommerceCsFaqList = lazy(() => import('pages/commerce/cs/FaqList').then((c) => c))
// const CommerceCsFaqWrite = lazy(() => import('pages/commerce/cs/FaqWrite').then((c) => c))

//고객지원관리
const CommerceCsQnaList = lazy(() => import('pages/commerce/cs/qna').then((c) => c))
const CommerceCsFaqList = lazy(() => import('pages/commerce/cs/faq').then((c) => c))
const CommerceCsNoticeList = lazy(() => import('pages/commerce/cs/notice').then((c) => c))
const CommerceCsQnaRegi = lazy(() => import('pages/commerce/cs/qna/registration').then((c) => c))
const CommerceCsFaqRegi = lazy(() => import('pages/commerce/cs/faq/registration').then((c) => c))
const CommerceCsNoticeRegi = lazy(() => import('pages/commerce/cs/notice/registration').then((c) => c))

//메인관리
const CommerceMainProduct = lazy(() => import('pages/commerce/main/product').then((c) => c))
const CommerceMainProductRegi = lazy(() => import('pages/commerce/main/product/registration').then((c) => c))
const CommerceMainCompany = lazy(() => import('pages/commerce/main/company').then((c) => c))
const CommerceMainCompanyRegi = lazy(() => import('pages/commerce/main/company/registration').then((c) => c))
const CommerceMainEvent = lazy(() => import('pages/commerce/main/event').then((c) => c))
const CommerceMainEventRegi = lazy(() => import('pages/commerce/main/event/registration').then((c) => c))

//메뉴관리
const CommerceManagementMenuProduct = lazy(() => import('pages/commerce/management/menu/product').then((c) => c))
const CommerceManagementMenuCompany = lazy(() => import('pages/commerce/management/menu/company').then((c) => c))
//테마기업관리
const CommerceManagementTheme = lazy(() => import('pages/commerce/management/theme').then((c) => c))
const CommerceManagementThemeRegi = lazy(() => import('pages/commerce/management/theme/registration').then((c) => c))

// prettier-ignore
const CommerceRouter = (props) => {
  return (
    <>
      <Switch>
        {/*<Route exact path={[`${ROUTER_NAMES.COMMERCE_MAIN_BANNER_LIST}/:type`, ROUTER_NAMES.COMMERCE_MAIN_BANNER_LIST]} component={(props) => <CommerceMainBannerList {...props} />} />*/}
        {/*<Route exact path={[`${ROUTER_NAMES.COMMERCE_MAIN_BANNER_WRITE}/:type/:id`, `${ROUTER_NAMES.COMMERCE_MAIN_BANNER_WRITE}/:type`]} component={(props) => <CommerceMainBannerWrite {...props} />} />*/}
        {/*<Route exact path={`${ROUTER_NAMES.COMMERCE_MAIN_BANNER_VIEW}/:type/:id`} component={(props) => <CommerceMainBannerView {...props} />} />*/}
        <Route exact path={ROUTER_NAMES.COMMERCE_MAIN_BANNER_LIST} component={(props) => <CommerceMainBannerList {...props} />} />
        <Route exact path={`${ROUTER_NAMES.COMMERCE_MAIN_BANNER_WRITE}/:type?/:id?`} component={(props) => <CommerceMainBannerWrite {...props} />} />
        <Route exact path={`${ROUTER_NAMES.COMMERCE_MAIN_BANNER_VIEW}/:id`} component={(props) => <CommerceMainBannerView {...props} />} />
        <Route exact path={ROUTER_NAMES.COMMERCE_MAIN_BIND_LIST} component={(props) => <CommerceMainBindList {...props} />} />

        <Route exact path={ROUTER_NAMES.COMMERCE_MAIN_PRODUCT} component={(props) => <CommerceMainProduct {...props} />} />
        <Route exact path={ROUTER_NAMES.COMMERCE_MAIN_PRODUCT_REGISTRATION} component={(props) => <CommerceMainProductRegi {...props} />} />
        <Route exact path={`${ROUTER_NAMES.COMMERCE_MAIN_PRODUCT_UPDATE}/:id`} component={(props) => <CommerceMainProductRegi {...props} />} />
        <Route exact path={ROUTER_NAMES.COMMERCE_MAIN_COMPANY} component={(props) => <CommerceMainCompany {...props} />} />
        <Route exact path={ROUTER_NAMES.COMMERCE_MAIN_COMPANY_REGISTRATION} component={(props) => <CommerceMainCompanyRegi {...props} />} />
        <Route exact path={`${ROUTER_NAMES.COMMERCE_MAIN_COMPANY_UPDATE}/:id`} component={(props) => <CommerceMainCompanyRegi {...props} />} />
        <Route exact path={`${ROUTER_NAMES.COMMERCE_MAIN_PRODUCT_UPDATE}/:id`} component={(props) => <CommerceMainProductRegi {...props} />} />
        <Route exact path={ROUTER_NAMES.COMMERCE_MAIN_EVENT} component={(props) => <CommerceMainEvent {...props} />} />
        <Route exact path={ROUTER_NAMES.COMMERCE_MAIN_EVENT_REGISTRATION} component={(props) => <CommerceMainEventRegi {...props} />} />
        <Route exact path={`${ROUTER_NAMES.COMMERCE_MAIN_EVENT_UPDATE}/:id`} component={(props) => <CommerceMainEventRegi {...props} />} />

        <Route exact path={ROUTER_NAMES.COMMERCE_MAIN_POPUP_LIST} component={(props) => <CommerceMainPopupList {...props} />} /> 
        <Route exact path={ROUTER_NAMES.COMMERCE_MANAGEMENT_POPUP} component={(props) => <CommerceManagementPopup {...props} />} />
        <Route exact path={ROUTER_NAMES.COMMERCE_MANAGEMENT_POPUP_REGISTRATION} component={(props) => <CommerceManagementPopupRegi {...props} />} />
        <Route exact path={`${ROUTER_NAMES.COMMERCE_MANAGEMENT_POPUP_UPDATE}/:id`} component={(props) => <CommerceManagementPopupRegi {...props} />} />

        <Route exact path={`${ROUTER_NAMES.COMMERCE_MAIN_POPUP_VIEW}/:id`} component={(props) => <CommerceMainPopupView {...props} />} />
        <Route exact path={[`${ROUTER_NAMES.COMMERCE_MAIN_POPUP_WRITE}/:id`, ROUTER_NAMES.COMMERCE_MAIN_POPUP_WRITE]} component={(props) => <CommerceMainPopupWrite {...props} />} />

        <Route exact path={ROUTER_NAMES.COMMERCE_MANAGEMENT_SEARCH} component={(props) => <CommerceManagementSearch {...props} />} />

        <Route exact path={ROUTER_NAMES.COMMERCE_USER_LIST_AGENCY} component={(props) => <CommerceUserListAgency {...props} />} />
        <Route exact path={ROUTER_NAMES.COMMERCE_USER_LIST_SELLER} component={(props) => <CommerceUserListSeller {...props} />} />
        <Route exact path={ROUTER_NAMES.COMMERCE_USER_SELLER} component={(props) => <CommerceUserSeller {...props} />} />

        <Route exact path={ROUTER_NAMES.COMMERCE_PROD_LIST} component={(props) => <CommerceProdList {...props} />} />
        <Route exact path={`${ROUTER_NAMES.COMMERCE_PROD_VIEW}/:id?`} component={(props) => <CommerceProdView {...props} />} />
        <Route exact path={ROUTER_NAMES.COMMERCE_MANAGEMENT_PRODUCT} component={(props) => <CommerceManagementProductList {...props} />} />

        <Route exact path={ROUTER_NAMES.COMMERCE_EVENT_LIST} component={(props) => <CommerceEventList {...props} />} />
        <Route exact path={`${ROUTER_NAMES.COMMERCE_EVENT_VIEW}/:id`} component={(props) => <CommerceEventView {...props} />} />
        <Route exact path={`${ROUTER_NAMES.COMMERCE_EVENT_WRITE}/:id?`} component={(props) => <CommerceEventWrite {...props} />} />
        <Route exact path={`${ROUTER_NAMES.COMMERCE_EVENT_MANAGE}/:id/:evntTtl/:statusCode`} component={(props) => <CommerceEventManage {...props} />} />
        <Route exact path={ROUTER_NAMES.COMMERCE_MANAGEMENT_EVENT} component={(props) => <CommerceManagementEvent {...props} />} />
        <Route exact path={ROUTER_NAMES.COMMERCE_MANAGEMENT_EVENT_REGISTRATION} component={(props) => <CommerceManagementEventREGIST {...props} />} />
        <Route exact path={`${ROUTER_NAMES.COMMERCE_MANAGEMENT_EVENT_REGISTRATION}/:id`} component={(props) => <CommerceManagementEventREGIST {...props} />} />

        <Route exact path={ROUTER_NAMES.COMMERCE_PRICE_SELLER} component={(props) => <CommercePriceSeller {...props} />} />
        <Route exact path={ROUTER_NAMES.COMMERCE_PRICE_AGENCY} component={(props) => <CommercePriceAgency {...props} />} />
        <Route exact path={ROUTER_NAMES.COMMERCE_PRICE_EVENT} component={(props) => <CommercePriceEvent {...props} />} />

        <Route exact path={ROUTER_NAMES.COMMERCE_ORDER_LIST} component={(props) => <CommerceOrderList {...props} />} />
        <Route exact path={ROUTER_NAMES.COMMERCE_CS_QNA_LIST} component={(props) => <CommerceCsQnaList {...props} />} />
        {/* <Route exact path={`${ROUTER_NAMES.COMMERCE_CS_QNA_VIEW}/:id`} component={(props) => <CommerceCsQnaView {...props} />} /> */}
        <Route exact path={ROUTER_NAMES.COMMERCE_CS_FAQ_LIST} component={(props) => <CommerceCsFaqList {...props} />} />
        {/* <Route exact path={`${ROUTER_NAMES.COMMERCE_CS_FAQ_WRITE}/:id?`} component={(props) => <CommerceCsFaqWrite {...props} />} /> */}
        <Route exact path={ROUTER_NAMES.COMMERCE_CS_NOTICE_LIST} component={(props) => <CommerceCsNoticeList {...props} />} />
        <Route exact path={`${ROUTER_NAMES.COMMERCE_CS_QNA_REGISTRATION}/:id?`} component={(props) => <CommerceCsQnaRegi {...props} />} />
        <Route exact path={`${ROUTER_NAMES.COMMERCE_CS_FAQ_REGISTRATION}/:id?`} component={(props) => <CommerceCsFaqRegi {...props} />} />
        <Route exact path={`${ROUTER_NAMES.COMMERCE_CS_NOTICE_REGISTRATION}/:id?`} component={(props) => <CommerceCsNoticeRegi {...props} />} />

        <Route exact path={ROUTER_NAMES.COMMERCE_MANAGEMENT_THEME} component={(props) => <CommerceManagementTheme {...props} />} />
        <Route exact path={ROUTER_NAMES.COMMERCE_MANAGEMENT_THEME_REGISTRATION} component={(props) => <CommerceManagementThemeRegi {...props} />} />
        <Route exact path={`${ROUTER_NAMES.COMMERCE_MANAGEMENT_THEME_UPDATE}/:id`} component={(props) => <CommerceManagementThemeRegi {...props} />} />
        
        <Route exact path={ROUTER_NAMES.COMMERCE_MANAGEMENT_MENU_PRODUCT} component={(props) => <CommerceManagementMenuProduct {...props} />} />
        <Route exact path={ROUTER_NAMES.COMMERCE_MANAGEMENT_MENU_COMPANY} component={(props) => <CommerceManagementMenuCompany {...props} />} />
      </Switch>
    </>
  )
}
export default CommerceRouter
