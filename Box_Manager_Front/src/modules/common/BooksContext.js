import React, { useState } from 'react'

const BooksContext = React.createContext({})
const { Provider } = BooksContext


// 1. 초기값 정의
const initData = {
  etnm: "", //신청 기업명
  pgrsSttsCdList: ["CLT01001", "CLT01002", "CLT01003", "CLT01004"], //진행상태 코드 목록 - CLT01001:접수완료, CLT01002:진행중, CLT01003:처리완료, CLT01004:취소
  clctIntt: "", // 담당기관명
  page: 1, //현재페이지
  // record: 5 //페이지당 보여줄 데이터
}

// 회원관리 리스트 초기값
const userInitData = {
  etnm: "", //기업명
  rpprNm: "", //이용기관 대표명
  sortBy: "001", //정렬기준 001:서비스가입일(기본값), 002:미수율높은순, 003:미수율낮은순, 004:높은등록순, 005:법인, 006:개인
  page: 1, //현재페이지
  searchInput : '',
  // "pageSize": 5, //하단표시 page size
  // "record": 5 //페이지당 보여줄 데이터
}

// 회원관리 엑셀다운로드
const userExcelInitData = {
  etnm: "", //기업명
  rpprNm: "", //이용기관 대표명
  sortBy: "001" //정렬기준 001:서비스가입일(기본값), 002:미수율높은순, 003:미수율낮은순, 004:높은등록순, 005:법인, 006:개인
}

// 회원관리 회원상세 초기값
const userDetailInitData = {
  utlinsttId: '', // 이용기관(회사)ID
  page: 1, // 페이징
  bsacNm: '' ,// 거래처명
  searchInput : '',
}

// 회원관리 회원상세 수금BOX 목록 초기값
const userDetailBooksInitData = {
  utlinsttId: "", //이용기관(회사) ID
  page: 1, //현재페이지
  bsacNm: '' ,// 거래처명
  searchInput : '',
  // "pageSize": 5, //하단표시 page size
  // "record": 5 //페이지당 보여줄 데이터
}

// 회원관리 회원상세 커머스BOX 목록 초기값
const userDetailCommerceInitData = {
  loginUtlinsttId: "", //이용기관(회사) ID
  page: 1, //현재페이지
  bsacNm: '',
  searchInput : '',
  // "pageSize": 5, //하단표시 page size
  // "record": 5 //페이지당 보여줄 데이터
}

// 회원관리 회원상세 수금BOX 상세 팝업 초기값
const userDetailBooksDetailInitData = {
  utlinsttId: "", //이용기관(회사) ID
  trnDlstId: "" //거래 명세서 ID
}

// 회원관리 회원상세 홍보관BOX 상세 팝업 초기값
const userDetailCommerceDetailInitData = {
  loginUtlinsttId:"" , //이용기관(회사) ID
  ordnInfoId: ""
}

// 추심신청 리스트 초기값
const collectionListInitData = {
  etnm: "", //신청 기업명
  pgrsSttsCdList: ["CLT01001", "CLT01002", "CLT01003", "CLT01004"], //진행상태 코드 목록 - CLT01001:접수완료, CLT01002:진행중, CLT01003:처리완료, CLT01004:취소
  clctIntt: "", // 담당기관명
  page: 1, //현재페이지
  searchInput : '',
  // pageSize: 5, //하단표시 page size
  // record: 5 //페이지당 보여줄 데이터
}


const BooksProvider = ({ children }) => {

  //2. state 정의
  const [listParam, setListParam] = useState(initData)
  const [userListParam, setUserListParam] = useState(userInitData)
  const [userExceListParam, setUserExcelListParam] = useState(userExcelInitData)
  const [userDetailParam, setUserDetailParam] = useState(userDetailInitData) // 회원상세 초기값
  const [userDetailBooksListParam, setUserDetailBooksListParam] = useState(userDetailBooksInitData) // 회원상세 수금 목록
  const [userDetailCommerceListParam, setUserDetailCommerceListParam] = useState(userDetailCommerceInitData) // 회원상세 커머스 목록
  const [userDetailBooksDetailParam, setUserDetailBooksDetailParam] = useState(userDetailBooksDetailInitData) // 회원상세 수금 상세
  const [userDetailCommerceDetailParam, setUserDetailCommerceDetailParam] = useState(userDetailCommerceDetailInitData) // 회원상세 홍보관 상세
  const [collectionListParam, setCollectionListParam] = useState(collectionListInitData)




  //3. action 정의
  const setListParams = (props) => {
    console.log('context: ', props)
    setListParam(props)
  }

  // 회원관리 리스트
  const setUserListParams = (props) => {
    if (props) {
      setUserListParam({
        ...userListParam,
        ...props
      })
    } else {
      setUserListParam(userListParam)
    }
  }

  const setUserExcelListParams = (props) => {
    if (props) {
      setUserExcelListParam({
        ...userExceListParam,
        ...props
      })
    } else {
      setUserExcelListParam(userExceListParam)
    }
  }

  // 회원관리 리스트
  const setUserDetailParams = (props) => {
    if (props) {
      setUserDetailParam({
        ...userDetailParam,
        ...props
      })
    } else {
      setUserDetailParam(userDetailParam)
    }
  }

  // 회원관리 수금 목록
  const setUserDetailBooksListParams = (props) => {
    if (props) {
      setUserDetailBooksListParam({
        ...userDetailBooksListParam,
        ...props
      })
    } else {
      setUserDetailBooksListParam(userDetailBooksListParam)
    }
  }

  // 회원관리 커머스 목록
  const setUserDetailCommerceListParams = (props) => {
    if (props) {
      setUserDetailCommerceListParam({
        ...userDetailCommerceListParam,
        ...props
      })
    } else {
      setUserDetailCommerceListParam(userDetailCommerceListParam)
    }
  }

  // 회원관리 수금 목록 상세
  const setUserDetailBooksDetailParams = (props) => {
    if (props) {
      setUserDetailBooksDetailParam({
        ...userDetailBooksDetailParam,
        ...props
      })
    } else {
      setUserDetailBooksDetailParam(userDetailBooksDetailParam)
    }
  }

  // 회원관리 홍보관 목록 상세
  const setUserDetailCommerceDetailParams = (props) => {
    if (props) {
      setUserDetailCommerceDetailParam({
        ...userDetailCommerceDetailParam,
        ...props
      })
    } else {
      setUserDetailCommerceDetailParam(userDetailCommerceDetailParam)
    }
  }

  // 추심관리 목록
  const setCollectionListParams = (props) => {
    if (props) {
      setCollectionListParam({
        ...collectionListParam,
        ...props
      })
    } else {
      setCollectionListParam(collectionListParam)
    }
  }



  //4. 넘겨줄 값 정의
  const value = {
    state: {
      listParam,
      userListParam,
      userExcelInitData,
      userDetailInitData,
      userDetailBooksListParam,
      userDetailCommerceListParam,
      userDetailBooksDetailParam,
      userDetailCommerceDetailParam,
      collectionListParam,
    },
    actions: {
      setListParams,
      setUserListParams,
      setUserExcelListParams,
      setUserDetailParams,
      setUserDetailBooksListParams,
      setUserDetailCommerceListParams,
      setUserDetailBooksDetailParams,
      setUserDetailCommerceDetailParams,
      setCollectionListParams,
    }
  }
  return <Provider value={value}>{children}</Provider>
}

export { BooksContext, BooksProvider }
