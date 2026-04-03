import React, { lazy } from 'react'
import { Switch, Route } from 'react-router-dom'
import ROUTER_NAMES from 'modules/consts/RouterConst'
// 투자 출자공고
const Admin_Notice_List_InvestBusiness = lazy(() =>
  import('_pub/pages/Admin_Notice_List_InvestBusiness').then((c) => c)
)
const Admin_Accept_State_List_InvestBusiness = lazy(() =>
  import('_pub/pages/Admin_Accept_State_List_InvestBusiness').then((c) => c)
)
const Admin_Accept_InvestBusiness = lazy(() => import('_pub/pages/Admin_Accept_InvestBusiness').then((c) => c))
const Admin_Accept_State_Detail_InvestBusiness = lazy(() =>
  import('_pub/pages/Admin_Accept_State_Detail_InvestBusiness').then((c) => c)
)
const Admin_Accept_InvestBusiness_Select_Pop = lazy(() =>
  import('_pub/pages/Admin_Accept_InvestBusiness_Select_Pop').then((c) => c)
)
const Admin_Accept_InvestBusiness_Manage_Pop = lazy(() =>
  import('_pub/pages/Admin_Accept_InvestBusiness_Manage_Pop').then((c) => c)
)

// 투자
const Admin_Invest_Request = lazy(() => import('_pub/pages/Admin_Invest_Request').then((c) => c))
const Admin_Invest_Result_Popup = lazy(() => import('_pub/pages/Admin_Invest_Result_Popup').then((c) => c))
const Admin_Invest_Detail = lazy(() => import('_pub/pages/Admin_Invest_Detail').then((c) => c))

// 홍보관
const Admin_Product_Main_web_01_1 = lazy(() => import('_pub/pages/Admin_Product_Main_web_01_1').then((c) => c))
const Admin_Product_Main_web_registration_01_1 = lazy(() =>
  import('_pub/pages/Admin_Product_Main_web_registration_01_1').then((c) => c)
)
const Admin_Popup_01_1 = lazy(() => import('_pub/pages/Admin_Popup_01_1').then((c) => c))
const Admin_Popup_registration_01_1 = lazy(() => import('_pub/pages/Admin_Popup_registration_01_1').then((c) => c))
const Admin_Enterprise_Theme_01_1 = lazy(() => import('_pub/pages/Admin_Enterprise_Theme_01_1').then((c) => c))
const Admin_Enterprise_theme_registration_01_1 = lazy(() =>
  import('_pub/pages/Admin_Enterprise_theme_registration_01_1').then((c) => c)
)
const Admin_Enterprise_theme_registration_popup_01_1 = lazy(() =>
  import('_pub/pages/Admin_Enterprise_theme_registration_popup_01_1').then((c) => c)
)
const Admin_Enterprise_theme_01_1_Orderpop = lazy(() =>
  import('_pub/pages/Admin_Enterprise_theme_01_1_Orderpop').then((c) => c)
)
const Admin_Product_Main_web_01_1_Orderpop = lazy(() =>
  import('_pub/pages/Admin_Product_Main_web_01_1_Orderpop').then((c) => c)
)
const Admin_Product_Main_mobile_01_1_Orderpop = lazy(() =>
  import('_pub/pages/Admin_Product_Main_mobile_01_1_Orderpop').then((c) => c)
)
const Admin_Event_Main_Web_registration_01_1 = lazy(() =>
  import('_pub/pages/Admin_Event_Main_Web_registration_01_1').then((c) => c)
)
const Admin_Enterprise_search_01_1 = lazy(() => import('_pub/pages/Admin_Enterprise_search_01_1').then((c) => c))
const Admin_Enterprise_search_suggestion_01_2 = lazy(() =>
  import('_pub/pages/Admin_Enterprise_search_suggestion_01_2').then((c) => c)
)
const Admin_Enterprise_search_suggestion_01_2_2_1 = lazy(() =>
  import('_pub/pages/Admin_Enterprise_search_suggestion_01_2_2_1').then((c) => c)
)

const Admin_Product_Menu_01_3 = lazy(() => import('_pub/pages/Admin_Product_Menu_01_3').then((c) => c))
const Admin_Corporate_Management_01_1 = lazy(() => import('_pub/pages/Admin_Corporate_Management_01_1').then((c) => c))
const Admin_Corporate_Management_01_2 = lazy(() => import('_pub/pages/Admin_Corporate_Management_01_2').then((c) => c))
const Admin_Corporate_Management_01_3 = lazy(() => import('_pub/pages/Admin_Corporate_Management_01_3').then((c) => c))
const Admin_Main_Product_01_1 = lazy(() => import('_pub/pages/Admin_Main_Product_01_1').then((c) => c))
const Admin_Main_Product_01_2 = lazy(() => import('_pub/pages/Admin_Main_Product_01_2').then((c) => c))
const Admin_Main_Product_01_3 = lazy(() => import('_pub/pages/Admin_Main_Product_01_3').then((c) => c))
const Admin_event_List_01_1 = lazy(() => import('_pub/pages/Admin_event_List_01_1').then((c) => c))
const Admin_event_Management_01_1 = lazy(() => import('_pub/pages/Admin_event_Management_01_1').then((c) => c))

const Admin_event_Current_situation_01_2 = lazy(() =>
  import('_pub/pages/Admin_event_Current_situation_01_2').then((c) => c)
)
const Admin_Sale_01_1 = lazy(() => import('_pub/pages/Admin_Sale_01_1').then((c) => c))

const Admin_event_Current_situation_01_4 = lazy(() =>
  import('_pub/pages/Admin_event_Current_situation_01_4').then((c) => c)
)
const Admin_sale_price_01_1 = lazy(() => import('_pub/pages/Admin_sale_price_01_1').then((c) => c))

const Admin_sale_price_Detail_01_1 = lazy(() => import('_pub/pages/Admin_sale_price_Detail_01_1').then((c) => c))

const Admin_agency_sale_price_01_1 = lazy(() => import('_pub/pages/Admin_agency_sale_price_01_1').then((c) => c))
const Admin_Inquiry_List_01_1 = lazy(() => import('_pub/pages/Admin_Inquiry_List_01_1').then((c) => c))

const Admin_FAQ_Write_01_1 = lazy(() => import('_pub/pages/Admin_FAQ_Write_01_1').then((c) => c))
const Admin_Inquiry_Write_01_1 = lazy(() => import('_pub/pages/Admin_Inquiry_Write_01_1').then((c) => c))
const Admin_Notification_Write_01_1 = lazy(() => import('_pub/pages/Admin_Notification_Write_01_1').then((c) => c))

const Admin_Notification_List_01_1 = lazy(() => import('_pub/pages/Admin_Notification_List_01_1').then((c) => c))

const Admin_FAQ_List_01_1 = lazy(() => import('_pub/pages/Admin_FAQ_List_01_1').then((c) => c))
const Admin_Product_Menu_01_1 = lazy(() => import('_pub/pages/Admin_Product_Menu_01_1').then((c) => c))
const Admin_Enterprise_Menu_01_1 = lazy(() => import('_pub/pages/Admin_Enterprise_Menu_01_1').then((c) => c))
const Admin_List_Skeleton = lazy(() => import('_pub/pages/Admin_List_Skeleton').then((c) => c))

const PubRouter = () => {
  return (
    <Switch>
      <Route exact path={'/pub/Admin_Invest_Request'} component={(props) => <Admin_Invest_Request {...props} />} />
      <Route
        exact
        path={'/pub/Admin_Invest_Result_Popup'}
        component={(props) => <Admin_Invest_Result_Popup {...props} />}
      />
      <Route exact path={'/pub/Admin_Invest_Detail'} component={(props) => <Admin_Invest_Detail {...props} />} />

      <Route
        exact
        path={'/pub/Admin_Product_Main_web_01_1'}
        component={(props) => <Admin_Product_Main_web_01_1 {...props} />}
      />

      <Route
        exact
        path={'/pub/Admin_Product_Main_web_registration_01_1'}
        component={(props) => <Admin_Product_Main_web_registration_01_1 {...props} />}
      />
      <Route exact path={'/pub/Admin_Popup_01_1'} component={(props) => <Admin_Popup_01_1 {...props} />} />
      <Route
        exact
        path={'/pub/Admin_Popup_registration_01_1'}
        component={(props) => <Admin_Popup_registration_01_1 {...props} />}
      />
      <Route
        exact
        path={'/pub/Admin_Enterprise_Theme_01_1'}
        component={(props) => <Admin_Enterprise_Theme_01_1 {...props} />}
      />
      <Route
        exact
        path={'/pub/Admin_Enterprise_theme_registration_01_1'}
        component={(props) => <Admin_Enterprise_theme_registration_01_1 {...props} />}
      />
      <Route
        exact
        path={'/pub/Admin_Enterprise_theme_registration_popup_01_1'}
        component={(props) => <Admin_Enterprise_theme_registration_popup_01_1 {...props} />}
      />

      <Route
        exact
        path={'/pub/Admin_Enterprise_theme_01_1_Orderpop'}
        component={(props) => <Admin_Enterprise_theme_01_1_Orderpop {...props} />}
      />
      <Route
        exact
        path={'/pub/Admin_Product_Main_web_01_1_Orderpop'}
        component={(props) => <Admin_Product_Main_web_01_1_Orderpop {...props} />}
      />
      <Route
        exact
        path={'/pub/Admin_Product_Main_mobile_01_1_Orderpop'}
        component={(props) => <Admin_Product_Main_mobile_01_1_Orderpop {...props} />}
      />
      <Route
        exact
        path={'/pub/Admin_Enterprise_search_01_1'}
        component={(props) => <Admin_Enterprise_search_01_1 {...props} />}
      />
      <Route
        exact
        path={'/pub/Admin_Enterprise_search_suggestion_01_2'}
        component={(props) => <Admin_Enterprise_search_suggestion_01_2 {...props} />}
      />
      <Route
        exact
        path={'/pub/Admin_Enterprise_search_suggestion_01_2_2_1'}
        component={(props) => <Admin_Enterprise_search_suggestion_01_2_2_1 {...props} />}
      />
      <Route
        exact
        path={'/pub/Admin_Corporate_Management_01_1'}
        component={(props) => <Admin_Corporate_Management_01_1 {...props} />}
      />
      <Route
        exact
        path={'/pub/Admin_Corporate_Management_01_2'}
        component={(props) => <Admin_Corporate_Management_01_2 {...props} />}
      />
      <Route
        exact
        path={'/pub/Admin_Corporate_Management_01_3'}
        component={(props) => <Admin_Corporate_Management_01_3 {...props} />}
      />
      <Route
        exact
        path={'/pub/Admin_Main_Product_01_1'}
        component={(props) => <Admin_Main_Product_01_1 {...props} />}
      />
      <Route
        exact
        path={'/pub/Admin_Main_Product_01_2'}
        component={(props) => <Admin_Main_Product_01_2 {...props} />}
      />
      <Route
        exact
        path={'/pub/Admin_Main_Product_01_3'}
        component={(props) => <Admin_Main_Product_01_3 {...props} />}
      />
      <Route
        exact
        path={'/pub/Admin_Event_Main_Web_registration_01_1'}
        component={(props) => <Admin_Event_Main_Web_registration_01_1 {...props} />}
      />
      <Route exact path={'/pub/Admin_event_List_01_1'} component={(props) => <Admin_event_List_01_1 {...props} />} />
      <Route
        exact
        path={'/pub/Admin_event_Management_01_1'}
        component={(props) => <Admin_event_Management_01_1 {...props} />}
      />
      <Route
        exact
        path={'/pub/Admin_event_Current_situation_01_2'}
        component={(props) => <Admin_event_Current_situation_01_2 {...props} />}
      />

      <Route exact path={'/pub/Admin_Sale_01_1'} component={(props) => <Admin_Sale_01_1 {...props} />} />

      <Route
        exact
        path={'/pub/Admin_event_Current_situation_01_4'}
        component={(props) => <Admin_event_Current_situation_01_4 {...props} />}
      />
      <Route exact path={'/pub/Admin_sale_price_01_1'} component={(props) => <Admin_sale_price_01_1 {...props} />} />

      <Route
        exact
        path={'/pub/Admin_sale_price_Detail_01_1'}
        component={(props) => <Admin_sale_price_Detail_01_1 {...props} />}
      />

      <Route
        exact
        path={'/pub/Admin_agency_sale_price_01_1'}
        component={(props) => <Admin_agency_sale_price_01_1 {...props} />}
      />
      <Route
        exact
        path={'/pub/Admin_Inquiry_List_01_1'}
        component={(props) => <Admin_Inquiry_List_01_1 {...props} />}
      />

      <Route exact path={'/pub/Admin_FAQ_Write_01_1'} component={(props) => <Admin_FAQ_Write_01_1 {...props} />} />

      <Route
        exact
        path={'/pub/Admin_Notification_Write_01_1'}
        component={(props) => <Admin_Notification_Write_01_1 {...props} />}
      />

      <Route
        exact
        path={'/pub/Admin_Notification_List_01_1'}
        component={(props) => <Admin_Notification_List_01_1 {...props} />}
      />

      <Route
        exact
        path={'/pub/Admin_Inquiry_Write_01_1'}
        component={(props) => <Admin_Inquiry_Write_01_1 {...props} />}
      />

      <Route exact path={'/pub/Admin_FAQ_List_01_1'} component={(props) => <Admin_FAQ_List_01_1 {...props} />} />
      <Route
        exact
        path={'/pub/Admin_Product_Menu_01_1'}
        component={(props) => <Admin_Product_Menu_01_1 {...props} />}
      />

      <Route
        exact
        path={'/pub/Admin_Product_Menu_01_3'}
        component={(props) => <Admin_Product_Menu_01_3 {...props} />}
      />

      <Route
        exact
        path={'/pub/Admin_Enterprise_Menu_01_1'}
        component={(props) => <Admin_Enterprise_Menu_01_1 {...props} />}
      />
      <Route exact path={'/pub/Admin_List_Skeleton'} component={(props) => <Admin_List_Skeleton {...props} />} />
      {/* 투자 출자공고 */}
      <Route
        exact
        path={'/pub/Admin_Notice_List_InvestBusiness'}
        component={(props) => <Admin_Notice_List_InvestBusiness {...props} />}
      />

      <Route
        exact
        path={'/pub/Admin_Accept_State_List_InvestBusiness'}
        component={(props) => <Admin_Accept_State_List_InvestBusiness {...props} />}
      />
      <Route
        exact
        path={'/pub/Admin_Accept_InvestBusiness'}
        component={(props) => <Admin_Accept_InvestBusiness {...props} />}
      />
      <Route
        exact
        path={'/pub/Admin_Accept_State_Detail_InvestBusiness'}
        component={(props) => <Admin_Accept_State_Detail_InvestBusiness {...props} />}
      />
      <Route
        exact
        path={'/pub/Admin_Accept_InvestBusiness_Select_Pop'}
        component={(props) => <Admin_Accept_InvestBusiness_Select_Pop {...props} />}
      />
      <Route
        exact
        path={'/pub/Admin_Accept_InvestBusiness_Manage_Pop'}
        component={(props) => <Admin_Accept_InvestBusiness_Manage_Pop {...props} />}
      />
    </Switch>
  )
}

export default PubRouter
