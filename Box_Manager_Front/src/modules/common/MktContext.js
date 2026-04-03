import React, { useState, useLayoutEffect } from 'react'

const MktContext = React.createContext({})
const { Provider } = MktContext

// banner params
const bannerParamData = {
  statusCode: 'filter_all', // 상태
  page: 1
}

// popup
const popupParamData = {
  statusCode: 'filter_all', // 상태
  page: 1
}

// bind params
const bindParamData = {
  page: 1, // 페이징
  pdfInfoCon: '' // 검색어
}

// agency params
const agencyParamData = {
  statusCode: '', // 에이전시 유형
  searchCompanyName: '', // 회사명
  page: 1 // 페이징
}

// seller params
const sellerParamData = {
  mmbrsttsId: '', // 판매사 유형
  searchCompanyName: '', // 회사명
  searchRprsntvName: '', // 대표자명
  page: 1 // 페이징
}

// prod params
const prodParamData = {
  // mmbrsttsId: '', // 판매사 유형
  searchCompanyName: '', // 회사명
  searchRprsntvName: '', // 대표자명
  page: 1 // 페이징
}
// prod detail params
const prodDetailParamData = {
  page: 1 // 페이징
}

// event params
const eventParamData = {
  pgstId: 'filter_all',
  page: 1 // 페이징
}

const eventManageParamData = {
  searchType: '',
  searchTtl: '', // 검색어
  tabActive: 'applyProd',
  pgstId: 'filter_all',
  page: 1 // 페이징
}

// qna params
const qnaParamdata = {
  page: 1,
  record: 200,
  inquTypeId: 'AIS00001,AIS00002,AIS00003,AIS00004,AIS00005,AIS00006', //문의유형
  inquSttId: '' //답변유형
}

const alertParamData = {
  active: false,
  type: '',
  msg: '',
  btnMsg: ''
}

const MktProvider = ({ children }) => {
  // current page check
  // const [currCategory, setCurrCategory] = useState(null)

  // main > banner
  const [currType, setCurrType] = useState('webMain')

  const [bannerParam, setBannerParam] = useState(bannerParamData)
  // main > popup
  const [popupParam, setPopupParam] = useState(popupParamData)
  // main > bind
  const [bindParam, setBindParam] = useState(bindParamData)

  // user > seller
  const [sellerParam, setSellerParam] = useState(sellerParamData)

  // user > agency
  const [agencyParam, setAgencyParam] = useState(agencyParamData)

  // user > prod
  const [prodParam, setProdParam] = useState(prodParamData)
  const [prodDetailParam, setProdDetailParam] = useState(prodDetailParamData)

  // user > event
  const [eventParam, setEventParam] = useState(eventParamData)
  const [eventManageParam, setEventManageParam] = useState(eventManageParamData)

  // cs > qna
  const [qnaParam, setQnaParam] = useState(qnaParamdata)

  //search
  const [searchType, setSearchType] = useState('search')
  const [productSearchType, setProductSearchType] = useState('productRegistration')

  const [commonAlertInfo, setCommonAlertInfo] = useState(alertParamData)
  
  // main > banner > popup
  const [popupCurrType, setPopupCurrType] = useState('webMain')

  // ===== main > banner
  // 배너 타입 설정
  const handleSetBannerCurrType = (props) => {
    setCurrType(props)
    setBannerParam({ ...bannerParamData })
  }

  // 배너 파라미터 설정
  const handleSetBannerParam = (props) => {
    setBannerParam({
      ...bannerParam,
      ...props
    })
  }

  // ===== main > popup
  const handleSetPopupParam = (props) => {
    if (props) {
      setPopupParam({
        ...popupParam,
        ...props
      })
    } else {
      setPopupParam(popupParamData)
    }
  }

  // ===== main > bind product
  const handleSetBindParam = (props) => {
    if (props) {
      setBindParam({
        ...bindParam,
        ...props
      })
    } else {
      setBindParam(bindParamData)
    }
  }

  // ====== seller handler
  const handleSellerParam = (props) => {
    // setSellerParam(sellerParamData)
    if (props) {
      setSellerParam({ ...sellerParam, ...props })
    } else {
      setSellerParam(sellerParamData)
    }
  }

  // ====== agency handler
  const handleAgencyParam = (props) => {
    if (props) {
      setAgencyParam({ ...agencyParam, ...props })
    } else {
      setAgencyParam(agencyParamData)
    }
  }

  // ====== prod handler
  const handleProdParam = (props) => {
    if (props) {
      setProdParam({ ...prodParam, ...props })
    } else {
      setProdParam(prodParamData)
    }
  }

  const handleProdDetailParam = (props) => {
    if (props) {
      setProdDetailParam({ ...prodDetailParam, ...props })
    } else {
      setProdDetailParam(prodDetailParamData)
    }
  }

  // ====== event handler
  const handleEventParam = (props) => {
    if (props) {
      setEventParam({ ...eventParam, ...props })
    } else {
      setEventParam(eventParamData)
    }
  }

  const handleEventManageParam = (props) => {
    if (props) {
      setEventManageParam({ ...eventManageParam, ...props })
    } else {
      setEventManageParam(eventManageParamData)
    }
  }

  // ===== qna param
  const handleQnaParam = (props) => {
    if (props) {
      setQnaParam({ ...qnaParam, ...props })
    } else {
      setQnaParam(qnaParamdata)
    }
  }

  //search
  const handleSetSearchCurrType = (props) => {
    setSearchType(props)
  }

  const handleSetProductSearchCurrType = (props) => {
    setProductSearchType(props)
  }

  // ===== main > banner > popup
  // 팝업 배너 타입 설정
  const handleSetPopupBannerCurrType = (props) => {
    setPopupCurrType(props)
    setBannerParam({ ...bannerParamData })
  }

  const value = {
    state: {
      currType,
      bannerParam,
      popupParam,
      agencyParam,
      sellerParam,
      prodParam,
      prodDetailParam,
      eventParam,
      eventManageParam,
      qnaParam,
      bindParam,
      commonAlertInfo,
      searchType,
      productSearchType,
      popupCurrType
    },
    actions: {
      handleSetBannerCurrType,
      handleSetBannerParam,
      handleSetPopupParam,
      handleAgencyParam,
      handleSellerParam,
      handleProdParam,
      handleProdDetailParam,
      handleEventManageParam,
      handleEventParam,
      handleQnaParam,
      handleSetBindParam,
      setCommonAlertInfo,
      handleSetSearchCurrType,
      handleSetProductSearchCurrType,
      handleSetPopupBannerCurrType
    }
  }
  return <Provider value={value}>{children}</Provider>
}

export { MktContext, MktProvider }
