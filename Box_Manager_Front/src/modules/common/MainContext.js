import React, { useState } from 'react'

const MainContext = React.createContext({})
const { Provider } = MainContext


/** ================================================
 *     고객센터관리 > 공지사항
 =================================================== */
// 고객센터관리 > 공지사항 > 목록 > 검색 타입
const noticeSearchKeyList = [
  {id: "searchContent", label: "제목+내용"},
  {id: "searchTitle", label: "제목"},
  {id: "searchWriter", label: "작성자"},
]

// 고객센터관리 > 공지사항 >  목록
const noticeInitListParams = {
  page: 1, //페이지
  searchContent: "", //검색어(제목 + 내용)
  searchTitle: "", //검색어(제목)
  searchWriter: "" //검색어(작성자)
}


/** ================================================
 *     고객센터관리 > FAQ
 =================================================== */
// 고객센터관리 > FAQ > 목록 > 검색 타입
const faqSearchKeyList = [
  {id: "searchContent", label: "제목+내용"},
  {id: "searchTitle", label: "제목"},
  {id: "searchWriter", label: "작성자"},
]

// 고객센터관리 > FAQ >  목록
const faqInitListParams = {
  page: 1, //페이지
  faqCtgyId: "", //카테고리 id
  searchContent: "", //검색어(제목 + 내용)
  searchTitle: "", //검색어(제목)
  searchWriter: "" //검색어(작성자)
}

/** ================================================
 *     회원사관리
 =================================================== */
// 회원사관리 > 목록 > 검색 타입
const memberSearchKeyList = [
  {id: "etnm", label: "회사명"},
  {id: "bzn", label: "사업자번호"},
  {id: "rpprNm", label: "대표자명"},
]

// 회원사관리 - 목록
const memberInitList = {
  page: 1, //페이지
  searchType: memberSearchKeyList[0].id, //검색 타입
  searchKeyword: "", //검색어
}


const MainProvider = ({ children }) => {

  /** ================================================
   *     더보기메뉴관리 > 카드이미지등록
   =================================================== */
  const [moreCardImgListParam, setMoreCardImgListParam] = useState({page: 1});

  //회원사관리 > 목록 조회 params
  const setMoreCardImgListParams = (params) => {
    if (params) {
      setMoreCardImgListParam({
        ...memberListParam,
        ...params
      })
    } else {  //목록 조건 초기화
      setMoreCardImgListParam({page: 1});
    }
  }

  /** ================================================
   *          서비스메뉴관리
   =================================================== */
  const [serviceListParam, setServiceListParam] = useState({page: 1});
  const setServiceListParams = (params) => {
    if(params){
      setServiceListParam(params);
    } else { //초기화
      setServiceListParam({page: 1});
    }
  }


  /** ================================================
   *          고객센터관리 > 공지사항
   =================================================== */
  const [noticeListParam, setNoticeListParam] = useState(noticeInitListParams);
  const [noticeSearchFilter, setNoticeSearchFilter] = useState({
    active: noticeSearchKeyList[0].id,
    list: noticeSearchKeyList
  })

  //고객센터관리 > 공지사항 > 목록 조회 params
  const setNoticeListParams = (params) => {
    if (params) {
      setNoticeListParam({
        ...noticeListParam,
        ...params
      })
    } else {  //목록 조건 초기화
      setNoticeListParam(noticeInitListParams)
    }
  }

  //고객센터관리 > 공지사항 > 목록 > 검색 조건
  const setNoticeSearchType = (type) => {
    setNoticeSearchFilter({...noticeSearchFilter, active: type});
  }

  //고객센터관리 > 공지사항 > 목록 > 검색어 입력
  const setNoticeSearchInputText = (text) => {
    let value = text.trim();
    setNoticeListParam({
      ...noticeInitListParams,
      [noticeSearchFilter.active]: value
    });
  }

  /** ================================================
   *          고객센터관리 > FAQ
   =================================================== */
  const [faqListParam, setFaqListParam] = useState(faqInitListParams);
  const [faqSearchFilter, setFaqSearchFilter] = useState({
    active: faqSearchKeyList[0].id,
    list: faqSearchKeyList
  })

  //고객센터관리 > FAQ > 목록 조회 params
  const setFaqListParams = (params) => {
    if (params) {
      setFaqListParam({
        ...faqListParam,
        ...params
      })
    } else {  //목록 조건 초기화
      setFaqListParam(faqInitListParams)
    }
  }

  //고객센터관리 > 공지사항 > 목록 > 검색 조건
  const setFaqSearchType = (type) => {
    setFaqSearchFilter({...faqSearchFilter, active: type});
  }

  //고객센터관리 > 공지사항 > 목록 > 검색어 입력
  const setFaqSearchInputText = (text) => {
    let value = text.trim();
    setFaqListParam({
      ...faqInitListParams,
      faqCtgyId: faqListParam.faqCtgyId,
      [faqSearchFilter.active]: value
    });
  }


  /** ================================================
   *          회원사관리
   =================================================== */
  const [memberListParam, setMemberListParam] = useState(memberInitList);
  const [memberSearchFilter, setMemberSearchFilter] = useState({
    active: memberSearchKeyList[0].id,
    list: memberSearchKeyList
  })

  //회원사관리 > 목록 조회 params
  const setMemberListParams = (params) => {
    if (params) {
      setMemberListParam({
        ...memberListParam,
        ...params
      })
    } else {  //목록 조건 초기화
      setMemberListParam(memberInitList)
    }
  }

  //회원사관리 > 목록 > 검색 조건
  const setMemberSearchType = (type) => {
    setMemberSearchFilter({...memberSearchFilter, active: type});
    setMemberListParam({...memberListParam, searchType: type, searchKeyword: ""});
  }

  //회원사관리 > 목록 > 검색어 입력
  const setMemberSearchInputText = (text) => {
    let value = text.trim();
    if(memberSearchFilter.active === "bzn"){ //사업자번호는 숫자만 입력 가능
      value = text.replaceAll(/[^0-9]/g, "");
    }

    setMemberListParam({...memberListParam, searchKeyword: value});
  }




  const value = {
    state: {
      /** ================================================
       *     더보기메뉴관리 > 카드이미지등록
       =================================================== */
      moreCardImgListParam,

      /** ================================================
       *          서비스메뉴관리
       =================================================== */
      serviceListParam,

      /** ================================================
       *          고객센터관리 > 공지사항
       =================================================== */
      noticeListParam,
      noticeInitListParams,
      noticeSearchFilter,

      /** ================================================
       *          고객센터관리 > FAQ
       =================================================== */
      faqListParam,
      faqInitListParams,
      faqSearchFilter,

      /** ================================================
       *          회원사관리
       =================================================== */
      memberListParam,
      memberSearchFilter,
    },
    actions: {
      /** ================================================
       *     더보기메뉴관리 > 카드이미지등록
       =================================================== */
      setMoreCardImgListParams,

      /** ================================================
       *          서비스메뉴관리
       =================================================== */
      setServiceListParams,

      /** ================================================
       *          고객센터관리 > 공지사항
       =================================================== */
      setNoticeListParams,
      setNoticeSearchType,
      setNoticeSearchInputText,

      /** ================================================
       *          고객센터관리 > FAQ
       =================================================== */
      setFaqListParams,
      setFaqSearchType,
      setFaqSearchInputText,

      /** ================================================
       *          회원사관리
       =================================================== */
      setMemberListParams,
      setMemberSearchType,
      setMemberSearchInputText,
    }
  }
  return <Provider value={value}>{children}</Provider>

}

export { MainContext, MainProvider }
