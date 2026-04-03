import ROUTER_NAMES from './consts/RouterConst'

// prettier-ignore
export const navList = [
  {
    id: 'invest',
    label: '투자BOX',
    url: '/invest/banner/MainTop',
    lnbList: [
      {
        id: 'banner',
        label: '배너관리',
        menuActive: false,
        subActive: false,
        subList: [
          { id: 'mainTop', label: '투자 메인(상단)', subMenuActive: false, url: '/invest/banner/MainTop' },
          { id: 'mainBottom', label: '투자 메인(하단)', subMenuActive: false, url: '/invest/banner/MainBottom' },
          {
            id: 'companyMainBottom',
            label: '기업정보메인(하단)',
            subMenuActive: false,
            url: '/invest/banner/CompanyMainBottom'
          },
          { id: 'companyMypage', label: '마이페이지(기업)', subMenuActive: false, url: '/invest/banner/CompanyMypage' },
          {
            id: 'investorMypage',
            label: '마이페이지(투자사)',
            subMenuActive: false,
            url: '/invest/banner/InvestorMypage'
          }
        ]
      },
      { id: 'notice', label: '공지사항', url: '/invest/notice/List' },
      { id: 'consult', label: '컨설팅', url: '/invest/consult/List' },
      { id: 'document', label: '문서관리', url: '/invest/document/List' },
      { id: 'qna', label: 'Q&A', url: '/invest/qna/List' },
      {
        id: 'static',
        label: '통계',
        menuActive: false,
        subActive: false,
        subList: [
          // { id: 'visitorStatus', label: '방문자 현황' },
          { id: 'visitor', label: '기간별 방문자', subMenuActive: false, url: '/invest/static/Visitor' },
          // { id: 'investStatus', label: '투자심사 현황' },
          {
            id: 'investReq',
            label: '진행 중인투자 심사요청\n(기업→투자사)',
            subMenuActive: false,
            url: '/invest/static/InvestReq'
          },
          {
            id: 'investOffer',
            label: '진행 중인 투자심사제안\n(투자사→기업)',
            subMenuActive: false,
            url: '/invest/static/InvestOffer'
          },
          { id: 'investComp', label: '투자심사 완료', subMenuActive: false, url: '/invest/static/InvestComp' }
        ]
      },
      { id: 'investUser', label: '투자사 회원 관리', url: '/invest/investUser/List' },
      { id: 'recommend', label: '추천기업 관리', url: '/invest/recommend/List' },
      {
        id: 'auditMngm',
        label: '투자희망신청현황',
        menuActive: false,
        subActive: false,
        subList: [
          { id: 'auditInfoList', label: '투자희망신청현황', subMenuActive: false, url: '/invest/auditMngm/AuditInfoList' },
        ]
      },
      {
        id: 'vcMngm',
        label: 'VC 관리',
        menuActive: false,
        subActive: false,
        subList: [
          { id: 'invmCnvrsListView', label: 'VC 관리', subMenuActive: false, url: '/invest/vcMngm/InvmCnvrsListView' },
          {
            id: 'InvmCnvrsUpStView',
            label: 'VC 상세(대기)',
            subMenuActive: false,
            url: '/invest/vcMngm/InvmCnvrsUpStView'
          },
          {
            id: 'InvmCnvrsUpStView2',
            label: 'VC 상세(승인완료 및 대기)',
            subMenuActive: false,
            url: '/invest/vcMngm/InvmCnvrsUpStView2'
          },
          {
            id: 'InvmCnvrsEtcInfoView',
            label: '기타 입력 항목 관리',
            subMenuActive: false,
            url: '/invest/vcMngm/InvmCnvrsEtcInfoView'
          }
        ]
      },
      {
        id: 'fundMngm',
        label: '펀드 관리',
        menuActive: false,
        subActive: false,
        subList: [
          { id: 'fundPrplInfo', label: '제안받은 펀드', subMenuActive: false, url: '/invest/fundMngm/FundPrplInfo' },
        ]
      },
      {
        id: 'rcmdEnprMngm',
        label: '추천기업 관리',
        menuActive: false,
        subActive: false,
        subList: [
          { id: 'prplCm', label: '추천기업 관리', subMenuActive: false, url: '/invest/rcmdEnprMngm/PrplCm' },
          { id: 'prplCmView', label: '추천받은 기업', subMenuActive: false, url: '/invest/rcmdEnprMngm/PrplCmView' }
        ]
      },
      {
        id: 'recomendRcept',
        label: 'IBK 벤처대출',
        menuActive: false,
        subActive: false,
        subList: [
          {
            id: 'agremVnentrInvtMgListView',
            label: '협약 벤처투자기관 관리',
            subMenuActive: false,
            url: '/invest/recomendRcept/AgremVnentrInvtMgListView'
          },
          {
            id: 'vnentrLonSgshPrtRceptView',
            label: 'IBK벤처대출 추천 접수(VC)',
            subMenuActive: false,
            url: '/invest/recomendRcept/VnentrLonSgshPrtRceptView'
          },
          {
            id: 'mgVnentrLonCmListView',
            label: 'IBK벤처대출 접수(기업)',
            subMenuActive: false,
            url: '/invest/recomendRcept/MgVnentrLonCmListView'
          },
          {
            id: 'MgVnentrLonCmDetailView',
            label: 'IBK벤처대출 추천 접수(기업)',
            subMenuActive: false,
            url: '/invest/recomendRcept/MgVnentrLonCmDetailView'
          }
        ]
      },
      {
        id: 'fncnBsns',
        label: '출자사업',
        menuActive: false,
        subActive: false,
        subList: [
          { id: 'fncnBsnsPbanList', label: '출자사업 공고', subMenuActive: false, url: '/invest/fncnBsns/FncnBsnsPbanList' },
        ]
      },
      {
        id: 'fncnBsns',
        label: '출자사업',
        menuActive: false,
        subActive: false,
        subList: [
          { id: 'fncnBsnsRcipList', label: '출자사업 접수현황', subMenuActive: false, url: '/invest/fncnBsns/FncnBsnsRcipList' },
        ]
      },
    ]
  },
  {
    id: 'commerce',
    label: '커머스BOX',
    url: '/commerce/main/BannerList',
    lnbList: [
      {
        id: 'main',
        label: '메인관리',
        menuActive: false,
        subActive: false,
        subList: [
          { id: 'prodList', label: '상품 메인', subMenuActive: false, url: '/commerce/main/product' },
          { id: 'companyList', label: '기업 메인', subMenuActive: false, url: '/commerce/main/company' },
          { id: 'eventList', label: '이벤트 메인', subMenuActive: false, url: '/commerce/main/event' }
        ]
      },
      {
        id: 'popup',
        label: '팝업관리',
        menuActive: false,
        subActive: false,
      },
      {
        id: 'theme',
        label: '테마기업관리',
        menuActive: false,
        subActive: false,
      },
      {
        id: 'search',
        label: '검색관리',
        menuActive: false,
        subActive: false,
      },
      {
        id: 'user',
        label: '회원관리',
        menuActive: false,
        subActive: false,
        subList: [
          {
            id: 'listAgency',
            label: '에이전시 등록 요청 관리',
            subMenuActive: false,
            url: '/commerce/user/ListAgency'
          },
          { id: 'listSeller', label: '판매사 관리', subMenuActive: false, url: '/commerce/user/seller' }
        ]
      },
      { id: 'prod', label: '판매사 상품 관리', menuActive: false, subActive: false, url: '/commerce/prod/List' },
      { id: 'event', label: '이벤트관리', menuActive: false, subActive: false, url: '/commerce/management/event' },
      {
        id: 'price',
        label: '판매금액관리',
        menuActive: false,
        subActive: false,
        subList: [
          { id: 'seller', label: '판매사 판매 금액', subMenuActive: false, url: '/commerce/price/seller' },
          { id: 'agency', label: '에이전시 판매 금액', subMenuActive: false, url: '/commerce/price/agency' },
          { id: 'priceEvent', label: '이벤트 별 총 판매 금액', subMenuActive: false, url: '/commerce/price/Event' }
        ]
      },
      { id: 'order', label: '주문관리', menuActive: false, subActive: false, url: '/commerce/order/List' },
      {
        id: 'cs',
        label: '고객지원관리',
        menuActive: false,
        subActive: false,
        subList: [
          { id: 'csQna', label: '문의 관리', subMenuActive: false, url: '/commerce/cs/qna' },
          { id: 'faq', label: 'FAQ', subMenuActive: false, url: '/commerce/cs/faq' },
          { id: 'commerceNotice', label: '공지사항', subMenuActive: false, url: '/commerce/cs/notice' }
        ]
      },
      {
        id: 'menu',
        label: '메뉴관리',
        menuActive: false,
        subActive: false,
        subList: [
          { id: 'productMenu', label: '상품 메뉴 관리', subMenuActive: false, url: '/commerce/management/menu/product' },
          { id: 'companyMenu', label: '기업 메뉴 관리', subMenuActive: false, url: '/commerce/management/menu/company' }
        ]
      }
    ]
  },
  {
    id: 'global',
    label: '해외진출BOX',
    url: '/global/consult/list',
    lnbList: [
      {
        id: 'localConsult',
        label: '현지금융 상담',
        menuActive: false,
        subActive: false,
        subList: [
          {
            id: 'applyList',
            label: '신청 내역',
            subMenuActive: false,
            url: '/global/consult/list'
          },
          {
            id: 'statisticsList',
            label: '접속 통계 (연도별)',
            subMenuActive: false,
            url: '/global/statistics/listYearly'
          },
          {
            id: 'statisticsList',
            label: '접속 통계 (월별)',
            subMenuActive: false,
            url: '/global/statistics/listMonthly'
          },
          {
            id: 'statisticsList',
            label: '접속 통계 (일자별)',
            subMenuActive: false,
            url: '/global/statistics/listDaily'
          }
        ]
      }
    ]
  },
  { id: 'admin', label: '관리자계정 관리', menuActive: false, url: '/admin/List' },
  {
    id: 'books',
    label: '장부(수금)관리 BOX',
    url: '/books/banner/main/List',
    lnbList: [
      {
        id: 'booksBanner',
        label: '배너관리',
        menuActive: false,
        subActive: false,
        subList: [
          { id: 'booksBannerMain', label: '메인배너', subMenuActive: false, url: '/books/banner/main/List' },
          { id: 'booksBannerAd', label: '광고배너', subMenuActive: false, url: '/books/banner/ad/List' },
        ]
      },
      { id: 'booksUser', label: '회원관리', menuActive: false, subActive: false, url: '/books/user/List' },
      { id: 'booksCollection', label: '추심관리', menuActive: false, subActive: false, url: '/books/collection/List' },
    ]
  },
  { id: 'admin', label: '관리자계정 관리', menuActive: false, url: '/admin/List' },
  {
    id: 'mainBox',
    label: '메인BOX',
    url: '/main/banner/businesschat/List',
    lnbList: [
      {
        id: 'mainBanner',
        label: '배너관리',
        menuActive: false,
        subActive: false,
        subList: [
          { id: 'mainBannerBizChat', label: '거래처채팅 (상단)', subMenuActive: false, url: '/main/banner/businesschat/List' },
          { id: 'mainBannerMore', label: '더보기 (중간)', subMenuActive: false, url: '/main/banner/more/List' },
          { id: 'mainBannerCardLimit', label: '카드한도조회 (하단)', subMenuActive: false, url: '/main/banner/cardlimit/List' },
          { id: 'mainBannerService', label: '서비스 (상단)', subMenuActive: false, url: '/main/banner/service/List' },
          { id: 'mainBannerCommon', label: 'PC화면배너 (우측)', subMenuActive: false, url: '/main/banner/common/List' },
        ]
      },

      {
        id: 'mainMoreMenu',
        label: '더보기메뉴관리',
        menuActive: false,
        subActive: false,
        subList: [
          { id: 'mainMoreLinkMenu', label: '링크메뉴설정', subMenuActive: false, url: '/main/moremenu/linkmenu/List' },
          { id: 'mainMoreCardImg', label: '카드이미지등록', subMenuActive: false, url: '/main/moremenu/cardimg/List' },
        ]
      },

      {
        id: 'mainServiceMenu',
        label: '서비스메뉴관리',
        menuActive: false,
        subActive: false,
        subList: [
          { id: 'mainServiceEvent', label: '이벤트', subMenuActive: false, url: '/main/servicemenu/event/List' },
          { id: 'mainServiceFinance', label: '금융이벤트', subMenuActive: false, url: '/main/servicemenu/finance/List' },
          { id: 'mainServiceBenefits', label: '유용한혜택', subMenuActive: false, url: '/main/servicemenu/benefits/List' },
        ]
      },

      {
        id: 'mainCs',
        label: '고객센터관리',
        menuActive: false,
        subActive: false,
        subList: [
          { id: 'mainCsNotice', label: '공지사항', subMenuActive: false, url: '/main/cs/notice/List' },
          { id: 'mainCsFaq', label: 'FAQ(자주하는질문)', subMenuActive: false, url: '/main/cs/faq/List' },
        ]
      },

      {
        id: 'mainDocument',
        label: '전자문서함관리',
        menuActive: false,
        subActive: false,
        subList: [
          { id: 'mainDocPackage', label: '전송꾸러미 설정', subMenuActive: false, url: '/main/document/package/List' },
        ]
      },

      {
        id: 'mainMember',
        label: '회원사관리',
        menuActive: false,
        subActive: false,
        url: '/main/member/List',
      },

      {
        id: 'mainTerms',
        label: '약관관리',
        menuActive: false,
        subActive: false,
        subList: [
          { id: 'mainTermsJoin', label: '회원가입', subMenuActive: false, url: '/main/terms/Join' },
          { id: 'mainTermsPrivacy', label: '개인정보처리방침', subMenuActive: false, url: '/main/terms/Privacy' },
        ]
      },
    ]
  },
  {
    id: 'dashboard',
    label: '대시보드',
    url: '/dashboard/main',
    lnbList: [
      { id: 'dashboardMain', label: '메인 BOX', menuActive: false, subActive: false, url: '/dashboard/main' },
      { id: 'dashboardBooks', label: '장부(수금)관리 BOX', menuActive: false, subActive: false, url: '/dashboard/books' },
    ]
  },

]

// date formatter
/** date format i.e. : "20220526035822", => 2022-05-26 03:58 (22)  */
export const dateFormat = (data, short = false) => {
  if (!data) return
  let dataStr = data.toString()
  let year = dataStr.slice(0, 4)
  let month = dataStr.slice(4, 6)
  let date = dataStr.slice(6, 8)
  let h = dataStr.slice(8, 10)
  let m = dataStr.slice(10, 12)

  let dates = `${year}-${month}-${date}`
  let times = `${h}:${m}`

  if (short) return `${dates}`

  return `${dates} ${times}`
}

// date formatter2
/** date format i.e. : Tue Jun 14 2022 15:20:41 GMT+0900 => 20220614 */
export const dateFormatToNumber = (data, time) => {
  let newDate = ''
  if (typeof data === 'string') {
    newDate = new Date(data)
  } else {
    newDate = data
  }
  let year = newDate.getFullYear().toString()
  let month = newDate.getMonth() + 1
  let date = newDate.getDate()
  let hour = newDate.getHours()
  let min = newDate.getMinutes()
  if (month < 10) month = '0' + month
  if (date < 10) date = '0' + date

  if (time) {
    return `${year}-${month}-${date} ${hour}:${min}`
  } else {
    return year + month + date
  }
}

/** ( unitSplit = true )date format i.e. : Tue Jun 14 2022 15:20:41 GMT+0900 => 2022년 06월 14일 */
export const dateFormatUnitSplit = (data) => {
  let dateStr = dateFormatToNumber(data).toString()
  let year = dateStr.slice(0, 4)
  let month = dateStr.slice(4, 6)
  let date = dateStr.slice(6, 8)

  return `${year}년 ${month}월 ${date}일`
}

/** date format i.e. : 2022-06-21 00:00:00.0 => 2022.06.21 */
export const termFormatter = (date) => {
  if (typeof date !== 'string') {
    return '-'
  } else {
    let d = date.slice(0, 10)
    let dList = d.split('-')
    return dList[0] + '.' + dList[1] + '.' + dList[2]
  }
}

// calculate file size
export const getTotalFileSize = (fileList, useFixed = true) => {
  if (fileList.length === 0) return 0
  let totalSize = 0
  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i]
    const fileSize = file['fileSize']
    totalSize = totalSize + fileSize
  }
  if (useFixed === false) return totalSize
  return (totalSize / 1048576).toFixed(2)
}

// 게시판 NO
export const getTotalNumberBoard = (total, page, record, index) => {
  let number = total - (page - 1) * record - index
  return number < 10 ? '0' + number : number
}

// 게시판 NO
export const getTotalNumberBoardReverse = (page, record, index) => {
  let number = (page - 1) * record + index + 1
  return number < 10 ? '0' + number : number
}

//상태값 클래스 변경
export const fnStatus = (stat) => {
  let str = ''
  switch (stat) {
    case '공개':
      str = 'public'
      break
    case '대기':
      str = 'ready'
      break
    case '종료':
      str = 'close'
      break
    case '비공개':
      str = 'private'
      break
  }
  return str
}

export default {
  navList,
  dateFormat,
  getTotalFileSize
}
