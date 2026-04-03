# IBK BOX Manager — 관리자 프론트엔드

## _본 프로젝트는 IBK기업은행 내부 관리자 서비스입니다._

> IBK기업은행의 통합 서비스 플랫폼 **IBK BOX** 의 관리자(백오피스) 프론트엔드 웹 애플리케이션입니다.  
> 투자박스, 커머스박스, 해외진출박스, 수금관리박스, 메인박스 등 IBK BOX 전 서비스를 통합 관리합니다.

---

## 📌 프로젝트 개요

| 항목            | 내용                           |
| --------------- | ------------------------------ |
| 프로젝트명      | IBK BOX Manager Frontend       |
| 패키지명        | `ibkbox_box_manager_front_i`   |
| 버전            | `0.2.5`                        |
| 프레임워크      | React 17 (Create React App)    |
| 스타일          | MUI (Material UI v5) + SCSS    |
| 상태관리        | React Context API              |
| 라우팅          | React Router DOM v5            |
| HTTP 클라이언트 | Axios (도메인별 인스턴스 분리) |

---

## 🛠 기술 스택

### Core

- **React** `^17.0.2` — UI 컴포넌트 라이브러리
- **react-router-dom** `^5.3.0` — SPA 라우팅 (Code-splitting + Lazy loading)
- **Axios** `^0.21.4` — REST API 통신 (서비스 도메인별 인스턴스 분리)
- **env-cmd** `^10.1.0` — 환경별 `.env` 파일 관리

### UI / Design

- **@mui/material** `^5.14.15` — Material UI 컴포넌트
- **@mui/icons-material** `^5.14.16` — MUI 아이콘
- **@mui/x-date-pickers** `^6.17.0` — 날짜 선택 컴포넌트
- **@emotion/react** / **@emotion/styled** — MUI 스타일 엔진
- **sass** `^1.77.4` — SCSS 컴파일
- **swiper** `^6.8.1` — 슬라이더/캐러셀
- **@toast-ui/react-editor** `^3.2.3` — 리치 텍스트 에디터 (WYSIWYG)
- **@toast-ui/editor-plugin-color-syntax** `3.1.0` — 에디터 컬러 플러그인

### 데이터 & 차트

- **chart.js** `^3.6.2` + **react-chartjs-2** `^4.0.0` — 데이터 시각화 (대시보드)

### 날짜 & 유틸리티

- **dayjs** `^1.11.10` / **moment** `^2.29.1` / **date-fns** `^2.28.0` — 날짜 처리
- **jspdf** `^2.5.1` + **html2canvas** `^1.4.1` — PDF 내보내기
- **react-to-print** `^2.15.1` — 프린트 기능
- **react-beautiful-dnd** `^13.1.0` — 드래그 앤 드롭
- **react-device-detect** `^2.0.0` — 디바이스 감지 (IE 미지원 처리)

### 개발 도구

- **ESLint** + **Prettier** — 코드 품질 및 포맷팅
- **http-proxy-middleware** `^2.0.1` — 개발 환경 API 프록시
- **Jest** + **@testing-library/react** — 단위 테스트

---

## 📁 프로젝트 구조

```
Box_Front_Manager/
├── public/                        # 정적 자산
│
└── src/
    ├── App.js                     # 앱 루트 (Context Provider 조합)
    ├── Routing.js                 # 최상위 라우터 (Lazy Loading 적용)
    │
    ├── assets/                    # 이미지, 아이콘 등 정적 자원
    ├── fonts/                     # 커스텀 폰트
    │
    ├── components/                # 공통 UI 컴포넌트
    │   └── common/                # Loading, 공통 레이아웃 등
    │
    ├── layouts/                   # 레이아웃 컴포넌트 (GNB, 사이드바 등)
    │
    ├── _pub/                      # 공용 컴포넌트 라이브러리
    │
    ├── modules/                   # 비즈니스 로직 모듈
    │   ├── common/                # React Context (전역 상태)
    │   │   ├── UserContext.js     # 사용자 인증 Context
    │   │   ├── InvestContext.js   # 투자박스 Context
    │   │   ├── MktContext.js      # 커머스박스 Context
    │   │   ├── GlobalBizContext.js# 해외진출박스 Context
    │   │   ├── AdminContext.js    # 관리자 Context
    │   │   ├── BooksContext.js    # 수금관리박스 Context
    │   │   └── MainContext.js     # 메인박스 Context
    │   ├── consts/                # 상수 정의
    │   │   ├── Api.js             # 공통 API 엔드포인트
    │   │   ├── InvestApi.js       # 투자박스 API 엔드포인트
    │   │   ├── MktApi.js          # 커머스박스 API 엔드포인트
    │   │   ├── BooksApi.js        # 수금관리 API 엔드포인트
    │   │   ├── MainApi.js         # 메인박스 API 엔드포인트
    │   │   ├── GlobalBizApi.js    # 해외진출 API 엔드포인트
    │   │   ├── AdminApi.js        # 관리자 API 엔드포인트
    │   │   ├── RouterConst.js     # 라우터 경로명 정의
    │   │   └── SessionCheck.js    # 세션 체크 설정
    │   ├── routers/               # 도메인별 라우터 모듈
    │   │   ├── LoginRouter.js
    │   │   ├── AdminRouter.js
    │   │   ├── InvestRouter.js
    │   │   ├── CommerceRouter.js
    │   │   ├── GlobalRouter.js
    │   │   ├── BooksRouter.js
    │   │   ├── MainRouter.js
    │   │   ├── DashboardRouter.js
    │   │   └── PubRouter.js
    │   ├── utils/                 # 유틸리티 함수
    │   │   ├── AxiosInvest.js     # 투자박스 Axios 인스턴스
    │   │   ├── AxiosCommerce.js   # 커머스박스 Axios 인스턴스
    │   │   ├── AxiosBooks.js      # 수금관리 Axios 인스턴스
    │   │   ├── AxiosMain.js       # 메인박스 Axios 인스턴스
    │   │   ├── AxiosAdmin.js      # 관리자 Axios 인스턴스
    │   │   ├── AxiosGlobalBiz.js  # 해외진출 Axios 인스턴스
    │   │   ├── CommonAxios.js     # 공통 Axios
    │   │   ├── CommonUtils.js     # 공통 유틸
    │   │   ├── DateUtil.js        # 날짜 유틸
    │   │   ├── StringUtils.js     # 문자열 유틸
    │   │   └── ResponseUtils.js   # 응답 처리 유틸
    │   ├── fns/                   # 함수형 모듈
    │   ├── hooks/                 # 커스텀 React Hooks
    │   └── rsa/                   # RSA 암호화 모듈
    │
    ├── pageComponents/            # 페이지 세부 컴포넌트
    │
    └── pages/                     # 페이지 컴포넌트 (라우트 단위)
        ├── Login.js               # 로그인
        ├── admin/                 # 관리자 계정 관리
        ├── invest/                # 투자박스 관리
        │   ├── banner/            # 배너 관리
        │   ├── notice/            # 공지사항
        │   ├── consult/           # 컨설팅 관리
        │   ├── document/          # 문서 관리
        │   ├── qna/               # QnA 관리
        │   ├── investUser/        # 투자사 회원 관리
        │   ├── company/           # 기업 관리
        │   ├── static/            # 통계
        │   ├── vcMngm/            # VC 관리
        │   ├── fundMngm/          # 펀드 관리
        │   ├── rcmdEnprMngm/      # 추천기업 관리
        │   ├── recomendRcept/     # IBK 벤처대출 관리
        │   ├── auditMngm/         # 투자심사 관리
        │   └── fncnBsns/          # 출자사업 관리
        ├── commerce/              # 커머스박스 관리
        │   ├── main/              # 메인 관리
        │   ├── management/        # 상품/이벤트/테마/팝업 관리
        │   ├── user/              # 회원 관리
        │   ├── prod/              # 상품 관리
        │   ├── event/             # 이벤트 관리
        │   ├── price/             # 판매금액 관리
        │   ├── order/             # 주문 관리
        │   └── cs/                # 고객지원 (QnA/FAQ/공지)
        ├── global/                # 해외진출박스 관리
        │   ├── consult/           # 상담 관리
        │   └── statistics/        # 통계
        ├── books/                 # 수금관리박스 관리
        │   ├── banner/            # 배너 관리
        │   ├── user/              # 회원 관리
        │   └── collection/        # 추심 관리
        └── main/                  # 메인박스 관리
            ├── banner/            # 배너 관리 (채팅/더보기/카드한도/서비스/공통)
            ├── moremenu/          # 더보기 메뉴 관리
            ├── servicemenu/       # 서비스 메뉴 관리 (이벤트/금융서비스/혜택)
            ├── cs/                # 고객지원 (공지사항/FAQ)
            ├── document/          # 전송꾸러미 설정
            ├── member/            # 회원사 관리
            └── terms/             # 약관 관리
```

---

## 🌐 관리 서비스 도메인

### 1. 투자박스 (InvestBOX) — `/invest`

| 메뉴             | 경로                      | 설명                                    |
| ---------------- | ------------------------- | --------------------------------------- |
| 배너 관리        | `/invest/banner/*`        | 투자 메인·기업정보·마이페이지 배너 관리 |
| 공지사항         | `/invest/notice/*`        | 공지사항 목록·상세·등록                 |
| 컨설팅           | `/invest/consult/*`       | 컨설팅 의뢰 목록·상세                   |
| 문서 관리        | `/invest/document/*`      | 문서 목록·상세·등록                     |
| QnA              | `/invest/qna/*`           | QnA 목록·상세                           |
| 투자사 회원 관리 | `/invest/investUser/*`    | 투자사 회원 목록                        |
| 기업 관리        | `/invest/company/*`       | 추천기업·해외투자희망기업               |
| 통계             | `/invest/static/*`        | 방문자·투자심사제안·요청·완료 통계      |
| VC 관리          | `/invest/vcMngm/*`        | VC 전환 신청 관리                       |
| 펀드 관리        | `/invest/fundMngm/*`      | 펀드 제안 관리·평가 결과 등록           |
| 추천기업 관리    | `/invest/rcmdEnprMngm/*`  | 투자기업 추천 이력 관리                 |
| IBK 벤처대출     | `/invest/recomendRcept/*` | 협약 VC 관리·벤처대출 추천접수          |
| 투자심사 관리    | `/invest/auditMngm/*`     | 투자희망신청현황 목록·상세              |
| 출자사업 관리    | `/invest/fncnBsns/*`      | 출자사업 공고·접수 관리                 |

### 2. 커머스박스 (CommerceBOX) — `/commerce`

| 메뉴          | 경로                           | 설명                                        |
| ------------- | ------------------------------ | ------------------------------------------- |
| 메인 관리     | `/commerce/main/*`             | 배너·묶음상품·팝업·상품메인·기업메인·이벤트 |
| 회원 관리     | `/commerce/user/*`             | 에이전시·판매자 회원 관리                   |
| 상품 관리     | `/commerce/management/product` | 상품 목록 관리                              |
| 이벤트 관리   | `/commerce/management/event/*` | 이벤트 등록·수정                            |
| 팝업 관리     | `/commerce/management/popup/*` | 팝업 등록·수정                              |
| 테마 관리     | `/commerce/management/theme/*` | 테마기업 관리                               |
| 판매금액 관리 | `/commerce/price/*`            | 판매사별·에이전시·이벤트별 금액 관리        |
| 주문 관리     | `/commerce/order/List`         | 주문 목록                                   |
| 고객지원      | `/commerce/cs/*`               | QnA·FAQ·공지사항 관리                       |

### 3. 해외진출박스 (GlobalBOX) — `/global`

| 메뉴      | 경로                   | 설명                    |
| --------- | ---------------------- | ----------------------- |
| 상담 관리 | `/global/consult/*`    | 해외진출 상담 목록·상세 |
| 통계      | `/global/statistics/*` | 연간·월간·일별 통계     |

### 4. 수금관리박스 (BooksBOX) — `/books`

| 메뉴      | 경로                  | 설명                   |
| --------- | --------------------- | ---------------------- |
| 배너 관리 | `/books/banner/*`     | 메인배너·광고배너 관리 |
| 회원 관리 | `/books/user/*`       | 회원 목록·상세         |
| 추심 관리 | `/books/collection/*` | 추심 목록·상세         |

### 5. 메인박스 (MainBOX) — `/main`

| 메뉴            | 경로                  | 설명                                        |
| --------------- | --------------------- | ------------------------------------------- |
| 배너 관리       | `/main/banner/*`      | 거래처채팅·더보기·카드한도·서비스·공통 배너 |
| 더보기 메뉴     | `/main/moremenu/*`    | 링크메뉴·카드이미지 관리                    |
| 서비스 메뉴     | `/main/servicemenu/*` | 이벤트·금융서비스·혜택 관리                 |
| 고객지원        | `/main/cs/*`          | 공지사항·FAQ 관리                           |
| 전송꾸러미 설정 | `/main/document/*`    | 문서 패키지 관리                            |
| 회원사 관리     | `/main/member/*`      | 회원사 목록·상세                            |
| 약관 관리       | `/main/terms/*`       | 이용약관·개인정보처리방침·신용정보 관리     |

### 6. 관리자 계정 — `/admin`

| 메뉴           | 경로           | 설명                       |
| -------------- | -------------- | -------------------------- |
| 계정 관리      | `/admin/List`  | 관리자 계정 목록           |
| 계정 등록/수정 | `/admin/Write` | 관리자 계정 등록·수정·상세 |

### 7. 대시보드 — `/dashboard`

| 메뉴          | 경로               | 설명                   |
| ------------- | ------------------ | ---------------------- |
| 통합 대시보드 | `/dashboard/main`  | 전체 현황 대시보드     |
| 수금 대시보드 | `/dashboard/books` | 수금관리 전용 대시보드 |

---

## ⚙️ 환경 설정

### 환경 파일

프로젝트는 `env-cmd`를 사용하여 환경별 `.env` 파일을 관리합니다.

| 파일               | 용도           |
| ------------------ | -------------- |
| `.env.development` | 로컬 개발 환경 |
| `.env.stage`       | 스테이징 환경  |
| `.env.production`  | 운영 환경      |

### 주요 환경 변수

```
REACT_APP_API_URL=           # 백엔드 API 서버 URL
REACT_APP_RENDER_TYPE=       # 렌더 타입 (개발/스테이지/운영 구분용)
REACT_APP_RENDER_VER=        # 버전 정보
```

---

## 🚀 실행 방법

### 사전 요구사항

- Node.js (권장: v14 이상)
- npm

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm start
# env-cmd -f .env.development react-scripts start
```

### 빌드

```bash
# 개발 빌드
npm run build-dev

# 스테이징 빌드
npm run build-stage

# 운영 빌드
npm run build-prod
```

### 코드 품질

```bash
# ESLint 검사
npm run lint

# ESLint 자동 수정
npm run lint-fix

# Prettier 전체 포맷팅
npm run prettier-all
```

### 테스트

```bash
npm test
```

---

## 🏗 아키텍처 특이사항

### 1. Context API 기반 전역 상태 관리

```
App.js → CommonProvider (contexts 배열 순서로 중첩)
  ├─ UserProvider        # 사용자 인증 정보
  ├─ InvestProvider      # 투자박스 전역 상태
  ├─ MktProvider         # 커머스박스 전역 상태
  ├─ GlobalBizProvider   # 해외진출박스 전역 상태
  ├─ AdminProvider       # 관리자 전역 상태
  ├─ BooksProvider       # 수금관리박스 전역 상태
  └─ MainProvider        # 메인박스 전역 상태
```

### 2. 도메인별 Axios 인스턴스 분리

각 서비스 도메인마다 별도의 Axios 인스턴스를 사용하여 기본 URL, 인증 헤더, 에러 처리를 독립적으로 관리합니다.

```
AxiosInvest.js   → 투자박스 API 전용
AxiosCommerce.js → 커머스박스 API 전용
AxiosBooks.js    → 수금관리박스 API 전용
AxiosMain.js     → 메인박스 API 전용
AxiosAdmin.js    → 관리자 API 전용
AxiosGlobalBiz.js→ 해외진출박스 API 전용
```

### 3. Lazy Loading 라우터

모든 라우터 모듈은 `React.lazy()`로 코드 분할되어 초기 로딩 성능 최적화가 적용되어 있습니다.

### 4. IE 브라우저 미지원

`react-device-detect`를 통해 IE 접속 시 미지원 안내 메시지를 표시합니다.

### 5. RSA 암호화 모듈

`modules/rsa/` 디렉토리에 로그인 등 민감 데이터 암호화를 위한 RSA 암호화 모듈이 분리되어 있습니다.

### 6. Toast UI 에디터

공지사항, 약관 등 HTML 콘텐츠 작성에 `@toast-ui/react-editor`가 적용되어 있으며, 컬러 신택스 플러그인이 함께 사용됩니다.

### 7. SSL 인증서

`_wildcard.ibkbox.net+2.pem` / `_wildcard.ibkbox.net+2-key.pem` 파일이 루트에 포함되어 있습니다. (로컬 HTTPS 개발용)

---

## 📂 컴포넌트 설계 계층

```
공용 컴포넌트 (components/common/)
    ↓  Loading, 공통 레이아웃 등 전역 기본 요소
레이아웃 (layouts/)
    ↓  GNB(상단 내비게이션), 사이드바, 페이지 레이아웃 프레임
_pub 컴포넌트 (_pub/)
    ↓  재사용 가능한 공용 컴포넌트 모음
페이지 컴포넌트 (pageComponents/)
    ↓  특정 페이지 전용 복합 컴포넌트
페이지 (pages/)
    ↓  라우트와 1:1 매핑되는 최상위 페이지 (도메인별 폴더 분리)
```

---

## 👥 사용자 유형

| 유형              | 역할                                                    |
| ----------------- | ------------------------------------------------------- |
| **슈퍼 관리자**   | 전체 서비스 도메인 접근 및 관리자 계정 관리 권한        |
| **서비스 관리자** | 특정 BOX 서비스(투자/커머스/해외/수금/메인) 담당 운영자 |

---

_본 프로젝트는 IBK기업은행 내부 관리자 서비스입니다._
