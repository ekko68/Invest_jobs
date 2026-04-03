### 주의: _본 프로젝트는 IBK기업은행 내부 서비스입니다._

# IBK 투자박스 (IBK BOX Invest) - Frontend

> IBK기업은행의 스타트업 투자 매칭 플랫폼 **투자박스(BOX)** 의 프론트엔드 웹 애플리케이션입니다.  
> 기업(스타트업)과 투자자(VC)를 연결하고, 투자 심사 프로세스를 디지털화하는 서비스를 제공합니다.

---

## 📌 프로젝트 개요

| 항목       | 내용                        |
| ---------- | --------------------------- |
| 프로젝트명 | IBK BOX 투자박스 Frontend   |
| 패키지명   | `ibk-box-invest-front`      |
| 버전       | `0.1.0`                     |
| 프레임워크 | React 17 (CRA 기반)         |
| 스타일     | MUI (Material UI v5) + SCSS |
| 상태관리   | React Context API           |
| 라우팅     | React Router DOM v5         |
| HTTP       | Axios                       |

---

## 🛠 기술 스택

### Core

- **React** `^17.0.2` — UI 컴포넌트 라이브러리
- **react-router-dom** `^5.3.0` — SPA 라우팅 (Code-splitting + Lazy loading)
- **Axios** `^0.21.4` — REST API 통신
- **env-cmd** `^10.1.0` — 환경별 `.env` 파일 관리

### UI / Design

- **@mui/material** `^5.14.15` — Material UI 컴포넌트
- **@mui/icons-material** `^5.14.16` — MUI 아이콘
- **@mui/x-date-pickers** `^6.17.0` — 날짜 선택 컴포넌트
- **@emotion/react** / **@emotion/styled** — MUI 스타일 엔진
- **node-sass** `^6.0.1` — SCSS 컴파일
- **swiper** `^8.4.7` — 슬라이더/캐러셀

### 데이터 & 차트

- **chart.js** `^3.6.2` + **react-chartjs-2** `^4.0.0` — 데이터 시각화
- **chartjs-plugin-datalabels** — 차트 레이블 플러그인

### 날짜 & 유틸리티

- **dayjs** `^1.11.10` / **moment** `^2.29.1` / **date-fns** `^2.28.0` — 날짜 처리
- **jspdf** `^2.5.1` + **html2canvas** `^1.4.1` — PDF 내보내기
- **react-beautiful-dnd** `^13.1.0` — 드래그 앤 드롭
- **react-device-detect** `^2.0.0` — 디바이스 감지 (IE 미지원 처리)

### 개발 도구

- **ESLint** + **Prettier** — 코드 품질 및 포맷팅
- **http-proxy-middleware** `^2.0.1` — 개발 환경 API 프록시
- **Jest** + **@testing-library/react** — 단위 테스트

---

## 📁 프로젝트 구조

```
Box_Front_Invest/
├── public/                        # 정적 자산
│   ├── avatars/                   # 프로필 이미지
│   ├── banners/                   # 배너 이미지
│   └── images/                    # UI 아이콘 및 일반 이미지
│
└── src/
    ├── App.js                     # 앱 루트 (Context Provider 조합)
    ├── Routing.js                 # 최상위 라우터 (Lazy Loading 적용)
    │
    ├── _pub/                      # 공용 컴포넌트 라이브러리
    │   └── components/
    │       ├── atomic/            # 원자 단위 UI (Button, Input, Select, Checkbox 등)
    │       ├── bt/                # BT 커스텀 컴포넌트 (BtModal, BtSelect, BtTabContext 등)
    │       └── common/            # 공통 레이아웃 컴포넌트 (Layout, Footer, Tab 등)
    │
    ├── modules/                   # 비즈니스 로직 모듈
    │   ├── consts/                # 상수 정의
    │   │   ├── Api.js             # REST API 엔드포인트 목록
    │   │   ├── RouterConst.js     # 라우터 경로명 정의
    │   │   ├── BizConst.js        # 비즈니스 상수
    │   │   └── Regex.js           # 정규식 모음
    │   ├── contexts/              # React Context (전역 상태)
    │   │   ├── common/            # 공통: Login, Code, Theme, Localize, Common
    │   │   ├── company/           # 기업 Context
    │   │   ├── invest/            # 투자사 Context
    │   │   ├── consult/           # 컨설팅 Context
    │   │   └── mypage/            # 마이페이지 Context
    │   ├── routers/               # 도메인별 라우터 모듈
    │   │   ├── LoginRouter.js
    │   │   ├── MainRouter.js
    │   │   ├── CompanyRouter.js
    │   │   ├── InvestRouter.js
    │   │   ├── MypageRouter.js
    │   │   ├── IbkPrplCntrRouter.js
    │   │   └── ...
    │   └── utils/                 # 유틸리티 함수
    │       ├── Axios.js / BoxAxios.js / CommonAxios.js
    │       ├── CommonUtils.js / DateUtils.js / NumberUtils.js
    │       ├── ValidateUtils.js / StringUtils.js
    │       └── CookieUtils.js / FormUtils.js ...
    │
    ├── pageComponents/            # 페이지 세부 컴포넌트
    │   └── mypage/
    │       ├── company/           # 기업 마이페이지 컴포넌트
    │       └── investor/          # 투자사 마이페이지 컴포넌트
    │
    └── pages/                     # 페이지 컴포넌트 (라우트 단위)
        ├── main/                  # 메인 홈
        ├── company/               # 기업 목록 / 상세
        ├── invest/                # 투자기관 목록 / 상세
        ├── consult/               # 컨설팅 신청
        ├── event/                 # 이벤트
        ├── customersupport/       # 고객지원 (공지사항, Q&A)
        ├── ba/                    # BA 전용 페이지 (BA10xxx)
        ├── ibkPrplCntr/           # IBK 제안센터
        │   ├── fund/              # 펀드 제안 (Step 1~3)
        │   ├── vncmloan/          # IBK 벤처대출 추천
        │   └── fncnBsns/          # 금융사업 공모
        └── mypage/
            ├── company/           # 기업 마이페이지
            │   ├── ir/            # IR 자료 관리 (기본정보, 재무, 연혁, 주주현황 등)
            │   ├── myinfo/        # 내 정보 (기본정보, 제품, 팀, 영상, 인감)
            │   ├── request/       # 투자심사 요청 (보낸/받은)
            │   ├── nda/           # NDA 체결 관리
            │   ├── message/       # 메시지함
            │   ├── consult/       # 컨설팅 의뢰
            │   └── vncmloan/      # 벤처대출 신청
            └── investor/          # 투자사(VC) 마이페이지
                ├── myinfo/        # 내 정보 (기본정보, 대표심사역, 인감)
                ├── request/       # 투자심사 요청 (보낸/받은)
                ├── nda/           # NDA 체결 관리
                ├── message/       # 메시지함
                └── exclusive/     # 투자사 전용 페이지
```

---

## 🌐 주요 서비스 기능

### 공개 서비스

| 메뉴      | 경로               | 설명                                                 |
| --------- | ------------------ | ---------------------------------------------------- |
| 메인      | `/main`            | 배너, 최신기업, 펀드현황, 투자사 목록                |
| 기업 정보 | `/company`         | 스타트업 목록/상세 (좋아요, 사업문의, 투자심사 요청) |
| 투자기관  | `/invest`          | VC/투자사 목록/상세 (포트폴리오, 대표심사역)         |
| 컨설팅    | `/consult`         | 컨설팅 신청                                          |
| 이벤트    | `/event`           | 이벤트 안내                                          |
| 고객지원  | `/customersupport` | 공지사항, Q&A                                        |

### 기업(스타트업) 마이페이지

| 기능              | 경로                                |
| ----------------- | ----------------------------------- |
| 대시보드          | `/mypage/company`                   |
| 내 정보 관리      | `/mypage/company/info`              |
| IR 자료 관리      | `/mypage/company/ir`                |
| 투자심사 요청     | `/mypage/company/request`           |
| NDA 관리          | `/mypage/company/nda`               |
| 컨설팅 의뢰       | `/mypage/company/consult`           |
| 메시지함          | `/mypage/company/message`           |
| IBK 벤처대출 신청 | `/mypage/company/vncmloan`          |
| 투자사 전환 요청  | `/mypage/company/info/InvmCnvrsReg` |

### 투자사(VC) 마이페이지

| 기능               | 경로                         |
| ------------------ | ---------------------------- |
| 대시보드           | `/mypage/investor`           |
| 내 정보 관리       | `/mypage/investor/info`      |
| 투자심사 요청      | `/mypage/investor/request`   |
| NDA 관리           | `/mypage/investor/nda`       |
| 메시지함           | `/mypage/investor/message`   |
| 투자사 전용 페이지 | `/mypage/investor/exclusive` |

### IBK 제안센터 (인터널)

| 기능              | 경로                                         |
| ----------------- | -------------------------------------------- |
| 제안센터 메인     | `/ibkPrplCntr/IbkPrplCntr`                   |
| 펀드 제안 등록    | `/ibkPrplCntr/fund/FundPrplInfoStep`         |
| 투자기업 추천     | `/ibkPrplCntr/PrplCmWriteView`               |
| IBK 벤처대출 추천 | `/ibkPrplCntr/vncmloan/VnentrLonSgshRegView` |
| 금융사업 공모     | `/ibkPrplCntr/fncnBsns/FncnBsnsPbanList`     |

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
App.js → CommonProvider (contexts 배열 순서 중요)
  ├─ CompanyProvider
  ├─ ThemeComProvider
  ├─ LocalizeProvider
  ├─ CommonContextProvider   ← 반드시 LoginContext 이전 초기화
  ├─ LoginContextProvider
  └─ CodeContextProvider
```

### 2. Lazy Loading 라우터

모든 라우터 모듈은 `React.lazy()`로 코드 분할되어, 첫 로딩 성능 최적화가 적용되어 있습니다.

### 3. 개발 환경 API 프록시

`setupProxy.js`에서 기상청 API(`apis.data.go.kr`) 크로스도메인 프록시 설정이 구성되어 있습니다.

### 4. IE 브라우저 미지원

`react-device-detect`를 통해 IE 접속 시 미지원 안내 메시지를 표시하고 서비스를 차단합니다.

### 5. SSL 인증서

`_wildcard.ibkbox.net+2.pem` / `_wildcard.ibkbox.net+2-key.pem` 파일이 프로젝트 루트에 포함되어 있습니다. (로컬 HTTPS 개발용)

---

## 📂 컴포넌트 설계 계층

```
Atomic Components (_pub/components/atomic/)
    ↓  원자 단위 UI 요소 (Button, Input, Select, Checkbox...)
BT Custom Components (_pub/components/bt/)
    ↓  프로젝트 커스텀 복합 컴포넌트 (BtModal, BtSelect, BtTabContext...)
Common Layout Components (_pub/components/common/)
    ↓  공통 레이아웃 (Layout, Footer, Tab, Loading...)
Page Components (pageComponents/)
    ↓  특정 페이지 전용 복합 컴포넌트
Pages (pages/)
    ↓  라우트와 1:1 매핑되는 최상위 페이지
```

---

## 🔌 외부 연동

| 서비스                               | 용도                                    |
| ------------------------------------ | --------------------------------------- |
| IBK 공통 로그인 (`commonLogin.html`) | SSO 연동 로그인                         |
| NICE 스크래핑                        | 간편서류 자동 수집                      |
| INFOTECH 스크래핑                    | 인증키 발급                             |
| KIPRIS                               | 특허/상표/디자인 지적재산권 조회        |
| 기상청 공공 API                      | 날씨 정보 (프록시 연동)                 |
| IBK 영업점 시스템                    | 영업점/직원 조회 (`/cmi012`, `/cao002`) |

---

## 👥 사용자 유형

| 유형                      | 역할                                  |
| ------------------------- | ------------------------------------- |
| **기업 (Company)**        | 스타트업 / 투자 유치 희망 기업        |
| **투자사 (VC/Investor)**  | 벤처캐피탈 / 투자기관                 |
| **BA (Business Advisor)** | IBK 내부 담당자 (BA10xxx 전용 페이지) |

---

## 부가 설명

# 실행

- npm install : package.json 설치
- npm run start : 개발버전 실행
- npm run build : 개발버전 빌드
- npm run build-prod : 배포버전 빌드

# 폴더 설명

- pages : 화면 목록
- assets : 이미지, css 등
- layouts : 화면 레이아웃
- modules : routers, context 등 중요 모듈

# 주요 npm

- helmet : SEO시 사용
- react-router-dom : router 사용
- http-proxy-middleware : cors와 같이 사용
- cors : cors사용
- env-cmd : .env 파일 포함 빌드를 위해 사용
- useHistory : history.push를 위해 사용
- react-device-detect : IE체크
- moment : 날짜 포멧
- react-app-polyfill : ES6 IE호환 설정
- core-js : ES6 IE호환 설정
- regenerator-runtime : ES6 IE호환 설정
- axios : 비동기 작업 처리

# 주요 공통 설정

- IE체크
- 상대경로 설정 : jscofing.json
- url 공통파일 관리
- 기본 로딩바
- notFound 페이지 설정
- ES6문법 IE호환 적용

# 주요 예제

- contextapi 예제
- 외부 스크립트 사용 예제
- img src 설정 예제
- checkbox 전체체크 예제
- 여러개 컴포넌트 동시 사용하기

# .env 설명

- REACT_APP_API_URL : backend 호출 url
- PORT : front 실행 PORT 설정

# 실행 오류시

1. npm start가 동작이 안하는 경우 node_modules의 캐시폴더 삭제 후 실행
2. npm install 다시 실행

# HTTPS 설정

## (chrome 브라우저 업데이트 후 https 로 실행되어야 함)

1. 참고 URL : https://github-wiki-see.page/m/dltmdrbtjd/HANG/wiki/local-https-%ED%99%98%EA%B2%BD%EC%84%A4%EC%A0%95
2. chocolatey 설치
3. choco install mkcert 명령어 실행
4. 관리자 모드 PowerShell 프로그램 실행해서 SSL 인증서 생성하기
5. 아래 명령어 실행

- mkcert -install
- mkcert \*.ibkbox.net 127.0.0.1 ::1

6. env 파일에 아래 내용 추가

- HTTPS=true
- SSL_CRT_FILE=\_wildcard.ibkbox.net+2.pem
- SSL_KEY_FILE=\_wildcard.ibkbox.net+2-key.pem
  _본 프로젝트는 IBK기업은행 내부 서비스입니다._
